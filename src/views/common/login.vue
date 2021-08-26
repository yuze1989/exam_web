<template>
  <div class="loginBj">
    <div class="login-container">
      <el-col class="title-bg" :span="8">
        <el-col class="title-content">
          <div style="padding-top: 20px">
            <span class="title"></span>
            <div><span class="title" style="font-size: 50px">Hello.</span></div>
            <div><span class="title" style="font-size: 16px">欢迎进入TOP美术</span></div>
            <div><span class="title" style="font-size: 16px">考试管理系统后台</span></div>
          </div>
          <!-- <span class="content"
            >Smart campus Institution Management System</span
          > -->
        </el-col>
      </el-col>
      <el-col class="contain-right" :span="16">
        <el-form
          v-show="radio == 1"
          :model="ruleForm2"
          :rules="rules2"
          class="demo-ruleForm"
          :inline="true"
          ref="ruleForm2"
          label-position="center"
          label-width="100px"
        >
          <el-form-item
            prop="account"
            label="账号"
            style="margin-bottom: 35px;"
          >
            <el-input
              type="text"
              v-model="ruleForm2.account"
              auto-complete="off"
              placeholder="请输入账号"
              style="width: 16rem;"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="checkPass"
            label="密码"
            style="margin-bottom: 35px;"
          >
            <el-input
              type="password"
              v-model="ruleForm2.checkPass"
              @keyup.native.prevent="keydown($event)"
              auto-complete="off"
              placeholder="请输入密码"
              style="width: 16rem;"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="validateCode"
            label="验证码"
            style="margin-bottom: 35px;"
          >
            <el-row style="width: 16rem;">
              <el-col :span="14">
                <el-input
                  type="text"
                  v-model="ruleForm2.validateCode"
                  auto-complete="off"
                  placeholder="请输入验证码"
                  style="width: 8rem;"
                ></el-input>
              </el-col>
              <el-col :span="10">
                <img :src="imgCode" @click="changeCode" style="width: 100%;" />
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item style="margin-left: 25%;">
            <el-button
              type="primary"
              @click.native.prevent="login"
              style="width: 15rem;"
              :loading="logining"
            >
              登录
            </el-button>
            <!-- <el-button type="primary" @click.native.prevent="register"
              >注册</el-button
            > -->
          </el-form-item>
        </el-form>
        <el-form
          v-show="radio == 2"
          :model="ruleForm2"
          :rules="rules2"
          class="demo-ruleForm"
          :inline="true"
          ref="ruleForm2"
          label-position="center"
          label-width="100px"
        >
          <el-form-item
            prop="account"
            label="账号"
            style="margin-bottom: 35px;"
          >
            <el-input
              type="text"
              v-model="ruleForm2.account"
              auto-complete="off"
              placeholder="请输入账号"
              style="width: 16rem;"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="checkPass"
            label="密码"
            style="margin-bottom: 35px;"
          >
            <el-input
              type="password"
              v-model="ruleForm2.checkPass"
              @keyup.native.prevent="keydown($event)"
              auto-complete="off"
              placeholder="请输入密码"
              style="width: 16rem;"
            ></el-input>
          </el-form-item>
          <el-form-item required label="确认密码" style="margin-bottom: 35px;">
            <el-input
              type="password"
              v-model="ruleForm2.recheckPass"
              @keyup.native.prevent="keydown($event)"
              auto-complete="off"
              placeholder="请输入确认密码"
              style="width: 16rem;"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="validateCode"
            label="验证码"
            style="margin-bottom: 35px;"
          >
            <el-row style="width: 16rem;">
              <el-col :span="14">
                <el-input
                  type="text"
                  v-model="ruleForm2.validateCode"
                  auto-complete="off"
                  placeholder="请输入验证码"
                  style="width: 8rem;"
                ></el-input>
              </el-col>
              <el-col :span="10">
                <el-button
                  type="text"
                  @click="sendVerifycode"
                  :disabled="!disabledCodeBtn"
                >
                  {{ codeText }}
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item style="margin-left: 25%;">
            <el-button
              type="primary"
              @click.native.prevent="register"
              style="width: 15rem;"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>
        <el-radio-group v-model="radio">
          <!-- <el-radio :label="1">登录</el-radio> -->
          <!-- <el-radio :label="2">注册</el-radio> -->
        </el-radio-group>
      </el-col>
    </div>
    <div class="text">
      <!-- 浙江韬璞科技有限公司 Copyright © 2020 All Rights Reserved -->
    </div>
  </div>
</template>

<script>
import { constantRoutes, asyncRouter, resetRouter } from '@/router'
import {
  filterAsyncParentRouters,
  filterAsyncChildenRouters,
} from '@/store/modules/permission.js'
export default {
  name: 'login',
  data() {
    return {
      logining: false,
      disabledCodeBtn: true,
      codeText: '发送验证码',
      radio: 1,
      ruleForm2: {
        account: '',
        checkPass: '',
        recheckPass: '',
        date1: '',
        date2: '',
      },
      rules2: {
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        checkPass: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        validateCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ],
      },
      checked: true,
      imgCode: '', // 图片验证码
      imgCodeKey: '',
    }
  },
  created() {
    this.getImgCode()
  },

  methods: {
    sendVerifycode() {
      if (this.verifyPhone()) {
      } else {
        this.$axios
          .post(
            '/art/user/sendAuthCode',
            { phone: this.ruleForm2.account },
            {
              headers: {
                device: 'Android',
              },
            },
          )
          .then((respond) => {})
        this.countDown(60)
      }
    },

    // 倒计时方法
    countDown(time) {
      if (time === 0) {
        this.disabledCodeBtn = true
        this.codeText = '发送验证码'
        return
      } else {
        this.disabledCodeBtn = false
        this.codeText = '重新发送(' + time + ')'
        time--
      }
      setTimeout(() => {
        this.countDown(time)
      }, 1000)
    },

    // 表单校验方法
    verifyPhone() {
      if (!this.ruleForm2.account) {
        this.$message.error('请输入手机号')
        return true
      } else {
        return false
      }
    },

    getImgCode() {
      this.$axios.get('/user/imgValidateCode', {}).then((res) => {
        this.imgCode = res.result.img
        this.imgCodeKey = res.result.imgCodeKey
      })
    },

    changeCode() {
      this.getImgCode()
    },

    keydown(event) {
      if (event.keyCode == 13) {
        this.login()
      }
    },
    handleReset2() {
      this.$refs.ruleForm2.resetFields()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    findPath(menus) {
      let realRoutes = new Array()
      let parentMenus = new Array()
      let subMenus = new Array()
      let path = '/'

      menus.forEach((item) => {
        if (item.parentId == 0) {
          parentMenus.push(item)
        } else {
          subMenus.push(item)
        }
      })

      parentMenus.forEach((item, index) => {
        let router = filterAsyncParentRouters(item, subMenus)
        if (router) {
          realRoutes.push(router)
        }
      })
      if (realRoutes && realRoutes.length > 0) {
        for (let i = 0; i < realRoutes.length; i++) {
          let parentRouter = realRoutes[i]
          if (parentRouter.children && parentRouter.children.length > 0) {
            path = parentRouter.children[0].path
            break
          }
        }
      }

      return path
    },
    register() {
      if (!this.ruleForm2.recheckPass) {
        this.$message.error('请输入确认密码')
        return
      }
      if (this.ruleForm2.recheckPass != this.ruleForm2.recheckPass) {
        this.$message.error('两次输入的密码不一致')
        return
      }
      this.$refs.ruleForm2.validate((valid) => {
        if (valid) {
          this.logining = true
          var regParams = {
            mobilePhone: this.ruleForm2.account,
            password: this.ruleForm2.checkPass,
            authCode: this.ruleForm2.validateCode,
            checkPassword: this.ruleForm2.recheckPass,
          }
          this.$axios
            .post(this.API.newNetSchool.school.reg, regParams)
            .then((res) => {
              if (res) {
                this.logining = false
                this.radio = 1
                this.ruleForm2.account = ''
                this.ruleForm2.checkPass = ''
                this.ruleForm2.validateCode = ''
                this.$message({
                  type: 'success',
                  message: '注册成功!',
                })
              }
            })
            .catch(() => {
              this.logining = false
            })
        } else {
          this.logining = false
          return false
        }
      })
    },
    login() {
      this.$refs.ruleForm2.validate((valid) => {
        if (valid) {
          this.logining = true
          var loginParams = {
            username: this.ruleForm2.account,
            password: this.ruleForm2.checkPass,
            imgCode: this.ruleForm2.validateCode,
            imgCodeKey: this.imgCodeKey,
          }
          this.$store
            .dispatch('user/login', loginParams)
            .then((res) => {
              this.logining = false
              // resetRouter()
              let path = '/'
              if (res.result.menuList && res.result.menuList.length > 0) {
                // path = this.findPath(res.result.menuList)
                // this.$router.push({ path: path })
                this.$router.push('/')
              } else {
                this.$message.error('该账号暂未开放权限')
              }
              localStorage.setItem("user_name",res.result.userInfo.name)
              localStorage.setItem("user_logo",res.result.logo)
              localStorage.setItem("user_school",res.result.schoolName)
              localStorage.setItem("role",res.result.userInfo.roleType)
            })
            .catch((err) => {
              this.logining = false
            })
        } else {
          return false
        }
      })
    },
  },
}
</script>
<style>
.el-form-item__label {
  font-size: 16px;
  color: #333;
  font-family: 微软雅黑;
}
</style>
<style lang="scss" scoped>
.loginBj {
  position: absolute;
  padding: 0 0;
  width: 100%;
  height: 100%;
   background-image: url(../../assets/logo_bg.jpg);
  //background: #4fa9e6;
  -moz-background-size: 100% 100%;
  background-size: 100% 100%;

  .login-container {
    position: absolute;
    width: 40rem;
    height: 24rem;
    min-width: 40rem;
    min-height: 28rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%); /* IE 9 */
    -webkit-transform: translate(-50%, -50%); /* Safari and Chrome */
    display: flex;
    flex-direction: row;
    border: solid 0px #fff;
    font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
    .title-bg {
      border-radius: 8px 0 0 8px;
      background-image: url(../../assets/left_bg.jpg);
      -moz-background-size: 100% 100%;
      background-size: 100% 100%;
      padding: 1.5rem 2rem 1.5rem 2rem;
      .title-content {
        display: flex;
        flex-direction: column;
        align-content: center;
        justify-content: space-between;
        height: 100%;
        .title {
          color: #fff;
          font-size: 1.5rem;
          font-family: 'PingFangSC-Medium', 'PingFang SC';
        }
        .content {
          color: #fff;
          font-size: 1rem;
          font-family: 'PingFangSC-Medium', 'PingFang SC';
        }
      }
    }
    .contain-right {
      background-color: #fff;
      border-bottom-right-radius: 8px;
      border-top-right-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 30px 10px 30px 10px;
    }
    .login_title {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      padding-left: 20px;
      background-color: #4fa9e6;
      color: #fff;
      font-size: 26px;
      height: 100px;
      line-height: 100px;
    }
    .login-form {
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      height: 300px;
      padding: 30px 10px 30px 10px;
      background-color: #fff;
    }
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
  }
  .text {
    color: #404243;
    position: absolute;
    font-size: 14px;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
