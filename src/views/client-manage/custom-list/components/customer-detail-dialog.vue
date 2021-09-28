<!--
 * @Description  : 客户详情对话框
 * @Author       : turbo
 * @Date         : 2021-07-13 18:23:15
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-20 11:55:53
-->

<template>
  <div>
    <global-ts-dialog
      class="customer-detail-dialog ts-detail-dialog"
      dialog-title="客户详情"
      dialog-size="large"
      no-body-padding
      :dialog-visible.sync="dialogVisible"
      :with-footer="false"
      :lock-dialog-body-height="false"
      @cancel="cancel"
    >
      <div class="dialog-content">
        <div class="base-info">
          <div class="base-content">
            <global-ts-text-img
              :img-url="customerInfo.wxHeadImgUrl"
              :img-text="customerInfo.contacts"
              :sex-color="sexColor(customerInfo.sex)"
            >
            </global-ts-text-img>
            <div class="name-box">
              <div v-if="customerInfo.contacts" class="contacts">
                {{ customerInfo.contacts }}
                <span v-if="customerInfo.assistInfo && customerInfo.assistInfo.isAssist" class="assist-icon">
                  协
                </span>
              </div>
              <div
                v-if="customerInfo.wxName && customerInfo.contacts && customerInfo.wxName !== customerInfo.contacts"
                class="wxname"
              >
                {{ customerInfo.wxName }}
              </div>
            </div>
            <div v-if="!isFromMerge" class="button-box">
              <global-ts-button
                v-if="customerInfo.assistInfo && customerInfo.assistInfo.isAssist"
                type="primary"
                size="small"
                @click="cancelAssist(checkOption.id)"
              >
                取消协助
              </global-ts-button>
              <global-ts-button type="primary" size="small" @click="$emit('editCustomer', checkOption.id)">
                编辑
              </global-ts-button>
            </div>
          </div>
          <div class="base-detail">
            <div v-for="item in baseDetail" :key="item.key" class="detail-wrapper">
              <div class="label">{{ item.name }}</div>
              <div v-if="item.key === 'relateClue'" class="value text_but1" @click="showRelateClue">
                {{ item.value || '请选择关联' }}
              </div>
              <global-ts-select
                class="detail-select"
                placeholder="-"
                v-else-if="item.key === 'intentionName'"
                v-model="customerInfo.intention"
                :list="intentionList"
                @onSelect="handleSelectIntention"
              ></global-ts-select>
              <div v-else class="value">{{ item.value }}</div>
            </div>
          </div>
          <status-step
            :cid="customerInfo.id"
            :follow-status="customerInfo.followStatus"
            :status-list="followStatusList"
            @setFollowStatusName="setFollowStatusName"
          ></status-step>
        </div>
        <div class="detail-info">
          <div class="slider-box">
            <div
              class="slider-item"
              :class="{ active: item.value === currentTab }"
              v-for="item of sliderList"
              :key="item.value"
              @click="changeCustomerTab(item)"
            >
              {{ item.key }}
            </div>
          </div>
          <div class="container">
            <div v-if="currentTab === 1">
              <div v-if="isShowPersonInfo" class="info-part">
                <div class="info-title">个人信息</div>
                <div class="info-content">
                  <div v-if="systemFieldAbleConf.birthday" class="field-item">
                    <span class="title">生日：</span><span class="content">{{ customerInfo.birthday }}</span>
                  </div>
                  <div v-if="systemFieldAbleConf.wx" class="field-item">
                    <span class="title">微信号：</span><span class="content">{{ customerInfo.wx }}</span>
                  </div>
                  <div v-if="systemFieldAbleConf.sex" class="field-item">
                    <span class="title">性别：</span><span class="content">{{ customerInfo.sexName }}</span>
                  </div>
                  <div v-if="systemFieldAbleConf.qq" class="field-item">
                    <span class="title">QQ：</span><span class="content">{{ customerInfo.qq }}</span>
                  </div>
                  <div v-if="systemFieldAbleConf.idCard" class="field-item">
                    <span class="title">证件号：</span><span class="content">{{ customerInfo.idCard }}</span>
                  </div>
                  <div
                    class="field-item"
                    v-for="item of personFieldsListTemp"
                    :class="{ rowBox: item.fieldType === 2 }"
                    :key="item.id"
                  >
                    <span class="title">{{ item.name }}：</span>
                    <a v-if="item.ossUrl" class="content" :href="item.ossUrl" target="_blank">
                      {{ item.valuesName }}
                    </a>
                    <span v-else class="content">{{ item.valuesName }}</span>
                  </div>
                </div>
              </div>
              <div class="info-part">
                <div class="info-title">
                  客户标签
                  <global-ts-button
                    class="add-tag-btn"
                    type="default"
                    size="medium"
                    icon="icon-icon-11"
                    @click="showTagSelectDialog"
                  ></global-ts-button>
                </div>
                <div class="info-content">
                  <div class="customer-tag" v-for="item of selectedGroupWithTagList" :key="item.id">
                    <div class="group-name">{{ item.name }}</div>
                    <ts-wxtag class="group-label" type="selected" v-for="subItem of item.tag" :key="subItem.id">
                      {{ subItem.name }}
                    </ts-wxtag>
                  </div>
                </div>
              </div>
              <div v-if="isShowOtherInfo" class="info-part">
                <div class="info-title">其他信息</div>
                <div class="info-content">
                  <div v-if="systemFieldAbleConf.corpName" class="field-item">
                    <span class="title">企业：</span><span class="content">{{ customerInfo.corpName }}</span>
                  </div>
                  <div v-if="systemFieldAbleConf.industry" class="field-item">
                    <span class="title">行业：</span><span class="content">{{ customerInfo.industryName }}</span>
                  </div>
                  <div v-if="systemFieldAbleConf.customersWay" class="field-item">
                    <span class="title">获客方式：</span>
                    <span class="content">{{ customerInfo.customersWayName }}</span>
                  </div>
                  <div v-if="systemFieldAbleConf.area" class="field-item">
                    <span class="title">区域：</span><span class="content">{{ getRegion }}</span>
                  </div>
                  <div v-if="systemFieldAbleConf.address" class="field-item">
                    <span class="title">地址：</span><span class="content">{{ customerInfo.address }}</span>
                  </div>
                  <div v-if="systemFieldAbleConf.position" class="field-item">
                    <span class="title">职位：</span><span class="content">{{ customerInfo.position }}</span>
                  </div>
                  <div class="field-item">
                    <span class="title">来源：</span><span class="content">{{ customerInfo.sourceName }}</span>
                  </div>
                  <div class="field-item">
                    <span class="title">上级人脉：</span><span class="content">{{ customerInfo.fromViewerName }}</span>
                  </div>
                  <div class="field-item" v-for="item of otherFieldsListTemp" :key="item.id">
                    <span class="title">{{ item.name }}：</span><span class="content">{{ item.valuesName }}</span>
                  </div>
                  <div v-if="systemFieldAbleConf.remark" class="field-item rowBox">
                    <span class="title">备注：</span><span class="content">{{ customerInfo.remark }}</span>
                  </div>
                  <div class="field-item rowBox" v-for="item of otherLongFieldsListTemp" :key="item.id">
                    <span class="title">{{ item.name }}：</span><span class="content">{{ item.valuesName }}</span>
                  </div>
                </div>
              </div>
              <div class="info-part">
                <div class="info-title">销售信息</div>
                <div class="info-content">
                  <div class="field-item">
                    <span class="title">回访时间：</span><span class="content">{{ customerInfo.visitsTimeName }}</span>
                  </div>
                  <div class="field-item">
                    <span class="title">客户关联时间：</span>
                    <span class="content">{{ customerInfo.salesRelTime }}</span>
                  </div>
                  <div class="field-item">
                    <span class="title">最近访问时间：</span>
                    <span class="content">{{ customerInfo.lastVisitsTimeName }}</span>
                  </div>
                  <div class="field-item">
                    <span class="title">最近跟进时间：</span>
                    <span class="content">{{ customerInfo.updateTimeName }}</span>
                  </div>
                  <div class="field-item">
                    <span class="title">客户创建时间：</span>
                    <span class="content">{{ customerInfo.createTimeName }}</span>
                  </div>
                  <div class="field-item rowBox">
                    <span class="title">协助人：</span><span class="content">{{ assistNames }}</span>
                  </div>
                </div>
              </div>
              <div v-if="customerInfo.isShowWxWorkMsg" class="info-part">
                <div class="info-title">企微信息</div>
                <div class="info-content">
                  <div class="field-item rowBox">
                    <span class="title">跟进人：</span><span class="content">{{ customerInfo.tsWxWorkUser }}</span>
                  </div>
                  <div class="field-item rowBox">
                    <div>企微群（{{ wxWorkGroupLength }}）：</div>
                    <div v-for="item in customerInfo.tsWxWorkGroupChatList" :key="item.id" class="group-info">
                      <div>{{ item.groupChatName ? item.groupChatName : '-' }}</div>
                      <div class="group-owner">群主：{{ item.ownerName }}</div>
                    </div>
                  </div>
                  <div class="field-item">
                    <span class="title">企微来源：</span>
                    <span class="content">{{ customerInfo.wxWorkSourceName }}</span>
                  </div>
                  <div class="field-item">
                    <span class="title">企微渠道：</span>
                    <span class="content">{{ customerInfo.wxWorkChannelName }}</span>
                  </div>
                  <div class="field-item">
                    <span class="title">备注名：</span><span class="content">{{ remarkName }}</span>
                  </div>
                  <div class="field-item">
                    <span class="title">备注企业：</span>
                    <span class="content">{{ remarkCorpName }}</span>
                  </div>
                  <div class="field-item">
                    <span class="title">备注手机：</span><span class="content">{{ mobiles }}</span>
                  </div>
                  <div class="field-item">
                    <span class="title">备注描述：</span><span class="content">{{ description }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="[2, 3].includes(currentTab)">
              <div v-if="currentTab === 3" class="follow-box">
                <fa-textarea
                  placeholder="请输入跟进内容"
                  :max-length="200"
                  :rows="4"
                  v-model="followInfo.remark"
                ></fa-textarea>
                <div class="follow-operate">
                  <div class="select-box">
                    <el-date-picker
                      align="right"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="预约回访时间"
                      :picker-options="pickerOptions"
                      v-model="followInfo.visitsTime"
                      @focus="$utils.logDog('customList_visitsTimeNew')"
                      @change="changeDate"
                    >
                    </el-date-picker>
                    <el-tooltip effect="dark" content="添加跟进附件" placement="top">
                      <el-popover
                        popper-class="customer-detail"
                        placement="bottom-start"
                        :visible-arrow="false"
                        v-model="isShowPopover"
                      >
                        <template #reference>
                          <div class="add-file-btn" v-show="isShowAdd">
                            <global-ts-svg-icon name="icon-tianjia1616"></global-ts-svg-icon>
                          </div>
                        </template>
                        <div class="select-doc" @click="showUpload('img')">添加图片</div>
                        <div class="select-doc" @click="showUpload('doc')">添加文档</div>
                      </el-popover>
                    </el-tooltip>
                    <div class="uopload-item" v-for="(item, index) in successUpLoadList" :key="index">
                      <el-tooltip effect="dark" :content="item.name" placement="top">
                        <div>
                          <img :src="getIcon(item)" />
                          <div class="gray-mask" @click="removeFile(index)">
                            <global-ts-svg-icon name="icon-icon-10" color="#fffeff" :size="20"></global-ts-svg-icon>
                          </div>
                        </div>
                      </el-tooltip>
                    </div>
                  </div>
                  <global-ts-button type="primary" size="small" @click="addTsClientVisits">添加跟进</global-ts-button>
                </div>
              </div>
              <ts-clue
                ref="clue"
                :is-follow="isFollow"
                :slide-val="subSliderVal - 1"
                :action-list="actionList"
                :viewer-id="viewerIdList"
                @getNextPage="getNextPage"
              ></ts-clue>
            </div>
            <ts-custom-behavior-analysis
              v-if="currentTab === 4"
              :viewer-id="checkOption.viewerId"
            ></ts-custom-behavior-analysis>
          </div>
        </div>
        <div class="operate-box">
          <div
            class="button"
            :class="{ disabled: hasNext === 'noPrev' || customerList.length <= 1 }"
            @click="goNextPage(false)"
          >
            <global-ts-button
              :class="{ disabled: hasNext === 'noPrev' || customerList.length <= 1 }"
              type="others"
              size="small"
            >
              <global-ts-svg-icon name="icon-icon-13" color="#898989" :size="10"></global-ts-svg-icon>
            </global-ts-button>
            上一个
          </div>
          <div
            class="button"
            :class="{ disabled: hasNext === 'noNext' || customerList.length <= 1 }"
            @click="goNextPage(true)"
          >
            下一个
            <global-ts-button
              :class="{ disabled: hasNext === 'noNext' || customerList.length <= 1 }"
              type="others"
              size="small"
            >
              <global-ts-svg-icon name="icon-icon-14" color="#898989" :size="10"></global-ts-svg-icon>
            </global-ts-button>
          </div>
        </div>
      </div>
    </global-ts-dialog>
    <ts-tag-select-dialog
      :selected-tag-list="selectedTagList"
      :dialog-visible.sync="tagSelectDialogVisible"
      @getSelectedTag="getSelectedTag"
    ></ts-tag-select-dialog>
    <customer-merge-dialog
      :cid="checkOption.id"
      :customer-name="customerInfo.contacts || customerInfo.wxName"
      :dialog-visible.sync="customerMergeDialogVisible"
      @updateDetail="updateDetail"
    ></customer-merge-dialog>
    <relate-clue-dialog
      :cid="checkOption.id"
      :sid="customerInfo.sid"
      :dialog-visible.sync="relateClueDialogVisible"
      @updateDetail="updateDetail"
    ></relate-clue-dialog>
    <global-ts-file-select-upload-dialog
      :limit-num="limitNums"
      :accept-type="accptType"
      :dialog-visible.sync="tanshuFileSelectUploadVisible"
      @success="uploadSuccess"
      @fileUploadSuccess="fileUploadSuccess"
    >
    </global-ts-file-select-upload-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { merge } from 'lodash';
import moment from 'moment';

// assets
import iconWordPng from '@/assets/image/material/icon_word.png';
import iconExcelPng from '@/assets/image/material/icon_excel.png';
import iconPdfPng from '@/assets/image/material/icon_pdf.png';
import iconPptPng from '@/assets/image/material/icon_ppt.png';
import iconVideoPng from '@/assets/image/material/icon_video.png';

// components
import TsWxtag from '@/components/base/ts-wxtag/index.vue';
import TsClue from '@/components/base/ts-clue/index.vue';
import TsTagSelectDialog from '@/components/base/ts-tag-select-dialog/index.vue';
import TsCustomBehaviorAnalysis from '@/components/base/ts-custom-behavior-analysis/index.vue';
import StatusStep from './status-step.vue';
import CustomerMergeDialog from './customer-merge-dialog.vue';
import RelateClueDialog from './relate-clue-dialog.vue';

// utils
import { postLimitVer, confirm, logDog } from '@/utils';

// config
import versionDef from '@/config/version-def';

// api
import { client } from '@/api';

export default {
  name: 'CustomerDetailDialog',
  components: {
    TsWxtag,
    TsClue,
    TsTagSelectDialog,
    TsCustomBehaviorAnalysis,
    StatusStep,
    CustomerMergeDialog,
    RelateClueDialog,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    customerId: {
      type: Number,
    },
    detailType: {
      type: String,
      default: '',
    },
    isFromMerge: {
      type: Boolean,
      default: false,
    },
    isShowMerge: {
      type: Boolean,
      default: false,
    },
    customerList: {
      type: Array,
      default: () => [],
    },
    followStatusList: {
      // 跟进阶段列表
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isReload: false,
      currentTab: 1,
      subSliderVal: 0,
      customerInfo: {},
      viewerIdList: '',
      pages: {
        pageNow: 1,
        limit: 10,
        maxPage: 2,
      },
      checkOption: {
        id: 0,
        viewerId: 0,
        date: 1,
        isGetAll: true,
      },
      followInfo: {
        id: 0,
        visitsTime: '',
        remark: '',
        idList: [],
      },
      intentionList: [
        {
          label: '高',
          value: 1,
        },
        {
          label: '中',
          value: 2,
        },
        {
          label: '低',
          value: 3,
        },
      ],
      sliderList: [
        {
          key: '客户信息',
          value: 1,
          className: '',
          notIcon: true,
        },
        {
          key: '互动动态',
          value: 2,
          className: '',
          notIcon: true,
        },
        {
          key: '跟进记录',
          value: 3,
          className: '',
          notIcon: true,
        },
        {
          key: '行为分析',
          value: 4,
          className: '',
          notIcon: true,
        },
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: '1天后',
            onClick(picker) {
              logDog('customList_Time1');
              const nextDay = new Date();
              nextDay.setTime(nextDay.getTime() + 3600 * 1000 * 24 * 1);
              picker.$emit('pick', nextDay);
            },
          },
          {
            text: '3天后',
            onClick(picker) {
              logDog('customList_Time2');
              const nextDay = new Date();
              nextDay.setTime(nextDay.getTime() + 3600 * 1000 * 24 * 3);
              picker.$emit('pick', nextDay);
            },
          },
          {
            text: '7天后',
            onClick(picker) {
              logDog('customList_Time3');
              const nextDay = new Date();
              nextDay.setTime(nextDay.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', nextDay);
            },
          },
          {
            text: '15天后',
            onClick(picker) {
              logDog('customList_Time4');
              const nextDay = new Date();
              nextDay.setTime(nextDay.getTime() + 3600 * 1000 * 24 * 15);
              picker.$emit('pick', nextDay);
            },
          },
        ],
      },
      isFollow: false, // 是否跟进页签
      actionList: [], // 文章/名片行为
      selectedTagList: [], // 标签集合
      selectedGroupWithTagList: [], // 标签组集合
      tagSelectDialogVisible: false,
      personFieldsList: [], // 个人信息
      otherFieldsList: [], // 其他信息
      otherLongFieldsList: [], // 其他多行信息
      systemFieldAbleConf: {}, // 系统字段是否开启
      isShowPersonInfo: false, // 是否显示个人信息
      isShowOtherInfo: false, // 是否显示其他信息
      followStatusName: '', // 当前跟进阶段名称
      isShowPopover: false,
      accptType: 'img',
      successUpLoadList: [],
      customerMergeDialogVisible: false,
      relateClueDialogVisible: false,
      tanshuFileSelectUploadVisible: false,
    };
  },
  watch: {
    async 'dialogVisible'(newVal) {
      this.currentTab = 1;
      if (newVal) {
        this.subSliderVal = 0;
        this.detailType === 'addFollow' && (this.currentTab = 3);
        this.followInfo = {
          id: '',
          visitsTime: '',
          remark: '',
          idList: [],
        };
        if (this.customerId) {
          this.checkOption.id = this.customerId;
          this.followInfo.id = this.customerId; // 跟进记录添加
          await this.getViewerInfo();
          if (this.customerInfo.isNeedMerge && this.isShowMerge) {
            setTimeout(() => {
              // 延迟300ms出现第二个弹窗，避免遮罩层有闪动
              this.customerMergeDialogVisible = true;
            }, 300);
          }
        }
      } else {
        if (this.isReload && !this.isFromMerge) {
          this.isReload = false;
          this.$emit('reloadTable');
        }
      }
    },
    async 'currentTab'(newVal) {
      this.restart();
      this.subSliderVal = 1;
      this.isFollow = false;
      this.$refs.clue && this.$refs.clue.unConnect();
      switch (newVal) {
        case 1:
          break;
        case 2:
          this.reSetListInfo();
          this.getActionList();
          break;
        case 3:
          this.reSetListInfo();
          this.isFollow = true;
          this.actionList = await this.getFollowList();
      }
    },
    'customerInfo.intention'(newVal, oldVal) {
      if (oldVal !== undefined && newVal !== undefined) {
        // 弹窗初始渲染时会给意向度赋初始值，此时不需要请求
        this.selectIntention(newVal);
      }
    },
  },
  computed: {
    ...mapState({
      tsStaffExtraList: state => state.user.tsStaffExtraList,
    }),
    isHaveVersion() {
      return !versionDef.checkIsFree();
    },
    sexColor() {
      return function(sex) {
        return sex === 1 ? 'man' : sex === 2 ? 'woman' : '';
      };
    },
    baseDetail() {
      return [
        {
          key: 'staffName',
          name: '跟进人',
          value: this.customerInfo.staffName
            ? this.$utils.showStaffName(this.tsStaffExtraList, this.customerInfo.sid, this.customerInfo.staffName)
            : '无',
        },
        {
          key: 'mobile',
          name: '手机号码',
          value: this.customerInfo.mobile || '无',
        },
        {
          key: 'followStatusName',
          name: '跟进阶段',
          value: this.followStatusName || '无',
        },
        {
          key: 'intentionName',
          name: '意向度',
          value: this.customerInfo.intentionName || '无',
        },
        {
          key: 'dataSourceName',
          name: '客户类型',
          value: this.customerInfo.dataSourceName || '无',
        },
        {
          key: 'relateClue',
          name: '关联线索',
          value: this.customerInfo.relateClueName || '无',
        },
      ];
    },
    personFieldsListTemp() {
      return this.personFieldsList.filter(item => item.unable === 0);
    },
    otherFieldsListTemp() {
      return this.otherFieldsList.filter(item => item.unable === 0);
    },
    otherLongFieldsListTemp() {
      return this.otherLongFieldsList.filter(item => item.unable === 0);
    },
    getRegion() {
      return [this.customerInfo.province, this.customerInfo.city, this.customerInfo.county].filter(s => !!s).join('，');
    },
    assistNames() {
      return this.customerInfo.assistInfo?.assistNames;
    },
    remarkName() {
      return this.customerInfo.wxWorkRemark?.remark;
    },
    remarkCorpName() {
      return this.customerInfo.wxWorkRemark?.remarkCorpName;
    },
    mobiles() {
      if (this.customerInfo.wxWorkRemark) {
        const mobiles = this.customerInfo.wxWorkRemark.mobiles;
        if (Object.prototype.toString.call(mobiles).slice(8, -1) === 'Array') {
          return mobiles.map(item => item).join(',');
        }
      }
      return '';
    },
    description() {
      return this.customerInfo.wxWorkRemark?.description;
    },
    wxWorkGroupLength() {
      return this.customerInfo.tsWxWorkGroupChatList?.length;
    },
    isShowAdd() {
      return this.successUpLoadList.length < 10;
    },
    limitNums() {
      return 10 - this.successUpLoadList.length;
    },
    getIcon() {
      return function(file) {
        const fileName = file.name;
        if (fileName && fileName.includes('.')) {
          const fileNames = fileName.split('.');
          const fileType = fileNames[fileNames.length - 1];
          switch (fileType) {
            case 'doc':
            case 'docx':
              return iconWordPng;
            case 'xls':
            case 'xlsx':
              return iconExcelPng;
            case 'pdf':
              return iconPdfPng;
            case 'ppt':
            case 'pptx':
            case 'pps':
            case 'ppsx':
              return iconPptPng;
            case 'jpg':
            case 'jpeg':
            case 'png':
              return file.content;
            case 'mp4':
            case 'MP4':
              return file.coverImg || iconVideoPng;
          }
        }
      };
    },
    hasNext() {
      const index = this.customerList.findIndex(item => item.id === this.customerInfo.id);
      if (index === 0) {
        return 'noPrev';
      } else if (index === this.customerList.length - 1) {
        return 'noNext';
      } else {
        return 'middle';
      }
    },
  },
  mounted() {
    this.$utils.logDog('show_customerDetailDialog');
  },
  methods: {
    async getViewerInfo() {
      this.customerInfo = {};
      const { getTsClient } = client;
      const [err, res] = await getTsClient({
        cid: this.customerId,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.customerInfo = res.data;
      this.checkOption.viewerId = this.customerInfo.viewerId;
      this.viewerIdList = JSON.stringify(this.customerInfo.clueIdList);
      this.selectedGroupWithTagList = this.customerInfo.clientTagList;
      this.customerInfo.birthday &&
        (this.customerInfo.birthday = moment(this.customerInfo.birthday).format('yyyy-MM-DD'));
      this.customerInfo.salesRelTime &&
        (this.customerInfo.salesRelTime = moment(this.customerInfo.salesRelTime).format('yyyy-MM-DD HH:mm:ss'));
      this.customerInfo.labelIdJson = JSON.stringify(this.selectedTagList);
      const tsWxWorkUserList = [];
      for (const item of this.customerInfo.tsWxWorkUserList) {
        tsWxWorkUserList.push(item.name);
      }
      this.customerInfo.tsWxWorkUser = tsWxWorkUserList.join('、');
      this.systemFieldAbleConf = this.customerInfo.systemFieldAbleConf;
      const personKeyList = ['sex', 'birthday', 'wx', 'qq', 'idCard'];
      this.isShowPersonInfo = personKeyList.some(item => this.systemFieldAbleConf[item]);
      const otherKeyList = ['corpName', 'industry', 'position', 'area', 'address', 'remark', 'customersWay'];
      this.isShowOtherInfo = otherKeyList.some(item => this.systemFieldAbleConf[item]);
      this.personFieldsList = [];
      this.otherFieldsList = [];
      this.otherLongFieldsList = [];
      const personLongFiledList = [];
      const crmFieldDataList = this.customerInfo.crmFieldDataList;
      for (const item of crmFieldDataList) {
        if (item.groupId === 0) {
          if (item.fieldType !== 2) {
            this.personFieldsList.push(item); // 个人信息
          } else {
            personLongFiledList.push(item);
          }
          if (item.unable === 0) {
            this.isShowPersonInfo = true;
          }
        } else if (item.fieldType !== 2) {
          this.otherFieldsList.push(item);
          if (item.unable === 0) {
            this.isShowOtherInfo = true;
          }
        } else {
          this.otherLongFieldsList.push(item); // 其他信息多行文本
          if (item.unable === 0) {
            this.isShowOtherInfo = true;
          }
        }
      }
      this.personFieldsList = this.personFieldsList.concat(personLongFiledList);
      return Promise.resolve();
    },
    /**
     * 获取互动行为列表
     * @author waldon
     * @date 2020-07-06
     */
    async getActionList() {
      if (!this.isHaveVersion) {
        this.actionList = [];
        return;
      }
      const { getRecordList } = client;
      const [err, res] = await getRecordList(
        merge({}, this.checkOption, this.pages, { viewerIdList: this.viewerIdList }),
      );
      if (err) {
        if (err.rt === 6018) {
          postLimitVer('当前版本客户动态功能未开放，请升级版本');
        } else {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
        }
        return Promise.reject(err);
      }
      const data = res.data;
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          this.actionList.push({
            date: key,
            list: data[key],
          });
        }
      }
      this.pages.maxPage = Math.ceil(res.total / this.pages.limit);
    },
    /**
     * 获取跟进记录
     * @author waldon
     * @date 2020/4/30
     */
    async getFollowList() {
      const { getTsClientVisitsList } = client;
      const [err, res] = await getTsClientVisitsList(
        merge(
          {},
          {
            id: this.followInfo.id,
          },
          this.pages,
        ),
      );
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const list = res.data;
      list.forEach(item => {
        // 后端那边要时分秒排序，前端特殊处理一下，跟互动动态保持一致
        item.date = moment(item.date).format('yyyy-MM-DD');
        if (item.list && item.list.length > 0) {
          item.list.forEach(subItem => {
            subItem.createTimeName = subItem.createTime ? moment(subItem.createTime).format('HH:mm') : '';
            subItem.visitTimeName = subItem.visitsTimeName;
          });
        }
      });
      this.pages.maxPage = Math.ceil(res.total / this.pages.limit);
      return list;
    },
    cancel() {
      if (this.successUpLoadList.length || this.followInfo.remark || this.followInfo.visitsTime) {
        confirm('您还未保存跟进内容，离开该页面将不保留已输入的内容和上传的附件，确定离开吗？').then(() => {
          this.successUpLoadList = [];
          const { followInfo } = this.$options.data();
          this.followInfo = followInfo;
          this.$emit('update:dialogVisible', false);
        });
      } else {
        this.$emit('update:dialogVisible', false);
      }
    },
    /**
     * @description : 取消协助
     * @author      : turbo
     * @Date        : 2021-07-15 10:50:15
     * @param        {Number} cid
     * @return       {*}
     */
    cancelAssist(cid) {
      confirm('确认不再协助跟进该客户吗？').then(async () => {
        const { unbindAssistClient } = client;
        const [err, res] = await unbindAssistClient({ cid });
        this.$utils.postMessage({
          type: err ? 'error' : 'success',
          message: err ? err.msg || '网络错误，请稍候重试' : res.msg,
        });
        if (!err) {
          this.getViewerInfo();
          this.isReload = true;
        }
      });
    },
    showRelateClue() {
      this.$utils.FdpLog('yx_khxqy', {
        yx_free_text_1: '关联线索',
        yx_app_terminal: 1,
      });
      this.$utils.FdpLog('yx_glxs', {
        yx_free_text_0: '页面曝光',
        yx_app_terminal: 1,
      });
      this.relateClueDialogVisible = true;
    },
    async updateDetail(info = this.checkOption) {
      if (info.id) {
        // propCustomerInfo.id仅用来查询详情
        this.checkOption.id = info.id;
        this.checkOption.viewerId = info.viewerId;
        this.followInfo.id = info.id; // 跟进记录添加
        await this.getViewerInfo();
        if (this.currentTab === 2) {
          this.reSetListInfo();
          this.getActionList();
        }
        this.isReload = true;
      }
    },
    /**
     * 客户详情点击意向度打log
     * @author wuying
     * @date 2021-7-5
     */
    handleSelectIntention() {
      this.$utils.FdpLog('yx_khxqy', {
        yx_free_text_1: '修改意向度',
        yx_app_terminal: 1,
      });
    },
    /**
     * 修改意向度
     * @author lymn
     * @date 2020-09-28
     * @param {Number} intention 选中意向度的value值
     */
    async selectIntention(intention) {
      const { setTsClientIntention } = client;
      const [err, res] = await setTsClientIntention({
        cid: this.customerInfo.id,
        intention,
      });
      this.$utils.postMessage({
        type: err ? 'error' : 'success',
        message: err ? err.msg || '网络错误，请稍候重试' : '设置意向度成功',
      });
    },
    /**
     * 更新跟进阶段名称
     * @author lymn
     * @date 2020-09-29
     */
    setFollowStatusName(name) {
      this.followStatusName = name;
    },
    changeCustomerTab(tab) {
      if (!this.customerInfo.id) {
        // 用户信息未加载完成，不允许切换页签
        return;
      }
      this.$utils.FdpLog('yx_khxqy', {
        yx_free_text_0: tab.key,
        yx_app_terminal: 1,
      });
      switch (tab.value) {
        case 1:
          this.$utils.logDog('customList_changeCustomerTab1');
          break;
        case 2:
          this.$utils.logDog('customList_changeCustomerTab2');
          break;
        case 3:
          this.$utils.logDog('customList_changeCustomerTab3');
          this.$utils.logDog('customList_changeCustomerTab3_click');
          break;
      }
      this.currentTab = tab.value;
    },
    showTagSelectDialog() {
      this.selectedTagList = [];
      if (Array.isArray(this.selectedGroupWithTagList)) {
        this.selectedGroupWithTagList.forEach(item => {
          if (Array.isArray(item.tag)) {
            item.tag.forEach(subItem => {
              this.selectedTagList.push(subItem);
            });
          }
        });
      }
      this.$utils.logDog('customerDetailDialog_showTagSelectDialog');
      this.$utils.FdpLog('yx_khxqy', {
        yx_free_text_1: '添加标签',
        yx_app_terminal: 1,
      });
      this.$utils.FdpLog('yx_khdbq', {
        yx_free_text_0: '打标签页曝光',
        yx_app_terminal: 1,
      });
      this.tagSelectDialogVisible = true;
    },
    /**
     * 详情弹窗获取标签
     * @author waldon
     * @date 2020/8/5
     * @param {Array} selectedTagContentList - 标签集合
     * @param {Array} selectedGroupWithTagList - 标签组集合
     */
    getSelectedTag(selectedTagContentList, selectedGroupWithTagList) {
      this.$utils.FdpLog('yx_khdbq', {
        yx_free_text_0: '成功打标签',
        yx_app_terminal: 1,
      });
      this.selectedTagList = selectedTagContentList;
      this.selectedGroupWithTagList = selectedGroupWithTagList;
      this.customerInfo.labelIdJson = JSON.stringify(this.selectedTagList);
      this.setClientTagList(this.customerInfo);
    },
    /**
     * 单独保存标签的接口
     * @author waldon
     * @date 2020/8/5
     * @param {Object} customerInfo
     */
    async setClientTagList(customerInfo) {
      const { setTsClientTagRelList } = client;
      const [err, res] = await setTsClientTagRelList({
        id: customerInfo.id,
        labelIdJson: customerInfo.labelIdJson,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.isReload = true;
    },
    changeDate() {
      this.$utils.logDog('customerDetailDialog_changeDate');
      this.$utils.FdpLog('yx_xgj', {
        yx_free_text_0: '成功选择跟进时间',
        yx_app_terminal: 1,
      });
    },
    /**
     * 选择上传组件
     * @author han
     * @date 2021-03-21
     * @param {String} type
     */
    showUpload(type) {
      this.isShowPopover = false;
      this.accptType = type;
      this.tanshuFileSelectUploadVisible = true;
    },
    uploadSuccess(file) {
      this.successUpLoadList.push(...file);
    },
    fileUploadSuccess() {
      this.$utils.FdpLog('yx_xgj', {
        yx_free_text_0: this.selecttingType === 'img' ? '成功上传图片' : '成功上传文件',
        yx_app_terminal: 1,
      });
    },
    removeFile(index) {
      if (this.successUpLoadList[index].success) {
        confirm('确认删除吗').then(() => {
          this.successUpLoadList.splice(index, 1);
        });
      } else {
        this.successUpLoadList.splice(index, 1);
      }
    },
    async addTsClientVisits() {
      this.$utils.logDog('customList_addTsClientVisits');
      this.$utils.FdpLog('yx_khxqy', {
        yx_free_text_1: '添加跟进',
        yx_app_terminal: 1,
      });
      if (!this.followInfo.remark) {
        return this.$utils.postMessage({
          type: 'error',
          message: '您还未输入跟进内容',
        });
      }
      this.followInfo.idList = JSON.stringify(this.successUpLoadList.map(item => item.id));
      const { addTsVisitRecord } = client;
      const [err, res] = await addTsVisitRecord(merge({}, this.followInfo));
      if (err) {
        if (err.rt === 6004) {
          postLimitVer('当前版本单个客户可录入回访记录数量已达到上限', 0, 2);
        } else {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
        }
        return Promise.reject(err);
      }
      this.reSetListInfo();
      this.actionList = await this.getFollowList();
      this.successUpLoadList = [];
      this.followInfo = {
        id: '',
        visitsTime: '',
        remark: '',
        idList: [],
      };
      this.isReload = true;
      this.$utils.FdpLog('yx_xgj', {
        yx_free_text_0: '成功写跟进',
        yx_app_terminal: 1,
      });
    },
    /**
     * 获取下一页
     * @author waldon
     * @date 2020-07-06
     */
    async getNextPage() {
      if (this.currentTab === 1) return;
      if (this.pages.maxPage > this.pages.pageNow) {
        this.pages.pageNow++;
        if (this.currentTab === 3) {
          // 跟进记录
          const list = await this.getFollowList();
          this.actionList = this.actionList.concat(list);
        } else {
          this.getActionList();
        }
      }
    },
    /**
     * 详情翻页
     * @author waldon
     * @date 2020-05-09
     * @param {Boolean} type - true 下一页, false 上一页
     */
    goNextPage(type) {
      this.$utils.logDog(type ? 'customList_goNextPage' : 'customList_goPrePage');

      let message = '';
      if (this.customerList.length <= 1) {
        message = '当前页仅有一条数据';
      }
      if (!type && this.hasNext === 'noPrev') {
        message = '这是当前页第一条数据';
      }
      if (type && this.hasNext === 'noNext') {
        message = '这是当前页最后一条数据';
      }
      if (message) {
        return this.$utils.postMessage({
          type: 'warning',
          message,
        });
      }
      this.restart();
      this.reSetListInfo();
      this.pages.pageNow = 1;
      this.subSliderVal = 1;
      this.isFollow = false;
      this.currentTab = 1;
      this.followInfo = {
        id: '',
        visitsTime: '',
        remark: '',
      };
      const currentNum = type ? 1 : -1;
      const currentIndex = this.customerList.findIndex(item => this.customerInfo.id === item.id);
      const currentCustomer = this.customerList.find((item, index) => index === currentIndex + currentNum);
      this.checkOption.id = currentCustomer.id;
      this.checkOption.viewerId = currentCustomer.viewerId;
      this.followInfo.id = currentCustomer.id; // 跟进记录添加
      this.getViewerInfo();
    },
    restart() {
      this.subSliderVal = 0;
      this.checkOption.date = 0;
      this.checkOption.isGetAll = true;
    },
    /**
     * 重置查询列表
     * @author waldon
     * @date 2020-07-06
     */
    reSetListInfo() {
      this.actionList = [];
      this.pages = {
        pageNow: 1,
        limit: 10,
        maxPage: 2,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/components/base/ts-clue-detail-dialog/common.scss';

.customer-detail-dialog {
  .container {
    height: 390px;
  }

  .info-part {
    padding: 20px 20px 10px 20px;
    border-bottom: 1px solid $color-ee;
  }

  .info-title {
    margin-bottom: 8px;
    color: $color-00;
  }

  .info-content {
    @include flex-wrap;
  }

  .add-tag-btn {
    width: 40px;
    height: 26px;
    min-width: auto;
    margin-left: 30px;
    background-color: $color-f7;
    border: 1px solid $color-ee;
    border-radius: 4px;

    ::v-deep .icon {
      margin: 0 !important;
      color: $color-b2;
    }
  }

  .customer-tag {
    @include flex-top-left;

    width: 100%;

    .group-name {
      @include ellipsis;

      width: 70px;
      height: 26px;
      margin-right: 20px;
      line-height: 26px;
    }

    .group-label {
      margin: 0 10px 10px 0;
    }
  }

  .field-item {
    width: 30%;
    margin-top: 7px;
    margin-right: 3%;
    font-size: 12px;
    line-height: 18px;
    color: $color-53;
    word-wrap: break-word;

    &.rowBox {
      width: 100%;
    }

    .title {
      word-break: keep-all;
    }

    .content {
      word-break: break-all;
    }
  }

  .group-info {
    margin-top: 7px;

    .group-owner {
      color: $color-b2;
    }
  }

  .follow-box {
    padding: 20px;
    border-bottom: 1px solid $color-ee;
  }

  .follow-operate {
    @include flex-between;

    margin-top: 10px;
  }

  .select-box {
    @include flex-center;

    .add-file-btn {
      @include flex-center;

      width: 40px;
      height: 40px;
      margin-left: 10px;
      cursor: pointer;
      border: 1px solid $color-da;
      border-radius: 4px;
      box-sizing: border-box;

      &:hover {
        color: $primary-color;
        border-color: $primary-color;
      }
    }

    .uopload-item {
      position: relative;
      width: 40px;
      height: 40px;
      margin-left: 10px;
      overflow: hidden;
      cursor: pointer;
      border-radius: 4px;

      &:hover {
        .gray-mask {
          visibility: visible;
        }
      }

      img {
        width: 40px;
        height: 40px;
      }

      .gray-mask {
        @include flex-center;

        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        visibility: hidden;
      }
    }
  }

  .clue {
    height: 390px;
  }
}

.select-doc {
  height: 34px;
  font-size: 14px;
  line-height: 34px;
  color: $color-53;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: $background-color;
  }
}
</style>
<style lang="scss">
.el-popover.customer-detail {
  padding: 4px 0;
}
</style>
