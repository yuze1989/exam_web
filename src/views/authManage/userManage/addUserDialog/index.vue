<template>
  <el-dialog
    :visible.sync="visible"
    :show-close="true"
    :close-on-click-modal="false"
    :before-close="handleClose"
    @open="open"
    width="40%"
    center
  >
    <div class="header-title" slot="title">新增</div>
    <el-form
      label-width="100px"
      :model="from"
      label-position="right"
      class="demo-ruleForm"
      center
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item label="账号" prop="account">
        <el-col :span="24">
          <el-input
            class="brand-input"
            v-model="from.account"
            placeholder="创建新账号格式，英文，数字或英文+数字"
            :disabled="isAdd ? false : true"
            maxlength="20"
          ></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="用户名" prop="name">
        <el-col :span="24">
          <el-input
            class="brand-input"
            v-model="from.name"
            placeholder="用户名不超过10个汉字"
            maxlength="20"
          ></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="用户手机" prop="phone">
        <el-col :span="24">
          <el-input
            class="brand-input"
            v-model="from.phone"
            placeholder="请输入有效的手机号"
          ></el-input>
        </el-col>
      </el-form-item>
      <el-form-item v-if="isAdd" label="用户密码" prop="password">
        <el-col :span="24">
          <el-input
            class="brand-input"
            v-model="from.password"
            placeholder="请输入密码"
          ></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="角色" prop="useType">
        <el-select
          v-model="from.useType"
          placeholder="请选择角色"
          style="width: 100%"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="confirm">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "AddUserDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isAdd: {
      type: Number,
      default: 0, //1新增  0编辑
    },
    editItem: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  methods: {
    close() {
      this.$emit("update:visible", false);
    },
    open() {
      //console.log(this.editItem)
      this.getRoleList();
      if (this.isAdd) {
        this.from = {
          name: "",
          useType: "",
          account: "",
          phone: "",
          password: "",
        };
      } else {
        this.from = {
          name: this.editItem.userName,
          useType: this.editItem.roleId,
          account: this.editItem.loginCode,
          phone: this.editItem.mobilePhone,
        };
      }
    },
    confirm() {
      if (this.isAdd) {
        this.add();
      } else {
        this.edit();
      }
    },

    handleClose() {
      this.$emit("update:visible", false);
    },

    // api
    getRoleList() {
      this.$axios
        .get(this.API.userManage.trainAdminRoleSelect)
        .then((res) => {
          this.options = res.data;
        })
        .catch(() => {});
    },
    add() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (!this.from.useType) {
            this.$message.error("请选择类型");

            return;
          }

          let params = {
            userName: this.from.name,
            roleId: this.from.useType,
            loginCode: this.from.account,
            mobilePhone: this.from.phone,
            password: this.from.password,
          };
          this.$axios
            .post(this.API.userManage.trainAdminAdd, params)
            .then((res) => {
              if (res) {
                this.$message({
                  message: "新增用户成功",
                  type: "success",
                });
                this.$emit("addUserSuccess");
              }
            })
            .catch(() => {});
        } else {
        }
      });
    },

    edit() {
      if (!this.from.name) {
        this.$message.error("输入用户名");
        return;
      }
      if (!this.from.useType) {
        this.$message.error("请选择角色");
        return;
      }

      if (!this.from.phone) {
        this.$message.error("请输入手机号");
        return;
      }

      let params = {
        userName: this.from.name,
        roleId: this.from.useType,
        mobilePhone: this.from.phone,
        id: this.editItem.id,
      };
      this.$axios
        .post(this.API.userManage.trainAdminUpdate, params)
        .then((res) => {
          if (res) {
            this.$message({
              message: "修改用户成功",
              type: "success",
            });
            this.$emit("addUserSuccess");
          }
        })
        .catch(() => {});
    },
  },
  data() {
    return {
      from: {
        name: "",
        useType: "",
        account: "",
        phone: "",
      },
      options: [],

      rules: {
        name: [{ required: true, message: "请输入用户名称", trigger: "blur" }],
        useType: [{ required: true, message: "请选角色", trigger: "change" }],
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./addUserDialog.scss";
</style>