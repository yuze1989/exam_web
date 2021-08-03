<template>
  <el-form>
    <el-form-item label="机构LOGO">
      <!-- <LocalUpload ref="upload" :image="image" @upload="getUrl"></LocalUpload> -->
      <el-col class="header-img" :span="20">
        <AliImageUpload
          :imageUrl.sync="image"
          :configUrl="API.upLoadImageApi.upLoadImageConfig"
        />
      </el-col>
    </el-form-item>
    <el-form-item label="机构名称">
      <el-input v-model.trim="user.userName" />
    </el-form-item>
    <el-form-item label="咨询电话">
      <el-input v-model="user.mobilePhone2" />
    </el-form-item>
    <el-form-item label="机构简介">
      <!-- <Tinymce ref="desc" v-model="user.description" height="400" /> -->
    </el-form-item>

    <el-form-item label="机构地址">
      <el-cascader
        ref="address"
        v-model="selectedOptions"
        :options="options"
        @change="handleChange"
      ></el-cascader>
    </el-form-item>
    <el-form-item label="详细地址">
      <el-input v-model.trim="user.address" type="textarea" />
    </el-form-item>
    <el-form-item label="地址经度">
      <el-button type="success" style="margin-bottom: 5px" @click="goMap"
        >点击此处获取经纬度</el-button
      >
      <el-input v-model.trim="user.longitude" type="text" />
    </el-form-item>
    <el-form-item label="地址纬度">
      <el-input v-model.trim="user.latitude" type="text" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="update">保 存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Tinymce from "@/components/Tinymce/index.vue";
import LocalUpload from "@/components/Upload/LocalUpload.vue";
import { regionData, CodeToText, TextToCode } from "element-china-area-data";
import AliImageUpload from "@/components/Upload/aliImageUpload.vue";
export default {
  components: { LocalUpload, Tinymce, AliImageUpload },

  data() {
    return {
      image: "",
      user: {},
      options: regionData,
      selectedOptions: [],
      // selected: []
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.$axios.post("train/schoolWeb/getSchoolBaseInfo", {}).then((res) => {
        if (parseInt(res.code) === 0) {
          this.user = res.data;
          let sOptions = new Array();
          if (res.data.province) {
            sOptions.push(TextToCode[res.data.province].code);
            console.log("province" + TextToCode[res.data.province]);
          }
          if (res.data.province && res.data.city) {
            let city = TextToCode[res.data.province][res.data.city];
            if (city) {
              sOptions.push(TextToCode[res.data.province][res.data.city].code);
            }
          }
          if (res.data.province && res.data.city && res.data.county) {
            let city = TextToCode[res.data.province][res.data.city];
            if (city) {
              let county = TextToCode[res.data.province][res.data.city];
              if (county) {
                sOptions.push(
                  TextToCode[res.data.province][res.data.city][res.data.county]
                    .code
                );
              }
            }
          }
          this.selectedOptions = sOptions;
          if (res.data.imgUrl) {
            //this.image.push({ url: res.data.imgUrl });
            this.image = res.data.imgUrl;
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    update() {
      let params = {
        ...this.user,
        imgUrl: this.image,
      };
      if (!this.user.userName) {
        this.$message.error("请输入机构名称");
        return;
      }
      this.$axios
        .post("train/schoolWeb/updateSchoolBaseInfo", params)
        .then((response) => {
          if (parseInt(response.code) === 0) {
            localStorage.setItem("user_name", this.user.userName);
            localStorage.setItem("user_avatar", this.image);
            this.$bus.$emit("upDateUserInfo", {});

            this.$store
              .dispatch("user/upDateInfo", {
                userName: this.user.userName,
                imgUrl: this.image,
              })
              .then((res) => {});
            //this.$router.push({ path: "/" });
            this.$notify({
              title: "温馨提示",
              message: "个人信息已更新",
              type: "success",
            });
          } else {
            this.$message.error(response.message);
          }
          // this.$refs["upload"].$emit("clear");
        });
    },
    handleChange(value) {
      this.user.province = CodeToText[value[0]];
      this.user.county = CodeToText[value[2]];
      this.user.city = CodeToText[value[1]];
    },
    goMap() {
      window.open("https://lbs.amap.com/console/show/picker");
    },
    getUrl(url) {
      this.user.imgUrl = url;
    },
  },
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
</style>
<style scoped>
.el-cascader {
  display: block;
}

.el-form-item--small .el-form-item__content {
  margin-top: 40px;
}
</style>
