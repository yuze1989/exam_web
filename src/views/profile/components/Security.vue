<template>
  <el-form>
    <el-form-item label="账号">
      <el-input v-model.trim="user.username" disabled />
    </el-form-item>
    <el-form-item label="旧密码">
      <el-input v-model.trim="user.old_password" type="password" />
    </el-form-item>
    <el-form-item label="新密码">
      <el-input v-model.trim="user.new_password" type="password" />
    </el-form-item>
    <el-form-item label="重复新密码">
      <el-input v-model.trim="user.confirm_new_password" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="update">保 存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          username: "",
          old_password: "",
          new_password: "",
          confirm_new_password: ""
        };
      }
    }
  },
  methods: {
    update() {
      if (this.user.old_password.length < 6) {
        return this.$message.warning("旧密码不正确");
      }
      if (this.user.new_password.length < 6) {
        return this.$message.warning("新密码长度至少六位");
      }
      if (this.user.confirm_new_password !== this.user.new_password) {
        return this.$message.warning("两次输入的密码不一致");
      }
      this.$axios.post("/admin/admin/changePwd", this.user).then(response => {
        this.$notify({
          title: "温馨提示",
          message: "个人信息已更新",
          type: "success"
        });
      });
    }
  }
};
</script>
