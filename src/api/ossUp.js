import axios from 'axios'
import OSS from 'ali-oss'
import dayjs from 'dayjs'
import { uuid } from '@/utils/utils'

let ossurl = process.env.VUE_APP_BASE_API + 'art-exam-manager/aliyunOss/assumeRole'

var getOssToken = async (params) => {
	return axios.get(`${ossurl}`, params).then((res) => res.data)
}

export var ossup = async function (webDir, file) {
	var ossToken = await getOssToken()
	var ossClient = new OSS({
		region: 'oss-cn-hangzhou',
		accessKeyId: ossToken.result.credentials.accessKeyId,
		accessKeySecret: ossToken.result.credentials.accessKeySecret,
		stsToken: ossToken.result.credentials.securityToken,
		bucket: 'topexam',
	})
	return new Promise((resovle, reject) => {
		let key = `${webDir}${dayjs().format('YYYYMMDD-HHmmss-SSS')}/${uuid()}`
		// console.log(key, ossToken, ossClient)
		ossClient.put(key, file).then((res) => {
			resovle(res)
		})
	})
}
