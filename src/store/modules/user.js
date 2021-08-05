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
    console.log(commit,data)
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
        console.log(response,'111')
        if (response.code == "200") {
          response.result.user ={}
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
          resolve(response);
        } else {
          Message.error(response.message);
          reject();
        }
      }).catch(err=>{
        reject(err);
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