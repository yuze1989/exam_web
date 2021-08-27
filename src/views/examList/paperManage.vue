<template>
  <div>
    <div class="top-container clearfix">
      <el-row
        :gutter="24"
        style="background: #ffffff; margin: 20px 0; padding: 10px 0;font-size: 15px;border-bottom: 1px solid #f1efef;"
      >
        <el-col :span="21">
          <div class="common-mb">科目：{{ $route.query.course}}</div>
          <div class="common-mb label">
            <span class="title">评级：</span>
            <div class="tags">
              <el-tag
              v-for="(item, index) in levelList"
              :key="item.name"
              @click="switchLevel(item.name, index)"
              :effect="item.active ? 'dark' : 'light'"
              size="medium"
              class="common-mr pointer"
              :style="item.name == '仲裁组'?{background:'#f35f62',color:'#fff'}:''"
            >

              <font v-if="item.name == '仲裁组'">
                {{ item.name}} ({{ item.count || 0 }}) 份
              </font>
                <font v-else="">
                  {{ item.name }} ({{ item.count || 0 }}) 份
                </font>
            </el-tag>
            </div>

          </div>
          <div class="common-mb label">
            <span class="title"> 打分：</span>
           <div class="tags">
             <el-tag
              v-for="(item, index) in scoreList"
              :key="index"
              @click="handleScore(item.key, index)"
              :effect="item.active ? 'dark' : 'light'"
              size="medium"
              class="common-mr pointer"
            >
              {{ item.name }}
            </el-tag>
           </div>
          </div>
        </el-col>
        <el-col :span="3" style="text-align: right">
          <el-button
            type="primary"
            @click="jumpToMarkingAreaPage('first')"
            >快速评级</el-button
          >
        </el-col>
      </el-row>
    </div>
    <div class="paper-list-container">
      <div class="empty-tip" v-if="!this.paperList.length">
        <div class="center">
          <span class="icon el-icon-warning-outline"></span>
          <div>查询不到该评级下的试卷...</div>
        </div>
      </div>
      <ul v-if="paperList.length" class="paper-list clearfix">
        <li
          v-for="(paper, index) in paperList"
          :key="paper.id"
          class="paper-container"
        >
          <div class="paper">
            <div  class="edit-level" v-if="role!=0">
              <span
                v-if="!paper.edit"
                @click="handleSelectLevel(paper.id, index)"
                class="level"
                >修改评级</span
              >
              <selecte-grade
                v-else
                :grade="paper.level"
                :option="gradeList"
                @grade="selecteUpdateGrade"
              />
            </div>
            <el-image
              :src="paper.url"
              :alt="paper.name"
              fit="cover"
              @click="handleEditDialogImg(index)"
              class="pointer"
              style="height: 160px; width: 100%"
            />
            <div  class="image-mark-text" v-if="role!=0">
              <el-input
                :ref="`markInput${index}`"
                v-if="paper.show"
                v-model="paper.mark"
                @input="handleVerifyScore(paper.mark, index)"
                @keyup.native.enter="
                  markPaperAndToNext(paper.id, index, $event)
                "
              />
              <div v-if="!paper.show" @click="showMarkArea(index)">
                <i class="el-icon-edit-outline" /> 点击进行打分
              </div>
            </div>
          </div>
          <div class="id-number">
            <span>准考证号：{{ paper.permission || "--" }}</span>
          </div>
          <div class="rate-and-mark clearfix">
            <div class="level">
              <span class="label">评级</span>
              <span class="val level-val">{{ paper.level || "--" }}</span>
            </div>
            <div class="mark">
              <span class="label">分数</span>
              <span
                class="val mark-val"
                :class="{ good: parseInt(paper.mark) >= 0 }"
              >
                {{ parseInt(paper.mark) >= 0 ? paper.mark : "--" }}</span
              >
            </div>
          </div>
        </li>
      </ul>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <myPagination
            :current.sync="listQuery.current"
            :pages.sync="data.pages"
            :size.sync="listQuery.size"
            :total.sync="totalItem"
            @cb="currentChange"
        />
      </el-col>

    </div>
    <el-dialog
      :visible.sync="editImgDialogVisible"
      width="560px"
      class="editImgDialog"
      center
      append-to-body
      :close-on-click-modal="false"
    >
      <div
        v-if="paperList.length && paperList[editImgIndex]"
        style="display: block; "
      >
        <span class="close-button" @click="editImgDialogVisible = false"
          ><i class="el-icon-close"
        /></span>
        <div class="dialog-count">
          {{ editImgIndex + 1 }} / {{ paperList.length }}
        </div>
        <el-image :src="paperList[editImgIndex].imgUrl" height="560px">
          <div slot="placeholder" class="img-loading">
            加载中<span class="dot">...</span>
          </div>
        </el-image>
        <span class="pre-img" @click="preViewImg" v-if="editImgIndex"
          ><i class="el-icon-arrow-left"
        /></span>
        <span
          class="next-img"
          @click="nextViewImg"
          v-if="paperList.length - 1 !== editImgIndex"
          ><i class="el-icon-arrow-right"
        /></span>
        <div class="edit-level" v-if="role!=0">
          <span
            v-if="!paperList[editImgIndex].edit"
            @click="handleSelectLevel(paperList[editImgIndex].id, editImgIndex)"
            class="level"
            >修改评级</span
          >
          <selecte-grade
            v-else
            :grade="paperList[editImgIndex].grade"
            :option="gradeList"
            @grade="selecteUpdateGrade"
          />
        </div>
        <div class="image-mark-text" v-if="role!=0">
          <el-input
            v-if="paperList[editImgIndex].show"
            v-model="paperList[editImgIndex].mark"
            @input="
              handleVerifyScore(paperList[editImgIndex].mark, editImgIndex)
            "
            @keyup.native.enter="
              markPaperAndToNext(
                paperList[editImgIndex].id,
                editImgIndex,
                $event
              )
            "
          />
          <div
            v-if="!paperList[editImgIndex].show"

            @click="showMarkArea(editImgIndex)"
          >
            <i
              class="el-icon-edit-outline"
              style="font-size: 24px; color: #fff; vertical-align: middle"
            />
            点击进行打分
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="paperStopDialogVisible"
      width="460px"
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
  </div>
</template>
<script>
// import paginations from "@/components/Paginations";
// import { ossThumbnailSuffix } from "@/utils/ossUtils";
import SelecteGrade from "@/views/examList/selectGrade";

import {
  getPaperQueryList,
  getPaperAgg,
  getPaperGrade,
  getPaperUpdate,
  getReviewStatus,
  getRulesdetail,
} from "@/api/paper";

export default {
  name: "paperManage",
  components: { SelecteGrade },
  data: () => {
    return {
      levelList: [],
      gradeList: [],
      scoreList: [
        { key: "", name: "全部", total: 0, active: true },
        { key: 0, name: "未打分", total: 0, active: false },
        { key: 1, name: "已打分", total: 0, active: false },
      ],
      cachedPaperList: [],
      editIndex: null,
      editId: null,
      paperList: [], // 试卷列表
      account: "", // 当前账户
      currentIndex: 0, // 当前打分索引
      totalItem: 0,
      listQuery: {
        course: "", //科目
        province: "", // 省份
        provinceCode: "", // 省份码
        grade: "all", // 等级 all:全部，'':未评级，其他为A,B,C等类
        score: "all", // 分数 all:全部，'':未打分，1：已打分
        current: 1, // 当前页码
        size: 10, // 每页多少条数据
      },
      rulesdetail: [],
      maxScore: 100,
      editImgDialogVisible: false,
      editImgIndex: 0,
      paperScore:"",
      grade:"all",
      paperStopDialogVisible: false,
      data: { pages: 0, pageSize: 10, total: 0, records: [] },
      xxList:["all",0,"仲裁组"],
      ruleList:[],
      role:localStorage.getItem("role")
    };
  },
  computed: {
    activeLevel() {
      let activeLevel = "";
      this.levelList.forEach((level) => {
        if (level.active) {
          activeLevel = level;
        }
      });
      return activeLevel.name;
    },
  },
  created() {
    this.account = localStorage.getItem("user_name")
    this.queryPaperList();  //获取评级列表
    this.getList();  //获取试卷列表
    // this.queryDealedCount();    // 获取已评分/未评分
    this.getRulesdetail();  //获取打分规则
  },
  methods: {
    currentChange(){
      this.getList()
    },
    getList(type){
      let data = {
        "course": this.$route.query.course,
        "current": this.listQuery.current,
        "examCode": this.$route.query.examNo,
        "examId": this.$route.query.examId,
        "grade": this.grade,
        paperScore:this.paperScore,
        "provinceCode": "",
        "schoolId": "",
        "size": this.listQuery.size,
        "teacherId": ""
      }
      // todo 待完善
      let url = '/exampaper/examCorrectPaperListAll'
      this.$axios.post(url,data).then((response) => {
        console.log(data);
        const result = response.result || {};
        this.totalItem = result.total;
          const list = [];
          const cachedList = [];
          result.list.forEach((item) => {
            const imgName = item.img.substr(item.img.lastIndexOf("/") + 1);
            // const imgUrl = "http://192.168.1.11/" + imgName;
            const imgUrl = item.imgas;
            list.push({
              id: item.id,
              name: item.admissionTicketCode,
              url: item.img,
              imgUrl: imgUrl,
              permission: item.admissionTicketCode,
              level: item.grade,
              show: false,
              mark: item.score,
              edit: false,
            });

          });
          this.paperList = list;
          if(type == 2){
            this.paperList[this.currentIndex].show = true;
          }

      });
    },
    // 修改评级 子组件传递数据 type:0 为评级，1为打分
    selecteUpdateGrade(payload) {
      if (payload) {
        this.updatePaper({
          grade: payload,
          paperId: this.editId,
          type: 0,
        });
      }
    },
    // 修改评级
    handleSelectLevel(id, index) {
      this.editIndex = index;
      this.editId = id;
      this.paperList.map((item, key) => {
        if (key === index) {
          item.edit = true;
        } else {
          item.edit = false;
        }
      });
    },
    // 已评分 / 未评分
    handleScore(value, index) {
      this.listQuery.score = value;
      this.paperScore = value;
      this.scoreList.map((item, key) => {
        item.active = false;
        if (index === key) {
          item.active = true;
        }
      });
      this.getList();
    },
    // 编辑
    handleEditDialogImg(index) {
      this.editImgIndex = index;
      this.editImgDialogVisible = true;
    },
    // 上一个图片
    preViewImg() {
      if (!this.editImgIndex) return;
      const length = this.paperList.length - 1;
      const index = this.editImgIndex - 1;
      if (index < length) {
        this.editImgIndex = index;
      }
    },
    // 下一个图片
    nextViewImg() {
      const length = this.paperList.length - 1;
      const index = this.editImgIndex + 1;
      if (index <= length) {
        this.editImgIndex = index;
      }
    },
    // 获取打分规则
    getRulesdetail() {
      let data = {
        "course": this.$route.query.course,
        "examCode": this.$route.query.examNo,
        "examId": this.$route.query.examId,
      }
      this.$axios.post('/exampaper/scoringRules',data).then((res)=>{
        this.ruleList = res.result.list;
      })
    },
    // 获取评级列表
    queryPaperList(type) {
      let url1 = '/exampaper/queryGrade'
      this.$axios.post(url1,{
        "course": this.$route.query.course,
        "current": 1,
        "examCode": this.$route.query.examNo,
        "examId": this.$route.query.examId,
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
            count: res.result.arbitrationGradeCount,
            active: false,
          },
        ];
        res.result.gradeNameCount.forEach((item,index)=>{
          this.xxList.push(item.grade)
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
       return false


      this.paperList = [];
      this.cachedPaperList = [];
      const params = Object.assign({}, this.listQuery);
      // if (params.grade === 'all' && params.score === 'all') {
      //   delete params.grade
      //   delete params.score
      // } else if (params.grade === '' && params.score === 'all') {
      //   delete params.score
      // } else if (params.grade && params.score === 'all') {
      //   delete params.score
      //   params.status = 1
      // } else if (params.grade === 'all' && !params.score) {
      //   delete params.grade
      //   delete params.score
      //   params.status = 1
      // } else if (params.grade === 'all' && params.score) {
      //   delete params.grade
      //   delete params.score
      //   params.status = 2
      // }


    },
    // 获取已评分/未评分
    // queryDealedCount() {
    //   this.$axios.get('//rules/detail?id=118')
    //   getPaperAgg({
    //     provinceCode: this.$route.query.provinceCode,
    //     course: this.$route.query.course,
    //     province: this.$route.query.province,
    //     account: this.account,
    //   }).then((res) => {
    //     if (res.result) {
    //       const count = res.result.count || 0;
    //       const dealCount = res.result.dealCount || 0;
    //       this.scoreList[0].total = count + dealCount;
    //       this.scoreList[1].total = count;
    //       this.scoreList[2].total = dealCount;
    //       if (res.result.stats) {
    //         const resultList = res.result.stats;
    //         let totalCount = 0;
    //         let undealCount = 0;
    //         let tempGradeList = [];
    //         let list = [
    //           {
    //             name: "all",
    //             count: 0,
    //             dealCount: 0,
    //             total: 0,
    //             active: true,
    //           },
    //           {
    //             name: "",
    //             count: 0,
    //             dealCount: 0,
    //             total: 0,
    //             active: false,
    //           },
    //         ];
    //         for (let i = 0; i < resultList.length; i++) {
    //           totalCount =
    //             totalCount +
    //             (resultList[i].count || 0) +
    //             (resultList[i].dealCount || 0);
    //           undealCount = undealCount + (resultList[i].count || 0);
    //           list.push({
    //             name: resultList[i].name,
    //             count: resultList[i].count,
    //             dealCount: resultList[i].dealCount,
    //             total: resultList[i].total,
    //             active: false,
    //           });
    //           if (resultList[i].name) {
    //             tempGradeList.push({
    //               key: i,
    //               name: resultList[i].name,
    //             });
    //           }
    //         }
    //         list[0].total = res.result.personalTotal;
    //         list[1].total = res.result.personalCount;
    //         this.levelList = list;
    //         this.gradeList = tempGradeList;
    //       }
    //     }
    //   });
    // },
    // 设置分数
    updatePaper(data) {
      // type:0评级，1 分数，2:评分下一张
      let flagType = 0;

      if(data.type == 0){
        let params = {
          "course": this.$route.query.course,
          "examCode": this.$route.query.examNo,
          examPaperId:data.paperId,
          grade:data.grade
        }
        this.$axios.post("/exampaper/updateGrade",params).then((res) => {
          if (res) {
            this.$message.success(`试卷评级更新成功！`);
            if (flagType) {
              this.getList();
            } else {
              this.getList();
            }
            this.queryPaperList();  //获取评级列表
            // this.queryDealedCount();
          }
        });
      }else if(data.type == 2){
        let isX = true;
        let min = "";
        let max = "";
        this.ruleList.forEach((item)=>{
          if(data.grade == item.grade){
            if(data.score > item.scoreEnd || data.score < item.scoreStart){
              isX = false;
              min = item.scoreStart;
              max = item.scoreEnd;
              return false
            }
          }
        })
        if(!isX){
          this.$message.error(`该评级分数范围为`+min+"-"+max);
          return  false;
        }
        let params = {
          "course": this.$route.query.course,
          "examCode": this.$route.query.examNo,
          examPaperId:data.paperId,
          grade:data.grade,
          score:data.score,
        }
        this.$axios.post("/exampaper/updateScore",params).then((res) => {
          if (res) {
            this.$message.success(`试卷评级更新成功！`);
            if (flagType) {
              this.getList(2);
            } else {
              this.getList(2);
            }

            // this.queryDealedCount();
          }
        });
      }

    },
    // 筛选评级
    switchLevel(value, index) {
      this.grade = this.xxList[index];
      this.listQuery.grade = value;
      this.levelList.forEach((level, key) => {
        if (index === key) {
          level.active = true;
        } else {
          level.active = false;
        }
      });
      this.getList()
    },
    // 点击打分
    showMarkArea(index) {
      this.paperList.forEach((item, key) => {
        if (index === key) {
          item.show = true;
        } else {
          item.show = false;
        }
      });
    },
    // 校验分数
    handleVerifyScore(value, index) {
      this.$message.closeAll();
      let isNumber = /^\d*$/.test(value); // 验证是否是纯数字
      // 过滤非数字
      this.paperList[index].mark = value.replace(/\D/g, "");
      if (!isNumber || value < 0 || value >= this.maxScore) {
        this.$message.error("只能输入0-" + this.maxScore + "的整数");
      }
      this.paperList[index].mark =
        (value >= 0 && value <= this.maxScore && value.match(/^\d*/g)[0]) ||
        null;
    },
    // 设置分数并跳转到下一张
    markPaperAndToNext(paperId, index, $event) {
      this.paperList[index].show = false;
      if (index < this.paperList.length - 1) {
        this.currentIndex = index + 1;
      }
      this.updatePaper({ paperId, score: this.paperList[index].mark,grade: this.paperList[index].level, type: 2 });
    },
    // 跳转到评分页面
    jumpToMarkingAreaPage(start) {
      if (this.paperList && this.paperList.length) {
        let startId = start;
        if (start === "first") {
          startId = this.paperList[0].id;
        }
        const urlParams = this.$route.query;
        urlParams.level = this.activeLevel;
        urlParams.startId = typeof startId !== "object" ? startId : -1;
        this.$router.push({
          path: "/marking",
          query: urlParams,
        });
      }
    },
  },
};
</script>

<style lang="scss">
.editImgDialog {
  .el-dialog {
    border-radius: 0;
  }
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
    i {
      font-size: 50px;
      color: #1b1b1b;
    }
    .dialog-count {
      position: absolute;
      top: 10px;
      left: 45%;
      z-index: 3000;
      font-size: 20px;
      color: #fff;
    }
    .el-image {
      display: block;
      margin: 0 auto;
      text-align: center;
    }
    .img-loading,
    .el-image__error {
      margin: 0 auto;
      padding-top: 45%;
      text-align: center;
      background: none;
    }
    .close-button {
      position: absolute;
      top: 10px;
      left: 10px;
      cursor: pointer;
      z-index: 3000;
    }
    .pre-img {
      cursor: pointer;
      position: absolute;
      top: 45%;
      left: 15px;
    }
    .next-img {
      cursor: pointer;
      position: absolute;
      top: 45%;
      right: 15px;
    }
    .edit-level {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1;
      height: 28px;
      .level {
        padding: 10px;
        line-height: 33px;
        cursor: pointer;
        color: #fff;
        background-color: #35ce96;
        -webkit-border-radius: 0 10px 0;
        -moz-border-radius: 0 10px 0;
        border-radius: 0 10px 0;
        outline: none;
      }
    }
    .image-mark-text {
      background-color: rgba(0, 0, 0, 0.5);
      color: #fff;
      height: 44px;
      line-height: 44px;
      text-align: center;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      cursor: pointer;
    }
    .el-image {
      vertical-align: middle;
    }
  }
}
.paper-list-container {
  .el-input__inner {
    height: 30px;
    text-align: center;
  }

  .el-input-number {
    width: 200px;
    height: 30px;
    line-height: 30px;
  }

  .el-input-number.is-controls-right .el-input-number__decrease,
  .el-input-number.is-controls-right .el-input-number__increase {
    height: 14px;
    line-height: 14px;
    width: 30px;
  }
}
</style>
<style scoped lang="scss">
.label{
  display: flex;
}
.common-mr{
  margin-bottom:10px;
  margin-right: 15px;
}
.title{
  display:inline-block;
  width:45px;
}
.tags{
  display: flex;
  flex-wrap:wrap;
}
.paper-list-container {
  background-color: #fff;
  border-radius: 10px;
  padding: 5px 10px;
  .empty-tip {
    width: 100%;
    height: 300px;
    text-align: center;
    line-height: 300px;
    .center {
      display: inline-block;
      line-height: normal;
      font-size: 20px;
    }

    .icon {
      font-size: 50px;
      line-height: normal;
    }
  }
  .paper-list {
    padding: 0;
    .paper-container {
      float: left;
      margin-bottom: 20px;
      margin: 15px;
      border-radius: 10px;
      overflow: hidden;
      width:220px;
      .paper {
        position: relative;
        .edit-level {
          position: absolute;
          top: -2px;
          right: 0;
          z-index: 1;
          .level {
            padding: 6px;
            line-height: 33px;
            cursor: pointer;
            color: #fff;
            background-color: #35ce96;
            -webkit-border-radius: 0 10px 0;
            -moz-border-radius: 0 10px 0;
            border-radius: 0 10px 0;
            outline: none;
          }
        }

        .image-mark-text {
          background-color: rgba(0, 0, 0, 0.5);
          color: #fff;
          height: 30px;
          line-height: 30px;
          text-align: center;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          cursor: pointer;
        }
        .el-image {
          vertical-align: middle;
        }
      }

      .id-number {
        text-align: center;
        border-right: 1px solid #caccd4;
        border-left: 1px solid #caccd4;
        border-bottom: 1px solid #caccd4;
        height: 26px;
        line-height: 26px;
        // -webkit-border-radius: 0 0 10px 10px;
        // -moz-border-radius: 0 0 10px 10px;
        // border-radius: 0 0 10px 10px;
        padding: 0 12px;
        color: #1b1b1b;
        font-size: 13px;
        &.no-border-radius {
          -webkit-border-radius: 0;
          -moz-border-radius: 0;
          border-radius: 0;
        }
      }
      .rate-and-mark {
        border: 1px solid #caccd4;
        border-top: none;
        -webkit-border-radius: 0 0 10px 10px;
        -moz-border-radius: 0 0 10px 10px;
        border-radius: 0 0 10px 10px;
        font-size: 13px;
        padding: 0 12px;
        height: 34px;
        line-height: 34px;
        span {
          display: inline-block;
          vertical-align: middle;
        }
        .mark {
          float: right;
        }
        .level {
          float: left;
        }
        .val {
          font-weight: bold;
          font-size: 20px;
        }
        .mark-val {
          font-size: 20px;
          color: #caccd4;
          vertical-align: top;
          &.good {
            color: #ec2d56;
          }
        }
      }
    }
  }
}
</style>
