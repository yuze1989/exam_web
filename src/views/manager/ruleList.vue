<template>
  <section class="form_border">
    <!--工具条-->
    <el-row>
      <div style="margin: 10px 10px; font-size: 18px; font-weigth: 800">
        规则列表
      </div>
    </el-row>
    <el-row class="toolbar" style="padding-bottom: 0px" type="flex">
      <el-col :span="6">
        <el-button style="margin: 0px 10px 10px 10px" class="meiyuan_btn" type="primary" size="medium" @click="linkTo">新建规则</el-button>
      </el-col>
      <el-col :span="18" style="float: right">
      </el-col>
    </el-row>
    <!--列表-->
    <el-table :data="users.records" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%" :header-cell-style="{ background: '#08223c', color: '#fff' }">
      <el-table-column type="index" width="100" label="序号" header-align="center" align="center">
      </el-table-column>
      <el-table-column v-for="(table, idx) in tableControl" :key="idx" :prop="table.prop" :label="table.label" :header-align="table.headerAlign" :align="table.align">
      </el-table-column>
      <el-table-column label="操作" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <myPagination :current.sync="forms.current" :pages.sync="users.pages" :size.sync="forms.size" :total.sync="users.total" @cb="initData" />
    </el-col>
  </section>
</template>

<script>
import provinceCodeList from "../../utils/provinceCode";
import myPagination from '@/components/pagination';
import {
  listRules
} from "../../api/api";
export default {
  components: { myPagination },
  data() {
    return {
      hasProvinces: provinceCodeList,
      forms: {
        size: 20,
        current: 1,
        province: ''
      },
      tableContents: {},
      tableControl: [
        {
          prop: 'province',
          label: '省份',
          headerAlign: 'center',
          align: 'center',
        },
         {
          prop: 'course',
          label: '科目',
          headerAlign: 'center',
          align: 'center',
        },
        {
          prop: 'modifyAt',
          label: '编辑日期',
          headerAlign: 'center',
          align: 'center',
        },
       
        // {
        // 	prop: 'province',
        // 	label: '使用',
        // 	headerAlign: 'center',
        // 	align: 'center',
        // },
      ],
      users: { current: 1, pages: 0, size: 20, total: 0, list: [] },

      total: 0,
      page: 1,
      listLoading: false,
    }
  },
  methods: {
    // 获取规则列表
    initData() {
      this.$axios.post(this.API.listRules,this.forms).then(res=>{
          this.users = res.result
            this.users.records.forEach(item => {
              item.modifyAt = item.createAt.substr(0, 10)
            });
      }).catch(()=>{})
    },

    linkTo: function () {
      this.$router.push({ path: '/gradeRule' })
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.$store.state.scoreRule = row
      console.log('row', row)
      this.$router.push({ path: '/gradeRule', query: { id: row.id } })
    },
    handleCurrentChange(val) {
      this.page = val
      this.initData()
    },
    selsChange: function (sels) {
      this.sels = sels
    }
  },
  mounted() {
    this.initData()
  },
}
</script>

<style></style>
