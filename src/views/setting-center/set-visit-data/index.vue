<!--
 * @Description  : 获取访客数据
 * @Author       : turbo
 * @Date         : 2021-03-30 15:46:37
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-13 16:45:52
-->

<template>
  <div class="setVisitData">
    <global-ts-header>
      <template v-slot:leftPart>
        获客工具
        <global-ts-svg-icon class="icon helpIcon" name="icon-bianzu" @click="toHelpCenter"></global-ts-svg-icon>
      </template>
    </global-ts-header>
    <div class="pro_listBox" v-cloak>
      <global-ts-slide
        class="tanshu-bottomBorder"
        :activeNum="activeNum"
        :slidArray="slideList"
        @changeStatus="changeSlide"
      >
      </global-ts-slide>
      <component ref="channelMenu" :is="currentTemp"> </component>
    </div>
  </div>
</template>

<script>
import folderMaterialSetting from './components/folder-material-setting/index.vue';
import articleFuncSetting from './components/article-func-setting/index.vue';
import posterQrSetting from './components/poster-qr-setting/index.vue';
import visitDataSetting from './components/visit-data-setting/index.vue';
import { mapState } from 'vuex';

export default {
  name: 'setVisitData',
  components: {
    folderMaterialSetting,
    articleFuncSetting,
    posterQrSetting,
    visitDataSetting,
  },
  props: {},
  data() {
    return {
      currentTemp: 'folderMaterialSetting',
      slideList: [
        {
          key: '文件夹',
          value: 'folderMaterialSetting',
        },
        {
          key: '获客文章',
          value: 'articleFuncSetting',
        },
        {
          key: '获客海报',
          value: 'posterQrSetting',
        },
        {
          key: '获取访客数据',
          value: 'visitDataSetting',
        },
      ],
      activeNum: 'folderSetting',
      mainTitle: '文件夹',
    };
  },
  computed: {
    ...mapState({
      helpDoc: state => state.globalData?.wxWorkConf?.compMaterialConf?.helpDoc,
    }),
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /**
     * 切换页面
     * @author lymn
     * @date 2020-04-19
     * @date 2020-07-15
     * @param {object} node节点
     * @param {Number} value 选中一级分类的value
     */
    changeSlide(e, value) {
      this.currentTemp = value;
    },
    toHelpCenter() {
      window.open(this.helpDoc, '_blank');
    },
  },
};
</script>

<style lang="scss" scoped>
.setVisitData {
  height: 100%;
}
</style>

<style lang="scss">
.setVisitData {
  .pro_listBox {
    position: relative;
    min-height: calc(100% - 54px);
    box-sizing: border-box;
  }
  .el-checkbox__label {
    display: inline;
  }
}
</style>
