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
    studentsManage: { //学生管理
      examRoomChange:"/examinee/examRoomChange", //考场分配--考生换考场
      examRoomCoun:"/examinee/examRoomCoun", //考场分配--考生人数统计
      examRoomDistribut:"/examinee/examRoomDistribut",  //考场分配
      examRoomList:"/examinee/examRoomList",//考场信息查询
      examRoomProvince:"/examinee/examRoomProvince",//获取生源省列表
      
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
}


export default API