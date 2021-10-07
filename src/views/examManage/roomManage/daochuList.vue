<template>
   <section class="form_border">
    <div class="header" style="display: flex;
    justify-content: flex-end;">
<!--        <el-button class="meiyuan_btn" type="primary" size="medium" @click="exportQR"-->
<!--          >生成和导出二维码</el-button-->
<!--        >-->

      <el-select clearable  v-model="form.examName"  placeholder="请选择考试名称" @change="examNameChange" style="width: 160px">
        <el-option
            v-for="item in examNameOption"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>
       <el-select clearable  v-model="form.studentAreaCode" style="width:160px;margin-left:15px;" placeholder="请选择导出状态">
          <el-option
            v-for="item in studentAreaOption"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
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
          label="考试编号"
          header-align="center"
          align="center"
          prop="examNo"
      >
      </el-table-column>
      <el-table-column
        label="考试名称"
        header-align="center"
        align="center"
        prop="examName"
      >
      </el-table-column>
      <el-table-column
          label="创建时间"
          header-align="center"
          align="center"
          prop="createTime"
      >
      </el-table-column>
       <el-table-column
        label="导出状态"
        header-align="center"
        align="center"
      >
          <template slot-scope="scope">
            <div>{{ scope.row.status == 0 ? '生成中' :scope.row.status == 1 ? '生成成功' :'生成失败'  }}</div>
          </template>
      </el-table-column>
      <el-table-column
          label="导出文件名"
          header-align="center"
          align="center"
          prop="filename"
      >
      </el-table-column>
      <el-table-column
          label="下载地址"
          header-align="center"
          align="center"
      >
        <template slot-scope="scope">
          <a style="color: #409EFF" target="_blank" v-if="scope.row.downloadUrl && $route.query.type=='ticket'" :href="scope.row.downloadUrl">准考证PDF下载</a>
          <a style="color: #409EFF" target="_blank" v-if="scope.row.downloadUrl && $route.query.type=='qrcode'" :href="scope.row.downloadUrl">二维码PDF下载</a>
          <a style="color: #409EFF" target="_blank" v-if="scope.row.downloadUrl && $route.query.type=='exam_paper'" :href="scope.row.downloadUrl">试卷ZIP压缩包下载</a>
        </template>
      </el-table-column>
        <el-table-column
      fixed="right"
      label="操作"
      width="200">
      <template slot-scope="scope">
        <el-button @click="del(scope.row.id)" type="text" size="small" >删除</el-button>
      </template>
    </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <myPagination
        :current.sync="form.pageIndex"
        :pages.sync="data.pages"
        :size.sync="form.pageSize"
        :total.sync="data.total"
        @cb="currentChange"
      />
    </el-col>
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
import { getAllProvince } from '@/api/studioManage.js'
import { apiUnionExamList } from '@/api/ticket.js'


export default {
  name: "AdmissionTicket",
  data() {
    return {
      addressList:[],
      examName:"",
      examId:"",
      examNameOption: [],
       listLoading: false,
      sels: [], //列表选中列
      search: {
        name: "",
        mobilePhone: "",
      },
      studentAreaOption: [
        {id:"",name:"全部状态"},
        {id:0,name:"正在处理"},
        {id:1,name:"生成成功"},
        {id:-1,name:"生成失败"},
      ],
      dialogTableVisible:false,
      selectRoomIds: [],
      roomOptions: [],
      form: {
        pageIndex: 1,
        pageSize: 10,
        studentAreaName:'',
        studentAreaCode: '',
        studentName: '',
        examName: '',
        examNo: '',
        admissionTicketCode:"",
        studioName:"",
        address:""
      },

      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [
        {
         
        }
      ] },
      isAdd: false,
      isAddType: 1, //1新增  0编辑
      editItemData: {},
      daochu:{},
    };
  },
  created() {
      // this.getAllProvinces()
     this.getList();
    this.getExamList()
  },

  methods: {
    del(id){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('/exam/export_record/delete?id='+id).then((res)=>{
          if(res.code == 200){
            this.getList();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 查询考试列表
    getExamList(){
      apiExamList().then(res=>{
        this.examNameOption = res.result
      })
    },
    // 考试改变监听
    examNameChange(e){
      this.examId = ""
      this.form.examName =""
      this.form.address = ""
      this.examNameOption.map(item =>{
        if(item.id == e){
          this.form.examName = item.name
          this.examId = item.no
        }
      })
    },
    getDz(){
      this.$axios.get("/examinfo/detail?id="+this.examId).then((res)=>{
        this.addressList = res.result.addressList;
      })
    },
     // 生成和导出二维码
     exportQR(){

     },
     // 导出准考证
     exportTicket(){
       if(this.daochu.examName == ""){
         this.$message({
           message: "请先根据考试名称查询！",
           type: "error",
         });
         return false
       }
       this.$axios
           .post('/ticket/ticketExport', this.daochu)
           .then((res) => {
             if(res.code== 200){
               this.$message({
                 message: "已提交导出请求，请稍后到导出列表下载！",
                 type: "success",
               });
             }
           })
           .catch(() => {});
     },
        // 区域改变监听
    studioAreaChange(e){
      this.studentAreaOption.map(item =>{
        if(item.provinceCode == e){
          this.from.studentAreaName = item.province
        }
      })
    },
     // 获取所有区域
     getAllProvinces(){
       this.$axios
           .get(this.API.studentsManage.examRoomProvince)
           .then((res) => {
             this.studentAreaOption = res.result || []
           })
           .catch(() => {})

    },
  // 获取列表
    getList() {
      let params = {
        current : this.form.pageIndex ,
        size : this.form.pageSize ,
        type:this.$route.query.type,
        status:this.form.studentAreaCode,
        exam_no:this.examId
      };
      this.daochu = params;
      this.$axios.post('/exam/export_record/list',params).then((res) => {
                 this.data.records = res.result.list;
                this.data.current = res.result.current;
                this.data.total = res.result.total;
                (this.data.pageSize = res.result.pageSize), (this.data.pages = res.result.pages);
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
         this.sels = row
          this.dialogTableVisible = true
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

