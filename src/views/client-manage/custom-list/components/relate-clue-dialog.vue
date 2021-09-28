<!--
 * @Description  : 关联线索对话框
 * @Author       : turbo
 * @Date         : 2021-07-15 11:18:47
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-15 16:57:49
-->

<template>
  <div>
    <global-ts-dialog
      class="relate-clue-dialog"
      dialog-size="medium"
      :dialog-visible.sync="dialogVisible"
      :with-footer="false"
      @cancel="cancel"
    >
      <template #title>
        <span class="main-title">关联线索</span><span class="sub-des">（关联后可查看客户访问轨迹）</span>
      </template>
      <div class="main-content">
        <div class="clue-list-item">
          <div class="title">选择线索关联</div>
          <div class="content">
            <div class="header">
              <fa-input-search
                class="faUiSearchInput"
                placeholder="微信昵称、手机号码"
                allow-clear
                v-model="searchMoreArgs"
                @search="searchViewerList"
              >
                <template #enterButton>
                  <global-ts-svg-icon name="icon-sousuo1616" :size="16"></global-ts-svg-icon>
                </template>
              </fa-input-search>
            </div>
            <div v-if="relateViewerList.length > 0" v-infinite-scroll="load" class="list first">
              <div
                class="clue-item"
                v-for="item in relateViewerList"
                :key="item.id"
                :class="{ clickable: isHaveVersion }"
                @click="toClueDetail(item.id)"
              >
                <div class="clue-info">
                  <img class="head-img" :src="item.wxHeadImgUrl" />
                  <div class="base-info">
                    <div v-if="item.wxNames || item.wxMobileName" class="info">
                      <span class="name" v-html="item.wxNames"></span>
                      <span class="mobile" v-html="item.wxMobileName">(111)</span>
                    </div>
                    <div class="source">通过{{ item.sourceName }}访问</div>
                  </div>
                </div>
                <div class="text_but1" @click.stop="addTsClientClueRelInfo(item.clueId)">关联</div>
              </div>
            </div>
            <div v-else class="empty-tip">{{ sid === 0 ? '当前客户无跟进人，无法关联线索' : '暂无线索' }}</div>
          </div>
        </div>
        <div class="clue-list-item">
          <div class="title">已关联线索</div>
          <div class="content">
            <div class="list">
              <div class="clue-item" v-for="item in selectList" :key="item.id">
                <div class="clue-info">
                  <img class="head-img" :src="item.wxHeadImgUrl" />
                  <div class="base-info">
                    <div v-if="item.wxName || item.wxMobile" class="info">
                      <span class="name">{{ item.wxName }}</span>
                      <span class="mobile">({{ item.wxMobile }})</span>
                    </div>
                    <div v-if="item.source !== 0 && item.sourceName" class="source">通过{{ item.sourceName }}访问</div>
                  </div>
                </div>
                <div class="disable-icon" v-if="item.status === 3 || sid === 0">
                  <global-ts-tool-tips
                    effect="dark"
                    placement="top"
                    :content="sid === 0 ? '当前客户无跟进人，无法关联线索' : '该线索已被置为客户，无法取消关联'"
                  >
                    <global-ts-svg-icon name="icon-guanbi1616" color="#b2b2b2" :size="16"></global-ts-svg-icon>
                  </global-ts-tool-tips>
                </div>
                <global-ts-svg-icon
                  v-else
                  name="icon-guanbi1616"
                  color="#b2b2b2"
                  :size="16"
                  @click.stop="cancelTsClientClueRelInfo(item.id)"
                ></global-ts-svg-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </global-ts-dialog>
    <ts-clue-detail-dialog
      is-from-relate-clue-dialog
      :customer-id="customerId"
      :clue-customer-list="relateViewerList"
      :dialog-visible.sync="clueDetailDialogVisible"
    ></ts-clue-detail-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { merge } from 'lodash';

// components
import TsClueDetailDialog from '@/components/base/ts-clue-detail-dialog/index.vue';

// utils
import { getHighlight, encodeHtml, confirm } from '@/utils';

// api
import { client } from '@/api';

export default {
  name: 'RelateClueDialog',
  components: { TsClueDetailDialog },
  props: {
    cid: {
      type: Number,
      default: 0,
    },
    sid: {
      type: Number,
      default: 0,
    },
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      isNeedReload: false,
      searchMoreArgs: '',
      relateViewerList: [],
      selectList: [],
      otherCheckOption: {
        pageNow: 1,
        limit: 10,
        maxPage: 1,
      },
      customerId: 0,
      clueDetailDialogVisible: false,
    };
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        this.relateViewerList = [];
        this.selectList = [];
        this.getData();
      } else {
        if (this.isNeedReload) {
          this.isNeedReload = false;
          this.$emit('updateDetail');
        }
      }
    },
  },
  computed: {
    ...mapGetters({
      getFunctionLimit: 'user/getFunctionLimit',
    }),
    isHaveVersion() {
      return this.getFunctionLimit('clueAnalyse').condition;
    },
  },
  methods: {
    getData() {
      this.otherCheckOption.pageNow = 1;
      this.getCanRelateViewerList();
      this.getTsClientClueRelList();
    },
    async getCanRelateViewerList() {
      if (this.sid === 0) return;
      const { getCanRelateViewerList } = client;
      const [err, res] = await getCanRelateViewerList(
        merge({}, { searchMoreArgs: this.searchMoreArgs, clientId: this.cid }, this.otherCheckOption),
      );
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const list = res.data;
      this.otherCheckOption.maxPage = Math.ceil(res.total / this.otherCheckOption.limit);
      this.otherCheckOption.pageNow === 1 && (this.relateViewerList = []);
      for (const item of list) {
        if (this.searchMoreArgs) {
          item.wxNames = getHighlight(item.wxName, this.searchMoreArgs, false, 'keyword');
          item.wxMobileName = item.wxMobile
            ? '(' + getHighlight(item.wxMobile, this.searchMoreArgs, false, 'keyword') + ')'
            : '';
        } else {
          item.wxNames = encodeHtml(item.wxName);
          item.wxMobileName = item.wxMobile ? '(' + encodeHtml(item.wxMobile) + ')' : '';
        }
        this.relateViewerList.push(item);
      }
    },
    async getTsClientClueRelList() {
      const { getTsClientClueRelList } = client;
      const [err, res] = await getTsClientClueRelList({
        cid: this.cid,
        limit: 2000,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.selectList = res.data;
    },
    cancel() {
      this.$emit('update:dialogVisible', false);
    },
    load() {
      if (this.otherCheckOption.maxPage <= this.otherCheckOption.pageNow) return;
      this.otherCheckOption.pageNow++;
      this.getCanRelateViewerList();
    },
    searchViewerList() {
      this.otherCheckOption.pageNow = 1;
      this.getCanRelateViewerList();
    },
    toClueDetail(id) {
      if (!this.isHaveVersion) return;
      this.customerId = id;
      this.clueDetailDialogVisible = true;
    },
    addTsClientClueRelInfo(clueId) {
      confirm('确定关联该线索吗？', '确认关联').then(async () => {
        const { addTsClientClueRelInfo } = client;
        const [err, res] = await addTsClientClueRelInfo({
          clueId,
          cid: this.cid,
        });
        this.$utils.postMessage({
          type: err ? 'error' : 'success',
          message: err ? err.msg || '网络错误，请稍候重试' : '关联成功',
        });
        if (!err) {
          this.isNeedReload = true;
          this.getData();
          this.$utils.FdpLog('yx_glxs', {
            yx_free_text_0: '关联成功',
            yx_app_terminal: 1,
          });
        }
      });
    },
    cancelTsClientClueRelInfo(id) {
      this.$utils.FdpLog('yx_glxs', {
        yx_free_text_0: '取消关联',
        yx_app_terminal: 1,
      });
      confirm('确定取消关联该线索吗？', '确认取消').then(async () => {
        const { cancelTsClientClueRelInfo } = client;
        const [err, res] = await cancelTsClientClueRelInfo({
          id,
        });
        this.$utils.postMessage({
          type: err ? 'error' : 'success',
          message: err ? err.msg || '网络错误，请稍候重试' : '已取消线索关联',
        });
        if (!err) {
          this.isNeedReload = true;
          this.getData();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.relate-clue-dialog {
  .main-content {
    display: flex;
    border: 1px solid $color-ee;

    > .clue-list-item + .clue-list-item {
      border-left: 1px solid $color-ee;
    }
  }

  .clue-list-item {
    width: 285px;

    .title {
      @include flex-center;

      height: 47px;
      font-size: 16px;
      color: $color-00;
      background-color: $color-f7;
      border-bottom: 1px solid $color-ee;
    }

    .content {
      height: 390px;
      overflow: auto;
    }

    .list {
      margin: 12px 0 0 12px;

      &.first {
        height: 324px;
        overflow: auto;
      }
    }
  }

  .header {
    @include flex-center;

    margin-top: 20px;

    .faUiSearchInput {
      width: 246px;
    }
  }

  .clue-item {
    @include flex-between;

    width: 260px;
    padding: 8px;
    margin-bottom: 4px;
    box-sizing: border-box;

    &:last-child {
      margin-bottom: 0;
    }

    &.clickable {
      cursor: pointer;
    }

    .clue-info {
      @include flex-center;
    }

    .head-img {
      width: 40px;
      height: 40px;
      margin-right: 12px;
      border-radius: 4px;
    }

    .base-info {
      width: 150px;

      > div + div {
        margin-top: 4px;
      }
    }

    .info {
      display: flex;
      line-height: 20px;
      color: $color-53;

      .name,
      .mobile {
        @include ellipsis;
      }

      .mobile {
        min-width: 100px;
      }
    }

    .source {
      font-size: 12px;
      line-height: 16px;
      color: $color-89;
    }

    .ts-svg-icon {
      cursor: pointer;
    }
  }

  .empty-tip {
    width: 100%;
    height: 60px;
    margin-top: 12px;
    font-size: 14px;
    line-height: 60px;
    color: #6f7180;
    text-align: center;
  }
}
</style>
