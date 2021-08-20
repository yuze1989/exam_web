<template>
  <section class="form_border">
    <div class="header">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-col :span="4">
          <el-select clearable  v-model="search.state" placeholder="状态">
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.name"
              :value="item.val"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select clearable  v-model="search.limitState" placeholder="一个月内到期">
            <el-option
              v-for="(item, index) in limitOptions"
              :key="index"
              :label="item.name"
              :value="item.val"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="warning" @click="resetSubmit">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
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
      <el-table-column label="订单号" header-align="center" align="center">
        <template slot-scope="scope">
          <img class="logo-img" :src="scope.row.imgUrl" />
        </template>
      </el-table-column>
      <el-table-column
        label="机构名称"
        header-align="center"
        align="center"
        prop="name"
      >
      </el-table-column>
      <el-table-column
        label="购买数量"
        header-align="center"
        align="center"
        prop="schoolName"
      >
      </el-table-column>
      <el-table-column
        label="使用类型"
        header-align="center"
        align="center"
        prop="className"
      >
      </el-table-column>
      <el-table-column
        label="付款金额"
        header-align="center"
        align="center"
        prop="loginCode"
      >
      </el-table-column>
      <el-table-column
        label="付款方式"
        header-align="center"
        align="center"
        prop="createTime"
      >
      </el-table-column>
      <el-table-column
        label="交易时间"
        header-align="center"
        align="center"
        prop="stateName"
      >
        <template slot-scope="scope">
          <span>{{ getStateString(scope.row.state) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="有效期"
        header-align="center"
        align="center"
        prop="stateName"
      >
        <template slot-scope="scope">
          <span>{{ getStateString(scope.row.state) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="剩余有效账号数"
        header-align="center"
        align="center"
        prop="loginCode"
      >
      </el-table-column>

      <el-table-column label="操作" header-align="center">
        <template slot-scope="scope">
          <el-button
            v-show="scope.row.state == 0"
            type="text"
            size="small"
            @click="stopItem(scope.row, 5)"
            >禁用</el-button
          >
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
  </section>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      listLoading: false,
      sels: [], //列表选中列
      search: {
        className: "",
        studentName: "",
        state: 100,
        limitState: 100,
      },

      form: {
        pageIndex: 1,
        pageSize: 10,
      },
      options: [
        { name: "全部", val: 100 },
        { name: "在校", val: 0 },
        { name: "待审核", val: 1 },
        { name: "已拒绝", val: 2 },
        { name: "用户删除", val: 3 },
        //{ name: "被系统拒绝", val: 4},
        { name: "禁用", val: 5 },
      ],
      limitOptions: [
        { name: "全部", val: 100 },
        { name: "一个月内到期", val: 0 },
        { name: "三个月内到期", val: 1 },
      ],
      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [] },
      isAdd: false,
      isCheck: false,
      isAddType: 1,
      editItemData: {},
    };
  },
  created() {
    this.getList();
  },

  methods: {
    add() {
      this.isAddType = 1;
      this.isAdd = true;
    },
    resetSubmit() {
      this.search.studentName = "";
      this.search.className = "";
      this.search.state = 100;
      this.form.pageIndex = 1;
      this.getList();
    },

    addSuccess() {
      this.isAdd = false;
      this.getList();
    },
    onSubmit() {
      // if (!this.$route.meta.usable) {
      //   this.$message.error("该功能权限暂未开放，请联系客服");
      //   return;
      // }
      this.form.pageIndex = 1;
      this.getList();
    },
    editItem(item) {
      this.editItemData = item;
      this.isAddType = 0;
      this.isAdd = true;
    },
    checkItem(item) {
      this.isCheck = true;
    },
    getDateFormat(farDate) {
      return this.$dayjs(farDate).format("YYYY年MM月DD日");
    },

    //0正常、1 待审核 、2 已拒绝、3用户删除  4 被系统拒绝  5 禁用
    getStateString(state) {
      let stateString = "";
      switch (state) {
        case 0:
          stateString = "在校";
          break;
        case 1:
          stateString = "待审核";
          break;
        case 2:
          stateString = "已拒绝";
          break;
        case 3:
          stateString = "用户删除";
          break;
        case 4:
          stateString = "被系统拒绝";
        case 5:
          stateString = "禁用";
          break;
        default:
          stateString = "";
          break;
      }

      return stateString;
    },

    stopItem(item, state) {
      let stateString = "";
      switch (state) {
        case 0:
          break;
          stateString = "启用";

        case 3:
          stateString = "删除";
          break;
        case 5:
          stateString = "禁用";
          break;
        default:
          break;
      }
      this.$confirm("此操作将" + stateString + "学生, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.stop({ id: item.id, state: state });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    deleteItem(item) {
      this.$confirm("此操作将删除学生, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delete({ id: [item.id] });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    restItem(item) {
      this.$confirm("此操作将学生账号密码重置a123456, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.reset({ id: item.id });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },

    currentChange() {
      
      this.getList();
    },

    // api

    getList() {
      let params = {
        pageIndex: this.form.pageIndex,
        pageSize: this.form.pageSize,
        model: {
          className: this.search.className,
          studentName: this.search.studentName,
          state: this.search.state,
        },
      };
      if (this.search.state == 100) {
        params = {
          pageIndex: this.form.pageIndex,
          pageSize: this.form.pageSize,
          model: {
            className: this.search.className,
            studentName: this.search.studentName,
          },
        };
      }

      this.$axios
        .post(this.API.student.list, params)
        .then((res) => {
          // this.data.records = res.records;
          // this.data.pageIndex = res.pageIndex;
          // this.data.total = res.total;
          // (this.data.pageSize = res.pageSize), (this.data.pages = res.pages);
        })
        .catch(() => {});
    },

    reset(params) {
      this.$axios
        .post(this.API.student.resetPassword, params)
        .then((res) => {
          this.getList();
        })
        .catch(() => {});
    },

    delete(params) {
      this.$axios
        .post(this.API.student.delete, params)
        .then((res) => {
          if (res) {
            
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getList();
          }
        })
        .catch(() => {});
    },
    stop(params) {
      this.$axios
        .post(this.API.student.update, params)
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
@import "./orderManage.scss";
</style>