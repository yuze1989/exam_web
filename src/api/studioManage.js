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

// 获取生源汇总信息
export function apiStudentAccountList(data) {
  return request({
    url:  '/studio/studentCount',
    method: 'POST',
    data
  })
}
// 学生信息详情
export function apiStudentInfoList(data) {
  return request({
    url:  '/studio/studioStudentList',
    method: 'POST',
    data
  })
}

// 生源详情数据
export function apiStudentDetailList(data) {
  return request({
    url:  '/studio/studentDetailList',
    method: 'POST',
    data
  })
}