<template>
  <section class="form_border">
    <div class="header">
      <el-form :inline="true" :model="search" class="demo-form-inline" @submit.native.prevent>
        <el-form-item>
          <el-button type="primary" @click="go">下载试卷</el-button>
        </el-form-item>
        <el-form-item>
          <el-select clearable  v-model="search.score"  placeholder="查询分数条件"  style="margin-right: 5px">
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
              <el-input v-model="search.min" placeholder="分数1" style="width: 80px" :min="0" :max="100" type="number" class="nn"     @change="tip"></el-input>
            </el-col>
            <el-col :span="4" style="text-align: center">至</el-col>
            <el-col :span="10">
              <el-input
                  class="nn"
                  @change="tip"
                  v-model="search.max"
                  placeholder="分数2"
                  style="width: 80px"
                  type="number"
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
        <el-form-item>
          <el-button type="primary" @click="onSubmit2">导出试卷</el-button>
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
        label="机构编码"
        header-align="center"
        align="center"
        prop="studioCode"
      >
      </el-table-column>

      <el-table-column
        label="机构名称"
        header-align="center"
        align="center"
        prop="studioName"
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
          label="生源省份"
          header-align="center"
          align="center"
          prop="province"
      >
      </el-table-column>
      <template v-if="dataList.records.length>0">
        <el-table-column v-for="(item, index) in dataList.records[0].subjectList" :label="item.subjectName" header-align="center" align="center">
          <template slot-scope="scope">
            {{scope.row.subjectList[index].score}}
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
      <el-table-column label="试卷信息" header-align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="save(scope.row)">查看试卷</el-button>
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
            <img :src="o.img" class="image" style="width: 100%">
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
      listLoading: false,
      dialogTableVisible:false,
      gridData:[],
      sjList:[],
      courseList:[],
      //新增界面数据
      search: {
        admissionTicketCode : "",
        archiveStatus:"",
        examType:"",
        examName:"",
        score:""
      },

      form: {
        pageIndex: 1,
        pageSize: 10,
      },
      archiveStatus: [
        { name: '全部状态', id: "" },
        { name: '未归档', id: 0 },
        { name: '已归档', id: 1 },
      ],
      examType: [
        { name: '全部类型', id: "" },
        { name: '机构考试', id: 0 },
        { name: '联合考试', id: 1 },
        { name: '线下考试', id: 2 },
      ],
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
        examId:""//考试名称
      },

      dataList: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [
        {
          'id': 1,'data': 2,'sales': 3,'salt': 4,'const': 5, 'profit': 6
        }
      ] },
      subjectName1: false,
      subjectName2: false,
      subjectName3: false,
      subjectName4: false,
      arr:[],
      examNameOption:[],
      options:[],
      daochu:"",
    };
  },
  created() {
    this.getList();
    this.getProvinceList()
    this.getExamList()
    this.getExamDetails()
  },

  methods: {
    go(){
      this.$router.push({path:"/daochuList",query:{type:'exam_paper'}})
    },
    tip(value){
      if(!(this.examId && this.search.score)){
        if(value != ""){
          this.$message.error('请先确定查询分数条件！');
        }
      }
    },
    // 考试改变监听
    examNameChange(e){
      this.examId = ""
      this.form.examName = ""
      this.courseList = []
      this.search.score = ""
      this.examNameOption.map(item =>{
        if(item.id == e){
          this.form.examName = item.name
          this.examId = item.id
          this.getExamDetails()
        }
      })
    },
    // 查询考试列表
    getExamList(){
      apiExamList().then(res=>{
        this.examNameOption = res.result
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
    onSubmit2() {
      if(!this.daochu){
        this.$message.error('请先根据条件查询！');
        return false
      }
      let params = {
        current: this.daochu.current,
        size: this.daochu.size,
        "schoolId": "",
        "admissionTicketCode": this.daochu.admissionTicketCode,
        "examId": this.daochu.examId,
        "examineeName": this.daochu.examineeName,
        "provinceCode": "",
        "scoreEnd": this.daochu.scoreEnd,
        "scoreStart": this.daochu.scoreStart,
        "studioId": "",
        "studioName": this.daochu.studioName,
        "subject": this.daochu.subject,
      };
      this.$axios
          .post('/score/examPaperExport', params)
          .then((res) => {
            this.$message.success('已提交导出请求，请稍后到下载试卷查看！');
          })
          .catch(() => {});
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

      if(this.search.max|| this.search.min){
        if(!this.examId || !this.search.score){
          this.$message.error('请先确定查询分数条件！');
          return false
        }
      }

      this.examId = this.$route.query.id

      let params = {
        current: this.form.pageIndex,
        size: this.form.pageSize,
        "schoolId": "",
        "admissionTicketCode": this.search.admissionTicketCode,
        "examId": this.$route.query.id,
        "examineeName": this.search.examineeName,
        "provinceCode": "",
        "scoreEnd": this.search.max,
        "scoreStart": this.search.min,
        "studioId": "",
        "studioName": this.search.studioName,
        "subject": this.search.score,
      };
      this.daochu = params;
      this.$axios
        .post('/score/hisFileDetailList', params)
        .then((res) => {
          this.dataList.pageIndex = res.result.pageNum;
          this.dataList.total = res.result.total;
          (this.dataList.pageSize = res.result.pageSize), (this.dataList.pages = res.result.pageNum);
          this.dataList.records = res.result.list;
        })
        .catch(() => {});
      // this.search.admissionTicketCode = ""
    },

    save(row) {
      this.sjList = row.subjectList;
      this.dialogTableVisible = true

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

<style lang="scss" scoped>
@import "./gradesManage.scss";
.el-form-item{
  margin-bottom: 10px;
}
.header{
  padding-bottom: 0;
}
</style>