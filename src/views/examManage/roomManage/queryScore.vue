<template>
  <div class="pdf-demo" v-loading="load">
    <div class="page1" v-if="page1">

      <div class="top">
        <img :src="require('@/assets/banner-1.png')" alt="" style="width: 100%">
      </div>
      <div class="box">
        <el-input placeholder="请输入准考证号" v-model="input1">
          <template slot="prepend"><span style="width: 50px;display: inline-block">准考证</span></template>
        </el-input>
        <el-input placeholder="请输入姓名" v-model="input2" style="margin-top: 12px">
          <template slot="prepend"><span style="width: 50px;display: inline-block">姓名</span></template>
        </el-input>
        <el-button class="btn" type="primary" @click="getList">查询</el-button>
        <div class="tips">说明：请输入正确的准考证号和姓名进行查询，忘记请联系相关老师</div>
        <p style="text-align: center;margin-bottom: 0"><img style="width: 170px" :src="require('@/assets/bg_logo1.svg')" alt=""></p>
<!--        <p style="font-size: 12px;-->
<!--    margin: 0;-->
<!--    text-align: center;-->
<!--    color: #2c3aff;">全国版</p>-->
      </div>
    </div>
    <div class="page2" v-if="!page1">
      <div class="top"><img :src="require('@/assets/banner-2.png')" alt="" style="width: 100%"></div>
      <div class="box">
        <el-input v-model="name" disabled>
          <template slot="prepend"><span style="width: 50px;display: inline-block">姓名</span></template>
        </el-input>
        <el-table
            :data="tableData"
            border
            style="width: 100%;margin-top: 20px">
          <el-table-column
              prop="course"
              label="科目"
              >
          </el-table-column>
          <el-table-column
              prop="score"
              label="成绩"
              >
          </el-table-column>
          <el-table-column
              prop="rankInProvince"
              label="排名">
          </el-table-column>
        </el-table>

        <div class="tips" style="padding-left: 0;padding: 0.5rem 0;">说明：对成绩有疑问请联系相关老师</div>
<!--        <p style="color: red;font-size: 22px">此数据为系统测试开发用数据，考试分数尚未公布</p>-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PdfDemo",
  data(){
    return {
      input1:"",
      input2:"",
      load:false,
      page1:true,
      name:"",
      tableData:[],
    }
  },
  metaInfo() {
    return {
      title: '美术考试查分系统',
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1, user-scalable=no" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "pple-mobile-web-app-status-bar-style", content: "black" },
        { name: "format-detection", content: "telephone=no, email=no" },
        { name: "HandheldFriendly", content: "true" },
        { name: "screen-orientation", content: "portrait" },
        { name: "msapplication-tap-highlight", content: "no" },
      ],
    };
  },
  created() {

  },
  methods: {
    getList(){
      if(!this.input1){
        this.$message.warning('请输入准考证号！')
        return false
      }
      if(!this.input2){
        this.$message.warning('请输入姓名！')
        return false
      }



      this.load = true;
      this.$axios
          .post('/score_query/score_query_v2?name='+this.input2+'&admission_ticket_code='+this.input1, )
          .then((res) => {
            if(res.code == 200){
              this.load = false;
              this.page1 = false;
              this.name = res.result.name;
              let data = res.result.subjects;
              data.push({
                course: "总分",
                score: res.result.totalScore,
                rankInProvince: res.result.rankInProvince
              })
              this.tableData =res.result.subjects;
            }else{
              this.load = false;
            }
          })
          .catch(() => {
            this.load = false;
          });
    },
  },
}
</script>
<style scoped>
.page1{
  background: url("../../../assets/bg_logo.png") no-repeat;
}
.pdf-demo{
  height: 100%;
}
.page1{
  height: 100%;
}
.page2{
  height: 100%;
  background: url("../../../assets/bg_logo.png") no-repeat;
}
.top{
  height: 10rem;
  line-height: 10rem;
  color: #fff;
  font-size: 2.4rem;
  text-align: center;
}
.tips{
  font-size: 0.8rem;
  color: #0070cc;
  padding: 1rem 0;
}
.box{
  padding: 2rem;
  background: #fff;
  width: 90%;
  margin-left: 5%;
  border-radius: 18px;
  margin-top: 5rem;
}
.btn{
  width: 100%;
  bottom: 30px;
  left: 15px;
  margin-top: 6rem;
}



</style>
