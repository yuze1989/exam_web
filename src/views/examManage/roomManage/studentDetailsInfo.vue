<template>
   <section class="form_border">
    <div style="color:bule;height:88px;line-height: 88px;padding-left:20px">
        关联机构详情信息
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
        label="生源省份"
        header-align="center"
        align="center"
        prop="province"
      >
      </el-table-column>
      <el-table-column
        label="生源人数"
        header-align="center"
        align="center"
        prop="studentNum"
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

  </section>
</template>

<script>

import { apiStudentDetailList } from '@/api/studioManage.js'
export default {
  name: "StudentAccont",
  data() {
    return {
      
      params: null,
      form: {
        pageIndex: 1,
        size: 10,

      },

      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [
        {
         
        }
      ] },
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
      apiStudentDetailList(params).then((res) => {
                 this.data.records = res.result.list;
                this.data.current = res.result.current;
                this.data.total = res.result.total;
                (this.data.size = res.result.pageSize), (this.data.pages = res.result.pages);
            })
      .catch(() => {});
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

