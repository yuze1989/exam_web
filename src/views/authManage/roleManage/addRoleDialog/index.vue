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
    <div class="header-title" slot="title">编辑角色</div>
    <el-form
      label-width="100px"
      :model="from"
      label-position="right"
      class="demo-ruleForm"
      center
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-col :span="15">
          <el-input
            class="brand-input"
            v-model="from.roleName"
            placeholder="请输入角色名称"
            maxlength="20"
          ></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-tree
          :data="data"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
          :default-checked-keys="selectedCheck"
          :props="defaultProps"
        >
        </el-tree>
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
  components: {},
  name: "addRoleDialog",
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
      if (this.isAdd) {
        this.from = {
          roleName: "",
        };
        this.data = [];
        this.trainRoleMenuSelect(null);
      } else {
        this.from = {
          roleName: this.editItem.roleName,
        };
        this.data = [];
        this.trainRoleMenuSelect(this.editItem.id);
      }
    },
    confirm() {
      let childrenKeys = this.$refs.tree.getCheckedKeys();
      let parentKeys = this.$refs.tree.getHalfCheckedKeys();

      let selectKeys = new Array();
      childrenKeys.forEach((key) => {
        selectKeys.push(key);
      });
      parentKeys.forEach((key) => {
        selectKeys.push(key);
      });

      console.log(selectKeys);

      if (this.isAdd) {
        this.addRole(selectKeys);
      } else {
        this.editRole(selectKeys);
      }
    },

    handleClose() {
      this.$emit("update:visible", false);
    },

    getCheckedNodes() {
      console.log(this.$refs.tree.getCheckedNodes());
    },
    getCheckedKeys() {
      console.log(this.$refs.tree.getCheckedKeys());
    },
    setCheckedNodes() {
      this.$refs.tree.setCheckedNodes(this.selectedCheck);
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedKeys([3]);
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([]);
    },

    filtersParent(menus) {
      let dataMenu = new Array();
      let parentMenus = new Array();
      let childrenMenus = new Array();
      let selectMenus = new Array();
      menus.forEach((element) => {
        if (element.isHave && element.parentId > 0) {
          selectMenus.push(element.id);
        }
        if (element.parentId == 0) {
          parentMenus.push(element);
        }
        if (element.parentId > 0) {
          childrenMenus.push(element);
        }
      });

      parentMenus.forEach((item, index) => {
        let childrens = this.filtersChilren(item, childrenMenus);
        dataMenu.push({ id: item.id, label: item.nameCn, children: childrens });
      });

      this.data = dataMenu;
      this.selectedCheck = selectMenus;
    },

    filtersChilren(item, childrenMenus) {
      let childrens = new Array();
      childrenMenus.forEach((children, index) => {
        if (item.id == children.parentId) {
          childrens.push({ id: children.id, label: children.nameCn });
        }
      });
      return childrens;
    },

    // api
    trainRoleMenuSelect(id) {
      let url = this.API.roleManage.trainRoleMenuSelect;
      if (id) {
        url = this.API.roleManage.trainRoleMenuSelect + "/" + id;
      }
      this.$axios
        .get(url)
        .then((res) => {
          if (res) {
            this.filtersParent(res.data);
          }
        })
        .catch(() => {});
    },

    addRole(selectKeys) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // if (!this.from.roleName) {
          //   this.$message.error("请上传LOGO");

          //   return;
          // }

          let params = {
            roleName: this.from.roleName,
            menuIds: selectKeys,
          };
          this.$axios
            .post(this.API.roleManage.trainRoleAdd, params)
            .then((res) => {
              if (res) {
                this.$message({
                  message: "新增角色成功",
                  type: "success",
                });
                this.$emit("addRoleSuccess");
              }
            })
            .catch(() => {});
        } else {
        }
      });
    },

    editRole(selectKeys) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            id: this.editItem.id,
            roleName: this.from.roleName,
            menuIds: selectKeys,
          };
          this.$axios
            .post(this.API.roleManage.trainRoleUpdate, params)
            .then((res) => {
              if (res) {
                this.$axios
                  .post(this.API.roleManage.trainRoleUpdateMenu, params)
                  .then((res) => {
                    if (res) {
                      this.$message({
                        message: "修改角色成功",
                        type: "success",
                      });
                      this.$emit("addRoleSuccess");
                    }
                  })
                  .catch(() => {});
              }
            })
            .catch(() => {});
        }
      });
    },
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label",
      },
      from: {
        schoolName: "",
      },
      selectedCheck: [],
      data: [],

      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
    };
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
@import "./addRoleDialog.scss";
</style>