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
          <h1 class="sidebar-title">{{ "" }}</h1>
        </div>
         <h1 class="sidebar-title">{{ user.name }}</h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <div class="avatar-wrapper">
<!--           <img :src="user.imgs?user.imgs:''" class="user-avatar" />-->
          <h1 class="sidebar-title">{{ title }}</h1>
        </div>
        <div style="height: 40px;
    position: relative;
    border-bottom: 1px solid #313131;
    padding-bottom: 20px;
    box-sizing: content-box;">
          <el-dropdown
              style="position: absolute;left: 0"
              class="avatar-container right-menu-item hover-effect"
              trigger="click"
          >
            <div class="avatar-wrapper">
              <img
                  :src="getLogo()"
                  class="user-avatar"
              />
            </div>

            <el-dropdown-menu slot="dropdown">
              <!-- <router-link to="/profile/index">
                <el-dropdown-item icon="el-icon-setting">账户设置</el-dropdown-item>
              </router-link> -->

              <!-- <el-dropdown-item icon="el-icon-setting">
                <span @click="pushProfile">账户设置</span>
              </el-dropdown-item>
              <el-dropdown-item icon="el-icon-setting">
                <span @click="changePwd">修改密码</span>
              </el-dropdown-item> -->
              <el-dropdown-item icon="el-icon-circle-close" divided>
                <span @click="logout">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div style="position: absolute;left:66px;width: 100px;height: 44px;">
            <div class="admin" style="font-size: 15px">管理员</div>
            <div class="admin" style="font-size: 13px">{{user.name}}</div>
          </div>
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
  methods: {
    getLogo(){
      let img = localStorage.getItem("user_logo")?require("../../../../assets/school/tx.png"):localStorage.getItem("user_logo")
      return img;
    },
    async logout() {
      // await this.$store.dispatch("user/logout");
      this.$router.push("/login");
    },
  },
  data() {
    return {
      title: 'TOP考试系统',
      user: { name: "", imgs: require("../../../../assets/school/tx.png") },
    };
  },
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}
.admin{
  width: 100px;
  height: 22px;
  line-height: 22px;
  color: #f1f1f1 !important;
  opacity: 1;
  font-size: 14px;
  text-align: left;
}
.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.avatar-wrapper {
  text-align: center;
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
