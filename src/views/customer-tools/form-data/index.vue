<!--
 * @Description  : 获客表单 - 数据
 * @Author       : turbo
 * @Date         : 2021-03-30 13:46:10
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-30 17:02:41
-->

<template>
  <div class="formData">
    <div v-show="isShow">
      <ts-qr-dialog desc="立即扫码登录小程序，获取意向客户" :isShowDialog.sync="isShowDialog"> </ts-qr-dialog>
      <global-ts-header>
        <template v-slot:leftPart>
          <div class="flex flex-vc">
            表单数据
            <global-ts-version :hideHoverText="true"></global-ts-version>
          </div>
        </template>
      </global-ts-header>
      <div class="pro_listBox" v-cloak>
        <global-ts-slide
          ref="dataCenterSlider"
          class="bottomBorder"
          :activeNum="activeNum"
          :slidArray="slideList"
          @changeStatus="changeResonsibilityStatus"
        >
        </global-ts-slide>
        <keep-alive>
          <component :is="currentTemp" :isShow.sync="isShow" @toShare="toShare" @showDataInfo="showDataInfo">
          </component>
        </keep-alive>
      </div>
    </div>
    <ts-data-info ref="dataInfo" v-if="dataInfoShow"></ts-data-info>
  </div>
</template>

<script>
import accessDetail from './components/access-detail/index.vue';
import formDataList from './components/form-data-list/index.vue';
import TsQrDialog from '@/components/base/ts-qr-dialog/index.vue';
import TsDataInfo from '@/components/base/ts-data-info/index.vue';

export default {
  name: 'FormData',
  components: { accessDetail, formDataList, TsDataInfo, TsQrDialog },
  data() {
    return {
      isShow: true, // false则显示访客详情
      isShowDialog: false, // 是否显示二维码弹窗
      slideList: [
        {
          key: '表单数据',
          value: 1,
        },
        {
          key: '访问明细',
          value: 2,
        },
      ],
      activeNum: 1,
      currentTemp: 'formDataList',
      staffList: [],
      dataInfoShow: false,
    };
  },
  created() {
    this.$utils.logDog('formData_show');
    this.$utils.FdpLog('yx_bdsj', {
      yx_free_text_1: this.activeNum == 2 ? '访问明细' : '表单数据',
    });
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
          this.currentTemp = 'formDataList';
          this.activeNum = 1;
          break;
        case 2:
          this.currentTemp = 'accessDetail';
          this.activeNum = 2;
          break;
      }
      this.$utils.FdpLog('yx_bdsj', {
        yx_free_text_1: index == 2 ? '访问明细' : '表单数据',
      });
    },
    /**
     * @description 展示访客详情数据
     * @author enson
     * @date 2020-05-16
     * todo: remove
     */
    showDataInfo(data) {
      this.$utils.logDog('form_showDataInfo');
      if (this.isFreeVersion) {
        this.$utils.postMessage({
          type: 'error',
          message: '当前版本访客中心功能未开放，请升级版本',
        });
        return;
      }
      if (!this.$refs?.dataInfo) {
        this.dataInfoShow = true;
      }
      this.$nextTick(() => {
        this.$refs.dataInfo.infoType = 'form';
        this.$refs.dataInfo.requestParam.viewerId = data.viewerId;
        this.$refs.dataInfo.name = data.viewerName;
        this.$refs.dataInfo.requestParam.shares = 3;
        this.$refs.dataInfo.issave = true;
        this.$refs.dataInfo.isShow = true;
        this.isShow = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.formData {
  .pro_listBox {
    .bottomBorder {
      position: relative;
      padding-bottom: 17px;
      margin-bottom: 20px;
    }
    .workList {
      width: 200px;
    }
    .formList {
      width: 200px;
    }
    .timePicker {
      vertical-align: top;
    }
    .showFormList {
      .showQrDialog {
        margin-left: 10px;
      }
    }
  }
  .showQrDialog {
    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>

<style lang="scss">
.formData {
  .showFormList {
    .el-table__empty-text {
      position: relative;
      z-index: 9;
      display: block;
      width: 100%;
      div {
        margin-left: 260px;
        text-align: left;
        &.noSroll {
          margin-left: 0;
          text-align: center;
        }
      }
    }
  }
  .pro_listBox {
    .showFormList {
      .el-table__body-wrapper {
        position: relative;
      }
    }
  }
}
</style>
