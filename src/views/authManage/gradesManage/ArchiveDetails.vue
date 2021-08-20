<template>
  <section class="form_border">
    <div class="header">
      <div class="from-wrap">
        <el-form :inline="true" :model="search" class="demo-form-inline" @submit.native.prevent style="display: flex;justify-content: flex-end;height: 36px">
<!--          <el-form-item>-->
<!--            <el-select clearable -->
<!--                v-model="search.archiveStatus"-->
<!--                style="width: 130px; margin-right: 20px;"-->
<!--                placeholder="归档状态"-->
<!--            >-->
<!--              <el-option-->
<!--                  v-for="(item, index) in archiveStatus"-->
<!--                  :key="index"-->
<!--                  :label="item.name"-->
<!--                  :value="item.id"-->
<!--              ></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--          <el-form-item>-->
<!--            <el-select clearable -->
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
                v-model="search.admissionTicketCode"
                placeholder="请输入准考证号码"
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
          label="身份证号码"
          header-align="center"
          align="center"
          prop="identification"
      >
      </el-table-column>
      <el-table-column
          label="生源省份"
          header-align="center"
          align="center"
          prop="province"
      >
      </el-table-column>
      <el-table-column v-for="(item, index) in dataList.records[0].subjectList" :label="item.subjectName" header-align="center" align="center">
        <template>
          {{item.score}}
        </template>
      </el-table-column>

      <el-table-column
          label="总分"
          header-align="center"
          align="center"
          prop="score"
      >
      </el-table-column>
      <el-table-column
          label="机构内排名"
          header-align="center"
          align="center"
          prop="rankInStudio"
      >
      </el-table-column>
      <el-table-column
          label="总排名"
          header-align="center"
          align="center"
          prop="rankInProvince"
      >
      </el-table-column>
      <el-table-column label="试卷信息" header-align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="save(scope.row)">查看试卷</el-button>
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
<!--    查看试卷-->
    <el-dialog title="试卷信息" :visible.sync="dialogTableVisible">
      <el-row>
        <el-col :span="8" v-for="(o, index) in sjList" :key="o" style="padding: 10px">
          <el-card :body-style="{ padding: '0px' }">
            <img :src="o.img" class="image">
            <div style="padding: 14px;">
              <div>科目名称：{{o.subjectName}}</div>
              <div>分数：{{o.score}}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>
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
      sjList:[],
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
        // "archiveStatus":this.search.archiveStatus,
        // "examName":this.search.examName,
        // "examType":this.search.examType,
        "schoolId": "",
        "admissionTicketCode": this.search.admissionTicketCode,
        "examId": this.$route.query.id,
        "examineeName": "",
        "provinceCode": "",
        "scoreEnd": "",
        "scoreStart": "",
        "studioId": "",
        "studioName": "",
        "subject": "",






      };
      this.$axios
        .post('/score/hisFileDetailList', params)
        .then((res) => {
          this.dataList.pageIndex = res.result.pageNum;
          this.dataList.total = res.result.total;
          (this.dataList.pageSize = res.result.pageSize), (this.dataList.pages = res.result.pageNum);
          this.dataList.records = res.result.list;
        })
        .catch(() => {});
      // this.search.admissionTicketCode = ""
    },

    save(row) {
      console.log(row);
      this.sjList = row.subjectList;
      this.dialogTableVisible = true

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