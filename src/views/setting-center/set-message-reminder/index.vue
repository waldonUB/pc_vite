<!--
 * @Description  : 消息提醒设置
 * @Author       : turbo
 * @Date         : 2021-03-30 15:47:45
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-07 16:26:06
-->
<template>
  <div class="setMessageReminder">
    <global-ts-card-box>
      <template v-slot:card-box-head>
        <global-ts-header>
          <template v-slot:leftPart>
            消息提醒
            <el-popover class="popover" trigger="hover" placement="top-start">
              <div>为减少重复通知的骚扰，建议您只开启一种提醒；</div>
              首次绑定企微后，将开启企微提醒，并关闭微信提醒，如有需要可再次开启
              <span slot="reference" class="tips">
                <global-ts-svg-icon class="tips" name="icon-wenhao1616"></global-ts-svg-icon>
              </span>
            </el-popover>
          </template>
        </global-ts-header>
      </template>
      <template v-slot:card-box-body>
        <div class="switch-table">
          <el-table
            :span-method="mergeColumn"
            :data="tableData"
            header-row-class-name="header"
            :cell-style="setCellStyle"
            border
            width="100%"
          >
            <el-table-column prop="type" min-width="110" label="提醒类型"> </el-table-column>
            <el-table-column min-width="215" class-name="flexBox" label="提醒事项">
              <template slot-scope="scope">
                <span>{{ scope.row.remainDetail }}</span>
                &nbsp;
                <el-popover class="popover" v-if="scope.row.hasTips" trigger="hover" placement="top">
                  {{ hoverTips(scope.$index) }}
                  <div slot="reference" class="tips">
                    <global-ts-svg-icon class="tips" name="icon-wenhao1616"></global-ts-svg-icon>
                  </div>
                </el-popover>
                <global-ts-version v-if="scope.row.showVer" class="versionIcon" :limitVer="showVer"></global-ts-version>
              </template>
            </el-table-column>
            <el-table-column min-width="110" label="微信提醒开关">
              <template slot-scope="scope">
                <span v-if="scope.row.fixTips">仅支持企微提醒</span>
                <div v-else>
                  <global-ts-version :hasButton="true" v-if="!isHaveVersion && scope.row.showVer" :limitVer="showVer">
                    <fa-switch
                      slot="button"
                      v-model="scope.row.wechatSwitch"
                      @change="changeWechatSwitch(scope.$index)"
                    />
                  </global-ts-version>
                  <fa-switch v-else v-model="scope.row.wechatSwitch" @change="changeWechatSwitch(scope.$index)" />
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="110" label="企微提醒开关">
              <template slot-scope="scope">
                <global-ts-version :hasButton="true" v-if="!isHaveVersion && scope.row.showVer" :limitVer="showVer">
                  <fa-switch
                    slot="button"
                    v-model="scope.row.enWechatSwitch"
                    @change="changeEnWechatSwitch(scope.$index)"
                  />
                </global-ts-version>
                <fa-switch v-else v-model="scope.row.enWechatSwitch" @change="changeEnWechatSwitch(scope.$index)" />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-dialog :visible.sync="showQRCode" width="320px" @close="cancel" custom-class="qr-dialog" center>
          <div>
            <img :src="qrCodeUrl" class="qr-code" />
            <div class="qr-mask" v-if="isInvalidQR" @click="refreshQR">
              <div>二维码已过期</div>
              <div>点击刷新</div>
            </div>
          </div>
          <div class="footer-font" slot="footer">
            <div>打开微信扫一扫</div>
            <div>绑定公众号开启提醒</div>
          </div>
        </el-dialog>
      </template>
    </global-ts-card-box>
  </div>
</template>

<script>
import versionDef from '@/config/version-def';
import { mapState } from 'vuex';
import { confirm } from '@/utils';
import { Switch } from '@fk/faicomponent';
import { Popover } from 'element-ui';
import {
  setTsStaffByMessageReminder,
  checkWxWorkApplicationScope,
  getTsStaffByMessageReminder,
  getStaffBindMpQrCode,
} from '@/api/modules/views/setting-center/set-message-reminder';

export default {
  name: 'setMessageReminder',
  components: {
    [Switch.name]: Switch,
    [Popover.name]: Popover,
  },
  props: {},
  data() {
    return {
      //table的数据
      tableData: [
        {
          type: '客户动态提醒',
          remainDetail: '获客素材访问提醒',
          hasTips: '',
          wechatSwitch: false,
          enWechatSwitch: false,
          wechatKey: 'remindClientViewer',
          wxWorkKey: 'wxWorkClientViewerNotice',
          showVer: false,
        },
        {
          remainDetail: '客户聊天回复提醒',
          hasTips: '',
          wechatSwitch: false,
          enWechatSwitch: false,
          wechatKey: 'remindIm',
          wxWorkKey: 'wxWorkRemindImNotice',
          showVer: false,
        },
        {
          remainDetail: '客户生日提醒',
          hasTips: '',
          wechatSwitch: false,
          enWechatSwitch: false,
          wechatKey: 'clientBirthdayNotice',
          wxWorkKey: 'wxWorkClientBirthdayNotice',
          showVer: false,
        },
        {
          type: '销售事项提醒',
          remainDetail: '跟进客户提醒',
          hasTips: '',
          wechatSwitch: false,
          enWechatSwitch: false,
          wechatKey: 'clientFollowNotice',
          wxWorkKey: 'wxWorkClientFollowNotice',
          showVer: false,
        },
        {
          remainDetail: '客户变动提醒',
          hasTips: '',
          wechatSwitch: false,
          enWechatSwitch: false,
          wechatKey: 'clientChangeNotice',
          wxWorkKey: 'wxWorkClientChangeNotice',
          showVer: false,
        },
        {
          remainDetail: '线索变动提醒',
          hasTips: '',
          wechatSwitch: false,
          enWechatSwitch: false,
          wechatKey: 'clueChangeNotice',
          wxWorkKey: 'wxWorkClueChangeNotice',
          showVer: false,
        },
        {
          remainDetail: '被客户删除提醒（企微)',
          hasTips: '开启后当客户在企微将您删除时，向您推送提醒',
          wechatSwitch: false,
          enWechatSwitch: false,
          fixTips: true,
          wxWorkKey: 'wxWorkClientDelNotice',
          showVer: true,
        },
        {
          remainDetail: '添加客户提醒（企微)',
          hasTips: '开启后当客户在企微添加您为好友时，向您推送提醒',
          wechatSwitch: false,
          enWechatSwitch: false,
          fixTips: true,
          wxWorkKey: 'wxWorkClientAddNotice',
          showVer: false,
        },
        {
          type: '管理员设置',
          remainDetail: '成员删除客户提醒（企微)',
          hasTips: '开启后当成员删除客户时，向企业管理员推送提醒',
          wechatSwitch: false,
          enWechatSwitch: false,
          fixTips: true,
          wxWorkKey: 'openCorpStaffDel',
          showVer: false,
        },
        {
          remainDetail: '强制成员开启提醒',
          hasTips: '开启后强制成员开启所有提醒且无法关闭',
          wechatSwitch: false,
          enWechatSwitch: false,
          wechatKey: 'openCorpCoerceStaffByWx',
          wxWorkKey: 'openCorpCoerceStaffByWxWork',
          showVer: true,
        },
      ],
      userInfo: {
        //用户信息
        bindingMp: false, // 是否绑定公众号
        bindingWxWork: false, // 是否绑定了企微
        isFinishWxWorkInstall: false, //是否完成了企微设置
        creator: false, //是否为超级管理员
        workId: -1, //员工ID
      },
      count: 0, //计数，超过30分钟没有扫码就失效
      timer: null, //计数器
      isInvalidQR: false, //二维码是否到时失效
      showQRCode: false, //是否显示微信二维码
      qrCodeUrl: '', //二维码地址
      bindDuring: false, //企微绑定避免多次弹出
      settingDuring: false, //企微设置避免多次弹出
      hasWxorkScope: true, //是否有访问微信权限
    };
  },
  computed: {
    ...mapState({
      isOem: state => state.user.info.isOem,
    }),
    showVer() {
      return versionDef.getLimitVer('MID', 'PROFESSIONNAL'); // 直销：专业版； 分销：高级版/尊享版/专用版
    },
    isHaveVersion() {
      if (this.isOem) {
        return versionDef.checkVersion(versionDef.NotDirectVersionDef.VersionList.MID);
      } else {
        return versionDef.checkVersion(versionDef.DirectVersionDef.VersionList.PROFESSIONNAL);
      }
    },
  },
  watch: {
    'userInfo.bindingMp': {
      handler: function(newVal) {
        if (newVal && this.showQRCode) {
          this.showQRCode = false;
          clearInterval(this.timer);
          this.count = 0;
          this.$utils.postMessage({
            type: 'success',
            message: '绑定成功',
          });
        }
      },
    },
  },
  created() {
    this.getUserInfo();
    this.getQRcodeUrl();
  },
  destroyed() {
    clearInterval(this.timer);
  },
  mounted() {},
  methods: {
    /**
     * 刷新二维码
     * @author han
     * @date 2021-03-04
     * @param {*} param - param
     */
    async refreshQR() {
      await this.getQRcodeUrl();
      this.isInvalidQR = false;
    },
    /**
     * 编辑第一行交互
     * @author han
     * @date 2021-03-04
     */
    setCellStyle({ row, column, rowIndex, columnIndex }) {
      if (row.type && columnIndex == 0) {
        return {
          background: '#fff',
          pointerEvents: 'none',
        };
      }
    },
    /**
     * 关闭二维码窗口
     * @author han
     * @date 2021-03-04
     */
    cancel() {
      clearInterval(this.timer);
      this.count = 0;
    },
    /**
     * 悬浮的文案提示
     * @author han
     * @date 2021-03-03
     */
    hoverTips(index) {
      return this.tableData[index].hasTips;
    },
    /**
     * 微信提醒开关
     * @author han
     * @date 2021-02-25
     */
    changeWechatSwitch(index) {
      const wechatKeyTem = this.tableData[index].wechatKey;
      if (
        this.tableData[index].wechatSwitch === false &&
        this.userInfo.openCorpCoerceStaffByWx &&
        wechatKeyTem !== 'openCorpCoerceStaffByWx'
      ) {
        this.$utils.postMessage({
          type: 'error',
          message: '管理员已开启强制提醒模式，无法关闭',
        });
        this.tableData[index].wechatSwitch = true;
        return;
      }
      if (wechatKeyTem === 'openCorpCoerceStaffByWx') {
        this.userInfo.openCorpCoerceStaffByWx = this.tableData[index].wechatSwitch;
        this.turnOn();
      }
      if (!this.userInfo.bindingMp) {
        this.tableData[index].wechatSwitch = false;
        this.showQRCode = true;
        this.timer = setInterval(() => {
          this.count++;
          this.getUserInfo();
        }, 1000);
      } else {
        const setSingle = wechatKeyTem === 'openCorpCoerceStaffByWx';
        const params = {
          index,
          type: 'wx',
        };
        setSingle
          ? this.setMessageReminder('openCorpCoerceStaffByWx', this.tableData[index].wechatSwitch, params)
          : this.setMessageReminder('', false, params);
        this.userInfo[wechatKeyTem] = this.tableData[index].wechatSwitch;
      }
    },
    /**
     * 发送设置开关
     * @author han
     * @date 2021-03-03
     * @param {String, Boolean, Object} setSingle: 是否为强制，flag： 按钮情况， params： log的信息
     */
    async setMessageReminder(setSingle = '', flag, logObj) {
      const params = {};
      if (setSingle) {
        params[setSingle] = flag;
      } else {
        this.tableData.forEach(item => {
          item.wechatKey && (params[item.wechatKey] = item.wechatSwitch);
          item.wxWorkKey && (params[item.wxWorkKey] = item.enWechatSwitch);
        });
      }
      const [err, res] = await setTsStaffByMessageReminder(params);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.setLogDog(logObj);
    },
    /**
     * 企微提醒开关
     * @author han
     * @date 2021-02-25
     */
    changeEnWechatSwitch(index) {
      const wxWorkKeyTem = this.tableData[index].wxWorkKey;
      if (
        this.tableData[index].enWechatSwitch === false &&
        this.userInfo.openCorpCoerceStaffByWxWork &&
        wxWorkKeyTem !== 'openCorpCoerceStaffByWxWork'
      ) {
        this.$utils.postMessage({
          type: 'error',
          message: '管理员已开启强制提醒模式，无法关闭',
        });
        this.tableData[index].enWechatSwitch = true;
        return;
      }
      if (!this.hasWxorkScope && this.tableData[index].enWechatSwitch === true) {
        if (!this.settingDuring) {
          this.settingDuring = true;
          const url = this.isOem ? 'https://adm.webportal.top/sys/view.jsp?id=1799' : 'https://kht.fkw.com/blog/56138/';
          this.$message({
            dangerouslyUseHTMLString: true,
            type: 'error',
            onClose: () => {
              this.settingDuring = false;
            },
            message: `您不在消息提醒的接收范围内，请联系管理员设置 <a href="${url}"  target="_blank" >如何设置</a>`,
          });
        }
        this.tableData[index].enWechatSwitch = false;
        return;
      }
      if (wxWorkKeyTem === 'openCorpCoerceStaffByWxWork') {
        this.userInfo.openCorpCoerceStaffByWxWork = this.tableData[index].enWechatSwitch;
        this.turnOn();
      }
      if (!this.userInfo.isFinishWxWorkInstall) {
        this.tableData[index].enWechatSwitch = false;
        if (this.userInfo.creator) {
          confirm('您尚未完成企微设置，完成后可开启提醒', '通知', '前往设置').then(action => {
            this.$router.push({
              path: '/wxCorpApp',
            });
          });
        } else {
          this.$utils.postMessage({
            type: 'error',
            message: '无法开启，请联系超管先完成企微设置',
          });
        }
      } else {
        if (this.userInfo.bindingWxWork) {
          const setSingle = wxWorkKeyTem === 'openCorpCoerceStaffByWxWork';
          const params = {
            index,
            type: 'wxWork',
          };
          setSingle
            ? this.setMessageReminder('openCorpCoerceStaffByWxWork', this.tableData[index].enWechatSwitch, params)
            : this.setMessageReminder('', false, params);
          this.userInfo[wxWorkKeyTem] = this.tableData[index].enWechatSwitch;
        } else {
          if (!this.bindDuring) {
            this.bindDuring = true;
            const url = this.isOem
              ? 'https://adm.webportal.top/sys/view.jsp?id=1799'
              : 'https://kht.fkw.com/blog/56138/';
            this.$message({
              dangerouslyUseHTMLString: true,
              type: 'error',
              onClose: () => {
                this.bindDuring = false;
              },
              message: `您尚未绑定企微，请前往企微登录后绑定 <a href="${url}"  target="_blank" >如何绑定</a>`,
            });
          }
          this.tableData[index].enWechatSwitch = false;
        }
      }
    },
    /**
     * 事件log
     * @author han
     * @date 2021-03-08
     * @param {*} param - param
     */
    setLogDog(params) {
      const { index, type } = params;
      const remainDetail = this.tableData[index].remainDetail;
      const isOpen = type == 'wx' ? this.tableData[index].wechatSwitch : this.tableData[index].enWechatSwitch;
      const startIndex = remainDetail.indexOf('企微');
      const remainText = startIndex == -1 ? remainDetail : remainDetail.slice(0, startIndex - 1);
      switch (type) {
        case 'wx':
          if (isOpen) {
            this.$utils.FdpLog('yx_kqxxtx', {
              yx_free_text_0: remainText,
              yx_staff_position: this.userInfo.workId,
              yx_app_terminal: 1,
            });
          } else {
            this.$utils.FdpLog('yx_kqxxtx', {
              yx_free_text_1: remainText,
              yx_staff_position: this.userInfo.workId,
              yx_app_terminal: 1,
            });
          }
          break;
        case 'wxWork':
          if (isOpen) {
            this.$utils.FdpLog('yx_kqxxtx', {
              yx_free_text_2: remainText,
              yx_staff_position: this.userInfo.workId,
              yx_app_terminal: 1,
            });
          } else {
            this.$utils.FdpLog('yx_kqxxtx', {
              yx_free_text_3: remainText,
              yx_staff_position: this.userInfo.workId,
              yx_app_terminal: 1,
            });
          }
      }
    },
    /**
     * 合并列
     * @author han
     * @date 2021-02-25
     * @param {*} param - param
     */
    mergeColumn({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0) {
        let index = this.tableData.findIndex((item, index) => item.type && index > rowIndex);
        if (row.type) {
          index = index == -1 ? this.tableData.length - rowIndex : index - rowIndex;
          return [index, 1];
        } else {
          return [0, 0];
        }
      }
    },
    /**
     * 打开全部开关
     * @author han
     * @date 2021-03-04
     * @params switchKey 1. wechatKey微信开关 2. 企微开关enWechatSwitch
     */
    turnOn() {
      this.tableData.forEach(item => {
        item.wechatSwitch = this.userInfo.openCorpCoerceStaffByWx ? true : this.userInfo[item.wechatKey];
        item.enWechatSwitch = this.userInfo.openCorpCoerceStaffByWxWork ? true : this.userInfo[item.wxWorkKey];
        item.wechatSwitch = this.userInfo.bindingMp ? item.wechatSwitch : false;
        item.enWechatSwitch = this.userInfo.bindingWxWork ? item.enWechatSwitch : false;
        item.enWechatSwitch = this.hasWxorkScope ? item.enWechatSwitch : false;
      });
    },
    /**
     * 判断是否有企微访问权限
     * @author han
     * @date 2021-03-08
     * @param {*} param - param
     */
    async getWxworkPower() {
      const [err, res] = await checkWxWorkApplicationScope();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.hasWxorkScope = res.data.isApplicationScopeAuth;
      !this.hasWxorkScope && this.turnOn();
    },
    /**
     * 获取用户的开关信息
     * @author han
     * @date 2021-03-02
     */
    async getUserInfo() {
      const [err, res] = await getTsStaffByMessageReminder();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
      } else {
        const ans = res.data; //判断是否为超级管理员
        if (ans.bindingWxWork && ans.isFinishWxWorkInstall) {
          this.getWxworkPower();
        }
        this.userInfo = { ...ans };
        if (!this.userInfo.creator && !this.showQRCode) {
          this.tableData.splice(-2);
        }
        this.turnOn();
      }
      if (this.count >= 60 * 5) {
        clearInterval(this.timer);
        this.count = 0;
        this.isInvalidQR = true;
      }
    },
    /**
     * 获取二维码地址
     * @author han
     * @date 2021-03-03
     */
    async getQRcodeUrl() {
      const [err, res] = await getStaffBindMpQrCode();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.qrCodeUrl = res.msg;
    },
  },
};
</script>

<style lang="scss" scoped>
.setMessageReminder {
  height: 100%;
  .tanshu-cardBox-body {
    margin-bottom: 0;
  }
  .tanshu-header-comm {
    .leftPart {
      .popover {
        transform: translateX(-5px);
      }
    }
  }
  .footer-font {
    font-size: 16px;
    color: $color-53;
  }
  .popover {
    display: inline-block;
    margin-bottom: 4px;
    .tips {
      display: flex;
      width: 16px;
      height: 16px;
      font-size: 6px;
      color: $color-89;
      color: $color-89;
      cursor: pointer;
      border-radius: 50%;
      transform: translateY(1px);
      justify-content: center;
      align-items: center;
      span {
        color: $color-89;
      }
    }
  }
  .switch-table {
    padding: 20px 20px 0;
    .header {
      font-size: 14px;
      color: $color-53;
    }
    .flexBox {
      display: flex;
      justify-content: center;
      flex-wrap: nowrap;
      height: 49px;
    }
  }
  .tanshu-cardBox {
    .tanshu-cardBox-bottom {
      position: static;
    }
  }
}
</style>

<style lang="scss">
.setMessageReminder {
  .tanshu-header-comm {
    .leftPart {
      .popover {
        margin-bottom: 6px;
      }
      .el-popover__reference-wrapper {
        display: flex;
      }
    }
  }
  .tanshu-cardBox-body {
    .el-dialog__body {
      position: relative;
      display: flex;
      justify-content: center;
      .qr-code {
        width: 192px;
        height: 192px;
      }
      .qr-mask {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 9;
        display: flex;
        width: 192px;
        height: 192px;
        color: #ffffff;
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.6);
        transform: translate(-50%, -50%);
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .el-dialog__wrapper {
    display: flex;
    align-items: center;
    .qr-dialog {
      margin-top: 50px !important;
      border-radius: 4px;
    }
  }
  .tanshu-cardBox {
    .el-dialog__footer {
      padding-top: 0;
      padding-bottom: 48px;
    }
    .el-dialog__body {
      padding-top: 18px;
      padding-bottom: 4px;
    }
  }
  .el-table {
    .cell {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
