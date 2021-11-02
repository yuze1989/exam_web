<template>
  <div v-loading="aloading">
    <div class="top-container clearfix">
      <el-row
        :gutter="24"
        style="background: #ffffff; margin: 20px 0; padding: 10px 0;font-size: 15px;border-bottom: 1px solid #f1efef;"
      >
        <el-col :span="21">
          <div class="common-mb">科目：{{ $route.query.course}}</div>
          <div class="common-mb label">
            <span class="title">评级：</span>
            <div class="tags tagList">
              <el-tag
              v-for="(item, index) in levelList"
              :key="item.name"
              @click="switchLevel(item.name, index)"
              :effect="item.active ? 'dark' : 'light'"
              size="medium"
              :class="item.min>=0?'common-mr pointer hh':'common-mr pointer'"
              :style="item.name == '仲裁组'?{background:'#f35f62',color:'#fff'}:''"
              @contextmenu.prevent.native="openMenu($event,item)"
            >


              <font v-if="item.name == '仲裁组'">
                {{ item.name}} <span style="font-size:19px;position: relative;top: 1px ">{{ item.count || 0 }}</span>
              </font>
                <font v-else-if="item.name == '全部'">
                  {{ item.name }} <span style="font-size:19px; position: relative;top: 1px">{{ item.count || 0 }}</span>
                </font>
                <font v-else-if="item.name == '未评级'">
                  {{ item.name }} <span style="font-size:19px; position: relative;top: 1px">{{ item.count || 0 }}</span>
                </font>
                  <font v-else="item.name">
                    <p style="margin:0;font-weight: 700;">{{ item.name }} <span style="font-size: 19px">{{ item.count || 0 }}</span></p>
                    <div class="qj">
                      <div>{{item.min}}</div>
                      <div style="height: 20%;line-height: 5px">-</div>
                      <div>{{item.max}}</div>
                    </div>
                    <el-progress
                        text-inside
                        :stroke-width="20"
                        :percentage="item.all || 0"
                    ></el-progress>
                  </font>

            </el-tag>

            </div>

          </div>
          <div class="common-mb label" style="margin-top: 10px">
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
            <el-checkbox style="position: absolute;right: 0" v-model="isGd" @change="getList">分数从高到低</el-checkbox>
            <el-checkbox v-model="showT" v-if="role==0 || role==3" @change="getList" style="position: absolute;right: 170px;">评级记录</el-checkbox>
            <el-checkbox v-model="showP" v-if="role!=0 && role!=3" @change="changeP" style="position: absolute;right: 170px;">批量调整评级</el-checkbox>
            <el-checkbox v-model="showP" v-if="role==0 || role==3" @change="changeP" style="position: absolute;right: 300px;">批量调整评级</el-checkbox>
          </div>
        </el-col>
        <el-col :span="3" style="text-align: right">
          <el-button
            type="primary"
            @click="jumpToMarkingAreaPage('first')"
            >快速评级</el-button
          >
          <el-button
              v-if="role==3 || role == 0"
              style="margin-top: 10px"
              type="primary"
              @click="stopPj"
          >停止评级</el-button
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
            style="position: relative"
        >
          <el-checkbox class="checkP" v-model="paper.checked" v-if="showP"></el-checkbox>
          <el-badge value="仲裁" class="zcz" style="position: absolute;top: 0;left: 0;z-index: 998;" v-if="paper.isArbitrate == 1">
          </el-badge>

          <div class="paper">
            <div class="teacher3" v-if="paper.paperTeachers && paper.paperTeachers.length > 0">
              <h3 style="text-align: center;color: rgb(222 222 222);font-size: 14px;padding: 4px;margin: 0">评级记录</h3>
              <p v-for="(item,index) in paper.paperTeachers">{{item.username}}:{{item.originalGrade}}</p>
            </div>
            <div  class="edit-level" v-if="role!=0 &&((showP && paper.checked) || !showP)">
              <span
                  v-if="!paper.edit"
                  @click="handleSelectLevel(paper.id, index)"
                  class="level"
              >修改评级</span
              >
              <selecte-grade
                  v-else
                  :grade="paper.level || ''"
                  :option="gradeList"
                  @grade="selecteUpdateGrade2"
                  style="width: 70px;position: relative;top: 1px"
              />
              <el-badge :value="(paper.originalGrade)" class="his zcz" style="position: absolute;top: 1px;left: 68px;z-index: 998;">

              </el-badge>
            </div>
            <div style="text-align: center;">
              <el-image
                  :class="'image-container2 hidebox hide'+hideSite"
                  style="width: fit-content"
                  :src="paper.url"
                  :alt="paper.name"
                  fit="cover"
                  @click="handleEditDialogImg(index)"
              />
            </div>
            <div  class="image-mark-text" v-if="role!=0">
              <el-input
                  :ref="`markInput${index}`"
                  v-if="paper.show"
                  v-fo
                  :class="`markInput${index}`"
                  v-model="paper.mark"
                  :min="0"
                  :max="1000"
                  :minlength="1"
                  :maxlength="100"
                  type="number"
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
            <div class="level" style="position: relative">
              <span class="label">评级</span>
              <span class="val level-val">{{ paper.level || "--" }}</span>

            </div>

            <div class="mark">
              <span class="label">分数</span>
              <span
                  class="val mark-val"
                  :class="{ good: paper.mark >= 0 }"
              >
                {{ paper.mark >= 0 ? paper.mark : "--" }}</span
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
      class="editImgDialog"
      center
      append-to-body
      :close-on-click-modal="false"
      v-if="(listQuery.current - 1) * listQuery.size + editImgIndex + 1 <= allCount"
    >
      <div class="box">
        <div
            class="left"
            v-if="paperList.length && paperList[editImgIndex]"
            style="    display: flex;
    justify-content: center;
    align-items: center;"
        >
          <el-badge value="仲裁" class="zcz zcz02" style="position: absolute;top: 0; z-index: 998;left: 0px;" v-if="paperList[editImgIndex].isArbitrate == 1"></el-badge>
          <div class="pos-tip" v-if="isHide != 1"> <span>  {{totalItem?(listQuery.current - 1) * listQuery.size + editImgIndex +1 :0 }} </span> / {{ totalItem }}</div>
          <div class="teacher2" v-if="paperList[editImgIndex].paperTeachers.length > 0">
            <h3 style="text-align: center;color: rgb(222 222 222);font-size: 28px;padding: 14px;margin: 0">评级记录</h3>
            <p v-for="(item,index) in paperList[editImgIndex].paperTeachers">{{item.username}}:{{item.originalGrade}}</p>
          </div>
          <span class="close-button" @click="editImgDialogVisible = false"
          ><i class="el-icon-close"
              style="color: #fff"
          /></span>
          <el-image ref="bimg_box" :src="paperList[editImgIndex].imgUrl" :class="className" :style="m_style" @load="change1" @mousedown="handleImageMouseDown" draggable="false" @wheel.stop="wheelScale">
            <div slot="placeholder" class="img-loading">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
          <span class="pre-img" @click="preViewImg"
                v-if="(listQuery.current - 1) * listQuery.size + editImgIndex >= 1"
          ><i class="el-icon-arrow-left"
          /></span>
          <span
              class="next-img"
              @click="nextViewImg"
              v-if="(listQuery.current - 1) * listQuery.size + editImgIndex + 1 < allCount"
          ><i class="el-icon-arrow-right"
          /></span>
          <div class="edit-level">
            <div v-for="(item,index) in gradeList" >
              <el-button :class="((paperList[editImgIndex]?paperList[editImgIndex].level:'') || '')==item.name?'level active':'level'" type="primary"  @click="selecteUpdateGrade(item.name)">{{item.name}}</el-button>
            </div>
          </div>
          <div class="operate-area xxxx">
            <slot name="operate">
              <SvgIcon
                  class="icon hover-icon"
                  name="actionicon"
                  @click="increaseScale(0.2)"
                  style="font-size: 24px;cursor: pointer"
              />
              <SvgIcon
                  class="icon hover-icon"
                  name="suoxiao"
                  @click="increaseScale(-0.2)"
                  style="font-size: 24px;cursor: pointer"
              />
              <div class="divide" />
              <span class="r_left" @click="m_c_rotate(-90)">
            </span>
              <span class="r_right" @click="m_c_rotate(90)">
            </span>
            </slot>
            <slot name="extraOperate"></slot>
          </div>
          <div class="image-mark-text" >
            <el-input
                v-if="paperList[editImgIndex].show"
                v-model="paperList[editImgIndex].mark"
                :min="0"
                v-fo
                :max="1000"
                :minlength="1"
                :maxlength="100"
                type="number"
                @input="
              handleVerifyScore(paperList[editImgIndex].mark || '', editImgIndex)
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
        <div class="right">
          <div class="pfList">
            <div class="box">
              <div class="span"  v-for="(item,index) in (scoreObj[(paperList[editImgIndex]?paperList[editImgIndex].level:'')] || [])" >
                <div class="btn"  @click="markPaperAndToNext(paperList[editImgIndex].id,editImgIndex,$event,item)">
                  {{item}}
                </div>
              </div>
            </div>
          </div>
          <div style="    position: absolute;
    bottom: 0;
    width: 100%;
    background: #409eff;
    color: #fff;    height: 34px;
    line-height: 34px;
    padding-left: 15px;
    font-size: 16px;">当前分数：{{ (paperList[editImgIndex]?paperList[editImgIndex].mark:"")}}</div>
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
    <el-dialog
        :visible.sync="dialogFormVisible"
        width="50%"
        center
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
    margin-bottom: 15px;">请确认该科目下试卷已经全部评级完成，一旦停止评级后将不能再进行评级，请谨慎操作！</p>
        <el-form-item label="管理员账号" prop="username" style="margin-bottom: 15px">
          <el-input v-model="admin_username" placeholder="请输入管理员账号"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="admin_password" placeholder="请输入密码"></el-input>
        </el-form-item>


      </el-form>

      <div slot="footer">
        <el-button type="primary"   @click="stopYj">确认</el-button>
      </div>

    </el-dialog>
    <el-dialog
        :visible.sync="dialogFormVisible2"
        width="50%"
        center
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
    margin-bottom: 15px;">该场考试已经停止评级，请谨慎操作！</p>
        <el-form-item label="管理员账号" prop="username" style="margin-bottom: 15px">
          <el-input v-model="admin_username2" placeholder="请输入管理员账号"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="admin_password2" placeholder="请输入密码"></el-input>
        </el-form-item>


      </el-form>

      <div slot="footer">
        <el-button type="primary"   @click="stopYj2">确认</el-button>
      </div>

    </el-dialog>
<!--    全选弹出-->
    <div v-if="(role!=0) && tck" class="tck" :style="{position: 'fixed',left:xxP.x+'px',top:xxP.y+'px'}">
      <div v-for="(item,index) in gradeList" @click="changePJ(item)">调整评级为 / {{item.name}}</div>
    </div>
  </div>
</template>
<script>
import SelecteGrade from "@/views/examList/selectGrade";
import Snippet from './Snippet'
import SvgIcon from './SvgIcon'
export default {
  name: "paperManage",
  components: {
    SelecteGrade ,
    Snippet,
    SvgIcon
  },
  data: () => {
    return {
      width:30,
      height:10,
      aloading:false,
      tck:false,
      dialogFormVisible:false,
      admin_password:"",
      admin_password2:"",
      admin_username:"",
      admin_username2:"",
      m_style:'transform: scale(1) rotate(0deg)',
      showT:false,
      isGd:true,
      levelList: [],
      gradeList: [],
      showP:false,
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
      class1:"image-container",
      paperStopDialogVisible: false,
      data: { pages: 0, pageSize: 10, total: 0, records: [] },
      xxList:["all",0,"仲裁组"],
      ruleList:[],
      role:localStorage.getItem("role"),
      gradeIndex:0,
      scoreObj:{},
      innerScaleStep:1,
      scale:1,
      m_rotate:0,
      className:"",
      hideSite:"",
      hideName:"",
      hideImg:"",
      position: {
        left: 0,
        top: 0,
      },
      isEditN:false,
      editNum:"",
      mouse: {
        x: 0,
        y: 0,
      },
      xxP:{
        x:0,
        y:0,
        name:"",
      },
      allCount:0,
      isHide:0,
      unmarkedCount:0,
      isStop:0,
      dialogFormVisible2:false,
      params:{},
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
    this.getList();  //获取试卷列表
    // this.queryDealedCount();    // 获取已评分/未评分
    this.getRulesdetail();  //获取打分规则
  },
  methods: {
    changePJ(item){
      this.$confirm(`此操作将把${this.xxP.name}评级下所有试卷调整为${item.name}评级，请谨慎操作！`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.aloading  = true;
        let data = {
          "course": this.$route.query.course,
          "current": 1,
          "examCode": this.$route.query.examNo,
          "examId": this.$route.query.examId,
          "grade": this.xxP.name,
          paperScore:"",
          "provinceCode": "",
          "schoolId": "",
          "size": 100000,
          "teacherId": ""
        };
        this.$axios.post('/exampaper/examCorrectPaperListAll',data).then(res=>{
          if(res.code == 200){
            if(res.result.list.length == 0){
              this.$message({
                type: 'warning',
                message: '没有可以修改的试卷!'
              });
              this.aloading  = false;
            }else{
              let arr = [];
              res.result.list.forEach((item,index)=>{
                arr.push(item.id);
              })
              let obj = {
                examPaperIds:arr,
                examId:this.$route.query.examId,
                course: this.$route.query.course,
                grade:item.name,
                teacherName:localStorage.getItem("user_name")
              }
              this.$axios.post('/exampaper/batchUpdateGrade',obj).then(res=>{
                if(res.code == 200){
                  if(arr.length == res.result.length){
                    if(res.result[0].indexOf('停止阅卷')){
                      this.$message({
                        type: 'error',
                        message: '该场考试已经停止阅卷！'
                      });
                    }
                    if(res.result[0].indexOf('停止评级')){
                      this.$message({
                        type: 'error',
                        message: '该场考试已经停止评级！'
                      });
                    }
                  }else{
                    this.$message({
                      type: 'success',
                      message: '批量修改成功!'
                    });
                    this.getList();
                    this.queryPaperList()
                  }
                }
                this.aloading  = false;
              })

            }
          }
        }).catch(errorM=>{
          this.aloading  = false;
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        });
      });
    },
    hideR(){
      this.tck = false;
    },
    // 右键显示
    openMenu(e,item){
      if(item.name == "全部" || item.name == "仲裁组" || item.name == "未评级"){
        return false
      }
      e.preventDefault();
      this.tck = true;
      this.xxP.x  = e.clientX;
      this.xxP.y  = e.clientY;
      this.xxP.name = item.level;
    },
    stopPj(){
      this.dialogFormVisible = true;
      this.admin_password = "";
      this.admin_username = "";
    },
    changeP(){
      if(this.showP){
        this.paperList.forEach((item,index)=>{
          item.checked = true;
        })
      }
    },
    // 滚轮缩放
    wheelScale(e) {
      let evt = window.event;
      evt.stopPropagation();
      evt.preventDefault();
      const RATIO = 700 // 实际缩放与缩放偏移量的系数
      let computedScale = this.scale - e.deltaY / RATIO
      if(computedScale <= 0.1){
        return false;
      }
      if(computedScale >= 3){
        return false;
      }
      this.scale = computedScale
      this.m_style = `transform:translate3d(${this.position.left}px, ${this.position.top}px, 0) scale(${this.scale}) rotate(${this.m_rotate}deg)`
    },
    // 图片拽拉
    handleImageMouseDown(e) {
      this.mouse = {
        x: e.clientX,
        y: e.clientY,
      }
      window.addEventListener('mousemove', this.handleImageMouseMove)
      window.addEventListener('mouseup', this.handleImageMouseUp)
    },
    handleImageMouseMove(e) {
      // 移动event的坐标
      let { clientX, clientY } = e
      // 鼠标按下时记录的坐标
      let { x, y } = this.mouse
      // 偏移后的位置
      let deltaX = clientX - x + this.position.left
      let deltaY = clientY - y + this.position.top
      this.mouse = {
        x: clientX,
        y: clientY,
      }
      this.position = {
        left: deltaX,
        top: deltaY,
      }
      this.m_style = `transform:translate3d(${this.position.left}px, ${this.position.top}px, 0) scale(${this.scale}) rotate(${this.m_rotate}deg)`
    },
    handleImageMouseUp(e) {
      window.removeEventListener('mousemove', this.handleImageMouseMove)
      window.removeEventListener('mouseup', this.handleImageMouseUp)
    },
    change1(){
      this.clearHide();
      this.position.left = 0;
      this.position.top = 0;
      this.m_style = `transform:translate3d(${this.position.left}px, ${this.position.top}px, 0) scale(${this.scale}) rotate(${this.m_rotate}deg)`
      const kjW = document.getElementsByClassName('left')[0].offsetWidth - 80; //网页可见区域宽度
      const kjH = document.getElementsByClassName('left')[0].offsetHeight; //网页可见区域高度
      this.bj = kjW/kjH;


      //大图自适应
      let url = this.paperList[this.editImgIndex].imgUrl;
      let image = new Image()
      image.src = url;
      let that = this;
      image.onload = function (){
        if(image.width>image.height){
          if(image.width/image.height > this.bj){
            if(that.hideSite == -1){
              that.className = "image-container"
            }else{
              that.className = "image-container hidebox hide"+that.hideSite
            }
          }else{
            if(that.hideSite == -1){
              that.className = "image-container2"
            }else{
              that.className = "image-container2 hidebox hide"+that.hideSite
            }
          }
          // if(that.hideSite == -1){
          //   that.className = "image-container"
          // }else{
          //   that.className = "image-container hidebox hide"+that.hideSite
          // }

        }else{
          if(image.width/image.height < this.bj){
            if(that.hideSite == -1){
              that.className = "image-container"
            }else{
              that.className = "image-container hidebox hide"+that.hideSite
            }
          }else{
            if(that.hideSite == -1){
              that.className = "image-container2"
            }else{
              that.className = "image-container2 hidebox hide"+that.hideSite
            }
          }
          // if(that.hideSite == -1){
          //   that.className = "image-container2"
          // }else{
          //   that.className = "image-container2 hidebox hide"+that.hideSite
          // }
        }

      }

      //旋转初始化
      this.scale = 1;
      this.m_rotate = 0;
      this.increaseScale(0)
    },
    increaseScale(value){
      this.scale = this.scale/1 + value/1;
      this.scale = this.scale.toFixed(2)/1
      this.m_style = `transform:translate3d(${this.position.left}px, ${this.position.top}px, 0) scale(${this.scale}) rotate(${this.m_rotate}deg)`
    },
    m_c_rotate(value){
      this.m_rotate = this.m_rotate/1 + value/1;
      this.m_style = `transform:translate3d(${this.position.left}px, ${this.position.top}px, 0) scale(${this.scale}) rotate(${this.m_rotate}deg)`
    },
    stopYj(){
      if(!this.admin_password || !this.admin_password){
        this.$message({
          type: 'warning',
          message: '请输入完整的账号和密码!'
        });
        return false;
      }
      this.$axios.post("/exampaper/stopGrade?course="+this.$route.query.course+"&examId="+this.$route.query.examId+"&username="+this.admin_username+"&password="+this.admin_password).then((res)=>{
        if(res.code == 200){
          this.dialogFormVisible = false;
          this.$message({
            type: 'success',
            message: '已停止评级!'
          });
        }
      })
    },
    stopYj2(){
      if(!this.admin_username2 || !this.admin_password2){
        this.$message({
          type: 'warning',
          message: '请输入完整的账号和密码!'
        });
        return false;
      }
      let params = this.params;
      params.username = this.admin_username2;
      params.password = this.admin_password2;
      this.$axios.post("/exampaper/updateGrade",params).then((res) => {
        if (res) {
          if(res.code == 200){
            this.dialogFormVisible2 = false;
            this.$message.success(`试卷评级更新成功！`);
            this.getList();
            this.queryPaperList();  //获取评级列表

          }
          // this.queryDealedCount();
        }
      }).catch((error)=>{
        this.getList();
      });
    },
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
      if(this.showT){
        data.showTeacherGrade = 1;
      }
      if(type != 4){
        this.showP = false;
      }
      // todo 待完善
      let url = '/exampaper/examCorrectPaperListAll'
      this.$axios.post(url,data).then((response) => {
        const result = response.result || {};
        this.totalItem = result.total/1;
          const list = [];
          const cachedList = [];
        this.isStop = result.isStopGrade;
        result.list.forEach((item) => {
            const imgName = item.img.substr(item.img.lastIndexOf("/") + 1);

            list.push({
              id: item.id || '',
              name: item.admissionTicketCode || '',
              url: item.img || '',
              imgUrl: item.imgas?item.imgas:"",
              permission: item.admissionTicketCode,
              level: item.grade || '',
              show: false,
              mark: item.score,
              edit: false,
              isArbitrate:item.isArbitrate,
              originalGrade:item.originalGrade,
              paperTeachers:item.paperTeachers,
              rotate:item.rotate || '',
              // className:className
              checked:true,
            });
          });

        if(this.isGd){
          list.sort(function(a,b){
            return b.mark - a.mark
          });

        }
        this.allCount = result.total || 0;
        this.paperList = list;
        if(type == 2){
          if(!this.paperList[this.editImgIndex]){
            this.editImgDialogVisible = false;
          }

          if(this.paperList[this.editImgIndex]){
            this.paperList[this.editImgIndex].show = true;
          }
          let classN = 'markInput'+this.currentIndex;
        }
        if(this.paperList.length == 0){
          this.editImgDialogVisible = false;
          if(this.paperList[this.currentIndex]){
            this.paperList[this.currentIndex].show = false;
          }
        }

      });
    },
    // 修改评级 子组件传递数据 type:0 为评级，1为打分
    selecteUpdateGrade(payload) {
      if (payload) {
        this.updatePaper({
          grade: payload,
          paperId:this.paperList[this.editImgIndex].id,
          type: 0,
        });
      }
    },
    selecteUpdateGrade2(payload) {
      console.log(payload);
      if (payload) {
        //批量修改
        if(this.showP){
          let length = 0 ;
          this.paperList.forEach((item,index)=>{
            if(item.checked){
              length += 1;
              this.updatePaper({
                grade: payload,
                paperId:item.id,
                type: 0,
              },2);
            }
          })
          if(length == 0){
            this.$message.error("批量模式下请至少选中一张要修改的试卷！")
            return;
          }

          return
        }else{
          this.updatePaper({
            grade: payload,
            paperId:this.editId,
            type: 0,
          });
        }

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
      this.listQuery.current = 1;
      this.scoreList.map((item, key) => {
        item.active = false;
        if (index === key) {
          item.active = true;
        }
      });
      this.getList();
      this.queryPaperList();
    },
    // 编辑
    handleEditDialogImg(index) {
      this.editImgIndex = index;
      this.editImgDialogVisible = true;
      this.clearHide()
    },
    //清除样式
    clearHide(){
      let str = this.className;
      str = str.replace('hidebox','');
      this.className = str;
    },
    // 上一个图片
    preViewImg() {
      if(!this.editImgIndex && this.listQuery.current == 1){
        this.$message.warning("已经是第一张试卷了！")
        return;
      }
      this.clearHide();
      if(!this.editImgIndex){
        this.listQuery.current-=1;
        this.paperList = [];
        this.getList();
        this.editImgIndex = this.listQuery.size -1;
        return
      }
      if (!this.editImgIndex) return;
      const length = this.paperList.length - 1;
      const index = this.editImgIndex - 1;
      if (index < length) {
        this.editImgIndex = index;
      }

    },
    // 下一个图片
    nextViewImg() {
      if((this.listQuery.current - 1) * this.listQuery.size + this.editImgIndex + 1 >= this.allCount){
        return
      }
      this.clearHide();
      if(this.paperList.length - 1 == this.editImgIndex){
        this.listQuery.current+=1;
        this.getList();
        this.editImgIndex = 0;
        return
      }


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
        if(res.result.list[0].score){
          this.maxScore = res.result.list[0].score;
        }
        if(res.result.list[0].isHide){
          this.isHide = res.result.list[0].isHide;
        }
        if(res.result.list[0].maskWidth){
          this.width = res.result.list[0].maskWidth;
          var sty=document.createElement('style');
          sty.innerText=`
          .hidebox:before{width:${this.width/1}%}
        `;
          document.body.appendChild(sty);
        }
        if(res.result.list[0].maskHeight){
          this.height = res.result.list[0].maskHeight;
          var sty=document.createElement('style');
          sty.innerText=`
          .hidebox:before{height:${this.height/1}%}
        `;
          document.body.appendChild(sty);
        }
        this.queryPaperList();  //获取评级列表
        this.hideSite = res.result.list[0].hideSite;
        this.hideImg = res.result.list[0].maskUrl;
        if(this.hideImg != null){
          var sty=document.createElement('style');
          sty.innerText=`
          .hidebox:before{background-image:url(\'${this.hideImg}\')}
        `;
          document.body.appendChild(sty);
        }


        this.hideClass();
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
        this.unmarkedCount = res.result.countNum;

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
        let that = this;
        res.result.gradeNameCount.forEach((item,index)=>{
          this.xxList.push(item.grade)
          if(item.grade != ""){
            let all;
            let progress;
            all = (that.unmarkedCount || 0)*(((that.ruleList[index]?that.ruleList[index].percentage:0)/100 ) || 0)
            all = Math.ceil(all)
            progress = Math.round(
                ((item.count || 0) / (all/1 || 0) * 100)
            );
            list.push({
              name: item.grade+"类",
              count: item.count,
              active: false,
              min:that.ruleList[index].scoreStart,
              max:that.ruleList[index].scoreEnd,
              level:item.grade,
              all:progress,
            })
            let arr = [];
            for(let i = that.ruleList[index].scoreStart; i <= that.ruleList[index].scoreEnd; i++){
              arr.push(i);
            }
            this.scoreObj[item.grade] = arr;
            tempGradeList.push({
              key: index,
              name: item.grade,
            })
          }

        })
        this.levelList = list;
        this.gradeList = tempGradeList;
        this.levelList.forEach((level, key) => {
          if (this.gradeIndex === key) {
            level.active = true;
          } else {
            level.active = false;
          }
        });

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
    updatePaper(data,type) {
      // type:0评级，1 分数，2:评分下一张
      let flagType = 0;

      if(data.type == 0){
        let params = {
          "course": this.$route.query.course,
          "examCode": this.$route.query.examNo,
          examPaperId:data.paperId,
          grade:data.grade,
          examId:this.$route.query.examId,
          teacherName:localStorage.getItem("user_name")
        }
        if(this.isStop == 1 && this.role == 3){
          this.dialogFormVisible2 = true;
          this.admin_username2 = "";
          this.admin_password2 = "";
          this.params = params;
        }else{
          this.$axios.post("/exampaper/updateGrade",params).then((res) => {
            if (res) {
              if(res.code == 200){
                if(type != 2){
                  this.$message.success(`试卷评级更新成功！`);
                }
              }
              if(type == 2){
                type = 4
              }

              if (flagType) {
                this.getList(type);
              } else {
                this.getList(type);
              }
              this.queryPaperList();  //获取评级列表
              // this.queryDealedCount();
            }
          }).catch((error)=>{
            this.getList();
          });
        }


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
          this.getList()
          return  false;
        }
        let params = {
          "course": this.$route.query.course,
          "examCode": this.$route.query.examNo,
          "examId": this.$route.query.examId,
          examPaperId:data.paperId,
          grade:data.grade,
          score:data.score,
          teacherName:localStorage.getItem("user_name")
        }

        if(!data.grade){
          this.$message.error(`请先对该试卷进行评级！`);
          this.getList()
          return  false;
        }
        this.$axios.post("/exampaper/updateScore",params).then((res) => {
          if (res) {
            if(res.code == 200){
              this.$message.success(`试卷分数更新成功！`);
              if (flagType) {
                this.getList(2);
              } else {
                this.getList(2);
              }
              if(this.paperScore!==0){
                this.nextViewImg()
              }
            }else{
              this.getList();

            }

            // this.queryDealedCount();
          }else{
            this.getList()
          }
        }).catch((error)=>{
          this.getList()
        });
      }

    },
    // 筛选评级
    switchLevel(value, index) {
      this.gradeIndex = index;
      this.grade = this.xxList[index];
      this.listQuery.grade = value;
      this.listQuery.current = 1;
      this.levelList.forEach((level, key) => {
        if (index === key) {
          level.active = true;
        } else {
          level.active = false;
        }
      });
      this.getList()
      this.queryPaperList()
    },
    // 点击打分
    showMarkArea(index) {
      let that = this;
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
      // let isNumber = /^[0-9]{1,20}$/.test(value); // 验证是否是纯数字
      // // 过滤非数字
      // this.paperList[index].mark = value.replace(/\D/g, "");
      // console.log(value,!isNumber);
      // if (value < 0 || value > this.maxScore) {
      //   this.$message.error("只能输入0-" + this.maxScore + "的分数");
      // }
      // this.paperList[index].mark =
      //   (value >= 0 && value <= this.maxScore && value.match(/^\d*/g)[0]) ||
      //   null;
    },
    // 设置分数并跳转到下一张
    markPaperAndToNext(paperId, index, $event,score) {
      if(score || score == 0){
        this.paperList[index].mark = score
      }
      this.paperList[index].show = false;
      if (index < this.paperList.length - 1) {
        if(this.paperScore===0){
          this.currentIndex = index
        }else{
          this.currentIndex = index +1
        }
      }


      this.updatePaper({ paperId, score: this.paperList[index].mark,grade: (this.paperList[index]?this.paperList[index].level:"") || '', type: 2 });
    },
    // 跳转到评分页面
    jumpToMarkingAreaPage(start) {
      let startId = start;
      if (this.paperList && this.paperList.length) {
        if (start === "first") {
          startId = this.paperList[0].id;
        }
      }
      const urlParams = this.$route.query;
      urlParams.level = this.activeLevel;
      urlParams.startId = typeof startId !== "object" ? startId : -1;
      this.$router.push({
        path: "/marking",
        query: urlParams,
      });
    },
    //遮盖区域
    hideClass(){
      let hideSite = this.hideSite;
      this.hideName = 'hide'+hideSite;
    },
  },
  mounted() {
    window.addEventListener("click", this.hideR);
  },
  beforeDestroy() {  // 实例销毁之前对点击事件进行解绑
    window.removeEventListener('click', this.hideR);
  }
};
</script>

<style lang="scss">
.zcz02 sup {
  font-size: 20px;
  height: 30px;
  line-height: 30px;
  padding: 0 15px;
}
.tagList .el-tag{
  border-color: #409eff !important;
}
.left .pos-tip{
  position: absolute;
  width: 100%;
  text-align: center;
  color: #fff;
  z-index: 99;
  top: 20px;
  font-size: 20px;
}
.tck{
  background: #fff;
  border-radius: 4px;
  border: 1px solid #ccc;
  z-index: 998;
}
.tck>div{
  width: 200px;
  height: 40px;
  line-height: 40px;
  padding-left: 40px;
  border-bottom: 1px solid #e4e7ed;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
}
.tck>div:hover{
  background: #409EFF;
  color: #fff;
}
.tck>div:last-child{
  border-bottom: none;
}
.checkP{
  position: absolute;
  top: -4px;
  z-index: 999;
  left: 0;
  width: 20px;
  height: 20px;
}
.checkP .el-checkbox__input, .checkP .el-checkbox__inner{
  width: 100%;
  height: 100%;
}
.checkP .el-checkbox__inner::after{
  height: 12px;
  left: 7px;
}
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
.box .left{
  width: 80%;
  position: relative;
  height: 100%;
  padding-right:80px;
}
.box .right{
  width: 20%;
  position: absolute;
  height: 100%;
  top: 0;
  right: 0;
  background: #fff;
}
.editImgDialog .el-dialog{
  background: rgba(0,0,0,.6)
}
.editImgDialog .el-dialog{
  width: 100%;
}
.editImgDialog .el-dialog__body i{
  color: #f2f6fc !important;
}
.editImgDialog .el-dialog__body{
  overflow: hidden;
}
.xxxx{
  position: absolute;
  bottom: 27px;
  width: calc(100% - 80px);
  background: rgba(0,0,0,.5);
  left: 0;
  display: flex;
  justify-content: center;
  height: 46px;
  align-items: center;
}
.xxxx .icon + .icon{
  margin-left: 24px;
}
.r_left {
   width: 24px;
   height: 24px;
   background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAjxJREFUSEu1lDFok0EUx//vMpghIARMuHcJEgldopNIKw6OUsVFmgrq4KDi1E0Xwdat6KDgUhDUwUHIIOgkVCkOKohUEQTN6Je7j2qIgoFEwvfkK01I0zT5rHy3He+9/+/uf/ceIeZFUfQ9zzuslJoCMAHgO4DlZDL5MZ1O/xpXvy2gWq3uSqVSFRE5CWAVwAqAr0TEInIcwEEAvohUjDFz24HWAc65ea31jW6StfYsgEdE9CCRSMxlMpnfwwSstSFkEcDeRqOxv1Qq/RnM6wFEpMTMs57nlZVSZSK6pbV+N86CMG6tvQzgpoicM8Y87a/pBywAqITBEBRFuD/HObdHRNaYeZPtg4CwprITwIbV50XkOjPv68KHAf4LYq1dFZH7xpi7oVAPMMyS/oePaplz7pCIXGXmcg8QtThqnrX2OTMfiw3gnHvc6XSW8vn8SqROjnryvj5aIiIXWhwLoFarLSql3mutK7EArLX3iOi21vpzXIBPzHwglkf2PC+nlHrLzLlYANbaawAKzHxhC8A591JEFpj51b/+nI2hdwbAKWae2TQquhvP8yaI6IUxJr9DgAwddgNTcT4IgmkROZHL5epRQL7vTwVB8CaRSBzJZrOvt4zrQRHf9ydF5A6AJ81m82GxWFwbBqrX6/l2uz1DRLOtVmu6UCj8HMwb+U2ttRcBXALQEpEPSqkfoYCITAI4CuCbiDwzxlzZ7qaR+sD3/dNBEGgi2h0KBUGwTERfmHkdOGpFAowTGRX/CxJQ+xka2WV0AAAAAElFTkSuQmCC) no-repeat;
   display: inline-block;
   position: relative;
   left: 16px;
   cursor: pointer;
 }
.r_right {
  width: 24px;
  height: 24px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAlNJREFUSEu1lT9oFEEUxr+3yf0RDjU5DffezXVWNipqJYiIoIhYKAdWgmARm1RB1EYtTBH/FBYq2ohYeW2COUihlUoqxUNIoiDrzkIOLt2Z4jIjE+7CmVtvb4VMt7zv+34zb3ZmCNs8aJD8RqOxa21t7QCAUwD2Alg0xnxUSn2I8/cFBEHwmIjKAAoA5q218wC+eZ6nrLWHAFwA8GR9fX2qVCr9joJFAmq1WnpkZOQrgJ/GmEml1Ocos+/7O1Kp1FVjzC0iesDMDzu6MAxvM/PdHkAQBOeJ6DWA6yLyLK4Frr6ysrKv1WpNGWMqSqmK1voNEdUiAVprS0RjzFwfJLxb44Lb32UiutMD0Fo/IqIvzPwyabjTtwFuz9ADCMPwirV2QkTc5iUe3eGRAK11hYimmXkhabrb0CjPXy3SWldF5HTS8Dj9xl/k+/6J4eHhcWa+FGdIWt8AuCVaa1lExpMGxOk7gLIx5nCxWLwRZ0ha7wD2A3AtmkgaEKffPMla6zkRORNnSFrvBvzIZDLH8/n8r6Qh/fSbgDAMr1lrR0Xk3rYA2kd91vO8p4VCYeZ/IGEYngUwycwnO/6e29RddiIy0EO0dRJa67ox5phSarEf4AiABSI6x8yzg6xkdXV1d7PZnPM87627Hro9kTNdWlramcvlqtbamUwm8yqfz/tRoOXl5bFsNntxaGjocqvVulkqld5t1cU9mfeJyF0fowDeE9EnF2CM2UNEBwFkAbwQkef/WulAvfZ9v5hOp48aY9zDD2vtdwB1EanGtXAgQFxIv/ofVZjkGZowNL0AAAAASUVORK5CYII=) no-repeat;
  display: inline-block;
  position: relative;
  left: 34px;
  cursor: pointer;
}
.xxxx .divide{
  display: inline-block;
  width: 1px;
  height: 20px;
  background-color: #d8d8d8;
  border-radius: 1px;
  margin: 0 24px;
  opacity: 0.5;
  top: 3px;
  position: relative;
}
.teacher3{
  position: absolute;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  border-radius: 0 4px 4px 0;
  transform: scale(0.7);
  transform-origin: left bottom;
}
.teacher3 p{
  margin: 0;
  text-align: center;
  border-top: 1px solid #797979;
  color: #d6d5d5;
  font-size: 12px;
}
.teacher2{
  position: absolute;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  border-radius:0 4px 4px 0;
  font-size: 22px;
}
.teacher2 p{
  margin: 0;
  text-align: center;
  border-top: 1px solid #797979;
  padding: 6px 0;
  color: #d6d5d5;
}
.editImgDialog{
  width: 100%;
  height: 100%;
}
.editImgDialog .image-container{
  width: 100% !important;
  display: flex !important;
  justify-content: center;
  align-items: center;
  height: fit-content !important;
}
.editImgDialog .image-container3{
  display: flex !important;
  align-items: center!important
}
.editImgDialog .image-container img{
  width: 100% !important;
  height: auto !important;
}
.editImgDialog .image-container3 img{
  width: 100%!important;
  height: auto!important;
}
.paper-list-container .image-container2 img,.paper-list-container .image-container2 .el-image{
  height: 100%;
  width: auto;
}
.paper-list-container .image-container img,.image-container .el-image{
  width: 100%;
  height: auto;
}
.paper-list-container .image-container{
  position: relative;
  display: inline-block;
  width:220px;
  height: 162px;
  .image{
    width: 100%;
    img{
      width: 100%;
      height: auto;
    }
  }
}
.paper{
  border: 1px solid #caccd4;
}
.id-number{
  text-align: left !important;
}
.paper-list-container .image-container2 {
  position: relative;
  display: inline-block;
  width: fit-content;
  height: 162px;
  text-align: center;
  .image{
    height: 100%;
    img{
      height: 100%;
      width: auto;
    }
  }
}
.pfList{
  position: absolute;
  left: 0;
  top: 0;
  height: calc(100% - 22px);
  border-left: 1px solid #ccc;
}
.pfList .box{
  display: flex;
  flex-direction: column;
  padding: 0;
  height: 100%; /* 必须设置高度, 否则就垂直一列排完了 */
  flex-wrap: wrap;
  width: 80px;

}

.pfList .box .span{
  width: 80px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  color: #000;
  font-size: 40px;
  cursor: pointer;
  background: #fff;
  padding: 4px;
}
.pfList .box .span .btn{
  border: 1px solid #ccc;
  height: 44px;
  line-height: 44px;
  font-size: 20px;
  border-radius: 2px;
  color: #409eff;
}
.pfList .box .span .btn:hover{
  background: #409eff;
  color: #fff;
}
.hh{
  height: 44px;
  position: relative;
  min-width: 100px;
  text-align: center;
  padding-right: 30px;
}
.hh .qj{
  position: absolute;
  right: 0;
  top: 0;
  height: calc(100%);
  width: 22px;
  color: #409EFF;
  border-left: 1px solid;
}
.hh .qj>div{
  height: 40%;
  line-height: 17px;
}
.hh .el-progress{
  position: absolute;
  bottom: 0;
  width: calc(100% - 22px);
  left: 0;
}
.el-tag--dark .qj{
  color: #fff;
}
.el-tag--dark .el-progress-bar{
  border-top:1px solid #e8f1f9
}
.hh .el-progress-bar__outer{
  border-radius: 0;
  height: 14px !important;
  background: #9bcafb !important;
}
.hh .el-progress-bar__inner{
  border-radius: 0;
  max-width: 100% !important;
  height: 14px;
  background: #409EFF;
}
.hh p{
  height: 28px;
  line-height: 28px;
  font-size: 14px;
}
.zcz sup{
  border-radius: 3px;
}
.his sup{
  background: #35ce96;
  height: 30px;
  line-height: 30px;
  border: none;
  width: 30px;
  display: block !important;
  border-radius: 0;
}
.his sup:after{
  content: "";
  width: 1px;
  position: absolute;
  height: 17px;
  left: 2px;
  top: 8px;
  background: #fff;

}
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
      right: 90px;
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
      right: 95px;
    }
    .edit-level {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1;
      height: 100%;
      width: 80px;
      padding: 10px;
      background: rgba(255,255,255,.2);
      .level {
        width: 60px;
        text-align: center;
        margin: 0;
        margin-bottom: 10px;
        background: #fff;
        color: #409EFF;
        font-size: 18px;
      }
      .level:hover{
        background: #409EFF;
        color: #fff;
      }
      .level.active{
        background: #409EFF;
        color: #fff;
      }
    }
    .image-mark-text {
      background-color: rgba(0, 0, 0, 0.5);
      color: #fff;
      text-align: center;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      cursor: pointer;
      width: calc(100% - 80px);

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
.editImgDialog .el-dialog--center{
  margin-top: 0 !important;
  height: 100%;
}
.editImgDialog .el-dialog--center .el-dialog__body,.editImgDialog .el-dialog--center .el-dialog__body>div{
  height: 100%;
}
.editImgDialog .el-dialog--center .el-dialog__body .el-image{
  height: 100%;
  width: fit-content;
}
.editImgDialog .el-dialog--center .el-dialog__body .el-image .el-image__inner{
 width: auto;
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
  align-items: center;
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
          right: 26px;
          z-index: 9;
          .level {
            padding: 6px;
            line-height: 20px;
            cursor: pointer;
            color: #fff;
            font-size: 12px;
            width: 68px;
            background-color: #35ce96;
            border-radius: 0 0 0 10px;
            outline: none;
            height: 31px;
            display: inline-block;
            text-align: center;
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
          z-index: 8;
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
