<template>
  <div class="showGuide" v-if="showGuide">
    <div class="step step3" v-if="step == 3">
      <div class="tipBox">
        <div class="smileImg"></div>
        <div class="tipText tipText_1">文章缩略图设置后，</div>
        <div class="tipText tipText_2">可以在微信分享文章的时候看到哦~</div>
        <div class="messageImg"></div>
        <div class="knowImg" @click="closeGuide('createArticle', 3)"></div>
      </div>
    </div>
    <div class="step step6" v-if="step == 6">
      <div class="tipBox">
        <div class="innerBox" :class="showBtypeTip">
          <div class="operateTip_5">
            <div class="tipText tipText_1">文章素材可以直接编辑并分享获客</div>
            <div class="okImg" @click="saveGuide('articleLibrary', 6)"></div>
          </div>
          <div class="QRImg"></div>
          <div class="motation tdRow">
            <div class="edit">编辑</div>
            <div>数据</div>
          </div>
        </div>
      </div>
    </div>
    <div class="step step7" v-if="step == 7">
      <div class="tipBox">
        <div class="QRImg" :style="{ backgroundImage: 'url(' + QRUrl + ')' }"></div>
        <div class="tipText tipText_1">温馨提示:</div>
        <div class="tipText tipText_2">名片及文章分享请扫码前往小程序操作</div>
        <div class="okImg" @click="saveGuide('article', 7)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { postMessage } from '@/utils';
import { getTsGuideListAjax, saveTsGuideAjax } from '@/api/modules/common';
import { getTsUserWxAuthAppQr } from '@/api/modules/views/user';

export default {
  name: 'get-guide',
  watch: {
    step() {
      if (this.step == 7) {
        this.getqrCode();
      }
    },
  },
  computed: {
    isStaff() {
      return this.$store.state.user.info?.staffInfo?.workId == 2;
    },
  },
  created() {
    this.getGuide();
  },
  methods: {
    /**
     * 获取页面指引的方法
     *
     * @author guoyijie
     * @date 2020-04-18
     */
    async getGuide() {
      const [err, response] = await getTsGuideListAjax();
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.guideList = Object.assign({}, response.data.guideList);
      if (!this.guideList[8]) {
        this.showBtypeTip = 'showBtypeTip';
      }
      if (this.params?.page == 'articleLibrary') {
        this.saveGuide('articleLibrary', 8);
      }
      this.pageSet = Object.assign({}, response.data.pageSet);
      if (this.checkSomeStep(this.params?.page || '', this.params?.step || 0)) {
        this.showGuide = true;
      } else {
        this.step = 0;
        this.showGuide = false;
        this.resolve();
      }
    },
    /**
     * 保存指引方法
     *
     * @author guoyijie
     * @date 2020-04-18
     * @param {*} page
     * @param {*} step
     * @returns
     */
    async saveGuide(page, step) {
      const [err, res] = saveTsGuideAjax({
        step,
      });
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.$set(this.guideList, step, true);
      if (!this.isStaff && page !== 'createArticle') {
        if (this.hasNextStep(page) == -1) {
          this.showGuide = false;
        }
      } else if (page == 'createArticle') {
        this.step = -1;
      } else {
        this.showGuide = false;
        this.step = -1;
      }
      return Promise.resolve();
    },
    /**
     *针对文章模板页四小步的保存
     *
     * @author guoyijie
     * @date 2020-04-18
     * @param {*} page
     * @param {*} step
     */
    closeGuide(page, step) {
      this.saveGuide(page, step).then(() => {
        this.resolve();
      });
    },
    /**
     *检查是否有下一步
     *
     * @author guoyijie
     * @date 2020-04-18
     * @param {*} page
     * @returns {boolean}
     */
    hasNextStep(page) {
      const nowPageList = this.pageSet[page];
      if (!nowPageList) {
        return -1;
      }
      let nextStep = -1;
      //从头开始检查当前页面是否有没有完成的步骤，直到找到一个为止
      nowPageList.forEach(ele => {
        if (nextStep == -1 && !this.checkIsFinish(ele)) {
          nextStep = ele;
          this.step = nextStep;
        }
      });
      return nextStep;
    },
    /**
     * 获取二维码
     *
     * @author guoyijie
     * @date 2020-04-18
     */
    async getqrCode() {
      const [err, res] = await getTsUserWxAuthAppQr();
      if (err) {
        postMessage({
          type: 'error',
          message: res.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.QRUrl = res.data.qrUrl;
    },
    /**
     *
     *判断某一步是否完成
     * @author guoyijie
     * @date 2020-04-18
     * @param {*} step
     * @returns
     */
    checkIsFinish(step) {
      return this.guideList[step];
    },
    /**
     *
     *检查是否某个页面
     * @author guoyijie
     * @date 2020-04-18
     * @param {*} page
     * @param {*} step
     * @returns
     */
    checkSomeStep(page, step) {
      let result = false;
      if (page == 'article' || page == 'createArticle') {
        if (step) {
          if (!this.checkIsFinish(step)) {
            this.step = step;
            result = true;
          }
        }
      } else {
        if (this.hasNextStep(page) !== -1) {
          this.step = this.hasNextStep(page);
          result = true;
        }
      }
      if (!result) {
        this.resolve();
      }
      return result;
    },
  },
};
</script>

<style lang="scss" scoped>
.step,
.loginCard {
  position: fixed;
  top: 0%;
  left: 0%;
  z-index: 10000;
  width: 100%;
  height: 100%;
  min-width: 1350px;
  background: rgba(0, 0, 0, 0.6);
}
.tipBox {
  position: absolute;
  top: 68px;
  left: 272px;
  width: calc(100% - 272px);
  background: rgba(0, 0, 0, 0);
  .tipText {
    font-size: 20px;
    color: #ffffff;
  }
}
.step1 {
  .tipBox {
    display: flex;
    justify-content: space-between;
    min-width: 1120px;
  }
  .rightPart {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: flex-end;
    .motation {
      width: 156px;
      height: 54px;
      margin-top: 9px;
      margin-right: 32px;
      line-height: 54px;
      text-align: center;
      background: #ffffff;
      border-radius: 10px;
    }
    .arrowImg {
      width: 116px;
      height: 71px;
      margin: 20px 175px 20px 0;
      margin-right: 67px;
      background: url('~@/assets/image/comm/operateTip/arrow_right_1.png') no-repeat;
      background-size: 100% 100%;
    }
    .center {
      margin-right: 120px;
      text-align: center;
      .qrImg {
        width: 180px;
        height: 180px;
        margin: 20px auto;
        background-color: #ffffff;
        background-position: 50% 50%;
        background-repeat: no-repeat;
        background-size: 150px 150px;
        border-radius: 10px;
      }
    }
  }
  .center {
    .tryImg {
      width: 209px;
      height: 87px;
      margin-top: 30px;
      margin-left: 95px;
      background-image: url('~@/assets/image/comm/direct/totry.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
}
.directSale {
  .step1 {
    .center {
      .tryImg {
        margin-left: 122px;
        background: url('~@/assets/image/comm/direct/totry.png') no-repeat;
      }
    }
  }
  .step7 {
    .tipBox {
      .okImg {
        background-image: url('~@/assets/image/comm/direct/ok.png');
      }
    }
  }
  .step6 {
    .tipBox {
      .innerBox {
        .motation {
          color: $primary-color;
        }
        .operateTip_5 {
          .okImg {
            background: url('~@/assets/image/comm/direct/ok.png') no-repeat;
          }
        }
      }
    }
  }
  .step2 {
    .step_0 {
      .tipBox {
        .okImg {
          background-image: url('~@/assets/image/comm/direct/ok.png');
        }
      }
    }
    .step_1 {
      .tipBox {
        .leftPart {
          .nextImg {
            background-image: url('~@/assets/image/comm/direct/next.png');
          }
        }
      }
    }
    .step_2 {
      .tipBox {
        .middlePart {
          .nextImg {
            background-image: url('~@/assets/image/comm/direct/next.png');
          }
        }
      }
    }
    .step_3 {
      .tipBox {
        .leftPart {
          .nextImg {
            background-image: url('~@/assets/image/comm/direct/next.png');
          }
        }
      }
    }
    .step_4 {
      .tipBox {
        .leftPart {
          .buttonBox {
            & > div {
              background: $primary-color;
            }
          }
          .nextImg {
            background-image: url('~@/assets/image/comm/direct/next.png');
          }
        }
      }
    }
    .step_5 {
      .tipBox {
        .tipInfo {
          .tryImg {
            background-image: url('~@/assets/image/comm/direct/totry.png');
          }
        }
        .buttonBox {
          & > div {
            background: $primary-color;
          }
        }
      }
    }
  }
  .step3 {
    .tipBox {
      .knowImg {
        background-image: url('~@/assets/image/comm/direct/know.png');
      }
    }
  }
}
.step7 .tipBox,
.step3 .tipBox {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 560px;
  height: 180px;
  margin-top: -90px;
  margin-left: -260px;
}
.step7 {
  .tipBox {
    .QRImg {
      position: absolute;
      top: 0;
      left: 0;
      display: inline-block;
      width: 180px;
      height: 180px;
      background: #ffffff;
      background-position: 15px 15px;
      background-repeat: no-repeat;
      background-size: 150px 150px;
      border-radius: 10px;
    }
    .tipText_2 {
      position: absolute;
      top: 55px;
      left: 220px;
      font-size: 16px;
    }
    .okImg {
      position: absolute;
      top: 94px;
      left: 220px;
      display: inline-block;
      width: 209px;
      height: 87px;
      cursor: pointer;
      background-image: url('~@/assets/image/comm/direct/ok.png');
      background-repeat: no-repeat;
      background-size: 209px 87px;
    }
  }
}
.step7 .tipBox .tipText,
.step3 .tipBox .tipText {
  display: inline-block;
  // font-family: Alibaba PuHuiTi;
  font-size: 20px;
  color: #ffffff;
}
.step7 .tipBox .tipText_1,
.step3 .tipBox .tipText {
  position: absolute;
  top: 23px;
  left: 220px;
}
.step6 {
  .tipBox {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    min-width: 1145px;
    justify-content: flex-end;
    .innerBox {
      position: relative;
      display: flex;
      width: 700px;
      margin-top: 297px;
      margin-right: 100px;
      justify-content: space-between;
      &.showBtypeTip {
        margin-top: 618px;
      }
      .QRImg {
        position: absolute;
        top: 82px;
        left: 330px;
        width: 128px;
        height: 45px;
        background: url('~@/assets/image/comm/operateTip/arrow_down_1.png') no-repeat;
      }
      .motation {
        width: 130px;
        height: 40px;
        padding: 0 6px;
        margin-top: 107px;
        margin-right: 36px;
        font-size: 14px;
        line-height: 40px;
        color: #000000;
        color: $primary-color;
        text-align: center;
        background: #ffffff;
        border-radius: 10px;
      }
      .tdRow {
        display: flex;
        justify-content: center;
        .edit {
          margin-right: 4px;
        }
      }
      .operateTip_5 {
        .okImg {
          width: 209px;
          height: 87px;
          margin: 0 auto;
          background: url('~@/assets/image/comm/direct/ok.png') no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }
}
.step2 {
  .commTipBox {
    position: absolute;
    top: 68px;
    left: 272px;
    width: calc(100% - 272px);
    height: 100%;
    min-width: 1128px;
    background: rgba(0, 0, 0, 0);
  }
  .step_0 {
    .tipBox {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 500px;
      height: 200px;
      margin-top: -100px;
      margin-left: -250px;
      .smileImg {
        position: absolute;
        top: 0;
        left: 0;
        display: inline-block;
        width: 82px;
        height: 97px;
        background-image: url('~@/assets/image/comm/operateTip/smile.png');
        background-repeat: no-repeat;
        background-size: 82px 97px;
      }
      .tipText {
        position: absolute;
        top: 0;
        left: 88px;
        display: inline-block;
        height: 97px;
        // font-family: Alibaba PuHuiTi;
        font-size: 20px;
        line-height: 97px;
        color: #ffffff;
      }
      .okImg {
        position: absolute;
        top: 94px;
        left: 26px;
        display: inline-block;
        width: 209px;
        height: 87px;
        cursor: pointer;
        background-image: url('~@/assets/image/comm/direct/ok.png');
        background-repeat: no-repeat;
        background-size: 209px 87px;
      }
      .noneedImg {
        position: absolute;
        top: 114px;
        left: 244px;
        display: inline-block;
        width: 165px;
        height: 69px;
        cursor: pointer;
        background-image: url('~@/assets/image/comm/operateTip/noneed.png');
        background-repeat: no-repeat;
        background-size: 165px 69px;
      }
    }
  }
  .step_1 {
    position: fixed;
    top: 0%;
    left: 0%;
    z-index: 10000;
    width: 100%;
    height: 100%;

    /* background: rgba(0, 0, 0, .6); */
    .tipBox {
      /* width: -moz-calc(100% - 190px);
  width: -webkit-calc(100% - 190px);
  width: calc(100% - 190px);
  height: 100%;
  position: absolute;
  left: 272px;
  top: 68px;
  min-width: 1010px;
  background: rgba(0, 0, 0, 0); */
      .leftPart {
        position: absolute;
        top: 105px;
        left: 50px;

        /* width: -moz-calc(100% - 821px); */

        /* width: -webkit-calc(100% - 804px); */

        /* width: calc(100% - 804px); */
        width: calc(100% - 798px);
        height: 600px;
        min-width: 445px;
        .inputBox {
          width: calc(100% - 126px);
          height: 40px;
          padding: 3px;
          padding-top: 0;
          padding-right: 0;
          background: #ffffff;
          border-radius: 10px;
        }
        .arrowImg {
          position: absolute;
          top: 45px;
          left: 100px;
          display: inline-block;
          width: 115px;
          height: 71px;
          background-image: url('~@/assets/image/comm/operateTip/arrow.png');
          background-repeat: no-repeat;
          background-size: 115px 71px;
        }
        .nextImg {
          position: absolute;
          top: 150px;
          left: 180px;
          display: inline-block;
          width: 209px;
          height: 87px;
          cursor: pointer;
          background-image: url('~@/assets/image/comm/direct/next.png');
          background-repeat: no-repeat;
          background-size: 209px 87px;
        }
      }
      .tipText {
        display: inline-block;
        // font-family: Alibaba PuHuiTi;
        font-size: 16px;
        color: #ffffff;
      }
      .tipText_1 {
        position: absolute;
        top: 76px;
        left: 398px;
      }
      .tipText_2 {
        position: absolute;
        top: 100px;
        left: 240px;
        font-size: 20px;
      }
    }
  }
  .step_2 {
    position: fixed;
    top: 0%;
    left: 0%;
    z-index: 10000;
    width: 100%;
    height: 100%;
    .topPart {
      width: 100%;
      height: 173px;
      background: rgba(0, 0, 0, 0.6);
    }
    .navPart {
      position: absolute;
      top: 173px;
      left: 0;
      width: 322px;

      /* height: -moz-calc(100% - 173px);
  height: -webkit-calc(100% - 173px);
  height: calc(100%-173px); */
      height: 1000px;
      background: rgba(0, 0, 0, 0.6);
    }
    .tipBox {
      /* width: -moz-calc(100% - 190px);
  width: -webkit-calc(100% - 190px);
  width: calc(100% - 190px);
  height: 100%;
  position: absolute;
  left: 272px;
  top: 68px;
  min-width: 1010px;
  background: rgba(0, 0, 0, 0); */

      /* Firefox */

      /* IE10 */

      /* Safari */

      /* Chrome, WebKit */
      display: flex;
      .leftPart {
        position: relative;
        width: calc(100% - 780px);
        height: calc(100% - 173px);
        min-width: 445px;
        margin-top: 105px;

        /* position: absolute;
  left: 50px;
  top: 105px; */
        margin-left: 50px;
        .top {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 122px;
          background: rgba(0, 0, 0, 0.6);
        }
        .bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 176px;
          background: rgba(0, 0, 0, 0.6);
        }
      }
      .middlePart {
        position: relative;
        width: 372px;
        height: calc(100% - 173px);
        min-width: 250px;
        margin-top: 105px;
        background: rgba(0, 0, 0, 0.6);
        .arrowImg {
          position: absolute;
          top: 120px;
          left: 19px;
          display: inline-block;
          width: 115px;
          height: 71px;
          background-image: url('~@/assets/image/comm/operateTip/arrow.png');
          background-repeat: no-repeat;
          background-size: 115px 71px;
        }
        .tipText {
          display: inline-block;
          // font-family: Alibaba PuHuiTi;
          font-size: 16px;
          color: #ffffff;
        }
        .tipText_1 {
          position: absolute;
          top: 156px;
          left: 305px;
        }
        .tipText_2 {
          position: absolute;
          top: 180px;
          left: 150px;
          width: 200px;
          font-size: 20px;
        }
        .nextImg {
          position: absolute;
          top: 225px;
          left: 120px;
          display: inline-block;
          width: 209px;
          height: 87px;
          cursor: pointer;
          background-image: url('~@/assets/image/comm/direct/next.png');
          background-repeat: no-repeat;
          background-size: 209px 87px;
        }
      }
      .rightPart {
        width: 420px;
        height: calc(100% - 173px);
        min-width: 360px;
        margin-top: 105px;
        background: rgba(0, 0, 0, 0.6);
      }
    }
  }
  .step_3 {
    position: fixed;
    top: 0%;
    left: 0%;
    z-index: 10000;
    width: 100%;
    height: 100%;

    /* background: rgba(0, 0, 0, .6); */
    .tipBox {
      position: absolute;
      top: 68px;
      left: 190px;

      /* Firefox */

      /* IE10 */

      /* Safari */

      /* Chrome, WebKit */
      display: flex;
      width: calc(100% - 190px);
      height: 100%;
      min-width: 1010px;
      background: rgba(0, 0, 0, 0);
      .leftPart {
        position: relative;
        width: calc(100% - 715px);
        height: 600px;
        min-width: 445px;
        margin-top: 260px;
        margin-left: 50px;
        .arrowImg {
          position: absolute;
          top: 120px;
          right: 50px;
          display: inline-block;
          width: 115px;
          height: 71px;
          background-image: url('~@/assets/image/comm/operateTip/arrow_right.png');
          background-repeat: no-repeat;
          background-size: 115px 71px;
        }
        .tipText {
          display: inline-block;
          // font-family: Alibaba PuHuiTi;
          font-size: 16px;
          color: #ffffff;
        }
        .tipText_1 {
          position: absolute;
          top: 156px;
          right: 200px;
        }
        .tipText_2 {
          position: absolute;
          top: 180px;
          right: 200px;
          font-size: 20px;
        }
        .nextImg {
          position: absolute;
          top: 240px;
          right: 200px;
          display: inline-block;
          width: 209px;
          height: 87px;
          cursor: pointer;
          background-image: url('~@/assets/image/comm/direct/next.png');
          background-repeat: no-repeat;
          background-size: 209px 87px;
        }
      }
      .middlePart {
        width: 400px;
        height: 600px;
        min-width: 250px;
        margin-top: 226px;
        & > div {
          float: right;
          width: calc(100% - 20px);
          height: 210px;
          padding: 20px 10px;
          margin-top: 106px;
          font-size: 14px;
          background: #ffffff;
          border-radius: 10px;

          /* min-width: 100px; */
          & > div {
            &:nth-of-type(3) {
              margin-top: 45px;
            }
            &:nth-of-type(even) {
              height: 39px;
              padding-left: 10px;
              margin-top: 5px;
              line-height: 39px;
              color: rgb(209, 204, 204);
              border: 1px solid #eeeeee;
              border-radius: 4px;
            }
          }
        }
      }
      .rightPart {
        width: 410px;
        height: 600px;
        min-width: 360px;
        margin-top: 105px;
      }
    }
  }
  .step_4 {
    position: fixed;
    top: 0%;
    left: 0%;
    z-index: 10000;
    width: 100%;
    height: 100%;

    /* background: rgba(0, 0, 0, .6); */
    .tipBox {
      /* width: -moz-calc(100% - 190px);
  width: -webkit-calc(100% - 190px);
  width: calc(100% - 190px);
  height: 100%;
  position: absolute;
  left: 272px;
  top: 68px;
  min-width: 1010px;
  background: rgba(0, 0, 0, 0); */
      .leftPart {
        position: absolute;
        top: 105px;
        left: 50px;
        width: calc(100% - 782px);
        height: 600px;
        min-width: 445px;
        .buttonBox {
          position: absolute;
          right: 10px;
          width: 120px;
          height: 40px;
          padding: 0 0 3px 13px;
          background: #ffffff;
          border-radius: 10px;
          & > div {
            width: 100px;
            margin-right: 0;
            font-size: 14px;
            line-height: 40px;
            color: #ffffff;
            text-align: center;
            background: $primary-color;
            border: 1px solid #eeeeee;
            border-radius: 4px;
          }
        }
        .arrowImg {
          position: absolute;
          top: 60px;
          right: 80px;
          display: inline-block;
          width: 115px;
          height: 71px;
          background-image: url('~@/assets/image/comm/operateTip/arrow_right.png');
          background-repeat: no-repeat;
          background-size: 115px 71px;
        }
        .nextImg {
          position: absolute;
          top: 270px;
          right: 100px;
          display: inline-block;
          width: 209px;
          height: 87px;
          cursor: pointer;
          background-image: url('~@/assets/image/comm/direct/next.png');
          background-repeat: no-repeat;
          background-size: 209px 87px;
        }
      }
      .tipText {
        display: inline-block;
        // font-family: Alibaba PuHuiTi;
        font-size: 20px;
        color: #ffffff;
      }
      .tipText_1 {
        position: absolute;
        top: 140px;
        right: 298px;
        font-size: 16px;
      }
      .tipText_2 {
        position: absolute;
        top: 165px;
        right: 60px;
      }
      .tipText_3 {
        position: absolute;
        top: 195px;
        right: 163px;
      }
      .tipText_4 {
        position: absolute;
        top: 225px;
        right: 5px;
        font-size: 20px;
      }
    }
  }
  .step_5 {
    position: fixed;
    top: 0%;
    left: 0%;
    z-index: 10000;
    width: 100%;
    height: 100%;
    .tipBox {
      /* width: -moz-calc(100% - 242px);
  width: -webkit-calc(100% - 242px);
  width: calc(100% - 242px);
  height: 100%;
  position: absolute;
  left: 272px;
  top: 68px;
  min-width: 1060px;
  background: rgba(0, 0, 0, 0); */
      .tipInfo {
        position: absolute;
        bottom: 218px;
        left: 23%;
        width: 650px;
        height: 130px;
        .smileImg {
          position: absolute;
          top: 0;
          left: 0;
          display: inline-block;
          width: 82px;
          height: 97px;
          background-image: url('~@/assets/image/comm/operateTip/smile.png');
          background-repeat: no-repeat;
          background-size: 82px 97px;
        }
        .tipText {
          display: inline-block;
          // font-family: Alibaba PuHuiTi;
          font-size: 16px;
          color: #ffffff;
        }
        .tipText_1 {
          position: absolute;
          top: 0;
          left: 100px;
        }
        .tipText_2 {
          position: absolute;
          top: 21px;
          left: 26%;
          left: 100px;
        }
        .tipText_3 {
          position: absolute;
          top: 42px;
          left: 26%;
          left: 100px;
        }
        .tryImg {
          position: absolute;
          top: 0;
          right: 30px;
          display: inline-block;
          width: 209px;
          height: 87px;
          cursor: pointer;
          background-image: url('~@/assets/image/comm/direct/totry.png');
          background-repeat: no-repeat;
          background-size: 209px 87px;
        }
      }
      .arrowImg {
        position: absolute;
        bottom: 180px;
        left: 35%;
        display: inline-block;
        width: 115px;
        height: 71px;
        background-image: url('~@/assets/image/comm/operateTip/arrow_down.png');
        background-repeat: no-repeat;
        background-size: 115px 71px;
      }
      .buttonBox {
        position: absolute;
        right: calc(50% - 20px);
        bottom: 115px;
        width: 160px;
        height: 40px;
        padding: 0 0 3px 13px;
        background: #ffffff;
        border-radius: 10px;
        & > div {
          width: 140px;
          margin-right: 0;
          font-size: 14px;
          line-height: 40px;
          color: #ffffff;
          text-align: center;
          background: $primary-color;
          border: 1px solid #eeeeee;
          border-radius: 4px;
        }
      }
    }
  }
}

/*  .step2 .step_1 .tipBox .leftPart .inputBox .isActive{
  color: #000;
} */

/* .step2 .step_1 .tipBox .leftPart .inputBox>div {
  border: 1px solid #eeeeee;
  border-radius: 4px 10px 4px 4px;
  line-height: 39px;
  color: rgb(209, 204, 204);
} */
.noBackground {
  background: rgba(0, 0, 0, 0);
}
.step3 {
  position: fixed;
  top: 0%;
  left: 0%;
  z-index: 10000;
  width: 100%;
  height: 100%;
  min-width: 1500px;

  /* background: rgba(0, 0, 0, .6); */
  .tipBox {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 900px;
    height: 210px;
    margin-top: -105px;
    margin-left: -450px;
    .smileImg {
      position: absolute;
      top: 0;
      left: 0;
      display: inline-block;
      width: 82px;
      height: 97px;
      background-image: url('~@/assets/image/comm/operateTip/smile.png');
      background-repeat: no-repeat;
      background-size: 82px 97px;
    }
    .tipText {
      display: inline-block;
      // font-family: Alibaba PuHuiTi;
      font-size: 20px;
      color: #ffffff;
    }
    .tipText_1 {
      position: absolute;
      top: 0;
      left: 88px;
    }
    .tipText_2 {
      position: absolute;
      top: 36px;
      left: 88px;
    }
    .messageImg {
      position: absolute;
      top: -36px;
      left: 394px;
      display: inline-block;
      width: 482px;
      height: 210px;
      background-image: url('~@/assets/image/comm/operateTip/message.png');
      background-repeat: no-repeat;
      background-size: 482px 210px;
    }
    .knowImg {
      position: absolute;
      top: 90px;
      left: 82px;
      display: inline-block;
      width: 165px;
      height: 69px;
      cursor: pointer;
      background-image: url('~@/assets/image/comm/direct/know.png');
      background-repeat: no-repeat;
      background-size: 165px 69px;
    }
  }
}

@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .step2 .step_3 .tipBox .middlePart {
    width: 445px;
    min-width: 445px;
  }
}

@media screen and (max-width: 1280px) {
  .step1 .rightPart .motation {
    margin-right: 65px;
  }
}

@media screen and (max-width: 1680px) {
  .step6 .tipBox .innerBox {
    margin-right: 76px;
  }
}

@media screen and (max-width: 1366px) {
  .step6 .tipBox .innerBox {
    margin-right: 70px;
  }
}

@media screen and (max-width: 1280px) {
  .step6 .tipBox .innerBox {
    margin-right: 73px;
  }
}
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .step2 .step_1 .tipBox .leftPart {
    width: calc(100% - 930px);
    min-width: 803px;
  }
}
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .step2 .step_2 .tipBox .leftPart {
    width: calc(100% - 930px);
    min-width: 803px;
  }
}
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .step2 .step_2 .tipBox .leftPart .bottom {
    bottom: 0;
    height: 230px;
  }
}
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .step2 .step_2 .tipBox .middlePart .tipText_2 {
    width: 190px;
  }
}
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .step2 .step_3 .tipBox .leftPart {
    width: calc(100% - 930px);
    min-width: 803px;
    margin-left: 65px;
  }
}
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .step2 .step_4 .tipBox .leftPart {
    width: calc(100% - 900px);
    min-width: 827px;
  }
}
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .step2 .step_5 .tipBox {
    top: 50px;
    min-width: 1700px;
  }
}
</style>
