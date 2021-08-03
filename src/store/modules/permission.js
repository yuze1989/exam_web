import {
  constantRoutes,
  asyncRouter
} from "@/router";
// import { asyncRoutes, constantRoutes } from "@/router";

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role));
  } else {
    return true;
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = [];

  routes.forEach(route => {
    const tmp = {
      ...route
    };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });

  return res;
}


export function filterAsyncParentRouters(menu, subMenus) {

  let router = null
  asyncRouter.forEach((item, index) => {
    if (menu.code == item.code) {

      let childenRouter = filterAsyncChildenRouters(item.children, subMenus)
      if (index == 0 && childenRouter && childenRouter.length > 0) {
        let child = childenRouter[0]
        router = { redirect: child.path, ...item, children: childenRouter, meta: { ...item.meta, name: menu.nameCn, usable: menu.usable } }
      } else {
        router = { ...item, children: childenRouter, meta: { ...item.meta, name: menu.nameCn, usable: menu.usable } }

      }

    }
  })

  return router

}

export function filterAsyncChildenRouters(childens, subMenus) {

  let childenRouter = [];
  subMenus.forEach((item, index) => {
    childens.forEach((router, index) => {
      if (item.code == router.code) {
      //  console.log(JSON.stringify(item))
        childenRouter.push({ ...router, meta: { ...router.meta, name: item.nameCn, usable: item.usable } })
      }

    });
  })

  return childenRouter;


}

const state = {
  routes: [],
  addRoutes: []
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes);
  }
};

const actions = {
  generateRoutes({
    commit
  }, data) {

    const menus = data.menus;

    let realRoutes = new Array()
    let parentMenus = new Array()
    menus.forEach((item, index) => {
      if (item.parentId == 0) {
        parentMenus.push(item)
      }

    })

    let subMenus = new Array()
    menus.forEach((item, index) => {
      if (item.parentId > 0)
        subMenus.push(item)
    })

    parentMenus.forEach((item, index) => {

      let router = filterAsyncParentRouters(item, subMenus)
      if (router) {
       // console.log("roter:" + JSON.stringify(router));
        realRoutes.push(router)
      }
    })

    //console.log("realRoutes" + realRoutes)


    // const componentMap = {
    //   // Layout: () => import("@/views/layout"),
    //   // SettingAdmin: () => import("@/views/setting/admin/index"),
    //   // SettingRole: () => import("@/views/setting/role/index"),
    //   // // ArticlePost: () => import("@/pages/article/post/index"),
    //   // // ArticleAlgorithm: () => import("@/pages/article/algorithm/index"),
    //   // // ArticleTip: () => import("@/pages/article/tip/index"),
    //   // // TagList: () => import("@/pages/article/tag/index"),
    //   // // CommentIndex: () => import("@/pages/article/comment/index"),
    //   // // SingleBooks: () => import("@/pages/single/books/index"),
    //   // // SingleMovies: () => import("@/pages/single/movies/index"),
    //   // UserMember: () => import("@/views/user/member/index")
    // };
    // for (let i = 0; i < routes.length; i++) {
    //   if (typeof routes[i].component !== "undefined") {
    //     routes[i].component = componentMap[routes[i].component];
    //   }
    //   if (typeof routes[i].children !== "undefined") {
    //     for (let j = 0; j < routes[i].children.length; j++) {
    //       if (typeof routes[i].children[j].component !== "undefined") {
    //         routes[i].children[j].component = componentMap[routes[i].children[j].component];
    //       }
    //     }
    //   }
    // }
    return new Promise(resolve => {
      commit("SET_ROUTES", realRoutes || []);
      resolve(realRoutes || []);
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};