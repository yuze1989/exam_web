<template>
  <section class="form_border">
    <div class="header">
      <div class="from-wrap">
        <el-form :inline="true" :model="search" class="demo-form-inline" @submit.native.prevent style="display: flex;justify-content: flex-end;height: 36px">
          <el-form-item>
            <el-select
                v-model="search.archiveStatus"
                style="width: 130px; margin-right: 20px;"
                placeholder="归档状态"
            >
              <el-option
                  v-for="(item, index) in archiveStatus"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
<!--          <el-form-item>-->
<!--            <el-select-->
<!--                v-model="search.examType"-->
<!--                style="width: 130px; margin-right: 20px;"-->
<!--                placeholder="考试类型"-->
<!--            >-->
<!--              <el-option-->
<!--                  v-for="(item, index) in examType"-->
<!--                  :key="index"-->
<!--                  :label="item.name"-->
<!--                  :value="item.id"-->
<!--              ></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <el-form-item>
            <el-input
                v-model="search.examName"
                placeholder="请输入考试名称"
                @keyup.enter.native="inputNum"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
      </div>
    </div>
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
        prop="archiveStatusStr"
      >
      </el-table-column>
      <el-table-column
        label="归档时间"
        header-align="center"
        align="center"
        prop="updateTime"
      >
      </el-table-column>
      <el-table-column label="操作" width="330" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="save(scope.row)" v-if="scope.row.archiveStatus==0"
          >开始归档</el-button
          >
          <el-button type="text" size="small" @click="openXq(scope.row)" v-if="scope.row.archiveStatus==1">归档详情</el-button
          >
        </template>
      </el-table-column>
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
      dialogTableVisible:false,
      gridData:[],
      //新增界面数据
      search: {
        admissionTicketCode : "",
        archiveStatus:"",
        examType:"",
        examName:""
      },
      form: {
        pageIndex: 1,
        pageSize: 10,
      },
      archiveStatus: [
        { name: '全部状态', id: "" },
        { name: '未归档', id: 0 },
        { name: '已归档', id: 1 },
      ],
      examType: [
        { name: '全部类型', id: "" },
        { name: '画室考试', id: 0 },
        { name: '联合考试', id: 1 },
        { name: '线下考试', id: 2 },
      ],

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
    openXq(row){
      this.$router.push({name:"ArchiveDetails",query:{id:row.examId}})
    },
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
      let roleId = this.search.state == -1 ? null : this.search.state;
      let params = {
        current: this.form.pageIndex,
        size: this.form.pageSize,
        "archiveStatus":this.search.archiveStatus,
        "examName":this.search.examName,
        "examType":this.search.examType,
        "schoolId": "",
      };
      this.$axios
        .post('/score/hisFileList', params)
        .then((res) => {
          this.dataList.pageIndex = res.result.pageNum;
          this.dataList.total = res.result.total;
          (this.dataList.pageSize = res.result.pageSize), (this.dataList.pages = res.result.pageNum);
          this.dataList.records = res.result.list;
        })
        .catch(() => {});
      this.search.admissionTicketCode = ""
    },

    save(row) {
      this.$confirm("此操作将开始归档, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {

            this.$axios
                .post('/score/examArchive?examId='+row.examId)
                .then((res) => {
                  if(res.code === 200) {
                    this.$message({
                      message: '提交成功',
                      type: 'success',
                      duration: 1500,
                    })
                    this.getList()
                  }
                })
                .catch(() => {});
            // this.$message({
            //   type: "success",
            //   message: "已重置",
            // });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作",
            });
          });


    }

  },
  watch: {
    dataList (val) {
      console.log(val,'val---------')
    }
  },
  mounted() {},
  beforeCreate() {},
};
</script>

<style lang="scss" scoped>
@import "./gradesManage.scss";
</style>