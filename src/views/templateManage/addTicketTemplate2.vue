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
               <el-row style="width:200px;text-align: left;padding-left: 10px">
                 <el-checkbox v-model="form.subjectList.zbdw">主办单位</el-checkbox>
               </el-row>
               <el-row style="width:200px;text-align: left;padding-left: 10px">
                 <el-checkbox v-model="form.subjectList.cbdw">承办单位</el-checkbox>
               </el-row>
               <el-row style="width:200px;text-align: left;padding-left: 10px">
                 <el-checkbox v-model="form.subjectList.ksdz">考试地址</el-checkbox>
               </el-row>
               <el-row style="width:200px;text-align: left;padding-left: 10px">
                 <el-checkbox v-model="form.subjectList.kch">考场号</el-checkbox>
               </el-row>
               <el-row style="width:200px;text-align: left;padding-left: 10px">
                 <el-checkbox v-model="form.subjectList.zwh">座位号</el-checkbox>
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
               <div class="bob" id="bob" style="max-height: 666px;overflow: auto">
                 <div class="title" style="height: 172px;text-align: center;color: #fff;margin-bottom: 20px;display: none">
                   <div style="font-size: 70px;font-weight: 700;height: 126px;letter-spacing: 40px;padding-left: 40px;"></div>
                   <div :style="fontSz" v-if="isShow" :class="{ isShow: !isShow }">{{form.examTitle}}</div>
                 </div>
                 <div class="template-example-dom" style="transform: scaleY(0.7);position: relative;top: -40px">
                   <div class="student-info">
                     <div class="warp">

                       <el-row>
                         <el-col :span="12">
                           <div class="name">
                             <div class="left">姓名</div>
                             <div class="right"></div>
                           </div>
                         </el-col>
                         <el-col :span="12">
                           <div class="name" >
                             <div class="left">性别</div>
                             <div class="right"></div>
                           </div>
                         </el-col>
                       </el-row>

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
                   <div class="zbdw" v-if="form.subjectList.zbdw">
                     <div class="left">主办单位</div>
                     <div class="right" style="padding-left: 20px" v-show="isShow">{{form.organizer}}</div>
                   </div>
                   <div class="cbdw zbdw" v-if="form.subjectList.cbdw">
                     <div class="left">承办单位</div>
                     <div class="right" style="padding-left: 20px" v-show="isShow">{{form.undertaker}}</div>
                   </div>

<!--                   <div class="room" >-->
<!--                     <div class="left">机构名称</div>-->
<!--                     <div class="right"></div>-->
<!--                   </div>-->
                   <div class="room" v-if="form.subjectList.ksdz">
                     <div class="left">考试地址</div>
                     <div class="right"></div>
                   </div>
                   <div class="subject-warp">
                     <div class="title1">
                       <div class="line1" style="">考试科目</div>
                       <div class="line2" style="width: 180px">考试时间</div>

                       <div class="line4" v-if="form.subjectList.kch">考场号</div>
                       <div class="line5" v-if="form.subjectList.zwh">座位号</div>
                     </div>
                     <div class="title1" v-for="item in examDetails.subjectList" :key="item.message">
                       <div class="line1" style="height: 40px;line-height: 40px;" ><div v-show="isShow">{{item.subjectName}}</div></div>
                       <div class="line2" style="height: 40px;font-size: 14px;padding-top: 4px;line-height: 16px;width: 180px">
                         <div  v-show="isShow" style="position: relative;top: 8px">
                           {{item.subjectDate}}
                           {{item.subjectStarttime}} - {{item.subjectEndtime}}
                         </div>
                       </div>
                       <div class="line4" style="height: 40px"  v-if="form.subjectList.kch"></div>
                       <div class="line5" v-if="form.subjectList.zwh" style="height: 40px;font-size: 14px;padding-top: 4px;line-height: 16px;">

                       </div>

                     </div>
                   </div>

                 </div>
                 <div v-html="form.carefulMatter" style="padding-top: 15px">
                 </div>

               </div>
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
import VueFroala from 'vue-froala-wysiwyg';



export default {
  components: { Tinymce },
  name: "AddTicketTemplate",
  data() {
    return {
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
      bg_url:"https://topexam.oss-cn-hangzhou.aliyuncs.com/1438790718608093185.png"
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
    let erd = elementResizeDetectorMaker();
    let that = this;
    // erd.listenTo(document.getElementById("bob"), function(element) {
    //   //执行操作
    //   let h = element.scrollHeight;
    //   that.zh = h;
    //
    //   if(h>=660){
    //     that.$message({
    //       message: '模板正面高度超出，请合理规划！',
    //       type: 'warning',
    //     })
    //   }
    // });
    // erd.listenTo(document.getElementById("bob2"), function(element) {
    //   //执行操作
    //   let h = element.scrollHeight;
    //   that.bh = h;
    //
    //   if(h>=650){
    //     that.$message({
    //       message: '模板背面高度超出，请合理规划！',
    //       type: 'warning',
    //     })
    //   }
    // });

  },
  beforeCreate() {

  },
  methods: {

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
            let zdArr = {
              zbdw:"主办单位",
              cbdw:"承办单位",
              ksdz:"考试地址",
              kch:"考场号",
              zwh:"座位号"
            }
            for(let i = 0 ; i < dArr.length; i++){
              for(let a in zdArr){
                if(dArr[i].configName == zdArr[a]){
                  this.form.subjectList[a] = true
                }
              }
            }


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
      if(this.bh>=650){
        this.$message({
          message: '模板背面高度超出，请合理规划！',
          type: 'warning',
        })
        return false
      }
      if(this.zh>=660){
        this.$message({
          message: '模板正面高度超出，请合理规划！',
          type: 'warning',
        })
        return false
      }

      if(!this.form.examNameNo){
        this.$message({
          message: '请先选择考试名称',
          type: 'warning',
        })
        return false
      }

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
        content:this.form.carefulMatter2,
      }

      let zdArr = {
        zbdw:"主办单位",
        cbdw:"承办单位",
        ksdz:"考试地址",
        kch:"考场号",
        zwh:"座位号"
      }


      let subList = this.form.subjectList;
      for(let key in subList){
        if(subList[key]){
          data.configList.push({
            examId:"",
            configName:zdArr[key]
          })
        }
      }


      // let formData = new FormData();
      // let file = this.base64toFile(this.imgUrl);
      // formData.append('ticketFile', file);

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

};
</script>
<style>
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
</style>
<style lang="scss" scoped>
@import "./index.scss";


.bg{
  margin-left: 10px;padding: 30px 16px 80px;width: 499px;height:706px;border-radius: 2px;border: 1px solid #eaeaea;
  background-size: 100%;
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

