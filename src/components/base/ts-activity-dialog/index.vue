<!--
 * @Author       : ADI
 * @Date         : 2021-03-30 15:38:45
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-28 16:40:20
-->
<template>
  <global-ts-dialog
    wrap-class-name="activityDialog"
    dialog-title="名片设置"
    :dialog-visible.sync="activityDialogVisible"
    @cancel="handleCancel"
    @sure="handleOk"
    z-index="2010"
  >
    <div class="dialogContent">
      <p class="previewTip">效果预览</p>
      <div class="saleCard">
        <div class="mainInfoBox">
          <div class="imgBox">
            <img class="cardImg" :src="simpleCardInfoCur.headImgUrl" alt="" />
          </div>
          <div class="personInfo">
            <div class="name overflow">{{ simpleCardInfoCur.name }}</div>
            <div class="company overflow">{{ simpleCardInfoCur.company }}</div>
            <div class="position overflow">{{ simpleCardInfoCur.position }}</div>
          </div>
        </div>
        <div class="splitLine"></div>
        <div class="connectBox">
          <div class="baseConnect">
            <div class="connect top">
              <img class="connectIcon" :src="setPhoneIcon" alt="" />
              <div class="connectText">{{ simpleCardInfoCur.mobile }}</div>
              <div class="connectBtn">拨打</div>
            </div>
            <div class="connect">
              <img class="connectIcon" :src="setWxIcon" alt="" />
              <div class="connectText">{{ simpleCardInfoCur.wx }}</div>
              <div class="connectBtn">复制</div>
            </div>
          </div>
          <div class="openCardBox">
            <div class="seeCardBtnWrapper">
              <span>查看完整名片</span>
              <fa-icon type="right" />
            </div>
          </div>
        </div>
      </div>
      <div class="setBox">
        <div class="inputGroup">
          <div class="labelBox">
            <span class="redDot">*</span>
            <span>姓名</span>
          </div>
          <global-ts-input maxlength="32" size="default" class="setInput" v-model="simpleCardInfoCur.name">
          </global-ts-input>
        </div>
        <div class="inputGroup">
          <div class="labelBox">
            <span class="redDot">*</span>
            <span>职位</span>
          </div>
          <global-ts-input maxlength="10" size="default" class="setInput" v-model="simpleCardInfoCur.position">
          </global-ts-input>
        </div>
        <div class="inputGroup">
          <div class="labelBox">
            <span class="redDot">*</span>
            <span>手机号</span>
          </div>
          <global-ts-input maxlength="20" size="default" class="setInput" v-model="simpleCardInfoCur.mobile">
          </global-ts-input>
        </div>
        <div class="inputGroup">
          <div class="labelBox">
            <span class="redDot">*</span>
            <span>微信号</span>
          </div>
          <global-ts-input maxlength="20" size="default" class="setInput" v-model="simpleCardInfoCur.wx">
          </global-ts-input>
        </div>
        <div class="inputGroup">
          <div class="labelBox">
            <span>公司</span>
          </div>
          <global-ts-input maxlength="25" size="default" class="setInput" v-model="simpleCardInfoCur.company">
          </global-ts-input>
        </div>
        <div class="inputGroup qrGroup" v-if="activityDialogVisible">
          <div class="labelBox">
            <span>微信/企业微信二维码</span>
            <div class="rightSet">
              <fa-switch
                v-model="simpleCardInfoCur.showWxQr"
                defaultChecked
                @change="changeQrVisible($event, 'wxQr')"
              />
            </div>
          </div>
          <div class="wxWorkTip" v-if="isShowWorkTipCal">绑定企业微信后自动生成</div>
          <div class="fakerBox" v-else-if="simpleCardInfoCur.showWxQr">
            <global-ts-fai-img-upload-style-box
              :fileList="qrImgList"
              :disabled="simpleCardInfoCur.isOpenWxWorkCard"
              @upload-click="
                () => {
                  tanshuFileSelectUploadVisible = true;
                }
              "
              @remove="handleQrImgRemove"
            >
            </global-ts-fai-img-upload-style-box>

            <global-ts-file-select-upload-dialog
              :dialog-visible.sync="tanshuFileSelectUploadVisible"
              :limit-num="1"
              accept-type="img"
              @success="uploadqrImgcomplete"
            >
            </global-ts-file-select-upload-dialog>
          </div>
        </div>
        <div class="inputGroup">
          <div class="labelBox">
            <span>显示“查看完整名片”按钮</span>
            <div class="rightSet">
              <fa-switch
                v-model="simpleCardInfoCur.showCard"
                defaultChecked
                @change="changeQrVisible($event, 'card')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </global-ts-dialog>
</template>

<script>
import TsCommDef from '@/config/ts-comm-def';
import { postMessage } from '@/utils';
import { changeSimpleCardInfo } from '@/api/modules/views/header';
import { mapState } from 'vuex';
import { Icon, Switch } from '@fk/faicomponent';
import setPhoneIMG from '@/assets/image/directSale/hd_microFlyer/setPhone.png';
import setWxIMG from '@/assets/image/directSale/hd_microFlyer/setWx.png';

export default {
  name: 'ts-activity-dialog',
  components: {
    [Icon.name]: Icon,
    [Switch.name]: Switch,
  },
  props: {
    simpleCardInfo: {
      type: Object,
      default: () => {
        return {
          headImgUrl: '', // 头像
          name: '', // 姓名
          position: '', // 职位
          mobile: '', // 手机
          wx: '', // 微信号
          company: '', // 公司
          wxQrUrl: '', // 个人二维码
          showCardTopBar: false, // 是否展示名片
          showCard: false, // 是否展示名片小程序二维码
          showWxQr: false, // 是否展示个人二维码
          wxWorkQrUrl: '', // 企微二维码
          isOpenWxWorkCard: false, // 是否开启企微
        };
      },
    },
    activityDialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      simpleCardInfoCur: {},
      folderType: TsCommDef.FolderType.PERSON_SYS_CARD, // 上传系统资源文件夹
      tanshuFileSelectUploadVisible: false, // 企微/微信二维码图片选择
      qrImgList: [], // 企微/微信二维码图片预览
    };
  },
  watch: {
    activityDialogVisible(newVal) {
      if (newVal) {
        this.simpleCardInfoCur = { ...this.simpleCardInfo };
        this.qrImgList = [
          {
            uid: -1,
            name: '微信/企微二维码图',
            url: this.simpleCardInfoCur.isOpenWxWorkCard
              ? this.simpleCardInfoCur.wxWorkQrUrl
              : this.simpleCardInfoCur.wxQrUrl,
          },
        ];
      }
    },
  },
  computed: {
    ...mapState({
      globalData: state => state.globalData,
    }),
    /**
     * 是否显示图片上传
     * @author waldon
     * @date 2020-05-20
     * @returns {Boolean} - 是否显示图片上传
     */
    isShowQrUploadCal() {
      return (
        (!this.simpleCardInfoCur.isOpenWxWorkCard && this.simpleCardInfoCur.showWxQr) ||
        (this.simpleCardInfoCur.isOpenWxWorkCard && this.simpleCardInfoCur.wxWorkQrUrl)
      );
    },
    /**
     * 企微限制提示
     * @author waldon
     * @date 2020-05-20
     * @returns {Boolean} - 是否显示
     */
    isShowWorkTipCal() {
      return (
        this.simpleCardInfoCur.showWxQr &&
        this.simpleCardInfoCur.isOpenWxWorkCard &&
        !this.simpleCardInfoCur.wxWorkQrUrl
      );
    },
    setPhoneIcon() {
      return setPhoneIMG;
    },
    setWxIcon() {
      return setWxIMG;
    },
  },
  methods: {
    /**
     * 改变二维码显示状态
     * @author waldon
     * @date 2020-05-20
     * @param {Boolean} state - 显示状态
     * @param {Boolean} type - 类型
     */
    changeQrVisible(state, type) {
      switch (state) {
        case 'wxQr':
          this.simpleCardInfoCur.showWxQr = state;
          break;
        case 'card':
          this.simpleCardInfoCur.showCard = state;
      }
    },
    /**
     * 确定的回调
     * @author waldon
     * @date 2020-05-20
     */
    async handleOk() {
      // 校验
      if (
        this.simpleCardInfoCur.showWxQr &&
        !this.simpleCardInfoCur.isOpenWxWorkCard &&
        !this.simpleCardInfoCur.wxQrUrl
      ) {
        postMessage({
          type: 'error',
          message: '请上传微信二维码',
        });
        return;
      }
      const [err, res] = await changeSimpleCardInfo(this.simpleCardInfoCur);
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return err;
      }
      postMessage({
        type: 'success',
        message: res.msg || '修改成功',
      });
      this.$emit('update:activityDialogVisible', false);
      this.$emit('update:simpleCardInfo', this.simpleCardInfoCur);
    },
    /**
     * 取消的回调
     * @author waldon
     * @date 2020-05-20
     */
    handleCancel() {
      this.$emit('update:activityDialogVisible', false);
    },
    /**
     * 上传微信/企微二维码成功
     * @author: ADI
     * @Date: 2021-03-09 16:28:26
     * @param {*} res
     * @return {*}
     */
    uploadqrImgcomplete(res) {
      const file = res[0];
      if (this.simpleCardInfoCur.isOpenWxWorkCard) {
        this.simpleCardInfoCur.wxWorkQrUrl = file.content;
      } else {
        this.simpleCardInfoCur.wxQrUrl = file.content;
      }
      this.qrImgList = [
        {
          uid: -1,
          name: '微信/企微二维码图',
          url: file.content,
        },
      ];
    },
    /**
     * 图片删除回调
     * @author: ADI
     * @Date: 2021-03-09 16:28:57
     * @param {*}
     * @return {*}
     */
    handleQrImgRemove() {
      this.qrImgList = [];
      this.simpleCardInfoCur.isOpenWxWorkCard
        ? (this.simpleCardInfoCur.wxWorkQrUrl = '')
        : (this.simpleCardInfoCur.wxQrUrl = '');
    },
  },
};
</script>

<style lang="scss" scoped>
/* 设置名片组件样式start */
.activityDialog {
  .dialogContent {
    padding: 0;
  }
  .previewTip {
    margin-bottom: 10px;
    font-size: 14px;
    line-height: 1;
    color: $color-53;
    text-align: center;
  }
  .saleCard {
    width: 300px;

    /* height: 143px; */
    padding: 11px 17px 9px 17px;
    margin: 0 auto;
    border: 1px solid #dadada;
    border-radius: 4px;
    box-sizing: border-box;
    .mainInfoBox {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      .imgBox {
        width: 56px;
        height: 56px;
        margin-right: 10px;
        border-radius: 4px;
        flex: 0 0 auto;
        .cardImg {
          width: 100%;
          height: 100%;
          border-radius: 4px;
        }
      }
      .personInfo {
        .overflow {
          max-width: 195px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .name {
          height: 19px;
          font-size: 14px;
          line-height: 19px;
          color: #010101;
        }
      }
    }
    .splitLine {
      width: 100%;
      height: 1px;
      margin: 12px 0;
      background: #efefef;
    }
    .connectBox {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: space-between;
      .baseConnect {
        .connect {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          &.top {
            margin-bottom: 10px;
          }
          .connectIcon {
            width: 16px;
            height: 16px;
            margin-right: 4px;
            flex: 0 0 auto;
          }
          .connectText {
            width: 78px;
            margin-right: 5px;
            overflow: hidden;
            font-size: 12px;
            line-height: 14px;
            color: #434343;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .connectBtn {
            width: 34px;
            height: 16px;
            font-size: 12px;
            line-height: 16px;
            color: $primary-color;
            text-align: center;
            border: 1px solid $primary-color;
            border-radius: 9px;
          }
        }
      }
      .openCardBox {
        .seeCardBtnWrapper {
          display: flex;
          width: 97px;
          height: 32px;
          font-size: 12px;
          line-height: 32px;
          color: #ffffff;
          text-align: center;
          background-color: $primary-color;
          border-radius: 4px;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
  .setBox {
    display: flex;
    margin-top: 20px;
    font-size: 14px;
    color: $color-53;
    flex-flow: row wrap;
    justify-content: space-between;
    .inputGroup {
      width: 270px;
      margin-bottom: 20px;
      flex: 0 0 auto;
      &.qrGroup {
        margin-bottom: 0;
        .wxWorkTip {
          height: 40px;
          font-size: 14px;
          line-height: 40px;
          color: $color-b2;
        }
        .fakerBox {
          position: relative;
          height: 0;
        }
      }
      &.left {
        margin-right: 20px;
      }
      .labelBox {
        position: relative;
        margin-bottom: 10px;
        .redDot {
          color: $error-color;
        }
        .rightSet {
          position: absolute;
          top: -2px;
          right: 0;
        }
      }
    }
  }
}
.activityDialog .saleCard .mainInfoBox .personInfo .company,
.activityDialog .saleCard .mainInfoBox .personInfo .position {
  height: 19px;
  font-size: 12px;
  line-height: 19px;
  color: #909090;
}
.directSale {
  .activityDialog {
    .saleCard {
      .connectBox {
        .baseConnect {
          .connect {
            .connectBtn {
              color: $primary-color;
              border: 1px solid $primary-color;
            }
          }
        }
        .openCardBox {
          .seeCardBtnWrapper {
            background-color: $primary-color;
          }
        }
      }
    }
  }
}

/* 设置名片组件样式end */
</style>

<style lang="scss">
.activityDialog .fa-modal-body {
  min-height: 524px;
}
</style>
