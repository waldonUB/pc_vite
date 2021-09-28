<!--
 * @Description  : 积分设置
 * @Author       : turbo
 * @Date         : 2021-03-30 15:30:18
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-27 10:05:53
-->

<template>
  <div class="integralSetting">
    <global-ts-card-box class="integralSetBox" :needBottom="false">
      <template v-slot:card-box-head>
        <global-ts-header>
          <template v-slot:leftPart>
            积分设置
          </template>
        </global-ts-header>
      </template>
      <template v-slot:card-box-body>
        <div class="settingBody">
          <cardBox :cardBoxData="cardBoxData" @setting="setting"></cardBox>
        </div>
      </template>
    </global-ts-card-box>
    <global-ts-dialog
      class="setDialog"
      dialog-title="获取积分规则设置"
      :dialog-visible="dialogVisible"
      dialog-size="medium"
      @cancel="cancel"
      @sure="sure"
    >
      <div class="setDialog-content">
        <div class="setList">
          <div class="setItem" v-for="(item, index) in settingArr" :key="index">
            <div class="title">
              {{ item.title }}
              <global-ts-tool-tips class="toolTips" placement="bottom-start">
                <div slot="content">{{ item.tip }}</div>
                <global-ts-svg-icon class="icon tanshu_linkColor" name="icon-bianzu"></global-ts-svg-icon>
              </global-ts-tool-tips>
            </div>
            <div class="settingNumber">
              <div class="numberTitle">每次可获得积分</div>
              <global-ts-input v-model="item.getPoint" :maxLength="4" placeholder="0-9999" limit-type="int">
              </global-ts-input>
            </div>
            <div class="limitBox" v-show="showLimitBox(item)">
              <div class="numberTitle">每日积分上限</div>
              <div class="selectBox">
                <span v-for="(subItem, subIndex) in limitList" :key="subIndex">
                  <input
                    v-model="item.isLimit"
                    type="radio"
                    :id="item.key + subItem.key"
                    :value="subItem.key"
                    @change="setLimit(item, subItem.key)"
                  />
                  <label :for="item.key + subItem.key">{{ subItem.value }}</label>
                </span>
                <div class="limitWrap">
                  <global-ts-input
                    v-show="item.isLimit"
                    v-model="item.limitNum"
                    :maxLength="4"
                    placeholder="1-9999"
                    limit-type="int"
                  >
                  </global-ts-input>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </global-ts-dialog>
  </div>
</template>

<script>
import CardBox from './components/card-box/index.vue';
import integralSetIconIMG from '@/assets/image/comm/integralSetIcon.png';
import { getConfInfo } from '@/utils';
import { setIntegralSettingInfo, getDictionaryInfo } from '@/api/modules/views/corp-manage/integral-setting';

export default {
  name: 'integralSetting',
  components: {
    CardBox,
  },
  props: {},
  data() {
    return {
      cardBoxData: {
        imgIconUrl: integralSetIconIMG,
        title: '获取积分规则',
        desc: '管理员可自定义销售获取推广积分的方式，数量，上限',
      },
      dialogVisible: false, // 是否显示弹窗
      isOpenFlag: false, // 是否开启了推广积分
      settingArr: [
        {
          key: 'staffSet', // 成员分享
          title: '成员分享',
          tip: '成员每分享一次文章/名片/表单/文件/商品，都可获得对应积分',
          getPoint: 1, // 每次分享可获得积分
          isLimit: true, // 是否限制
          limitNum: 40, // 限制的数量
        },
        {
          key: 'newCustomerSet', // 新客户分享
          title: '新客户访问',
          tip: '每当一个新客户访问成员分享的文章/名片/表单/文件/海报/商品，该成员都可获得对应积分',
          getPoint: 2, // 每次分享可获得积分
          isLimit: false, // 是否限制
          limitNum: 1, // 限制的数量
        },
        {
          key: 'oldCustomerSet', // 旧客户分享
          title: '旧客户访问',
          tip: '每当一个旧客户访问成员分享的文章/名片/表单/文件/海报/商品，该成员都可获得对应积分',
          getPoint: 1, // 每次分享可获得积分
          isLimit: false, // 是否限制
          limitNum: 1, // 限制的数量
        },
      ],
      limitList: [
        {
          key: false,
          value: '不限制',
        },
        {
          key: true,
          value: '限制',
        },
      ],
    };
  },
  computed: {},
  watch: {
    dialogVisible(newVal) {
      newVal && this.getSettingInfo();
    },
  },
  async created() {
    const confInfo = await getConfInfo();
    this.isOpenFlag = confInfo.isOpenIntegral;
    this.isOpenFlag && this.getSettingInfo();
  },
  mounted() {},
  methods: {
    setting() {
      // 需要判断一下条件
      if (this.isOpenFlag) {
        this.dialogVisible = true;
      } else {
        this.$utils.postMessage({
          type: 'error',
          message: '请先开启推广积分系统',
        });
      }
    },
    cancel() {
      this.dialogVisible = false;
    },
    async sure() {
      if (!this.checkInput()) {
        const param = {};
        param.share = this.settingArr[0].getPoint || 0; // 成员每次分享获得的积分
        param.shareIsLimit = this.settingArr[0].isLimit;
        param.shareMaxLimit = this.settingArr[0].limitNum;
        param.newVisit = this.settingArr[1].getPoint || 0;
        param.newVisitIsLimit = this.settingArr[1].isLimit;
        param.newVisitMaxLimit = this.settingArr[1].limitNum;
        param.oldVisit = this.settingArr[2].getPoint || 0;
        param.oldVisitIsLimit = this.settingArr[2].isLimit;
        param.oldVisitMaxLimit = this.settingArr[2].limitNum;
        const [err, res] = await setIntegralSettingInfo(param);
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        this.$utils.postMessage({
          type: 'success',
          message: '保存成功',
        });
        this.cancel();
      }
    },
    checkInput() {
      let ErrorFlag = false;
      ErrorFlag = this.settingArr.some(element => {
        if (element.isLimit) {
          console.log('element--->', element);
          console.log(element.isLimit, !element.limitNum && typeof element.limitNum === 'string');
          if (!element.limitNum && typeof element.limitNum === 'string') {
            this.$utils.postMessage({
              type: 'error',
              message: '请输入每日积分上限数量，或者选择不限制',
            });
            return true;
          }
          if (Number(element.getPoint) > Number(element.limitNum)) {
            this.$utils.postMessage({
              type: 'error',
              message: '每日积分上限不可低于每次可获取积分',
            });
            return true;
          }
        }
      });

      return ErrorFlag;
    },
    setLimit(item, value) {
      this.$set(item, 'isLimit', value);
    },
    async getSettingInfo() {
      const [err, res] = await getDictionaryInfo({
        type: 1,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const dataInfo = res.data.dataInfo;
      if (dataInfo) {
        this.settingArr[0].getPoint = dataInfo.share; // 成员每次分享获得的积分数
        this.settingArr[0].isLimit = dataInfo.shareIsLimit; // 成员分享积分数是否限制
        this.settingArr[0].limitNum = dataInfo.shareMaxLimit; // 成员分享积分数上限
        this.settingArr[1].getPoint = dataInfo.newVisit; // 新访客每次分享获得的积分数
        this.settingArr[1].isLimit = dataInfo.newVisitIsLimit; // 新访客分享积分数是否限制
        this.settingArr[1].limitNum = dataInfo.newVisitMaxLimit; // 新访客分享积分数上限
        this.settingArr[2].getPoint = dataInfo.oldVisit; // 旧访客每次分享获得的积分数
        this.settingArr[2].isLimit = dataInfo.oldVisitIsLimit; // 旧访客分享积分数是否限制
        this.settingArr[2].limitNum = dataInfo.oldVisitMaxLimit; // 旧访客分享积分数上限
      }
    },
    showLimitBox(item) {
      return item.getPoint === '' || item.getPoint != 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.integralSetting {
  height: 100%;
  .settingBody {
    padding: 20px;
  }
}

.setDialog {
  .setDialog-content {
    .setItem {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      margin-bottom: 30px;
      &:last-child {
        margin-bottom: 0;
      }
      .title {
        display: flex;
        width: 100px;
        height: 40px;
        margin-right: 20px;
        font-size: 14px;
        line-height: 40px;
        color: $color-53;
        align-items: center;
        .toolTips {
          padding-left: 6px;
        }
      }
      .settingNumber {
        display: flex;
        width: 160px;
        margin-right: 30px;
        flex-direction: column;
      }
      .selectBox {
        display: flex;
        height: 40px;
        line-height: 40px;
        input[type='radio'] + label {
          margin-right: 24px;
        }
        span:nth-child(2) input[type='radio'] + label {
          margin-right: 10px;
        }
        .limitWrap {
          width: 100px;
        }
      }
      .numberTitle {
        margin-bottom: 10px;
      }
      .toolTips {
        &.icon {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
