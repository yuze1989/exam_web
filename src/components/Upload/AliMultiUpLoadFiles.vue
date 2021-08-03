<template>
  <div class="aliOssUpload">
    <el-upload
      v-loading="isLoading"
      element-loading-text="正在上传中"
      ref="upload"
      action
      :before-upload="beforeUpload"
      :file-list="imageList"
      :multiple="true"
      :http-request="uploadImg"
      :on-change="handleUploadChange"
      :list-type="listType"
      :on-remove="handleRemove"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到ke</el-button> -->
      <div slot="tip" class="el-upload__tip">最多添加20个文件</div>
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
      console.log("watch" + JSON.stringify(o));
      this.imageList = o;
      this.list = [...o];
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
      console.log("file" + file);
      return new Promise(async (resolve, reject) => {
        let ret = this.isCheckSize && !(await this.checkUploadSize(file));
        console.log("ret" + JSON.stringify(ret));
        if (ret) {
          reject();
        } else {
          this.type = "file";
          this.isLoading = true;
          resolve(file);
        }
      });
    },
    submit() {
      this.$emit("update", this.list);
    },
    handleUploadChange(file, fileList) {
      console.log("handleUploadChange", JSON.stringify(fileList));
    },
    handleRemove(file, fileList) {
      console.log("handleRemove", JSON.stringify(fileList));
      let files = [];
      this.list.forEach((item) => {
        if (item.url != file.url) {
          files.push({ ...item });
        }
      });
      this.list = files;
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
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
            res.url = res.url.replace('https://trainfiles.oss-cn-hangzhou.aliyuncs.com/',url)
            console.log("res" + res);
            this.list.push({
              size: item.file.size,
              name: item.file.name,
              url: res.url,
            });

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
