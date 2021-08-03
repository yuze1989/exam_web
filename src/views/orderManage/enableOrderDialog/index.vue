<template>
  <el-dialog
    :visible.sync="visible"
    :show-close="true"
    :close-on-click-modal="false"
    width="40%"
    :before-close="handleClose"
    @open="open"
    center
  >
    <div class="header-title" slot="title">{{ dialogTitle }}</div>
    <el-form
      :inline="true"
      label-position="right"
      label-width="120px"
      :model="enableOrderForm"
      :rules="rules"
      ref="ruleForm"
      class="demo-form-inline"
    >
      <el-form-item label="选择品牌" required>
        <el-input
          v-model="enableOrderForm.brandName"
          placeholder="请输选择品牌"
          :disabled="true"
          style="width: 25rem"
        ></el-input>
      </el-form-item>
      <el-form-item label="选择机构" required>
        <el-input
          v-model="enableOrderForm.schoolName"
          placeholder="请选择机构"
          :disabled="true"
          style="width: 25rem"
        ></el-input>
      </el-form-item>
      <el-form-item label="总量" required>
        <el-input
          v-model="enableOrderForm.purchaseQuantity"
          placeholder="请输入购买数量(必须是数字)"
          :disabled="true"
          style="width: 25rem"
        ></el-input>
      </el-form-item>
      <el-form-item label="剩余数量" required="">
        <el-input
          v-model="enableOrderForm.remainQuantity"
          placeholder="请输入剩余数量(必须是数字)"
          :disabled="true"
          style="width: 25rem"
        ></el-input>
      </el-form-item>
      <el-form-item label="本次启用数" prop="openQuantity" width="100">
        <el-input
          v-model="enableOrderForm.openQuantity"
          placeholder="请输入启用数量(必须是数字)"
          onkeyup="value=value.replace(/[^\d]/g,'')"
          :disabled="false"
          style="width: 25rem"
        ></el-input>
      </el-form-item>
      <el-form-item label="启用时间" prop="startTime">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="enableOrderForm.startTime"
          style="width: 25rem"
          value-format="yyyy-MM-dd"
          :disabled="true"
          @change="changeStartDate"
          :clearable="true"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="enableOrderForm.endTime"
          style="width: 25rem"
          value-format="yyyy-MM-dd"
          :disabled="true"
          :clearable="false"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "EnableOrderDialog",
  data() {
    return {
      enableOrderForm: {
        openQuantity: "",

        brandName: "",
        schoolName: "",
        purchaseQuantity: "",
        remainQuantity: "",
        startTime: "",
        endTime: "",
      },

      loading: false,

      rules: {
        purchaseQuantity: [
          { required: true, message: "请输入购买数量", trigger: "blur" },
        ],
        remainQuantity: [
          { required: true, message: "请输入剩余数量", trigger: "blur" },
        ],
        openQuantity: [
          { required: true, message: "请输入启用数量", trigger: "blur" },
        ],

        startTime: [
          { required: true, message: "请选择开始日期", trigger: "change" },
        ],
        endTime: [
          { required: true, message: "请选择结束日期", trigger: "change" },
        ],
      },
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      type: String,
      default: "启用订单",
    },
    editItem: {
      type: Object,
      default: () => {
        return {};
      },
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },

  created() {},

  mounted() {},

  methods: {
    open() {
     
      if (this.isEdit) {
      } else {
        this.enableOrderForm = {
          brandName: this.editItem.brandName,
          schoolName: this.editItem.schoolName,
          purchaseQuantity: this.editItem.purchaseQuantity,
          remainQuantity: this.editItem.remainQuantity,
          startTime: this.editItem.startTime,
          endTime: this.editItem.endTime,
        };
      }
    },

    changeStartDate(val) {
      let endDate =
        this.$dayjs(val).add(12, "month").format("YYYY-MM-DD") + " 00:00:00";
      this.enableOrderForm.endTime = endDate;
    },

    close() {
      this.$emit("close");
    },
    handleClose() {
      this.$emit("update:visible", false);
    },

    confirm() {
      if (!this.enableOrderForm.brandName) {
        this.$message.error("请选择品牌");
        return;
      }
      if (!this.enableOrderForm.schoolName) {
        this.$message.error("请选择机构");

        return;
      }

      if (this.enableOrderForm.openQuantity>this.editItem.remainQuantity) {
        this.$message.error("开启数不能大于剩余数");

        return;
      }

      if (this.enableOrderForm.endTime.indexOf(" 00:00:00") != -1) {
      } else {
        this.enableOrderForm.endTime =
          this.enableOrderForm.endTime + " 00:00:00";
      }
      if (this.enableOrderForm.startTime.indexOf(" 00:00:00") != -1) {
      } else {
        this.enableOrderForm.startTime =
          this.enableOrderForm.startTime + " 00:00:00";
      }

      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            id: this.editItem.id,
            openQuantity: this.enableOrderForm.openQuantity,
          };

          this.$axios
            .post(this.API.order.open, params)
            .then((res) => {
              if (res) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                });
                this.$emit("close");
                this.$emit("updateList");
              }
            })
            .catch(() => {});
        }
      });
    },
  },
};
</script>

<style scoped>
@import "./enableOrderDialog.scss";
</style>
