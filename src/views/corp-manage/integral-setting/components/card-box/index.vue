<!--
 * @Author       : ADI
 * @Date         : 2021-07-20 14:25:28
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-20 14:28:18
-->
<template>
  <div class="cardBox cardInWhite">
    <img class="imgIcon" :src="cardBoxData.imgIconUrl" />
    <div class="content">
      <div class="title">
        {{ cardBoxData.title }}
        <global-ts-version class="versionIcon" :limitVer="showVer"></global-ts-version>
      </div>
      <div class="desc">{{ cardBoxData.desc }}</div>
    </div>
    <div class="settingBox tanshu_linkColor" @click="handleClick">设置</div>
  </div>
</template>

<script>
import versionDef from '@/config/version-def';
import defaultImgIMG from '@/assets/image/defaultImg.png';

export default {
  name: 'card-box',
  components: {},
  props: {
    cardBoxData: {
      imgIconUrl: defaultImgIMG,
      title: '',
      desc: '',
    },
  },
  data() {
    return {
      showVer: versionDef.getLimitVer('MID', 'PROFESSIONNAL'), // 直销：专业版； 分销：高级版/尊享版/专用版
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleClick() {
      this.$emit('setting');
    },
  },
};
</script>

<style lang="scss" scoped>
.cardBox {
  display: flex;
  width: 535px;
  height: 120px;
  padding: 20px;
  cursor: pointer;
  box-sizing: border-box;
  flex-direction: row;
  .imgIcon {
    display: block;
    width: 80px;
    height: 80px;
    margin-right: 20px;
  }
  .content {
    display: flex;
    width: 347px;
    height: 80px;
    margin-right: 20px;
    flex-direction: column;
    justify-content: space-around;
    .title {
      display: flex;
      width: 347px;
      overflow: hidden;
      font-size: 16px;
      font-weight: bold;
      color: $color-00;
      text-overflow: ellipsis;
      white-space: nowrap;
      align-items: center;
      .versionIcon {
        margin-top: 1px;
      }
    }
    .desc {
      width: 347px;
      overflow: hidden;
      font-size: 14px;
      color: $color-b2;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .settingBox {
    display: block;
    height: 80px;
    font-size: 14px;
    line-height: 80px;
    white-space: nowrap;
  }
}
</style>
