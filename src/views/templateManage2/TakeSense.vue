<template>
   <section class="form_border" style="position: relative">
     <el-button class="association_btn" style="position: absolute;top: 18px;left: 10px;" type="primary" size="medium" @click="add">新增脱敏</el-button>
    <div class="header" style="display: flex;justify-content: flex-end;padding: 10px;padding-top: 15px">
      <el-select clearable  v-model="form.examName"  placeholder="请选择考试名称" @change="examNameChange" style="margin-right: 0px">
        <el-option
            v-for="item in examNameOption"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>
       <el-button class="association_btn" style="margin-left:50px;" type="primary" size="medium" @click="getList">查询</el-button
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
        label="ID"
        header-align="center"
        align="center"
        prop="id"
      >
      </el-table-column>
      <el-table-column
        label="考试编号"
        header-align="center"
        align="center"
        prop="examId"
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
        label="身份证"
        header-align="center"
        align="center"
        prop="identification==1?'是':'否'"
      >
         <template slot-scope="scope">
           <span v-if="scope.row.identification==1">脱敏</span>
           <span v-if="scope.row.identification==0">未脱敏</span>
         </template>
      </el-table-column>
      <el-table-column
          label="姓名"
          header-align="center"
          align="center"
          prop="identification==1?'是':'否'"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.name==1">脱敏</span>
          <span v-if="scope.row.name==0">未脱敏</span>
        </template>
      </el-table-column>
      <el-table-column
          label="手机"
          header-align="center"
          align="center"
          prop="identification==1?'是':'否'"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.mobile==1">脱敏</span>
          <span v-if="scope.row.mobile==0">未脱敏</span>
        </template>
      </el-table-column>
       <el-table-column
      fixed="right"
      label="操作"
      width="200">
      <template slot-scope="scope">
        <el-button @click="relationStudio(scope.row)" type="text" size="small" >编辑</el-button>
<!--        <el-button  size="small" @click="statisticsInfo(scope.row)" type="text" >统计信息</el-button>-->
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
import { examinationList,apiRelationStudio } from '@/api/studioManage.js'
export default {
  name: "AssociationExam",
  data() {
    return {
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
      this.getRoomList()
     this.getList();
      this.getExamList()
  },

  methods: {
    // 查询考试列表
    getExamList(){
      apiExamList().then(res=>{
        this.examNameOption = res.result
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
    add(){
      this.$router.push({name:"templateManage4"})
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
  // 获取列表
    getList() {
      let params = {
        current : this.form.pageIndex ,
        size : this.form.pageSize ,
        examName  : this.form.examName,
        examId :  this.form.examNo
      };
      this.$axios.post("/datahide/list",params).then((res) => {
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
      this.$router.push({name:"templateManage4",params:{examId:row.examId}})
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

.header{
display: flex;
padding-left:200px;
}
</style>

