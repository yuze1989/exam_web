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
          <div v-loading="jinDuLoad">
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
          </div>
          <h3>试卷分组数据</h3>
          <div :class="class3">
            <div
                v-loading="queryLoad"
                class="card"
                v-for="level in xxList"
                :key="level.name"
            >
              <div>
                <span class="primary">{{ level.name }}类</span>

                <span v-if="level.name=='仲裁组'">{{ level.count || 0 }}</span>
                <span v-if="level.name!='仲裁组'">{{ level.count || 0 }} / {{ level.all || 0 }}</span>
              </div>
              <el-progress
                  v-if="level.name!='仲裁组'"
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
              <p class="word-wrap" style="height: 114px; overflow: auto">
                {{description}}
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
        <div style="height: 34px;background: #fff;margin-bottom: 6px;border-radius: 4px;position: relative">
          <span style="float: left;margin-left: 16px;font-size: 1.1em;font-weight: 700">阅卷视图</span>
          <el-switch
              style="float: left;margin-left: 16px;margin-top: 2px"
              v-model="value1"
              active-text="竖版"
              inactive-text="横版">
          </el-switch>

          <el-checkbox v-model="isZc" v-if="rule==0 || rule==3" @change="zcChange" style="position: absolute;right: 20px;top: 6px;">仲裁组</el-checkbox>
        </div>
        <div
            v-loading="listLoad"
            v-if="value1"
            class="right-top"
            ref="imgViewerContainer"
            @mouseenter="imgViewerEnter"
            @mouseleave="imgViewerLeave"
        >
          <div class="bg"></div>
          <span
              v-if="
              paperList[currentPosition] && paperList[currentPosition].grade
            "
              class="image-header"
          >
            <span
            >{{ paperList[currentPosition].grade }}
              <span v-if="paperList[currentPosition].grade">类</span>
            </span>
            <span
            >{{ paperList[currentPosition].score >= 0 ? paperList[currentPosition].score : "" }}<span v-if="paperList[currentPosition].score && paperList[currentPosition].score>=0">分</span>
            </span>
            <span v-if="paperList[currentPosition].originalGrade">| {{ paperList[currentPosition].originalGrade?paperList[currentPosition].originalGrade : "" }}</span>
          </span>
          <el-badge value="仲裁" class="zcz" style="position: absolute;top: 0;right: 21%;z-index: 999;" v-if="paperList[currentPosition] && paperList[currentPosition].isArbitrate==1"></el-badge>
          <div class="previous-image box_img" @click="clickImg(-2)"  style="top: 100px!important;">
            <el-image
                :class="hideClass()"
                :style="imgStyle"
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
                paperList[currentPosition - 2].grade
              "
                class="mark-level-container"
            >
              <span
              >{{ paperList[currentPosition - 2].grade
                }}<span v-if="paperList[currentPosition - 2].grade"
                >类</span
                ></span
              >
              <span>{{ paperList[currentPosition - 2].score >= 0 ? paperList[currentPosition - 2].score:""}}<span v-if="paperList[currentPosition  - 2].score && paperList[currentPosition - 2].score>=0">分</span></span>
              <span v-if="paperList[currentPosition - 2].originalGrade">| {{ paperList[currentPosition - 2].originalGrade?paperList[currentPosition - 2].originalGrade : "" }}</span>
            </span>
            <el-badge value="仲裁" class="zcz" style="position: absolute;top: 0;right: 0%;z-index: 999;" v-if="paperList[currentPosition - 2] && paperList[currentPosition-2].isArbitrate==1"></el-badge>
          </div>
          <div class="previous-image box_img" @click="clickImg(-1)" style="bottom: 0px !important;">
            <el-image
                style="position: absolute;bottom: 0"
                :style="imgStyle"
                :class="hideClass()"
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
                paperList[currentPosition  - 1].grade
              "
                class="mark-level-container"
            >
              <span
              >{{ paperList[currentPosition  - 1].grade
                }}<span v-if="paperList[currentPosition  - 1].grade"
                >类</span
                ></span
              >
              <span
              >{{ paperList[currentPosition -1].score >= 0 ? paperList[currentPosition -1].score : "" }}<span v-if="paperList[currentPosition  - 1].score && paperList[currentPosition  - 1].score>=0">分</span></span
              >
              <span v-if="paperList[currentPosition - 1].originalGrade">| {{ paperList[currentPosition - 1].originalGrade?paperList[currentPosition - 1].originalGrade : "" }}</span>
            </span>
            <el-badge value="仲裁" class="zcz" style="position: absolute;top: 0;right: 0%;z-index: 999;" v-if="paperList[currentPosition - 1] && paperList[currentPosition-1].isArbitrate==1"></el-badge>
          </div>
          <vue-img-viewer
              ref="imgViewer"
              :container="'imgViewerContainer'"
              :paper-list = 'paperList'
              :image-urls="imgList1"
              :image-urls1="imgList1"
              :visible="visible"
              :initial-scale="1"
              @positionUpdated="imgSwitchEnd"
              @roteImg="roteImg"
              @currentUpdated="currentEnd"
              :start-position="startPosition"
              :allLength="allLength"
              :thisCurrent="thisCurrent"
          >

          </vue-img-viewer>

          <div class="next-image box_img" @click="clickImg(1)"  style="top: 100px;">
            <el-image
                :class="hideClass()"
                :style="imgStyle"
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
                paperList[currentPosition + 1].grade
              "
                class="mark-level-container"
            >
              <span
              >{{ paperList[currentPosition + 1].grade }}
                <span v-if="paperList[currentPosition + 1].grade">类</span>
              </span>
              <span
              >{{ paperList[currentPosition + 1].score >= 0 ? paperList[currentPosition + 1].score : "" }}<span v-if="paperList[currentPosition + 1].score && paperList[currentPosition + 1].score>=0">分</span>
              </span>
              <span v-if="paperList[currentPosition + 1].originalGrade">| {{ paperList[currentPosition + 1].originalGrade?paperList[currentPosition + 1].originalGrade : "" }}</span>
            </span>
            <el-badge value="仲裁" class="zcz" style="position: absolute;top: 0;right: 0%;z-index: 999;" v-if="paperList[currentPosition + 1] && paperList[currentPosition+1].isArbitrate==1"></el-badge>
          </div>
          <div class="next-image box_img" @click="clickImg(2)"  style="position: absolute;bottom: 0">
            <el-image
                style="position: absolute;bottom: 0"
                fit="cover"
                :style="imgStyle"
                :class="hideClass()"
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
                paperList[currentPosition + 2].grade
              "
                class="mark-level-container"
            >
              <span
              >{{ paperList[currentPosition + 2].grade }}
                <span v-if="paperList[currentPosition + 2].grade">类</span>
              </span>
              <span
              >{{ paperList[currentPosition + 2].score >= 0 ? paperList[currentPosition + 2].score : "" }}<span v-if="paperList[currentPosition + 2].score && paperList[currentPosition + 2].score>=0">分</span>
              </span>
              <span v-if="paperList[currentPosition + 2].originalGrade">| {{ paperList[currentPosition + 2].originalGrade?paperList[currentPosition + 2].originalGrade : "" }}</span>
            </span>
            <el-badge value="仲裁" class="zcz" style="position: absolute;top: 0;right: 0%;z-index: 999;" v-if="paperList[currentPosition + 2] && paperList[currentPosition+2].isArbitrate==1"></el-badge>
          </div>
        </div>
        <div
            v-if="!value1"
            v-loading="listLoad"
            class="right-top right-top2"
            ref="imgViewerContainer"
            @mouseenter="imgViewerEnter"
            @mouseleave="imgViewerLeave"
        >
          <div class="bg"></div>
          <span
              v-if="
              paperList[currentPosition] && paperList[currentPosition].grade
            "
              class="image-header"
          >
            <span
            >{{ paperList[currentPosition].grade }}
              <span v-if="paperList[currentPosition].grade">类</span>
            </span>
            <span
            >{{ paperList[currentPosition].score >= 0 ? paperList[currentPosition].score : "" }}<span v-if="paperList[currentPosition].score && paperList[currentPosition].score>=0">分</span>
            </span>
            <span v-if="paperList[currentPosition].originalGrade">| {{ paperList[currentPosition].originalGrade?paperList[currentPosition].originalGrade : "" }}</span>
          </span>
          <el-badge value="仲裁" class="zcz" style="position: absolute;top: 0;right: 30%;z-index: 999;" v-if="paperList[currentPosition] && paperList[currentPosition].isArbitrate==1"></el-badge>
          <vue-img-viewer
              ref="imgViewer"
              :container="'imgViewerContainer'"
              :paper-list = 'paperList'
              :image-urls="imgList1"
              :image-urls1="imgList1"
              :visible="visible"
              :initial-scale="1"
              @positionUpdated="imgSwitchEnd"
              @roteImg="roteImg"
              @currentUpdated="currentEnd"
              :start-position="startPosition"
              :allLength="allLength"
              :thisCurrent="thisCurrent"
          >
          </vue-img-viewer>
          <div class="previous-image box_img" @click="clickImg(1)"  style="top: 100px!important;">
            <el-image
                :style="imgStyle"
                :preview-src-list="imgList"
                fit="cover"
                :class="hideClass()"
                :src="
                imgList[currentPosition +1] ? imgList[currentPosition +1] : ''
              "
            >
              <div slot="error" class="image-slot">
                <img :src="require('@/assets/no_img2.png')" alt="" style="width:100%">
              </div>
            </el-image>
            <span
                v-if="
                paperList[currentPosition +1] &&
                paperList[currentPosition +1].grade
              "
                class="mark-level-container"
            >
              <span
              >{{ paperList[currentPosition +1].grade
                }}<span v-if="paperList[currentPosition +1].grade"
                >类</span
                ></span
              >
              <span
              >{{ paperList[currentPosition + 1].score >= 0 ? paperList[currentPosition + 1].score : "" }}<span v-if="paperList[currentPosition +1].score && paperList[currentPosition +1].score>=0">分</span></span
              >
              <span v-if="paperList[currentPosition + 1].originalGrade">| {{ paperList[currentPosition + 1].originalGrade?paperList[currentPosition + 1].originalGrade : "" }}</span>
            </span>
            <el-badge value="仲裁" class="zcz" style="position: absolute;top: 0;right: 0%;z-index: 999;" v-if="paperList[currentPosition + 1] && paperList[currentPosition+1].isArbitrate==1"></el-badge>
          </div>
          <div class="previous-image box_img" @click="clickImg(2)" style="top: calc(25% + 100px) !important;">
            <el-image
                :style="imgStyle"
                style="position: absolute;top: 0"
                fit="cover"
                :class="hideClass()"
                :src="
                imgList[currentPosition  +2] ? imgList[currentPosition  +2] : ''
              "
            >
              <div slot="error" class="image-slot">
                <img :src="require('@/assets/no_img2.png')" alt="" style="width:100%">
              </div>
            </el-image>
            <span
                v-if="
                paperList[currentPosition  +2] &&
                paperList[currentPosition  +2].grade
              "
                class="mark-level-container"
            >
              <span
              >{{ paperList[currentPosition  +2].grade
                }}<span v-if="paperList[currentPosition  +2].grade"
                >类</span
                ></span
              >
              <span
              >{{ paperList[currentPosition + 2].score >= 0 ? paperList[currentPosition + 2].score : "" }}<span v-if="paperList[currentPosition  +2].score && paperList[currentPosition  +2].score>=0">分</span
                ></span
              >
              <span v-if="paperList[currentPosition + 2].originalGrade">| {{ paperList[currentPosition + 2].originalGrade?paperList[currentPosition + 2].originalGrade : "" }}</span>
            </span>
            <el-badge value="仲裁" class="zcz" style="position: absolute;top: 0;right: 0%;z-index: 999;" v-if="paperList[currentPosition + 2] && paperList[currentPosition+2].isArbitrate==1"></el-badge>
          </div>
          <div class="next-image box_img" @click="clickImg(3)"  style="top: calc(50% + 100px);">
            <el-image
                :style="imgStyle"
                fit="cover"
                :class="hideClass()"
                :src="
                imgList[currentPosition  +3] ? imgList[currentPosition +3] : ''
              "
            >
              <div slot="error" class="image-slot">
                <img :src="require('@/assets/no_img2.png')" alt="" style="width:100%">
              </div>
            </el-image>
            <span
                v-if="
                paperList[currentPosition +3] &&
                paperList[currentPosition +3].grade
              "
                class="mark-level-container"
            >
              <span
              >{{ paperList[currentPosition +3].grade }}
                <span v-if="paperList[currentPosition +3].grade">类</span>
              </span>
              <span
              >{{ paperList[currentPosition + 3].score >= 0 ? paperList[currentPosition + 3].score : "" }}<span v-if="paperList[currentPosition +3].score && paperList[currentPosition +3].score>=0">分</span>
              </span>
              <span v-if="paperList[currentPosition + 3].originalGrade">| {{ paperList[currentPosition + 3].originalGrade?paperList[currentPosition + 3].originalGrade : "" }}</span>
            </span>
            <el-badge value="仲裁" class="zcz" style="position: absolute;top: 0;right: 0%;z-index: 999;" v-if="paperList[currentPosition + 3] && paperList[currentPosition+3].isArbitrate==1"></el-badge>
          </div>
          <div class="next-image box_img" @click="clickImg(4)"  style="position: absolute;top: calc(75% + 100px)">
            <el-image
                style="position: absolute;top: 0"
                fit="cover"
                :style="imgStyle"
                :class="hideClass()"
                :src="
                imgList[currentPosition +4] ? imgList[currentPosition +4] : ''
              "
            >
              <div slot="error" class="image-slot">
                <img :src="require('@/assets/no_img2.png')" alt="" style="width:100%">
              </div>
            </el-image>
            <span
                v-if="
                paperList[currentPosition +4] &&
                paperList[currentPosition +4].grade
              "
                class="mark-level-container"
            >
              <span
              >{{ paperList[currentPosition +4].grade }}
                <span v-if="paperList[currentPosition +4].grade">类</span>
              </span>
              <span
              >{{ paperList[currentPosition + 4].score >= 0 ? paperList[currentPosition + 4].score : "" }}<span v-if="paperList[currentPosition +4] && paperList[currentPosition +4].score>=0">分</span>
              </span>
              <span v-if="paperList[currentPosition + 4].originalGrade">| {{ paperList[currentPosition + 4].originalGrade?paperList[currentPosition + 4].originalGrade : "" }}</span>
            </span>
            <el-badge value="仲裁" class="zcz" style="position: absolute;top: 0;right: 0%;z-index: 999;" v-if="paperList[currentPosition + 4] && paperList[currentPosition+4].isArbitrate==1"></el-badge>
          </div>
        </div>

        <div class="right-bottom" v-loading="listLoad">
          <div class="right-btns">
            <el-button
                :disabled="rule==0"
                v-for="(level, index) in levelList"
                :key="level.name"
                @click="switchCurrentLevel(index)"
            >{{ level.name }}
            </el-button>
          </div>
          <el-button class="mark-btn" @click="showMarkDialog" :disabled="rule==0">评分</el-button>
        </div>
      </div>
      <el-dialog
          class="marking-dialog"
          :visible.sync="markDlgVisible"
          title="评分"
      >
        <div class="item">
          <el-select v-model="level" placeholder="请选择评级" @change="changeL">
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
              :min="minNum"
              :max="maxNum"
              :minlength="1"
              :maxlength="100"
              placeholder="请输入当前考卷分数"
              type="number"
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
      maxNum:100,
      minNum:0,
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
      rule:localStorage.getItem("role"),
      paperList: [],
      mList:[],
      imgList: [],
      imgList1: [],
      levelList: [],
      xxListNum:0,
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
      maxScore: 100,
      paperStopDialogVisible: false,
      targetUrl:'', // 放大的图片
      clickTimer:null,
      rotate:false,
      Score:0,
      NoScore:0,
      NoGrade:0,
      Grade:0,
      description:"",
      xxList:"",
      hideSite:"",
      selectL:"",
      isOne:true,
      jinDuLoad:false,
      queryLoad:false,
      listLoad:false,
      allLength:0,
      rPage:1,
      lPage:1,
      maxPage:0,
      isAll:false,
      thisCurrent:0,
      rote:0,
      lastP:"",
      isZc:false,
      class3:"cards-statistics",
      isNew:true,
    };
  },
  computed:{
    imgStyle() {
      return {
        transform: `rotate(${this.rote}deg)`,
      }
    },
  },
  created() {
    this.account = sessionStorage.getItem("user")
        ? JSON.parse(sessionStorage.getItem("user")).account
        : "";
    this.init();//初始化
  },
  methods: {
    zcChange(){
      this.init()
    },
    init(){
      this.queryPaperList(); //获取评级
      this.renderMarkingRules(); //获取规则
      this.geInit();//初始化进度
    },
    geInit(){
      this.jinDuLoad = true;
      let url1 = '/exampaper/scoringProgress'
      this.$axios.post(url1,{
        "course": this.$route.query.course,
        "examId": this.$route.query.examId,
        "size": 20,
      }).then((res)=>{
        this.jinDuLoad = false;
        this.Score=res.result.Score;
        this.NoScore=res.result.NoScore;
        this.NoGrade=res.result.NoGrade;
        this.Grade=res.result.Grade;

        if(this.isZc){
          //只看仲裁
          this.$axios.post("/exampaper/arbitrateCount",{
            "course": this.$route.query.course,
            "examId": this.$route.query.examId,
            "size": 20,})
              .then(res1=>{
                //总数
                this.allLength = res1.result.NoGrade/1 + res1.result.Grade/1;
                //最大页
                this.maxPage = Math.ceil(this.allLength/10)

                let wz = 0;

                //存在未评级
                if(res1.result.NoGrade > 0){
                  // 当前数
                  this.thisCurrent =res1.result.Grade/1 +1;

                  //当前页
                  this.rPage = Math.ceil(this.thisCurrent/10);

                  //当前位置
                  wz = this.Grade%10;
                }else{
                  this.thisCurrent = 1;
                  this.rPage = 1;
                  wz = 0;
                }

                this.listLoad = true;
                let url = '/exampaper/queryExamPaperSort';
                let grade = "all";
                if(this.isZc){
                  grade = "仲裁组";
                }

                let data = {
                  "course": this.$route.query.course,
                  "examCode": this.$route.query.examNo,
                  "examId":this.$route.query.examId,
                  "grade": grade,
                  paperScore:"",
                  size:10,
                  current:this.rPage,
                  "examPaperId": "",
                  "provinceCode": "",
                  "schoolId": "",
                  "score": "",
                  "teacherId": ""
                }

                this.$axios.post(url,data).then(res=>{
                  let list = res.result.list;
                  let imgList = [];
                  let imgList1 = [];
                  list.forEach((item,index)=>{
                    imgList.push(item.img)
                    imgList1.push(item.imgas)
                  })
                  this.paperList = list;
                  this.mList = list;
                  this.imgList = imgList;
                  this.imgList1 = imgList1;



                  //定位图片
                  this.currentPosition = wz/1;
                  //定位初始
                  this.startPosition = wz/1;

                  if(wz >=6){
                    this.rPage = this.rPage+1;
                    this.getList(1)
                  }
                  if(wz <= 4){
                    this.rPage = this.rPage-1;
                    this.getList(-1)
                  }

                  this.listLoad = false;
                })

              })
              .catch(err=>{
                console.log(err)
              })


        }else{
          //总数
          this.allLength = res.result.NoGrade/1 + res.result.Grade/1;
          //最大页
          this.maxPage = Math.ceil(this.allLength/10)

          let wz = 0;

          //存在未评级
          if(this.NoGrade > 0){
            // 当前数
            this.thisCurrent =this.Grade/1 +1;

            //当前页
            this.rPage = Math.ceil(this.thisCurrent/10);

            //当前位置
            wz = this.Grade%10;
          }else{
            this.thisCurrent = 1;
            this.rPage = 1;
            wz = 0;
          }

          this.listLoad = true;
          let url = '/exampaper/queryExamPaperSort';
          let grade = "all";
          if(this.isZc){
            grade = "仲裁组";
          }

          let data = {
            "course": this.$route.query.course,
            "examCode": this.$route.query.examNo,
            "examId":this.$route.query.examId,
            "grade": grade,
            paperScore:"",
            size:10,
            current:this.rPage,
            "examPaperId": "",
            "provinceCode": "",
            "schoolId": "",
            "score": "",
            "teacherId": ""
          }

          this.$axios.post(url,data).then(res=>{
            let list = res.result.list;
            let imgList = [];
            let imgList1 = [];
            list.forEach((item,index)=>{
              imgList.push(item.img)
              imgList1.push(item.imgas)
            })
            this.paperList = list;
            this.mList = list;
            this.imgList = imgList;
            this.imgList1 = imgList1;



            //定位图片
            this.currentPosition = wz/1;
            //定位初始
            this.startPosition = wz/1;

            if(wz >=6){
              this.rPage = this.rPage+1;
              this.getList(1)
            }
            if(wz <= 4){
              this.rPage = this.rPage-1;
              this.getList(-1)
            }

            this.listLoad = false;
          })
        }
      })
    },
    hideClass(){
      let hideSite = this.hideSite;
      if(hideSite == 0){
        return 'image hidebox hide0'
      }else if(hideSite == 1){
        return 'image hidebox hide1'
      }else if(hideSite == 2){
        return 'image hidebox hide2'
      }else if(hideSite == 3){
        return 'image hidebox hide3'
      }else if(hideSite == 4){
        return 'image hidebox hide4'
      }else if(hideSite == 5){
        return 'image hidebox hide5'
      }else if(hideSite == 6){
        return 'image hidebox hide6'
      }else if(hideSite == 7){
        return 'image hidebox hide7'
      }
    },
    changeL(value){
      this.descriptionLevelList.forEach((item)=>{
        if(item.grade == value){
          this.minNum = item.scoreStart;
          this.maxNum = item.scoreEnd
          this.markError = "只能输入"+this.minNum+"-" + this.maxNum + "的分数";
        }
      })
    },
    getJinDu(){
      this.jinDuLoad = true;
      let url1 = '/exampaper/scoringProgress'
      this.$axios.post(url1,{
        "course": this.$route.query.course,
        "examId": this.$route.query.examId,
        "size": 20,
      }).then((res)=>{
        this.jinDuLoad = false;
            this.Score=res.result.Score;
            this.NoScore=res.result.NoScore;
            this.NoGrade=res.result.NoGrade;
            this.Grade=res.result.Grade;
        //总数
        this.allLength = res.result.NoGrade/1 + res.result.Grade/1;
        //最大页
        this.maxPage = Math.ceil(this.allLength/10)
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
    getList(type){

      if(this.rPage <= 0){
        return false;
      }
      if(this.rPage > this.maxPage){
        return false;
      }
      if(type == 1 && (this.listLoad && this.markDlgVisible)){
        return false
      }
      if(this.lPage == this.rPage && this.rPage != 1){
        return false;
      }
      this.listLoad = true;
      this.lPage = this.rPage;

      let grade = "all";
      if(this.isZc){
        grade = "仲裁组"
      }

      let url = '/exampaper/queryExamPaperSort'
      let data = {
        "course": this.$route.query.course,
        "examCode": this.$route.query.examNo,
        "examId":this.$route.query.examId,
        size:10,
        "grade": grade,
        paperScore:"",
        current:this.rPage,
        "examPaperId": "",
        "provinceCode": "",
        "schoolId": "",
        "score": "",
        "teacherId": ""
      }

      this.$axios.post(url,data).then((res) => {
        let bList = res.result.list;

        let bimgList = [];
        let bimgList1 = [];
        bList.forEach((item,index)=>{
          bimgList.push(item.img)
          bimgList1.push(item.imgas)
        })
        if(type == 1){
          this.maxPage = Math.ceil(res.result.total/10)
          this.paperList = [...this.paperList,...bList];
          this.mList = [...this.mList,...bList];
          this.imgList = [...this.imgList,...bimgList];
          this.imgList1 = [...this.imgList1,...bimgList1];
        }else{
          this.currentPosition += 10;
          this.startPosition += 10;
          this.paperList = [...bList,...this.paperList];
          this.mList = [...bList,...this.mList];
          this.imgList = [...bimgList,...this.imgList];
          this.imgList1 = [...bimgList1,...this.imgList1];
        }
        this.listLoad = false;
        this.markDlgVisible = false;

      });



    },
    getImgUrlIP() {
      getImgUrlIP().then((res) => {

      });
    },
    handleVerifyScore(value) {
      let isNumber = /^\d*$/.test(value); // 验证是否是纯数字
      // 过滤非数字
      this.score = value.replace(/\D/g, "");
      if (!isNumber || value < this.minNum || value > this.maxNum) {
        this.markError = "只能输入"+this.minNum+"-" + this.maxNum + "的分数";
      }
      this.score =
          (value >= 0 && value <= this.maxScore && value.match(/^\d*/g)[0]) ||
          null;
    },
    queryPaperList() {
      this.queryLoad = true;
      let url1 = '/exampaper/queryGrade'
      this.$axios.post(url1,{
        "course": this.$route.query.course,
        "examCode": this.$route.query.examNo,
        "examId": this.$route.query.examId,
        "size": 100,
      }).then((res)=>{
        this.queryLoad = false;
        let resultList = res.result.gradeNameCount;
        this.unmarkedCount = res.result.countNum;
        this.markedCount = res.result.notGradeCount;
        // this.markedCountTotal = res.result.total;
        if (resultList) {
          let list = [
            {
              name: "全部",
              count: res.result.countNum,
              active: true,
              percentage:"",
            },
            {
              name: "未评级",
              count: res.result.notGradeCount,
              active: false,
              percentage:"",
            },
            {
              name: "仲裁组",
              count:  res.result.arbitrationGradeCount,
              active: false,
              percentage:"",
            },
          ];

          let xxList = [{
            name: "仲裁组",
            count:  res.result.arbitrationGradeCount,
            active: false,
            all:this.unmarkedCount || 0,
            percentage:"",
          },];
          let rule = localStorage.getItem("role");
          for (let i = 0; i < resultList.length; i++) {
            let progress;
            let all;

            all = (this.unmarkedCount || 0)*((this.descriptionLevelList[i].percentage/100 ) || 0)
            all = Math.ceil(all)
            progress = Math.round(
                ((resultList[i].count || 0) / (all/1 || 0) * 100)
            );

            if(resultList[i].grade){
              list.push({
                name: resultList[i].grade,
                count: resultList[i].count,
                // dealCount: resultList[i].dealCount,
                // totalDealCount: resultList[i].totalDealCount,
                // total: resultList[i].total,
                percentage: progress,
                active: false,

              });
              xxList.push({
                name: resultList[i].grade,
                count: resultList[i].count,
                percentage:progress,
                all:all
              })
            }


          }
          if(xxList.length > 9){
              this.class3 = "cards-statistics1"
          }
          this.xxList = xxList;
          this.levelStatisticsList = list;
          this.xxListNum = res.result.countNum;
        }


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
                this.paperList[this.currentPosition].grade = grade;
              }
              if (score) {
                this.paperList[this.currentPosition].score = score;
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
        "examId": this.$route.query.examId,
      }
      this.$axios.post('/exampaper/scoringRules',data).then((res) => {
        if (res && res.result) {
          const resultList = res.result.list || [];
          const levelList = [];
          this.gradeList = [];
          let examplesList = [];
          let maxScore = 0;
          let tempGradeList = [];

          resultList.forEach((item,i)=>{
            if(item.grade){
              tempGradeList.push({
                key: i,
                name: item.grade,
                percentage:item.percentage,
              })
            }
          })
          resultList.map((item) => {
            if (
                item.course == this.$route.query.course &&
                item.province == this.$route.query.province
            ) {
              maxScore = item.score;
            }
          });
          examplesList = resultList;
          this.maxScore = 100;
          examplesList.forEach((item) => {
            levelList.push({
              name: item.grade,
              active: false,
            });
          });
          this.levelList = tempGradeList;
          this.gradeList = levelList;
          this.descriptionLevelList = examplesList;
          this.descriptionLevelList.map((item) => {
            item.active = false;
          });

          this.descriptionLevelList[0].active = true;
          this.levelDescription.demoUrl =this.descriptionLevelList[0].imgUrl
          // this.levelDescription.description = this.descriptionLevelList[0].imgUrlDesc;
          this.currentRuleLevel = this.descriptionLevelList[0].grade;
          this.description = this.descriptionLevelList[0].imgUrlDesc;
          this.hideSite = this.descriptionLevelList[0].hideSite;
          sessionStorage.setItem("hideSite",this.hideSite);




        }
      });
    },
    showLevelDescription(index) {
      this.descriptionLevelList.forEach((level) => {
        level.active = false;
      });
      this.descriptionLevelList[index].active = true;
      this.currentRuleLevel = this.descriptionLevelList[index].grade;
      // this.description = this.descriptionLevelList[index].takePic;
      this.description = this.descriptionLevelList[index].imgUrlDesc;
      this.hideSite = this.descriptionLevelList[index].hideSite;
      sessionStorage.setItem("hideSite",this.hideSite);
      const currentDes = this.descriptionLevelList.find((item) => {
        return item.grade === this.descriptionLevelList[index].grade;
      });
      if (currentDes) {
        this.levelDescription.demoUrl =
            //currentDes.imgUrl + ossThumbnailSuffix(190, 200);
            currentDes.imgUrl;

      }

    },
    unsetAllLevel() {
      this.gradeList.forEach((levelInfo) => {
        levelInfo.active = false;
      });
    },
    // 点击A,B,C,D级
    switchCurrentLevel(index) {
      if(this.listLoad || this.markDlgVisible){.0

        return false;
      }

      if(!this.isNew && this.thisCurrent!=this.allLength){
        return false;
      }
      this.isNew = false;
      this.currentLevel = this.gradeList[index].name;
      this.lastP = this.paperList[this.currentPosition].id;

      // localStorage.setItem("paperId", this.paperList[this.currentPosition].id);
      // this.updatePaper({
      //   paperId: this.paperList[this.currentPosition].id,
      //   grade: this.currentLevel,
      // });
      let data = {
        "course": this.$route.query.course,
        "examCode": this.$route.query.examNo,
        "examPaperId": this.paperList[this.currentPosition].id,
        grade:this.currentLevel,
        examId:this.$route.query.examId,
      }


      this.listLoad = true;
      this.$axios.post("/exampaper/updateGrade",data).then((res) => {
        if(res.code == 200){
          this.$message.success(`试卷评级更新成功！`);
          if(this.isZc){
            this.init()
          }else{
            this.paperList[this.currentPosition].score = res.result.score;
            this.paperList[this.currentPosition].grade = res.result.grade;
            this.paperList[this.currentPosition].isArbitrate = res.result.isArbitrate;
            this.paperList[this.currentPosition].originalGrade = res.result.originalGrade;
            if (this.currentPosition < this.paperList.length - 1) {
              if(this.thisCurrent >= this.allLength){
                this.$message.warning(`已经是最后一张试卷了！`);
              }
              this.currentPosition += 1;
              this.startPosition += 1;
              this.thisCurrent += 1;
              this.imgSwitchEnd(this.currentPosition)
            }

            this.queryPaperList() //分组数据更新
            this.getJinDu()
          }



        }
        this.listLoad = false;
        this.markDlgVisible = false;
      }).catch(error=>{
        this.listLoad = false;
        this.markDlgVisible = false;

      })
    },
    currentEnd(currentIndex){
      this.thisCurrent=currentIndex;
    },
    roteImg(rote){
      this.rote = rote;
    },
    imgSwitchEnd(currentImgIndex) {
      this.currentPosition = currentImgIndex;
      this.startPosition = currentImgIndex;

      this.rPage = Math.ceil(this.thisCurrent/10)

      this.isNew = true;

      //还有4张开始预加载下一页
      if(this.currentPosition + 5 > this.imgList.length){
        if(this.rPage >= this.maxPage){
          return false
        }
        this.rPage += 1
        this.getList(1)
      }
      if(this.currentPosition - 5 < 0){
        if(this.rPage <= 1){
          return false
        }
        this.rPage -= 1
        this.getList(-1)
      }
      if (
          currentImgIndex === this.pageSize - 1 &&
          this.total > this.currentPage * this.pageSize
      ) {
        // 请求下一页
        // this.currentPage += 1
        // const routeParams = this.$route.query
        // const query = {}
        // if (routeParams.grade === '未评级') {
        //   query.status = 1
        // } else if(routeParams.grade === '全部') {

        // } else {
        //     query.grade = routeParams.grade
        // }
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
      if(!scroller){
        return false
      }
      const scroller = document.querySelector(".content-container");
      const scrollBarWidth = scroller.offsetWidth - scroller.clientWidth;
      const chromeBarWidth = 17;
      const initPaddingRight = 20;
      scroller.style.marginRight = chromeBarWidth + "px";
      scroller.style.overflowY = "hidden";
    },
    imgViewerLeave() {
      if(!scroller){
        return false
      }
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
      this.level = this.paperList[this.currentPosition].grade || "";
      this.markError = ""
      this.changeL(this.level)
      this.mark = this.paperList[this.currentPosition].score || "";
      if(this.mark < 0 ){
        this.mark = "";
      }
    },
    submitLevelAndMark() {
      let data = {
        "examPaperId": this.paperList[this.currentPosition].id,
        grade:this.level,
        score:this.mark,
        "examId": this.$route.query.examId,
        "course": this.$route.query.course,
      }
      if(this.mark > this.maxNum || this.mark < this.minNum){
        this.$message.error(`请填写合适的分数！`);
        return false;
      }
      this.$axios.post("/exampaper/updateGrade",data).then((res) => {
        if(res.code == 200){
          this.$axios.post("/exampaper/updateScore",data).then((res)=>{
            if(res.code == 200){
              this.markDlgVisible = false;
              this.paperList[this.currentPosition].score = res.result.score;
              this.paperList[this.currentPosition].grade = res.result.grade;
              this.paperList[this.currentPosition].isArbitrate = res.result.isArbitrate;
              this.paperList[this.currentPosition].originalGrade = res.result.originalGrade;
              if (this.currentPosition < this.paperList.length - 1) {
                if(this.thisCurrent >= this.allLength){
                  this.$message.warning(`已经是最后一张试卷了！`);
                }
                this.currentPosition += 1;
                this.startPosition += 1;
                this.thisCurrent += 1;
                this.imgSwitchEnd(this.currentPosition)
              }
              this.queryPaperList() //分组数据更新
              this.getJinDu()
              this.$message.success(`试卷评分更新成功！`);
            }
          })
        }
      });


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
.hidebox:before{
  content: "";
  position: absolute;
  height: 11.2%;
  width: 29.2%;
  background: #fff;
  z-index: 7;
  background-image: url(../../assets/zgt.png);
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: center;
}
.hidebox.hide0:before{
  top: 0;
  left: 0;
}
.hidebox.hide1:before{
  top: 0;
  right: 0;
}
.hidebox.hide2:before{
  left: 0;
  bottom: 0;
}
.hidebox.hide3:before{
  right: 0;
  bottom: 0;
}
.hidebox.hide4:before{
  top: 0;
  left: 50%;
  margin-left: -14.6%;
}
.hidebox.hide5:before{
  left: 0;
  top: 50%;
  margin-top: -5.6%;

}
.hidebox.hide6:before{
  left: 0;
  right: 50%;
  margin-top: -5.6%;
}
.hidebox.hide7:before{
  bottom: 0;
  left: 50%;
  margin-left: -14.6%;
}
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
    max-width: 100% !important;
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
.zcz .el-badge__content{
  border-radius: 0;
}
#marking-area .cards-statistics1 .el-progress-bar{
  margin-top: 2px;
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
            flex: 0.48;
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
        .cards-statistics1 {
          display: grid;
          grid-template-rows: 1fr 1fr 1fr 1fr;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          overflow: auto;
          height: 262px;

          .card {
            font-size: 14px;
            color: #0e0e0e;
            background-color: #f3f3f3;
            -webkit-border-radius: 10px;
            -moz-border-radius: 10px;
            border-radius: 10px;
            padding: 6px;
            margin-bottom: 7px;
            margin-right: 7px;
            .el-progress-bar{
              margin-top: 2px;
            }
            .primary {
              color: #204bd6;
            }
          }
        }
      }

      .left-bottom {
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
        height: 750px;
        -webkit-border-radius: 10px 10px 0 0;
        -moz-border-radius: 10px 10px 0 0;
        border-radius: 10px 10px 0 0;
        overflow: hidden;
        background: rgba(0,0,0,.3);
        margin-bottom: 10px;
        .image-header {
          position: absolute;
          width: 100px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          left: 0;
          top: 0;
          color: #05d5f5;
          font-size: 15px;

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
          width: 86px;
          height: 40px;
          z-index: 99;
          font-size: 13px;
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
    min-height: 115px;
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
