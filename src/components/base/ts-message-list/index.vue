<!--
 * @Author       : ADI
 * @Date         : 2021-06-17 10:43:03
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-22 17:00:06
-->
<template>
  <div class="tanshu-message-list">
    <recycle-scroller
      v-if="!!messageList.length"
      class="recycle-scroller"
      v-infinite-scroll="handleInfiniteOnLoad"
      :items="messageList"
      :item-size="itemSize"
      keyField="id"
      :infinite-scroll-disabled="loading"
    >
      <template slot-scope="{ item }">
        <div :class="['tanshu-message-item', { active: clickId === item.id }]" @click="handleClick(item)">
          <div class="imgBox">
            <img class="headImgUrl" :src="getImgUrl(item)" alt="" />
          </div>
          <ts-ellipsis-tip bindClass="ellipsisTip" :outerShellWidth="176" :contentText="item.otherName">
          </ts-ellipsis-tip>
        </div>
      </template>
    </recycle-scroller>
    <fa-empty class="tanshu-empty" v-else>
      <svg slot="image" class="icon tshu_empty_icon" aria-hidden="true">
        <use xlink:href="#icon-queshiicon-64-40"></use>
      </svg>
    </fa-empty>
  </div>
</template>

<script>
import { RecycleScroller } from 'vue-virtual-scroller';
import TsEllipsisTip from '@/components/base/ts-ellipsis-tip/index.vue';
import { getChatDataContactRelList } from '@/api/modules/component/message-list';
import groupImg from '@/assets/image/wxWorkMsg/groupImg.png';
import { Empty } from '@fk/faicomponent';

export default {
  name: 'ts-message-list',
  components: { RecycleScroller, TsEllipsisTip, [Empty.name]: Empty },
  props: {
    itemSize: {
      // 每个item的高度 px
      type: Number,
      default: 50,
    },
    otherOptions: {
      // 指定获取消息数据的参数
      type: Object,
      default: () => {
        return {
          ownerId: '', // 当前人ID
          name: '', // 搜索名称
        };
      },
    },
  },
  data() {
    return {
      messageList: [], // 公司列表
      pageController: {
        maxPage: 2,
        pageNow: 1,
        limit: 50,
      },
      loading: false,
      clickId: -1, // 当前点击的id
    };
  },
  computed: {},
  watch: {
    otherOptions: {
      handler() {
        this.resetPageParam();
        this.initList();
      },
      deep: true,
    },
  },
  created() {
    this.initList();
  },
  mounted() {},
  methods: {
    /**
     * @description 获取消息会话列表 分页加载
     * @author enson
     * @date 2021-05-09
     */
    async getMessageList() {
      this.loading = true;
      const params = {
        ...this.pageController,
        ...this.otherOptions,
      };
      const [err, response] = await getChatDataContactRelList({
        ...params,
      });
      this.loading = false;
      if (err) {
        return Promise.resolve();
      }
      const allSize = response.data.total;
      const maxPage = Math.ceil(allSize / this.pageController.limit) || 1;
      this.pageController = Object.assign({}, this.pageController, {
        maxPage: maxPage,
        total: allSize,
      });
      return Promise.resolve(response.data);
    },
    handleInfiniteOnLoad() {
      if (this.pageController.pageNow >= this.pageController.maxPage) return;
      this.pageController.pageNow++;
      this.getMessageList().then(messageList => {
        this.messageList = this.messageList.concat(messageList);
      });
    },
    getImgUrl(itemData) {
      if (itemData.headImgUrl) return itemData.headImgUrl;
      return groupImg;
    },
    /**
     * @description 点击当前的员工/群聊
     * @author enson
     * @date 2021-05-10
     */
    handleClick(item) {
      const callNow = !this.clickTimer;
      this.clickTimer = setTimeout(() => {
        this.clickTimer = 0;
      }, 300);
      if (callNow) {
        this.clickId = item.id;
        this.$emit('handle-click', item);
      }
    },
    /**
     * @description 初始化数据
     * @author enson
     * @date 2021-05-10
     */
    initList() {
      this.getMessageList().then(messageList => {
        this.messageList = messageList;
        if (this.messageList.length >= 1) {
          const currentItem = this.messageList[0];
          this.clickId = currentItem.id;
          this.$emit('handle-click', currentItem);
        }
      });
    },
    resetPageParam() {
      this.pageController = {
        maxPage: 2,
        pageNow: 1,
        limit: 50,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
/* tanshu-message-list start */
.tanshu-message-list {
  position: relative;
  height: 100%;
  .tanshu-message-item {
    position: relative;
    display: flex;
    padding: 9px 20px;
    font-size: 14px;
    color: $color-00;
    cursor: pointer;
    background: $color-ff;
    box-sizing: border-box;
    align-items: center;
    &::after {
      position: absolute;
      bottom: 0;
      left: 0;
      display: block;
      width: 100%;
      height: 1px;
      background-color: $border-disabled-color;
      content: '';
    }
    &.active {
      background: $primary-color-bg;
    }
    .imgBox {
      margin-right: 12px;
      .headImgUrl {
        width: 32px;
        height: 32px;
        border-radius: 2px;
      }
    }
    .tanshu-ellipsis-tip {
      &.ellipsisTip {
        .contentCls {
          font-size: 14px;
          color: $color-00;
        }
      }
    }
  }
}

/* tanshu-message-list end */
</style>

<style lang="scss">
.tanshu-message-list {
  .recycle-scroller {
    height: 100%;
  }
  .vue-recycle-scroller__item-view {
    &.hover {
      .tanshu-message-item {
        background: #f5f7fa;
        &.active {
          background: $primary-color-bg;
        }
      }
    }
  }
  .tanshu-empty {
    &.fa-empty {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
