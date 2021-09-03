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
                     <el-select clearable  v-model="form.examNameNo" style="width:200px;margin-left:50px;" placeholder="请选择考试名称" @change="examNameChange">
                        <el-option
                            v-for="item in examNameOption"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                    </el-select>
                </div>
<!--               <div class="display-center">-->
<!--                    <div class="title">考生省份</div>-->
<!--                      <el-select clearable  v-model="form.studentAreaName" style="width:200px;margin-left:50px;" placeholder="请选择考生省份" @change="studentChange">-->
<!--                        <el-option-->
<!--                            v-for="item in studentAreaOption"-->
<!--                            :key="item.provinceCode"-->
<!--                            :label="item.province"-->
<!--                            :value="item.provinceCode">-->
<!--                        </el-option>-->
<!--                    </el-select>-->
<!--               </div>-->
              <div class="display-center">
                   <div class="title">主办单位</div>
                   <el-input v-model="form.organizer" style="width:200px;margin-left:50px;"  placeholder="请输入主办单位"></el-input>
              </div>
              <div class="display-center">
                   <div class="title">考试标题</div>
                   <el-input v-model="form.examTitle" @change="fontS" style="width:200px;margin-left:50px;"  placeholder="请输入考试标题" ></el-input>
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
              <el-input
                  type="textarea"
                  placeholder="备注信息"
                  v-model="form.carefulMatter"
                  maxlength="100"
                  rows="6"
                  style="margin: 15px 0"
                  show-word-limit
              >
              </el-input>
            </div>
            <!-- 保存 -->
                <el-button
                @click='getImage'
                 type="primary"
                >保存</el-button
              >
<!--            <div class="confirm">-->
<!--              <el-button type="primary" style="margin-top:30px" @click="examConfirm"> 保存</el-button>-->
<!--            </div>-->
        </div>
        <!-- 模板示例 -->
        <div class="template-example" >
          <div class="bg" style="background: #f1f1f1;margin-left: 100px; padding: 30px 30px 80px;width: 499px;border-radius: 2px" ref="ticketFile">
            <div class="title" style="height: 172px;background: #4a4a98;text-align: center;color: #fff;margin-bottom: 20px">
              <div style="font-size: 70px;
    font-weight: 700;
    letter-spacing: 40px;
    padding-left: 40px;">准考证</div>
              <div :style="fontSz" v-if="isShow" :class="{ isShow: !isShow }">{{form.examTitle}}</div>
            </div>
            <div class="template-example-dom" >

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
                <div class="right" style="padding-left: 20px" v-show="isShow">{{form.organizer}}</div>
              </div>
              <div class="room">
                <div class="left">机构</div>
                <div class="right"></div>
              </div>
              <div class="subject-warp">
                <div class="title1">
                  <div class="line1" style="">考试科目</div>
                  <div class="line2">检录/考试地点</div>
                  <div class="line3">考场号</div>
                  <div class="line4">座位号</div>
                  <div class="line5">考试时间</div>
                </div>
                <div class="title1" v-for="item in examDetails.subjectList" :key="item.message">
                  <div class="line1" style="height: 40px;line-height: 40px;" ><div v-show="isShow">{{item.subjectName}}</div></div>
                  <div class="line2" style="height: 40px"></div>
                  <div class="line3" style="height: 40px"></div>
                  <div class="line4" style="height: 40px"></div>
                  <div class="line5" style="height: 40px;padding-top: 4px;line-height: 16px;font-size: 14px">
                      <div  v-show="isShow">
                        {{item.subjectDate}}
                        {{item.subjectStarttime}} - {{item.subjectEndtime}}
                      </div>
                  </div>

                </div>
              </div>

            </div>
            <div v-if="isShow" v-html="form.carefulMatter.replace(/\n|\r\n/g, '<br>')" style="padding-top: 15px">
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
        examTitle: '',
        organizer:""
      },
      isShow:true,

      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [
        {
         
        }
      ] },
      isAdd: false,
      isAddType: 1, //1新增  0编辑
      editItemData: {},
      examId:"",
      oddCode:"",
      oddPro:"",
      fontSz:"font-size:24px;"
    };
  },
  created() {


    //接收参数
    this.examId = this.$route.params.examId;
    if(this.examId != undefined){
      this.get_mb();
    }else{
      this.getExamList()
      this.getList();
    }
  },
  methods: {
    fontS(){
      var x = this.form.examTitle;
      if(x < 14){
        this.fontSz = "font-size:24px;"
      }else {
        this.fontSz = "font-size:16px;"
      }


    },
    //获取模板详情
    get_mb(){
      this.$axios
          .post('/ticket/ticketDetail?id='+this.examId)
          .then((res) => {
            this.form.studentAreaName =res.result.province;
            this.form.studentAreaCode =res.result.provinceCode;
            this.form.organizer =res.result.organizer;
            this.form.examTitle =res.result.examTitle;
            this.form.carefulMatter =res.result.remark;
            this.oddCode = res.result.examId;
            this.oddPro = res.result.provinceCode;
            this.getExamList()
            this.getList();
          })
          .catch(() => {});
    },
    addImg(event){
      let inputDOM = this.$refs.inputer;
      // 通过DOM取文件数据
      this.file = inputDOM.files[0];
    },
    base64toFile(dataurl) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], '截图.png', {type:mime});
    },
    getImage() {
      this.isShow = false;
      var that = this;
      setTimeout(function (){
        html2canvas(that.$refs.ticketFile).then(canvas => {
          // this.$message({
          //     message: '图片已生成可以保存模版',
          //     type: 'success',
          //   })
          let dataURL = canvas.toDataURL("image/png");
          that.imgUrl = dataURL;

          var a = that;
          setTimeout(function (){
            a.show()
          },100)

          that.examConfirm()
        });
      },10)

    } ,

    show(){
      this.isShow = true;
    },

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
        this.studentAreaOption = res.result;
        if(this.oddPro){
          this.studentChange(this.oddPro)
        }
      })
    },
    // 查询考试列表
    getExamList(){
      apiExamList().then(res=>{
        this.examNameOption = res.result;
        if(this.oddCode){
          this.examNameChange(this.oddCode)
        }
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
        remark: this.form.carefulMatter,
        schoolId:""
      }


      let formData = new FormData();
      let file = this.base64toFile(this.imgUrl);
      formData.append('ticketFile', file);

      if(this.examId != undefined){
        data.id = this.examId;
        let url = `/ticket/ticketUpdate?`+this.transformRequest(data);
        this.$axios
            .post(url, formData)
            .then((res) => {
              if (res) {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                })
                this.$router.go(-1);
                this.$emit('addSuccess')
              }
            })
            .catch(() => {})
      }else{
        let url = `/ticket/ticketCreate?`+this.transformRequest(data);
        this.$axios
            .post(url, formData)
            .then((res) => {
              if (res) {
                this.$message({
                  message: '添加成功',
                  type: 'success',
                })
                this.$router.go(-1);
                this.$emit('addSuccess')
              }
            })
            .catch(() => {})
      }



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
          this.form.examNameNo = item.id;
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
          this.form.studentAreaCode = item.provinceCode
        }
      })
    },
   currentChange() {
      //console.log('index' + index)
      this.getList();
    },
  },
  mounted() {},
  beforeCreate() {

  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
.isShow{
  opacity: 0;
}
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
          width: 116px;
          border-right: 1px blue solid;
            height: 40px;
             line-height: 40px;
         }
                 .line5{
            text-align: center;
          width: 94px;
      
            height: 40px;
             line-height: 40px;
         }
                 .line3{
            text-align: center;
          width: 80px;
          border-right: 1px blue solid;
            height: 40px;
             line-height: 40px;
         }
                 .line4{
            text-align: center;
          width: 64px;
          border-right: 1px blue solid;
            height: 40px;
             line-height: 40px;
         }
    }
  }
}
</style>

