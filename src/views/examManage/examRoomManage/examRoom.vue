<template>
  <section>
    <el-row>
      <div style="margin: 0 0 10px; font-size: 18px; font-weigth: 800">
        考场管理
      </div>
    </el-row>
    <!--工具条-->
    <el-row class="toolbar" style="padding-bottom: 0px" type="flex">
      <el-col :span="6">
        <el-button type="primary" class="meiyuan_btn" @click="roomassgin">考场分配</el-button>
      </el-col>
      <el-col :span="18" style="float: right">
        <el-form :inline="true" :model="selections" style="float: right">
          <el-form-item>
            <el-input
              v-model="selections.examineeName"
              style="width: 140px"
              placeholder="请输入学生姓名"
              onKeyUp="value=value.replace(/\s|[\r\n]/ig,'')"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <select-province @province="selectedProvince" placeholder="选择生源省份"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="meiyuan_btn" v-on:click="getExamRoomList('select')">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!--列表-->
    <div class="form_border">
      <el-table
        :data="examRoomList"
        highlight-current-row
        v-loading="listLoading"
        @selection-change="selsChange"
        border
        :header-cell-style="{ background: '#204BD6', color: '#fff' }"
        style="width: 100%"
      >
        <el-table-column
          prop="province"
          label="省份"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="studioName"
          label="画室"
          header-align="center"
          width="160"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="examName"
          label="考试名称"
          width="220"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="考生名称"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="identification"
          label="准考证号"
          width="220"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <!-- //审核状态  0:待审核,1:通过,2:拒绝 支付状态 1:待支付,2:成功,3:失败,4:处理 -->
      <el-table-column
        label="操作"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="exchangeExamRoom(scope.row)"
          >
            换考场
          </el-button>
        </template>
      </el-table-column>
      </el-table>
    </div>

    <el-col :span="24" class="toolbar">
      <myPagination
        :current.sync="selections.current"
        :pages.sync="data.pages"
        :size.sync="selections.size"
        :total.sync="data.total"
        @cb="getExamRoomList"
      />
    </el-col>
    <!--编辑界面-->
    <el-dialog
      :close-on-click-modal="false"
      title="考场分配"
      :visible.sync="roomAssginVisible"
      :destroy-on-close="true"
      :append-to-body="true"
      width="600px"
      ><examRoomAssgin
        v-if="roomassgin"
        @closeRoom="closeRoom"
      ></examRoomAssgin>
    </el-dialog>
    <el-dialog
      :visible.sync="visible"
      :show-close="true"
      :close-on-click-modal="false"
      :before-close="handleClose"
      @open="open"
      width="40%"
      center
    >
      <div class="header-title" slot="title">更换考场</div>
      <el-form
        label-width="100px"
        :model="from"
        label-position="right"
        class="demo-ruleForm"
        center
        ref="ruleForm"
      >
        <el-form-item label="更换到：" prop="id">
          <el-select
            v-model="ruleForm.id"
            placeholder="请选择考场"
            style="width: 100%"
          >
            <el-option
              v-for="item in selectExamRoomList"
              :key="item.id"
              :label="item.examName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="visible = false;">取消</el-button>
        <el-button type="primary" @click="confirm">更换</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import provinceCodeList from "@/utils/provinceCode";
import myPagination from "@/components/pagination";
import SelectProvince from "@/components/SelectProvince";

import examRoomAssgin from "./examRoomAssgin";
export default {
  components: { examRoomAssgin, myPagination, SelectProvince },
  data() {
    return {
      listLoading: false,
      dialogVisible: true,
      visible:false,
      provinceList: provinceCodeList,
      examRoomList: [],
      selectExamRoomList: [],
      total: 0,
      page: 1,
      sels: [], //列表选中列
      selections: {
        size: 10,
        current: 1,
        proviceName: "", //选择省份
        examineeName: "", //学生姓名
        examName:"",
        provinceCode:"",
        roomCode: "",
        schoolId: "",
      },
      ruleForm:{
        id:'',
        roomCode:'',
      },
      roomAssginVisible: false, //编辑界面是否显示
      editLoading: false,
      data: { current: 1, pages: 0, size: 20, total: 0, records: [] },
    };
  },
  methods: {
    selectedProvince(payload) {
      this.selections.provinceCode = payload.provinceCode;
      this.selections.provinceName = payload.province;
    },
    roomassgin() {
      this.roomAssginVisible = true;
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getExamRoomList();
    },
    exchangeExamRoom(val){
      this.visible = true;
      var selections = {
        size: 100,
        current: 1,
        provinceCode:val.provinceCode,
        roomCode: val.studioCode
      }
      this.$axios.post(this.API.studentsManage.examRoomList, selections)
        .then((res) => {
          if (res.code == 200) {
            this.selectExamRoomList = res.result.list;
            this.listLoading = false;
          }
        })
        .catch((e) => {
            this.listLoading = false
          }
        );
    },
    confirm(){
      if (!this.ruleForm.id) {
        this.$message.error("请选择调换的考场");
        return;
      }
      this.$axios.post(this.API.studentsManage.examRoomChange, this.ruleForm)
        .then((res) => {
          if (res.code == 200) {
            this.visible = false;
            this.listLoading = false;
          }
        })
        .catch((e) => {
            this.listLoading = false
          }
        );
    },
    getExamRoomList(type) {
      this.listLoading = true;
      if (type == "select") {
        this.selections.current = 1;
      }
      this.selections.examineeName = this.selections.examineeName.replace(/\s|[\r\n]/gi, "");
      this.$axios.post(this.API.studentsManage.examRoomList, this.selections)
        .then((res) => {
          if (res.code == 200) {
            this.data = res.result;
            this.total = res.result.total;
            this.examRoomList = res.result.list;
            this.listLoading = false;
          }
        })
        .catch((e) => {
            this.listLoading = false
          }
        );
    },
    selsChange: function (sels) {
      this.sels = sels;
    },
    closeRoom() {
      this.roomAssginVisible = false;
    },
  },
  mounted() {
    this.getExamRoomList();
  },
};
</script>

<style scoped>
.el-button--small {
  padding: 1px 1px;
}
.el-dialog__header {
  text-align: center;
}
.el-dialog__title {
  font-size: 32px;
}
</style>