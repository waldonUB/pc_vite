<!--
 * @Author       : ADI
 * @Date         : 2021-07-19 13:49:50
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-31 15:47:23
-->
<template>
  <global-ts-card-box class="taskNewAdd">
    <template v-slot:card-box-head>
      <global-ts-tabguide @backToPrePage="backManage">
        <template v-slot:leftPart>全部任务</template>
        <template v-slot:rightPart>下发任务</template>
      </global-ts-tabguide>
    </template>
    <template v-slot:card-box-body>
      <div class="editBox">
        <fa-form-model class="editItem" ref="pwdForm" :model="editAccountInfo" :rules="formRules" layout="vertical">
          <div class="editItem">
            <div class="editTitle">
              任务内容
            </div>
            <div class="editContent">
              <fa-form-model-item label="任务名称" prop="title">
                <global-ts-input
                  class="accountName"
                  v-model="editAccountInfo.title"
                  :maxLength="15"
                  placeholder="请输入"
                  size="large"
                >
                </global-ts-input>
              </fa-form-model-item>

              <fa-form-model-item label="任务类型" prop="taskType">
                <global-ts-select
                  class="taskType"
                  placeholder="请选择"
                  type="large"
                  :list="taskTypeList"
                  v-model="editAccountInfo.taskType"
                  @change="selectTaskType"
                  direction="down"
                  @onSelect="isOnSelect"
                  :selectkey="{ label: 'key', value: 'value' }"
                >
                </global-ts-select>
              </fa-form-model-item>

              <fa-form-model-item :label="`指定${taskTypeNameCal}`" prop="taskType" v-if="taskTypeWithPersonCal">
                <div class="accountName selectArticleBox tanshu-ellipsis" @click="showSelectBubble">
                  <span class="placeHolder" v-if="!targetTitle"> 请选择指定{{ taskTypeNameCal }} </span>
                  <span v-else>
                    {{ targetTitle }}
                  </span>
                  <svg class="icon tshu_arrow" aria-hidden="true">
                    <use xlink:href="#icon-xialakuangjiantou"></use>
                  </svg>
                </div>
              </fa-form-model-item>
            </div>
            <div class="editContent pyqContent" v-if="taskTypeFriendCal">
              <div class="textareaInfo">
                <fa-form-model-item
                  :label="editAccountInfo.taskType == 4 ? '朋友圈内容' : '任务内容'"
                  prop="taskContent"
                >
                  <div
                    class="accountName selectArticleBox tanshu-ellipsis"
                    @click="showSelectBubble"
                    v-if="editAccountInfo.taskType == 4"
                  >
                    <span class="placeHolder" v-if="!targetTitle">
                      选择朋友圈素材
                    </span>
                    <span v-else>
                      {{ targetTitle }}
                    </span>
                    <svg class="icon tshu_arrow" aria-hidden="true">
                      <use xlink:href="#icon-xialakuangjiantou"></use>
                    </svg>
                  </div>
                  <el-input
                    type="textarea"
                    :maxlength="editAccountInfo.taskType == 4 ? '2000' : '200'"
                    show-word-limit
                    :autosize="{ minRows: 4, maxRows: 4 }"
                    placeholder="请输入"
                    v-model="editAccountInfo.taskContent"
                  >
                  </el-input>
                </fa-form-model-item>
              </div>
            </div>
            <div class="imgBoxList" v-if="taskTypeFriendCal">
              <div v-for="(item, index) of pidImgUrlList" :key="index" class="imgBox">
                <img class="img" :src="item.pidImgUrl" />
                <div class="gfwBox" v-if="[1, 2, 3].includes(item.gfwStatus)">
                  {{ item.gfwStatus == 1 ? '审查中' : '已封禁' }}
                  <svg class="icon helpIcon" aria-hidden="true" @click="toHelpCenter">
                    <use xlink:href="#icon-bianzu"></use>
                  </svg>
                </div>
                <div class="operation">
                  <i class="el-icon-delete" @click="removeMaterial(index)"></i>
                  <i class="el-icon-view" @click="handlePictureCardPreview(item.pidImgUrl)"></i>
                </div>
              </div>
              <global-ts-fai-img-upload-style-box
                v-if="showUpload"
                :showFileList="false"
                class="materialUploadBox"
                :limit="imgNumLimit"
                size="mini"
                @upload-click="
                  () => {
                    tanshuFileSelectUploadVisible = true;
                  }
                "
              >
              </global-ts-fai-img-upload-style-box>

              <global-ts-file-select-upload-dialog
                :dialog-visible.sync="tanshuFileSelectUploadVisible"
                :limit-num="imgNumLimit"
                accept-type="img"
                @success="uploadSuccess"
              >
              </global-ts-file-select-upload-dialog>
            </div>
          </div>
          <div class="editItem">
            <div class="editTitle">
              任务目标
            </div>
            <div class="editContent">
              <div class="editInfo">
                <fa-form-model-item label="接收人" prop="sids">
                  <!-- <div class="accountBox"> -->
                  <ts-select-list
                    :permissions="permissions"
                    class="selectListBox floatLeft"
                    :isWorker="true"
                    :depIdList.sync="editAccountInfo.depIdList"
                    :selectedOrgData.sync="singleSelectedOrgData"
                    :sids.sync="editAccountInfo.sids"
                    :width="440"
                  >
                  </ts-select-list>
                  <!-- </div> -->
                </fa-form-model-item>
              </div>
              <div class="editInfo" v-if="taskTypeEvidenceCal">
                <fa-form-model-item label="上传完成凭证（图片）" prop="isNeedEvidence">
                  <div class="accountName">
                    <span v-for="(item, index) in needEvidenceList" @click="changeNeedEvidence(item.key)" :key="index">
                      <input
                        v-model="editAccountInfo.isNeedEvidence"
                        type="radio"
                        :value="item.key"
                        :id="'evidence' + index"
                      />
                      <label :for="'evidence' + index">{{ item.value }}</label>
                    </span>
                  </div>
                </fa-form-model-item>
              </div>
              <div class="editInfo" v-if="editAccountInfo.taskType === 1">
                <fa-form-model-item label="提交人数" prop="formSubmit">
                  <global-ts-input
                    class="accountName"
                    v-model="editAccountInfo.formSubmit"
                    :maxLength="4"
                    placeholder="0-9999"
                    size="large"
                  >
                  </global-ts-input>
                </fa-form-model-item>
              </div>
              <div class="editInfo" v-if="taskTypeWithShareCal">
                <fa-form-model-item label="销售员分享次数" prop="shares">
                  <global-ts-input
                    class="accountName"
                    v-model="editAccountInfo.shares"
                    :maxLength="4"
                    placeholder="1-9999"
                    size="large"
                  >
                  </global-ts-input>
                </fa-form-model-item>
              </div>
              <div class="editInfo" v-if="taskTypeWithPersonCal">
                <fa-form-model-item label="访问人数" prop="visitsViewer">
                  <global-ts-input
                    class="accountName"
                    v-model="editAccountInfo.visitsViewer"
                    :maxLength="4"
                    placeholder="0-9999"
                    size="large"
                  >
                  </global-ts-input>
                </fa-form-model-item>
              </div>
              <div class="editInfo" v-if="taskTypeWithPersonCal">
                <fa-form-model-item label="新增访问人数" prop="viewers">
                  <global-ts-input
                    class="accountName"
                    v-model="editAccountInfo.viewers"
                    :maxLength="4"
                    placeholder="0-9999"
                    size="large"
                  >
                  </global-ts-input>
                </fa-form-model-item>
              </div>
              <div class="editInfo">
                <fa-form-model-item label="其他目标" prop="otherTarget">
                  <global-ts-input
                    class="accountName"
                    v-model="editAccountInfo.otherTarget"
                    :maxLength="50"
                    placeholder="请输入"
                    size="large"
                  >
                  </global-ts-input>
                </fa-form-model-item>
              </div>
            </div>
          </div>
          <div class="editItem">
            <div class="editTitle">
              任务时间
            </div>
            <div class="editContent">
              <div class="editInfo">
                <fa-form-model-item label="开始和结束时间" prop="endTime">
                  <global-ts-date-picker
                    ref="datePicker"
                    type="datetimerange"
                    dataFormat="yyyy-MM-dd HH:mm:ss"
                    class="accountName"
                    :defaultInitTime="defaultInitTime"
                    :options="pickerOptions"
                    @updateTime="getSearchTime"
                  >
                  </global-ts-date-picker>
                </fa-form-model-item>
              </div>
              <div class="editInfo">
                <fa-form-model-item label="提醒频率" prop="type">
                  <div class="accountName">
                    <span v-for="(item, index) in remindTypeList" @click="changeRemindType(item.key)" :key="index">
                      <input v-model="editAccountInfo.type" type="radio" :value="item.key" :id="'clientDel' + index" />
                      <label :for="'clientDel' + index">{{ item.value }}</label>
                    </span>
                  </div>
                </fa-form-model-item>
              </div>
              <div class="editInfo">
                <fa-form-model-item label="提醒时间" required>
                  <global-ts-select
                    type="large"
                    class="accountName"
                    :selectkey="{ label: 'name', value: 'id' }"
                    :list.sync="classifyList[editAccountInfo.type - 1]"
                    v-model="remindTime"
                    :direction="'up'"
                    @change="changeRemindTimes"
                    placeholder="选择提醒时间"
                  >
                  </global-ts-select>
                  <el-date-picker
                    v-if="editAccountInfo.type == 1 && showDefineTimeOption"
                    placeholder="自定义时间"
                    class="accountName"
                    v-model="onceInfo.onceTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :editable="false"
                    :clearable="false"
                  >
                  </el-date-picker>
                  <el-time-picker
                    v-if="(editAccountInfo.type == 2 && showDefineTimeOption) || editAccountInfo.type == 3"
                    class="accountName"
                    placeholder="自定义时间"
                    value-format="HH:mm"
                    format="HH:mm"
                    v-model="defineTime"
                    @change="changeTime"
                  >
                  </el-time-picker>
                </fa-form-model-item>
              </div>
            </div>
          </div>
          <div class="editItem editItemTask" v-if="isOpenIntegral">
            <div class="editTitle">
              任务奖惩
            </div>
            <div class="editContent">
              <div class="editInfo">
                <fa-form-model-item label="完成任务奖励积分" prop="addIntegral">
                  <global-ts-input
                    class="accountName"
                    v-model="editAccountInfo.addIntegral"
                    :maxLength="4"
                    placeholder="0-9999"
                    size="large"
                  >
                  </global-ts-input>
                </fa-form-model-item>
              </div>
              <div class="editInfo">
                <fa-form-model-item label="未完成任务扣除积分" prop="delIntegral">
                  <global-ts-input
                    class="accountName"
                    v-model="editAccountInfo.delIntegral"
                    :maxLength="4"
                    placeholder="0-9999"
                    size="large"
                  >
                  </global-ts-input>
                </fa-form-model-item>
              </div>
            </div>
          </div>
        </fa-form-model>
        <ts-article-bubble
          :dialogVisible.sync="isShowArticleBubble"
          @cancelbubble="isShowArticleBubble = false"
          @confirmbubble="selectArticle"
          :selectId="editAccountInfo.dataId"
          :selectArticle="selectInfo"
          :fatherTypeId="editAccountInfo.fatherTypeId"
        >
        </ts-article-bubble>
        <ts-select-other-bubble
          v-if="editAccountInfo.taskType != 0"
          :dialogVisible.sync="isShowOtherBubble"
          :selectType="typeNameId"
          :selectInfo="selectInfo"
          :isKtuPoster.sync="isKtuPoster"
          :selectId="editAccountInfo.dataId"
          @confirmbubble="selectInsert"
        >
        </ts-select-other-bubble>
        <selectPyqBubble
          :dialogVisible.sync="isShowPyqBubble"
          :selectInfo="selectInfo"
          :selectId="editAccountInfo.dataId"
          @confirmbubble="selectPyq"
        >
        </selectPyqBubble>
        <ts-preview-picture :previewVisible.sync="previewVisible" :previewImgUrl="previewImgUrl"> </ts-preview-picture>
      </div>
    </template>
    <template v-slot:card-box-bottom>
      <div class="bottomBtn">
        <global-ts-button class="em_add_emp" type="primary" size="medium" @click="addTask">
          {{ buttonText }}
        </global-ts-button>
      </div>
    </template>
  </global-ts-card-box>
</template>

<script>
import { TimePicker } from 'element-ui';
import { confirm, format, mixErrorObject, getUrL, getConfInfo } from '@/utils';
import taskCommon from '../../mixins/task-common/index.vue';
import selectPyqBubble from '../select-pyq-bubble/index.vue';
import TsCommDef from '@/config/ts-comm-def';
import { mapGetters, mapState } from 'vuex';
import TsSelectList from '@/components/base/ts-select-list/index.vue';
import TsPreviewPicture from '@/components/base/ts-preview-picture/index.vue';
import TsArticleBubble from '@/components/base/ts-article-bubble/index.vue';
import TsSelectOtherBubble from '@/components/base/ts-select-other-bubble/index.vue';
import { getTsMarketingTask, saveTsMarketing } from '@/api/modules/views/corp-manage/all-task';
import { Input } from 'element-ui';

export default {
  name: 'task-new-add',
  mixins: [mixErrorObject(), taskCommon],
  components: {
    selectPyqBubble,
    TsSelectList,
    TsPreviewPicture,
    [TimePicker.name]: TimePicker,
    TsArticleBubble,
    TsSelectOtherBubble,
    [Input.name]: Input,
  },
  props: {
    taskId: {
      // 任务id
      type: Number,
      defualt: 0,
    },
    taskType: {
      // 任务id
      type: Number,
      defualt: 0,
    },
    pyqChooseItem: {
      // 朋友圈发起任务
      type: Object,
      defualt: () => {
        return null;
      },
    },
  },
  data() {
    return {
      uploadUrl: getUrL(
        `/ajax/upload_h.jsp?cmd=uploadTmpFile&folderType=${TsCommDef.FolderType.PERSON_SYS_MARKETING_TASK}`,
      ),
      fileAcceptCal: '.jpg,.jpeg,.png,.JPG,.JPEG,.PNG',
      requestParam: {}, // 请求数据
      test: '', // todo： 用于接收人测试数据
      onceInfo: {
        // 提醒频率-单次
        beforeEnd: 1, // 选项 值为对应选项的id
        onceTime: '', // 自定义时间
      },
      dayInfo: {
        // 提醒频率-每天
        eachTime: 1, // 选项 值为对应选项的id
        dayTime: '', // 自定义时间
      },
      weekInfo: {
        // 提醒频率-每周
        week: 1, // 选项 值为对应选项的id
        weekTime: '', // 自定义时间
      },
      defineTime: '', // 自定义时间
      editAccountInfo: {
        title: '', // 任务名称
        shares: '', // 文章分享次数
        viewers: '', // 新增访问人数
        visitsViewer: '',
        otherTarget: '', //其他目标
        taskContent: '', //朋友圈内容
        targetTitle: '', //标题
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        type: 2, // 提醒类型 1：单次 2：每日 3：每周
        dataId: 0, // 文章id
        cloneSource: 0, // 文章来源 0：企业文库 1：热文素材和行业热文
        beforeEnd: '', // 结束前时间提醒
        onceTime: '', // 单次自定义时间
        eachTime: '', // 每天提醒类型
        dayTime: '', // 每天提醒自定义时间
        week: '', // 每周几
        weekTime: '', // 每周几提醒时间
        sids: '', // 接收人-员工
        depIdList: '', // 接收人-部门（该部门下所有员工）
        name: '', //任务名称
        taskType: 0, //任务类型
        formSubmit: '',
        isNeedEvidence: true,
        addIntegral: '', // 完成任务添加的积分
        delIntegral: '', // 未完成任务扣除的积分
      },
      nowImgIdList: [], //朋友圈图片idlist
      pidImgUrlList: [],
      editDetailOriginDataCache: {
        pidImgUrlList: [],
        taskType: 0,
      },
      remindTypeList: [
        // 提醒频率选择列表
        {
          key: 1,
          value: '单次',
        },
        {
          key: 2,
          value: '每天',
        },
        {
          key: 3,
          value: '每周',
        },
      ],
      needEvidenceList: [
        // 提醒频率选择列表
        {
          key: true,
          value: '需要',
        },
        {
          key: false,
          value: '不需要',
        },
      ],
      classifyList: [
        [
          { name: '任务截至前1小时', id: 1 },
          { name: '任务截至前2小时', id: 2 },
          { name: '任务截至前3小时', id: 3 },
          { name: '任务截至前1天', id: 4 },
          { name: '自定义', id: 0 },
        ],
        [
          { name: '每天9点', id: 1 },
          { name: '每天12点', id: 2 },
          { name: '每天18点', id: 3 },
          { name: '自定义', id: 0 },
        ],
        [
          { name: '周日', id: 7 },
          { name: '周一', id: 1 },
          { name: '周二', id: 2 },
          { name: '周三', id: 3 },
          { name: '周四', id: 4 },
          { name: '周五', id: 5 },
          { name: '周六', id: 6 },
        ],
      ],
      showDefineTimeOption: false, // 是否显示自定义时间选项
      isShowArticleBubble: false, // 是否显示指定文章弹窗
      isShowOtherBubble: false, //显示其他弹窗
      isShowPyqBubble: false, //显示其他弹窗
      typeNameId: 0,
      targetTitle: '', // 选中的文章标题
      defaultInitTime: [], // 自定义开始和结束的初始时间
      singleSelectedOrgData: {
        // 单选设置部门
        dept: [], // 已选择的部门信息
        staff: [],
      }, // 已选择的成员信息
      isToSelect: false, //是否主动选择
      isKtuPoster: false,
      isOpenIntegral: false, // 是否开启了销售积分
      selectInfo: {
        id: 0,
        title: '',
        type: 0,
      },
      fileTypeTip: '上传失败：格式错误，请上传jpg、png格式的图片',
      previewVisible: false,
      previewImgUrl: '',
      permissions: this.$route.meta.permissionsKey,
      folderType: TsCommDef.FolderType.PERSON_SYS_MARKETING_TASK,
      tanshuFileSelectUploadVisible: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近7天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近15天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 15);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近30天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(format.addDate(new Date(), 3, 'months'));
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(format.addDate(new Date(), 1, 'years'));
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters({
      isManage: 'user/isManage',
    }),
    ...mapState({
      helpDoc: state => state.globalData?.wxWorkConf?.compMaterialConf?.helpDoc,
    }),
    taskTypeEvidenceCal() {
      return [3, 4, 5].includes(this.editAccountInfo.taskType);
    },
    taskTypeFriendCal() {
      return [4, 5].includes(this.editAccountInfo.taskType);
    },
    /**
     * 必须的任务类型
     * @author waldon
     * @date 2020-10-31
     * @return {Boolean} - 必须的任务类型
     */
    taskTypeWithRequiredCal() {
      return [1, 2, 6, 7, 8].includes(this.editAccountInfo.taskType);
    },
    /**
     * 带访问人数的任务类型
     * @author waldon
     * @date 2020-10-31
     * @return {Boolean} - 带访问人数的任务类型
     */
    taskTypeWithShareCal() {
      return [0, 1, 2, 6, 7, 8].includes(this.editAccountInfo.taskType);
    },
    /**
     * 带访问人数的任务类型
     * @author waldon
     * @date 2020-10-31
     * @return {Boolean} - 带访问人数的任务类型
     */
    taskTypeWithPersonCal() {
      return [0, 1, 2, 3, 6, 7, 8].includes(this.editAccountInfo.taskType);
    },
    taskTypeNameCal() {
      if (this.taskTypeList.find(item => item.value === this.editAccountInfo.taskType)) {
        return this.taskTypeList.find(item => item.value === this.editAccountInfo.taskType).name;
      }
      return '';
    },
    showUpload() {
      return (
        (this.editAccountInfo.taskType == 4 && this.pidImgUrlList.length < 9) ||
        (this.editAccountInfo.taskType == 5 && this.pidImgUrlList.length < 1)
      );
    },
    buttonText() {
      return this.$parent.taskId ? '保存' : '创建任务';
    },
    remindTime: {
      // 提醒时间
      get() {
        switch (this.editAccountInfo.type) {
          case 1:
            // 单次
            return this.onceInfo.beforeEnd;
          case 2:
            // 每日
            return this.dayInfo.eachTime;
          case 3:
            // 每周
            return this.weekInfo.week;
          default:
            return this.onceInfo.beforeEnd;
        }
      },
      set(newVal) {
        switch (this.editAccountInfo.type) {
          case 1:
            // 单次
            this.onceInfo.beforeEnd = newVal;
          // eslint-disable-next-line no-fallthrough
          case 2:
            // 每日
            this.dayInfo.eachTime = newVal;
          // eslint-disable-next-line no-fallthrough
          case 3:
            // 每周
            this.weekInfo.week = newVal;
        }
      },
    },
    imgNumLimit() {
      return this.editAccountInfo.taskType === 4 ? 9 - this.pidImgUrlList.length : 1;
    },
    formRules() {
      return {
        taskType: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
        sids: [
          { required: true, message: '请选择接收人', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (value === '[]') {
                this.$utils.postMessage({
                  type: 'error',
                  message: '请选择接收人',
                });
                callback(new Error('请选择接收人'));
              } else {
                callback();
              }
            },
            trigger: 'change',
          },
        ],
        isNeedEvidence: [{ required: true, message: '上传完成凭证（图片）', trigger: 'change' }],
        endTime: [{ required: true, message: '请选择开始和结束时间', trigger: 'change' }],
        type: [{ required: true, message: '请选择提醒频率', trigger: 'change' }],
      };
    },
  },
  watch: {},
  async created() {
    if (this.$parent.taskId) {
      this.getDetail();
    } else {
      const startTime = format.date(format.addDate(new Date(), -1, 'minutes'), 'yyyy-MM-dd HH:mm:ss');
      const endTime = format.date(format.addDate(new Date(), 1, 'days'), 'yyyy-MM-dd HH:mm:ss');
      this.defaultInitTime = [startTime, endTime];
      console.log(this.defaultInitTime);
    }
    this.getFromParams();
    const confInfo = await getConfInfo();
    this.isOpenIntegral = confInfo.isOpenIntegral;
    if (this.pyqChooseItem) {
      this.editAccountInfo.taskType = this.taskType;
      this.editAccountInfo.taskContent = this.pyqChooseItem.description;
      this.pidImgUrlList = this.pyqChooseItem.contentList.map(item => {
        return {
          imgId: item.regId,
          pidImgUrl: item.regUrl,
          del: item.del,
          gfwStatus: item.gfwStatus,
          gfwStatusReason: item.gfwStatusReason,
        };
      });
    }
  },
  mounted() {},
  methods: {
    toHelpCenter() {
      window.open(this.helpDoc, '_blank');
    },
    handlePictureCardPreview(url) {
      this.previewImgUrl = url;
      this.previewVisible = true;
    },
    /**
     * 获取任务详情
     * @author lymn
     * @date 2020-08-31
     */
    async getDetail() {
      const params = {
        id: this.$parent.taskId,
      };
      const [err, res] = await getTsMarketingTask(params);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.editAccountInfo = Object.assign(this.editAccountInfo, res.data);
      this.editAccountInfo.depIdList = JSON.stringify(this.editAccountInfo.depIdList);
      this.nowImgIdList = [];
      this.pidImgUrlList = res.data.pidImgUrlList;
      this.editDetailOriginDataCache = {
        pidImgUrlList: [...this.pidImgUrlList],
        taskType: this.editAccountInfo.taskType,
      };
      this.isKtuPoster = res.data.isKtuPoster;
      this.onceInfo = {
        beforeEnd: res.data.beforeEnd,
        onceTime: format.formatDate(res.data.onceTime),
      };
      this.dayInfo = {
        eachTime:
          res.data.eachTime >= 1
            ? res.data.eachTime > 3
              ? 0
              : res.data.eachTime //后端自定义返回的是7
            : 0,
        dayTime: res.data.dayTime ? res.data.dayTime : '',
      };
      this.weekInfo = {
        week: res.data.week || 1,
        weekTime: res.data.weekTime ? res.data.weekTime : '',
      };
      this.selectInfo = Object.assign(this.selectInfo, {
        id: res.data.dataId,
        title: res.data.targetTitle,
      });
      if (this.editAccountInfo.taskType == 0) {
        //文章
        this.selectInfo.type = res.data.cloneSource;
      }
      this.changeRemindType(this.editAccountInfo.type);
      this.targetTitle = res.data.targetTitle;

      console.log(this.targetTitle);
      this.defaultInitTime = [res.data.startTimeName, res.data.endTimeName];
      const dept = [];
      res.data.depIdList.forEach(item => {
        dept.push({ id: item });
      });
      this.singleSelectedOrgData = {
        // 单选设置部门
        dept: res.data.departmentList, // 已选择的部门信息
        staff: res.data.staffList, // 已选择的成员信息
      };
      console.log(this.defaultInitTime);
      this.$refs.datePicker.initData(this.defaultInitTime);
    },
    selectTaskType(value) {
      if (this.isToSelect) {
        this.targetTitle = '';
        Object.assign(this.editAccountInfo, {
          dataId: -1,
        });
        this.resetPidImgUrlList(value === this.editDetailOriginDataCache.taskType);
      }
    },
    resetPidImgUrlList(useCache = false) {
      this.nowImgIdList = [];
      this.pidImgUrlList = useCache ? [...this.editDetailOriginDataCache.pidImgUrlList] : [];
    },
    changeNeedEvidence(key) {
      this.editAccountInfo.isNeedEvidence = key;
    },
    /**
     * 返回全部任务
     * @author lymn
     * @date 2020-08-24
     */
    backManage() {
      this.$emit('changeComponent', 'allTaskData');
    },
    /**
     * 创建任务
     * @author lymn
     * @date 2020-08-24
     */
    addTask() {
      this.$refs['pwdForm'].validate(async valid => {
        if (!valid) return;
        if (this.targetTitle === '' && this.taskTypeWithRequiredCal) {
          let msg = '';
          switch (this.editAccountInfo.taskType) {
            case 1:
              msg = '请选择表单';
              break;
            case 2:
              msg = '请选择文件';
              break;
            case 6:
              msg = '请选择活动';
              break;
            case 7:
              msg = '请选择传单';
              break;
            case 8:
              msg = '请选择视频';
          }
          this.$utils.postMessage({
            type: 'error',
            message: msg,
          });
          return;
        }
        if (this.editAccountInfo.taskType === 6) {
          this.$utils.FdpLog('yx_dkhd', {
            yx_app_terminal: 1,
            yx_staff_position: this.isManage ? 1 : 2, // 员工职务 1-管理员 2-销售员 4-未知
            yx_free_text_0: '发起任务',
          });
        }
        if (this.editAccountInfo.taskType === 8 && !this.editAccountInfo.isShowMiniQr) {
          // 分享视频需要校验新版本
          confirm(
            '当前小程序不是最新版，请更新<br>（更新后可以使用新功能）',
            '小程序新版本发布提醒',
            '去更新',
            true,
            true,
          ).then(action => {
            if (action === 'confirm') {
              this.$router.push({
                path: '/bindMp',
              });
            }
          });
          return;
        }
        this.nowImgIdList = this.pidImgUrlList.map(item => item.imgId);
        const imgInfo = {
          nowImgIdList: JSON.stringify(this.nowImgIdList),
        };
        if (this.taskTypeWithShareCal) {
          this.editAccountInfo.isNeedEvidence = false;
        }
        const params = Object.assign(this.editAccountInfo, this.onceInfo, this.dayInfo, this.weekInfo, imgInfo, {
          isKtuPoster: this.isKtuPoster,
        });
        params.viewers = params.viewers ? params.viewers : 0;
        // params.shares = params.shares ? params.shares : 0; // adi: 填充0 用户体验不好
        const [err, res] = await saveTsMarketing(params);
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '系统错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        if (this.$route.params.fromPage === 'videoCenter') {
          location.reload();
        } else {
          // tanShuApp.changeRouter(this.$route.name);
          this.$store.commit('router/setNeedReload', true);
        }
      });
    },
    beforeUpload(file) {
      if (file.name && file.name.includes('.')) {
        const fileNames = file.name.split('.');
        const suffixName = fileNames[fileNames.length - 1];
        if (!this.fileAcceptCal.includes(suffixName)) {
          this.$utils.postMessage({
            type: 'error',
            message: this.fileTypeTip,
          });
          return false;
        }
        const limitSize = file.size / 1024 / 1024;
        if (limitSize > 10) {
          this.$utils.postMessage({
            type: 'error',
            message: '图片大小不能超过10M',
          });
          return false;
        }
      } else {
        this.$utils.postMessage({
          type: 'error',
          message: this.fileTypeTip,
        });
        return false;
      }
    },
    uploadSuccess(res = []) {
      res.forEach(file => {
        const flag = this.beforeUpload(file);
        if (flag === false) {
          return;
        }
        file.id = file.resId;
        this.pidImgUrlList.push({
          imgId: file.id,
          pidImgUrl: file.content,
        });
      });
    },
    removeMaterial(index) {
      this.pidImgUrlList.splice(index, 1)[0];
    },
    /**
     * 获取选中的时间
     * @author lymn
     * @date 2020-08-24
     */
    getSearchTime(val) {
      this.editAccountInfo.startTime = (val && val[0]) || '';
      this.editAccountInfo.endTime = (val && val[1]) || '';
    },
    /**
     * 更改频率
     * @author lymn
     * @date 2020-08-24
     * @param {Number} key 选中提醒频率的key值
     */
    changeRemindType(key) {
      this.editAccountInfo.type = key;
      if (key == 2) {
        this.defineTime = this.dayInfo.dayTime;
      } else if (key == 3) {
        this.defineTime = this.weekInfo.weekTime;
      }
    },
    isOnSelect() {
      this.isToSelect = true;
    },
    /**
     * 显示选择弹窗
     * @author lymn
     * @date 2020-08-26
     */

    showSelectBubble() {
      console.log(this.editAccountInfo);
      if (this.editAccountInfo.taskType === 0) {
        this.isShowArticleBubble = true;
      } else if (this.editAccountInfo.taskType === 4) {
        this.isShowPyqBubble = true;
      } else {
        this.isShowOtherBubble = true;
        switch (this.editAccountInfo.taskType) {
          case 1:
            this.typeNameId = 3;
            break;
          case 2:
            this.typeNameId = 6;
            break;
          case 3:
            this.typeNameId = 7;
            break;
          case 6:
            this.typeNameId = 8;
            break;
          case 7:
            this.typeNameId = 9;
            break;
          case 8:
            this.typeNameId = 10;
        }
      }
    },
    /**
     * 选择时间
     * @author lymn
     * @date 2020-08-26
     */
    changeTime(val) {
      switch (this.editAccountInfo.type) {
        case 2:
          this.dayInfo.dayTime = val;
          break;
        case 3:
          this.weekInfo.weekTime = val;
      }
    },
    /**
     * 选择提醒时间
     * @author lymn
     * @date 2020-08-27
     * @param {Number} val 选项对应的id
     */
    changeRemindTimes(val) {
      // 是否显示自定义时间
      const timesType = this.editAccountInfo.type;
      const list = this.classifyList[timesType - 1];
      this.showDefineTimeOption = val == 0; // val为0时即为选中自定义
    },
    /**
     * 选中文章
     * @author lymn
     * @date 2020-08-31
     * @param {Object} articleObj 返回的文章对象，属性如下
     * @param {Number} id 文章id
     * @param {String} title 文章标题
     * @param {Number} type 文章来源  0：企业文库 1：热文素材和行业热文
     */
    selectArticle(articleObj) {
      console.log(articleObj);
      this.isShowArticleBubble = false; // 关闭弹窗
      this.targetTitle = articleObj.title || '';
      Object.assign(this.editAccountInfo, {
        dataId: articleObj.id,
        cloneSource: articleObj.cloneSource,
      });
    },
    selectInsert(obj) {
      this.isShowOtherBubble = false; // 关闭弹窗
      // 这里之前没有注释其他类型的标题字段，flyerTitle先跟着加
      this.targetTitle = obj.title || obj.name || obj.flyerTitle || '';
      Object.assign(this.editAccountInfo, {
        dataId: obj.id,
        isHotVideo: !!obj.isHotVideo,
        isShowMiniQr: obj.isShowMiniQr,
      });
    },
    /**
     * 根据路由参数做对应操作
     * @author waldon
     * @date 2020/11/29
     */
    getFromParams() {
      if (this.$route.params.fromPage === 'videoCenter') {
        this.targetTitle = this.$route.params.dataName;
        Object.assign(this.editAccountInfo, {
          dataId: this.$route.params.dataId,
          taskType: this.$route.params.taskType,
          isHotVideo: this.$route.params.isHotVideo,
          isShowMiniQr: this.$route.params.isShowMiniQr,
        });
      }
    },
    selectPyq(obj) {
      this.pidImgUrlList = obj.contentList.map(item => {
        return {
          imgId: item.regId,
          pidImgUrl: item.regUrl,
          del: item.del,
          gfwStatus: item.gfwStatus,
          gfwStatusReason: item.gfwStatusReason,
        };
      });
      this.editAccountInfo.taskContent = obj.description;
      this.editAccountInfo.dataId = obj.id;
    },
  },
};
</script>

<style lang="scss" scoped>
.taskNewAdd {
  height: 100%;
  min-width: 1190px;
  ::v-deep .selectListBox .tagBox {
    width: 350px;
    height: 40px;
    line-height: 40px;
  }
  .editBox {
    width: 100%;
    .editItem {
      min-width: 850px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(83, 83, 83, 1);
    }
    .editTitle {
      height: 56px;
      padding-left: 20px;
      font-size: 16px;
      font-weight: bold;
      line-height: 56px;
      vertical-align: top;
      border-bottom: 1px solid #eeeeee;
      box-sizing: border-box;
    }
    .editContent {
      display: grid;
      width: calc(100% - 110px);

      /* padding: 20px 0; */
      padding-top: 20px;
      margin: 0 20px;
      grid-template-columns: 350px 350px 350px;
      grid-row-gap: 0;
      justify-content: space-between;
      grid-column-gap: 20px;
      &.pyqContent {
        padding-bottom: 10px;
      }
      .editInfo {
        display: inline-block;
        vertical-align: top;
        .name {
          width: 350px;
          padding-bottom: 6px;
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: rgba(83, 83, 83, 1);
          box-sizing: border-box;
        }
        .remindBox {
          display: inline-block;
          width: 350px;
          height: auto;
        }
        .accountName {
          width: 350px !important;
          height: 40px !important;
          line-height: 40px;
          .placeHolder {
            color: #c0c4cc;
          }
          &:first-child {
            margin-right: 69px;
          }
        }
        .defineBox {
          margin-bottom: 10px;
        }
      }
      .textareaInfo {
        grid-column-start: 1;
        grid-column-end: 3;
        .selectArticleBox {
          margin-bottom: 10px;
        }
      }
      .selectArticleBox {
        position: relative;
        padding: 0 10px;
        font-size: 14px;
        line-height: 40px;
        color: #606266;
        cursor: pointer;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(238, 238, 238, 1);
        border-radius: 4px;
        box-sizing: border-box;
      }
    }
  }
  .tshu_select {
    width: 350px;
  }
  .requireClass {
    padding-left: 13px;
    background: url('/image/comm/start.png?v=201903051421') no-repeat;
    background-position: 0 7px;
    background-size: 6px 6px;
  }
  .materialUploadBox {
    display: flex;
  }
  .avatar-uploader-icon {
    width: 80px;
    height: 80px;
    font-size: 28px;
    line-height: 80px;
    color: #8c939d;
    text-align: center;
  }
  .imgBoxList {
    display: flex;
    margin-bottom: 30px;
    margin-left: 20px;
    .imgBox {
      position: relative;
      margin-right: 10px;
    }
    .img {
      display: block;
      width: 80px;
      height: 80px;
      border: 1px solid $border-color;
      border-radius: 4px;
      box-sizing: border-box;
    }
    .gfwBox {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 80px;
      height: 34px;
      margin: auto;
      font-size: 12px;
      line-height: 34px;
      color: $error-color;
      text-align: center;
      background: #fef0f0;
      .helpIcon {
        &.icon {
          width: 12px;
          height: 12px;
          margin: 0 2px 0 0;
          fill: $error-color;
        }
      }
    }
    .operation {
      position: absolute;
      top: 0;
      left: 0;
      width: 80px;
      height: 80px;
      font-size: 20px;
      line-height: 82px;
      color: #ffffff;
      text-align: center;
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      &:hover {
        opacity: 1;
      }
    }
  }
  .gridBox {
    display: grid;
    grid-template-columns: 350px 350px 350px;
    justify-content: space-between;
    .item {
      width: 30px;
      height: 30px;
      background: red;
    }
  }
}
.accountName {
  width: 440px !important;
  height: 40px !important;
  line-height: 40px;
  .tshu_arrow {
    position: absolute;
    top: 50%;
    right: 12px;
    z-index: 99;
    width: 14px;
    height: 8px;
    color: $color-b2;
    transform: translate(0%, -50%);
  }
  &:hover {
    .tshu_arrow {
      color: $color-89;
    }
  }
}

@media (min-width: 1860px) {
  .taskNewAdd {
    .editBox {
      .editContent {
        grid-template-columns: 440px 440px 440px;
        .editInfo {
          .accountName {
            width: 440px !important;
          }
        }
      }
    }
    .tshu_select {
      width: 440px;
    }
  }
  .selectListBox {
    .tagBox {
      width: 440px;
    }
  }
}
</style>

<style lang="scss">
.taskNewAdd {
  .el-input--prefix .el-input__inner {
    padding-left: 30px;
  }
  .materialUploadBox {
    .el-upload-list__item {
      width: 80px;
      height: 80px;
    }
    .el-upload--picture-card {
      display: flex;
      width: 80px;
      height: 80px;
      align-items: center;
      justify-content: center;
    }
    .el-upload {
      position: relative;
      width: 80px;
      height: 80px;
      overflow: hidden;
      cursor: pointer;
      background: $color-f7;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      &:hover {
        border: 1px dashed #247af3;
      }
    }
    .el-icon-close-tip {
      display: none;
    }
  }
  .disabled {
    .el-upload--picture-card {
      display: none;
    }
  }
  .el-upload-list__item {
    &.is-success {
      .el-upload-list__item-status-label {
        display: none !important;
      }
    }
  }
  .el-textarea__inner {
    height: 120px;
    border: 1px solid $border-disabled-color;
  }
  .textareaInfo {
    .fa-form-item {
      padding-bottom: 0;
      margin-bottom: 0;
    }
  }
}
</style>
