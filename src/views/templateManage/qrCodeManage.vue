<template>
   <section class="form_border">
    <div class="header">
        <el-input v-model="form.examNo" style="width:200px"  placeholder="考试编号"
        ></el-input>
        <el-input v-model="form.examName" style="width:200px;margin-left:50px;"  placeholder="考试编名称"
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
        label="考试编码"
        header-align="center"
        align="center"
        prop="no"
      >
      </el-table-column>
      <el-table-column
        label="考试名称"
        header-align="center"
        align="center"
        prop="name"
      >
      </el-table-column>
       <el-table-column
        label="机构数量"
        header-align="center"
        align="center"
        prop="studioNum"
      >
      </el-table-column>
      
       <el-table-column
      fixed="right"
      label="操作"
      width="200">
      <template slot-scope="scope">
        <el-button @click="relationStudio(scope.row)" type="text" size="small" >关联机构</el-button>
        <el-button  size="small" @click="statisticsInfo(scope.row)" type="text" >统计信息</el-button>
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

import { examinationList,apiRelationStudio } from '@/api/studioManage.js'
export default {
  name: "TicketManage",
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
        size: 10,
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
  },

  methods: {
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
@import "./index.scss";
.header{
display: flex;
padding-left:200px;
}
</style>

