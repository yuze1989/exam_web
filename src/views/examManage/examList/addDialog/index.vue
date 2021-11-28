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
        <el-select clearable
          style="width: 250px;"
          v-model="from.examType"
          placeholder="考试类型"
          value-key="value"
          :disabled="!isAdd"
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
          style="width: 250px;"
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
          style="width: 250px;"
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
          style="width: 250px;"
          value-format="yyyy-MM-dd"
          :disabled="false"
          :clearable="false"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="是否开放查询" prop="examType">
        <el-select clearable
                   style="width: 250px;"
                   v-model="from.queryEnable"
                   placeholder="考生是否可以查询分数"
                   value-key="value"
        >
          <el-option
              v-for="item in studyList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
	  <el-form-item label="查分条件" prop="queryCoundition" v-if="from.queryEnable">
		  <el-checkbox-group v-model="queryCondition">
			  <el-checkbox label="姓名" disabled value="true"></el-checkbox>
			  <el-checkbox label="准考证" ></el-checkbox>
			  <el-checkbox label="身份证" ></el-checkbox>
		  </el-checkbox-group>
	  </el-form-item>
	  <el-form-item label="显示内容" prop="showList" v-if="from.queryEnable">
	  		  <el-checkbox-group v-model="showList">
	  			  <el-checkbox label="总分"></el-checkbox>
	  			  <el-checkbox label="总排名" ></el-checkbox>
	  			  <el-checkbox label="机构内排名" ></el-checkbox>
	  			  <el-checkbox label="各科成绩" ></el-checkbox>
	  			  <el-checkbox label="科目机构排名" ></el-checkbox>
	  			  <el-checkbox label="科目总排名" ></el-checkbox>
	  			  <el-checkbox label="试卷" ></el-checkbox>
	  		  </el-checkbox-group>
	  </el-form-item>
      <el-form-item label="查询开始时间" prop="studyStartTime" v-if="from.queryEnable">
        <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="from.queryStartTime"
            style="width: 250px;"
            value-format="yyyy-MM-dd"
            :disabled="false"
            :clearable="false"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="查询结束时间" prop="studyEndTime" v-if="from.queryEnable">
        <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="from.queryEndTime"
            style="width: 250px;"
            value-format="yyyy-MM-dd"
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
          :min="0"
        ></el-input>
      </el-form-item>

      <el-form-item label="考试说明" prop="remark">
        <tinymce v-if="visible" v-model="from.remark" :height="100" />
        <!-- <el-input
          maxlength="680"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 10 }"
          placeholder="请输入内容"
          v-model="from.remark"
        ></el-input> -->
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
            <el-select clearable
              v-model="item.province"
              style="width: 180px;"
              placeholder="选择省份"
              @change="dataChange(item,index)"
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
              @click="delAddress(index,item.id)"
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

      <div v-for="(item, index) in subject" :key="index + '-'" :value="item">
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
              value-format="yyyy-MM-dd"
              :disabled="false"
              :clearable="false"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-time-picker
              style="width: 120px;"
              format="HH:mm"
              value-format="HH:mm"
              placeholder="起始时间"
              v-model="item.subjectStarttime"
            ></el-time-picker>
            <el-time-picker
              style="width: 120px;"
              placeholder="结束时间"
              format="HH:mm"
              value-format="HH:mm"
              v-model="item.subjectEndtime"
            ></el-time-picker>
          </el-form-item>
          <el-form-item prop="submit">
            <el-button
              type="text"
              style="width: 50px;"
              @click="delSubject(index,item.id)"
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
    <el-dialog
        :visible.sync="dialogFormVisible"
        width="50%"
        center
        :append-to-body="true"
        :close-on-click-modal="false"
    >
      <div slot="title">管理员验证</div>
      <el-form
          label-width="120px"
          label-position="right"
          class="demo-ruleForm"
          center
          ref="delForm"
      >
        <p style="    text-align: center;
    color: red;
    font-size: 20px;
    padding: 0;
    margin: 0;
    margin-bottom: 15px;">{{msg}}</p>
        <el-form-item label="管理员账号" prop="username" style="margin-bottom: 15px">
          <el-input v-model="admin_username" placeholder="请输入管理员账号"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="admin_password" placeholder="请输入密码"></el-input>
        </el-form-item>


      </el-form>

      <div slot="footer">
        <el-button type="primary"   @click="del">确认</el-button>
      </div>

    </el-dialog>
  </el-dialog>
</template>

<script>
import Tinymce from "@/components/TinymceText/index";
export default {
  components: { Tinymce },
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
      admin_username:"",
      admin_password:"",
      msg:"",
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
        examType: '', //考试类型:0、机构内部考试;1、机构之间考试;2、校考之间考试;3、全国之间考试 ,
        enrollEndTime: '', //报名结束时间 ,
        enrollStartTime: '', // 报名开始时间 ,
        examEndTime: '', // 考试结束时间 ,
        examStartTime: '', // 考试开始时间 ,
        queryEnable:'',//是否可查询
        queryStartTime:"",
        queryEndTime:"",
      },
      studyList:[
        {
          value: false,
          label: '不可查询',
        },
        {
          value: true,
          label: '可查询',
        },
      ],
      examTypeStatus: [
        {
          value: '0',
          label: '机构考试',
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

      dialogFormVisible:false,
      xx_id:"",
      xx_index:"",
      is_type:"",
	  queryCondition:['姓名'],
	  showRankInProvince:true,
	  showRankInStudio:true,
	  showScore:true,
	  showTotalRankInProvince:true,
	  showTotalRankInStudio:true,
	  showTotalScore:true,
	  showList:[],
    }
  },
  created() {
    this.getProvinceList()
  },
  mounted() {
  },
  methods: {
    dataChange(item,index){

      this.provinceList.map(j =>{
        if(item.province == j.provinceCode){
          this.address[index].province = j.province
          this.address[index].provinceCode = j.provinceCode
        }
      })
    },
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
      this.$nextTick(() => {
        this.$refs.examForm.clearValidate()
      })
      if (this.isAdd) {
        this.from = {}
        this.address = [{}]
        this.subject = [{}]

      } else {
        this.$axios
          .get(this.API.examinfo.detail + '?id=' + this.editItem.id)
          .then((res) => {
            let result = res.result;
            this.from = {
              id: result.id, //id
              name: result.name, //考试名称
              price: (result.price / 100).toFixed(2), //报名费 ,
              remark: result.remark, //备注,
              examType: String(result.examType), //考试类型:0、机构内部考试;1、机构之间考试;2、校考之间考试;3、全国之间考试 ,
              enrollEndTime: result.enrollEndTime, //报名结束时间 ,
              enrollStartTime: result.enrollStartTime, // 报名开始时间 ,
              examEndTime: result.examEndTime, // 考试结束时间 ,
              examStartTime: result.examStartTime, // 考试开始时间 ,
              queryEnable:result.queryEnable,
              queryEndTime:result.queryEndTime,
              queryStartTime:result.queryStartTime,
            }
			if(result.queryParams){
				let queryParams = JSON.parse(result.queryParams);
				if(queryParams.queryCondition.includes("admission_ticket_code")){
					this.queryCondition.push("准考证")
				}
				if(queryParams.queryCondition.includes("identification")){
					this.queryCondition.push("身份证")
				}
				if(queryParams.showPaper){
					this.showList.push("试卷")
				}
				if(queryParams.showTotalScore){
					this.showList.push("总分")
				}
				if(queryParams.showTotalRankInProvince){
					this.showList.push("总排名")
				}
				if(queryParams.showTotalRankInStudio){
					this.showList.push("机构内排名")
				}
				if(queryParams.showScore){
					this.showList.push("各科成绩")
				}
				if(queryParams.showRankInStudio){
					this.showList.push("科目机构排名")
				}
				if(queryParams.showRankInProvince){
					this.showList.push("科目总排名")
				}

			}

            this.address = result.addressList ? result.addressList : [{}]
            this.subject = result.subjectList ? result.subjectList : [{}]
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
          // 时间校验
          if(this.from.enrollEndTime < this.from.enrollStartTime){
            this.$message({
              message: '报名结束时间应大于开始时间',
            })
            return
          }
          if(this.from.examEndTime < this.from.examStartTime){
            this.$message({
              message: '考试结束时间应大于开始时间',
            })
            return
          }
          if(this.from.examStartTime < this.from.enrollEndTime){
            this.$message({
              message: '考试时间应大于报名时间',
            })
            return
          }

          // if(this.from.queryEnable ){
          //   if(!this.from.queryStartTime || !this.from.queryEndTime){
          //     this.$message({
          //       message: '请先选择查询开始时间与查询结束时间！',
          //     })
          //     return
          //   }
          //   if(this.from.queryStartTime.split(" ")[0] < this.from.queryEndTime.split(" ")[0]){
          //     this.$message({
          //       message: '查询结束时间应大于开始时间',
          //     })
          //     return
          //   }
          // }
          // 地址校验
          if(this.address.length<0){
            this.$message({
              message: '请添加考试地址',
            })
            return
          }
          // 地址完整性
          let errAddress = 0
          this.address.map((item,index)=>{
            if(!item.examAddress || !item.province || !item.provinceCode){
              errAddress += 1
            }
          })
          if(errAddress>0){
            this.$message({
              message: '考试地址请填写完整',
            })
            return
          }
          // 科目校验
          if(this.subject.length<0){
            this.$message({
              message: '请添加考试科目',
            })
            return
          }
          // 科目完整性
          let errEmpty = 0
          this.subject.map((item,index)=>{
            if(!item.subjectEndtime || !item.subjectStarttime || !item.subjectDate){
              errEmpty += 1
            }
          })
          if(errEmpty>0){
            this.$message({
              message: '考试科目请填写完整',
            })
            return
          }
          // 科目日期  >= 开始日期  科目日期 <= 结束日期

          let errDate = 0
          this.subject.map((item,index)=>{
            if(item.subjectDate < this.from.examStartTime || item.subjectDate > this.from.examEndTime){
              errDate += 1
            }
          })
          if(errDate>0){
            this.$message({
              message: '考试科目时间应在考试开始时间和结束时间范围内',
            })
            return
          }

          let errCount = 0
          this.subject.map((item,index)=>{
            if(item.subjectEndtime < item.subjectStarttime){
              errCount += 1
            }
          })
          if(errCount>0){
            this.$message({
              message: '考试科目结束时间应大于开始时间',
            })
            return
          }

          if(this.from.remark.length > 1100){
            this.$message({
              message: '请限制考试说明字数在1100字内',
            })
            return
          }
          let queryParams = {};

          if(this.queryCondition.length==1 && this.from.queryEnable){
            this.$message({
              message: '查分条件请至少选择两种！',
            })
            return
          }
          let atr = ['name'];
          if(this.queryCondition.includes('准考证')){
            atr.push('admission_ticket_code')
          }
          if(this.queryCondition.includes('身份证')){
            atr.push('identification')
          }
          queryParams = {
            queryCondition:atr,
            showTotalScore:this.showList.includes("总分"),
            showTotalRankInProvince:this.showList.includes("总排名"),
            showTotalRankInStudio:this.showList.includes("机构内排名"),
            showScore:this.showList.includes("各科成绩"),
            showRankInStudio:this.showList.includes("科目机构排名"),
            showRankInProvince:this.showList.includes("科目总排名"),
            showPaper:this.showList.includes("试卷"),

          }



		 

          let data = {
            ...this.from,
            addressList: this.address,
            subjectList: this.subject,
			queryParams:JSON.stringify(queryParams),
            price: (this.from.price * 100).toFixed(0),
          }
          this.$axios
            .post(this.API.examinfo.create, data)
            .then((res) => {
              if (res.code == 200) {
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
    del(){
      if(!this.admin_username){
        this.$message({
          message: '请输入管理员账号！',
          type: 'warning',
        })
        return false
      }
      if(!this.admin_password){
        this.$message({
          message: '请输入管理员密码！',
          type: 'warning',
        })
        return false
      }
      if(this.is_type == 1){
        this.$axios.post("/examinfo/deleteAddress?id="+this.xx_id+"&username="+this.admin_username+"&password="+this.admin_password).then((res)=>{
          if(res.code == 200){
            this.dialogFormVisible = false;
            this.address.splice(this.xx_index, 1)
            this.$message({
              message: '删除成功！',
              type: 'success',
            })
          }
        })
      }else if(this.is_type == 2){
        this.$axios.post("/examinfo/deleteSubject?id="+this.xx_id+"&username="+this.admin_username+"&password="+this.admin_password).then((res)=>{
          if(res.code == 200){
            this.dialogFormVisible = false;
            this.subject.splice(this.xx_index, 1)
            this.$message({
              message: '删除成功！',
              type: 'success',
            })
          }
        })
      }

    },
    delAddress(index,id) {
      if(id){
        this.msg="是否确认删除该考试地址，请慎重！"
        this.admin_password = "";
        this.admin_username = "";
        this.dialogFormVisible = true;
        this.xx_id = id;
        this.is_type = 1;
      }else {
        this.address.splice(index, 1)
      }
    },
    addSubject() {
      this.subject.push({})
    },
    delSubject(index,id) {
      if(id){
        this.msg="是否确认删除该考试科目，请慎重！"
        this.admin_password = "";
        this.admin_username = "";
        this.dialogFormVisible = true;
        this.xx_id = id;
        this.is_type = 2;
      }else {
        this.subject.splice(index, 1)
      }
    },
    edit() {
      this.$refs.examForm.validate((valid) => {
        if (valid) {
          if(this.from.enrollEndTime < this.from.enrollStartTime){
            this.$message({
              message: '报名结束时间应大于开始时间',
            })
            return
          }
          if(this.from.examEndTime < this.from.examStartTime){
            this.$message({
              message: '考试结束时间应大于开始时间',
            })
            return
          }
          if(this.from.examStartTime.split(" ")[0] < this.from.enrollEndTime.split(" ")[0]){
            this.$message({
              message: '考试时间应大于报名时间',
            })
            return
          }

          if(this.address.length<0){
            this.$message({
              message: '请添加考试地址',
            })
            return
          }

          if(this.subject.length<0){
            this.$message({
              message: '请添加考试科目',
            })
            return
          }

          let errCount = 0
          this.subject.map((item,index)=>{
            if(item.subjectEndtime < item.subjectStarttime){
              errCount += 1
            }
          })
          if(errCount>0){
            this.$message({
              message: '考试科目结束时间应大于开始时间',
            })
            return
          }
          if(this.from.remark.length > 1100){
            this.$message({
              message: '请限制考试说明字数在1100字内',
            })
            return
          }
          // if(this.from.queryEnable ){
          //   if(!this.from.queryStartTime || !this.from.queryEndTime){
          //     this.$message({
          //       message: '请先选择查询开始时间与查询结束时间！',
          //     })
          //     return
          //   }
          //   console.log(this.from.queryStartTime,this.from.queryEndTime);
          //   if(this.from.queryStartTime.split(" ")[0] < this.from.queryEndTime.split(" ")[0]){
          //     this.$message({
          //       message: '查询结束时间应大于开始时间',
          //     })
          //     return
          //   }
          // }
          if(this.queryCondition.length==1  && this.form.queryEnable){
			  this.$message({
			    message: '查分条件请至少选择两种！',
			  })
			  return
		  }
		  let atr = ['name'];
		  if(this.queryCondition.includes('准考证')){
			atr.push('admission_ticket_code')
		  }
		  if(this.queryCondition.includes('身份证')){
		  	atr.push('identification')
		  }
		  let queryParams = {
			  queryCondition:atr,
			  showTotalScore:this.showList.includes("总分"),
			  showTotalRankInProvince:this.showList.includes("总排名"),
			  showTotalRankInStudio:this.showList.includes("机构内排名"),
			  showScore:this.showList.includes("各科成绩"),
			  showRankInStudio:this.showList.includes("科目机构排名"),
			  showRankInProvince:this.showList.includes("科目总排名"),
			  showPaper:this.showList.includes("试卷"),
			  
		  }
          this.$axios
            .post(this.API.examinfo.update, {
              ...this.from,
              addressList: this.address,
              subjectList: this.subject,
			  queryParams:JSON.stringify(queryParams),
              price: (this.from.price * 100).toFixed(0),
            })
            .then((res) => {
              if (res.code==200) {
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

.Tinymce_box {
  display: flex;
}
.editor-content {
  margin-left: 30px;
  flex-grow: 1;
  border: 2px dashed #f1f1f1;
  padding:0 20px;
}
h3 {
  color: #808080;
}
</style>
<style lang="scss" scoped>
@import './add.scss';
</style>
