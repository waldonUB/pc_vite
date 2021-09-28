<!--
 * @Author       : ADI
 * @Date         : 2021-08-04 10:12:23
 * @LastEditors  : ADI
 * @LastEditTime : 2021-08-03 17:36:14
-->
<template>
  <global-ts-dialog
    class="moreFilterDialog wxCorpDialog center"
    :dialog-visible.sync="dialogVisible"
    dialog-size="medium"
    :with-reset-btn="true"
    :with-cancel-btn="false"
    @cancel="cancel"
    @sure="sure"
    @reset="reset"
  >
    <template #title> <span class="mainTitle">高级筛选</span><span class="subDes">（支持模糊筛选）</span> </template>
    <div class="moreFilterDialogContent" ref="moreFilterDialogContentRef">
      <div class="selectBox" v-for="(item, index) in allSelectList" :key="index">
        <div class="selectTitle">{{ item.name }}</div>
        <global-ts-input v-if="isFilterInput(item.rlPropId)" class="moreFilterInput" size="large" v-model="item.value">
        </global-ts-input>
        <fa-select
          v-else
          class="moreFilterInput moreFilterSelectInput"
          placeholder="请选择"
          option-label-prop="label"
          v-model="item.value"
          dropdownClassName="mallFilterSelect"
          @change="handleSelectChange($event, item)"
          :getPopupContainer="() => $refs.moreFilterDialogContentRef"
        >
          <fa-select-option
            :value="item.propValId"
            :label="item.val"
            v-for="(item, index) in item.propValList"
            :key="index"
          >
            {{ item.val }}
          </fa-select-option>
        </fa-select>
      </div>
    </div>
  </global-ts-dialog>
</template>

<script>
import { post } from '@/utils';

export default {
  name: 'more-filter-dialog',
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    sourceList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      requestParam: {
        // 选择后的参数
        propList: [],
      },
      initMoreRequestParam: {
        // 默认的初始化请求参数
        name: '',
        type: -1,
        selfStatus: -1,
      },
      selectList: [
        {
          // 固定的筛选数据
          rlPropId: 'name',
          value: '',
          defaultValue: '',
          name: '商品名称',
        },
        {
          rlPropId: 'type',
          name: '商品来源',
          defaultValue: 0,
          value: 0,
          propValList: [],
        },
        {
          rlPropId: 'selfStatus',
          value: -1,
          defaultValue: -1,
          name: '上架状态',
          propValList: [
            {
              val: '不限',
              propValId: -1,
            },
            {
              val: '上架',
              propValId: 0,
            },
            {
              val: '下架',
              propValId: 1,
            },
          ],
        },
      ],
      newSelectList: [], // 用户自定义的商品参数筛选数据
    };
  },
  computed: {
    allSelectList() {
      return this.selectList.concat(this.newSelectList);
    },
  },
  watch: {
    dialogVisible(nVal) {
      if (nVal) {
        this.requestParam = Object.assign({}, { ...this.initMoreRequestParam }, { propList: [] });
        this.setSelectList();
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * @description 判断是否显示输入框
     * @author enson
     * @date 2020-12-13
     */
    isFilterInput(rlPropId) {
      return rlPropId && ['name'].includes(rlPropId);
    },
    /**
     * 重置筛选
     * @author waldon
     * @date 2020-06-18
     */
    reset() {
      this.selectList.forEach(item => {
        this.$set(item, 'value', item.defaultValue);
      });
      this.newSelectList.forEach(item => {
        this.$set(item, 'value', item.defaultValue);
      });
      this.requestParam = Object.assign({}, { ...this.initMoreRequestParam }, { propList: [] });
      this.$emit('reset', this.initMoreRequestParam);
    },
    /**
     * @description 确定的回调
     * @author enson
     * @date 2020-12-13
     */
    sure() {
      this.selectList.forEach(item => {
        this.requestParam[item.rlPropId] = item.value;
      });
      this.newSelectList.forEach(item => {
        this.requestParam.propList.push({
          rlPropId: item.rlPropId,
          propValId: item.value || -1,
        });
      });
      const requestParam = Object.assign({}, this.requestParam, {
        propList: JSON.stringify(this.requestParam.propList),
      });
      this.$emit('sure', requestParam);
      this.cancel();
    },
    /**
     * 取消对话框
     * @author waldon
     * @date 2020/6/10
     */
    cancel() {
      this.$emit('update:dialogVisible', false);
    },
    /**
     * @description 获取额外筛选的参数
     * @author enson
     * @date 2020-12-18
     * @returns
     */
    setSelectList() {
      return new Promise(resolve => {
        post('/ajax/product/tsProductProp_h.jsp?cmd=getTsProductPropList', {
          id: -1,
          fromSelect: true,
        }).then(response => {
          if (response && response.success) {
            const newSelectList = response.data;
            const cacheList = [].concat(this.newSelectList);
            let cacheItem = null;
            this.newSelectList = [];
            newSelectList.forEach(element => {
              cacheItem = cacheList.find(item => item.rlPropId === element.rlPropId);
              this.newSelectList.push({
                name: element.name,
                rlPropId: element.rlPropId, // 参数id
                value: (cacheItem && cacheItem.value) || element.defaultValue, // 选中的参数项的id,即propValId
                defaultValue: element.defaultValue || '', // 默认选中的值
                propValList: element.propValList, // 参数列表
              });
            });

            if (this.sourceList.length > 0) {
              const sourceIndex = this.selectList.findIndex(item => item.rlPropId === 'type');
              const sourceList = this.sourceList.map(item => {
                return {
                  val: item.key,
                  propValId: item.value,
                };
              });
              this.$set(this.selectList[sourceIndex], 'propValList', sourceList);
            }
            resolve();
          } else {
            this.$utils.postMessage({
              type: 'error',
              message: response.msg || '网络错误，请稍候重试',
            });
          }
        });
      });
    },
    handleSelectChange(value, item) {
      this.$set(item, 'value', value);
    },
  },
};
</script>

<style lang="scss" scoped>
.moreFilterDialog {
  .mainTitle {
    font-size: 16px;
    color: $color-00;
  }
  .tanshu-selectList {
    .tagBox {
      width: 270px;
      margin-right: 0;
    }
  }
  .subDes {
    font-size: 14px;
    color: $color-89;
  }
  .moreFilterDialogContent {
    display: flex;
    width: 560px;

    /* height: 247px; */
    box-sizing: border-box;
    flex-flow: row wrap;
    align-content: flex-start;
    .selectBox {
      margin-bottom: 20px;
      flex: 0 0 auto;
      .selectStaff {
        min-height: 40px;
        margin-top: 10px;
        line-height: 40px;
      }
      &:nth-child(2n + 1) {
        margin-right: 20px;
      }
      .selectTitle {
        width: 270px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .moreFilterInput {
        width: 270px;
        margin-top: 10px;
      }
      .tshu_select {
        &.moreFilterInput {
          display: block;
        }
      }
    }
  }
  .moreFilterSelectInput {
    height: 40px;
    line-height: 40px;
  }
}
</style>

<style lang="scss">
.mallFilterSelect.fa-select-dropdown {
  z-index: 3000;
}
.moreFilterDialog {
  .moreFilterDialogContent {
    .selectBox {
      .el-input__inner {
        min-height: 40px !important;
        margin-right: 0 !important;
      }
    }
  }
  .moreFilterSelectInput {
    .fa-select-selection--single {
      height: 40px;
      line-height: 40px;
    }
    .fa-select-selection__rendered {
      height: 40px;
      line-height: 40px;
    }
  }
}
</style>
