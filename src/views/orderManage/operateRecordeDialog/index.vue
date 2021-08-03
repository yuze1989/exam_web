<template>
  <el-dialog
    :visible.sync="visible"
    :show-close="true"
    :close-on-click-modal="false"
    width="95%"
    :before-close="handleClose"
    @open="open"
    center
  >
    <div class="header-title" slot="title">{{ dialogTitle }}</div>
    <el-table
      :data="tableData"
      height="350"
      border
      style="width: 100%"
      :header-cell-style="{
        background: '#08223c',
        color: '#fff',
        border: 'none',
      }"
    >
      <el-table-column label="订单号">
        {{ checkItem.orderNo }}
      </el-table-column>
      <el-table-column label="品牌名称">
        {{ checkItem.brandName }}</el-table-column
      >
      <el-table-column label="机构名称"
        >{{ checkItem.schoolName }}
      </el-table-column>
      <el-table-column label="总量"
        >{{ checkItem.purchaseQuantity }}
      </el-table-column>
      <el-table-column label="订单状态">
        {{ checkItem.openQuantity > 0 ? "已启用" : "未启用" }}</el-table-column
      >
      <el-table-column prop="createTime" label="创建时间"> </el-table-column>
      <el-table-column prop="endTime" label="到期时间"> </el-table-column>
      <el-table-column prop="historyOpenQuantity" label="上次启用数">
      </el-table-column>
      <el-table-column prop="openQuantity" label="本次启用数">
      </el-table-column>
      <el-table-column prop="remainOpenableQuantity" label="剩余数">
      </el-table-column>
      <el-table-column prop="creator" label="操作人员"> </el-table-column>
      <el-table-column prop="createTime" label="操作时间" style="width: 100%">
      </el-table-column>
      <!-- <el-table-column prop="date" label="审核人员"> </el-table-column>
      <el-table-column prop="date" label="审核结果"> </el-table-column> -->
    </el-table>
    <div slot="footer" v-if="!isEdit">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="close">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "OperateRecordeDialog",
  data() {
    return {
      tableData: [],
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      type: String,
      default: "操作记录",
    },
    checkItem: {
      type: Object,
      default: () => {
        return {};
      },
    },
    //addOrderForm: {},
    isEdit: {
      type: Boolean,
      default: false,
    },
  },

  created() {},

  methods: {
    open() {
      this.tableData = [];
      this.getOperateLog();
    },
    // 操作记录列表
    getOperateLog() {
      this.$axios
        .post(`${this.API.order.operateLog}/${this.checkItem.id}`)
        .then((res) => {
          this.tableData = res.data;
        })
        .catch(() => {});
    },

    close() {
      this.$emit("close");
    },
    handleClose() {
      this.$emit("update:visible", false);
    },
    confirm() {},
  },
};
</script>

<style scoped>
@import "./operateRecordeDialog.scss";
</style>