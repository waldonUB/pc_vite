<template>
  <div class="getOpen_poup" v-if="isShowOpen">
    <div class="getOpen_box" :class="isOnlyIndustryPush ? 'industryPush' : ''" v-if="!corpInstallDialogVisible">
      <global-ts-svg-icon v-if="isOnlyIndustryPush" class="icon" @click="close" name="icon-shanchu" />
      <div class="topImg" :class="isShowWxWorkPush ? 'qw_topImg' : ''"></div>
      <div class="contentBox">
        <div class="contentItem" v-for="(item, key) of selectList" :key="key">
          <p class="title">{{ item.title }}</p>
          <el-radio-group v-model="resultObj[key]" class="selectBox">
            <div class="flex_radioBox">
              <el-radio v-for="subItem in item.list" :key="subItem.key" :label="subItem.key">
                {{ subItem.value }}{{ subItem.minValue }}
              </el-radio>
            </div>
          </el-radio-group>
          <p v-if="!resultObj[key] && buttonStatus == 1" class="errorTip errorTip_1">请选择</p>
        </div>
        <div class="buttonBox" v-if="!isOnlyIndustryPush">
          <button class="openBtn" @click="openSystem(1)">立即使用</button>
          <button class="noNeed" @click="openSystem(2)">暂不需要</button>
        </div>
        <div class="buttonBox" v-else>
          <button class="openBtn" :class="isNoSelect ? 'unfinish' : ''" @click="openSystem(1)">完成</button>
        </div>
      </div>
    </div>
    <ts-corp-install-model
      :mask="false"
      :corpInstallDialogVisible.sync="corpInstallDialogVisible"
      fromPage="企微开通弹窗"
    ></ts-corp-install-model>
  </div>
</template>

<script>
import { cookie, format, FdpLog, logDog, postMessage } from '@/utils';
import { RadioGroup, Radio } from 'element-ui';
import { mapState } from 'vuex';
import { getTsPushConfDef, checkOpenPushGET, setTsProfExt } from '@/api/modules/component/get-open-poup';
import TsCorpInstallModel from '@/components/base/ts-corp-install-model/index.vue';
import { get } from '@/utils/request';

export default {
  name: 'get-open-poup',
  async created() {
    await this.getOpenPoup();
    await this.initSelectList();
  },
  components: {
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    TsCorpInstallModel,
  },
  computed: {
    ...mapState({
      globalData: state => state.globalData,
      userInfo: state => state.user.info,
    }),
    isNoSelect() {
      if (this.isOnlyIndustryPush) {
        return !this.resultObj.industry;
      } else {
        const arr = Object.values(this.resultObj);
        return arr.some(item => item == 0);
      }
    },
  },
  watch: {
    corpInstallDialogVisible(newVal) {
      if (!newVal) {
        this.isShowOpen = false;
        window.location.reload();
      }
    },
  },
  methods: {
    close() {
      cookie(`ts_getOpen${this.globalData.userTicket}`, true, {
        expires: format.addDate(new Date(), 1, 'days'),
      });
      this.isShowOpen = false;
    },
    async initSelectList() {
      const [err, response] = await getTsPushConfDef();
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const data = response.data;
      this.selectList.industry.list = data.IndustryList;
      if (!this.isOnlyIndustryPush) {
        this.selectList = Object.assign(this.selectList, this.oldSelectList);
        this.selectList.salesChannels.list = data.salesChannelList;
        this.selectList.teamSize.list = data.teamSizeList;
      }
      return Promise.resolve();
    },
    /**
     *获取是否弹开通弹窗，已经提交了之后就不再弹窗
     *
     * @author guoyijie
     * @date 2020-04-18
     */
    async getOpenPoup() {
      let str = window.location.href;
      str = str.match(/\?(\S*)#/) ? str.match(/\?(\S*)#/)[1] : '';
      const parmesList = str.split('&');
      console.log(parmesList);
      const parmesMap = new Map();
      for (const p of parmesList) {
        const pList = p.split('=');
        parmesMap.set(pList[0], pList[1]);
      }
      console.log(parmesMap);
      console.log(window.location.href);
      if (!this.isOem) {
        const [err, res] = await checkOpenPushGET({
          source_biz: parmesMap.get('source_biz') || 0,
          open_source: parmesMap.get('open_source') || 0,
        });
        if (err) {
          return Promise.resolve();
        }
        const resData = res.data;
        if (resData) {
          this.isShowWxWorkPush = resData.isShowWxWorkPush;
          if (resData.isOpenPush || resData.isOpenIndustryPush) {
            this.isOnlyIndustryPush = !resData.isOpenPush; //是否只显示行业弹窗（针对旧用户）
            if (
              (this.isOnlyIndustryPush &&
                !cookie(`ts_getOpen${this.globalData.userTicket}`) &&
                this.currentRoute == 'indexManage') ||
              !this.isOnlyIndustryPush
            ) {
              this.isShowOpen = true;
            }
            this.$utils.FdpLog('yx_portal_popup_expo', {
              yx_free_text_0: this.isShowWxWorkPush
                ? '企微开通弹窗'
                : this.isOnlyIndustryPush
                ? '行业补充弹窗'
                : '开通弹窗',
              yx_app_terminal: 1,
            });
            if (this.isOpenProduct) {
              this.$utils.logDog('Open_show');
            } else {
              this.$utils.logDog('unOpen_show');
            }
          } else {
            return Promise.resolve();
          }
        }
      } else {
        return Promise.resolve();
      }
    },
    /**
     *保存选择
     *
     * @author guoyijie
     * @date 2020-04-18
     * @param {*} status（1，立即使用；2，暂不需要）
     * @returns
     */
    /*如果点了暂不开通，不再记录开通时间，直接跳转到管理平台
     * @Author: tomato
     * @Date: 2020-05-28 14:13:38
     * @Last Modified by:   tomato
     * @Last Modified time: 2020-05-28 14:13:38
     */
    async openSystem(status) {
      this.buttonStatus = status;
      FdpLog('yx_portal_popup_click', {
        yx_free_text_0: this.isShowWxWorkPush ? '企微开通弹窗' : this.isOnlyIndustryPush ? '行业补充弹窗' : '开通弹窗',
        yx_app_terminal: 1,
        yx_free_text_1: this.buttonStatus == 2 ? '开通-暂不需要' : '开通-立即使用',
      });
      if (this.buttonStatus == 2) {
        //暂不需要
        this.salesChannels = 0;
        this.teamSize = 0;
        const logName = this.userInfo.isOpenProduct ? 'Open_noneed' : 'unOpen_noneed';
        logDog(logName, true).then(() => {
          window.location.href = `${this.globalData.addressUrl.portalHost}/portal.jsp`;
        });
        return;
      }
      if (this.isNoSelect) {
        //没有勾选
        return;
      }
      const parmes = this.isOnlyIndustryPush
        ? {
            industry: this.resultObj.industry,
          }
        : {
            salesChannels: this.resultObj.salesChannels,
            teamSize: this.resultObj.teamSize,
            industry: this.resultObj.industry,
          };
      const [err, res] = await setTsProfExt(parmes);
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const logName = this.userInfo.isOpenProduct ? 'Open_use' : 'unOpen_use';
      logDog(logName, true).then(() => {
        if (this.isShowWxWorkPush) {
          // this.$emit('update:corpInstallDialogVisible', true)
          this.corpInstallDialogVisible = true;
        } else {
          this.isShowOpen = false;
          window.location.reload();
        }
      });
      this.isShowOpen = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.getOpen_poup {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1200;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
}
.getOpen_poup .icon {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
  width: 2.2em;
  height: 2.2em;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.3);
  vertical-align: -0.15em;
  cursor: pointer;
}
.getOpen_poup .getOpen_box {
  position: absolute;
  position: relative;
  top: 50%;
  left: 50%;
  width: 645px;
  height: 601px;
  margin-top: -300px;
  margin-left: -323px;
  background: linear-gradient(180deg, #247af3 0%, #46abf9 100%);
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 16px;
}
.getOpen_poup .industryPush {
  height: 378px;
}
.getOpen_poup .getOpen_box .topImg {
  position: absolute;
  top: 0;
  left: 0;
  width: 645px;
  height: 132px;
  background: url('~@/assets/image/comm/direct/open_bg.png') no-repeat;
  background-size: cover;
}
.getOpen_poup .getOpen_box .qw_topImg {
  background: url('~@/assets/image/comm/direct/qw_open_bg.png') no-repeat;
}
.getOpen_poup .contentBox {
  position: absolute;
  top: 132px;
  left: 20px;
  width: 525px;
  padding: 20px 40px 30px;
  background: #ffffff;
  border-radius: 8px;
  opacity: 1;
}

.getOpen_poup .contentBox .contentItem {
  position: relative;
}
.getOpen_poup .contentBox .contentItem .title {
  margin-bottom: 14px;
  font-size: 16px;
  color: #0e0e0e;
}

.getOpen_poup .contentBox .contentItem .flex_radioBox {
  display: flex;
  flex-wrap: wrap;
  width: 525px;
  margin-bottom: 17px;
}
.getOpen_poup .contentBox .contentItem .el-radio {
  width: 131px;
  margin-right: 0;
  margin-bottom: 13px;
}

.getOpen_poup .contentBox .contentItem:nth-of-type(2) .el-radio:nth-child(3n + 2) {
  width: 262px;
}

.getOpen_poup .contentBox .contentItem .el-radio__label {
  display: inline-block;
  width: 96px;
}
.getOpen_poup .contentBox .openBtn {
  width: 140px;
  height: 34px;
  padding: 0;
  margin-right: 20px;
  font-size: 14px;
  line-height: 34px;
  color: #ffffff;
  text-align: center;
  cursor: pointer;
  background: #247af3;
  border: none;
  border-radius: 4px;
  outline: none;
  opacity: 1;
}
.getOpen_poup .contentBox .openBtn.unfinish {
  color: #b2b2b2;
  cursor: not-allowed;
  background: #eeeeee;
}
.getOpen_poup .contentBox .noNeed {
  padding: 0;
  font-size: 14px;
  color: #ffffff;
  color: #bababa;
  text-decoration: underline;
  cursor: pointer;
  background: none;
  border: none;
  outline: none;
}
.getOpen_poup .contentBox .contentItem .errorTip {
  position: absolute;
  left: 0;
  font-size: 12px;
  color: #f5293c;
}
.getOpen_poup .contentBox .contentItem .errorTip_1 {
  bottom: 12px;
}
.getOpen_poup .contentBox .contentItem .errorTip_2 {
  top: 186px;
}
.getOpen_poup .contentBox .buttonBox {
  display: flex;
  justify-content: center;
}
</style>
