<template>
   <section class="form_border">
    <div class="header" style="display: flex;justify-content: flex-end">
      <el-button class="association_btn" style="position:absolute;left:15px;" type="primary" size="medium" @click="getExcel"
      >下载Excel</el-button
      >
      <el-select clearable  v-model="form.examName"  placeholder="请选择考试名称" @change="examNameChange" style="margin-right: 10px">
        <el-option
            v-for="item in examNameOption"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>
        <el-input v-model="form.examNo" style="width:200px"  placeholder="机构名称"
        ></el-input>
       <el-button class="association_btn" style="margin-left:50px;" type="primary" size="medium" @click="getList"
        >查询</el-button
      >
    </div>
    <!--列表-->
    <el-table
      :data="data.records"
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
          label="机构ID"
          header-align="center"
          align="center"
          prop="studioId"
      >
      </el-table-column>
      <el-table-column
          label="机构名称"
          header-align="center"
          align="center"
          prop="studioName"
      >
      </el-table-column>
      <el-table-column
          label="总平均分"
          header-align="center"
          align="center"
          prop="totalScore"
      >
      </el-table-column>
      <el-table-column
          label="总排名"
          header-align="center"
          align="center"
          prop="rank"
      >
      </el-table-column>
      <template v-if="data.records.length>0">
        <el-table-column v-for="(item, index) in data.records[0].avgScoreItems" :label="item.course" header-align="center" align="center">
          <template slot-scope="scope">
            <div v-text="scope.row.avgScoreItems[index].score"></div>
            <!--            <el-input  @keyup.enter.native="save(scope.row)"></el-input>-->
          </template>
        </el-table-column>
      </template>

<!--       <el-table-column-->
<!--      fixed="right"-->
<!--      label="操作"-->
<!--      width="200">-->
<!--      <template slot-scope="scope">-->
<!--        <el-button @click="relationStudio(scope.row)" type="text" size="small" >生源详情</el-button>-->
<!--        <el-button  size="small" @click="statisticsInfo(scope.row)" type="text" >考试汇总</el-button>-->
<!--      </template>-->
<!--    </el-table-column>-->
    </el-table>
    <!--工具条-->
<!--    <el-col :span="24" class="toolbar">-->
<!--      <myPagination-->
<!--        :current.sync="form.pageIndex"-->
<!--        :pages.sync="data.pages"-->
<!--        :size.sync="form.pageSize"-->
<!--        :total.sync="data.total"-->
<!--        @cb="currentChange"-->
<!--      />-->
<!--    </el-col>-->
     <!--选择关联机构-->
    <el-dialog title="关联机构" :visible.sync="dialogTableVisible" center>
      <div style="color:red">
        当前选择会覆盖之前的选择
      </div>
      <el-select clearable  v-model="selectRoomIds" multiple placeholder="请选择机构">
        <el-option
          v-for="item in roomOptions"
          :key="item.id"
          :label="item.studioName"
          :value="item.id">
        </el-option>
  </el-select>
  <div style="margin-top:30px">
     <el-button @click="dialogTableVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirmRltRoom">确 定</el-button>
   
  </div>
   </el-dialog>
  </section>
</template>

<script>
import { apiExamList,apiGetProvinceByExamId,apiGetExamDetails,apiTicketCreate } from '@/api/ticket.js'
import { examinationList,apiRelationStudio } from '@/api/studioManage.js'
export default {
  name: "AssociationExam",
  data() {
    return {
      examName:"",
      examId:sessionStorage.getItem("examId")?sessionStorage.getItem("examId"):"",
      examNameOption: [],
       listLoading: false,
      sels: [], //列表选中列
      search: {
        name: "",
        mobilePhone: "",
      },
      dialogTableVisible:false,
      selectRoomIds: [],
      roomOptions: [],
      form: {
        pageIndex: 1,
        pageSize: 10,
        examNo: "",
        examName: ""

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
      // this.getRoomList()
     this.getList();
    this.getExamList()
  },

  methods: {
    // 查询考试列表
    getExamList(){
      apiExamList().then(res=>{
        this.examNameOption = res.result
        if(sessionStorage.getItem('examId')){
          this.examNameChange(sessionStorage.getItem('examId'))
        }
      })
    },
    // 考试改变监听
    examNameChange(e){
      this.examId = ""
      this.form.examName=""
      this.examNameOption.map(item =>{
        if(item.id == e){
          this.form.examName = item.name
          this.examId = item.id
        }
      })
    },
  // 获取机构
  getRoomList(){
  
     let params = {
        current : 1 ,
        size : 1000 ,
       
      };
      this.$axios
        .post(this.API.roomManage.list, params)
        .then((res) => {
          this.roomOptions = res.result.records;
        })
        .catch(() => {});
  },
    //导出EXCEL
    getExcel(){
      if(!this.examId){
        this.$message({
          message: "请先选择一场考试",
          type: "error",
        });
        return
      }
      let params = {
        "examId": this.examId,
        "studioName": this.form.examNo
      };
      this.$axios.post("/score/exportAvgScoreGroupByStudioId",params).then((res) => {
        if(res.code==200){
          const a = document.createElement('a'); // 创建a标签
          a.setAttribute('download', '');// download属性
          a.setAttribute('href', res.result);// href链接
          a.click();// 自执行点击事件
        }
      })
          .catch(() => {});
    },

  // 获取列表
    getList() {
      if(!this.examId){
        this.$message({
          message: "请先选择一场考试",
          type: "error",
        });
        return
      }
      let params = {
        "examId": this.examId,
        "studioName": this.form.examNo
      };
      if(this.examId){
        sessionStorage.setItem("examId",this.examId)
      }
      this.$axios.post("/score/getAvgScoreGroupByStudioId",params).then((res) => {
                 this.data.records = res.result;
            })
            .catch(() => {});
    },
    // 确认关联机构
    confirmRltRoom(){

      let list = []
       let params = {
        studioIds  : this.selectRoomIds ,
        examId  : this.sels.id
      };
      apiRelationStudio(params).then((res) => {
           this.$message({
                  message: "关联成功",
                  type: "success",
            });
            this.selectRoomIds = []
            this.dialogTableVisible = false
            this.getList()
        })
        .catch(() => {});
    
    },
    // 关联机构
    relationStudio(row){
         this.sels = row;
         this.$axios.get("/studio/getStudioByExamId?examId="+row.id).then((res)=>{
           let list = [];
           res.result.forEach((item,index)=>{
             list.push(item.studioId)
           })
           this.selectRoomIds = list;

           this.dialogTableVisible = true

         })
    },
    // 统计信息
    statisticsInfo(row){
      this.$router.push({ name: 'StudioStatistics', params: {
        examId: row.id
      }})
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
@import "./schoolManage.scss";
.header{
display: flex;
padding-left:200px;
}
</style>

