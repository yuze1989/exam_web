<template>
  <el-dialog
    :visible.sync="visible"
    :show-close="true"
    :close-on-click-modal="false"
    :before-close="handleClose"
    @open="open"
    width="50%"
    center
  >
    <div slot="title">删除考试信息</div>
    <el-form
      label-width="120px"
      :model="from"
      label-position="right"
      class="demo-ruleForm"
      center
      :rules="rules"
      ref="delForm"
    >
      <el-form-item label="管理员账号" prop="username">
        <el-input v-model="from.username" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input v-model="from.password" placeholder="请输入"></el-input>
      </el-form-item>


    </el-form>

    <div slot="footer">
      <el-button type="primary" @click="confirm">删除</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
 
  name: "addRoom",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    editItem: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      from: {
        username: "",//管理员账号
        password: "",//密码 ,
        id:"",//考试id
      },
      rules: {
        username: [{ required: true, message: "请输入", trigger: "blur" }],
        password: [{ required: true, message: "请输入", trigger: "blur" }],
      },
    };
  },

  methods: {
    close() {
      this.$emit("update:visible", false);
    },
    open() {
      this.from.id = this.editItem.id
    },
    confirm() {
      this.del();
    },
    handleClose() {
      this.$emit("update:visible", false);
    },
    // api
    del() {
      this.$refs.delForm.validate((valid) => {
        if (valid) {
          let data = {
            ...this.from,
          }
          this.$axios
            .post(`${this.API.examinfo.delete}?id=${data.id}&username=${data.username}&password=${data.password}`, {})
            .then((res) => {
              if (res) {
                this.$message({
                  message: "删除成功",
                  type: "success",
                });
                this.$emit("addSuccess");
              }
            })
            .catch(() => {});
        } else {
        }
      });
    },
  }
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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style lang="scss" scoped>
@import "./add.scss";
</style>