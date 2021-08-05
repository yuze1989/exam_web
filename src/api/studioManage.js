import request from '@/utils/request'


// 获取所有省份
export function getAllProvince(data) {
    return request({
      url: '/examinfo/allProvince',
      method: 'GET',
      params: data
    })
  }

// 新增画室
export function creatStudio(data) {
    return request({
      url:  '/studio/create',
      method: 'POST',
      data
    })
}


// 删除画室
export function deteleStudio(data) {
  return request({
    url:  '/studio/delete',
    method: 'POST',
    params:data
  })
}

// 编辑画室
export function updateStudio(data) {
  return request({
    url:  '/studio/update',
    method: 'POST',
    data
  })
}

// 考试列表
export function examinationList(data) {
  return request({
    url:  '/studio/examStudioList',
    method: 'POST',
    data
  })
}

// 关联画室

export function apiRelationStudio(data) {
  return request({
    url:  '/studio/relationStudio',
    method: 'POST',
    data
  })
}


// 画室统计信息
export function apiStudioStatisticsList(data) {
  return request({
    url:  '/studio/studioStatisticsList',
    method: 'POST',
    params:data
  })
}