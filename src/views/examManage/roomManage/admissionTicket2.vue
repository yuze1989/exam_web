<template>
   <section class="form_border">
    <div class="header" style="display: flex;
    justify-content: flex-end;">
        <el-button class="meiyuan_btn" type="primary" size="medium" @click="exportQR"  style="position: absolute;
    left: 15px;
    height: 40px;"
          >导出二维码</el-button
        >
<!--        <el-button class="association_btn" type="primary" size="medium" @click="exportTicket"-->
<!--          >导出准考证</el-button-->
<!--        >-->
        <el-input v-model="form.examName" style="width:200px;margin-left:50px;" placeholder="考试名称"
        ></el-input>
        <el-input v-model="form.examNo" style="width:200px;margin-left:15px;"  placeholder="输入考场"
        ></el-input>
         <el-input v-model="form.studentName" style="width:200px;margin-left:15px;"  placeholder="学生姓名"
        ></el-input>
      <el-input v-model="form.studentName" style="width:200px;margin-left:15px;"  placeholder="准考证号"
      ></el-input>
      <el-input v-model="form.studentName" style="width:200px;margin-left:15px;"  placeholder="机构名称"
      ></el-input>
       <el-select v-model="form.studentAreaCode" style="width:200px;margin-left:15px;" placeholder="请选择生源省份" @change="studioAreaChange">
          <el-option
            v-for="item in studentAreaOption"
            :key="item.provinceCode"
            :label="item.province"
            :value="item.provinceCode">
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
       <!-- <el-table-column
        label="二维码"
        header-align="center"
        align="center"
      >
         <template slot-scope="scope">
            <img :src="scope.row.url" style="width:100px;height:100px" />
          </template>
      </el-table-column> -->
       <!-- <el-table-column
      fixed="right"
      label="操作"
      width="200">
      <template slot-scope="scope">
        <el-button @click="relationStudio(scope.row)" type="text" size="small" >关联机构</el-button>
        <el-button  size="small" @click="statisticsInfo(scope.row)" type="text" >统计信息</el-button>
      </template>
    </el-table-column> -->
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
      <el-select v-model="selectRoomIds" multiple placeholder="请选择机构">
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

import { getAllProvince } from '@/api/studioManage.js'
import { apiUnionExamList } from '@/api/ticket.js'


export default {
  name: "AdmissionTicket",
  data() {
    return {
       listLoading: false,
      sels: [], //列表选中列
      search: {
        name: "",
        mobilePhone: "",
      },
      studentAreaOption: [],
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
        examNo: ''

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
      this.getAllProvinces()
     this.getList();
  },

  methods: {
     // 生成和导出二维码
     exportQR(){

     },
     // 导出准考证
     exportTicket(){

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
      getAllProvince().then(res=>{
        this.studentAreaOption = res.result
      })
    },
  // 获取列表
    getList() {
      let params = {
        current : this.form.pageIndex ,
        size : this.form.pageSize ,
        examName : this.form.examName,
        roomCode :  this.form.examNo,
        provinceCode : this.form.studentAreaCode,
        examineeName : this.form.studentName
      };
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
.header{
display: flex;
padding-left:200px;
}
</style>

