<template>
  <section class="form_border">
    <div class="header">
      <el-button class="meiyuan_btn" type="primary" size="medium" @click="add"
        >新增画室信息 </el-button
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
        label="画室编号"
        header-align="center"
        align="center"
        prop="studioCode"
      >
      </el-table-column>
      <el-table-column
        label="画室名称"
        header-align="center"
        align="center"
        prop="studioName"
      >
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

    <addRoomDialog
      :visible.sync="isAdd"
      :isAdd="isAddType"
      :editItem="editItemData"
      @addSuccess="addSuccess"
    >
    </addRoomDialog>
  </section>
</template>

<script>
import addRoomDialog from "./addRoomDialog";

export default {
  components: {
    addRoomDialog,
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
    editItemAction(item) {
      this.editItemData = item;
      this.isAddType = 0;
      this.isAdd = true;
    },
    currentChange() {
      //console.log('index' + index)
      this.getList();
    },
    // api
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
        .post(this.API.roomManage.list, params)
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
        .post(this.API.roomManage.update, params)
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
@import "./schoolManage.scss";
</style>

