let ResizeImg = {
    rzImageUlr: function resizeImageUlr(imageUrl, w, h) {
        return `${imageUrl}?x-oss-process=image/resize,m_fill,w_${w},h_${h}`
    }
}

export default ResizeImg

