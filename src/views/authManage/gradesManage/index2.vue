<template>
  <section class="form_border">
    <div class="header">
      <el-form :inline="true" :model="search" class="demo-form-inline" @submit.native.prevent>
        <el-form-item>
          <el-select clearable  v-model="form.examNameNo"  placeholder="请选择考试名称" @change="examNameChange" style="margin-right: 5px">
            <el-option
                v-for="item in examNameOption"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable  v-model="search.score"  placeholder="查询分数条件" style="margin-right: 5px">

            <el-option
                v-for="item in courseList"
                :key="item.name"
                :label="item.name"
                :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-row style="margin-right: 20px">
            <el-col :span="10" style="position: relative;left: -10px">
              <el-input v-model="search.min" placeholder="分数1" style="width: 80px" :min="0" :max="100" type="number" class="nn" @change="tip"></el-input>
            </el-col>
            <el-col :span="4" style="text-align: center">至</el-col>
            <el-col :span="10">
              <el-input
                  class="nn"
                  v-model="search.max"
                  placeholder="分数2"
                  style="width: 80px"
                  type="number"
                  @change="tip"
                  :min="0" :max="100"
              ></el-input>
            </el-col>
          </el-row>


        </el-form-item>


        <el-form-item>
          <el-input
              v-model="search.studioName"
              placeholder="请输入机构名称"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-input
              v-model="search.admissionTicketCode"
              placeholder="请输入准考证号"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
              v-model="search.examineeName"
              placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select clearable
                     v-model="selections.provinceCode"
                     placeholder="生源省份"
                     value-key="province"
                     clearable
                     filterable
          >
            <el-option
                v-for="item in options"
                :key="item.provinceCode"
                :label="item.province"
                :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
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
        label="身份证号码"
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
        label="生源省份"
        header-align="center"
        align="center"
        prop="province">
      </el-table-column>
      <template v-if="dataList.records.length>0">
        <el-table-column v-for="(item, index) in dataList.records[0].subjectList" :label="item.subjectName" header-align="center" align="center">
          <template slot-scope="scope">
            <div v-text="scope.row.subjectList[index].score"></div>
<!--            <el-input  @keyup.enter.native="save(scope.row)"></el-input>-->
          </template>
        </el-table-column>
      </template>

      <el-table-column
          label="总分"
          header-align="center"
          align="center"
          prop="score"
      >
      </el-table-column>
      <el-table-column
          label="机构内排名"
          header-align="center"
          align="center"
          prop="rankInStudio"
      >
      </el-table-column>
      <el-table-column
          label="总排名"
          header-align="center"
          align="center"
          prop="rankInProvince"
      >
      </el-table-column>
      <el-table-column label="操作" width="130" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="save(scope.row)"
          >详情</el-button
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
    <!--    查看试卷-->
    <el-dialog title="试卷信息" :visible.sync="dialogTableVisible">
      <el-row>
        <el-col :span="8" v-for="(o, index) in sjList" :key="o" style="padding: 10px">
          <el-card :body-style="{ padding: '0px' }">
            <img :src="o.img" class="image" style="max-width: 210px">
            <div style="padding: 14px;">
              <div>科目名称：{{o.subjectName}}</div>
              <div>分数：{{o.score}}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
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
      options:[],
      listLoading: false,
      dialogTableVisible:false,
      sjList:[],
      courseList:[],
      //新增界面数据
      search: {
        admissionTicketCode : "",
        score:""
      },
      form: {
        pageIndex: 1,
        pageSize: 10,
      },
      examNameOption: [],
      selections: {
        size: 10,
        current: 1,
        proviceName: '', //选择省份
        examineeName: '', //学生姓名
        examName: '',
        provinceCode: '',
        roomCode: '',
        schoolId: '',
        admissionTicketCode:"",//准考证号
        studioName:"",//机构名称
        score:"",//科目
        min:"",//科目
        max:"",//科目
        examId:sessionStorage.getItem("examId")?sessionStorage.getItem("examId"):""//考试名称
      },

      dataList: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [
      ] },
      subjectName1: false,
      subjectName2: false,
      subjectName3: false,
      subjectName4: false,
      arr:[],
      examId:sessionStorage.getItem("examId")?sessionStorage.getItem("examId"):"",
    };
  },
  created() {
    this.getList();
    this.getProvinceList()
    this.getExamList()
  },

  methods: {
    tip(value){
      if(!(this.examId && this.search.score)){
        if(value != ""){
          this.$message.error('请先确定考试名称和查询分数条件！');
        }
      }
    },
    // 查询考试列表
    getExamList(){
      apiExamList().then(res=>{
        this.examNameOption = res.result
        if(sessionStorage.getItem('examId')){
          this.examNameChange(sessionStorage.getItem('examId'))
        }
      })
    },
    // 考试改变监听
    examNameChange(e){
      this.examId = ""
      this.form.examName = ""
      this.courseList = [];
      this.search.score = ""
      this.examNameOption.map(item =>{
        if(item.id == e){
          this.form.examNameNo = item.name
          this.examId = item.id
          this.getExamDetails()
        }
      })
    },
    // 查询考试下的科目
    getExamDetails(){
      this.$axios.get(
          '/examsubject/listByExamId?examId='+this.examId
      ).then(res=>{
        this.courseList = [{key:"总分",name:"总分"}];
        res.result.forEach((item,index) =>{
          this.courseList.push({
            key: index,
            name: item.subjectName,
          })
        })
      })
    },
    getProvinceList() {
      this.$axios
          .get(this.API.studentsManage.examRoomProvince)
          .then((res) => {
            this.options = res.result || []
          })
          .catch(() => {})
    },
    onSubmit() {
      this.getList();
    },
    currentChange(){
      this.getList();
    },
    inputNum(target){
      let timenow = target.timeStamp;
      let iscontu = true;
      this.arr.push(timenow);
      let i;
      for(i in this.arr){
        if(Math.ceil(this.arr[this.arr.length-1]) - Math.ceil(this.arr[this.arr.length-2]) < 3000){
          iscontu = true;

        }else{
          iscontu = false;

        }
        if(i>0 && this.arr.length == parseInt(i)+1){
          if(iscontu == true){
            return
          }
        }
      }
    },

    getList() {
      let roleId = this.search.state == -1 ? null : this.search.state;
      if(this.search.max || this.search.min ){
        if(!this.examId || !this.search.score){

          this.$message.error('请先确定考试名称和查询分数条件！');
          return false
        }
      }


      let params = {
        current: this.form.pageIndex,
        size: this.form.pageSize,
        admissionTicketCode: this.search.admissionTicketCode,
        "examineeName": this.search.examineeName,
        "provinceCode":this.selections.provinceCode.provinceCode,
        "schoolId": "",
        "scoreEnd": this.search.max,
        "scoreStart": this.search.min,
        "studioId": "",
        "studioName": this.search.studioName,
        "subject": this.search.score,
        examId:this.examId
      };
      if(this.examId){
        sessionStorage.setItem("examId",this.examId)
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
    },

    save (row) {
      this.$axios
        .get('/score/scoreDetail?ticketCode='+row.admissionTicketCode)
        .then((res) => {
          if(res.code === 200) {
            this.sjList = res.result;
            this.dialogTableVisible = true
          }
        })
        .catch(() => {});
    }

  },
  watch: {
    dataList (val) {

    }
  },
  mounted() {},
  beforeCreate() {},
};
</script>

<style lang="scss">
@import "./gradesManage.scss";
.nn{
  input{
    padding: 0;
    padding-left: 10px;

  }
}
</style>
<style scoped>
.el-form-item{
  margin-bottom: 10px;
}
.header{
  padding-bottom: 0;
}
</style>