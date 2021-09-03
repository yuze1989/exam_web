<template>
  <el-dialog
    :visible.sync="visible"
    :show-close="true"
    :close-on-click-modal="false"
    :before-close="handleClose"
    @open="open"
    width="90%"
    center
  >
    <div slot="title">联合考试状态</div>
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
        label="主办方机构id"
        header-align="center"
        align="center"
        prop="masterSchoolId"
      ></el-table-column>

      <el-table-column
        label="主办方机构名称"
        header-align="center"
        align="center"
        prop="masterSchoolName"
      ></el-table-column>

      <el-table-column
        label="被邀请方机构id "
        header-align="center"
        align="center"
        prop="schoolId"
      ></el-table-column>

      <el-table-column
        label="被邀请方机构名称"
        header-align="center"
        align="center"
        prop="schoolName"
      ></el-table-column>

      <el-table-column
        label="联合考试状态"
        header-align="center"
        align="center"
        prop="statusStr"
      ></el-table-column>

      <el-table-column label="操作" header-align="center">
        <template slot-scope="scope">
          <div>
            <el-button
              type="text"
              v-if="(scope.row.currentSchoolId != scope.row.masterSchoolId) &&  scope.row.status == 0"
              size="small"
              @click="enbaleItemAction(scope.row, 1)"
            >
              <span>确认联合考试</span>
            </el-button>

            <el-button
              type="text"
              v-if="(scope.row.currentSchoolId != scope.row.masterSchoolId) &&  scope.row.status == 0"
              size="small"
              @click="enbaleItemAction(scope.row, 2)"
            >
              <span>拒绝联合考试</span>
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  name: 'union',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isAdd: {
      type: Number,
      default: 0, //1新增  0编辑
    },
    editItem: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      name: '', //考试名称
      list:[],
      examId:"",
      listLoading: false
    }
  },

  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    open() {
      this.examId =  this.editItem.id,
      this.getList()

    },
    confirm() {
      this.commit()
    },

    handleClose() {
      this.$emit('update:visible', false)
    },

    getList() {
      this.$axios
        // .post(this.API.examinfo.unionList, {examId:this.examId})
        .post(`${this.API.examinfo.unionList}?examId=${this.examId}`)
        .then((res) => {
          this.list = res.result
        })
        .catch(() => {})
    },

    // 1:通过,2:拒绝
    enbaleItemAction(item, status) {
      this.$axios
        .post(`${this.API.examinfo.union}`, {
          status,
          id: item.examId,
        })
        .then((res) => {
          this.$message.success('操作成功')
          this.getList()
        })
        .catch((err) => {
          this.listLoading = false
        })
    },
  },
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style lang="scss" scoped>
@import './add.scss';
</style>
