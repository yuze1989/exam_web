<template>
  <section class="form_border">
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
      <el-table-column
        label="角色ID"
        header-align="center"
        align="center"
        prop="id"
      >
      </el-table-column>
      <el-table-column
        label="角色名称"
        header-align="center"
        align="center"
        prop="roleName"
      >
      </el-table-column>
      <el-table-column
        label="创建时间"
        header-align="center"
        align="center"
        prop="createTime"
      >
      </el-table-column>
            <el-table-column label="操作" header-align="center">
        <template slot-scope="scope">
          <div class="operate-item">
            <el-button
              type="text"
              size="small"
              @click="editItem(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="del(scope.row)"
              >删除</el-button
            >
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


    <deleteDialog
      :visible.sync="showDel"
      :editItem="editItemData"
      @addSuccess="addSuccess"
    />
  </section>
</template>

<script>
import addDialog from "./addDialog";
import deleteDialog from "./deleteDialog";
export default {
  components: {
    addDialog,
    deleteDialog
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
      showDel: false,
      isAddType: 1, //1新增  0编辑
      editItemData: {},
    };
  },
  created() {
    this.getList();

  },

  methods: {

    editItem(item) {

      this.isAddType = 0;
      this.isAdd = true;
      this.editItemData = item
    },
    //删除
    del(item){
      // this.editItemData = item
      // this.showDel = true
      this.$confirm('此操作将删除该账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post("/role/delete?id="+item.id).then((res)=>{
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 新增
    add() {
      this.isAddType = 1;
      this.isAdd = true;
    },
    addSuccess() {
      this.getList();
      this.isAdd = false;
      this.showDel = false;
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
        current: this.form.pageIndex,
        size: this.form.pageSize,
        model: {
          name: this.search.name,
          mobilePhone: this.search.mobilePhone,
        },
      };
      this.$axios
        .post(this.API.role.list, params)
        .then((res) => {
          this.data.records = res.result.list;
          this.data.pageIndex = res.result.pageNum;
          this.data.total = res.result.total;
          this.data.pageSize = res.result.pageSize;
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
@import "./index.scss";
</style>

