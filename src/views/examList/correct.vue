<template>
  <div class="sub-container">
    <div class="dialog-center" style="padding: 40px">
      <h1>
        Hello，<span>{{ userName }}</span>
      </h1>
      <h1>请选择您要批改的科目</h1>
      <el-form>
        <el-form-item label="请选择考试名称">
          <el-select clearable  v-model="examNameNo" style="display: flex;margin-left:50px;" placeholder="请选择考试名称" @change="examNameChange">
            <el-option
                v-for="item in examNameOption"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="btns" style="min-height: 40px">
        <!-- course: 素描、色彩、速写、设计  -->
        <div v-if="courseList.length">
          <el-button v-for="item in courseList" :key="item.key" :class="item.color" @click="selectSubject(item.name)">
            {{ item.name }}
          </el-button>
        </div>
        <div v-else>
          <el-button v-for="item in subjectList" :key="item.key" :class="item.color" @click="selectSubject(item.name)">
            {{ item.name }}
          </el-button>
        </div>
      </div>
      <div style="margin-top: 10px;
    text-align: center;
    color: #2c3aff;" v-if="role==0">
        管理员账号可全程监管阅卷流程，但不参与阅卷。
        <br>
        如需阅卷，请用阅卷老师账号登录
      </div>
    </div>
  </div>
</template>
<script>
import SelectProvince from '@/components/SelectProvince'
import { queryCourseByProvince } from '@/api/paper'
import { apiExamList,apiGetProvinceByExamId,apiGetExamDetails,apiTicketCreate } from '@/api/ticket.js'
export default {
  name: 'selectSubject',
  components: { SelectProvince },
  data: () => {
    return {
      userName: localStorage.getItem("user_name"),
      query: {},
      provinceList: [],
      subjectList:[],
      colorList: ['sketch', 'color', 'sketch2', 'design','sketch', 'color', 'sketch2', 'design'],
      courseList: [],
      examNameNo:"",
      examNameOption:[],
      examNo:"",
      role:localStorage.getItem("role")
    }
  },
  created() {
    this.getExamList()
  },
  methods: {
    // 查询考试列表
    getExamList(){
      apiExamList().then(res=>{
        this.examNameOption = res.result;
        if(this.oddCode){
          this.examNameChange(this.oddCode)
        }
      })
    },
    // 考试改变监听
    examNameChange(e){
      this.examNameOption.map(item =>{
        if(item.id == e){
          this.examNameNo = item.id;
          this.examName = item.name;
          this.examNo = item.no;
          this.getExamDetails()
          // this.getProvinceByExamId()
        }
      })
    },
    // 查询考试下的科目
    getExamDetails(){
      this.$axios.get(
          '/examsubject/listByExamId?examId='+this.examNameNo
      ).then(res=>{
        this.courseList = [];
        res.result.forEach((item,index) =>{
          this.courseList.push({
            key: index,
            name: item.subjectName,
            color: this.colorList[index]
          })
        })
      })
    },

    // 选择科目
    selectSubject(subject) {
      this.query.examId = this.examNameNo;
      this.query.examNo = this.examNo;
      this.query.course = subject;

      // 跳转到考卷列表页 需要传递份和科目两个参数
      this.$router.push({
        path: '/paperManage',
        query: this.query
      });
    },
  }
}
</script>
<style lang="scss">
.dialog-center {
  .el-form {
    .el-form-item {
      width: 370px;
      .el-form-item__label {
        font-weight: bold;
        color: #000;
      }
    }
  }
}
</style>
<style scoped lang="scss">

.clearfix:after {
  content: '';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.sub-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
  /* padding-top: 0; */
  margin-top: -50px;
  background-image: url('../../assets/logo_bg.jpg');
  background-position: center;
  background-size: cover;
  .dialog-center {
    padding: 20px;
    border-radius: 10px;
    background-color: #fff;
    h1 {
      margin-top: 0;
      margin-bottom: 10px;
    }
    .btns {
      text-align: center;
      button {
        color: #fff;
      }
      .sketch {
        background-color: #59bf99;
      }
      .color {
        background-color: #557dff;
      }
      .sketch2 {
        background-color: #de5887;
      }
      .design {
        background-color: #ffac59;
      }
    }
  }
}
</style>
