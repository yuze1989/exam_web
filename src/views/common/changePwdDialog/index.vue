<template>
  <!-- 修改密码 -->

  <el-dialog
    :visible.sync="visible"
    :show-close="true"
    :close-on-click-modal="false"
    :before-close="handleClose"
    width="40%"
    center
  >
    <div slot="title">修改密码</div>
    <el-form
      label-position="right"
      label-width="100px"
      :model="formLabelAlign"
      :rules="rules"
      ref="formLabelAlign"
    >
      <el-form-item label="原密码" prop="oldPwd">
        <el-input
          v-model="formLabelAlign.oldPwd"
          placeholder="请输入原密码"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd1">
        <el-input
          v-model="formLabelAlign.newPwd1"
          placeholder="请输入新密码"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="newPwd2">
        <el-input
          v-model="formLabelAlign.newPwd2"
          placeholder="请确认新密码"
          type="password"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    handleClose() {
      this.$emit("update:visible", false);
    },

    close() {
      this.$emit("update:visible", false);
    },
    confirm() {
      this.$refs.formLabelAlign.validate((valid) => {
        if (valid) {
          if (this.formLabelAlign.newPwd1 != this.formLabelAlign.newPwd2) {
            this.$message({
              message: "新密码不一致",
              type: "error",
            });
          } else {
            let params = {
              oldPassword: this.formLabelAlign.oldPwd,
              newPassword: this.formLabelAlign.newPwd1,
              enterNewPassword: this.formLabelAlign.newPwd2,
            };
            this.$axios
              .post(this.API.user.changePwd, params)
              .then((res) => {
                if (res) {
                  this.$message({
                    message: "修改成功",
                    type: "success",
                  });
                  this.$emit("update:visible", false);
                  this.$store.dispatch("user/logout").then(() => {
                    this.$router.push("/login");
                  });
                  
                }
              })
              .catch(() => {});
          }
        }
      });
    },
  },

  data() {
    return {
      formLabelAlign: {
        oldPwd: "",
        newPwd1: "",
        newPwd2: "",
      },
      rules: {
        oldPwd: [{ required: true, message: "请输入原密码", trigger: "blur" }],
        newPwd1: [{ required: true, message: "请输入新密码", trigger: "blur" }],
        newPwd2: [{ required: true, message: "请确认新密码", trigger: "blur" }],
      },
    };
  },
};
</script>

<style lang="scss" scoped>
</style>