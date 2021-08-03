<template>
  <div>
    <section class="form_border">
      <!-- <div class="header">
        <el-form :inline="true" :model="organSearch" class="demo-form-inline">
          <el-col :span="4">
            <el-form-item>
              <el-input
                v-model="organSearch.brandName"
                placeholder="品牌名"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input
                v-model="organSearch.phone"
                placeholder="电话"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button type="warning" @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
        <el-button class="meiyuan_btn" type="primary" size="medium" @click="add"
        >新增机构</el-button
      >
      </div> -->
      <div style="height:20px"></div>

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
          label="ID"
          header-align="center"
          align="center"
          width="80"
          prop="id"
        >
        </el-table-column>
        <el-table-column
          label="机构名称"
          header-align="center"
          align="center"
          prop="name"
        >
        </el-table-column>
        <el-table-column
          label="所属品牌"
          header-align="center"
          align="center"
          prop="brandName"
        >
        </el-table-column>
        <el-table-column
          label="地址"
          header-align="center"
          align="center"
          prop="address"
        >
        </el-table-column>
        <el-table-column
          label="负责人"
          header-align="center"
          align="center"
          prop="principalPerson"
        >
        </el-table-column>
        <el-table-column
          label="账号"
          header-align="center"
          align="center"
          prop="loginUserName"
        >
        </el-table-column>
        <!-- <el-table-column
          label="有效账号数"
          header-align="center"
          align="center"
          prop="validLoginUserCount"
        >
        </el-table-column> -->
        <el-table-column
          label="电话"
          header-align="center"
          align="center"
          prop="mobilePhone"
        >
        </el-table-column>
        <el-table-column
          label="创建日期"
          header-align="center"
          align="center"
          prop="createTime"
        >
        </el-table-column>
        <!-- <el-table-column label="操作" width="180" header-align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editItem(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="small"
              v-if="scope.row.state == 0"
              @click="stopItem(scope.row)"
              >注销</el-button
            >
            <el-button
              type="text"
              size="small"
              v-if="scope.row.state == 4"
              @click="stopItem(scope.row)"
              >启动</el-button
            >
            <el-button type="text" size="small" @click="resetItem(scope.row)"
              >密码重置</el-button
            >
          </template>
        </el-table-column> -->
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <myPagination
          :current.sync="forms.pageIndex"
          :pages.sync="data.pages"
          :size.sync="forms.pageSize"
          :total.sync="data.total"
          @cb="getOraganList"
        />
      </el-col>
    </section>
    <!-- 新增,编辑弹框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :show-close="true"
      :before-close="handleClose"
      width="30%"
      center
    >
      <el-form
        label-width="100px"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="机构名称" prop="name">
          <el-input
            v-model="ruleForm.name"
            placeholder="请输入机构名称"
            type="text"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属品牌" prop="brandName">
          <el-select
            style="width: 100%"
            v-model="ruleForm.brandId"
            placeholder="请选择"
            @change="getBrandInfo"
          >
            <el-option
              v-for="item in brandOpt"
              :key="item.id"
              :label="item.brandName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" prop="principalPerson">
          <el-input
            v-model="ruleForm.principalPerson"
            placeholder="请输入负责人"
            type="text"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobilePhone">
          <el-input
            v-model="ruleForm.mobilePhone"
            placeholder="请输入电话"
            maxlength="11"
            type="text"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属地区" required>
          <el-col :span="8">
            <el-form-item prop="province">
              <el-select
                value-key="id"
                v-model="ruleForm.province"
                placeholder="请选择"
                @change="selectProvince"
              >
                <el-option
                  v-for="(item, index) in provinceOpt"
                  :key="index"
                  :label="item.name"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="city">
              <el-select
                value-key="id"
                v-model="ruleForm.city"
                placeholder="请选择"
                @change="selectCity"
              >
                <el-option
                  v-for="(item, index) in cityOpt"
                  :key="index"
                  :label="item.name"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="district">
              <el-select
                value-key="id"
                v-model="ruleForm.district"
                placeholder="请选择"
                @change="selectDistrict"
              >
                <el-option
                  v-for="(item, index) in districtOpt"
                  :key="index"
                  :label="item.name"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="详细地址" prop="address">
          <el-input
            v-model="ruleForm.address"
            placeholder="请输入详细地址"
            type="text"
          ></el-input>
        </el-form-item>
        <el-form-item label="登录账号" prop="loginUserName">
          <el-input
            v-model="ruleForm.loginUserName"
            :disabled="isAdd ? false : true"
            placeholder="请输入登录账号"
            type="text"
          ></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password" v-if="isAdd">
          <el-input
            v-model="ruleForm.password"
            type="text"
            placeholder="默认密码123456"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var validateProvince = (rule, obj, callback) => {
      if (obj.name == "") {
        callback(new Error("请选择省"));
      } else {
        callback();
      }
    };
    var validateCity = (rule, obj, callback) => {
      if (obj.name == "") {
        callback(new Error("请选择市"));
      } else {
        callback();
      }
    };
    return {
      current_pages: 1, //记录当前页
      list: [],
      listLoading: false,
      dialogTitle: "",
      isAdd: true,
      //新增界面数据
      organSearch: {
        province: "",
        city: "",
        brandName: "",
        phone: "",
      },
      //新增界面数据
      forms: {
        pageSize: 10,
        pageIndex: 1,
      },
      data: { pages: 0, pageSize: 10, total: 0, records: [] },
      dialogVisible: false,
      brandOpt: [], // 品牌列表
      provinceOpt: [], // 省select
      cityOpt: [], // 市select
      districtOpt: [], // 区select
      // 以下接口请求参数
      ruleForm: {
        id: null,
        name: "",
        brandId: "",
        brandName: "",
        principalPerson: "",
        mobilePhone: "",
        province: { name: "", id: "" },
        city: { name: "", id: "" },
        district: { name: "", id: "" },
        address: "",
        loginUserName: "",
      },
      rules: {
        name: [{ required: true, message: "请输入机构名称", trigger: "blur" }],
        brandName: [
          { required: true, message: "请选择所属品牌", trigger: "change" },
        ],
        principalPerson: [
          { required: true, message: "请输入负责人", trigger: "blur" },
        ],
        mobilePhone: [
          { required: true, message: "请输入电话", trigger: "blur" },
        ],
        province: [{ validator: validateProvince, trigger: "change" }],
        city: [{ validator: validateCity, trigger: "change" }],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
        loginUserName: [
          { required: true, message: "请输入登录账号", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getOraganList();
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
    // 新增
    add() {
      this.dialogVisible = true;
      this.isAdd = true;
      this.ruleForm = {
        id: null,
        name: "",
        brandId: "",
        brandName: "",
        principalPerson: "",
        mobilePhone: "",
        province: { name: "", id: "" },
        city: { name: "", id: "" },
        district: { name: "", id: "" },
        address: "",
        loginUserName: "",
      }; // 新增数据清空
      (this.provinceOpt = []), // 省select
        (this.cityOpt = []), // 市select
        (this.districtOpt = []), // 区select
        (this.dialogTitle = "新增机构");
      this.getAreaData(0, 0);
      this.getAllBrandList();
    },
    reset() {
      this.organSearch = {
        brandName: "",
        phone: "",
      };
      this.forms.pageIndex = 1;
      this.getOraganList();
    },
    // 获取机构列表
    getOraganList() {
      this.listLoading = true;
      let params = {
        pageSize: this.forms.pageSize,
        pageIndex: this.forms.pageIndex,
        model: {
          brandName: this.organSearch.brandName,
          phone: this.organSearch.phone,
        },
      };
      this.$axios
        .post(this.API.organ.brandSchoolPage, params)
        .then((res) => {
          this.list = res.records;
          this.data = res;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    // 全部品牌
    getAllBrandList() {
      //   this.axios
      //     .get(this.stateUrl.brandApi.allBrand)
      //     .then((res) => {
      //       this.brandOpt = res.data;
      //     })
      //     .catch(() => {});
    },
    // 获取品牌信息
    getBrandInfo(val) {
      let obj = {};
      obj = this.brandOpt.find((item) => {
        return item.id === val; //筛选出匹配数据
      });
      this.ruleForm.brandName = obj.brandName;
    },
    // 获取省市区
    getAreaData(params, index) {
      //   this.axios
      //     .post(this.stateUrl.areaList, { parentId: params })
      //     .then((res) => {
      //       if (index == 0) {
      //         this.provinceOpt = res.data;
      //       } else if (index == 1) {
      //         this.cityOpt = res.data;
      //       } else if (index == 2) {
      //         this.districtOpt = res.data;
      //       }
      //     })
      //     .catch(() => {});
    },
    // 切换省
    selectProvince(val) {
      this.getAreaData(val.id, 1);
      this.ruleForm.province.id = val.id;
      this.ruleForm.province.name = val.name;
      if (this.ruleForm.city) {
        this.ruleForm.city = { name: "", id: "" };
        this.cityOpt = [];
      }
      if (this.ruleForm.district) {
        this.ruleForm.district = { name: "", id: "" };
        this.districtOpt = [];
      }
    },
    // 切换市
    selectCity(val) {
      //   this.getAreaData(val.id, 2);
      //   this.ruleForm.city.id = val.id;
      //   this.ruleForm.city.name = val.name;
      //   if (this.ruleForm.district) {
      //     this.districtOpt = [];
      //     this.ruleForm.district = { name: "", id: "" };
      //   }
    },
    // 切换区
    selectDistrict(val) {
      this.ruleForm.district.id = val.id;
      this.ruleForm.district.name = val.name;
    },

    onSubmit() {
      this.forms.pageIndex = 1;
      this.getOraganList();
    },
    // 编辑/更新
    editItem(scope) {
      //   this.dialogVisible = true;
      //   this.dialogTitle = "编辑机构";
      //   this.isAdd = false;
      //   this.ruleForm.id = scope.id;
      //   this.getAreaData(0, 0);
      //   this.getAllBrandList();
      //   this.axios
      //     .get(`${this.stateUrl.organApi.detail}?schoolId=${scope.id}`)
      //     .then((res) => {
      //       this.ruleForm = {
      //         id: res.data.id,
      //         name: res.data.name,
      //         brandId: res.data.brandId,
      //         brandName: res.data.brandName,
      //         principalPerson: res.data.principalPerson,
      //         mobilePhone: res.data.mobilePhone,
      //         address: res.data.address,
      //         province: {
      //           name: res.data.provinceName,
      //           id: res.data.provinceCode,
      //         },
      //         city: { name: res.data.cityName, id: res.data.cityCode },
      //         district: {
      //           name: res.data.districtName,
      //           id: res.data.districtCode,
      //         },
      //         loginUserName: res.data.loginUserName,
      //         password: "123456",
      //       };
      //       this.getAreaData(this.ruleForm.province.id, 1);
      //       this.getAreaData(this.ruleForm.city.id, 2);
      //     })
      //     .catch(() => {});
    },
    stopItem(scope) {
      this.$confirm("确定要执行此操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //   this.$axios
          //     .post(this.API.organ.brandSchoolPage, {
          //       schoolId: scope.id,
          //     })
          //     .then((res) => {
          //       this.$message({
          //         type: "success",
          //         message: "操作成功!",
          //       });
          //       this.getOraganList();
          //     })
          //     .catch(() => {});
        })
        .catch(() => {});
    },
    resetItem(scope) {
      let that = this;
      that
        .$confirm("确定要重置密码吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          //   that.axios
          //     .post(that.stateUrl.organApi.resetPwd, { schoolId: scope.id })
          //     .then((res) => {
          //       that.$message({
          //         type: "success",
          //         message: "重置成功!",
          //       });
          //     })
          //     .catch(() => {});
        })
        .catch(() => {});
    },
    confirm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            id: this.ruleForm.id,
            name: this.ruleForm.name,
            brandId: this.ruleForm.brandId,
            brandName: this.ruleForm.brandName,
            principalPerson: this.ruleForm.principalPerson,
            mobilePhone: this.ruleForm.mobilePhone,
            provinceName: this.ruleForm.province.name,
            provinceCode: this.ruleForm.province.id,
            cityName: this.ruleForm.city.name,
            cityCode: this.ruleForm.city.id,
            districtName: this.ruleForm.district.name,
            districtCode: this.ruleForm.district.id,
            address: this.ruleForm.address,
            loginUserName: this.ruleForm.loginUserName,
            password: "123456",
          };
          //   let url = null;
          //   if (this.isAdd) {
          //     url = this.stateUrl.organApi.addSchool;
          //   } else {
          //     url = this.stateUrl.organApi.updateSchool;
          //   }
          //   this.axios
          //     .post(url, params)
          //     .then((res) => {
          //       this.$message({
          //         message: "操作成功",
          //         type: "success",
          //       });
          //       this.dialogVisible = false;
          //       this.getOraganList();
          //     })
          //     .catch(() => {});
        }
      });
    },
  },
  mounted() {},
  beforeCreate() {},
};
</script>



<style lang="scss" scoped>
@import "./brandOrganManage.scss";
</style>
