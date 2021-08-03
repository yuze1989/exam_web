<template>
  <section class="form_border">
    <div class="header">
      <el-form :inline="true" class="demo-form-inline">
        <el-col :span="6">
          <el-form-item>
            <el-input
              v-model="forms.model.schoolName"
              placeholder="机构名称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-select
              v-model="forms.model.status"
              placeholder="状态"
              @change="changeStatus"
            >
              <el-option
                v-for="(item, index) in statusData"
                :key="index"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="warning" @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <!-- <div>
      <el-button class="meiyuan_btn" type="primary" size="medium" @click="add"
        >新增订单</el-button
      >
    </div> -->
    </div>

    <!--列表-->
    <el-table
      :data="list"
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
        label="订单号"
        header-align="center"
        align="center"
        prop="id"
      >
      </el-table-column>
      <el-table-column
        label="用户ID"
        header-align="center"
        align="center"
        prop="id"
      >
      </el-table-column>
      <el-table-column
        label="品牌名称"
        header-align="center"
        align="center"
        prop="schoolName"
      >
      </el-table-column>
      <el-table-column
        label="机构名称"
        header-align="center"
        align="center"
        prop="schoolName"
      >
      </el-table-column>
      <el-table-column
        label="总量"
        header-align="center"
        align="center"
        prop="purchaseQuantity"
      >
      </el-table-column>
      <el-table-column label="订单状态" header-align="center" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.useType == 1">购买</span>
          <span v-else-if="scope.row.useType == 2">使用</span>
          <span v-if="scope.row.useType == 3">赠送</span>
        </template>
      </el-table-column>

      <el-table-column
        label="创建时间"
        header-align="center"
        align="center"
        prop="startTime"
      >
      </el-table-column>
      <el-table-column
        label="到期时间"
        header-align="center"
        align="center"
        prop="endTime"
        format="yyyy-MM-dd HH:mm:ss"
      >
      </el-table-column>
      <el-table-column
        label="已启用数"
        header-align="center"
        align="center"
        prop="purchaseQuantity"
      >
      </el-table-column>
      <el-table-column
        label="本次启用数"
        header-align="center"
        align="center"
        prop="purchaseQuantity"
      >
      </el-table-column>
      <el-table-column
        label="剩余数量"
        header-align="center"
        align="center"
        prop="purchaseQuantity"
      >
      </el-table-column>
      <el-table-column label="审核结果" header-align="center" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.state == 0">启用</span>
          <span v-else>禁用</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作记录"
        width="180"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="stopItem(scope.row)">{{
            scope.row.endTime
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <myPagination
        :current.sync="forms.pageIndex"
        :pages.sync="data.pages"
        :size.sync="forms.pageSize"
        :total.sync="data.total"
        @cb="getOrderList"
      />
    </el-col>
    <add-order-dialog
      :visible.sync="isAddOrder"
      @close="colse"
      ref="optDialog"
      :dialogTitle="dialogTitle"
      @updateList="updateList"
      :isEdit="isEdit"
    >
    </add-order-dialog>
  </section>
</template>
<script>
import AddOrderDialog from "../addOrderDialog";
//:addOrderForm="addOrderForm"
export default {
  components: {
    AddOrderDialog,
  },
  data() {
    return {
      list: [],
      listLoading: false,
      forms: {
        pageIndex: 1,
        pageSize: 10,
        model: {
          schoolName: "",
          status: 100,
        },
      },
      statusData: [
        { name: "全部", id: 100 },
        { name: "已通过", id: 0 },
        { name: "未通过", id: 1 },
        { name: "待审核", id: 2 },
      ],
      data: { pages: 0, pageSize: 10, total: 0, records: [] },
      users: [],
      isAddOrder: false,
      dialogTitle: "",
      addOrderForm: {
        brand: { name: "", id: "" },
        school: { name: "", id: "" },
        paymentAmount: "",
        paymentType: "",
        paymentId: "",
        useType: "",
        purchaseQuantity: "",
        startTime: "",
        endTime: "",
      },
      isEdit: false,
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    reset() {
      (this.forms.model = {
        schoolName: "",
        status: 100,
      }),
        (this.forms.pageIndex = 1);
      this.getOrderList();
    },
    updateList() {
      this.getOrderList();
    },
    // 订单列表
    getOrderList() {
      this.listLoading = true;
      this.$axios
        .post(this.API.student.list, this.forms)
        .then((res) => {
          this.list = res.records;
          this.data = res;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    // 新增
    add() {
      this.isAddOrder = true;
      this.isEdit = false;
      this.dialogTitle = "新增订单";
      this.addOrderForm = {
        brand: { name: "", id: "" },
        school: { name: "", id: "" },
        paymentAmount: "",
        paymentType: "",
        paymentId: "",
        useType: "",
        purchaseQuantity: "",
        startTime: "",
        endTime: "",
      };
    },
    colse() {
      this.isAddOrder = false;
    },
    onSubmit() {
      this.forms.pageIndex = 1;
      this.getOrderList();
    },

    // 查看, 不允许编辑
    editItem(scope) {
      this.isAddOrder = true;
      this.dialogTitle = "查看订单";
      this.axios
        .get(`${this.stateUrl.orderApi.detail}?id=${scope.id}`)
        .then((res) => {
          this.addOrderForm = {
            brand: { name: res.data.brandName, id: res.data.brandId },
            school: { name: res.data.schoolName, id: res.data.schoolId },
            paymentAmount: res.data.paymentAmount,
            paymentType: res.data.paymentType,
            paymentId: res.data.paymentId,
            useType: res.data.useType,
            purchaseQuantity: res.data.purchaseQuantity,
            startTime: res.data.startTime,
            endTime: res.data.endTime,
          };
          this.isEdit = true;
        })
        .catch(() => {});
    },
    // 启动、禁用
    stopItem(scope) {
      let that = this;
      that
        .$confirm("确定要执行此操作吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          that.axios
            .post(that.stateUrl.orderApi.enableOrDisable, {
              id: scope.id,
            })
            .then((res) => {
              that.$message({
                type: "success",
                message: "操作成功!",
              });
              this.getOrderList();
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./orderAudit.scss";
</style>