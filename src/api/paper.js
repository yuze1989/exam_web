/**
 * 后端接口
 * @date: 2020.10.15
 */

import request from '@/utils/request'

// 省份 +科目 统计评级和数量
export function getPaperQueryCount(data) {
  return request({
    url: process.env.BASE_API + 'art-exam-manager/paper/queryCount',
    method: 'POST',
    data
  })
}


// 获取 试卷 未打分/已打分
export function getPaperAgg(data) {
  return request({
    url: process.env.BASE_API + 'art-exam-manager/paper/agg',
    method: 'POST',
    data
  })
}
// 获取 试卷 未打分/已打分
export function getRulesdetail(data) {
  return request({
    url: process.env.BASE_API + 'art-exam-manager/rules/detail',
    method: 'GET',
    params: data
  })
}

// 获取 试卷 未打分/已打分
export function getRulerQuery(data) {
  return request({
    url: process.env.BASE_API + 'art-exam-manager/ruler/query',
    method: 'GET',
    params: data
  })
}

// 阅卷-等级统计
export function getPaperGrade(data) {
  return request({
    url: process.env.BASE_API + 'art-exam-manager/paper/grade',
    method: 'POST',
    data
  })
}

// 更新试卷分数或等级
export function getPaperUpdate(data) {
  return request({
    url: process.env.BASE_API + 'art-exam-manager/paper/update',
    method: 'POST',
    data
  })
}

// 获取阅卷的开关状态
export function getReviewStatus() {
  return request({
    url: process.env.BASE_API + 'art-exam-manager/constants/getReviewStatus',
    method: 'GET'
  })
}




