<template>
  <!-- <el-upload
    name="file"
    action="/upload"
    list-type="picture-card"
    :file-list="imageList"
    :before-upload="beforeUpload"
    :on-success="onUploadSuccess"
    :on-change="handleChange"
    :http-request="uploadImg"
    show-file-list
    class="upload-demo"
  >
    <el-button size="small" type="primary">点击上传</el-button>
    <div class="el-upload__tip" slot="tip">只支持 jpg/png 文件，大小最大为 10M</div>
  </el-upload>-->

  <div class="aliOssUpload">
    <el-upload
      v-loading="isLoading"
      element-loading-text="正在上传中"
      ref="upload"
      action
      :before-upload="beforeUpload"
      :file-list="imageList"
      :multiple="false"
      :http-request="uploadImg"
      :on-change="handleUploadChange"
      :list-type="listType"
      :on-remove="remove"
      accept=".pptx,.ppt,.docx,.doc,.xlsx,.xls,.pdf"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到ke</el-button> -->
      <div slot="tip" class="el-upload__tip">
        只能上传.pptx,.ppt,.docx,.doc,.xlsx,.xls,.pdf文件，文件最大不超过100MB
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "AliOssUploadFiles",
  props: {
    listType: {
      type: String,
      default: "text",
    },
    image: {
      type: Array,
      default: () => {
        return [];
      },
    },
    isCheckSize: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    image(o, val) {
      this.imageList = val;
    },
  },
  data() {
    return {
      type: "img",
      imageList: [],
      ossMess: {},
      isLoading: false,
      list: [],
      fileType: "",
    };
  },
  created() {
    this.$on("clear", (params) => {
      this.list = [];
    });
  },
  methods: {
    async checkUploadSize(file) {
      let fileSize = Math.floor(file.size / 1024);
      if (fileSize <= 0) {
        fileSize = 1;
      }
      let ret = await this.$axios.get(
        this.API.newNetSchool.material.checkUploadSize,
        {
          params: {
            size: fileSize,
          },
        }
      );

      return ret;
    },
    beforeUpload(file) {
      return new Promise(async (resolve, reject) => {
        let ret = this.isCheckSize && !(await this.checkUploadSize(file));
        //console.log("ret" + JSON.stringify(ret));
        const isLt2M = file.size / 1024 / 1024 < 100;

        let extension = file.name
          .substring(file.name.lastIndexOf(".") + 1)
          .toLowerCase();
        //alert(extension);

        if (ret) {
          reject();
        } else {
          //.pptx,.ppt,.docx,.doc,.xlsx,.xls,.pdf
          if (!isLt2M) {
            this.$message.error("上传文件大小不能超过 100MB!");
            reject();
          } else if (
            extension.indexOf("pptx") != -1 ||
            extension.indexOf("ppt") != -1 ||
            extension.indexOf("docx") != -1 ||
            extension.indexOf("doc") != -1 ||
            extension.indexOf("xlsx") != -1 ||
            extension.indexOf("pdf") != -1 ||
            extension.indexOf("xls") != -1
          ) {
            this.type = "file";
            this.isLoading = true;
            resolve(file);
          } else {
            this.$message.error("已过滤类型不符文件");
            reject();
          }

          // if (file.type == "image/jpeg") {
          //   this.fileType = "image/jpg";
          // } else {
          //   this.fileType = file.type;
          // }

          // if (file.type.indexOf("image") !== -1) {
          //   this.type = "img";
          // } else if (file.type.indexOf("video") !== -1) {
          //   this.type = "video";
          // } else if (file.type.indexOf("audio") !== -1) {
          //   this.type = "audio";
          // } else {
          //   this.type = "file";
          // }
        }
      });
    },
    handleUploadChange(file, fileList) {
      this.imageList = fileList.slice(-1);
    },
    remove() {
      this.$emit("update", {
        url: "",
        fileType: "",
      });
    },
    clearFiles() {
      this.$refs.upload.clearFiles();
      this.isLoading = false;
    },
    uploadImg(item) {
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
            contentType: this.fileType,
            timeout: 120000,
          });

          const filename = new Date().valueOf(); //Date.parse(new Date());
          const fileExt = item.file.name.toLowerCase().split(".").splice(-1);
          const coName =
            filename +
            "-" +
            Math.floor(Math.random() * Math.floor(999999)) +
            "." +
            fileExt[0];
          const newFilename = res.data.dir + coName;

          client.put(newFilename, item.file).then((res) => {
            let url = this.ossMess.host.replace(this.ossMess.dir, "");
            res.url = res.url.replace(
              "http://trainfiles.oss-cn-hangzhou.aliyuncs.com/",
              url
            );
            res.url = res.url.replace(
              "https://trainfiles.oss-cn-hangzhou.aliyuncs.com/",
              url
            );
            this.$emit("update", {
              //   url: this.ossMess.host + coName,
              //   fileType: this.type,
              size: item.file.size,
              name: item.file.name,
              url: res.url,
            });
            this.list.push(res.url);
            // if (this.list.length > 1) {
            //   this.$axios
            //     .post("art/tool/ossDeleteFile", { url: this.list[0] })
            //     .then((res) => {
            //       this.list = this.list.slice(-1);
            //     });
            // }
            this.isLoading = false;
          });
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

<style scoped>
.aliOssUpload {
  width: 100%;
  height: 100%;
}
</style>
