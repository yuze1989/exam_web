import axios from 'axios'

let base = ''

const ArtToken = sessionStorage.getItem('Art-Token')
let head = {
	headers: {
		'Content-Type': 'application/json',
		'Art-Token': ArtToken,
		'Authorization': ArtToken
	}
}
export const getUserList = (params) => {
	return axios.get(`${base}/user/list`, { params: params })
}
export const getUserListPage = (params) => {
	return axios.get(`${base}/user/listpage`, { params: params })
}
export const removeUser = (params) => {
	return axios.get(`${base}/user/remove`, { params: params })
}
export const batchRemoveUser = (params) => {
	return axios.get(`${base}/user/batchremove`, { params: params })
}
export const editUser = (params) => {
	return axios.get(`${base}/user/edit`, { params: params })
}
export const addUser = (params) => {
	return axios.get(`${base}/user/add`, { params: params })
}
export const getRole = (params) => {
	return axios.get(`${base}/user/add`, { params: params })
}

/*------------------------------------------------------------------------------*/
export const getStudenList = (params) => {
	return axios.get(`${base}/studio/studentlist`, { params: params })
}
export const getStudioDetail = (params) => {
	return axios.get(`${base}/studio/detail`, { params: params })
}
export const exampaperlist = (params) => {
	return axios.get(`${base}/exam/paperlist`, { params: params })
}
export const exampostpaper = (params) => {
	return axios.post(`${base}/exam/postpaper`, { params: params })
}


// let baseurl = "http://47.97.72.64:8080/art-exam-manager/";
let baseurl = process.env.BASE_API + 'art-exam-manager/'
// let baseurl='http://192.168.6.227:8080/art-exam-manager/'
export const user_info_page = (params) => {
	return axios
		.post(`${baseurl}/userinfo/page`, params, {
			headers: { 'Content-Type': 'application/json' },
		})
		.then((res) => res.data)
}
/*------------------------------------------------------------------------------*/

//画室考生列表
export const examinee_listByStudioCode = (params) => {
	return axios
		.post(`${baseurl}/examinee/listByStudioCode`, params, head)
		.then((res) => res.data)
}
/*
 * 试卷导出
 * */
export const score_queryScore = (params) => {
	return axios
		.post(`${baseurl}paper/queryPaperDetail`, params, head)
		.then((res) => res.data)
}


export const getStudioList = () => {
	return axios
		.post(`${baseurl}/studio/listStudio`, { size: 1000, current: 1 }, head)
		.then((res) => {
			return res
			// return new Promise((resolve, reject) => {
			// 	resolve(res.data.result.records)
			// })
		})
}

/**
 * 画室详情
 * @param option
 * @returns {Promise<*>}
 */
export const getStudioInfo = (option) => {
	return axios.get(`${baseurl}studio/queryStudio`, option).then((res) => {
		return res.data
	})
}


/**
 * 更改画室启用状态
 * @param data
 * @returns {Promise<*>}
 */
export const updateStudioStatus = (params) => {
	return axios
		.post(`${baseurl}studio/operationActivity`, params)
		.then((res) => {
			return res
		})
}

/**
 * 画室学生列表
 * @param option
 * @returns {Promise<*>}
 */
let ossurl = process.env.BASE_API + 'art-exam-manager/aliyunOss/assumeRole'

let headercorss = { headers: { 'Access-Control-Allow-Origin': '*' } }

export const getOssToken = (params) => {
	return axios.get(`${ossurl}`, params).then((res) => res.data)
}
//规则管理
let gradeRuleurl = process.env.BASE_API+ 'art-exam-manager/ruler/query?province=浙江'
export const getgradeRule = (params) => {
	return axios.get(`${gradeRuleurl}`, params).then((res) => res.data)
}
// 规则管理不带省
export const listRules = (params) => {
	return axios
		.post(`${gradeRuleurl}/ruler/listRules`, params, head)
		.then((res) => res.data)
}
export const gradeRule_create = (params) => {
	return axios
		.post(`${baseurl}/ruler/create`, params, head)
		.then((res) => res.data)
}

export const gradeRule_update = (params) => {
	return axios
		.post(`${baseurl}/ruler/update`, params, head)
		.then((res) => res.data)
}

/**
 * 生源省份
 * @param option
 * @returns {Promise<*>}
 */

export const getListProvince = (option) => {
	return axios
		.get(`${baseurl}examinee/listProvince`, option,head)
		.then((res) => {
			return res.data
		})
}