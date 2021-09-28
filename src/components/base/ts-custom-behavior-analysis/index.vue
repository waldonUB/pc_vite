<!--
 * @Description  : 客户行为分析
 * @Author       : turbo
 * @Date         : 2021-06-28 15:59:09
 * @LastEditors  : turbo
 * @LastEditTime : 2021-06-30 15:08:16
-->

<template>
  <div v-if="checkHasVersion" class="custom-behavior-analysis">
    <div class="charts-item">
      <div ref="line" class="line"></div>
    </div>
    <div class="charts-item">
      <div ref="pie" class="pie"></div>
      <ul class="ul-wrapper">
        <li class="li-list" v-for="(item, index) in pieTableData" :key="item.name">
          <p v-if="item.name !== '其他兴趣'" class="li-content">
            <span class="dot" :style="{ backgroundColor: pieTableDataColor[index] }"></span>
            <span>{{ item.name }}</span>
            <span>（{{ item.value }}%）</span>
          </p>
          <el-tooltip v-else effect="dark" placement="bottom">
            <div slot="content">
              <div class="li-list" v-for="item in pieOtherProportionData" :key="item.name">
                <span>{{ item.name }}</span>
                <span>（{{ item.value }}%）</span>
              </div>
            </div>
            <p class="li-content">
              <span class="dot" :style="{ backgroundColor: pieTableDataColor[index] }"></span>
              <span>{{ item.name }}</span>
              <span>（{{ item.value }}%）</span>
            </p>
          </el-tooltip>
        </li>
      </ul>
    </div>
    <ts-clue
      class="charts-item"
      :slide-val="1"
      :is-follow="false"
      :is-custom-analysis="true"
      :noshop="noShop"
      :viewer-id="viewerId"
    ></ts-clue>
  </div>
  <div v-else class="no-permission">
    <span class="text">{{ emptyTips }}</span>
    <a :href="updateVersionUrl" target="_blank">立即升级</a>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import echarts from '@fk/fa-echarts';
import moment from 'moment';

// assets
import noProduction from '@/assets/image/customList/no_production.png';

// components
import TsClue from '@/components/base/ts-clue/index.vue';

// config
import versionDef from '@/config/version-def';

// api
import { client } from '@/api';

export default {
  name: 'CustomBehaviorAnalysis',
  components: { TsClue },
  props: {
    viewerId: {
      type: Number,
    },
  },
  data() {
    return {
      xAxisArr: [], // 折线图横坐标时间
      lineData: [], // 折线图每个横坐标对应的
      pieData: [], // 饼图图的数据
      pieTableData: [], // 饼图旁边的数据
      pieOtherProportionData: [], // 饼图的其他数据
      pieColor: ['#2882FF', '#FFC96A', '#FF4D4D', '#FF9900'], // 饼图颜色
      pieTableDataColor: ['#2882FF', '#FFC96A', '#FF4D4D', '#FF9900'], // 饼图旁边的颜色
      isShowToolTip: true, // 是否展示tooltip
    };
  },
  computed: {
    ...mapState({
      updateVersionUrl: state => state.globalData.addressUrl?.updateVersionUrl,
    }),
    /**
     * 暂无产品图片
     * @author wuying
     * @date 2021-06-18
     */
    noShop() {
      return noProduction;
    },
    /**
     * 版本校验
     */
    checkHasVersion() {
      // 七天试用版
      if (versionDef.getIsFreeTry()) {
        return true;
      }
      return versionDef.checkVersion(
        this.$store.state.user.info.isOem
          ? versionDef.NotDirectVersionDef.VersionList.MID
          : versionDef.DirectVersionDef.VersionList.PROFESSIONNAL,
      );
    },
    /**
     * 配置折线图
     * @author wuying
     * @date 2021-06-10
     * @returns
     */
    lineChartConfiguration() {
      return {
        title: {
          text: '近15日活跃',
          padding: 20,
          textStyle: {
            fontSize: 14,
          },
        },
        itemStyle: {
          color: '#247AF3',
        },
        lineStyle: {
          color: '#247AF3',
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#FFFFFF',
          textStyle: {
            color: '#535353',
          },
        },
        grid: {
          top: 64,
          left: 20,
          right: 20,
          bottom: 20,
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xAxisArr,
          axisLine: {
            lineStyle: {
              color: '#dadada', // 坐标轴线线的颜色。
            },
          },
          axisLabel: {
            textStyle: {
              color: '#535353', // 更改坐标轴文字颜色
              fontSize: 11, // 更改坐标轴文字大小
            },
          },
        },
        yAxis: {
          type: 'value',
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
            type: 'value',
            color: '#535353', // 坐标轴名称的颜色
            max: 150,
            min: 0,
            splitNumber: 5,
          },
          axisTick: {
            show: false, // 是否显示坐标轴刻度
          },
        },
        series: [
          {
            name: '访问次数',
            type: 'line',
            stack: '总量',
            data: this.lineData,
            areaStyle: {
              normal: {
                // 颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(36, 122, 243, .33)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(36, 122, 243, 0)',
                  },
                ]),
              },
            },
          },
        ],
      };
    },
    /**
     * 配置饼图
     * @author wuying
     * @date 2021-06-10
     * @returns
     */
    pieChartConfiguration() {
      return {
        color: this.pieColor,
        title: {
          text: '兴趣分布',
          padding: 20,
          textStyle: {
            fontSize: 14,
          },
        },
        tooltip: {
          backgroundColor: '#FFFFFF',
          show: this.isShowToolTip,
          textStyle: {
            color: '#535353', //设置文字颜色
          },
          trigger: 'item',
          formatter: function(param) {
            return param.marker + ' ' + param.name + '：' + param.value + '%';
          },
        },
        legend: {
          show: false,
        },
        series: [
          {
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'none',
            },
            emphasis: {
              label: {
                normal: {
                  textStyle: {},
                },
              },
            },
            data: this.pieData,
          },
        ],
      };
    },
    /**
     * 版本升级
     */
    emptyTips() {
      return `当前版本无法使用此功能，请升级至${
        this.$store.state.user.info.isOem
          ? versionDef.getVersionName(versionDef.NotDirectVersionDef.VersionList.MID)
          : versionDef.getVersionName(versionDef.DirectVersionDef.VersionList.PROFESSIONNAL)
      }`;
    },
  },
  mounted() {
    this.getData();
    this.$utils.FdpLog('yx_khxqy', {
      yx_free_text_0: '客户分析tab',
    });
  },
  methods: {
    async getData() {
      if (!this.checkHasVersion) return;
      const { getTsViewerBehaviorAnalysis } = client;
      const [err, res] = await getTsViewerBehaviorAnalysis({
        viewerIds: JSON.stringify([this.viewerId]),
      });
      if (err) {
        return Promise.reject(err);
      }
      const data = res.data;
      data.dayAnalysis.forEach(ele => {
        for (const iterator in ele) {
          this.xAxisArr.push(moment(iterator).format('MM.DD'));
          this.lineData.push(ele[iterator]);
        }
      });
      data.behaviorProportion.mainProportion.forEach(ele => {
        for (const iterator in ele) {
          this.pieData.push({
            name: iterator,
            value: parseInt(ele[iterator]),
          });
        }
        this.pieTableData = this.pieData;
      });
      if (this.pieData.every(ele => ele.value === 0)) {
        this.isShowToolTip = false;
        this.pieColor = ['#F3F3F5'];
        this.pieData = [
          {
            color: '#F3F3F5',
            value: 0,
            itemStyle: {
              emphasis: {
                color: '#F3F3F5',
              },
            },
          },
        ];
      }
      data.behaviorProportion.otherProportion.forEach(ele => {
        for (const iterator in ele) {
          this.pieOtherProportionData.push({
            name: iterator,
            value: parseInt(ele[iterator]),
          });
        }
      });
      [
        { type: this.$refs.line, option: this.lineChartConfiguration },
        { type: this.$refs.pie, option: this.pieChartConfiguration },
      ].forEach(ele => {
        this.initializeGraphics(ele.type, ele.option);
      });
    },
    /**
     * 初始化图形
     * @author wuying
     * @date 2021-06-10
     * @param {Object} domType - 图形类型
     * @param {Object} option - 图形配置
     */
    initializeGraphics(domType, option) {
      const type = echarts.init(domType);
      if (option && typeof option === 'object') {
        type.setOption(option);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-behavior-analysis {
  height: 100%;
  overflow: auto;
  background-color: $color-f7;

  .charts-item {
    position: relative;
    margin-bottom: 12px;
    background-color: $color-ff;

    &:last-child {
      height: auto;
      margin-bottom: 0;
      border-bottom: 1px solid $border-color;
    }
  }

  .line {
    height: 258px;
  }

  .pie {
    height: 200px;
  }

  .ul-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%);
  }

  .li-list {
    color: $color-53;
  }

  .li-content {
    @include flex-left;
  }

  .dot {
    width: 8px;
    height: 8px;
    margin-right: 8px;
    border-radius: 50%;
  }
}

.li-list {
  &:not(:last-of-type) {
    margin-bottom: 12px;
  }
}

.no-permission {
  @include flex-center;

  height: 100%;

  .text {
    margin-right: 6px;
    color: #151716;
  }
}
</style>
