<template>
  <div style="width: 100%; text-align: center;">
    <el-form :model="formsData" :rules="rules" ref="ruleForm" style="" v-loading="loading">
      <el-form-item>
        <el-select clearable
          v-model="forms.examId"
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

        <el-select clearable
                   v-model="forms.address"
                   placeholder="考试地址"
                   value-key="value"
                   style="margin-left: 10px;"
        >
          <el-option
              v-for="item in addressList"
              :key="item.examAddress"
              :label="item.examAddress"
              :value="item.examAddress"
          ></el-option>
        </el-select>

        <el-select clearable
          placeholder="选择生源"
          v-model="forms.provinceCode"
          style="margin-left: 10px;"
          @change="provinceChange"
        >
          <el-option
            v-for="item in provinceList"
            :key="item.provinceCode"
            :label="item.province"
            :value="item.provinceCode"
          ></el-option>
        </el-select>

        <el-button
          type="primary"
          :loading="loading"
          @click="search('ruleForm')"
          class="meiyuan_btn"
          style="margin-left: 10px;"
        >
          查询
        </el-button>

        <div class="roomAssgin_number">
            <div
              v-model="forms.examineeCount"
              style="display: inline-block; width: 33%;text-align:center"
            >
              考生人数：{{ this.forms.examineeCount }}
            </div>
            <div
              v-model="forms.distributCount"
              style="display: inline-block;  width: 33%;text-align:center"
            >
              已分配考生人数：{{ forms.distributCount }}
            </div>
          <div
              v-model="forms.distributCount"
              style="display: inline-block;  width: 33%;text-align:center"
          >
            未分配考生人数：{{forms.unDistributCount }}
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="already_number">
          <span v-model="forms.maxExamCode">
            已分配考场数{{ forms.maxExamCode }}
          </span>
          <span>已分配考场剩余容量：{{ forms.distributRoomCount  }}</span>
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
              :disabled="examroom.isEdit"
              style="width: 100px;"
              @blur="number2(examroom.st)"
              @change="inpStudent('st',idx)"
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
              :disabled="examroom.isEdit"
              @focus="removal"
              @blur="number()"
              @change="inpStudent('en',idx)"
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
              :disabled="examroom.isEdit"
              v-model="examroom.Count"
              style="width: 150px;"
              placeholder="请设置考场容量"
              @change="inpStudent('Count',idx)"
            ></el-input>
          </el-form-item>
<!--          <el-button-->
<!--              v-if="examroom.isEdit"-->
<!--              type="text"-->
<!--              @click.native="toAdd(examroom)"-->
<!--              style="position: relative;padding: 0; height: 40px;left: 15px;"-->
<!--          >-->
<!--            +加容量-->
<!--          </el-button>-->
        </div>
        <div style="width: 100px;">
          <el-button
              v-if="!examroom.isEdit"
            type="text"
            v-show="idx == formsData.examrooms.length - 1"
            @click.native="toDel"
          >
            删除
          </el-button>
        </div>
      </div>

      <el-form-item style="margin-bottom: 15px">
        <el-button style="width: 80%;" @click="handleAdd">
          + 新增考场配置
        </el-button>
      </el-form-item>
      <div style="width: 80%;margin: 0 auto;">
        <el-form-item label="打乱顺序" style="margin-bottom: 0">
          <el-switch
              style="margin-top: 4px"
              v-model="is_shuffle"
              active-text="是"
              inactive-text="否">
          </el-switch>
        </el-form-item>
      </div>
      <el-form-item>
        <p
            v-if="is_show"
            style="margin: 0;
    padding: 0;
    height: 24px;
    color: #ff4242;">新增后需要点击确认，否则数据不会保存！</p>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
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
      is_shuffle:true,
      Allocated: 'forms.maxExamCode',
      provinceList: [],
      formsData: {
        examrooms: [],
      },
      addressList:[],
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
        distributRoomCount:"",//已分配考场剩余容量
        address:""
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
        Count: [{ required: true, message: '输入正确容量数', trigger: 'blur' }],
      },
      count: 0,
      unDistributCount2: 0,
      isLastDistribut:0,
      init_num:0,
      init_pp:0,
      is_show:false,
    }
  },
  created() {
    this.is_show = false;
  },
  methods: {
    toAdd(e){
      this.$prompt('请输入需要添加的容量！添加后不可减少，请谨慎操作！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType:"number",
          inputPattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/,
          inputErrorMessage: '只能输入大于0的整数'
        }).then(({ value }) => {
          this.$axios.post("/examinee/examRoomNumberAdd?id="+e.id+"&count="+value+"&before_number="+e.Count).then(res=>{
            if(res.code==200){
              this.search();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
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
    init(type){ //1.选择考试 不清考试id, 清省provinceList  province provinceCode; 2.选择省份  不清考试id 省provinceList  province provinceCode
      let newForms = {
        ...this.forms,
        examName: '', //考试名
        examrooms: [],
        studioAreaName: '', //机构名
        examineeCount: '', //考生数
        distributCount: '', //已分配考考生
        maxExamCode: '', //已分配考场数
        unDistributCount: '', //未分配学生
        distributRoomCount:'',//已分配考场剩余容量
      }
      if(type==1){
        newForms.provinceCode = '' //省
        newForms.province = '' //省
        this.provinceList = []
      }
      this.forms = newForms
      this.origionObj = {
        unDistributCount: '',
        maxExamCode: '',
        distributCount: '',
      }
      this.examrooms = []
      this.unDistributCount2 = 0
      this.count= 0
      this.formsData = {
        examrooms: [],
      }
    },
    examChange(value){
      this.forms.address = ""
      this.init('1')
      this.getProvinceList(value)
      this.getDz(value)
    },
    provinceChange(value){
      this.init('2')
    },
    getDz(examId){
      if(examId){
        this.$axios.get("/examinfo/detail?id="+examId).then((res)=>{
          this.addressList = res.result.addressList;
        })
      }

    },
    getProvinceList(examId) {
      this.$axios.get(`${this.API.examinfo.getProvinceByExamId}?examId=${examId}`).then(res=>{
        this.provinceList = res.result || []
      }).catch(()=>{})
    },
    getExamCount() {},
    search(payload) {
      this.init('1')
      let data = {
        examId: this.forms.examId,
        provinceCode: this.forms.provinceCode,
      }
      if(!this.forms.examId){
        this.$message.error("请先选择查询的考试")
        return
      }
      if(!this.forms.address){
        this.$message.error("请先选择考试地址")
        return
      }
      this.forms.maxExamCode=0
      this.$axios
        .get(
          `${this.API.studentsManage.examRoomCount}?examId=${this.forms.examId}&address=${this.forms.address}&&provinceCode=${this.forms.provinceCode}`,
          {},
        )
        .then((res) => {

          if ((res.code = 200)) {
            this.forms.examineeCount = res.result.examineeCount
            this.forms.distributCount = res.result.distributCount
            this.forms.distributRoomCount = res.result.distributRoomCount
            this.init_num = res.result.notDistributCount;
            this.init_pp = res.result.distributCount;
            this.forms.unDistributCount =
              parseInt(res.result.examineeCount) -
              parseInt(res.result.distributCount)
            this.unDistributCount2 =
              parseInt(res.result.examineeCount) -
              parseInt(res.result.distributCount) //unDistributCount2 总待分配人数,不改变
            this.origionObj = { ...this.forms }
            this.forms.maxExamCode = res.result.distributRoomCount
            this.forms.distributRoomCount =res.result.distributSurplusCount
            let list = [];
            res.result.examRoomList.forEach((item)=>{
              list.push({
                Count: item.number,
                en: item.numberEnd,
                st: item.numberStart,
                isEdit:true,
                id:item.id
              })
            })
              this.formsData = { examrooms: list }

            // this.inpStudent()
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
        if (item.en/1 < item.st/1) {
          item.en = ''
          this.$message({
            type: 'error',
            message: '第二个考场数值必须大于第一个考场',
          })
        }
        return item
      })
    },
    number2() {
      this.formsData.examrooms.map((item, index) => {
        if(index>0){
          if (item.st/1 <= this.formsData.examrooms[index-1].en/1) {
            item.en = ''
            this.$message({
              type: 'error',
              message: '第一个考场数值必须大于上面第二个考场',
            })
          }
        }
        return item

      })
    },
    toDel() {
      this.formsData.examrooms.pop()
      this.inpStudent()
    },

    handleAdd() {
      if(!this.forms.unDistributCount || this.forms.unDistributCount<1){
        this.$message.error("无可分配人数")
        return
      }
      if(this.forms.distributRoomCount > 0 ){
        let num =Math.abs(this.forms.distributRoomCount);
        this.$confirm('上次考场还有'+num+"个座位，是否分配到上次考场？", '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
          distinguishCancelAndClose: true,
        }).then(() => {
          this.isLastDistribut = 1;
          if(this.forms.unDistributCount <= this.forms.distributRoomCount){
            // let distributCount = this.forms.distributCount;
            // let unDistributCount = this.
            this.forms.distributCount = this.forms.distributCount + this.forms.unDistributCount; //已分配考生=已分配考生+未分配考生
            this.forms.distributRoomCount = this.forms.distributRoomCount - this.forms.unDistributCount;//剩余容量 = 剩余容量 - 未分配考生
            this.forms.unDistributCount = 0; //未分配为0
          }else{
            this.forms.distributCount = this.forms.distributCount + this.forms.distributRoomCount; //已分配考生=已分配考生+剩余容量
            this.forms.unDistributCount = this.forms.unDistributCount - this.forms.distributRoomCount; //未分配考生 = 未分配考生 - 剩余容量
            this.forms.distributRoomCount = 0;//剩余容量为0

            this.init_pp = this.forms.distributCount;
            this.init_num = this.forms.unDistributCount;


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
            this.is_show = true;

          }
        }).catch((action) => {
          if(action == 'cancel'){
            this.isLastDistribut = 0;

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
            this.is_show = true;

          }
        });
      }else{
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
      }



    },
    upok(response, file, fileList) {
      this.studio.url = file.name
    },
    inpStudent(type,index) {
      let n = 0 //考场数量
      let n1 = 0 ; //考场容量
      let n2 = 0 //总分配人数
      let n3 = 0;

      //console.log(`当前操作第${index}行,当前操作-${type},总分配人数${this.forms.maxExamCode += n2},总待分配人数${this.forms.unDistributCount -= n}`)

      //考场数
      this.formsData.examrooms.forEach((item, index) => {
        if (item.st && item.en) {
          if (item.Count) {
            n1 += +item.Count/1 * (+item.en/1 - +item.st + 1)
            if(!item.isEdit){
              n3 += (item.Count/1) * ((item.en/1) - (item.st/1)+1)
            }
          }
          n += (+item.en/1 - +item.st + 1)
          // n2 += +item.en - +item.st + 1
        }

      })


      if(n3 >= this.init_num/1){
          this.forms.unDistributCount = 0; //未分配考生人数
          this.forms.distributCount = this.init_pp + this.init_num/1;//已分配考生人数
        }else{
          this.forms.unDistributCount = this.init_num - n3; //未分配考生人数
          this.forms.distributCount = this.init_pp + n3;//已分配考生人数
        }


      this.forms.maxExamCode = n;//已分配考场数
      this.forms.distributRoomCount = (n1/1) - (this.forms.distributCount/1); //已分配考场容量


      // const { distributCount, unDistributCount, maxExamCode } = this.origionObj
      // let un = unDistributCount
      // if((un - n) < 0){
      //   this.$message.error("超出待分配人数")
      //   this.formsData.examrooms[index][type] = ""
      //   return
      // }
      // this.forms.distributCount = +distributCount
      // this.forms.unDistributCount = +unDistributCount
      // this.forms.maxExamCode = +maxExamCode
      // this.forms.distributCount += n
      // this.forms.unDistributCount -= n
      // this.forms.maxExamCode += n2
    },
    submitForm(formName) {

      this.$refs[formName].validate((valid) => {
        if (valid) {
          let examrooms = []
          this.formsData.examrooms.forEach((item,idnex)=>{
            if(!item.isEdit){
              examrooms.push({
                number: item.Count,
                numberEnd: item.en,
                numberStart: item.st,
              })
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
          if (Object.keys(examrooms).length === 0 && this.isLastDistribut == 0) {
            this.$message({
              type: 'error',
              message: '请填写考场配置',
            })
            this.loading = false
            return
          }
          let data  = "";
          if(examrooms.length == 0){
            data = {
              examId: this.forms.examId,
              provinceCode: this.forms.provinceCode,
              isLastDistribut:this.isLastDistribut,
              address:this.forms.address,
              is_shuffle:this.is_shuffle?1:0
            }
          }else{
            data = {
              detailList: examrooms,
              examId: this.forms.examId,
              provinceCode: this.forms.provinceCode,
              isLastDistribut:this.isLastDistribut,
              address:this.forms.address,
              is_shuffle:this.is_shuffle?1:0
            }
          }

          this.loading = true
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

        }else{
           this.loading = false
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
