<template>
  <el-dialog
    :visible.sync="visible"
    :show-close="true"
    :close-on-click-modal="false"
    :before-close="handleClose"
    @open="open"
    width="30%"
    center
  >
    <div slot="title">选择考试</div>
    <el-form
      label-width="120px"
      :model="from"
      label-position="right"
      class="demo-ruleForm"
      center
      :rules="rules"
      ref="teacherForm"
    >
     <el-form-item label="考试名称" prop="examName">
        <el-select
          style="width: 250px;"
          v-model="from.examName"
          placeholder="考试名称"
          value-key="value"
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

    </el-form>

    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="confirm">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import SelectProvince from '@/components/SelectProvinceMultiple'
export default {
  components: { SelectProvince },
  name: 'addRole',
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
      examList: [],
      options:[],
      from: {
        role: '',
        roleId: '',
        userName: '',
        provinceList: [],
      },
      rules: {
        role: [{ required: true, message: '请选择', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入', trigger: 'blur' }],
      },
    }
  },
  methods: {
    examChange(e){
      console.log(e)
    },
    changeRole(payload) {
      const role = this.roleList.filter((item)=>item.id == payload)
      this.from.roleId = payload
      this.from.role = role[0].roleName
    },
    close() {
      this.$emit('update:visible', false)
    },
    open() {
      this.from = {}
      this.getExamList()
      this.getRoleList()
      if (!this.isAdd) {
        this.$axios
          .get(`${this.API.teacher.detail}?id=${this.editItem.id}`)
          .then((res) => {
            if ((res.code = 200)) {
              console.log(res, 'rr')
              // this.from = {
              //   // province: "北京",
              //   // provinceCode: "北京",
              //   role: this.editItem.role,
              //   roleId: this.editItem.roleId,
              //   provinceList: this.editItem.provinceList,
              //   userName: this.editItem.userName,
              // }
            }
          })
      }
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
    getRoleList() {
      this.$axios
        .post(`${this.API.role.list}`, {
          pageIndex: 1,
          pageSize: 1000,
        })
        .then((res) => {
          if ((res.code = 200)) {
            this.roleList = res.result.list
            console.log(res.result.list, 'res.result.list')
          }
        })
    },
    confirm() {
      if (this.isAdd) {
        this.add()
      } else {
        this.edit()
      }
    },

    handleClose() {
      this.$emit('update:visible', false)
    },

    // api
    add() {
      this.$refs.teacherForm.validate((valid) => {
        console.log(this.from, '')
        if (valid) {
          this.$axios
            .post(this.API.teacher.create, this.from)
            .then((res) => {
              if ((res.code = 200)) {
                this.$message({
                  message: '新增成功',
                  type: 'success',
                })
                this.$emit('addSuccess')
                this.from = {}
              }
            })
            .catch(() => {})
        } else {
        }
      })
    },
    edit() {
      this.$refs.teacherForm.validate((valid) => {
        if (valid) {
          this.$axios
            .post(this.API.teacher.update, {
              ...this.from,
            })
            .then((res) => {
              if ((res.code = 200)) {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                })
                this.$emit('addSuccess')
                this.from = {}
              }
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
<style lang="scss" scoped>
@import './index.scss';
</style>
