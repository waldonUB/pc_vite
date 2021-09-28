<!--
 * @Description  : 客户录入/客户编辑
 * @Author       : turbo
 * @Date         : 2021-07-01 17:51:54
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-14 12:06:09
-->

<template>
  <div class="customer-edit">
    <global-ts-card-box>
      <template #card-box-head>
        <global-ts-tabguide @backToPrePage="backToPrePage(true)">
          <template #leftPart>客户列表</template>
          <template #rightPart>{{ isAddType ? '客户录入' : '客户编辑' }}</template>
        </global-ts-tabguide>
      </template>
      <template #card-box-body>
        <fa-form-model
          ref="customerForm"
          layout="vertical"
          :model="editAccountInfo"
          :rules="rules"
          @validate="validate"
        >
          <div class="base-info">
            <div class="base-title">个人信息</div>
            <div class="base-content">
              <fa-form-model-item class="input-item" label="姓名" prop="contacts">
                <global-ts-input
                  size="large"
                  placeholder="请输入姓名"
                  :max-length="25"
                  v-model="editAccountInfo.contacts"
                  @click.native="$utils.logDog('customOperate_contacts')"
                ></global-ts-input>
              </fa-form-model-item>
              <fa-form-model-item v-if="systemFieldAbleConf.sex" class="input-item" label="性别">
                <fa-radio-group v-model="editAccountInfo.sex" @change="$utils.logDog('customOperate_changeSex')">
                  <fa-radio v-for="(item, index) in sexList" :key="index" :value="item.value">
                    {{ item.label }}
                  </fa-radio>
                </fa-radio-group>
              </fa-form-model-item>
              <fa-form-model-item
                class="input-item"
                label="手机"
                :validate-status="haveMobileErr ? 'error' : 'success'"
              >
                <global-ts-input
                  size="large"
                  limit-type="int"
                  placeholder="请输入手机"
                  :disabled="!isAddType && !!initMobile"
                  :max-length="25"
                  v-model="editAccountInfo.mobile"
                  @click.native="$utils.logDog('customOperate_phone')"
                ></global-ts-input>
                <template v-if="haveMobileErr" #help>{{ mobileErrTip }}</template>
              </fa-form-model-item>
              <fa-form-model-item v-if="systemFieldAbleConf.birthday" class="input-item" label="生日">
                <el-date-picker
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="请输入生日"
                  v-model="editAccountInfo.birthday"
                  @click.native="$utils.logDog('customOperate_birthday')"
                ></el-date-picker>
              </fa-form-model-item>
              <fa-form-model-item v-if="systemFieldAbleConf.wx" class="input-item" label="微信">
                <global-ts-input
                  size="large"
                  placeholder="请输入微信"
                  :max-length="25"
                  v-model="editAccountInfo.wx"
                  @click.native="$utils.logDog('customOperate_wx')"
                ></global-ts-input>
              </fa-form-model-item>
              <fa-form-model-item v-if="systemFieldAbleConf.qq" class="input-item" label="QQ">
                <global-ts-input
                  size="large"
                  limit-type="int"
                  placeholder="请输入QQ"
                  :max-length="25"
                  v-model="editAccountInfo.qq"
                  @click.native="$utils.logDog('customOperate_qq')"
                ></global-ts-input>
              </fa-form-model-item>
              <fa-form-model-item v-if="systemFieldAbleConf.idCard" class="input-item" label="证件号">
                <global-ts-input
                  size="large"
                  limit-type="idCard"
                  placeholder="请输入证件号"
                  :max-length="25"
                  v-model="editAccountInfo.idCard"
                  @click.native="$utils.logDog('customOperate_idCard')"
                ></global-ts-input>
              </fa-form-model-item>
              <fa-form-model-item
                :class="{ 'input-item': item.fieldType !== 2, 'textarea-item': item.fieldType === 2 }"
                v-for="item in personFieldsListTemp"
                :key="item.id"
                :label="item.name"
              >
                <edit-fields
                  fields-list-name="personFieldsList"
                  :item="item"
                  @change="handleEditFieldsChange"
                ></edit-fields>
              </fa-form-model-item>
            </div>
          </div>
          <div class="base-info special">
            <div class="base-title">客户标签</div>
            <div class="base-content">
              <div class="customer-tag-title">
                <span class="text">客户标签</span>
                <global-ts-svg-icon
                  name="icon-icon-11"
                  color="#b2b2b2"
                  :size="16"
                  @click="showTagSelectDialog"
                ></global-ts-svg-icon>
                <router-link
                  v-if="isManage"
                  to="/tagManage"
                  target="_blank"
                  @click.native="$utils.logDog('customOperate_tagManage')"
                >
                  <global-ts-svg-icon name="icon-shezhi" color="#b2b2b2" :size="14"></global-ts-svg-icon>
                </router-link>
              </div>
              <div class="customer-tag-list">
                <div class="customer-tag" v-for="item of selectedGroupWithTagList" :key="item.id">
                  <div class="group-name">{{ item.name }}</div>
                  <ts-wxtag class="group-label" type="selected" v-for="subItem of item.tag" :key="subItem.id">
                    {{ subItem.name }}
                  </ts-wxtag>
                </div>
              </div>
            </div>
          </div>
          <div v-if="isShowOtherInfo" class="base-info">
            <div class="base-title">其他信息</div>
            <div class="base-content">
              <fa-form-model-item v-if="systemFieldAbleConf.corpName" class="input-item" label="企业">
                <global-ts-input
                  size="large"
                  placeholder="请输入企业"
                  :max-length="25"
                  v-model="editAccountInfo.corpName"
                  @click.native="$utils.logDog('customOperate_corpName')"
                ></global-ts-input>
              </fa-form-model-item>
              <fa-form-model-item v-if="systemFieldAbleConf.industry" class="input-item" label="行业">
                <global-ts-select
                  type="large"
                  placeholder="请选择"
                  :show-placeholder="editAccountInfo.industry === ''"
                  :list="industryList"
                  :selectkey="{ label: 'value', value: 'key' }"
                  v-model="editAccountInfo.industry"
                  @click.native="$utils.logDog('customOperate_industry')"
                ></global-ts-select>
              </fa-form-model-item>
              <fa-form-model-item v-if="systemFieldAbleConf.position" class="input-item" label="职位">
                <global-ts-input
                  size="large"
                  placeholder="请输入职位"
                  :max-length="25"
                  v-model="editAccountInfo.position"
                ></global-ts-input>
              </fa-form-model-item>
              <fa-form-model-item v-if="systemFieldAbleConf.customersWay" class="input-item" label="获客方式">
                <global-ts-select
                  type="large"
                  placeholder="请选择"
                  :show-placeholder="editAccountInfo.customersWay === -1"
                  :list="customersWayList"
                  :selectkey="{ label: 'value', value: 'key' }"
                  v-model="editAccountInfo.customersWay"
                  @click.native="$utils.logDog('customOperate_source')"
                ></global-ts-select>
              </fa-form-model-item>
              <fa-form-model-item v-if="systemFieldAbleConf.area" class="input-item" label="区域">
                <fa-cascader
                  size="large"
                  placeholder="选择地区"
                  :field-names="cascaderProps"
                  :options="addressDefList"
                  :change-on-select="true"
                  :allow-clear="false"
                  v-model="editAccountInfo.region"
                  @change="changeArea"
                >
                  <template #suffixIcon>
                    <global-ts-svg-icon
                      class="area-icon"
                      name="icon-xialakuangjiantou"
                      :width="10"
                      :height="6"
                    ></global-ts-svg-icon>
                  </template>
                </fa-cascader>
              </fa-form-model-item>
              <fa-form-model-item v-if="systemFieldAbleConf.address" class="input-item" label="地址">
                <global-ts-input
                  size="large"
                  placeholder="请输入地址"
                  :max-length="50"
                  v-model="editAccountInfo.address"
                  @click.native="$utils.logDog('customOperate_address')"
                ></global-ts-input>
              </fa-form-model-item>
              <fa-form-model-item
                :class="{ 'input-item': item.fieldType !== 2, 'textarea-item': item.fieldType === 2 }"
                v-for="item in otherFieldsListTemp"
                :key="item.id"
                :label="item.name"
              >
                <edit-fields
                  fields-list-name="otherFieldsList"
                  :item="item"
                  @change="handleEditFieldsChange"
                ></edit-fields>
              </fa-form-model-item>
              <fa-form-model-item v-if="systemFieldAbleConf.remark" class="textarea-item" label="备注">
                <fa-textarea
                  placeholder="请输入备注"
                  :max-length="100"
                  :rows="4"
                  v-model="editAccountInfo.remark"
                  @click.native="$utils.logDog('customOperate_remark')"
                ></fa-textarea>
              </fa-form-model-item>
              <fa-form-model-item
                class="textarea-item"
                v-for="item in otherLongFieldsListTemp"
                :key="item.id"
                :label="item.name"
              >
                <edit-fields
                  fields-list-name="otherLongFieldsList"
                  :item="item"
                  @change="handleEditFieldsChange"
                ></edit-fields>
              </fa-form-model-item>
            </div>
          </div>
          <div
            v-if="(isManage && editAccountInfo.isDepStaff) || isAddType || (!isAddType && !isAssist)"
            class="base-info"
          >
            <div class="base-title">销售信息</div>
            <div class="base-content">
              <fa-form-model-item v-if="isManage && isNoOneSelfDataAuth" class="input-item" label="跟进人">
                <ts-search-tree
                  bind-class="large"
                  :permissions="permissions"
                  :disabled="!isManage"
                  :is-worker="true"
                  :select-value.sync="sidName"
                  @select="selectSalers"
                  @click="$utils.logDog('customOperate_worker')"
                ></ts-search-tree>
              </fa-form-model-item>
              <fa-form-model-item v-if="isManage && sidName" class="input-item" label="客户关联时间">
                <el-date-picker
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :disabled="isAddType"
                  :editable="false"
                  :clearable="false"
                  v-model="editAccountInfo.salesRelTime"
                >
                </el-date-picker>
              </fa-form-model-item>
              <fa-form-model-item
                v-if="(isManage && editAccountInfo.isDepStaff) || isAddType || (!isAddType && !isAssist)"
                class="input-item"
                label="协助人"
              >
                <fa-select
                  size="large"
                  mode="multiple"
                  placeholder="请选择协助人"
                  :default-active-first-option="false"
                  :open="canOpenSelect"
                  :class="{ disabled: selectDisabled }"
                  :filter-option="assistantFilter"
                  v-model="editAccountInfo.assistSidList"
                  @click.native="handlerSelectClick"
                >
                  <fa-select-option
                    v-for="item in workIdList"
                    :key="item.sid"
                    :disabled="item.sid === editAccountInfo.sid"
                  >
                    {{ item.name }}
                  </fa-select-option>
                </fa-select>
              </fa-form-model-item>
            </div>
          </div>
        </fa-form-model>
      </template>
      <template #card-box-bottom>
        <global-ts-button type="primary" size="medium" :disabled="hasErr || haveMobileErr" @click="saveCustom">
          {{ isAddType ? '添加' : '保存' }}
        </global-ts-button>
        <global-ts-button
          v-if="showDeleteCustomBtn"
          type="others"
          size="medium"
          icon="icon-icon-10"
          @click="deleteCustom"
        >
          删除
        </global-ts-button>
      </template>
    </global-ts-card-box>
    <ts-tag-select-dialog
      :selected-tag-list="selectedTagList"
      :dialog-visible.sync="tagSelectDialogVisible"
      @getSelectedTag="getSelectedTag"
    ></ts-tag-select-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import { merge } from 'lodash';

// components
import EditFields from './edit-fields.vue';
import TsWxtag from '@/components/base/ts-wxtag/index.vue';
import TsSearchTree from '@/components/base/ts-search-tree/index.vue';
import TsTagSelectDialog from '@/components/base/ts-tag-select-dialog/index.vue';

// utils
import {
  getAddressList,
  getTsClientDef,
  getWorkerList,
  tagGroupToTagList,
  confirm,
  getLimitTips,
  postLimitVer,
} from '@/utils';

// api
import { client } from '@/api';

export default {
  name: 'CustomerEdit',
  components: { EditFields, TsWxtag, TsSearchTree, TsTagSelectDialog },
  props: {
    isManage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isAddType: false,
      hasErr: false,
      haveMobileErr: false,
      mobileErrTip: '',
      editAccountInfo: {
        cid: -1,
        contacts: '', // 联系人
        mobile: '', // 联系手机
        qq: '', // 联系QQ
        source: -1, // 来源
        sourceName: '',
        province: -1, // 省份
        city: -1, // 城市
        address: '', // 地址
        idCard: '', // 身份证
        sid: -99, // 跟进人Id
        salesRelTime: new Date(),
        labelId: -1, // 标签
        remark: '', // 备注
        labelIdJson: '',
        sex: '',
        wx: '',
        birthday: '',
        corpName: '',
        industry: '',
        customersWay: -1,
        dataSourceName: '',
        viewerId: 0,
        position: '',
        wxWorkRemark: {},
        assistInfo: {},
        assistSidList: [],
        region: [],
        isDepStaff: false, // 判断当前客户的销售是否操作员部门下面的员工，或者是同个部门的员工
      },
      cloneEditAccountInfo: {}, // 仅用于重置editAccountInfo
      rules: {
        contacts: [{ required: true, message: '请输入姓名' }],
      },
      sexList: [
        {
          label: '男',
          value: 1,
        },
        {
          label: '女',
          value: 2,
        },
      ],
      cascaderProps: {
        // 级联字段定义
        value: 'name',
        label: 'name',
        children: 'subList',
      },
      initSid: '', // 初始跟进人
      sidName: '',
      initMobile: '',
      selectedTagList: [],
      selectedGroupWithTagList: [],
      tagSelectDialogVisible: false,
      permissions: this.$route.meta.permissionsKey, // 功能权限 - 客户
      isShowOtherInfo: false, // 其他信息
      personFieldsList: [],
      otherFieldsList: [],
      otherLongFieldsList: [],
      systemFieldAbleConf: {}, // 系统字段是否显示
      industryList: [],
      customersWayList: [],
      addressDefList: [],
      workIdList: [],
      assistList: [], // 协助人列表，包括workId、sid、name
      maxAssistantNum: 20, // 协助人最大选择个数
    };
  },
  computed: {
    ...mapGetters({
      isUpperAdm: 'user/isUpperAdm',
      isNoOneSelfDataAuth: 'user/isNoOneSelfDataAuth',
    }),
    personFieldsListTemp() {
      return this.personFieldsList.filter(item => item.unable === 0);
    },
    otherFieldsListTemp() {
      return this.otherFieldsList.filter(item => item.unable === 0);
    },
    otherLongFieldsListTemp() {
      return this.otherLongFieldsList.filter(item => item.unable === 0);
    },
    /**
     * 当前登录的员工是否是某个客户的协助人
     * @author turbo
     * @date 2020-10-30
     */
    isAssist() {
      return this.editAccountInfo.assistInfo.isAssist;
    },
    /**
     * 能否展开select选择器
     * @author turbo
     * @date 2020-10-30
     */
    canOpenSelect() {
      return this.editAccountInfo.assistSidList.length >= this.maxAssistantNum ? false : undefined;
    },
    /**
     * 是否禁用select选择器
     * @author turbo
     * @date 2020-10-30
     */
    selectDisabled() {
      return this.editAccountInfo.assistSidList.length >= this.maxAssistantNum;
    },
    /**
     * 是否显示删除用户按钮
     * @author: ADI
     * @Date: 2021-03-01 09:37:10
     * @return {Boolean}
     */
    showDeleteCustomBtn() {
      return this.editAccountInfo.dataSource === 1 && this.isUpperAdm;
    },
  },
  watch: {
    /**
     * 跟进人改变时要去掉其协助人的身份
     * @author turbo
     * @date 2020-10-30
     */
    'editAccountInfo.sid'(newValue) {
      this.editAccountInfo.assistSidList = this.editAccountInfo.assistSidList.filter(sid => sid != newValue);
      if ((this.isAddType || this.initMobile === '') && this.editAccountInfo.mobile !== '') {
        this.checkClientMobile();
      }
    },
    'editAccountInfo.mobile'(newValue) {
      if (this.editAccountInfo.mobile === '') {
        this.haveMobileErr = false;
      } else if (
        (this.isAddType || (this.editAccountInfo.mobile !== '' && this.initMobile === '')) &&
        newValue.length >= 6 &&
        newValue.length <= 25
      ) {
        this.checkClientMobile();
      }
    },
  },
  created() {
    this.$pubsub.emit('editCustomer', async (isAddType, editId) => {
      this.isAddType = isAddType;
      this.editAccountInfo.sid = this.isManage ? -99 : this.$store.state.user.info.sid;
      this.sidName = this.$store.state.user.info.staffInfo?.name;
      this.$utils.logDog(isAddType ? 'show_customOperate' : 'show_editCustomOperate');

      this.cloneEditAccountInfo = {
        ...this.editAccountInfo,
      };
      this.addressDefList = await getAddressList(); // 获取省市区数据
      const [workList] = await getWorkerList({ isForGetAssistantList: true, permissions: this.permissions });
      this.workIdList = workList.filter(item => [1, 2, 3, 4].includes(item.workId)); // 2021年1月12日 waldon modify 在原来1 2 3的基础上加个4，自定义角色

      if (!isAddType) {
        this.getTsClient(editId);
      } else {
        this.initClientData();
      }
    });
  },
  methods: {
    async getTsClient(cid) {
      const { getTsClient } = client;
      const [err, res] = await getTsClient({
        cid,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const data = res.data;
      this.editAccountInfo = merge(
        {},
        {
          ...this.cloneEditAccountInfo,
        },
        data,
      );
      // 重置 省市区['','','']空数据
      this.editAccountInfo.region.join('') === '' && (this.editAccountInfo.region = []);
      this.editAccountInfo.cid = cid;
      this.initSid = this.editAccountInfo.sid;
      this.initMobile = this.editAccountInfo.mobile;
      this.sidName = this.editAccountInfo.staffName;
      this.editAccountInfo.salesRelTime &&
        (this.editAccountInfo.salesRelTime = new Date(this.editAccountInfo.salesRelTime));
      this.editAccountInfo.birthday && (this.editAccountInfo.birthday = new Date(this.editAccountInfo.birthday));
      this.selectedGroupWithTagList = this.editAccountInfo.clientTagList;
      this.editAccountInfo.labelIdJson = JSON.stringify(tagGroupToTagList(this.editAccountInfo.clientTagList));
      // 自定义字段部分，turbo 2021-7-6 modify，下面的 initClientData 也会重置这个 systemFieldAbleConf 字段，没必要在这里先重置
      // this.systemFieldAbleConf = this.editAccountInfo.systemFieldAbleConf;
      this.initField(this.editAccountInfo.crmFieldDataList);
      // 协助人sid列表
      this.editAccountInfo.assistSidList = data.assistInfo.assistList.map(item =>
        [1, 2, 3].includes(item.workId) ? item.sid : item.name,
      );
      this.assistList = data.assistInfo.assistList;
      this.initClientData();
    },
    async initClientData() {
      const { systemFieldAbleConf, customersWay, industry, crmFieldDataList } = await getTsClientDef(true);
      this.systemFieldAbleConf = systemFieldAbleConf;
      this.customersWayList = customersWay;
      this.industryList = industry;
      this.isAddType && this.initField(crmFieldDataList);
    },
    initField(crmFieldDataList) {
      const personLongFiledList = [];
      const otherKeyList = ['corpName', 'industry', 'position', 'area', 'address', 'remark', 'customersWay'];
      this.isShowOtherInfo = otherKeyList.some(item => this.systemFieldAbleConf[item]);
      for (const item of crmFieldDataList) {
        if (item.fieldType === 6) {
          const value = [];
          for (const optionItem of item.optionList) {
            if (item.value.indexOf(optionItem.id) !== -1) {
              value.push(optionItem.id);
            }
          }
          item.value = value;
        }
        if (item.groupId === 0) {
          if (item.fieldType !== 2) {
            this.personFieldsList.push(item); // 个人信息
          } else {
            personLongFiledList.push(item);
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
    },
    /**
     * 返回客户列表页
     * @date 2020-09-09
     * @param {Boolean} isGuideBack 是否通过点击返回键返回的
     */
    backToPrePage(isGuideBack) {
      const isUpdate = !isGuideBack && this.isAddType; // 是否需要初始化刷新，一般用于添加客户返回客户列表时
      this.$emit('backToPrePage', isUpdate);
    },
    validate() {
      this.hasErr = this.$refs.customerForm?.fields?.some(field => field.validateState === 'error');
    },
    handleEditFieldsChange(fieldsListName, itemTemp) {
      this[fieldsListName]?.forEach(item => {
        item.id === itemTemp.id && (item.value = itemTemp.value);
      });
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
      this.$utils.logDog('customOperate_showTagSelectDialog');
      this.$utils.FdpLog('yx_khdbq', {
        yx_free_text_0: '打标签页曝光',
        yx_app_terminal: 1,
      });
      this.tagSelectDialogVisible = true;
    },
    /**
     * 编辑客户获取标签
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
      this.editAccountInfo.labelIdJson = JSON.stringify(this.selectedTagList);
    },
    /**
     * 改变地区
     * @author waldon
     * @date 2020/8/12
     * @param {Array} selectedArea - 选择的省/市/区
     */
    changeArea(selectedArea) {
      if (selectedArea.length === 0 || selectedArea.length > 2) return;
      this.$utils.logDog('customOperate_province');
      selectedArea.length === 2 && this.$utils.logDog('customOperate_city');
    },
    /**
     * 选择跟进人
     * @author guoyijie
     * @date 2020/8/14
     */
    selectSalers(value) {
      this.editAccountInfo.sid = value.sid;
      this.sidName = value.name;
    },
    /**
     * 协助人多选框搜索
     * @author turbo
     * @date 2021-1-21
     */
    assistantFilter(inputValue, options) {
      return this.workIdList.filter(item => item.sid == options.key)[0].name.includes(inputValue);
    },
    /**
     * 处理下拉多选框聚焦
     * @author turbo
     * @date 2020-10-30
     */
    handlerSelectClick() {
      this.editAccountInfo.assistSidList.length >= this.maxAssistantNum &&
        this.$utils.postMessage({
          type: 'error',
          message: `协助人最多仅允许选择${this.maxAssistantNum}个`,
        });
    },
    /**
     * @description : 手机号需要检验的情况
     *                1、添加客户（满6-25位，跟进人变化）
     *                2、编辑客户（初始手机为空然后输入满11位，跟进人变化）
     */
    async checkClientMobile() {
      const reg = new RegExp(/^\d{6,25}$/);
      if (!reg.test(this.editAccountInfo.mobile)) {
        this.haveMobileErr = true;
        this.mobileErrTip = '手机号只允许6-25位数字';
      } else {
        const { checkClientMobile } = client;
        const [err] = await checkClientMobile({
          mobile: this.editAccountInfo.mobile,
          sid: this.editAccountInfo.sid,
          id: this.editAccountInfo.id || 0,
        });
        if (err) {
          this.haveMobileErr = true;
          this.mobileErrTip = err.msg;
        } else {
          this.haveMobileErr = false;
        }
      }
    },
    /**
     * 检查跟进人是否更改
     * @author lymn
     * @date 2020-07-06
     * @returns {Promise}
     */
    checkOperateWorker() {
      return new Promise((resolve, reject) => {
        if (this.initSid !== this.editAccountInfo.sid || this.isAddType) {
          // 编辑客户或新增客户时，跟进人选项变化
          let msg = '';
          if (this.editAccountInfo.sid === 0) {
            msg = '确定将该客户的跟进人置为“无”，且清空所有协助人吗？';
          } else if (!this.isAddType) {
            msg = '确认更换该客户的跟进人吗';
          }
          // let msg = this.editAccountInfo.sid == 0 ? "确认将该客户的跟进人设置为“无”吗" : "确认更换该客户的跟进人吗";
          if (msg) {
            confirm(msg, '提示').then(action => {
              resolve(action === 'confirm');
            });
          } else {
            resolve(true);
          }
        } else {
          if (this.editAccountInfo.sid === 0 && this.editAccountInfo.assistSidList.length > 0) {
            this.$utils.postMessage({
              type: 'error',
              message: '当前客户暂无跟进人跟进，无法指派协助人',
            });
            return reject(false);
          }
          // 未更改
          resolve(true);
        }
      });
    },
    filterEditInfo() {
      const editInfo = Object.assign({}, this.editAccountInfo);
      return new Promise(resolve => {
        editInfo.salesRelTime = moment(editInfo.salesRelTime).format('yyyy-MM-DD HH:mm:ss');
        editInfo.crmFieldDataList = JSON.stringify(
          []
            .concat(this.personFieldsList)
            .concat(this.otherFieldsList)
            .concat(this.otherLongFieldsList),
        );
        const assistSidList = editInfo.assistSidList.map(sid => {
          if (typeof sid === 'string') {
            let tmpSid;
            for (let i = 0; i < this.assistList.length; i++) {
              const item = this.assistList[i];
              if (item.name === sid && item.workId === 0 && !item.hasFind) {
                item.hasFind = true;
                tmpSid = item.sid;
                break;
              }
            }
            return tmpSid;
          } else {
            return sid;
          }
        });
        editInfo.assistSidList = JSON.stringify(assistSidList);
        // 格式化省市区数据
        editInfo.region = editInfo.region.join(',');
        resolve(editInfo);
      });
    },
    async saveCustom() {
      const valid = await this.$refs.customerForm.validate();
      if (!valid) return;

      if (this.isAddType) {
        if (this.editAccountInfo.mobile) {
          const reg = new RegExp(/^\d{6,25}$/);
          this.haveMobileErr = !reg.test(this.editAccountInfo.mobile);
          this.mobileErrTip = '手机号只允许6-25位数字';
          if (this.haveMobileErr) return;
        }
      }

      const canSubmit = await this.checkOperateWorker();
      if (!canSubmit) return;

      const editInfo = await this.filterEditInfo();

      const { addTsClient, setTsClient } = client;
      if (this.isAddType) {
        if (editInfo.sid <= 0) {
          delete editInfo.salesRelTime;
        }
        if (!editInfo.province) {
          // 对后端返回的 undefined 暂时做兼容处理
          editInfo.province = '';
          editInfo.city = ''; // 对 city == -1 的情况做兼容处理
        }
        if (!editInfo.city) {
          editInfo.city = '';
        }
        const assistSidListParam = editInfo.assistSidList ? JSON.parse(editInfo.assistSidList).join() : '';

        const [err, res] = await addTsClient(
          merge({}, editInfo, {
            assistSidList: assistSidListParam,
            labelIdList: editInfo.labelIdJson,
            customersWay: editInfo.customersWay || 0,
          }),
        );
        if (err) {
          return getLimitTips('clientAdd').then(info => {
            if (err.rt === info.rt) {
              postLimitVer(info.msg, 0, 1);
            } else {
              this.$utils.postMessage({
                type: 'error',
                message: err.msg || '网络错误，请稍候重试',
              });
            }
          });
        }
        this.$utils.postMessage({
          type: 'success',
          message: res.msg || '添加成功',
        });
        this.$utils.logDog('customOperate_addEmployee');
        this.$utils.ActLog('ADD_CLIENT');
        this.$utils.FdpLog('yx_lrkh', {
          // 客户管理，录入成功上报
          yx_free_text_0: '手动录入',
          yx_app_terminal: 1,
        });
        this.backToPrePage();
      } else {
        const [err, res] = await setTsClient(editInfo);
        this.$utils.postMessage({
          type: err ? 'error' : 'success',
          message: err ? err.msg || '网络错误，请稍候重试' : res.msg || '修改成功',
        });
        if (!err) {
          this.$utils.FdpLog('yx_bjkh', {
            yx_free_text_0: '编辑成功',
            yx_app_terminal: 1,
          });
          this.backToPrePage();
        }
      }
    },
    deleteCustom() {
      confirm('确认删除客户？', '删除客户').then(async action => {
        if (action == 'confirm') {
          const { delTsClient } = client;
          const [err, res] = await delTsClient({
            cid: this.editAccountInfo.cid,
          });
          this.$utils.postMessage({
            type: err ? 'error' : 'success',
            message: err ? err.msg || '网络错误，请稍候重试' : res.msg || '修改成功',
          });
          if (!err) {
            this.$utils.logDog('customOperate_deleteCustom');
            this.backToPrePage();
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.customer-edit {
  position: relative;
  width: 100%;
  height: 100%;

  .base-info {
    @include flex-top-left;

    &:not(:last-child) {
      border-bottom: 1px solid $color-ee;
    }

    &.special {
      padding-bottom: 30px;

      .base-content {
        @include flex-column;
      }
    }

    padding: 40px 40px 10px;
  }

  .base-title {
    width: 163px;
    font-weight: bold;
  }

  .base-content {
    @include flex-wrap;

    width: 770px;
  }

  .input-item {
    width: 350px;

    &:nth-child(odd) {
      margin-right: 69px;
    }

    .fa-radio-group {
      @include flex-left;

      height: 40px;

      ::v-deep {
        .fa-radio-wrapper {
          line-height: 18px;
        }
      }
    }

    .el-date-editor {
      width: 350px;
    }
  }

  .textarea-item {
    width: 770px;
    margin-bottom: 30px;
  }

  .customer-tag-title {
    margin-bottom: 15px;

    .text {
      margin-right: 33px;
    }

    .ts-svg-icon {
      margin-right: 12px;
      cursor: pointer;
    }
  }

  .customer-tag {
    @include flex-top-left;

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

  .area-icon {
    margin-top: -3px;
  }

  .ts-search-tree {
    ::v-deep input {
      height: 40px;
    }
  }
}
</style>
