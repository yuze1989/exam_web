<template>
  <div style="width: 100%; text-align: center;">
    <el-form :model="formsData" :rules="rules" ref="formsData" style="">
      <el-form-item>
        <el-select
          v-model="forms.examId"
          placeholder="考试名称"
          value-key="value"
        >
          <el-option
            v-for="item in examList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <el-select
          placeholder="选择省份"
          v-model="forms.provinceCode"
          style="margin-left: 10px;"
        >
          <el-option
            v-for="province in provinceList"
            :key="province.province"
            :value="province.id"
            :label="province.province"
          ></el-option>
        </el-select>

        <el-button
          type="primary"
          :loading="loading"
          @click="search()"
          class="meiyuan_btn"
          style="margin-left: 10px;"
        >
          查询
        </el-button>

        <div class="roomAssgin_number">
            <div
              v-model="forms.examineeCount"
              style="display: inline-block; width: 50%;text-align:center"
            >
              考生数：{{ this.forms.examineeCount }}
            </div>
            <div
              v-model="forms.distributCount"
              style="display: inline-block;  width: 50%;text-align:center"
            >
              已分配数：{{ forms.distributCount }}
            </div>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="already_number">
          <span v-model="forms.maxExamCode">
            已分配考场数{{ +forms.maxExamCode }}
          </span>
          <span>未分配考生数：{{ forms.unDistributCount }}</span>
        </div>
      </el-form-item>

      <div
        class="flexBox"
        v-for="(examroom, idx) in formsData.examrooms"
        :key="idx"
      >
        <div style="width: 500px;" class="flexBox">
          <el-form-item
            class="display"
            label=""
            :prop="'examrooms.' + idx + '.st'"
            :rules="rules.st"
          >
            <el-input
              type="number"
              min="1"
              max="50"
              style="width: 100px;"
              @change="inpStudent"
              v-model="examroom.st"
              placeholder="考场编号"
            ></el-input>
          </el-form-item>
          <span style="padding-top: 10px;">～</span>
          <el-form-item
            class="display"
            label=""
            :prop="'examrooms.' + idx + '.en'"
            :rules="rules.en"
          >
            <el-input
              type="number"
              min="1"
              max="50"
              @focus="removal"
              @blur="number()"
              @change="inpStudent"
              style="width: 100px; margin-right: 10px;"
              v-model="examroom.en"
              placeholder="考场编号"
            ></el-input>
          </el-form-item>
          <el-form-item
            class="display"
            label=""
            :prop="'examrooms.' + idx + '.Count'"
            :rules="rules.Count"
          >
            <el-input
              type="number"
              min="1"
              max="50"
              v-model="examroom.Count"
              style="width: 150px;"
              placeholder="请设置考场人数"
              @change="inpStudent"
            ></el-input>
          </el-form-item>
        </div>
        <div style="width: 100px;">
          <el-button
            type="text"
            v-show="idx == formsData.examrooms.length - 1"
            @click.native="toDel"
          >
            删除
          </el-button>
        </div>
      </div>

      <el-form-item>
        <el-button style="width: 80%;" @click="handleAdd">
          + 新增考场配置
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          @click="submitForm('formsData')"
          class="meiyuan_btn"
          style="width: 80%; margin-top: 10px;"
        >
          确认
        </el-button>
        <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import provinceCodeList from '@/utils/provinceCode'
import SelectProvince from '@/components/SelectProvince'

export default {
  components: { SelectProvince },
  data() {
    return {
      Allocated: 'forms.maxExamCode',
      provinceList: provinceCodeList,
      formsData: {
        examrooms: [],
      },
      examList: [],
      loading: false,
      forms2: {},
      forms: {
        examId: '', //考试id
        examName: '', //考试名
        provinceCode: '', //省
        province: '', //省
        examrooms: [],
        studioAreaName: '', //机构名
        examineeCount: '', //考生数
        distributCount: '', //已分配考考生
        maxExamCode: '', //已分配考场数
        unDistributCount: '', //未分配学生
      },
      origionObj: {
        unDistributCount: '',
        maxExamCode: '',
        distributCount: '',
      },
      map: [], //考场人数列表,
      examrooms: [],
      rules: {
        st: [{ required: true, message: '输入正确考场编号', trigger: 'blur' }],
        en: [{ required: true, message: '输入正确考场编号', trigger: 'blur' }],
        Count: [{ required: true, message: '输入正确人数', trigger: 'blur' }],
      },
      count: 0,
    }
  },
  methods: {
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
    getExamCount() {},
    search(payload) {
      let data = {
        examId: this.forms.examId,
        provinceCode: this.forms.provinceCode,
      }
      this.$axios
        .get(
          `${this.API.studentsManage.examRoomCount}?examId=${this.forms.examId}&provinceCode=${this.forms.provinceCode}`,
          {},
        )
        .then((res) => {
          console.log(res, 'rrr')
          if ((res.code = 200)) {
            this.forms.examineeCount = res.result.examineeCount
            this.forms.distributCount = res.result.distributCount
            this.forms.unDistributCount =
              parseInt(res.result.examineeCount) -
              parseInt(res.result.distributCount)
            // this.forms = res.data.result
            this.origionObj = { ...this.forms }
            this.formsData = { examrooms: [] }
            this.inpStudent()
          }
        })
        .catch(() => {})
    },

    //考室去重
    removal() {
      this.formsData.examrooms.map((item, index) => {})
    },
    //输入框比较
    number() {
      this.formsData.examrooms.map((item, index) => {
        if (item.en < item.st) {
          item.en = ''
          this.$message({
            type: 'error',
            message: '第二个考场数值必须大于第一个考场',
          })
        }
        return item
      })
    },
    toDel() {
      this.formsData.examrooms.pop()
      this.inpStudent()
    },

    handleAdd() {
      // if (this.forms.provinceCode == '') {
      //   alert('请选择省份')
      // } else {
        const obj = { st: '', en: '', Count: '' }
        if (this.formsData.examrooms.length) {
          const preObj = this.formsData.examrooms[
            this.formsData.examrooms.length - 1
          ]
          if (preObj.st && preObj.en) {
            obj.st = +preObj.en + 1
            this.formsData.examrooms.push(obj)
          }
        } else {
          obj.st = this.forms.maxExamCode + 1
          this.formsData.examrooms.push(obj)
        }
      // }
    },
    upok(response, file, fileList) {
      this.studio.url = file.name
    },
    inpStudent() {
      let n = 0
      let n2 = 0
      this.formsData.examrooms.forEach((item, index) => {
        if (item.st && item.en) {
          if (item.Count) {
            n += +item.Count * (+item.en - +item.st + 1)
          }
          n2 += +item.en - +item.st + 1
        }
      })
      const { distributCount, unDistributCount, maxExamCode } = this.origionObj
      this.forms.distributCount = +distributCount
      this.forms.unDistributCount = +unDistributCount
      this.forms.maxExamCode = +maxExamCode
      this.forms.distributCount += n
      this.forms.unDistributCount -= n
      this.forms.maxExamCode += n2
    },
    submitForm(formName) {
      // if (!this.forms.provinceCode) {
      //   this.$message({
      //     type: 'error',
      //     message: '请选择省份1',
      //   })
      //   return
      // }
      this.loading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.formsData.examrooms, 'examrooms')
          let examrooms = this.formsData.examrooms.map((item) => {
            return {
              number: item.Count,
              numberEnd: item.en,
              numberStart: item.st,
            }
          })

          if (this.forms.unDistributCount < 0) {
            this.$message({
              type: 'error',
              message: '超出可分配考生数',
            })
            this.loading = false
            return
          }
          if (Object.keys(examrooms).length === 0) {
            this.$message({
              type: 'error',
              message: '请填写考场配置',
            })
            this.loading = false
            return
          }
          let data = {
            detailList: examrooms,
            examId: this.forms.examId,
            provinceCode: this.forms.provinceCode,
          }
          this.$axios
            .post(this.API.studentsManage.examRoomDistribut, data)
            .then((res) => {
              if (res.code == 200) {
                this.$message({
                  type: 'success',
                  message: '分配考场成功',
                })
                this.$emit('closeRoom')
                this.$emit('update:visible', false)
                this.$emit('cb', this.form)
                this.loading = false
              } else {
                this.$message({
                  type: 'info',
                  message: res.data.message + '请刷新重试',
                })
                this.loading = false
              }
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
  mounted() {
    this.getExamList()
  },
}
</script>
<style lang="scss">
.flexBox {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.roomAssgin_Sselect {
  //width: 140px;
  //  display: inline-block;
  width: 50%;
  float: left;
  text-align: right;

  .el-input__inner {
    width: 100%;
    height: 60px;
    background: #f3f3f3;
    border-radius: 10px;
  }
}

.roomAssgin_number {
  width: 60%;
  margin-left: 15%;
  display: inline-block;
  margin-top: 1px;
  clear: both;
  display: flex;
  justify-content: center;
  align-content: center;
  p {
    font-size: 16px;
    line-height: 18px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    margin: 0;
    text-align: left;
    width: 100%;
    line-height: 25px;
    padding: 5px 0 10px 10px;
  }
}

.roomAssgin_input {
  height: auto;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 16px;

  .mb-10 {
    margin-bottom: 10px;
  }

  .w-100 {
    width: 100px;
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }

    input[type='number'] {
      -moz-appearance: textfield;
    }
  }

  .w-140 {
    width: 140px;
  }

  .fw-b {
    font-weight: bold;
  }

  .fs-20 {
    font-size: 20px;
  }
}

/* 定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: rgba(240, 240, 240, 1);
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 0px rgba(240, 240, 240, 0.5);
  border-radius: 10px;
  background-color: rgba(240, 240, 240, 0.5);
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 0px rgba(240, 240, 240, 0.5);
  background-color: rgba(240, 240, 240, 0.5);
}

.already_number {
  width: 70%;
  margin: 0 auto;
  font-size: 14px;
  border-bottom: solid 1px #c2c2c2;

  span:first-child {
    padding-right: 10px;
    border-right: solid 1px #c2c2c2;
  }

  span:last-child {
    padding-left: 10px;
  }
}
</style>
>
