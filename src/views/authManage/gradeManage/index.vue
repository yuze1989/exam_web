<template>
  <section class="form_border">
    <div class="header">
      <div class="from-wrap">

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
          prop="role"
      >
      </el-table-column>
      <!-- <el-table-column
        label="手机号"
        header-align="center"
        align="center"
        prop="mobilePhone"
      >
      </el-table-column> -->
      <!--      <el-table-column-->
      <!--        label="创建时间"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        prop="regTime"-->
      <!--      >-->
      <!--      </el-table-column>-->
      <el-table-column label="状态" width="130" header-align="center" align="center">
        <template slot-scope="scope">
          <span style="margin: 0 auto">{{ scope.row.state == 0 ? "正常" : "禁用" }}</span>
          <el-switch
              v-model="scope.row.state"
              :active-value="0"
              :inactive-value="5"
              active-color="#13ce66"
              inactive-color="#494949"
              @change="stopItem(scope.row)"
              style="display: flex;justify-content: center"
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
  </section>
</template>

<script>


export default {

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

      this.search.userName = "";
      this.getList();
    },
    // 新增
    add() {

      this.isAdd = 1;
      this.isAddBrand = true;
    },

    addUserSuccess() {
      this.isAddBrand = false;
      this.getList();
    },
    onSubmit() {
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
            this.editItemData = item;
            this.account = item.loginCode;
            this.username = item.userName;
            this.isAdd = 0;
            this.isAddBrand = true;
            // this.$message({
            //   type: "success",
            //   message: "已重置",
            // });
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
        current: this.form.pageIndex,
        size: this.form.pageSize,
        "examName": "",
        "provinceCode": "",
        "schoolId": "",
      };
      this.$axios
          .post('/rules/list', params)
          .then((res) => {
            this.dataList.pageIndex = res.result.pageNum;
            this.dataList.total = res.result.total;
            (this.dataList.pageSize = res.result.pageSize), (this.dataList.pages = res.result.pageNum);
            this.dataList.records = res.result.list;
          })
          .catch(() => {});
    },



  },
  watch: {
    dataList (val) {

    }
  },
  mounted() {},
  beforeCreate() {},
};
</script>

<style lang="scss" scoped>

</style>