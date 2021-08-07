<template>
  <el-dialog
    :visible.sync="visible"
    :show-close="true"
    :close-on-click-modal="false"
    :before-close="handleClose"
    @open="open"
    width="50%"
    center
  >
    <div slot="title">导入学生信息</div>
    <el-form
      label-width="120px"
      :model="from"
      label-position="right"
      class="demo-ruleForm"
      center
      :rules="rules"
      ref="inviteForm"
    >
      <el-form-item label="考试名称" style="width: 400px;">
        <el-select
          style="width: 100%;"
          v-model="from.examId"
          placeholder="考试名称"
        >
          <el-option
            v-for="item in examList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="文件上传" style="width: 400px;">
        <el-upload
          class="upload-demo"
          ref="upload"
          action="https://jsonplaceholder.typicode.com/posts/"
          :file-list="fileList"
          :limit="1"
          accept=".xlsx,.xls,"
          :on-change="handle"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary">
            上传文件
          </el-button>
          <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
          <div slot="tip" class="el-upload__tip">上传学生信息excel文件</div>
        </el-upload>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button type="primary" @click="confirm">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'addRoom',
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
      file: '',
      fileList:[],
      from: {
        examId: '', //考试id
      },
      rules: {
        examId: [{ required: true, message: '请输入', trigger: 'blur' }], //考试id
      },
      examList: [],
    }
  },

  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    handle(file) {
      this.file = file
    },
    open() {
      this.from = {
        examId: ''
      }
      this.fileList =[]
      this.file=""
      this.name = this.editItem.name
      this.getExamList()
    },
    getExamList() {
      this.$axios
        .post(this.API.studentsManage.examlist, {})
        .then((res) => {
          this.examList = res.result.map((item) => ({
            value: item.id,
            label: item.name,
          }))
        })
        .catch(() => {})
    },
    confirm() {
      this.commit()
    },

    handleClose() {
      this.$emit('update:visible', false)
    },
    // api
    commit() {
      console.log(this.fileList, 'confirm')
      if (!this.from.examId) {
        this.$message({
          message: '请先选择考试',
          type: 'error',
        })
        return
      }
      if (!this.file) {
        this.$message({
          message: '请选择上传的文件',
          type: 'error',
        })
        return
      }
      this.$refs.inviteForm.validate((valid) => {
        if (valid) {
          let param = new FormData()
          param.append('examineeFile', this.file.raw)
          this.$axios
            .post(
              `${this.API.studentsManage.examineeBatchImport}?examId=${this.from.examId}`,
              param,
            )
            .then((res) => {
                this.$message({
                  message: res.result?res.result:"导入成功",
                  type: 'success',
                })
                this.handleClose()
            })
            .catch(() => {})
        } else {
        }
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
<style lang="scss" scoped></style>
