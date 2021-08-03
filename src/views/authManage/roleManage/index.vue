<template>
  <section class="form_border">
    <!-- <div class="from-wrap">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-col :span="4">
          <el-form-item>
            <el-input
              v-model="search.brandName"
              placeholder="品牌名"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input v-model="search.phone" placeholder="电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="warning" @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </div> -->
    <div class="header">
      <el-button class="meiyuan_btn" type="primary" size="medium" @click="add"
        >新增角色</el-button
      >
    </div>
    <!--列表-->
    <el-table
      :data="data.records"
      highlight-current-row
      v-loading="listLoading"
      border
      :header-cell-style="{
        background: '#08223c',
        color: '#fff',
        border: 'none',
      }"
    >
      <el-table-column label="序列" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 + (form.pageIndex - 1) * 10 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="角色ID"
        header-align="center"
        align="center"
        prop="id"
      >
      </el-table-column>

      <el-table-column
        label="角色名"
        header-align="center"
        align="center"
        prop="roleName"
      >
      </el-table-column>

      <el-table-column
        label="创建日期"
        header-align="center"
        align="center"
        prop="createTime"
      >
      </el-table-column>
      <el-table-column label="操作" width="130" header-align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editItem(scope.row)"
            >修改</el-button
          >
          <el-button type="danger" size="small" @click="stopItem(scope.row)"
            >删除</el-button
          >
          <!-- <el-button type="danger" size="small" @click="restItem(scope.row)"
              >权限管理</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <myPagination
        :current.sync="form.pageIndex"
        :pages.sync="data.pages"
        :size.sync="form.pageSize"
        :total.sync="data.total"
        @cb="currentChange"
      />
    </el-col>
    <AddRoleDialog
      :visible.sync="isAddBrand"
      :isAdd="isAdd"
      :editItem="editItemData"
      @addRoleSuccess="addRoleSuccess"
    >
    </AddRoleDialog>
  </section>
</template>

<script>
import AddRoleDialog from "./addRoleDialog";

export default {
  components: {
    AddRoleDialog,
  },
  data() {
    return {
      listLoading: false,
      //新增界面数据
      search: {},
      form: {
        pageIndex: 1,
        pageSize: 10,
      },

      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [] },
      isAddBrand: false,
      isAdd: 1, //1新增  0编辑
      editItemData: {},
    };
  },
  created() {
    this.getList();
  },

  methods: {
    reset() {
      this.search.brandName = "";
      this.search.phone = "";
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

    addRoleSuccess() {
      this.isAddBrand = false;
      this.getList();
    },
    onSubmit() {
      this.form.pageIndex = 1;
      this.getList();
    },
    editItem(item) {
      this.editItemData = item;
      this.isAdd = 0;
      this.isAddBrand = true;
    },
    stopItem(item) {
      this.$confirm("此操作将删除角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delete(item.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    restItem() {},

    changeCity() {},

    currentChange() {
      //console.log('index' + index)
      this.getBrandList();
    },

    // api
    getList() {
      let params = {
        pageIndex: this.form.pageIndex,
        pageSize: this.form.pageSize,
      };
      this.$axios
        .post(this.API.roleManage.trainRolePage, params)
        .then((res) => {
          this.data.records = res.records;
          this.data.pageIndex = res.pageIndex;
          this.data.total = res.total;
          (this.data.pageSize = res.pageSize), (this.data.pages = res.pages);
        })
        .catch(() => {});
    },

    delete(id) {
      this.$axios
        .get(this.API.roleManage.trainRoleRemove + "/" + id)
        .then((res) => {
          if (res) {
            this.$message({
              type: "success",
              message: "删除角色成功!",
            });
            this.form.pageIndex = 1;
            this.getList();
          }
        })
        .catch(() => {});
    },
  },
  mounted() {},
  beforeCreate() {},
};
</script>

<style lang="scss" scoped>
@import "./roleManage.scss";
</style>