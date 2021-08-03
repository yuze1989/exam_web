<template>
  <div>
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="30px" class="demo-ruleForm">
      <el-form-item>
        <el-select v-model="form.role" style="width:300px;" placeholder="选择角色">
          <template v-for="(item,idx) in roles">
            <el-option :key="idx" :label="item" :value="item"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.account" placeholder="请输入登录账号" style="width:300px;" disabled></el-input>
      </el-form-item>
      <el-form-item required v-if="false">
        <el-select v-model="provincesSel" style="width:300px;" placeholder="选择省份" multiple>
          <el-option v-for="province in provinceList" :key="province.province" :value="province.province" :label="province.province">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <selectMultipleProvince style="width: 300px" ref="selectMultipleProvinceCom"></selectMultipleProvince>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.name" placeholder="请输入姓名" style="width:300px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.password" placeholder="请设置初始密码" style="width:300px;"></el-input>
      </el-form-item>
      <el-form-item v-show="form.role == '阅卷老师'">
        <el-checkbox-group v-model="form.courses">
            <el-checkbox v-for="course in courses" :label="course.text" :key="course.text" :value="course.text"></el-checkbox>
          </el-checkbox-group>
      </el-form-item>

      <el-form-item prop="submit">
        <el-button type="primary" style="width:300px" @click="submitForm('ruleForm')">修改</el-button>
      </el-form-item>

    </el-form>

  </div>

</template>
<script>
//这里要俺需要引入，我不是一个对象
import provinceList from "../../utils/provinceCode";
import { isvalidPhone, isvalidEmail } from '../../api/validata'
import axios from 'axios'
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
  props: {
    forms: {
      type: Object,
      default: function () {
        return {
          role: '',
          province: '',
          provinces: [],
          password: '',
          account: '',
          courses: []
        }
      }
    }
  },
  data() {
    return {
      provinceall: [],
      provincesSel: [],
      roles: ['教辅老师', '阅卷老师', '管理员'],
      courses: [],
      examType: [],
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
      },
      form: {
        courses: []
      },
      provinceList: provinceList
    };
  },
  mounted: function () {
    this.form = {...this.forms}
    if (this.form.course) {
      this.$set(this.form, 'courses', this.form.course.split(','))
      // this.form.courses = this.form.course.split(',')
    } else {
      this.$set(this.form, 'courses', [])
    }
    
    console.log('this.form', this.form)
    this.provincesSel = [...this.forms.provinces] || []
    this.courses = this.$store.state.exampaper
    const provinces = []
    this.provinceList.forEach(item=>{
      for (let i = 0; i < this.form.provinces.length; i++) {
        if (item.province == this.form.provinces[i]) {
          const obj = {
            province: item.province,
            provinceCode: item.id
          }
          provinces.push(obj)
        }
      }
    })
    if (provinces.length) {
      this.$refs.selectMultipleProvinceCom.currentProvince = provinces
    }
    console.log('provinces', provinces)
    // this.provinceall = provinceall
    axios.defaults.headers.common["Art-Token"] = sessionStorage.getItem('Art-Token');
  },
  methods: {

    submitForm(formName) {
      this.form.enable = this.form.enable ? 1 : 0
      const provinceList = []
      this.$refs.selectMultipleProvinceCom.currentProvince.forEach(item=>{
        provinceList.push(item.province)
      })
      
      this.form.provinces = [...provinceList]
      this.form.province = provinceList.join(',')
      const params = {...this.form}
      console.log('params', params)
      this.$refs[formName].validate((valid) => {
        if (valid) {

      this.axios.post(this.stateUrl.userInfoUpdate,params).then((res)=>{
        if(res){
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.$emit('closeUserModify')
        }
        
      }).catch(()=>{})
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  components: {
    selectMultipleProvince
  }
}

</script>