<template>
  <section class="form_border">
    <div class="header">
      <el-form :inline="true" class="demo-form-inline">
        <el-col :span="4">
          <el-form-item>
            <el-input
              v-model="forms.model.name"
              placeholder="姓名"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item>
            <el-input
              v-model="forms.model.studioCode"
              placeholder="画室id"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item>
            <el-select
              v-model="forms.model.checkState"
              placeholder="审核状态"
              @change="changeCheckStatus"
            >
              <el-option
                v-for="(item, index) in checkState"
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
            <el-select
              v-model="forms.model.state"
              placeholder="支付状态"
              @change="changeStatus"
            >
              <el-option
                v-for="(item, index) in state"
                :key="index"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="warning" @click="reset">重置</el-button>
            <el-button type="primary" @click="exportMes">报名信息导出</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <!-- 导入 导出 -->
    <div class="export-box">
      <el-upload
        class="upload"
        :limit= 1
        accept=".xls, .xlsx"
        :http-request="onImport"
        :file-list="[]">
        <el-button size="small" type="primary">批量导入报名信息</el-button>
      </el-upload>
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
        label="序号"
        header-align="center"
        align="center"
        prop="id"
      >
      </el-table-column>

      <el-table-column
        label="报考id"
        header-align="center"
        align="center"
        prop="enrollCode"
      >
      </el-table-column>

      <el-table-column
        label="画室id"
        header-align="center"
        align="center"
        prop="studioCode"
      >
      </el-table-column>

      <el-table-column
        label="姓名"
        header-align="center"
        align="center"
        prop="name"
      >
      </el-table-column>

      <el-table-column
        label="身份证号"
        header-align="center"
        align="center"
        prop="identification"
      >
      </el-table-column>

      <el-table-column
        label="所报课程"
        header-align="center"
        align="center"
        prop="subject"
      >
      </el-table-column>

      <el-table-column
        label="报名时间"
        header-align="center"
        align="center"
        prop="createTime"
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

      <el-table-column label="报名来源" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.source == 2 ? "后台" : "手机" }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="审核状态" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ getCheckStateString(scope.row) }}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="支付状态" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ getStateString(scope.row) }}</span>
        </template>
      </el-table-column>
      <!-- //审核状态  0:待审核,1:通过,2:拒绝 支付状态 1:待支付,2:成功,3:失败,4:处理 -->
      <el-table-column
        label="操作"
        width="180"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.checkState == 0 && scope.row.state == 2"
            type="text"
            size="small"
            @click="enbaleItemAction(scope.row,1)"
            >通过</el-button
          >
          <el-button
            v-if="scope.row.checkState == 0 && scope.row.state == 2"
            type="text"
            size="small"
            @click="enbaleItemAction(scope.row,2)"
            >拒绝</el-button
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
        @cb="currentChange"
      />
    </el-col>
  </section>
</template>
<script>
export default {
  components: {
  },
  data() {
    return {
      list: [],
      listLoading: false,
      forms: {
        pageIndex: 1,
        pageSize: 10,
        model: {
          name: "",
          studioCode:"",
          checkState: -1, //审核状态  0:待审核,1:通过,2:拒绝
          state: -1,  //支付状态 1:待支付,2:成功,3:失败,4:处理
        },
      },
      checkState: [
        { name: "全部审核状态", id: -1 },
        { name: "待审核", id: 0 },
        { name: "审核通过", id: 1 },
        { name: "审核拒绝", id: 2 },
      ],
      state: [
        { name: "全部支付状态", id: -1 },
        { name: "待支付", id: 1 },
        { name: "支付成功", id: 2 },
        { name: "支付失败", id: 3 },
        { name: "支付处理中", id: 4 },
      ],
      data: { pages: 0, pageSize: 10, total: 0, records: [] },
      users: [],
      isEnableOrder: false,
      dialogTitle: "",

      enbaleItem: {},
      checkItem: {},
      isEdit: false,
    };
  },
  created() {
    // this.getOrderList();
  },
  methods: {
    reset() {
      // if (!this.$route.meta.usable) {
      //   this.$message.error("该功能权限暂未开放，请联系客服");
      //   return;
      // }
      (this.forms.model = {
          name: "",
          studioCode:"",
          checkState: -1, //审核状态  0:待审核,1:通过,2:拒绝
          state: -1,  //支付状态 1:待支付,2:成功,3:失败,4:处理
      }),
        (this.forms.pageIndex = 1);
      this.getOrderList();
    },
    changeStatus() {},
    changeCheckStatus(){},
    updateList() {
      this.getOrderList();
    },
    currentChange() {
      this.getOrderList();
    },
    getCheckStateString(item) {//审核状态  0:待审核,1:通过,2:拒绝
      switch (item.checkState) {
        case 0:
          return "待审核";
          break;
        case 1:
          return "审核通过";
          break;
        case 2:
          return "审核拒绝";
          break;
      }
    },
    getStateString(item) {//支付状态 1:待支付,2:成功,3:失败,4:处理
      switch (item.state) {
        case 1:
          return "待支付";
          break;
        case 2:
          return "支付成功";
          break;
        case 3:
          return "支付失败";
          break;
        case 4:
          return "处理中";
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
          name: this.forms.model.name,
          studioCode:  this.forms.model.studioCode,
          checkState: this.forms.model.checkState == -1 ? null : this.forms.model.checkState,
          state: this.forms.model.state == -1 ? null : this.forms.model.state
        },
      };
      this.$axios
        .post(this.API.applyConfirm.list, params)
        .then((res) => {
          this.list = res.records;
          this.data = res;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    colseEnable() {
      this.isEnableOrder = false;
    },
    onSubmit() {
      this.forms.pageIndex = 1;
      this.getOrderList();
    },
    enbaleItemAction(item, checkState) {// 1:通过,2:拒绝
      this.$axios.get(`${this.API.applyConfirm.check}?checkState=${checkState}&id=${item.id}`, {
        checkState,
        id: item.id
      })
        .then((res) => {
          this.$message.success("操作成功");
          this.forms.pageIndex = 1;
          this.getOrderList();
          this.fileList = []
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },
    // 上传文件
    onImport(file, fileList){
      var formFile = new FormData()
      formFile.append('file',file.file)
      this.fileList = []
      this.$axios.post(this.API.applyConfirm.import, formFile)
        .then((res) => {
          this.$message.success("导入成功");
          this.forms.pageIndex = 1;
          this.getOrderList();
          this.fileList = []
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },
    // 导出
    exportMes(){
      this.listLoading = true;
      let params = {
        pageIndex: this.forms.pageIndex,
        pageSize: this.forms.pageSize,
        model: {
          name: this.forms.model.name,
          studioCode:  this.forms.model.studioCode,
          checkState: this.forms.model.checkState == -1 ? null : this.forms.model.checkState,
          state: this.forms.model.state == -1 ? null : this.forms.model.state
        },
      };
      this.$axios
        .post(this.API.applyConfirm.export, params)
        .then((res) => {
          this.$message.success("导出成功");
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    }
  },
};
</script>
<style lang="scss" scoped>
@import "./orderAccount.scss";
</style>