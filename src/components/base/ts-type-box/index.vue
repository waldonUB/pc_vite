<!--
 * @Author       : ADI
 * @Date         : 2021-03-31 16:51:20
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-29 13:56:22
-->
<template>
  <div class="tanshu-typeBox">
    <div class="typeWrap">
      <global-ts-tool-tips
        :disabled="item.name.length <= 5"
        v-for="item in typeShowList"
        :key="item.id"
        class="item"
        effect="dark"
        :content="item.name"
        placement="bottom-start"
      >
        <global-ts-button
          :key="item.id"
          :type="type == item.id ? 'primary' : 'others'"
          size="medium"
          ref="button"
          @click="changeType(item.id)"
        >
          <span class="btn_label">{{ item.name }}</span>
        </global-ts-button>
      </global-ts-tool-tips>
      <global-ts-tool-tips
        v-show="showAddBtn && isManage"
        class="item"
        effect="dark"
        :content="addBtnTip"
        placement="bottom-start"
      >
        <global-ts-button
          class="addClassify"
          :class="typeList.length + initList.length > lineNum - 1 ? 'toright' : ''"
          type="default"
          size="medium"
          icon="icon-icon-11"
          ref="button"
          @click="showClassifyManager"
        >
        </global-ts-button>
      </global-ts-tool-tips>
    </div>
    <global-ts-button
      v-show="typeList.length + initList.length > lineNum"
      class="getMoreicon"
      type="default"
      size="medium"
      :icon="isShowAll ? 'icon-icon-9' : 'icon-icon-8'"
      ref="button"
      @click="getMore"
    >
    </global-ts-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ts-type-box',
  props: {
    showAddBtn: {
      // 是否显示分类管理按钮
      type: Boolean,
      default: true,
    },
    typeList: {
      // 分类列表
      type: Array,
      default: () => [],
    },
    initList: {
      // 初始默认列表
      type: Array,
      default: () => {
        return [];
      },
    },
    selectType: {
      // 选中项
      type: Number,
      default: -1,
    },
    addBtnTip: {
      type: String,
      default: '分类管理',
    },
  },
  data() {
    return {
      type: -1, // 选中项
      screenWidth: document.body.clientWidth, // 屏幕宽度
      isShowAll: false, // 是否显示所有分类选项
      lineNum: -1,
    };
  },
  watch: {
    selectType(newVal) {
      this.type = newVal;
    },
    screenWidth: {
      handler(newVal) {
        if (newVal > 1992) {
          this.lineNum = 12;
        } else if (newVal > 1862) {
          this.lineNum = 11;
        } else if (newVal > 1721) {
          this.lineNum = 9;
        } else if (newVal > 1590) {
          this.lineNum = 9;
        } else if (newVal > 1463) {
          this.lineNum = 8;
        } else {
          this.lineNum = 7;
        }
      },
      immediate: true,
    },
  },
  mounted() {
    const that = this;
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth;
        that.screenWidth += 1;
      })();
    };
  },
  computed: {
    ...mapGetters({
      isManage: 'user/isManage',
    }),
    typeShowList() {
      // 展示出来的分类
      if (!this.isShowAll) {
        return this.initList.concat(this.typeList).slice(0, this.lineNum);
      } else {
        return this.initList.concat(this.typeList);
      }
    },
  },
  methods: {
    /**
     * 点击分类管理按钮
     */
    showClassifyManager() {
      this.$emit('showManage'); // 显示分类管理页
    },
    /**
     * 切换分类
     * @param {*} id 选择的分类id
     */
    changeType(id) {
      this.type = id;
      this.$emit('changeClassify', id);
    },
    /**
     * 展示全部分类
     */
    getMore() {
      this.isShowAll = !this.isShowAll;
    },
  },
};
</script>

<style lang="scss" scoped>
/* 分类列表组件 start */
.tanshu-typeBox {
  position: relative;
  margin-bottom: 20px;
  .typeWrap {
    width: 92%;
  }
  .global-button {
    margin-top: 10px;
    margin-right: 10px;
    margin-left: 0;
    & > .btn_label {
      display: inline-block;
      width: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .global-button-size-medium {
    min-width: 100px;
  }
  .addClassify {
    display: inline-flex;
    width: 40px !important;
    height: 40px;
    min-width: 40px;
    vertical-align: top;
    background: #fafafa;
    border: 1px solid #eeeeee;
    border-radius: 4px;
    align-items: center;
    justify-content: center;
  }
  .toright {
    position: absolute;
    top: 10px;
    right: 61px;
    margin-top: 0 !important;
  }
  .getMoreicon {
    position: absolute;
    top: 10px;
    right: 0;
    display: inline-flex;
    width: 40px !important;
    height: 40px;
    margin-top: 0 !important;
    background: #fafafa;
    border: 1px solid #eeeeee;
    border-radius: 4px;
    align-items: center;
    justify-content: center;
  }
}
.tanshu-typeBox .addClassify,
.tanshu-typeBox .getMoreicon {
  min-width: auto;
  ::v-deep .icon {
    margin-right: 0 !important;
    color: $color-b2;
  }
}

/* 分类列表组件 end */
</style>
