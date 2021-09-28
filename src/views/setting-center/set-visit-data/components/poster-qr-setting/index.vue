<!--
 * @Author       : ADI
 * @Date         : 2021-07-13 11:00:52
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-14 11:26:54
-->
<template>
  <div class="posterQrSetting">
    <div class="modalSet">
      <div class="modalSetBox">
        <div class="wxSetBox">
          <div class="showHeader">
            <div class="wxText">二维码类型</div>
            <global-ts-version :isShowTip="!version" :limitVer="limitVer"></global-ts-version>
          </div>
        </div>
        <div class="radioBox">
          <span v-for="(item, index) in wxSettingList" :key="index">
            <input :disabled="version" v-model="isWxWorkPoster" type="radio" :value="item.key" :id="'wxSet' + index" />
            <label @click="saveTsCardModule(item.key)" :for="'wxSet' + index">{{ item.value }}</label>
            <div class="iconBox" v-if="item.showToast">
              <global-ts-svg-icon class="icon" name="icon-bianzu"></global-ts-svg-icon>
              <div class="hoverImgBox">
                <p class="banner-title">海报案例图</p>
                <img class="hoverImg" :src="hoverImg" alt="" />
                <div class="hoverTip">
                  开启后，分享的海报二维码显示企微二维码可前往企微助手统一设置欢迎语，
                  <span class="gotoSet" @click="gotoSet">去设置</span>
                </div>
              </div>
            </div>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import versionDef from '@/config/version-def';
import posterIMG from '@/assets/image/poster-setting/poster.png';
import { mapState } from 'vuex';
import { confirm, gotoWxCorpSet } from '@/utils';
import { saveTsCardModule, getTsCardModule } from '@/api/modules/views/setting-center/set-visit-data';

export default {
  name: 'poster-qr-setting',
  components: {},
  props: {},
  data() {
    return {
      wxSettingList: [
        {
          key: false,
          value: '名片二维码',
          showToast: false,
        },
        {
          key: true,
          value: '企业微信二维码',
          showToast: true,
        },
      ],
      isWxWorkPoster: false,
    };
  },
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
      userInfo: state => state.user.info,
    }),
    limitVer() {
      return versionDef.getLimitVer('STANDARD', 'PROFESSIONNAL');
    },
    hoverImg() {
      return posterIMG;
    },
    /**
     * 非付费版本
     * 分销：试用版/7天试用版/个人版  直销：免费版
     * @author waldon
     * @date 2020/7/10
     * @returns {*}
     */
    version() {
      if (this.isOem) {
        const versionList = versionDef.NotDirectVersionDef.VersionList;
        return versionDef.checkIsFree() || this.userInfo.versionInfo.version == versionList.PERSON;

        // || tanShuApp.userInfo.versionInfo.version == versionList.FREETRY
      }
      return versionDef.checkIsFree();
    },
  },
  watch: {},
  created() {
    this.getTsCardModule();
  },
  mounted() {},
  methods: {
    /**
     * 跳转到设置页面
     * @author waldon
     * @date 2020/7/10
     */
    gotoSet() {
      this.$router.push({
        path: '/wxWelcomeTip',
      });
    },
    /**
     * 保存海报模板设置
     * @author JHao
     * @date 2020-12-23
     * @param {*} value - Boolean
     */
    async saveTsCardModule(value) {
      if (this.isWxWorkPoster === value) {
        return;
      }
      const params = {
        profConf: JSON.stringify({
          isWxWorkPoster: value,
        }),
      };
      const [err, res] = await saveTsCardModule(params);
      if (err) {
        if (err.rt === -9) {
          confirm(err.msg, '提示', '去设置')
            .then(() => {
              gotoWxCorpSet();
            })
            .catch(() => {
              this.isWxWorkPoster = false;
            });
        } else {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
          this.isWxWorkPoster = false;
        }

        return Promise.reject(err);
      }
      this.$utils.postMessage({
        type: 'success',
        message: res.msg || '修改成功',
      });
    },
    async getTsCardModule() {
      const [err, res] = await getTsCardModule();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.isWxWorkPoster = res.data.tsProfInfo.isWxWorkPoster;
    },
  },
};
</script>

<style lang="scss" scoped>
.posterQrSetting {
  width: 100%;
  padding: 12px 22px;
  background: $color-ff;
  box-sizing: border-box;
  .modalSetBox {
    .radioBox {
      .iconBox {
        position: relative;
        display: inline-block;
      }
    }
  }
  .modalSet {
    .modalSetBox {
      .wxSetBox {
        .iconBox {
          .icon {
            width: 16px;
            height: 16px;
            margin-right: 8px;
            color: #247af3;
            color: #247af3;
          }
        }
        .versionControl {
          margin-left: 8px !important;
        }
      }
      .radioBox {
        margin-top: 20px;
        .iconBox {
          .hoverImgBox {
            position: absolute;
            top: 28px;
            left: -135px;
            z-index: 8;
            width: 270px;
            height: 0;
            padding: 0 20px 20px 20px;
            overflow: hidden;
            background: #ffffff;
            border-radius: 8px;
            visibility: hidden;
            box-shadow: 0 8px 24px 0 #07012612;
            box-sizing: border-box;
            transition: all 0.3s;
            .banner-title {
              padding: 12px 0;
              font-size: 14px;
              line-height: 14px;
              color: $color-53;
              text-align: center;
            }
            .hoverImg {
              display: block;
              width: 225px;
              height: 400px;
              margin: 0 auto;
            }
            .hoverTip {
              font-size: 12px;
              line-height: 18px;
              color: #67707e;
            }
          }
          &:hover {
            .hoverImgBox {
              height: 503px;
              visibility: visible;
            }
          }
        }
        .setTip {
          font-size: 14px;
          color: $color-53;
        }
      }
    }
  }
  .hoverImgBox {
    .hoverTip {
      .gotoSet {
        color: #247af3;
        cursor: pointer;
      }
    }
  }
  .cardManager {
    .modalSet {
      .modalSetBox {
        .radioBox {
          .iconBox {
            .hoverImgBox {
              .hoverTip {
                .gotoSet {
                  color: #247af3;
                }
              }
            }
          }
        }
      }
    }
  }
  .cardManagerEdit {
    .modalSet {
      .infoPart {
        display: flex;
        padding-left: 20px;
        margin-top: 20px;
        box-sizing: border-box;
        flex-flow: row nowrap;
        align-items: center;
        .desTip {
          font-size: 14px;
          color: #b2b2b2;
        }
        &:first-child {
          margin-top: 30px;
        }
        .inputBox {
          position: relative;
          width: 444px;
          margin-left: 105px;

          /* margin-right: 12px; */
          .fontNum {
            position: absolute;
            top: 50%;
            right: 12px;
            font-size: 14px;
            color: #b2b2b2;
            transform: translateY(-50%);
          }
          .isOpenSetting {
            margin-left: 111px;
          }
        }
        .operateBox {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
        }
      }
    }
  }
  .tanshu-slide-card {
    .slide-children {
      margin-right: 40px;
    }
  }
  .showHeader {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    .wxText {
      font-size: 14px;
      line-height: 14px;
      color: #535353;
    }
  }
  .radioBox {
    .icon {
      width: 14px;
      height: 14px;
      overflow: hidden;
      font-size: 16px;
      color: #247af3;
    }
    .hoverImgBox {
      .hoverTip {
        max-width: 23em;
        margin: 9px auto 0 auto;
        font-size: 12px;
        line-height: 18px;
        color: #67707e;
        text-align: center;
        .gotoSet {
          color: #247af3;
          cursor: pointer;
        }
      }
    }
    .iconBox {
      &:hover {
        .hoverImgBox {
          height: 485px;
          padding: 20px 0;
          visibility: visible;
        }
      }
    }
    span {
      &:last-child {
        input[type='radio'] {
          & + label {
            margin-right: 8px;
          }
        }
      }
    }
  }
}
.posterQrSetting .cardManagerEdit .modalSet .infoPart .operateBox .sure,
.cardManager .cardManagerEdit .modalSet .infoPart .operateBox .settingContent span input[type='radio'] + label {
  margin-right: 12px;
}
</style>
