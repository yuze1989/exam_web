<template>
  <div style="width:100%;text-align: center">
    <el-form :model="formsData" :rules="rules" ref="formsData" style="">
      <el-form-item class="clearfix" style="border-top: 1px solid #f3f3f3;padding-top:15px">
        <!--    <el-select @change="countExaminationInfo(forms)" class="roomAssgin_Sselect " placeholder="选择省份" v-model="forms.provinceCode">
          <el-option v-for="province in provinceList"
                     :key="province.province"
                     :value="province.id"
                     :label="province.province">
          </el-option>
        </el-select>-->
        <select-province @province="selectedProvince" class="roomAssgin_Sselect " placeholder="选择生源省份" />
        <div class="roomAssgin_number">
          <p>
            <span v-model="forms.allPeopleCount">考&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;生&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;数： {{ this.forms. allPeopleCount }}</span><br><span v-model="forms.inspectionsPeopleCount">已分配考生数：{{ forms.inspectionsPeopleCount }}</span>
          </p>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="already_number">
          <span v-model="forms.maxExamCode">已分配考场数{{+forms.maxExamCode}}</span>
          <span>未分配考生数：{{  forms.UnallocatedS  }}</span>
        </div>
      </el-form-item>

      <div class="mb-10  roomAssgin_input clearfix" v-for="(examroom,idx) in formsData.examrooms" :key="idx">
        <div class="left">
          <el-form-item class="display" label="" :prop="'examrooms.'+idx+'.st'" :rules="rules.st">
            <el-input type="number" min="1" max="50" class="w-100" @change="inpStudent"
            v-model="examroom.st" placeholder="考场编号"></el-input>
          </el-form-item>
          <span class="fw-b fs-20"> ～ </span>
          <el-form-item class="display" label="" :prop="'examrooms.' + idx +'.en'" :rules="rules.en">
            <el-input type="number" min="1" max="50" @focus="removal" @blur="number()"  @change="inpStudent"
            class="w-100" v-model="examroom.en" placeholder="考场编号"></el-input>
          </el-form-item>
        </div>
        <div class="right">
          <el-form-item class="display" label="" :prop="'examrooms.' + idx+'.Count'" :rules="rules.Count">
            <el-input type="number" min="1" max="50" v-model="examroom.Count" class="w-140 w-100" placeholder="请设置考场人数" @change="inpStudent"></el-input>
            <el-button type="text" v-show="idx == formsData.examrooms.length - 1" @click.native="toDel">删除</el-button>
          </el-form-item>
        </div>

      </div>

      <el-form-item>
        <el-button style="width:80%" @click="handleAdd">+ 新增考场配置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="submitForm('formsData')" class="meiyuan_btn" style="width:80%;margin-top: 10px">确认</el-button>
        <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
      </el-form-item>

    </el-form>
  </div>

</template>
<script>
import provinceCodeList from "@/utils/provinceCode";
import SelectProvince from '@/components/SelectProvince'

export default {
  components: { SelectProvince },
  data() {
    return {
      Allocated:'forms.maxExamCode',
      provinceList: provinceCodeList,
      formsData: {
        examrooms: [],
      },

      loading:false,
      forms2: {},
      forms: {
        examrooms: [],
        studioAreaName: '',//画室名
        provinceCode: '',//省
        province: '',//省
        inspectionsPeopleCount: '',//已分配考考生
        allPeopleCount: '',//考生数
        maxExamCode: '',//已分配考场数
        UnallocatedS: ''//未分配学生
      },
      origionObj: {
        UnallocatedS: '',
        maxExamCode: '',
        inspectionsPeopleCount: ''
      },
      map: [],//考场人数列表,
      examrooms: [],
      rules: {
        st: [
          { required: true, message: '输入正确考场编号', trigger: 'blur' },
        ],
        en: [
          { required: true, message: '输入正确考场编号', trigger: 'blur' },
        ],
        Count: [
          { required: true, message: '输入正确人数', trigger: 'blur' },
        ]
      },
      count: 0
    };
  },
  methods: {
    //考室去重
    removal() {
      this.formsData.examrooms.map((item, index) => {
      })
    },
    //输入框比较
    number() {
      this.formsData.examrooms.map((item, index) => {
        if (item.en < item.st) {
          item.en = ''
          this.$message({
            type: 'error',
            message: '第二个考场数值必须大于第一个考场'
          }
          )
        }
        return item;
      })
    },
    selectedProvince(payload) {
      this.forms2.provinceCode = payload.provinceCode
      this.forms2.provinceName = payload.province
      countExaminationInfo(payload.provinceCode).then((res) => {
        if (res.data.code == 200) {
          this.forms = res.data.result
          this.forms.UnallocatedS = parseInt(this.forms.allPeopleCount) - parseInt(this.forms.inspectionsPeopleCount)
          this.origionObj = {...this.forms}
          this.formsData = {examrooms: []}
          this.inpStudent()
        } else {
          this.$message({
            type: 'info',
            message: res.data.message
          })
        }

      });
    },
    toDel() {
      this.formsData.examrooms.pop()
      this.inpStudent()
    },
    //考场分配
    countExaminationInfo(data) {
    },

    handleAdd() {
      if (this.forms.provinceCode == '') {
        alert('请选择省份')
      } else {
        const obj = { st: '', en: '', Count: '' }
        if (this.formsData.examrooms.length) {
          const preObj = this.formsData.examrooms[this.formsData.examrooms.length - 1]
          if (preObj.st && preObj.en) {
            obj.st = +preObj.en + 1
            this.formsData.examrooms.push(obj)
          }
        } else {
          obj.st = this.forms.maxExamCode + 1
          this.formsData.examrooms.push(obj)
        }
      }
    },
    upok(response, file, fileList) {
      this.studio.url = file.name
    },
    inpStudent() {
      let n = 0
      let n2 = 0
      this.formsData.examrooms.forEach((item,index)=>{

        if (item.st && item.en) {
          if (item.Count) {
             n += +item.Count * (+item.en - +item.st + 1)
          }
          n2 += (+item.en - +item.st + 1)
        }
      })
      const {inspectionsPeopleCount, UnallocatedS, maxExamCode} = this.origionObj
      this.forms.inspectionsPeopleCount = +inspectionsPeopleCount
      this.forms.UnallocatedS = +UnallocatedS
      this.forms.maxExamCode = +maxExamCode
      this.forms.inspectionsPeopleCount += n
      this.forms.UnallocatedS -= n
      this.forms.maxExamCode += n2
    },
    submitForm(formName) {
      if (!this.forms2.provinceCode ) {
      this.$message({
        type:'error',
        message:'请选择省份',
      })
        return
      }
      this.loading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.examrooms = this.formsData.examrooms.map(item => {
            let obj = {}
            let value = item.Count
            let keys = Object.values(item)
            let numList = []
            let numB = parseInt(keys[1]) - parseInt(keys[0])
            for (let i = 0; i < numB + 1; i++) {
              numList.push([parseInt(keys[0]) + i])
            }
            numList.forEach(_item => {
              obj[_item] = value
            })
            return obj;
          })
          let obj = {}

          this.examrooms.forEach(item => {
            Object.assign(obj, item)
          })

          if(this.forms.UnallocatedS <0 ){
            this.$message(
                {
                  type:'error',
                  message:'超出可分配考生数'
                }
            )
            this.loading = false
            return
          }
        console.log(obj)
          if(obj == null){
            this.$message({
              type: 'error',
              message: '请填写考场配置'
            })
            this.loading = false
            return
          }
          let tempData = { provinceCode: this.forms2.provinceCode, provinceName: this.forms2.provinceName, map: obj }
          this.$axios.post(this.API.studentsManage.examRoomList, tempData)
            .then((res) => {
              if (res.code == 200) {
                this.data = res.result;
                this.total = res.result.total;
                this.users = res.result.list;
                this.listLoading = false;
              }
            })
            .catch((e) => {
                this.listLoading = false
              }
            );
          setExaminationInfo(tempData).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: 'susses',
                message: '分配考场成功'
              })
              this.$emit('closeRoom');
              this.$emit("update:visible", false);
              this.$emit("cb", this.form);
              this.loading = false
            } else {
              this.$message({
                type: 'info',
                message: res.data.message + '请刷新重试'
              })
              this.loading = false
            }
          })

        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {
  }
}

</script>
<style lang="scss">
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
  width: 50%;
  display: inline-block;
  margin-top: 1px;
  clear: both;

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

  .left {
    width: 55%;
    display: inline-block;
    text-align: right;
  }

  .right {
    width: 40%;
    display: inline-block;
    text-align: left;
    padding-left: 10px;
    box-sizing: border-box;
  }

  .mb-10 {
    margin-bottom: 10px;
  }

  .w-100 {
    width: 100px;
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }

    input[type="number"] {
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
</style>>