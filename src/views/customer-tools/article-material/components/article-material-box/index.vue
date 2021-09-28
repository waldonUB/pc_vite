<!--
 * @Author       : ADI
 * @Date         : 2021-05-19 10:24:09
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-02 16:02:08
-->
<template>
  <div class="MaterialBox">
    <div class="articleMaterial" v-show="isShow">
      <transtion-box @onTransitionHandle="onTransition" ref="child"></transtion-box>
      <global-ts-header>
        <template v-slot:leftPart>
          <div class="topTitle BType" @click="changeArticleTip">
            素材中心
            <global-ts-svg-icon class="icon" name="icon-bianzu" />
          </div>
        </template>
        <template v-slot:rightPart>
          <global-ts-button
            v-if="isManage"
            class="pro_header_addEm rightPartBtn"
            type="primary"
            size="small"
            @click="showWxAuthDialog"
            >批量导入公众号文章
          </global-ts-button>
          <global-ts-dropdown v-if="isManage" :downData="downData" @handleClick="downItemClick">
            <template v-slot:link>
              <global-ts-button class="pro_header_addEm" type="primary" size="small" icon="icon-icon-11">
                添加文章
              </global-ts-button>
            </template>
          </global-ts-dropdown>
        </template>
      </global-ts-header>
      <transition name="el-fade-in el-zoom-in-top">
        <div class="articleTip cardInGrey" v-if="showArticleTip">
          <div class="closeBtn" @click="changeArticleTip"></div>
        </div>
      </transition>
      <div class="pro_listBox">
        <global-ts-slide
          class="bottomBorder"
          :activeNum="activeNum"
          :issave="issave"
          ref="dataCenterSlider"
          :slidArray="rootClassify"
          @changeStatus="changeResonsibilityStatus"
        >
        </global-ts-slide>
        <div class="typeBox">
          <div>
            <global-ts-button
              :type="requestParam.type == -1 ? 'primary' : 'others'"
              size="medium"
              ref="button"
              v-if="![2, 4].includes(sliderType)"
              @click="changeType(-1)"
              >全部
            </global-ts-button>
            <global-ts-tool-tips
              :disabled="item.name.length <= 5"
              v-for="item in typeShowList"
              :key="item.id"
              class="item"
              effect="dark"
              :content="item.name"
              placement="bottom-start"
            >
              <global-ts-button
                :key="item.id"
                :type="requestParam.type == item.id ? 'primary' : 'others'"
                size="medium"
                ref="button"
                @click="changeType(item.id)"
                >{{ item.name }}
              </global-ts-button>
            </global-ts-tool-tips>
            <global-ts-tool-tips
              v-if="sliderType == 3 && isManage"
              class="item"
              effect="dark"
              content="分类管理"
              placement="bottom-start"
            >
              <global-ts-button
                class="addClassify"
                :class="typeList.length > lineNum - 1 ? 'toright' : ''"
                type="default"
                size="medium"
                :icon="isTempActive ? 'icon-icon-11' : 'icon-icon-11'"
                ref="button"
                @click="showClassifyManager"
              >
              </global-ts-button>
            </global-ts-tool-tips>
          </div>
          <global-ts-button
            v-if="typeList.length > lineNum"
            class="getMoreicon"
            type="default"
            size="medium"
            :icon="isShowAll ? 'icon-icon-9' : 'icon-icon-8'"
            ref="button"
            @click="getMore"
          >
          </global-ts-button>
        </div>
        <div class="articleCenter_main">
          <div class="pro_line" v-show="![4].includes(sliderType)">
            <fa-input
              style="width: 200px;"
              v-model="requestParam.title"
              placeholder="文章标题"
              @keyup.enter.native="reloadDataList"
            >
            </fa-input>
            <global-ts-date-picker
              @updateTime="getSearchTime"
              :isUpdate.sync="isUpdate"
              :defaultInitTime="[requestParam.createTimeStart, requestParam.createTimeEnd]"
            >
            </global-ts-date-picker>
            <global-ts-button
              type="primary"
              size="small"
              icon="icon-icon-4"
              ref="button"
              @click="reloadDataList"
              @keyup.enter.native="reloadDataList"
            >
              搜索
            </global-ts-button>
          </div>
          <div class="showMaterialList">
            <el-table
              :class="'tshu-tableset'"
              :data="MaterialList"
              border
              :empty-text="sliderType == 3 ? '暂无数据，马上点击右上角【文库模板制作】按钮创建吧' : '暂无数据'"
              min-width="1010px"
              header-row-class-name="employeeHeader"
              cell-class-name="cellStyle"
            >
              <el-table-column
                prop="title"
                key="title"
                label="文章标题"
                min-width="250"
                class-name="leftText titleText"
              >
                <template slot-scope="scope">
                  <div>
                    <global-ts-svg-icon
                      class="icon redBox"
                      name="icon-wenzhangtuijian"
                      v-if="sliderType === 3 && scope.row.adStatus == 1"
                    />
                    {{ scope.row.title }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="typeName"
                key="typeName"
                label="类别"
                min-width="144px"
                v-if="![3, 4].includes(sliderType)"
              ></el-table-column>
              <el-table-column
                prop="typeIdName"
                key="typeIdName"
                label="类别"
                min-width="144px"
                v-if="sliderType === 3"
              ></el-table-column>
              <el-table-column
                prop="publishTime"
                v-if="[1, 2].includes(sliderType)"
                label="发布时间"
                min-width="180"
                :formatter="dateFormat"
                key="publishTimeName"
              >
                <template #header>
                  <div class="sortBar" @click="changeSortType('createTime')">
                    <span class="nextTimeBaby">发布时间</span>
                    <span class="sortArrow">
                      <global-ts-svg-icon
                        class="icon"
                        :class="requestParam.sortKey === 'createTime' && !requestParam.desc ? '' : 'isNotActive'"
                        name="icon-shaixuanshang"
                        :size="14"
                      />
                      <global-ts-svg-icon
                        class="icon"
                        :class="requestParam.sortKey === 'createTime' && requestParam.desc ? '' : 'isNotActive'"
                        name="icon-shaixuanxia"
                        :size="14"
                      />
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                v-if="[3, 4].includes(sliderType)"
                label="创建时间"
                min-width="180"
                :formatter="dateFormat"
                key="createTimeName"
              >
                <template #header>
                  <div class="sortBar" @click="changeSortType('createTime')">
                    <span class="nextTimeBaby">创建时间</span>
                    <span class="sortArrow">
                      <global-ts-svg-icon
                        class="icon"
                        :class="requestParam.sortKey === 'createTime' && !requestParam.desc ? '' : 'isNotActive'"
                        name="icon-shaixuanshang"
                        :size="14"
                      />
                      <global-ts-svg-icon
                        class="icon"
                        :class="requestParam.sortKey === 'createTime' && requestParam.desc ? '' : 'isNotActive'"
                        name="icon-shaixuanxia"
                        :size="14"
                      />
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="clickViewers"
                label="阅读人数"
                key="clicks"
                min-width="80"
                v-if="[4].includes(sliderType)"
              >
                <template #header>
                  <div class="sortBar" @click="changeSortType('clickViewers')">
                    <span class="nextTimeBaby">阅读人数</span>
                    <span class="sortArrow">
                      <global-ts-svg-icon
                        class="icon"
                        :class="requestParam.sortKey === 'clickViewers' && !requestParam.desc ? '' : 'isNotActive'"
                        name="icon-shaixuanshang"
                        :size="14"
                      />
                      <global-ts-svg-icon
                        class="icon"
                        :class="requestParam.sortKey === 'clickViewers' && requestParam.desc ? '' : 'isNotActive'"
                        name="icon-shaixuanxia"
                        :size="14"
                      />
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="readTimesSecond"
                label="阅读时长"
                key="readTime"
                min-width="90"
                :formatter="timeFormat"
                v-if="[4].includes(sliderType)"
              >
                <template #header>
                  <div class="sortBar" @click="changeSortType('readTimesSecond')">
                    <span class="nextTimeBaby">阅读时长</span>
                    <span class="sortArrow">
                      <global-ts-svg-icon
                        class="icon"
                        :class="requestParam.sortKey === 'readTimesSecond' && !requestParam.desc ? '' : 'isNotActive'"
                        name="icon-shaixuanshang"
                        :size="14"
                      />
                      <global-ts-svg-icon
                        class="icon"
                        :class="requestParam.sortKey === 'readTimesSecond' && requestParam.desc ? '' : 'isNotActive'"
                        name="icon-shaixuanxia"
                        :size="14"
                      />
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="shares"
                label="分享次数"
                key="shareTime"
                min-width="80"
                v-if="[4].includes(sliderType)"
              >
                <template #header>
                  <div class="sortBar" @click="changeSortType('shares')">
                    <span class="nextTimeBaby">分享次数</span>
                    <span class="sortArrow">
                      <global-ts-svg-icon
                        class="icon"
                        :class="requestParam.sortKey === 'shares' && !requestParam.desc ? '' : 'isNotActive'"
                        name="icon-shaixuanshang"
                        :size="14"
                      />
                      <global-ts-svg-icon
                        class="icon"
                        :class="requestParam.sortKey === 'shares' && requestParam.desc ? '' : 'isNotActive'"
                        name="icon-shaixuanxia"
                        :size="14"
                      />
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="发布状态" min-width="80px" key="status" v-if="[3, 4].includes(sliderType)">
                <template slot-scope="scope">
                  <div v-if="!scope.row.isRedForGfw">
                    <span :class="scope.row.status == 1 ? 'green' : 'red'"></span>
                    <span :class="scope.row.status == 1 ? '' : 'unactive'"> {{ scope.row.statusName }} </span>
                  </div>
                  <div v-else>
                    <span class="red"></span>
                    <span style="color: red;"> {{ scope.row.statusName }} </span>
                    <global-ts-tool-tips offset="10" class="item tanshu_linkColor" effect="dark" placement="top-start">
                      <div slot="content">
                        您的模板已被关闭，请先删除违规内容，再申请开通。<br />
                        原因：{{ scope.row.gfwReasonName }}
                      </div>
                      <global-ts-svg-icon class="icon" name="icon-bianzu" />
                    </global-ts-tool-tips>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="shareStatus"
                label="分享状态"
                key="shareStatus"
                min-width="80"
                v-if="sliderType === 3"
              >
                <template #header>
                  <div class="sortBar" @click="changeSortType('clones')">
                    <span class="nextTimeBaby">分享状态</span>
                    <span class="sortArrow">
                      <global-ts-svg-icon
                        class="icon"
                        :class="requestParam.sortKey === 'clones' && !requestParam.desc ? '' : 'isNotActive'"
                        name="icon-shaixuanshang"
                        :size="14"
                      />
                      <global-ts-svg-icon
                        class="icon"
                        :class="requestParam.sortKey === 'clones' && requestParam.desc ? '' : 'isNotActive'"
                        name="icon-shaixuanxia"
                        :size="14"
                      />
                    </span>
                  </div>
                </template>
                <template slot-scope="scope">
                  <span :class="scope.row.shareStatus === '已分享' ? 'green' : 'red'"></span>
                  <span :class="scope.row.shareStatus === '已分享' ? '' : 'unactive'">
                    {{ scope.row.shareStatus }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="180">
                <template slot-scope="scope">
                  <div class="positionBox" v-if="sliderType == 3" style="display: inline-block;" replace>
                    <span v-if="isManage" class="tanshu_linkColor text_but1" @click="toView(scope.row)">数据</span>
                    <span
                      v-if="isManage"
                      class="tanshu_linkColor text_but1"
                      @click="toRead(scope.row.id, sliderType, scope.row.typeId)"
                    >
                      编辑
                    </span>
                    <ts-qr-tip
                      class="qrTipWrap"
                      trigger="click"
                      bindClass="popover-shareBtn shareArticle"
                      :width="220"
                      :qrCodeUrl="scope.row.articleShareQrUrl"
                      placement="bottom"
                      descTip="微信扫码后，点击右上角分享"
                    >
                      <span class="tanshu_linkColor text_margin" @click="handleShareClick">分享</span>
                    </ts-qr-tip>
                    <el-popover
                      trigger="click"
                      popper-class="lookMorkPopper"
                      v-if="isManage"
                      v-model="scope.row.lookMorkPopper"
                    >
                      <span class="tanshu_linkColor text_but1" slot="reference">
                        更多
                        <global-ts-svg-icon class="icon tshu_arrow popoverMore" name="icon-shaixuanxia" :size="14" />
                      </span>
                      <template>
                        <div class="moreOperateContent" @click="scope.row.lookMorkPopper = false">
                          <p
                            v-if="canSetArticle"
                            class="popoverItem"
                            @click="setRecommandArticle(scope.row.id, scope.row.adStatus, scope.row.status != 1)"
                          >
                            {{ scope.row.adStatus == 1 ? '取消推荐' : '推荐' }}
                          </p>
                          <p class="popoverItem" @click="closeArticle(scope.row.id, scope.row.status)">
                            {{ scope.row.status == 1 ? '关闭' : '开启' }}
                          </p>
                          <p class="popoverItem" @click="deleteArticle(scope.row.id)">删除</p>
                        </div>
                      </template>
                    </el-popover>
                  </div>
                  <div class="positionBox" v-else>
                    <span
                      v-if="![4].includes(sliderType) && isManage"
                      class="tanshu_linkColor text_but1"
                      @click="toRead(scope.row.id, sliderType)"
                      >编辑
                    </span>
                    <span v-if="isManage" class="tanshu_linkColor text_but1" @click="toView(scope.row)">数据</span>
                    <ts-qr-tip
                      class="qrTipWrap"
                      trigger="click"
                      bindClass="popover-shareBtn shareArticle"
                      :width="220"
                      :qrCodeUrl="scope.row.articleShareQrUrl"
                      placement="bottom"
                      descTip="微信扫码后，点击右上角分享"
                    >
                      <span class="tanshu_linkColor text_margin" @click="handleShareClick">分享</span>
                    </ts-qr-tip>
                    <span
                      class="tanshu_linkColor text_but1"
                      v-if="[4].includes(sliderType) && isManage"
                      style="color: #ff4d4d;"
                      @click="deleteArticle(scope.row.id, 'share')"
                      >删除
                    </span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <global-ts-pagination
            direction="up"
            :tableData="MaterialList"
            :requestParam="requestParam"
            :isReload.sync="isReload"
            @getData="changeTable"
            :httpurl="httpurl"
          >
          </global-ts-pagination>
        </div>
      </div>
    </div>
    <div id="classifyManager" class="classifyManager"></div>
    <wx-auth-dialog :dialogVisible.sync="wxAuthDialogVisible"> </wx-auth-dialog>
  </div>
</template>

<script>
import TranstionBox from '../transtion-box/index.vue';
import WxAuthDialog from '../wx-auth-dialog/index.vue';
import ClassifyManagerVm from '../classify-manager-vm/index.vue';
import { mapGetters, mapState } from 'vuex';
import { format, recordClick, postMessage, logDog, FdpLog, confirm, decodeUrl, encodeUrl } from '@/utils';
import { Table, TableColumn, Popover } from 'element-ui';
import Vue from 'vue';
import store from '@/store';
import TsQrTip from '@/components/base/ts-qr-tip/index.vue';
import {
  getTsArticleRouterInfo,
  delArticleTemplate,
  delArticle,
  setArticleTemplate,
  setAdTemplate,
} from '@/api/modules/views/customer-tools/article-material';
import { getTsUserWxAuthAppQr } from '@/api/modules/views/user';
import { getTsGuideListAjax, saveTsGuideAjax } from '@/api/modules/common';

export default {
  name: 'article-material-box',
  components: {
    TranstionBox,
    WxAuthDialog,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    TsQrTip,
    [Popover.name]: Popover,
  },
  props: {},
  data() {
    return {
      // isBType: tanShuApp.isBType, // 是否是B类用户
      showStep4: false,
      isShow: true,
      screenWidth: document.body.clientWidth,
      MaterialList: [],
      isReload: false, //是否加载
      httpurl: '', //请求地址
      resonsibilityStatusDef: [
        {
          key: '产品素材',
          value: 1,
          className: '', // 使用slider组件，这个属性是一定要声明的，因为组件中根据这个来切换样式
        },
        {
          key: '行业热文',
          value: 2,
          className: '',
        },
        {
          key: '企业文库',
          value: 3,
          className: '',
        },
        {
          key: '我的分享',
          value: 4,
          className: '',
        },
      ],
      sliderType: 1,
      typeList: [],
      lineNum: 0,
      isShowAll: false,
      isSelected: false,
      requestParam: {
        createTime: '',
        type: -1,
        sortKey: 'createTime',
        desc: true,
        fatherId: 1,
        title: '',
        typeId: '', // 因为type在企业文库中已经被用了，所以需要typeId
        createTimeStart: format.date(format.subDate(new Date(), 1, 'years'), 'yyyy-MM-dd'),
        createTimeEnd: format.date(new Date(), 'yyyy-MM-dd'),
      },
      requestParamTab: {
        // 存每个场景下的时间
        product_createTime: [
          format.date(format.subDate(new Date(), 1, 'years'), 'yyyy-MM-dd'),
          format.date(new Date(), 'yyyy-MM-dd'),
        ], // 产品素材的时间
        hotArticle_createTime: [
          format.date(format.subDate(new Date(), 1, 'years'), 'yyyy-MM-dd'),
          format.date(new Date(), 'yyyy-MM-dd'),
        ], // 行业热文的时间
        template_createTime: [
          format.date(format.subDate(new Date(), 1, 'years'), 'yyyy-MM-dd'),
          format.date(new Date(), 'yyyy-MM-dd'),
        ], // 企业文库的时间
      },
      activeNum: 0,
      issave: false,
      isgetSlider: false,
      modelDetail: {},
      beforeLoading: {
        haveLoadStatus: false, //是否已经load了客户状态
      },
      httpUrl: [
        '/rest/manage/article/library/getArticleLibraryList',
        '/rest/manage/article/template/getListForPc',
        '/rest/manage/article/getListForPc',
      ],
      imageUrl: '',
      classifyManagerVm: null,
      allSubClassify: {
        // 文章的一级二级分类
        showProductRouter: false, // 是否显示产品素材
        showIndustryRouter: false, // 是否显示行业热文
        productTypeList: [], // 产品素材
        industryTypeList: [], // 行业热文
        templateTypeList: [], // 企业文库
      },
      showArticleTip: false,
      wxAuthDialogVisible: false,
      downData: [
        {
          type: 'createArticle',
          name: '自己写文章',
        },
        {
          type: 'transformArticle',
          name: '转载文章',
        },
      ],
      isUpdate: false,
    };
  },
  computed: {
    ...mapGetters({
      isManage: 'user/isManage',
    }),
    ...mapState({
      // tanShuApp.functionInfo.articleTypeAdd.condition === false,
      version: state => !state.globalData?.functionInfo?.articleTypeAdd?.condition,
      userInfo: state => state.user.info,
    }),
    typeShowList: function() {
      if (this.screenWidth > 1992) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.lineNum = 11;
      } else if (this.screenWidth > 1862) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.lineNum = 10;
      } else if (this.screenWidth > 1721) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.lineNum = 9;
      } else if (this.screenWidth > 1590) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.lineNum = 8;
      } else if (this.screenWidth > 1463) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.lineNum = 7;
      } else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.lineNum = 6;
      }
      if (!this.isShowAll) {
        if (this.sliderType == 2) {
          return [].concat(this.typeList.slice(0, this.lineNum + 1));
        } else {
          return [].concat(this.typeList.slice(0, this.lineNum));
        }
      } else {
        return [].concat(this.typeList);
      }
    },
    /**
     * 按钮是否点击
     * */
    isTempActive() {
      return false;
    },
    /**
     * 文章的一级分类的初始化
     * @author waldon
     * @date 2020-04-13
     * @returns {Object} 文章的所有一级分类。（直销的不显示产品素材）
     */
    rootClassify() {
      let permissionClassify = [];
      if (this.allSubClassify.showProductRouter) {
        const proItem = this.resonsibilityStatusDef.find(item => item.value === 1) || [];
        permissionClassify = permissionClassify.concat(proItem);
      }
      if (this.allSubClassify.showIndustryRouter) {
        const hotItem = this.resonsibilityStatusDef.find(item => item.value === 2) || [];
        permissionClassify = permissionClassify.concat(hotItem);
      }

      const tempItem = this.resonsibilityStatusDef.find(item => item.value === 3);
      permissionClassify = permissionClassify.concat(tempItem);

      // 当数组中的元素在测试条件时返回 true 时, find() 返回符合条件的元素，之后的值不会再调用执行函数
      const shareItem = this.resonsibilityStatusDef.find(item => item.value === 4);
      permissionClassify = permissionClassify.concat(shareItem);

      return permissionClassify;
    },
    /**
     * 判断是否显示推荐文章
     * @author enson
     * @date 2020-04-13
     * @returns {boolean} true - 显示 false - 不显示
     */
    canSetArticle() {
      return this.isManage; // && this.userInfo.msg.realVer != 0
    },
  },
  watch: {
    'requestParam.createTime'(newVal) {
      this.requestParam.createTimeStart = newVal ? newVal[0] : '';
      this.requestParam.createTimeEnd = newVal ? newVal[1] : '';
    },
  },
  created() {
    /**      ie的搜索     */
    var _self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;

      if (key === 13) {
        _self.reloadDataList();
      }
    };
    this.getAllSubClassify().then(sliderType => {
      console.log('this.$route.query.typeId', this.$route.query.typeId);
      if (this.$route.query.typeId) {
        // 判断是否为主动点击
        const index = this.rootClassify.findIndex(item => {
          return item.value == Number(this.$route.query.typeId);
        });
        setTimeout(() => {
          const sliderItem = this.$refs.dataCenterSlider.$refs.sliderItem;
          this.$refs.dataCenterSlider.target = sliderItem[index];
          this.activeNum = Number(this.$route.query.typeId);
          switch (this.activeNum) {
            case 1:
              this.typeList = this.allSubClassify.productTypeList;
              this.requestParam.fatherId = 1;
              this.requestParam.type = -1;
              this.sliderType = 1;
              this.httpurl = this.httpUrl[0];
              break;
            case 2:
              this.typeList = this.allSubClassify.industryTypeList;
              this.requestParam.fatherId = 2;
              this.sliderType = 2;
              this.requestParam.type = this.allSubClassify.industryTypeList[0]
                ? this.allSubClassify.industryTypeList[0].id
                : -1;
              this.httpurl = this.httpUrl[0];
              break;
            case 3:
              this.typeList = this.allSubClassify.templateTypeList;
              this.httpurl = this.httpUrl[1];
              this.requestParam.typeId = -1;
              this.requestParam.type = -1;
              this.sliderType = 3;
              break;
            case 4:
              this.httpurl = this.httpUrl[2];
              this.sliderType = 4;
              break;
          }
        }, 0);
      } else {
        this.isgetSlider = true;
        recordClick({
          dogId: 100029,
          srcId: 1,
        });
        if (this.$route.query.isSave) {
          this.sliderType = 3;
        } else {
          this.sliderType = sliderType;
        }
        this.countIsInitFinish('haveLoadStatus');
      }
      this.getGuide().then(guideList => {
        console.log('guideList', guideList);
        this.showArticleTip = !guideList['1'];
        this.saveGuide(1);
      });
    });
    this.getTsUserWxAuthAppQrData();
  },
  mounted() {
    const that = this;
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth;
        that.screenWidth += 1;
      })();
    };
  },
  methods: {
    /**
     * 展示授权弹窗
     * @author waldon
     * @date 2020/9/16
     */
    showWxAuthDialog() {
      this.wxAuthDialogVisible = true;
    },
    /**
     *设置搜索时间
     *
     * @author guoyijie
     * @date 2020-04-29
     * @param {*} val
     */
    getSearchTime(val) {
      this.requestParam.createTime = val;
      console.log('val---,', val);
      const defaultInitTime = [
        format.date(format.subDate(new Date(), 1, 'years'), 'yyyy-MM-dd'),
        format.date(new Date(), 'yyyy-MM-dd'),
      ];
      switch (this.sliderType) {
        case 1: // 产品素材
          this.requestParamTab.product_createTime = val ? val : defaultInitTime;
          break;
        case 2: // 行业热文
          this.requestParamTab.hotArticle_createTime = val ? val : defaultInitTime;
          break;
        case 3: // 企业文库
          this.requestParamTab.template_createTime = val ? val : defaultInitTime;
          break;
      }
    },
    /**
     * @description : 获取全部二级分类，并返回一级分类的序号
     * @author      : ADI
     * @Date        : 2021-05-21 17:11:09
     * @param        {*}
     * @return       {Promise} 返回一级分类的序号
     */
    async getAllSubClassify() {
      const isCreator = this.userInfo.staffInfo.creator;
      if (this.version && !isCreator) {
        this.resonsibilityStatusDef = this.resonsibilityStatusDef.filter(item => item.value === 3 || item.value === 4);
      }
      const [err, res] = await getTsArticleRouterInfo();
      if (err) {
        return Promise.reject(err);
      }
      this.allSubClassify = res.data;
      if (this.allSubClassify.showProductRouter) {
        // 显示第一个有权限的tab
        this.typeList = this.allSubClassify.productTypeList;
        return Promise.resolve(1);
      } else if (this.allSubClassify.showIndustryRouter) {
        this.typeList = this.allSubClassify.industryTypeList;
        return Promise.resolve(2);
      } else {
        this.typeList = this.allSubClassify.templateTypeList;
        return Promise.resolve(3);
      }
    },
    /**
     * @description : 获取指引
     * @author      : ADI
     * @Date        : 2021-05-21 17:00:41
     * @param        {*}
     * @return       {Promise}
     */
    async getGuide() {
      const [err, res] = await getTsGuideListAjax({
        // 因为articleMaterial页面create的时候以及监听路由跳转的时候都会调用这个方法
        // 因此加参数区分
        unique: true,
      });
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      return Promise.resolve(res.data.guideList);
    },
    /**
     * @description : 保存指引
     * @author      : ADI
     * @Date        : 2021-05-21 17:03:31
     * @param        {*} step
     * @return       {Promise}
     */
    async saveGuide(step) {
      const [err, res] = await saveTsGuideAjax({
        step,
      });
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      return Promise.resolve();
    },
    /**
     * @function 点击文章模板制作
     */
    addArticleModel() {
      logDog('addArticleModel');
      // this.$router.push({
      // 	path: '/articleMaterial/articleModel',
      // });
      window.open(`${this.$store.getters.tsportalUrl}/editArticle.jsp`);
    },
    /**
     * @function 时间戳格式化为时分秒格式
     */
    timeFormat: function(row, column) {
      var timeLong = row[column.property];
      const hour = Math.floor(timeLong / 3600);
      const seconds = timeLong % 60;
      const minutes = (timeLong - hour * 3600 - seconds) / 60;
      const time =
        hour == 0
          ? minutes == 0
            ? seconds == 0
              ? '0'
              : seconds + '秒'
            : minutes + '分' + seconds + '秒'
          : hour + '时' + minutes + '分' + seconds + '秒';
      return time;
    },
    /**
     * @function 日期格式化为YY-MM-DD hh:mm:ss格式
     */
    dateFormat: function(row, column) {
      var date1 = row[column.property];
      var date = new Date(date1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
      const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
      const hours = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
      const minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
      const seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
      const date2 = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
      return date2;
    },
    /**
     * @function 切换素材中心、行业热文、企业文库
     */
    changeResonsibilityStatus(e, value) {
      console.log('changeResonsibilityStatus', value);
      this.showStep2 = false;
      this.sliderType = value;
      this.requestParam.fatherId = value;
      this.requestParam.title = '';
      this.isShowAll = false;
      console.log('this.requestParamTab.createTime', this.requestParamTab);
      switch (this.sliderType) {
        case 1:
          this.typeList = this.allSubClassify.productTypeList;
          this.requestParam.type = -1;
          this.requestParam.createTime = this.requestParamTab.product_createTime;
          this.isUpdate = true; // 更新时间组件
          recordClick({
            dogId: 100029,
            srcId: 1,
          });
          FdpLog('yx_cksczx', {
            yx_free_text_0: '产品素材',
            yx_staff_position: this.isManage ? 1 : 2, // 员工职务 1-管理员 2-销售员 4-未知
          });
          break;
        case 2:
          logDog('hotArticle');
          this.typeList = this.allSubClassify.industryTypeList;
          this.requestParam.createTime = this.requestParamTab.hotArticle_createTime;
          this.requestParam.type = this.allSubClassify.industryTypeList[0]
            ? this.allSubClassify.industryTypeList[0].id
            : -1;
          this.isUpdate = true; // 更新时间组件
          FdpLog('yx_cksczx', {
            yx_free_text_0: '行业热文',
            yx_staff_position: this.isManage ? 1 : 2, // 员工职务 1-管理员 2-销售员 4-未知
          });
          break;
        case 3:
          this.requestParam.type = -1;
          this.requestParam.createTime = this.requestParamTab.template_createTime;
          this.requestParam.typeId = -1; // type是用来选择样式的，typeId才是企业文库真正的二级分类
          logDog('companyArticle');
          this.typeList = this.allSubClassify.templateTypeList;
          this.isUpdate = true; // 更新时间组件
          FdpLog('yx_cksczx', {
            yx_free_text_0: '企业文库',
            yx_staff_position: this.isManage ? 1 : 2, // 员工职务 1-管理员 2-销售员 4-未知
          });
          break;
        case 4: // 已分享的文章
          this.requestParam.type = -1;
          this.typeList = [];
          FdpLog('yx_cksczx', {
            yx_free_text_0: '我的分享',
            yx_staff_position: this.isManage ? 1 : 2, // 员工职务 1-管理员 2-销售员 4-未知
          });
          break;
      }
      if (this.isgetSlider) {
        this.countIsInitFinish('haveLoadStatus');
        this.$route.query.typeId = 0;
      }
    },
    /**
     * @function 等待状态库加载完成才能发起请求
     */
    countIsInitFinish(value) {
      this.beforeLoading[value] = true;
      if (this.beforeLoading.haveLoadStatus) {
        switch (this.sliderType) {
          case 1:
          case 2:
            this.httpurl = this.httpUrl[0];
            break;
          case 3:
            this.httpurl = this.httpUrl[1];
            break;
          case 4:
            this.httpurl = this.httpUrl[2];
            break;
        }
        this.$nextTick(() => {
          this.reloadTable();
          // this.issave = false
        });
      }
    },
    /**
     * @function 重新加载表格
     */
    reloadTable: function() {
      this.isReload = true;
    },
    /**
     * @function 加载表格数据
     */
    changeTable: function(data) {
      this.MaterialList = data;
      this.isgetSlider = true;
    },
    /**
     * @function 搜索
     */
    reloadDataList: function() {
      this.requestParam = Object.assign({}, this.requestParam);
      // Ts_util.setSearchDate({
      //     name: ['createTime'],
      //     form: this.requestParam
      // });
      if (this.requestParam.createTime == null) {
        if (this.classifyManagerVm?.isShow) {
          return;
        }
        postMessage({
          type: 'error',
          message: '请输入正确的日期',
        });
      } else {
        this.isReload = true;
      }
    },
    /**
     * @function 选择类别
     * @param id {number} 分类id
     */
    changeType(id) {
      this.requestParam.type = id;
      if (this.sliderType === 3) {
        // 企业文库的使用typeId
        this.requestParam.typeId = id;
      }
      this.reloadTable();
    },
    /**
     * @function 获取更多类别
     */
    getMore() {
      this.isShowAll = !this.isShowAll;
    },
    /**
     * @function 删除文章
     */
    deleteArticle: function(id, type) {
      // Ts_util.recordClick({
      // 	dogId: 100029,
      // 	srcId: 1004
      // })
      logDog('deleteArticle');
      this.delete(id, type).then(() => {
        this.isReload = true; //成功回调
      });
    },
    /**
     * @function 删除文章操作
     * @param id {number} 素材id
     */
    /**
     * @description : 删除文章操作
     * @author      : ADI
     * @Date        : 2021-05-21 17:06:22
     * @param        {*} id 素材id
     * @param        {*} type
     * @return       {Promise}
     */
    delete(id, type) {
      return confirm('确认删除文章？删除后无法恢复', '删除确认').then(async action => {
        if (action == 'confirm') {
          let _ajax = delArticleTemplate;
          if (type == 'share') {
            _ajax = delArticle;
          }
          const [err, res] = await _ajax({
            id,
          });
          if (err) {
            postMessage({
              type: 'error',
              message: err.msg || '系统错误，请稍候重试',
            });
            return Promise.reject(err);
          }
          postMessage({
            type: 'success',
            message: '删除成功！',
          });
          return Promise.resolve();
        } else {
          return Promise.reject('cancel');
        }
      });
    },
    /**
     * @function 关闭文章
     */
    closeArticle(id, status) {
      // Ts_util.recordClick({
      // 	dogId: 100029,
      // 	srcId: 1003
      // })
      logDog('closeArticle');
      this.close(id, status).then(() => {
        this.isReload = true; //成功回调
      });
    },
    /**
     * @description : 关闭文章操作
     * @author      : ADI
     * @Date        : 2021-05-21 17:08:45
     * @param        {*} id 素材id
     * @param        {*} status 当前状态
     * @return       {Promise}
     */
    close(id, status) {
      const closeText = ['确认关闭文章？', '关闭确认', '关闭成功'];
      const openText = ['确认开启文章？', '开启确认', '开启成功'];
      const textList = status == 1 ? closeText : openText;
      return confirm(textList[0], textList[1]).then(async action => {
        if (action == 'confirm') {
          const [err, res] = await setArticleTemplate({
            id,
            status: status == 1 ? '2' : '1',
          });
          if (err) {
            postMessage({
              type: 'error',
              message: err.msg || '系统错误，请稍候重试',
            });
            return Promise.reject(err);
          }
          postMessage({
            type: 'success',
            message: textList[2],
          });
          return Promise.resolve();
        } else {
          return Promise.reject('cancel');
        }
      });
    },
    /**
     * 设置推荐文章
     * @author enson
     * @date 2020-04-13
     * @param {*} id - 文章id
     * @param {*} status - 0 不推荐 1 - 推荐
     */
    async recommand(id, status) {
      const [err, res] = await setAdTemplate({
        id,
        adStatus: status == 1 ? '0' : '1',
      });
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      postMessage({
        type: 'success',
        message: res.msg,
      });
      return Promise.resolve();
    },
    /**
     * 设置推荐文章操作
     * @author enson
     * @date 2020-04-13
     * @param {*} id
     * @param {*} adStatus - 推荐状态 0 未推荐 1 推荐
     */
    setRecommandArticle(id, adStatus, notPublic) {
      // 未发布的文章不给推荐
      if (notPublic && adStatus == 0) {
        postMessage({
          type: 'error',
          message: '文章未发布，无法推荐',
        });
        return;
      }
      this.recommand(id, adStatus).then(() => {
        this.isReload = true; //成功回调
      });
    },
    /**
     * @function 表格排序
     * @param id {number} 素材id
     * @param type {number} 素材类型
     * @param typeId {number} 素材类型
     */
    toRead: function(id, type, typeId) {
      switch (type) {
        case 1:
          logDog('edit_productArticle');
          break;
        case 2:
          logDog('edit_HotArticle');
          break;
        case 3:
          logDog('edit_companyArticle');
          break;
      }
      console.log('type---->', type);
      if (type == 3) {
        window.open(`${this.$store.getters.tsportalUrl}/editArticle.jsp?editId=${id}&&_type=${type}&&typeId=${typeId}`);
      } else {
        window.open(`${this.$store.getters.tsportalUrl}/editArticle.jsp?isMaterialId=${id}&&_type=${type}`);
      }
    },
    /**
     * @function 表格排序
     * @param row {string} 排序字段
     */
    changeSortType(type) {
      this.requestParam.sortKey = type;
      this.requestParam.desc = !this.requestParam.desc;
      this.isReload = true;
    },
    /**
     * 点击进入“文章数据”页面，并筛选定位到当前文章的数据
     * @param {Object} row -列表行数据
     */
    toView(row) {
      // if (this.sliderType === 3) { // 企业文库行为数据统计
      // 	Ts_util.recordClick({
      // 		dogId: 100029,
      // 		srcId: 1001
      // 	})
      // }
      switch (this.sliderType) {
        case 1:
          logDog('data_productArticle');
          break;
        case 2:
          logDog('data_hotArticle');
          break;
        case 3:
          logDog('data_companyArticle');
          break;
      }
      const type = this.sliderType === 3 ? row.typeId : row.type;
      this.$router.push({
        name: 'dataCenter',
        params: {
          title: row.title,
          type: this.sliderType,
          libType: this.sliderType === 4 ? -1 : type,
          isToView: 1,
          currentTab: this.sliderType === 4 ? 'staff' : '',
        },
      });
    },
    /**
     * 显示企业文库管理分类页面
     */
    showClassifyManager() {
      // Ts_util.recordClick({
      // 	dogId: 100029,
      // 	srcId: 1005
      // })
      logDog('showClassifyManager');
      if (this.classifyManagerVm) {
        this.classifyManagerVm.isShow = true;
      } else {
        const classifyManagerVmConstructor = Vue.extend(ClassifyManagerVm);
        this.classifyManagerVm = new classifyManagerVmConstructor({ store });
        this.classifyManagerVm.$mount('#classifyManager');
        this.classifyManagerVm.parent = this;
      }
      this.isShow = false;
    },
    changeArticleTip() {
      this.showArticleTip = !this.showArticleTip;
    },
    handleShareClick() {
      logDog('articleMaterial_shareBtn');
    },
    downItemClick(downItem) {
      console.log('downItem', downItem);
      switch (downItem.type) {
        case 'createArticle': // 点击的时候自己创建文章
          this.addArticleModel();
          FdpLog('yx_djtjwz', {
            yx_free_text_0: '自己写文章',
          });
          break;
        case 'transformArticle': // 点击转载公众号文章
          this.linkTransition();
          FdpLog('yx_djtjwz', {
            yx_free_text_0: '转载公众号文章',
          });
          break;
      }
    },
    /**
     *点击链接转换，挂载弹窗组件
     *
     * @author guoyijie
     * @date 2020-04-18
     */
    linkTransition() {
      logDog('linkTransition');
      this.$refs.child.parentMsg(true);
    },
    /**
     * 链接转换
     *
     * @author guoyijie
     * @date 2020-04-18
     * @param {*} link
     */
    onTransition(link) {
      link = decodeUrl(link);
      window.open(`${this.$store.getters.tsportalUrl}/editArticle.jsp?type=transform&wxUrl=${encodeUrl(link)}`);
    },
    /**
     * @description : getTsUserWxAuthAppQr
     * @author      : ADI
     * @Date        : 2021-05-21 16:32:17
     */
    async getTsUserWxAuthAppQrData() {
      const [err, res] = await getTsUserWxAuthAppQr();
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return;
      }
      this.imageUrl = res.data.qrUrl;
    },
  },
};
</script>

<style lang="scss" scoped>
.MaterialBox {
  .step_8 {
    position: fixed;
    top: 0%;
    left: 0%;
    z-index: 10000;
    width: 100%;
    height: 100%;
    min-width: 1500px;
    background: rgba(0, 0, 0, 0.6);
    .tipBox {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 530px;
      height: 180px;
      margin-top: -90px;
      margin-left: -260px;
      .QRImg {
        position: absolute;
        top: 0;
        left: 0;
        display: inline-block;
        width: 180px;
        height: 180px;
        background: $color-ff;
        background-position: 15px 15px;

        /* background-image: url('~@/assets/image/comm/qrcode.jpg?v=201906101722'); */
        background-repeat: no-repeat;
        background-size: 150px 150px;
        border-radius: 10px;
      }
      .tipText {
        display: inline-block;
        font-size: 20px;
        color: $color-ff;
      }
      .tipText_1 {
        position: absolute;
        top: 23px;
        left: 220px;
      }
      .tipText_2 {
        position: absolute;
        top: 55px;
        left: 220px;
        font-size: 16px;
      }
      .okImg {
        position: absolute;
        top: 94px;
        left: 220px;
        display: inline-block;
        width: 209px;
        height: 87px;
        cursor: pointer;
        background-image: url('~@/assets/image/comm/direct/ok.png');
        background-repeat: no-repeat;
        background-size: 209px 87px;
      }
    }
  }
  ::v-deep .tshu_select {
    .tshu_select_input {
      .tshu_arrow {
        margin-right: 0;
      }
    }
  }
}
.articleMaterial {
  .pro_header_addEm {
    margin-left: auto;
  }
  .topTitle {
    .icon {
      width: 1.2em;
      height: 1.2em;
      overflow: hidden;
      color: #247af3;
      vertical-align: -0.15em;
    }
    &.BType {
      cursor: pointer;
    }
  }
  .bottomBorder {
    position: relative;
    padding-bottom: 17px;
    margin-bottom: 20px;
  }
  .typeBox {
    position: relative;
    margin-bottom: 20px;
    & > div {
      display: flex;
      width: 92%;
      align-items: center;
      flex-wrap: wrap;
    }
  }
  .pro_listBox {
    .articleMaterial_main {
      .pro_line {
        .tshu_select {
          width: 120px;
        }
      }
    }
    .ts-slide-card {
      .slide-children {
        margin-right: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .getMoreicon {
      position: absolute;
      top: 10px;
      right: 0;
      display: inline-flex;
      width: 40px !important;
      height: 40px;
      min-width: auto;
      margin-top: 0 !important;
      background: #fafafa;
      border: 1px solid #eeeeee;
      border-radius: 4px;
      align-items: center;
      justify-content: center;
      ::v-deep .icon {
        margin-right: 0;
        color: $color-b2;
      }
    }
    .addClassify {
      display: inline-flex;
      width: 40px !important;
      height: 40px;
      background: #fafafa;
      border: 1px solid #eeeeee;
      border-radius: 4px;
      align-items: center;
      justify-content: center;
      &.global-button-size-medium {
        min-width: auto;
      }
      ::v-deep .icon {
        margin-right: 0;
        color: $color-b2;
      }

      &:active {
        background: $primary-color;
        border: none;
        ::v-deep .icon {
          color: $color-ff;
        }
      }
    }
    .toright {
      position: absolute;
      top: 10px;
      right: 61px;
      margin-top: 0 !important;
    }
    .typeBox {
      .global-button {
        margin-top: 10px;
        margin-right: 10px;
        margin-left: 0;
        ::v-deep span {
          display: inline-block;
          width: 80px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .global-button-type-others {
        background: #fafafa;
        border: 1px solid #eeeeee;
      }
    }
    .showMaterialList {
      .green {
        display: inline-block;
        width: 5px;
        height: 5px;
        vertical-align: middle;
        background: #247af3;
        border-radius: 50%;
      }
      .red {
        display: inline-block;
        width: 5px;
        height: 5px;
        background: $error-color;
        border-radius: 50%;
      }
      .redBox {
        margin-top: -3px;
        margin-right: 8px;
        font-size: 36px;
        color: $error-color;
        vertical-align: middle;
      }
      .unactive {
        color: $color-b2;
      }
    }
  }
  .rightPart {
    .tooltipBox {
      top: 150px;
      right: 10px;
      width: 322px;
    }
  }
  .showMaterialList {
    .tooltipBox {
      top: 37px;
      right: -31px;
      width: 322px;
    }
    ::v-deep .tshu-tableset {
      .titleText {
        padding-left: 14px;
      }
    }
  }
  .articleTip {
    position: relative;
    width: 100%;
    height: 311px;
    margin-top: -10px;
    margin-bottom: 20px;
    background: url('~@/assets/image/indexManage/indexB/articleTip_directBg.png') center no-repeat;
    background-size: cover;
    .closeBtn {
      position: absolute;
      right: 10px;
      bottom: 5px;
      width: 62px;
      height: 27px;
      cursor: pointer;
      background: url('~@/assets/image/indexManage/indexB/articleTipBtn.png') no-repeat;
      background-size: 100% 100%;
    }
  }
}
.typeBox {
  .global-button-size-medium {
    min-width: 100px;
  }
}
.showMaterialList {
  .tooltipBox {
    .tooltiptext {
      top: 0;
      right: 0;
      width: 286px;
    }
    .tooltipArrow {
      top: -12px;
      left: 273px;
      z-index: 50;
      border-bottom: 6px solid #303133;
      border-left: 6px solid transparent;
    }
  }
}
.moreOperateContent {
  text-align: center;
}
</style>

<style lang="scss">
.articleMaterial {
  .qrTipWrap {
    .el-popover__reference {
      display: inline-block;
    }
  }
}

.shareArticle {
  &.el-popover {
    &.popover-shareBtn {
      .popoverContent {
        text-align: center;
        img {
          &.qrCode {
            float: none;
          }
        }
      }
      .popoverContent-desc {
        height: auto;
        margin-top: 10px;
      }
    }
  }
}
.lookMorkPopper {
  &.el-popover {
    min-width: 0;
    padding: 12px 0;
    .popoverItem {
      width: 100%;
      height: 36px;
      padding: 0 30px;
      line-height: 36px;
      color: rgb(137, 137, 137);
      text-align: center;
      cursor: pointer;
      box-sizing: border-box;
    }
  }
}
.el-popover__reference {
  .popoverMore {
    width: 0.6em;
    height: 0.6em;
    color: $color-b2;
    vertical-align: 0;
  }
}
.el-popover {
  .popoverItem {
    &:hover {
      background: #f6f6f6;
    }
  }
}
.showMaterialList {
  .el-table {
    overflow: visible;
    .positionBox {
      position: relative;
      display: inline-block;
    }
    .el-table__body-wrapper {
      overflow: visible;
    }
    .el-table__row {
      &:nth-of-type(1) {
        td {
          &:nth-last-of-type(1) {
            .cell {
              overflow: visible;
            }
          }
        }
      }
    }
  }
}

/* @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
  .articleMaterial .pro_line .el-input__inner {
    padding: 0 24px 0 10px;
  }
} */
</style>
