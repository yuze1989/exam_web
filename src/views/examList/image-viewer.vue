<template>
  <div>
    <el-button @click="showViewer=true">预览</el-button>
    <el-image-viewer
        v-if="showViewer"
        :on-close="()=>{showViewer=false}"
        :url-list="imgList" />
  </div>
</template>
<script>
export default {
  name: 'Index',
  components: {
    'el-image-viewer':()=>import('element-ui/packages/image/src/image-viewer')
  },
  data() {
    return {
      showViewer: false,
      imgList:['1.jpg','2.jpg']
    }
  }
}
</script>