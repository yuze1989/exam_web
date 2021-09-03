<template>
  <div class="upload-container">
    <el-button
      :style="{ background: color, borderColor: color }"
      icon="el-icon-upload"
      size="mini"
      type="primary"
      @click="imageAction"
      >上传图片</el-button
    >
    <el-dialog title="上传图片" :visible.sync="dialogVisible" :modal="false">
      <AliOssMultiUpload :image="images" :limit="1000" @input="upload" />
    </el-dialog>
    <!--图文封面-->
    <!-- <AddFilesDialog
      :visible.sync="isImageVisible"
      @addSuccess="addImageSuccess"
      :type="1"
      :isCheckSize="isCheckSize"
      @input="selectedImage"
    /> -->
  </div>
</template>

<script>
import AliOssMultiUpload from "@/components/Upload/AliOssMultiUpload";
// import AddFilesDialog from "@/views/netSchoolMange/components/addFilesDialog";
export default {
  name: "EditorSlideUpload",
  components: { AliOssMultiUpload },
  props: {
    color: {
      type: String,
      default: "#1890ff",
    },
    isCheckSize: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogVisible: false,
      isImageVisible: false,
      list: [],
      imageKeys: [],
      images: [],
    };
  },
  methods: {
    imageAction() {
      if (this.isCheckSize) {
        this.isImageVisible = true;
      } else {
        this.dialogVisible = true;
      }
    },
    addImageSuccess() {},
    selectedImage(items, showType) {
      // console.log("selectedImage" + JSON.stringify(items) + showType);
      this.isImageVisible = false;
      // items.forEach((element) => {

      // });
      this.imageKeys = items;
      this.$emit("successCBK", this.imageKeys);
      this.list = [];
      this.images = [];
    },
    upload(lists) {

      this.imageKeys = lists;
      this.$emit("successCBK", this.imageKeys);
      this.list = [];
      this.images = [];
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
}
</style>
