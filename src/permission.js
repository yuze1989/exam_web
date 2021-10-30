import router from "./router";
import store from "./store";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import {
  getToken,
  getMenu,
  setToken
} from "@/utils/auth";
NProgress.configure({
  showSpinner: false
});
if(window.location.href.indexOf("/qrcode") != -1 || window.location.href.indexOf("/query_score") != -1){

}else{
  const whiteList = ["/login"];

  router.beforeEach(async (to, from, next) => {

    NProgress.start();
    document.title = ("考试后台管理");

    const hasToken = getToken();
    // // 如果 Cookie 里面有登录凭证，说明已经登录过了
    if (hasToken) {
      if (to.path === "/login") {
        next();
        NProgress.done();
      } else {
        const hasRoles = store.getters.roles && store.getters.roles.length > 0;
        const menus = getMenu();
        if (hasRoles) {
          next()
        } else {
          try {
            const {
              roles,
              routes
            } = await store.dispatch("user/getInfo");
            const accessRoutes = await store.dispatch("permission/generateRoutes", {
              menus,
              routes
            });
            if(accessRoutes&&accessRoutes.length<1){ //系统修复
              next({ path: "/login" });
              NProgress.done();
              return
            }
            router.addRoutes(accessRoutes);
            next({
              ...to,
              replace: true
            });
          } catch (error) {
            await store.dispatch("user/resetToken");
            next("/login");
            NProgress.done();
          }
        }
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next();
      } else {
        next({ path: "/login" });
        NProgress.done();
      }
    }


  });

  router.afterEach(() => {
    NProgress.done();
  });
}


