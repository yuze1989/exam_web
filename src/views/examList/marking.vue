<template>
  <div class="marking-area" id="marking-area">
    <div class="bottom">
      <div class="left">
        <div class="left-top">
          <h3>
            <el-button class="back" type="text" @click="back">
              <span class="el-icon-back"></span>
              返回
            </el-button>
            您的打分进度
          </h3>
          <div class="cards">
            <div class="card no">
              <div class="title">待打分</div>
              <div class="val">
                <span class="number">{{ NoScore }}</span>
              </div>
            </div>
            <div class="card done">
              <div class="title">已打分</div>
              <div class="val">
                <span class="number">{{ Score }}</span>
              </div>
            </div>
          </div>
          <div class="cards">
            <div class="card no">
              <div class="title">待评级</div>
              <div class="val">
                <span class="number">{{ NoGrade }}</span>
              </div>
            </div>
            <div class="card done">
              <div class="title">已评级</div>
              <div class="val">
                <span class="number">{{ Grade }}</span>
              </div>
            </div>
          </div>
          <h3>试卷分组数据
            <el-switch
                style="display: inline-block;float: right;margin-top: 5px"
              v-model="value1"
              active-text="竖版"
              inactive-text="横版">
          </el-switch></h3>
          <div class="cards-statistics">
            <div
                class="card"
                v-for="level in levelStatisticsList"
                :key="level.name"
            >
              <div>
                <span class="primary">{{ level.name }}类</span>
                <span
                >{{ level.totalDealCount || 0 }} /
                  {{ level.total || 0 }}</span
                >
              </div>
              <el-progress
                  text-inside
                  :stroke-width="20"
                  :percentage="level.percentage"
              ></el-progress>
            </div>
          </div>
        </div>
        <div class="left-bottom">
          <div class="left-bottom-left">
            <h3>评分细则</h3>
            <div class="btns">
              <el-button
                  v-for="(level, index) in descriptionLevelList"
                  :key="index"
                  @click="showLevelDescription(index)"
                  :class="{ active: level.active }"
              >
                {{ level.grade }}类
              </el-button>
            </div>
            <div class="level-description" v-if="currentRuleLevel">
              <h3>{{ currentRuleLevel }}类卷</h3>
              <p class="word-wrap" style="height: 160px; overflow: auto">
                {{ levelDescription.description }}
              </p>
            </div>
          </div>
          <div class="left-bottom-right">
            <h3>范例图</h3>
            <div class="examples-img">
              <el-image
                  style="width: 190px; height: 200px"
                  fit="cover"
                  :src="levelDescription.demoUrl"
                  @click="expandImg(levelDescription.demoUrl)"
              >
                <div slot="placeholder" class="image-slot">请选择评级</div>
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
            <h4>点击放大查看示例图</h4>
          </div>
        </div>
      </div>
      <div class="right">
        <div
            v-if="value1"
            class="right-top"
            ref="imgViewerContainer"
            @mouseenter="imgViewerEnter"
            @mouseleave="imgViewerLeave"
        >
          <div class="bg"></div>
          <span
              v-if="
              paperList[currentPosition] && paperList[currentPosition].level
            "
              class="image-header"
          >
            <span
            >{{ paperList[currentPosition].level }}
              <span v-if="paperList[currentPosition].level">类</span>
            </span>
            <span
            >{{ paperList[currentPosition].mark
              }}<span v-if="paperList[currentPosition].mark">分</span>
            </span>
          </span>
          <div class="previous-image box_img" @click="clickImg(-2)"  style="top: 100px!important;">
            <el-image
                :preview-src-list="imgList"
                fit="cover"
                :src="
                imgList[currentPosition - 2] ? imgList[currentPosition - 2] : ''
              "
            >
              <div slot="error" class="image-slot">
                <img src="@/assets/no_img.png" alt="" style="width:100%">
              </div>
            </el-image>
            <span
                v-if="
                paperList[currentPosition - 2] &&
                paperList[currentPosition - 2].level
              "
                class="mark-level-container"
            >
              <span
              >{{ paperList[currentPosition - 2].level
                }}<span v-if="paperList[currentPosition - 2].level"
                >类</span
                ></span
              >
              <span
              >{{ paperList[currentPosition - 2].mark
                }}<span v-if="paperList[currentPosition - 2].level"
                >分</span
                ></span
              >
            </span>
          </div>
          <div class="previous-image box_img" @click="clickImg(-1)" style="bottom: 0px !important;">
            <el-image
                style="position: absolute;bottom: 0"
                fit="cover"
                :src="
                imgList[currentPosition  - 1] ? imgList[currentPosition  - 1] : ''
              "
            >
              <div slot="error" class="image-slot">
                <img src="@/assets/no_img.png" alt="" style="width:100%">
              </div>
            </el-image>
            <span
                v-if="
                paperList[currentPosition  - 1] &&
                paperList[currentPosition  - 1].level
              "
                class="mark-level-container"
            >
              <span
              >{{ paperList[currentPosition  - 1].level
                }}<span v-if="paperList[currentPosition  - 1].level"
                >类</span
                ></span
              >
              <span
              >{{ paperList[currentPosition  - 1].mark
                }}<span v-if="paperList[currentPosition  - 1].level"
                >分</span
                ></span
              >
            </span>
          </div>
          <vue-img-viewer
              ref="imgViewer"

              :container="'imgViewerContainer'"
              :image-urls="imgList"
              :visible="visible"
              :initial-scale="1"
              @positionUpdated="imgSwitchEnd"
              :start-position="startPosition"
          >
          </vue-img-viewer>

          <div class="next-image box_img" @click="clickImg(1)"  style="top: 100px;">
            <el-image
                fit="cover"
                :src="
                imgList[currentPosition  + 1] ? imgList[currentPosition + 1] : ''
              "
            >
              <div slot="error" class="image-slot">
                <img src="@/assets/no_img.png" alt="" style="width:100%">
              </div>
            </el-image>
            <span
                v-if="
                paperList[currentPosition + 1] &&
                paperList[currentPosition + 1].level
              "
                class="mark-level-container"
            >
              <span
              >{{ paperList[currentPosition + 1].level }}
                <span v-if="paperList[currentPosition + 1].level">类</span>
              </span>
              <span
              >{{ paperList[currentPosition + 1].mark }}
                <span v-if="paperList[currentPosition + 1].mark">分</span>
              </span>
            </span>
          </div>
          <div class="next-image box_img" @click="clickImg(2)"  style="position: absolute;bottom: 0">
            <el-image
                style="position: absolute;bottom: 0"
                fit="cover"
                :src="
                imgList[currentPosition + 2] ? imgList[currentPosition + 2] : ''
              "
            >
              <div slot="error" class="image-slot">
                <img src="@/assets/no_img.png" alt="" style="width:100%">
              </div>
            </el-image>
            <span
                v-if="
                paperList[currentPosition + 2] &&
                paperList[currentPosition + 2].level
              "
                class="mark-level-container"
            >
              <span
              >{{ paperList[currentPosition + 2].level }}
                <span v-if="paperList[currentPosition + 2].level">类</span>
              </span>
              <span
              >{{ paperList[currentPosition + 2].mark }}
                <span v-if=" [currentPosition + 2].mark">分</span>
              </span>
            </span>
          </div>
        </div>
        <div
            v-if="!value1"
            class="right-top right-top2"
            ref="imgViewerContainer"
            @mouseenter="imgViewerEnter"
            @mouseleave="imgViewerLeave"
        >
          <div class="bg"></div>
          <span
              v-if="
              paperList[currentPosition] && paperList[currentPosition].level
            "
              class="image-header"
          >
            <span
            >{{ paperList[currentPosition].level }}
              <span v-if="paperList[currentPosition].level">类</span>
            </span>
            <span
            >{{ paperList[currentPosition].mark
              }}<span v-if="paperList[currentPosition].mark">分</span>
            </span>
          </span>
          <vue-img-viewer
              ref="imgViewer"

              :container="'imgViewerContainer'"
              :image-urls="imgList"
              :visible="visible"
              :initial-scale="1"
              @positionUpdated="imgSwitchEnd"
              :start-position="startPosition"
          >
          </vue-img-viewer>
          <div class="previous-image box_img" @click="clickImg(1)"  style="top: 100px!important;">
            <el-image
                :preview-src-list="imgList"
                fit="cover"
                :src="
                imgList[currentPosition +1] ? imgList[currentPosition +1] : ''
              "
            >
              <div slot="error" class="image-slot">
                <img src="@/assets/no_img.png" alt="" style="width:100%">
              </div>
            </el-image>
            <span
                v-if="
                paperList[currentPosition +1] &&
                paperList[currentPosition +1].level
              "
                class="mark-level-container"
            >
              <span
              >{{ paperList[currentPosition +1].level
                }}<span v-if="paperList[currentPosition +1].level"
                >类</span
                ></span
              >
              <span
              >{{ paperList[currentPosition +1].mark
                }}<span v-if="paperList[currentPosition +1].level"
                >分</span
                ></span
              >
            </span>
          </div>
          <div class="previous-image box_img" @click="clickImg(2)" style="top: calc(25% + 100px) !important;">
            <el-image
                style="position: absolute;bottom: 0"
                fit="cover"
                :src="
                imgList[currentPosition  +2] ? imgList[currentPosition  +2] : ''
              "
            >
              <div slot="error" class="image-slot">
                <img src="@/assets/no_img.png" alt="" style="width:100%">
              </div>
            </el-image>
            <span
                v-if="
                paperList[currentPosition  +2] &&
                paperList[currentPosition  +2].level
              "
                class="mark-level-container"
            >
              <span
              >{{ paperList[currentPosition  +2].level
                }}<span v-if="paperList[currentPosition  +2].level"
                >类</span
                ></span
              >
              <span
              >{{ paperList[currentPosition  +2].mark
                }}<span v-if="paperList[currentPosition  +2].level"
                >分</span
                ></span
              >
            </span>
          </div>
          <div class="next-image box_img" @click="clickImg(3)"  style="top: calc(50% + 100px);">
            <el-image
                fit="cover"
                :src="
                imgList[currentPosition  +3] ? imgList[currentPosition +3] : ''
              "
            >
              <div slot="error" class="image-slot">
                <img src="@/assets/no_img.png" alt="" style="width:100%">
              </div>
            </el-image>
            <span
                v-if="
                paperList[currentPosition +3] &&
                paperList[currentPosition +3].level
              "
                class="mark-level-container"
            >
              <span
              >{{ paperList[currentPosition +3].level }}
                <span v-if="paperList[currentPosition +3].level">类</span>
              </span>
              <span
              >{{ paperList[currentPosition +3].mark }}
                <span v-if="paperList[currentPosition +3].mark">分</span>
              </span>
            </span>
          </div>
          <div class="next-image box_img" @click="clickImg(4)"  style="position: absolute;top: calc(75% + 100px)">
            <el-image
                style="position: absolute;bottom: 0"
                fit="cover"
                :src="
                imgList[currentPosition +4] ? imgList[currentPosition +4] : ''
              "
            >
              <div slot="error" class="image-slot">
                <img src="@/assets/no_img.png" alt="" style="width:100%">
              </div>
            </el-image>
            <span
                v-if="
                paperList[currentPosition +4] &&
                paperList[currentPosition +4].level
              "
                class="mark-level-container"
            >
              <span
              >{{ paperList[currentPosition +4].level }}
                <span v-if="paperList[currentPosition +4].level">类</span>
              </span>
              <span
              >{{ paperList[currentPosition +4].mark }}
                <span v-if=" [currentPosition +4].mark">分</span>
              </span>
            </span>
          </div>
        </div>

        <div class="right-bottom">
          <div class="right-btns">
            <el-button
                v-for="(level, index) in levelList"
                :key="level.name"
                @click="switchCurrentLevel(index)"
            >{{ level.name }}
            </el-button>
          </div>
          <el-button class="mark-btn" @click="showMarkDialog">评分</el-button>
        </div>
      </div>
      <el-dialog
          class="marking-dialog"
          :visible.sync="markDlgVisible"
          title="评分"
      >
        <div class="item">
          <el-select v-model="level" placeholder="请选择评级">
            <el-option
                v-for="(item, index) in levelList"
                :label="item.name"
                :value="item.name"
                :key="index"
            ></el-option>
          </el-select>
        </div>
        <div class="item">
          <el-input
              v-model="mark"
              @input="handleVerifyScore"
              :min="0"
              :max="100"
              :minlength="1"
              :maxlength="100"
              placeholder="请输入当前考卷分数"
          ></el-input>
          <p v-if="markError" class="text-red">{{ markError }}</p>
        </div>
        <template slot="footer">
          <el-button class="primary-submit" @click="submitLevelAndMark"
          >提交</el-button
          >
        </template>
      </el-dialog>
    </div>
    <el-dialog
        title="提示"
        :visible.sync="paperStopDialogVisible"
        width="560px"
        center
        append-to-body
        :close-on-click-modal="false"
    >
      <h3 class="center">阅卷已结束！</h3>
      <p class="center">页面操作不保存</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="paperStopDialogVisible = false"
        >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 点击放大图片 -->
    <el-dialog
        title="示例图片"
        :visible.sync="showExamplesPreviewer"
        width="45%"
        :before-close="handleClose"
    >
      <div class="img-wrap">
        <el-image :src="targetUrl" fit="cover" :class="[rotate?'go':'aa']" @click="startR"></el-image>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import vueImgViewer from "./img-viewer";
import { basicRequest } from "../../utils/request";
// import { queryMarkingRules } from "../../api/markingPaper";
// import { ossThumbnailSuffix } from "../../utils/ossUtils";
import {
  getImgUrlIP,
  getPaperGrade,
  getPaperAgg,
  getReviewStatus,
  getRulesdetail,
} from "@/api/paper";
export default {
  name: "markingArea1",
  components: {
    vueImgViewer,
  },
  data: () => {
    return {
      value1:true,
      account: "",
      markError: "",
      level: "",
      mark: "",
      unmarkedCount: 0,
      markedCount: 0,
      markedCountTotal: 0,
      markDlgVisible: false,
      total: 0,
      paperList: [],
      mList:[],
      imgList: [],
      levelList: [],
      levelStatisticsList: [],
      imageHeaderVisible: true,
      descriptionLevelList: [],
      showExamplesPreviewer: false,
      visible: true,
      currentPosition: 0,
      startPosition: 0, // 放大图片的起始索引
      rightLevelList: [],
      currentRuleLevel: "",
      levelDescription: {
        demoUrl: "",
        description: "",
      },
      currentLevel: "B",
      pageSize: 5000,
      currentPage: 1,
      maxScore: 0,
      paperStopDialogVisible: false,
      targetUrl:'', // 放大的图片
      clickTimer:null,
      rotate:false,
      Score:0,
      NoScore:0,
      NoGrade:0,
      Grade:0,
    };
  },
  created() {
    this.account = sessionStorage.getItem("user")
        ? JSON.parse(sessionStorage.getItem("user")).account
        : "";
    // this.getImgUrlIP()
    // const routeParams = this.$route.query
    // const query = {}
    // if (routeParams.level == '未评级') {
    //   query.status = 1
    // } else if(routeParams.level == '全部') {
    // } else {
    //   query.grade = routeParams.level
    // }
    this.getJinDu();//获取进度
    this.getFenZu();//获取分组
    this.queryPaperList(); //获取评级
    this.queryProgress(); //获取分类
    this.renderMarkingRules(); //获取规则
    this.getList();//获取试卷
  },
  methods: {
    getJinDu(){
      let url1 = '/exampaper/scoringProgress'
      this.$axios.post(url1,{
        "course": this.$route.query.course,
        "current": 1,
        "examCode": this.$route.query.examNo,
        "examPaperId": this.$route.query.examId,
        "grade": "",
        "provinceCode": "",
        "schoolId": "",
        "size": 10,
      }).then((res)=>{
            this.Score=res.Score;
            this.NoScore=res.NoScore;
            this.NoGrade=res.NoGrade;
            this.Grade=res.Grade;
      })
    },
    getFenZu(){
      let url1 = '/exampaper/queryPaperGroupingList'
      this.$axios.post(url1,{
        "course": this.$route.query.course,
        "examCode": this.$route.query.examNo,
        "examPaperId": this.$route.query.examId,
      }).then((res)=>{
        this.Score=res.Score;
        this.NoScore=res.NoScore;
        this.NoGrade=res.NoGrade;
        this.Grade=res.Grade;
      })
    },
    startR(){
      this.rotate = !this.rotate
    },
    // 图片点击
    clickImg(val){
      if(this.clickTimer){
        window.clearTimeout(this.clickTimer);
        this.clickTimer = null;
      }
      let that = this;
      this.clickTimer = window.setTimeout(function (){
        if(that.currentPosition+val < 0 || that.currentPosition+val >=that.paperList.length){
          return false;
        }
        that.currentPosition +=val
        that.startPosition += val;
      },300)
    },
    getList(){
      let list = [{"id":73447,"name":"11000006","url":"http://topexam.oss-cn-hangzhou.aliyuncs.com/1623918889201photo.jpg","permission":"11000006","level":"A","show":false,"mark":10},{"id":73480,"name":"11000010","url":"http://topexam.oss-cn-hangzhou.aliyuncs.com/20210617163630","permission":"11000010","level":"A","show":false,"mark":11},{"id":73481,"name":"11000004","url":"http://topexam.oss-cn-hangzhou.aliyuncs.com/1623919106963photo.jpg","permission":"11000004","level":"A","show":false,"mark":1},{"id":73485,"name":"11000003","url":"http://topexam.oss-cn-hangzhou.aliyuncs.com/20210617164251","permission":"11000003","level":"A","show":false,"mark":33},{"id":73448,"name":"11000015","url":"http://topexam.oss-cn-hangzhou.aliyuncs.com/1615186236562photo.jpg","permission":"11000015","level":"B","show":false,"mark":87},{"id":73478,"name":"11000011","url":"http://topexam.oss-cn-hangzhou.aliyuncs.com/20210617163547","permission":"11000011","level":"B","show":false,"mark":90},{"id":73479,"name":"11000009","url":"http://topexam.oss-cn-hangzhou.aliyuncs.com/1623918957857photo.jpg","permission":"11000009","level":"B","show":false,"mark":90},{"id":73482,"name":"11000008","url":"http://topexam.oss-cn-hangzhou.aliyuncs.com/1623919155580photo.jpg","permission":"11000008","level":"B","show":false,"mark":44},{"id":73483,"name":"11000002","url":"http://topexam.oss-cn-hangzhou.aliyuncs.com/20210617164219","permission":"11000002","level":"B","show":false,"mark":1},{"id":73484,"name":"11000005","url":"http://topexam.oss-cn-hangzhou.aliyuncs.com/1623919348377photo.jpg","permission":"11000005","level":"B","show":false,"mark":99},{"id":73486,"name":"11000007","url":"http://topexam.oss-cn-hangzhou.aliyuncs.com/1623919433104photo.jpg","permission":"11000007","level":"B","show":false,"mark":44}]
      let imgList = ["http://topexam.oss-cn-hangzhou.aliyuncs.com/1623918889201photo.jpg","http://topexam.oss-cn-hangzhou.aliyuncs.com/20210617163630","http://topexam.oss-cn-hangzhou.aliyuncs.com/1623919106963photo.jpg","http://topexam.oss-cn-hangzhou.aliyuncs.com/20210617164251","http://topexam.oss-cn-hangzhou.aliyuncs.com/1615186236562photo.jpg","http://topexam.oss-cn-hangzhou.aliyuncs.com/20210617163547","http://topexam.oss-cn-hangzhou.aliyuncs.com/1623918957857photo.jpg","http://topexam.oss-cn-hangzhou.aliyuncs.com/1623919155580photo.jpg","http://topexam.oss-cn-hangzhou.aliyuncs.com/20210617164219","http://topexam.oss-cn-hangzhou.aliyuncs.com/1623919348377photo.jpg","http://topexam.oss-cn-hangzhou.aliyuncs.com/1623919433104photo.jpg"]


      this.paperList = list;
      this.mList = list;
      this.imgList = imgList;
    },
    getImgUrlIP() {
      getImgUrlIP().then((res) => {
        console.log(res);
      });
    },
    handleVerifyScore(value) {
      let isNumber = /^\d*$/.test(value); // 验证是否是纯数字
      // 过滤非数字
      this.mark = value.replace(/\D/g, "");
      if (!isNumber || value < 0 || value > 100) {
        this.markError = "只能输入0-" + this.maxScore + "的整数";
        setTimeout(() => {
          this.markError = "";
        }, 600);
      }
      this.mark =
          (value >= 0 && value <= this.maxScore && value.match(/^\d*/g)[0]) ||
          null;
    },
    queryProgress() {
      this.levelStatisticsList = [
        {
          active: false,
          count: 3,
          dealCount: 3,
          name: "A",
          percentage: 30,
          total: 10,
          totalDealCount: 3,
        },
        {
          active: false,
          count: 8,
          dealCount: 8,
          name: "B",
          percentage: 80,
          total: 10,
          totalDealCount: 8,
        }
      ];
      return false;
      getPaperAgg({
        province: this.$route.query.province,
        provinceCode: this.$route.query.provinceCode,
        course: this.$route.query.course,
        account: this.account,
      }).then((res) => {
        if (res.result) {
          this.unmarkedCount = res.result.count;
          this.markedCount = res.result.dealCount;
          this.markedCountTotal = res.result.total;
          const resultList = res.result.stats;
          if (resultList) {
            let list = [];
            for (let i = 0; i < resultList.length; i++) {
              const progress = Math.round(
                  ((resultList[i].totalDealCount || 0) /
                      (resultList[i].total || 0)) *
                  100
              );
              list.push({
                name: resultList[i].name,
                count: resultList[i].count,
                dealCount: resultList[i].dealCount,
                totalDealCount: resultList[i].totalDealCount,
                total: resultList[i].total,
                percentage: progress <= 100 ? progress : 100,
                active: false,
              });
            }
            this.levelList = list;
            this.levelStatisticsList = list;
          }
        }
      });
    },
    queryPaperList() {
      let url1 = '/exampaper/queryGrade'
      this.$axios.post(url1,{
        "course": this.$route.query.course,
        "current": 1,
        "examCode": this.$route.query.examNo,
        "examPaperId": "",
        "grade": "",
        "provinceCode": "",
        "schoolId": "",
        "size": 10,
      }).then((res)=>{


        let tempGradeList = [];
        let list = [
          {
            name: "全部",
            count: res.result.countNum,
            active: true,
          },
          {
            name: "未评级",
            count: res.result.notGradeCount,
            active: false,
          },
          {
            name: "仲裁组",
            count: "",
            active: false,
          },
        ];
        res.result.gradeNameCount.forEach((item,index)=>{

          if(item.grade != ""){
            list.push({
              name: item.grade+"类",
              count: item.count,
              active: false,
            })
            tempGradeList.push({
              key: index,
              name: item.grade,
            })
          }

        })
        this.levelList = list;
        this.gradeList = tempGradeList;

      })
    },
    updatePaper({ paperId, grade, score }) {
      if ((!grade && score) || !grade) {
        this.$message.warning("请选择评级");
        return;
      }
      return new Promise((resolve, reject) => {
        const data = {};
        let tipStr = "";
        data.paperId = paperId;
        if (grade) {
          data.grade = grade;
        }
        if (score) {
          data.score = score;
        } else {
          localStorage.setItem("paperId", paperId);
        }
        basicRequest({
          method: "post",
          url: "/paper/update",
          data: data,
        }).then(
            (data) => {
              resolve(data);
              // this.unsetAllLevel()
              if (grade) {
                this.paperList[this.currentPosition].level = grade;
              }
              if (score) {
                this.paperList[this.currentPosition].mark = score;
              }
              if (this.currentPosition < this.paperList.length - 1) {
                this.startPosition += 1;
                this.currentPosition += 1;
              } else {
                this.$message.warning("已经到最后一张试卷啦！");
              }
              // 更新统计数据
              this.queryProgress();
            },
            (error) => {
              reject(error);
              console.log(error);
            }
        );
      });
    },
    renderMarkingRules() {
      let data = {
        "course": this.$route.query.course,
        "examCode": this.$route.query.examNo,
      }
      this.descriptionLevelList = [{
        active: true,
        course: "素描",
        courseId: 1,
        grade: "A",
        id: 191,
        imgUrl: "https://topexam.oss-cn-hangzhou.aliyuncs.com/web/rules/20210308-142949-089/3f2c7a14-777e-4959-b960-db7da764fa7f",
        imgUrlDesc: "A :请添加评分描述",
        percentage: 50,
        provinceCode: "110000",
      },{
        active: false,
        course: "素描",
        courseId: 1,
        grade: "B",
        id: 191,
        imgUrl: "https://topexam.oss-cn-hangzhou.aliyuncs.com/web/rules/20210308-142949-089/3f2c7a14-777e-4959-b960-db7da764fa7f",
        imgUrlDesc: "A :请添加评分描述",
        percentage: 50,
        provinceCode: "110000",
      }];
      this.currentRuleLevel = this.descriptionLevelList[0].grade;
      this.levelDescription.demoUrl = this.descriptionLevelList[0].imgUrl
      this.levelDescription.description = this.descriptionLevelList[0].imgUrlDesc;
      return false;
      this.$axios.post('/exampaper/scoringRules',data).then((res) => {
        if (res && res.result) {
          const resultList = res.result.list || [];
          const levelList = [];
          this.levelList = [];
          let examplesList = [];
          let maxScore = 0;
          resultList.map((item) => {
            if (
                item.rule.course == this.$route.query.course &&
                item.rule.province == this.$route.query.province
            ) {
              examplesList = item.examples;
              maxScore = item.rule.score;
            }
          });
          this.maxScore = maxScore;
          examplesList.forEach((item) => {
            levelList.push({
              name: item.grade,
              active: false,
            });
          });
          this.levelList = levelList;
          this.descriptionLevelList = examplesList;
          this.descriptionLevelList.map((item) => {
            item.active = false;
          });
          this.descriptionLevelList[0].active = true;
          this.levelDescription.demoUrl =
              //this.descriptionLevelList[0].imgUrl + ossThumbnailSuffix(190, 200);
              this.descriptionLevelList[0].imgUrl
          this.levelDescription.description = this.descriptionLevelList[0].imgUrlDesc;
          this.currentRuleLevel = this.descriptionLevelList[0].grade;
        }
      });
    },
    showLevelDescription(index) {
      this.descriptionLevelList.forEach((level) => {
        level.active = false;
      });
      this.descriptionLevelList[index].active = true;
      this.currentRuleLevel = this.descriptionLevelList[index].grade;
      const currentDes = this.descriptionLevelList.find((item) => {
        return item.grade === this.descriptionLevelList[index].grade;
      });
      if (currentDes) {
        this.levelDescription.demoUrl =
            //currentDes.imgUrl + ossThumbnailSuffix(190, 200);
            currentDes.imgUrl;
        this.levelDescription.description = currentDes.imgUrlDesc;
      }
    },
    unsetAllLevel() {
      this.levelList.forEach((levelInfo) => {
        levelInfo.active = false;
      });
    },
    // 点击A,B,C,D级
    switchCurrentLevel(index) {
      this.currentLevel = this.levelList[index].name;
      localStorage.setItem("paperId", this.paperList[this.currentPosition].id);
      this.updatePaper({
        paperId: this.paperList[this.currentPosition].id,
        grade: this.currentLevel,
      });
    },
    imgSwitchEnd(currentImgIndex) {
      this.currentPosition = currentImgIndex;
      this.startPosition = currentImgIndex;
      if (
          currentImgIndex === this.pageSize - 1 &&
          this.total > this.currentPage * this.pageSize
      ) {
        // 请求下一页
        // this.currentPage += 1
        // const routeParams = this.$route.query
        // const query = {}
        // if (routeParams.level === '未评级') {
        //   query.status = 1
        // } else if(routeParams.level === '全部') {

        // } else {
        //     query.grade = routeParams.level
        // }
        this.queryProgress();
        // this.queryPaperList(query).then(() => {
        //   this.queryLevelList()
        //   this.queryProgress()
        //   this.imgPreload(3)
        // })
      } else {
        // this.imgPreload(3)
      }
    },
    imgViewerEnter() {
      const scroller = document.querySelector(".content-container");
      const scrollBarWidth = scroller.offsetWidth - scroller.clientWidth;
      const chromeBarWidth = 17;
      const initPaddingRight = 20;
      scroller.style.marginRight = chromeBarWidth + "px";
      scroller.style.overflowY = "hidden";
    },
    imgViewerLeave() {
      const scrollBarWidth =
          window.innerWidth - document.documentElement.offsetWidth;
      const scroller = document.querySelector(".content-container");
      const chromeBarWidth = 17;
      const initPaddingRight = 20;
      scroller.style.marginRight = 0;
      scroller.style.overflowY = "scroll";
    },
    showMarkDialog() {
      this.markDlgVisible = !this.markDlgVisible;
      this.level = this.paperList[this.currentPosition].level;
      this.mark = this.paperList[this.currentPosition].mark;
    },
    submitLevelAndMark() {
      this.updatePaper({
        paperId: this.paperList[this.currentPosition].id,
        grade: this.level,
        score: this.mark,
      }).then(() => {
        this.markDlgVisible = false;
        if (this.currentPosition < this.paperList.length - 1) {
          this.currentPosition += 1;
          this.startPosition += 1;
        }
      });
      this.queryProgress();
    },
    back() {
      this.$router.back();
    },
    imgPreload(preloadCount) {
      const images = [];
      this.imgList.forEach((imgSrc, index) => {
        if (
            this.currentPosition + preloadCount >
            index >
            this.currentPosition
        ) {
        }
        images[index] = new Image();
        images[index].src = imgSrc;
      });
    },
    // 点击放大图片
    expandImg(url) {
      this.showExamplesPreviewer = true;
      this.targetUrl = url;
    },
    //双击放大图片
    expandImgDb(url){
      if(this.clickTimer){
        window.clearTimeout(this.clickTimer);
        this.clickTimer = null;
      }
      if(url){
        this.showExamplesPreviewer = true;
        this.targetUrl = url;
      }

    }
  },
};
</script>

<style lang="scss">

.aa{
  transition: all 2s;
}
.go{
  transform: rotate(90deg);
  transition: all 2s;
}
.box_img{
  height: 40%;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 2px;
  overflow: hidden;
  .el-image{
    width: calc(100% - 4px) !important;
  }
}
.box_img.active{
  border-color: #c03639;
}
.preview-container{
  width: 58%;
  left: 21% !important;
  z-index: 7 !important;
}
.preview-container .image-wrapper .image-box{
  left: 0 !important;
  width: 100% !important;
  border: 1px solid #fff !important;
}
.marking-area .bottom .right .right-top .previous-image{
  width: 20% !important;
  .el-image{
    width: 100% !important;
  }
}
.marking-area .bottom .right .right-top .image-header{
  left: 21% !important;
}
.progress {
  height: 20px;
  background: #cbcedc;
  border-radius: 10px;
  margin-top: 10px;

  .progress-bar {
    background-color: #204bd6;
  }
}

#marking-area {
  .el-progress-bar {
    margin-top: 10px;
  }

  .el-progress-bar__inner {
    background-color: #204bd6;
  }

  .el-progress-bar__outer {
    background-color: #cbcedc;
  }

  .el-image {
    .image-slot {
      display: flex;
      justify-content: center;
      text-align: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background-color: #fff;
      color: #cccccc;
    }
  }

  .left-bottom-right {
    .el-image {
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
      .image-slot {
        background-color: #f3f3f3;
      }
      [class*=" el-icon-"],
      [class^="el-icon-"] {
        font-size: 30px;
      }
    }
  }

  .marking-dialog {
    .el-dialog {
      width: 650px;
      height: 430px;
      box-sizing: border-box;
      -webkit-border-radius: 20px;
      -moz-border-radius: 20px;
      border-radius: 20px;
    }

    .el-dialog__header {
      font-weight: bold;
      font-size: 30px;
      height: 94px;
      line-height: 94px;
      border-bottom: 1px solid #d8d8d8;
    }

    .el-dialog__body {
      .item {
        margin-bottom: 30px;
      }

      .el-select {
        width: 100%;
      }

      padding: 30px 95px;
    }

    .el-dialog__footer {
      padding: 0 95px 50px;
    }
  }
}
.box_img .el-image:after{
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 8;
  background: rgba(0,0,0,.3);
  top: 0;
  left: 0;
}
.right-top2 .preview-container{
  left: 0!important;
  width: 70%!important;
}
.marking-area .bottom .right .right-top2 .image-header{
  left: 0!important;
}
.marking-area .bottom .right .right-top2 .box_img{
  width: 30% !important;
  height: 25% !important;
  left: 70%!important;
}
</style>

<style scoped lang="scss">

.marking-area {
  .primary-submit {
    width: 100%;
    background-color: #204bd6;
    color: #fff;
  }

  .svg-icon {
    width: 30px;
    height: 40px;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    line-height: normal;
    display: inline-block;

    &.back {
      background: url("../../assets/back.svg") no-repeat center center;
      -webkit-background-size: 100%;
      background-size: 100%;
    }
  }

  & > div {
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;

    & > div {
      -webkit-border-radius: 10px;
      -moz-border-radius: 10px;
      border-radius: 10px;

      & > div {
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
      }
    }
  }

  .bottom {
    padding: 10px;
    background-color: #f3f3f3;
    display: flex;

    .left {
      width: 460px;
      margin-right: 15px;
      flex: 0.25;

      .left-top {
        background-color: #fff;
        margin-bottom: 10px;
        height: 570px;
        padding: 20px;
        box-sizing: border-box;
        h3 {
          .back {
            float: right;
            padding: 0;
          }

          &:first-child {
            margin-top: 0;
          }
        }

        .cards {
          display: flex;
          flex-direction: row;
          padding: 0 5px;

          .card {
            flex: 0.33;
            -webkit-border-radius: 10px;
            -moz-border-radius: 10px;
            border-radius: 10px;
            height: 60px;
            color: #fff;
            font-size: 16px;
            margin-right: 12px;
            padding: 8px 12px 0;
            box-sizing: content-box;
            margin-bottom: 10px;

            &:last-child {
              margin-right: 0;
            }

            .title {
              margin-bottom: 5px;
              font-size: 12px;
            }

            .val {
              font-size: 14px;
              font-weight: bold;
              position: relative;
              top: -15px;
              .number {
                font-size: 28px;
              }
            }

            &.no {
              background-color: #59bf99;
            }

            &.done {
              background-color: #557dff;
            }

            &.total {
              background-color: #de5887;
            }
          }
        }

        .cards-statistics {
          display: grid;
          grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
          grid-template-columns: 1fr 1fr 1fr;

          .card {
            font-size: 14px;
            color: #0e0e0e;
            background-color: #f3f3f3;
            -webkit-border-radius: 10px;
            -moz-border-radius: 10px;
            border-radius: 10px;
            padding: 10px;
            margin-bottom: 7px;
            margin-right: 7px;

            .primary {
              color: #204bd6;
            }
          }
        }
      }

      .left-bottom {
        height: 337px;
        background-color: #fff;
        padding: 20px;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;

        h3 {
          &:first-child {
            margin-top: 0;
          }
        }

        .left-bottom-left {
          flex: 0.5;
          margin-right: 10px;
          border-right: 1px solid #c9cbd4;

          .btns {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
            grid-template-rows: 1fr 1fr;

            button {
              padding: 3px 5px;
              margin: 0 10px 10px 0;

              &.active {
                background-color: #204bd6;
                color: #fff;
              }
            }
          }
        }

        .left-bottom-right {
          flex: 0.5;
          text-align: center;
          .examples-img {
            position: relative;
          }
          h3 {
            text-align: left;
          }
          h4 {
            margin: 10px;
          }
        }
      }
    }

    .right {
      flex: 0.75;
      .right-top {
        position: relative;
        height: 800px;
        -webkit-border-radius: 10px 10px 0 0;
        -moz-border-radius: 10px 10px 0 0;
        border-radius: 10px 10px 0 0;
        overflow: hidden;
        background: rgba(0,0,0,.3);
        margin-bottom: 10px;
        .image-header {
          position: absolute;
          width: 80px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          left: 0;
          top: 0;
          color: #05d5f5;

          background-color: rgba(0, 0, 0, 0.5);
          -webkit-border-radius: 10px 0 10px 0;
          -moz-border-radius: 10px 0 10px 0;
          border-radius: 10px 0 10px 0;
          z-index: 8;
        }

        .previous-image {
          position: absolute;
          left: 0;
          margin-top: -100px;
          width: 150px;
          .el-image {

            -webkit-border-radius: 10px;
            -moz-border-radius: 10px;
            border-radius: 10px;
          }
        }

        .next-image {
          position: absolute;
          right: 0;
          margin-top: -100px;
          width: 20%;

          .el-image {
            width: 100%;
            -webkit-border-radius: 10px;
            -moz-border-radius: 10px;
            border-radius: 10px;
          }
        }

        .mark-level-container {
          display: inline-block;
          position: absolute;
          width: 80px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          left: 50%;
          bottom: 0;
          margin-left: -40px;
          color: #fff;
 background-color: #ec2d56;
/* border-radius: 15px 0 10px 0;*/
    }
  }

  .right-bottom {
    background-color: #fff;
    padding: 10px;
    padding-right: 80px;
    box-sizing: border-box;
    width: 100%;
    height: 115px;
    display: flex;
    flex-direction: row;
    position: relative;
    -webkit-border-radius: 0 0 10px 10px;
    -moz-border-radius: 0 0 10px 10px;
    border-radius: 0 0 10px 10px;
    align-items: end;

    .right-btns {
      button {
        border: none;
        background: #f3f3f3;
        margin-left: 0;
        margin-right: 10px;
        margin-bottom: 10px;
        width: 50px;
        box-sizing: content-box;
        &.active {
          background-color: #204bd6;
          color: #fff;
        }
      }
      button:hover{
        background-color: #204bd6;
        color: #fff;
      }
    }

    .mark-btn {
      position: absolute;
      right: 10px;
      background-color: #204bd6;
      color: #fff;
    }
  }
}
}
.img-wrap{
text-align: center;
}
}

</style>
