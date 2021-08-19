<template>
  <section class="form_border">
    <div class="header">
      <el-form :inline="true" class="demo-form-inline" style="    padding-top: 15px;
    padding-bottom: 10px;
    display: flex;
    justify-content: flex-end;">
        <el-form-item style="margin-bottom: 0">
          <el-input
              v-model="forms.model.name"
              placeholder="考试名称"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 0">
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
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
        label="id"
        header-align="center"
        align="center"
        prop="id"
      ></el-table-column>

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
        prop="name"
      ></el-table-column>

      <el-table-column
        label="阅卷状态"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">{{scope.row.operStatus==0?'未停止':'停止'}}</template>
      </el-table-column>

      <el-table-column label="操作" header-align="center"    align="center">
        <template slot-scope="scope">
          <div>
            <el-button
              type="text"
              size="small"
              @click="editItemAction(scope.row)"
            >
              <span>上传进度详情</span>
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <myPagination
        :current.sync="forms.current"
        :pages.sync="data.pages"
        :size.sync="forms.pageSize"
        :total.sync="data.total"
        @cb="currentChange"
      />
    </el-col>

  </section>
</template>

<script>
export default {

  data() {
    return {
      list: [],
      checkIds: [],
      listLoading: false,
      forms: {
        current: 1,
        pageSize: 10,
        model: {
          name: '',
          examStatus: -1, //0、未开始;1、正在进行;2、结束考试
        },
      },
      status: [
        { name: '同意', id: 1 },
        { name: '拒绝', id: 2 },
        { name: '禁用 ', id: 3 },
      ],
      examStatus: [
        { name: '全部考试状态', id: -1 },
        { name: '未开始', id: 0 },
        { name: '正在进行', id: 1 },
        { name: '结束考试', id: 2 },
      ],
      data: { pages: 0, pageSize: 10, total: 0, records: [] },
      dialogTitle: '',
      isAdd: false, //展示弹窗
      isAddType: 1, //1新增  0编辑
      showInvite: false, //邀请弹窗
      showDel: false,//删除弹窗
      editItemData: {
        name: '',
        id: 0,
      },
    }
  },

  created() {
    this.getOrderList()
  },
  methods: {
    //去查询联合考试状态
    // 新增
    add() {
      this.isAddType = 1
      this.isAdd = true
    },
    editItemAction(item) {
      this.$router.push({name:'eaxmUpLoad',params:{'id':item.examCode,"operStatus":item.operStatus}})
    },
    toShowInvite(item) {
      this.editItemData = item
      this.showInvite = true
    },
    addSuccess() {
      this.isAdd = false
      this.showInvite = false
      this.showDel = false
      this.getOrderList()
    },
    reset() {
      ;(this.forms.model = {
        name: '',
        examStatus: -1,
      }),
        (this.forms.current = 1)
      this.getOrderList()
    },
    changeStatus() {},
    changeCheckStatus() {},
    getStateString(item) {
      // examType (integer, optional): 考试类型:0、画室考试;1、联合考试;2、线下考试 ,
      // examTypeStr 联合考试状态:-1,表示自己建的联合考试;0、未确认;1、同意;2、拒绝;3、禁用
      if(item.examType == 1){
        switch (item.status) {
          case 0:
            return '未确认'
            break
          case 1:
            return '同意'
            break
          case 2:
            return '拒绝'
            break
          case 3:
            return '禁用'
            break
        }
      }else{
        return ''
      }
    },
    updateList() {
      this.getOrderList()
    },
    currentChange() {
      this.getOrderList()
    },
    auditItem(scope) {},
    // 订单列表
    getOrderList() {
      this.listLoading = true
      let params = {
        current: this.forms.current,
        size: this.forms.pageSize,
        name: this.forms.model.name,
      }
      this.$axios
        .post('/exampaper/examPaperProductList', params)
        .then((res) => {
          this.list = res.result.list
          this.data = res.result
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    onSubmit() {
      this.forms.current = 1
      this.getOrderList()
    },
    // 1:通过,2:拒绝
    enbaleItemAction(item, status) {
      this.$axios
        .post(`${this.API.examinfo.union}`, {
          status,
          id: item.id,
        })
        .then((res) => {
          this.$message.success('操作成功')
          this.forms.current = 1
          this.getOrderList()
        })
        .catch((err) => {
          this.listLoading = false
        })
    },
    //删除
    del(item){
      console.log(item)
      this.editItemData = item
      this.showDel = true
    }
  },
}
</script>
<style lang="scss" scoped>
//@import './orderAccount.scss';
</style>
