<template>
  <section class="form_border">
    <div class="header">
      <el-button class="meiyuan_btn" type="primary" size="medium" @click="add">新增考试信息</el-button
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
      <el-table-column
        label="考试名称"
        header-align="center"
        align="center"
        prop="name"
      >
      </el-table-column>

      <el-table-column
        label="考试费用"
        header-align="center"
        align="center"
        prop="price"
      >
        <template slot-scope="scope">
          <span>{{(scope.row.price/100).toFixed(2)}}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="考试科目"
        header-align="center"
        align="center"
        prop="subject"
      >
      </el-table-column>

      <el-table-column
        label="考试地址"
        header-align="center"
        align="center"
        prop="address"
      >
      </el-table-column>

      <el-table-column label="操作" header-align="center">
        <template slot-scope="scope">
          <div class="operate-item">
            <el-button type="text" size="small" @click="editItemAction(scope.row)">
              <span>修改</span>
            </el-button>
          </div>
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

    <addDialog
      :visible.sync="isAdd"
      :isAdd="isAddType"
      :editItem="editItemData"
      @addSuccess="addSuccess"
    >
    </addDialog>
  </section>
</template>

<script>
import addDialog from "./addDialog";

export default {
  components: {
    addDialog,
  },
  data() {
    return {
      listLoading: false,
      sels: [], //列表选中列
      search: {
        name: "",
        mobilePhone: "",
      },

      form: {
        pageIndex: 1,
        pageSize: 10,
      },

      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [] },
      isAdd: false,
      isAddType: 1, //1新增  0编辑
      editItemData: {},
    };
  },
  created() {
    // this.getList();
  },

  methods: {
    // 新增
    add() {
      this.isAddType = 1;
      this.isAdd = true;
    },
    addSuccess() {
      this.isAdd = false;
      this.getList();
    },
    onSubmit() {
      this.form.pageIndex = 1;
      this.getList();
    },
    editItemAction(item) {
      this.editItemData = item;
      this.isAddType = 0;
      this.isAdd = true;
    },
    currentChange() {
      this.getList();
    },
    getList() {
      let params = {
        pageIndex: this.form.pageIndex,
        pageSize: this.form.pageSize,
        model: {
          name: this.search.name,
          mobilePhone: this.search.mobilePhone,
        },
      };
      this.$axios
        .post(this.API.messageManage.list, params)
        .then((res) => {
          this.data.records = res.records;
          this.data.pageIndex = res.pageIndex;
          this.data.total = res.total;
          (this.data.pageSize = res.pageSize), (this.data.pages = res.pages);
        })
        .catch(() => {});
    },

    update(params) {
      this.$axios
        .post(this.API.messageManage.update, params)
        .then((res) => {
          if (res) {
            this.$message({
              type: "success",
              message: "操作成功!",
            });
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
@import "./messageManage.scss";
</style>

