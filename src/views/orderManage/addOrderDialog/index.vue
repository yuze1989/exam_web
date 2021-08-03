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
      :model="addOrderForm"
      :rules="rules"
      ref="ruleForm"
      class="demo-form-inline"
    >
      <el-form-item label="选择品牌" required>
        <el-select
          v-model="addOrderForm.brandItem"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="loading"
          @change="changeBrand"
          value-key="id"
          style="width: 3rem"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.brandName"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择机构" required>
        <el-select
          v-model="addOrderForm.schoolItem"
          placeholder="请选择机构"
          @change="selectOrgan"
          value-key="id"
          :disabled="false"
          style="width: 3rem"
        >
          <el-option
            v-for="item in organData"
            :key="item.id"
            :label="item.name"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="总量" prop="purchaseQuantity">
        <el-input
          v-model="addOrderForm.purchaseQuantity"
          placeholder="请输入购买数量(必须是数字)"
          onkeyup="value=value.replace(/[^\d]/g,'')"
          :disabled="false"
          style="width: 3rem"
        ></el-input>
      </el-form-item>
      <el-form-item label="启用时间">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="addOrderForm.startTime"
          style="width: 3rem"
          value-format="yyyy-MM-dd"
          :disabled="false"
          @change="changeStartDate"
          :clearable="true"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="addOrderForm.endTime"
          style="width: 3rem"
          value-format="yyyy-MM-dd"
          :disabled="true"
          :clearable="false"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" >
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "AddOrderDialog",
  data() {
    return {
      addOrderForm: {
        brandItem: null,
        schoolItem: null,
        purchaseQuantity: "",
        startTime: "",
        endTime: "",
      },
      options: [],
      organData: [],
      loading: false,

      rules: {
        purchaseQuantity: [
          { required: true, message: "请输入购买数量", trigger: "blur" },
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
      default: "新增订单",
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

  created() {
    this.getBrandList();
  },

  mounted() {},

  methods: {
    open() {
      
      let endDate =
        this.$dayjs().add(15, "month").format("YYYY-MM-DD") + " 00:00:00";
      if (this.isEdit) {
        (this.addOrderForm.brandItem = {
          id: this.editItem.brandId,
          brandName: this.editItem.brandName,
        }),
          (this.addOrderForm.schoolItem = {
            id: this.editItem.schoolId,
            name: this.editItem.schoolName,
          }),
          this.remoteMethod(this.editItem.brandName);
        this.getSchoolList(this.addOrderForm.brandItem);
        this.addOrderForm.endTime = this.editItem.endTime;
        this.addOrderForm.startTime = this.editItem.startTime;
        this.addOrderForm.purchaseQuantity = this.editItem.purchaseQuantity;
      } else {
        (this.options = []),
          (this.organData = []),
          (this.addOrderForm = {
            brandItem: null,
            schoolItem: null,
            purchaseQuantity: "",
            startTime: "",
            endTime: endDate,
          });
      }
    },

    //搜索品牌
    remoteMethod(query) {
      this.loading = true;
      // let url = this.stateUrl.orderApi.trainBrand;
      // if (query && query.length > 0) {
      //   url = `${this.stateUrl.orderApi.trainBrand}/${encodeURIComponent(
      //     query
      //   )}`;
      // }
      // this.$axios
      //   .get(url)
      //   .then((res) => {
      //     this.options = res.data;
      //     this.loading = false;
      //   })
      //   .catch(() => {
      //     this.loading = false;
      //   });
    },
    changeBrand(val) {
      this.addOrderForm.schoolItem = null;
      this.getSchoolList(val);
    },
    //获取机构
    getSchoolList(val) {
      // this.$axios
      //   .get(`${this.stateUrl.orderApi.listByTrandId}?brandId=${val.id}`)
      //   .then((res) => {
      //     this.organData = res.data;
      //   })
      //   .catch(() => {});
    },
    changeStartDate(val) {
      let endDate =
        this.$dayjs(val).add(12, "month").format("YYYY-MM-DD") + " 00:00:00";
      this.addOrderForm.endTime = endDate;
    },

    // 选择机构
    selectOrgan(val) {},
    close() {
      this.$emit("close");
    },
    handleClose() {
      this.$emit("update:visible", false);
    },
    // 品牌列表
    getBrandList() {
      // this.$axios
      //   .get(this.stateUrl.brandApi.allBrand)
      //   .then((res) => {
      //     this.brandData = res.data;
      //   })
      //   .catch(() => {});
    },
    confirm() {
      if (!this.addOrderForm.brandItem) {
        this.$message.error("请选择品牌");
        return;
      }
      if (!this.addOrderForm.schoolItem) {
        this.$message.error("请选择机构");

        return;
      }

      if (
        this.addOrderForm.startTime &&
        this.addOrderForm.startTime.length > 0
      ) {
        this.addOrderForm.startTime = this.addOrderForm.startTime;
      } else {
        this.addOrderForm.startTime = this.$dayjs()
          .add(3, "month")
          .format("YYYY-MM-DD");
      }
      if (this.addOrderForm.startTime.indexOf(" 00:00:00") != -1) {
      } else {
        this.addOrderForm.startTime = this.addOrderForm.startTime + " 00:00:00";
      }

      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            brandId: this.addOrderForm.brandItem.id,
            schoolId: this.addOrderForm.schoolItem.id,
            purchaseQuantity: this.addOrderForm.purchaseQuantity,
            startTime: this.addOrderForm.startTime,
            endTime: this.addOrderForm.endTime,
          };
          // let url = this.stateUrl.orderApi.add;
          // if (this.isEdit) {
          //   params = { ...params, id: this.editItem.id };
          //   url = this.stateUrl.orderApi.update;
          // }
          // this.$axios
          //   .post(url, params)
          //   .then((res) => {
          //     this.$message({
          //       message: "操作成功",
          //       type: "success",
          //     });
          //     this.$emit("close");
          //     this.$emit("updateList");
          //   })
          //   .catch(() => {});
        }
      });
    },
  },
};
</script>

<style scoped>
@import "./addOrderDialog.scss";
</style>



