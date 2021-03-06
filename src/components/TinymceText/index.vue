<template>
  <div
    :class="{ fullscreen: fullscreen }"
    class="tinymce-container"
    :style="{ width: containerWidth }"
  >
    <div class="editor-custom-btn-container">
      <!-- <editorImage
        color="#1890ff"
        class="editor-upload-btn"
        @successCBK="imageSuccessCBK"
        :isCheckSize="isCheckSize"
      /> -->
    </div>
    <textarea :id="tinymceId" class="tinymce-textarea" />
  </div>
</template>

<script>
import editorImage from "./components/EditorImage.vue";
import plugins from "./plugins";
import toolbar from "./toolbar";
import load from "./dynamicLoadScript";

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
const tinymceCDN =
  "https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.5/tinymce.min.js";

export default {
  name: "Tinymce",
  components: { editorImage },
  props: {
    id: {
      type: String,
      default: () => {
        return (
          "vue-tinymce-" +
          +new Date() +
          ((Math.random() * 1000).toFixed(0) + "")
        );
      },
    },
    isCheckSize: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: "",
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    menubar: {
      type: String,
      default: "", //"file edit insert view format table",
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360,
    },
    width: {
      type: [Number, String],
      required: false,
      default: "auto",
    },
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      languageTypeList: {
        en: "en",
        zh: "zh_CN",
        es: "es_MX",
        ja: "ja",
      },
    };
  },
  computed: {
    containerWidth() {
      // const width = this.width;
      // if (/^[\d]+(\.[\d]+)?$/.test(width)) {
      //   // matches `100`, `'100'`
      //   return `${width}px`;
      // }
      return '500px';
    },
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        // this.$nextTick(() =>
        window.tinymce.get(this.tinymceId).setContent(val || "");

        // );
      }
        // var str = window.tinymce.activeEditor.getContent(); 
        // // num是用正则获取到的纯文本内容（包括标点符号）,正则函数方法写在下方
        // var num = this.removeHTMLTag(str);
        // if (num.length > 3000) {
        //   this.$confirm('字符已超出上限，请修改后重新输入！', '提示', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     type: 'warning'
        //   });
        // }
    },
  },
  created() {
    this.$on("desc", (params) => {
      window.tinymce.get(this.tinymceId).setContent(params);
    });
  },
  mounted() {
    this.init();
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce();
    }
  },
  deactivated() {
    this.destroyTinymce();
  },
  destroyed() {
    this.destroyTinymce();
  },
  methods: {
    init() {
      // dynamic load tinymce from cdn
      load(tinymceCDN, (err) => {
        if (err) {
          this.$message.error(err.message);
          return;
        }
        this.initTinymce();
      });
    },
    initTinymce() {
      const _this = this;
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        language: "zh_CN",
        height: this.height,
        body_class: "panel-body",
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        content_css: "./content.css",
        content_style: "img{max-width:100%}",
        fontsize_formats: "8pt 10pt 11pt 12pt 14pt 18pt 24pt", // 第二步
        end_container_on_empty_block: true,
        powerpaste_word_import: "clean",
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: "square",
        advlist_number_styles: "default",
        default_link_target: "_blank",
        automatic_uploads:false,
        images_upload_handler: (blobInfo, success, failure) => {
          this.handleImgUpload(blobInfo, success, failure)
        },
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: (editor) => {
          if (_this.value) {
            editor.setContent(_this.value);
          }
          _this.hasInit = true;
          editor.on("NodeChange Change KeyUp SetContent", () => {
            this.hasChange = true;
            this.$emit("input", editor.getContent());
          });
        },
        setup(editor) {
          editor.on("FullscreenStateChanged", (e) => {
            _this.fullscreen = e.state;
          });
        },
      });
    },
    // 上传本地 图片执行事件
    handleImgUpload(blobInfo, success, failure) {
      let formdata = new FormData()
      // append 方法中的第一个参数就是 我们要上传文件 在后台接收的文件名
      // 这个值要根据后台来定义
      // 第二个参数是我们上传的文件
      formdata.append('file', blobInfo.blob())
      console.log(formdata)
      // axios 定义上传方法
      this.$axios.post("/file/upload",formdata).then(res => {
        if (res.code != 200) {
          // 上传失败执行此方法，将失败信息填入参数中
          failure('HTTP Error: ' + res.message);
          return
        }
        // 上传成功之后，将对应完整的图片路径拼接在success的参数中
        success(res.result);
      })
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId);
      if (this.fullscreen) {
        tinymce.execCommand("mceFullScreen");
      }

      if (tinymce) {
        tinymce.destroy();
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value);
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent();
    },
    imageSuccessCBK(arr) {
      const _this = this;
      arr.forEach((v) => {
        window.tinymce
          .get(_this.tinymceId)
          .insertContent(`<img class="wscnph" src="${v.url}" >`);
      });
    },
  },
};
</script>

<style  scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
  text-align: right;
}

.tinymce-container >>> .mce-fullscreen {
  z-index: 10000;
}

.tinymce-container >>> .mce-panel {
  border: none;
}

.tinymce-container >>> .mce-branding {
  display: none;
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
  margin-top: 35px;
}
.tinymce-container >>> .panel-body img {
  width: 100%;
}
.tinymce-container >>> .panel-body .wscnph {
  width: 100%;
}
.mce-menubtn.mce-fixed-width span {
  width: auto !important;
}
</style>
<style lang="scss" scoped>
::v-deep .el-form-item .el-form-item {
  margin-bottom: 22px;
}
</style>
