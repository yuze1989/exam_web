<template>
<div>
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
    <p style="color: red;margin-top: 0;padding-top: 0">提示：导入学生信息，正在后台导入，请稍后查看批量导入结果页面</p>
    <el-row style="padding: 20px 0">
      <el-col :span="12" style="text-align: right;padding-right: 20px;color: #409eff"><a @click="dr">查看批量导入结果</a></el-col>
      <el-col :span="12" style="padding-left: 20px;color: #409eff"><a href="https://topconfig.oss-cn-hangzhou.aliyuncs.com/topexam-student.xlsx">导入学生信息模板下载</a></el-col>
    </el-row>

    <el-form
        label-width="120px"
        :model="from"
        label-position="right"
        class="demo-ruleForm"
        center
        :rules="rules"
        ref="inviteForm"
    >
      <el-form-item label="考试名称"  prop="examId" style="width: 400px;">
        <el-select clearable
                   style="width: 250px;"
                   v-model="from.examId"
                   placeholder="考试名称"
                   @change="examChange"
        >
          <el-option
              v-for="item in examList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="考试地址" prop="address">
        <el-select clearable
                   style="width: 250px;"
                   v-model="from.address"
                   placeholder="选择考试地址"
                   value-key="value"
        >
          <el-option
              v-for="item in addressList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="打乱顺序">
        <el-switch
            style="margin-top: 4px"
            v-model="is_shuffle"
            active-text="是"
            inactive-text="否">
        </el-switch>
      </el-form-item>

      <el-form-item label="文件上传" style="width: 400px;text-align: left">
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
<!--          <div class="tips" style="position: absolute;-->
<!--    top: 0;-->
<!--    left: 115px;-->
<!--    width: 350px;-->
<!--    color: #f32727;">导入学生信息需要一定时间，请稍后过来查询！</div>-->
          <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
          <div slot="tip" class="el-upload__tip">上传学生信息excel文件</div>
        </el-upload>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button type="primary" @click="confirm">保存</el-button>
    </div>
  </el-dialog>
  <el-dialog title="错误信息" :visible.sync="dialogTableVisible">
    <el-table :data="gridData">
      <el-table-column label="排序" width="80">
        <template slot-scope="scope">
          {{++scope.$index}}
        </template>
      </el-table-column>
      <el-table-column property="name" label="姓名" width="140"></el-table-column>
      <el-table-column property="gender" label="性别" width="60"></el-table-column>
      <el-table-column property="identification" label="身份证" width="220"></el-table-column>
      <el-table-column property="mobile" label="手机" width="180"></el-table-column>
      <el-table-column property="province" label="省份" width="120"></el-table-column>
      <el-table-column property="remark" label="备注" width="260"></el-table-column>
    </el-table>
  </el-dialog>
</div>
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
      dialogTableVisible:false,
      gridData:[],
      file: '',
      fileList:[],
      addressList:[],
      is_shuffle:false,
      from: {
        examId: '', //考试id
        address:'',
      },
      rules: {
        examId: [{ required: true, message: '请输入', trigger: 'blur' }], //考试id
        address: [{ required: true, message: '请输入', trigger: 'blur' }], 
      },
      examList: [],
    }
  },

  methods: {
    dr(){
      this.$router.push({name: 'daoRuList'})
    },
    close() {
      this.$emit('update:visible', false)
    },
    handle(file) {
      this.file = file
    },
    open() {
      this.from = {
        examId: '',
        address:'',
      }
      this.fileList =[]
      this.addressList=[]
      this.file=""
      this.name = this.editItem.name
      this.getExamList()
    },
    examChange(value) {
      this.getAddressList(value)
      // this.examList.forEach((item) => {
      //   if (item.value == value) {
      //     this.from = {
      //       ...this.from,
      //       examId: item.value,
      //       examName: item.label,
      //       studioId: '',
      //       studioName: '',
      //     }
      //   }
      // })
    },
    getAddressList(examId){
      this.$axios
        .get(`${this.API.studentsManage.getAddressByExamId}?examId=${examId}`, {})
        .then((res) => {

          this.addressList = res.result.map((item) => ({
            value: item.examAddress,
            label: item.examAddress,
          }))
        })
        .catch(() => {})
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
          let is_shuffle = 0
          if(this.is_shuffle){
            is_shuffle = 1;
          }

          this.$axios
            .post(
                `${this.API.studentsManage.examineeBatchImport}?examId=${this.from.examId}&address=${this.from.address}&is_shuffle=${is_shuffle}`,
              param,
            )
            .then((res) => {
              if(res.code == 200){
                this.$message({
                  message: res.result?res.result:"导入成功",
                  type: 'success',
                })
                this.handleClose()
              }else if(res.code == 500){
                this.gridData = res.result;
                this.dialogTableVisible = true;
              }

            })
            .catch((error) => {

            })
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
