<template>
  <section class="form_border">
    <div class="header">
      <div class="from-wrap">
        <el-button type="primary" @click="stopLr" style="float: left">停止录入成绩</el-button>
        <el-form :inline="true" :model="search" class="demo-form-inline" @submit.native.prevent style="display: flex;justify-content: flex-end;height: 36px">

          <el-form-item>
            <el-input
                v-model="search.admissionTicketCode"
                placeholder="请扫码或者输入准考证号"
                @keyup.enter.native="inputNum"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
      </div>
    </div>
    <!--列表-->
    <el-table
      :data="dataList.records"
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
        label="考试编码"
        header-align="center"
        align="center"
        prop="examCode"
      >
      </el-table-column>

      <el-table-column
        label="考试名称"
        header-align="center"
        align="center"
        prop="examName"
      >
      </el-table-column>

      <el-table-column
        label="准考证号"
        header-align="center"
        align="center"
        prop="admissionTicketCode"
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
        label="所属机构"
        header-align="center"
        align="center"
        prop="studioName"
      >
      </el-table-column>
      <el-table-column
        label="所属省份"
        header-align="center"
        align="center"
        prop="province"
      >
      </el-table-column>
      <template  v-if="dataList.records.length>0">
        <el-table-column v-for="(item, index) in dataList.records[0].subjectList" :label="item.subjectName" header-align="center" align="center">
          <template slot-scope="scope">
            <el-input :disabled="!(scope.row.subjectList[index].img == '' || scope.row.subjectList[index].img == null)" v-model="scope.row.subjectList[index].score" @keyup.enter.native="save(scope.row)"></el-input>
          </template>
        </el-table-column>

      </template>
      <el-table-column label="操作" width="130" header-align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="save(scope.row)"
          >保存</el-button
          >
        </template>
      </el-table-column>


    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <myPagination
        :current.sync="form.pageIndex"
        :pages.sync="dataList.pages"
        :size.sync="form.pageSize"
        :total.sync="dataList.total"
        @cb="currentChange"
      />
    </el-col>

    <el-dialog
        :visible.sync="dialogFormVisible"
        width="50%"
        center
    >
      <div slot="title">停止手工录入成绩</div>
      <el-form
          label-width="120px"
          label-position="right"
          class="demo-ruleForm"
          center
          ref="delForm"
      >
        <p style="    text-align: center;
    color: red;
    font-size: 20px;
    padding: 0;
    margin: 0;
    margin-bottom: 15px;">停止之前，请确认成绩录入已经完成，一旦停止就不能再录入成绩</p>
        <el-form-item label="选择考试" prop="username" style="margin-bottom: 15px">
          <el-select clearable  v-model="examId"  placeholder="请选择考试名称" @change="examNameChange" style="margin-right: 5px">
            <el-option
                v-for="item in examNameOption"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="管理员账号" prop="username" style="margin-bottom: 15px">
          <el-input v-model="admin_username" placeholder="请输入管理员账号"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="admin_password" placeholder="请输入密码"></el-input>
        </el-form-item>


      </el-form>

      <div slot="footer">
        <el-button type="primary" @click="confirm1">确认</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { apiExamList,apiGetProvinceByExamId,apiGetExamDetails,apiTicketCreate } from '@/api/ticket.js'
export default {

  components: {
  },
  data() {
    return {
      dialogFormVisible:false,
      admin_username:"",
      admin_password:"",
      listLoading: false,
      //新增界面数据
      search: {
        admissionTicketCode : "",
      },
      form: {
        pageIndex: 1,
        pageSize: 10,
      },

      dataList: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [] },
      subjectName1: false,
      subjectName2: false,
      subjectName3: false,
      subjectName4: false,
      arr:[],
      examId:"",
      examNameOption:[]

    };
  },
  created() {
    this.getList();
    this.getExamList();
  },

  methods: {
    // 考试改变监听
    examNameChange(e){
      this.examId = ""
      this.form.examName= ""
      this.examNameOption.map(item =>{
        if(item.id == e){
          this.form.examName = item.name
          this.examId = item.id
        }
      })
    },
    // 查询考试列表
    getExamList(){
      apiExamList().then(res=>{
        this.examNameOption = res.result
      })
    },
    confirm1(){
      let data = {
        "examId": this.examId,
        "loginUser": this.admin_username,
        "password": this.admin_password,
      }
      this.$axios.post("/score/stopExam",data).then((res)=>{
        if(res.code == 200){
          this.dialogFormVisible = false;
          this.$message({
            message: '停止成功',
            type: 'success',
            duration: 1500,
          })
        }
      })
    },
    stopLr(){
      this.dialogFormVisible = true;
      this.admin_username = "";
      this.admin_password = "";
    },
    onSubmit() {
      this.getList();
    },
    currentChange(){
      this.getList();
    },
    inputNum(target){
      this.getList();
    },

    getList() {
      let roleId = this.search.state == -1 ? null : this.search.state;
      let params = {
        current: this.form.pageIndex,
        size: this.form.pageSize,
        admissionTicketCode: this.search.admissionTicketCode,
      };
      console.log(this.dataList.records);
      if(this.search.admissionTicketCode == ""){
        return false;
      }
      this.$axios
        .post('/score/scoreList', params)
        .then((res) => {
          this.dataList.pageIndex = res.result.pageNum;
          this.dataList.total = res.result.total;
          (this.dataList.pageSize = res.result.pageSize), (this.dataList.pages = res.result.pageNum);
          this.dataList.records = res.result.list;
        })
        .catch(() => {});
      // this.search.admissionTicketCode = ""
    },

    save (row) {
      let params = {
        admissionTicketCode: '',
        id: row.id,
        schoolId: 0,
        subjectList: row.subjectList
      }
      this.$axios
        .post('/score/scoreSave', params)
        .then((res) => {
          if(res.code === 200) {
            this.$message({
                message: '保存成功',
                type: 'success',
                duration: 1500,
              })
          }
        })
        .catch(() => {});
    }

  },
  watch: {
    dataList (val) {
      console.log(val,'val---------')
    }
  },
  mounted() {},
  beforeCreate() {},
};
</script>

<style lang="scss" scoped>
@import "./gradesManage.scss";
</style>