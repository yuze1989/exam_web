import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";
import router from "../router/index"
import qs from 'qs'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000000000 // request timeout
});

// const address = {
//   "/train/teacher/insert": process.env.VUE_APP_BASE_API3,
//   "/train/teacher/page": process.env.VUE_APP_BASE_API3,
//   "art/user/login": process.env.VUE_APP_BASE_API3,
//   "art/user/sendAuthCode": process.env.VUE_APP_BASE_API3,
//   "train/class/page": process.env.VUE_APP_BASE_API3,
//   "train/class/copy": process.env.VUE_APP_BASE_API3
// };

// request interceptor
service.interceptors.request.use(
  config => {

    try{
      // url处理
      var temp1 = config.url.split('?');
      var pram = temp1[1];
      var xx = temp1[0];
      var keyValue = pram.split('&');
      var obj = {};
      for (var i = 0; i<keyValue.length; i++){
        var item = keyValue[i].split('=');
        var key = item[0];
        var value = item[1];
        obj[key] = value;
      }

      let xxx= [];
      for(let i in  obj){
        xxx.push(i+'='+encodeURIComponent(obj[i]))
      }
      let str = xxx.join("&")
      config.url = xx+'?'+str

    }catch{}



    if (store.getters.token) {
      config.headers["Art-Token"] = getToken();
    }
    if(config.url.includes("import")){
      config.headers["content-type"] = "multipart/form-data";
    }
    if(config.url.includes("examineeUpdate")||config.url.includes("examineeCreate")||config.url.includes("BatchImport")){
      config.headers["content-type"] = "multipart/form-data; boundary=----WebKitFormBoundarynw0GeE106ZtdDvHA";
    }
    if(config.url.includes("exportExcel")){
      config.responseType = 'blob';
    }
    if(config.url.includes("ticketCreate")){
      config.headers["content-type"] = "application/json";
    }
    if(config.url.includes("import/list")){
      config.headers["content-type"] = "application/json";
    }
    if(config.url.includes("score_query")){
      config.headers["content-type"] = "application/x-www-form-urlencoded";
    }
    if(config.url.includes("score_query_v2")){
      config.headers["content-type"] = "application/x-www-form-urlencoded";
    }
    
    // if (address[config.url]) {
    //   config.url = address[config.url] + config.url;
    // } else {
    //   config.url = process.env.VUE_APP_BASE_API + config.url;
    // }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    let res = {}
    res = response.data || {}
    if(response.config.url.includes("exportExcel")){
      const blob = new Blob([res], {type: "application/vnd.ms-excel;charset=utf-8"});//处理文档流
      const fileName = '导出列表.xls';
      const elink = document.createElement('a');
      elink.download = fileName;
      elink.style.display = 'none';
      elink.href = URL.createObjectURL(blob);

      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
      return
    }

    if (res.code == 200) {
      return Promise.resolve(res);
    } else if (res.code == 111 || res.code == 103) {
      router.push({ path: '/login' })
    } else if(res.code == 506 || res.code == 505){
      router.push({ path: '/login' })
      var m ;
      m.close()
      m = Message({
        showClose: true,
        message: '登录过期，该账号已在其他地方登录！',
        type: 'error',
        duration:0,
      });
    }else if(res.code == 500){
      Message({
        type: "error",
        message: res.message,
      })
      return Promise.resolve(res);
    } else {
      Message({
        type: "error",
        message: res.message,
      })
      res = null
    }
    return Promise.reject(res);
  },
  error => {

    Message({
      message: "网络开小差了",
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
