<template>
   <section class="form_border">
    <!-- <div style="height:88px;line-height: 88px;padding-left:20px;color:blue;" @click="goStudentAccont">
        汇总信息：生源信息汇总
      </div> -->
      <!-- <router-link to="/studioStatistics"> 汇总信息：生源信息汇总</router-link> -->
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
        label="机构编号"
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
        label="机构地区"
        header-align="center"
        align="center"
        prop="studioAreaName"
      >
      </el-table-column>
        <el-table-column
        label="学生总人数"
        header-align="center"
        align="center"
      >
        
          <template slot-scope="scope">
            <div  @click="studentInfo(scope.row)">{{ scope.row.studioNum }}</div>
          </template>
      </el-table-column>
       <el-table-column
      fixed="right"
      label="操作"
      width="200">
      <template slot-scope="scope">
        <el-button @click="studentInfoList(scope.row)" type="text"  size="small" >生源详情</el-button>
        <el-button @click="goStudentAccont(scope.row)" type="text"  size="small" >考试汇总</el-button>
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

  </section>
</template>

<script>

import { apiStudioStatisticsList } from '@/api/studioManage.js'
export default {
  name: "StudioStatistics",
  data() {
    return {
      examId: '',
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
     this.examId =   this.$route.params.examId
     this.getList();
  },

  methods: {
 
  // 获取列表
    getList() {
      let params = {
        current : this.form.pageIndex ,
        pageSize : this.form.size ,
        examId : this.examId
       
      };
      apiStudioStatisticsList(params).then((res) => {
                 this.data.records = res.result.list;
                this.data.pageIndex = res.result.current;
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
    statisticsInfo(){},
   currentChange() {
      //console.log('index' + index)
      this.getList();
    },
    // 跳转生源地汇总信息
    goStudentAccont(row){
      this.$router.push({ name: 'StudentAccont', params: {
        itemInfo : JSON.stringify(row)
      }})
    },
    // 跳转生源详情
    studentInfoList(row){
        this.$router.push({ name: 'StudentDetailsInfo', params: {
        itemInfo : JSON.stringify(row)
      }})
    },
    // 跳转学生统计详情
    studentInfo(row){
       this.$router.push({ name: 'StudentInfo', params: {
        itemInfo : JSON.stringify(row)
      }})
    }
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

