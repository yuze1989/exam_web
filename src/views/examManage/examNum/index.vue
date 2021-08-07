<template>
  <section class="form_border">
    <div class="header">
      <el-input
        style="width: 200px;"
        v-model="form.examineeName"
        placeholder="姓名"
      ></el-input>

      <el-select
        v-model="form.ticketStatus"
        style="width: 200px; margin-left: 20px;"
        placeholder="准考状态"
      >
        <el-option
          v-for="item in ticketStatusList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <el-button type="primary" style="margin-left: 20px;" @click="pageReset">
        查询
      </el-button>
      <el-button type="warning" @click="reset">重置</el-button>
      <el-button type="primary" @click="ticketGenerate">生成准考证</el-button>
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
        label="考场编码"
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
        label="画室名称"
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
import { Message } from '_element-ui@2.15.5@element-ui'
export default {
  components: {},
  data() {
    return {
      list: [],
      form: {
        current: 1,
        size: 10,
        ticketStatus: '',
        examineeName: '',
      },
      value: '',
      data: { pages: 0, size: 10, total: 0, records: [] },
      ticketStatusList: [
        { value: '0', label: '已生成' },
        { value: '1', label: '未生成' },
      ],
    }
  },
  created() {
    this.getList()
  },
  methods: {
    ticketGenerate() {
      this.$axios
        .post(this.API.studentsManage.ticketGenerate, {})
        .then((res) => {
          if (res.code == 200) {
            Message.success('准考证号生成成功')
            this.form.current = 1
            this.pageReset()
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
      }
      this.$axios
        .post(this.API.studentsManage.ticketList, params)
        .then((res) => {
          this.listLoading = false
          this.list = res.result.list
          this.form.pageNum = res.result.pageNum
          this.form.pageSize = res.result.pageSize
          this.form.total = res.result.total
          console.log(this.result.list, 'this.list')
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
