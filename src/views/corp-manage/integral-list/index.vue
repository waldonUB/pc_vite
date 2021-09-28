<!--
 * @Description  : 积分列表
 * @Author       : turbo
 * @Date         : 2021-03-30 15:29:48
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-20 13:47:47
-->

<template>
  <div class="integralList">
    <global-ts-header>
      <template v-slot:leftPart>积分列表</template>
    </global-ts-header>
    <div class="mallSettingBox cardInGrey" :class="hasVersionBox ? 'hasVersionBox' : ''">
      <div class="mallImg"></div>
      <div class="rightPart" :class="!isShowVersion ? 'free' : 'vip'">
        <div class="mymall">
          <p>推广积分</p>
          <global-ts-version :limitVer="showVer"></global-ts-version>
        </div>
        <p class="mallexplain">推广积分，赋能销售工作价值</p>
        <div class="isOpenH5Mall" v-if="isUpperAdm">
          <span v-for="(item, index) in openSettingList" :key="index">
            <input
              v-model="isOpen"
              type="radio"
              :disabled="!isShowVersion"
              @change="openIntegral"
              :id="'phoneMall' + index"
              :value="item.key"
            />
            <label :for="'phoneMall' + index">{{ item.value }}</label>
          </span>
        </div>
        <global-ts-version-warning v-if="!isOem"></global-ts-version-warning>
      </div>
    </div>
    <div class="pro_listBox" v-if="isOpen">
      <div class="pro_line">
        <ts-select-list
          v-if="isNoOneSelfDataAuth"
          class="headSelect floatLeft workList"
          :selectType="1"
          :depIdList.sync="requestParam.depIdList"
          :sids.sync="requestParam.sids"
        >
        </ts-select-list>
        <global-ts-date-picker class="timePicker" @updateTime="getSearchTime" :isInit="false"> </global-ts-date-picker>
        <global-ts-button
          type="primary"
          size="small"
          class="queryBtn"
          icon="icon-icon-4"
          ref="button"
          @click="reloadTableData"
          >搜索
        </global-ts-button>
        <global-ts-button type="primary" size="small" icon="icon-daochu" ref="button" @click="onExportExcel">
          导出
        </global-ts-button>
      </div>
      <el-table class="tshu-tableset" border header-row-class-name="employeeHeader" :data="responsibility.integralList">
        <el-table-column prop="ranking" label="排名"></el-table-column>
        <el-table-column prop="name" label="成员">
          <template slot-scope="scope">
            {{ $utils.showStaffName(tsStaffExtraList, scope.row.sid, scope.row.name) }}
          </template>
        </el-table-column>
        <el-table-column prop="statIntegral" label="积分"></el-table-column>
        <template slot="empty">
          暂无数据
        </template>
      </el-table>
      <global-ts-pagination
        :tableData="responsibility.integralList"
        :requestParam="requestParam"
        :isReload.sync="responsibility.isReload"
        @getData="changeTable"
        :httpurl="responsibility.httpurl"
      >
      </global-ts-pagination>
    </div>
    <div class="introduction" v-if="!isOpen"></div>
  </div>
</template>

<script>
import versionDef from '@/config/version-def';
import { mapGetters, mapState } from 'vuex';
import { exportExcel, saveGuide, getConfInfo } from '@/utils';
import TsSelectList from '@/components/base/ts-select-list/index.vue';
import { setTsProfConf, getIntegralDetailStatList } from '@/api/modules/views/corp-manage/integral-list';

export default {
  name: 'integralList',
  components: { TsSelectList },
  props: {},
  data() {
    return {
      isOpen: false, // 是否开通了推广积分
      openSettingList: [
        {
          key: false,
          value: '关闭',
        },
        {
          key: true,
          value: '开启',
        },
      ],
      version: versionDef.checkIsFree(),
      versionInfo: versionDef.getVersionInfo(),
      showVer: versionDef.getLimitVer('MID', 'PROFESSIONNAL'), // 直销：专业版； 分销：高级版/尊享版/专用版
      requestParam: {
        // 请求数据
        sid: -1, //跟进员工
        sids: '[]', // 多名员工
        // startTimeStr: Ts_util.format.date(Ts_util.format.subDate(new Date(), 1, 'years'), 'yyyy-MM-dd'), // 开始时间
        // endTimeStr: Ts_util.format.date(new Date(), 'yyyy-MM-dd'), // 结束时间
        // createTimeStart: Ts_util.format.date(Ts_util.format.subDate(new Date(), 1, 'years'), 'yyyy-MM-dd'), // 初始化
        // createTimeEnd: Ts_util.format.date(new Date(), 'yyyy-MM-dd'),
        startTimeStr: '',
        endTimeStr: '',
      },
      responsibility: {
        integralList: [], // 列表数据
        isReload: false, // 是否重新加载数据
        httpurl: '/ajax/integral/tsIntegralDetail_h.jsp?cmd=getIntegralDetailStatList', // 请求数据的地址
        initTime: [], // 初始默认选中时间
      },
    };
  },
  computed: {
    ...mapGetters({
      isNoOneSelfDataAuth: 'user/isNoOneSelfDataAuth',
      isUpperAdm: 'user/isUpperAdm',
      isManage: 'user/isManage',
    }),
    ...mapState({
      isOem: state => state.user.info.isOem,
      userInfo: state => state.user.info,
      isShowVersion: state => state.globalData?.functionInfo?.promoteIntegral?.condition,
      tsStaffExtraList: state => state.user.tsStaffExtraList,
      addressUrl: state => state.globalData.addressUrl,
    }),
    restDay() {
      return this.transTime(this.userInfo.msg.deadlineSecond, 'day');
    },
    restHour() {
      return this.transTime(this.userInfo.msg.deadlineSecond, 'hour');
    },
    /**
     * @description 有限时优惠或者有版本倒计时
     * @author enson
     * @date 2020-08-06
     */
    hasVersionBox() {
      return (
        (this.version && !this.userInfo.isShowTreeTry && !this.isOem) ||
        (this.userInfo.msg.isTry && this.userInfo.msg.realVer === 0)
      );
    },
  },
  watch: {},
  created() {
    this.requestParamDefaultValue();
    // 判断是否开通，开通的话则加载表格数据，没有开通的话则先不加数据，显示推广图
    this.getIntegralConf();
    this.isOpen && this.reloadTableData();
    saveGuide(11);
  },
  mounted() {},
  methods: {
    transTime(time, key) {
      const dayUnit = 24 * 60 * 60;
      const hourUnit = 60 * 60;
      const day = Math.floor(time / dayUnit);
      const remain = time % dayUnit;
      const hour = Math.floor(remain / hourUnit);
      if (key == 'day') {
        return day > 9 ? day : '0' + day;
      } else if (key == 'hour') {
        return hour > 9 ? hour : '0' + hour;
      }
    },
    /**
     *立即升级
     *
     * @author guoyijie
     * @date 2020-05-07
     */
    jumpUrl() {
      window.open(this.addressUrl.updateVersionUrl);
    },
    /**
     * @description 设置开通/关闭推广积分
     * @author enson
     * @date 2020-07-20
     */
    openIntegral() {
      this.$utils.FdpLog('yx_jfkg', {
        yx_free_bool_0: this.isOpen,
      });
      this.saveIntegralConf();
    },
    /**
     * @description 保存设置
     * @author enson
     * @date 2020-10-29
     */
    async saveIntegralConf() {
      const [err, res] = await setTsProfConf({
        openIntegral: this.isOpen ? 1 : 0,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.$utils.postMessage({
        type: 'success',
        message: this.isOpen ? '开启成功' : '关闭成功',
      });
      this.getIntegralConf();
      this.isOpen && this.reloadTableData();
    },
    /**
     * @description 获取积分设置
     * @author enson
     * @date 2020-10-29
     */
    async getIntegralConf() {
      const confInfo = await getConfInfo();
      this.isOpen = confInfo.isOpenIntegral;
    },
    changeTable(data) {
      this.responsibility.integralList = data;
    },
    /**
     * 设置搜索时间
     * @author lymn
     * @date 2020-08-24
     * @param {Array} val 存放开始和结束时间
     */
    getSearchTime(val) {
      this.responsibility.initTime = val;
      this.requestParam.startTimeStr = (val && val[0]) || '';
      this.requestParam.endTimeStr = (val && val[1]) || '';
    },
    /**
     * 更新数据
     * @author lymn
     * @date 2020-08-24
     */
    reloadTableData() {
      this.responsibility.isReload = true;
    },
    /**
     * 导出
     * @author enson
     * @date 2020-08-24
     */
    async onExportExcel() {
      this.requestParam.isGetAll = true;
      const [err, res] = await getIntegralDetailStatList(this.requestParam);
      this.requestParam.isGetAll = false;
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const excelList = res.data;
      const keyJson = {
        ranking: '排名',
        name: '成员',
        statIntegral: '积分',
      };
      exportExcel(excelList, '《销售积分龙虎榜》', keyJson);
    },
    /**
     * @description : 设置requestParam默认值
     * @author      : ADI
     * @Date        : 2021-05-24 15:00:30
     * @param        {*}
     * @return       {*}
     */
    requestParamDefaultValue() {
      this.requestParam.sid = this.isManage ? -1 : this.userInfo.staffInfo.sid; //跟进员工
    },
  },
};
</script>

<style lang="scss" scoped>
.integralList {
  .mallSettingBox {
    display: flex;
    width: calc(100% - 40px);
    height: 180px;
    padding: 0 20px;
    font-size: 14px;
    color: $color-53;
    background: $color-ff;
    border-bottom: 1px solid $border-disabled-color;
    border-radius: 4px 4px 0 0;
    align-items: center;
    .mallImg {
      width: 140px;
      height: 140px;
      background: url('~@/assets/image/comm/pointPic.png') no-repeat;
      background-size: cover;
    }
    .rightPart {
      margin-left: 20px;
      &.free {
        margin-top: 24px;
      }
      &.vip {
        margin-top: 20px;
      }
    }
    .mymall {
      display: flex;
      margin-bottom: 16px;
      font-size: 16px;
      font-weight: bold;
      line-height: 16px;
      color: $color-00;
      align-items: center;
    }
    .isOpenH5Mall {
      margin-top: 16px;
      margin-bottom: 16px;
    }
    .versionBox {
      display: flex;
      width: 260px;
      height: 52px;
      padding: 0 15px;
      color: #f5ad82;
      background: url('~@/assets/image/comm/vip_bg.png') no-repeat;
      background-size: cover;
      align-items: center;
      justify-content: space-between;
      .versionWrap {
        width: 200px;
        overflow: hidden;
      }
      .version-name {
        margin-bottom: 8px;
        font-size: 14px;
        line-height: 14px;
      }
      .version-time {
        overflow: hidden;
        font-size: 12px;
        line-height: 12px;
        text-overflow: ellipsis;
        word-wrap: normal;
        white-space: nowrap;
      }
      .button {
        width: 76px;
        height: 30px;
        line-height: 30px;
        color: #562b0c;
        text-align: center;
        cursor: pointer;
        background: linear-gradient(90deg, #ff793d 0%, #ffc595 100%);
        border-radius: 4px;
      }
      &.free_bg {
        color: $color-ff;
        background: url('~@/assets/image/comm/free_bg.png') no-repeat;
        background-size: cover;
        .button {
          color: $color-ff;
        }
      }
      &.noTry {
        .button {
          width: 170px;
        }
        .version-name {
          margin-bottom: 0;
        }
      }
    }
  }
  .introduction {
    width: 100%;
    padding-bottom: 116%;
    background: url('~@/assets/image/comm/integral_introduction.png') top center no-repeat;
    background-size: cover;
    border-radius: 0 0 4px 4px;
  }
  .pro_listBox {
    .addBindBtn {
      font-size: 14px;
      font-weight: 400;
      color: #247af3;
      text-decoration: none;
    }
    .help {
      margin-top: 14px;
      font-size: 14px;
      color: $color-53;
      li {
        line-height: 30px;
      }
    }
    .pro_line {
      .timePicker {
        float: left;
        vertical-align: top;
      }
      .queryBtn {
        float: left;
        margin-right: 10px;
      }
    }
  }
  .helpLink {
    color: #247af3;
  }
}
.integralList .mallSettingBox .isOpenH5Mall .title,
.integralList .mallSettingBox .isOpenAppMall .title {
  margin-right: 16px;
}
.directSale {
  .integralList {
    .introduction {
      background: url('~@/assets/image/comm/direct/integral_introduction.png') top center no-repeat;
      background-size: cover;
    }
  }
}
</style>
