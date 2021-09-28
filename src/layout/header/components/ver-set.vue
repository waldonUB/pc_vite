<!--
 * @Author       : ADI
 * @Date         : 2021-05-17 10:12:38
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-17 11:13:42
-->
<template>
  <div class="userVerSet">
    <div class="unionIconBox">
      <global-ts-svg-icon class="verIcon" :name="versionData.topClass" />
    </div>
    <div class="versionSetBox versionBox" :class="{ versionSetBoxWithTip: versionTip }">
      <div class="acountBox">
        <div class="accoutSetBox">
          <div class="upgradeBox">
            <div class="version-line flexBox">
              <div class="version-name">{{ versionData.versionName }}</div>
              <div class="version-tip" @click="toURL('versionDetailsUrl')" v-if="!isOem">
                更多版本详情
                <global-ts-svg-icon class="icon moreIcon" name="icon-riqixuanze-xiayiyue" />
              </div>
            </div>
            <div class="version-time">
              到期时间：<span class="expireTime" :class="{ redExpireTime: versionTip }">{{
                versionData.expireTimeName
              }}</span>
            </div>
            <div class="versionTip" v-if="versionTip">
              <global-ts-svg-icon class="warnIcon" name="icon-icon-1" />
              {{ versionTip }}
            </div>
          </div>
          <div class="version-btn" @click="toUpGrade">
            {{ versionData.updateTips }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import versionDef from '@/config/version-def';
import { mapState } from 'vuex';
import { toURL } from '../utils/index.js';
import { logDog } from '@/utils';

export default {
  name: 'ver-set',
  components: {},
  props: {},
  data() {
    return {
      versionData: versionDef.getVersionInfo(),
    };
  },
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
      userInfo: state => state.user.info,
      addressUrl: state => state.globalData.addressUrl,
    }),
    versionTip() {
      if (versionDef.getIsFreeTry()) {
        return '到期后付费功能将自动关闭';
      } else if (versionDef.getIsProfessionnal() && this.userInfo.versionInfo.verRestDayTime < 30) {
        return '为确保正常使用，请及时续费';
      } else {
        return '';
      }
    },
    toURL() {
      return toURL;
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    toUpGrade: function() {
      if (versionDef.checkIsFree()) {
        logDog('home_clickFreeCard');
        logDog('toUpGrade_up');
      } else {
        logDog('toUpGrade_continue');
      }
      window.open(this.addressUrl.updateVersionUrl);
    },
  },
};
</script>

<style lang="scss" scoped>
.userVerSet {
  position: relative;
  display: inline-block;
  height: 24px;

  /* extra hover area */
  &::before {
    position: absolute;
    top: 100%;
    right: 0;
    width: 70px;
    height: 14px;
    content: '';
  }
  .versionSetBox {
    position: absolute;
    right: -15px;
    z-index: $zindex-base;
    width: 239px;
    height: 0;
    padding: 0 8px;
    margin-top: 6px;
    overflow: hidden;
    transition: all 0.3s;
    .acountBox {
      float: left;
      width: 292px;
      height: 149px;
      padding: 5px 16px;
      padding: 0;
      margin-top: 12px;
      overflow: hidden;
      font-size: 14px;
      font-weight: 400;
      color: #535353;
      background: #ffffff;
      background: $color-ff;
      border-radius: 4px;
      border-radius: 4px;
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
      box-sizing: border-box;
      .accountSetBox {
        position: relative;
        .topPart {
          display: flex;
          height: 26px;
          padding: 20px 0;
          border-bottom: 1px solid #eeeeee;
          align-items: center;
          .versionMedal {
            background: url('~@/assets/image/comm/versionSprite.png') 126px 384px no-repeat;
            background-position: 0 -228px;
          }
          .versionMedalVip {
            background: url('~@/assets/image/comm/versionSprite.png') 126px 384px no-repeat;
            background-position: 0 -280px;
          }
          .versionMedalPerson {
            background: url('~@/assets/image/comm/versionSprite.png') 126px 384px no-repeat;
            background-position: 0 -254px;
          }
          .versionMedalOnly {
            background: url('~@/assets/image/comm/versionSprite.png') 126px 384px no-repeat;
            background-position: 0 -358px;
          }
          .versionMedalHonor {
            background: url('~@/assets/image/comm/versionSprite.png') 126px 384px no-repeat;
            background-position: 0 -306px;
          }
          & > div {
            display: flex;
            align-items: center;
          }
          .unionMedal {
            display: inline-block;
            width: 34px;
            height: 26px;
          }
          span {
            margin-left: 10px;
            font-size: 16px;
            line-height: 23px;
            color: $color-53;
          }
          .rightBtn {
            float: right;
            width: 66px;
            height: 26px;
            margin-left: 20px;
            font-size: 14px;
            line-height: 24px;
            color: #247af3;
            cursor: pointer;
            background: rgba(255, 255, 255, 0);
            border: 1px solid #247af3;
            border-radius: 13px;
            outline: none;
            &:hover {
              color: #ffffff;
              background: #247af3;
            }
          }
          .tooltip {
            position: absolute;
            top: 20px;
            right: 0;
            display: inline-block;
            &:hover {
              .tooltipBox {
                display: block;
              }
            }
          }
          .tooltipBox {
            position: absolute;
            top: 26px;
            left: 3px;
            display: none;
            width: 89px;
            height: 40px;
            .tooltipArrow {
              position: absolute;
              top: -4px;
              right: 20px;
              display: inline-block;
              width: 0;
              height: 0;
              border-top: 6px solid transparent;
              border-right: 6px solid transparent;
              border-bottom: 6px solid #303133;
              border-left: 6px solid transparent;
            }
            .tooltiptext {
              position: absolute;

              /* 定位 */
              position: absolute;
              top: 8px;
              left: 1px;
              z-index: $zindex-base;
              width: 86px;
              height: 22px;
              padding: 5px 0;
              font-size: 12px !important;
              line-height: 22px !important;
              color: #ffffff !important;
              text-align: center;
              background-color: #303133;
              border-radius: 4px;
            }
          }
          .dirVersionMedalFree {
            display: inline-block;
            width: 26px;
            height: 20px;
            background: url('~@/assets/image/comm/versionSprite.png') 126px 384px no-repeat;
            background-position: 2px -384px;
          }
          .dirVersionMedalMajor {
            display: inline-block;
            width: 26px;
            height: 20px;
            background: url('~@/assets/image/comm/versionSprite.png') 126px 384px no-repeat;
            background-position: 2px -436px;
          }
        }
        .downPart {
          .time {
            font-size: 14px;
            line-height: 32px;
            color: rgba(137, 137, 137, 1);
          }
          .details {
            cursor: pointer;
          }
        }
      }
    }
    &.versionBox {
      width: 306px;
      box-sizing: border-box;
      .upgradeBox {
        width: 292px;
        height: 77px;
        padding: 16px 28px 10px;

        /* background: url(../image/comm/versionBox/bg.png); */
        background: url('~@/assets/image/comm/versionBox/bg.png') no-repeat;
        box-sizing: border-box;
      }
    }
    .upgradeBox {
      .version-line {
        justify-content: space-between;
        .version-name {
          height: 21px;
          font-size: 16px;
          font-weight: bold;
          line-height: 16px;
          color: #333333;
        }
        .version-tip {
          height: 16px;
          font-size: 12px;
          font-weight: 400;
          line-height: 16px;
          color: #999999;
          cursor: pointer;
          &:hover {
            color: #dea967;
            .moreIcon {
              color: #dea967;
            }
          }
          .moreIcon {
            position: relative;
            top: -1px;
            margin: 0 0 0 4px;
            font-size: 6px;
            color: #999999;
            vertical-align: middle;
          }
        }
      }
      .version-time {
        height: 16px;
        margin-top: 8px;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        color: #c5c5c5;
        .expireTime {
          height: 16px;
          margin-top: 8px;
          font-size: 12px;
          font-weight: 400;
          line-height: 16px;
          color: #c5c5c5;
        }
        .redExpireTime {
          color: $error-color;
        }
      }
    }
    .versionTip {
      margin-top: 8px;
      font-size: 12px;
      color: #c5c5c5;
      .warnIcon {
        width: 14px;
        height: 14px;
        overflow: hidden;
        color: #ffbf00;
        vertical-align: -0.15em;
        flex: 0 0 auto;
        fill: #ffbf00;
      }
    }
    .version-btn {
      width: 236px;
      height: 32px;
      margin: 20px auto;
      line-height: 32px;
      color: #4a300e;
      text-align: center;
      cursor: pointer;
      background: linear-gradient(90deg, #eecd9a 0%, #e8b677 100%);
      border-radius: 2px;
      &:hover {
        background: linear-gradient(90deg, #f1d3a5 0%, #ebbf88 100%);
      }
    }
  }
  .verIcon {
    width: 70px;
    height: 24px;
  }
  .unionIcon {
    width: 70px;
    height: 24px;
    text-align: center;
    cursor: pointer;
    background-position: 0 0;
    &.top_direct_0 {
      background-position: -127px 0;
    }
    &.top_direct_101 {
      background-position: -127px -112.5px;
    }
    &.top_direct_102 {
      background-position: -127px 0;
    }
    &.top_direct_103 {
      background-position: -127px -76px;
    }
    &.top_notdirect_0 {
      background-position: 0 0;
    }
    &.top_notdirect_1 {
      background-position: 0 -114px;
    }
    &.top_notdirect_2 {
      background-position: 0 -190px;
    }
    &.top_notdirect_3 {
      background-position: 0 -38px;
    }
    &.top_notdirect_4 {
      background-position: 0 -152px;
    }
    &.top_notdirect_5 {
      background-position: 0 0;
    }
    &.top_notdirect_6 {
      background-position: 0 -76px;
    }
  }
  .versionIcon {
    background: url('~@/assets/image/comm/versionSprite.png') 126px 384px no-repeat;
    background-position: 0 0;
  }
  .versionIconVip {
    background: url('~@/assets/image/comm/versionSprite.png') 126px 384px no-repeat;
    background-position: 0 -76px;
  }
  .versionIconPerson {
    background: url('~@/assets/image/comm/versionSprite.png') 126px 384px no-repeat;
    background-position: 0 -38px;
  }
  .versionIconOnly {
    background: url('~@/assets/image/comm/versionSprite.png') 126px 384px no-repeat;
    background-position: 0 -190px;
    span {
      color: #ffffff !important;
    }
  }
  .versionIconHonor {
    background: url('~@/assets/image/comm/versionSprite.png') 126px 384px no-repeat;
    background-position: 0 -114px;
  }
  div {
    &:nth-of-type(1) {
      span {
        font-size: 14px;
        line-height: 38px;
        color: rgba(83, 83, 83, 1);
      }
    }
  }
  .versionSetBoxWithTip {
    &.versionBox {
      .upgradeBox {
        height: 95px;
      }
    }
    .acountBox {
      height: 167px;
    }
  }
  &:hover {
    .versionSetBox {
      height: 167px;
    }
    .versionSetBoxWithTip {
      height: 187px;
    }
  }
  .dirVersionIconFree {
    width: 100px;
    height: 32px;
    text-align: center;
    cursor: pointer;
    background: url('~@/assets/image/comm/versionSprite.png') 126px 384px no-repeat;
    background-position: 2px -404px;
  }
  .dirVersionIconMajor {
    width: 100px;
    height: 32px;
    text-align: center;
    cursor: pointer;
    background: url('~@/assets/image/comm/versionSprite.png') 126px 384px no-repeat;
    background-position: 2px -456px;
  }
}
</style>
