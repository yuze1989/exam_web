<template>
  <section class="form_border">
    <div class="header">
      <el-form :inline="true" class="demo-form-inline">
        <el-col :span="4">
          <el-form-item>
            <el-input
              v-model="forms.model.teacherName"
              placeholder="姓名"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- multiple -->
        <el-col :span="4">
          <el-form-item>
            <el-select clearable
              v-model="forms.model.provinceCode"
              placeholder="生源省份"
              value-key="province"
              clearable
              filterable
            >
              <el-option
                v-for="item in options"
                :key="item.provinceCode"
                :label="item.province"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="warning" @click="reset">重置</el-button>
            <el-button
              class="meiyuan_btn"
              type="primary"
              size="medium"
              @click="add"
            >
              关联考试
            </el-button>
          </el-form-item>
        </el-col>
      </el-form>
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        label="序号"
        header-align="center"
        align="center"
        prop="id"
      ></el-table-column>
      <el-table-column
        label="账号"
        header-align="center"
        align="center"
        prop="loginCode"
      ></el-table-column>
      <el-table-column
        label="姓名"
        header-align="center"
        align="center"
        prop="userName"
      ></el-table-column>
      <el-table-column
        label="省份"
        header-align="center"
        align="center"
        prop="province"
      ></el-table-column>
      <el-table-column
        label="角色"
        header-align="center"
        align="center"
        prop="role"
      ></el-table-column>
      <el-table-column
        label="关联考试名称"
        header-align="center"
        align="center"
        prop="examName"
      ></el-table-column>
      <el-table-column
        label="考试科目"
        header-align="center"
        align="center"
        prop="subjectName"
      ></el-table-column>
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

    <addDialog
      :visible.sync="isAdd"
      :isAdd="isAddType"
      :editItem="editItemData"
      @addSuccess="addSuccess"
    ></addDialog>

    <deleteDialog
      :visible.sync="showDel"
      :editItem="editItemData"
      @addSuccess="addSuccess"
    />
  </section>
</template>

<script>
import addDialog from './addDialog'
import deleteDialog from './deleteDialog'
export default {
  name: 'TeacherExamList',
  components: {
    addDialog,
    deleteDialog,
  },
  data() {
    return {
      listLoading: false,
      options: [], //生源
      search: {
        name: '',
        mobilePhone: '',
      },
      forms: {
        model: {
          teacherName: '',
          provinceCode: '', //0、未开始;1、正在进行;2、结束考试
        },
      },
      data: { pageIndex: 1, pages: 0, pageSize: 10, total: 0, records: [] },
      isAdd: false,
      showDel: false,
      isAddType: 1, //1新增  0编辑
      editItemData: {},
    }
  },
  created() {
    this.examId = this.$route.params.examId

    this.getList()
    this.getList()
    this.getProvinceList()
  },

  methods: {
    handleSelectionChange(val) {
      this.checkIds = val
    },
    getProvinceList() {
      this.$axios
        .get(this.API.studentsManage.examRoomProvince)
        .then((res) => {
          this.options = res.result || []
        })
        .catch(() => {})
    },
    reset() {
      this.forms.model = {}
      this.forms.current = 1
      this.getList()
    },
    onSubmit() {
      this.forms.current = 1
      this.getList()
    },
    editItem(item) {

      this.isAddType = 0
      this.isAdd = true
      this.editItemData = item
    },
    //删除
    del(item) {
      let that = this
      that
        .$confirm('确定要执行此操作吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {

          that.$axios
            .post(that.API.teacher.setState, {
              id: item.id,
              status: 1,
            })
            .then((res) => {
              that.$message({
                type: 'success',
                message: '操作成功!',
              })
              that.getList()
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    open(item) {
      let that = this
      that
        .$confirm('确定要执行此操作吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {

          that.$axios
            .post(that.API.teacher.setState, {
              id: item.id,
              status: 0,
            })
            .then((res) => {
              that.$message({
                type: 'success',
                message: '操作成功!',
              })
              that.getList()
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    // 新增
    add() {
      this.isAddType = 1
      this.isAdd = true
    },
    addSuccess() {
      this.getList()
      this.isAdd = false
      this.showDel = false
    },
    editItemAction(item) {
      this.editItemData = item
      this.isAddType = 0
      this.isAdd = true
    },
    currentChange() {
      //console.log('index' + index)
      this.getList()
    },
    // api
    getList() {
      let params = {
        pageIndex: this.data.pageIndex,
        pageSize: this.data.pageSize,
        teacherName: this.forms.model.teacherName,
        provinceCode: this.forms.model.provinceCode
          ? this.forms.model.provinceCode.provinceCode
          : '',
      }
      this.$axios
        .post(this.API.teacher.examTeacherList, params)
        .then((res) => {
          this.data.records = res.result.list
          this.data.pageIndex = res.result.pageNum
          this.data.total = res.result.total
          this.data.pageSize = res.result.pageSize
        })
        .catch(() => {})
    },

    update(params) {
      this.$axios
        .post(this.API.roomManage.update, params)
        .then((res) => {
          if (res) {
            this.$message({
              type: 'success',
              message: '操作成功!',
            })
            this.getList()
          }
        })
        .catch(() => {})
    },
  },
  mounted() {},
  beforeCreate() {},
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
