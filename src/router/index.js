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
        path: "/qrcode",
        meta:{
            name:"小程序查分",
            nacy:"true"
        },
        component: resolve => require(["@/views/examManage/roomManage/qrcode.vue"], resolve),//() => import("@/views/common/401.vue"),
        hidden: true
    },
    {
        path: "/query_score",
        meta:{
            name:"小程序查分",
            nacy:"true"
        },
        component: resolve => require(["@/views/examManage/roomManage/queryScore.vue"], resolve),//() => import("@/views/common/401.vue"),
        hidden: true
    },
    {
        path: "/adminXXXXXXXXXDDDDDD",
        component: resolve => require(["@/views/examManage/examRoomManage/admin.vue"], resolve),//() => import("@/views/common/401.vue"),
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
            path: "/index",
            component: resolve => require(["@/views/profile/index.vue"], resolve),//() => import("@/views/profile/index.vue"),
            meta: {
                name: "账户设置",
                icon: "user",
                noCache: true
            }
        },
            {
                path: "/eaxmUpLoad",
                name:"eaxmUpLoad",
                component: resolve => require(["@/views/examList/upLoad.vue"], resolve),//() => import("@/views/profile/index.vue"),
                meta: {
                    name: "上传进度",
                    icon: "user",
                    noCache: true
                }
            },
            {
                path: "/paperManage",
                name:"paperManage",
                component: resolve => require(["@/views/examList/paperManage.vue"], resolve),//() => import("@/views/profile/index.vue"),
                meta: {
                    name: "批改试卷",
                    icon: "user",
                    noCache: true
                }
            },
            {
                path: "/ArchiveDetails",
                name:"ArchiveDetails",
                component: resolve => require(["@/views/authManage/gradesManage/ArchiveDetails.vue"], resolve),//() => import("@/views/authManage/roleManage/index.vue"),
                meta: {
                    name: '成绩数据归档详情',
                    icon: 'classmate'
                },
            },
            {
                path: "/TeacherExamList",
                name:'TeacherExamList',
                component: resolve => require(["@/views/teacherManage/examList/index2.vue"], resolve),
                meta: {
                    name: '教师关联考试',
                    icon: 'classmate'
                },
            },
            {
                path: "/marking",
                name:'marking',
                component: resolve => require(["@/views/examList/marking.vue"], resolve),
                meta: {
                    name: '批改试卷',
                    icon: 'classmate'
                },
            },
            {
                path: "/templateManage4",
                name:"templateManage4",
                component: resolve => require(["@/views/templateManage2/index3.vue"], resolve),
                meta: {
                    name: '脱敏设置',
                    icon: 'classtime'
                },

            },
            {
                path: "/addTicketTemplate",
                name:'AddTicketTemplate',
                component: resolve => require(["@/views/templateManage/addTicketTemplate.vue"], resolve),
                meta: {
                    name: '关联考试',
                    icon: 'classmate'
                },
            },
            {
                path: "/addTicketTemplate2",
                name:'addTicketTemplate2',
                component: resolve => require(["@/views/templateManage2/addTicketTemplate.vue"], resolve),
                meta: {
                    name: '关联考试',
                    icon: 'classmate'
                },
            },
            {
                path: "/daochuList",
                name:'daochuList',
                component: resolve => require(["@/views/examManage/roomManage/daochuList.vue"], resolve),
                meta: {
                    name: '导出列表',
                    icon: 'classmate'
                },
            },
            {
                path: "/gradeManageAdd",
                name:"gradeManageAdd",
                component: resolve => require(["@/views/authManage/gradeManage/gradeRule.vue"], resolve),//() => import("@/views/authManage/userManage/index.vue"),
                meta: {
                    name: '打分规则',
                    icon: 'classtime'
                },
            },
            {
                path: "/daoRuList",
                name:"daoRuList",
                component: resolve => require(["@/views/examManage/studentsManage/list.vue"], resolve),//() => import("@/views/authManage/userManage/index.vue"),
                meta: {
                    name: '导入列表',
                    icon: 'classtime'
                },
            },
        ]
    },

];
//  require(["@/views/manager/ruleList.vue"] 规则
export const asyncRouter = [
    {
        path: "/",
        component: Layout,
        name: "TemplateManage",
        id: 122,
        code: 10122,
        meta: {
            name: '考试管理',
            icon: 'set'
        },
        children: [
            {
                path: "/examList",
                id: 125,
                code: 10125,
                component: resolve => require(["@/views/examManage/examList/index.vue"], resolve),
                meta: {
                    name: '考试信息',
                    icon: 'notice-fill'
                }
            },
            {
                path: "/templateManage",
                id: 124,
                code: 10124,
                name:'TicketManage',
                component: resolve => require(["@/views/templateManage/index.vue"], resolve),
                meta: {
                    name: '准考证模板',
                    icon: 'notice-fill'
                },
            },
            {
                path: "/templateManage2",
                id: 123,
                code: 10123,
                name:'QrcodeManage',
                component: resolve => require(["@/views/templateManage2/index.vue"], resolve),
                meta: {
                    name: '二维码模板',
                    icon: 'notice-fill'
                },
            },

        ]
    },
    {
        path: "/",
        component: Layout,
        name: "examManage",
        id: 84,
        code: 10084,
        meta: {
            name: '考生管理',
            icon: 'classmate'
        },
        children: [
            {
                path: "/studentsManage",
                id: 87,
                code: 10087,
                component: resolve => require(["@/views/examManage/studentsManage/index.vue"], resolve),
                meta: {
                    name: '学生管理',
                    icon: 'classmate'
                }
            },
			{
			  path: "/777",
			  id: 88,
			  code: 10099,
			  // component: resolve => require(["@/views/examManage/examNum/index.vue"], resolve),
			  meta: {
			    name: '平台订单',
			    icon: 'classmate'
			  }
			},
            {
                path: "/examNum",
                id: 92,
                code: 10092,
                component: resolve => require(["@/views/examManage/examNum/index.vue"], resolve),
                meta: {
                    name: '生成准考证号',
                    icon: 'classmate'
                }
            },
         
            {
                path: "/examRoomManage",
                id: 109,
                code: 10086,
                component: resolve => require(["@/views/examManage/examRoomManage/examRoom.vue"], resolve),
                meta: {
                    name: '考场管理',
                    icon: 'classmate'
                }
            },
            {
                path: "/admissionTicket",
                id: 121,
                code: 10121,
                name: "AdmissionTicket",
                component: resolve => require(["@/views/examManage/roomManage/admissionTicket.vue"], resolve),
                meta: {
                    name: '导出准考证',
                    icon: 'classmate'
                }
            },
            {
                path: "/admissionTicket2",
                id: 110,
                code: 10110,
                name: "AdmissionTicket",
                component: resolve => require(["@/views/examManage/roomManage/admissionTicket2.vue"], resolve),
                meta: {
                    name: '导出二维码',
                    icon: 'classmate'
                }
            },



            // {
            //   path: "/associationExam",
            //   id: 105,
            //   code: 10105,
            //   name: "AssociationExam",
            //   component: resolve => require(["@/views/examManage/roomManage/associationExam.vue"], resolve),
            //   meta: {
            //     name: '关联考试',
            //     icon: 'classmate'
            //   }
            // },
            // {
            //   path: "/studioStatistics",
            //   id: 96,
            //   code: 10096,
            //   name: "StudioStatistics",
            //   component: resolve => require(["@/views/examManage/roomManage/studioStatistics.vue"], resolve),
            //   meta: {
            //     name: '机构统计',
            //     icon: 'classmate'
            //   }
            // },
            // {
            //   path: "/studentAccont",
            //   id: 98,
            //   code: 10098,
            //   name: "StudentAccont",
            //   component: resolve => require(["@/views/examManage/roomManage/studentAccont.vue"], resolve),
            //   meta: {
            //     name: '生源信息汇总',
            //     icon: 'classmate'
            //   }
            // },
            // {
            //   path: "/studentInfo",
            //   id: 99,
            //   code: 10099,
            //   name: "StudentInfo",
            //   component: resolve => require(["@/views/examManage/roomManage/studentInfo.vue"], resolve),
            //   meta: {
            //     name: '学生详情数据',
            //     icon: 'classmate'
            //   }
            // },
            // {
            //   path: "/studentDetailsInfo",
            //   id: 100,
            //   code: 10100,
            //   name: "StudentDetailsInfo",
            //   component: resolve => require(["@/views/examManage/roomManage/studentDetailsInfo.vue"], resolve),
            //   meta: {
            //     name: '生源详细数据',
            //     icon: 'classmate'
            //   }
            // },

        ]
    },
    {
        path: "/",
        component: Layout,
        name: "authManage",
        id: 97,
        code: 10008,
        meta: {
            name: '成绩管理',
            icon: 'set'
        },
        children: [
            {
                path: "/gradesManage",
                id: 101,
                code: 10101,
                component: resolve => require(["@/views/authManage/gradesManage/index.vue"], resolve),//() => import("@/views/authManage/userManage/index.vue"),
                meta: {
                    name: '成绩录入',
                    icon: 'classmate'
                },
            },
            {
                path: "/gradesManage2",
                id: 98,
                code: 10098,
                component: resolve => require(["@/views/authManage/gradesManage/index2.vue"], resolve),//() => import("@/views/authManage/userManage/index.vue"),
                meta: {
                    name: '成绩查询',
                    icon: 'classmate'
                },
            },
            // {
            //     path: "/499",
            //     id: 99,
            //     code: 10099,
            //     // component: resolve => require(["@/views/authManage/roleManage/index.vue"], resolve),//() => import("@/views/authManage/roleManage/index.vue"),
            //     meta: {
            //         name: '历史归档',
            //         icon: 'classmate'
            //     },
            // },
            // {
            //     path: "/500",
            //     id: 100,
            //     code: 10100,
            //     // component: resolve => require(["@/views/authManage/roleManage/index.vue"], resolve),//() => import("@/views/authManage/roleManage/index.vue"),
            //     meta: {
            //         name: '数据导出',
            //         icon: 'classmate'
            //     },
            // },

        ]
    },
    {
        path: "/",
        component: Layout,
        name: "authManage",
        id: 126,
        code: 10126,
        meta: {
            name: '归档管理',
            icon: 'set'
        },
        children: [
            {
                path: "/gradesManage3",
                id: 128,
                code: 10128,
                component: resolve => require(["@/views/authManage/gradesManage/index3.vue"], resolve),//() => import("@/views/authManage/roleManage/index.vue"),
                meta: {
                    name: '成绩数据归档',
                    icon: 'classmate'
                },
            },
            {
                path: "/templateManage3",
                id: 127,
                code: 10127,
                component: resolve => require(["@/views/templateManage2/index2.vue"], resolve),//() => import("@/views/authManage/roleManage/index.vue"),
                meta: {
                    name: '成绩数据导出',
                    icon: 'classmate'
                },
            },

        ]
    },
    {
        path: "/",
        component: Layout,
        name: "authManage",
        id: 111,
        code: 10111,
        meta: {
            name: '机构管理',
            icon: 'set'
        },
        children: [
            {
                path: "/roomManage",
                id: 112,
                code: 10112,
                component: resolve => require(["@/views/examManage/roomManage/index.vue"], resolve),
                meta: {
                    name: '机构信息',
                    icon: 'classmate'
                },
            },
            {
                path: "/AssociationExam",
                id: 113,
                code: 10113,
                component: resolve => require(["@/views/examManage/roomManage/associationExam.vue"], resolve),
                meta: {
                    name: '机构关联考试',
                    icon: 'classmate'
                },
            },
            {
                path: "/jigouTj",
                id: 131,
                code: 10131,
                component: resolve => require(["@/views/examManage/roomManage/jigouTj.vue"], resolve),
                meta: {
                    name: '机构统计',
                    icon: 'classmate'
                },
            },
            {
                path: "/jigouTj2",
                id: 132,
                code: 10132,
                component: resolve => require(["@/views/examManage/roomManage/jigouTj2.vue"], resolve),
                meta: {
                    name: '机构成绩统计',
                    icon: 'classmate'
                },
            },
        ]
    },
    {
        path: "/",
        component: Layout,
        name: "authManage",
        id: 106,
        code: 10106,
        meta: {
            name: '系统管理',
            icon: 'set'
        },
        children: [
            // {
            //     path: "/authManage",
            //     id: 120,
            //     code: 10120,
            //     component: resolve => require(["@/views/authManage/roleManage/index.vue"], resolve),//() => import("@/views/authManage/roleManage/index.vue"),
            //     meta: {
            //         name: '角色管理',
            //         icon: 'classtime'
            //     },
            // },
            {
                path: "/userManage",
                id: 108,
                code: 10108,
                component: resolve => require(["@/views/authManage/userManage/index.vue"], resolve),//() => import("@/views/authManage/userManage/index.vue"),
                meta: {
                    name: '用户管理',
                    icon: 'classmate'
                },
            },
            {
                path: "/gradeManage",
                id: 107,
                code: 10107,
                component: resolve => require(["@/views/authManage/gradeManage/index.vue"], resolve),//() => import("@/views/authManage/userManage/index.vue"),
                meta: {
                    name: '打分规则',
                    icon: 'classtime'
                },
            },

            {
                path: "/TakeSense",
                id: 129,
                code: 10129,
                component: resolve => require(["@/views/templateManage2/TakeSense.vue"], resolve),//() => import("@/views/authManage/userManage/index.vue"),
                meta: {
                    name: '脱敏设置',
                    icon: 'classtime'
                },

            }
        ]
    },
    {
        path: "/",
        component: Layout,
        name: "teacherManage",
        id: 102,
        code: 10102,
        meta: {
            name: '教师管理',
            icon: 'classmate'
        },
        children: [
            {
                path: "/rolerManage",
                id: 103,
                code: 10103,
                name:'rolerManage',
                component: resolve => require(["@/views/teacherManage/roleManage/index.vue"], resolve),
                meta: {
                    name: '教师角色',
                    icon: 'classmate'
                },
            },
            {
                path: "/teacherManage",
                id: 104,
                code: 10104,
                name:'rolerManage',
                component: resolve => require(["@/views/teacherManage/teacherManage/index.vue"], resolve),
                meta: {
                    name: '教师用户',
                    icon: 'classmate'
                },
            },
            {
                path: "/teacherManageAbout",
                id: 105,
                code: 10105,
                name:'teacherManageAbout',
                component: resolve => require(["@/views/teacherManage/examList/index.vue"], resolve),
                meta: {
                    name: '教师关联考试',
                    icon: 'classmate'
                },
            },
        ]
    },

    // {
    //     path: "/",
    //     component: Layout,
    //     name: "orderManage",
    //     id: 6,
    //     code: 10006,
    //     meta: {
    //         name: '订单管理',
    //         icon: 'set'
    //     },
    //     children: [
    //         {
    //             path: "/orderAccount",
    //             id: 20,
    //             code: 10020,
    //             component: resolve => require(["@/views/orderManage/orderAccount/index.vue"], resolve),
    //             meta: {
    //                 name: '订单管理',
    //                 icon: 'notice-fill'
    //             },
    //         },
    //         {
    //             path: "/orderAudit",
    //             id: 20,
    //             code: 10021,
    //             component: resolve => require(["@/views/orderManage/orderAudit/index.vue"], resolve),//() => import("@/views/orderManage/index.vue"),
    //             meta: {
    //                 name: '订单审核',
    //                 icon: 'notice-fill'
    //             },
    //         }
    //     ]
    // },

    {
        path: "/",
        component: Layout,
        name: "authManage",
        id: 22,
        code: 10008,
        meta: {
            name: '品牌机构',
            icon: 'set'
        },
        children: [

        ]
    },
    {
        path: "/",
        component: Layout,
        name: "authManage",
        id: 79,
        code: 10008,
        meta: {
            name: '考生管理',
            icon: 'set'
        },
        children: [

        ]
    },
    {
        path: "/",
        component: Layout,
        name: "authManage",
        id: 93,
        code: 10008,
        meta: {
            name: '试卷管理',
            icon: 'set'
        },
        children: [
			{
                path: "/markMange",
                id: 94,
                code: 10094,
                component: resolve => require(["@/views/examList/list.vue"], resolve),//() => import("@/views/authManage/roleManage/index.vue"),
                meta: {
                    name: '阅卷管理',
                    icon: 'classmate'
                },
            },
			{
			    path: "/distriBute",
			    id: 95,
			    code: 10095,
                component: resolve => require(["@/views/examList/distribute.vue"], resolve),//() => import("@/views/authManage/roleManage/index.vue"),
			    meta: {
			        name: '分配试卷',
			        icon: 'classmate'
			    },
			},
			{
			    path: "/correct",
			    id: 96,
			    code: 10096,
                component: resolve => require(["@/views/examList/correct.vue"], resolve),//() => import("@/views/authManage/roleManage/index.vue"),
			    meta: {
			        name: '批改试卷',
			        icon: 'classmate'
			    },
			}
        ]
    },

    {
        path: "/",
        component: Layout,
        name: "authManage",
        id: 115,
        code: 10008,
        meta: {
            name: '机构统计',
            icon: 'set'
        },
        children: [
			{
			    path: "/505",
			    id: 117,
			    code: 10117,
			    // component: resolve => require(["@/views/authManage/roleManage/index.vue"], resolve),//() => import("@/views/authManage/roleManage/index.vue"),
			    meta: {
			        name: '按省份统计',
			        icon: 'classmate'
			    },
			},
			{
			    path: "/560",
			    id: 118,
			    code: 10118,
			    // component: resolve => require(["@/views/authManage/roleManage/index.vue"], resolve),//() => import("@/views/authManage/roleManage/index.vue"),
			    meta: {
			        name: '按机构统计',
			        icon: 'classmate'
			    },
			},
			{
			    path: "/567",
			    id: 119,
			    code: 10119,
			    // component: resolve => require(["@/views/authManage/roleManage/index.vue"], resolve),//() => import("@/views/authManage/roleManage/index.vue"),
			    meta: {
			        name: '机构信息汇总',
			        icon: 'classmate'
			    },
			},

        ]
    },
    // {
    //     path: "/",
    //     component: Layout,
    //     name: "authManage",
    //     id: 106,
    //     code: 10106,
    //     meta: {
    //         name: '系统设置',
    //         icon: 'set'
    //     },
    //     children: [
    //         {
    //             path: "/userManage",
    //             id: 108,
    //             code: 10108,
    //             component: resolve => require(["@/views/authManage/userManage/index.vue"], resolve),//() => import("@/views/authManage/userManage/index.vue"),
    //             meta: {
    //                 name: '用户设置',
    //                 icon: 'classtime'
    //             },
    //         },
    //         {
    //             path: "/gradeManage",
    //             id: 107,
    //             code: 10107,
    //             component: resolve => require(["@/views/authManage/gradeManage/gradeRule.vue"], resolve),//() => import("@/views/authManage/userManage/index.vue"),
    //             meta: {
    //                 name: '打分设置',
    //                 icon: 'classtime'
    //             },
    //         },
    //         // {
    //         //     path: "/8999",
    //         //     id: 101,
    //         //     code: 101,
    //         //     component: resolve => require(["@/views/authManage/gradesManage/index.vue"], resolve),//() => import("@/views/authManage/userManage/index.vue"),
    //         //     meta: {
    //         //         name: '成绩手工录入',
    //         //         icon: 'classtime'
    //         //     },
    //         // }
    //     ]
    // }
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
    const newRouter = createRouter({
      mode: 'history'
    });
    router.matcher = newRouter.matcher; // reset router
}

export default router;
