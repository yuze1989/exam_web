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


      <el-form-item label="考试类型" prop="examType">
        <el-select
          style="width: 100%"
          v-model="from.examType"
          placeholder="考试类型"
        >
        <el-option
          v-for="item in examTypeStatus"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="报名开始时间" prop="enrollStartTime">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="from.enrollStartTime"
          style="width: 100%"
          value-format="yyyy-MM-dd"
          :disabled="false"
          :clearable="false"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="报名结束时间" prop="enrollEndTime">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="from.enrollEndTime"
          style="width: 100%"
          value-format="yyyy-MM-dd"
          :disabled="false"
          :clearable="false"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="考试开始时间" prop="examStartTime">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="from.examStartTime"
          style="width: 100%"
          value-format="yyyy-MM-dd"
          :disabled="false"
          :clearable="true"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="考试结束时间" prop="examEndTime">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="from.examEndTime"
          style="width: 100%"
          value-format="yyyy-MM-dd"
          :disabled="false"
          :clearable="false"
        ></el-date-picker>
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
      // ExamInfoDTO {
      //   addressList (Array[ExamAddress], optional): 地址 ,
      //   id (integer, optional): id ,
      //   subjectList (Array[ExamSubject], optional): 科目
      // }
      // ExamAddress {
      //   examAddress (string, optional): 考试地址 ,
      //   examId (integer, optional): 考试id ,
      //   examNum (integer, optional): 考试人数 ,
      //   province (string, optional): 省 ,
      //   provinceCode (string, optional): 省编码
      // }
      // ExamSubject {
      //   examId (integer, optional): 考试id ,
      //   sort (integer, optional): 排序 ,
      //   subjectDate (string, optional): 科目日期 ,
      //   subjectEndtime (string, optional): 科目结束时间 ,
      //   subjectName (string, optional): 科目名称 ,
      //   subjectStarttime (string, optional): 科目开始时间
      // }
      address: [""],
      subject: [""],
      List: [],
      from: {
        name: "",//考试名称
        price: "",//报名费 ,
        remark:"",//备注 ,
        examType: "",//考试类型:0、画室内部考试;1、画室之间考试;2、校考之间考试;3、全国之间考试 ,
        enrollEndTime:"", //报名结束时间 ,
        enrollStartTime:"", // 报名开始时间 ,
        examEndTime: "", // 考试结束时间 ,
        examStartTime: "" // 考试开始时间 ,
      },
      examTypeStatus: [{
        value: '0',
        label: '画室内部考试'
      }, {
        value: '1',
        label: '画室之间考试'
      }, {
        value: '2',
        label: '校考之间考试'
      }, {
        value: '3',
        label: '全国之间考试'
      }],
      rules: {
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        examType: [{ required: true, message: "请输入", trigger: "blur" }],
        price: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        remark:[{ required: true, message: "请输入", trigger: "blur" }],
        enrollStartTime: [
          { required: true, message: "请选择开始日期", trigger: "change" },
        ],
        enrollEndTime: [
          { required: true, message: "请选择结束日期", trigger: "change" },
        ],
        examStartTime: [
          { required: true, message: "请选择开始日期", trigger: "change" },
        ],
        examEndTime: [
          { required: true, message: "请选择结束日期", trigger: "change" },
        ],
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
          address: [""],
          subject: [""],
        };
      } else {
        console.log(this.editItem.address.split(","),'pp')
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

    changeStartDate(val) {
      // let endDate =
      // this.$dayjs(val).add(12, "month").format("YYYY-MM-DD") + " 00:00:00";
      // this.addOrderForm.endTime = endDate;
    },

    // api
    add() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let data = {
            ...this.from,
            addressList: this.address,
            subjectList: this.subject,
            price: (this.from.price*100).toFixed(0)
          }
          this.$axios
            .post(this.API.examinfo.create, data)
            .then((res) => {
              if (res) {
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
            addressList: this.address,
            subjectList: this.subject,
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