<!--
 * @Description  : 客户高级筛选对话框
 * @Author       : turbo
 * @Date         : 2021-07-12 17:45:54
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-15 11:35:42
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
        <div class="select-title">是否访问文章</div>
        <fa-select
          dropdown-class-name="moreFilterInput"
          :options="conditionArticleList"
          v-model="requestParam.isVisitsArticle"
        ></fa-select>
      </div>
      <div class="select-item">
        <div class="select-title">是否访问名片</div>
        <fa-select
          dropdown-class-name="moreFilterInput"
          :options="conditionCardList"
          v-model="requestParam.isVisitsCard"
        ></fa-select>
      </div>
      <div v-if="isManage && isNoOneSelfDataAuth" class="select-item">
        <div class="select-title">跟进人</div>
        <ts-select-list
          ref="staffTree"
          default-tip="全部成员"
          :width="270"
          :dep-id-list.sync="requestParam.depIdList"
          :sids.sync="requestParam.sids"
          @click.native="$utils.logDog('customList_workList')"
        ></ts-select-list>
      </div>
      <div v-if="isManage && isNoOneSelfDataAuth" class="select-item">
        <div class="select-title">协助人</div>
        <ts-select-list
          ref="staffTreeAssist"
          default-tip="请选择"
          :width="270"
          :dep-id-list.sync="requestParam.depListByAssist"
          :sids.sync="requestParam.assistList"
          @click.native="$utils.logDog('customList_workList')"
        ></ts-select-list>
      </div>
      <div class="select-item">
        <div class="select-title">来源</div>
        <fa-select dropdown-class-name="moreFilterInput" v-model="requestParam.source">
          <fa-select-option :key="0">全部</fa-select-option>
          <fa-select-option v-for="item in sourceList" :key="item.key">{{ item.value }}</fa-select-option>
        </fa-select>
      </div>
      <div class="select-item">
        <div class="select-title">获客方式</div>
        <fa-select dropdown-class-name="moreFilterInput" v-model="requestParam.customersWay">
          <fa-select-option :key="0">全部</fa-select-option>
          <fa-select-option v-for="item in customersWayList" :key="item.key">{{ item.value }}</fa-select-option>
        </fa-select>
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
        <div class="select-title">客户类型</div>
        <fa-select dropdown-class-name="moreFilterInput" v-model="requestParam.dataSource">
          <fa-select-option :key="0">全部</fa-select-option>
          <fa-select-option v-for="item in dataSourceList" :key="item.key">{{ item.value }}</fa-select-option>
        </fa-select>
      </div>
      <div class="select-item">
        <div class="select-title">职位</div>
        <global-ts-input
          placeholder="请输入职位"
          allow-clear
          :width="270"
          v-model="requestParam.position"
        ></global-ts-input>
      </div>
      <div class="select-item">
        <div class="select-title">性别</div>
        <fa-select dropdown-class-name="moreFilterInput" :options="sexList" v-model="requestParam.sex"></fa-select>
      </div>
      <div class="select-item">
        <div class="select-title">行业</div>
        <fa-select dropdown-class-name="moreFilterInput" v-model="requestParam.industry">
          <fa-select-option :key="0">全部</fa-select-option>
          <fa-select-option v-for="item in industryList" :key="item.key">{{ item.value }}</fa-select-option>
        </fa-select>
      </div>
      <div class="select-item">
        <div class="select-title">客户创建时间</div>
        <global-ts-date-picker
          no-margin
          size="small"
          :width="270"
          :is-init="false"
          :is-clear-selected.sync="clearDatePicker.create"
          @updateTime="getSelectedTime($event, 'create')"
        ></global-ts-date-picker>
      </div>
      <div class="select-item">
        <div class="select-title">最近访问时间</div>
        <global-ts-date-picker
          no-margin
          size="small"
          :width="270"
          :is-init="false"
          :is-clear-selected.sync="clearDatePicker.lastVisits"
          @updateTime="getSelectedTime($event, 'lastVisits')"
        ></global-ts-date-picker>
      </div>
      <div class="select-item">
        <div class="select-title">客户关联时间</div>
        <global-ts-date-picker
          no-margin
          size="small"
          :width="270"
          :is-init="false"
          :is-clear-selected.sync="clearDatePicker.salesRel"
          @updateTime="getSelectedTime($event, 'salesRel')"
        ></global-ts-date-picker>
      </div>
      <div class="select-item">
        <div class="select-title">回访时间</div>
        <global-ts-date-picker
          no-margin
          size="small"
          :width="270"
          :is-init="false"
          :is-clear-selected.sync="clearDatePicker.visitsTime"
          @updateTime="getSelectedTime($event, 'visitsTime')"
        ></global-ts-date-picker>
      </div>
      <div class="select-item">
        <div class="select-title">最近更新时间</div>
        <global-ts-date-picker
          no-margin
          size="small"
          :width="270"
          :is-init="false"
          :is-clear-selected.sync="clearDatePicker.update"
          @updateTime="getSelectedTime($event, 'update')"
        ></global-ts-date-picker>
      </div>
    </div>
  </global-ts-dialog>
</template>

<script>
import { mapGetters } from 'vuex';

// components
import TsSelectList from '@/components/base/ts-select-list/index.vue';

// utils
import { getTsClientDef, getAddressList } from '@/utils';

export default {
  name: 'MoreFilterDialog',
  components: { TsSelectList },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      requestParam: {
        isVisitsCard: 0, // 是否访问文章
        isVisitsArticle: 0, // 是否访问名片
        depIdList: '', // 跟进人部门id
        sids: '', // 跟进人
        source: 0, // 来源
        depListByAssist: '', // 协助人部门id
        assistList: '', // 协助人
        customersWay: 0, // 获客方式
        province: '', // 省份
        city: '', // 城市
        county: '', // 区域
        dataSource: 0, // 客户类型
        position: '', // 职位
        sex: 0, // 性别
        industry: 0, // 行业
        createTimeStart: '', // 客户创建开始时间
        createTimeEnd: '', // 客户创建结束时间
        lastVisitsTimeStart: '', // 最近访问开始时间
        lastVisitsTimeEnd: '', // 最近访问结束时间
        salesRelTimeStart: '', // 客户关联开始时间
        salesRelTimeEnd: '', // 客户关联结束时间
        visitsTimeStart: '', // 回访开始时间
        visitsTimeEnd: '', // 回访结束时间
        updateTimeStart: '', // 最近更新开始时间
        updateTimeEnd: '', // 最近更新结束时间
      },
      initMoreRequestParam: {},
      conditionArticleList: [
        {
          label: '全部',
          value: 0,
        },
        {
          label: '已访问文章',
          value: 1,
        },
        {
          label: '未访问文章',
          value: 2,
        },
      ],
      conditionCardList: [
        {
          label: '全部',
          value: 0,
        },
        {
          label: '已访问名片',
          value: 1,
        },
        {
          label: '未访问名片',
          value: 2,
        },
      ],
      sourceList: [], // 来源
      customersWayList: [], // 获客方式
      addressDefList: [], // 区域
      dataSourceList: [], // 客户类型
      industryList: [], // 行业
      cascaderProps: {
        // 级联字段定义
        value: 'name',
        label: 'name',
        children: 'subList',
      },
      sexList: [
        {
          label: '全部',
          value: 0,
        },
        {
          label: '男',
          value: 1,
        },
        {
          label: '女',
          value: 2,
        },
      ],
      // 清空DatePicker
      clearDatePicker: {
        create: false,
        lastVisits: false,
        salesRel: false,
        visitsTime: false,
        update: false,
      },
    };
  },
  computed: {
    ...mapGetters({
      isManage: 'user/isManage',
      isNoOneSelfDataAuth: 'user/isNoOneSelfDataAuth',
    }),
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
  created() {
    this.initMoreRequestParam = {
      ...this.requestParam,
    };
    this.getData();
  },
  methods: {
    async getData() {
      const { source, customersWay, dataSource, industry } = await getTsClientDef(true);
      this.sourceList = source;
      this.customersWayList = customersWay;
      this.dataSourceList = dataSource;
      this.industryList = industry;
      this.addressDefList = await getAddressList(true);
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
     * 确定的回调
     * @author waldon
     * @date 2020/6/10
     */
    sure() {
      // 清除用于显示的字段
      const clearAreaViewField = (viewField = '全部') => {
        const keys = ['province', 'city', 'county'];
        for (const key of keys) {
          if (this.requestParam[key] === viewField) {
            this.requestParam[key] = '';
          }
        }
      };
      clearAreaViewField();
      this.$emit('sure', this.requestParam);
      this.cancel();
    },
    /**
     * 重置筛选
     * @author waldon
     * @date 2020-06-18
     */
    reset() {
      this.requestParam = {
        ...this.initMoreRequestParam,
      };
      this.$refs.staffTree.clearSelected(); // 清空跟进人组织树
      this.$refs.staffTreeAssist.clearSelected(); // 清空协助人组织树
      for (const item in this.clearDatePicker) {
        this.clearDatePicker[item] = true;
      }
      this.provinceId = '';
      this.$emit('reset', this.initMoreRequestParam);
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
     * 获取选择的时间范围
     * @author JHao
     * @date 2021-01-11
     * @param {Array} timeVal
     * @param {String} type
     */
    getSelectedTime(timeVal, type) {
      const [startTime = '', endTime = ''] = timeVal || [];
      const typeMap = new Map([
        ['create', ['createTimeStart', 'createTimeEnd']],
        ['lastVisits', ['lastVisitsTimeStart', 'lastVisitsTimeEnd']],
        ['salesRel', ['salesRelTimeStart', 'salesRelTimeEnd']],
        ['visitsTime', ['visitsTimeStart', 'visitsTimeEnd']],
        ['update', ['updateTimeStart', 'updateTimeEnd']],
      ]);
      const timeKeys = typeMap.get(type);
      this.requestParam[timeKeys[0]] = startTime;
      this.requestParam[timeKeys[1]] = endTime;
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

  .fa-cascader-picker,
  .fa-select {
    width: 270px;
  }

  .area-icon {
    margin-top: -3px;
  }
}
</style>

<style lang="scss">
.fa-cascader-menus.moreFilterInput,
.fa-select-dropdown.moreFilterInput {
  z-index: 2101;
  color: $color-53;
}
</style>
