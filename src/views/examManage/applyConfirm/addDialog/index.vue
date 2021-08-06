<template>
  <el-dialog
    :visible.sync="visible"
    :show-close="true"
    :close-on-click-modal="false"
    :before-close="handleClose"
    @open="open"
    width="1000px"
    center
  >
    <div slot="title">考试信息</div>
    <el-form
      label-width="140px"
      :model="from"
      label-position="right"
      class="demo-ruleForm"
      center
      :rules="rules"
      ref="examForm"
    >
      <el-form-item label="考试名称" prop="name">
        <el-input
          style="width: 250px;"
          v-model="from.name"
          placeholder="请输入考试名称"
        ></el-input>
      </el-form-item>

      <el-form-item label="考试类型" prop="examType">
        <el-select
          style="width: 250px;"
          v-model="from.examType"
          placeholder="考试类型"
          value-key="value"
        >
          <el-option
            v-for="item in examTypeStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="报名开始时间" prop="enrollStartTime">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="from.enrollStartTime"
          style="width: 250px;"
          value-format="yyyy-MM-dd HH:mm:ss"
          :disabled="false"
          :clearable="false"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="报名结束时间" prop="enrollEndTime">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="from.enrollEndTime"
          style="width: 250px;"
          value-format="yyyy-MM-dd HH:mm:ss"
          :disabled="false"
          :clearable="false"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="考试开始时间" prop="examStartTime">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="from.examStartTime"
          style="width: 250px;"
          value-format="yyyy-MM-dd HH:mm:ss"
          :disabled="false"
          :clearable="true"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="考试结束时间" prop="examEndTime">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="from.examEndTime"
          style="width: 250px;"
          value-format="yyyy-MM-dd HH:mm:ss"
          :disabled="false"
          :clearable="false"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="考试报名费" prop="price">
        <el-input
          v-model="from.price"
          style="width: 250px;"
          type="number"
          placeholder="请输入考试报名费"
        ></el-input>
      </el-form-item>

      <el-form-item label="考试说明" prop="remark">
        <el-input
          maxlength="680"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 10 }"
          placeholder="请输入内容"
          v-model="from.remark"
        ></el-input>
      </el-form-item>

      <div>
        <el-button
          type="primary"
          style="margin-bottom: 10px;"
          @click="addAddress"
        >
          添加考试地址
        </el-button>
        <!-- <span> (设置0为不限人数) </span> -->
      </div>

      <div v-for="(item, index) in address" :key="index" :value="item">
        <el-form
          :inline="true"
          :model="item"
          :rules="rules"
          ref="ruleForm"
          label-width="30px"
          class="demo-ruleForm"
        >
          <el-form-item>
            <el-select
              v-model="item.province"
              style="width: 180px;"
              placeholder="选择省份"
            >
              <el-option
                v-for="(item, i) in provinceList"
                :key="i"
                :value="item.provinceCode"
                :label="item.province"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="item.examAddress"
              placeholder="请输入考试地址"
              style="width: 180px;"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="item.examNum"
              placeholder="人数限制(输入0为不限制)"
              onkeyup="value=value.replace(/[^\d]/g,'')"
              style="width: 200px;"
            ></el-input>
          </el-form-item>
          <el-form-item prop="submit">
            <el-button
              type="text"
              style="width: 50px;"
              @click="delAddress(index)"
            >
              移除
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div>
        <el-button
          type="primary"
          style="margin-bottom: 10px;"
          @click="addSubject"
        >
          添加考试科目
        </el-button>
      </div>

      <div v-for="(item, index) in subject" :key="index+'-'" :value="item">
        <el-form
          :inline="true"
          :model="item"
          :rules="rules"
          ref="ruleForm"
          label-width="30px"
          class="demo-ruleForm"
        >
          <el-form-item>
            <el-input
              v-model="item.subjectName"
              placeholder="请输入考试科目"
              style="width: 180px;"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="item.subjectDate"
              style="width: 180px;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-time-select
              style="width: 120px;"
              placeholder="起始时间"
              v-model="item.subjectStarttime"
            ></el-time-select>
            <el-time-select
              style="width: 120px;"
              placeholder="结束时间"
              v-model="item.subjectEndtime"
            ></el-time-select>
          </el-form-item>
          <el-form-item prop="submit">
            <el-button
              type="text"
              style="width: 50px;"
              @click="delSubject(index2)"
            >
              移除
            </el-button>
          </el-form-item>
        </el-form>
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
  name: 'addRoom',
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
      provinceList: [],
      address: [
        {
          // examAddress:"地址", //: 考试地址 ,
          // examNum:"22", //: 考试人数 ,
          // province:"浙江省", //: 省 ,
          // provinceCode:"333" //: 省编码
        },
      ],
      subject: [
        {
          // subjectDate:"2020-10-10", //: 科目日期 ,
          // subjectStarttime:"00:00:00", //: 科目开始时间
          // subjectEndtime:"01:00:00", //: 科目结束时间 ,
          // subjectName:"123", //: 科目名称 ,
        },
      ],
      ExamAddress: {
        examAddress: '', //: 考试地址 ,
        examId: '', //: 考试id ,
        examNum: '', //: 考试人数 ,
        province: '', //: 省 ,
        provinceCode: '', //: 省编码
      },
      ExamSubject: {
        examId: '', //: 考试id ,
        sort: '', //: 排序 ,
        subjectDate: '', //: 科目日期 ,
        subjectEndtime: '00:00:00', //: 科目结束时间 ,
        subjectName: '', //: 科目名称 ,
        subjectStarttime: '00:00:00', //: 科目开始时间
      },
      from: {
        id: '', //id
        name: '', //考试名称
        price: '', //报名费 ,
        remark: '', //备注 ,
        examType: '', //考试类型:0、画室内部考试;1、画室之间考试;2、校考之间考试;3、全国之间考试 ,
        enrollEndTime: '', //报名结束时间 ,
        enrollStartTime: '', // 报名开始时间 ,
        examEndTime: '', // 考试结束时间 ,
        examStartTime: '', // 考试开始时间 ,
      },
      examTypeStatus: [
        {
          value: '0',
          label: '画室考试',
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
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        examType: [{ required: true, message: '请输入', trigger: 'blur' }],
        price: [{ required: true, message: '请输入', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入', trigger: 'blur' }],
        enrollStartTime: [
          { required: true, message: '请选择开始日期', trigger: 'change' },
        ],
        enrollEndTime: [
          { required: true, message: '请选择结束日期', trigger: 'change' },
        ],
        examStartTime: [
          { required: true, message: '请选择开始日期', trigger: 'change' },
        ],
        examEndTime: [
          { required: true, message: '请选择结束日期', trigger: 'change' },
        ],
      },
    }
  },
  created() {
    this.getProvinceList()
  },
  methods: {
    getProvinceList() {
      this.$axios
        .get(this.API.examinfo.allProvince)
        .then((res) => {
          this.provinceList = res.result
        })
        .catch(() => {})
    },
    close() {
      this.$emit('update:visible', false)
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    open() {
      console.log(this.editItem, this.isAdd, 'this.isAdd')
      if (this.isAdd) {
        this.from = {}
        this.address = [{}]
        this.subject = [{}]
      } else {
        this.$axios
          .get(this.API.examinfo.detail + '?id=' + this.editItem.id)
          .then((res) => {
            console.log(res, '详情')
            let result = res.result
            this.from = {
              id: result.id, //id
              name: result.name, //考试名称
              price: (result.price / 100).toFixed(2), //报名费 ,
              remark: result.remark, //备注,
              examType: String(result.examType), //考试类型:0、画室内部考试;1、画室之间考试;2、校考之间考试;3、全国之间考试 ,
              enrollEndTime: result.enrollEndTime, //报名结束时间 ,
              enrollStartTime: result.enrollStartTime, // 报名开始时间 ,
              examEndTime: result.examEndTime, // 考试结束时间 ,
              examStartTime: result.examStartTime, // 考试开始时间 ,
            }
            this.address = result.addressList?result.addressList:[{}]
            this.subject = result.subjectList?result.subjectList:[{}]
          })
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
      this.$refs.examForm.validate((valid) => {
        if (valid) {
          let data = {
            ...this.from,
            addressList: this.address,
            subjectList: this.subject,
            price: (this.from.price * 100).toFixed(0),
          }
          this.$axios
            .post(this.API.examinfo.create, data)
            .then((res) => {
              if (res) {
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

    addAddress() {
      this.address.push({})
    },
    delAddress(index) {
      this.address.splice(index, 1)
    },
    addSubject() {
      this.subject.push({})
    },
    delSubject(index) {
      this.subject.splice(index, 1)
    },
    edit() {
      this.$refs.examForm.validate((valid) => {
        if (valid) {
          this.$axios
            .post(this.API.examinfo.update, {
              ...this.from,
              addressList: this.address,
              subjectList: this.subject,
              price: (this.from.price * 100).toFixed(0),
            })
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
</style>
<style lang="scss" scoped>
@import './add.scss';
</style>
