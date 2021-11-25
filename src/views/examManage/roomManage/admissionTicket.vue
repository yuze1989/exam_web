<template>
   <section class="form_border">
    <div class="header" style="display: block;padding-left: 150px">
<!--        <el-button class="meiyuan_btn" type="primary" size="medium" @click="exportQR"-->
<!--          >生成和导出二维码</el-button-->
<!--        >-->

        <el-button class="association_btn" type="primary" size="medium" @click="go_d" style="position: absolute;left: 20px">下载准考证</el-button>

        <el-select clearable  v-model="form.examName"  placeholder="请选择考试名称" @change="examNameChange" style="width: 160px">
          <el-option
              v-for="item in examNameOption"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
        <el-select clearable  v-model="form.address"  placeholder="请选择考试地址" style="width: 150px;margin-left:15px;">
          <el-option
              v-for="item in addressList"
              :key="item.examAddress"
              :label="item.examAddress"
              :value="item.examAddress">
          </el-option>
        </el-select>
        <el-input v-model="form.examNo" style="width:120px;margin-left:15px;"  placeholder="输入考场"
        ></el-input>
        <el-input v-model="form.studentName" style="width:120px;margin-left:15px;"  placeholder="学生姓名"
        ></el-input>
        <el-input v-model="form.admissionTicketCode" style="width:140px;margin-left:15px;"  placeholder="准考证号"
        ></el-input>
        <el-input v-model="form.studioName" style="width:120px;margin-left:15px;"  placeholder="机构名称"
        ></el-input>
        <el-select clearable  v-model="form.studentAreaCode" style="width:160px;margin-left:15px;" placeholder="请选择生源省份" @change="studioAreaChange">
          <el-option
              v-for="item in studentAreaOption"
              :key="item.provinceCode"
              :label="item.province"
              :value="item.provinceCode">
          </el-option>
        </el-select>
      <el-input v-model="form.params1" style="width:120px;margin-left:15px;"  placeholder="自定义参数1"
      ></el-input>
      <el-input v-model="form.params2" style="width:120px;margin-left:15px;"  placeholder="自定义参数2"
      ></el-input>
      <el-input v-model="form.params3" style="width:120px;margin-left:15px;"  placeholder="自定义参数3"
      ></el-input>
      <el-select clearable  v-model="form.studio" style="width:160px;margin-left:15px;" placeholder="排序方式">
        <el-option
            v-for="item in studentAreaCode2"
            :key="item.id"
            :label="item.label"
            :value="item.id">
        </el-option>
      </el-select>
<!--      <el-input v-model="form.gender" style="width:120px;margin-left:15px;"  placeholder="性别"-->
<!--      ></el-input>-->
      <el-button class="association_btn" type="primary" style="float: right" size="medium" @click="exportTicket">生成准考证</el-button>
      <el-button class="association_btn" style="float: right;margin-right:15px;"  type="primary" size="medium" @click="getList">查询</el-button>


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
        label="考试编码"
        header-align="center"
        align="center"
        prop="examCode"
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
        label="考试类型"
        header-align="center"
        align="center"
      >
          <template slot-scope="scope">
            <div>{{ scope.row.examTypeStr == 0 ? '机构考试' :scope.row.examTypeStr == 1 ? '联合考试' :'线下考试'  }}</div>
          </template>
      </el-table-column>
       <el-table-column
        label="准考证号"
        header-align="center"
        align="center"
        prop="admissionTicketCode"
      >
      </el-table-column>
       <el-table-column
        label="姓名"
        header-align="center"
        align="center"
        prop="name"
      >
      </el-table-column>
      <el-table-column
          label="性别"
          header-align="center"
          align="center"
          prop="gender"
      >
      </el-table-column>
       <el-table-column
        label="身份证号"
        header-align="center"
        align="center"
        prop="identification"
      >
      </el-table-column>
       <el-table-column
        label="机构编码"
        header-align="center"
        align="center"
        prop="studioCode"
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
        label="所属省份"
        header-align="center"
        align="center"
        prop="province"
      >
      </el-table-column> <el-table-column
        label="考场"
        header-align="center"
        align="center"
        prop="examinationRoomCode"
      >
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
      examId:sessionStorage.getItem("examId")?sessionStorage.getItem("examId"):"",
      examNameOption: [],
       listLoading: false,
      sels: [], //列表选中列
      search: {
        name: "",
        mobilePhone: "",
      },
      studentAreaOption:[],
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
        address:"",
        gender:"",
        studio:'',
        params1:"",
        params2:"",
        params3:"",
      },
      studentAreaCode2:[{id:'param',label:"按自定义参数排序"},{id:'studio',label:"按机构排序"},{id:"",label:"按考场排序"}],
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
      this.getAllProvinces()
     this.getList();
    this.getExamList()
  },

  methods: {
    go_d(){
      this.$router.push({path:"/daochuList",query:{type:'ticket'}})
    },
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
      this.form.examName =""
      this.form.address = ""
      this.addressList = [];
      this.examNameOption.map(item =>{
        if(item.id == e){
          this.form.examName = item.name
          this.examId = item.id
          this.addressList = [];
          this.getDz()
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
       this.daochu.orderBy = this.form.studio;
       this.$axios
           .post('/ticket/ticketExport', this.daochu)
           .then((res) => {
             if(res.code== 200){
               this.$message({
                 message: "已提交导出请求，请稍后到下载准考证下载！",
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
        examName : this.form.examName,
        roomCode :  this.form.examNo,
        provinceCode : this.form.studentAreaCode,
        examineeName : this.form.studentName,
        studioName:this.form.studioName,
        admissionTicketCode:this.form.admissionTicketCode,
        examId:this.examId,
        address:this.form.address,
        gender:this.form.gender,
        param1:this.form.params1,
        param2:this.form.params2,
        param3:this.form.params3,
      };
      this.daochu = params;
      if(this.examId){
        sessionStorage.setItem("examId",this.examId)
      }
      apiUnionExamList(params).then((res) => {
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
.header>div{
  margin-bottom: 10px;
}
</style>

