<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <div class="coll-avatar-wrapper">
          <!-- <img :src="user.imgs?user.imgs:'./img/mr.png'" class="user-avatar" /> -->
          <h1 class="sidebar-title">{{ "    " }}</h1>
        </div>
        <!-- <h1 class="sidebar-title">{{ user.name }}</h1> -->
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <div class="avatar-wrapper">
          <!-- <img :src="user.imgs?user.imgs:''" class="user-avatar" /> -->
          <h1 class="sidebar-title">{{ title }}</h1>
        </div>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },
  created() {
    this.$bus.$on("upDateUserInfo", (params) => {
      console.log("logo upDateUserInfo");
      this.user.name = localStorage.getItem("user_name");
      if (localStorage.getItem("user_avatar") !== "null") {
        this.user.imgs = localStorage.getItem("user_avatar");
      }
    });
    this.user.name = localStorage.getItem("user_name");
    if (localStorage.getItem("user_avatar") !== "null") {
      this.user.imgs = localStorage.getItem("user_avatar");
    }
  },
  methods: {},
  data() {
    return {
      title: "考试管理后台",
      user: { name: "", imgs: require("../../../../assets/school/tx.png") },
    };
  },
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.avatar-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;

  .user-avatar {
    cursor: pointer;
    width: 30px;
    height: 30px;
    border-radius: 30px;
    border: 1px solid #e1e4e8;
  }
}

.coll-avatar-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
  padding-left: 0.5rem;
  padding-right: 1rem;

  .user-avatar {
    cursor: pointer;
    width: 30px;
    height: 30px;
    border-radius: 30px;
    border: 1px solid #e1e4e8;
  }
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #00152a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      // width: 32px;
      height: 26px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      vertical-align: middle;
      font-size: 20px;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
