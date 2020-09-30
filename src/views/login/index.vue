<template>
  <div class="login-container">
    <div class="login-header">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="13" :md="13">
          <div class="flex">
            <div class="left">
              <img src="@/assets/login/logo.png">
            </div>
          </div>
        </el-col>
        <el-col :xs="0" :sm="11" :md="11">
          <div class="flex">
            <div class="right">
              <span>[一码多扫，红包裂变]</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="login-bg">
      <el-row :gutter="0">
        <el-col :xs="0" :sm="13" :md="13">
          <div class="login-pic">
            <div class="login-content">
              <img src="@/assets/login/bg.png" alt srcset>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="11" :md="11">
          <div class="login-tab">
            <div class="login-content">
              <div class="title">码上拓客后台管理</div>
              <el-form ref="userInfo" :model="userInfo" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
                <el-form-item prop="username">
                  <el-input v-model="userInfo.username" placeholder="账号" @keyup.native.enter="handleLogin">
                    <template #prefix>
                      <i class="el-input__icon"><svg-icon icon-class="user" /></i>
                    </template>
                  </el-input>
                </el-form-item>

                <el-form-item prop="password">
                  <div class="pwd-box">
                    <el-input v-model="userInfo.password" :type="pwdType" placeholder="密码" show-password @keyup.native.enter="handleLogin">
                      <template #prefix>
                        <i class="el-input__icon"><svg-icon icon-class="password" /></i>
                      </template>
                    </el-input>
                    <!-- <span class="show-pwd" @click="showPwd">
                      <svg-icon v-if="pwdType" icon-class="eye" />
                      <svg-icon v-else icon-class="eye-open" />
                    </span> -->
                  </div>
                </el-form-item>
                <el-form-item prop="captcha">
                  <el-input ref="captcha" v-model="userInfo.captcha" placeholder="请输入验证码" @keyup.native.enter="handleLogin">
                    <template slot="prepend"><img :src="captchaImg" @click="getCaptcha()"></template>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button :loading="loading" type="primary" @click.native.prevent="handleLogin">登&nbsp;录</el-button>
                </el-form-item>
              </el-form>
              <div class="weixin-div" @click="wxLogin">
                <span class="line line-green" />
                <img src="@/assets/login/wechat_g.png" alt="" srcset="">
                <span class="line line-green" />
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24">
          <div class="Copyright">Copyright 2014-2020 智网网络. All Rights Reserved</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    return {
      activeName: 'first',
      userInfo: {
        username: '',
        password: '',
        captcha: '',
        key: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
        captcha: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
      },
      loading: false,
      pwdType: 'password',
      captchaImg: ''
    }
  },
  created() {
    // 初始化验证码
    this.getCaptcha()
  },
  methods: {
    // 获取验证码
    getCaptcha() {
      this.$store.dispatch('user/captcha').then((response) => {
        this.captchaImg = response.img
        this.userInfo.key = response.key
      }).catch((error) => {
        console.log(error)
      })
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    // 切换登录方式
    wxLogin(e) {
      // 微信登录
      this.defalultConfirm('正在使用微信登录, 是否继续?', () => {
        location.replace(this.$store.state.config.wx_login_location)
      }, () => {
        this.activeName = 'first'
      })
    },
    // 登录
    handleLogin() {
      this.$refs.userInfo.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/Login', this.userInfo)
            .then(() => {
              this.loading = false
              // { path: this.redirect ||'/' } 可以重定向到上次退出界面，但是如果权限角色改变，若用户不具备该页面权限，页面为空白
              this.$router.push({ path: '/' })
            }).catch(() => {
              // 重新获取验证码
              this.getCaptcha()
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

body {
  overflow: hidden;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .el-row{
    height: inherit;
  }

  .login-header {
    height: 80px;
    background: #fff;
    .left{
      width: 60%;
      height: 80px;
      @extend .flex;
      justify-content: flex-start;
    }
    .right{
      width:55%;
      height: 80px;
      line-height: 80px;
      text-align: right;
    }
    img {
      height: 50px;
    }
    span{
      font-size: 19px;
      color: #4A4A4A;
      font-weight: bold;
    }
  }
  .login-bg {
    width: 100%;
    height: calc(100vh - 80px);
    // background: #e9ffee;
    background: #1FA2FF;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #A6FFCB, #12D8FA, #1FA2FF);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #A6FFCB, #12D8FA, #1FA2FF); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }

  .login-tab,.login-pic {
    width: 100%;
    height: calc(100vh - 110px);
    @extend .flex;
    .login-content{
      background: #fff;
      // border: 1px solid #DEDEDE;
      border-radius: 4px;
      padding: 30px;
    }
  }

  .login-pic{
    .login-content{
      width: 60%;
      height: 378px;
      @extend .flex;
      img{
        width: auto;
        max-width: 100%;
        max-height: 378px;
      }
    }
  }
  .login-tab{
    text-align: center;
    .title{
      font-size: 20px;
      color: $mainColor;
      margin-bottom: 20px;
    }
    .login-content{
      width: 55%;
      min-width: 350px;
    }
  }

  .el-form {
    /deep/ .el-input__prefix{
      left: 10px;
    }
    .el-form-item {
      width: 100%;
      margin: 0 auto 20px;
      .el-input {
        width: 100%;
        input {
          height: 50px;
        }
        .el-input__inner{
          border-radius: 2px;
        }
      }
      .el-button {
        width: 100%;
        height: 40px;
      }
    }
    // .show-pwd {
    //   position: absolute;
    //   right: 20px;
    //   top: 50%;
    //   color: #889aa4;
    //   cursor: pointer;
    //   user-select: none;
    //   transform: translateY(-50%);
    //   .svg-icon {
    //     font-size: 14px !important;
    //   }
    // }
  }

  .weixin-div {
    @extend .flex;
    justify-content: space-between;
    .line{
      width: 30%;
      height: 1px;
      background: #99aab9;
      opacity: 0.5;
    }
    .line-green{
      background: #46d800;
    }
    img{
      cursor: pointer;
    }
  }

  /deep/ .el-input__prefix{
    color: $mainColor;
  }

  .Copyright {
    background: white;
    color: #4A4A4A;
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    text-align: center;
  }
}
/deep/ .el-input-group__prepend{
  padding: 0;
}
</style>
