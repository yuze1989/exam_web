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
        <el-select clearable
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
        <el-select clearable
          style="width: 250px;"
          v-model="from.studioName"
          placeholder="选择机构名称"
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
        <el-select clearable
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
        <el-select clearable
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
        <template slot-scope="scope" class="m_box">
          <div class="m_box" >
            <img class="img"  :src="from.url" style="width: 150px; height: 150px;" />
            <div class="mengceng">
              <i class="el-icon-delete del_icon" @click="changeImage"></i>
            </div>
          </div>
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
          :on-remove="handleRemove"
          action    
          accept=".jpg,.jpeg,.png"
          :auto-upload="false"
          :class="{'disUoloadSty': !showBtnImg}"
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
      addressList:[],
      file:"",
      currentProvinceCode: '',
      showBtnImg: true,
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
        address:"",
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
        address: [{ required: true, message: '请选择', trigger: 'blur' }], //考试地址
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
      this.file = file
      this.fileList = [file]
      this.showBtnImg = fileList.length <1
    },
    handleRemove(file, fileList){

      if(fileList.length <1){
        this.showBtnImg = true
      }
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
      this.getAddressList(value)
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
        .get(this.API.examinfo.allProvince)
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
      this.showBtnImg= true
      if (this.isAdd) {
        this.from = {}
      } else {
        this.from = { ...this.editItem }
        this.getDetail(this.editItem.id)
        this.getRoomList(this.editItem.examId)
        this.getAddressList(this.editItem.examId)
      }
    },
    getDetail(id){
      this.$axios
        .get(`${this.API.studentsManage.examineeDetail}?id=${id}`, {})
        .then((res) => {
          this.from.contactName =  res.result && res.result.contactName
          this.from.address = res.result && res.result.address
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
          str.push(p + '=' + obj[p])
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
            address:this.from.address,
          }
          let str = this.transformRequest(data)
          let param = new FormData()
          if(this.file){
            param.append('examineeFile', this.file.raw)
          }
          let url = `${this.API.studentsManage.examineeCreate}?${str}`
          this.$axios
            .post(url, param)
            .then((res) => {
              if (res) {
                if(res.code ==200){
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                  })
                  this.$emit('addSuccess')
                }
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
            address:this.from.address,
          }
          if(this.from.url == ""){
            data.isDeleteUrl = 0;
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
              if (res.code) {
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
@import './add.scss';
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
.disUoloadSty .el-upload{
  display: none !important;   /* 上传按钮隐藏 */
}
.mengceng {
  width: 150px;
  height: 150px;
  border-radius: 10px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
}
.mengceng:hover{
  background-color: rgba(0, 0, 0, 0.4);
}
.mengceng:hover .del_icon{
  display: block;
}
.m_box{
  width: 150px;
  height: 150px; 
  position: relative;
}
.img{
  border-radius: 10px;
}
.del_icon{
  position:absolute;
  top:50%;
  left:50%;
  margin-top:-12px;
  margin-left:-12px;
  z-index: 10;
  font-size: 24px;
  color: #fff;
  display: none;
  cursor: pointer;
}
</style>
