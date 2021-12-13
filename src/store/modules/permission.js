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
    if (menu.id == item.id) {
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

  childens.forEach((router, index) => {
      subMenus.forEach((item, index) => {
        if(item.parentId == 106 && item.id == router.id){
        }
      if (item.id == router.id) {
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
    let parentIdList= new Array()
    let meanId= new Array()

    menus.forEach((item, index) => {
      if (item.parentId == 0) {
        parentMenus.push(item)
        parentIdList.push(item.id)
      }
    })
    menus.forEach((item, index) => {
      if (item.parentId != 0 && parentIdList.indexOf(item.parentId) == -1) {
        parentIdList.push(item.parentId)
        parentMenus.push(item)
        meanId.push(item.id)
      }
    })

    let dataAll =[
      {
        "id": 84,
        "nameCn": "考生管理",
        "nameEn": null,
        "remark": null,
        "parentId": 0,
        "orderNumber": 79,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10084",
        "isSys": false,
        "usable": 1
      },
      {
        "id": 87,
        "nameCn": "学生管理",
        "nameEn": null,
        "remark": null,
        "parentId": 84,
        "orderNumber": 82,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10087",
        "isSys": false,
        "usable": 1
      },
      {
        "id": 92,
        "nameCn": "生成准考证号",
        "nameEn": null,
        "remark": null,
        "parentId": 84,
        "orderNumber": 87,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10092",
        "isSys": false,
        "usable": 1
      },
      {
        "id": 93,
        "nameCn": "试卷管理",
        "nameEn": null,
        "remark": null,
        "parentId": 0,
        "orderNumber": 88,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10093",
        "isSys": false,
        "usable": 0
      },
      {
        "id": 94,
        "nameCn": "阅卷管理",
        "nameEn": null,
        "remark": null,
        "parentId": 93,
        "orderNumber": 89,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10094",
        "isSys": false,
        "usable": 1
      },
      {
        "id": 95,
        "nameCn": "分配试卷",
        "nameEn": null,
        "remark": null,
        "parentId": 93,
        "orderNumber": 90,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10095",
        "isSys": false,
        "usable": 1
      },
      {
        "id": 96,
        "nameCn": "批改试卷",
        "nameEn": null,
        "remark": null,
        "parentId": 93,
        "orderNumber": 91,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10096",
        "isSys": false,
        "usable": 1
      },
      {
        "id": 97,
        "nameCn": "成绩管理",
        "nameEn": null,
        "remark": null,
        "parentId": 0,
        "orderNumber": 92,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10097",
        "isSys": false,
        "usable": 1
      },
      {
        "id": 98,
        "nameCn": "成绩查询",
        "nameEn": null,
        "remark": null,
        "parentId": 97,
        "orderNumber": 93,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10098",
        "isSys": false,
        "usable": 1
      },
      {
        "id": 101,
        "nameCn": "成绩录入",
        "nameEn": null,
        "remark": null,
        "parentId": 97,
        "orderNumber": 96,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10101",
        "isSys": false,
        "usable": 1
      },
      {
        "id": 102,
        "nameCn": "用户管理",
        "nameEn": null,
        "remark": null,
        "parentId": 0,
        "orderNumber": 97,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10102",
        "isSys": false,
        "usable": 0
      },
      {
        "id": 103,
        "nameCn": "角色管理",
        "nameEn": null,
        "remark": null,
        "parentId": 102,
        "orderNumber": 98,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10103",
        "isSys": false,
        "usable": 1
      },
      {
        "id": 104,
        "nameCn": "用户管理",
        "nameEn": null,
        "remark": null,
        "parentId": 102,
        "orderNumber": 99,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10104",
        "isSys": false,
        "usable": 1
      },
      {
        "id": 105,
        "nameCn": "关联考试",
        "nameEn": null,
        "remark": null,
        "parentId": 102,
        "orderNumber": 100,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10105",
        "isSys": false,
        "usable": 1
      },
      {
        "id": 106,
        "nameCn": "系统设置",
        "nameEn": null,
        "remark": null,
        "parentId": 0,
        "orderNumber": 101,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10106",
        "isSys": false,
        "usable": 1
      },
      {
        "id": 107,
        "nameCn": "打分设置",
        "nameEn": null,
        "remark": null,
        "parentId": 106,
        "orderNumber": 102,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10107",
        "isSys": false,
        "usable": 1
      },
      {
        "id": 109,
        "nameCn": "考场管理",
        "nameEn": null,
        "remark": null,
        "parentId": 84,
        "orderNumber": 104,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10109",
        "isSys": false,
        "usable": 1
      },
      {
        "id": 110,
        "nameCn": "导出二维码",
        "nameEn": null,
        "remark": null,
        "parentId": 84,
        "orderNumber": 105,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10110",
        "isSys": false,
        "usable": 1
      },
      {
        "id": 111,
        "nameCn": "机构管理",
        "nameEn": null,
        "remark": null,
        "parentId": 0,
        "orderNumber": 106,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10111",
        "isSys": false,
        "usable": 0
      },
      {
        "id": 112,
        "nameCn": "机构信息",
        "nameEn": null,
        "remark": null,
        "parentId": 111,
        "orderNumber": 107,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10112",
        "isSys": false,
        "usable": 1
      },
      {
        "id": 113,
        "nameCn": "机构关联考试",
        "nameEn": null,
        "remark": null,
        "parentId": 111,
        "orderNumber": 108,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10113",
        "isSys": false,
        "usable": 1
      },
      {
        "id": 121,
        "nameCn": "导出准考证",
        "nameEn": null,
        "remark": null,
        "parentId": 84,
        "orderNumber": 116,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10121",
        "isSys": false,
        "usable": 1
      },
      {
        "id": 122,
        "nameCn": "考试管理",
        "nameEn": null,
        "remark": null,
        "parentId": 0,
        "orderNumber": 117,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10122",
        "isSys": false,
        "usable": 0
      },
      {
        "id": 123,
        "nameCn": "二维码模板",
        "nameEn": null,
        "remark": null,
        "parentId": 122,
        "orderNumber": 118,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10123",
        "isSys": false,
        "usable": 1
      },
      {
        "id": 124,
        "nameCn": "准考证模板",
        "nameEn": null,
        "remark": null,
        "parentId": 122,
        "orderNumber": 119,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10124",
        "isSys": false,
        "usable": 1
      },
      {
        "id": 125,
        "nameCn": "考试信息",
        "nameEn": null,
        "remark": null,
        "parentId": 122,
        "orderNumber": 120,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10125",
        "isSys": false,
        "usable": 1
      },
      {
        "id": 126,
        "nameCn": "归档管理",
        "nameEn": null,
        "remark": null,
        "parentId": 0,
        "orderNumber": 121,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10126",
        "isSys": false,
        "usable": 0
      },
      {
        "id": 127,
        "nameCn": "成绩数据导出",
        "nameEn": null,
        "remark": null,
        "parentId": 126,
        "orderNumber": 122,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10127",
        "isSys": false,
        "usable": 1
      },
      {
        "id": 128,
        "nameCn": "成绩数据归档",
        "nameEn": null,
        "remark": null,
        "parentId": 126,
        "orderNumber": 123,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10128",
        "isSys": false,
        "usable": 1
      },
      {
        "id": 129,
        "nameCn": "脱敏设置",
        "nameEn": null,
        "remark": null,
        "parentId": 106,
        "orderNumber": 124,
        "enabled": null,
        "iconClass": null,
        "url": null,
        "openAuth": false,
        "type": 1,
        "code": "10129",
        "isSys": false,
        "usable": 1
      }
    ]

    parentMenus = []
    parentIdList.forEach((item)=>{
      if(meanId.indexOf(item) == -1){
        dataAll.forEach((a)=>{
          if(a.id == item){
            parentMenus.push(a)
            menus.push(a)
          }
        })

      }
    })


    //父标签重排
    let newA = [];
    asyncRouter.forEach((item,index) =>{
      newA.push(item.id)
    })

    parentMenus.sort((a,b)=>{
      let order= newA;
      return order.indexOf(a.id)-order.indexOf(b.id);
    });

    let subMenus = new Array()
    menus.forEach((item, index) => {
      if (item.usable == 1)
        subMenus.push(item)
    })
    parentMenus.forEach((item, index) => {
      let router = filterAsyncParentRouters(item, subMenus)
      if (router) {
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