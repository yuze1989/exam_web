<template>
  <el-dialog
    :visible.sync="visible"
    :show-close="true"
    :close-on-click-modal="false"
    :before-close="handleClose"
    width="50%"
    center
  >
    <div  slot="title">{{title}}</div>
    <div class="artVideo">
      <video-player
        class="video-player-box vjs-custom-skin"
        ref="videoPlayer"
        :options="playerOptions"
        :playsinline="true"
        customEventName="customstatechangedeventname"
        @play="onPlayerPlay($event)"
        @pause="onPlayerPause($event)"
        @ended="onPlayerEnded($event)"
        @waiting="onPlayerWaiting($event)"
        @playing="onPlayerPlaying($event)"
        @loadeddata="onPlayerLoadeddata($event)"
        @timeupdate="onPlayerTimeupdate($event)"
        @canplay="onPlayerCanplay($event)"
        @canplaythrough="onPlayerCanplaythrough($event)"
        @statechanged="playerStateChanged($event)"
        @ready="playerReadied"
      >
      </video-player>
      <!-- <div class="close-img" @click="onClose">
        <span class="el-icon-close close-item"></span>
      </div> -->
    </div>
  </el-dialog>
</template>

<script>
// require styles
import "vue-video-player/src/custom-theme.css";
import "video.js/dist/video-js.css";

import { videoPlayer } from "vue-video-player";
export default {
  components: {
    videoPlayer,
  },
  props: {
    url: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: " ",
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // playerOptions: {
      //   // videojs options
      //   muted: true,
      //   language: "en",
      //   fluid: true,
      //   playbackRates: [0.7, 1.0, 1.5, 2.0],
      //   fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
      //   sources: [
      //     {
      //       type: "video/mp4",
      //       src:this.url,
      //     },
      //   ],
      //   poster: "/static/images/author.jpg",
      // },
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4", // 类型
            src: this.url,
            //src: require("../assets/img/sp.mp4"), // url地址
          },
        ],
        poster: "", // 封面地址
        // notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true, // 是否显示全屏按钮
        },
      },
    };
  },
  mounted() {
    // console.log(
    //   "this is current player instance object",
    //   this.$refs.videoPlayer
    // );
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    },
  },
  methods: {
    onClose() {
      this.$emit("update:visible", false);
    },
    handleClose() {
     this.$refs.videoPlayer.player.pause()
      this.$emit("update:visible", false);
    },

    open() {},
    // listen event
    onPlayerPlay(player) {
      // console.log('player play!', player)
    },
    onPlayerPause(player) {
      // console.log('player pause!', player)
    },
    // ...player event

    onPlayerEnded(player) {},
    onPlayerWaiting(player) {},
    onPlayerPlaying(player) {},
    onPlayerLoadeddata(player) {},
    onPlayerTimeupdate(player) {},
    onPlayerCanplay(player) {},
    onPlayerCanplaythrough() {},

    // or listen state event
    playerStateChanged(playerCurrentState) {
      // console.log('player current update state', playerCurrentState)
    },

    // player is ready
    playerReadied(player) {
      console.log("the player is readied", player);
      // you can use it to do something...
      // player.[methods]
    },
  },
};
</script>


<style >
.video-js .vjs-icon-placeholder {
  width: 100%;
  height: 100%;
  display: block;
}

.video-js .vjs-big-play-button {
  margin-top: 25%; /*偏移*/
  margin-left: 50%;
  transform: translateX(-50%);
}
</style>

<style lang="scss" scoped>

.artVideo {
  position: absolute;
  width: 80%;
  height: 500px;
  left: 0;
  top: 0;
  margin-left: 50%;
  margin-top: 10%;
  transform: translateX(-50%);
}
.close-img {
  width: 6rem;
  height: 6rem;
  position: absolute;
  top: 0;
  left: 0;
  font-size: 0.3rem;
  margin-top: -5%;
  margin-left: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff3d;
  border-radius: 0.5rem;
}
.close-item {
  font-size: 30px;
}
</style>