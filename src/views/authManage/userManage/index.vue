<template>
  <section class="form_border">
    <div class="header">
      <div class="from-wrap">
        <el-form :inline="true" :model="search" class="demo-form-inline">
          <!-- <el-col :span="5">
            <el-select v-model="search.state" placeholder="请选择">
              <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col> -->
          <el-col :span="5">
            <el-form-item>
              <el-input
                v-model="search.userName"
                placeholder="用户名"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <!-- <el-button type="warning" @click="reset">重置</el-button> -->
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <div>
<!--        <el-button class="meiyuan_btn" type="primary" size="medium" @click="add"-->
<!--          >新增用户</el-button-->
<!--        >-->
      </div>
    </div>
    <!--列表-->
    <el-table
      :data="dataList.records"
      highlight-current-row
      v-loading="listLoading"
      border
      :header-cell-style="{
        background: '#08223c',
        color: '#fff',
        border: 'none',
      }"
    >
      <!-- <el-table-column label="序列" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 + (form.pageIndex - 1) * 10 }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="用户ID"
        header-align="center"
        align="center"
        prop="id"
      >
      </el-table-column>

      <el-table-column
        label="账号"
        header-align="center"
        align="center"
        prop="loginCode"
      >
      </el-table-column>

      <el-table-column
        label="用户名"
        header-align="center"
        align="center"
        prop="userName"
      >
      </el-table-column>
      <el-table-column
        label="用户角色"
        header-align="center"
        align="center"
        prop="roleName"
      >
      </el-table-column>
      <!-- <el-table-column
        label="手机号"
        header-align="center"
        align="center"
        prop="mobilePhone"
      >
      </el-table-column> -->
      <el-table-column
        label="创建时间"
        header-align="center"
        align="center"
        prop="regTime"
      >
      </el-table-column>
      <el-table-column label="状态" width="130" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.state == 0 ? "正常" : "禁用" }}</span>
          <el-switch
            v-model="scope.row.state"
            :active-value="0"
            :inactive-value="5"
            active-color="#13ce66"
            inactive-color="#494949"
            @change="stopItem(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130" header-align="center">
        <template slot-scope="scope">
<!--          <el-button type="text" size="small" @click="editItem(scope.row)"-->
<!--            >编辑</el-button-->
<!--          >-->

          <el-button type="danger" size="small" @click="restItem(scope.row)"
            >密码重置</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <myPagination
        :current.sync="form.pageIndex"
        :pages.sync="dataList.pages"
        :size.sync="form.pageSize"
        :total.sync="dataList.total"
        @cb="currentChange"
      />
    </el-col>
    <AddUserDialog
      :visible.sync="isAddBrand"
      :isAdd="isAdd"
      :editItem="editItemData"
      @addUserSuccess="addUserSuccess"
    >
    </AddUserDialog>
  </section>
</template>

<script>
import AddUserDialog from "./addUserDialog";

export default {
  components: {
    AddUserDialog,
  },
  data() {
    return {
      listLoading: false,
      //新增界面数据
      search: {
        userName: "",
        state: -1,
      },
      form: {
        pageIndex: 1,
        pageSize: 10,
      },
      options: [{ roleName: "全部", id: -1 }],

      dataList: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [] },
      dataListCopy: [],
      isAddBrand: false,
      isAdd: 1, //1新增  0编辑
      editItemData: {},
    };
  },
  created() {
    this.getList();
    // this.getRoleList();
  },

  methods: {
    reset() {
      // if (!this.$route.meta.usable) {
      //   this.$message.error("该功能权限暂未开放，请联系客服");
      //   return;
      // }
      this.search.userName = "";
      this.getList();
    },
    // 新增
    add() {
      // if (!this.$route.meta.usable) {
      //   this.$message.error("该功能权限暂未开放，请联系客服");
      //   return;
      // }
      this.isAdd = 1;
      this.isAddBrand = true;
    },

    addUserSuccess() {
      this.isAddBrand = false;
      this.getList();
    },
    onSubmit() {
      // if (!this.$route.meta.usable) {
      //   this.$message.error("该功能权限暂未开放，请联系客服");
      //   return;
      // }
      this.getList();
    },
    editItem(item) {
      this.editItemData = item;
      this.isAdd = 0;
      this.isAddBrand = true;
    },
    getStateString(state) {
      if (state == 0) {
        return "禁用";
      } else if (state == 5) {
        return "启用";
      }
      return "";
    },
    stopItem(item) {
      this.$confirm(
        "此操作将" + this.getStateString(item.state) + "用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.delete(item);
        })
        .catch(() => {
          item.state = item.state == 0 ? 5 : 0;
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    restItem(item) {
      this.$confirm("此操作将重置密码, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // this.resetPWD(item);
          this.$message({
            type: "success",
            message: "已重置",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },

    currentChange() {
      //console.log('index' + index)
      this.getList();
    },

    // api

    getList() {
      let roleId = this.search.state == -1 ? null : this.search.state;
      let params = {
        pageIndex: this.form.pageIndex,
        pageSize: this.form.pageSize,
        model: {
          roleId: roleId,
          userName: this.search.userName,
        },
      };
      this.$axios
        .post('/user/userList', params)
        .then((res) => {
          this.dataList.pageIndex = res.result.pageNum;
          this.dataList.total = res.result.total;
          (this.dataList.pageSize = res.result.pageSize), (this.dataList.pages = res.result.pageNum);
          this.dataList.records = res.result.list;
        })
        .catch(() => {});
    },
    getRoleList() {
      this.$axios
        .get(this.API.userManage.trainAdminRoleSelect)
        .then((res) => {
          this.options = [{ roleName: "全部", id: -1 }, ...res.data];
        })
        .catch(() => {});
    },

    delete(item) {
      this.$axios
        .post(this.API.userManage.trainAdminEnableDisable + "/" + item.id)
        .then((res) => {
          if (res) {
            this.$message({
              type: "success",
              message: "禁用用户成功!",
            });

            this.getList();
          }
        })
        .catch(() => {});
    },
    resetPWD(item) {
      this.$axios
        .post(this.API.userManage.trainAdminResetPassword + "/" + item.id)
        .then((res) => {
          if (res) {
            this.$message({
              type: "success",
              message: "重置密码成功!",
            });

            this.getList();
          }
        })
        .catch(() => {});
    },
  },
  watch: {
    dataList (val) {
      console.log(val,'val---------')
    }
  },
  mounted() {},
  beforeCreate() {},
};
</script>

<style lang="scss" scoped>
@import "./userManage.scss";
</style>