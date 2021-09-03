<template>
  <div class="examAssgin_alert" style="width: 800px">
    <el-form :model="forms" :rules="rules" ref="roomAssgin" style="text-align: center"  class="demo-ruleForm">

      <el-form-item >
        <el-select clearable  placeholder="选择省份" v-model="forms.province"  style="width:80%">
            <el-option v-for="province in provinceList"
                    :key="province.province"
                    :value="province.province"
                    :label="province.province">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="width: 80%" >
      <el-row v-for="(examroom,idx) in examrooms" :key="idx" type="flex" style="width:80%" >
          <div  style="font-size:16px;width:50px;margin:0px 5px">{{examroom.province}}</div>
          <el-input v-model="examroom.st" placeholder="考场编号" size="medium" style="width:100px"></el-input>
          <span style="margin:0px 5px">~</span>
          <el-input v-model="examroom.en" placeholder="考场编号" size="medium" style="width:100px"></el-input>
          <el-input v-model="examroom.Count" placeholder="请设置考场人数" size="medium" style="width:200px"></el-input>
      </el-row>
      </el-form-item>
      <el-form-item >
        <el-button style="width:80%" @click="handleAdd">+ 新增考场配置</el-button>
      </el-form-item>
      <el-form-item  prop="submit"  >
        <el-button type="primary"  @click="submitForm('ruleForm')" class="meiyuan_btn" style="width:80%;margin-top: 10px">确认</el-button>
        <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
      </el-form-item>


    </el-form>

  </div>

</template>
<script>
  import provinceCodeList from "@/utils/provinceCode";
  import {isvalidPhone,isvalidEmail} from '@/utils/validata'
  //定义一个全局的变量，谁用谁知道
  var validPhone=(rule, value,callback)=>{
      if (!value){
          callback(new Error('请输入电话号码'))
      }else  if (!isvalidPhone(value)){
        callback(new Error('请输入正确的11位手机号码'))
      }else {
          callback()
      }
  }

  export default {
   
    data() {
      return {
        provinceList:provinceCodeList,
        forms: {
          province:'',
          studioname:'机构名',
          provice:'省',
          contact:'联系人',
          phone:'电话号码',
          email:'email',
          url:'11111',
        },
        examrooms:[],
        rules: {
          studioname: [
            { required: true, message: '输入机构名称', trigger: 'blur' },
          ],
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
    methods: {
      handleAdd(){
        if(this.forms.province==''){

          alert('!请选择省份')
        }else{
         this.examrooms.push({
           province:this.forms.province,
            st:'',
            en:'',
            Count:'',
         })
      }},
      upok(response, file, fileList){
        
        this.studio.url=file.name

      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');//这里就是符合规则，然后去调对应的接口
          } else {

            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }

</script>
<style >

</style>>