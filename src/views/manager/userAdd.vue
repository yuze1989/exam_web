<template>
  <div>
    <el-form :model="forms" :rules="rules" ref="ruleForm" label-width="30px" class="demo-ruleForm">
      <el-form-item>
        <el-select clearable  v-model="forms.role" style="width:300px;" placeholder="选择角色">
          <template v-for="(item,idx) in roles">
            <el-option :key="idx" :label="item" :value="item"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="forms.account" placeholder="请输入登录账号" style="width:300px;" onKeyUp="value=value.replace(/[^\w\.\/]/ig,'')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select clearable  v-model="forms.provinces" style="width:300px;" placeholder="选择省份" multiple>
          <el-option v-for="(item, i) in provinceList" :key="i" :value="item.province" :label="item.province">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="false">
        <selectMultipleProvince ref="selectMultipleProvinceRef" style="width:300px;"></selectMultipleProvince>
      </el-form-item>
      <el-form-item>
        <el-input v-model="forms.name" placeholder="请输入姓名" style="width:300px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="forms.password" placeholder="请设置初始密码" style="width:300px;" onKeyUp="value=value.replace(/[^\w\.\/]/ig,'')"></el-input>
      </el-form-item>

      <el-form-item v-show="forms.role == '阅卷老师'">
        <template>
          <el-checkbox-group v-model="forms.courses">
            <el-checkbox v-for="course in courses" :label="course.text" :key="course.text" :value="course.text"></el-checkbox>
          </el-checkbox-group>
        </template>
      </el-form-item>

      <el-form-item prop="submit">
        <el-button type="primary" style="width:300px" @click="submitForm('ruleForm')">新增</el-button>
      </el-form-item>

    </el-form>

  </div>

</template>
<script>
//这里要俺需要引入，我不是一个对象
import provinceCodeList from "../../utils/provinceCode";
import { isvalidPhone, isvalidEmail } from '../../api/validata'
import selectMultipleProvince from '@/components/SelectMultipleProvince'
//定义一个全局的变量，谁用谁知道
var validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入电话号码'))
  } else if (!isvalidPhone(value)) {
    callback(new Error('请输入正确的11位手机号码'))
  } else {
    callback()
  }
}
export default {
  props: {},
  data() {
    return {
      provinceList: [],
      roles: ['教辅老师', '阅卷老师', '管理员'],
      courses: [],
      examType: [],
      forms: {
        role: '',
        provinces: [],
        password: '',
        account: '',
        courses: []
      },
      rules: {
        provice: [
          { required: true, message: '输入省份', trigger: 'blur' },
        ],
        contact: [
          { required: true, message: '输入联系老师', trigger: 'blur' },
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validPhone }//这里需要用到全局变量
        ],
        email: [
          { required: true, message: '请输入email', trigger: 'blur' },//这里需要用到全局变量
          { type: 'email', message: 'email格式错误,请输入正确的email', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getProvinceList()
  },
  mounted: function () {
    this.courses = this.$store.state.exampaper
  },
  methods: {
    submitForm(formName) {
      this.forms.province = this.forms.provinces.join(',')
      this.$refs[formName].validate((valid) => {
        if (valid) {
           this.axios.post(this.stateUrl.userCreate,this.forms).then(res=>{
             if(res.code==200){
                this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.$emit('closeUserAdd')
             }
           
          }).catch(()=>{})
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getProvinceList() {
        this.axios.get(this.stateUrl.addressList).then(res=>{
            this.provinceList = res.result.map(item=>{
            const obj = {
              province: item.areaName,
              provinceCode: item.areaCode
            }
          return obj
        })
          }).catch(()=>{})
    }
  },
  components: {
    selectMultipleProvince
  }
}

</script>