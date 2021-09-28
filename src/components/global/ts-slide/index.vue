<template>
  <div class="ts-slide-card" :class="{ hasPadding }">
    <global-ts-tool-tips
      v-for="(item, index) in targetArray"
      :key="index"
      :disabled="!isWrapToopTips || item.disabled"
      :content="item[changeKey.key]"
    >
      <span
        v-if="!item.isList"
        class="slide-children"
        :class="item.className"
        @click="changeStatus($event, item[changeKey.value], index)"
        ref="sliderItem"
        :style="item.childrenMaxWidth"
      >
        {{ item[changeKey.key] }}
        <el-tooltip
          v-if="item.sliderIcon"
          offset="10"
          :content="item.content"
          class="sliderIconBox"
          effect="dark"
          placement="top-start"
        >
          <global-ts-svg-icon class="icon sliderIcon" :name="'icon-' + item.sliderIcon" />
        </el-tooltip>
      </span>
      <span class="slide-children slide-children-array" ref="sliderItem" v-else :class="item.className">
        <global-ts-select
          class="moreTag"
          :list="item.list"
          :selectkey="{ label: 'name', value: 'id' }"
          v-model="status"
          @change="changeMoreTagStatus"
        >
          <global-ts-svg-icon slot="inputButton" class="icon" name="icon-icon-18" />
        </global-ts-select>
      </span>
    </global-ts-tool-tips>
    <i class="slider" :style="cssLeft" ref="slider"> </i>
  </div>
</template>

<script>
export default {
  name: 'ts-slide',
  data() {
    return {
      status: 0,
      target: null,
      targetArray: this.slidArray,
    };
  },
  props: {
    slidArray: {
      type: Array,
      require: true,
    },
    changeKey: {
      type: Object,
      default: function() {
        return {
          value: 'value',
          key: 'key',
        };
      },
    },
    activeNum: [Number, String], // 初始选项
    issave: {
      type: Boolean,
      default: false,
    },
    isWrapToopTips: {
      type: Boolean,
      default: false,
    },
    maxWidth: Number,
    length: Number,
    childMaxWidth: Number,
    withIcon: {
      type: Boolean,
      default: false,
    }, // 是否存在图标
    hasPadding: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    changeMoreTagStatus(value, hasOnArray) {
      const num = this.length;
      if (hasOnArray) {
        this.changeStatus(
          {
            target: this.$refs.sliderItem[num + 1],
          },
          value,
        );
      }
    },
    changeStatus(e, value, index) {
      this.target = null; // 初始化值,刷新下划线位置
      if (this.withIcon) {
        // 兼容有图标的情况，不影响之前的逻辑
        this.target = this.getSpanNode(e.target);
      } else {
        this.target = e.target;
      }
      if (this.issave) {
        value = this.activeNum;
        const index = this.targetArray.findIndex(item => item[this.changeKey.value] === value);
        this.target = this.$refs.sliderItem[index];
      }
      this.status = value;
      this.targetArray.forEach(data => {
        data.className = '';
        if (data.isList) {
          data.list.forEach(array_data => {
            if (array_data.id == this.status) {
              data.className = 'isActive';
              if (data.notIcon) {
                data.className += 'hideSlider';
              }
            }
          });
        } else {
          if (data[this.changeKey.value] == this.status) {
            data.className = 'isActive';
            if (data.notIcon) {
              data.className += 'hideSlider';
            }
          }
        }
      });
      this.$emit('changeStatus', e, value, index);
    },
    /**
     * @function 初始化数据
     * @lastModified by lymn 处理之前旧逻辑的bug，activeNum作为slidArray数组中的value值引用
     */
    initStatus() {
      if (this.targetArray.length > 0) {
        this.$nextTick(() => {
          // 旧逻辑bug:这里activeNum的逻辑和下面Watch activeNum的逻辑冲突了,这里作为索引值来用,下面监听变化时确作为slidArray数组中的value值来用
          // let index = 0;
          // if (this.activeNum) index = this.activeNum - 1 // 如果有初始值，则取初始值
          // // 没有初始默认选项的情况下才初始化状态
          // this.changeStatus({
          // 	target: this.$refs.sliderItem[index]
          // }, this.targetArray[index][this.changeKey.value], index);

          // 新逻辑，activeNum作为slidArray数组中的value值引用
          let target, value;
          this.targetArray.find((data, index) => {
            if (data[this.changeKey.value] == this.activeNum) {
              target = this.$refs.sliderItem[index];
              value = this.activeNum;
              return true;
            }
          });
          if (!target) {
            // 兼容旧逻辑，默认选中第一项
            target = this.$refs.sliderItem[0];
            value = this.targetArray[0][this.changeKey.value];
          }
          this.changeStatus(
            {
              target,
            },
            value,
          );
        });
      }
    },
    /**
     * 兼容有图标的情况，递归获取span元素来控制滑块
     * @author waldon
     * @date 2020-06-01
     * @param {*} target
     * @returns
     */
    getSpanNode(target) {
      let lastTarget = null;
      if (target && target.nodeName === 'SPAN') {
        return target;
      }
      if (target && target.parentElement) {
        lastTarget = this.getSpanNode(target.parentElement);
      }
      return lastTarget;
    },
  },
  updated() {
    if (this.isWrapToopTips) {
      this.targetArray.forEach((data, index) => {
        data.disabled = this.$refs.sliderItem[index].clientWidth < this.maxWidth;
        data.childrenMaxWidth = 'max-width: ' + this.childMaxWidth + 'px';
      });
    }
  },
  computed: {
    cssLeft: function() {
      if (!this.target) {
        return;
      }
      var width = this.target.clientWidth;
      var left = this.target.offsetLeft;
      return 'left:' + left + 'px; width:' + width + 'px;';
    },
  },
  created() {
    this.initStatus();
  },
  watch: {
    slidArray: function(value) {
      this.targetArray = value;
      this.initStatus();
    },
    activeNum: function() {
      this.targetArray.forEach(data => {
        data.className = '';
        if (data.isList) {
          data.list.forEach(array_data => {
            if (array_data.id == this.activeNum) {
              data.className = 'isActive';
              if (data.notIcon) {
                data.className += 'hideSlider';
              }
            }
          });
        } else {
          if (data[this.changeKey.value] == this.activeNum) {
            data.className = 'isActive';
            if (data.notIcon) {
              data.className += 'hideSlider';
            }
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/* 滚动条样式 */
.ts-slide-card {
  position: relative;
  height: 26px;

  /* border-bottom: 1px solid $border-disabled-color; */

  /* width:100%; */
  padding: 0;

  /* padding-bottom: 12px; */
  clear: both;
  line-height: 26px;

  &.hasPadding {
    padding-bottom: 17px;
  }

  .slider {
    position: absolute;
    bottom: 0;
    left: 6px;
    width: 48px;
    height: 3px;
    background: $primary-color;
    transition: left 0.3s;
    &.hideSlider {
      opacity: 0;
    }
  }
  .slide-children {
    float: left;
    padding: 0 6px;
    margin-right: 60px;
    font-size: 16px;
    font-weight: 400;
    color: #000000;
    text-decoration: none;
    cursor: pointer;
    &.slide-children-array {
      position: relative;
      display: inline-block;
      width: 18px;
      height: 18px;
      overflow: visible !important;
      vertical-align: middle;
      cursor: pointer;
      .icon {
        margin: 0;
        font-size: 18px;
        color: $color-b2;
      }
      &:hover {
        .icon {
          color: $primary-color;
        }
      }
      .tshu_select {
        width: 100%;
        height: 18px;
        .tshu_select_option {
          top: 16px;
          left: -52px;
          width: 133px;
          li {
            height: 26px;
            line-height: 26px;
          }
        }
        .tshu_select_input {
          width: 18px;
          height: 18px;
          line-height: 18px;
          border-radius: 0;
        }
      }
    }
    .icon {
      &.sliderIcon {
        color: $primary-color;
      }
    }
  }
  .isActive {
    color: $primary-color;
  }
}
.directSale {
  .ts-slide-card {
    .slider {
      background: $primary-color;
    }
    .slide-children {
      .icon {
        &.sliderIcon {
          color: $primary-color;
        }
      }
      &.slide-children-array {
        &:hover {
          .icon {
            color: $primary-color;
          }
        }
      }
    }
    .isActive {
      color: $primary-color;
    }
  }
}
</style>
