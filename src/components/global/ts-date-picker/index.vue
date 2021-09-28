<template>
  <el-date-picker
    class="tanshu-datePicker"
    :class="{ noMargin }"
    v-model="initTime"
    :type="type"
    :style="{ width: width + 'px' }"
    unlink-panels
    range-separator="~"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    :value-format="dataFormat"
    :editable="editable"
    :clearable="clearable"
    :picker-options="pickerOptions"
    size="small"
    clear-icon="el-icon-error"
    @change="handleChange"
  >
  </el-date-picker>
</template>

<script>
import { format } from '@/utils';
import { DatePicker } from 'element-ui';

export default {
  name: 'ts-date-picker',
  components: {
    [DatePicker.name]: DatePicker,
  },
  props: {
    type: {
      type: String,
      default: 'daterange',
    },
    dataFormat: {
      type: String,
      default: 'yyyy-MM-dd',
    },
    editable: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    defaultStartTime: {
      // 初始化时间类型
      type: String,
      default: '',
    },
    isInit: {
      type: Boolean,
      default: true,
    },
    isClearSelected: {
      type: Boolean,
      default: false,
    },
    defaultInitTime: {
      // 自定义初始化时间,若传了该值,则defaultStartTime无效
      type: Array,
      default() {
        return [];
      },
    },
    isUpdate: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: () => {
        return {};
      },
    },
    width: {
      type: Number,
    },
    noMargin: {
      type: Boolean,
    },
  },
  watch: {
    initTime(newVal) {
      this.$emit('updateTime', newVal);
    },
    /**
     * 新增一个方法用于第二次进来的时候清空已选择数据
     * @author waldon
     * @date 2020-06-15
     * @param {*} newVal
     */
    isClearSelected(newVal) {
      if (newVal) {
        this.initTime = [];
        this.$emit('update:isClearSelected', false);
      }
    },
    isUpdate(newVal) {
      if (newVal) {
        this.initData();
        this.$emit('update:isUpdate', false);
      }
    },
  },
  computed: {
    timeStart() {
      switch (this.defaultStartTime) {
        case 'year':
          return format.date(format.subDate(new Date(), 1, 'years'), 'yyyy-MM-dd');
        case 'week':
          return format.date(format.subDate(new Date(), 7, 'days'), 'yyyy-MM-dd');
        case 'month':
          return format.date(format.subDate(new Date(), 30, 'days'), 'yyyy-MM-dd');
        default:
          return this.defaultStartTime;
      }
    },
  },
  data() {
    return {
      initTime: '',
      pickerOptions: {
        shortcuts: [
          {
            text: '最近7天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近15天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近30天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(format.subDate(new Date(), 3, 'months'));
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(format.subDate(new Date(), 1, 'years'));
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
    };
  },
  methods: {
    initData(defaultInitTime) {
      if (this.isInit) {
        const defaultTime = defaultInitTime ? defaultInitTime : this.defaultInitTime;
        if (defaultTime.length > 0) {
          // 自定义开始和结束时间
          this.initTime = defaultTime;
        } else {
          const t = new Date().getTime() + 5000;
          const date = new Date(t);
          var timeEnd = format.date(date, 'yyyy-MM-dd');
          this.initTime = [this.timeStart, timeEnd];
        }
      }
    },
    handleChange() {
      this.$emit('handle-change', this.initTime);
    },
  },
  created() {
    this.pickerOptions = Object.assign({}, this.pickerOptions, this.options);
    this.initData();
  },
};
</script>

<style lang="scss" scoped>
.tanshu-datePicker {
  &.noMargin {
    margin: 0 !important;
  }
}
</style>
