<!--
 * @Description  : 阶段设置组件
 * @Author       : turbo
 * @Date         : 2021-07-14 13:49:00
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-14 16:17:16
-->

<template>
  <div class="status-step">
    <div ref="stepsView" class="step-box">
      <div
        :class="[
          'step-item',
          { 'step-item_first': index === 0 },
          { 'step-item_end': index === statusList.length - 1 },
          { active: item.sort <= currentSort || isEndStep },
        ]"
        v-for="(item, index) in frontStepList"
        :key="index"
        @click="setStatus(item)"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="line"></div>
    <el-popover popper-class="customList-popover" placement="bottom" trigger="click" @show="showEndStatus">
      <div class="popover-item" v-for="(item, index) in endStepList" :key="index" @click="setStatus(item, true, index)">
        {{ item.name }}
      </div>
      <template #reference>
        <div
          :class="['end-status', { active: isEndStep }, { 'end-status_big': endText.length > 4 }]"
          @click="handleClickEndStatus"
        >
          {{ endText || '成交情况' }}
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script>
// utils
import { confirm } from '@/utils';

// api
import { client } from '@/api';

export default {
  name: 'StatusStep',
  props: {
    cid: {
      // 客户id
      type: Number,
    },
    followStatus: {
      // 客户当前阶段
      type: Number,
    },
    statusList: {
      // 跟进阶段列表
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentId: null, // 当前跟进阶段id
      currentSort: 0, // 当前阶段在步骤条中的排序
      endText: '', // 成交情况文案
      isEndStep: false, // 是否到了最后一步
    };
  },
  watch: {
    followStatus(newVal) {
      // this.currentId = newVal == 0 ? this.statusList[0].id : newVal;
      // 考虑被删除阶段的可能性
      if (newVal === 0) {
        this.currentId = this.statusList[0].id;
        this.currentSort = this.statusList[0].sort;
      } else {
        const currentItem = this.statusList.find(item => {
          // 判断当前所处阶段是否被删除，如果被删除则返回第一个阶段
          return item.id === newVal;
        });
        this.currentId = currentItem ? newVal : this.statusList[0].id;
        this.currentSort = currentItem ? currentItem.sort : this.statusList[0].sort;
      }
    },
    currentId(newVal) {
      this.endText = '';
      let followStatusName = ''; // 客户当前阶段名称
      this.isEndStep = this.endStepList.find(item => {
        if (item.id === newVal) {
          this.endText = item.name;
          followStatusName = item.name;
          return true;
        }
      });

      // 让当前跟进阶段滚动居中
      let curIndex, left;
      const boxScrollWidth = this.$refs.stepsView.scrollWidth;
      if (!this.isEndStep) {
        this.frontStepList.find((item, index) => {
          if (item.id === newVal) {
            followStatusName = item.name;
            curIndex = index;
            return true;
          }
        });
        const chilren = this.$refs.stepsView.children[curIndex];
        const stepLeft = chilren.offsetLeft - 20;
        left = stepLeft;
      } else {
        left = boxScrollWidth;
      }

      this.$refs.stepsView.scrollTo(left, 0);
      this.$emit('setFollowStatusName', followStatusName);
    },
  },
  computed: {
    frontStepList() {
      // 前面的列表
      return this.statusList.slice(0, -2);
    },
    endStepList() {
      // 成交情况跟进阶段列表
      return this.statusList.slice(-2);
    },
  },
  methods: {
    /**
     * 设置客户的当前跟进阶段
     * @author lymn
     * @date 2020-09-27
     * @param {Object} item 阶段对象
     * @param {Boolean} isEnd 是否属于成交情况阶段
     * @param {Number} index 0 - 成交, 1 - 未成交
     */
    setStatus(item, isEnd, index) {
      if (isEnd) {
        const freeText = index === 0 ? '成交' : '未成交';
        this.$utils.FdpLog('yx_gjjdjg', {
          // 跟进阶段结果
          yx_free_text_0: `点击${freeText}`,
          yx_app_terminal: 1,
        });
      } else {
        this.$utils.FdpLog('yx_gjjd', {
          // 跟进阶段
          yx_free_int_0: item.id,
          yx_app_terminal: 1,
        });
      }
      confirm(`确认该客户已进入${item.name}阶段？`).then(async () => {
        const { setTsClientFollowStatus } = client;
        const [err, res] = await setTsClientFollowStatus({
          cid: this.cid,
          followStatus: item.id,
        });
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        this.currentId = item.id;
        this.currentSort = item.sort;
        this.$utils.FdpLog('yx_gjjd', {
          yx_free_int_0: isEnd ? '成功修改成交情况' : '成功修改跟进阶段',
          yx_app_terminal: 1,
        });
      });
    },
    showEndStatus() {
      this.$utils.FdpLog('yx_gjjdjg', {
        // 跟进阶段结果
        yx_free_text_0: '弹窗曝光',
        yx_app_terminal: 1,
      });
    },
    /**
     *点击了成交情况
     * @author wuying
     * @date 2021-07-05
     */
    handleClickEndStatus() {
      this.$utils.FdpLog('yx_khxqy', {
        yx_free_text_1: '修改成交情况',
        yx_app_terminal: 1,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.status-step {
  display: flex;
  margin-bottom: 20px;

  .step-box {
    display: flex;
    width: auto;
    height: 50px;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .step-item {
    @include flex-center;

    width: 136px;
    height: 34px;
    min-width: 115px;
    font-size: 12px;
    cursor: pointer;
    background-image: url('~@/assets/image/customList/step_2.png');
    background-size: 100% 100%;
    flex: 0 0 auto;

    &.active {
      color: $color-ff;
      background-image: url('~@/assets/image/customList/direct_step_active_2.png');
    }

    &.step-item_first {
      background-image: url('~@/assets/image/customList/step_1.png');

      &.active {
        background-image: url('~@/assets/image/customList/direct_step_active_1.png');
      }
    }

    &.step-item_end {
      background-image: url('~@/assets/image/customList/step_3.png');

      &.active {
        background-image: url('~@/assets/image/customList/direct_step_active_3.png');
      }
    }
  }

  .line {
    display: inline-block;
    width: 1px;
    height: 34px;
    margin: 0 20px;
    background: #eeeeee;
  }

  .end-status {
    @include flex-center;

    width: 100px;
    height: 34px;
    cursor: pointer;
    background-color: $color-f7;

    &.active {
      color: $color-ff;
      background: $primary-color;
    }

    &.end-status_big {
      width: 164px;
    }
  }
}

.popover-item {
  @include flex-center;

  width: 100%;
  height: 36px;
  padding: 0 35px;
  color: $color-89;
  cursor: pointer;
  box-sizing: border-box;
}
</style>
<style lang="scss">
.el-popover {
  &.customList-popover {
    min-width: 0;
    padding: 12px 0;
  }
}
</style>
