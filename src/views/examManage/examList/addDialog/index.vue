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

      <el-form-item label="考试简介" prop="remark">
        <el-input
            v-if="visible"
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            v-model="from.remark">
        </el-input>
        <!-- <el-input
          maxlength="680"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 10 }"
          placeholder="请输入内容"
          v-model="from.remark"
        ></el-input> -->
      </el-form-item>
      <el-form-item label="上传图片" prop="remark" class="xxx">
        <div class="rulePic">
          <el-image :src="imgUrl" v-if="imgUrl" class="ruleImage"></el-image>
          <input id="fileup" type="file" v-show="false" @change="uploadchanged" ref="fileup" />
          <div class="ruleImageNo" @click="upToOss()">
            <p class="addIcon" v-show="!imgUrl">+</p>
            <p class="addDes" v-show="!imgUrl">上传Logo或海报</p>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="app报名">
        <el-switch
            style="margin-top: 4px"
            v-model="baoming"
            active-text="启用"
            inactive-text="不用">
        </el-switch>
        <div>
          <el-checkbox-group v-model="queryCondition2" v-if="baoming">
            <el-checkbox label="启用录制视频" ></el-checkbox>
            <el-checkbox label="启用邮寄纸质试卷" ></el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>
      
      <div v-if="baoming">
      <div>
        <el-button
          type="primary"
          style="margin-bottom: 10px;"
          @click="addMenu"
        >
          关联独立院校
        </el-button>
        <span style="padding: 10px; color: red;">举办独立院校考试时请选择在app里对应的院校名称，非独立院校考试时请勿选择</span>
      </div>

      <div v-for="(item, index) in menus" :key="index+'a'" :value="item">
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
              v-model="item.firstMenuId"
              style="width: 285px;"
              placeholder="请选择在app上显示院校或主办方归属"
              @change="menuChange(item,index)"
            >
              <el-option
                v-for="(ite, i) in menuList"
                :key="i"
                :value="ite.id"
                :label="ite.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select clearable
              v-model="item.secondMenuId"
              style="width: 285px;"
              placeholder="请选择在app上显示院校或主办方名称"
              @change="menuChildChange(item, index)"
            >
              <el-option
                v-for="(ite, i) in filterMenu(menuList, item.firstMenuId)"
                :key="i"
                :value="ite.id"
                :label="ite.name"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="submit">
            <el-button
              type="text"
              style="width: 50px;"
              @click="delMenu(index,item.id)"
            >
              移除
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      </div>
      
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

      <div v-for="(item, index) in address" :key="index+'b'" :value="item">
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

      <div v-for="(item, index) in subject" :key="index + 'c'" :value="item">
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
              style="width: 180px;margin-right:10px"
              format="HH:mm"
              value-format="HH:mm"
              placeholder="起始时间"
              v-model="item.subjectStarttime"
              @change="filterStartTime"
            ></el-time-picker>
            <el-time-picker
              style="width: 180px;"
              placeholder="结束时间"
              format="HH:mm"
              value-format="HH:mm"
              v-model="item.subjectEndtime"
              @change="filterEndTime"
            ></el-time-picker>
            <el-form-item prop="submit">
              <el-button
                  type="text"
                  style="width: 50px;"
                  @click="delSubject(index,item.id)"
              >
                移除
              </el-button>
            </el-form-item>
          </el-form-item>
          <div v-if="baoming">
            <div>
              <el-form-item>
                考前多久查看考题（分钟）
              </el-form-item>
              <el-form-item>
                <el-form-item >
                  <el-input-number 
                    controls-position="right"
                    v-model="item.seenQuestionBeforeMinute" 
                    :max="30" 
                    placeholder="不早于考前30分钟"
                    style="width: 210px"
                  ></el-input-number>
                </el-form-item>
              </el-form-item>
            </div>

            <el-form-item>
              <el-form-item>
                上传试卷开始和结束时间
              </el-form-item>
              <el-form-item>
                <el-input-number
                  controls-position="right"
                  v-model="item.uploadPaperStarttimeAfterMinute" 
                  placeholder="不早于考后30分钟" 
                  style="width: 180px" 
                  :max="upPaperTimeMax" 
                  :min="30"
                  @change="upPaperTime"
                ></el-input-number>
              </el-form-item>
              <el-form-item>
                至
              </el-form-item>
              <el-form-item>
                <el-input-number 
                  controls-position="right"
                  v-model="item.uploadPaperEndtimeAfterMinute" 
                  placeholder="不超当晚24点" 
                  style="width: 180px" 
                  :max="downPaperTimeMax" 
                  :min="downPaperTimeMin"
                  @change="downPaperTime"
                ></el-input-number>
              </el-form-item>
            </el-form-item>

            <div>
              <el-form-item>
                <el-checkbox v-model="item.isFaceDetect" style="margin-right: 45px">启用人脸识别</el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-input-number 
                  controls-position="right" 
                  v-model="item.faceDetectBeforeMinute" 
                  placeholder="不早于考前60分钟" 
                  style="width: 180px" 
                  :max="60" 
                  :min="0"
                ></el-input-number>
              </el-form-item>
              <el-form-item>
                至
              </el-form-item>
              <el-form-item>
                <el-input-number
                  controls-position="right" 
                  v-model="item.faceDetectAfterMinute" 
                  placeholder="不晚于考后30分钟" 
                  style="width: 180px" 
                  :max="30" 
                  :min="0"
                ></el-input-number>
              </el-form-item>
            </div>
            <div>
              <el-form-item>
                考试题目
              </el-form-item>
              <el-form-item>
                <el-input
                    type="textarea"
                    style="width: 450px"
                    :rows="4"
                    placeholder="请输入考试题目"
                    maxlength="30"
                    show-word-limit
                    v-model="item.questionContent">
                </el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item>
                考试要求
              </el-form-item>
              <el-form-item>
                <el-input
                    type="textarea"
                    style="width: 450px"
                    :rows="4"
                    placeholder="请输入考试要求"
                    maxlength="500"
                    show-word-limit
                    v-model="item.questionRule">
                </el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item>
                备注
              </el-form-item>
              <el-form-item>
                <el-input
                    type="textarea"
                    style="width: 280px"
                    :rows="4"
                    placeholder="请输入考试邀请信息"
                    maxlength="500"
                    show-word-limit
                    v-model="item.questionRemark">
                </el-input>
              </el-form-item>
              <el-form-item>
                上传考试图片
              </el-form-item>
              <el-form-item class="xxx">
                <div class="rulePic">
                  <el-image :src="item.questionUrl" v-if="item.questionUrl" class="ruleImage"></el-image>
                  <input  type="file" v-show="false" @change="uploadchanged2(item, index)" :class="'ref'+index" />
                  <div class="ruleImageNo" @click="upToOss2(item, index)">
                    <p class="addIcon" v-show="!item.questionUrl">+</p>
                    <p class="addDes" v-show="!item.questionUrl">只支持.jpg文件</p>
                  </div>
                </div>
              </el-form-item>
            </div>

            <div>
              <el-form-item>
                设置作品照片要求
              </el-form-item>
              <el-form-item>
                <el-input
                    type="textarea"
                    style="width: 280px"
                    :rows="4"
                    placeholder="用于App手机上传试卷，拍摄示例说明"
                    maxlength="500"
                    show-word-limit
                    v-model="item.takePic">
                </el-input>
              </el-form-item>
              <el-form-item>
                上传拍摄示例图片
              </el-form-item>
              <el-form-item class="xxx">
                <div class="rulePic">
                  <el-image :src="item.picUrl" v-if="item.picUrl" class="ruleImage"></el-image>
                  <input  type="file" v-show="false" @change="uploadchanged3(item, index)" :class="'refs'+index" />
                  <div class="ruleImageNo" @click="upToOss3(item, index)">
                    <p class="addIcon" v-show="!item.picUrl">+</p>
                    <p class="addDes" v-show="!item.picUrl">只支持.jpg文件</p>
                  </div>
                </div>
              </el-form-item>
            </div>

          </div>
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
      upPaperTimeMax: 0,
      downPaperTimeMax: 0,
      downPaperTimeMin: 0,
      menuChildList: [],
      startTime: null,
      endTime: null,
      baoming:false,
      admin_username:"",
      admin_password:"",
      msg:"",
      imgUrl:"",
      picUrl:"",
      provinceList: [],
      menuList: [],
      menus: [{}],
      menuParams: [],
      menuItem: null,
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
        uploadPaperEndtime: '00:00:00', //: 科目结束时间 ,
        subjectName: '', //: 科目名称 ,
        subjectStarttime: '00:00:00', //: 科目开始时间
        uploadPaperStarttime: '00:00:00', //: 科目开始时间
        seenQuestionBeforeMinute:0,
        isStop:true,
        questionContent:'',
        questionRule:"",
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
      queryCondition2:['启用录制视频','启用邮寄纸质试卷'],
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
    this.getMenuList()
  },
  mounted() {
  },
  methods: {
    filterMenu(arr = [], id) {
      const menu_arr = JSON.parse(JSON.stringify(arr));
      let arr_new = []
      menu_arr.forEach(item => {
        if(item.id === id) arr_new = item.childMenus
      })
      return arr_new
      //menuList.map(ite => { if(ite?.id === item.firstMenuId) return ite.childMenus })
    },
    menuChange(val, ind) {
      const item = JSON.parse(JSON.stringify(val));
      this.menuList.forEach(ite => {
        if(ite.id === item.firstMenuId) {
          this.menuChildList = ite.childMenus
          this.menuItem = ite
        }
      })
    },
    menuChildChange(val) {
      const item = JSON.parse(JSON.stringify(val));
      this.menuItem?.childMenus.forEach(ite => {
        if(ite.id === item.secondMenuId) {
          console.error('ite', ite, JSON.parse(JSON.stringify(this.menuParams)))
          let old_params = JSON.parse(JSON.stringify(this.menuParams))
          console.error('[]', old_params.concat([1,2]), old_params)

          this.menuParams = old_params.concat([{ firstMenuId: item.firstMenuId, secondMenuId: item.secondMenuId }]) 
          // [...old_params, { examId: '', id: item.firstMenuId, firstMenuId: item.firstMenuId, secondMenuId: item.secondMenuId }]
        }
      })
    },
    filterStartTime(val) {
      this.startTime = val
    },
    filterEndTime(val) {
      this.endTime = val
    },
    upPaperTime(val) {
      const miner = 86400000;
      const now_miner = val*60*1000;
      let time_arr = '';
      let unixNo = '';
      this.downPaperTimeMin = val;
      if(this.startTime) {
        time_arr = this.startTime.split(':');
        unixNo = (time_arr[0]*3600+time_arr[1]*60)*1000;
        this.upPaperTimeMax = (miner-unixNo)/60000
        if(unixNo+now_miner > miner) {
          this.$message({
            message: '错了哦，上传试卷开始时间不得晚于当晚24:00',
            type: 'warning'
          })
        }
      }else {
        this.$message({
          message: '错了哦，请先选择科目起始时间',
          type: 'warning'
        })
      }
    },
    downPaperTime(val) {
      const miner = 86400000;
      const now_miner = val*60*1000;
      let time_arr = '';
      let unixNo = '';
      if(this.endTime) {
        time_arr = this.endTime.split(':');
        unixNo = (time_arr[0]*3600+time_arr[1]*60)*1000;
        this.downPaperTimeMax = (miner-unixNo)/60000;
        if(unixNo+now_miner > miner) {
          this.$message({
            message: '错了哦，上传试卷结束时间不得晚于当晚24:00',
            type: 'warning'
          })
        }
      }else {
        this.$message({
          message: '错了哦，请先选择科目结束时间',
          type: 'warning'
        })
      }
    },
    uploadchanged() {
      console.log('1')
        let file = this.$refs.fileup.files[0]
        if(file !=undefined){
          var fromDate = new FormData();
          fromDate.append("file",file)
          this.$axios.post('/file/upload',fromDate).then(res=>{
            if(res){
              this.$refs.fileup.value = ""
              this.imgUrl = res.result;
            }
          }).catch(()=>{})
        }
    },
    uploadchanged2(item, index) {
      console.log('2')
        let xx = 'ref'+index;
      let file = document.querySelectorAll("." + xx)[0].files[0]
        if(file !=undefined){
          var fromDate = new FormData();
          fromDate.append("file",file)
          this.$axios.post('/file/upload',fromDate).then(res=>{
            if(res){
              item.questionUrl = res.result;
              this.$forceUpdate()
            }
          }).catch(()=>{})
        }
    },
    uploadchanged3(item, index) {
      console.log('3')
        let xx = 'refs'+index;
      let file = document.querySelectorAll("." + xx)[0].files[0]
        if(file !=undefined){
          var fromDate = new FormData();
          fromDate.append("file",file)
          this.$axios.post('/file/upload',fromDate).then(res=>{
            if(res){
              item.picUrl = res.result;
              this.$forceUpdate()
            }
          }).catch(()=>{})
        }
    },
    upToOss(item) {
      this.$refs.fileup.click()
    },
    upToOss2(item, index) {
      console.error('item:', JSON.parse(JSON.stringify(item)), item, index)
        let xx = 'ref'+index;
      document.querySelectorAll("." + xx)[0].click()
    },
    upToOss3(item, index) {
      console.error('item:', JSON.parse(JSON.stringify(item)), item, index)
        let xx = 'refs'+index;
      document.querySelectorAll("." + xx)[0].click()
    },
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
    getMenuList() {
      this.$axios
        .post(this.API.examinfo.menuList)
        .then((res) => {
          this.menuList = res.data
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
        this.imgUrl = "";//图片
        this.baoming = false;
        this.queryCondition2 = ['启用人脸识别','启用录制视频','启用邮寄纸质试卷'];
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
            this.menus = result.menus || []
            if(result.menus?.[0]) {
              this.menuChildList = this.menuList?.[0].childMenus
            }
            this.queryCondition2 = []
            if(result.queryParams){
              let queryParams = JSON.parse(result.queryParams);
              if(queryParams.queryCondition.includes("admission_ticket_code")){
                this.queryCondition.push("准考证")
              }
              if(queryParams.queryCondition.includes("identification")){
                this.queryCondition.push("身份证")
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
              this.imgUrl = result.url;//图片
              this.baoming = result.isAppEnroll;
              if(result.isNeedExpress){
                this.queryCondition2.push("启用邮寄纸质试卷")
              }
              if(result.isRecordVideo){
                this.queryCondition2.push("启用录制视频")
              }
              if(result.isFaceDetect){
                this.queryCondition2.push("启用人脸识别")
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
          this.subject.map(item => {
            if(JSON.stringify(item) === '{}') {
              errEmpty += 1
            }
          })
          if(errEmpty>0){
            this.$message({
              message: '科目信息不能为空',
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
          this.subject.map(item => {
            if(!item?.id) {
              console.error('this:', item)
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
            menus: this.menuParams,
            addressList: this.address,
            subjectList: this.subject,
			      queryParams:JSON.stringify(queryParams),
            price: (this.from.price * 100).toFixed(0),
            url:this.imgUrl,
            isAppEnroll:this.baoming,
            isFaceDetect:this.queryCondition2.includes("启用人脸识别"),
            isRecordVideo:this.queryCondition2.includes("启用录制视频"),
            isNeedExpress:this.queryCondition2.includes("启用邮寄纸质试卷"),
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
    addMenu() {
      this.menus.push({})
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
    delMenu(index,id) {
      console.error('index-id:', index, id)
      this.menus.splice(index, 1)
      this.menuParams.splice(index, 1)
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
          if(this.queryCondition.length==1  && this.from.queryEnable){
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
          console.log(this.from);
          this.$axios
            .post(this.API.examinfo.update, {
              ...this.from,
              menus: this.menuParams,
              addressList: this.address,
              subjectList: this.subject,
			        queryParams:JSON.stringify(queryParams),
              price: (this.from.price * 100).toFixed(0),
              url:this.imgUrl,
              isAppEnroll:this.baoming,
              isFaceDetect:this.queryCondition2.includes("启用人脸识别"),
              isRecordVideo:this.queryCondition2.includes("启用录制视频"),
              isNeedExpress:this.queryCondition2.includes("启用邮寄纸质试卷"),
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
.xxx .rulePic {
  border: 1px solid #d4d5de;
  border-radius: 10px;
  background: #f5f7fa;
  width: 190px;
  min-height: 190px;
  position: relative;
  cursor: pointer;
}
.xxx .rulePic .ruleImageNo .addIcon {
  font-size: 40px;
  margin-bottom: 0;
  margin-top: 60px;
  text-align: center;
}
.xxx .rulePic  .addDes {
  margin-top: 0;
  font-size: 20px;
  text-align: center;
  margin-top: 20px;
}
.xxx .rulePic .ruleImageNo {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 6;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  font-size: 50px;
  text-align: center;
  color: white;
  cursor: pointer;
}
</style>
<style lang="scss" scoped>
@import './add.scss';
</style>
