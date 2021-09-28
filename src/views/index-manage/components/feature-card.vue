<!--
 * @Description  : 首页功能卡片
 * @Author       : turbo
 * @Date         : 2021-05-31 14:50:43
 * @LastEditors  : turbo
 * @LastEditTime : 2021-06-02 11:37:18
-->

<template>
  <div v-if="isShow" class="feature-card" @click="openIntroduction">
    <div class="feature-card__content">
      <img class="feature-card__img" :src="imgUrl" />
      <div class="feature-card__text">
        <div class="text-title">{{ title }}</div>
        <div class="text-desc">
          <div v-for="(item, index) in mainDesc" :key="index">{{ mainDesc[index] }}</div>
        </div>
      </div>
    </div>
    <div class="feature-card__bottomDesc">{{ bottomDesc }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

// assets
import defaultImg from '@/assets/image/defaultImg.png';
import getUserImg from '@/assets/image/indexManage/getUser.png';
import visitCardImg from '@/assets/image/indexManage/visitCard.png';
import formImg from '@/assets/image/indexManage/form.png';
import myMallImg from '@/assets/image/indexManage/myMall.png';
import managerImg from '@/assets/image/indexManage/manager.png';
import taskImg from '@/assets/image/indexManage/task.png';
import weChatImg from '@/assets/image/indexManage/weChat.png';
import dataCenterImg from '@/assets/image/indexManage/dataCenter.png';
import integralImg from '@/assets/image/comm/pointPic.png';

export default {
  name: 'FeatureCard',
  props: {
    type: {
      type: String,
      default: '',
    },
    imgSrc: {
      type: String,
      default: defaultImg,
    },
    title: {
      type: String,
      default: 'H5文章获客',
    },
    mainDesc: {
      type: Array,
      default() {
        return [];
      },
    },
    bottomDesc: {
      type: String,
      default: '裂变分享、朋友圈营销',
    },
    cardRowData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      /**
       * 这里存放的是卡片跳转的路由集合
       * 这里的 key 即数组的值对应本地配置中心 TsPortalIndexConf 的卡片数据的 type
       * 2020-12-2 turbo 改成数组形式，下标 0 表示销售员跳转路由，下标 1 表示管理员跳转路由
       */
      cardMap: new Map([
        [
          'getUser',
          {
            img: getUserImg,
            urlList: ['/articleMaterial', '/articleMaterial'],
          },
        ],
        [
          'visitCard',
          {
            img: visitCardImg,
            urlList: ['/editCard', '/editCard'],
          },
        ],
        [
          'form',
          {
            img: formImg,
            urlList: ['/formManage', '/formManage'],
          },
        ],
        [
          'myMall',
          {
            img: myMallImg,
            urlList: ['/mallData', '/mallProductManage'],
          },
        ],
        [
          'manager',
          {
            img: managerImg,
            urlList: ['/customList', '/customList'],
          },
        ],
        [
          'task',
          {
            img: taskImg,
            urlList: ['/myTask', '/allTask'],
          },
        ],
        [
          'weChat',
          {
            img: weChatImg,
            urlList: ['/bindMp', '/bindMp'],
          },
        ],
        [
          'dataCenter',
          {
            img: dataCenterImg,
            urlList: ['/chartCenter', '/chartCenter'],
          },
        ],
        [
          'integral',
          {
            img: integralImg,
            urlList: ['/integralList', '/integralList'],
          },
        ],
      ]),
    };
  },
  computed: {
    ...mapGetters({
      isManage: 'user/isManage',
    }),
    isShow() {
      return this.type !== 'form' || this.isManage;
    },
    imgUrl() {
      return this.cardMap.get(this.type)?.img;
    },
  },
  methods: {
    /**
     * 是否显示无权限提示
     * @author waldon
     * @date 2021/1/8
     * @param {String} type - 参数1
     * @returns {Boolean} - 是否显示提示
     */
    isShowTip(type) {
      if (this.cardRowData.auth && !this.cardRowData.auth.isCanJump) {
        this.$utils.postMessage({
          type: 'error',
          message: '暂无该功能权限，请联系管理员',
        });
        return true;
      } else {
        return false;
      }
    },
    openIntroduction() {
      switch (this.type) {
        // 获客文章
        case 'getUser':
          this.$utils.logDog('home_clickArticleCard');
          break;
        // 智能名片获客
        case 'visitCard':
          this.$utils.logDog('home_clickGetCustom');
          break;
        case 'myMall':
          this.$utils.logDog('home_clickMall');
          break;
        case 'manager':
          this.$utils.logDog('home_clickManageCustom');
          break;
        // 任务中心
        case 'task':
          this.$utils.logDog('home_clickSale');
          break;
        case 'radar':
          this.$utils.logDog('home_clickSearchMoney');
          break;
        case 'weChat':
          this.$utils.logDog('home_clickAuthorizeWX');
          break;
        case 'dataCenter':
          this.$utils.logDog('home_clickDataCenter');
          break;
        case 'form':
          this.$utils.logDog('home_clickForm');
          break;
      }
      // 数据中心 dataCenter 是和文章一起的
      if (this.cardMap.has(this.type) && this.isShowTip(this.type)) return;
      this[['radar'].includes(this.type) ? 'toIntroductPage' : 'toTabPage']();
    },
    toIntroductPage() {
      this.$emit('toIntroductPage', this.type);
    },
    toTabPage() {
      this.$router.push({
        path: this.cardMap.get(this.type)?.urlList[Number(this.isManage)],
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.feature-card {
  @include card-in-gray-hover;

  width: 317px;
  height: 155px;
  padding: 20px 0 10px 20px;
  margin: 20px 20px 0 0;
  box-sizing: border-box;
  transition: all 0.5s;

  &:hover {
    cursor: pointer;
    transform: translate3d(0, -5px, 0);
  }

  .feature-card__content {
    display: flex;
    padding-bottom: 20px;
    overflow: hidden;
    border-bottom: 1px solid $color-ee;
  }

  .feature-card__img {
    width: 80px;
    height: 80px;
  }

  .feature-card__text {
    @include flex-column-left;

    height: 80px;
    margin-left: 10px;

    .text-title {
      margin-bottom: 10px;
      font-size: 16px;
      line-height: 16px;
      color: $color-00;
    }

    .text-desc {
      font-size: 14px;
      line-height: 21px;
      color: $color-b2;
    }
  }

  .feature-card__bottomDesc {
    margin-top: 10px;
    font-size: 14px;
    line-height: 14px;
    color: $color-53;
  }
}
</style>
