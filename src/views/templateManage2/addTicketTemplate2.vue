<template>
  <section class="form_border">
    <div class="header">
      二维码模板
    </div>
    <div class="container">
      <!-- 模板信息 -->
      <div class="template">
        <!-- 基本信息 -->
        <div class="basic-info">
          <div class="display-center">
            <div class="title">考试名称</div>
            <el-select clearable  v-model="form.examNameNo" :disabled="this.$route.params.examId" style="width:200px;margin-left:50px;" placeholder="请选择考试名称" @change="examNameChange">
              <el-option
                  v-for="item in examNameOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="display-center">
            <div class="title">二维码名称</div>
            <el-input v-model="form.qrcodeName" style="width:200px;margin-left:34px;"  placeholder="请输入二维码名称"></el-input>
          </div>
          <div class="display-center">
            <div class="title">二维码大小</div>
            <el-select clearable  v-model="form.sizeType" style="width:200px;margin-left:34px;" placeholder="请选择二维码大小" @change="sizeTypeChange">
              <el-option
                  v-for="item in sizeTypeOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="display-center">
            <div class="title">二维码字段</div>
            <div>
              <el-checkbox-group v-model="checkList" @change="checkChange">
                <div v-for="(item, index) in resizeList" :key="index" style="width:200px;text-align: left;padding-left: 30px">
                  <el-checkbox :label="item.name" :disabled="item.disabled"></el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div class="confirm">
          <el-button type="primary" style="margin-top:30px;margin-left: 150px" @click="examConfirm"> 保存</el-button>
        </div>
      </div>
      <!-- 模板示例 -->
      <div class="template-example" >


        <div class="bg" style="background: #fff;margin-left: 100px; padding: 20px;position:absolute;">
          <div  :class="class1" ref="ticketFile">
            <div class="title" @drop="drop" @dragover.prevent>
              <div class="top" style="padding-top: 20px">
                <vue-drag-resize v-for="(item, index) in resizeList" v-if="item.checked" :key="index" :w="item.width" :x="item.left" :h="item.size" :y="item.top" :minw="100" :minh="10" @activated="activated(item)" @resizing="resizing($event, item)" @dragging="resizing($event, item)">
                  <div :style="{ fontSize: item.size + 'px' }" style="line-height: 1">{{ item.desc }}</div>
                </vue-drag-resize>
              </div>
              <vue-drag-resize :w="resizeImg.width" :x="resizeImg.left" :h="resizeImg.height" :y="resizeImg.top" :minw="100" :minh="100" @resizing="resizeImg = $event" @dragging="resizeImg = $event">
                <img src="@/assets/erweima.png" alt=""  style="">
              </vue-drag-resize>
            </div>
          </div>
        </div>

        <!-- <img class="real_pic" :src="imgUrl" /> -->
      </div>

    </div>
  </section>
</template>

<script>
import { apiExamList,apiGetProvinceByExamId,apiGetExamDetails,apiTicketCreate,apiGetSubjectList} from '@/api/ticket.js'
import { examinationList,apiRelationStudio } from '@/api/studioManage.js'
import VueDragResize from 'vue-drag-resize'
import html2canvas from "html2canvas";
export default {
  name: "AddTicketTemplate",
  components: { VueDragResize },
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
      sizeTypeOption:[
        {id:1,name:"5 x 3 比例"},
        {id:0,name:"6.3 x 2.3 比例"},
      ],
      studentAreaOption: [],
      examNameOption: [],
      class1:"class1 template-example-dom",
      class2:"bottom",
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
        qrcodeName:"",
        sizeType:1,
        sizeId:"",
        subjectList: {
          zkzh:true,
          sfzhm:false,
          xm:false,
          km:true,
          kc:false,
          xb:false,
          ksbh:false,
          ksdz:false,
          zwh:false,
          jgbh:false,
        },
      },
      isShow:true,
      leg:0,
      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [
          {

          }
        ] },
      isAdd: false,
      isAddType: 1, //1新增  0编辑
      editItemData: {},
      examId:"",
      resizeList: [{
        name: '科目', desc: '科目：素描', width: 150, size: 20, left: 25, top: 10, checked: true, disabled: true
      }, {
        name: '准考证号', desc: '准考证：E0000000001', width: 300, size: 20, left: 25, top: 40, checked: true, disabled: true
      }, {
        name: '考场', desc: '考场：001', width: 100, size: 20, left: 25, top: 60, checked: false, disabled: false
      }, {
        name: '考试编号', desc: '考试编号：100101', width: 200, size: 20, left: 25, top: 80, checked: false, disabled: false
      }, {
        name: '考试地址', desc: '考试地址：杭州市滨江区', width: 300, size: 20, left: 25, top: 100, checked: false, disabled: false
      }, {
        name: '学生ID号', desc: '学生ID号：330591208808080808', width: 400, size: 20, left: 25, top: 120, checked: false, disabled: false
      }, {
        name: '性别', desc: '性别：男', width: 100, size: 20, left: 25, top: 140, checked: false, disabled: false
      }, {
        name: '姓名', desc: '姓名：张三', width: 100, size: 20, left: 25, top: 160, checked: false, disabled: false
      }, {
        name: '座位号', desc: '座位号：01', width: 150, size: 20, left: 25, top: 180, checked: false, disabled: false
      }, {
        name: '机构编号', desc: '机构编号：A_0001', width: 200, size: 20, left: 25, top: 200, checked: false, disabled: false
      }],
      checkList: ['科目', '准考证号'],
      resizeImg: {
        left: 280,
        top: 80,
        width: 200,
        height: 200
      }
    };
  },
  created() {
    this.getExamList()
    this.getList();
    //接收参数
    this.examId = this.$route.params.examId;
    if(this.examId != undefined){
      this.get_mb();
    }
  },

  methods: {
    checkChange(e) {
      if (e.length > 7) {
        this.$message.error('最多可展示7个字段，请合理分配！')
        this.checkList.pop()
        return
      }
      
      this.syncChecked()
    },
    syncChecked() {
      this.resizeList.forEach(item => {
        item.checked = this.checkList.includes(item.name)
      })
    },
    activated(item) {
      this.activeItem = item
    },
    resizing(e, item) {
      item.width = e.width
      item.size = e.height
      item.left = e.left
      item.top = e.top
      this.activeItem = item
    },
    change1(){

      let obj = this.form.subjectList
      let leg = 0;
      for(let i in obj){
        if(obj[i]){
          leg +=1;
        }
      }
      this.leg = leg;
      if(this.leg > 7){
        this.$message({
          message: '最多可展示7个字段，请合理分配！',
          type: 'error',
        })
        return
      }
    },
    drop(event){
      var num,num2;
      this.droppedItem = event.dataTransfer.getData("item");
      num = ChineseJudgementJ(this.droppedItem);//中文
      num2 = numberJudge(this.droppedItem);//中文

      if(num != ""){
        this.droppedItem =num;
      }else{
        this.droppedItem = ""
      }
      if(num2 != ""){

      }
    },
    dragstart(data,event){
      event.dataTransfer.setData("item",data)
    },
    dragend(event){
      event.dataTransfer.clearData()
    },
    //获取模板详情
    get_mb(){
      this.$axios
          .post('/ticket/qrCodeDetail?id='+this.examId)
          .then((res) => {
            this.form.examNameNo = res.result.examId;
            this.form.studentAreaName =res.result.province;
            this.form.studentAreaCode =res.result.provinceCode;
            this.form.qrcodeName =res.result.qrcodeName;
            // this.sizeTypeChange(res.result.sizeType)

            let dArr = res.result.subjectList;
            let zdArr = {
              kc:"考场",
              km:"科目",
              ksbh:"考试编号",
              ksdz:"考试地址",
              sfzhm:"学生ID号",
              xb:"性别",
              xm:"姓名",
              zkzh:"准考证号",
              zwh:"座位号",
              jgbh:"机构编号",
            }

            this.checkList = dArr.map(item => item.subjectName)
            this.syncChecked()

            for(let i = 0 ; i < dArr.length; i++){
              for(let a in zdArr){
                if(dArr[i].subjectName == zdArr[a]){
                  this.form.subjectList[a] = true
                }
              }
            }
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
    //查询科目详情 apiGetSubjectList
    geSubjectList(){
      apiGetSubjectList({
        examId: this.form.examNameNo
      }).then(res=>{

        // this.studentAreaOption = res.result
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
          str.push(p + '=' + obj[p])
        }
      }
      return str.join('&')
    },
    // 保存
    examConfirm(){
      console.log(this.resizeList.filter(item => item.checked))
      console.log(this.resizeImg)

      if(this.leg > 7){
        this.$message({
          message: '最多可展示7个字段，请合理分配！',
          type: 'error',
        })
        return
      }
      let data = {
        examId : this.form.examNameNo,
        province: this.form.studentAreaName,
        provinceCode: this.form.studentAreaCode,
        qrcodeName : this.form.qrcodeName ,
        subjectList:[],
        sizeType:this.form.sizeId
      }

      let zdArr = {
        kc:"考场",
        km:"科目",
        ksbh:"考试编号",
        ksdz:"考试地址",
        sfzhm:"学生ID号",
        xb:"性别",
        xm:"姓名",
        zkzh:"准考证号",
        zwh:"座位号",
        jgbh:"机构编号",
      }


      let subList = this.form.subjectList;
      for(let key in subList){
        if(subList[key]){
          data.subjectList.push({
            qrcode_id:"",
            subjectName:zdArr[key]
          })
        }
      }

      if(this.examId != undefined){
        data.id = this.examId;
        let url = `/ticket/qrCodeUpdate`;
        this.$axios
            .post(url, data)
            .then((res) => {
              if (res.code==200) {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                })
                this.$emit('addSuccess')
                this.$router.go(-1);
              }
            })
            .catch(() => {})
      }else{
        let url = `/ticket/qrCodeCreate`;
        this.$axios
            .post(url, data)
            .then((res) => {
              if (res.code==200) {
                this.$message({
                  message: '添加成功',
                  type: 'success',
                })
                this.$emit('addSuccess')
                this.$router.go(-1);
              }
            })
            .catch(() => {})
      }


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
      this.form.examName = ""
      this.examNameOption.map(item =>{
        if(item.id == e){
          this.form.examName = item.name
          this.form.studentAreaName = ''
          this.form.studentAreaCode = ''
          this.studentAreaOption = []
          this.getExamDetails()
          this.getProvinceByExamId()
          // this.geSubjectList()
        }
      })
    },
    sizeTypeChange(e){
      this.sizeTypeOption.map(item =>{
        if(item.id == e){
          this.form.sizeType = item.name
          this.form.sizeId = item.id

          if(item.id == 0){
            this.class1 = "class0 template-example-dom"
            this.class2 = "bottom"
          }else{
            this.class1 = "class1 template-example-dom"
            this.class2 = "right"
          }


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
.bottom{
  margin-top: 150px !important;
}
.bottom div{
  padding-left: 25px!important;
  width: 170px;
}
img.bottom{
  top: 180px !important;
}
.class0{
  width: 630px !important;
  height: 230px !important;
}
.class1{
  width: 500px !important;
  height: 300px !important;
}
.class1 img{
  width: 100%;
  height: 100%;
}
.class0 .top{
  margin-left: 230px;
}
.class0 .top>div{
  font-size: 14px !important;
}
.class0 img{
  position: absolute;
  left: 30px;
  top: 0;
  width: 200px;
  height: 200px;
  margin: 0 !important;
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
  border: 1px #c0c4cc solid;
  width: 367px;
  height: 288px;
  border-radius: 6px;
  .title{
    flex-direction: column;
    color:#000;
    font-size: 30px;
    position: relative;
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

