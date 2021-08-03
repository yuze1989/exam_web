import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

/* Layout */
import Layout from "@/views/layout/index.vue";
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin', 'super','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

export const constantRoutes = [
  {
    path: "/login",
    name: "login",
    component: resolve => require(["@/views/common/login.vue"], resolve),//() => import("@/views/common/login.vue"),
    meta: {
      name: "登录"
    },
    hidden: true
  },

  {
    path: "/404",
    component: resolve => require(["@/views/common/404.vue"], resolve),//() => import("@/views/common/404.vue"),
    hidden: true
  },
  {
    path: "/401",
    component: resolve => require(["@/views/common/401.vue"], resolve),//() => import("@/views/common/401.vue"),
    hidden: true
  },
  {
    path: "/",
    component: Layout,
    hidden: true,
    children: [{
      path: "/gradeRule",
      component: resolve => require(["@/views/manager/gradeRule.vue"], resolve),//() => import("@/views/profile/index.vue"),
      meta: {
        name: "打分规则",
        icon: "user",
        noCache: true
      }
    },  
  ]
  }, 
  {
    path: "/",
    component: Layout,

    hidden: true,
    children: [{
      path: "/profile",
      component: resolve => require(["@/views/profile/index.vue"], resolve),//() => import("@/views/profile/index.vue"),
      meta: {
        name: "账户设置",
        icon: "user",
        noCache: true
      }
    },  
  ]
  }, 
];

export const asyncRouter = [
  {
    path: "/",
    component: Layout,
    name: "examManage",
    id: 79,
    code: 10079,
    meta: {
      name: '考试报名',
      icon: 'classmate'
    },
    children: [
      {
        path: "/applyConfirm",
        id: 80,
        code: 10080,
        component: resolve => require(["@/views/examManage/applyConfirm/index.vue"], resolve),//() => import("@/views/school/index.vue"),
        meta: {
          name: '考试信息管理',
          icon: 'classmate'
        }
      },
      {
        path: "/messageManage",
        id: 81,
        code: 10081,
        component: resolve => require(["@/views/manager/ruleList.vue"], resolve),
        // component: resolve => require(["@/views/examManage/messageManage/index.vue"], resolve),
        meta: {
          name: '考试信息管理',
          icon: 'classmate'
        }
      },
      {
        path: "/roomManage",
        id: 83,
        code: 10083,
        component: resolve => require(["@/views/examManage/roomManage/index.vue"], resolve),//() => import("@/views/school/index.vue"),
        meta: {
          name: '画室管理',
          icon: 'classmate'
        }
      }
    ]
  },
  {
    path: "/",
    component: Layout,
    name: "orderManage",
    id: 6,
    code: 10006,
    meta: {
      name: '订单管理',
      icon: 'set'
    },
    children: [
      {
        path: "/orderAccount",
        id: 20,
        code: 10020,
        component: resolve => require(["@/views/orderManage/orderAccount/index.vue"], resolve),//() => import("@/views/orderManage/index.vue"),
        meta: {
          name: '订单管理',
          icon: 'notice-fill'
        },
      },
      // {
      //   path: "/orderAudit",
      //   id: 20,
      //   code: 10021,
      //   component: resolve => require(["@/views/orderManage/orderAudit/index.vue"], resolve),//() => import("@/views/orderManage/index.vue"),
      //   meta: {
      //     name: '订单审核',
      //     icon: 'notice-fill'
      //   },
      // }
    ]
  },
  {
    path: "/",
    component: Layout,
    name: "authManage",
    id: 8,
    code: 10008,
    meta: {
      name: '权限管理',
      icon: 'set'
    },
    children: [
      {
        path: "/authManage",
        id: 16,
        code: 10016,
        component: resolve => require(["@/views/authManage/roleManage/index.vue"], resolve),//() => import("@/views/authManage/roleManage/index.vue"),
        meta: {
          name: '角色管理',
          icon: 'classmate'
        },
      }, {
        path: "/userManage",
        id: 17,
        code: 10017,
        component: resolve => require(["@/views/authManage/userManage/index.vue"], resolve),//() => import("@/views/authManage/userManage/index.vue"),
        meta: {
          name: '用户管理',
          icon: 'classtime'
        },
      }
    ]
  },
];

const createRouter = () =>
  new VueRouter({
    mode: "history", // require service support
    scrollBehavior: () => ({
      y: 0
    }),
    routes: constantRoutes
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
