<template>
  <el-dialog
    :visible.sync="visible"
    :show-close="true"
    :close-on-click-modal="false"
    :before-close="handleClose"
    @open="open"
    width="800px"
    center
  >
    <div slot="title">学生信息</div>
    <el-form
      label-width="140px"
      :model="from"
      label-position="right"
      class="demo-ruleForm"
      center
      :rules="rules"
      ref="studentsForm"
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

      <el-form-item label="机构名称" prop="studioName">
        <el-select
          style="width: 250px;"
          v-model="from.studioName"
          placeholder="机构名称"
          value-key="value"
          @change="roomChange"
        >
          <el-option
            v-for="item in roomList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="考生姓名" prop="name">
        <el-input
          v-model="from.name"
          style="width: 250px;"
          placeholder="请输入"
          maxlength="10"
        ></el-input>
      </el-form-item>

      <el-form-item label="联系人" prop="contactName">
        <el-input
          v-model="from.contactName"
          style="width: 250px;"
          placeholder="请输入"
          maxlength="10"
        ></el-input>
      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <el-select
          style="width: 250px;"
          v-model="from.gender"
          placeholder="请选择"
          value-key="value"
        >
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="身份证号" prop="identification">
        <el-input
          v-model="from.identification"
          style="width: 250px;"
          maxlength="18"
          placeholder="请输入"
        ></el-input>
      </el-form-item>

      <el-form-item label="手机号码" prop="mobile">
        <el-input
          v-model="from.mobile"
          style="width: 250px;"
          type="number"
          placeholder="请输入"
          maxlength="11"
        ></el-input>
      </el-form-item>

      <el-form-item label="选择省份" prop="province">
        <el-select
          v-model="from.province"
          style="width: 180px;"
          placeholder="选择省份"
          @change="provinceChange"
        >
          <el-option
            v-for="(item, i) in provinceList"
            :key="i"
            :value="item.provinceCode"
            :label="item.province"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="上传图片"  v-if="from.url" prop="url">
        <template slot-scope="scope">
          <img :src="from.url" style="width: 150px; height: 150px;" />
          <el-button @click="changeImage" style="margin-left:20px" >更换</el-button>
        </template>
      </el-form-item>

      <el-form-item  v-if="!from.url" label="上传图片" prop="url">
        <el-upload
          list-type="picture-card"
          name="image"
          :file-list="fileList"
          :multiple="false"
          :limit="2"
          :on-change="handleChange"
          action="https://exam-new.msjsol.com/exam-manager/file/upload"
          accept=".jpg,.jpeg,.png"
          :auto-upload="false"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'addRoom',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isAdd: {
      type: Boolean,
      default: false, //false新增  true编辑
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
      provinceList: [],
      examList: [],
      roomList: [],
      fileList: [],
      file:"",
      currentProvinceCode: '',
      from: {
        id: '',
        examId: '', //考试id
        examName: '', //考试id
        studioId: '', // 机构id
        studioName: '',
        contactName: '', //联系人
        name: '',
        identification: '',
        mobile: '',
        province: '',
        provinceCode: '',
        gender: '', //:男，女，其他
        source: 2, //报名来源:1手机；2后台
        examineeFile: '', // 文件
      },
      examTypeStatus: [
        {
          value: '0',
          label: '机构考试',
        },
        {
          value: '1',
          label: '联合考试',
        },
        {
          value: '2',
          label: '线下考试',
        },
      ],
      rules: {
        examName: [{ required: true, message: '请选择', trigger: 'blur' }], //考试id
        studioName: [{ required: true, message: '请选择', trigger: 'blur' }], // 机构id
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        identification: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        province: [{ required: true, message: '请输入', trigger: 'blur' }],
        provinceCode: [{ required: true, message: '请输入', trigger: 'blur' }],
      },
    }
  },
  created() {},
  methods: {
    changeImage(){
      this.from.url = ""
    },
    handleChange(file, fileList) {
      console.log(file,'file')
      console.log(fileList,'fileList')
      this.file = file
      this.fileList = [file]
    },
    provinceChange(value) {
      this.provinceList.forEach((item) => {
        if (item.provinceCode == value) {
          this.from.province = item.province
          this.from.provinceCode = item.provinceCode
        }
      })
    },
    examChange(value) {
      this.getRoomList(value)
      this.examList.forEach((item) => {
        if (item.value == value) {
          this.from = {
            ...this.from,
            examId: item.value,
            examName: item.label,
            studioId: '',
            studioName: '',
          }
        }
      })
    },
    roomChange(value) {
      this.roomList.forEach((item) => {
        if (item.value == value) {
          this.from = {
            ...this.from,
            studioId: item.value,
            studioName: item.label,
          }
        }
      })
    },
    getProvinceList() {
      this.$axios
        .get(this.API.studentsManage.examRoomProvince)
        .then((res) => {
          this.provinceList = res.result
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
    getRoomList(examId) {
      console.log(
        `${this.API.studentsManage.roomsList}?examId=${examId}`,
        examId,
        'examId',
      )
      this.$axios
        .get(`${this.API.studentsManage.roomsList}?examId=${examId}`, {})
        .then((res) => {
          this.roomList = res.result.map((item) => ({
            value: item.studioId,
            label: item.studioName,
          }))
        })
        .catch(() => {})
    },
    addSuccess() {
      this.isAdd = false
      this.showInvite = false
      this.showDel = false
      this.getOrderList()
    },
    close() {
      this.$emit('update:visible', false)
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    open() {
      this.getProvinceList()
      this.getExamList()
      this.fileList= []
      this.file=""
      console.log(this.editItem, this.isAdd, 'this.isAdd')
      if (this.isAdd) {
        this.from = {}
      } else {
        this.from = { ...this.editItem }
        this.getDetail(this.editItem.id)
      }
    },
    getDetail(id){
      this.$axios
        .get(`${this.API.studentsManage.examineeDetail}?id=${id}`, {})
        .then((res) => {
          this.from.contactName =  res.result && res.result.contactName
        })
        .catch(() => {})
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
    getToken() {
      return getToken()
    },
    transformRequest(obj) {
      var str = []
      for (var p in obj) {
        if (obj[p]) {
          str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
        }
      }
      return str.join('&')
    },
    // api
    add() {
      this.$refs.studentsForm.validate((valid) => {
        if (valid) {
          let data = {
            id: this.from.id,
            examId: this.from.examId,
            studioId: this.from.studioId, // 机构id
            contactName: this.from.contactName, //联系人
            name: this.from.name,
            identification: this.from.identification,
            mobile: this.from.mobile,
            province: this.from.province,
            provinceCode: this.from.provinceCode,
            gender: this.from.gender, //:男，女，其他
            source: 2, //报名来源:1手机；2后台
          }
          let str = this.transformRequest(data)
          let param = new FormData()
          if(this.file){
            param.append('examineeFile', this.file.raw)
          }
          console.log('11', this.fileList[0])
          let url = `${this.API.studentsManage.examineeCreate}?${str}`
          this.$axios
            .post(url, param)
            .then((res) => {
              if (res) {
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
    //  修改
    edit() {
      this.$refs.studentsForm.validate((valid) => {
        console.log(
          {
            examId: this.from.examId, //考试id
            studioId: this.from.studioId, // 机构id
            contactName: this.from.contactName, //联系人
            name: this.from.name,
            identification: this.from.identification,
            mobile: this.from.mobile,
            province: this.from.province,
            provinceCode: this.from.provinceCode,
            gender: this.from.gender, //:男，女，其他
            examineeFile: this.from.examineeFile, // 文件
          },
          '提交信息',
        )

        if (valid) {
          let data = {
            id: this.from.id,
            examId: this.from.examId,
            studioId: this.from.studioId, // 机构id
            contactName: this.from.contactName, //联系人
            name: this.from.name,
            identification: this.from.identification,
            mobile: this.from.mobile,
            province: this.from.province,
            provinceCode: this.from.provinceCode,
            gender: this.from.gender, //:男，女，其他
          }
          let str = this.transformRequest(data)
          let param = new FormData()
          if(this.file){
            param.append('examineeFile', this.file.raw)
          }
          let url = `${this.API.studentsManage.examineeUpdate}?${str}`
          this.$axios
            .post(url, param)
            .then((res) => {
              if (res) {
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
.address-item {
  margin: 10px 0px;
}
.flex {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.btn-blue {
  color: #409eff;
  font-size: 12px;
  width: 50px;
  cursor: pointer;
  margin-left: 10px;
}
.avatar2 {
  width: 140px;
  height: 140px;
}
</style>
<style lang="scss" scoped>
@import './add.scss';
</style>
