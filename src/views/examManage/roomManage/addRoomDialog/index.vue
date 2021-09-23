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
    <div slot="title">{{!isAdd ? '编辑' : '新增'}}机构信息</div>
    <el-form
      label-width="100px"
      :model="from"
      label-position="right"
      class="demo-ruleForm"
      center
      :rules="rules"
      ref="ruleForm"
    >
     <el-form-item label="机构编码" prop="studioCode">
       <el-input v-model="from.studioCode" :disabled="!isAdd"   maxlength="20"
                 show-word-limit placeholder="请输入机构编码"></el-input>
      </el-form-item>
      <el-form-item label="机构名称" prop="studioName">
        <el-input v-model="from.studioName"   maxlength="20"
                  show-word-limit placeholder="请输入机构名称"></el-input>
      </el-form-item>
         <el-form-item label="机构地区" prop="studioAreaCode">
        <el-select clearable  v-model="from.studioAreaCode" placeholder="请选择省" @change="studioAreaChange">
          <el-option
            v-for="item in studioAreaOption"
            :key="item.provinceCode"
            :label="item.province"
            :value="item.provinceCode">
          </el-option>
        </el-select>
           <el-select clearable  v-model="studioCityName" placeholder="请选择市" @change="studioAreaChange2">
             <el-option
                 v-for="item in studioAreaOption2"
                 :key="item.provinceCode"
                 :label="item.province"
                 :value="item.provinceCode">
             </el-option>
           </el-select>
      </el-form-item>
        <el-form-item label="机构联系人" prop="contactName">
        <el-input v-model="from.contactName"   maxlength="10"
                  show-word-limit placeholder="请输入机构联系人姓名"></el-input>
      </el-form-item>
         <el-form-item label="手机号码" prop="contactMobile">
        <el-input v-model="from.contactMobile" type="number" placeholder="请输入手机号码"
        ></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getAllProvince, creatStudio,updateStudio } from '@/api/studioManage.js'
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
      from: {
        studioName: "",
        studioAreaCode: "",
        studioAreaName: "",
        contactName: '',
        contactMobile: "",
        proviceCode:"",
      },
      studioCityCode:"",
      studioCityName:"",
      studioAreaOption2:[],
      studioAreaOption: [],
      rules: {
        studioName: [{ required: true, message: "请输入机构名称", trigger: "blur" }],
        studioAreaCode: [
          { required: true, message: "请输入机构区域", trigger: "blur" },
        ],
        contactName : [
          { required: true, message: "请输入机构联系人", trigger: "blur" },
        ],
        contactMobile  : [
          {required: true, message: "请输入机构联系人手机号", trigger: "blur" },
          {validator: this.$rules.phoneNumber, trigger: 'blur'}
        ],
      },
    };
  },
  created(){
    this.getAllProvinces()
  },
  methods: {
    // 区域改变监听
    studioAreaChange(e){
      this.studioAreaOption.map(item =>{
        if(item.provinceCode == e){
          this.from.studioAreaName = item.province;
          this.from.proviceCode = item.provinceCode;
          this.getAllProvinces2();
        }
      })
    },
    // 区域改变监听
    studioAreaChange2(e){
      this.studioAreaOption2.map(item =>{
        if(item.provinceCode == e){
          this.$set(this,'studioCityCode',item.provinceCode)
          this.$set(this,'studioCityName',item.province)
        }
      })
    },
   // 获取所有区域
     getAllProvinces(){
      getAllProvince().then(res=>{
        this.studioAreaOption = res.result
      })
    },
    // 获取市
    getAllProvinces2(){
      this.studioCityName = "";
      this.studioCityCode = "";
      this.$axios.get('/examinfo/allCity?provinceCode='+this.from.proviceCode).then(res=>{
        this.studioAreaOption2 = res.result
      })
    },
    close() {
      this.$emit("update:visible", false);
    },
    open() {
      //console.log(this.editItem)
      if(this.$refs.ruleForm){
        this.$refs.ruleForm.clearValidate()
      }


      if (this.isAdd) {
        this.from = {
          studioName: "",
          studioAreaName: "",
          studioAreaCode: "",
          contactName : "",
          contactMobile: "",
          id:''
        };
        this.studioCityName = ""
      } else {
        this.from = {
          studioName: this.editItem.studioName,  // 机构名称
          studioCode : this.editItem.studioCode, //机构编码
          studioAreaName: this.editItem.studioAreaName, // 机构区域名称
          studioAreaCode : this.editItem.studioAreaCode, // 机构区域编码
          contactName : this.editItem.contactName , //机构联系人姓名
          contactMobile :this.editItem.contactMobile , // 机构联系人手机号
          id:this.editItem.id
        };
        this.studioCityName =this.editItem.studioCityName
      }
    },
    confirm() {
      if (this.isAdd) {
      
        this.add();
      } else {
        this.edit();
      }
    },

    handleClose() {
      this.$emit("update:visible", false);
    },

    // api
    add() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {

          this.from.studioCityName = this.studioCityName
        creatStudio(this.from).then((res) => {
              if (res) {
                if(res.code == 200){
                  this.$message({
                    message: "新增成功",
                    type: "success",
                  });
                  this.$emit("addSuccess");
                }
              }
            })
            .catch(() => {});
        } else {
        }
      });
    },
     edit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.from.studioCityName = this.studioCityName;
          updateStudio(this.from).then((res) => {
              if (res.code==200) {
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.$emit("addSuccess");
              }
            })
            .catch(() => {});
        } else {
        }
      });
    },
  },

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
@import "./addRoom.scss";
.el-select{
  width: 48%;
  margin-right: 2%;
}
</style>