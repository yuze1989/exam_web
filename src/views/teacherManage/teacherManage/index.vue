<template>
  <section class="form_border">
    <div class="header">
      <el-form :inline="true" class="demo-form-inline">
        <el-col :span="4">
          <el-button
              class="meiyuan_btn"
              type="primary"
              size="medium"
              @click="add"
          >
            新增用户
          </el-button>
        </el-col>
        <el-col :span="20" style="display: flex;justify-content: flex-end;margin-bottom: 10px">
          <el-form-item style="margin-bottom: 0">
            <el-select clearable
                       v-model="search.roleType"
                       placeholder="请选择权限类型"
                       value-key="province"
            >
              <el-option value="0" label="管理员"></el-option>
              <el-option label="阅卷权限" value="1" ></el-option>
              <el-option label="教辅权限" value="2"></el-option>
              <el-option label="仲裁权限" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-bottom: 0;" >
            <el-select clearable
                       v-model="search.state"
                       placeholder="请选择用户状态"
                       value-key="province"
            >
              <el-option value="0" label="启用"></el-option>
              <el-option label="禁用" value="5" ></el-option>
            </el-select>
          </el-form-item>
            <el-form-item style="margin-bottom: 0">
              <el-input
                  v-model="forms.model.teacherName"
                  placeholder="姓名"
              ></el-input>
            </el-form-item>

          <!-- multiple -->
<!--            <el-form-item style="margin-bottom: 0">-->
<!--              <el-select clearable-->
<!--                  v-model="forms.model.provinceCode"-->
<!--                  placeholder="生源省份"-->
<!--                  value-key="province"-->
<!--                  clearable-->
<!--                  filterable-->
<!--              >-->
<!--                <el-option-->
<!--                    v-for="item in options"-->
<!--                    :key="item.provinceCode"-->
<!--                    :label="item.province"-->
<!--                    :value="item"-->
<!--                ></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->


          <el-form-item  style="margin-bottom: 0">
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <!--            <el-button type="warning" @click="reset">重置</el-button>-->
            <!--            <el-button type="warning" @click="reset">重置</el-button>-->

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
    >
      <el-table-column
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
          label="角色名称"
          header-align="center"
          align="center"
          prop="role"
      ></el-table-column>
      <el-table-column
          label="用户状态"
          header-align="center"
          align="center"
          prop="stateStr"
      ></el-table-column>
<!--      <el-table-column-->
<!--        label="省份"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        prop="province"-->
<!--      ></el-table-column>-->
      <el-table-column
        label="权限类型"
        header-align="center"
        align="center"
        prop="roleTypeStr"
      ></el-table-column>
      <el-table-column label="操作" header-align="center">
        <template slot-scope="scope">
          <div class="operate-item">
            <el-button type="text" size="small" @click="editItem(scope.row)">
              编辑
            </el-button>
            <el-button
              v-if="scope.row.state == 0"
              type="text"
              size="small"
              @click="del(scope.row)"
            >
              禁用
            </el-button>
            <el-button
              v-if="scope.row.state == 1"
              type="text"
              size="small"
              @click="open(scope.row)"
            >
              启用
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <myPagination
        :current.sync="data.pageIndex"
        :pages.sync="data.pages"
        :size.sync="data.pageSize"
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
        roleType:"",
        state:""
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
    this.getList()
    this.getProvinceList()
  },

  methods: {
    getProvinceList() {
      this.$axios
        .get(this.API.studentsManage.examRoomProvince)
        .then((res) => {
          this.options = res.result || []
        })
        .catch(() => {})
    },
    reset() {
      this.forms.model = {
      }
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
        current: this.data.pageIndex,
        size: this.data.pageSize,
        userName : this.forms.model.teacherName,
        state:this.search.state,
        roleType:this.search.roleType

      }
      this.$axios
        .post("/user/userList", params)
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
