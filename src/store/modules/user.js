import {
  getToken,
  setToken,
  removeToken,
  setUsers
} from "@/utils/auth";
import {
  resetRouter
} from "@/router";
import request from "@/utils/request";
import {
  Message
} from "element-ui";

import Layout from "@/views/layout/index.vue";

const state = {
  token: getToken(),
  userName: "",
  nickname: "",
  loginCode: "",
  imgUrl: "",
  roles: [],
  menu: []
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USERNAME: (state, username) => {
    state.userName = username;
  },
  SET_NICKNAME: (state, nickname) => {
    state.nickname = nickname;
  },
  SET_IMGURL: (state, imgUrl) => {
    state.imgUrl = imgUrl;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_MENU: (state, menu) => {
    state.menu = menu;
  },
  SET_LOGINCODE: (state, loginCode) => {
    state.loginCode = loginCode;
  }
};

const actions = {
  login({
    commit
  }, data) {
    return new Promise((resolve, reject) => {
      request({
        url: "/user/login",
        method: "post",
        data:{
          "imgCode": data.imgCode,
          "imgCodeKey": data.imgCodeKey,
          "password": data.password,
          "username": data.username,
        }
      }).then(response => {
        console.log(response.code,response,'111')
        if (response.code == "200") {
          response.result.user ={
            // address: "浙江杭州滨江",
            // city: "杭州市",
            // collect: false,
            // collectCount: 0,
            // companyCheck: false,
            // county: "滨江区",
            // description: null,
            // fansCount: 0,
            // id: "319",
            // idcardCheck: false,
            // isCompany: true,
            // isTeacher: false,
            // lastLoginTime: "2021-08-02 22:45:38",
            // loginCode: "888",
            // loginIdentity: -1,
            // mobilePhone: "1588888888",
            // nickName: "老张",
            // pingFee: 0,
            // province: "浙江省",
            // roleId: 0,
          }
          console.log(response)
          commit("SET_TOKEN", response.result.token);
          commit("SET_MENU", response.result.menuList);
          commit("SET_USERNAME", response.result.user.userName);
          commit("SET_IMGURL", response.result.user.imgUrl);
          commit("SET_MENU", response.result.menuList);
          commit("SET_LOGINCODE", response.result.user.loginCode);
          commit("SET_ROLES", null);
          setToken(response.result.token);
          localStorage.setItem("user_name", response.result.user.userName);
          localStorage.setItem("user_avatar", response.result.user.imgUrl);
          localStorage.setItem("user_loginCode", response.result.user.loginCode);
          localStorage.setItem("menu", JSON.stringify(response. result.menuList))
          // console.log(response. result.user.loginCode,'222')
          resolve(response);
        } else {
          Message.error(response.message);
          reject();
        }
      })
    });
  },

  getInfo({
    commit
  }) {
    return new Promise((resolve, reject) => {
      commit("SET_ROLES", ["admin"]);
      resolve({
        roles: ["admin"],
        routes: [{
          path: "*",
          alwaysShow: true,
          component: Layout,
          redirect: "/404",
          hidden: true
        }]
      });

      // request({
      //   url: "/admin/admin/info",
      //   method: "get"
      // }).then(response => {
      //   // roles must be a non-empty array
      //   if (!response.roles || response.roles.length <= 0) {
      //     reject("该角色不存在");
      //   }

      //   commit("SET_ROLES", response.roles);
      //   commit("SET_USERNAME", response.username);
      //   commit("SET_NICKNAME", response.nickname);
      //   resolve(response);
      // }).catch(error => {
      //   reject(error);
      // });
    });
  },

  logout({
    commit,
    dispatch
  }) {
    return new Promise((resolve) => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      commit("SET_MENU", []);
      localStorage.removeItem("currentSchoolId")
      removeToken();
      resetRouter();
      // dispatch("tagsView/delAllViews", null, {
      //   root: true
      // });
      resolve();
    });
  },
  //
  upDateInfo({
    commit
  }, data) {
    return new Promise(resolve => {
      commit("SET_USERNAME", data.userName);
      commit("SET_IMGURL", data.imgUrl);
    });

  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      commit("SET_MENU", []);
      removeToken();
      resolve();
    });

  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};