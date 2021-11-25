<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <Sidebar class="sidebar-container" />
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar ref="nav" :changePwdAction="changePwd" />
      </div>
      <app-main />
    </div>
    <ChangePwdDialog :visible.sync="visible" > 

    </ChangePwdDialog>
    <el-dialog
        :visible.sync="dialogFormVisible"
        width="50%"
        center
        :closeOnClickModal="false"
        style="z-index: 200001"
    >
      <div slot="title">余额充值</div>
      <el-form
          label-width="120px"
          label-position="right"
          class="demo-ruleForm"
          center
          ref="delForm"
      >
        <p style="    text-align: center;color: red;font-size: 20px;padding: 0;margin: 0;margin-bottom: 15px;"></p>
        <el-form-item label="余额充值" prop="username" style="margin-bottom: 15px">
          <el-input type="number" v-model="money"  placeholder="请输入充值金额"  :min="0" :max="100000"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="cz">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog
        :visible.sync="dialogFormVisible2"
        width="50%"
        center
        :closeOnClickModal="false"
        @close="close"
        style="z-index: 200001"
    >
      <div slot="title">支付</div>
      <el-form
          label-width="120px"
          label-position="right"
          class="demo-ruleForm"
          center
          ref="delForm"
      >
        <div id="qrCode2" style="margin-top: 20px" ref="qrCodeDiv"></div>
        <p style="text-align: center;font-size: 30px;">支付金额：{{money}}元</p>

      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Sidebar, AppMain, Navbar } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import ChangePwdDialog from "@/views/common/changePwdDialog";
import { mapState } from "vuex";
import QRCode from 'qrcodejs2';
export default {
  name: "Layout",
  components: {
    Sidebar,
    AppMain,
    Navbar,
    ChangePwdDialog
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader,
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
  },

  methods:{
    open(){
      this.dialogFormVisible = true;
    },
    changePwd(){
      this.visible = true

    },
    close(){
      clearInterval(this.timer);
    },
    get_money(){
      this.$refs.nav.get_money();
    },
    cz(){
      if(this.money > 100000){
        this.$message({
          type: 'warning',
          message: '单次充值金额不可大于10000元！'
        });
        return false
      }
      this.dialogFormVisible2 = true;
      this.dialogFormVisible = false;
      this.$axios.post("/exam_school_recharge/rechargeOrderCreate?total_fee="+this.money).then((res)=>{
        let id = res.result.id;
        this.$axios.post("/exam_school_recharge/rechargeOrderPay?payType=weixin&orderId="+id).then((res)=>{
          new QRCode(this.$refs.qrCodeDiv, {
            text: res.result.codeUrl,
            width: 300,
            height: 300,
            colorDark: "#333333", //二维码颜色
            colorLight: "#ffffff", //二维码背景色
            correctLevel: QRCode.CorrectLevel.L//容错率，L/M/H
          })
          let that = this;
          this.timer = setInterval(function (){
            that.$axios.post('/exam_school_recharge/rechargeOrderDetail?orderId='+id).then((res)=>{
              let status = res.result.payStatus;
              if(status == 1){
                clearInterval(that.timer);
                that.dialogFormVisible2 = false;
                that.$message({
                  type: 'success',
                  message: '支付成功！'
                });
                that.get_money();
              }else if(status == -1){
                clearInterval(that.timer);
                that.dialogFormVisible2 = false;
                that.$message({
                  type: 'error',
                  message: '已取消支付！'
                });
              }
            })
          },3000)

        })
      })
    },
  },
  data(){
    return {
      visible:false,
      dialogFormVisible:false,
      dialogFormVisible2:false,
      money:"",
      timer:null,
    }
  }
};
</script>
<style>
#qrCode2 img{
  margin: 0 auto;
}
</style>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
