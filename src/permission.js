import router from "./router";
import store from "./store";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import {
  getToken,
  getMenu
} from "@/utils/auth"; // get token from cookie
import settings from "@/settings";

NProgress.configure({
  showSpinner: false
}); // NProgress Configuration

const whiteList = ["/login"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = to.meta.name + "-" + (settings.title || "后台管理");

  // determine whether the user has logged in
  const hasToken = getToken();


  // // 如果 Cookie 里面有登录凭证，说明已经登录过了
  if (hasToken) {
    // 用户登录过了，但是他故意去登录页面，那么我得直接跳转到首页


    if (to.path === "/login") {
      // if is logged in, redirect to the home page
      next();
      NProgress.done();
    } else {

      //determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0;

      const menus = getMenu();
      //console.log(JSON.stringify(menus))
      if (hasRoles) {
        next()
      } else {
        try {
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const {
            roles,
            routes
          } = await store.dispatch("user/getInfo");

          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch("permission/generateRoutes", {
            menus,
            routes
          });

          //     // dynamically add accessible routes
          router.addRoutes(accessRoutes);

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          // next({ path: "/", replace: true });
          //console.log(to)


          next({
            ...to,
            replace: true
          });
        } catch (error) {

          await store.dispatch("user/resetToken");
          console.log(error || "permission error");
          next("/login");
          NProgress.done();
        }
      }
    }
  } else {
    console.log(to.path,'to.path')
    next();
    // if (whiteList.indexOf(to.path) !== -1) {
    //   next();
    // } else {
    //   console.log('error login')
    //   next({ path: "/login" });
    //   NProgress.done();
    // }
  }
});

router.afterEach(() => {
  NProgress.done();
});
