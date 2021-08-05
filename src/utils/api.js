const API = {


    examinfo: { //考试管理
      allProvince:"/examinfo/allProvince", //GET 获取全部省列
      create:"/examinfo/create",//考试新增
      delete:"/examinfo/delete",//考试新增
      detail:"/examinfo/detail", //考试详情
      invite:"/examinfo/invite",// 邀请画室
      getProvinceByExamId: "/examinfo/getProvinceByExamId",//获取该考试下省列表
      list:"/examinfo/list" ,//考试列表
      union: "/examinfo/union",//联合考试操作(状态:1、同意;2、拒绝;3、禁用)
      unionExamList:"/examinfo/unionExamList",//"查询本机构下联合考试"
      update: "/examinfo/update",//考试修改
    },




    listRules:'/rules/list', // 规则列表
    getRulesDetail:'/rules/getRulesDetail', // 规则详情
    rulesUpdate:'/rules/update', // 规则更新
    rulesCreate:'/rules/create', // 规则保存
    rulesDetail:'/rules/detail',  // 根据省份查询科目

    roomManage: {// 画室管理
      list: "/exTemp/studio/page",
      insert: "/exTemp/studio/add",
      update: "/exTemp/studio/edit"
    },
    messageManage:{// 考试信息管理
      list: "/exTemp/product/page",
      insert: "/exTemp/product/add",
      update: "/exTemp/product/edit"
    },
    applyConfirm: {
      list: "/exTemp/enrollOrder/page",
      check: "/exTemp/enrollOrder/check",
      export: "/exTemp/enrollOrder/exportExcel", //导出报名信息
      import: "/exTemp/enrollOrder/importExcel", //导入报名信息
    },

    folder: {
        list: "/train/courseCoursewareFolder/list",
        insert: "/train/courseCoursewareFolder/insert",
        insertCourseware: "train/course/insertCourseware",
        update: "train/courseCoursewareFolder/update",
        delete: "/train/courseCoursewareFolder/delete"
    },
    teacher: {
        list: "train/teacher/page",
        insert: "/train/teacher/insert",
        update: "train/teacher/update",
        courseTeacher: "/train/teacher/courseTeacher",
        band: "train/teacher/band",
        unband: "train/teacher/unband",
        getById: "train/teacher/getById",
        delete: "train/teacher/delete",
    },
    student: {   //学生管理
        list: "/train/student/page",
        update: "/train/student/update",
        resetPassword: "/train/student/resetPassword",
        delete: "/train/student/delete"

    },
    school: {  //校长管理
        list: "/train/headMaster/page",
        insert: "/train/headMaster/insert",
        update: "train/headMaster/update"
    },
    class: {
        list: "/train/class/v2/list",
        add: "/train/class/v2/addClass",
        updateClass: "/train/class/v2/updateClass",
        deleteClass: "/train/class/v2/deleteClass",

        detail: "/train/class/v2/detail"

    },
    upLoadImageApi: {
        upLoadImageConfig: 'art/tool/ossAppConfig'
    },
    user: {
        changePwd: "/art/user/changePassword"
    },
    roleManage: {
        trainRoleAdd: "/train/role/add",
        trainRoleMenuSelect: "/train/role/menuSelect",
        trainRolePage: "/train/role/page",
        trainRoleRemove: "/train/role/remove",
        trainRoleUpdate: "/train/role/update",
        trainRoleUpdateMenu: "/train/role/updateMenu"
    },
    userManage: {
        trainAdminAdd: "/train/admin/add",
        trainAdminEnableDisable: "/train/admin/enableDisable",
        trainAdminPage: "/train/admin/page",
        trainAdminResetPassword: "/train/admin/resetPassword",
        trainAdminRoleSelect: "/train/admin/roleSelect",
        trainAdminUpdate: "/train/admin/update"
    },
    order: {
        page: "/train/trainSchoolPurchaseOrder/page",
        operateLog: "/train/trainSchoolPurchaseOrder/operateLog",
        open: "/train/trainSchoolPurchaseOrder/open",
        delaySelect: "/train/trainSchoolPurchaseOrder/delaySelect",
        delay: "/train/trainSchoolPurchaseOrder/delay"
    },
    organ: {
        brandSchoolPage: "/train/school/brandSchoolPage",
        shareInfo: "/train/school/shareInfo",
        getShareInfo: "/teacher/school/shareInfo"
    },
}


export default API