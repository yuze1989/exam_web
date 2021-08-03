<template>
  <div class="aliMultiUpload">
    <el-upload
      v-loading="isLoading"
      list-type="picture-card"
      element-loading-text="正在上传中"
      name="image"
      :multiple="true"
      :file-list="imageList"
      :before-upload="beforeUpload"
      :http-request="uploadImg"
      action
      :on-remove="onUploadRemove"
      :on-success="handleSuccess"
      :limit="20"
      :on-exceed="fileExceed"
      :class="{ uoloadSty: filesCount < 20, disUoloadSty: filesCount > 19 }"
    >
      <i class="el-icon-plus"></i>

      <div slot="tip" class="el-upload__tip">
        建议每次上传同类型的文件,每次上传文件数量不超过20个,单个视频文件建议在3分钟以内
        <!-- <el-button type="primary" @click="submit">上传文件</el-button> -->
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "AliMultiUpload",
  props: {
    limit: {
      type: Number,
      default: 20,
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
      type: "",
      filesCount: 0,
      isLoading: false,
    };
  },
  watch: {
    image(val) {
      this.imageList = val;
      this.imageKeyList = val;
    },
  },
  created() {
    this.imageList = [];
    this.imageKeyList = [];
    // this.imageList.push(...this.image);
  },
  methods: {
    submit() {
      //console.log("submit")
      this.$emit("input", this.imageKeyList);
      this.filesCount = 0;
      this.$nextTick(() => {
        this.imageKeyList = [];
        this.imageList = [];
      });
    },

    fileExceed() {
      this.$message.error("最多只能上传20个文件");
    },

    fileType(filePath) {
      //获取最后一个.的位置
      //var index= filePath.lastIndexOf(".");
      //获取后缀
      //var ext = filePath.substr(index+1);
      var ext = filePath;
      //let ext = filePath.substring(filePath.lastIndexOf('.')+1)

      //判断是否是视频类型
      if (
        ["mp4", "avi", "mov", "rmvb", "rm", "flv", "3gp", "webm"].indexOf(
          ext.toLowerCase()
        ) != -1
      ) {
        return "video";
      }
      //判断是否是图片类型
      if (
        [
          "png",
          "jpg",
          "jpeg",
          "bmp",
          "gif",
          "webp",
          "psd",
          "svg",
          "tiff",
        ].indexOf(ext.toLowerCase()) != -1
      ) {
        return "image";
      }
      //判断是否是音频类型
      if (
        ["cda", "wav", "mp3", "wmv", "flac", "aac"].indexOf(
          ext.toLowerCase()
        ) != -1
      ) {
        return "audio";
      }
      return "otherType";
    },

    handleSuccess(response, file, fileList) {
      //this.isLoading = false;
      console.log("handleSuccess ========" + fileList);
    },

    beforeUpload(file) {
      //   if (file.type !== "image/jpeg" && file.type !== "image/png") {
      //     this.$message.error("上传图片只能是 JPG/PNG 格式!");
      //     return false;
      //   }
      //   if (file.type == "image/jpeg") {
      //     this.type = "image/jpg";
      //   } else {
      //     this.type = file.type;
      //   }

      //   let isSameFileType = this.isSameFile(file.type)
      //   if(isSameFileType){
      //       return true
      //   }else{
      //       this.$message.error("上传的文件类型必须和前面一致");
      //       return false
      //   }

      if (file.type == "image/jpeg") {
        this.type = "image/jpg";
      } else {
        this.type = file.type;
      }
      console.log("beforeUpload ========" + file);
      this.filesCount++;
      this.isLoading = true;
      return true;
    },
    originImgUrl(url) {
      return url + "?x-oss-process=image/auto-orient,1";
    },

    isSameFile(flieType) {
      let isSame = true;
      let flieType1 = this.fileType(flieType);
      this.imageKeyList.forEach((item, index) => {
        let testmsg = item.substring(item.lastIndexOf(".") + 1);
        let flieType2 = this.fileType(testmsg);
        if (flieType1 == flieType2) {
          isSame = true;
        } else {
          isSame = false;
        }
      });

      return isSame;
    },

    onUploadRemove(file, fileList) {
      this.imageList = new Array(...fileList);
      this.imageKeyList = new Array(...fileList);
      this.filesCount = this.imageList.length;
      // this.$axios
      //   .post("art/tool/ossDeleteFile", { url: file.url })
      //   .then((res) => {
      //     console.log(res);
      //   });
    },
    uploadImg(item) {
      console.log(item);
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
            contentType: item.file.type,
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

          client.put(newFilename, item.file).then((res) => {
            let url = this.ossMess.host.replace(this.ossMess.dir, "");
            res.url = res.url.replace(
              "http://trainfiles.oss-cn-hangzhou.aliyuncs.com/",
              url
            );
            res.url = res.url.replace('https://trainfiles.oss-cn-hangzhou.aliyuncs.com/',url)
            this.imageList.push({
              url: res.url,
              size: item.file.size,
              name: item.file.name,
            });
            this.imageKeyList.push({
              url: res.url,
              size: item.file.size,
              name: item.file.name,
            });
            if (this.imageList.length == this.filesCount) {
              this.isLoading = false;
              //  this.$emit("inputLoad", this.imageKeyList);
              //   this.$nextTick(() => {
              //     this.imageKeyList = [];
              //     this.imageList = [];
              //   });
            }
          });
        } else {
          this.isLoading = false;
        }
      });
    },
  },
};
</script>

<style>
.aliMultiUpload .el-upload-list--picture-card .el-upload-list__item {
  width: 70px;
  height: 70px;
}
.aliMultiUpload .el-upload--picture-card {
  width: 70px;
  height: 70px;
  line-height: 70px;
}

.aliMultiUpload .uoloadSty .el-upload--picture-card {
  width: 70px;
  height: 70px;
  line-height: 70px;
}
.aliMultiUpload .disUoloadSty .el-upload--picture-card {
  display: none; /* 上传按钮隐藏 */
}
</style>

<style scoped>
.aliMultiUpload {
  width: 100%;
  height: 100%;
}
</style>
