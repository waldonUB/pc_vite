<!--
 * @Description  : 线索详情对话框
 * @Author       : turbo
 * @Date         : 2021-06-24 16:08:31
 * @LastEditors  : turbo
 * @LastEditTime : 2021-06-30 09:35:41
-->

<template>
  <global-ts-dialog
    class="ts-detail-dialog"
    dialog-title="线索详情"
    dialog-size="large"
    no-body-padding
    :dialog-visible.sync="dialogVisible"
    :with-footer="false"
    :lock-dialog-body-height="false"
    @cancel="cancel"
  >
    <div class="dialog-content">
      <div class="base-info">
        <div class="base-content">
          <global-ts-text-img
            :img-url="customerInfo.wxHeadImgUrl"
            :img-text="customerInfo.wxName"
            :sex-color="sexColor(customerInfo.wxSex)"
          >
          </global-ts-text-img>
          <div class="name-box">
            <div v-if="customerInfo.name" class="contacts">{{ customerInfo.name }}</div>
            <div v-if="customerInfo.wxName" class="wxname">{{ customerInfo.wxName }}</div>
          </div>
          <div v-if="isHaveVersion" class="button-box">
            <global-ts-button v-if="customerInfo.isShowPickup" type="primary" size="small" @click="getMyClue">
              领取
            </global-ts-button>
            <global-ts-button
              v-if="customerInfo.isShowDistribute"
              type="primary"
              size="small"
              @click="$emit('beforeDistributeClue', [customerId])"
            >
              分配
            </global-ts-button>
            <global-ts-button
              v-if="
                customerInfo.isShowCustomer &&
                  $utils.checkHasFuncPermission(funcList, $utils.TsCommDef.FuncKeyDef.CLUE_SET_CLIENT)
              "
              type="primary"
              size="small"
              @click="setCustomer"
            >
              置为客户
            </global-ts-button>
            <global-ts-button
              v-if="customerInfo.isShowEdit && !isFromRelateClueDialog"
              type="primary"
              size="small"
              @click="editClue"
            >
              编辑信息
            </global-ts-button>
            <global-ts-button
              v-if="
                customerInfo.isShowRelease &&
                  $utils.checkHasFuncPermission(funcList, $utils.TsCommDef.FuncKeyDef.CLUE_GIVEUP_CLUE)
              "
              type="primary"
              size="small"
              @click="$emit('releaseClue', [checkOption.id])"
            >
              放弃线索
            </global-ts-button>
          </div>
        </div>
        <div class="base-detail">
          <div v-for="item in baseDetailList" :key="item.key" class="detail-wrapper">
            <div class="label">{{ item.label }}</div>
            <div class="value">
              {{
                item.key === 'staffName'
                  ? customerInfo.staffName
                    ? $utils.showStaffName(tsStaffExtraList, customerInfo.sid, customerInfo.staffName)
                    : '-'
                  : customerInfo[item.key] || '无'
              }}
            </div>
          </div>
        </div>
      </div>
      <div class="detail-info">
        <div class="slider-box">
          <div
            class="slider-item"
            :class="{ active: item.value === currentTab }"
            v-for="item of sliderList"
            :key="item.value"
            @click="currentTab = item.value"
          >
            {{ item.key }}
          </div>
        </div>
        <div class="container">
          <ts-clue
            v-if="currentTab === 0"
            :slide-val="currentTab"
            :action-list="actionList"
            :viewer-id="checkOption.viewerId"
            @getNextPage="getNextPage"
          ></ts-clue>
          <ts-custom-behavior-analysis
            v-if="currentTab === 1"
            :viewer-id="checkOption.viewerId"
          ></ts-custom-behavior-analysis>
        </div>
      </div>
      <div class="operate-box">
        <div
          class="button"
          :class="{ disabled: hasNext === 'noPrev' || clueCustomerList.length <= 1 }"
          @click="goNextPage(false)"
        >
          <global-ts-button
            :class="{ disabled: hasNext === 'noPrev' || clueCustomerList.length <= 1 }"
            type="others"
            size="small"
          >
            <global-ts-svg-icon name="icon-icon-13" color="#898989" :size="10"></global-ts-svg-icon>
          </global-ts-button>
          上一个
        </div>
        <div
          class="button"
          :class="{ disabled: hasNext === 'noNext' || clueCustomerList.length <= 1 }"
          @click="goNextPage(true)"
        >
          下一个
          <global-ts-button
            :class="{ disabled: hasNext === 'noNext' || clueCustomerList.length <= 1 }"
            type="others"
            size="small"
          >
            <global-ts-svg-icon name="icon-icon-14" color="#898989" :size="10"></global-ts-svg-icon>
          </global-ts-button>
        </div>
      </div>
    </div>
  </global-ts-dialog>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

// components
import TsClue from '@/components/base/ts-clue/index.vue';
import TsCustomBehaviorAnalysis from '@/components/base/ts-custom-behavior-analysis/index.vue';

// utils
import { postLimitVer, batchSetCustomer, getClue } from '@/utils';

// api
import { client } from '@/api';

export default {
  name: 'ClueDetailDialog',
  components: { TsClue, TsCustomBehaviorAnalysis },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    isFromRelateClueDialog: {
      type: Boolean,
      default: false,
    },
    customerId: {
      type: Number,
    },
    pageValue: {
      type: Number,
      default: 0,
    },
    clueCustomerList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      customerInfo: {},
      checkOption: {
        viewerId: '', // 旧版用的viewId, 新版用clueId
        id: '', // 线索id
      },
      currentTab: 0,
      baseDetailList: [
        {
          key: 'staffName',
          label: '成员',
        },
        {
          key: 'fromViewerName',
          label: '上级人脉',
        },
        {
          key: 'wxMobile',
          label: '电话',
        },
        {
          key: 'intentionName',
          label: '意向度',
        },
        {
          key: 'isQualityName',
          label: '优质用户',
        },
        {
          key: 'viewerLastVisitTimeName',
          label: '最近访问',
        },
        {
          key: 'allVisitTimeName',
          label: '总时长',
        },
      ],
      sliderList: [
        {
          key: '互动行为',
          value: 0,
          className: '',
          notIcon: true,
        },
      ],
      actionList: [], // 文章/名片行为
      pages: {
        pageNow: 1,
        limit: 10,
        maxPage: 2,
      },
      funcList: this.$route.meta.funcList, // 功能权限列表
    };
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        this.reSetListInfo();
        this.getViewerInfo();
        this.getActionList();
      } else {
        this.checkOption.viewerId = this.checkOption.id = 0;
      }
    },
  },
  computed: {
    ...mapState({
      version: state => state.user.info.versionInfo.version,
      tsStaffExtraList: state => state.user.tsStaffExtraList,
    }),
    ...mapGetters({
      getFunctionLimit: 'user/getFunctionLimit',
    }),
    sexColor() {
      return function(sex) {
        return sex === 1 ? 'man' : sex === 2 ? 'woman' : '';
      };
    },
    isHaveVersion() {
      return this.getFunctionLimit('clueAnalyse').condition;
    },
    hasNext() {
      const index = this.clueCustomerList.findIndex(item => item.id === this.customerInfo.id);
      if (index === 0) {
        return 'noPrev';
      } else if (index === this.clueCustomerList.length - 1) {
        return 'noNext';
      } else {
        return 'middle';
      }
    },
  },
  created() {
    this.version !== 0 &&
      this.sliderList.push({
        key: '行为分析',
        value: 1,
        className: '',
        notIcon: true,
      });

    this.pageValue === 2 &&
      this.baseDetailList.push(
        {
          key: 'releaseTimeName',
          label: '放弃时间',
        },
        {
          key: 'releaseReasonName',
          label: '放弃原因',
        },
      );
  },
  methods: {
    /**
     * 重置查询列表
     * @author waldon
     * @date 2020-07-06
     */
    reSetListInfo() {
      this.actionList = [];
      this.currentTab = 0;
      this.pages = {
        pageNow: 1,
        limit: 10,
        maxPage: 2,
      };
    },
    getViewerInfo() {
      if (!this.checkOption.id) {
        this.checkOption.id = this.customerId;
      }
      this.customerInfo = this.clueCustomerList.find(item => item.id === this.checkOption.id);
      this.checkOption.viewerId = this.customerInfo.clueId;
    },
    /**
     * 获取互动行为列表
     * @author waldon
     * @date 2020-07-06
     */
    async getActionList() {
      const { getTsClueStatRecordList } = client;
      const [err, res] = await getTsClueStatRecordList(
        Object.assign(
          {
            searchType: this.pageValue,
          },
          this.checkOption,
          this.pages,
        ),
      );
      if (err) {
        if (err.rt === 6018) {
          postLimitVer('当前版本客户动态功能未开放，请升级版本');
        } else {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
        }
        return Promise.reject(err);
      }
      const data = res.data;
      for (const key in data) {
        this.actionList.push({
          date: key,
          list: data[key],
        });
      }
      this.pages.maxPage = Math.ceil(res.total / this.pages.limit);
    },
    cancel() {
      this.$emit('update:dialogVisible', false);
    },
    /**
     * @description 置为客户
     * @author enson
     * @date 2021-03-10
     */
    async setCustomer() {
      await batchSetCustomer([this.checkOption.id]);
      this.finishOperate();
    },
    editClue() {
      this.$emit('editClue', this.customerInfo);
      this.cancel();
    },
    /**
     * @description 领取线索
     * @author enson
     * @date 2021-03-12
     */
    async getMyClue() {
      await getClue([this.checkOption.id]);
      this.finishOperate();
    },
    /**
     * 获取下一页
     * @author waldon
     * @date 2020-07-06
     */
    getNextPage() {
      if (this.currentTab !== 0) return;
      if (this.pages.maxPage > this.pages.pageNow) {
        this.pages.pageNow++;
        this.getActionList();
      }
    },
    /**
     * 详情翻页
     * @author waldon
     * @date 2020-05-09
     * @param {Boolean} type - true - 下一页  false - 上一页
     */
    goNextPage(type) {
      let message = '';
      if (this.clueCustomerList.length <= 1) {
        message = '当前页仅有一条数据';
      }
      if (!type && this.hasNext === 'noPrev') {
        message = '这是当前页第一条数据';
      }
      if (type && this.hasNext === 'noNext') {
        message = '这是当前页最后一条数据';
      }
      if (message) {
        return this.$utils.postMessage({
          type: 'warning',
          message,
        });
      }
      this.reSetListInfo();
      const currentNum = type ? 1 : -1;
      const currentIndex = this.clueCustomerList.findIndex(item => this.customerInfo.id === item.id);
      const currentclue = this.clueCustomerList.find((item, index) => index === currentIndex + currentNum);
      this.checkOption.id = currentclue.id;
      this.checkOption.viewerId = currentclue.clueId;
      this.getViewerInfo();
      this.getActionList();
    },
    finishOperate() {
      this.$emit('finish');
      this.cancel();
    },
  },
};
</script>

<style lang="scss" scoped>
@import './common.scss';
</style>
