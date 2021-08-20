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
    <div slot="title">邀请画室</div>
    <el-form
      label-width="120px"
      :model="from"
      label-position="right"
      class="demo-ruleForm"
      center
      :rules="rules"
      ref="inviteForm"
    >
      <!-- <el-form-item label="考试名称" prop="examType">
        <el-select clearable
          style="width: 100%"
          v-model="from.name"
          placeholder="考试名称"
        >
        <el-option
          v-for="item in examTypeStatus"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="考试名称" prop="name">
        <el-input v-model="name" disabled placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item label="机构编码" prop="schoolId">
        <el-input v-model="from.schoolId" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item label="机构名称" prop="schoolName">
        <el-input v-model="from.schoolName" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input
          maxlength="680"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 10}"
          placeholder="请输入内容"
          v-model="from.remark">
        </el-input>
      </el-form-item>

    </el-form>

    <div slot="footer">
      <el-button type="primary" @click="confirm">邀请画室</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
 
  name: "addRoom",
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
        return {};
      },
    },
  },
  data() {
    return {
      name: "",//考试名称
      from: {
        "examId": "",
        "remark": "",
        "schoolId": "",
        "schoolName": ""
      },
      rules: {
        schoolId: [{ required: true, message: "请输入", trigger: "blur" }],
        schoolName: [{ required: true, message: "请输入", trigger: "blur" }],
        remark:[{ required: true, message: "请输入", trigger: "blur" }],
      },
    };
  },

  methods: {
    close() {
      this.$emit("update:visible", false);
    },
    open() {
      this.from = {
        examId: this.editItem.id,
      }
      this.name = this.editItem.name
    },
    confirm() {
      this.commit()
    },

    handleClose() {
      this.$emit("update:visible", false);
    },

    // api
    commit() {
      this.$refs.inviteForm.validate((valid) => {
        if (valid) {
          let data = {
            ...this.from,
          }
          this.$axios
            .post(this.API.examinfo.invite, data)
            .then((res) => {
              this.$message({
                message: "邀请成功",
                type: "success",
              });
              this.handleClose()
            })
            .catch(() => {});
        } else {
        }
      });
    },
  }
};
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
@import "./add.scss";
</style>