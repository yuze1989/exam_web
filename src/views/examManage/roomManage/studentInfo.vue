<template>
   <section class="form_border">
    <div style="height:88px;line-height: 88px;padding-left:20px;" >
        学生详情信息
      </div>
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
        label="姓名"
        header-align="center"
        align="center"
        prop="name"
      >
      </el-table-column>
      <el-table-column
        label="身份证号码"
        header-align="center"
        align="center"
        prop="identification"
      >
      </el-table-column>
       <el-table-column
        label="画室编号"
        header-align="center"
        align="center"
        prop="studioCode"
      >
      </el-table-column>
       <el-table-column
        label="画室名称"
        header-align="center"
        align="center"
        prop="studioName"
      >
      </el-table-column>
       <el-table-column
        label="报名费用"
        header-align="center"
        align="center"
        prop="price"
      >
      </el-table-column>
        <el-table-column
        label="报名支付状态"
        header-align="center"
        align="center"
      >
         <template slot-scope="scope">
            <div>{{ scope.row.payStatusStr == 1 ? '已支付' : '未支付'  }}</div>
          </template>
      </el-table-column>
        <el-table-column
        label="报名来源"
        header-align="center"
        align="center"
      >
         <template slot-scope="scope">
            <div>{{ scope.row.sourceStr == 1 ? '手机' : '后台'  }}</div>
          </template>
      </el-table-column>
         <el-table-column
        label="照片"
        header-align="center"
        align="center"
      >
         <template slot-scope="scope">
            <img :src="scope.row.url" style="width:100px;height:100px" />
          </template>
      </el-table-column>
          <el-table-column
        label="审核状态"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
            <div>{{ scope.row.sourceStr == 2 ? '拒绝' : scope.row.sourceStr == 1 ? '通过' : '待审核'  }}</div>
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

import { apiStudentInfoList } from '@/api/studioManage.js'
export default {
  name: "StudentInfo",
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
        size: 10,

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
      if(this.$route.params.itemInfo){
        this.params = JSON.parse(this.$route.params.itemInfo) 
      }
     this.getList();
  },

  methods: {
 
  // 获取列表
    getList() {
      let params = {
        current : this.form.pageIndex ,
        size : this.form.size ,
        examId : this.params.examId ,
        studioId : this.params.studioId
      };
      apiStudentInfoList(params).then((res) => {
                 this.data.records = res.result.list;
                this.data.pageIndex = res.result.current;
                this.data.total = res.result.total;
                (this.data.size = res.result.pageSize), (this.data.pages = res.result.pages);
            })
            .catch(() => {});
    },
    // 确认关联画室
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
    // 关联画室
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
    goStudentAccont(){
      this.$router.push({ name: 'StudentAccont'})
    },
    // 跳转学生统计详情
    studentInfo(){
       this.$router.push({ name: 'StudentInfo'})
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

