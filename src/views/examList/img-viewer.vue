<template>
  <div>
    <transition name="fade-in">
      <!-- 第一次打开后才渲染dom -->
      <div
        v-if="isFirstShow"
        v-show="finallyVisible"
        ref="imagePreview"
        class="preview-container"
      >
        <div class="image-wrapper">
          <slot name="loading" :loading="loading">
            <Snippet v-if="loading" />
          </slot>
          <!-- draggable: false 禁止 chrome 拖拽图片 -->
          <div class="image-box">
            <div class="teacher" v-if="paperList[currentPosition] && paperList[currentPosition].paperTeachers.length > 0">
              <h3 style="text-align: center;color: rgb(222 222 222);margin: 10px">评级记录</h3>
              <p v-for="(item,index) in paperList[currentPosition].paperTeachers">{{item.username}}:{{item.originalGrade}}</p>
            </div>
            <span :class="class1" :style="imgStyle">
               <el-image
                   v-show="!loading"
                   ref="image"
                   :class="hideClass()"
                   :src="allLength==0?'':finallyImageList[currentPosition]"
                   :alt="`图片${currentPosition + 1}`"
                   draggable="false"
                   @load="handleImageLoad"
                   @error="hideLoading"
                   @abort="hideLoading"
                   @mousedown="handleImageMouseDown"
                   @wheel.stop="wheelScale"
                   >
                    <div slot="error" class="image-slot">
                <img src="@/assets/no_img2.svg" alt="" style="width:100%">
              </div>
               </el-image>
            </span>
          </div>
        </div>

        <div class="pos-tip" @click="stopd" v-if="this.$parent.isHide != 1"> <span @dblclick="chagedd">  {{allLength?thisCurrent:0 }} </span> / {{ allLength }}</div>
        <div
          class="arrow arrow-prev hover-icon"
          :class="{ disabled: currentPosition === 0 }"
          @click="updatePosition(-1)"
        >
          <SvgIcon class="icon" name="shangyizhang" style="width:2em;height: 2em;" />
        </div>
        <div
          class="arrow arrow-next hover-icon"
          :class="{ disabled: currentPosition === finallyImageList.length - 1 }"
          @click="updatePosition(1)"
        >
          <SvgIcon class="icon" name="xiayizhang" style="width:2em;height: 2em;" />
        </div>
        <div class="operate-area" @click.stop="stopE($event)">
          <slot name="operate">
            <SvgIcon
              class="icon hover-icon"
              name="actionicon"
              @click="increaseScale"
            />
            <SvgIcon
              class="icon hover-icon"
              name="suoxiao"
              @click="decreaseScale"
            />
            <div class="divide" />
<!--            <SvgIcon-->
<!--              class="icon hover-icon"-->
<!--              name="zhongzhi"-->
<!--              @click="onResetClick"-->
<!--            />-->
            <span class="r_left" @click="rotateImg(-90)">
            </span>
            <span class="r_right" @click="rotateImg(90)">
            </span>
          </slot>
          <slot name="extraOperate"></slot>
        </div>
        <transition name="fade">
          <div :key="scale" :style="scaleTipStyle" class="scale-tip">
            {{ ~~(scale * 100) }}%
          </div>
        </transition>
      </div>
    </transition>
    <div v-if="isSlotMode" ref="slotWrapper" @click="handleImgWrapperClick">
      <slot />
    </div>
    <!-- 点击放大图片 -->
    <el-dialog
        title="示例图片"
        :visible.sync="showExamplesPreviewer"
        width="45%"
    >
      <div class="img-wrap">
        <el-image :src="targetUrl" fit="cover"></el-image>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Snippet from './Snippet'
import SvgIcon from './SvgIcon'

import { forbiddenBodyScroll, ALERT, validateNumber } from '../../utils/utils'

const DEFAULT_MAX_SCALE = 5 // 最大放大比例
const DEFAULT_MIN_SCALE = 0.1 // 最小放大比例
const DEFAULT_STEP = 0.01 // 单次缩放变化的比例
const DEFAULT_ANGLE = 90
const DEFAULT_LOADING_DELAY = 300 // 默认 loading 延迟时间 (ms)
const BASE_SELECTOR = 'img' // 默认选择器
const DEFAULT_FILTER_FUNCTION = () => true // 插槽模式下，默认过滤函数

export default {
  name: 'ImagePreview',
  components: {
    Snippet,
    SvgIcon,
  },
  props: {
    container: null,
    visible: {
      type: Boolean,
      default: false,
    },
    // 图片地址
    imageUrls: {
      type: Array,
      default: () => [],
    },
    // 试卷列表
    paperList: {
      type: Array,
      default: () => [],
    },
    imageUrls1: {
      type: Array,
      default: () => [],
    },
    urlMapper: {
      type: Function,
      default: null,
    },
    // 起始位置
    startPosition: {
      type: Number,
      default: 0,
    },
    //总数
    allLength:{
      type: Number,
      default: 0,
    },
    thisCurrent:{
      type: Number,
      default: 0,
    },
    maxScale: {
      type: [String, Number],
      default: DEFAULT_MAX_SCALE,
      validator: validateNumber('maxScale'),
    },
    minScale: {
      type: [String, Number],
      default: DEFAULT_MIN_SCALE,
      validator: validateNumber('minScale'),
    },
    scaleStep: {
      type: [String, Number],
      validator: validateNumber('scaleStep'),
      default: DEFAULT_STEP,
    },
    angle: {
      type: [String, Number],
      validator: validateNumber('angle'),
      default: DEFAULT_ANGLE,
    },
    includeSelector: {
      type: String,
      default: '',
    },
    excludeSelector: {
      type: String,
      default: '',
    },
    filter: {
      type: Function,
      default: DEFAULT_FILTER_FUNCTION,
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true,
    },
    loadingDelay: {
      type: [String, Number],
      default: DEFAULT_LOADING_DELAY,
      validator: validateNumber('loadingDelay'),
    },
    initialScale: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      showExamplesPreviewer:false,
      targetUrl:"",
      isFirstShow: false,
      currentPosition: 0,
      slotModeVisible: false,
      loading: false,
      imgList: [],
      urlList: [],
      scale: 1.5,
      rotateAngle: 0,
      aspectRatio: 1,
      clickTimer:null,
      class1:"image-container",
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
      rote:0,
    }
  },
  computed: {
    isSlotMode() {
      return !!this.$slots.default
    },
    innerMaxScale() {
      let maxScale = +this.maxScale
      return Number.isFinite(maxScale) && maxScale >= 1
        ? maxScale
        : DEFAULT_MAX_SCALE
    },
    innerMinScale() {
      let minScale = +this.minScale
      return Number.isFinite(minScale) && minScale <= 1 && minScale > 0
        ? minScale
        : DEFAULT_MIN_SCALE
    },
    innerScaleStep() {
      let scaleStep = +this.scaleStep
      return Number.isFinite(scaleStep) ? scaleStep : DEFAULT_STEP
    },
    innerAngle() {
      let angle = +this.angle
      return Number.isFinite(angle) ? angle : DEFAULT_ANGLE
    },
    // 根据不同用法生成图片列表
    finallyImageList() {
      return this.isSlotMode ? this.urlMapper ? this.urlList.map(this.urlMapper) : this.urlList : this.imageUrls
    },
    finallyVisible() {
      return this.isSlotMode ? this.slotModeVisible : this.visible
    },
    // 计算总数
    totalCount() {
      return (this.finallyImageList || []).length
    },
    imgStyle() {
      let { left, top } = this.position
      let styleKey = this.aspectRatio > 1 ? 'max-width' : 'max-height'
      return {
        transform: `translate3d(${left}px, ${top}px, 0) scale(${this.scale}) rotate(${this.rote}deg)`,
      }
    },
    scaleTipStyle() {
      let { left, top } = this.position
      return `transform: translate3d(calc(-50% + ${left}px), calc(-50% + ${top}px), 0)`
    },
  },
  watch: {
    visible: {
      immediate: true,
      handler: 'handleVisible',
    },
    slotModeVisible: 'handleVisible',
    startPosition: function (val, old) {
      // this.rote = this.paperList[this.currentPosition].rotate
      this.currentPosition = val
    },
    thisCurrent: function (val, old) {
      // this.rote = this.paperList[this.currentPosition].rotate
      this.thisCurrent = val
    },
    allLength: function (val, old) {
      this.allLength = val
    },
    // 切换图片 src 时触发
    currentPosition: 'handleImageSourceChange',
    finallyImageList: 'handleImageSourceChange',
    closeOnPressEscape: {
      immediate: true,
      handler(val, oldVal) {
        if (val) {
          window.addEventListener('keyup', this.handlePressESC)
        }
        // 由 true -> false， 将之前事件解绑掉
        if (oldVal && !val) {
          window.removeEventListener('keyup', this.handlePressESC)
        }
      },
    },
  },
  mounted() {

    if (this.isSlotMode) {
      this.imgList = this.queryImgList()
      this.initImgList()
    }
  },
  beforeDestroy() {
    this.closeOnPressEscape &&
      window.removeEventListener('keyup', this.handlePressESC)
  },
  // 插槽子元素变化时，重新初始化
  updated() {
    // this.rote = this.paperList[this.currentPosition].rotate
    if (this.isSlotMode) {
      let newImgList = this.queryImgList()
      let equal = false
      if (this.imgList.length === newImgList.length && this.imgList.length) {
        equal = Array.from(this.imgList).every(
          (img, index) => img === newImgList[index]
        )
      }
      if (!equal) {
        this.imgList = newImgList
        this.initImgList()
      }
    }

  },
  methods: {
    stopE(e){
      console.log(e);
      window.event? window.event.cancelBubble = true : e.stopPropagation();
    },
    stopd(){
      window.event? window.event.cancelBubble = true : e.stopPropagation();
    },
    rotateImg(value){
      window.event? window.event.cancelBubble = true : e.stopPropagation();

      // let id = this.paperList[this.currentPosition].id;
      // let rote = this.paperList[this.currentPosition].rotate/1 + value/1;
      let rote = this.rote/1 + value/1;
      this.rote = rote;
      return
      this.$axios.post("/exampaper/updateExamPaperRotate?paperId="+id+"&rotate="+rote).then(res=>{
        if(res.code == 200){
          this.paperList[this.currentPosition].rotate = rote;
          this.rote = rote;
        }

      })
      // this.$emit('roteImg', this.rote)
    },
    change(e){
      this.chanNum = e.data;
      this.$forceUpdate()
    },
    chagedd(){
      return
      this.$prompt('请输入目标位置', '跳转', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        var leg = this.allLength;
        if(value-1 > leg){
          this.$message({
            type: 'error',
            message: '超出试卷最大页！'
          });
          return false
        }else if(value-1 < 0){
          this.$message({
            type: 'error',
            message: '低于试卷最小页！'
          });
        }else{
          this.$message({
            type: 'success',
            message: '已跳转'
          });
          this.currentPosition = value-1
          this.$emit('positionUpdated', this.currentPosition)
          this.resetImage()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消跳转'
        });
      });
    },
    hideClass(){
      let hideSite = sessionStorage.getItem("hideSite")
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
    // ==================================== 对外方法 Start =============================================
    rotate(angle) {
      if (typeof angle === 'function') {
        angle = +angle(this.rotateAngle)
      } else {
        angle = +angle
      }
      if (Number.isFinite(angle)) {
        this.rotateAngle = angle
      } else {
        ALERT(
          'rotate 方法参数必须为一个数字或函数(如果是函数，则该函数的返回值必须为数字)'
        )
      }
    },
    zoom(zoomRate) {
      if (typeof zoomRate === 'function') {
        zoomRate = +zoomRate(this.scale)
      } else {
        zoomRate = +zoomRate
      }

      if (Number.isFinite(zoomRate)) {
        // 限制缩放范围在“设定范围之内”
        if (zoomRate < this.innerMinScale) {
          this.scale = this.innerMinScale
        } else if (zoomRate > this.innerMaxScale) {
          this.scale = this.innerMaxScale
        } else {
          this.scale = zoomRate
        }
        // console.error(`zoom传入的参数(如果是函数，则为函数的返回值)超过设定的缩放范围，该范围为${this.minScale}~${this.maxScale}`)
      } else {
        ALERT(
          'zoom 方法参数必须为一个数字或函数(如果是函数，则该函数的返回值必须为数字)'
        )
      }
    },
    reset() {
      return this.resetImage()
    },
    // ==================================== 对外方法 End =============================================
    /**
     * 根据传入的css选择器筛选，生成最终的选择器
     * 举个例子
     * includeSelector: ".img1, img2"
     * excludeSelector: ".img3, .img4"
     * => ".img1:not(.img3):not(.img4), .img2:not(.img3):not(.img4)"
     */
    parseSelector() {
      const SPLIT_REG = /\s*,\s*/g
      let includeSelectorList = []
      let excludeSelectorList = []
      // 处理传入的css选择器的逗号
      if (this.includeSelector && typeof this.includeSelector === 'string') {
        includeSelectorList = this.includeSelector.split(SPLIT_REG)
      }
      if (this.excludeSelector && typeof this.excludeSelector === 'string') {
        excludeSelectorList = this.excludeSelector.split(SPLIT_REG)
      }
      let selectorList = includeSelectorList.map((selector) => {
        let filterSelector = excludeSelectorList.map(
          (exSelector) => `:not(${exSelector})`
        )
        return BASE_SELECTOR + selector + filterSelector.join('')
      })
      return selectorList.join(', ') || BASE_SELECTOR
    },
    queryImgList() {
      let selector =
        this.filter === DEFAULT_FILTER_FUNCTION
          ? this.parseSelector()
          : BASE_SELECTOR
      let imgList = this.$refs.slotWrapper.querySelectorAll(selector)
      return Array.from(imgList).filter(this.filter)
    },
    initImgList() {
      this.imgList.forEach((img) => {
        img.style.cursor = 'zoom-in'
        this.urlList.push(img.src)
      })

    },
    handleImgWrapperClick(e) {
      if (e.target.tagName === 'IMG') {
        let index = Array.from(this.imgList).findIndex(
          (img) => img === e.target
        )
        if (index < 0) return
        this.slotModeVisible = true
        this.currentPosition = index
        this.resetImage()
      }
    },
    resetImage() {
      this.rote = 0
      this.scale = this.initialScale || 1
      this.position = {
        left: 0,
        top: 0,
      }
    },
    handleVisible(visible) {
      if (visible) {
        if (!this.isFirstShow) {
          this.handleFirstVisible()
        }
        this.restoreBody = forbiddenBodyScroll()
      } else {
        this.restoreBody && this.restoreBody()
      }
    },
    handleFirstVisible() {
      // dom渲染后，将其插入body中
      this.isFirstShow = true
      this.$nextTick(() => {
        // 避免 fixed 被祖先元素的 transform 等属性影响定位
        // imagePreview
        const container = this.$refs[this.container] || this.container || document.body
        // container.appendChild(this.$refs.imagePreview)

        // loading
        this.handleImageSourceChange()
      })
    },
    initAspectRatio(e) {
      let width = e.target.offsetWidth
      let height = e.target.offsetHeight
      this.aspectRatio = width / height
      //长宽自适应
      let src = this.finallyImageList[this.currentPosition]
      let img = new Image()
      img.src = src;
      let nWidth, nHeight
      if (img.naturalWidth) { // 现代浏览器
        nWidth = img.naturalWidth
        nHeight = img.naturalHeight
        if(nWidth>nHeight){
          this.class1 = "image-container"
        }else{
          this.class1 = "image-container2"
        }
      } else { // IE6/7/8
        let image = new Image()
        image.src = src
        let that = this;
        image.onload = function() {
          if(image.width>image.height){
            that.class1 = "image-container"
          }else{
            that.class1 = "image-container2"
          }
        }
      }
    },
    handleImageLoad(e) {
      this.initAspectRatio(e)
      this.hideLoading()
      this.$emit('imageLoad')
    },
    // 更新position点
    updatePosition(next) {
      window.event? window.event.cancelBubble = true : e.stopPropagation();

      const _next = this.currentPosition + next
      const _thisC = this.thisCurrent + next
      if (_next >= this.finallyImageList.length) {
        return
      } else if (_next < 0) {
        return
      } else {
        this.currentPosition = _next
        this.thisCurrent = _thisC
      }
      this.$emit('positionUpdated', this.currentPosition)
      this.$emit('currentUpdated', this.thisCurrent)
      this.resetImage()

    },
    handleImageSourceChange() {
      // 等待 dom 渲染之后再取 complete 属性
      this.$nextTick(() => {
        // 加载未缓存图片时，开启 loading
        if (this.$refs.image && !this.$refs.image.complete) {
          // this.showLoading()
        }
      })
    },
    expandImgDb(url){
      if(this.clickTimer){
        window.clearTimeout(this.clickTimer);
        this.clickTimer = null;
      }
      if(url){
        this.showExamplesPreviewer = true;
        this.targetUrl = url;
      }

    },
    showLoading() {
      clearTimeout(this.loadingTimer)
      this.loadingTimer = setTimeout(() => {
        this.loading = true
      }, this.loadingDelay)
    },
    hideLoading() {
      clearTimeout(this.loadingTimer)
      this.loading = false
    },
    leftRotate() {
      if (!this.loading) {
        this.rotateAngle -= this.innerAngle
      }
    },
    rightRotate() {
      if (!this.loading) {
        this.rotateAngle += this.innerAngle
      }
    },
    increaseScale() {
      window.event? window.event.cancelBubble = true : e.stopPropagation();
      !this.loading &&
        this.zoom((scale) => (scale + this.innerScaleStep).toFixed(2)) // 处理精度丢失
    },
    decreaseScale() {
      window.event? window.event.cancelBubble = true : e.stopPropagation();

      !this.loading &&
        this.zoom((scale) => (scale - this.innerScaleStep).toFixed(2)) // 处理精度丢失
    },
    onResetClick() {
      !this.loading && this.reset()
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
    },
    handleImageMouseUp(e) {
      window.removeEventListener('mousemove', this.handleImageMouseMove)
      window.removeEventListener('mouseup', this.handleImageMouseUp)
    },
    // 滚轮缩放
    wheelScale(e) {
      let evt = window.event;
      evt.stopPropagation();
      evt.preventDefault();
      const RATIO = 700 // 实际缩放与缩放偏移量的系数
      let computedScale = this.scale - e.deltaY / RATIO
      this.scale =
        computedScale >= this.innerMinScale
          ? computedScale <= this.innerMaxScale
            ? computedScale
            : this.innerMaxScale
          : this.innerMinScale
    },
    close() {
      if (this.isSlotMode) {
        this.slotModeVisible = false
      } else {
        this.$emit('update:visible', false)
      }
      this.resetImage()
    },
    // 退出
    handlePressESC(e) {
      let { keyCode, code } = e
      if (this.finallyVisible && (keyCode === 27 || code === 'Escape')) {
        this.close()
      }
    },
  },
  created() {
    this.currentPosition = this.startPosition
    if (this.initialScale) {
      this.scale = this.initialScale
    }
  },
}
</script>
<style>
.teacher{
  position: absolute;
  left: 0;
  bottom: 80px;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  border-radius:0 4px 4px 0;
}
.teacher p{
  margin: 0;
  text-align: center;
  border-top: 1px solid #797979;
  padding: 6px 0;
  color: #d6d5d5;
  font-size: 16px;
}
.r_left{
  width: 24px;
  height: 24px;
  background: url("../../assets/left.png") no-repeat;
  display: inline-block;
  position: relative;
  top: 4px;
  left: 16px;
  cursor: pointer;
}
.r_right{
  width: 24px;
  height: 24px;
  background: url("../../assets/right.png") no-repeat;
  display: inline-block;
  position: relative;
  top: 4px;
  left: 34px;
  cursor: pointer;
}
.image-container2 img,.image-container2 .el-image{
  height: 100%;
  width: auto;
}
.image-container img,.image-container .el-image{
  width: 100%;
  height: auto;
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
.el-image-viewer__wrapper .el-image-viewer__img{
  border: 1px solid #fff;
}
</style>
<style lang="scss" scoped>

.fade-in-enter-active,
.fade-in-leave-active {
  transition: opacity 0.25s;
}

.fade-in-enter,
.fade-in-leave-to {
  opacity: 0;
}

.preview-container {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  //background-color: rgba(0, 0, 0, 0.6);
  overflow: hidden;
  user-select: none;
  z-index: 10;
  .image-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    z-index: 0;
    .image-box {
        background:none;
        position: absolute;
        left: 25%;
        right: 30%;
        top: 0;
        display: flex;
        width: 50%;
        height: 100%;
        overflow: hidden;
        justify-content: center;
        align-items: center;
        z-index: 0;
    }
    .image-container {
      position: relative;
      display: inline-block;
      width: 100%;
      .image{
        width: 100%;
        img{
          width: 100%;
          height: auto;
        }
      }
    }
    .image-container2 {
      position: relative;
      display: inline-block;
      height: 100%;
      .image{
        height: 100%;
        img{
          height: 100%;
          width: auto;
        }
      }
    }

    .image {
      border-radius: 4px;
      cursor: move;
    }
  }

  .pos-tip {
    position: absolute;
    top: 48px;
    left: 50%;
    transform: translateX(-50%);
    padding: 8px 15px;
    border-radius: 2px;
    background-color: rgba(0, 0, 0, 0.15);
    color: #fff;
  }

  .hover-icon {
    color: rgba(255, 255, 255, 0.6);
    transition: all 0.15s;
    cursor: pointer;

    &:hover {
      color: rgba(255, 255, 255, 0.95);
    }
  }

  .close {
    position: absolute;
    right: 20px;
    top: 20px;
    padding: 10px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.15);

    &:hover {
      background-color: rgba(0, 0, 0, 0.3);
    }

    .icon {
      font-size: 23px;
      font-weight: bold;
    }
  }

  .arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    padding: 40px 20px;
    text-align: center;

    &:hover {
      background-color: #3d3d3d;
    }

    &-prev {
      left: 0;
    }

    &-next {
      right: 0;
    }

    .icon {
      font-size: 32px;
      font-weight: bold;
    }
    &.disabled {
      cursor: not-allowed;
    }
  }

  .operate-area {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 24px 0;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.5);
    color: rgba(51, 51, 51, 0.4);

    .icon {
      font-size: 24px;

      & + .icon {
        margin-left: 24px;
      }
    }

    .divide {
      display: inline-block;
      width: 1px;
      height: 20px;
      background-color: #d8d8d8;
      border-radius: 1px;
      margin: 0 24px;
      opacity: 0.5;
    }
  }

  .scale-tip {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    padding: 8px 15px;
    border-radius: 2px;
    background-color: rgba(0, 0, 0, 0.7);
    color: #d8d8d8;
    opacity: 0;
    pointer-events: none;
  }

  .fade-enter-active {
    transition: opacity 1.5s;
  }

  .fade-enter {
    opacity: 1;
  }
}
</style>
