import Vue from "vue";
import VueRouter from "vue-router";
import router from "./router";
import ElementUI from "element-ui";

import "element-ui/lib/theme-chalk/index.css";

import App from "./App.vue";

import store from "./store";
import axios from "./utils/request";
import "./icons";
import "@/styles/index.scss"; // global css
import "./permission";
import API from "./utils/api";
import dayjs from "dayjs";
import myPagination from "@/components/pagination";
import { bus } from "./Bus";
import { Tab, Tabs, CountDown, Button } from "vant";
import { validater } from "@/api/valid";
// 使用 vue-meta
import Meta from "vue-meta";
import _ from "lodash";
Vue.use(Meta);

Vue.use(ElementUI);

Vue.use(Tab);

Vue.use(Tabs);
Vue.use(CountDown);
Vue.use(Button);

Vue.prototype._ = _;
//拖拽组件
import VueDragResize from "vue-drag-resize";
Vue.component("vue-drag-resize", VueDragResize);

Vue.component("myPagination", myPagination);
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};
Vue.prototype.$rules = validater; //表单验证规则
Vue.prototype.$bus = bus; //接口列表
Vue.prototype.API = API; //接口列表
// 引入全局插件和函数
Object.defineProperty(Vue.prototype, "$axios", {
  value: axios,
});

Object.defineProperty(Vue.prototype, "$dayjs", {
  value: dayjs,
});

// main.js
Vue.directive("fo", {
  inserted(el, binding, vnode) {
    // 聚焦元素
    el.querySelector("input").focus();
  },
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
