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
    <div slot="title">角色</div>

    <!-- // id (integer, optional): 角色ID(新增的时候不用传) ,
// roleName (string, optional): 角色名称(管理员、阅卷老师、监考老师) ,
// roleRemark (string, optional): 角色说明 ,
// roleType (integer, optional): 角色类型：0,管理员;1阅卷老师;2教辅老师;3阅卷组长 -->
    <el-form
      label-width="100px"
      :model="from"
      label-position="right"
      class="demo-ruleForm"
      center
      :rules="rules"
      ref="roleForm"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="from.roleName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="角色类型" prop="roleType">
        <el-select v-model="from.roleType" placeholder="请选择">
          <el-option label="管理员" value="0"></el-option>
          <el-option label="阅卷老师" value="1"></el-option>
          <el-option label="教辅老师" value="2"></el-option>
          <el-option label="阅卷组长" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="roleRemark">
        <el-input v-model="from.roleRemark" placeholder="请输入"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="confirm">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
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
      from: {
        roleName: '',
        roleRemark: '',
      },
      rules: {
        roleName: [{ required: true, message: '请输入', trigger: 'blur' }],
        roleRemark: [{ required: true, message: '请输入', trigger: 'blur' }],
        roleType: [{ required: true, message: '请选择', trigger: 'blur' }],
      },
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    open() {
      if (!this.isAdd) {
        this.$axios
          .get(`${this.API.role.detail}?id=${this.editItem.id}`)
          .then((res) => {
            if ((res.code = 200)) {
              this.from = {
                id: res.result.id,
                roleName: res.result.roleName,
                roleRemark: res.result.roleRemark,
                roleType: String(res.result.roleType) 
              }
            }
          })
      } else {
        this.from = {}
      }
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
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          this.$axios
            .post(this.API.role.create, this.from)
            .then((res) => {
              if ((res.code = 200)) {
                this.$message({
                  message: '新增成功',
                  type: 'success',
                })
                this.$emit('addSuccess')
              }
            })
            .catch(() => {})
        } else {
        }
      })
    },
    edit() {
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          this.$axios
            .post(this.API.role.update, this.from)
            .then((res) => {
              if ((res.code = 200)) {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                })
                this.$emit('addSuccess')
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
