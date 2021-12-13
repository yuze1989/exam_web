<template>
  <div id="marking-area"  :class="sf">
    <div class="bottom">
      <div class="left2">
        <el-button class="back" type="text" style="font-weight: 700" @click="sfC">
          展开
        </el-button>
        <div style="padding: 11px;
    color: #606266">评级数据</div>
      </div>
      <div class="left">
        <div class="left-top">
          <h3 style="margin-bottom: 10px">
            打分进度
            <el-button style="height: 33px;font-weight: 700" class="back" type="text" @click="sfC">
              隐藏
            </el-button>
          </h3>
          <div v-loading="jinDuLoad">
            <div class="cards">
              <div class="card no">
                <div class="title">待打分  <span class="number">{{ NoScore }}</span></div>
              </div>
              <div class="card done">
                <div class="title">已打分 <span class="number">{{ Score }}</span></div>

              </div>
            </div>
            <div class="cards">
              <div class="card no">
                <div class="title">待评级 <span class="number">{{ NoGrade }}</span></div>
              </div>
              <div class="card done">
                <div class="title">已评级 <span class="number">{{ Grade }}</span></div>
              </div>
            </div>
          </div>
          <h3 style="margin: 0 0 10px 0">分组数据 <span :class="{active:ChangeGrade=='仲裁组','zc_t':true}" @click="flClick('仲裁组')">仲裁组：{{ zcNumber }}</span></h3>
          <el-button type="primary" style="width: 100%;margin-bottom: 7px;color: #409eff; background:#fff" :class="{active:ChangeGrade=='all','Acard':true}" @click="flClick('all')">全部 {{allLength}}</el-button>
          <div :class="class3" :style="{height:classH}">
            <div
                v-for="level in xxList"
                :key="level.name"
                :class="{active:ChangeGrade==level.name,'card':true}"
                @click="flClick(level.name)"
                @contextmenu.prevent="openMenu($event,level)"
            >
              <div>
                <span class="primary">{{ level.name }}类</span>
                <span style="margin-left: 6px">{{ level.count || 0 }} / {{ level.all || 0 }}</span>
              </div>
              <div style="position: relative">
                <el-progress
                    text-inside
                    :stroke-width="4"
                    :percentage="level.percentage || 0"
                >
                </el-progress>
                <span class="jd" >{{level.percentage || 0}}%</span>
              </div>

            </div>
            <div class="card" v-if="xxList.length%2==1" style="opacity: 0">xxx</div>
          </div>

          <div class="left-bottom" :style="{height:xzH}">
			  <!--          已打分、未打分-->
			            <div class="tags" style="position: absolute;top: -40px;">
			              <el-tag
			                  v-for="(item, index) in scoreList"
			                  :key="index"
			                  @click="handleScore(item.key, index)"
			                  :effect="item.active ? 'dark' : 'light'"
			                  size="medium"
			                  class="common-mr pointer"
			                  style="margin-right: 7px;color: #303133;border-color: #557dff"
			              >
			                {{ item.name }}
			              </el-tag>
			            </div>
            <div class="left-bottom-left">
              <h3 style="margin-bottom: 6px">评分细则
                <i v-if="xzH=='auto'" class="el-icon-arrow-down" style="cursor: pointer;" @click="zoom"></i>
                <i v-if="xzH!='auto'" class="el-icon-arrow-up" style="cursor: pointer;" @click="enlarge"></i>
              </h3>
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
              <h3 style="margin: 0 0 6px 0">范例图 <span style="font-size: 12px;">（点击查看大图）</span></h3>
              <div class="examples-img">
                <el-image
                    style="width: 190px; height: 200px"
                    fit="cover"
                    :src="levelDescription.demoUrl"
                    :preview-src-list="[levelDescription.demoUrl]">
                  >
                  <div slot="placeholder" class="image-slot">请选择评级</div>
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
              <div class="level-description" v-if="currentRuleLevel">
                <h3 style="margin-bottom: 6px">{{ currentRuleLevel }}类卷</h3>
                <p class="word-wrap" style="height: 80px; overflow: auto">
                  {{description}}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--      右侧 begin-->
      <div class="right">
        <!--        视图区 begin-->
        <div class="rl" v-loading="listLoad" ref="rl" id="rl">
          <!-- 主体瀑布流区域，无限滚动 begin-->
          <ul class="sjList" :style="{position: 'absolute',width: 100/paperL.length+'%',left:b*100/paperL.length+'%'}" v-for="(a,b) in paperL">
            <!--            试卷单张 begin-->
            <li v-for="(item,index) in a" class="dsj"  v-if="item.is_show != 2 && ((is_gx && item.active) || !is_gx)" >
              <el-card :body-style="{ padding: '0px'}" style="text-align: center">
                <!-- 图片懒加载 -->
                <div @click="sjClick(a,index,item)" @dblclick="yl_click(a,index,item)" :class="{imgBox:true,active:item.active,active2:lie>3}">
                  <div class="teacher3" v-if="item.paperTeachers && item.paperTeachers.length > 0">
                    <h3 style="text-align: center;color: rgb(222 222 222);font-size: 14px;padding: 4px;margin: 0">评级记录</h3>
                    <p v-for="(a,index) in item.paperTeachers">{{a.username}}:{{a.originalGrade}}</p>
                  </div>
                  <el-badge value="仲裁" class="zcz" style="position: absolute;top: 0;right: 21%;z-index: 999;" v-if="item.isArbitrate==1"></el-badge>
				  <div :ref="'NW'+item.id" style="position: relative;">
					  <div :class="hideClass()" v-if="hideSite>=0" :style="{width: width+'%',height: height+'%',backgroundImage: 'url('+zgtUrl+')'}"></div>
					  <el-image @load='imgLoad(item)' :src='item.imgas' class='image' :key='item.imgas' lazy>
					    <!-- 加载前占位 -->
					    <div slot="placeholder" class="image-slot" style="text-align: center">
					      <el-empty :image-size="200" description="加载中" image="https://topexam.oss-cn-hangzhou.aliyuncs.com/upload/20211116/1460453779949412353.png"></el-empty>
					    </div>
					    <!-- 加载失败占位 -->
					    <div slot="error" class="image-slot">
					      <el-empty :image-size="200"></el-empty>
					    </div>
					  </el-image>
				  </div>
                </div>
                <div :class="{box_btom:true,box_x:lie>=5?true:false}">
				<span :class="{ffs:true,box_x:lie>=5?true:false}">{{ item.grade}}<span v-if="item.score != null">:{{item.score}}</span></span>
				  <span class="rotateC">   
					<i class="el-icon-refresh-left" style="cursor: pointer;margin-right: 10px;" @click="m_c_rotate(-90,item)"></i>
					<i class="el-icon-refresh-right" style="cursor: pointer" @click="m_c_rotate(90,item)"></i>
				</span>
                  <span :class="{wdpj:true,box_x:lie>=5?true:false}" v-if="item.originalGrade">{{item.originalGrade}}</span>
                </div>
              </el-card>
            </li>
            <!--            试卷单张 end-->
          </ul>
          <!-- 主体瀑布流区域，无限滚动 end-->
          <div v-if="paperList.length == 0" style="height: 100%;text-align: center;background: #fff">
            <img src="@/assets/no_img2.svg" alt="" style="width:50%;margin-top: 10%">
          </div>
          <!--分页栏-->
          <el-col :span="24" class="toolbar fenye" :style="{width:rl_width+'px'}">
            <el-pagination
                @size-change="getList(4)"
                @current-change="getList(4)"
                :current-page.sync="page"
                :page-sizes = "[40]"
                :page-size="size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalItem">
            </el-pagination>
          </el-col>
        </div>
        <!--        视图区 end-->
        <!--        右侧 功能区 begin-->
        <div class="rr">
          <div style="height: 34px;background: #fff;margin-bottom: 6px;padding-top:2px;border-radius: 4px;position: relative;text-align: center">
            <el-row>
              <el-col :span="12" class="gtBox">
                <span class="gt_l">列</span>
                <el-input-number  class="gt_r" size="mini" controls-position="right" v-model="lie" @change="getList(3)" :min="1" :max="6" label="列"></el-input-number>
              </el-col>
              <el-col :span="12" class="gtBox">
                <span class="gt_l">行</span>
                <el-input-number class="gt_r" size="mini" controls-position="right" v-model="hang" @change="getList(3)" :min="1" :max="100" label="行"></el-input-number>
              </el-col>
            </el-row>


          </div>
          <div style="height: 34px;background: #fff;margin-bottom: 6px;border-radius: 4px;position: relative;text-align: center">
            <el-checkbox v-model="is_wp" @change="zcChange(3)" >只看未评级</el-checkbox>
          </div>
          <div style="height: 34px;background: #fff;margin-bottom: 6px;border-radius: 4px;position: relative;text-align: center">
            <el-checkbox v-model="is_gx" @change="gx_change">只看已勾选</el-checkbox>
          </div>
          <div style="height: 34px;background: #fff;margin-bottom: 6px;border-radius: 4px;position: relative" v-if="rule==0 || rule==3">
            <el-row>
              <el-col :span="12" style="text-align: center">
                <el-checkbox v-model="isGd"  @change="zcChange(1)" >从高到低</el-checkbox>
              </el-col>
              <el-col :span="12" style="text-align: center">
                <el-checkbox v-model="showT" @change="zcChange(2)" >评级记录</el-checkbox>
              </el-col>
            </el-row>
          </div>
          <div style="height: 34px;background: #fff;margin-bottom: 6px;border-radius: 4px;position: relative;text-align: center;line-height: 34px;color: #557dff">
            已勾选：{{gxNum}}
          </div>
          <div class="right-bottom" v-loading="listLoad">
            <div class="right-btns" v-if="!isStopGrade">
              <el-button
                  :disabled="rule==0"
                  v-for="(level, index) in levelList"
                  :key="level.name"
                  @click="switchCurrentLevel(index)"
              >
                <p style="margin: 0">{{ level.name}} / {{level.min}} - {{level.max}}</p>
              </el-button>
            </div>
            <div class="right-btns" v-if="isStopGrade" style="width: 50px;border-right: 1px solid #ddd;padding-right: 10px;box-sizing: content-box;height: 100%">
              <el-button
                  :disabled="rule==0"
                  v-for="(level, index) in levelList"
                  :key="level.name"
                  :class="{active:level.name == xz_fl[0]}"
                  @click="switchCurrentLevel(index)"
              >
                <p style="margin: 0">{{ level.name}}</p>
              </el-button>
            </div>
            <div class="fs_box" v-if="isStopGrade" style="width:100%">
              <div class="btn" v-for="(item,index) in (scoreObj[xz_fl[0]] || [])"   @click="setFs(item,2)">
                {{item}}
              </div>
            </div>
          </div>
          <el-button
              v-if="(rule==3 || rule == 0) && !isStopGrade"
              type="primary"
              style="position: absolute;bottom: 54px;width: 100%;background: #fb0005;border-color: #fb0005;"
              @click="stopPj">停止评级</el-button>
        </div>
        <!--        右侧 功能区 end-->
      </div>
      <!--      右侧 end-->

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
    <!--    图片预览-->
    <div tabindex="-1" class="el-image-viewer__wrapper tpyl" v-if="yl_show && allTotal != 0" :style="{zIndex:'20000',width:isStopGrade?'85%':'90%'}">
      <div class="pos-tip" v-if="isHide != 1"> <span>  {{allTotal?thisCurrent:0 }} </span> / {{ allTotal }}</div>
      <div class="el-image-viewer__mask"></div>
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
      <el-badge value="仲裁" class="zcz zcz02" style="position: absolute;top: 0; z-index: 998;right: 0px;" v-if="paperList[currentPosition].isArbitrate == 1"></el-badge>
      <span class="el-image-viewer__btn el-image-viewer__close" style="z-index: 999" @click="closeD"><i class="el-icon-close"></i></span>
      <span class="el-image-viewer__btn el-image-viewer__prev" v-if="thisCurrent != 1" @click="c_page(-1)"><i class="el-icon-arrow-left"></i></span>
      <span class="el-image-viewer__btn el-image-viewer__next" v-if="thisCurrent != allTotal" @click="c_page(1)"><i class="el-icon-arrow-right"></i></span>
            <div class="el-image-viewer__btn el-image-viewer__actions" style="z-index: 9">
              <div class="el-image-viewer__actions__inner">
                <i class="el-icon-zoom-out" style="cursor: pointer" @click="m_c_scale(-0.1)"></i>
                <i class="el-icon-zoom-in" style="cursor: pointer" @click="m_c_scale(0.1)"></i>
                <i class="el-image-viewer__actions__divider"></i>
                <i class="el-image-viewer__actions__divider"></i>
                <i class="el-icon-refresh-left" style="cursor: pointer" @click="m_c_rotate(-90,2)"></i>
                <i class="el-icon-refresh-right" style="cursor: pointer" @click="m_c_rotate(90,2)"></i>
              </div>
            </div>
            <div class="teacher" style="background: #fff" v-if="paperList[currentPosition].paperTeachers.length > 0">
              <h3 style="text-align: center;color: #303133;margin: 10px">评级记录</h3>
              <p style="color: #303133" v-for="(item,index) in paperList[currentPosition].paperTeachers">{{item.username}}:{{item.originalGrade}}</p>
            </div>
            <div class="el-image-viewer__canvas imgWidth" >
              <el-image :src="paperList[currentPosition].imgas" :class="className" :style="m_style"  @load="change1" @mousedown="handleImageMouseDown" draggable="false" @wheel.stop="wheelScale">
                <!-- 加载前占位 -->
                <div slot="placeholder" class="image-slot" style="text-align: center">
                  <el-empty :image-size="800" description="加载中" image="https://topexam.oss-cn-hangzhou.aliyuncs.com/upload/20211116/1460453779949412353.png"></el-empty>
                </div>
                <!-- 加载失败占位 -->
                <div slot="error" class="image-slot">
                  <el-empty :image-size="800" description="加载失败"></el-empty>
                </div>
              </el-image>
            </div>
    </div>
    <div tabindex="-1" class="right_btn" v-if="paperList.length>0"  v-show="yl_show && !isStopGrade" v-loading="listLoad">
      <div class="right-btns">
        <p><img src="@/assets/bg_logo1.svg" style="width: 100%" alt=""></p>
        <el-button
            :disabled="rule==0"
            v-for="(level, index) in levelList"
            :key="level.name"
            @click="switchCurrentLevel(index,2)"
        >
          <p style="margin: 0;position: relative;top: -1px;text-align: left;line-height: 20px;"><span style="font-size: 20px;position: relative;
    top: 2px;
    left: -4px;">{{ level.name}}</span> / {{level.min}} - {{level.max}}</p>
        </el-button>
      </div>
    </div>
    <div tabindex="-1" class="right_btn"v-if="paperList.length>0"  v-show="yl_show && isStopGrade" v-loading="listLoad" style="width: 15%">
      <div class="right-btns" style="height: 100%">
        <p><img src="@/assets/bg_logo1.svg" style="width: 100%" alt=""></p>
        <el-row style="height: calc(100% - 70px)">
          <el-col :span="8" style="height: 100%;border-right: 1px solid #ddd;padding-right: 10px;">
            <el-button
                :disabled="rule==0"
                style="text-align: center"
                v-for="(level, index) in levelList"
                :key="level.name"
                :class="{active:paperList[currentPosition].grade==level.name}"
                @click="switchCurrentLevel(index,2)"
            >
              <p style="margin: 0;position: relative;top: -1px;text-align: center;line-height: 20px;"><span style="font-size: 20px;position: relative;top: 2px;">{{ level.name}}</span></p>
            </el-button>
          </el-col>
          <el-col :span="16" class="fs_btn">
            <div class="btn" v-for="(item,index) in (scoreObj[paperList[currentPosition].grade] || [])"   @click="setFs(item)">
              {{item}}
            </div>
          </el-col>
        </el-row>

      </div>
    </div>
<!--    停止评级-->
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
    <!--    全选弹出-->
    <div v-if="(rule!=0) && tck" class="tck" :style="{position: 'fixed',left:xxP.x+'px',top:xxP.y+'px'}">
      <div v-for="(item,index) in xxList" @click="changePJ(item)">调整评级为 / {{item.name}}</div>
    </div>
    <!--    右键取消全选-->
    <div v-if="(rule!=0) && tck2" class="tck" :style="{position: 'fixed',left:xxP.x+'px',top:xxP.y+'px'}">
      <div @click="changePJ2()">取消全选</div>
    </div>
<!--    管理员验证-->
    <el-dialog
        :visible.sync="dialogFormVisible2"
        width="50%"
        center
        style="z-index: 200001"
    >
      <div slot="title">管理员验证</div>
      <el-form
          label-width="120px"
          label-position="right"
          class="demo-ruleForm"
          center
          ref="delForm"
      >
        <p style="    text-align: center;color: red;font-size: 20px;padding: 0;margin: 0;margin-bottom: 15px;">该场考试已经停止评级，请谨慎操作！</p>
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
  </div>
</template>
<script>
import vueImgViewer from "./img-viewer";
import { basicRequest } from "../../utils/request";
import {
  getImgUrlIP,
} from "@/api/paper";
export default {
  name: "markingArea1",
  components: {
    vueImgViewer,
  },
  data: () => {
    return {
      kgBl:1,
      m_style:'transform: scale(1) rotate(0deg)',
      m_scale:1,
      pages:0,
      m_rotate:0,
      yl_show:false,
      sf:"normal marking-area",
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
      page:1,
      maxScore: 100,
      paperStopDialogVisible: false,
      targetUrl:'', // 放大的图片
      clickTimer:null,
      width:30,//遮盖宽
      height:10,//遮盖高
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
      classH:"calc(100% - 751px)",
      isNew:true,
      jl_page:1,
      className:"",
      hideName:"",
      bj:1,
      X:0,
      Y:0,
      x1:0,
      y1:0,
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
      totalItem:0,
      isHide:0,
      zcNumber:0,
      xzH:'auto',
      size:100,
      hang:20,
      lie:2,
      paperL:[],
      gxNum:0,
      time:null,//定时器
      allTotal:0,
      scoreList: [
        { key: 0, name: "未打分", total: 0, active: false },
        { key: 1, name: "已打分", total: 0, active: false },
      ],
      ChangeGrade:"all",//选中的分组
      changeScore:"",//是否打分
      img_w:"800",//图片宽度
      zgtUrl:require("@/assets/zgt.png"),//遮盖图
      rl_width:0,//分页宽度
      is_wp:true,//只看未评级
      isGd:false,//从高到低
      dialogFormVisible:false,//停止评级弹窗
      admin_username:"",//管理员账号
      admin_password:"",//管理员密码
      showT:false,//是否展示评级记录
      is_df:true,//是否打分
      isStopGrade:false,//是否停止评级
      tck:false,
      tck2:false,
      box_h:380, //图片盒子高度
      xxP:{
        x:0,
        y:0,
        name:"",
      },
      xz_fl:[],//选中的分类
      xz_list:[],//选中的分类列表
      scoreObj:{},//分数对象
      dialogFormVisible2:false,
      admin_username2:"",
      admin_password2:"",
      params:"",
      is_gx:false,
      is_one:1,
	  scrollTop:0,//卷去的高度
	  nw_t:sessionStorage.getItem("aaa"),
	  all_cList:[],
    };
  },
  computed:{

  },
  mounted() {
    this.rl_width = document.getElementsByClassName('rl')[0].clientWidth;
    const that = this
    window.onresize = () => {
      return (() => {
        that.rl_width = document.getElementsByClassName('rl')[0].clientWidth;
      })()
    }
    //
    // if (location.href.indexOf("#reloaded") == -1) {
    //   location.href = location.href + "#reloaded";
    //   location.reload();
    // }
    window.addEventListener("click", this.hideR);

    this.setHeight()

    setInterval(function(){
		if(that.nw_t != sessionStorage.getItem("aaa")){
			that.nw_t = sessionStorage.getItem("aaa");
			sessionStorage.setItem('aaa',that.nw_t)
			that.rl_width = document.getElementsByClassName('rl')[0].clientWidth;
			that.paperList.forEach((item,index)=>{
				let div = that.$refs['NW'+item.id];
				let css = `transform:rotate(0deg);width:100%;height:auto;position:relative;display:flex;`
				div[0].style=css;
				if(item.rotate != 0){
					let src= item.imgas;
					item.imgas="";
					that.xxx(item,src)
				}
			})
		}

		
	},1000)

  },
  beforeDestroy() {  // 实例销毁之前对点击事件进行解绑
    window.removeEventListener('click', this.hideR);
  },
  created() {
    //获取用户名
    this.account = sessionStorage.getItem("user")
        ? JSON.parse(sessionStorage.getItem("user")).account
        : "";
    //初始化
    this.init();
    let that = this;
    window.onresize = function (){
      that.setHeight();
    }
  },
  methods: {
    //设置高度
    setHeight(){
      this.paperList.forEach((item,index)=>{
        console.log(item);
      })
    },
	  imgLoad(item){
		  this.rl_width = document.getElementsByClassName('rl')[0].clientWidth/1
		  let div = this.$refs['NW'+item.id];
		  let div_W = div[0].getElementsByClassName("image")[0].clientWidth; //原始盒子宽度
		  let div_H = div[0].getElementsByClassName("image")[0].clientHeight;//原始盒子高度
		  if((item.rotate/90)%2 == 0){
			  	let css = `transform:rotate(${item.rotate}deg);width:${div_W}px;height:${div_H}px;position:relative;`
			 	div[0].style=css;
		  }else{
			 let div_nh = div_W;//旋转后宽变成高
			 let bl = div_W/div_H;//宽高比
			 let div_nw = div_nh*bl;//新宽度
			 let left = (div_H - div_W)*bl/2;
			 let css = `transform:rotate(${item.rotate}deg);width:${div_nw}px;height:${div_nh}px;position:relative;left:${left}px;top:${left}px`
			 div[0].style=css;
			 div[0].parentNode.style.height = div_H+"px";
		  }
	  },
    // 初始化
    init(){
      this.getJinDu();//获取进度
      this.queryPaperList(); //获取分组数据
      this.renderMarkingRules(); //获取规则
      this.getList();//获取试卷列表
    },
    //获取试卷列表
    getList(type,sj){
		if(this.is_gx){
			let n = this.lie;
			this.paperL = []
			for(let i = 0 ; i < n; i++){
			  this.paperL.push([])
			}
			let bList = this.all_cList
			if(this.isGd){
			  bList.sort(function(a,b){
			    return b.score - a.score
			  });
			}
			// this.totalItem = this.all_cList.length/1; //总数
			bList.forEach((item,index)=>{
			  let i = index%n;
			  item.wz = index;
			  this.paperL[i].push(item)
			})
			this.allTotal = this.all_cList.length;
			this.paperList = this.all_cList;
		}else{
		
			if(type != 4){
				this.all_cList = [];
			}
			this.gxNum = this.all_cList.length;
			if(this.ChangeGrade != 0){
			  this.is_wp = false;
			}
			this.listLoad = true;
			this.size = this.hang/1 * this.lie/1;
			let url = '/exampaper/examCorrectPaperListAll'
			let data = {
			  "course": this.$route.query.course,
			  "examCode": this.$route.query.examNo,
			  "examId":this.$route.query.examId,
			  size:this.size,
			  "grade": this.ChangeGrade,
			  paperScore:this.changeScore,
			  current:this.page,
			  "examPaperId": "",
			  "provinceCode": "",
			  "schoolId": "",
			  "score": "",
			  "teacherId": "",
			}
			if(this.showT){
			  data.showTeacherGrade = 1;
			}
			let n = this.lie;
			this.paperL = []
			for(let i = 0 ; i < n; i++){
			  this.paperL.push([])
			}
			if(type != 4){
					this.xz_fl = [];
					this.all_cList = [];
					this.gxNum = 0; //勾选初始化
				}

			  this.$axios.post(url,data).then((res) => {
			    let bList = res.result.list;
			    if(this.isGd){
			      bList.sort(function(a,b){
			        return b.score - a.score
			      });
			    }
			    this.totalItem = res.result.total/1; //总数
			    bList.forEach((item,index)=>{
			      let i = index%n;
			      item.wz = index;
			      this.paperL[i].push(item)

				  if(type == 4){
					  this.all_cList.forEach((item2,index2)=>{
					  		if(item2.id == item.id){
					  			 item.active = true;
					  		}
					  })
				  }
			    })
			    //是否停止评级了
			    if(res.result.isStopGrade == 0){
			      this.isStopGrade = false;
			    }else{
			      this.isStopGrade = true;
			    }
			    if(this.isStopGrade && res.result.list.length==0 && this.ChangeGrade == "" && this.isOne == 1){
			      this.ChangeGrade = "all"
			      this.isOne = 2;
			      this.getList()
			      return false
			    }
			    this.allTotal = res.result.total;
			    this.paperList = res.result.list;
			    if(type == -1){
			      this.currentPosition = this.page * this.size -1; //初始定位
			      this.thisCurrent =this.page * this.size;//初始定位
			    }else if(type == 1){
			      this.currentPosition = 0; //初始定位
			      this.thisCurrent =1+((this.page-1) * this.size);//初始定位
			    }
			    if(this.currentPosition >= this.allTotal && this.allTotal > 0){
			      this.currentPosition =  this.allTotal -1 ;
			      this.thisCurrent = this.allTotal;//初始定位
			    }
				if(sj == "scroll"){
					let that = this;
					setTimeout(function(){
						that.$refs.rl.scrollTop = that.scrollTop;
					},5)

				}

			
			    this.listLoad = false;
			    this.markDlgVisible = false;
			  });
		}  
    },
    //获取规则
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
          if(res.result.list[0].maskWidth){
            this.width = res.result.list[0].maskWidth;
          }
          if(res.result.list[0].maskHeight) {
            this.height = res.result.list[0].maskHeight;
          }
          this.scoreObj = {};
          resultList.forEach((item,i)=>{
            if(item.grade){
              tempGradeList.push({
                key: i,
                name: item.grade,
                percentage:item.percentage || 0,
                min:item.scoreStart,
                max:item.scoreEnd
              })
            }
            let arr = [];
            for(let i = item.scoreEnd; i >= item.scoreStart; i--){
              arr.push(i);
            }
            this.scoreObj[item.grade] = arr;
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
          this.isHide = res.result.list[0].isHide;
          if(this.isHide == 1){
            this.sf = "sx marking-area"
            let that =this;
            setTimeout(function (){
              that.rl_width = document.getElementsByClassName('rl')[0].clientWidth;
            },10)
          }

          // this.levelDescription.description = this.descriptionLevelList[0].imgUrlDesc;
          this.currentRuleLevel = this.descriptionLevelList[0].grade;
          this.description = this.descriptionLevelList[0].imgUrlDesc;
          this.hideSite = this.descriptionLevelList[0].hideSite;
          sessionStorage.setItem("hideSite",this.hideSite);
          let hideImg = res.result.list[0].maskUrl;
          if(hideImg == null || hideImg == ""){
            hideImg = require("@/assets/zgt.png") //默认遮盖图
          }
          this.zgtUrl = hideImg;
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
          if(hideImg != null){
            var sty=document.createElement('style');
            sty.innerText=`
          .hidebox:before{background-image:url(\'${hideImg}\')}
        `;
            document.body.appendChild(sty);
          }
        }
      });
    },

    // -----------------------------------------------功能区----------------------------------------------------
    //只看勾选
    gx_change(){
      this.getList(4)
    },
    //打分
    setFs(item,type){
      let arr = []
      if(type == 2){
        this.all_cList.forEach((item,index)=>{
          if(item.active){
            arr.push(item.id)
          }
        })
        if(arr.length <= 0){
          this.$message({
            type: 'error',
            message: '请勾选需要评级的试卷！'
          });
        }
      }else{
        arr = [this.paperList[this.currentPosition].id]
      }
      let params = {
        "course": this.$route.query.course,
        "examCode": this.$route.query.examNo,
        score:item,
        teacherName:localStorage.getItem("user_name"),
        examPaperIds:arr,
        examId:this.$route.query.examId,
      }
      this.$axios.post("/exampaper/batchUpdateScore",params).then((res) => {
        if(res.code == 200) {
          if(arr.length == res.result.length){
            if(res.result[0].indexOf('停止阅卷') != -1){
              this.$message({
                type: 'error',
                message: '该场考试已经停止阅卷！'
              });
            }else if(res.result[0].indexOf('停止评级') != -1){
              this.$message({
                type: 'error',
                message: '该场考试已经停止评级！'
              });
            }else{
              this.$message({
                type: 'error',
                message: res.result[0].substring(res.result[0].indexOf(":"),res.result[0].length)
              });
            }
          }else{
            if(type == 2){
              this.$message.success(`试卷分数批量更新成功！`);
			  this.paperList.forEach((a,index)=>{
				  if(a.active){
					  a.score = item;
					  a.active = false;
					  if(this.changeScore === 0){
						a.is_show = 2;  
						this.paperL.forEach((e,b)=>{
							e.forEach((c,d)=>{
								if(e[d].id == a.id){
								this.$set(e[d],'is_show',2);
								this.totalItem -=1;
							}
						})
						})
					  }


				  }
			  })
			 this.$refs.rl.scrollTop = document.querySelectorAll(".rl")[0].scrollTop/1 +1;
			  this.xz_fl = [];
			  this.all_cList = [];
			  this.gxNum = 0;
            }else{
              this.paperList[this.currentPosition].score = item;
              if(this.thisCurrent != this.allTotal){
                this.c_page(1)
                this.$message.success(`试卷分数更新成功！`);
              }else{
                this.$message.success(`试卷分数更新成功并且已经是最后一张！`);
              }
            }
            this.getJinDu()
          }

        }
      }).catch((error)=>{

      });
    },
    hideR(){
      this.tck = false;
      this.tck2 = false;
    },
    // 右键显示
    openMenu(e,item){
      e.preventDefault();
      this.tck = true;
      this.xxP.x  = e.clientX;
      this.xxP.y  = e.clientY;
      this.xxP.name = item.name;
    },
    // 右键显示2
    openMenu2(e){
      e.preventDefault();
      if(!this.showP){
        return false
      }
      this.tck2 = true;
      this.xxP.x  = e.clientX;
      this.xxP.y  = e.clientY;
    },
    // 分类右键点击
    changePJ2(){
      if(!this.showP){
        return false
      }
      this.paperList.forEach((item,index)=>{
        item.checked = false;
      })
    },
    //修改评级--停止评级后
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
      this.listLoad = true;
      this.$axios.post("/exampaper/batchUpdateGrade",params).then((res) => {
        if (res) {
          this.dialogFormVisible2 = false;
          this.$message.info(res.result[0].substring(res.result[0].indexOf(":"),res.result[0].length));
          let scrollTop = document.querySelectorAll(".rl")[0].scrollTop;
          this.scrollTop = scrollTop;
          this.getList('',"scroll")
          this.getJinDu();//获取进度
          this.queryPaperList(); //获取分组数据
        }
      }).catch((error)=>{
        this.getList();
        this.getJinDu();//获取进度
        this.queryPaperList(); //获取分组数据
      });
    },
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
                    if(res.result[0].indexOf('停止阅卷') != -1){
                      this.$message({
                        type: 'error',
                        message: '该场考试已经停止阅卷！'
                      });
                    }else if(res.result[0].indexOf('停止评级') != -1){
                      this.$message({
                        type: 'error',
                        message: '该场考试已经停止评级！'
                      });
                    }else{
                      this.$message({
                        type: 'error',
                        message: res.result[0].substring(res.result[0].indexOf(":"),res.result[0].length)
                      });
                    }
                  }else{
                    this.$message({
                      type: 'success',
                      message: '试卷评级批量修改成功!'
                    });
                  }
                  this.getList();
                  this.getJinDu();//获取进度
                  this.queryPaperList(); //获取分组数据
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
    // 分类左键点击
    flClick(item){
      this.yl_show = false;
      this.ChangeGrade = item;
      this.changeScore = "";
      this.scoreList.map((item, key) => {
        item.active = false;
      });
      this.getList()
    },
    // 试卷勾选
    sjClick(a,index,item){
      clearTimeout(this.time);  //首先清除计时器
      let that = this;
      this.time = setTimeout(() => {
        if(that.isStopGrade){
          //已经停止评级不许跨区域
          if(that.xz_fl.length >0 && that.xz_fl.indexOf(item.grade) == -1){
            this.$message.warning(`请选择同分类试卷进行操作！`);
            return false
          }
        }

        if(item.active){
          that.$set(a[index],'active',false);
          that.all_cList.forEach((a,index)=>{
            if(item.id == a.id){
              that.all_cList.splice(index,1)
            }
          })
        }else{
          that.$set(a[index],'active',true);
          that.all_cList.push(item)
        }
        that.xz_fl = [];
        that.all_cList.forEach((a,b)=>{
          that.xz_fl.push(item.grade)
        })

        that.gxNum = that.all_cList.length/1;
      }, 240);   //大概时间300ms
    },
    //双击全屏
    yl_click(a,index,item){
      this.m_rotate = 0;
      this.m_scale = 1;
      this.m_c_scale(0)
      clearTimeout(this.time);  //清除
      this.currentPosition = item.wz;
      this.thisCurrent =item.wz+1+((this.page-1) * this.size);
      this.yl_show = true;
    },
    // 已评分 / 未评分
    handleScore(value, index) {
      this.changeScore = value;
      this.scoreList.map((item, key) => {
        item.active = false;
        if (index === key) {
          item.active = true;
        }
      });
      this.getList();
    },
    //评分细则缩放
    zoom(){
      this.xzH = "33px"
      this.classH = 'auto'
    },
    enlarge(){
      this.xzH = "auto"
      this.classH = 'calc(100% - 751px)'
    },
    // 全屏关闭
    closeD(){
      this.yl_show=false;
    },
    // 大图左右
    c_page(value){
      //停止向左
      if(this.thisCurrent<=1 && value ==-1) {
        return
      }
      //停止向右
      if(this.thisCurrent >= this.allLength && value ==1){
        this.$message.warning(`已经是最后一张试卷了！`);
        return
      }
      //向右分页
      if(this.thisCurrent >= this.size*this.page && value ==1){
        this.page += 1;
        this.getList(1);
        return false;
      }
      //向左分页
      if(this.thisCurrent == this.size*(this.page-1)+1 && value ==-1){
        this.page -= 1;
        this.getList(-1);
        return false;
      }

      this.currentPosition += value;
      this.startPosition += value;
      this.thisCurrent += value;
      this.m_rotate = 0;
      this.m_scale = 1;
      this.m_c_scale(0)
    },
    // 停止评级
    stopPj(){
      if(this.NoGrade > 0){
        this.$message({
          type: 'error',
          message: '还有未评级的试卷！'
        });
        return false;
      }
      this.dialogFormVisible = true;
      this.admin_password = "";
      this.admin_username = "";
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
    // 点击A,B,C,D级
    switchCurrentLevel(index,type) {
      if(this.listLoad || this.markDlgVisible){
        return false;
      }
      this.currentLevel = this.gradeList[index].name;
      let arr = [];
      if(type == 2){
        arr.push(this.paperList[this.currentPosition].id)
      }else{
        this.all_cList.forEach((item,index)=>{
          if(item.active){
            arr.push(item.id)
          }
        })
        if(arr.length <= 0){
          this.$message({
            type: 'error',
            message: '请勾选需要评级的试卷！'
          });
        }
      }
      let obj = {
        examPaperIds:arr,
        examId:this.$route.query.examId,
        course: this.$route.query.course,
        grade:this.currentLevel,
        teacherName:localStorage.getItem("user_name")
      }
      if(this.isStopGrade && this.rule == 3){
        this.dialogFormVisible2 = true;
        this.admin_username2 = "";
        this.admin_password2 = "";
        this.params = obj;
      }else{
		  // this.listLoad = true;
        this.$axios.post('/exampaper/batchUpdateGrade',obj).then(res=>{
          if(res.code == 200){
            this.listLoad = false;
            if(arr.length == res.result.length){
			  if(res.result[0].indexOf('停止阅卷') != -1){
			    this.$message({
			      type: 'error',
			      message: '该场考试已经停止阅卷！'
			    });
			  }else if(res.result[0].indexOf('停止评级') != -1){
			    this.$message({
			      type: 'error',
			      message: '该场考试已经停止评级！'
			    });
			  }else{
			    this.$message({
			      type: 'error',
			      message: res.result[0].substring(res.result[0].indexOf(":"),res.result[0].length)
			    });
			  }
            }else{
              this.$message({
                type: 'success',
                message: '批量修改成功!'
              });
			  // let scrollTop = document.querySelectorAll(".rl")[0].scrollTop;
			  // this.scrollTop = scrollTop;
			  // this.getList('',"scroll")

              if(type == 2){
                // if(this.ChangeGrade == "仲裁组" || this.ChangeGrade=="all" || this.ChangeGrade=="0")
                this.c_page(1)
              }else{

              }
              this.paperList.forEach((a,index)=>{
                if(a.active){
                  if(this.ChangeGrade != "all" && this.ChangeGrade != this.currentLevel){
                    a.is_show = 2;
                    this.paperL.forEach((e,b)=>{
                      e.forEach((c,d)=>{
                        if(e[d].id == a.id){
                          this.$set(e[d],'is_show',2);
                          this.totalItem -=1;
                        }
                      })
                    })
                  }
                  a.grade = this.currentLevel;
                  a.active = false;

                  this.$refs.rl.scrollTop = document.querySelectorAll(".rl")[0].scrollTop/1 +1;
                }
              })
			  this.xz_fl = [];
			  this.all_cList = [];
			  this.gxNum = 0;
            }
            this.getJinDu();//获取进度
            this.queryPaperList(); //获取分组数据
          }
          this.aloading  = false;
        })
      }

    },
    // 滚轮缩放
    wheelScale(e) {
      let evt = window.event;
      evt.stopPropagation();
      evt.preventDefault();
      const RATIO = 700 // 实际缩放与缩放偏移量的系数
      let computedScale = this.m_scale - e.deltaY / RATIO
      this.m_scale = computedScale
      if(computedScale <= 0.1){
        return false;
      }
      if(computedScale >= 3){
        return false;
      }
      this.m_style = `transform:translate3d(${this.position.left}px, ${this.position.top}px, 0) scale(${this.m_scale}) rotate(${this.m_rotate}deg)`
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

      this.m_style = `transform:translate3d(${this.position.left}px, ${this.position.top}px, 0) scale(${this.m_scale}) rotate(${this.m_rotate}deg)`


    },
    handleImageMouseUp(e) {
      window.removeEventListener('mousemove', this.handleImageMouseMove)
      window.removeEventListener('mouseup', this.handleImageMouseUp)
    },

    change1(){
      this.position.left = 0;
      this.position.top = 0;
      this.m_style = `transform:translate3d(${this.position.left}px, ${this.position.top}px, 0) scale(${this.m_scale}) rotate(${this.paperList[this.currentPosition].rotate}deg)`
      const kjW = document.getElementsByClassName('tpyl')[0].offsetWidth; //网页可见区域宽度
      const kjH = document.getElementsByClassName('tpyl')[0].offsetHeight; //网页可见区域高度
      this.bj = kjW/kjH;
      //大图自适应
      let url = this.paperList[this.currentPosition].imgas;
      let image = new Image()
      image.src = url;
      let that = this;
      image.onload = function (){
        try {
          let img=new Image();
          img.src=that.paperList[that.currentPosition+1].imgas;
          let img2=new Image();
          img2.src=that.paperList[that.currentPosition+2].imgas;
          let img3=new Image();
          img3.src=that.paperList[that.currentPosition+3].imgas;
        }catch{

        }
        that.img_w = image.width;
        if(image.width>image.height){
          if(image.width/image.height > this.bj){
            if(that.hideSite == -1){
              that.className = "image-container"
            }else{
              that.className = "image-container hidebox hide"+that.hideSite
            }
          }else{
            if(that.hideSite == -1){
              that.className = "image-container2 "
            }else{
              that.className = "image-container2 hidebox hide"+that.hideSite
            }
          }
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
        }

      }

    },
    // 全屏右键

    m_c_scale(value){
      this.m_scale = this.m_scale/1 + value/1;
      this.m_style = `transform:translate3d(${this.position.left}px, ${this.position.top}px, 0) scale(${this.m_scale}) rotate(${this.m_rotate}deg)`
    },
    m_c_rotate(value,item){
		if(item){
			if(item == 2){
				let rotate = this.paperList[this.currentPosition].rotate/1 + value/1;
				this.$axios.post('/exampaper/updateExamPaperRotate?paperId='+this.paperList[this.currentPosition].id+"&rotate="+rotate).then(res=>{
					if(res.result){
						this.getList()
						this.paperList[this.currentPosition].rotate = rotate;
						this.m_style = `transform:translate3d(${this.position.left}px, ${this.position.top}px, 0) scale(${this.m_scale}) rotate(${this.paperList[this.currentPosition].rotate}deg)`
					}
				})
			}else{
				let rotate = item.rotate/1 + value/1;
				this.$axios.post('/exampaper/updateExamPaperRotate?paperId='+item.id+"&rotate="+rotate).then(res=>{
					if(res.result){
						
						let scrollTop = document.querySelectorAll(".rl")[0].scrollTop;
						this.scrollTop = scrollTop;
						let src = item.imgas;
						item.rotate = rotate;
						item.imgas = "";
						let that = this;
						setTimeout(function(){
							let div = that.$refs['NW'+item.id];
							let css = `transform:rotate(0deg);width:100%;height:auto;position:relative;`
							div[0].style=css;
							item.imgas = src;
						},10)
					}
				})
			}
			
		}
    },

    downC(e){
      this.x = e.clientX;
      this.y = e.clientY;
    },
    downU(e){
      this.x1 = e.clientX;
      this.y1 = e.clientY;
      if(Math.abs(this.x1 - this.x) > 10 || Math.abs(this.y1 - this.y) > 10){

      }else{
        if(e.target.className == "el-image__inner"){
          this.yl_click()
        }
      }

    },
    sfC(){
      if(this.sf == "normal marking-area"){
        this.sf = "sx marking-area"
      }else{
        this.sf = "normal marking-area"
      }
      let that  = this;
	  that.rl_width = document.getElementsByClassName('rl')[0].clientWidth;
	  that.paperList.forEach((item,index)=>{
	  	let div = that.$refs['NW'+item.id];
	  	let css = `transform:rotate(0deg);width:100%;height:auto;position:relative;display:flex;`
	  	div[0].style=css;
	  	if(item.rotate != 0){
	  		let src= item.imgas;
	  		item.imgas="";
	  		that.xxx(item,src)
	  	}
	  })
    },
	xxx(item,src){
		let that = this;
		setTimeout(function(){
			let div = that.$refs['NW'+item.id];
			let css = `transform:rotate(0deg);width:100%;height:auto;position:relative;`
			div[0].style=css;
			item.imgas = src;
		},1)
	},
    zcChange(type){
      if(type == 3){
        if(this.is_wp){
          this.ChangeGrade = 0;
        }else{
          this.ChangeGrade = "all";
        }
        this.getList()
        return false
      }else if(type == 1){
        this.getList()
      }else if(type == 2){
        this.getList()
      }
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
        this.zcNumber = res.result.arbitrationGradeCount;
        if (resultList) {
          let list = [
            {
              name: "全部",
              count: res.result.countNum,
              active: true,
              percentage:0,
            },
            {
              name: "未评级",
              count: res.result.notGradeCount,
              active: false,
              percentage:0,
            },
            {
              name: "仲裁组",
              count:  res.result.arbitrationGradeCount,
              active: false,
              percentage:0,
            },
          ];

          let xxList = [];
          let rule = localStorage.getItem("role");
          for (let i = 0; i < resultList.length; i++) {
            let progress;
            let all;

            all = (this.unmarkedCount || 0)*(((this.descriptionLevelList[i]?this.descriptionLevelList[i].percentage:0)/100 ) || 0)
            all = Math.ceil(all)
            progress = Math.round(
                ((resultList[i].count || 0) / (all/1 || 0) * 100)
            );

            if(resultList[i].grade){
              list.push({
                name: resultList[i].grade,
                count: resultList[i].count,
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
          this.xxList = xxList;
          this.levelStatisticsList = list;
          this.xxListNum = res.result.countNum;
        }


      })
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

                  // }
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
                if(this.showT){
                  data.showTeacherGrade = 1;
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
            if(this.jl_page > 1){
              this.thisCurrent = this.jl_page;
              this.rPage = Math.ceil(this.jl_page/10);
              wz = this.jl_page%10-1;
            }
          }else{
            this.thisCurrent = this.jl_page;
            this.rPage = 1;
            wz = 0;
            if(this.jl_page > 1){
              wz = this.jl_page%10-1;
              if(wz == -1){
                this.rPage = Math.ceil((this.jl_page+1)/10);
              }else{
                this.rPage = Math.ceil(this.jl_page/10);
              }
            }
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
          if(this.showT){
            data.showTeacherGrade = 1;
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
        return 'zgt hide0'
      }else if(hideSite == 1){
        return 'zgt hide1'
      }else if(hideSite == 2){
        return 'zgt hide2'
      }else if(hideSite == 3){
        return 'zgt hide3'
      }else if(hideSite == 4){
        return 'zgt hide4'
      }else if(hideSite == 5){
        return 'zgt hide5'
      }else if(hideSite == 6){
        return 'zgt hide6'
      }else if(hideSite == 7){
        return 'zgt hide7'
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
      if(this.thisCurrent + val > this.allLength || this.thisCurrent + val <= 0){
        return  false
      }
      this.$refs.imgViewer.resetImage()
      this.currentPosition += val;
      this.startPosition += val;
      this.thisCurrent += val;
      this.imgSwitchEnd(this.currentPosition)
      return false
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
      },100)
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
      } else {
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
        teacherName:localStorage.getItem("user_name")
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
.box_btom{
    padding: 4px 14px;
    text-align: left;
    min-height: 34px;
    position: relative;
	background: #fff;
}
.box_x{
padding: 4px 5px;
    height: 28px;
    line-height: 28px;
    min-height: 28px;
}
.box_x .rotateC{
    font-size: 20px !important;
    margin-left: -21px;
    height: 26px;
    line-height: 26px;
}
.ffs{
	    z-index: 9;
	    position: absolute;
	    left: 0;
		bottom: 1px;
		color: #409eff;
	    font-size: 20px;
	    padding: 0 4px;
		height: 30px !important;
		line-height: 30px !important;
}
.ffs.box_x{
	font-size: 16px;
	    height: 24px !important;
	    line-height: 24px !important;
	    min-height: 24px !important;
}
.wdpj{
	z-index: 9;
    position: absolute;
    right: 0;
    bottom: 1px;
    background: #f56c6c;
    color: #f2f6fc;
    border: 1px solid #fff;
    font-size: 20px;
    padding: 0 10px;
    height: 30px !important;
    line-height: 30px !important;
}
.wdpj.box_x{
	font-size: 16px;
	    height: 24px !important;
	    line-height: 24px !important;
	    min-height: 24px !important;
		padding: 0 4px;
}
.box_x .rotateC i:nth-child(1){
	margin-right: 2px !important;
}
.el-message{
  z-index: 200004 !important;
}
.fs_box .btn:hover{
  background: #409EFF;
  color: #fff;
}
.fs_box .btn{
  cursor: pointer;
  width: 50px;
  float: left;
  border: 1px solid #ddd;
  padding: 4px 0;
  margin-left: 5px;
  margin-bottom: 10px;
  text-align: center;
  border-radius: 4px;
}
.tck{
  background: #fff;
  border-radius: 4px;
  border: 1px solid #ccc;
  z-index: 1000;
}
.fs_btn .btn{
  border: 1px solid #ccc;
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  border-radius: 2px;
  color: #409eff;
  text-align: center;
  width: 80px;
  margin-left: 6px;
  margin-bottom: 10px;
  float: left;
  cursor: pointer;
}
.fs_btn .btn:hover{
  background: #409EFF;
  color: #fff;
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
.rotateC{
    position: absolute;
    left: 50%;
    font-size: 26px;
    margin-left: -31px;
	height: 34px;
	line-height: 34px;
	top: 1px;
}
.rotateC i{
	    border-radius: 2px;
	    padding: 1px;
		color: #409eff;
	
}
.tck>div:hover{
  background: #409EFF;
  color: #fff;
  color: #409eff;
}
.tck>div:last-child{
  border-bottom: none;
}
.teacher3{
  position: absolute;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  border-radius: 0 4px 4px 0;
  transform-origin: left bottom;
}
.teacher3 p{
  margin: 0;
  text-align: center;
  border-top: 1px solid #797979;
  color: #d6d5d5;
  font-size: 12px;
}
.fenye{
  position: fixed;
  bottom: 0;
  text-align: center;
  z-index: 1999;
}
.fenye .el-pagination{
  padding: 6px 7px;
  background: rgba(0,0,0,.4);
}
.fenye .my_pagination{
  text-align: center;
}
.fenye .el-pagination__jump{
  color: #fff;
}
.fenye .el-pager li.active{
  background: #fff !important;
}
.fenye .el-pagination__total{
  color: #fff;
}
.fenye .el-pagination__sizes{
  display: none !important;
}
.Acard:hover{
  background: #7ebbfa !important;
}
.Acard.active{
  background: #409eff !important;
}
#marking-area .active{
  background: #409eff !important;
  color: #fff !important;
}
#marking-area .imgBox.active{
	background: none !important;
	color: #fff;
}
.imgBox{
  position: relative;
  display: grid;
}
.imgBox .zcz{
  right: 0!important;
  height: 20px;
}
.gtBox{
  position: relative;
}
.gt_l{
  position: absolute;
  left: 2px;
  font-size: 12px;
  height: 30px;
  line-height: 30px;
}
.gt_r{
  margin-left: 20px;
  width: calc(100% - 20px);
}
.sjList{
  padding: 3px;
  padding-bottom:90px;
}
/* 重新定义内容块排序优先级，让其横向排序 */
.sjList li{
  position: relative;
}
.sjList li .imgBox.active:after{
  content: '';
  position: absolute;
  width: 100%;
  top: 0;
  background-color: rgba(0,0,0,.2);
  background-image: url(../../assets/gou.png);
  height: 100%;
  background-position: right bottom;
  border-radius: 4px;
  background-size: 66px;
  background-repeat: no-repeat;
  border:3px solid #557dff;
  z-index: 100;
}
.sjList li .imgBox.active2:after{
	  background-size: 44px!important;
}
/* 换列的分隔线 */
.container::before,
.container::after {
  content: "";
  flex-basis: 100%;
  width: 0;
  order: 2;
}
.zc_t{
  cursor: pointer;
  font-size: 14px;
  float: right;
  margin-top: 5px;
  background: rgb(243, 95, 98);
  color: #fff;
  padding: 0 6px;
  border-radius: 4px;
}
.zc_t:hover{
  background: #ff8c8e;
}
.rl::-webkit-scrollbar {
  width: 8px;
}
.rl::-webkit-scrollbar-track {
  background-color:#747474;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius:2em;
}
.rl::-webkit-scrollbar-thumb {
  background-color:#409eff;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius:2em;
}
.app-main{
  min-height: 100vh !important;
}
.rl{
  width: calc(85% - 5px);
  height: 100%;
  position: absolute;
  overflow-y: auto;
  background: rgba(0,0,0,.7)
}

.rr{
  width: 15%;
  height: 100%;
  position: absolute;
}
.marking-area{
  position: absolute;
  width: 100%;
  height: 100%;
}
.dsj{
  float: left;
  width: 100%;
  margin-bottom: 6px;
}
.dsj img{
  width: 100%;
}
.rr{
  width: 15%;
  height: 100%;
  right: 0;
}
.zcz02 sup{
  font-size: 20px;
  height: 30px;
  line-height: 30px;
  padding: 0 15px;
}
.image-header{
  position: absolute;
  width: 150px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  left: 50%;
  bottom: 0;
  margin-left: -75px;
  color: #fff;
  font-size: 22px;
  background-color: #ec2d56;
  border-radius: 10px 0 10px 0;
  z-index: 8;
}
.tpyl .pos-tip{
  position: absolute;
  z-index: 99;
  width: 100%;
  color: #fff;
  text-align: center;
  height: 80px;
  line-height: 80px;
}
.tpyl .image-container2{
  height: 100%;
}
.tpyl .image-container{
  width: 100%;
}
.tpyl .el-image{
  border-radius: 0 !important;
}
.tpyl .teacher{
  bottom: 0;
  width: 210px;
  right: 2px;
  left: auto;
}

.tpyl .el-image-viewer__mask{
  opacity: .7;
}
.tpyl .el-image-viewer__img{
  margin-left: 0px; margin-top: 0px; height: 100%; max-width: 100%;
}
.right_btn .right-btns{
  padding: 0 10px;
  padding-top: 10px;
}
.right_btn .right-btns button{
  margin-bottom: 10px;
  width: 100%;
  margin-left: 0;
}
.right_btn .right-btns button:hover{
  background: #557dff;
  color: #fff;
}
.right_btn{
  z-index: 999000;
  background: rgb(255, 255, 255);
  position: fixed;
  right: 0;
  top: 0;
  width: 10%;
  height: 100%;
}

.tpyl{
  width: 90%;
}
.normal .left2{
  display: none;
}
.sx .left2 button{
  width: 40px;
  margin-left: 0;

}
.sx .right{
  left: 60px !important;
}
.sx .left2{
  width: 40px;
  background: #fff;
  margin-right: 10px;
  height: 100%;
}
.sx .left{
  display: none;
}
.zgt{
  position: absolute;
  height: 11.2%;
  width: 29.2%;
  background: #fff;
  z-index: 7;
  background-image: url(../../assets/zgt.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
#marking-area .el-dialog__wrapper{
  z-index: 200001 !important;
}
.zgt.hide0{
  top: 0;
  left: 0;
}
.zgt.hide1{
  top: 0;
  right: 0;
}
.zgt.hide2{
  left: 0;
  bottom: 0;
}
.zgt.hide3{
  right: 0;
  bottom: 0;
}
.zgt.hide4{
  top: 0;
  left: 50%;
  margin-left: -14.6%;
}
.zgt.hide5{
  left: 0;
  top: 50%;
  margin-top: -5.6%;

}
.zgt.hide6{
  left: 0;
  right: 50%;
  margin-top: -5.6%;
}
.zgt.hide7{
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
  margin-left: 0!important;
}
.progress {
  height: 20px;
  background: #cbcedc;
  border-radius: 10px;
  margin-top: 10px;

  .progress-bar {
    background-color: #557dff;
  }
}

#marking-area {
  .el-progress{
    width: 100%;
  }
  .jd{
    position: absolute;
    right: 0;
    top: -10px;
    font-size: 12px;
  }
  .el-progress-bar__inner {
    max-width: 100% !important;
    background-color: #2c5eff;
  }

  .el-progress-bar__outer {
    background-color: #f5f7fa;
    height: 4px !important;
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
    background-color: #557dff;
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
    position: absolute;
    width: 100%;
    height: 100%;

    .left {
      width: 300px;
      margin-right: 15px;
      height: 100%;

      .left-top {
        background-color: #fff;
        margin-bottom: 10px;
        padding:10px 20px;
        box-sizing: border-box;
        position: relative;
        height: calc(100% - 35px);
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
          justify-content: space-around;
          .card {
            flex: 0.48;
            -webkit-border-radius: 10px;
            -moz-border-radius: 10px;
            border-radius: 10px;
            height: 30px;
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
              position: relative;
              .number {
                position: absolute;
                font-size: 20px;
                height: 30px;
                line-height: 30px;
                right: 0px;
                top: -4px;
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

          overflow: auto;
          .card:nth-child(2n+1){
            margin-right: 4px;
          }
          .card:nth-child(2n){
            margin-left: 4px;
          }
          .card:hover{
            background: #7ebbfa;
          }
          .card {
			width: 48%;
			height: 50px;
			float: left;
            flex: 1 0 40%;
            font-size: 14px;
            color: #557dff;
            background-color: #fff;
            border-radius: 4px;
            padding: 4px;
            border: 1px solid #557dff;
            margin-bottom: 7px;
            cursor: pointer;
            .primary {
              color: #000000;
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
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
            padding: 6px;
            margin-bottom: 7px;
            margin-right: 7px;
            .el-progress-bar{
              margin-top: 2px;
            }
            .primary {
              color: #557dff;
            }
          }
        }
      }

      .left-bottom {
        background: #fff;
        box-sizing: border-box;
        position: absolute;
        bottom: 0;
        width: calc(100% - 40px);
        left: 20px;
        border-top: 1px solid #e4e7ed;

        h3 {
          &:first-child {
            margin-top: 0;
          }
        }

        .left-bottom-left {
          margin-right: 10px;
          .btns {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            button {
              padding: 3px 5px;
              margin: 0 10px 10px 0;
              &.active {
                background-color: #557dff;
                color: #fff;
              }
            }
          }
        }
      }
    }

    .right {
      position: absolute;
      left: 315px;
      top: 10px;
      width: calc(100% - 325px);
      height: 100%;
      .right-top {
        position: relative;
        height: 100%;
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
        box-sizing: border-box;
        width: 100%;
        min-height: 80px;
        display: flex;
        flex-direction: row;
        position: relative;
        -webkit-border-radius: 0 0 10px 10px;
        -moz-border-radius: 0 0 10px 10px;
        border-radius: 0 0 10px 10px;
        height: calc(100% - 216px);
        .right-btns {
          position: relative;
          button {
            border: none;
            background: #f3f3f3;
            margin-left: 0;
            margin-bottom: 10px;
            width: 100%;
            box-sizing: border-box;
            &.active {
              background-color: #557dff;
              color: #fff;
            }
          }
          button:hover{
            background-color: #557dff;
            color: #fff;
          }
        }

        .mark-btn {
          position: absolute;
          right: 10px;
          background-color: #557dff;
          color: #fff;
        }
      }
    }
  }
  .img-wrap{
    text-align: center;
  }
}
.sx .bottom .right{
  width: calc(100% - 60px);
}
</style>
