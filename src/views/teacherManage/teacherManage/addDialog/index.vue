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
    <div slot="title">教师管理</div>
    <el-form
      label-width="120px"
      :model="from"
      label-position="right"
      class="demo-ruleForm"
      center
      :rules="rules"
      ref="teacherForm"
    >
      <el-form-item label="角色名称" prop="role">
        <el-select v-model="from.role" placeholder="请选择" @change="changeRole">
          <el-option
            v-for="(item, index) in roleList"
            :key="index"
            value-key="roleId"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="省份(支持多选)" prop="roleType">
        <el-select
          multiple
          v-model="from.provinceList"
          placeholder="省份(支持多选)"
          value-key="province"
          clearable
          filterable
          @change="selectedProvince"
        >
          <el-option
            v-for="item in options"
            :key="item.provinceCode"
            :label="item.province"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="登录账号" prop="loginCode">
        <el-input v-model="from.loginCode" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="userName">
        <el-input v-model="from.userName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="初始化密码" prop="password">
        <el-input v-model="from.password" placeholder="请输入"></el-input>
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
      roleList: [],
      options:[],
      from: {
        loginCode: '',
        password: '',
        role: '',
        roleId: '',
        userName: '',
        provinceList: [],
      },
      rules: {
        role: [{ required: true, message: '请选择', trigger: 'blur' }],
        loginCode: [{ required: true, message: '请输入', trigger: 'blur' }],
        password: [{ required: true, message: '请输入', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入', trigger: 'blur' }],
      },
    }
  },
  methods: {
    selectedProvince(payload) {
      console.log(payload, 'payload')
      this.from.provinceList = payload
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
      this.getRoleList()
      this.getProvinceList() 
      if (!this.isAdd) {
        this.$axios
          .get(`${this.API.teacher.detail}?id=${this.editItem.id}`)
          .then((res) => {
            if ((res.code = 200)) {
              console.log(res, 'rr')
              // this.from = {
              //   id: this.editItem.id,
              //   loginCode: this.editItem.loginCode,
              //   password: this.editItem.password,
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
    getProvinceList() {
      this.$axios
        .get(this.API.studentsManage.examRoomProvince)
        .then((res) => {
          this.options = res.result || []
        })
        .catch(() => {})
    },
    getRoleList() {
      this.$axios
        .post(`${this.API.role.teacherRoles}`)
        .then((res) => {
          if ((res.code = 200)) {
            this.roleList = res.result
            console.log(res.result, 'res.result.list')
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
