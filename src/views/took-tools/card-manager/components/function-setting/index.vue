<!--
 * @Author       : ADI
 * @Date         : 2021-06-03 14:16:25
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-08 10:16:38
-->
<template>
  <div class="functionSetting">
    <div class="modalSet">
      <div class="modalSetBox">
        <div class="wxSetBox">
          <div class="showHeader">
            <div class="iconBox">
              <global-ts-svg-icon class="icon" name="icon-bianzu" />
              <div class="hoverImgBox">
                <img class="hoverImg" :src="hoverImg" alt="" />
                <div class="hoverTip">
                  开通后小程序端的名片文章将显示企微的渠道二维码可前往企微助手统一设置欢迎语，
                  <span class="gotoSet" @click="gotoSet">去设置</span>
                </div>
              </div>
            </div>
            <div class="wxText">
              微信类型
            </div>
            <global-ts-version :isShowTip="!version"></global-ts-version>
          </div>
        </div>
        <div class="radioBox">
          <span v-for="(item, index) in wxSettingList" :key="index">
            <input
              :disabled="version"
              v-model="isOpenWxWorkCard"
              type="radio"
              :value="item.key"
              :id="'wxSet' + index"
            />
            <label @click="changeWxSetting(item, 'isOpenWxWorkCard')" :for="'wxSet' + index">{{ item.value }}</label>
          </span>
        </div>
      </div>
      <div class="modalSetBox" v-if="false">
        <div class="wxSetBox">
          <div class="showHeader">
            <div class="wxText">
              销售员编辑名片模块设置
            </div>
          </div>
        </div>
        <div class="radioBox">
          <span v-for="(item, index) in setCardList" :key="index">
            <input
              :disabled="version"
              v-model="isCloseStaffEdit"
              type="radio"
              :value="item.key"
              :id="'setCard' + index"
            />
            <label @click="changeWxSetting(item, 'isCloseStaffEdit')" :for="'setCard' + index">{{ item.value }}</label>
          </span>
          <span class="setTip">名片信息和个人简介仍允许编辑</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import hoverImg from '@/assets/image/cardManager/hover_card_qr_dir.png';
import { mapState } from 'vuex';
import versionDef from '@/config/version-def';
import { confirm, gotoWxCorpSet } from '@/utils';
import { saveTsCardModule, getTsCardModule } from '@/api/modules/views/customer-tools/card-manager';

export default {
  name: 'function-setting',
  components: {},
  props: {},
  data() {
    return {
      wxSettingList: [
        {
          key: false,
          value: '个人微信',
        },
        {
          key: true,
          value: '企业微信',
        },
      ],
      setCardList: [
        {
          key: true,
          value: '允许修改',
        },
        {
          key: false,
          value: '不允许修改',
        },
      ],
      isOpenWxWorkCard: false,
      isCloseStaffEdit: true, // 销售员是否可以编辑名片模块
    };
  },
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
      userInfo: state => state.user.info,
    }),
    hoverImg() {
      return hoverImg;
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
        return (
          versionDef.checkIsFree() ||
          this.userInfo.versionInfo.version == versionList.PERSON ||
          this.userInfo.versionInfo.version == versionList.FREETRY
        );
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
     * 改变选项
     * @author waldon
     * @date 2020/9/24
     * @param {Object} rowData - 行数据
     */
    changeWxSetting(rowData, type) {
      this.saveTsCardModule(rowData.key, type);
    },
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
     * 保存模块设置
     * @author waldon
     * @date 2020-06-01
     */
    async saveTsCardModule(value, type) {
      console.log('value---->', value);
      console.log('isOpenWxWorkCard', this.isOpenWxWorkCard);
      const params = {
        profConf: JSON.stringify({
          [type]: value,
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
              if (type === 'isOpenWxWorkCard') {
                this.isOpenWxWorkCard = false;
              }

              if (type === 'isCloseStaffEdit') {
                this.isCloseStaffEdit = true;
              }
            });
        } else {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
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
      this.isOpenWxWorkCard = res.data.tsProfInfo.isOpenWxWorkCard;
      this.isCloseStaffEdit = res.data.tsProfInfo.isCloseStaffEdit;
    },
  },
};
</script>

<style lang="scss" scoped>
.functionSetting {
  padding: 0 20px 20px;
  .modalSet {
    .modalSetBox {
      .wxSetBox {
        .wxText {
          font-size: 14px;
          line-height: 14px;
          color: rgba(83, 83, 83, 1);
        }
        .iconBox {
          .icon {
            width: 16px;
            height: 16px;
            margin-right: 8px;
            color: #247af3;
          }
          .hoverImgBox {
            position: absolute;
            top: 150px;
            left: 16px;
            z-index: 8;
            width: 300px;
            height: 0;
            overflow: hidden;
            background: rgba(255, 255, 255, 1);
            border-radius: 8px;
            visibility: hidden;
            box-shadow: 0 8px 24px 0 rgba(7, 1, 38, 0.07);
            box-sizing: border-box;
            transition: all 0.3s;
            .hoverImg {
              display: block;
              width: 225px;
              height: 400px;
              margin: 0 auto;
            }
            .hoverTip {
              max-width: 23em;
              margin: 9px auto 0 auto;
              font-size: 12px;
              line-height: 18px;
              color: rgba(103, 112, 126, 1);
              text-align: center;
            }
          }
          &:hover {
            .hoverImgBox {
              height: 485px;
              padding: 20px 0;
              visibility: visible;
            }
          }
        }
        .versionControl {
          margin-left: 8px !important;
        }
      }
      .radioBox {
        margin: 20px 0 0 42px;
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
          color: rgba(178, 178, 178, 1);
        }
        &:first-child {
          margin-top: 30px;
        }
        .inputBox {
          position: relative;
          width: 444px;
          margin-right: 12px;
          .fontNum {
            position: absolute;
            top: 50%;
            right: 12px;
            font-size: 14px;
            color: rgba(178, 178, 178, 1);
            transform: translateY(-50%);
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
    margin: 20px 0 0 20px;
    align-items: center;
    .icon {
      width: 1.2em;
      height: 1.2em;
      overflow: hidden;
      font-size: 16px;
      color: #247af3;
      vertical-align: -0.15em;
    }
    .wxText {
      font-size: 14px;
      line-height: 14px;
      color: rgba(83, 83, 83, 1);
    }
    .hoverImgBox {
      position: absolute;
      top: 150px;
      left: 16px;
      z-index: 8;
      width: 300px;
      height: 0;
      overflow: hidden;
      background: rgba(255, 255, 255, 1);
      border-radius: 8px;
      visibility: hidden;
      box-shadow: 0 8px 24px 0 rgba(7, 1, 38, 0.07);
      box-sizing: border-box;
      transition: all 0.3s;
      .hoverImg {
        display: block;
        width: 225px;
        height: 400px;
        margin: 0 auto;
      }
      .hoverTip {
        max-width: 23em;
        margin: 9px auto 0 auto;
        font-size: 12px;
        line-height: 18px;
        color: rgba(103, 112, 126, 1);
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
  }
  .radioBox {
    margin: 20px 0 0 42px;
  }
}
.functionSetting .cardManagerEdit .modalSet .infoPart .operateBox .sure,
.editCardSetting
  .cardManager
  .cardManagerEdit
  .modalSet
  .infoPart
  .operateBox
  .settingContent
  span
  input[type='radio']
  + label {
  margin-right: 12px;
}
</style>
