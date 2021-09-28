<!--
 * @Author       : ADI
 * @Date         : 2021-06-21 13:44:35
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-30 10:51:29
-->
<template>
  <div class="posterList_body">
    <ts-qr-dialog desc="立即扫码登录小程序，获取意向客户" :isShowDialog.sync="isShowDialog"> </ts-qr-dialog>
    <global-ts-header>
      <template v-slot:leftPart>
        海报模板
      </template>
      <template v-slot:rightPart>
        <global-ts-button
          class="pro_header_addEm"
          type="primary"
          size="small"
          icon="icon-icon-11"
          @click="newAddProduct"
          >海报上传
        </global-ts-button>
        <global-ts-button class="right-btn" type="mainText" size="small" @click="gotoManageLogo">
          企业logo管理
        </global-ts-button>
      </template>
    </global-ts-header>
    <div class="pro_listBox" v-cloak>
      <global-ts-slide
        ref="dataCenterSlider"
        class="tanshu-bottomBorder"
        :activeNum="activeNum"
        :slidArray="slideList"
        @changeStatus="changeResonsibilityStatus"
      >
      </global-ts-slide>
      <ts-type-box
        :showAddBtn="activeNum == 2"
        :initList="initClassifyList"
        :typeList="classifyList"
        @showManage="showClassifyManage"
        @changeClassify="changeClassify"
        :selectType="requestParam.groupId"
        v-if="activeNum != 3"
      >
      </ts-type-box>
      <div class="pro_line">
        <fa-input
          style="width: 200px;margin-right: 10px;"
          v-model="requestParam.title"
          placeholder="标题"
          @keyup.enter.native="reloadDataList"
        >
        </fa-input>
        <global-ts-button type="primary" size="small" icon="icon-icon-4" ref="button" @click="reloadDataList">
          搜索
        </global-ts-button>
      </div>
      <div class="formList" v-if="posterResponsibility.formTableList && posterResponsibility.formTableList.length > 0">
        <posterItem
          v-for="(item, index) in posterResponsibility.formTableList"
          :key="index"
          :type="activeNum"
          :item="item"
          @reloadDataList="reloadDataList"
        ></posterItem>
      </div>
      <div class="emptyBox" v-else>暂无数据，马上点击右上角【海报上传】按钮创建吧</div>
      <global-ts-pagination
        ref="formPagination"
        :limitIndex="1"
        :tableData="posterResponsibility.formTableList"
        :requestParam="requestParam"
        :isReload.sync="posterResponsibility.isReload"
        @getData="changeTable"
        :httpurl="requestUrlList[activeNum - 1]"
      >
      </global-ts-pagination>
    </div>
  </div>
</template>

<script>
import posterItem from '../poster-item/index.vue';
import TsQrDialog from '@/components/base/ts-qr-dialog/index.vue';
import TsTypeBox from '@/components/base/ts-type-box/index.vue';
import { getKtPosterGroupList } from '@/api/modules/views/customer-tools/poster-manage';
import { getTsGroupList } from '@/api/modules/views/customer-tools';

export default {
  name: 'poster-list',
  components: {
    posterItem,
    TsQrDialog,
    TsTypeBox,
  },
  props: {
    slideVal: {
      // 指定海报分类 1：热门海报 2：企业海报 3：我的海报
      type: [Number],
      default: 1,
    },
  },
  data() {
    return {
      isShowDialog: false, // 是否显示关注二维码弹窗
      slideList: [
        // 一级分类
        {
          key: '热门海报',
          value: 1,
        },
        {
          key: '企业海报',
          value: 2,
        },
        {
          key: '我的海报',
          value: 3,
        },
      ],
      activeNum: 1, // 一级分类的值 1：热门海报 2：企业海报 3：我的海报
      requestParam: {
        // 请求参数
        title: '',
        groupId: -1,
      },
      posterResponsibility: {
        // 请求数据
        formTableList: [], // 数据列表
        isReload: false, // 是否重新加载
        httpurl: '',
      },
      requestUrlList: [], // 获取海报数据的请求地址
      initClassifyList: [], // 初始分类列表
      classifyList: [], // 分类列表
    };
  },
  computed: {},
  watch: {},
  async created() {
    this.activeNum = this.slideVal;
    await this.getPosterGroupList(); // 等待分类列表请求完再设置请求地址列表
    this.requestUrlList = [
      '/rest/manage/card/poster/getKtPosterList',
      '/rest/manage/card/poster/getPosterTempList',
      '/rest/manage/card/poster/getMyPosterList',
    ]; // 请求地址 分别为：热门海报、企业海报、个人海报
    // this.posterResponsibility.httpurl = this.requestUrlList[this.activeNum - 1];
  },
  mounted() {},
  methods: {
    /**
     * 获取分类列表
     * @author lymn
     * @date 2020-07-15
     * @returns {Promise} 获取到分类列表后回调
     **/
    async getPosterGroupList() {
      let url, param;
      switch (this.activeNum) {
        case 1: // 热门海报
          url = getKtPosterGroupList;
          this.initClassifyList = [];
          const [hotErr, hotRes] = await url();
          if (hotErr) {
            this.$utils.postMessage({
              type: 'error',
              message: hotErr.msg || '网络错误，请稍候重试',
            });
            return Promise.reject(hotErr);
          }
          this.classifyList = hotRes.data.ktPosterGroupList;
          this.requestParam.groupId = this.classifyList[0].id;
          return Promise.resolve();
        case 2: // 企业海报
          this.initClassifyList = [
            {
              id: -1,
              name: '全部',
            },
          ];
          url = getTsGroupList;
          param = {
            type: 11,
            limit: 100,
          };
          const [compErr, compRes] = await url(param);
          if (compErr) {
            this.$utils.postMessage({
              type: 'error',
              message: compErr.msg || '网络错误，请稍候重试',
            });
            return Promise.reject(compErr);
          }
          this.classifyList = compRes.data;
          this.requestParam.groupId = -1;
          return Promise.resolve();
        case 3:
          return Promise.resolve();
      }
    },
    /**
     * 切换热门海报、企业海报、我的海报
     * @author lymn
     * @date 2020-04-19
     * @date 2020-07-15
     * @param {object} node节点
     * @param {Number} value 选中一级分类的value
     */
    async changeResonsibilityStatus(e, value) {
      this.activeNum = value;
      this.requestParam.title = '';
      this.requestParam.groupId = null;
      await this.getPosterGroupList();
      // this.posterResponsibility.httpurl = this.requestUrlList[this.activeNum - 1];
      this.reloadDataList();
    },
    /**
     * 海报上传
     * @author lymn
     * @date 2020-07-15
     */
    newAddProduct() {
      this.$router.push({
        path: 'createPoster',
        // path: 'posterManage/createPoster',
      });
    },
    gotoManageLogo() {
      this.$router.push({
        path: 'posterLogo',
        // path: 'posterManage/posterLogo',
      });
    },
    /**
     * 加载数据
     * @author lymn
     * @date 2020-07-15
     */
    reloadDataList() {
      this.posterResponsibility.isReload = true;
    },
    /**
     * 请求获取到的数据
     * @author lymn
     * @date 2020-07-15
     * @param {Object} 数据列表
     */
    changeTable(data) {
      if (this.activeNum == 2) {
        data = data.list;
      }
      this.posterResponsibility.formTableList = data;
    },
    /**
     * 显示分类管理页
     * @author lymn
     * @date 2020-07-15
     */
    showClassifyManage() {
      this.$emit('changeComponent', 'classifyManager');
    },
    /**
     * 切换分类
     * @author lymn
     * @date 2020-07-15
     * @param {Number} 分类的id
     */
    changeClassify(id) {
      this.requestParam.groupId = id;
      this.reloadDataList();
    },
  },
};
</script>

<style lang="scss" scoped>
.posterList_body {
  .formList {
    width: calc(100% + 20px);
  }
  .emptyBox {
    width: 100%;
    height: 60px;
    line-height: 60px;
    color: #909399;
    text-align: center;
  }
  .right-btn {
    margin-left: 12px;
  }
  ::v-deep .tanshu-typeBox {
    position: relative;
    margin-bottom: 20px;
    .typeWrap {
      width: 92%;
    }
    .global-button {
      margin-top: 10px;
      margin-right: 10px;
      span {
        display: inline-block;
        width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .global-button-size-medium {
      min-width: 100px;
    }
    .global-button.global-button-type-default.addClassify {
      display: inline-flex;
      width: 40px !important;
      height: 40px;
      min-width: auto;
      vertical-align: top;
      background: #fafafa;
      border: 1px solid #eeeeee;
      border-radius: 4px;
      align-items: center;
      justify-content: center;
    }
    .toright {
      position: absolute;
      top: 10px;
      right: 61px;
      margin-top: 0 !important;
    }
    .getMoreicon {
      position: absolute;
      top: 10px;
      right: 0;
      display: inline-flex;
      width: 40px !important;
      height: 40px;
      margin-top: 0 !important;
      background: #fafafa;
      border: 1px solid #eeeeee;
      border-radius: 4px;
      align-items: center;
      justify-content: center;
    }
    .addClassify .ts-svg-icon,
    .getMoreicon .ts-svg-icon {
      margin-right: 0;
      color: $color-b2;
    }
  }
}
</style>
