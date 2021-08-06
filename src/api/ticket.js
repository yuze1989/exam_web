import request from '@/utils/request'


// 获取准考证&二维码
export function apiUnionExamList(data) {
    return request({
      url: '/ticket/unionExamList',
      method: 'POST',
    data
    })
  }