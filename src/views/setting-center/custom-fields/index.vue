<!--
 * @Description  : 客户设置
 * @Author       : turbo
 * @Date         : 2021-03-30 14:15:11
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-13 10:30:45
-->

<template>
  <div class="customFields" ref="customFieldsRef">
    <component v-if="currentComponent == 'fieldsSetting'" :is="currentComponent"></component>
    <div v-else>
      <global-ts-header>
        <template v-slot:leftPart>客户设置</template>
      </global-ts-header>
      <div class="pro_listBox" v-cloak>
        <global-ts-slide
          class="tanshu-bottomBorder"
          :activeNum="activeNum"
          :slidArray="slideList"
          @changeStatus="changeComponetSlider"
        >
        </global-ts-slide>
        <component :is="currentComponent" ref="component"></component>
      </div>
    </div>
  </div>
</template>

<script>
import fieldsList from './components/fields-list/index.vue';
import fieldsSetting from './components/fields-setting/index.vue';
import followStatusList from './components/follow-status-list/index.vue';
import setCluePage from './components/set-clue-page/index.vue';
import setClientPage from './components/set-client-page/index.vue';
import { urlConfig } from './config';
import {
  getListByTypeWithInsert,
  addTsGroup,
  setTsGroup,
  delTsGroup,
  updateSort,
} from '@/api/modules/views/setting-center/custom-fields';

export default {
  name: 'customFields',
  components: {
    fieldsList,
    fieldsSetting,
    followStatusList,
    setCluePage,
    setClientPage,
  },
  props: {},
  data() {
    return {
      currentComponent: 'setCluePage',
      isAddType: false,
      changeTyle: 0,
      editId: -1,
      slideList: [
        {
          key: '线索池',
          value: 1,
        },
        {
          key: '客户管理',
          value: 2,
        },
      ],
      activeNum: 1,
      sonComponent: '', // 针对setClientPage - 如果有指定子组件，则定位到当前的子组件
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /**
     * 跳转到添加客户字段页面
     * @author lymn
     * @date 2020-09-29
     * @param {Object} opt 客户字段数据
     * @param {Boolean} opt的isAddType 是否为添加客户字段
     * @param {Number} opt的editId 编辑客户字段的id
     */
    goFieldsSetting: function(opt) {
      this.currentComponent = 'fieldsSetting';
      this.isAddType = opt.isAddType;
      this.editId = opt.editId;
    },
    changeComponetSlider(e, value) {
      const pageRouter = ['setCluePage', 'setClientPage'];
      this.currentComponent = pageRouter[value - 1];
      if (this.sonComponent) {
        this.$nextTick(() => {
          this.$refs.component && (this.$refs.component.currentComponent = this.sonComponent);
          this.sonComponent = ''; //  重置
        });
      }
    },
    /**
     * @description 获取数据
     * @author enson
     * @date 2021-03-11
     * @param {Number} type 19-线索公海废弃原因 20-客户公海废弃原因 21-客户删除原因
     * @returns
     */
    async initList(type) {
      const [err, response] = await getListByTypeWithInsert({
        type,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      return Promise.resolve(response.data);
    },
    /**
     * @description 添加原因
     * @author enson
     * @date 2021-03-11
     * @param {Number} type 19-线索公海废弃原因 20-客户公海废弃原因 21-客户删除原因
     * @param {String} name
     * @returns
     */
    async addTsGroup(requestParam) {
      const [err, response] = await addTsGroup({
        ...requestParam,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.$utils.postMessage({
        type: 'success',
        message: response.msg || '添加成功',
      });
      return Promise.resolve();
    },
    /**
     * @description 修改原因
     * @author enson
     * @date 2021-03-11
     * @param {Number} id
     * @param {String} name
     * @param {boolean} isOpen
     */
    async setTsGroup(requestParam) {
      const [err, response] = await setTsGroup({
        ...requestParam,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.$utils.postMessage({
        type: 'success',
        message: response.msg || '修改成功',
      });
      return Promise.resolve();
    },
    /**
     * @description 删除分类
     * @author enson
     * @date 2021-03-11
     * @param {*} id
     * @returns
     */
    async delTsGroup(id) {
      const [err, response] = await delTsGroup({
        id,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.$utils.postMessage({
        type: 'success',
        message: response.msg || '删除成功',
      });
      return Promise.resolve();
    },
    async updateSort(row, type, listData) {
      let swapItem = null;
      if (type === 'up') {
        const list = [...listData];
        swapItem = list.reverse().find(item => item.sort > row.sort);
      } else {
        swapItem = listData.find(item => item.sort < row.sort);
      }
      if (!swapItem) {
        return;
      }
      const params = {
        id: row.id,
        swapId: swapItem.id,
      };
      const [err, response] = await updateSort({
        ...params,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.$utils.postMessage({
        type: 'success',
        message: response.msg || '移动成功',
      });
      return Promise.resolve();
    },
  },
};
</script>

<style lang="scss" scoped>
.customFields {
  height: 100%;
}
</style>

<style lang="scss">
.customFields {
  .operateBtn {
    cursor: pointer;
  }
  .desc {
    margin: 20px 0;
    font-size: 14px;
    color: #898989;
  }
  .banBtn {
    color: $color-b2;
    cursor: no-drop;
  }
  .removeClassify {
    font-size: 16px;
    color: #a9a9a9;
    cursor: pointer;
    &:hover {
      color: $primary-color-hover;
    }
  }
  .header-right-btn {
    display: flex;
    align-items: center;
    svg {
      font-size: 16px;
    }
  }
}
.customFields .fa-radio-button-wrapper-checked:not(.fa-radio-button-wrapper-disabled) {
  border-radius: 4px;
}
.customFields .fa-radio-button-wrapper {
  height: 34px;
  line-height: 34px;
}
</style>
