<!--
 * @Description  : 首页
 * @Author       : turbo
 * @Date         : 2021-02-23 16:18:33
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-16 11:40:19
-->

<template>
  <div class="index-wrap">
    <ts-corp-top-tip from-page="首页"></ts-corp-top-tip>
    <img v-if="showRouterTip" :src="newRouterTipImg" class="new-router-tip-img" @click="confirmRouterTip" />
    <component
      :is="currentComponent"
      :real-mp-qr="realMpQr"
      :type="introductType"
      @toIntroductPage="toIntroductPage"
    ></component>
  </div>
</template>

<script>
import { mapState } from 'vuex';

// assets
import newRouterTipImg from '@/assets/image/indexManage/newRouterTip.png';

// components
import TsCorpTopTip from '@/components/base/ts-corp-top-tip/index.vue';
import IndexManageBox from './components/index-manage-box.vue';

// utils
import { getGuideList, saveGuide } from '@/utils';

// config
import TsCommDef from '@/config/ts-comm-def';

export default {
  name: 'IndexManage',
  components: { TsCorpTopTip, IndexManageBox },
  data() {
    return {
      showRouterTip: false, // 是否显示路由提示图
      newRouterTipImg,
      currentComponent: 'indexManageBox',
      introductType: '',
      urlController: {
        // 管理员路由控制器
        getUser: '/articleMaterial', // H5文章获客
        visitCard: '/cardManager', // 智能名片
        file: '/wxCorpMaterial', // 文件获客
        manager: '/customList', // 客户管理
        weChat: '/bindMp', // 微信授权
        wxWork: '/wxTagManager', // 企微授权
        form: '/formManage', // 企业表单
        myMall: '/mallProductManage', // 商品管理
      },
      staffUrlController: {
        // 销售员路由控制器
        visitCard: '/cardManager', // 智能名片
        file: '/wxPersonMaterial', // 文件获客
        wxWork: '/wxCorpApp', // 企微助手
        manager: '/customList', // 客户管理
        form: '/formData', // 表單数据
      },
    };
  },
  computed: {
    /**
     * 获取二维码
     * @author enson
     * @date 2020-04-10
     * @returns
     */
    realMpQr() {
      return `${this.$store.getters.tsportalUrlProxy}/shareQr.jsp`;
    },
  },
  created() {
    this.$utils.logDog('expose_home');
    this.getNewRouterGuide();
  },
  methods: {
    /**
     * 获取新路由指引提示
     * @author lymn
     * @date 2021-04-23
     */
    getNewRouterGuide() {
      getGuideList().then(data => {
        this.showRouterTip = !data[TsCommDef.GuideStepDef.routerNew];
      });
    },
    /**
     * 点击路由提示图片
     * @author lymn
     * @date 2021-03-16
     */
    confirmRouterTip() {
      this.showRouterTip = false;
      saveGuide(TsCommDef.GuideStepDef.routerNew);
    },
    toIntroductPage() {
      this.currentComponent = 'introductBox'; // 看了下是已经去掉介绍页的逻辑了，暂时就不把介绍页迁移过来了
    },
  },
};
</script>

<style lang="scss" scoped>
.new-router-tip-img {
  position: fixed;
  top: 60px;
  left: 124px;
  z-index: 20;
  width: 300px;
  height: auto;
  cursor: pointer;
}
</style>
