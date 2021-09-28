<!-- 获客文章设置-cardModuleDialog
 * @Author       : ADI
 * @Date         : 2021-07-13 11:38:39
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-13 11:38:40
-->
<template>
  <global-ts-dialog
    class="cardModuleDialog"
    dialog-size="small"
    :dialog-visible.sync="isShowCardDialog"
    dialog-title="文章展示模块"
    @sure="saveCardModule"
    @cancel="cancelCardModule"
  >
    <div class="selectGroup">
      <div class="articleSetting flex">
        <div class="title">文章</div>
        <div class="choseItem">
          <div class="choseItemEL">
            <el-checkbox v-model="cardModuleData.showRecommandProduct">商品推荐</el-checkbox>
          </div>
          <div class="choseItemEL">
            <el-checkbox v-model="cardModuleData.showRecommandArticle">热文推荐</el-checkbox>
          </div>
        </div>
      </div>
    </div>
  </global-ts-dialog>
</template>

<script>
import versionDef from '@/config/version-def';
import { mapState } from 'vuex';
import { postMessageByMultiInstance } from '../../config';
import { Checkbox } from 'element-ui';
import { saveTsConf } from '@/api/modules/views/setting-center/set-visit-data';

export default {
  name: 'card-module-dialog',
  components: {
    [Checkbox.name]: Checkbox,
  },
  props: {},
  data() {
    return {
      isShowCardDialog: false,
      cardModuleData: {
        // enson: 这里先注释了, 如果关闭了公众号，然后开启名片展示模块，点击保存，这里的字段会发送给后端，后端以为是开启了公众号
        // isOpenMpPush: true, // 默认开启名片展示设置
        showSalerInfo: false, //销售人员信息
        showRecommandProduct: false, //商品推荐
        showRecommandArticle: false, //热文推荐
      },
      lastCardModuleData: {}, // 记录默认的设置，用于判断是否需要埋点
      version: versionDef.checkIsFree(),
    };
  },
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
      addressUrl: state => state.globalData.addressUrl,
    }),
    iconClass() {
      return this.isOem ? 'highest' : 'majorest';
    },
    updateVersionUrl() {
      return this.addressUrl.updateVersionUrl;
    },
    upTipClass() {
      return this.isOem ? '' : 'directSaleTip';
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    parentControl(showState, cardModuleData) {
      this.isShowCardDialog = showState;
      this.cardModuleData = cardModuleData;
      const { showSalerInfo, showRecommandProduct, showRecommandArticle } = cardModuleData;
      this.lastCardModuleData = { showSalerInfo, showRecommandProduct, showRecommandArticle };
    },
    async saveCardModule() {
      const [err, response] = await saveTsConf({
        profConf: JSON.stringify(this.cardModuleData),
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      postMessageByMultiInstance({
        type: 'success',
        message: response.msg || '修改成功',
      });
      this.logFdp();
      this.cancelCardModule();
    },
    /**
     * 记录设置模板fdp
     * @author lymn
     */
    logFdp() {
      const cardNameData = {
        showSalerInfo: '销售联系信息',
        showRecommandProduct: '商品推荐',
        showRecommandArticle: '热文推荐',
      };
      Object.keys(this.lastCardModuleData).forEach((value, index) => {
        // console.log(this.lastCardModuleData[value], )
        if (this.lastCardModuleData[value] != this.cardModuleData[value]) {
          this.$utils.FdpLog('yx_szzsmk', {
            yx_free_text_1: cardNameData[value],
            yx_free_bool_0: this.cardModuleData[value],
          });
        }
      });
    },
    cancelCardModule() {
      this.isShowCardDialog = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.cardModuleDialog {
  .selectGroup {
    .articleSetting {
      margin-bottom: 12px;
    }
    .choseItem {
      margin-left: 20px;
    }
    .choseItemEL {
      margin-bottom: 12.5px;
      font-size: 0;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .imModule {
      margin-right: 0;
      .IMcontentBox {
        justify-content: center;
        display: inline-flex;
      }
    }
    .darkBox {
      align-items: center;
    }
  }
}
</style>

<style lang="scss">
.cardModuleDialog {
  .selectGroup {
    .imModule {
      .el-checkbox__label {
        position: relative;
      }
      .el-checkbox__label {
        position: relative;
      }
    }
  }
}
</style>
