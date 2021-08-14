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
                <textarea v-model="form.carefulMatter" style="margin-top:30px"  name="" id="" placeholder="多行输入"></textarea>
            </div>
            <!-- 保存 -->
                <el-button
                @click='getImage'
                 type="primary"
                >生成图片</el-button
              >
            <div class="confirm">
              <el-button type="primary" style="margin-top:30px" @click="examConfirm"> 保存</el-button>
            </div>
        </div>
        <!-- 模板示例 -->
        <div class="template-example" >
              <div class="template-example-dom" ref="ticketFile">
                  <div class="title">
                    <div>准考证</div>
                    <div style="font-size: 24px;">{{form.examTitle}}</div>
                  </div>
                  <div class="student-info">
                    <div class="warp">
                      <div class="name">
                        <div class="left">姓名</div>
                        <div class="right"></div>
                      </div>
                       <div class="zkz">
                        <div class="left">准考证号</div>
                        <div class="right"></div>
                      </div>
                       <div class="sfz">
                        <div class="left">身份证号</div>
                        <div class="right"></div>
                      </div>
                    </div>
                    <div class="student-img">
                      <div>照</div>
                      <div>片</div>
                    </div>
                  </div>
                  <div class="zbdw">
                    <div class="left">主办单位</div>
                    <div class="right"></div>
                  </div>
                  <div class="room">
                  <div class="left">机构</div>
                  <div class="right"></div>
                </div>
                <div class="subject-warp">
                  <div class="title1">
                    <div class="line1">考试科目</div>
                    <div class="line2">检录/考试地点</div>
                    <div class="line3">考场号</div>
                    <div class="line4">座位号</div>
                    <div class="line5">考试时间</div>
                  </div>
                  <div class="title1" v-for="item in examDetails.subjectList" :key="item.message">
                     <div class="line1"></div>
                    <div class="line2"></div>
                    <div class="line3"></div>
                    <div class="line4"></div>
                    <div class="line5"></div>

                  </div>
                </div>

              </div>
          
              <!-- <img class="real_pic" :src="imgUrl" /> -->
        </div>
     
    </div>
  </section>
</template>

<script>
import { apiExamList,apiGetProvinceByExamId,apiGetExamDetails,apiTicketCreate } from '@/api/ticket.js'
import { examinationList,apiRelationStudio } from '@/api/studioManage.js'
import html2canvas from "html2canvas";
export default {
  name: "AddTicketTemplate",
  data() {
    return {
       imgUrl: '',
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
    base64toFile(base64Data) {
      //去掉base64的头部信息，并转换为byte
      let split = base64Data.split(',');
      let bytes = window.atob(split[1]);
        //获取文件类型
        let fileType = split[0].match(/:(.*?);/)[1];
      //处理异常,将ascii码小于0的转换为大于0
      let ab = new ArrayBuffer(bytes.length);
      let ia = new Uint8Array(ab);
      for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      return new Blob([ab], { type: fileType});
    },
    getImage() {
      html2canvas(this.$refs.ticketFile).then(canvas => {
          this.$message({
              message: '图片已生成可以保存模版',
              type: 'success',
            })
        let dataURL = canvas.toDataURL("image/png");
        this.imgUrl = dataURL;
      });
    } ,
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
     transformRequest(obj) {
      var str = []
      for (var p in obj) {
        if (obj[p]) {
          str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
        }
      }
      return str.join('&')
    },
    // 保存
    examConfirm(){
      let data = {
        examId : this.form.examNameNo,
        province: this.form.studentAreaName,
        provinceCode: this.form.studentAreaCode,
        organizer: this.form.organizer,
        examTitle : this.form.examTitle,
        remark: this.form.carefulMatter
      }
    
       if(!this.imgUrl){
          this.$message({
              message: '请点击生成图片之后再保存',
              type: 'error',
            })
            return
      }
      let formData = new FormData();
      let file = this.base64toFile(this.imgUrl);
      formData.append('ticketFile', file);
      let str = this.transformRequest(data)
      let url = `/ticket/ticketCreate?${str}`
      this.$axios
        .post(url, formData)
        .then((res) => {
          if (res) {
            this.$message({
              message: '修改成功',
              type: 'success',
            })
            this.$emit('addSuccess')
          }
        })
        .catch(() => {})
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
    padding-left: 30px;
}
.template-example-dom{
  background: #fff;
  border: 1px #333 solid;
  width: 600px;
  margin-left: 100px;
  .title{
    background: blue;
    display: flex;
    align-items: center;
    flex-direction: column;
    color:#fff;
    font-size: 30px;
  }
  .zbdw,.room{
     display: flex;
        align-items: center;
        border: 1px blue solid;
        height: 40px;
        .left{
          text-align: center;
          width: 80px;
          border-right: 1px blue solid;
          height: 40px;
           line-height: 40px;
        }
  }
  .student-info{
    display: flex;
    .warp{
      display: flex;
      flex-direction: column;
      width: 80%;
      .zkz{
        display: flex;
        align-items: center;
        border: 1px blue solid;
        height: 40px;
        .left{
          text-align: center;
          width: 80px;
          border-right: 1px blue solid;
          height: 40px;
           line-height: 40px;
        }
      }
      .name{
        display: flex;
         align-items: center;
         border: 1px blue solid;
         height: 40px;
        .left{
          text-align: center;
          width: 80px;
          border-right: 1px blue solid;
          height: 40px;
          line-height: 40px;
        }
      }
      .sfz{
        display: flex;
        align-items: center;
        border: 1px blue solid;
        height: 40px;
        
        
         .left{
          text-align: center;
          width: 80px;
          border-right: 1px blue solid;
            height: 40px;
             line-height: 40px;
        }
      }
    }
   
    .student-img{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20%;
      flex-direction: column;
    }
  }
   .subject-warp{
    .title1{
      display: flex;
        align-items: center;
         border: 1px blue solid;
         height: 40px;
         .line1{
            text-align: center;
          width: 80px;
          border-right: 1px blue solid;
            height: 40px;
             line-height: 40px;
         }
        .line2{
            text-align: center;
          width: 150px;
          border-right: 1px blue solid;
            height: 40px;
             line-height: 40px;
         }
                 .line5{
            text-align: center;
          width: 110px;
      
            height: 40px;
             line-height: 40px;
         }
                 .line3{
            text-align: center;
          width: 130px;
          border-right: 1px blue solid;
            height: 40px;
             line-height: 40px;
         }
                 .line4{
            text-align: center;
          width: 125px;
          border-right: 1px blue solid;
            height: 40px;
             line-height: 40px;
         }
    }
  }
}
</style>

