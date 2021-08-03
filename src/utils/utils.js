export function forbiddenBodyScroll () {
    let scrollBarWidth = window.innerWidth - document.documentElement.offsetWidth
    let scrollBarHeight = window.innerHeight - document.documentElement.offsetHeight
    if (scrollBarWidth || scrollBarHeight) {
        document.body.style.overflow = 'hidden'
        // 给 body 添加边距防止抖动
        const { style } = document.body
        let { paddingRight, paddingBottom } = getComputedStyle(document.body)

        let initPaddingRight = style.paddingRight
        let initPaddingBottom = style.paddingBottom

        if (scrollBarWidth) {
            paddingRight = parseInt(paddingRight) || 0
            document.body.style.paddingRight = paddingRight + scrollBarWidth + 'px'
        }
        if (scrollBarHeight) {
            paddingBottom = parseInt(paddingBottom) || 0
            document.body.style.paddingBottom = paddingBottom + scrollBarHeight + 'px'
        }

        return function restoreBodyScroll () {
            document.body.style.overflow = ''
            document.body.style.paddingRight = initPaddingRight
            document.body.style.paddingBottom = initPaddingBottom
        }
    } else {
        return function () {}
    }
}

export const ALERT = text => console.error(`Error in vue-img-viewer: ${text}`)

export const validateNumber = prop => val => {
    let result = Number.isFinite(+val)
    if (!result) ALERT(`prop ${prop} 必须为Number类型或者数字字符串`)
    return result
}

/**
 * 生成uuid
 * @returns {string}
 */
export const uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}