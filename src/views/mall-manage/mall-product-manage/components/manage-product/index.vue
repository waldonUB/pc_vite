<!--
 * @Author       : ADI
 * @Date         : 2021-08-04 10:12:23
 * @LastEditors  : ADI
 * @LastEditTime : 2021-08-03 17:36:07
-->
<template>
  <div class="manageProduct" v-windowResize="changePosition">
    <global-ts-header>
      <template v-slot:leftPart>
        商品列表
      </template>
      <template v-slot:rightPart>
        <global-ts-button
          v-if="showMallAddBtn"
          class="pro_header_addEm"
          type="primary"
          size="small"
          icon="icon-icon-11"
          @click="leadProduct('leadProduct')"
          >从商城录入
        </global-ts-button>
        <global-ts-button
          class="pro_header_addEm"
          type="primary"
          size="small"
          icon="icon-icon-11"
          @click="addProductByExcel"
          >从excel录入
        </global-ts-button>
        <global-ts-button
          class="pro_header_addEm"
          type="primary"
          size="small"
          icon="icon-icon-11"
          @click="leadProduct('controllerProduct')"
          >手动录入
        </global-ts-button>
      </template>
    </global-ts-header>
    <ts-batch-import-dialog
      dialogTitle="商品批量录入"
      modelFileName="下载excel模板"
      modelTip="请选择要录入的excel文件"
      @batchImportSuccess="batchImportSuccess"
      uploadUrl="/ajax/mall/tsMall_h.jsp?cmd=batchAddProductByExcel"
      :downloadTempUrl="downloadTempUrl"
      :dialogVisible.sync="dialogVisible"
    >
    </ts-batch-import-dialog>
    <div class="pro_listBox">
      <global-ts-warn-tips v-if="needShowTips && tipsType == 1">
        <p class="warnTipsContent" slot="content">{{ tips }}</p>
      </global-ts-warn-tips>
      <div class="topOperateBar flex flex-v">
        <div class="searchPart flex">
          <global-ts-input
            class="productName"
            v-model="requestParam.name"
            placeholder="商品名称"
            @keyup.enter.native="searchInfo"
          ></global-ts-input>
          <global-ts-select
            class="toProductList sourceList"
            v-model="requestParam.type"
            placeholder="全部来源"
            :selectkey="{ label: 'key', value: 'value' }"
            :list="sourceList"
          >
          </global-ts-select>
          <global-ts-button size="small" @click="searchInfo" class="min_width_88">搜索</global-ts-button>
          <global-ts-button
            class="moreFilterBtn moreBtn"
            type="greyText"
            size="small"
            icon="icon-shaixuan"
            @click="showMoreFilter"
          >
            高级筛选
          </global-ts-button>
          <global-ts-button
            v-if="false"
            class="filedSet moreBtn"
            type="greyText"
            size="small"
            icon="icon-shezhi"
            @click="showOptionFiled"
          >
            设置展示项
          </global-ts-button>
        </div>
        <div class="operatePart flex">
          <global-ts-button class="min_width_88" size="small" @click="operateSelected('toUp', true)">
            上架
          </global-ts-button>
          <global-ts-button class="min_width_88" size="small" @click="operateSelected('toDown', true)">
            下架
          </global-ts-button>
          <global-ts-button class="min_width_88" size="small" @click="operateSelected('toDelete', true)">
            删除
          </global-ts-button>
        </div>
      </div>
      <div class="productList">
        <el-table
          class="tshu-tableset"
          border
          ref="manageTable"
          :row-key="getRowKey"
          @selection-change="getChooseList"
          header-row-class-name="employeeHeader"
          :data="productList"
        >
          <el-table-column type="selection" :reserve-selection="true" width="55"> </el-table-column>
          <el-table-column
            :label="item.name"
            :min-width="item.width + 'px'"
            v-for="item of initSelectedList"
            :key="item.field"
          >
            <template #header>
              <div class="sortBar" @click="changeSortType(item.field)" v-if="sortTimeListCal(item.field)">
                <span class="nextTimeBaby">{{ item.name }}</span>
                <span class="sortArrow">
                  <svg
                    class="icon"
                    aria-hidden="true"
                    :class="!requestParam.desc && requestParam.sortKey ? '' : 'isNotActive'"
                  >
                    <use xlink:href="#icon-shaixuanshang"></use>
                  </svg>
                  <svg
                    class="icon"
                    aria-hidden="true"
                    :class="requestParam.desc && requestParam.sortKey ? '' : 'isNotActive'"
                  >
                    <use xlink:href="#icon-shaixuanxia"></use>
                  </svg>
                </span>
              </div>
              <span v-else class="nextTimeBaby">{{ item.name }}</span>
            </template>
            <template slot-scope="scope">
              <div v-if="hasMyselfContent(item.field)">
                <div class="productNameBox" v-if="item.field === 'name'">
                  <p class="productName">{{ scope.row.name }}</p>
                  <el-popover placement="right" title="" trigger="hover" v-if="scope.row.isShowCover">
                    <img :src="scope.row.coverUrl" style="max-width: 150px;" />
                    <div slot="reference">
                      <svg slot="reference" class="icon img-icon" aria-hidden="true">
                        <use xlink:href="#icon-tupian"></use>
                      </svg>
                    </div>
                  </el-popover>
                </div>
                <div v-if="item.field === 'price'">
                  {{ scope.row.priceType === 1 ? '面议' : scope.row.price }}
                </div>
                <div v-if="item.field === 'selfStatus'">
                  <fa-switch
                    :checked="scope.row.selfStatus === 0"
                    @change="operateSelected(scope.row.selfStatus === 0 ? 'toDown' : 'toUp', false, scope.row)"
                  />
                </div>
                <div v-if="item.field === 'pubStatus'">
                  <div v-if="[0].includes(scope.row.isGfwClose)">
                    <span class="green"></span>
                    {{ scope.row.statusName }}
                  </div>
                  <div v-else>
                    <span class="red"></span>
                    <span style="color: red;"> {{ scope.row.statusName }}</span>
                    <global-ts-tool-tips offset="10" class="item tanshu_linkColor" effect="dark" placement="top-start">
                      <div slot="content">
                        您的模板已被关闭，请先删除违规内容，再提交申诉。<br />
                        原因：{{ scope.row.gfwStatusReasion }}
                      </div>
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-bianzu"></use>
                      </svg>
                    </global-ts-tool-tips>
                  </div>
                </div>
              </div>
              <div v-else>
                {{ scope.row[item.field] }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <div>
                <!--type=2为商城商品-->
                <ts-fai-qr-popover
                  :disabled="scope.row.isGfwClose === 1 || scope.row.selfStatus === 1"
                  placement="left-start"
                  trigger="click"
                  :shareInfo="shareInfo"
                  :isShowMiniApp="scope.row.type !== 2"
                  popper-class="ts-fa-popover qr-popover"
                  @visibleChange="sharePopoverChange($event, scope.row)"
                >
                  <template slot="open">
                    <global-ts-button
                      class="tanshu_linkColor"
                      type="textGreen"
                      size="small"
                      @click="toShare(scope.row)"
                    >
                      分享
                    </global-ts-button>
                  </template>
                </ts-fai-qr-popover>
                <global-ts-button
                  class="tanshu_linkColor"
                  type="textGreen"
                  size="small"
                  v-if="scope.isOld"
                  @click="leadProduct('leadProduct')"
                >
                  同步
                </global-ts-button>
                <global-ts-button
                  class="tanshu_linkColor right-btn"
                  type="textGreen"
                  size="small"
                  v-else
                  @click="editProduct(scope.row)"
                >
                  编辑
                </global-ts-button>
                <global-ts-button
                  class="tanshu_deleteColor deleteBtn"
                  type="default"
                  size="small"
                  @click="operateSelected('toDelete', false, scope.row)"
                >
                  删除
                </global-ts-button>
              </div>
            </template>
          </el-table-column>
          <template slot="empty">
            暂无商品，<a class="st_seeGuide" @click="leadProduct('controllerProduct')">快去录入商品吧</a>
          </template>
        </el-table>
        <div class="tanshu-freeTip" v-if="showProNumHint">
          <global-ts-versionfunctip
            :isUpperVer="true"
            funcText="系统录入数量已达当前版本上限"
            noUpperText="系统录入数量已经达到上限"
          ></global-ts-versionfunctip>
        </div>
        <global-ts-pagination
          :tableData="productList"
          @getData="changeTable"
          :requestParam="requestParamCal"
          :isReload.sync="isReload"
          :httpurl="httpurl"
        >
        </global-ts-pagination>
        <ts-batch-import-dialog
          @changeSortSuccess="changeSortSuccess"
          :initAllFiledList="initNotSelectList"
          :initSelectedList="initSelectedList"
          :dialogVisible.sync="optionDialogVisible"
        >
        </ts-batch-import-dialog>
        <moreFilterDialog
          @sure="setMoreFilter"
          @reset="resetMoreFilter"
          :sourceList="sourceList"
          :dialogVisible.sync="moreFilterDialog"
        >
        </moreFilterDialog>
      </div>
    </div>
  </div>
</template>

<script>
import TsBatchImportDialog from '@/components/base/ts-batch-import-dialog/index.vue';
import moreFilterDialog from '../more-filter-dialog/index.vue';
import ManagerDef from '@/config/manager-def';
import { optionInitConfig } from '../../config';
import { mapGetters, mapState } from 'vuex';
import { post, confirm, format, getUrL, cookie, postLimitVer, downloadTempUrl, encodeUrl } from '@/utils';
import { Switch } from '@fk/faicomponent';
import TsFaiQrPopover from '@/components/base/ts-fai-qr-popover/index.vue';

export default {
  name: 'manageProduct',
  components: { TsBatchImportDialog, moreFilterDialog, TsFaiQrPopover, [Switch.name]: Switch },
  props: {},
  data() {
    return {
      requestParam: {
        name: '', // 商品名称
        siteId: -1, // 站点id
        type: -1, // 来源 1-系统录入 2-商城录入 3-名片录入
        selfStatus: -1, // 商品上下架状态
        sortKey: '', // 排序的key
        desc: true, // 排序类型 true-倒序 false-正序
      },
      sourceList: [], // 商品来源list
      httpurl: '/ajax/mall/tsMall_h.jsp?cmd=getTsProductList',
      productList: [],
      isReload: false,
      selectedIdList: [], // 勾选的商品ID集合
      hasSelcetedUp: false, // 是否勾选了已上架的商品
      needShowTips: false,
      tips: '',
      dialogVisible: false, // excel录入弹窗的显示/隐藏
      showMallAddBtn: false, // 是否显示商城录入按钮
      showProNumHint: false, // 是否显示录入数量提醒
      optionDialogVisible: false, // 是否显示设置项弹窗
      initSelectedList: optionInitConfig(), // 已选择的用户自定义项
      initAllFiledList: optionInitConfig(), // 默认的初始化表头数据
      moreFilterDialog: false, // 是否显示高级筛选弹窗
      moreRequestParam: {}, // 高级筛选的请求数据
      shareInfo: {
        qrImgUrl: '',
      },
      downloadTempUrl: '',
    };
  },
  computed: {
    ...mapGetters({
      resRoot: 'resRoot',
    }),
    ...mapState({
      addressUrl: state => state.globalData.addressUrl,
      userTicket: state => state.globalData?.userTicket,
      isDebug: state => state.globalData?.isDebug,
    }),
    updateVersionUrl() {
      return this.addressUrl.updateVersionUrl;
    },
    // 模板的下载路径
    // downloadTempUrl() {
    //   console.log('this.resRoot', this.resRoot);
    //   return this.resRoot + '/doc/商品批量录入模板.xlsx';
    // },
    /**
     * @description 获取没有选中的值
     * @author enson
     * @date 2020-12-13
     */
    initNotSelectList() {
      return this.initAllFiledList.filter(item => {
        return !this.initSelectedList.map(item => item.field).includes(item.field);
      });
    },
    /**
     * @description 请求的数据
     * @author enson
     * @date 2020-12-13
     */
    requestParamCal() {
      return Object.assign({}, this.requestParam, this.moreRequestParam);
    },
  },
  watch: {},
  async created() {
    this.downloadTempUrl = await downloadTempUrl(ManagerDef.DOWNLOAD_TEMP_TYPE.PRODUCT);
  },
  async activated() {
    this.getShowHintInfo(); // 获取版本提示和按钮是否显示的flag
    this.getProductTips(); // 获取提示语
    this.getSourceList(); // 获取商品来源
    this.isReload = true;
  },
  mounted() {},
  methods: {
    /**
     * 分享的popover改变
     * @author waldon
     * @date 2021/7/2
     * @param {Boolean} newVal -
     * @param {Object} rowData - 行数据
     */
    async sharePopoverChange({ callbackFn }, rowData) {
      const miniAppImgOptions = {
        dataId: rowData.id,
        shareType: 4, // 1-文章 2-视频 3-文件
        name: rowData.name,
      };
      this.shareInfo.fileName = rowData.name;
      this.shareInfo.h5DetailUrl = `【${rowData.name}】\n${rowData.h5ShareUrl}`;
      this.shareInfo.qrImgUrl = getUrL(
        `/rest/manage/qrCode/generatorByUrl?urlCode=${encodeUrl(rowData.h5ShareUrl)}&name=${rowData.name}`,
      );
      callbackFn(miniAppImgOptions);
    },
    toShare(rowData) {
      if (rowData.isGfwClose === 1) {
        this.$utils.postMessage({
          type: 'error',
          message: '商品已关闭，无法分享',
        });
      } else if (rowData.selfStatus === 1) {
        this.$utils.postMessage({
          type: 'error',
          message: '商品已下架，无法分享',
        });
      }
    },
    changePosition() {
      window.screenWidth = document.body.clientWidth;
    },
    /**
     * @description 根据当前用户获取展示信息以及商城录入按钮是否显示
     * @author enson
     * @date 2020-08-04
     */
    getShowHintInfo() {
      return new Promise(resolve => {
        post('/ajax/mall/tsMall_h.jsp?cmd=getShowHintInfo').then(response => {
          if (response && response.success) {
            const { showMallAddBtn, showProNumHint } = response.data;
            this.showMallAddBtn = showMallAddBtn;
            this.showProNumHint = showProNumHint;
          } else {
            this.$utils.postMessage({
              type: 'error',
              message: response.msg || '网络错误，请稍候重试',
            });
          }
          resolve();
        });
      });
    },
    /**
     * @description 获取商品来源
     * @author enson
     * @date 2020-08-03
     */
    getSourceList() {
      return new Promise(resolve => {
        post('/ajax/mall/tsMall_h.jsp?cmd=getProSourceOpt').then(response => {
          if (response && response.success) {
            this.sourceList = response.data;
          } else {
            this.$utils.postMessage({
              type: 'error',
              message: response.msg || '网络错误，请稍候重试',
            });
          }
          resolve();
        });
      });
    },
    /**
     * @description 最近浏览人数的排序
     * @author enson
     * @date 2020-07-21
     */
    changeSortType(sortKey) {
      if (sortKey === 'clickViewersName') {
        // 如果排序字段是clickViewersName, 则用clickViewers
        sortKey = 'clickViewers';
      }
      this.requestParam.sortKey = sortKey;
      this.requestParam.desc = !this.requestParam.desc;
      this.isReload = true;
    },
    /**
     * 获取商品管理tab 提示语
     * @author guoyijie
     * @date 2020-04-10
     */
    getProductTips() {
      post('/ajax/mall/tsMall_h.jsp?cmd=getProductTips').then(response => {
        if (response && response.success) {
          this.needShowTips = response.data.needShowTips;
          this.tipsType = response.data.tipsType;
          this.tips = response.data.tips;
        } else {
          this.$utils.postMessage({
            type: 'error',
            message: response.msg || '网络错误，请稍候重试',
          });
        }
      });
    },
    /**
     * 搜索
     * @author guoyijie
     * @date 2020-04-10
     */
    searchInfo() {
      this.requestParam = Object.assign({}, this.requestParam);
      this.isReload = true;
    },
    /**
     * 获取勾选的表格商品
     * @author guoyijie
     * @date 2020-04-10
     */
    getChooseList() {
      this.hasSelcetedUp = false; // 重置
      this.selectedIdList = []; // 勾选的商品集合
      const flag = false; // 判断hasSelcetedUp是否有赋值过
      const selectList = this.$refs.manageTable.selection;
      console.log('selectList', selectList);
      selectList.forEach(item => {
        // 判断勾选的商品是否有已上架的商品并且hasSelcetedUp没有赋值过
        if (item.selfStatus === 0 && !flag) {
          this.hasSelcetedUp = true;
        }
        this.selectedIdList.push(item.id);
      });
    },
    /**
     * 设置行数据的key
     * @author guoyijie
     * @date 2020-04-10
     * @param {*} row表格行
     * @returns
     */
    getRowKey(row) {
      return row.id;
    },
    /**
     * @description 对商品进行删除/上架/下架 支持批量操作
     * @author enson
     * @date 2020-08-04
     * @param {*} idList - 需要操作的商品集合
     * @param {*} operateType - 操作类型 toDelete-删除 toUp-上架 toDown-下架
     */
    operateProduct(idList, operateType) {
      let url = null;
      let selfStatus = -1;
      switch (operateType) {
        case 'toDelete': // 删除
          url = '/ajax/mall/tsMall_h.jsp?cmd=delTsProduct';
          break;
        case 'toUp': // 上架
          url = '/ajax/mall/tsMall_h.jsp?cmd=setProductSelfStatus';
          selfStatus = 0;
          break;
        case 'toDown': // 下架
          url = '/ajax/mall/tsMall_h.jsp?cmd=setProductSelfStatus';
          selfStatus = 1;
          break;
      }
      if (!url) {
        this.$utils.postMessage({
          type: 'error',
          message: '网络错误，请稍候重试',
        });
        return;
      }
      post(url, {
        idList: JSON.stringify(idList),
        selfStatus,
      }).then(response => {
        if (response && response.success) {
          this.$utils.postMessage({
            type: 'success',
            message: '操作成功',
          });
          // 上下架删除时，去除勾选的数据
          this.$refs.manageTable.clearSelection();
          this.isReload = true;
        } else {
          this.$utils.postMessage({
            type: 'error',
            message: response.msg || '网络错误，请稍候重试',
          });
        }
      });
    },
    /**
     * @description 操作商品数据（上架/下架/删除）
     * @author enson
     * @date 2020-07-21
     * @param {*} type toUp-上架 toDown-下架 toDelete-删除
     * @param {boolean} isMore 是否多选
     * @param {*} productData 对应的商品数据(针对单选)
     * @returns
     */
    operateSelected(type, isMore, productData) {
      if (!type) return;

      let currentMsg = [];
      let msgList = {};
      console.log('isMore', isMore);
      if (isMore) {
        // 多选的提示list
        // 没有选择的情况下导致
        if (this.selectedIdList.length <= 0) {
          this.$utils.postMessage({
            type: 'error',
            message: '请勾选要操作的数据',
          });
          return;
        }
        msgList = Object.assign(
          {},
          {
            toUp: ['操作确认', '确定上架这批商品吗？'],
            toDown: ['操作确认', '确定下架这批商品吗？'],
            toDelete: ['删除确认', '确定删除这批商品吗？<span class="tanshu_errorColor">删除后无法恢复</span>'],
            toDeleteIncludes: [
              '删除确认',
              '包含上架商品，确定删除这批商品吗？<span class="tanshu_errorColor">删除后无法恢复（相关数据将丢失）</span>',
            ],
          },
        );
        currentMsg = this.hasSelcetedUp && type === 'toDelete' ? msgList['toDeleteIncludes'] : msgList[type];
      } else {
        // 这里是单操作的逻辑，单操作不需要提示语，直接调接口显示即可
        this.singleOperateProduct(type, productData);
        return;
      }

      // 这里是多选批量操作的逻辑
      isMore &&
        confirm(currentMsg[1], currentMsg[0], '确定', true, true)
          .then(action => {
            if (action == 'confirm') {
              this.operateProduct(this.selectedIdList, type);

              const fdpTextList = {
                // fdp log文案
                toUp: '批量上架',
                toDown: '批量下架',
                toDelete: '批量删除',
              };
              this.$utils.FdpLog('yx_czsp', {
                // 操作商品
                yx_free_text_0: fdpTextList[type],
              });
            }
          })
          .catch(action => {
            console.log(action);
          });
    },
    /**
     * @description 单操作商品的逻辑
     * @author enson
     * @date 2020-08-13
     * @param {*} type
     */
    singleOperateProduct(type, productData) {
      if (!productData) {
        this.$utils.postMessage({
          type: 'error',
          message: '系统错误，请稍后重试',
        });
        return;
      }

      switch (type) {
        case 'toDelete':
          confirm('删除商品后将无法恢复', '确认删除商品?').then(() => {
            this.operateProduct([productData.id], type);
          });
          break;
        case 'toUp':
        case 'toDown':
          // 如果是商城的商品进行了上下架的处理则跳到对应的编辑页面
          console.log('productData', productData);
          if (productData.type === 2) {
            // 判断是否是商城的商品
            if (!cookie(`ts_showProductTip${this.userTicket}`)) {
              cookie(`ts_showProductTip${this.userTicket}`, true, {
                expires: format.addDate(new Date(), 7, 'days'),
              });
              confirm(
                '商城录入的商品统一在【编辑-其他设置】修改上下架状态，点击按钮前去编辑',
                '操作提醒',
                '我知道了',
                false,
              ).then(() => {
                window.open(`${this.isDebug ? 'http:' : 'https:'}${productData.mallEditPdUrl}`);
              });
            } else {
              window.open(`${this.isDebug ? 'http:' : 'https:'}${productData.mallEditPdUrl}`);
            }
          } else {
            this.operateProduct([productData.id], type);
          }
          break;
      }
      const fdpTextList = {
        // fdp log文案
        toUp: '单个上架',
        toDown: '单个下架',
        toDelete: '单个删除',
      };
      this.$utils.FdpLog('yx_czsp', {
        // 操作商品
        yx_free_text_0: fdpTextList[type],
      });
    },
    /**
     * @description 切换至录入商品页面
     * @author enson
     * @date 2020-07-20
     * @param {*} type type -leadProduct 商城录入商品 -controllerProduct 手动录入商品
     */
    leadProduct(type, isEdit = false, productId) {
      if (type === 'controllerProduct' && !isEdit && this.showProNumHint) {
        postLimitVer('当前版本可添加商品数量已达上限', 0, 1);
        return;
      }
      this.$parent.changeComponets(type, isEdit, productId);
    },
    editProduct(productData) {
      if ([2].includes(productData.type)) {
        window.open(`${this.isDebug ? 'http:' : 'https:'}${productData.mallEditPdUrl}`); // 商城录入的逻辑
      } else {
        this.leadProduct('controllerProduct', true, productData.id);
      }
      this.$utils.FdpLog('yx_czsp', {
        // 操作商品
        yx_free_text_0: '编辑',
      });
    },
    changeTable(data) {
      this.productList = data;
      // 更新表格数据后需要更新一下提示
      this.getShowHintInfo();
    },
    /**
     * 点击excel录入
     * @author enson
     * @date 2020-07-06
     */
    addProductByExcel() {
      this.dialogVisible = true;
    },
    /**
     * excel文件上传成功的回调
     * @author enson
     * @date 2020-07-06
     */
    batchImportSuccess(res) {
      this.$utils.ActLog('ADD_PRODUCT');
      this.$utils.postMessage({
        type: 'success',
        message: res.msg || '录入成功',
      });
      this.isReload = true;
    },
    showOptionFiled() {
      this.optionDialogVisible = true;
    },
    /**
     * @description 获取自定义表头的配置项
     * @author enson
     * @date 2020-12-13
     */
    getSelectedOption() {
      // 这个版本不做这个，产品说后续会加上，因此保留
    },
    /**
     * 排序成功回调
     * @author waldon
     * @date 2020-06-18
     * @param {*} selectData - 已选择的数据
     */
    changeSortSuccess(selectData) {
      // 这个版本不做，但是产品说后续会加上，因此保留
    },
    /**
     * @description 需要排序的列
     * @author enson
     * @date 2020-12-13
     */
    sortTimeListCal(field) {
      return field && ['clickViewersName'].includes(field);
    },
    hasMyselfContent(field) {
      return field && ['name', 'selfStatus', 'pubStatus', 'price'].includes(field);
    },
    /**
     * 展示更多选项
     * @author waldon
     * @date 2020-06-15
     */
    showMoreFilter() {
      this.moreFilterDialog = true;
    },
    /**
     * 设置高级筛选
     * @author waldon
     * @date 2020-06-18
     * @param {*} moreRequestParam
     */
    setMoreFilter(moreRequestParam) {
      this.moreRequestParam = { ...moreRequestParam };
      this.isReload = true;
    },
    /**
     * 重置高级筛选
     * @author waldon
     * @date 2020-06-18
     * @param {*} initMoreRequestParam - 重置后的条件
     */
    resetMoreFilter(initMoreRequestParam) {
      this.moreRequestParam = { ...initMoreRequestParam };
    },
  },
};
</script>

<style lang="scss" scoped>
.manageProduct {
  .pro_listBox {
    /* .productList {
      .sortArrow {
        .icon {
          color: currentColor;
        }
      }
    } */
    div {
      &.moreFilterBtn {
        position: relative;
        margin-left: 6px;
      }
      &.filedSet {
        margin-left: 10px;
      }
    }
  }
  .bindDialog {
    .tanshu-dialog {
      width: 800px;
      height: 600px;
    }
  }
  .iframeLink {
    width: 100%;
    height: 500px;
  }
  .smallTitle {
    font-size: 14px;
    line-height: 34px;
    color: $color-53;
  }
  .warnTipsContent {
    span {
      text-decoration: underline;
    }
  }
  .topOperateBar {
    & > div {
      & > div {
        margin-right: 10px;
      }
    }
    .searchPart {
      margin-bottom: 20px;
    }
    .productName {
      width: 140px;
    }
    .toProductList {
      width: 140px;
      height: 34px;
      &.sourceList {
        width: 200px;
      }
    }
    .tshu_select {
      .tshu_select_input {
        .motivate {
          height: 34px;
          line-height: 34px;
        }
      }
    }
  }
  .productList {
    margin-top: 20px;
    .productNameBox {
      display: flex;
      width: 100%;
      text-align-last: justify;
      justify-content: space-between;
    }
    .operateBtnBox {
      align-items: center;
      display: flex;
      justify-content: center;
      & > div {
        &:nth-child(1) {
          margin-right: 10px;
        }
      }
    }
    .st_seeGuide {
      cursor: pointer;
    }
    .productName {
      display: inline-block;
      max-width: 90%;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: normal;
      word-wrap: normal;
      white-space: nowrap;
    }
  }
}
.manageProduct .pro_listBox .productList .deleteBtn,
.manageProduct .pro_listBox .productList .right-btn {
  margin-left: 12px;
}
</style>

<style lang="scss">
.manageProduct {
  .topOperateBar {
    .toProductList {
      .el-input {
        height: 34px;
        input {
          height: 34px;
        }
      }
    }
  }
  .productList {
    .el-table {
      .icon {
        width: 1.2em;
        height: 1.2em;
        overflow: hidden;

        /* color: #247af3; */
        vertical-align: -0.15em;
        &.el-tooltip {
          &.item {
            width: 1em;
            height: 1em;
          }
        }
        &.img-icon {
          color: #247af3;
        }
      }
    }
  }
}
</style>
