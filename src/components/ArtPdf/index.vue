<template>
  <div class="pdf">
    <pdf ref="pdf" :src="pdfUrl"> </pdf>
  </div>
</template>
<script>
import pdf from "vue-pdf";
export default {
  name: "Pdf",
  props:{
      pdfUrl:{
          type:String,
          default:''//'https://dakaname.oss-cn-hangzhou.aliyuncs.com/file/2018-12-28/1546003237411.pdf'
      }
  },
  components: {
    pdf,
  },
  data() {
    return {
     
    };
  },
};
</script>