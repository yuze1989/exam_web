<template>
  <section class="form_border">
    <div class="header" style="height: 66px">
        <el-col :span="24" style="display: flex;justify-content: flex-end">
          <el-select clearable  v-model="form.examName" style="width: 200px;"  placeholder="请选择考试名称" @change="examNameChange">
            <el-option
                v-for="item in examNameOption"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
          <el-select clearable
                     v-model="form.ticketStatus"
                     style="width: 200px; margin-left: 20px;"
                     placeholder="准考证号状态"
          >
            <el-option
                v-for="item in ticketStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
          </el-select>

          <el-input
              style="width: 200px;margin-left: 20px;"
              v-model="form.examineeName"
              placeholder="姓名"
          ></el-input>
          <el-input
              style="width: 200px; margin-right: 20px;margin-bottom: 5px;margin-left: 20px;"
              v-model="form.studioName"
              placeholder="机构名称"
          ></el-input>
          <el-button type="primary" style="margin-left: 20px;" @click="pageReset">
            查询
          </el-button>
          <el-button type="primary" @click="ticketGenerate" style="float: left">生成准考证号</el-button>
        </el-col>
<!--      <el-button type="warning" @click="reset">重置</el-button>-->

    </div>
    <!-- 导入 导出 -->

    <!--列表-->
    <el-table
      :data="list"
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
      ></el-table-column>

      <el-table-column
        label="考试名称"
        header-align="center"
        align="center"
        prop="examName"
      ></el-table-column>

      <el-table-column
        label="姓名"
        header-align="center"
        align="center"
        prop="name"
      ></el-table-column>

      <el-table-column
        label="身份证号"
        header-align="center"
        align="center"
        prop="identification"
      ></el-table-column>

      <el-table-column
        label="准考证号"
        header-align="center"
        align="center"
        prop="admissionTicketCode"
      ></el-table-column>

      <el-table-column
        label="机构名称"
        header-align="center"
        align="center"
        prop="studioName"
      ></el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <myPagination
        :current.sync="form.current"
        :pages.sync="form.pages"
        :size.sync="form.size"
        :total.sync="form.total"
        @cb="currentChange"
      />
    </el-col>
  </section>
</template>
<script>

import { apiExamList,apiGetProvinceByExamId,apiGetExamDetails,apiTicketCreate } from '@/api/ticket.js'
import { Message } from "element-ui";
export default {
  components: {},
  data() {
    return {
      list: [],
      examName:"",
      examId:sessionStorage.getItem("examId")?sessionStorage.getItem("examId"):"",
      examNameOption: [],
      form: {
        current: 1,
        size: 10,
        ticketStatus: '',
        examineeName: '', //考生姓名
        studioName: '', //: 机构名称
        examName: '', //考试名称
      },
      value: '',
      data: { pages: 0, size: 10, total: 0, records: [] },
      ticketStatusList: [
        { value: '0', label: '已生成' },
        { value: '1', label: '未生成' },
      ],
      daochu:""
    }
  },
  created() {
    this.getList()
    this.getExamList()
  },
  methods: {
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
      this.form.examName= ""
      this.examNameOption.map(item =>{
        if(item.id == e){
          this.form.examName = item.name
          this.examId = item.id
        }
      })
    },
    ticketGenerate() {
      if(!this.daochu.examId){
        Message.warning('请先根据考试名称查询')
        return false
      }

      this.$axios
          .post('/examinee/ticketGenerateCalc', this.daochu)
          .then((res) => {
            if (res.code == 200) {
              if(res.result.balance/1 < res.result.totalPrice/1){
                Message.error('账户余额不足，请充值！')
              }else{
                this.$confirm('本次操作将支付 '+res.result.totalPrice+' 元,请确认?', '提示', {
                  confirmButtonText: '确认支付',
                  cancelButtonText: '取消支付',
                  type: 'warning'
                }).then(() => {
                  this.$axios
                      .post(this.API.studentsManage.ticketGenerate, this.daochu)
                      .then((res) => {
                        if (res.code == 200) {
                          Message.success('准考证号生成成功！')
                          this.form.current = 1
                          this.getList()
                          this.$parent.get_money()
                        }
                        this.listLoading = false
                      })
                      .catch(() => {
                        this.listLoading = false
                      })
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消支付'
                  });
                });
              }
            }
            this.listLoading = false
          })
          .catch(() => {
            this.listLoading = false
          })
    },
    pageReset() {
      this.form.current = 1
      this.getList()
    },
    reset() {
      this.form = {
        current: 1,
        size: 10,
        checkStatus: '', //审核状态:0未审核；1通过；2未通过 ,
        examName: '', //考试名称
      }
      this.getList()
    },

    currentChange() {
      this.getList()
    },
    // 订单列表
    getList() {
      this.listLoading = true
      let params = {
        ...this.form,
        examId:this.examId
      }
      this.daochu= params;
      if(this.examId){
        sessionStorage.setItem("examId",this.examId)
      }
      this.$axios
        .post(this.API.studentsManage.ticketList, params)
        .then((res) => {
          this.listLoading = false
          this.list = res.result.list
          this.form.pageNum = res.result.pageNum
          this.form.pageSize = res.result.pageSize
          this.form.total = res.result.total

        })
        .catch(() => {
          this.listLoading = false
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
