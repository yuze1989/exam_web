<!--顶部导航-->
<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->

    <div class="right-menu">
      <div class="titleContain">
        <span class="titleName" style="cursor: default"
          >欢迎回来，{{ user && user.name ? "" : ""}}
        </span>

        <span class="titleTip" style="cursor: default">考试管理系统 </span>
      </div>
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img
            :src="user.imgs ? user.imgs : './img/mr.png'"
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
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import Breadcrumb from "@/components/Breadcrumb/index.vue";
import Hamburger from "@/components/Hamburger/index.vue";

export default {
  components: {
    // Breadcrumb,
    Hamburger,
  },
  props: {
    changePwdAction: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      visible: false,
      user: {
        name: "",
        imgs: require("../../../assets/school/tx.png"),
        loginCode: "",
      },
    };
  },
  computed: {
    ...mapGetters(["sidebar", "userName", "loginCode", "imgUrl"]),
  },
  created() {
    this.$bus.$on("upDateUserInfo", (params) => {
      console.log("navibar upDateUserInfo");
      this.user.name = localStorage.getItem("user_name");
      if (localStorage.getItem("user_avatar") !== "null") {
        this.user.imgs = localStorage.getItem("user_avatar");
      }
    });
    this.user.name = localStorage.getItem("user_name");

    this.user.loginCode = localStorage.getItem("user_loginCode");
    if (localStorage.getItem("user_avatar") !== "null") {
      this.user.imgs = localStorage.getItem("user_avatar");
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    pushProfile() {
      //console.log("aaaaaa");
      this.$router.push({ path: "/profile" });
    },
    changePwd() {
      //("changePwdAction")
      this.changePwdAction();
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 55px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
    .titleContain {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .titleName {
        line-height: 2rem;
        font-size: 1rem;
        font-weight: bold;
      }
      .titleTip {
        line-height: 1rem;
        font-size: 0.2rem;
      }
    }

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 15px;
      color: rgba(0, 0, 0, 0.65);
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      .avatar-wrapper {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 30px;
          border: 1px solid #e1e4e8;
        }
      }
    }
  }
}
</style>
