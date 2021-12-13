<template>
  <section class="form_border">
<!--    <div class="header">-->
<!--      <div class="from-wrap">-->
<!--        <el-form :inline="true" :model="search" class="demo-form-inline" @submit.native.prevent style="display: flex;justify-content: flex-end;height: 36px">-->
<!--          <el-form-item>-->
<!--            <el-input-->
<!--                v-model="search.admissionTicketCode"-->
<!--                placeholder="请扫码或者输入准考证号"-->
<!--                @keyup.enter.native="inputNum"-->
<!--            ></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <el-button type="primary" @click="onSubmit">查询</el-button>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--      </div>-->
<!--      <div>-->
<!--      </div>-->
<!--    </div>-->
    <!--列表-->
    <el-table
      :data="dataList.records"
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
        label="归档状态"
        header-align="center"
        align="center"
        prop="admissionTicketCode"
      >
      </el-table-column>
      <el-table-column
        label="归档时间"
        header-align="center"
        align="center"
        prop="name"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        header-align="center"
        align="center"
        prop="identification"
      >
      </el-table-column>


<!--      <el-table-column label="操作" width="130" header-align="center">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button type="text" size="small" @click="save(scope.row)"-->
<!--            >详情</el-button-->
<!--          >-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <myPagination
        :current.sync="form.pageIndex"
        :pages.sync="dataList.pages"
        :size.sync="form.pageSize"
        :total.sync="dataList.total"
        @cb="currentChange"
      />
    </el-col>
  </section>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
      listLoading: false,
      //新增界面数据
      search: {
        admissionTicketCode : "",
      },
      form: {
        pageIndex: 1,
        pageSize: 10,
      },

      dataList: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [
        {
          'id': 1,'data': 2,'sales': 3,'salt': 4,'const': 5, 'profit': 6
        }
      ] },
      subjectName1: false,
      subjectName2: false,
      subjectName3: false,
      subjectName4: false,
      arr:[]
    };
  },
  created() {
    this.getList();
  },

  methods: {
    onSubmit() {
      this.getList();
    },
    currentChange(){
      this.getList();
    },
    inputNum(target){
      let timenow = target.timeStamp;
      let iscontu = true;
      this.arr.push(timenow);
      let i;
      for(i in this.arr){
        if(Math.ceil(this.arr[this.arr.length-1]) - Math.ceil(this.arr[this.arr.length-2]) < 3000){
          iscontu = true;

        }else{
          iscontu = false;

        }
        if(i>0 && this.arr.length == parseInt(i)+1){
          if(iscontu == true){
            return
          }
        }
      }
    },

    getList() {
      // let roleId = this.search.state == -1 ? null : this.search.state;
      // let params = {
      //   current: this.form.pageIndex,
      //   size: this.form.pageSize,
      //   admissionTicketCode: this.search.admissionTicketCode,
      // };
      // this.$axios
      //   .post('/score/scoreList', params)
      //   .then((res) => {
      //     this.dataList.pageIndex = res.result.pageNum;
      //     this.dataList.total = res.result.total;
      //     (this.dataList.pageSize = res.result.pageSize), (this.dataList.pages = res.result.pageNum);
      //     this.dataList.records = res.result.list;
      //   })
      //   .catch(() => {});
      // this.search.admissionTicketCode = ""
    },

    save (row) {
      let params = {
        admissionTicketCode: '',
        id: row.id,
        schoolId: 0,
        subjectList: row.subjectList
      }
      this.$axios
        .post('/score/scoreSave', params)
        .then((res) => {
          if(res.code === 200) {
            this.$message({
                message: '保存成功',
                type: 'success',
                duration: 1500,
              })
          }
        })
        .catch(() => {});
    }

  },
  watch: {
    dataList (val) {

    }
  },
  mounted() {},
  beforeCreate() {},
};
</script>

<style lang="scss" scoped>
@import "./gradesManage.scss";
</style>