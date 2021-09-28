<!--
 * @Description  : 名片数据
 * @Author       : turbo
 * @Date         : 2021-03-18 16:19:09
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-08 10:28:33
-->

<template>
  <div class="cardData">
    <div v-show="isShow">
      <ts-qr-dialog desc="立即扫码登录小程序，获取意向客户" :isShowDialog.sync="isShowDialog" />
      <global-ts-header>
        <template v-slot:leftPart>
          <div class="flex flex-vc">
            访问明细
            <global-ts-version :hideHoverText="true"></global-ts-version>
          </div>
        </template>
      </global-ts-header>
      <div class="pro_listBox" v-cloak>
        <component :is="currentTemp" :isShow.sync="isShow" @toShare="toShare"> </component>
      </div>
    </div>
  </div>
</template>

<script>
import accessDetail from './components/access-detail/index.vue';
import { mapGetters } from 'vuex';
import TsQrDialog from '@/components/base/ts-qr-dialog/index.vue';

export default {
  name: 'CardData',
  components: { accessDetail, TsQrDialog },
  data() {
    return {
      isShow: true, // false则显示访客详情
      isShowDialog: false, // 是否显示二维码弹窗
      slideList: [
        {
          key: '名片数据',
          value: 1,
        },
      ],
      activeNum: 0,
      currentTemp: 'accessDetail',
      staffList: [],
    };
  },
  computed: {
    ...mapGetters({
      isCanSelect: 'user/isManage',
    }),
  },
  created() {
    this.$utils.logDog('formData_show');
    this.$utils.FdpLog('yx_mpsj'); // 名片数据
    // if (!initTsParam.userInfo.staffInfo.isUpperAdm) {
    //     this.slideList = this.slideList.filter(item => item.value !== 2)
    // }
    // 要等销售员load完了才能继续load其他的
    // await this.getTsStaffList()
    // await this.getFormSelectList()
    // this.cardResponsibility.httpurl = `/ajax/form/tsForm_h.jsp?cmd=getTsFormDataList`
  },
  methods: {
    /**
     * @description 弹窗出小程序的二维码
     * @author enson
     * @date 2020-05-15
     */
    toShare() {
      this.isShowDialog = true;
    },
    /**
     * 改变slider的回调
     * @author lymn
     * @date 2020-07-02
     * @param {Object} node 节点
     * @param {Number} index slider索引
     */
    changeResonsibilityStatus(node, index) {
      switch (index) {
        case 1:
          this.currentTemp = 'accessDetail';
          this.activeNum = 1;
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.cardData .pro_listBox .bottomBorder {
  position: relative;
  padding-bottom: 17px;
  margin-bottom: 20px;
}
</style>
