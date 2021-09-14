<template>
  <div class="pdf-demo">

    <button @click="handleDown">jsPDF方式下载</button>
    <button @click="handleWindowPrint( '#demo', '电子合同' )">浏览器方式下载</button>

    <div id="demo">
        <article v-for="(item,index) in xlist">
          <div class="bg" style="    background: #fff; padding: 20px;position:relative;">
            <div class="template-example-dom" ref="ticketFile">
              <div class="title" @dragover.prevent>
                <div class="top" style="height: 117px;padding-top: 15px">
                  <div style="padding-left: 25px;font-size: 18px;width: 500px;padding:0px 0 0px 25px;" draggable="true" >准考证：{{item.ticket}}</div>
                  <div style="padding-left: 25px;font-size: 18px;width: 500px;padding:0px 0 0px 25px;"  >身份证号码：{{item.idCord}}</div>
                  <div style="padding-left: 25px;font-size: 18px;width: 500px;padding:0px 0 0px 25px;"  >考试地址：{{item.examAddress}}</div>
                  <div style="padding-left: 25px;font-size: 18px;width: 500px;padding:0px 0 0px 25px;"  >机构编号：缺</div>
                </div>
                <vue-qr :text="item.ticket" style="width: 220px;height: 220px;position: absolute;left: 30px;top: 160px"></vue-qr>
                <div style="font-size: 18px;width: 500px;padding:0 0 6px 230px;margin-top: 25px" >考试编号：{{ item.examCode }}</div>
                <div style="font-size: 18px;width: 500px;padding:0 0 6px 230px;"  >姓名：{{ item.studentName }}</div>
                <div style="font-size: 18px;width: 500px;padding:0 0 6px 230px;"  >科目：{{item.subjectName}}</div>
                <div style="font-size: 18px;width: 500px;padding:0 0 6px 230px;"  >考场：{{item.roomCode}}</div>
                <div style="font-size: 18px;width: 500px;padding:0 0 6px 230px;" >性别：{{item.gender}}</div>
                <div style="font-size: 18px;width: 500px;padding:0 0 6px 230px;"  >座位号：{{item.roomSeat}}</div>
              </div>
            </div>
          </div>
        </article>

    </div>



  </div>
</template>

<script>

import htmlToPdf from '@/utils/htmlToPdf';
import vueQr from 'vue-qr'
export default {
  name: "PdfDemo",
  components: {
    vueQr
  },
  data(){
    //和导出pdf没关系
    return {
      xlist:[],
      contractData: {
        name: '',
        phone: '',
        // signatureImg: '../../../static/signature.gif'
        signatureImg: ''
      },

    }
  },

  created() {
    this.getList()
  },
  methods: {
    getList(){
      this.$axios
          .post('/ticket/unionQRcodeExport', this.$route.query)
          .then((res) => {
            if(res.code == 200){
              this.xlist = res.result;
            }else{
              this.$message({
                message: res.message,
                type: "error",
              });
            }
          })
          .catch(() => {
          });
    },
    handleDown(){
      htmlToPdf.downloadPDF( document.querySelector('#demo'),this.$route.query.examName,'54');
    },

    handleWindowPrint(ele, fileName){
      //留存原来的 html
      // let bdHtml = window.document.body.innerHTML;
      // let bdHtml = document.querySelector('#app').innerHTML;


      //要打印的 内容 html
      // document.body.innerHTML =  document.querySelector('#demo').innerHTML;
      // document.body.innerHTML =  document.querySelector('#demo').outerHTML;
      // document.querySelector('#app').innerHTML =  document.querySelector('#demo').outerHTML;
      // document.querySelector('#main').innerHTML =  document.querySelector('#demo').outerHTML;
      console.log(666);
      //去除页面不必要的 head 标签内  内容， 避免影响打印页 ， title 为保存为 pdf 的文件时的 文件名
      document.head.innerHTML = '<meta charset="utf-8">\n' +
          ' <title> ' + fileName + '</title>\n' +
          ' <link rel="shortcut icon" href="http://192.168.29.50:8081/favicon.ico" type="image/x-icon" />\n' +
          ' <meta name="format-detection" content="telephone=no">\n' +
          ' <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">\n' +
          ' <meta name="viewport" content="width=device-width,initial-scale=1.0">\n' +
          ' <link rel="stylesheet" href="./static/css/contract.css"/>';  //生成pdf的外部css样式
      // document.body.innerHTML =  document.querySelector('#demo').outerHTML;
      // document.querySelector('#main').innerHTML =  document.querySelector('#demo').outerHTML;
      // document.body.innerHTML =  document.querySelector('#demo').outerHTML;
      document.body.innerHTML =  document.querySelector( ele ).outerHTML;

      // window.print();

      //转异步 等待dom元素渲染（样式）完毕在打印
      setTimeout( ()=>{
        //打印
        window.print();
        //刷新页面
        window.location.reload();
      },20 )


      //重新设会当前页面
      // window.document.body.innerHTML = bdHtml;
      // document.querySelector('#app').innerHTML =  bdHtml;
      //刷新页面
      // window.location.reload();
    },



  },
  mounted() {
    //和导出pdf没关系
    //模拟发送 ajax
  }
}
</script>

<style scoped>
article{
  width: 500px;
  height: 400px;
}

#demo{
  background-color: #fff;
  width: 500px;
  /* height: 400px; */
  margin: auto;
}

article{
  background: #fff;
}

#demo .contract {
  background: #fff;
  /*padding: 76px 76px 114px;*/
  padding: 86px 86px 114px;
  position: relative;

}

#demo .contract .key-info {
  display: flex;
}

#demo .contract .key-info> aside {
  flex: 1;
}

#demo .contract > h1 {
  text-align: center;
  margin-top: 0;
}

#demo .contract > p:first-child {
  margin-top: 0;
}

#demo .contract .key-info .info-left .info-row > span:first-child,
#demo .contract .key-info .info-right .info-row > span:first-child{
  font-weight: 600;
}

#demo .contract .signature {
  position: absolute;
  right: 86px;
  bottom: 0;
}

#demo .contract .signature > img {
  width: 200px;
}

#demo {
  color: #000;
  font-family: "Microsoft YaHei";
}


h1{
  font-size: 24px;
  font-weight: 700;
}

h3{
  font-size: 18.72px;
  font-weight: 700;
  margin: 18.720px 0;
}
p {
  margin: 16px 0;
}





</style>
