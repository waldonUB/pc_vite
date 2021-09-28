<!--
 * @Description  : 获客文章 - 数据
 * @Author       : turbo
 * @Date         : 2021-03-30 12:45:07
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-25 16:21:10
-->

<template>
  <div class="dataCenter">
    <div class="dataMain" v-show="isShow">
      <global-ts-header>
        <template v-slot:leftPart>
          <div class="topTitle">
            文章数据
            <global-ts-tool-tips placement="bottom-start">
              <global-ts-svg-icon class="icon" name="icon-bianzu" />
              <div slot="content">
                <p class="tooltipContent">分享人数：将素材文章创建分享的员工数</p>
                <p class="tooltipContent">阅读人数：文章在分享后，阅读的人数</p>
                <p class="tooltipContent">阅读时长：文章在分享后，阅读的时长</p>
                <p class="tooltipContent">转发次数：文章在分享后，被转发的次数</p>
              </div>
            </global-ts-tool-tips>
          </div>
        </template>
      </global-ts-header>
      <div class="pro_listBox">
        <global-ts-version class="normalSet" :class="isManage ? '' : 'staffVersion'"></global-ts-version>
        <global-ts-slide
          ref="dataCenterSlider"
          class="bottomBorder"
          :activeNum="activeNum"
          :slidArray="dataCenterResponsibility.resonsibilityStatusDef"
          @changeStatus="changeResonsibilityStatus"
        >
        </global-ts-slide>
        <keep-alive>
          <component
            :is="currentTemp"
            @toView="changeResonsibilityStatus"
            :articleParams="articleParams"
            :isShow.sync="isShow"
          >
          </component>
        </keep-alive>
      </div>
    </div>
    <div id="ts-dataInfo"></div>
  </div>
</template>

<script>
import articleData from './components/article-data/index.vue';
import staffData from './components/staff-data/index.vue';
import visitorData from './components/visitor-data/index.vue';
import accessDetail from './components/access-detail/index.vue';
import { mapGetters, mapState } from 'vuex';
import { FdpLog, logDog } from '@/utils';

export default {
  name: 'DataCenter',
  components: { articleData, staffData, visitorData, accessDetail },
  data() {
    return {
      dataCenterResponsibility: {
        resonsibilityStatusDef: [
          {
            key: '文章数据', // 仅对管理员开放，没有版本限制
            value: 1,
          },
          {
            key: '分享数据',
            value: 2,
          },
          // {
          //     key: '访客数据',
          //     value: 3,
          // },
          {
            key: '访问明细',
            value: 3,
          },
        ],
        allList: [
          {
            key: 0,
            value: '全部',
          },
        ],
        typeList: [
          {
            key: 0,
            value: '全部类别',
          },
        ],
      },
      requestParam: {
        type: 0,
        createTime: '',
        title: '',
      },
      activeNum: 0,
      // pickerOptions: [],
      currentTemp: 'articleData',
      articleParams: {}, // 销售员数据跳到访客数据的文章参数
      isShow: true,
      visitorDataDetail: {}, // 访客详情
    };
  },
  computed: {
    ...mapGetters({
      isManage: 'user/isManage',
    }),
  },
  created() {
    if (!this.isManage) {
      this.dataCenterResponsibility.resonsibilityStatusDef = this.dataCenterResponsibility.resonsibilityStatusDef.filter(
        item => item.value !== 1,
      );
    }
    FdpLog('yx_cksj', {
      // 查看数据
      yx_free_text_1: this.dataCenterResponsibility.resonsibilityStatusDef[0].key,
    });
    // try {
    if (this.$router.currentRoute && this.$router.currentRoute.query.currentTab) {
      console.log('this.$router.currentRoute----->', this.$router.currentRoute);
      switch (this.$router.currentRoute.query.currentTab) {
        case 'staff':
          setTimeout(() => {
            this.changeResonsibilityStatus(null, 2, {});
          });
          break;
        case 'visitor': // 互动页面跳过来所携带的参数，定位到访客数据
          setTimeout(() => {
            this.changeResonsibilityStatus(null, 3, {});
          });
          break;
      }
    } else {
      const queryParam = this.$router.currentRoute.params;
      console.log('queryParam---->', queryParam);
      const param = Object.assign(
        {},
        {
          title: queryParam.title,
          isToView: queryParam.isToView,
          type: queryParam.type,
          currentTab: queryParam.currentTab,
        },
      );
      if (queryParam.type === 4 && queryParam.currentTab === 'staff') {
        setTimeout(() => {
          this.changeResonsibilityStatus(null, 2, param);
        });
      }
    }
  },
  methods: {
    /**
     * 改变slider的回调
     * @author waldon
     * @date 2020-04-19
     * @param {*} node
     * @param {*} index
     * @param {*} articleParams 文章传过来的参数
     */
    changeResonsibilityStatus(node, index, articleParams) {
      const sliderItem = this.$refs.dataCenterSlider.$refs.sliderItem;
      let yx_free_text_1 = '';
      console.log('node, index, articleParams', node, index, articleParams);

      switch (index) {
        case 1:
          logDog('dataCenter_article');
          this.currentTemp = 'articleData';
          this.activeNum = 1;
          yx_free_text_1 = '文章数据';
          break;
        case 2:
          logDog('dataCenter_staffData');
          this.currentTemp = 'staffData';
          this.articleParams = articleParams instanceof Object ? articleParams : {};
          this.activeNum = 2;
          // this.$refs.dataCenterSlider.target = sliderItem[sliderItem.length - 2]
          this.$refs.dataCenterSlider.target = sliderItem[sliderItem.length - 2];
          yx_free_text_1 = '员工数据';
          break;
        // case 3:
        //     logDog('dataCenter_visitorData')
        //     // 组件内通过node.target计算left和width，点击数据详情跳转的时候无法获取到node，这里直接获取第三个target
        //     this.currentTemp = 'visitorData'
        //     this.articleParams = articleParams || {}
        //     this.activeNum = 3
        //     this.$refs.dataCenterSlider.target = sliderItem[sliderItem.length - 2]
        //     // this.$refs.dataCenterSlider.target = sliderItem[index - 1]
        //     break
        case 3:
          this.currentTemp = 'accessDetail';
          this.activeNum = 3;
          this.articleParams = articleParams instanceof Object ? articleParams : {};
          this.$refs.dataCenterSlider.target = sliderItem[sliderItem.length - 1];
          yx_free_text_1 = '访问明细';
          break;
        default:
          this.currentTemp = 'articleData';
          this.activeNum = 1;
          yx_free_text_1 = '文章数据';
      }
      FdpLog('yx_cksj', {
        // 查看数据
        yx_free_text_1,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/* elementUI的tooltip对svg图标的计算有误差 */
.dataCenter {
  .dataMain {
    .topTitle {
      .icon {
        width: 1.7em;
        height: 1.2em;
        margin: 0 2px 0 -0.25em;
        overflow: hidden;
        color: #247af3;
        vertical-align: -0.15em;
      }
    }
    .pro_listBox {
      position: relative;
      ::v-deep .ts-slide-card {
        .slide-children {
          margin-right: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .bottomBorder {
        position: relative;
        padding-bottom: 17px;
        margin-bottom: 20px;
      }

      /* -----------高级版图标----------- */
      .normalSet {
        position: absolute;
        top: 25px;
        left: 304px;
        z-index: 99;
        &.staffVersion {
          left: 200px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.el-tooltip__popper .tooltipContent {
  line-height: 22px;
}

/* -----------访客数据----------- */
.dataCenter {
  .pro_listBox .visitorData .pro_line,
  .ts-dataInfo .pro_listBox .pro_line {
    float: none;
    min-width: 1020px;
    padding-bottom: 20px;
  }
}

/* dataInfo */
.dataCenter {
  .ts-dataInfo {
    .pro_listBox {
      .topPart {
        display: inline-block;
        .infoBox {
          display: flex;
          float: left;
          padding: 20px 0;
          margin-bottom: 20px;
          border-radius: 4px;
          box-shadow: 1px 1px 4px 2px rgba(50, 56, 54, 0.1);
          flex: 3;
          & > div {
            width: 135px;
            height: 43px;
            padding: 0 5px;
            overflow: hidden;
            text-align: center;
            text-overflow: ellipsis;
            white-space: nowrap;
            border-right: #eeeeee 1px solid;
            &:last-of-type {
              border-right: none;
            }
            & > p {
              margin-bottom: 10px;
              font-weight: bold;
            }
          }
        }
      }
      .pro_line {
        .tshu_input {
          float: left;
          width: 150px;
          margin-right: 10px;
        }
      }
      .tanshu-slide-card {
        border-bottom: #eeeeee 1px solid;
        .slide-children {
          margin-bottom: 33px;
          font-size: 14px;
          line-height: 12px;
        }
        &::after {
          height: 0;
        }
      }
    }
  }
}
</style>
