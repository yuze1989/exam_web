<template>
  <el-upload
    ref="upload"
    list-type="picture-card"
    action
    :before-upload="beforeUpload"
    :file-list="imageList"
    :multiple="false"
    :http-request="uploadImg"
    :on-change="handleUploadChange"
    :on-remove="detel"
  >
    <i class="el-icon-plus"></i>
    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件{{ tips }}</div>
  </el-upload>
</template>

<script>
export default {
  name: "LocalUpload",
  props: {
    image: {
      type: Array,
      default: () => {
        return [];
      },
    },
    num: {
      type: Number,
      default: 0,
    },
    tips: {
      type: String,
      default: "",
    },
    isCheckSize: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      type: "",
      imageList: [],
      ossMess: {},
      list: [],
    };
  },
  watch: {
    image(n, o) {
      this.imageList = [];
      n.forEach((element) => {
        if (element && element.url) {
          this.imageList.push(element);
        }
      });
    },
    num(n, o) {
      this.num = n;
    },
  },
  created() {
    this.$on("clear", (params) => {
      this.list = [];
    });
    this.imageList = [];
    this.image.forEach((element) => {
      this.imageList.push(element);
    });
  },
  methods: {
    beforeUpload(file) {
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        this.$message.error("上传图片只能是 JPG/PNG 格式!");
        this.imageList = [];
        return false;
      }
      if (file.type == "image/jpeg") {
        this.type = "image/jpg";
      } else {
        this.type = file.type;
      }
    },
    handleUploadChange(file, fileList) {
      this.imageList = fileList.slice(-1);
    },
    detel() {
      // if (this.list.length > 0) {
      //   this.$axios
      //     .post("art/tool/ossDeleteFile", { url: this.list[0] })
      //     .then((res) => {
      //       this.list = [];
      //     });
      // }
    },
    async uploadImg(item) {
      const OSS = require("ali-oss");
      this.$axios.post("art/tool/ossAppConfig", {}).then((res) => {
        if (parseInt(res.code) === 0) {
          this.ossMess = res.data;
          const client = new OSS({
            // region: "oss-cn-hangzhou",
            endpoint: this.ossMess.endpoint,
            accessKeyId: this.ossMess.AccessKeyId,
            accessKeySecret: this.ossMess.AccessKeySecret,
            stsToken: this.ossMess.SecurityToken,
            bucket: this.ossMess.bucket,
            expiration: this.ossMess.Expiration,
            contentType: this.type,
          });

          const filename = new Date().valueOf(); //Date.parse(new Date());
          const fileExt = item.file.name.toLowerCase().split(".").splice(-1);
          const newFilename =
            res.data.dir +
            filename +
            "-" +
            Math.floor(Math.random() * Math.floor(999999)) +
            "." +
            fileExt[0];
          const result = client.put(newFilename, item.file).then((res) => {
            let url = this.ossMess.host.replace(this.ossMess.dir, "");
            res.url = res.url.replace(
              "http://trainfiles.oss-cn-hangzhou.aliyuncs.com/",
              url
            );
            res.url = res.url.replace('https://trainfiles.oss-cn-hangzhou.aliyuncs.com/',url)
            this.$emit("upload", { url: res.url, index: this.num });
            this.list.push(res.url);
            // if (this.list.length > 1) {
            //   this.$axios
            //     .post("art/tool/ossDeleteFile", { url: this.list[0] })
            //     .then((res) => {
            //       this.list = this.list.slice(-1);
            //     });
            // }
          });
          // return result.url;
        }
      });
    },
  },
};
</script>

<style>
.el-upload-list__item {
  transition: none !important;
}
</style>
