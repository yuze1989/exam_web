import request from '@/utils/request'


// 获取准考证&二维码
export function apiUnionExamList(data) {
    return request({
      url: '/ticket/unionExamList',
      method: 'POST',
    data
    })
  }

  // 考试查询
  export function apiExamList(data) {

    let url="";


      if(data == undefined){
        url = '/ticket/examlist?archiveStatus=0'
    }else{
          url = '/ticket/examlist'
      }
    return request({
      url: url,
      method: 'POST',

    })
  }
 // 查询考试下的省份

 export function apiGetProvinceByExamId(data) {
  return request({
    url: '/examinfo/getProvinceByExamId',
    method: 'GET',
    params: data
  })
}

// 获取考试详情

export function apiGetExamDetails(data) {
  return request({
    url: '/examinfo/detail',
    method: 'GET',
    params: data
  })
}

// 获取科目详情
export function apiGetSubjectList(data) {
    return request({
        url: '/examsubject/listByExamId',
        method: 'GET',
        params: data
    })
}

// 新增准考证模版
export function apiTicketCreate(data) {
  return request({
    url: '/ticket/ticketCreate',
    method: 'POST',
    data
  })
}
