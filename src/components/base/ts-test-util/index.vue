<!--
 * @Author       : ADI
 * @Date         : 2021-05-17 17:27:01
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-31 15:47:53
-->
<template>
  <a class="testIcon" href="/admSet.jsp" target="_blank">
    <img class="iconImg" :src="insideTestIMG" alt="" />
    <p>易销测试工具</p>
    <img :src="testImg" alt="" class="qrCodeImg" />
  </a>
</template>

<script>
import { mapState } from 'vuex';
import { getAppQrcode } from '@/api/modules/utils/test';
import insideTestIMG from '@/assets/image/insideTest/insideTest.png';

export default {
  name: 'test',
  components: {},
  props: {},
  data() {
    return {
      testImg: '',
    };
  },
  computed: {
    insideTestIMG() {
      return insideTestIMG;
    },
  },
  watch: {},
  created() {
    this.getUrl();
  },
  mounted() {},
  methods: {
    async getUrl() {
      const [err, res] = await getAppQrcode();
      if (err) {
        return;
      }
      this.testImg = res.data.qrUrl;
    },
  },
};
</script>

<style lang="scss" scoped>
.testIcon {
  position: fixed;
  right: 20px;
  bottom: 50px;
  z-index: $zindex-ad;
  width: 80px;
  background: $color-ff;
  border: 1px solid #000000;
  .iconImg {
    display: block;
    width: 60px;
    height: 60px;
    margin: 0 auto;
  }
  .qrCodeImg {
    position: absolute;
    right: 120px;
    bottom: 0;
    z-index: 9999;
    display: none;
    width: 150px;
    height: 150px;
    background: grey;
  }
  &:hover {
    .qrCodeImg {
      display: block;
    }
  }
  p {
    margin-top: 10px;
    font-size: 12px;
    color: #000000;
    text-align: center;
  }
}
</style>
