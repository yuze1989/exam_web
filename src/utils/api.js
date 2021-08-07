const API = {
    upload: "/file/upload", //上传
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
    roomManage: {// 画室管理
      list: "/studio/list",
      insert: "/exTemp/studio/add",
      update: "/studio/update"
    },
    studentsManage: { //学生管理
      examRoomChange:"/examinee/examRoomChange", //考场分配--考生换考场
      examRoomCoun:"/examinee/examRoomCoun", //考场分配--考生人数统计
      examRoomDistribut:"/examinee/examRoomDistribut",  //考场分配
      examRoomList:"/examinee/examRoomList",//考场信息查询
      examRoomProvince:"/examinee/examRoomProvince",//获取生源省列表
      examlist:"/ticket/examlist", // 新增学生 获取考试列表
      roomsList:"/studio/getStudioByExamId",// 新增学生 根据考试id获取学生列表      

      examineeBatchCheck:"/examinee/examineeBatchCheck",//考生信息批量审核(审核状态:0未审核；1通过；2未通过)
      examineeBatchImport:"/examinee/examineeBatchImport",//学生信息批量导入
      examineeCheck:"/examinee/examineeCheck",//考生信息审核(审核状态:0未审核；1通过；2未通过)
      examineeCreate:"/examinee/examineeCreate",//学生信息新增
      examineeDelete:"/examinee/examineeDelete",// 考生信息删除
      examineeDetail:"/examinee/examineeDetail",//获取考生信息详情
      examineeList:"/examinee/examineeList", //学生信息查询
      examineeUpdate:"/examinee/examineeUpdate",// 学生信息修改
      ticketGenerate:"/examinee/ticketGenerate",// 准考证号管理--生成准考证号
      ticketList:"/examinee/ticketList"//准考证号管理--查询
    },
    ticketManage:{ //准考证管理
      getTicketExamlist:'/ticket/examlist',// 获取准考证下考试
      getCreateTicketQrCode:'/ticket/qrCodeCreate',// 二维码模板新增POST 
      getTicketQrCodeDetail:'/ticket/qrCodeDetail',// 获取根据id或二维码模板信息POST 
      getTicketQrCodeList:'/ticket/qrCodeList',// 二维码查询POST 
      getUpdateTicketQrCode:'/ticket/qrCodeUpdate',// 二维码修改POST 
      getCreateTicket:'/ticket/ticketCreate',// 准考证模板新增POST 
      getTicketDetail:'/ticket/ticketDetail',// POST 根据id获取准考证模板信息
      getTicketList:'/ticket/ticketList',// POST 准考证模板查询
      getUpdateTicket:'/ticket/ticketUpdate',// POST 准考证模板修改
      exportTicketUnionExam:'/ticket/unionExamExport',// POST 准考证--导出准考证
      getTicketUnionExamList:'/ticket/unionExamList',// POST 准考证&二维码查询
      createAndExportTicketUnionExamQRcode:'/ticket/unionExamQRcode',// POST 准考证--生成并导出二维码
    },
}


export default API