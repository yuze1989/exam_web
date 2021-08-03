import {basicRequest} from '../utils/request'

function updatePaper({paperId, grade, score}) {
    return new Promise((resolve, reject) => {
        const data = {}
        if (paperId) {
            data.paperId = paperId
        }
        if (grade) {
            data.grade = grade
        }
        if (score) {
            data.score = score
        }
        basicRequest({
            method: 'post',
            url: '/paper/update',
            data: data
        }).then(data => {
            resolve(data)
        }, error => {
            reject(error)
        })
    })
}

function queryMarkingRules (params) {
    return new Promise((resolve, reject) => {
        basicRequest({
            url: '/ruler/query',
            params: params
        }).then(data => {
            resolve(data)
        }, error => {
            reject(error)
        })
    })
}


export {
    updatePaper,
    queryMarkingRules
}