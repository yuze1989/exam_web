<template>
  <el-upload
    list-type="picture-card"
    name="image"
    :multiple="true"
    :file-list="imageList"
    :before-upload="beforeUpload"
    :http-request="uploadImg"
    action
    :on-remove="onUploadRemove"
    accept=".jpg,.jpeg,.png,.gif,.bmp"
  >
    <i class="el-icon-plus"></i>
    <div slot="tip" class="el-upload__tip">
      只支持 .jpg,.jpeg,.png,.gif,.bmp文件
      <el-button type="primary" @click="submit">上传图片</el-button>
    </div>
  </el-upload>
</template>

<script>
export default {
  name: "AliOssMultiUpload",
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
      type: "",
    };
  },
  watch: {
    image(val) {
      this.imageList = val;
    },
  },
  created() {
    this.imageList = [];
    this.imageKeyList = [];
    // this.imageList.push(...this.image);
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
    submit() {
      this.$emit("input", this.imageKeyList);
      this.$nextTick(() => {
        this.imageKeyList = [];
        this.imageList = [];
      });
    },
    beforeUpload(file) {
      return new Promise(async (resolve, reject) => {
        let ret = this.isCheckSize && !(await this.checkUploadSize(file));
        let extension = file.name
          .substring(file.name.lastIndexOf(".") + 1)
          .toLowerCase();
        console.log("ret" + JSON.stringify(ret));
        if (ret) {
          reject();
        } else if (
          extension.indexOf("jpg") != -1 ||
          extension.indexOf("jpeg") != -1 ||
          extension.indexOf("png") != -1 ||
          extension.indexOf("gif") != -1 ||
          extension.indexOf("bmp") != -1
        ) {
          this.type = "image/jpg";
          resolve(file);
        } else {
          this.$message.error("已过滤类型不符文件");
          reject();
        }
      });
      // if (file.type !== "image/jpeg" && file.type !== "image/png") {
      //   this.$message.error("上传图片只能是 JPG/PNG 格式!");
      //   return false;
      // }
      // if (file.type == "image/jpeg") {
      //   this.type = "image/jpg";
      // } else {
      //   this.type = file.type;
      // }

      // return true;
    },
    originImgUrl(url) {
      return url + "?x-oss-process=image/auto-orient,1";
    },

    onUploadRemove(file, fileList) {
      this.imageList = fileList;
      this.imageKeyList = fileList;
      // this.$axios
      //   .post("art/tool/ossDeleteFile", { url: file.url })
      //   .then((res) => {});
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

          client.put(newFilename, item.file).then((res) => {
            let url = this.ossMess.host.replace(this.ossMess.dir, "");
            res.url = res.url.replace(
              "http://trainfiles.oss-cn-hangzhou.aliyuncs.com/",
              url
            );
            res.url = res.url.replace('https://trainfiles.oss-cn-hangzhou.aliyuncs.com/',url)
            this.imageList.push({
              url: this.originImgUrl(res.url),
            });
            this.imageKeyList.push({
              url: res.url,
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
