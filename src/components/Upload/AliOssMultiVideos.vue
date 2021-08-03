
<template>
  <!-- 单个视频上传 -->
  <el-upload
    ref="upload"
    v-loading="isLoading"
    element-loading-text="正在上传中"
    list-type="picture-card"
    :multiple="true"
    :file-list="imageList"
    :before-upload="beforeUpload"
    :http-request="uploadImg"
    :on-change="handleUploadChange"
    action
    accept=".mp4"
  >
    <i class="el-icon-plus"></i>
    <div slot="tip" class="el-upload__tip">
      视频文件建议100M以内,只支持 mp4 文件
    </div>
  </el-upload>
</template>

<script>
export default {
  name: "AliOssMultiVideos",
  props: {
    limit: {
      type: Number,
      default: 3,
    },
    image: {
      type: Array,
      default() {
        return [];
      },
    },
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    isCheckSize: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      imageList: [],
      imageKeyList: [],
      size: 0,
      time: 0,
      isLoading: false,
      list: [],
      type: "",
    };
  },
  watch: {
    image(val) {
      this.imageList = val;
      this.imageKeyList = val;
    },
  },
  created() {
    this.$on("clear", (params) => {
      this.list = [];
    });
    this.imageList = [];
    this.imageKeyList = [];
    this.imageList.push(...this.image);
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
        console.log("ret" + JSON.stringify(ret));
        const isLt2M = file.size / 1024 / 1024 < 100;
        let extension = file.name
          .substring(file.name.lastIndexOf(".") + 1)
          .toLowerCase();
        if (ret) {
          reject();
        } else if (!isLt2M) {
          this.$message.error("上传文件大小不能超过 100MB!");
          reject();
        } else {
          if (extension.indexOf("mp4") !== -1) {
            this.size = file.size;
            var url = URL.createObjectURL(file);
            var audioElement = new Audio(url);
            audioElement.addEventListener("loadedmetadata", (_event) => {
              this.time = Math.ceil(audioElement.duration);
            });
            this.isLoading = true;
            resolve(file);
          } else {
            this.$message.error("已过滤类型不符文件");
            reject();
          }
        }
      });
      /*this.size = (file.size / 1024 / 1024).toFixed(2);*/
      // this.size = file.size;
      // var url = URL.createObjectURL(file);
      // var audioElement = new Audio(url);
      // audioElement.addEventListener("loadedmetadata", (_event) => {
      //   this.time = Math.ceil(audioElement.duration);
      // });
      // this.isLoading = true;
    },
    handleUploadChange(file, fileList) {
      this.imageList = fileList.slice(-1);
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
            endpoint: res.data.endpoint,
            accessKeyId: res.data.AccessKeyId,
            accessKeySecret: res.data.AccessKeySecret,
            stsToken: res.data.SecurityToken,
            bucket: res.data.bucket,
            expiration: res.data.Expiration,
            contentType: "video/mp4",
            timeout: 120000,
          });

          console.log("传图开始：" + 120000);

          const filename = new Date().valueOf(); //Date.parse(new Date());
          const fileExt = item.file.name.toLowerCase().split(".").splice(-1);
          const newFilename =
            res.data.dir +
            filename +
            "-" +
            Math.floor(Math.random() * Math.floor(999999)) +
            "." +
            fileExt[0];
          // console.log("newFilename"+newFilename)
          client.put(newFilename, item.file).then((res) => {
            console.log("uploadvideo res:" + JSON.stringify(res));
            console.log("传图完成：" + 120000);
            let url = this.ossMess.host.replace(this.ossMess.dir, "");
            res.url = res.url.replace(
              "http://trainfiles.oss-cn-hangzhou.aliyuncs.com/",
              url
            );
            res.url = res.url.replace(
              "https://trainfiles.oss-cn-hangzhou.aliyuncs.com/",
              url
            );

            // this.isLoading = false;
            // this.imageList = [{ url: "" }];
            // this.$emit("input", {
            //   url: res.url,
            //   size: this.size,
            //   img: "",
            //   timeLenght: this.time,
            //   title: item.file.name,
            // });
            // this.list.push(res.url);
            this.$axios
              .post("art/tool/ossVideoCoverImg", { url: res.url })
              .then((response) => {
                if (parseInt(response.code) === 0) {
                  this.isLoading = false;
                  this.imageList = [{ url: response.data }];
                  this.$emit("input", {
                    url: res.url,
                    size: this.size,
                    img: response.data,
                    timeLenght: this.time,
                    title: item.file.name,
                  });
                  this.list.push(res.url);
                }
              });
          });
        }
      });
    },
  },
};
</script>

<style>
</style>
