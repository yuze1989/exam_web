<template>
   <section class="form_border">
    <div class="header">
        准考证模板
    </div>
    <div class="container">
        <!-- 模板信息 -->
        <div class="template">
              <!-- 基本信息 -->
            <div class="basic-info">
                <div class="display-center">
                    <div class="title">考试名称</div>
                     <el-select v-model="form.examNameNo" style="width:200px;margin-left:50px;" placeholder="请选择考试名称" @change="examNameChange">
                        <el-option
                            v-for="item in examNameOption"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                    </el-select>
                </div>
               <div class="display-center">
                    <div class="title">考生省份</div>
                      <el-select v-model="form.studentAreaCode" style="width:200px;margin-left:50px;" placeholder="请选择考生省份" @change="studentChange">
                        <el-option
                            v-for="item in studentAreaOption"
                            :key="item.provinceCode"
                            :label="item.province"
                            :value="item.provinceCode">
                        </el-option>
                    </el-select>
               </div>
              <div class="display-center">
                   <div class="title">主办单位</div>
                   <el-input v-model="form.organizer" style="width:200px;margin-left:50px;"  placeholder="请输入主办单位"></el-input>
              </div>
              <div class="display-center">
                   <div class="title">考试标题</div>
                   <el-input v-model="form.examTitle" style="width:200px;margin-left:50px;"  placeholder="请输入考试标题" ></el-input>
              </div>
            </div>
             <!--列表-->
            <el-table
            :data="examDetails.subjectList"
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
                label="科目"
                header-align="center"
                align="center"
                prop="subjectName"
            >
            </el-table-column>
            <el-table-column
                label="考试日期"
                header-align="center"
                align="center"
                prop="subjectDate"
            >
            </el-table-column>
            <el-table-column
                label="考试开始时间"
                header-align="center"
                align="center"
                prop="subjectStarttime"
            >
            </el-table-column>
             <el-table-column
                label="考试结束时间"
                header-align="center"
                align="center"
                prop="subjectEndtime"
            >
            </el-table-column>
            </el-table>
            <!-- 注意事项 -->
            <div class="careful-matter">
                <textarea v-model="form.carefulMatter" name="" id="" placeholder="多行输入"></textarea>
            </div>
            <!-- 保存 -->
            <div class="confirm">
              <el-button type="primary" @click="examConfirm"> 保存</el-button>
            </div>
        </div>
        <!-- 模板示例 -->
        <div class="template-example">

        </div>

    </div>
   
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <myPagination
        :current.sync="form.pageIndex"
        :pages.sync="data.pages"
        :size.sync="form.pageSize"
        :total.sync="data.total"
        @cb="currentChange"
      />
    </el-col>
  </section>
</template>

<script>
import { apiExamList,apiGetProvinceByExamId,apiGetExamDetails } from '@/api/ticket.js'
import { examinationList,apiRelationStudio } from '@/api/studioManage.js'
export default {
  name: "AddTicketTemplate",
  data() {
    return {
       listLoading: false,
      sels: [], //列表选中列
      examDetails: {
        subjectList: []
      }, // 考试详情
      search: {
        name: "",
        mobilePhone: "",
      },
      studentAreaOption: [],
      examNameOption: [],
      form: {
        pageIndex: 1,
        size: 10,
        studentAreaName: "",
        studentAreaCode: "",
        examName: "",
        examNo:"",
        examNameNo: "",
        carefulMatter: '',
        examTitle: ''
      },

      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [
        {
         
        }
      ] },
      isAdd: false,
      isAddType: 1, //1新增  0编辑
      editItemData: {},
    };
  },
  created() {
     this.getExamList()
     this.getList();
  },

  methods: { 
    // 查询考试详情
    getExamDetails(){
      apiGetExamDetails({
        id: this.form.examNameNo
      }).then(res=>{
        this.examDetails = res.result
      })
    },
    // 查询考试下的省份
    getProvinceByExamId(){
      apiGetProvinceByExamId({
        examId: this.form.examNameNo
      }).then(res=>{
        this.studentAreaOption = res.result
      })
    },
    // 查询考试列表
    getExamList(){
      apiExamList().then(res=>{
        this.examNameOption = res.result
      })
    },
    // 保存
    examConfirm(){
      let data = {
        examId : this.form.examNameNo,
        province: this.form.studentAreaName,
        provinceCode: this.studentAreaCode,
        organizer: this.form.organizer,
        examTitle : this.form.examTitle,
        remark: this.form.carefulMatter
      }
      let formData = new FormData();
    },
    // 新建模板
    addTemplate(){
        
    },
  // 获取列表
    getList() {
      let params = {
        current : this.form.pageIndex ,
        size : this.form.size ,
        name : this.form.examName,
        no:  this.form.examNo
      };
      examinationList(params).then((res) => {
        this.data.records = res.result.records;
        this.data.current = res.result.current;
        this.data.total = res.result.total;
        (this.data.size = res.result.pageSize), (this.data.pages = res.result.pages);
      })
      .catch(() => {});
    },
  // 考试改变监听
    examNameChange(e){
      this.examNameOption.map(item =>{
        if(item.id == e){
          this.form.examName = item.name
          this.form.studentAreaName = ''
          this.form.studentAreaCode = ''
          this.studentAreaOption = []
          this.getExamDetails()
          this.getProvinceByExamId()
        }
      })
    },
      // 考生省份改变监听
    studentChange(e){
      this.studentAreaOption.map(item =>{
        if(item.provinceCode == e){
          this.form.studentAreaName = item.province
        }
      })
    },
   currentChange() {
      //console.log('index' + index)
      this.getList();
    },
  },
  mounted() {},
  beforeCreate() {},
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
.header{
display: flex;
padding-left:200px;
}
.display-center{
    display: flex;
    align-items: center;
    padding-left: 50px;
    margin-bottom: 20px;

}
.container{
    display: flex;
}
</style>

