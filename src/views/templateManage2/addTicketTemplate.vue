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
            <el-select clearable  v-model="form.examNameNo" :disabled="isAddType==0" style="width:200px;margin-left:50px;" placeholder="请选择考试名称" @change="examNameChange">
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
            <el-input v-model="form.k" style="width:70px;margin-left:34px;"  placeholder="宽"></el-input>mm
            <el-input v-model="form.g" style="width:70px;margin-left:34px;"  placeholder="高"></el-input>mm
          </div>
          <div class="display-center">
            <div class="title">二维码字段</div>
            <div>
              <el-row style="width:200px;text-align: left;padding-left: 30px" v-for="(item,index) in changeList">
                <el-checkbox :disabled="item.name=='准考证号' || item.name=='科目'" v-model="item.active"  @change="change1(item)">{{ item.name }}</el-checkbox>
              </el-row>
            </div>
          </div>
        </div>
        <div class="confirm">
          <el-button type="primary" style="margin-top:30px;margin-left: 150px" @click="examConfirm"> 保存</el-button>
        </div>
      </div>
      <!-- 模板示例 -->
      <div class="template-example" >
        <div class="bg cxx" style="background: #fff;margin-left: 100px; padding: 20px;position:absolute;">
          <div  :class="class1" ref="ticketFile" :style="{background: '#f4f9fe',position: 'absolute',width:form.k*10+'px',height:form.g*10+'px'}">
            <div class="title" >
                <div>
                  <VueDragResize v-for="(item,index) in resizeList" :class="{xz:item==chageItem}" :parentLimitation="true" :isActive="true" :minh="1" :minw="1" :w="item.width" :h="item.height" :x="item.left" :y="item.top" :parentW="form.k*10" :parentH="form.g*10" v-on:resizing="newRect=>resize(newRect,item)" v-on:dragging="newRect=>resize(newRect,item)" class="resize" style="display: flex">
                    <sapn v-if="item.text !='url'" :style="{fontSize:item.fontSize+'px'}">{{item.text}}</sapn>
                    <span v-if="item.text =='url'" style="width: 100%;height: 100%">
                       <img src="@/assets/erweima.png" alt=""  style="">
                    </span>
                  </VueDragResize>
                </div>
            </div>
            <div v-if="chageItem && chageItem.name!='二维码'" style="    position: absolute;
    width: 100%;
    bottom: -100px;">
              <span class="demonstration">字体大小</span>
              <el-slider  v-model="font_size" :min="12" :max="50" @input="sizeC"></el-slider>
            </div>
          </div>
        </div>

      </div>


    </div>
  </section>
</template>

<script>
import { apiExamList,apiGetProvinceByExamId,apiGetExamDetails,apiTicketCreate,apiGetSubjectList} from '@/api/ticket.js'
import { examinationList,apiRelationStudio } from '@/api/studioManage.js'
import html2canvas from "html2canvas";
import VueDragResize from 'vue-drag-resize'
export default {
  components: { VueDragResize },
  name: "AddTicketTemplate",
  data() {
    return {
      font_size:14,
      xxW:500,
      xxh:300,
      changeList:[
        {active:true,disabled:true,name:'准考证号',id:"zkzh",text:"准考证：E0000000001",w:190,h:50},
        {active:false,disabled:false,name:'学生ID号',id:"sfzhm",text:'学生ID号：330591208808080808',w:230,h: 60},
        {active:false,disabled:false,name:'考试地址',id:"ksdz",text:"考试地址：杭州市滨江区",w:168,h:39},
        {active:false,disabled:false,name:'考试编号',id:"ksbh",text:"考试编号：100101",w:140,h:30},
        {active:false,disabled:false,name:'姓名',id:"xm",text:"姓名：张三",w:120,h:30},
        {active:false,disabled:false,name:'性别',id:"xb",text:"性别：男",w:120,h:30},
        {active:true,disabled:true,name:'科目',id:"km",text:"科目：素描",w:140,h:30},
        {active:false,disabled:false,name:'考场',id:"kc",text:"考场：001",w:120,h:30},
        {active:false,disabled:false,name:'座位号',id:"zwh",text:"座位号：01",w:120,h:30},
        {active:false,disabled:false,name:'机构编号',id:"jgbh",text:"机构编号：A_0001",w:150,h:30},
      ],
      resizeList:[

      ],
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
        k:50,
        g:30,
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
      chageItem:"",
    };
  },
  created() {
    this.getExamList()
    this.getList();
    //接收参数
    this.examId = this.$route.params.examId;
    if(this.examId != undefined){
      this.isAddType = 0;
      this.get_mb();
    }else{
      this.resizeList = [
        {
          name:"准考证号",
          text:"准考证：E0000000001",
          label:"zkzh",
          width:190,
          height:50,
          left:0,
          top:0,
          fontSize:14,},
        {
          name:"科目",
          text:"科目：素描",
          label:"km",
          width:140,
          height:30,
          left:0,
          top:60,
          fontSize:14,},
        {
          name:"二维码",
          text:"url",
          label:"ewm",
          width:200,
          height:200,
          left:240,
          top:60,
          fontSize:14,},
      ]
    }
  },

  methods: {
    sizeC(){
      this.chageItem.fontSize = this.font_size;
    },
    change1(item){
      if(item.active){
        this.resizeList.push({
          name:item.name,
          text:item.text,
          label:item.id,
          width:item.w,
          height:item.h,
          left:0,
          top:0,
          fontSize:14,
        })
      }else{

        this.resizeList.forEach((a,index)=>{
          if(a.label == item.id){
            this.resizeList.splice(index,1)
          }
        })
      }
    },
    resize(newRect,item) {
      this.chageItem = item;
      this.font_size = item.fontSize;
      item.width = newRect.width;
      item.height = newRect.height;
      item.top = newRect.top;
      item.left = newRect.left;
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
            this.sizeTypeChange(res.result.sizeType)

            let dArr = res.result.subjectList;
            let data = JSON.parse(res.result.dynamicConfig);
            data.forEach((item,index)=>{
              if(item.name=="size"){
                this.form.k = item.width;
                this.form.g = item.height;
                data.splice(index,1)
              }
            })
            this.resizeList= {};
            this.resizeList = data;
            console.log(this.resizeList);

            this.changeList.forEach((item,index)=>{
              this.resizeList.forEach((a,b)=>{
                if(item.id == a.label){
                  item.active = true;
                }
              })
            })

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
      let isArr = [];
      this.resizeList.forEach((item,index)=>{
          isArr.push(item)
      })
      let size = {
        name:'size',
        width:this.form.k,
        height:this.form.g,
      }
      isArr.push(size);
      let data = {
        examId : this.form.examNameNo,
        province: this.form.studentAreaName,
        provinceCode: this.form.studentAreaCode,
        qrcodeName : this.form.qrcodeName ,
        subjectList:[],
        sizeType:this.form.sizeId,
        dynamicConfig:JSON.stringify(isArr)
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
            this.xxW = 630;
            this.xxh = 230;
          }else{
            this.class1 = "class1 template-example-dom"
            this.class2 = "right"
            this.xxW = 500;
            this.xxh = 300;
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
<style lang="scss">
.cxx .content-container{
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: left;
}
.xz .vdr-stick{
  background: #409eff;
}
</style>
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

}
.class1{

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
  width: 100%;
  height: 100%;
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

