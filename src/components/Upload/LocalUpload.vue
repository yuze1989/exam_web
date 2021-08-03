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
    <!-- <el-button v-else size="small" type="primary">点击上传</el-button> -->
    <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到ke</el-button> -->
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
    tips(n, o) {
      this.tips = n;
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
      this.$emit("upload", "");
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
      this.$axios.post("art/tool/ossAppConfig").then((res) => {
        if (parseInt(res.code) === 0) {
          this.ossMess = res.data;
          const client = new OSS({
            // region: "oss-cn-hangzhou",
            endpoint: res.data.endpoint,
            accessKeyId: res.data.AccessKeyId,
            accessKeySecret: res.data.AccessKeySecret,
            stsToken: res.data.SecurityToken,
            bucket: res.data.bucket,
            expiration: res.data.Expiration,
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
            res.url = res.url.replace(
              "https://trainfiles.oss-cn-hangzhou.aliyuncs.com/",
              url
            );
            this.list.push(res.url);
            this.$emit("upload", res.url);
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
    getType(file) {
      var filename = file;
      var index1 = filename.lastIndexOf(".");
      var index2 = filename.length;
      var type = filename.substring(index1, index2);
      return type;
    },
  },
};
</script>

<style>
.el-upload-list__item {
  transition: none !important;
}
</style>
