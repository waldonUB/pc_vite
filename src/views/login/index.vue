<!--
 * @Description  : 开发模式登录
 * @Author       : turbo
 * @Date         : 2021-01-27 15:18:17
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-22 10:19:58
-->

<template>
  <div class="login-wrap">
    <div class="login-box">
      <div class="login-box__head">销售管理系统</div>
      <div class="login-box__content">
        <fa-form class="login-box__form">
          <fa-form-item>
            <div class="login-box__form__item">
              <global-ts-svg-icon
                class="login-box__input__svg"
                name="icon-icon-29"
                :width="18"
                :height="18"
                color="#b2b2b2"
              />
              <global-ts-input
                v-model="loginInfo.cacct"
                size="large"
                placeholder="请输入企业帐号"
                @pressEnter="login"
              ></global-ts-input>
            </div>
          </fa-form-item>
          <fa-form-item>
            <div class="login-box__form__item">
              <global-ts-svg-icon
                class="login-box__input__svg"
                name="icon-icon-28"
                :width="18"
                :height="18"
                color="#b2b2b2"
              />
              <global-ts-input
                v-model="loginInfo.sacct"
                size="large"
                placeholder="请输入员工帐号"
                @pressEnter="login"
              ></global-ts-input>
            </div>
          </fa-form-item>
          <fa-form-item>
            <div class="login-box__form__item">
              <global-ts-svg-icon
                class="login-box__input__svg"
                name="icon-icon-27"
                :width="18"
                :height="18"
                color="#b2b2b2"
              />
              <global-ts-input
                v-model="loginInfo.password"
                size="large"
                type="password"
                placeholder="请输入密码"
                @pressEnter="login"
              ></global-ts-input>
            </div>
          </fa-form-item>
          <fa-form-item v-if="isShowValidateCode">
            <div class="login-box__form__item">
              <global-ts-svg-icon class="login-box__input__svg" :width="18" />
              <global-ts-input
                v-model="loginInfo.validateCode"
                size="large"
                placeholder="请输入验证码"
                @pressEnter="login"
              ></global-ts-input>
              <img class="login-box__validate" :src="validateImgSrc" @click="getValidateCode" />
            </div>
          </fa-form-item>
          <div class="login-checkbox">
            <fa-checkbox v-model="loginInfo.autoLogin">两周内自动登录</fa-checkbox>
          </div>
          <div v-if="errorInfo.isError" class="login-error">
            <global-ts-svg-icon
              class="login-error__svg"
              name="icon-shuxing1616"
              :width="14"
              :height="14"
              color="#ff4d4d"
            />
            {{ errorInfo.errorMsg }}
          </div>
          <div class="login-button" @click="login">立即登录</div>
        </fa-form>
      </div>
    </div>
  </div>
</template>

<script>
import MD5 from 'md5.js';
import { omit } from 'lodash';
import { mapState } from 'vuex';

// utils
import { getCookie, postMessage, setCookie } from '@/utils';

// api
import { login } from '@/api/modules/views/user';

export default {
  name: 'Login',
  data() {
    return {
      loginInfo: {
        cacct: getCookie('loginCacct') || '', // 企业帐号
        sacct: getCookie('loginSacct') || '', // 员工帐号
        password: '', // 没有加密过的密码
        pwd: '', // 加密过的密码
        validateCode: '', // 验证码
        autoLogin: true, // 是否自动登录
        isDevMode: true, // 是否开发模式
      },
      errorInfo: {
        isError: false,
        errorMsg: '',
      },
      validateList: {
        cacct: '企业帐号',
        sacct: '员工帐号',
        password: '密码',
        validateCode: '验证码',
      },
      isShowValidateCode: false,
      validateImgSrc: '',
    };
  },
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
    }),
  },
  methods: {
    setErrorInfo(errorMsg) {
      this.errorInfo = {
        isError: true,
        errorMsg,
      };
    },
    async login() {
      this.errorInfo.isError = false;
      const keyList = Object.keys(this.validateList);
      for (let i = 0; i < keyList.length; i++) {
        const key = keyList[i];
        if (!this.loginInfo[key] && (key !== 'validateCode' || this.isShowValidateCode)) {
          this.setErrorInfo(`请输入${this.validateList[key]}`);
          break;
        }
      }

      if (this.errorInfo.isError) return;
      this.loginInfo.isOem = this.isOem;
      this.loginInfo.pwd = new MD5().update(this.loginInfo.password).digest('hex');
      const [err, res] = await login(omit(this.loginInfo, ['password']));
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg,
        });
        const { needValidateCode } = err?.data;
        if (needValidateCode) {
          this.getValidateCode();
          this.isShowValidateCode = true;
        }
        this.setErrorInfo(err.msg);
        return Promise.reject(err);
      }
      const { _TOKEN, _LOGIN_SIGN } = res?.data;

      setCookie('_TOKEN', _TOKEN);
      setCookie('_LOGIN_SIGN', _LOGIN_SIGN);
      this.$router.push({ path: this.$route.query.redirect || '/' });
    },
    getValidateCode() {
      this.validateImgSrc = '/proxy/validateCode.jsp?' + Math.random() + '&validateCodeRegType=3';
    },
  },
};
</script>

<style lang="scss" scoped>
.login-wrap {
  @include flex-center;

  height: 100vh;
  background-image: url('~@/assets/image/login.jpg');
  background-size: cover;
}

.login-box {
  width: 420px;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);

  .login-box__head {
    @include flex-center;

    height: 120px;
    font-size: 32px;
    color: $color-53;
    background-color: #f7f7f7;
  }

  .login-box__content {
    @include flex-center;

    padding: 40px 0 50px;
    background-color: #ffffff;
  }

  .login-box__form {
    width: 280px;

    .fa-form-item {
      margin-bottom: 30px;
    }
  }

  .login-box__form__item {
    @include flex-center;

    ::v-deep .fa-input {
      border-top: 0;
      border-right: 0;
      border-left: 0;
      box-shadow: none;
    }
  }

  .login-box__input__svg {
    margin-right: 4px;
    flex-shrink: 0;
  }

  .login-box__validate {
    width: 106px;
    height: 40px;
  }

  .login-checkbox {
    margin-top: -15px;
  }

  .login-error {
    @include flex-left;

    width: 280px;
    height: 25px;
    margin-top: 15px;
    font-size: 12px;
    color: $error-color;
    background-color: $error-color-bg;
    border: 1px solid $error-color;
    box-sizing: border-box;
  }

  .login-error__svg {
    padding: 0 10px;
  }

  .login-button {
    width: 280px;
    height: 50px;
    margin-top: 30px;
    font-size: 18px;
    line-height: 50px;
    color: #ffffff;
    text-align: center;
    cursor: pointer;
    background: linear-gradient(90deg, #4ab2fa, $primary-color);
    border-radius: 25px;
    box-shadow: 0 6px 16px 0 rgba(11, 109, 246, 0.3);
  }
}
</style>
