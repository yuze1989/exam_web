<template>
  <section>
    <div class="pageBox">
      <el-row class="ruleHead">
        <div class="title">
          <span class="circle"></span>
          <span class="titleStyle">设置评分准则</span>
        </div>
        <el-button type="primary" @click="back" size="mini" class="btn">返回</el-button>
      </el-row>
      <el-row class="w200 mt-20">
        <el-col :span="8" class="title18"><span>考试</span>名称:</el-col>
        <el-col :span="12">
          <el-select clearable  v-model="form.rule.examId" placeholder="请选择考试" size="medium" :disabled="$route.params.id" @change="examNameChange">
            <el-option v-for="item in examIdList" :key="item.id" :value="item.id" :label="item.name">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
<!--      <el-row class="w200 mt-20">-->
<!--        <el-col :span="8" class="title18"><span>请选择</span>区域:</el-col>-->
<!--        <el-col :span="12">-->
<!--          <el-select clearable  v-model="form.studentAreaName" style="width:200px;" placeholder="请选择区域" @change="studentChange">-->
<!--            <el-option-->
<!--                v-for="item in studentAreaOption"-->
<!--                :key="item.provinceCode"-->
<!--                :label="item.province"-->
<!--                :value="item.provinceCode">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-col>-->
<!--      </el-row>-->
      <el-row class="w200 mt-20">
        <el-col :span="8" class="title18" ><span>打分</span>算法:</el-col>
        <el-col :span="12" >
          <el-tooltip class="item" effect="dark" content="如果一张试卷批改教师数量等于1，那么系统自动取当前教师的分数；如果一张试卷教师批改数量等于2，那么系统自动取当前两位教师的分数平均数" placement="right">
            <el-select clearable  v-model="form.gradeRule" placeholder="请选择打分算法" size="medium" @change="seletChage" >
              <el-option v-for="item in gradeRuleList" :key="item.id" :value="item.id" :label="item.name" >
              </el-option>
            </el-select>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row class="w200 mt-20">
        <el-col :span="8" class="title18"><span>二维码隐藏</span>区域:</el-col>
        <el-col :span="12">
          <el-select clearable  v-model="form.hideSite" placeholder="请选择二维码隐藏区域" size="medium" @change="seletChage">
            <el-option v-for="item in hideSiteList" :key="item.id" :value="item.id" :label="item.name">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="w200 mt-20">
        <el-col :span="8" class="title18"><span>教师阅卷</span>顺序:</el-col>
        <el-col :span="12">
          <el-select clearable  v-model="form.ruleSort " placeholder="请选择教师阅卷顺序" size="medium" @change="seletChage">
            <el-option v-for="item in ruleSortList" :key="item.id" :value="item.id" :label="item.name" >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="mt-20" v-if="!$route.query.id">
        <span class="title18 mr-25" style="color: #204BD6">设置科目分类:</span>
        <span class="title18" style="color: #204BD6">请选择考试科目并设置单科总分</span>
      </el-row>
      <el-row class="w200 mt-20">
        <el-col :span="8" class="title18"><span>科目</span>名称:</el-col>
        <el-col :span="12">
          <el-select clearable  v-model="form.course" style="width:200px;" placeholder="请选择科目" @change="seletChage">
            <el-option
                v-for="item in courseList"
                :key="item.subjectName"
                :label="item.subjectName"
                :value="item.subjectName">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="w200 mt-20">
        <el-col :span="8" class="title18"><span>科目</span>总分:</el-col>
        <el-col :span="12">
          <el-input placeholder="请输入科目总分" v-model="form.rule.score"></el-input>
        </el-col>
      </el-row>
      <el-row class="w200 mt-20">
        <el-col :span="8" class="title18">设置分组级别</el-col>
        <el-col :span="12">
          <el-input-number v-model="form.rule.gradeLevel" controls-position="right" @change="gradeChange" :min="1" :max="20">
          </el-input-number>
        </el-col>
        <span class="title18" :span="4">个</span>
      </el-row>

      <div class="lablestyle fw-b" style="width: 100%;color:#3E3D3D">
        填写说明：多条要求请分号隔开
      </div>

      <div class="lablestyle fw-b" style="width: 100%; line-height: 8px;color:#3E3D3D;position: relative;height: 60px">
        填写示例：<span style="font-weight: 700;color: #000;font-size: 15px;">分级A:</span>
        <div style="position: absolute;
    left: 124px;
    top: -14px;">
          <p>符合实际规定及要求；造型标准；有较强表现塑造力。</p>
          <p>占比：5%</p>
          <p>打分范围 90 - 100</p>
        </div>

      </div>

      <div class="ruleGroup">
        <div class="ruleCard mt-20" v-for="(exam, idx) in form.examples" :key="idx">
          <div class="ruleHead">
            <span>{{exam.grade}}</span>
            <span>:请添加评分描述</span>
          </div>
          <div class="ruleBody">
            <div class="ruleTextArea">
              <el-input class="ruleInput" type="textarea" :rows="6" placeholder="请输入内容" v-model="exam.imgUrlDesc">
              </el-input>
              <el-input v-model="exam.percentage" type="number" :min="0">
                <template slot="append">%</template>
              </el-input>
              <el-row>
                <el-col :span="10">
                  <el-input v-model="exam.scoreStart" type="number" :min="0"> </el-input>
                </el-col>
                <el-col :span="4" style="text-align: center;line-height: 40px">至</el-col>
                <el-col :span="10">
                  <el-input v-model="exam.scoreEnd" type="number" :min="0"> </el-input>
                </el-col>
              </el-row>
            </div>
            <div class="rulePic">
              <el-image :src="exam.imgUrl" v-if="exam.imgUrl" class="ruleImage"></el-image>
              <div class="ruleImageNo" @click="upToOss(exam)">
                 <p class="addIcon">+</p>
                 <p class="addDes" v-show="!exam.imgUrl">上传范例图</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <el-row class="ruleHead mt-20">
        <span class="circle"></span>
        <span class="titleStyle">设置作品照片要求</span>
      </el-row>
      <div class="sample">
        <el-input class="sampleInput" type="textarea" :rows="9" placeholder="适用于手机APP上传试卷" v-model="form.rule.takePic">
        </el-input>
        <div class="uploadCtn" @click="upToOss2()">
          <div class="uploadIcon">
            +
            <span class="uploadDes" v-show="!form.rule.picUrl">上传图片</span>
          </div>
           <el-image :src="form.rule.picUrl" v-if="form.rule.picUrl" style="width: 100%; height: 100%"></el-image>
        </div>
        <!-- <div @click="upToOss()" style="margin-top: 20px" v-show="false">
          <el-button>上传图片</el-button>
        </div> -->

      </div>
      <div style="width:100%;margin-top:50px;padding-bottom: 50px">
        <el-button type="primary" class="meiyuan_btn" @click="saveRule" style="float: left">保存</el-button>
      </div>
      <input id="fileup" type="file" v-show="false" @change="uploadchanged" ref="fileup" />
    </div>

  </section>
</template>

<script>
// import { ossup } from '@/api/ossUp'
import { apiExamList,apiGetProvinceByExamId,apiGetExamDetails,apiTicketCreate } from '@/api/ticket.js'
import provinceCodeList from '../../../utils/provinceCode'
import selectProvince from '@/components/SelectProvince'

export default {
  data() {
    return {
      id:"",
      one:false,
      result:"",
      provinceList: provinceCodeList,
      scoreRulers: [
        { value: '', text: '色彩', used: true },
        { value: '', text: '素描', used: true },
        { value: '', text: '速写', used: true },
        { value: '', text: '设计', used: true },
      ],
      tempExam: null,
      examIdList:[],
      studentAreaOption: [],
      gradeRuleList: [
        {id:0,name:'算术平均算法:平均值'},
        {id:1,name:'截尾平均数：去掉最高值和最低值，再求平均值'},
      ],
      ruleSortList:[
        {id:0,name:'按准考证顺序'},
        {id:1,name:'随机顺序'},
      ],
      hideSiteList: [
        {id:"",name:'不隐藏'},
        {id:0,name:'左上'},
        {id:1,name:'右上'},
        {id:2,name:'左下'},
        {id:3,name:'右下'},
        {id:4,name:'上中'},
        {id:5,name:'左中'},
        {id:6,name:'右中'},
        {id:7,name:'下中'},
      ],
      courseList:[],
      isOne:false,
      form: {
        rule: {
          provinceCode: '',
          province: '',
          course: '',
          gradeLevel: 1,
          takePic: '',
          picUrl: '',
          score: '',
          gradeRule:"",
          hideSite:"",
        },
        examples: [],
        studentAreaName: "",
        studentAreaCode: "",
        examName: "",
        examNo:"",
        examNameNo: "",
        carefulMatter: '',
        examTitle: ''
      }
    }
  },
  created() {

  },
  mounted() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      this.one = true;
      this.queryData()
    }else{
      this.one = false;
      this.getKsList()
      this.gradeChange()
    }
  },
  methods: {
    seletChage(){
      this.$forceUpdate()
    },
    //获取考试列表
    getKsList(){
      this.$axios
          .post('/ticket/examlist?archiveStatus=0')
          .then((res) => {
            this.examIdList = res.result;
            if(this.one && this.id){
              this.examNameChange(this.result.examId)
            }
          })
          .catch(() => {});
    },
    // 考试改变监听
    examNameChange(e){
      this.examIdList.map(item =>{
        if(item.id == e){
          this.form.examNameNo = item.id;
          this.form.examName = item.name;
          this.form.rule.examId = item.id;
          this.form.studentAreaName = ''
          this.form.studentAreaCode = ''
          this.studentAreaOption = []
          this.getExamDetails()
          this.getProvinceByExamId()
        }
      })
    },
    // 查询考试下的省份
    getProvinceByExamId(){
      apiGetProvinceByExamId({
        examId: this.form.examNameNo
      }).then(res=>{
        this.studentAreaOption = res.result;
        if(this.one && this.id){
          this.studentChange(this.result.provinceCode)
        }
      })
    },
    // 查询考试下的科目
    getExamDetails(){
      this.$axios.get(
          '/examsubject/listByExamId?examId='+this.form.examNameNo
      ).then(res=>{
        this.courseList = res.result;

      })
      apiGetProvinceByExamId({
        examId: this.form.examNameNo
      }).then(res=>{
        this.studentAreaOption = res.result;
        if(this.oddPro){
          this.studentChange(this.oddPro)
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
    uploadchanged() {
      let file = this.$refs.fileup.files[0]
      if(file !=undefined){
        var fromDate = new FormData();
        fromDate.append("file",file)
        this.$axios.post('/file/upload',fromDate).then(res=>{
          if(res){
            if(this.isOne){
              this.form.rule.picUrl = res.result;
            }else{
              this.tempExam.imgUrl = res.result;
            }
            this.$refs.fileup.value = ""

          }
        }).catch(()=>{})
      }

    },
    upToOss(exam) {
      this.isOne = false;
      this.tempExam = exam
      this.$refs.fileup.click()
    },
    upToOss2() {
      this.isOne = true;
      this.$refs.fileup.click()
    },
    //评分阶梯
    gradeChange() {
      while (this.form.rule.gradeLevel > this.form.examples.length) {
        let level = String.fromCharCode(
          'A'.charCodeAt() + this.form.examples.length
        )
        this.form.examples.push({ grade: level, provinceCode: '', course: '', percentage: '', imgUrl: '', imgUrlDesc: '' })
      }
      while (this.form.rule.gradeLevel < this.form.examples.length) {
        this.form.examples.pop()
      }
    },
    saveRule() {
      let params = { ...this.form }
      if (!params.examNameNo) {
        this.$message({
          message: '请选择考试',
          type: 'info'
        })
        return false
      }
      if (!params.course) {
        this.$message({
          message: '请选择科目',
          type: 'info'
        })
        return false
      }
      let n = 0
      let n1 = 0;
      for (let i = 0; i < params.examples.length; i++) {
        const item = params.examples[i]
        item.course = params.course
        if (!item.imgUrlDesc) {
          this.$message({
            message: '请填写阶梯对应内容',
            type: 'warning'
          })
          return false
        }
        if (!item.imgUrl) {
          this.$message({
            message: '请上传阶梯对应范例图',
            type: 'warning'
          })
          return false
        }

        if (item.scoreStart !=0 && !item.scoreStart) {
          this.$message({
            message: '请填写阶梯对应范围最低值',
            type: 'warning'
          })
          return false
        }
        if (!item.scoreEnd) {
          this.$message({
            message: '请填写阶梯对应范围最高值',
            type: 'warning'
          })
          return false
        }
        if (!item.percentage) {
          this.$message({
            message: '请填写阶梯占比',
            type: 'warning'
          })
          return false
        }
        n1 += item.percentage/1;
        n += (+item.percentage)
      }
      if (n != 100) {
        this.$message({
          message: '阶梯占比总和需要等于100%,当前为'+n+'%',
          type: 'warning'
        })
        return false
      }
      this.scoreRulers.forEach(item => {
        if (item.text == params.rule.course) {
          this.form.rule.score = item.value
        }
      })
      if (!params.rule.score) {
        this.$message({
          message: '请填写科目分数',
          type: 'info'
        })
        return false
      }


      let url = null;

      let data = {
        "course": params.course,
        "examId": params.examNameNo,
        "exampleList": params.examples,
        "gradeLevel": params.rule.gradeLevel,
        "gradeRule": params.gradeRule,
        "hideSite": params.hideSite,
        "picUrl": params.rule.picUrl,
        "province": params.studentAreaName,
        "provinceCode": params.studentAreaCode,
        "score": params.rule.score,
        "takePic": params.rule.takePic,
        ruleSort:params.ruleSort
      }

      if (this.id) {
        url = '/rules/update'
        data.id = this.id;
      } else {
        url = '/rules/create';
      }

      this.$axios.post(url,data).then(res=>{
        if(res){
            this.$message({
                message: '提交成功',
                type: 'success',
              })
            let that = this;
           that.$router.go(-1)
        }
      
      }).catch(()=>{})
    },
    selArea(code) {
      this.provinceList.forEach(item => {
        if (item.id == code) {
          this.form.rule.province = item.province
        }
      })
    },
    back(){
      this.$router.go(-1);
    },
    queryData() {
      const id = this.id;
      this.$axios.get('/rules/detail?id='+id).then(res=>{
        this.result = res.result;
        this.form.gradeRule = res.result.gradeRule;
        this.form.hideSite = res.result.hideSite;
        this.form.course = res.result.course
        this.form.rule.score = res.result.score
        this.form.rule.gradeLevel = res.result.gradeLevel;
        this.form.rule.takePic =res.result.takePic;
        this.form.rule.picUrl =res.result.picUrl;
        this.form.ruleSort = res.result.ruleSort;
        res.result.exampleList.forEach((item,index)=>{
          this.form.examples.push({ grade: item.grade, provinceCode: res.result.provinceCode,scoreStart:item.scoreStart,scoreEnd:item.scoreEnd, course: res.result.course, percentage: item.percentage, imgUrl: item.imgUrl, imgUrlDesc: item.imgUrlDesc })
        })
        this.gradeChange();
        this.getKsList()
      }).catch(()=>{})
    }
  },
  components: { selectProvince }

}
</script>

<style lang="scss">
.radioBox {
  display: flex;
  align-items: center;
}

.w200 {
  width: 400px;
}
.title18 {
  font-size: 16px;
  line-height: 36px;
  font-weight: bold;
}
.ruleHead {
  .title{
    float:left;
      .circle {
        margin-top: 10px;
        margin-right: 5px;
        width: 8px;
        height: 8px;
        background-color: red;
        border-radius: 50%;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
    }
  }
  .btn{
    float: right;
  }
  .titleStyle {
    font-size: 22px;
    font-family: PingFang-SC-Heavy, PingFang-SC;
    font-weight: 800;
    color: #0e0e0e;
    line-height: 24px;
  }
}
.lablestyle {
  font-size: 14px;
  width: 65px;
  color: #0e0e0e;
  line-height: 36px;
}
.ruleGroup {
  display: flex;
  width: 1600px;
  justify-self: start;
  flex-wrap: wrap;
  .ruleCard {
    // border: 1px solid gray;
    margin: 10px 10px;
    width: 485px;
    height: 235px;
    .ruleHead {
      width: 100%;
      height: 40px;
      font-size: 20px;
      font-weight: bold;
    }
    .ruleBody {
      width: 100%;
      height: 195px;
      display: flex;
      .ruleTextArea {
        width: 294px;
        height: 100%;
        border-style: solid;
        border: 1px solid #d4d5de;
        border-right: none;
        background: #fff;
        border-radius: 10px 0 0 10px;
        // margin: auto;
        .ruleInput {
          width: 272px;
          height: 90px;
          margin: 13px 16px 10px;
          textarea {
            border: none !important;
            resize: none;
            height: 100%;
          }
        }
      }
      .rulePic {
        border: 1px solid #d4d5de;
        border-radius: 0 10px 10px 0;
        background: #fff;
        width: 190px;
        height: 100%;
        position: relative;
        .ruleImage {
          width: 100%;
          height: 100%;
        }
        .ruleImageNo {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 6;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.2);
          font-size: 50px;
          text-align: center;
          color: white;
          cursor: pointer;
          .addIcon{
            font-size: 40px;
            margin-bottom: 0;
            margin-top: 60px;
          }
          .addDes{
            margin-top: 0;
            font-size: 20px;
          }
        }
      }
    }
  }
}
.sample {
  width: 100%;
  height: 195px;
  display: flex;
  .sampleInput {
    width: 367px;
    height: 200px;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #d4d5de;
    margin: 20px 50px 0px 0px;
    .ruleInput {
      width: 272px;
      height: 172px;
      margin: 13px 16px 10px;
    }
    textarea {
      border: none !important;
      resize: none;
    }
  }
  .uploadCtn{
    width: 220px;
    height: 200px;
    margin-top: 20px;
    margin-left: -40px;
    position: relative;
    .uploadIcon{
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background: rgba(0, 0, 0, 0.2);
      font-size: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      cursor: pointer;
      z-index: 5;
      .uploadDes{
        position: absolute;
        font-size: 20px;
        bottom: 40px;
        left: 70px;
      }
    }
  }
}
.fw-b {
  font-weight: bold !important;
}
.mt-20 {
  margin-top: 20px !important;
}
.mr-25 {
  margin-right: 25px !important;
}
.mr-10 {
  margin-right: 10px !important;
}
.ml-5 {
  margin-left: 5px !important;
}
.pageBox {
  padding: 20px;
  // width: 100%;
  // height: 100%;
  // overflow: auto;
  // /deep/ .el-menu-vertical-demo .el-submenu__icon-arrow,
  // .el-icon-arrow-down {
  //   color: #333;
  // }
}
</style>
