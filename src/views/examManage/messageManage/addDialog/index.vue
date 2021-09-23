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
    <div slot="title">新增考试信息</div>
    <el-form
      label-width="120px"
      :model="from"
      label-position="right"
      class="demo-ruleForm"
      center
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item label="考试名称" prop="name">
        <el-input v-model="from.name" placeholder="请输入考试名称"></el-input>
      </el-form-item>

      <el-form-item label="考试报名费" prop="price">
        <el-input
          v-model="from.price"
          type="number"
          placeholder="请输入考试报名费"
        ></el-input>
      </el-form-item>

      <el-form-item label="考试说明" prop="remark">
        <el-input
          maxlength="680"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 10}"
          placeholder="请输入内容"
          v-model="from.remark">
        </el-input>
      </el-form-item>

      <div>
        <el-button type="primary" @click="addAddress">添加考试地址</el-button>
      </div>

      <div v-for="(item,index) in address" :key="index" :value="item">
        <div class="address-item flex">
          <el-input
            placeholder="请输入地址"
            v-model="address[index]"
          ></el-input>
          <div class="btn-blue" @click="delAddress(index)">删除</div>
        </div>
      </div>

      <div>
        <el-button type="primary" @click="addSubject">添加考试科目</el-button>
      </div>

      <div v-for="(item,index) in subject" :key="index" :value="item">
        <div class="address-item flex">
          <el-input
            placeholder="请输入考试科目"
            v-model="subject[index]"
          ></el-input>
          <div class="btn-blue" @click="delSubject(index)">删除</div>
        </div>
      </div>
    </el-form>

    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
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
      address: [""],
      subject: [""],
      List: [],
      from: {
        name: "",
        price: "",
        remark:""
      },
      rules: {
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        price: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        remark:[{ required: true, message: "请输入", trigger: "blur" }],
      },
    };
  },

  methods: {
    close() {
      this.$emit("update:visible", false);
    },
    open() {
      //console.log(this.editItem)
      if (this.isAdd) {
        this.from = {
          name: "",
          price: "",
          remark: "",
          address: [{
            examNum: 0,
            examAddress:"",
            province: "string",
            provinceCode: "string"
          }],
          subject: [{}]
        };
      } else {

        this.from = {
          name: this.editItem.name,
          price: (this.editItem.price/100).toFixed(2),
          remark: this.editItem.remark,
          address: this.editItem.address.split(","),
          subject: this.editItem.subject.split(","),
          id: this.editItem.id,
        };
        this.address = this.editItem.address.split(",")
        this.subject = this.editItem.subject.split(",")
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
          let data = {
            ...this.from,
            address: this.address,
            subject: this.subject,
            price: (this.from.price*100).toFixed(0)
          }
          this.$axios
            .post(this.API.messageManage.insert, data)
            .then((res) => {
              if (res.code==200) {
                this.$message({
                  message: "新增成功",
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

    addAddress() {
      this.address = [...this.address.push("")] 
    },
    delAddress(index){
      this.address.splice(index,1);
    },
    addSubject() {
      this.subject = [...this.subject.push("")] 
    },
    delSubject(index){

      this.subject.splice(index,1);
    },
    edit() {
      this.$axios
        .post(
          this.API.messageManage.update, 
          {
            ...this.from,
            address: this.address,
            subject: this.subject,
            price: (this.from.price*100).toFixed(0)
          })
        .then((res) => {
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.$emit("addSuccess");
        })
        .catch(() => {});
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