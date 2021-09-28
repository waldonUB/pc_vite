<!--
 * @Description  : 佣金记录
 * @Author       : turbo
 * @Date         : 2021-03-30 14:17:30
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-30 15:08:46
-->

<template>
  <div class="commisionBox">
    <div class="commisionRecord" v-if="isShow">
      <global-ts-header>
        <template v-slot:leftPart>佣金记录</template>
        <template v-slot:rightPart>
          <global-ts-button v-if="isCanRequest" type="primary" size="small" icon="icon-icon-11" @click="showCommision">
            佣金申请
          </global-ts-button>
        </template>
      </global-ts-header>
      <div class="pro_listBox">
        <div class="commisionRecord_main">
          <div class="pro_line">
            <div class="statInfo">
              <label>总申请金额</label>
              <span v-html="statInfo.stat_sumPrice"></span>
              <span style="font-size: 14px;">元</span>
              <label>已支付金额</label>
              <span v-html="statInfo.stat_sumPayPrice"></span>
              <span style="font-size: 14px;">元</span>
              <label>待支付金额</label>
              <span v-html="statInfo.stat_sumWaitPrice"></span>
              <span style="font-size: 14px;">元</span>
            </div>
          </div>
          <div class="pro_line">
            <ts-select-list class="floatLeft" v-if="isUpperAdm" :depIdList.sync="form.depIdList" :sids.sync="form.sids">
            </ts-select-list>
            <global-ts-date-picker @updateTime="getSearchTime" :isInit="false"> </global-ts-date-picker>
            <global-ts-select style="width: 150px;height: 34px;" v-model="form.status" :list="payStatusList">
            </global-ts-select>
            <global-ts-button type="primary" size="small" icon="icon-icon-4" @click="reloadDataList" ref="button">
              搜索
            </global-ts-button>
          </div>
          <div class="showTabList">
            <el-table
              :class="'tshu-tableset'"
              :data="dataList"
              border
              min-width="1010px"
              header-row-class-name="employeeHeader"
              cell-class-name="cellStyle"
            >
              <el-table-column prop="createTimeName" label="申请时间" min-width="180px"></el-table-column>
              <el-table-column prop="staffName" label="销售员" min-width="244px">
                <template slot-scope="scope">
                  {{
                    scope.row.staffName
                      ? $utils.showStaffName(tsStaffExtraList, scope.row.sid, scope.row.staffName)
                      : '无'
                  }}
                </template>
              </el-table-column>
              <el-table-column prop="price" label="申请金额（元）" min-width="244px"></el-table-column>
              <el-table-column prop="payTimeName" label="完成支付时间" min-width="158px">
                <template slot-scope="scope">
                  {{ scope.row.payTimeName || '无' }}
                </template>
              </el-table-column>
              <el-table-column label="支付状态" cell-class-name="editList" min-width="120px">
                <template slot-scope="scope">
                  <global-ts-button
                    class="arrows_select"
                    type="default"
                    v-if="scope.row.status == 0"
                    size="mini"
                    iconPosition="right"
                    icon="icon-icon-8"
                    @click="showPayStatus(scope.row, $event)"
                    :ref="'button' + scope.row.id"
                    >{{ payStatusArr[scope.row.status] }}
                  </global-ts-button>
                  <span style="color: #00bb72;" v-else>{{ scope.row.statusName }}</span>
                </template>
              </el-table-column>
              <template slot="empty">
                <global-ts-nodata :isDefaultText="!isPayVersion">暂无数据</global-ts-nodata>
              </template>
            </el-table>
          </div>
          <global-ts-pagination
            :tableData="dataList"
            :requestParam="form"
            :isReload.sync="isReload"
            @getData="getTagList"
            :httpurl="httpurl"
          >
          </global-ts-pagination>
          <div id="ts-payStatus"></div>
        </div>
      </div>
    </div>
    <div id="ts-commision"></div>
  </div>
</template>

<script>
import TsSelectList from '@/components/base/ts-select-list/index.vue';
import { mapGetters, mapState } from 'vuex';
import versionDef from '@/config/version-def';
import { getWorkerList, fmoney } from '@/utils';
import payStatus from './components/pay-status';
import commision from './components/commision';
import { getBkgeDefList } from '@/api/modules/views/corp-manage/commision-record';

export default {
  name: 'commisionRecord',
  components: { TsSelectList },
  props: {},
  data() {
    return {
      form: {
        sid: -1,
        status: -1,
        createTime: [],
      },
      dataList: [],
      // 业务人员列表
      staffList: [],
      isReload: false,
      showCommisionBut: false,
      isShow: true,
      httpurl: '',
      statInfo: [],
      payStatusArr: {},
      payStatusList: [],
      payStatus: null,
      isPayVersion: versionDef.getFunctionLimit('bkgeRecord').condition,
    };
  },
  computed: {
    ...mapGetters({
      isUpperAdm: 'user/isManage',
    }),
    ...mapState({
      userInfo: state => state.user.info,
      tsStaffExtraList: state => state.user.tsStaffExtraList,
    }),
    isCanRequest() {
      return (
        !this.isUpperAdm &&
        !versionDef.checkIsFree() &&
        this.userInfo.versionInfo.version != versionDef.NotDirectVersionDef.VersionList.PERSON
      );
    },
  },
  watch: {
    'form.createTime'(newVal) {
      this.form.createTimeStart = newVal ? newVal[0] : '';
      this.form.createTimeEnd = newVal ? newVal[1] : '';
    },
  },
  created() {
    this.$utils.logDog('showCommisionRecord');
    // 获取员工列表
    const params = {
      workId: 2,
    };
    getWorkerList(params).then(list => {
      this.staffList = list[0].map(item => {
        return {
          value: item.sid,
          label: item.name,
        };
      });
    });
    this.getBkgeDefList();
    this.$nextTick(() => {
      this.httpurl = '/ajax/staff/tsStaffBkgeRecord_h.jsp?cmd=getBkgeRecordList';
      this.isReload = true;
    });
  },
  mounted() {},
  methods: {
    /**
     * @description :获取支付状态列表
     * @author      : ADI
     * @Date        : 2021-07-23 17:42:28
     * @param        {*}
     * @return       {*}
     */
    async getBkgeDefList() {
      const [err, response] = await getBkgeDefList();
      if (err) {
        return Promise.reject(err);
      }
      //转换成需要用的数据结构
      this.payStatusArr = {};
      this.payStatusList = [{ label: '全部支付状态', value: -1 }];
      response.data.statusList.forEach(data => {
        this.payStatusArr[data.key] = data.value;
        this.payStatusList.push({
          value: data.key,
          label: data.value,
        });
      });
    },
    /**
     *设置搜索时间
     *
     * @author guoyijie
     * @date 2020-04-29
     * @param {*} val
     */
    getSearchTime(val) {
      this.form.createTime = val;
    },
    // 显示弹窗
    showPayStatus(data, event) {
      // 判断对象是否存在
      if (!this.payStatus) {
        this.payStatus = new payStatus();
        this.payStatus.form.id = data.id;
        this.payStatus.form.status = data.status;
        this.payStatus.$mount('#ts-payStatus');
        this.payStatus.parent = this;
      } else {
        this.payStatus.form.id = data.id;
        this.payStatus.form.status = data.status;
      }
      this.payStatus.isShow = true;
      this.payStatus.changeTarget({
        target: this.$refs['button' + data.id].$el,
        position: 'right',
      });
    },
    getTagList(data) {
      this.dataList = data.infoList;
      this.statInfo = data.statInfo;
      this.statInfo.stat_sumPrice = fmoney(this.statInfo.stat_sumPrice, 2);
      this.statInfo.stat_sumPayPrice = fmoney(this.statInfo.stat_sumPayPrice, 2);
      this.statInfo.stat_sumWaitPrice = fmoney(this.statInfo.stat_sumWaitPrice, 2);
    },
    reloadDataList() {
      if (this.form.createTime == null) {
        this.$utils.postMessage({
          type: 'error',
          message: '请输入正确的日期',
        });
      } else {
        this.isReload = true;
      }
    },
    // 显示佣金申请
    showCommision() {
      // 判断对象是否存在
      if (!this.commision) {
        this.commision = new commision();
        this.commision.$mount('#ts-commision');
        this.commision.parent = this;
      }
      this.commision.isShow = true;
      this.commision.getTsStaffBkgeStat();
      this.isShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.commisionBox {
  height: 100%;
  .statInfo {
    label {
      width: 71px;
      height: 12px;
      padding-left: 10px;
      margin: 10px;
      font-size: 14px;
      font-weight: 400;
      line-height: 18px;
      color: #898989;
      border-left: 1px solid #ffdadada;
      &:first-child {
        padding: 0;
        margin: 0;
        border-left: 0;
      }
    }
    span {
      width: 81px;
      height: 16px;
      font-size: 20px;
      font-weight: 400;
      line-height: 18px;
      color: #247af3;
    }
  }
  .commisionRecord {
    .contentBox {
      .radioBox {
        float: left;
        width: 100%;
        height: 30px;
        line-height: 40px;
      }
      .tipsText {
        float: left;
      }
    }
  }
  .commisionRecord_main {
    .tshu-bubble {
      .contentBox {
        padding: 20px;
      }
    }
  }
  .pro_line {
    .tshu_select {
      .tshu_select_input {
        .motivate {
          height: 34px;
          line-height: 34px;
        }
      }
    }
    .tshu_select_input {
      height: 34px;
      line-height: 34px;
    }
  }
}
</style>

<style lang="scss">
.commisionBox {
  .pro_line {
    & > .tshu_select {
      float: left;
      margin-right: 10px;
    }
    & > .tshu_input {
      float: left;
      margin-right: 10px;
    }
    & > .el-date-editor {
      float: left;
      margin-right: 10px;
      .el-range-input {
        cursor: pointer;
      }
    }
    & > .el-range-editor--small {
      width: 345px;
      height: 34px;
      .el-range-separator {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
