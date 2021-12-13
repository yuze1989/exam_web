<template>
  <div id="marking-area">
    <!--      左侧 begin-->
    <div class="left">
      <div class="left-top">
        <h3 style="margin-bottom: 10px">
          打分进度
          <el-button style="height: 33px;font-weight: 700" class="back" type="text">
            隐藏
          </el-button>
        </h3>
        <div v-loading="jinDuLoad">
          <div class="cards">
            <div class="card no">
              <div class="title">待打分  <span class="number">{{ jinDuData.NoScore }}</span></div>
            </div>
            <div class="card done">
              <div class="title">已打分 <span class="number">{{ jinDuData.Score }}</span></div>

            </div>
          </div>
          <div class="cards">
            <div class="card no">
              <div class="title">待评级 <span class="number">{{ jinDuData.NoGrade }}</span></div>
            </div>
            <div class="card done">
              <div class="title">已评级 <span class="number">{{ jinDuData.Grade }}</span></div>
            </div>
          </div>
        </div>
        <h3 style="margin: 0 0 10px 0">分组数据 <span :class="{active:ChangeGrade=='仲裁组','zc_t':true}" @click="flClick('仲裁组')">仲裁组：{{ fenLeiData.arbitrationGradeCount}}</span></h3>
        <el-button type="primary" style="width: 100%;margin-bottom: 7px;" :class="{active:ChangeGrade=='all','Acard':true}" @click="flClick('all')">全部 {{fenLeiData.countNum}}</el-button>
        <div class="cards-statistics clearfix">
          <div
              v-for="(level,index) in fenLeiData.gradeNameCount"
              :key="level.grade"
              :class="{active:ChangeGrade==level.grade,'card':true}"
              @click="flClick(level.grade)"
              @contextmenu.prevent="openMenu($event,level)"
          >
            <div>
              <span class="primary">{{ level.grade }}类</span>
              <span style="margin-left: 6px">{{ level.count || 0 }} / {{ Math.ceil(fenLeiData.countNum*guizeData[index].percentage/100) }}</span>
            </div>
            <div style="position: relative">
              <el-progress
                  text-inside
                  :percentage="Math.ceil(level.count / (fenLeiData.countNum*guizeData[index].percentage/100)*100) || 0"
              >
              </el-progress>
              <span class="jd" >{{Math.ceil(level.count / (fenLeiData.countNum*guizeData[index].percentage/100)*100)}}%</span>
            </div>
          </div>
          <div class="card" v-if="fenLeiData.gradeNameCount%2==1" style="opacity: 0">xxx</div>
        </div>
        <!--          已打分、未打分-->
        <div class="tags">
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
      </div>
      <!--        规则数据 begin-->
      <div class="left-bottom">
        <div class="left-bottom-left" v-if="guizeData[changeGuize]">
          <h3 style="margin-bottom: 6px">评分细则
            <!--              <i v-if="xzH=='auto'" class="el-icon-arrow-down" style="cursor: pointer;" @click="zoom"></i>-->
            <!--              <i v-if="xzH!='auto'" class="el-icon-arrow-up" style="cursor: pointer;" @click="enlarge"></i>-->
          </h3>
          <div class="btns">
            <el-button
                v-for="(level, index) in guizeData"
                :key="index"
                @click="changesGuize(index)"
                :class="{active: changeGuize==index}"
            >
              {{ level.grade }}类
            </el-button>
          </div>
          <div style="height: calc(100% - 125px);position: absolute;overflow: auto;width: 260px">
            <h3 style="margin: 0 0 6px 0">范例图 <span style="font-size: 12px;">（点击查看大图）</span></h3>
            <div class="examples-img">
              <el-image
                  style="width: 190px; height: 200px"
                  fit="cover"
                  :src="guizeData[changeGuize].imgUrl"
                  :preview-src-list="[guizeData[changeGuize].imgUrl]">
                >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
            <div class="level-description">
              <h3 style="margin-bottom: 6px">{{ guizeData[changeGuize].grade }}类卷</h3>
              <p class="word-wrap" style="height: 80px; overflow: auto">
                {{guizeData[changeGuize].imgUrlDesc}}
              </p>
            </div>
          </div>
        </div>
      </div>
      <!--        规则数据 begin-->

    </div>
    <!--      左侧 end-->
    <!--    右侧 begin-->
    <div class="right">
      <!--      图像层 begin-->
      <div class="img_box">
        <div class="img_content rl" v-loading="listLoad" ref="rl" id="rl">
          <!--        视图区 begin-->
            <!-- 主体瀑布流区域，无限滚动 begin-->
            <ul class="sjList" style="padding: 4px">
              <!--            试卷单张 begin-->
              <li v-for="(item,index) in paperList" class="dsj" :style="{width:100/lie+'%',height:box_h+'px'}">
                  <!-- 图片懒加载 -->
                  <div :class="{imgBox:true,active:item.active,active2:lie>3}">
                    <div class="teacher3" v-if="item.paperTeachers && item.paperTeachers.length > 0">
                      <h3 style="text-align: center;color: rgb(222 222 222);font-size: 14px;padding: 4px;margin: 0">评级记录</h3>
                      <p v-for="(a,index) in item.paperTeachers">{{a.username}}:{{a.originalGrade}}</p>
                    </div>
                    <el-badge value="仲裁" class="zcz" v-if="item.isArbitrate==1"></el-badge>
                    <div :ref="'NW'+item.id" style="position: relative;" :style="{transform:'rotate('+item.rotate+'deg)'}">
                      <div v-if="hideSite>=0" class="zgt" :style="{width: width+'%',height: height+'%',backgroundImage: 'url('+zgtUrl+')'}"></div>
                      <el-image :src='item.imgas' class='image' :key='item.imgas' lazy>
                        <!-- 加载前占位 -->
                        <div slot="placeholder" class="image-slot" style="text-align: center">
                          <el-empty :image-size="200" description="加载中" image="https://topexam.oss-cn-hangzhou.aliyuncs.com/upload/20211123/1463042935463657474.png"></el-empty>
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
              </li>
              <!--            试卷单张 end-->
            </ul>
            <!-- 主体瀑布流区域，无限滚动 end-->
            <div v-if="paperList.length == 0" style="height: 100%;text-align: center;background: #fff">
              <img src="@/assets/no_img2.svg" alt="" style="width:50%;margin-top: 10%">
            </div>
          <!--        视图区 end-->
        </div>
        <!--分页栏-->
        <el-col :span="24" class="toolbar fenye">
          <el-pagination
              @current-change="getList()"
              :current-page.sync="page"
              :page-size="size"
              :page-sizes = "[200]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalItem">
          </el-pagination>
        </el-col>
      </div>
      <!--      图像层 end-->
      <!--      操作层 begin-->
      <div class="btn_box"></div>
      <!--      操作层 end-->
    </div>
    <!--    右侧 end-->
  </div>
</template>
<script>
export default{
  name: "markingArea1",
  data:()=>{
    return{
      jinDuLoad:false,//进度loading
      queryLoad:false,//分类loading
      listLoad:false,//试卷loading
      jinDuData:{},//进度数据
      fenLeiData:{},//分类数据
      guizeData:[],//规则数据
      paperList:[],//试卷列表
      ChangeGrade:"all",//当前选中分类
      changeScore:"",//当前选中打分/未打分
      changeGuize:0,//当前选中的规则
      fenzuOver:false,
      kgBl:1,
      lie:2,//列
      hang:100,//行
      page:1,//分页
      size:200,//单页大小
      isGd:false,//是否排序
      box_h:380, //图片盒子高度
      hideSite:0,//遮盖区域
      width:0,//遮盖宽度
      height:0,//遮盖高度
      zgtUrl:"",//遮盖图
      totalItem:0,//该页总数
      scoreList: [
        { key: 0, name: "未打分", total: 0, active: false },
        { key: 1, name: "已打分", total: 0, active: false },
      ],
    }
  },
  computed:{

  },
  created() {
    this.getJinDu() //获取进度
    this.renderMarkingRules() //获取规则后获取分类
    this.getList();//获取试卷列表

    let that = this;
    window.onresize = function (){
      that.setHeight();
    }
  },
  updated() {
    // 初始全屏化
    document.querySelectorAll("#marking-area")[0].parentNode.style.minHeight = '100%'
    document.querySelectorAll("#marking-area")[0].parentNode.style.height = '100%'
    document.querySelectorAll("#marking-area")[0].parentNode.style.position = 'absolute'
  },
  mounted(){
    this.setHeight()
  },
  methods:{
    // 获取进度
    getJinDu(){
      this.jinDuLoad = true;
      let url1 = '/exampaper/scoringProgress'
      this.$axios.post(url1,{
        "course": this.$route.query.course,
        "examId": this.$route.query.examId,
        "size": 20,
      }).then((res)=>{
        this.jinDuLoad = false;
        this.jinDuData = res.result;

      })
    },
    //获取分类
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
        this.fenLeiData = res.result;

      })
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
          this.guizeData = res.result.list;
          this.queryPaperList()

          setTimeout(function (){
            //规则高度自适应
            let top_h = document.querySelector(".left-top").scrollHeight/1+30;
            document.querySelector(".left-bottom").style.height = "calc(100% - "+top_h+"px)"
          },1000)

          this.hideSite = this.guizeData[0].hideSite;
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
      })
    },
    //获取试卷列表
    getList(){
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
      this.$axios.post(url,data).then((res) => {
        let bList = res.result.list;
        if(this.isGd){
          bList.sort(function(a,b){
            return b.score - a.score
          });
        }
        this.paperList = bList;
        this.totalItem = res.result.total;
        if(bList.length > 0){
          let that = this;
          setTimeout(function (){
              let img_w = document.querySelectorAll(".dsj")[0].offsetWidth - 6;//盒子宽度
              let img = new Image();
              img.src = bList[0].imgas;
              img.onload = function (){
                let imgW = img.width;
                let imgH = img.height;
                that.kgBl = img.width/img.height;
                let boxH = imgH * (img_w / imgW);
                that.box_h = Math.round(boxH)+34;
              }


          },100)
        }
        this.listLoad = false;
      });
    },
    //规则切换
    changesGuize(index){
      this.changeGuize = index;
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
    // 分类左键点击
    flClick(item){
      this.yl_show = false;
      this.ChangeGrade = item;
      this.changeScore = "";
      this.scoreList.map((item, key) => {
        item.active = false;
      });
      // this.getList()
    },
    //设置高度
    setHeight(){
      if(document.querySelectorAll(".dsj")[0]){
        let img_w = document.querySelectorAll(".dsj")[0].offsetWidth - 6;//盒子宽度
        this.box_h = img_w/this.kgBl + 34;
      }
    },
    // 分类右键显示
    openMenu(e,item){
      e.preventDefault();
      // this.tck = true;
      // this.xxP.x  = e.clientX;
      // this.xxP.y  = e.clientY;
      // this.xxP.name = item.name;
    },
    //旋转试卷
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
              item.rotate = rotate;
            }
          })
        }

      }
    },

  }
}
</script>
<style lang="scss">
#marking-area{
  height: calc(100% - 42px);
  position: absolute;
  top: 42px;
  width: 100%;
  padding: 10px;
  background-color: #f3f3f3;
  .clearfix:after{visibility:hidden;display:block;font-size:0;content: " ";clear:both;height:0;}
  .clearfix{*zoom:1;}
}
#marking-area h3{
  margin: 0;
}
.left{
  width: 300px;
}
.left-top{
  background: #fff;
  padding: 10px 20px;
  border-radius: 10px;
}
.back{
  height: 33px;
  font-weight: 700;
  float: right;
  padding: 0;
  color: #0070cc;
}
#marking-area .left .left-top .cards{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
#marking-area .left .left-top .cards .card{
  flex: 0.48;
  border-radius: 10px;
  height: 30px;
  color: #fff;
  font-size: 16px;
  margin-right: 12px;
  padding: 8px 12px 0;
  box-sizing: content-box;
  margin-bottom: 10px;
}
#marking-area .left .left-top .cards .card.no{
  background-color: #59bf99;
}
#marking-area .left .left-top .cards .card.done{
  background-color: #557dff;
}
#marking-area .left .left-top .cards .card .title{
  margin-bottom: 5px;
  font-size: 12px;
  position: relative;
}
#marking-area .left .left-top .cards .card .title .number{
  position: absolute;
  font-size: 20px;
  height: 30px;
  line-height: 30px;
  right: 0;
  top: -4px;
}
#marking-area .left .left-top .cards .card:last-child {
  margin-right: 0;
}
.zc_t {
  cursor: pointer;
  font-size: 14px;
  float: right;
  margin-top: 5px;
  background: #f35f62;
  color: #fff;
  padding: 0 6px;
  border-radius: 4px;
}
#marking-area{
  .fenye {
    position: absolute;
    bottom: 10px;
    text-align: center;
    z-index: 1999;
  }
  .fenye .el-pagination {
    padding: 6px 7px;
    background: rgba(0,0,0,.4);
  }
  .el-pagination {
    white-space: nowrap;
    color: #303133;
    font-weight: 700;
  }
  .el-pagination__total,.el-pagination__jump{
    color: #fff;
  }
  .el-pagination__sizes{
    display: none;
  }
  .right{
    position: absolute;
    width: calc(100% - 320px);
    top: 0;
    height: 100%;
    left: 320px;
    .img_box{
      width: calc(100% - 230px);
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      padding: 10px 10px 10px 0;
      .img_content{
        width: 100%;
        height: 100%;
        background: #606266;
        border-radius: 10px;
        overflow: auto;
        padding-bottom: 30px;
        .dsj{
          display: inline-block;
          padding-right: 4px;
          padding-bottom: 4px;
          position: relative;
          overflow: hidden;
          border-radius: 2px;
          .el-badge__content{
            border-radius: 2px;
          }
          .imgBox{
            position: absolute;
            top: 0;
            height: calc(100% - 34px);
            width: calc(100% - 4px);
            display: flex;
            align-items: center;
            justify-content: center;
            background: #3d475b;
          }
          .box_btom{
            width: calc(100% - 4px);
            height: 34px;
            background: #fff;
            position: absolute;
            bottom: 0;
            line-height: 34px;
            padding-left: 10px;
            border-radius: 0 0 2px 0;
            .ffs{
              z-index: 9;
              position: absolute;
              left: 0;
              bottom: 1px;
              color: #409eff;
              font-size: 20px;
              padding: 0 4px;
              height: 30px!important;
              line-height: 30px!important;
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
            .rotateC i {
              border-radius: 2px;
              padding: 1px;
              color: #409eff;
              cursor: pointer;
              margin-right: 10px;
            }
          }
          .zcz{
            position: absolute;
            top: 0;
            right: 0;
            z-index: 999;
          }
        }
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
    }
    .btn_box{
      width: 230px;
      height: 100%;
      position: absolute;
      right: 0;
      top: 0;
      background: #fff;
    }
  }
  .left-top{
    .Acard.active{
      background: #557dff;
      color: #fff;
    }
    .cards-statistics .card{
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
    }
    .cards-statistics .card.active{
      background: #557dff;
      color: #fff;
      .primary{
        color: #fff;
      }
    }
    .card:nth-child(odd) {
      margin-right: 4px;
    }
    .card:nth-child(2n) {
      margin-left: 4px;
    }
    .el-progress-bar{
      .el-progress-bar__outer{
        height: 4px !important;
      }
      .el-progress-bar__innerText{
        display: none;
      }
    }
    .jd{
      position: absolute;
      right: 0;
      top: -10px;
      font-size: 12px;
    }
  }
  .left-bottom{
    background: #fff;
    padding: 10px 20px;
    border-radius: 10px;
    margin-top: 10px;
    position: absolute;
    width: 300px;
  }
  .left .left-bottom .btns{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    button{
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      background: #fff;
      border: 1px solid #dcdfe6;
      border-color: #dcdfe6;
      color: #606266;
      -webkit-appearance: none;
      text-align: center;
      box-sizing: border-box;
      outline: none;
      transition: .1s;
      font-weight: 400;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      font-size: 14px;
      border-radius: 4px;
      padding: 3px 5px;
      margin: 0 10px 10px 0;
    }
    button.active{
      background: #409eff!important;
      color: #fff;
    }
  }
  .zgt{
    z-index: 1;
    background-color: #fff;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    position: absolute;
  }
}
</style>