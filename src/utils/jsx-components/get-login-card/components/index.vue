<!--
 * @Author       : ADI
 * @Date         : 2021-04-13 17:54:44
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-25 18:13:03
-->
<template>
  <div class="loginCard" :class="isOem ? '' : 'directSale'" v-if="showLoginCard">
    <div
      class="card_Box"
      :class="showLoginCard == 1 ? 'message' : 'function'"
      v-for="(item, index) in imgs"
      v-show="index == cardStep"
      :key="index"
    >
      <img class="card_img" :class="showLoginCard == 1 ? 'messageImg' : 'functionImg'" :src="item.imgs[0]" />
      <div class="iknow_btn" @click="saveLoginCard(index + 1)">{{ nextText }}</div>
    </div>
  </div>
</template>

<script>
import { getCookie, setCookie, format, postMessage, loading } from '@/utils';
import { mapState } from 'vuex';
import { addTsPushRecord, getVaildedTsPushConf } from '@/api/modules/component/get-login-card';
import { checkPush } from '@/api/modules/common';

export default {
  name: 'get-login-card',
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
    }),
    nextText() {
      if (this.cardStep == this.imgs.length - 1) {
        return '我知道了';
      } else {
        return '下一步';
      }
    },
  },
  created() {
    this.getLoginCard();
  },
  methods: {
    /**-------------------系统说明卡片方法分割线-------------------**/
    /**
     * 获取登录卡片的方法
     *
     * @author guoyijie
     * @date 2020-04-18
     */
    getLoginCard() {
      if (!getCookie('isShowCard')) {
        loading.addQuene({
          key: 'loadingPoupBox',
        });
        this.hasLoginCard().then(showLoginCard => {
          loading.poupQuene('loadingPoupBox');
          if (showLoginCard) {
            this.getImgList();
          } else {
            this.resolve();
          }
        });
      } else {
        this.resolve();
      }
    },
    /**
     * 保存卡片记录。
     *
     * @author guoyijie
     * @date 2020-04-18
     * @param {*} index
     */
    async saveLoginCard(index) {
      if (index < this.imgs.length) {
        this.cardStep = index;
      } else {
        // let expiresTime = new Date(new Date().getTime() + 0.5 * 60 * 60 * 1000);
        const expiresTime = format.addDate(new Date(), 30, 'minutes');
        const [err, res] = await addTsPushRecord({
          pushId: this.cardId,
        });
        if (err) {
          postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        setCookie('isShowCard', 'isShow', {
          expires: expiresTime,
        });
        this.showLoginCard = false;
        this.cardStep = 0;
        this.resolve();
      }
    },
    /**
     * 判断是否存在登陆卡片
     *
     * @author guoyijie
     * @date 2020-04-18
     * @returns {boolean}
     */
    async hasLoginCard() {
      const [err, res] = await checkPush();
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
      } else {
        this.showLoginCard = res.data.exists;
      }
      return Promise.resolve(this.showLoginCard);
    },
    /**
     * 获取登录卡片img的方法
     *
     * @author guoyijie
     * @date 2020-04-18
     */
    async getImgList() {
      const [err, response] = await getVaildedTsPushConf();
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return;
      }
      this.imgs = response.data.infoList;
      this.cardId = response.data.infoList[0].id;
      this.showLoginCard = response.data.infoList[0].type;
    },
  },
};
</script>

<style lang="scss" scoped>
.loginCard {
  position: fixed;
  top: 0%;
  left: 0%;
  z-index: $zindex-dialog;
  width: 100%;
  height: 100%;
  min-width: 1350px;
  background: rgba(0, 0, 0, 0.6);
}
.directSale {
  .card_Box {
    .iknow_btn {
      bottom: 12px;
      height: 44px;
      font-size: 16px;
      line-height: 44px;
      background: $primary-color;
      border-radius: 8px;
    }
  }
}

.loginCard {
  .card_Box {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 590px;
    border-radius: 10px;
    transform: translate(-50%, -50%);
    .iknow_btn {
      position: absolute;
      bottom: 30px;
      left: 70px;
      width: 400px;
      height: 55px;
      font-size: 20px;
      line-height: 55px;
      color: $color-ff;
      text-align: center;
      cursor: pointer;
      background: $primary-color;
      border-radius: 38px;
    }
    .card_img {
      position: absolute;
      top: 0;
      left: 0;
      width: 540px;
      height: 630px;
      border-radius: 10px;
    }
    .messageImg {
      height: 450px;
    }
    .functionImg {
      height: 538px;
    }
  }
  .message {
    height: 450px;
  }
  .function {
    height: 538px;
  }
}
.directSale .message,
.directSale .function {
  height: 450px;
}
.directSale .card_Box .messageImg,
.directSale .card_Box .functionImg {
  height: 450px;
}
</style>
