<template>
   <section class="form_border">
    <div class="header">
        准考证模板
      <el-switch
          style="margin-left: 20px"
          v-model="bgValue"
          active-text="正面"
          inactive-text="背面">
      </el-switch>
    </div>
     <el-row>
       <el-col :span="8">
         <!-- 模板信息 -->
         <div class="template">
           <!-- 基本信息 -->
           <div>
             <div class="basic-info">
               <div class="display-center">
                 <div class="title">考试名称</div>
                 <el-select clearable  v-model="form.examNameNo" :disabled="isChead" style="width:200px;margin-left:50px;" placeholder="请选择考试名称" @change="examNameChange">
                   <el-option
                       v-for="item in examNameOption"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
                   </el-option>
                 </el-select>
               </div>
               <div class="display-center">
                 <div class="title">考试标题</div>
                 <el-input v-model="form.examTitle" @input="fontS" style="width:200px;margin-left:50px;"  placeholder="请输入考试标题"  maxlength="35"
                           show-word-limit></el-input>
               </div>
               <div class="display-center">
                 <div class="title">主办单位</div>
                 <el-input v-model="form.organizer" style="width:200px;margin-left:50px;"  placeholder="请输入主办单位" maxlength="20"
                           show-word-limit></el-input>
               </div>
               <div class="display-center">
                 <div class="title">承办单位</div>
                 <el-input v-model="form.undertaker" style="width:200px;margin-left:50px;"  placeholder="请输入承办单位" maxlength="20"
                           show-word-limit></el-input>
               </div>
             </div>
             <!--列表-->
             <el-table
                 style="width: 94%;margin: 0 3%"
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
           </div>

           <!-- 保存 -->
           <el-button
               @click='getImage'
               type="primary"
               style="margin-left: 10px;margin-top: 20px"
           >保存</el-button>
         </div>
       </el-col>
       <el-col :span="16" :md="16" :xl="16" :lg="16">
         <!-- 模板示例 -->
         <el-col :span="8">
           <div class="title" style="padding-left: 10px">模板配置选项</div>
           <div class="display-center" style="padding-top: 10px">
             <div>
               <el-row style="width:200px;text-align: left;padding-left: 10px" v-for="(item,index) in checkList" :key="index">
                 <el-checkbox :value="item.check" @change="checked =>changeCheck(checked,item)">{{item.label}}</el-checkbox>
                 <span class="copy" @click="copyC(item,index)" v-if="!item.isDel"><img src="@/assets/copy.svg" alt=""></span>
                 <span class="copy" @click="delD(item,index)" v-if="item.isDel"><img src="@/assets/del.svg" alt=""></span>
               </el-row>
               <el-row style="width:200px;text-align: left;padding-left: 10px">
                 <el-link icon="el-icon-edit" @click="addCheck">新增自定义</el-link>
               </el-row>

             </div>
           </div>

           <div class="title" style="padding-left: 10px">上传正面图</div>
           <el-upload
               style="width: 96%;padding: 0 2%"
               class="upload-demo"
               action="#"
               ref="upload"
               :auto-upload="false"
               drag
               accept="image/jpeg,image/png,image/jpg"
               :on-change="up_bg"
               >
             <i class="el-icon-upload"></i>
             <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
             <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，建议不超过1MB</div>
           </el-upload>

           <div class="title" style="padding-left: 10px;margin-top: 30px">上传背面图</div>
           <el-upload
               style="width: 96%;padding: 0 2%"
               class="upload-demo"
               action="#"
               ref="upload2"
               :auto-upload="false"
               drag
               accept="image/jpeg,image/png,image/jpg"
               :on-change="up_bg2"
           >
             <i class="el-icon-upload"></i>
             <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
             <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，建议不超过1MB</div>
           </el-upload>
         </el-col>
         <el-col v-show="bgValue" :span="16">
           <div class="template-example" >
             <div class="bg" :style="{backgroundImage:'url('+bg_url+')'}" ref="ticketFile">
               <VueDragResize v-for="(item,index) in resizeList" :parentLimitation="true" :isActive="true" :minh="1" :minw="1" :w="item.width" :h="item.height" :x="item.left" :y="item.top" :parentH="706" v-on:resizing="newRect=>resize(newRect,item)" v-on:dragging="newRect=>resize(newRect,item)" class="resize">
                    <span>{{item.name}}</span>
               </VueDragResize>
             </div>

             <!-- <img class="real_pic" :src="imgUrl" /> -->
           </div>
         </el-col>
         <el-col v-show="!bgValue" :span="16">
           <div class="template-example" >
             <div class="bg" :style="{backgroundImage:'url('+form.carefulMatter2+')'}" ref="ticketFile">
             </div>
           </div>
         </el-col>
       </el-col>

     </el-row>
  </section>
</template>
<script>
import elementResizeDetectorMaker from 'element-resize-detector'
import Tinymce from "@/components/TinymceText/index";
import { apiExamList,apiGetProvinceByExamId,apiGetExamDetails,apiTicketCreate } from '@/api/ticket.js'
import { examinationList,apiRelationStudio } from '@/api/studioManage.js'
import VueDragResize from 'vue-drag-resize'



export default {
  components: { VueDragResize },
  name: "AddTicketTemplate",
  data() {
    return {
      checkList:[
          {"name":'ksmc',label:"考试名称",check:false},
          {"name":'zkzh',label:"准考证号",check:false},
          {"name":'zbdw',label:"主办单位",check:false},
          {"name":'cbdw',label:"承办单位",check:false},
          {"name":'ksdz',label:"考试地址",check:false},
          {"name":'tx',label:"姓名",check:false},
          {"name":'tx',label:"性别",check:false},
          {"name":'tx',label:"学生ID号",check:false},
          {"name":'tx',label:"学生照片",check:false},
          {"name":'kch',label:"考场号",check:false},
          {"name":'zwh',label:"座位号",check:false},
      ],
      resizeList:[],
      bgValue:true,
      bh:"",
      zh:"",
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
      isChead:false,
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
        organizer:"",
        undertaker:"",
        carefulMatter2:"",
        subjectList: {
          zbdw:false,
          cbdw:false,
          ksdz:false,
          kch:false,
          zwh:false
        },
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
      fontSz:"font-size:24px;",
      bg_url:"https://topexam.oss-cn-hangzhou.aliyuncs.com/1438790718608093185.png",
      configList:[],
    };
  },

  created() {
    //接收参数
    this.examId = this.$route.params.examId;
    if(this.examId != undefined){
      this.get_mb();
      this.isChead = true;
    }else{
      this.getExamList()
      this.getList();
    }


  },
  mounted() {

  },
  beforeCreate() {

  },
  methods: {
    copyC(item,index){
      let obj = {
        check: false,
        isDel: true,
        label: item.label,
        name:item.name
      };
      this.checkList.splice(++index,0,obj);
    },
    delD(item,index){
      let is = true;
      this.resizeList.forEach((item2,index)=>{
        if(is){
          if(item.label == item2.name){
            if(is){
              is = false;
              this.resizeList.splice(index,1)
            }
          }
        }
      })
      this.checkList.splice(index,1);
    },
    //新增自定义属性
    addCheck(){
      let leg = 0;
      this.checkList.forEach((item,index)=>{
        if(item.name.indexOf("自定义参数") != -1){
          leg += 1;
        }
      })
      if(leg >=3){
        this.$message({
          type: 'error',
          message: '最多只可自定三个自定义属性！'
        });
        return false;
      }
      this.$prompt('请输入自定义属性名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        let i = 1;
        this.checkList.forEach((item,idnex)=>{
          if(item.name.indexOf("自定义参数") != -1){
            i+=1;
          }
        })
        this.checkList.push({
          name:"自定义参数"+i,
          label:value,
        })
        this.$message({
          type: 'success',
          message: '添加成功！'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    //配置切换
    changeCheck(value,item){
      item.check = !item.check;
      if(item.check){
        if(item.name.indexOf('自定义参数') != -1){
          if(item.isDel){
            this.resizeList.push({
              name:item.label,
              label:item.name,
              width:200,
              height:200,
              left:0,
              top:0,
              isDel: true
            })
          }else{
            this.resizeList.push({
              name:item.label,
              label:item.name,
              width:200,
              height:200,
              left:0,
              top:0,
            })
          }
        }else if(item.isDel){
          this.resizeList.push({
            name:item.label,
            label:item.name,
            width:200,
            height:200,
            left:0,
            top:0,
            isDel: true,
          })
        }else{
          this.resizeList.push({
            name:item.label,
            width:200,
            height:200,
            left:0,
            top:0,
          })
        }
      }else{
        let is = true;
        this.resizeList.forEach((item2,index)=>{
          if(is){
            if(item.label == item2.name){
              if(is){
                is = false;
                this.resizeList.splice(index,1)
              }
            }
          }
        })
      }
    },
    resize(newRect,item) {
      item.width = newRect.width;
      item.height = newRect.height;
      item.top = newRect.top;
      item.left = newRect.left;
    },
    up_bg(file){
      const formData = new FormData();
      formData.append('file',file.raw)
      this.$axios.post("/file/upload",formData).then((res)=>{
        if(res.code == 200){
          this.bg_url = res.result
        }
        this.$refs.upload.clearFiles()
      })
    },
    up_bg2(file){
      const formData = new FormData();
      formData.append('file',file.raw)
      this.$axios.post("/file/upload",formData).then((res)=>{
        if(res.code == 200){
          this.form.carefulMatter2 = res.result
        }
        this.$refs.upload2.clearFiles()
      })
    },
    fontS(){
      var x = this.form.examTitle.length;
      if(x < 14){
        this.fontSz = "font-size:24px;"
      }else {
        this.fontSz = "font-size:16px;line-height: 22px"
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
            this.bg_url=res.result.remark;
            this.form.carefulMatter2 =res.result.content?res.result.content:"";
            this.oddCode = res.result.examId;
            this.oddPro = res.result.provinceCode;
            this.form.undertaker = res.result.undertaker
            this.fontS()
            let dArr = res.result.configList?res.result.configList:[];
            let config = res.result.dynamicConfig;
            if(config){
              config = JSON.parse(config)
            }
            this.checkList = JSON.parse(res.result.nameConfig)

            this.configList = config;
            config.forEach((item,index)=>{
              if(item.label && item.isDel){
                this.resizeList.push({
                  name:item.name,
                  width:item.width,
                  height:item.height,
                  left:item.left,
                  top:item.top,
                  label:item.label,
                })
              }else if(item.label && item.label.indexOf("自定义参数") != -1){
                this.resizeList.push({
                  name:item.name,
                  width:item.width,
                  height:item.height,
                  left:item.left,
                  top:item.top,
                  label:item.label,
                })
              } else{
                this.resizeList.push({
                  name:item.name,
                  width:item.width,
                  height:item.height,
                  left:item.left,
                  top:item.top,
                })
              }
            })

            this.getExamList()
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
      this.examConfirm()
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
        this.checkList.forEach((item,index)=>{
          if(item.name == "sub"){
            item.del = true
          }
        })
        if(!this.oddCode){
          this.examDetails.subjectList.forEach((item,index)=>{
            this.checkList.push({name:"sub", label:item.subjectName+"（科目名）"})
            this.checkList.push({name:"sub", label:item.subjectName+"（考试时间）"})
          })
        }
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
          str.push(p+ '=' + obj[p])
        }
      }
      return str.join('&')
    },
      // 保存
    examConfirm(){
      if(!this.form.examNameNo){
        this.$message({
          message: '请先选择考试名称',
          type: 'warning',
        })
        return false
      }

      let arr = [];
      this.checkList.forEach((item,index)=>{
        if(item.check){
          arr.push(item.label)
        }
      })
      let isArr = [];
      this.resizeList.forEach((item,index)=>{
        if(arr.indexOf(item.name) != -1){
          isArr.push(item)
        }
      })

      let data = {
        examId : this.form.examNameNo,
        province: this.form.studentAreaName,
        provinceCode: this.form.studentAreaCode,
        organizer: this.form.organizer,
        examTitle : this.form.examTitle,
        remark: this.bg_url,
        schoolId:"",
        undertaker:this.form.undertaker,
        configList:[],
        nameConfig:JSON.stringify(this.checkList),
        content:this.form.carefulMatter2,
        dynamicConfig:JSON.stringify(isArr),
      }



      if(this.examId != undefined){
        data.id = this.examId;
        let url = `/ticket/ticketUpdate`
        this.$axios
            .post(url, data)
            .then((res) => {
              if (res.code==200) {
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
        let url = `/ticket/ticketCreate`;
        this.$axios
            .post(url, data)
            .then((res) => {
              if (res) {
                if(res.code == 200){
                  this.$message({
                    message: '添加成功',
                    type: 'success',
                  })
                  this.$router.go(-1);
                  this.$emit('addSuccess')
                }
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
      this.form.examNameNo = ""
      this.form.examName =""
      this.examNameOption.map(item =>{
        if(item.id == e){
          this.form.examNameNo = item.id;
          this.form.examName = item.name
          this.form.studentAreaName = ''
          this.form.studentAreaCode = ''
          this.studentAreaOption = []
          this.getProvinceByExamId()
          this.getExamDetails()

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

};
</script>
<style>
.copy{
  position: relative;
  top: 3px;
  left: 4px;
  cursor: pointer;
}
.ck-editor__main{
  height: 200px;
  border: 1px solid #c4c4c4;
  overflow: auto;
}
.ck-content{
  min-height: 198px;
}
.ck.ck-editor__main>.ck-editor__editable{
  border: none;
}
.tinymce-container{
  width: 94% !important;
  margin:15px 3%;
}
.mce-flow-layout-item.mce-last{
  width: 100% !important;
  overflow: auto;
}
.el-col-md-16{
  margin-top: 5px;
}

.upload-demo .el-upload ,.el-upload-dragger{
  width: 100%;
}
.vdr .content-container{
  /*flex 布局*/
  display: flex;
  display: -webkit-flex;
  /*实现垂直居中*/
  align-items: center;
  /*实现水平居中*/
  align-items:center;
  justify-content:center;
}
</style>
<style lang="scss" scoped>
@import "./index.scss";
.resize{

}

.vdr{
  background: #409eff;
  color: #fff;

}
.bg{
  margin-left: 10px;padding: 30px 16px 80px;width: 499px;height:706px;border-radius: 2px;border: 1px solid #eaeaea;
  background-size: 100%;
  position: relative;
}
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
      border: 1px solid blue;
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
            height: 40px;
             line-height: 40px;
         }
                 .line5{
            text-align: center;
          width: 94px;
                   border-left: 1px blue solid;

                   height: 40px;
             line-height: 40px;
         }
                 .line3{
            text-align: center;
          width: 80px;
            height: 40px;
             line-height: 40px;
         }
                 .line4{
            text-align: center;
          width: 64px;
                   border-left: 1px blue solid;

                   height: 40px;
             line-height: 40px;
         }
    }
  }
}
</style>

