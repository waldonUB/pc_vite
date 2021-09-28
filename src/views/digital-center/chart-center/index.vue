<!--
 * @Description  : 数据中心
 * @Author       : turbo
 * @Date         : 2021-03-30 15:42:57
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-26 16:30:04
-->

<template>
  <div class="chart-center" v-windowResize="updateEcharts">
    <global-ts-header>
      <template #leftPart>
        数据总览
      </template>
    </global-ts-header>
    <div class="chart-content">
      <div class="search-box">
        <ts-select-list
          v-if="isNoOneSelfDataAuth"
          is-str-param
          :width="220"
          :dep-id-list.sync="requestParam.depIdList"
          :sids.sync="requestParam.sids"
        ></ts-select-list>
        <global-ts-date-picker
          :clearable="false"
          :options="pickerOptions"
          :default-init-time="[requestParam.startTimeStr, requestParam.endTimeStr]"
          @updateTime="getSearchTime"
        ></global-ts-date-picker>
        <global-ts-button type="primary" size="small" icon="icon-icon-4" @click="initData">
          搜索
        </global-ts-button>
      </div>
      <div class="chart-data">
        <fa-row>
          <fa-col :span="24">
            <chart-map
              title="客户 & 线索数据"
              no-padding
              :show-type-btn="true"
              :data-type="customerDataType"
              @handleChange="changePanel"
              @handleUpload="onExportExcel('customDataMap', '客户 & 线索数据')"
            >
              <template #tools>
                <div class="data-panel">
                  <div
                    v-for="(item, index) in panelData"
                    :key="index"
                    :class="['data-panel-item', { 'not-checked': !item.checked }]"
                  >
                    <div class="data-number">{{ item.number }}</div>
                    <fa-checkbox
                      :class="{ blue: index === 0, red: index === 1, yellow: index === 2 }"
                      :checked="item.checked"
                      @change="handleCheckboxChange(item)"
                    >
                      <span>{{ item.desc }}</span>
                      <el-tooltip v-if="item.tip" class="toolTips" placement="bottom">
                        <div slot="content">{{ item.tip }}</div>
                        <global-ts-svg-icon class="tip-icon" name="icon-wenhao1616"></global-ts-svg-icon>
                      </el-tooltip>
                    </fa-checkbox>
                  </div>
                </div>
              </template>
              <template #mainMap>
                <div ref="customDataMap" class="customer-data-map"></div>
              </template>
            </chart-map>
          </fa-col>
        </fa-row>
        <fa-row :gutter="20">
          <fa-col class="pie-col" :span="12" v-for="(item, index) in pieDataMap" :key="index">
            <chartMap
              :title="item.title"
              :tool-tips="item.toolTips"
              @handleUpload="onExportExcel(item.type, item.title)"
            >
              <template #mainMap>
                <div class="pie-wrap">
                  <div class="pie-list">
                    <div class="pie-item-wrap">
                      <div class="pie-item" v-for="(subItem, subIndex) in item.data" :key="subIndex">
                        <div class="icon" :style="`background-color: ${subItem.color};`"></div>
                        <el-tooltip
                          effect="dark"
                          transition="el-fade-in-linear el-zoom-in-bottom"
                          placement="top-start"
                          :disabled="subItem.isHideTooltip"
                          :content="subItem.value + '（' + subItem.percent + '）'"
                          :open-delay="300"
                        >
                          <template #content>
                            {{ subItem.name }}：{{ subItem.value }}（{{ subItem.percent }}）
                          </template>
                          <div
                            class="desc"
                            :ref="'pieItemDesc_' + item.type + subIndex"
                            @mouseover="isOverflow('pieItemDesc_' + item.type + subIndex, subItem)"
                          >
                            {{ subItem.name }}：<span class="desc-data">
                              {{ subItem.value }}（{{ subItem.percent }}）
                            </span>
                          </div>
                        </el-tooltip>
                      </div>
                      <div v-if="item.type === 'taskData'" class="task-data">
                        完成率：{{ taskCompletionRate.percent }}
                      </div>
                    </div>
                  </div>
                  <div class="pie-map" :ref="item.type"></div>
                </div>
              </template>
            </chartMap>
          </fa-col>
        </fa-row>
        <fa-row>
          <fa-col :span="24">
            <chartMap title="客户跟进阶段漏斗" @handleUpload="onExportExcel('followPhase', '客户跟进阶段漏斗')">
              <template #title>
                <div class="followPhaseTip">
                  <el-popover popper-class="chartFollowTipWrap" placement="bottom-start" width="540" trigger="hover">
                    <div class="chartFollowTip">
                      <div class="tipImg"></div>
                      <div class="tipDesc">
                        <div>(在「xx」阶段停留过的客户数)</div>
                        <div>(当前处于「xx」阶段的客户数)</div>
                      </div>
                    </div>
                    <global-ts-svg-icon name="icon-wenhao1616"></global-ts-svg-icon>
                  </el-popover>
                </div>
              </template>
              <template v-slot:mainMap>
                <div ref="followPhase" class="follow-phase"></div>
              </template>
            </chartMap>
          </fa-col>
        </fa-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { merge, debounce } from 'lodash';
import moment from 'moment';
import echarts from '@fk/fa-echarts';

// components
import TsSelectList from '@/components/base/ts-select-list/index.vue';
import ChartMap from './components/chart-map.vue';

// utils
import { confirm, exportExcel } from '@/utils';

// api
import { dataCenter } from '@/api';

export default {
  name: 'ChartCenter',
  components: { TsSelectList, ChartMap },
  data() {
    return {
      requestParam: {
        sids: '', // 销售员
        depIdList: '', // 跟进人部门id
        startTimeStr: moment()
          .subtract(30, 'days')
          .format('yyyy-MM-DD'), // 开始时间
        endTimeStr: moment().format('yyyy-MM-DD'), // 结束时间
      },
      bindWxWork: false, // 是否绑定企微
      echartsObj: {}, // echarts 对象
      customerDataType: 1, // 客户 & 线索数据类型 1 - 全部 2 - 企微数据
      getTooltipComm: {
        // 公共的ToolTip属性
        appendToBody: true, // 是否将 tooltip 的 DOM 节点添加为 HTML 的 <body> 的子节点
        position: 'inside', // 标签的位置
        padding: 0, // 提示框浮层内边距
        borderRadius: '4',
        backgroundColor: '#FFFFFF', // 提示框浮层的背景颜色
        extraCssText: 'box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.07);', // 额外的样式
      },
      pieColorList: [
        // 饼图颜色规范
        '#247AF3',
        '#FFC96A',
        '#FF4D4D',
        '#FF9900',
        '#86E0CD',
        '#00B9CA',
        '#196F9D',
        '#00527E',
        '#2D8B46',
        '#5FA519',
        '#9DC417',
        '#D2A836',
        '#C9791E',
        '#AB342C',
        '#6900E1',
        '#500AA1',
        '#8000A5',
        '#BC00A3',
        '#92006B',
        '#4E1AFF',
      ],
      funnelColorList: [
        // 漏斗图颜色规范
        '#247AF3',
        '#2495FF',
        '#25B7E3',
        '#29CCCC',
        '#30CB7E',
        '#76CC4B',
        '#B3D541',
        '#ECCE36',
        '#FFB219',
        '#FF9900',
      ],
      taskCompletionRate: {
        // 任务饼图的完成率
        num: 0,
        percent: '0%',
      },
      wxWorkPanelData: [
        // 客户 & 线索变动 - 企微数据面板
        {
          number: 0,
          desc: '企微新增',
          tip: '在选择的时间区间内，销售员在企业微信新加的客户数量',
          checked: true,
          valueKey: 'addY', // 与后端约定好的数据Y轴的值
          color: '#247AF3', // 折线图的颜色
        },
        {
          number: 0,
          desc: '企微被删',
          tip: '在选择的时间区间内，销售员被企微客户删除的数量',
          checked: true,
          valueKey: 'beDelY', // 与后端约定好的数据Y轴的值
          color: '#FF4D4D', // 折线图的颜色
        },
        {
          number: 0,
          desc: '企微删除',
          tip: '在选择的时间区间内，销售员主动删除企微客户的数量',
          checked: true,
          valueKey: 'delY', // 与后端约定好的数据Y轴的值
          color: '#FF9900', // 折线图的颜色
        },
      ],
      allPanelData: [
        // 客户 & 线索变动 - 全部数据面板
        {
          number: 0,
          desc: '新增客户',
          tip: '',
          checked: true,
          valueKey: 'clientY', // 与后端约定好的数据Y轴的值
          color: '#247AF3',
        },
        {
          number: 0,
          desc: '新增线索',
          tip: '',
          checked: true,
          valueKey: 'viewerY', // 与后端约定好的数据Y轴的值
          color: '#FF4D4D',
        },
      ],
      pieDataMap: [
        // 饼图数据
        {
          type: 'accessStatistics', // 客户访问方式统计
          data: [],
          title: '客户访问方式统计',
          toolTips: '统计客户对销售员多种访问方式各自的次数和占比',
          pieName: '访问总次数',
        },
        {
          type: 'getUserWays', // 获客渠道统计
          data: [],
          title: '获客渠道统计',
          toolTips: '统计客户多种来源各自的数量和占比',
          pieName: '总客户数',
        },
        {
          type: 'getUserTools', // 获客工具使用统计
          data: [],
          title: '获客工具使用统计',
          toolTips: '统计销售员使用不同获客工具各自的数量和占比',
          pieName: '使用总次数',
        },
        {
          type: 'taskData', // 营销任务完成统计
          data: [],
          title: '营销任务完成统计',
          toolTips: '完成率 = 已完成/（任务总数-未开始）',
          pieName: '任务总数',
        },
      ],
      followData: null, //  漏斗图数据
    };
  },
  computed: {
    ...mapGetters({
      isUpperAdm: 'user/isUpperAdm', // 是否是超级管理员
      isNoOneSelfDataAuth: 'user/isNoOneSelfDataAuth', // 是否是管理员
    }),
    pickerOptions() {
      return {
        // 2019-9-18 之前的日期不能选择
        disabledDate(time) {
          // true的话是禁用掉时间选择
          return time.getTime() < new Date('2019-9-18').getTime();
        },
      };
    },
    /**
     * @description 折线图面板数据
     * @author enson
     * @date 2021-01-10
     * @returns
     */
    panelData() {
      return this.customerDataType === 2 ? this.wxWorkPanelData : this.allPanelData;
    },
  },
  mounted() {
    this.$utils.FdpLog('yx_sjzl', {
      yx_app_terminal: 1,
    });
    this.$nextTick(() => {
      this.initEcharts();
      this.initData();
    });
  },
  destroyed() {
    this.clearEcharts();
    this.followData = null; // 重置
  },
  methods: {
    /**
     * @description 设置搜索时间
     * @author enson
     * @date 2020-12-22
     * @param {Aarry} val
     */
    getSearchTime(val) {
      this.requestParam.startTimeStr = (val && val[0]) || '';
      this.requestParam.endTimeStr = (val && val[1]) || '';
    },
    /**
     * @description 初始化echarts对象
     * @author enson
     * @date 2021-01-06
     */
    initEcharts() {
      const echartsDomArr = [
        'customDataMap', // 客户 & 线索变动
        'accessStatistics', // 客户访问方式统计
        'getUserWays', // 获客渠道统计
        'getUserTools', // 获客工具使用统计
        'taskData', // 营销任务完成统计
        'followPhase', // 客户跟进阶段漏斗
      ];

      echartsDomArr.forEach(key => {
        this.echartsObj[key] = echarts.init(Array.isArray(this.$refs[key]) ? this.$refs[key][0] : this.$refs[key]);
      });
    },
    initData() {
      this.setCustomMap(); // 客户&线索变动
      this.setVisitDataMap('accessStatistics'); // 客户访问方式统计
      this.setVisitDataMap('getUserWays'); // 获客渠道统计
      this.setVisitDataMap('getUserTools'); // 获客工具使用统计
      this.setVisitDataMap('taskData'); // 营销任务完成统计
      this.setFollowMap(); // 客户跟进阶段漏斗
    },
    /**
     * @description 绘制折线图
     * @author enson
     * @date 2021-01-03
     */
    async setCustomMap() {
      this.echartsObj['customDataMap'].showLoading();
      const lcCntData = await this.getLcCntData(); // 获取返回的折线图数据
      this.bindWxWork = lcCntData.bindWxWork; // 是否绑定了企微
      let xAxisArr = lcCntData.x; // 横坐标时间数据
      let defaultDataArr = []; // 默认的折线图Y轴数据
      const seriesData = []; // 绘制折线数据
      const commSeriesData = {
        // 公共的折线数据
        type: 'line',
        // stack: '总量',  // 数据堆叠，同个类目轴上系列配置相同的stack值后，后一个系列的值会在前一个系列的值上相加。
        symbolSize: 6, // 标记的大小
        hoverAnimation: true, // 是否开启 hover 在拐点标志上的提示动画效果
        z: 9, // 折线图组件的所有图形的z值。控制图形的前后顺序
      };
      let seriesKey = null;
      let isNullFlag = false;
      let cacheData;

      if (this.customerDataType === 2 && this.bindWxWork) {
        // 是否是企微数据
        cacheData = this.wxWorkPanelData;
        cacheData[0].number = lcCntData.addTotal; // 企微客户新增数
        cacheData[1].number = lcCntData.beDelTotal; // 企微删除客户数
        cacheData[2].number = lcCntData.delTotal; // 企微员工被客户删除数
        this.wxWorkPanelData = [].concat(cacheData);
        seriesKey = [].concat(this.wxWorkPanelData);
      } else {
        cacheData = this.allPanelData;
        cacheData[0].number = lcCntData.clientTotal; // 新增客户数
        cacheData[1].number = lcCntData.viewerTotal; // 新增线索数
        this.allPanelData = [].concat(cacheData);
        seriesKey = [].concat(this.allPanelData);
      }

      isNullFlag = seriesKey.every(item => lcCntData[item.valueKey] && lcCntData[item.valueKey].length <= 0);

      if (isNullFlag) {
        xAxisArr = this.getLineTimeArr(); // 横坐标时间数据
        defaultDataArr = new Array(xAxisArr.length).fill(0);
      }

      seriesKey.forEach(item => {
        if (item.checked) {
          seriesData.push({
            name: item.desc, // 系列名称，用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
            ...commSeriesData,
            data:
              lcCntData[item.valueKey] && lcCntData[item.valueKey].length > 0
                ? lcCntData[item.valueKey]
                : defaultDataArr,
            itemStyle: {
              color: item.color,
            },
          });
        }
      });

      // 参考例子https://echarts.apache.org/examples/zh/editor.html?c=line-stack
      const option = {
        cursor: 'default',
        tooltip: merge({}, this.getTooltipComm, {
          trigger: 'axis', // 触发类型, 坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
          lineStyle: {
            color: '#dadada',
          },
          axisPointer: {
            z: 2, // 坐标轴指示器的 z 值。控制图形的前后顺序。z值小的图形会被z值大的图形覆盖
          },
          formatter: param => {
            const templateParam = [];
            param.forEach(element => {
              templateParam.push({
                color: element.color,
                name: element.seriesName,
                value: element.value,
              });
            });
            return this.getToolTipTemplate(templateParam, param[0].axisValueLabel, 'setCustomMap');
          },
        }),
        grid: {
          top: 20,
          left: 20,
          right: 32,
          bottom: xAxisArr.length > 30 ? 0 : 20,
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxisArr,
          axisLabel: {
            // 坐标轴刻度标签的相关设置
            rotate: xAxisArr.length > 30 ? 30 : 0, // 刻度标签旋转的角度
            align: 'center', // 文字水平对齐方式
            color: '#535353', // 刻度标签文字的颜色
            margin: xAxisArr.length > 30 ? 20 : 8, // 刻度标签与轴线之间的距离。
            formatter: function(value) {
              // 刻度标签的内容格式器，支持字符串模板和回调函数两种形式
              return value;
            },
          },
          axisLine: {
            lineStyle: {
              color: '#dadada', // 坐标轴线线的颜色。
            },
          },
        },
        yAxis: {
          type: 'value', // 坐标轴类型, 数值轴，适用于连续数据
          splitLine: {
            // 坐标轴在 grid 区域中的分隔线。
            lineStyle: {
              type: 'dashed',
              color: '#eeeeee',
            },
          },
          axisLine: {
            show: false, // 是否显示坐标轴轴线
          },
          axisLabel: {
            // 坐标轴刻度标签的相关设置
            color: '#535353', // 坐标轴名称的颜色
          },
          axisTick: {
            show: false, // 是否显示坐标轴刻度
          },
        },
        series: seriesData, // 绘制折线图的数据
      };

      this.drawEcharts('customDataMap', option);
    },
    /**
     * @description 获取折线图数据
     * @author enson
     * @date 2021-01-14
     */
    async getLcCntData(param = {}) {
      param = merge(param, this.requestParam);
      const { getLcCntData } = dataCenter;
      const [err, res] = await getLcCntData({
        ...param,
        type: this.customerDataType,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      return Promise.resolve(res.data);
    },
    /**
     * @description 绘制饼图
     * @author enson
     * @date 2021-01-14
     * @param {String} domId - 饼图对应的id
     */
    async setVisitDataMap(domId) {
      this.echartsObj[domId].showLoading();
      const pieData = await this.getPieData(domId);
      const pieDataList = pieData.data;
      const visitData = [];
      let isNullNumFlag = false; // 是否都是0
      let pieName = '总次数';

      if (domId === 'taskData' && pieData.completionRate) {
        this.taskCompletionRate = pieData.completionRate;
      }

      pieDataList.forEach((item, index) => {
        visitData.push({
          color: this.pieColorList[index],
          value: item.num,
          name: item.key,
          percent: item.percent,
        });
      });

      isNullNumFlag = visitData.every(item => item.value <= 0);

      const pieDataIndex = this.pieDataMap.findIndex(item => item.type === domId);

      if (pieDataIndex >= 0) {
        this.$set(this.pieDataMap[pieDataIndex], 'data', visitData);
        pieName = this.pieDataMap[pieDataIndex].pieName;
      }

      const defaultPieData = [
        {
          // 都为0时的饼图
          color: '#F3F3F5',
          value: 0,
          name: pieName,
          percent: 0,
          itemStyle: {
            emphasis: {
              color: '#F3F3F5',
            },
          },
        },
      ];

      const option = {
        title: [
          {
            text: '{val|' + pieData.total + '}\n{name|' + pieName + '}', // 主标题文本，支持使用 \n 换行
            top: 'center', // title 组件离容器上侧的距离
            left: 'center', // title 组件离容器左侧的距离
            textStyle: {
              rich: {
                name: {
                  fontSize: 14, // 字体大小
                  fontWeight: 'normal', // 文字字体的粗细
                  color: '#535353', // 文字的颜色
                },
                val: {
                  fontSize: 32,
                  fontWeight: 'bold',
                  color: '#000000',
                },
              },
            },
          },
        ],
        tooltip: merge({}, this.getTooltipComm, {
          formatter: param => {
            return this.getToolTipTemplate([param.data]);
          },
          position: point => {
            // 标签的位置
            return point;
          },
        }),
        series: [
          {
            type: 'pie',
            left: '0',
            top: '0',
            width: '100%',
            height: '100%',
            radius: ['65%', '88%'], // 饼图的半径
            clockwise: false, // 饼图的扇区是否是顺时针排布
            label: {
              // 饼图图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等
              show: false, // 是否显示
            },
            labelLine: {
              show: false, // 是否显示视觉引导线
            },
            itemStyle: {
              color: param => {
                return param.data.color;
              },
            },
            cursor: 'default',
            data: isNullNumFlag ? defaultPieData : visitData,
          },
        ],
      };
      this.drawEcharts(domId, option);
    },
    /**
     * @description 获取不同类型的饼图数据
     * @author enson
     * @date 2021-01-14
     * @param {String} type - 不同类型的标识
     */
    async getPieData(type, param = {}) {
      param = merge(param, this.requestParam);
      const { getIntvTypeCntData, getClientSourceCntData, getToolUseCntData, getTaskCompleteCntData } = dataCenter;
      const apiList = {
        accessStatistics: getIntvTypeCntData, // 客户访问方式统计
        getUserWays: getClientSourceCntData, // 获取获客渠道统计数据（客户来源）
        getUserTools: getToolUseCntData, // 获取获客工具使用统计数据
        taskData: getTaskCompleteCntData, // 营销任务完成统计
      };
      const api = apiList[type];

      if (!api || !type) return;

      const [err, res] = await api(param);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      return Promise.resolve(res.data);
    },
    /**
     * @description 绘制漏斗图
     * @author enson
     * @date 2021-01-08
     */
    async setFollowMap(isInit = true) {
      this.echartsObj['followPhase'].showLoading();
      if (isInit || !this.followData) {
        this.followData = await this.getFollowCntData();
      }
      const { list, deal, notDeal } = this.followData;
      const MAXWIDTH = this.$refs['followPhase'].clientWidth; // canvas 宽度
      const FUNNEL_WIDTH = 600; // 漏斗图宽度
      const FUNNEL_MIN_WIDTH = 274; // 漏斗图最小宽度
      const FUNNEL_HEIGHT = 544; // 漏斗图高度
      const FUNNEL_WIDTH_LINE = 159; // 漏斗图线的宽度

      const FUNNEL_MAKElINE_TOP_MAX = MAXWIDTH / 2 + FUNNEL_WIDTH / 2 + FUNNEL_WIDTH_LINE; // 漏斗图线顶部最大x轴坐标
      const FUNNEL_MAKElINE_TOP_MIN = MAXWIDTH / 2 - FUNNEL_WIDTH / 2 - FUNNEL_WIDTH_LINE; // 漏斗图线顶部最小x轴坐标
      const FUNNEL_MAKElINE_BOTTOM_MAX = MAXWIDTH / 2 + 310; // 漏斗图线低部最大x轴坐标
      const FUNNEL_MAKElINE_BOTTOM_MIN = MAXWIDTH / 2 - 310; // 漏斗图线低部最小x轴坐标
      const FUNNEL_CONVESION = (FUNNEL_MAKElINE_TOP_MAX - FUNNEL_MAKElINE_BOTTOM_MAX) / list.length; // 变化率缩短的幅度
      const data = []; // 漏斗图数据

      // 参考链接: https://www.makeapie.com/editor.html?c=x0hCXYXi-_
      list.forEach((item, index) => {
        data.push({
          ...item,
          value: 20 * (list.length - index), // 保证是一个等腰梯形
        });
      });

      const colorStops = []; // 选择变化
      const conversion = []; // 转化率线

      const totalDealConverRate = list[0].dealConverRate;
      const totalNotDealTotalRate = list[0].notDealTotalRate;

      if (this.funnelColorList.length < data.length) return;

      for (const index in data) {
        data[index].color = this.funnelColorList[index];
        const lineHeight = (FUNNEL_HEIGHT / data.length) * (Number(index) + 1) - 1;
        const conversionItem = [
          {
            x: MAXWIDTH / 2,
            y: lineHeight,
            lineStyle: {
              width: 1,
              color: data[index].color,
              type: 'solid',
              position: 'start',
            },
            label: {
              formatter: `转化率: ${data[index].converRate || data[index].dealConverRate}`,
              color: '#535353',
              position: 'insideEndTop',
              distance: 10,
            },
            symbol: 'none',
          },
          {
            x: FUNNEL_MAKElINE_TOP_MAX - 20 - (Number(index) + 1) * FUNNEL_CONVESION,
            y: lineHeight,
            symbol: 'none',
          },
        ];

        conversion.push(conversionItem);

        // 添加未完成的转化率
        if (index == data.length - 1 && data[index].notDealTotalRate) {
          conversion.push([
            {
              x: MAXWIDTH / 2,
              y: lineHeight,
              lineStyle: {
                width: 1,
                color: data[index].color,
                type: 'solid',
                position: 'start',
              },
              label: {
                formatter: `转化率: ${data[index].notDealTotalRate}`,
                color: '#535353',
                position: 'insideEndTop',
                distance: 10,
              },
              symbol: 'none',
            },
            {
              x: FUNNEL_MAKElINE_TOP_MIN + 20 + (Number(index) + 1) * FUNNEL_CONVESION,
              y: lineHeight,
              symbol: 'none',
            },
          ]);
        }
      }

      let colorStopsArr = data.slice(1, data.length - 1).map(item => item.color);

      if (colorStopsArr.length <= 0) {
        colorStopsArr = data.map(item => item.color);
      }

      colorStopsArr.forEach((color, index) => {
        colorStops.push({
          offset: index * (1 / colorStopsArr.length),
          color: color,
        });
      });

      const makeLineData = [
        // 右侧
        [
          {
            x: MAXWIDTH / 2,
            y: 20,
            lineStyle: {
              width: 2,
              color: '#247AF3',
              type: 'solid',
              position: 'start',
            },
            symbol: 'none',
          },
          {
            x: FUNNEL_MAKElINE_TOP_MAX,
            y: 20,
            symbol: 'none',
          },
        ],
        [
          {
            x: FUNNEL_MAKElINE_TOP_MAX,
            y: 20,
            lineStyle: {
              width: 2,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: colorStops,
                global: false, // 缺省为 false
              },
              type: 'solid',
              position: 'start',
            },
            label: {
              formatter: `转化率：${totalDealConverRate}`,
              position: 'insideMiddleBottom',
              distance: 10,
            },
            symbol: 'none',
          },
          {
            x: FUNNEL_MAKElINE_BOTTOM_MAX,
            y: FUNNEL_HEIGHT + 28,
            symbol: 'none',
          },
        ],
        [
          {
            x: FUNNEL_MAKElINE_BOTTOM_MAX,
            y: FUNNEL_HEIGHT + 28,
            lineStyle: {
              width: 2,
              color: this.funnelColorList[data.length],
              type: 'solid',
              position: 'start',
            },
            symbol: 'none',
          },
          {
            x: MAXWIDTH / 2 + 120,
            y: FUNNEL_HEIGHT + 28,
            symbol: 'none',
          },
        ],

        // 左侧
        [
          {
            x: MAXWIDTH / 2,
            y: 20,
            lineStyle: {
              width: 2,
              color: '#247AF3',
              type: 'solid',
              position: 'start',
            },
            symbol: 'none',
          },
          {
            x: FUNNEL_MAKElINE_TOP_MIN,
            y: 20,
            symbol: 'none',
          },
        ],
        [
          {
            x: FUNNEL_MAKElINE_TOP_MIN,
            y: 20,
            lineStyle: {
              width: 2,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: colorStops,
                global: false, // 缺省为 false
              },
              type: 'solid',
              position: 'start',
            },
            label: {
              formatter: `转化率：${totalNotDealTotalRate}`,
              position: 'insideMiddleBottom',
              distance: 10,
            },
            symbol: 'none',
          },
          {
            x: FUNNEL_MAKElINE_BOTTOM_MIN,
            y: FUNNEL_HEIGHT + 28,
            symbol: 'none',
          },
        ],
        [
          {
            x: FUNNEL_MAKElINE_BOTTOM_MIN,
            y: FUNNEL_HEIGHT + 28,
            lineStyle: {
              width: 2,
              color: '#999999',
              type: 'solid',
              position: 'start',
            },
            symbol: 'none',
          },
          {
            x: MAXWIDTH / 2 - 120,
            y: FUNNEL_HEIGHT + 28,
            symbol: 'none', // 标线两端的标记类型
          },
        ],

        // 转化率的标线
        ...conversion,
      ];

      // 底部俩个梯形公共的属性
      const otherFunnelConfig = {
        type: 'funnel',
        y: FUNNEL_HEIGHT,
        width: '137',
        height: '56',
        minSize: '120',
        maxSize: '137',
        gap: 0,
        zlevel: 9, // 所有图形的 zlevel 值
        itemStyle: {
          borderWidth: 0, // 描边线宽。为 0 时无描边
        },
        label: {
          show: true,
          normal: {
            formatter: param => {
              // 主标题文本，支持使用 \n 换行
              return '{totalNum|' + param.data.totalNum + '}\n{name|' + param.data.name + '}';
            },
            rich: {
              totalNum: {
                fontSize: 16,
                lineHeight: 21,
                color: '#ffffff',
              },
              name: {
                fontSize: 14,
                lineHeight: 19,
                color: '#ffffff',
              },
            },
            position: 'inside',
          },
        },
      };

      const option = {
        tooltip: Object.assign({}, this.getTooltipComm, {
          formatter: param => {
            if (!param.data.color) return;
            const templateParam = {
              color: param.data.color,
              value: `当前处于该阶段客户数共${param.data.realNum}人，占比${param.data.percentage}`,
            };
            return this.getToolTipTemplate([templateParam], null, 'funnelTip');
          },
          position: point => {
            // 标签的位置
            return point;
          },
        }),
        series: [
          {
            type: 'funnel',
            top: 0,
            left: 'center',
            minSize: FUNNEL_MIN_WIDTH,
            maxSize: FUNNEL_WIDTH,
            height: FUNNEL_HEIGHT,
            width: FUNNEL_WIDTH,
            gap: 0,
            zlevel: 9, // 所有图形的 zlevel 值
            label: {
              show: true,
              position: 'inside',
              fontSize: 14,
              lineHeight: 19,
              formatter: param => {
                return `${param.data.name}：${param.data.totalNum}`;
              },
            },
            itemStyle: {
              color: param => {
                return param.data.color;
              },
              borderWidth: 0, // 描边线宽。为 0 时无描边
            },
            markLine: {
              silent: true, // 图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
              data: makeLineData,
            },
            data: data,
          },
          {
            x: MAXWIDTH / 2 - 137,
            funnelAlign: 'right',
            color: '#999999',
            data: [
              {
                ...notDeal,
                value: 35,
                color: '#999999',
              },
            ],
            ...otherFunnelConfig,
          },
          {
            x: MAXWIDTH / 2,
            funnelAlign: 'left',
            color: this.funnelColorList[data.length],
            data: [
              {
                ...deal,
                value: 35,
                color: this.funnelColorList[data.length],
              },
            ],
            ...otherFunnelConfig,
          },
        ],
      };

      this.drawEcharts('followPhase', option);
    },
    /**
     * @description  获取漏斗图数据
     * @author enson
     * @date 2021-01-14
     */
    async getFollowCntData(param = {}) {
      param = Object.assign(param, this.requestParam);
      const { getClientFollowCntData } = dataCenter;
      const [err, res] = await getClientFollowCntData(param);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      return Promise.resolve(res.data);
    },
    /**
     * @description 提示框的公共模板
     * @author enson
     * @date 2021-01-06
     * @param {Object} param - 模板数据
     * @param {String} title - 提示框小标题
     * @param {String} bindClass - 绑定的样式类
     */
    getToolTipTemplate(param, title, bindClass) {
      let templateStr = '';

      for (const item of param) {
        templateStr += `<div class="tip">
                            <div class="dot" style="background-color:${item.color}";></div>
                            <span>${item.name ? `${item.name}：${item.value}` : item.value}</span>
                        </div>`;
      }
      return `<div class="chart-center__visit-data-tip ${bindClass || ''}">
                  ${title ? `<div class="title">${title}</div>` : ''}
                  ${templateStr}
              </div>`;
    },
    /**
     * @description 根据节点 id 和 option 去绘制 echarts 实例
     * @author enson
     * @date 2021-01-08
     * @param {String} domId - 节点id
     * @param {Object} option - option数据
     */
    drawEcharts(domId, option) {
      if (!this.echartsObj[domId]) return;

      this.echartsObj[domId].hideLoading();
      this.echartsObj[domId].setOption(option, true); // 这里的true，表示不跟之前设置的 option 进行合并
    },
    clearEcharts() {
      Object.values(this.echartsObj).forEach(echartsItem => {
        if (echartsItem.isDisposed()) {
          echartsItem.clear();
        }
      });
    },
    /**
     * @description 页面尺寸更新时echarts调整尺寸
     * @author enson
     * @date 2021-01-08
     */
    updateEcharts() {
      Object.values(this.echartsObj).forEach(echartsItem => {
        echartsItem.resize();
      });
      // 客户跟进漏斗需要特殊处理
      this.setFollowMap(false);
    },
    /**
     *  加个防抖 避免重复点击
     */
    handleCheckboxChange: debounce(function(item) {
      this.$set(item, 'checked', !item.checked);
      this.setCustomMap();
    }, 300),
    changePanel(type) {
      if (!this.bindWxWork && type === 2) {
        if (!this.isUpperAdm) {
          // 如果不是超级管理员
          return confirm({
            msg: '暂无权限，请联系超级管理员处理',
          });
        }

        return confirm({
          msg: '接入企业微信后可追踪客户变动数据',
          title: '提醒',
          btnText: '去接入',
        }).then(() => {
          this.$router.push({
            path: '/wxCorpApp',
          });
        });
      }
      this.customerDataType = type;
      this.setCustomMap(); // 客户 & 线索变动
    },
    /**
     * @description 导出图表数据
     * @author enson
     * @date 2021-01-08
     * @param {String} type - 需要导出的echarts类型
     */
    async onExportExcel(type, title) {
      const target = this.echartsObj[type];
      const commRequestParam = { isGetAll: true };
      let excelData;
      let keyJson;
      let mergeItem;
      if (!target) return;

      switch (type) {
        case 'customDataMap': // 客户&线索变动
          excelData = await this.getLcCntData(commRequestParam);
          const diffKeyJson = this.isWxWorkFlag
            ? {
                addCntNum: '企微新增',
                beDelCntNum: '企微被删',
                delCntNum: '企微删除',
              }
            : {};
          keyJson = {
            date: '数据项',
            clientCntNum: '新增客户',
            viewerCntNum: '新增线索',
            ...diffKeyJson,
          };
          break;
        case 'accessStatistics': // 客户访问方式统计
        case 'getUserWays': // 获客渠道统计
        case 'getUserTools': // 获客工具使用统计
        case 'taskData': // 营销任务完成统计
          excelData = await this.getPieData(type, commRequestParam);
          const keyJsonList = {
            accessStatistics: {
              key: '访问方式',
              num: '次数',
              percent: '占比',
            },
            getUserWays: {
              key: '获客渠道',
              num: '数量',
              percent: '占比',
            },
            getUserTools: {
              key: '获客渠道',
              num: '数量',
              percent: '占比',
            },
            taskData: {
              key: '任务状态',
              num: '数量',
              percent: '占比',
            },
          };
          if (type === 'taskData') {
            /*
             * s 意为 start ，即开始的单元格
             * r 是 row ，表示行号，从 0 计起
             * c 是 col ，表示列号，从 0 计起
             */
            mergeItem = [
              {
                // 第一行合并即可
                s: {
                  // 合并开始
                  c: 1, // 列
                  r: excelData.length - 1, // 行 倒数第二行
                },
                e: {
                  // 合并结束
                  c: 2, // 列
                  r: excelData.length - 1, // 行 倒数第二行
                },
              },
            ];
          }
          keyJson = keyJsonList[type];
          break;
        case 'followPhase':
          excelData = await this.getFollowCntData(commRequestParam);
          excelData.forEach(item => {
            item.finishRate = excelData[0].dealConverRate;
            item.noFinishRate = excelData[0].notDealTotalRate;
          });
          keyJson = {
            name: '跟进阶段',
            realNum: '数量',
            percentage: '占比',
            preConverRate: '转化率',
            finishRate: '已成交总转化率',
            noFinishRate: '未完成总转化率',
          };
          mergeItem = [
            {
              // 第一行合并即可
              s: {
                // 合并开始
                c: 4, // 列
                r: 1, // 行
              },
              e: {
                // 合并结束
                c: 4, // 列
                r: excelData.length, // 行
              },
            },
            {
              // 第一行合并即可
              s: {
                // 合并开始
                c: 5, // 列
                r: 1, // 行
              },
              e: {
                // 合并结束
                c: 5, // 列
                r: excelData.length, // 行
              },
            },
          ];
          break;
        default:
          break;
      }

      exportExcel({
        excelList: excelData,
        downName: `《${title}》`,
        keyJson: keyJson,
        mergesConfigArr: mergeItem,
      });
    },
    /**
     * @description 判断饼状图文案是否超出
     * @author enson
     * @date 2021-01-17
     * @param {*} event
     * @param {*} item
     */
    isOverflow(refKey, item) {
      const eventList = this.$refs[refKey];
      const target = eventList[0];
      const cWidth = target.clientWidth;
      const sWidth = target.scrollWidth;
      if (sWidth > cWidth) {
        this.$set(item, 'isHideTooltip', false);
      } else {
        this.$set(item, 'isHideTooltip', true);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-center {
  ::v-deep {
    .fa-checkbox + span {
      padding-right: 0;
    }
  }

  .chart-content {
    padding: 20px 0 10px;
    background-color: $color-ff;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgb(0, 0, 0, 0.04);
  }

  .search-box {
    @include flex-left;

    padding: 0 20px 20px;
    border-bottom: 1px solid $color-ee;

    > div + div {
      margin-left: 10px;
    }
  }

  .fa-row {
    padding: 20px 20px 10px;
  }

  .pie-col {
    &:nth-child(n + 3) {
      margin-top: 30px;
    }
  }

  .data-panel {
    @include flex-left;
  }

  .data-panel-item {
    @include flex-column-between;

    position: relative;
    width: 158px;
    height: 69px;
    padding: 10px 20px 10px 0;
    opacity: 1;

    &:not(:first-child) {
      padding-left: 20px;

      &::before {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 1px;
        height: 44px;
        margin: auto;
        background: $color-ee;
        content: '';
      }
    }

    &.not-checked {
      opacity: 0.4;
    }

    .blue {
      color: $primary-color;
    }

    .red {
      color: $error-color;

      ::v-deep {
        .fa-checkbox {
          &:hover {
            .fa-checkbox-inner {
              border-color: $error-color;
            }
          }
        }

        .fa-checkbox-checked {
          .fa-checkbox-inner {
            background-color: $error-color;
            border-color: $error-color;
          }

          &::after {
            border-color: $error-color;
          }
        }
      }
    }

    .yellow {
      color: $warning-color;

      ::v-deep {
        .fa-checkbox {
          &:hover {
            .fa-checkbox-inner {
              border-color: $warning-color;
            }
          }
        }

        .fa-checkbox-checked {
          .fa-checkbox-inner {
            background-color: $warning-color;
            border-color: $warning-color;
          }

          &::after {
            border-color: $warning-color;
          }
        }
      }
    }

    .tip-icon {
      margin-left: 4px;
    }
  }

  .data-number {
    @include ellipsis;

    height: 42px;
    font-size: 32px;
    font-weight: 700;
    line-height: 42px;
    color: $color-00;
  }

  .customer-data-map {
    height: 332px;
  }

  .pie-wrap {
    @include flex-top-center;

    height: 302px;
    max-width: 569px;
    margin: 0 auto;
  }

  .pie-list {
    @include flex-column-center;

    width: 249px;
    height: 270px;
    overflow: hidden;

    &:hover {
      overflow-y: scroll;
    }

    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: $color-b2;
      border-radius: 2px;
    }
  }

  .pie-item-wrap {
    width: 100%;
    max-height: 270px;
  }

  .pie-item {
    @include flex-center;

    margin-bottom: 16px;

    .icon {
      width: 16px;
      height: 16px;
      min-width: 16px;
      margin-right: 12px;
      border-radius: 2px;
    }

    .desc {
      @include ellipsis;

      width: calc(100% - 28px);
      font-size: 16px;
      line-height: 21px;
      color: $color-00;
    }

    .desc-data {
      color: $color-89;
    }
  }

  .task-data {
    @include ellipsis;

    width: 249px;
    font-size: 16px;
    color: $color-89;
  }

  .pie-map {
    width: calc(100% - 249px);
    height: 270px;
    padding: 7px 0;
    box-sizing: border-box;
  }

  .follow-phase {
    height: 600px;
  }
}
</style>
<style lang="scss">
.chart-center__visit-data-tip {
  width: 206px;
  padding: 12px;
  padding-right: 16px;
  text-align: left;
  box-sizing: border-box;

  &.setCustomMap {
    width: auto;
  }

  &.funnelTip {
    width: 100%;
    max-width: 500px;
  }

  .title {
    margin-bottom: 12px;
    font-size: 16px;
    color: $color-89;
  }

  .tip {
    @include flex-left;
    @include ellipsis;

    font-size: 14px;
    color: $color-00;
  }

  .dot {
    width: 8px;
    height: 8px;
    margin-right: 6px;
    border-radius: 50%;
  }
}
</style>
