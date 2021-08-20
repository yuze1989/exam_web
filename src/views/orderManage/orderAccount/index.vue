<template>
  <section class="form_border">
    <div class="header">
      <el-form :inline="true" class="demo-form-inline">
        <el-col :span="5">
          <el-form-item>
            <el-input
              v-model="forms.model.schoolName"
              placeholder="机构名称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-select clearable
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
        prop="orderNo"
      >
      </el-table-column>

      <el-table-column
        label="品牌名称"
        header-align="center"
        align="center"
        prop="brandName"
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
          <span>{{ scope.row.openQuantity > 0 ? "已启用" : "未启用" }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="创建时间"
        header-align="center"
        align="center"
        prop="createTime"
      >
      </el-table-column>
      <el-table-column
        label="到期时间"
        header-align="center"
        align="center"
        prop="endTime"
      >
        <template slot-scope="scope">
          <span>{{ getDateFormat(scope.row.endTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="已启用数"
        header-align="center"
        align="center"
        prop="openQuantity"
      >
      </el-table-column>
      <el-table-column
        label="已注册数"
        header-align="center"
        align="center"
        prop="num"
      >
      </el-table-column>
      <el-table-column label="审核结果" header-align="center" align="center">
        <template slot-scope="scope">
          <!-- <el-button type="text" size="small" @click="auditItem(scope.row)">{{
            getStateString(scope.row)
          }}</el-button> -->
          <span>{{ getStateString(scope.row) }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="180"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <!-- <el-button type="text" size="small" @click="editItemAction(scope.row)"
            >查看</el-button
          > -->
          <!-- //状态 -1:过期,0:待审核,1:审核中,2:通过,3:拒绝,4:已开启 -->
          <el-button
            v-if="scope.row.state == 2 || scope.row.state == 4"
            type="text"
            size="small"
            @click="enbaleItemAction(scope.row)"
            >启用</el-button
          >
        </template>
      </el-table-column>

      <el-table-column
        label="操作记录"
        width="180"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="operateRecordeItem(scope.row)"
            >{{ scope.row.updateTime }}</el-button
          >
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

    <EnableOrderDialog
      :visible.sync="isEnableOrder"
      @close="colseEnable"
      ref="enableDialog"
      @updateList="updateList"
      :editItem="enbaleItem"
    >
    </EnableOrderDialog>

    <OperateRecordeDialog
      :visible.sync="isOperateRecorde"
      @close="closeOperateRecord"
      @updateList="updateList"
      :checkItem="checkItem"
    >
    </OperateRecordeDialog>
  </section>
</template>
<script>
import AddOrderDialog from "../addOrderDialog";
import EnableOrderDialog from "../enableOrderDialog";
import OperateRecordeDialog from "../operateRecordeDialog";
//:addOrderForm="addOrderForm"
export default {
  components: {
    AddOrderDialog,
    EnableOrderDialog,
    OperateRecordeDialog,
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
      //状态 -1:过期,0:待审核,1:审核中,2:通过,3:拒绝,4:已开启
      statusData: [
        { name: "全部", id: 100 },
        { name: "过期", id: -1 },
        { name: "待审核", id: 0 },
        { name: "审核中", id: 1 },
        { name: "通过", id: 2 },
        { name: "拒绝", id: 3 },
        { name: "已开启", id: 4 },
      ],
      data: { pages: 0, pageSize: 10, total: 0, records: [] },
      users: [],
      isAddOrder: false,
      isEnableOrder: false,

      isOperateRecorde: false,
      dialogTitle: "",

      enbaleItem: {},
      checkItem: {},

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
    changeStatus() {},
    updateList() {
      this.getOrderList();
    },
    getStateString(item) {
      //   state	状态 -1:过期,0:待审核,1:审核中,2:通过,3:拒绝,4:已开启
      switch (item.state) {
        case -1:
          return "过期";
          break;
        case 0:
          return "待审核";
          break;
        case 1:
          return "审核中";
          break;
        case 2:
          return "通过";
          break;
        case 3:
          return "拒绝";
          break;
        case 4:
          return "已开启";
          break;

        default:
          return "";
          break;
      }
    },

    auditItem(scope) {},
    // 订单列表
    getOrderList() {
      this.listLoading = true;
      let params = {
        pageIndex: this.forms.pageIndex,
        pageSize: this.forms.pageSize,
        model: {
          schoolName: this.forms.model.schoolName,
          state:
            this.forms.model.status == 100 ? null : this.forms.model.status,
        },
      };
      this.$axios
        .post(this.API.order.page, params)
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
    colseEnable() {
      this.isEnableOrder = false;
    },
    closeOperateRecord() {
      this.isOperateRecorde = false;
    },
    operateRecordeItem(item) {
      this.checkItem = item;
      this.isOperateRecorde = true;
    },
    onSubmit() {
      // if (!this.$route.meta.usable) {
      //   this.$message.error("该功能权限暂未开放，请联系客服");
      //   return;
      // }
      this.forms.pageIndex = 1;
      this.getOrderList();
    },

    getDateFormat(farDate) {
      return this.$dayjs(farDate).format("YYYY-MM-DD");
    },

    // 查看, 不允许编辑
    editItemAction(scope) {
      this.isAddOrder = true;
      this.dialogTitle = "查看订单";
      this.$axios
        .get(`${this.API.order.operateLog.detail}?id=${scope.id}`)
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
    enbaleItemAction(item) {
      this.isEnableOrder = true;
      this.enbaleItem = item;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./orderAccount.scss";
</style>