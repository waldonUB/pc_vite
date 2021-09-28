<template>
  <div class="tshu_pagination">
    <div class="leftPart">
      <slot name="leftPart">
        共有{{ allSize }}条记录，每页显示
        <global-ts-select class="paginationSelect" :list="selectPage" :direction="direction" v-model="nowPageSize">
        </global-ts-select>
      </slot>
    </div>
    <div class="rightPart">
      <global-ts-button class="jumpPage" type="others" size="small" @click="goNextPage(false)">
        <span class="prePage">
          <global-ts-svg-icon :class="noGoLeft ? 'disabled' : ''" class="icon" name="icon-icon-13" />
        </span>
      </global-ts-button>
      <span class="showNowPage">{{ nowPage }} / {{ maxPage }}</span>
      <button class="jumpPage" type="others" size="small" @click="goNextPage(true)">
        <span class="nextPage">
          <global-ts-svg-icon :class="noGoRight ? 'disabled' : ''" class="icon" name="icon-icon-14" />
        </span>
      </button>
      <global-ts-input
        class="tshuPaination_num"
        v-model="userTurnPage"
        tstype="text"
        placeholder=""
        @input="changeValue"
      >
      </global-ts-input>
      <global-ts-button class="jumpNumberPage" type="others" size="small" @click="jumptoPage">跳转</global-ts-button>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash';
import { post, manageRegxp, postMessage } from '@/utils';

export default {
  name: 'ts-pagination',
  data() {
    return {
      allSize: 0,
      nowPage: 1,
      nowPageSize: 10,
      maxPage: 1,
      userTurnPage: 1,
      noGoLeft: true,
      noGoRight: true,
      changeCount: 0,
      nowCount: 0,
    };
  },
  watch: {
    maxPage(value) {
      this.noGoRight = this.nowPage == value;
    },
    nowPage(value) {
      this.userTurnPage = value;
      this.noGoRight = value == this.maxPage;
      this.noGoLeft = value == 1;
    },
    isReload(value) {
      if (value) {
        // 等待下一时间片执行。可以让requestParam改变的时候，自动跳回第一页
        this.$nextTick(() => {
          this.getData();
          this.$emit('reloadfinish');
        });
      }
    },
    nowPageSize(value) {
      this.setOtherPage(1);
    },
    httpurl(value) {
      this.getData();
    },
    requestParam: {
      handler(value) {
        if (this.httpurl) {
          this.changeCount++;
        }
      },
      deep: true,
    },
  },
  model: {
    prop: 'tableData',
    event: 'getData',
  },
  props: {
    tableData: [Array, Object], //当前的table数据
    requestParam: Object, //请求的相关参数
    httpurl: {
      type: String,
      require: true,
    },
    // false: application/x-www-form-urlencoded  true: application/json
    httpConfigByJson: {
      type: Boolean,
      default: false,
    },
    isJson: {
      type: Boolean,
      default: false,
    },
    isReload: Boolean,
    errorHandle: Function,
    limit: {
      type: Number,
      default: 0,
    },
    limitIndex: {
      type: Number,
      default: 0,
    },
    selectPage: {
      type: Array,
      default: () => [
        {
          value: 10,
          label: 10,
        },
        {
          value: 50,
          label: 50,
        },
        {
          value: 100,
          label: 100,
        },
      ],
    },
    direction: {
      type: String,
      default: 'up',
    },
  },
  created() {
    this.nowPageSize = this.selectPage[0].value;
    if (this.limitIndex) {
      // 兼容增加limit时，下面的选项也改变
      this.nowPageSize = this.selectPage[this.limitIndex].value;
    }
    this.getData();
  },
  methods: {
    getData: debounce(function() {
      // turbo 加个 200ms 的防抖
      if (!this.httpurl) {
        return;
      }
      if (this.changeCount != this.nowCount) {
        this.nowPage = 1;
        this.nowCount = this.changeCount;
      }
      this.$emit('sendPageInfo', {
        pageNow: this.nowPage,
        limit: this.nowPageSize,
      });
      post(
        this.httpurl,
        Object.assign(
          {
            pageNow: this.nowPage,
            limit: this.nowPageSize,
          },
          this.requestParam,
        ),
        {},
        this.httpConfig(),
      ).then(response => {
        if (response && response.success) {
          this.allSize = response.total;
          this.maxPage = Math.ceil(this.allSize / this.nowPageSize) || 1;
          const pages = {
            limit: this.nowPageSize,
            maxPage: this.maxPage,
            pageNow: this.nowPage,
          };
          this.$emit('getData', response.data, response, pages);
        } else {
          if (this.errorHandle) {
            this.errorHandle.call(this, response);
          } else {
            postMessage({
              type: 'error',
              message: response.msg || '网络错误，请稍候重试',
            });
          }
        }
      });
      this.$emit('update:isReload', false);
    }, 200),
    setPageSize(number) {
      this.nowPageSize = number;
      this.getData();
    },
    setOtherPage(pageNo) {
      if (pageNo > this.maxPage) {
        if (this.nowPage == this.maxPage) {
          return;
        }
        pageNo = this.maxPage;
      }
      if (pageNo <= 0) {
        return;
      }
      this.nowPage = pageNo;
      this.getData();
    },
    goNextPage(flag) {
      var num = 1;
      if (!flag) {
        num *= -1;
      }
      this.setOtherPage(this.nowPage + num);
    },
    jumptoPage() {
      if (!manageRegxp(5).test(this.userTurnPage)) {
        return;
      }
      this.setOtherPage(parseInt(this.userTurnPage));
    },
    //限制只能输入数字
    changeValue() {
      if (!manageRegxp(5).test(this.userTurnPage)) {
        this.$nextTick(() => {
          this.userTurnPage = this.userTurnPage.replace(manageRegxp(6), '');
        });
      }
    },
    httpConfig() {
      return this.httpConfigByJson
        ? {
            headers: {
              'content-type': 'application/json;charset=UTF-8',
            },
          }
        : {};
    },
  },
};
</script>

<style lang="scss" scoped>
.tshu_pagination {
  @include flex-between;

  width: 100%;
  height: 40px;
  padding-top: 20px;
  font-size: 14px;
  font-weight: 400;
  color: $color-53;
  .leftPart {
    vertical-align: middle;
    .red {
      color: red;
    }
    .paginationSelect {
      display: inline-block;
      width: 70px;
      height: 34px;
      margin-left: 4px;
      vertical-align: middle;
      .tshu_select_input {
        height: 34px;
        .motivate {
          height: 34px;
          line-height: 34px;
          cursor: pointer;
        }
      }
    }
  }
  .rightPart {
    .jumpPage {
      position: relative;
      display: inline-block;
      width: 34px;
      height: 34px;
      min-width: 34px;
      vertical-align: middle;
      background: #ffffff;
      border: 1px solid $border-disabled-color;
      border-radius: 4px;
      box-sizing: border-box;
      svg {
        position: absolute;
        top: 50%;
        left: 50%;
        height: 10px;
        color: $color-b2;
        transform: translate(-50%, -50%);
        &.disabled {
          color: #e5e5e5 !important;
        }
      }
      &:hover {
        svg {
          color: $color-89;
        }
      }
    }
    .showNowPage {
      display: inline-block;
      margin: 0 15px;
      vertical-align: middle;
    }
    .tshuPaination_num {
      display: inline-block;
      width: 70px;
      margin: 0 4px;
      vertical-align: middle;
      .el-input__inner {
        line-height: 34px;
      }
    }
    .jumpNumberPage {
      display: inline-block;
      height: 34px;
      min-width: 50px;
      font-size: 14px;
      font-weight: 400;
      line-height: 32px;
      color: $color-53;
      text-align: center;
      vertical-align: middle;
    }
    .jumpNumberPage,
    .jumpPage {
      cursor: pointer;
    }
  }
}
</style>
