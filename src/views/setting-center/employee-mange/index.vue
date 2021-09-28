<!--
 * @Description  : 成员管理
 * @Author       : turbo
 * @Date         : 2021-03-30 15:48:29
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-26 15:16:05
-->

<template>
  <div class="employeeMange" ref="contentBox">
    <ts-corp-top-tip v-show="showType === 1" from-page="成员管理"></ts-corp-top-tip>
    <div :class="'employeeList ' + hasCompanyTree" v-if="showType == 1" ref="hasCompanyTreeWrap">
      <global-ts-header>
        <template v-slot:leftPart>成员管理</template>
        <template v-slot:rightPart>
          <global-ts-tool-tips class="item" effect="dark" content="" placement="top">
            <div slot="content">
              <a :href="upgradeUrl" style="color: #ffffff;" target="_blank">立即扩容</a>
            </div>
            <div class="hasStaffNumber">
              剩余成员坐席数：<span :class="{ redColor: availWorkCnt <= 0 }">{{ availWorkCntNumber }}</span>
            </div>
          </global-ts-tool-tips>
          <global-ts-button
            v-if="isUpperAdm"
            class="rightPartBtn"
            type="primary"
            size="small"
            @click="openSyncWxCorpCustomer"
            >导入企微成员
          </global-ts-button>
          <global-ts-button
            class="em_header_addEm"
            type="primary"
            size="small"
            icon="icon-icon-11"
            @click="newAddEmpoyee"
            >创建成员
          </global-ts-button>
        </template>
      </global-ts-header>
      <div :class="'content ' + hasCompanyTree">
        <div class="leftContent" v-if="isUpperAdm" :style="leftContentHeight">
          <ts-company-all-list
            v-if="isGetAll"
            ref="companyList"
            bindClass="companyList"
            :hasOperate="true"
            :showCompanyName="false"
            :operateVisible.sync="operateVisible"
            :needStaff="false"
            :needCorp="true"
            :showHighlightCurrent="true"
            popperClass="setDepartment"
            placement="bottom-start"
            @handleCurrentChange="changeStaffData"
            :updateTree.sync="updateTree"
          >
            <template v-slot:popoverDialog="{ data }">
              <div class="operateWrap">
                <template v-for="(item, index) in operateList">
                  <p
                    :key="index"
                    v-if="!(data.data.id == 0 && item.type === 'del') && !(data.data.level >= 4 && item.type === 'add')"
                    @click="openNameDialog(item.type, data)"
                  >
                    {{ item.name }}
                  </p>
                </template>
              </div>
            </template>
          </ts-company-all-list>

          <ts-company-list
            v-else
            ref="companyList"
            bindClass="companyList"
            :hasOperate="true"
            :showCompanyName="false"
            :operateVisible.sync="operateVisible"
            :needStaff="false"
            :needCorp="true"
            :showHighlightCurrent="true"
            popperClass="setDepartment"
            placement="bottom-start"
            @handleCurrentChange="changeStaffData"
            :updateTree.sync="updateTree"
          >
            <template v-slot:popoverDialog="{ data }">
              <div class="operateWrap">
                <template v-for="(item, index) in operateList">
                  <p
                    :key="index"
                    v-if="!(data.data.id == 0 && item.type === 'del') && !(data.data.level >= 4 && item.type === 'add')"
                    @click="openNameDialog(item.type, data)"
                  >
                    {{ item.name }}
                  </p>
                </template>
              </div>
            </template>
          </ts-company-list>
        </div>
        <div class="rightContent">
          <div :class="'pro_listBox ' + tableBoxClass" ref="tableBox">
            <div class="pro_line">
              <global-ts-select
                class="typeList"
                style="width: 160px;"
                :list="jobIdList"
                v-model="selectWorkKey"
                :selectkey="{ label: 'roleName', value: 'key' }"
              >
              </global-ts-select>
              <global-ts-input
                style="width: 160px;"
                v-model="requestParam.sacct"
                placeholder="成员帐号/姓名"
                @keyup.enter.native="searchInfo"
              >
              </global-ts-input>
              <global-ts-button class="searchBtn" type="primary" size="small" icon="icon-icon-4" @click="searchInfo">
                搜索
              </global-ts-button>
              <global-ts-button class="setWorkRoom" type="primary" size="small" @click="setWorkRoom">
                {{ this.showSelect ? '点击设置部门' : '批量设置部门' }}
              </global-ts-button>
              <global-ts-button
                v-if="isManage"
                class="sameMargin"
                type="primary"
                size="small"
                icon="icon-daochu"
                ref="button"
                @click="onExportExcel"
                >导出
              </global-ts-button>
            </div>
            <div class="em_body">
              <el-table
                class="tshu-tableset"
                :data="myData"
                ref="manageTable"
                border
                header-row-class-name="employeeHeader"
                cell-class-name="cellStyle"
                @selection-change="handleSelectionChange"
              >
                <el-table-column v-if="showSelect" type="selection" width="55" :selectable="selectable">
                </el-table-column>
                <el-table-column prop="sacct" label="成员帐号"> </el-table-column>
                <el-table-column prop="name" label="姓名">
                  <template slot-scope="scope">
                    {{ $utils.showStaffName(tsStaffExtraList, scope.row.sid, scope.row.name) }}
                  </template>
                </el-table-column>
                <el-table-column prop="workIdName" label="角色">
                  <template slot-scope="scope">
                    <span class="unbindWX notAllow" v-if="scope.row.creator">{{ scope.row.workIdName }}</span>
                    <span v-else class="text_but1 unbindWX" @click="openChangeWork(scope.row)">
                      {{ scope.row.workIdName }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="dept" label="部门" min-width="100px">
                  <template slot-scope="scope">
                    <span class="text_but1 unbindWX" @click="setSingleWorkRoom(scope.row)">{{
                      getDeptName(scope.row.dept)
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="userId" label="绑定企微" min-width="100px">
                  <template slot-scope="scope">
                    <span class="text_but1 unbindWX" v-if="scope.row.isBindWxWork" @click="unBindWxWork(scope.row.sid)">
                      {{ scope.row.wxWorkName + '（' + scope.row.userId + '）' }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="绑定微信" min-width="80px">
                  <template slot-scope="scope">
                    <span
                      class="text_but1 unbindWX"
                      v-if="scope.row.isBindApp"
                      @click="unbindWX(scope.row.sid, 'openId')"
                    >
                      已绑定
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="80px">
                  <template slot-scope="scope">
                    <div class="bottomBar">
                      <span
                        class="text_but1 edit_span"
                        @click="editAccount(scope.row.sid, scope.row.creator, scope.row)"
                        :class="getIsdisabled(scope.row.sid, scope.row.creator, scope.row)"
                      >
                        编辑
                      </span>
                      <global-ts-button
                        class="text_but1 em_delete"
                        :disabled="getDeleteClass(scope.row.sid, scope.row.creator, scope.row.isUpperAdm)"
                        type="default"
                        size="mini"
                        @click="deleteAccountInTable(scope.row.sid, scope.row.creator, scope.row.isUpperAdm)"
                        :ref="'button' + scope.row.id"
                      >
                        删除
                      </global-ts-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <global-ts-pagination
                :tableData="myData"
                :isReload.sync="isReload"
                :requestParam="requestParam"
                @getData="changeTable"
                :selectPage="selectPage"
                :httpurl="ajaxUrl"
              >
              </global-ts-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>

    <global-ts-card-box v-if="showType == 2" class="editEmployee">
      <template v-slot:card-box-head>
        <global-ts-tabguide @backToPrePage="backManage">
          <template v-slot:leftPart>成员管理</template>
          <template v-slot:rightPart>{{ isAddType ? '成员添加' : '成员编辑' }}</template>
        </global-ts-tabguide>
      </template>
      <template v-slot:card-box-body>
        <fa-form-model ref="linkEditRuleForm" layout="vertical" :model="accountInfo" :rules="rules">
          <div class="AccountInfo topAccountInfo">
            <div class="account_1">
              <div class="account_title">帐号</div>
            </div>
            <div class="account_2">
              <div class="accountName">
                <div class="account">
                  <fa-form-model-item label="帐号" prop="sacct">
                    <global-ts-input
                      class="accountName"
                      v-model="accountInfo.sacct"
                      placeholder="请输入帐号"
                      :disabled="!isAddType"
                      :maxLength="20"
                    >
                    </global-ts-input>
                  </fa-form-model-item>
                </div>
                <div class="youName" v-if="isManage">
                  <fa-form-model-item label="姓名" prop="name">
                    <global-ts-input
                      class="accountName"
                      :maxLength="15"
                      v-model="accountInfo.name"
                      placeholder="请输入真实姓名"
                    >
                    </global-ts-input>
                  </fa-form-model-item>
                </div>
              </div>
              <div class="nameAndword">
                <div class="youName" v-if="!isManage">
                  <fa-form-model-item label="姓名" prop="name">
                    <global-ts-input class="accountName" v-model="accountInfo.name" placeholder="请输入真实姓名">
                    </global-ts-input>
                  </fa-form-model-item>
                </div>
                <div class="department" v-if="isManage">
                  <fa-form-model-item label="部门" prop="selectedOrgData">
                    <ts-select-list
                      :width="350"
                      :bindClass="departmentErrorClass"
                      :disabled="!isUpperAdm && isEditMyself ? 'disabled' : ''"
                      class="departmentSelect "
                      :selectType="2"
                      :needStaff="false"
                      :isNecessary="true"
                      :check-strictly="true"
                      defaultTip="请输入部门"
                      :depIdList.sync="accountInfo.depIdList"
                      :selectedOrgData.sync="accountInfo.selectedOrgData"
                      @select="formSelectedOrgDataItemSelect"
                    >
                      <template v-slot:errorTip>
                        <global-ts-input class="errorTip hideInput" v-model="accountInfo.depIdList"> </global-ts-input>
                      </template>
                    </ts-select-list>
                  </fa-form-model-item>
                </div>
                <div class="profession">
                  <fa-form-model-item
                    prop="workId"
                    :rules="customWorkIdRule.length ? customWorkIdRule : rules['workId']"
                  >
                    <template #label>
                      <div class="redSnowFlower roleBox">
                        角色
                        <div class="hasStaffNumber">
                          剩余成员坐席数：<span :class="{ redColor: availWorkCnt <= 0 }">{{ availWorkCntNumber }}</span>
                        </div>
                      </div>
                    </template>

                    <global-ts-select
                      placeholder="请选择"
                      type="large"
                      :disabled="accountInfo.creator || isEditMyself ? 'disabled' : ''"
                      :list="workIdList"
                      v-model="selectWorkKey_edit"
                      :selectkey="{ label: 'roleName', value: 'key' }"
                      @change="changeAvailWork"
                    >
                    </global-ts-select>
                  </fa-form-model-item>
                </div>
              </div>
              <div class="nameAndSure" v-if="isAddType">
                <div class="password">
                  <fa-form-model-item :label="!checkIsShowReset ? '密码' : ''" prop="pwd">
                    <global-ts-input
                      :maxLength="20"
                      type="password"
                      v-if="isShowPassword"
                      v-model="accountInfo.pwd"
                      placeholder="请输入密码"
                    >
                    </global-ts-input>
                  </fa-form-model-item>
                </div>
                <div class="surePaswword" v-if="isShowPassword">
                  <fa-form-model-item label="密码确认" prop="$surepwd">
                    <global-ts-input
                      :maxLength="20"
                      type="password"
                      v-model="accountInfo.$surepwd"
                      placeholder="请再次输入密码"
                    >
                    </global-ts-input>
                  </fa-form-model-item>
                </div>
              </div>
            </div>
          </div>
          <div class="AccountInfo middleAccountInfo" v-if="accountInfo.workId === 2 && isShowEmployee">
            <div class="account_1">
              <div class="account_title">分佣设置</div>
            </div>
            <div class="account_2">
              <div class="payAndtype">
                <div class="isPayment">
                  <fa-form-model-item label="是否分佣" :required="true">
                    <div class="radioBox">
                      <span v-for="(item, index) in allotBkgeList" :key="index">
                        <input
                          v-model="accountInfo.allotBkge"
                          type="radio"
                          :id="'allotBkge' + index"
                          name="testOne"
                          :value="item.key"
                          @change="isCommision"
                        />
                        <label :for="'allotBkge' + index">{{ item.value }}</label>
                      </span>
                    </div>
                  </fa-form-model-item>
                </div>
                <div class="payType" v-if="accountInfo.allotBkge == 1">
                  <fa-form-model-item label="分佣类型" :required="true">
                    <div class="payBoxer">
                      <span v-for="(item, index) in bkgeTypeList" :key="index">
                        <input
                          v-model="accountInfo.bkgeType"
                          type="radio"
                          :id="'bkgeType' + index"
                          name="bkgeTypeType"
                          :value="item.key"
                        />
                        <label :for="'bkgeType' + index">{{ item.value }}</label>
                      </span>
                    </div>
                  </fa-form-model-item>
                </div>
              </div>
              <div class="stableMoney" v-show="accountInfo.allotBkge == 1 && accountInfo.bkgeType == 1">
                <div class="moneyPay" v-if="accountInfo.allotBkge == 1 && accountInfo.bkgeType == 1">
                  <fa-form-model-item label="固定佣金" prop="fixedBkge">
                    <global-ts-input
                      class="accountName stablePercent"
                      v-model="accountInfo.fixedBkge"
                      limitInput="decimal"
                      placeholder="请填写金额（限两位小数）"
                    >
                      <template v-slot:suffix>
                        <span class="fixPay">元</span>
                      </template>
                    </global-ts-input>
                  </fa-form-model-item>
                </div>
              </div>
              <div class="payPercent" v-if="accountInfo.allotBkge == 1 && accountInfo.bkgeType == 2">
                <div class="buyPercent">
                  <fa-form-model-item label="新购比例" prop="firstBuyRatio">
                    <global-ts-input
                      class="accountName newBuyPercent"
                      v-model="accountInfo.firstBuyRatio"
                      limitInput="int"
                      placeholder="请填写整数"
                    >
                      <template v-slot:suffix>
                        <span class="newPay">%</span>
                      </template>
                    </global-ts-input>
                  </fa-form-model-item>
                </div>
                <div class="onlinePay">
                  <fa-form-model-item label="续费比例" prop="repeatBuyRatio">
                    <global-ts-input
                      class="accountName continuePercent"
                      v-model="accountInfo.repeatBuyRatio"
                      limitInput="int"
                      placeholder="请填写整数"
                    >
                      <template v-slot:suffix>
                        <span class="continuePay">%</span>
                      </template>
                    </global-ts-input>
                  </fa-form-model-item>
                </div>
              </div>
            </div>
          </div>
        </fa-form-model>
      </template>
      <template v-slot:card-box-bottom>
        <div class="bottomBtn">
          <div v-if="isAddType" class="bottomBar">
            <global-ts-button class="em_add_emp" type="primary" size="medium" @click="addEmployee">
              添加
            </global-ts-button>
          </div>
          <div v-else class="bottomBar">
            <global-ts-button class="em_save_emp" type="primary" size="medium" @click="saveEmployee">
              保存
            </global-ts-button>
            <global-ts-button
              class="bottomBar__del"
              type="others"
              size="medium"
              icon="icon-icon-10"
              :disabled="getIsCanDeleteInEdit"
              @click="deleteEmployee"
              >删除
            </global-ts-button>
          </div>
        </div>
      </template>
    </global-ts-card-box>

    <ts-sync-wx-corp-customer-dialog
      :isSetPwd.sync="isSetPwd"
      :pwd="initPwd"
      @sure="confirmSyncWxCorp"
      @syncWxWorkUserSuccess="syncWxWorkUserSuccess"
      :dialogVisible.sync="syncWxCorpCustomerDialogVisible"
    >
    </ts-sync-wx-corp-customer-dialog>

    <changeWorkDialog
      :initSelectId="currentRowData.key"
      :workList="workIdList"
      @sure="changeWorkSuccess"
      :dialogVisible.sync="changeWorkDialogVisible"
    >
    </changeWorkDialog>

    <setPwdDialog @sure="setPwdSuccess" :dialogVisible.sync="setPwdDialogVisible"> </setPwdDialog>
    <setDepartmentDialog :isGetAll="isGetAll" ref="departmentDialog" @updateTree="upTree"> </setDepartmentDialog>

    <ts-select-list-dialog
      :dialogVisible.sync="selectDialogVisible"
      dialogTitle="设置所在部门"
      :selectType="2"
      :isNecessary="true"
      :selectedOrgData="singleSelectedOrgData"
      :needUpdate="true"
      :needStaff="false"
      :check-strictly="true"
      @getSelectedData="addDepStaffRel"
    >
    </ts-select-list-dialog>
  </div>
</template>

<script>
import TsSelectList from '@/components/base/ts-select-list/index.vue';
import TsSelectListDialog from '@/components/base/ts-select-list-dialog/index.vue';
import TsSyncWxCorpCustomerDialog from '@/components/base/ts-sync-wx-corp-customer-dialog/index.vue';
import TsCompanyList from '@/components/base/ts-company-list/index.vue';
import TsCorpTopTip from '@/components/base/ts-corp-top-tip/index.vue';
import TsCompanyAllList from '@/components/base/ts-company-all-list/index.vue';
import changeWorkDialog from './components/change-work-dialog/index.vue';
import setPwdDialog from '@/components/base/ts-set-pwd-dialog/index.vue';
import setDepartmentDialog from './components/set-department-dialog/index.vue';
import { mapGetters, mapState } from 'vuex';
import {
  confirm,
  filterData,
  gotoWxCorpSet,
  exportExcel,
  manageRegxp,
  getWxWorkConfInfo,
  md5,
  getLimitTips,
  postLimitVer,
} from '@/utils';
import versionDef from '@/config/version-def';
import {
  getDepartmentList,
  getTsStaffListisTsCorp,
  setTsStaffWork,
  getStaffDefList,
  setTsStaff,
  addTsStaff,
  unbind,
  getStaffWorkCnt,
  getTsStaff,
  tsStaff_h,
  delDepartment,
  batchAddDepStaffRel,
} from '@/api/modules/views/setting-center/employee-mange';

export default {
  name: 'employeeMange',
  components: {
    changeWorkDialog,
    setPwdDialog,
    setDepartmentDialog,
    TsCorpTopTip,
    TsCompanyAllList,
    TsCompanyList,
    TsSyncWxCorpCustomerDialog,
    TsSelectListDialog,
    TsSelectList,
  },
  data() {
    return {
      myData: [],
      ajaxUrl: '/ajax/staff/tsStaff_h.jsp?cmd=getTsStaffList&isTsCorp=true', //请求数据的ajax接口
      isReload: false, //是否重新load一次当前页面
      showType: 1, //当前展示的页面是哪一个，1表示成员管理,2表示编辑成员页面。若是功能复杂在考虑嵌套路由
      isAddType: false, //标记是否为新增成员
      resetCodeStatus: 1, //标记重置密码的状态
      isEditMyself: false, //是否编辑自身
      help_pw: [],
      accountInfo: {},
      selectWorkKey_edit: '0-0', // 编辑状态下的workKey
      workIdList: [], //角色Id列表
      allotBkgeList: [], //分配情况下拉列表
      bkgeTypeList: [], //分配类型下拉列表
      isBindWxWork: false, // 是否绑定了企微
      jobList: [
        {
          key: '',
          workId: -1,
          roleName: '全部角色',
        },
      ],
      selectWorkKey: '', // 选择的角色key
      requestParam: {
        name: '',
        workId: -1,
        roleId: -1,
        sacct: '',
        depId: 0,
      },
      selectPage: [
        {
          value: 10,
          label: 10,
        },
        {
          value: 50,
          label: 50,
        },
      ],
      syncWxCorpCustomerDialogVisible: false,
      currentRowData: {}, // 当前行数据
      changeWorkDialogVisible: false,
      setPwdDialogVisible: false,
      isSetPwd: false, // 是否设置密码
      initPwd: '', // 初始化的密码
      isShowType: '',
      showSelect: false, // 是否展示表格的复选框
      selectList: [], // 勾选了成员list
      selectIdList: [], // 勾选了表格的成员Id集合
      operateList: [
        {
          type: 'add',
          name: '添加子部门',
        },
        {
          type: 'modify',
          name: '修改名称',
        },
        {
          type: 'del',
          name: '删除',
        },
      ],
      operateVisible: false,
      selectDialogVisible: false, // 是否展示选择成员/部门组件
      departmentErrorClass: '',
      singleSelectedOrgData: {
        // 单选设置部门
        dept: [], // 已选择的部门信息
        staff: [], // 已选择的成员信息
      },
      updateTree: false, // 是否刷新树
      leftContentHeight: '',
      tableBoxClass: '',
      isGetAll: true,
      availWorkCnt: '',
      customWorkIdRule: [], // 自定义规则
      customAccountRule: [], // 自定义规则
    };
  },
  computed: {
    ...mapGetters({
      isManage: 'user/isManage',
      isUpperAdm: 'user/isUpperAdm',
      isDepartmentAdm: 'user/isDepartmentAdm',
    }),
    ...mapState({
      isOem: state => state.user.info.isOem,
      upgradeUrl: state => state.globalData.addressUrl?.updateVersionUrl,
      availWorkCntComputed: state => state.globalData?.availWorkCnt,
      isCreator: state => state.user.info?.staffInfo?.creator,
      isShowEmployee: state => state.user.info?.isOpenCrmOrder,
      tsStaffExtraList: state => state.user.tsStaffExtraList,
      userInfo: state => state.user.info,
    }),
    jobIdList() {
      return this.jobList.concat(this.workIdList);
    },
    availWorkCntNumber() {
      return this.availWorkCnt <= 0 ? 0 : this.availWorkCnt;
    },
    checkSamePwd() {
      this.checkPassWord();
      return this.accountInfo.pwd == this.accountInfo.$surepwd;
    },
    checkIsShowReset() {
      return this.showType == 2 && !this.isAddType;
    },
    isShowPassword() {
      if (this.showType == 2) {
        if (this.isAddType) {
          return true;
        } else {
          return this.resetCodeStatus == 2;
        }
      } else {
        // adi add
        return false;
      }
    },
    getIsCanDeleteInEdit() {
      return !this.getIsCanDeleteAccount(this.accountInfo.sid, this.accountInfo.creator, this.accountInfo.isUpperAdm);
    },
    hasCompanyTree() {
      return this.isUpperAdm ? 'hasCompanyTree' : '';
    },
    rules() {
      return {
        //帐号
        sacct: [
          { required: true, message: '请输入帐号', trigger: 'change' },
          { min: 1, max: 20, message: '帐号由1-20个字符组成（字母或数字；首字为字母）', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (!manageRegxp(1).test(value)) {
                callback(new Error('帐号由1-20个字符组成（字母或数字；首字为字母）'));
              } else {
                callback();
              }
            },
            trigger: 'change',
          },
        ],
        //姓名
        name: [
          { required: true, message: '请输入姓名', trigger: 'change' },
          { min: 1, max: 15, message: '姓名不能超过15个字', trigger: 'change' },
        ],
        //密码
        pwd: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, max: 20, message: '密码由6-20位字符组成，区分大小写', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (!manageRegxp(2).test(value)) {
                callback(new Error('密码强度过于简单，请重新设置'));
              } else {
                callback();
              }
            },
            trigger: 'change',
          },
        ],
        //确认密码
        $surepwd: [
          { required: true, message: '请输入确认密码', trigger: 'change' },
          { min: 6, max: 20, message: '密码由6-20位字符组成，区分大小写', trigger: 'change' },
          {
            validator: this.validatorSurePassword,
            trigger: 'change',
          },
        ],
        //新购比例
        firstBuyRatio: [
          { required: true, message: '请输入新购比例', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (!manageRegxp(10).test(value)) {
                callback(new Error('新购比例请填写1-100的整数'));
              } else {
                callback();
              }
            },
            trigger: 'change',
          },
        ],
        //续费比例
        repeatBuyRatio: [
          { required: true, message: '请输入续费比例', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (!manageRegxp(10).test(value)) {
                callback(new Error('续费比例请填写1-100的整数'));
              } else {
                callback();
              }
            },
            trigger: 'change',
          },
        ],
        //固定佣金
        fixedBkge: [
          { required: true, message: '请输入固定佣金', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              console.log('manageRegxp(9)', manageRegxp(9), value);
              if (!manageRegxp(9).test(value)) {
                callback(new Error('佣金不能为0'));
              } else {
                callback();
              }
            },
            trigger: 'change',
          },
          {
            validator: (rule, value, callback) => {
              if (!manageRegxp(4).test(value)) {
                callback(new Error('固定佣金请填写正数（最多含两位小数）'));
              } else {
                callback();
              }
            },
            trigger: 'change',
          },
          {
            validator: (rule, value, callback) => {
              const num = Number(value) || 0;
              console.log('num', num);
              if (num < 1 || num > 9999999.99) {
                callback(new Error('请输入正数（1-9999999.99）'));
              } else {
                callback();
              }
            },
            trigger: 'change',
          },
        ],
        // phone: [
        //   { required: true, message: '请输入联系手机', trigger: 'change' },
        //   {
        //     validator: (rule, value, callback) => {
        //       if (!manageRegxp(7).test(value)) {
        //         callback(new Error('请输入正确的联系手机'));
        //       } else {
        //         callback();
        //       }
        //     },
        //     trigger: 'change',
        //   },
        // ],
        // 部门
        selectedOrgData: [
          { required: true, message: '请选择部门', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              const hasData = value?.dept?.length;
              console.log('selectedOrgData', value, hasData);
              if (!hasData) {
                callback(new Error('请选择部门'));
              } else {
                callback();
              }
            },
            trigger: 'change',
          },
        ],
        // 角色
        workId: [
          {
            required: true,
            message: '请选择角色',
            trigger: 'change',
            transform: value => {
              return String(value);
            },
          },
          {
            validator: (rule, value, callback) => {
              console.log('value', value);
              // 没选择是 -1 ， 选择后是 [0, *)
              if (value < 0) {
                callback(new Error('请选择角色'));
              } else {
                callback();
              }
            },
            trigger: 'change',
          },
        ],
      };
    },
  },
  watch: {
    'selectDialogVisible'(nVal) {
      if (!nVal) {
        // 关闭弹窗时，重置
        this.finishWorkRoom();
      }
    },
    'accountInfo.depIdList'(nVal, oVal) {
      if (this.isUpperAdm && nVal) {
        this.departmentErrorClass = '';
      }
    },
    'selectWorkKey'(newVal) {
      this.setWorkId(newVal, this.requestParam);
    },
    'selectWorkKey_edit'(newVal) {
      console.log('newVal', newVal);
      this.setWorkId(newVal, this.accountInfo);
    },
  },
  created() {
    this.availWorkCnt = this.availWorkCntComputed;
    console.log('test');
    this.getStaffWorkCnt();
    this.getDefList();
    this.getDepNum();
    this.$utils.logDog('showEmployeeMange');
    //enter
    var _self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key === 13) {
        _self.searchInfo();
      }
    };
    getWxWorkConfInfo().then(info => {
      this.isShowType = !info.wxWorkChannelListConf.available ? 1 : 2;
    });
  },
  mounted() {},
  methods: {
    /**
     * 设置workId
     * @author waldon
     * @date 2021/1/8
     * @param {String} newVal - workKey
     * @param {Object} rowData - 当前对象
     */
    setWorkId(newVal, rowData) {
      if (newVal) {
        const [workId, roleId] = newVal.split('-');
        rowData.workId = Number(workId);
        rowData.roleId = Number(roleId);
      } else {
        rowData.workId = -1;
        rowData.roleId = -1;
      }
    },
    async getDepNum() {
      const [err, res] = await getDepartmentList(
        Object.assign({ needStaff: false }, { needCorp: true }, { isWorker: true }),
      );
      if (err) {
        return Promise.reject(err);
      }
      this.isGetAll = res.data.needLoadAll;
    },
    /**
     * 设置密码成功回调
     * @author waldon
     * @date 2020/7/23
     * @param {*} pwd - 设置的密码
     */
    setPwdSuccess(pwd) {
      this.initPwd = pwd;
      this.isSetPwd = true;
      setTimeout(() => {
        // 企微同步接口存在延迟，1s后再更新
        this.isReload = true;
        this.getStaffWorkCnt(); // 重新查询坐席数
        this.$store.dispatch('user/getTsStaffExtraListByParam'); // 刷新有职务角色列表
      }, 1000);
    },
    /**
     * 导出成员管理信息
     * @author han
     * @date 2021-01-04
     */
    async onExportExcel() {
      const keyJson = {
        sacct: '成员账号',
        name: '姓名',
        workIdName: '角色',
        getDeptName: '部门',
        userId: '绑定企微',
        isBindApp: '绑定微信',
      };
      const [err, response] = await getTsStaffListisTsCorp({ ...this.requestParam, ...{ limit: 20000 } });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      let excelList = response.data;
      excelList = excelList.map(item => {
        item.getDeptName = item.dept.map(item => item.name).join(',');
        item.isBindApp = item.isBindApp ? '已绑定' : '';
        item.userId = item.userId ? `${item.wxWorkName}(${item.userId})` : '';
        console.log(item.userId);
        return item;
      });
      exportExcel(excelList, '成员管理', keyJson);
    },
    /**
     * 同步成功回调
     * @author waldon
     * @date 2020/7/23
     */
    syncWxWorkUserSuccess() {
      this.isSetPwd = false;
    },
    /**
     * 确定提交同步
     * @author waldon
     * @date 2020/7/23
     */
    confirmSyncWxCorp() {
      this.setPwdDialogVisible = true;
      this.$utils.FdpLog('yx_drqwcy'); // 导入企微成员
    },
    /**
     * 改变角色
     * @author waldon
     * @date 2020/7/22
     * @param {*} work -
     */
    async changeWorkSuccess(work) {
      this.setWorkId(work.key, { ...work });
      const params = {
        sid: this.currentRowData.sid,
        workId: work.workId,
        roleId: work.roleId,
      };
      const [err, res] = await setTsStaffWork(params);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.$utils.postMessage({
        type: 'success',
        message: res.msg || '操作成功',
      });
      this.isReload = true;
      this.getStaffWorkCnt(); // 重新查询坐席数
      this.$store.dispatch('user/getTsStaffExtraListByParam'); // 刷新有职务角色列表
    },
    /**
     * 打开角色选择对话框
     * @author waldon
     * @date 2020/7/22
     * @param {*} rowData -
     */
    openChangeWork(rowData) {
      this.currentRowData = { ...rowData };
      this.changeWorkDialogVisible = true;
    },
    /**
     * 打开企微同步对话框
     * @author waldon
     * @date 2020/7/21
     */
    openSyncWxCorpCustomer() {
      if (this.isShowType === 1) {
        this.$utils.FdpLog('yx_djqwkhtb', {
          yx_free_text_0: '提示未设置企微',
        });
        confirm('您还未完成企业微信相关信息设置，无法使用此功能', '通知', '去设置').then(() => {
          gotoWxCorpSet();
        });
        return;
      }
      this.syncWxCorpCustomerDialogVisible = true;
    },
    //创建者的这个成员不能随意让别人编辑,必须是创建者自己才能编, 新增如果是部门管理员不能编辑超级管理员的角色
    getIsdisabled(id, isCreator, rowData) {
      if ((isCreator && !this.isCreator) || (this.isDepartmentAdm && rowData.isUpperAdm)) {
        return 'disabled';
      }
      return '';
    },
    /**
     * 搜索成员
     *
     * @author guoyijie
     * @date 2020-04-18
     */
    searchInfo() {
      this.isReload = true;
    },
    //获取是否可以删除当前帐号
    getIsCanDeleteAccount(sid, isCreator, isUpperAdm) {
      //创建者帐号不可删除
      if (isCreator) {
        return false;
      }
      //不能删除自己的帐号
      if (sid == this.userInfo.staffInfo.sid) {
        return false;
      }

      // 部门管理员无法删除超级管理员的账号
      if (this.isDepartmentAdm && isUpperAdm) {
        return false;
      }

      return true;
    },
    //表格里面的删除的类
    getDeleteClass(sid, isCreator, isUpperAdm) {
      if (!this.getIsCanDeleteAccount(sid, isCreator, isUpperAdm)) {
        return true;
      }
      return false;
    },
    checkPassWord() {
      return new Promise(resolve => {
        // if (this.accountInfo.pwd != this.accountInfo.$surepwd) {
        //   this.checkRules.defindErrType.surePassword = 1;
        // }
        // if (this.accountInfo.fixedBkge > 9999999.99) {
        //   this.checkRules.defindErrType.fixedBkge = 3;
        // }
        // this.$nextTick(resolve);
        if (this.accountInfo.pwd != this.accountInfo.$surepwd) {
          this.$utils.postMessage({
            type: 'error',
            message: '确认密码为空',
          });
        } else if (this.accountInfo.fixedBkge > 9999999.99) {
          this.$utils.postMessage({
            type: 'error',
            message: '请输入正数（1-9999999.99）',
          });
        }
        this.$nextTick(resolve);
      });
    },
    //获取相关下拉列表
    async getDefList() {
      const [err, response] = await getStaffDefList();
      if (err) {
        return Promise.reject(err);
      }
      this.workIdList = response.data.workIdList;
      this.allotBkgeList = response.data.allotBkgeList;
      this.bkgeTypeList = response.data.bkgeTypeList;
      return Promise.resolve(response);
    },
    //返回编辑或新添成员的数据格式
    getTrueData() {
      var filterArray = ['sacct', 'sid', 'name', 'workId', 'roleId', 'depIdList'];
      //如果没有修改密码，则不用传修改密码过去
      if ((this.isShowPassword && this.resetCodeStatus == 2) || this.isAddType) {
        filterArray.push('pwd');
      }
      //如果是管理员的话 去掉分佣设置
      if (this.accountInfo.workId != 1) {
        filterArray.push('allotBkge');
        //如果是可以分佣的话
        if (this.accountInfo.allotBkge == 1) {
          filterArray.push('bkgeType');
          //如果是固定分佣
          if (this.accountInfo.bkgeType == 1) {
            this.isShowEmployee && filterArray.push('fixedBkge');
          } else {
            //如果是按比例分佣
            filterArray.push('firstBuyRatio');
            filterArray.push('repeatBuyRatio');
          }
        }
      }
      !this.isShowEmployee && (this.accountInfo.allotBkge = 2);
      var employData = filterData(this.accountInfo, filterArray);
      if (typeof employData.pwd !== 'undefined') {
        employData.pwd = md5(employData.pwd);
      }
      return employData;
    },
    //确定编辑成员
    saveEmployee() {
      this.$refs.linkEditRuleForm.validate(async valid => {
        if (!valid) {
          // 检查是否有错误
          return;
        }
        const employData = this.getTrueData();
        const [err, response] = await setTsStaff(employData);
        if (err) {
          getLimitTips('workAdd').then(info => {
            if (err.rt == info.rt) {
              this.customCheckWorkIdRule();
              const version = this.userInfo.versionInfo.version;
              //免费版/个人版
              if (
                version == 0 ||
                version == versionDef.NotDirectVersionDef.VersionList.PERSON ||
                version == versionDef.DirectVersionDef.VersionList.FREETRY
              ) {
                postLimitVer(info.msg, 0, 1);
              } else {
                postLimitVer(info.msg, 1); //传入参数1，表示扩容
              }
              return;
            }
            // this.checkRules.defindErrType.account = 2;
            this.$utils.postMessage({
              type: 'error',
              message: err.msg || '网络错误，请稍候重试',
            });
          });
          return Promise.reject(err);
        }
        this.$utils.postMessage({
          type: 'success',
          message: '修改成功！',
        });
        this.isReload = true;
        this.showType = 1;
        this.resetCodeStatus = 1;
        this.availWorkCnt = response.data.availWorkCnt;
        this.$utils.FdpLog('yx_ygbj'); // 成员编辑
        this.$store.dispatch('user/getTsStaffExtraListByParam'); // 刷新有职务角色列表
      });
    },
    //确定删除成员
    deleteEmployee() {
      this.deleteAccount(this.accountInfo.sid).then(() => {
        this.isReload = true;
        this.showType = 1;
      });
    },
    //确定添加成员
    async addEmployee() {
      this.$refs.linkEditRuleForm.validate(async valid => {
        if (!valid) {
          // 检查是否有错误
          return;
        }
        const acountInfo = this.getTrueData();
        const [err, response] = await addTsStaff(acountInfo);
        if (err) {
          getLimitTips('workAdd').then(info => {
            if (err.rt == info.rt) {
              this.customCheckWorkIdRule();
              const version = this.userInfo.versionInfo.version;
              //免费版/个人版
              if (
                versionDef.checkIsFree() ||
                version == versionDef.NotDirectVersionDef.VersionList.PERSON ||
                version == versionDef.DirectVersionDef.VersionList.FREETRY
              ) {
                postLimitVer(info.msg, 0, 1);
              } else {
                postLimitVer(info.msg, 1); //传入参数1，表示扩容
              }
              return;
            }
            // this.checkRules.defindErrType.account = 2;
            this.$utils.postMessage({
              type: 'error',
              message: err.msg || '网络错误，请稍候重试',
            });
          });
          return Promise.reject(err);
        }
        this.$utils.logDog('addEmployee');
        this.$utils.postMessage({
          type: 'success',
          message: '添加成功',
        });
        this.isReload = true;
        this.showType = 1;
        this.availWorkCnt = response.data.availWorkCnt;
        this.$utils.FdpLog('yx_ygbj'); // 成员编辑
        this.$store.dispatch('user/getTsStaffExtraListByParam'); // 刷新有职务角色列表
      });
    },
    //添加成员操作
    newAddEmployee() {
      this.showType = 2;
    },
    //打开新添成员页面
    newAddEmpoyee() {
      this.$utils.logDog('newAddEmpoyee');
      this.isEditMyself = false;
      this.setTableCover();
      this.isAddType = true;
      this.selectWorkKey_edit = '0-0';
      this.newAddEmployee();
    },
    unbindWX(sid, type) {
      this.$utils.logDog('employee_unbindWX');
      let connent = `确认解绑${type == 'openId' ? '小程序' : '公众号'}？`; // 默认分销 旧逻辑
      if (!this.isOem) {
        connent = '点击【确定】按钮解绑，解绑后，如需便捷登录，需重新绑定'; // 直销
      }
      confirm(connent, '解绑确认').then(async () => {
        const [err, response] = await unbind({
          sid: sid,
          type: type,
        });
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        const myList = [].concat(this.myData);
        myList.forEach(ele => {
          if (ele.sid == sid) {
            ele.isBindApp = false;
          }
        });
        this.myData = [...myList];
        this.$utils.postMessage({
          type: 'success',
          message: '解绑成功！',
        });
      });
    },
    async getStaffWorkCnt() {
      const [err, response] = await getStaffWorkCnt();
      if (err) {
        return Promise.reject(err);
      }
      this.availWorkCnt = response.data.availWorkCnt;
    },
    //编辑成员操作，传入成员Id
    async editAccount(id, isCreator, rowData) {
      if ((isCreator && !this.userInfo.staffInfo.creator) || (this.isDepartmentAdm && rowData.isUpperAdm)) return;
      this.$utils.logDog('employee_editAccount');
      this.isEditMyself = this.isManage && id == this.userInfo.staffInfo.sid;
      this.isAddType = false;
      const [err, response] = await getTsStaff({
        sid: id,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.setTableCover();
      const accountInfoData = response.data;
      if (accountInfoData.depIdList) {
        accountInfoData.depIdList = JSON.stringify(accountInfoData.depIdList);
      }
      // $.extend(this.accountInfo, accountInfoData); // adi change
      // 说明accountInfo是在点击编辑后才开始赋值的
      this.accountInfo = Object.assign({}, this.accountInfo, accountInfoData);
      this.selectWorkKey_edit = `${this.accountInfo.workId}-${this.accountInfo.roleId}`;
      this.newAddEmployee();
    },
    //回到编辑页
    backManage() {
      this.getStaffWorkCnt();
      this.isAddType = true;
      this.showType = 1;
      this.departmentErrorClass = '';
    },
    //table删除帐号
    deleteAccountInTable(id, isCreator, isUpperAdm) {
      if (isCreator || !this.getIsCanDeleteAccount(id, isCreator, isUpperAdm)) {
        return;
      }
      this.$utils.logDog('employee_delete');
      this.deleteAccount(id).then(() => {
        this.isReload = true;
      });
    },
    //删除成员
    deleteAccount(id) {
      return confirm('确认删除成员帐号？', '删除确认').then(async action => {
        if (action == 'confirm') {
          const [err, response] = await tsStaff_h({
            cmd: 'delTsStaff',
            sid: id,
          });
          if (err) {
            this.$utils.postMessage({
              type: 'error',
              message: err.msg,
            });
            return Promise.reject(err);
          }
          this.$utils.postMessage({
            type: 'success',
            message: '删除成功！',
          });
          this.availWorkCnt = response.data.availWorkCnt;
          return Promise.resolve();
        }
      });
    },
    resetPwd() {
      if (this.resetCodeStatus == 1) {
        this.resetCodeStatus = 2;
      } else {
        this.resetCodeStatus = 1;
      }
    },
    //使编辑里面的内容恢复
    setTableCover() {
      this.resetCodeStatus = 1;
      this.accountInfo = {
        sacct: '', //成员帐号
        name: '', //成员姓名
        depIdList: '', // 所属部门idList
        pwd: '', //密码
        $surepwd: '', //确认密码
        workId: 0, //角色Id
        allotBkge: 1, //是否分佣
        bkgeType: 1,
        firstBuyRatio: '', //新购分佣
        repeatBuyRatio: '', //续费分佣
        fixedBkge: '', //固定分佣
        creator: false, //是否是创建者,
        selectedOrgData: {
          dept: [],
          staff: [],
        }, // 选择的部门数据
      };
    },
    //是否改变分佣状态
    isCommision() {
      if (this.accountInfo.allotBkge == 1) {
        this.accountInfo.bkgeType = 1;
      }
    },
    // 解绑企微
    unBindWxWork(sid) {
      confirm('确定解绑企业微信？', '解绑确定').then(async () => {
        const [err, res] = await unbind({
          sid: sid,
          type: 'userId',
        });
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        const myList = [].concat(this.myData);
        myList.forEach(ele => {
          if (ele.sid == sid) {
            ele.isBindWxWork = false;
          }
        });
        this.myData = [...myList];
        this.$utils.postMessage({
          type: 'success',
          message: '解绑成功！',
        });
      });
    },
    // 获取数据
    changeTable(data) {
      this.myData = data;
      this.isBindWxWork = data.isBindWxWork;
      this.isUpperAdm &&
        this.$nextTick(() => {
          this.tableBoxClass = '';
          this.tableBoxClass = 'addHeight';
          const contentH = this.$refs.contentBox.offsetHeight;
          this.leftContentHeight = `min-height: ${contentH - 94}px;`;
          console.log('leftContentHeight', this.leftContentHeight);
        });
    },
    changeAvailWork(nVal, isInarray, oVal) {
      // global-ts-select selctId默认值 -99
      if (oVal == -99) return;
      if (oVal != 0 && nVal != 0) return;

      if (nVal) {
        this.availWorkCnt -= 1;
      } else {
        this.availWorkCnt += 1;
      }
    },
    /**
     * @description 当选择项发生变化时会触发回调函数
     * @author enson
     * @date 2020-08-24
     */
    handleSelectionChange() {
      this.selectList = [];
      this.selectIdList = [];
      this.selectList = this.$refs.manageTable.selection;
      this.selectList.forEach(item => {
        this.selectIdList.push(item.sid);
      });
      console.log('this.selectList', this.selectList);
    },
    /**
     * @description 判断表格的行是否能选择 超级管理员的选项不可以选择
     * @author enson
     * @date 2020-08-24
     * @param {*} row   - 行数据
     * @param {*} index - 坐标index
     */
    selectable(row, index) {
      return !row.creator;
    },
    /**
     * @description 显示添加子部门/修改部门名称弹窗
     * @author enson
     * @date 2020-08-25
     */
    openNameDialog(type, data) {
      if (!this.isUpperAdm) return;
      console.log(type, data);
      const departmentData = data;
      this.operateVisible = false; // 隐藏部门操作框
      const parent = this;
      switch (type) {
        case 'add': // 添加子部门
          this.$refs.departmentDialog.initDialog(true, false, departmentData, parent);
          break;
        case 'modify': // 修改部门名称
          this.$refs.departmentDialog.initDialog(true, true, departmentData, parent);
          break;
        case 'del': // 删除子部门
          this.delDepartment(departmentData);
          break;
      }
    },
    /**
     * @description
     * @author enson
     * @date 2020-08-31
     * @param {Object} departmentData 部门数据 + 节点
     */
    delDepartment(departmentData) {
      console.log('departmentData', departmentData);
      const currentNode = departmentData.node;
      const currentData = departmentData.data;
      if (currentData.staffCnt > 0) {
        this.$utils.postMessage({
          type: 'error',
          message: '删除失败，请先移走部门下的成员',
        });
        return;
      }

      confirm('确认删除该部门？', '删除确认').then(async action => {
        if (action == 'confirm') {
          const [err, res] = await delDepartment({
            id: currentData.id,
          });
          if (err) {
            this.$utils.postMessage({
              type: 'error',
              message: err.msg || '网络错误，请稍候重试',
            });
            return Promise.reject(err);
          }
          this.$utils.postMessage({
            type: 'success',
            message: '删除成功',
          });
          console.log('currentNode', currentNode);
          const parent = currentNode.parent;
          const children = parent.data.children || parent.data;
          const index = children.findIndex(d => d.id === currentData.id);
          children.splice(index, 1);
          try {
            this.$refs.companyList.$refs.companyTree.remove(currentData);
            const parentNode = this.$refs.companyList.$refs.companyTree.getNode(currentData.fid);
            console.log('parentNode', parentNode);
            if (parentNode && parentNode.childNodes.length <= 0) {
              this.$set(parentNode, 'isLeafByUser', true);
              this.$set(parentNode.data, 'hasChild', false);
              this.$set(parentNode, 'hasChild', false);
            }
          } catch (e) {
            console.log('e', e);
            this.upTree();
          }
        }
      });
    },
    /**
     * @description 重置成设置部门前的状态
     * @author enson
     * @date 2020-08-25
     */
    finishWorkRoom() {
      this.showSelect = false;
      this.$refs.manageTable.clearSelection();
      this.selectList = [];
      this.selectIdList = [];
      this.singleSelectedOrgData = {
        // 选择的部门数据
        dept: [],
        staff: [],
      };
    },
    setSingleWorkRoom(item) {
      if (!item.sid) {
        return;
      }
      this.$set(this.singleSelectedOrgData, 'dept', item.dept || []);
      this.selectIdList = [];
      this.selectIdList.push(item.sid);
      this.selectDialogVisible = true;
    },
    /**
     * @description 点击批量设置部门按钮的回调事件
     * @author enson
     * @date 2020-08-25
     */
    setWorkRoom() {
      // 没有显示的情况下，则显示复选框
      if (!this.showSelect) {
        this.showSelect = true;
      } else {
        // 已经显示的情况下，则先判断是否有勾选复选框
        if (this.selectList.length <= 0) {
          this.$utils.postMessage({
            type: 'error',
            message: '请勾选成员',
          });
          return;
        }
        this.selectDialogVisible = true;
      }
    },
    /**
     * @description 批量设置部门
     * @author enson
     * @date 2020-09-01
     * @param {*} param
     */
    async addDepStaffRel(param) {
      const depIdListJson = [];
      param.dept &&
        param.dept.forEach(item => {
          depIdListJson.push(item.id);
        });
      const [err, res] = await batchAddDepStaffRel({
        sidListJson: JSON.stringify(this.selectIdList),
        depIdListJson: JSON.stringify(depIdListJson),
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.$utils.postMessage({
        type: 'success',
        message: res.msg || '操作成功',
      });
      this.finishWorkRoom();
      this.isReload = true;
      return Promise.resolve();
    },
    getDeptName(deptList) {
      if (!deptList) return '-';
      return deptList.map(item => item.name).join(', ');
    },
    upTree() {
      this.updateTree = true;
    },
    /**
     * 当前选中节点变化时更新数据
     * @author lymn
     * @date 2020-09-16
     * @param {Object} data 当前展开的对象
     * @param {Number} type 1: 展开子部门 2：选中节点
     */
    changeStaffData(data, type) {
      this.requestParam.depId = data.id;
      this.searchInfo();
    },
    /**
     * @description : from校验, 密码与确认密码是否一致
     * @author      : ADI
     * @Date        : 2021-07-09 16:14:35
     * @param        {*} rule
     * @param        {*} value
     * @param        {*} callback
     * @return       {*}
     */
    validatorSurePassword(rule, value, callback) {
      if (this.accountInfo.pwd === value) {
        callback();
      } else {
        callback(new Error('密码与确认密码不一致'));
      }
    },
    /**
     * @description : form校验, change检测不到引用类型修改，手动调用校验
     * @author      : ADI
     * @Date        : 2021-07-09 16:13:14
     * @param        {*} rule
     * @param        {*} value
     * @param        {*} callback
     * @return       {*}
     */
    formSelectedOrgDataItemSelect() {
      this.$refs?.linkEditRuleForm.validateField('selectedOrgData');
    },
    /**
     * @description : 自定义wordId规则
     * @author      : ADI
     * @Date        : 2021-07-26 14:24:06
     * @param        {*}
     * @return       {*}
     */
    customCheckWorkIdRule() {
      const key = 'workId';
      this.customWorkIdRule = [
        ...this.rules[key],
        {
          validator: (rule, value, callback) => {
            if (this.selectWorkKey_edit === '0-0') {
              callback();
            } else {
              callback(new Error('角色数量已达上限，请设置为无'));
            }
          },
          trigger: 'change',
        },
      ];
      this.$nextTick(() => {
        this.$refs?.linkEditRuleForm.validateField(key);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.employeeMange {
  height: 100%;
  .em_delete {
    color: #2882ff;
    &.disabled {
      color: #b2b2b2;
      &:hover,
      &:active {
        color: #b2b2b2;
      }
    }
  }
  .bottomBar__del {
    min-width: 80px;
    color: #535353;
    &.disabled {
      color: #b2b2b2;
      &:hover,
      &:active {
        color: #b2b2b2;
      }
    }
  }
  .employeeList {
    .em_header {
      position: relative;
      height: 34px;
      margin-bottom: 22px;
      .em_header_name {
        position: absolute;
        top: 0;
        left: 0;
        height: 34px;
        font-size: 16px;
        font-weight: bold;
        line-height: 34px;
        color: #000000;
      }
      .em_header_addEm {
        top: 0;
        right: 0;
        float: right;
        width: 110px;
        height: 34px;
        font-size: 14px;
        line-height: 34px;
        .addAccount {
          width: 14px;
          height: 14px;
        }
      }
    }
    .em_body {
      .employeeHeader {
        height: 50px;
        background: $border-disabled-color;
        .cell {
          font-size: 14px;
          font-weight: bold;
          color: #535353;
          text-align: center;
        }
      }
      .cellStyle {
        font-size: 14px;
        font-weight: 400;
        color: #535353;
        text-align: center;
        border-color: #eeeeee !important;
        .cell {
          span {
            display: inline-block;
            width: 28px;
            font-size: 14px;
            font-weight: 400;
            cursor: pointer;
            &.unbindWX {
              width: auto;
              &.notAllow {
                cursor: not-allowed;
              }
            }
            &.disabled {
              color: #b2b2b2;
            }
            &.text_but1 {
              &.edit_span {
                line-height: 26px;
                vertical-align: middle;
                &.disabled {
                  cursor: not-allowed;
                }
              }
            }
          }
          .em_edit {
            margin-right: 22px;
          }
        }
      }
      .tshu_pagination {
        padding-top: 30px;
      }
    }
  }
  .editEmployee {
    min-width: 980px;
    .operatePage {
      .goManage {
        position: relative;
        display: inline-block;
        height: 16px;
        font-size: 14px;
        font-weight: 400;
        line-height: 16px;
        color: $color-53;
        vertical-align: middle;
        &::before {
          position: absolute;
          top: 0;
          right: 0;
          width: 1px;
          height: 16px;
          background: #cfcfcf;
          content: ' ';
        }
        .addAccount {
          display: inline-block;
          width: 7px;
          height: 13px;
          vertical-align: middle;
        }
        span {
          display: inline-block;
          height: 16px;
          padding-right: 11px;
          line-height: 16px;
          text-decoration: underline;
          vertical-align: middle;
          cursor: pointer;
        }
      }
    }
    .topAccountInfo {
      .account_1 {
        .account_title {
          padding-left: 41px;
          font-size: 14px;
          font-weight: bold;
          color: #000000;
        }
      }
      .account_2 {
        & > div {
          & > div {
            float: left;
            width: 350px;
            &.password {
              .resetPwd {
                margin-left: 10px;
                cursor: pointer;
              }
            }
          }
        }
        .ts-input,
        .tshu_select {
          width: 350px;
        }
        .accountName {
          /* height: 66px; */
        }
        .nameAndword {
          /* height: 66px; */
          .profession {
            margin-left: 69px;
          }
        }
        .nameAndSure {
          /* height: 66px; */
          .password {
            .myMotivate {
              position: relative;
              height: 30px;
              .motivatePwd {
                display: inline-block;
                width: 6px;
                height: 6px;

                /* background: url('~@/assets/image/comm/pwd.png') no-repeat; */
                background-size: 100% 100%;
              }
              .resetPwd {
                position: absolute;
                top: 50%;
                right: 11px;
                height: 14px;
                font-size: 14px;
                font-weight: 400;
                line-height: 14px;
                color: #247af3;
                cursor: pointer;
                transform: translate(0%, -50%);
              }
            }
          }
          .surePaswword {
            margin-left: 69px;
          }
        }
      }
    }
    .AccountInfo {
      height: 335px;
      padding-top: 30px;
      padding-top: 30px;
      padding-bottom: 10px;

      /* overflow: hidden; */
      clear: both;
      clear: both;
      border-bottom: 1px solid #eeeeee;
      .account_1 {
        .account_title {
          padding-left: 20px;
          font-size: 14px;
          font-weight: bold;
          color: #000000;
        }
      }
      &:last-child {
        border-bottom: none;
      }
      .account_3 {
        & > div {
          display: flex;
        }
      }
    }
    .middleAccountInfo {
      height: 203px;
      .account_2 {
        & > div {
          & > div {
            float: left;
            width: 350px;
            &:nth-child(1) {
              margin-right: 69px;
            }
          }
        }
      }
    }
    .bottomAccountInfo {
      height: 203px;
      .account_2 {
        & > div {
          display: flex;
          & > div {
            & > div {
              padding-bottom: 6px;
              font-size: 14px;
              font-weight: 400;
              line-height: 20px;
              color: #535353;
            }
            & > .ts-input {
              width: 350px;
            }
            &:nth-of-type(1) {
              & > .ts-input {
                margin-right: 70px;
              }
            }
          }
        }
      }
    }
    .account_1 {
      float: left;
      width: 184px;
    }
    .account_2 {
      float: left;
      & > div {
        width: 770px;
        padding-bottom: 30px;
        clear: both;
        &.payAndtype {
          /* height: 66px; */
        }
        &.payPercent {
          /* height: 66px; */
        }
        &.stableMoney {
          /* height: 66px; */
        }
      }
      .accountName {
        .youName {
          margin-left: 69px;
        }
      }
      .department {
        .departmentSelect {
          .tagBox {
            height: 40px;
            line-height: 40px;
          }
        }
      }
      .hasStaffNumber {
        margin: 0;
      }
      .tanshu-selectList {
        .hideInput {
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 0;
          width: 100%;
        }
      }
    }
    .bottomBtn {
      & > div {
        text-align: center;
        & > div {
          vertical-align: middle;
          &.em_save_emp {
            margin-right: 10px;
          }
          &.em_add_emp {
            width: 140px;
          }
        }
      }
    }
  }
  .hasStaffNumber {
    display: inline-block;
    margin: 9px 10px 9px 0;
    font-size: 16px;
    font-weight: bold;
    line-height: 16px;
    color: #000000;
    text-align: center;
    vertical-align: top;
    cursor: pointer;
    span {
      margin-left: 2px;
    }
  }
  .redColor {
    color: $error-color;
  }
  .pro_listBox {
    .pro_line {
      .hasStaffNumber {
        height: 34px;
        line-height: 34px;
      }
    }
    &.addHeight {
      height: 100%;
      box-sizing: border-box;
    }
  }
  .profession {
    .redSnowFlower {
      width: 340px;
    }
    .roleBox {
      display: inline-block;
      width: calc(340px - 8px);
    }
  }
  .account_2 {
    .hasStaffNumber {
      float: right;
      font-size: 14px;
      line-height: 1;
    }
  }
  .content {
    display: flex;
    flex-flow: row nowrap;
    .leftContent {
      position: relative;
      padding: 20px;
      margin-right: 20px;
      overflow-x: scroll;
      overflow-x: scroll;
      overflow-y: auto;
      background: #ffffff;
      border-radius: 4px;
      opacity: 1;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
      box-sizing: border-box;
      flex: 0 0 240px;
      .companyList {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
      }
    }
    .rightContent {
      width: 100%;
      min-width: calc(100% - 260px);
      .tshu-tableset {
        min-width: auto;
      }
    }
    &.hasCompanyTree {
      height: calc(100% - 94px);
    }
  }
  .rightContent {
    .pro_listBox {
      .pro_line {
        .searchBtn {
          float: left;
        }
      }
    }
  }
}
.employeeMange .rightContent .pro_listBox .pro_line .setWorkRoom,
.employeeMange .rightContent .pro_listBox .pro_line .sameMargin {
  float: left;
  margin-left: 10px;
}
</style>

<style lang="scss">
.employeeMange {
  .employeeList {
    .em_body {
      .cellStyle {
        .cell {
          .el-checkbox {
            span {
              width: 14px;
            }
          }
          span {
            &.el-checkbox__input {
              &.is-disabled {
                cursor: not-allowed;
                .el-checkbox__inner {
                  cursor: not-allowed;
                }
              }
            }
          }
        }
      }
    }
  }
}
.setDepartment {
  &.el-popper {
    .operateWrap {
      display: flex;
      width: 100%;
      height: 100%;
      font-size: 14px;
      line-height: 14px;
      color: $color-00;
      flex-direction: column;
      justify-content: space-around;
      p {
        &:hover {
          color: #247af3;
          cursor: pointer;
        }
      }
    }
  }
}
.setDepartment[x-placement^='bottom'].el-popper,
.setDepartment[x-placement^='top'].el-popper {
  width: 120px;
  height: 122px;
  min-width: 120px;
  padding: 20px;
  margin-top: 2px;
  box-sizing: border-box;
}
</style>
