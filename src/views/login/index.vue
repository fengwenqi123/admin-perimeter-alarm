<template>
  <div class="container">
    <div class="top">
      <div class="logo">
        <div class="tit">三维激光扫描机场围界预警防护系统</div>
      </div>
      <div class="set">
        <div class="tit">技术支持：0571-28000066</div>
      </div>
    </div>
    <div class="main">
      <div class="tip">
        <div class="login-container">
          <el-form
            class="login-form"
            auto-complete="on"
            :model="loginForm"
            ref="loginForm"
            :rules="loginRules"
            label-position="left"
          >
            <div class="title">用户登录</div>
            <el-form-item prop="username">
              <span class="svg-container svg-container_login">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                type="text"
                v-model="loginForm.username"
                auto-complete="on"
                placeholder="请输入用户名"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password"></svg-icon>
              </span>
              <el-input
                name="password"
                placeholder="请输入密码"
                @keyup.enter.native="handleLogin"
                v-model="loginForm.password"
                auto-complete="on"
                show-password
              ></el-input>
            </el-form-item>
            <div class="login-button">
              <el-checkbox v-model="checked">记住密码</el-checkbox>
              <el-button
                type="primary"
                :loading="loading"
                @click.native.prevent="handleLogin"
              >登录</el-button
              >
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <div class="foot">
      浙江华是科技提供技术支持
    </div>
  </div>
</template>

<script>
import {
  setuser,
  setpassword,
  getuser,
  getpassword,
  removeuser,
  removepassword,
  setToken
} from '@/utils/cache'
import logo from '@/assets/img/logo.png'

export default {
  name: 'login',
  data () {
    return {
      logo,
      eye: 'close',
      checked: false,
      loginForm: {
        username: '',
        password: '',
        loginType: 0,
        loginSource: 1
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '请输入用户名' }
        ],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  methods: {
    showPwd () {
      if (this.pwdType === 'password') {
        this.eye = 'open'
        this.pwdType = ''
      } else {
        this.eye = 'close'
        this.pwdType = 'password'
      }
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        // console.log(valid)
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('Login', this.loginForm)
            .then(res => {
              setToken(res.data)
              if (this.checked) {
                setuser(this.loginForm.username)
                setpassword(this.loginForm.password)
              } else {
                removeuser()
                removepassword()
              }
              this.loading = false
              this.$router.push({ path: '/' })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  mounted () {
    if (getuser()) {
      this.loginForm.username = getuser()
      console.log(getpassword())
      if (getpassword()) {
        this.checked = true
        this.loginForm.password = getpassword()
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #000;
      height: 47px;

      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }

  .el-form-item {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    color: #454545;
  }

  .el-button {
    span {
      font-size: 18px;
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.container {
  position: absolute;
  height: 100%;
  width: 100%;
  background-size: 100% 100%;
  display: flex;
  flex-wrap: wrap;
  .top {
    width: 100%;
    height: 10%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .logo{
      margin-left: 100px;
      .tit{
        font-family: AdobeHeiti;
        font-size: 30px;
      }
    }
    .set{
      margin-right: 100px;
      .tit{
        font-size: 30px;
      }
    }
  }
  .foot {
    width: 100%;
    height: 10%;
    font-size: 20px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #696969;
  }
  .main {
    width: 100%;
    height: 80%;
    position: relative;
    background: url("../../assets/img/background.jpg") no-repeat;
    background-size: 100% 100%;
    .tip {
      position: absolute;
      top: 120px;
      left: 50%;
      margin-left: -125px;
      .login-container {
        //position: fixed;
        //width: 100%;
        //// background: url("../../assets/img/login_background.png") no-repeat;
        //background: #f2f2f2;
        //background-size: 100% 100%;

        .clearfix {
          display: flex;
          align-items: center; /*垂直居中*/
          justify-content: flex-end; /*水平居中*/
        }

        .all {
          opacity: 1;
          filter: alpha(opacity=100); /* IE8 及其更早版本 */
          margin-top: 150px;
          width: 850px;

          .logo {
            width: 250px;
            margin: 0 auto;
          }

          .title1 {
            width: 90%;
            margin: 20px auto;
          }
        }

        .login-form {
          width: 350px;
          height: 400px;
          padding: 35px 35px 15px 35px;
          z-index: 11;
          background: #fff;
          border-radius: 5px;
          .title {
            font-size: 25px;
            color: #1482f0;
          }
          img {
            width: 140px;
            margin-bottom: 10px;
          }
          p {
            text-align: right;
            margin-bottom: 10px;
            font-size: 12px;
            color: #888;
          }
        }

        .tips {
          font-size: 14px;
          color: #fff;
          margin-bottom: 10px;

          span {
            &:first-of-type {
              margin-right: 16px;
            }
          }
        }

        .svg-container {
          padding-left: 12px;
          color: $dark_gray;
          vertical-align: middle;
          width: 30px;
          display: inline-block;

          &_login {
            font-size: 20px;
          }

          .svg-icon {
            font-size: 25px;
          }
        }

        .title {
          font-size: 30px;
          font-weight: normal;
          color: #409eff;
          margin: 0px auto 40px auto;
          text-align: center;
        }

        .show-pwd {
          position: absolute;
          right: 10px;
          top: 7px;
          font-size: 16px;
          color: $dark_gray;
          cursor: pointer;
          user-select: none;
        }

        .banner {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 10;
          filter: alpha(opacity=80); /* IE8 及其更早版本 */
          background-size: 100% 100%;
          /deep/ .el-carousel {
            height: 100%;
            width: 100%;
          }
          /deep/ .el-carousel__container {
            height: 100%;
            width: 100%;
          }
          img {
            width: 100%;
            height: 100%;
          }
        }

        .tishi {
          position: absolute;
          bottom: -50px;
          right: 35px;
          font-size: 15px;
          cursor: pointer;
          color: #01579b;
          font-weight: bold;
        }

        .login-button {
          .el-button {
            width: 100%;
            margin-top: 30px;
          }
        }
        .font {
          padding-top: 10px;
          color: #888;
          width: 100%;
          text-align: right;
          display: inline-block;
          font-size: 12px;
        }
      }
      .p1 {
        font-family: AdobeHeiti;
        font-size: 50px;
        color: #255cae;
      }
      .p2 {
        margin-top: 30px;
        font-family: AdobeHeiti;
        margin-left: 280px;
        font-size: 50px;
        color: #255cae;
      }
    }
  }
}
</style>
