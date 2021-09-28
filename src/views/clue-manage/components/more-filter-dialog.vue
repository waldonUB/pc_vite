<!--
 * @Description  : 线索高级筛选弹窗
 * @Author       : turbo
 * @Date         : 2021-06-18 18:05:44
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-12 17:54:36
-->

<template>
  <global-ts-dialog
    class="more-filter-dialog"
    dialog-size="medium"
    :with-cancel-btn="false"
    :with-reset-btn="true"
    :dialog-visible.sync="dialogVisible"
    @cancel="cancel"
    @sure="sure"
    @reset="reset"
  >
    <template #title><span class="main-title">高级筛选</span><span class="sub-des">（支持模糊筛选）</span></template>
    <div class="main-content">
      <div class="select-item">
        <div class="select-title">公司名称</div>
        <global-ts-input :width="270" allow-clear v-model="requestParam.companyName"></global-ts-input>
      </div>
      <div class="select-item">
        <div class="select-title">行业</div>
        <global-ts-select
          placeholder="全部"
          :width="270"
          :list="industryList"
          :selectkey="{ label: 'value', value: 'key' }"
          v-model="requestParam.industry"
        ></global-ts-select>
      </div>
      <div class="select-item">
        <div class="select-title">区域</div>
        <fa-cascader
          placeholder="全部"
          popup-class-name="moreFilterInput"
          :value="getRegion"
          :field-names="cascaderProps"
          :options="addressDefList"
          :change-on-select="true"
          :allow-clear="false"
          @change="changeArea"
        >
          <template #suffixIcon>
            <global-ts-svg-icon
              class="area-icon"
              name="icon-xialakuangjiantou"
              :width="10"
              :height="6"
            ></global-ts-svg-icon>
          </template>
        </fa-cascader>
      </div>
      <div class="select-item">
        <div class="select-title">最近访问</div>
        <global-ts-date-picker
          no-margin
          size="small"
          :width="270"
          :is-init="false"
          :is-clear-selected.sync="clearParams.isClearSelectedVisit"
          @updateTime="getSelectedTime($event, 'visit')"
        ></global-ts-date-picker>
      </div>
      <div class="select-item">
        <div class="select-title">最近更新</div>
        <global-ts-date-picker
          no-margin
          size="small"
          :width="270"
          :is-init="false"
          :is-clear-selected.sync="clearParams.isClearSelectedUpdate"
          @updateTime="getSelectedTime($event, 'modify')"
        ></global-ts-date-picker>
      </div>
      <div class="select-item">
        <div class="select-title">QQ</div>
        <global-ts-input :width="270" allow-clear v-model="requestParam.qq"></global-ts-input>
      </div>
      <div class="select-item">
        <div class="select-title">意向度</div>
        <global-ts-select
          placeholder="全部"
          direction="up"
          :width="270"
          :list="intentionList"
          v-model="requestParam.intention"
        ></global-ts-select>
      </div>
    </div>
  </global-ts-dialog>
</template>

<script>
// utils
import { getTsClientDef, getAddressList } from '@/utils';

export default {
  name: 'MoreFilterDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      initMoreRequestParam: {},
      requestParam: {
        qq: '',
        companyName: '',
        industry: '',
        province: '',
        city: '',
        county: '',
        lastVisitTimeStart: '',
        lastVisitTimeEnd: '',
        lastUpdateTimeStart: '',
        lastUpdateTimeEnd: '',
        intention: -1,
      },
      cascaderProps: {
        // 级联字段定义
        value: 'name',
        label: 'name',
        children: 'subList',
      },
      clearParams: {
        isClearSelectedStaff: false,
        isClearSelectedCreate: false,
        isClearSelectedUpdate: false,
        isClearSelectedVisit: false,
      },
      intentionList: [
        {
          label: '全部',
          value: -1,
        },
        {
          label: '高',
          value: 1,
        },
        {
          label: '中',
          value: 2,
        },
        {
          label: '低',
          value: 3,
        },
      ],
      industryList: [],
      addressDefList: [],
    };
  },
  computed: {
    getRegion() {
      const { province = '', city = '', county = '' } = this.requestParam;
      const list = [province, city, county];
      if (list.join('') === '') {
        // 重置 省市区['','','']空数据
        return [];
      } else {
        return list;
      }
    },
  },
  async created() {
    this.industryList = await getTsClientDef(false, 'industry', true);
    this.addressDefList = await getAddressList(true);
    this.initMoreRequestParam = { ...this.requestParam };
    this.$pubsub.on('moreFilterReset', reflesh => {
      this.reset(reflesh);
    });
    this.$pubsub.on('moreFilterResetOneParam', keys => {
      this.resetOneParam(keys);
    });
  },
  methods: {
    /**
     * 取消对话框
     * @author waldon
     * @date 2020/6/10
     */
    cancel() {
      this.$utils.logDog('moreFilter_close');
      this.$emit('update:dialogVisible', false);
    },
    /**
     * 改变地区
     * @author ADI
     * @date 2021-02-04 10:36:53
     * @param {Array} selectedArea - 选择的省/市/区
     */
    changeArea(selectedArea) {
      const [province = '', city = '', county = ''] = selectedArea;
      this.requestParam.province = province;
      this.requestParam.city = city;
      this.requestParam.county = county;
    },
    /**
     * 获取创建时间
     * @author waldon
     * @date 2020-06-16
     * @param {*} timeVal
     * @param {*} type
     */
    getSelectedTime(timeVal, type) {
      switch (type) {
        case 'modify':
          this.requestParam.lastUpdateTimeStart = (timeVal && timeVal[0]) || '';
          this.requestParam.lastUpdateTimeEnd = (timeVal && timeVal[1]) || '';
          break;
        case 'visit':
          this.requestParam.lastVisitTimeStart = (timeVal && timeVal[0]) || '';
          this.requestParam.lastVisitTimeEnd = (timeVal && timeVal[1]) || '';
      }
    },
    /**
     * 确定的回调
     * @author waldon
     * @date 2020/6/10
     * */
    sure() {
      this.$utils.logDog('moreFilter_save');
      // 清除用于显示的字段
      const clearAreaViewField = (viewField = '全部') => {
        const keys = ['province', 'city', 'county'];
        for (const key of keys) {
          if (this.requestParam[key] === viewField) {
            this.requestParam[key] = '';
          }
        }
      };
      clearAreaViewField(); // 要先于setFilterList方法
      const filterList = this.setFilterList();
      this.$emit('sure', this.requestParam, filterList);
      this.cancel();
    },
    /**
     * 重置筛选
     * @author waldon
     * @date 2020-06-18
     */
    reset(reflesh) {
      this.requestParam = { ...this.initMoreRequestParam };
      for (const key in this.clearParams) {
        if (this.clearParams[key]) {
          // 临时加个保护
          this.clearParams[key] = false;
        }
        this.$nextTick(() => {
          this.clearParams[key] = true;
        });
      }
      this.$emit('reset', this.initMoreRequestParam, reflesh);
    },
    /**
     * @description 重置某个数据
     * @author enson
     * @date 2021-03-09
     */
    resetOneParam(keys) {
      const resetRequestParam = {};
      const clearParamsList = new Map();
      clearParamsList.set('isClearSelectedVisit', ['lastVisitTimeStart', 'lastVisitTimeEnd']);
      clearParamsList.set('isClearSelectedUpdate', ['lastUpdateTimeStart', 'lastUpdateTimeEnd']);

      keys.forEach(key => {
        // 将需要重置参数的默认值赋值给resetRequestParam
        if (this.initMoreRequestParam[key]) {
          resetRequestParam[key] = this.initMoreRequestParam[key];
        } else {
          resetRequestParam[key] = '';
        }
      });

      // 判断需要重置的参数是否包含了lastVisitTimeStart/lastVisitTimeEnd/lastUpdateTimeStart/lastUpdateTimeEnd
      // 如果包含，那么将isClearSelectedVisit/isClearSelectedUpdate进行重置
      clearParamsList.forEach((value, index) => {
        if (keys.length === [...new Set([...value, ...keys])].length) {
          console.log('old:', { ...this.clearParams }, index);
          if (this.clearParams[index]) {
            // 加个保护，确保每次都能清除
            this.clearParams[index] = false;
          }
          this.$nextTick(() => {
            this.clearParams[index] = true;
            console.log('new:', { ...this.clearParams });
          });
        }
      });
      this.$emit('resetOneParam', Object.assign(this.requestParam, resetRequestParam));
    },
    /**
     * @description : 用于设置筛选列表的数据 相关组件 tanshu-filter-list
     * @author      : turbo
     * @Date        : 2021-06-21 15:48:06
     */
    setFilterList() {
      const filterList = [];
      const keyList = [
        {
          id: 'companyName',
          name: '公司名称',
          keys: ['companyName'],
        },
        {
          id: 'industry',
          name: '行业',
          keys: ['industry'],
          getValue: () => {
            return (
              this.industryList[this.requestParam['industry']] && this.industryList[this.requestParam['industry']].value
            );
          },
        },
        {
          id: 'area',
          name: '区域',
          keys: ['province', 'city', 'county'],
          getValue: () => {
            const { province = '', city = '', county = '' } = this.requestParam;
            if (!province && !city && !county) return;
            return [province, city, county].filter(value => value).join('/');
          },
        },
        {
          id: 'visitTime',
          name: '最近访问',
          keys: ['lastVisitTimeEnd', 'lastVisitTimeStart'],
          join: '~',
        },
        {
          id: 'updateTime',
          name: '最近更新',
          keys: ['lastUpdateTimeEnd', 'lastUpdateTimeStart'],
          join: '~',
        },
        {
          id: 'qq',
          name: 'QQ',
          keys: ['qq'],
        },
        {
          id: 'intention',
          name: '意向度',
          keys: ['intention'],
          getValue: () => this.intentionList.filter(item => item.value === this.requestParam.intention)[0]?.label,
        },
      ];

      keyList.forEach(item => {
        let keysValue;
        if (item.getValue) {
          keysValue = item.getValue(item.keys); // 根据getValue方法获取对应的值
        } else {
          // 没有getValue方法那么通过
          const keysValueArr = item.keys.map(subItem => this.requestParam[subItem]);
          const isNull = keysValueArr.every(value => !value);
          if (!isNull) {
            keysValue = item.join ? keysValueArr.join(item.join) : keysValueArr.join();
          }
        }
        keysValue &&
          filterList.push({
            id: item.id,
            keys: item.keys,
            name: item.name,
            value: keysValue,
          });
      });

      return filterList;
    },
  },
};
</script>

<style lang="scss" scoped>
.more-filter-dialog {
  .main-content {
    @include flex-between;

    flex-wrap: wrap;
  }

  .select-item {
    margin-bottom: 20px;
  }

  .select-title {
    margin-bottom: 10px;
  }

  .fa-cascader-picker {
    width: 270px;
  }

  .area-icon {
    margin-top: -3px;
  }
}
</style>

<style lang="scss">
.fa-cascader-menus.moreFilterInput {
  z-index: 2101;
  color: $color-53;
}
</style>
