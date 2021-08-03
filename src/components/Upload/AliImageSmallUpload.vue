<template>
  <el-upload
    ref="upload"
    class="avatar-uploader"
    :show-file-list="false"
    action
    :before-upload="beforeUpload"
    :multiple="false"
    :http-request="uploadImg"
    :on-remove="detel"
    accept=".jpg,.jpeg,.png,.gif,.bmp"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    <div slot="tip" class="el-upload__tip">
      <p class="ds-2 lh-1">点击上传，只能上传.jpg,.jpeg,.png,.gif,.bmp文件{{ tips }}</p>
    </div>
  </el-upload>
</template>

<script>
import { Loading } from "element-ui";
import fileUtil from "@/utils/fileUtil";
export default {
  name: "LocalUpload",
  props: {
    configUrl: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
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
    };
  },

  created() {},
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
        let extension = file.name
          .substring(file.name.lastIndexOf(".") + 1)
          .toLowerCase();
        console.log("ret" + JSON.stringify(ret));
        if (ret) {
          reject();
        } else if (
          extension.indexOf("jpg") !== -1 ||
          extension.indexOf("jpeg") !== -1 ||
          extension.indexOf("png") !== -1 ||
          extension.indexOf("gif") !== -1 ||
          extension.indexOf("bmp") !== -1
        ) {
          this.type = "image/jpg";
          resolve(file);
        } else {
          this.$message.error("已过滤类型不符文件");
          reject();
        }
      });
    },
    // handleAvatarSuccess(res, file) {
    //   this.$emit('update:imageUrl',URL.createObjectURL(file.raw))
    // },

    originImgUrl(url) {
      return url + "?x-oss-process=image/auto-orient,1";
    },

    detel() {
      this.$emit("update:imageUrl", "");
    },
    async uploadImg(item) {
      const loading = this.$loading({
        lock: true,
        text: "图片上传中,请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      const OSS = require("ali-oss");
      this.$axios
        .get(this.configUrl, { params: { type: "photo" } })
        .then((res) => {
          if (parseInt(res.code) === 0) {
            this.ossMess = res.data;

            let {
              AccessKeyId,
              AccessKeySecret,
              Expiration,
              SecurityToken,
              bucket,
              endpoint,
              host,
            } = res.data;

            const client = new OSS({
              region: endpoint,
              endpoint: endpoint,
              accessKeyId: AccessKeyId,
              bucket: bucket,
              accessKeySecret: AccessKeySecret,
              stsToken: SecurityToken,
              expiration: Expiration,

              // endpoint: 'oss-cn-hangzhou.aliyuncs.com',
              // accessKeyId: 'STS.NTJaRK8bgCNYsNZQju5Jtvc95',
              // bucket:'trainfiles',
              // accessKeySecret: '3XqsD4SbMH1N5ZF4VQMXcLtCs1GFC4VTpqcH9u9ZQJgf',
              // stsToken:'CAIStgJ1q6Ft5B2yfSjIr5f/Kuj/1b1G9IyycWjrtWogOcVYmaaS1zz2IHFKfXVrBe4ZtfQ1lGpW6v8dlqZvTIdMX1DfUdF575J+6Rv5yCluaUDzv9I+k5SANTW573eZtZagjYybIfrZfvCyEWim8gZ43br9cxi7QlWhKufnoJV7b9MRLFnaCD1dH4VuOxdFos0XPmezUPG2KUzOg3HMNENyphEe+WRk8vaWyMqG9j/DiEH70uYPu7npJp+tY7MvXvFFXsyywfZ9e4fYzSdU8GIqzqpti7Fe8jq12bP4ClJKsRKdKLiWoJ89bi0BP/FrS/4V8KetyKEi5LOCz76akUgdYbtnNA3EX52lzcf+H+ekC800b76TOQ6Wg47WasKp7Vx/MShLbl0WIoU7R2NqAB0qWr8l3FR4XKigGoABLTAqh797roUUzP68myITgR65Vnm9O6vhry3jABsMTO27bRdP+L2EDd26U3GF3Izus3oY4qW6DzN96lSv8A3W9KwClj26bsIzWQ3fMiZ9XFLtY+cgwzH0Pzm+A71JqYPH1dbRSSIjbt/+gQgCxscmJ1VEA0IhVhyIKC5+Kv3uuEQ=',
              // expiration: '2020-12-09T11:45:18Z',
              contentType: this.type,
            });

            var aData = new Date();
            const filename = new Date().valueOf(); //Date.parse(new Date());

            const fileExt = item.file.name.toLowerCase().split(".").splice(-1);
            const newFilename =
              res.data.dir +
              filename +
              "-" +
              Math.floor(Math.random() * Math.floor(999999)) +
              "." +
              fileExt[0];
            //console.log(newFilename);
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
              this.$emit("update:imageUrl", res.url);
              //this.list.push(res.url);
              //console.log(res)
              this.$emit("upload", this.originImgUrl(res.url));
              loading.close();
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

<style scoped>
.el-upload-list__item {
  transition: none !important;
}

::v-deep .avatar-uploader-icon {
  width: 50px;
  height: 50px;
  line-height: 50px;
}
::v-deep .avatar {
  width: 50px;
  height: 50px;
  line-height: 50px;
}
</style>
