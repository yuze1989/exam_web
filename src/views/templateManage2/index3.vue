<template>
  <section class="form_border">
    <div class="header">
      脱敏设置
    </div>
    <div class="container">
      <!-- 模板信息 -->
      <div class="template">
        <!-- 基本信息 -->
        <div class="basic-info">
          <div class="display-center">
            <el-select clearable  v-model="form.examNameNo" style="width:200px;margin-left:50px;" :disabled="isedit" placeholder="请选择考试名称" @change="examNameChange">
              <el-option
                  v-for="item in examNameOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="display-center">
            <div class="display-center">
              <!--              <el-input v-model="form.examTitle" style="width:200px;margin-left:50px;"  placeholder="请输入考试标题" ></el-input>-->
              <div>

                <el-row style="width:200px;text-align: left;padding-left: 0px">
                  <el-checkbox v-model="identification">身份证号码</el-checkbox>
                </el-row>
                <el-row style="width:200px;text-align: left;padding-left:0px">
                  <el-checkbox  v-model="name">姓名</el-checkbox>
                </el-row>
                <el-row style="width:200px;text-align: left;padding-left: 0px">
                  <el-checkbox v-model="mobile">手机</el-checkbox>
                </el-row>


              </div>
            </div>
          </div>
          <div class="display-center">
            <el-button type="primary" style="margin-top: 30px;
    margin-left: 50px;
    width: 200px;" @click="examConfirm"> 保存</el-button>
          </div>
        </div>
      </div>
      <!-- 模板示例 -->
      <div class="template-example" >


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
      identification:false,
      mobile:false,
      name:false,
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
      isShow:true,

      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [
          {

          }
        ] },
      isAdd: false,
      isAddType: 1, //1新增  0编辑
      editItemData: {},
      examId:"",
      isedit:false
    };
  },
  created() {
    this.getExamList()
    this.getList();
    //接收参数
    this.examId = this.$route.params.examId;
    if(this.examId != undefined){
      this.get_mb();
      this.form.examNameNo = this.examId
      this.isedit = true;
    }
  },

  methods: {
    //获取模板详情
    get_mb(){
      let params = {examId:this.examId};
      this.$axios
          .post('/datahide/getDetailByExamId?examId='+this.examId)
          .then((res) => {
            this.examId = res.result.examId;
            this.identification = (res.result.identification==0?false:true)
            this.mobile = (res.result.mobile==0?false:true)
            this.name = (res.result.name==0?false:true)
          })
          .catch(() => {});
    },
    addImg(event){
      let inputDOM = this.$refs.inputer;
      // 通过DOM取文件数据
      this.file = inputDOM.files[0];
    },
    base64toFile(dataurl) {
      // //去掉base64的头部信息，并转换为byte
      // let split = base64Data.split(',');
      // let bytes = window.atob(split[1]);
      //   //获取文件类型
      //   let fileType = split[0].match(/:(.*?);/)[1];
      // //处理异常,将ascii码小于0的转换为大于0
      // let ab = new ArrayBuffer(bytes.length);
      // let ia = new Uint8Array(ab);
      // for (let i = 0; i < bytes.length; i++) {
      //   ia[i] = bytes.charCodeAt(i);
      // }
      // return new Blob([ab], { type: fileType});
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], '截图.png', {type:mime});
    },
    getImage() {
      this.isShow = false;
      html2canvas(this.$refs.ticketFile).then(canvas => {
        this.$message({
          message: '图片已生成可以保存模版',
          type: 'success',
        })
        let dataURL = canvas.toDataURL("image/png");
        this.imgUrl = dataURL;
        this.isShow = true;
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
          str.push(p + '=' + obj[p])
        }
      }
      return str.join('&')
    },
    // 保存
    examConfirm(){
      if(!this.form.examNameNo){
        this.$message({
          message: '请选择考试名称',
          type: 'warning',
        })
        return false;
      }

      let data = {
        examId  : this.examId,
        identification : this.identification?"1":"0",
        mobile : this.mobile?"1":"0",
        name : this.name?"1":"0",
      }

      let url = `/datahide/save`;
      this.$axios
          .post(url, data)
          .then((res) => {
            if (res.code==200) {
              this.$message({
                message: '保存成功',
                type: 'success',
              })
              this.$router.go(-1)

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
      this.examId = ""
      this.form.examName = ""
      this.examNameOption.map(item =>{
        if(item.id == e){
          this.form.examName = item.name
          this.examId = item.id
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
  beforeCreate() {

  },
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
  width: 500px;
  .title{
    background: blue;
    display: flex;
    align-items: center;
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

