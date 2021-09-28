<!--
 * @Description  : 创建表单模板
 * @Author       : turbo
 * @Date         : 2021-03-30 16:39:09
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-02 17:40:09
-->

<template>
  <global-ts-card-box class="createForm" ref="cardBox-body">
    <template #card-box-head>
      <global-ts-tabguide @backToPrePage="backManage">
        <template v-slot:leftPart>企业表单</template>
        <template v-slot:rightPart>{{ templateId ? '编辑表单模板' : '创建表单模板' }}</template>
      </global-ts-tabguide>
    </template>
    <template #card-box-body>
      <div class="firstStep" v-if="step == 1">
        <div class="leftPart" ref="leftPart">
          <ts-gfwtips :isShow.sync="isFirstShow" tipContent="请勿添加虚假营销、政治敏感等违规内容！"></ts-gfwtips>
          <fa-form-model
            class="formContent"
            ref="formContentRef"
            layout="horizontal"
            :model="editAccountInfoPartOne"
            :rules="firstRules"
          >
            <fa-form-model-item label="表单标题" prop="title" class="form-header comm-model">
              <fa-input
                v-model="editAccountInfoPartOne.title"
                placeholder="请输入表单标题"
                :maxLength="20"
                :showCount="true"
                size="default"
              >
              </fa-input>
            </fa-form-model-item>
            <fa-form-model-item label="表单说明" prop="describe" class="form-desc comm-model">
              <fa-input
                type="textarea"
                class="formDescArea"
                placeholder="请输入表单说明"
                :maxLength="50"
                :showCount="true"
                v-model="editAccountInfoPartOne.describe"
              >
              </fa-input>
            </fa-form-model-item>
            <fa-form-model-item label="背景图片" class="form-bgImg comm-model">
              <div class="imgBox">
                <div class="flexRowBox">
                  <global-ts-fai-img-upload-style-box
                    name="filedata"
                    :file-list="formBgImgList"
                    id="materialUploadBox"
                    class="materialUploadBox"
                    :limit="1"
                    @upload-click="
                      () => {
                        formBgUploadVisible = true;
                      }
                    "
                    @remove="removeFormBg"
                  >
                  </global-ts-fai-img-upload-style-box>
                  <global-ts-file-select-upload-dialog
                    :dialog-visible.sync="formBgUploadVisible"
                    :limit-num="1"
                    accept-type="img"
                    @success="formBgUploadSuccess"
                  >
                  </global-ts-file-select-upload-dialog>
                </div>
                <p class="desc">请上传jpg、png格式的图片，图片尺寸：750px*1624px</p>
              </div>
            </fa-form-model-item>
            <fa-form-model-item label="提交次数" class="form-submit comm-model">
              <div class="radioBoxWrap">
                <div class="radioBox">
                  <span v-for="(item, index) in submitNumList" :key="index">
                    <input v-model="commitNumType" type="radio" :value="item.key" :id="'submit' + index" />
                    <label :for="'submit' + index">{{ item.value }}</label>
                  </span>
                </div>
                <p class="desc">设置每位用户可以提交表单的次数</p>
              </div>
            </fa-form-model-item>
            <div class="drag-wrap">
              <boxDialog
                :currentItem="currentItem"
                :isDialog.sync="isDialog"
                :selectDragData="currentOptions"
                @saveOptions="saveOptions"
              >
                <div class="optionsWrap">
                  <div class="numberWrap">
                    选项<span>（数量{{ currentOptions.length }}/10）</span>
                  </div>
                  <slicksortList
                    lockAxis="y"
                    v-model="currentOptions"
                    :pressThreshold="10"
                    :lockToContainerEdges="true"
                    lockOffset="50px"
                  >
                    <sortItem
                      v-for="(item, index) in currentOptions"
                      :index="index"
                      :key="index"
                      :item="item"
                      :greyDelIcon="greyOptionIcon"
                      dragType="options"
                      @changeOptions="deleteOptions"
                      @updateOptions="updateOptions"
                      @changeItemData="(...args) => changeCurrentOptionsItem(...args, 'currentOptions')"
                    >
                    </sortItem>
                  </slicksortList>
                  <div
                    class="addBtn mainColor flex flex-hc flex-vc "
                    :class="{ isGrey: currentOptions.length >= 10 }"
                    @click="addOptions"
                  >
                    <global-ts-svg-icon class="icon icon_16" name="icon-tianjia1616"></global-ts-svg-icon>
                    <span>添加选项</span>
                  </div>
                </div>
              </boxDialog>
              <slicksortList
                lockAxis="y"
                v-model="dragData"
                :pressThreshold="10"
                :lockToContainerEdges="true"
                lockOffset="50px"
              >
                <sortItem
                  v-for="(item, index) in dragData"
                  :index="index"
                  :key="item.webFlag"
                  :item="item"
                  :greyDelIcon="greyDelIcon"
                  :isEdit="isEdit"
                  dragType="drag"
                  @handleChange="changeValue"
                  @showDialog="showDialog"
                  @changeItemData="(...args) => changeCurrentOptionsItem(...args, 'dragData')"
                >
                  <global-ts-error class="hidePicture checkOption" slot="checkOption" v-if="checkErrorOption(item)">
                    <template v-slot:errorTips>请设置选项</template>
                  </global-ts-error>
                </sortItem>
              </slicksortList>
            </div>
            <div class="addBtnWrap">
              <div class="addBtn flex flex-vc flex-hc" @click="toShowInput">
                <global-ts-svg-icon class="icon icon_16" name="icon-tianjia1616"></global-ts-svg-icon>
                <span class="iconText">添加</span>
              </div>
              <div class="inputController" :class="{ showInput: showInput }">
                <div class="inputItem" v-for="(item, index) in addInputController" :key="index" @click="addDrag(item)">
                  {{ item.typeText }}
                </div>
              </div>
            </div>
          </fa-form-model>
        </div>
        <div class="rightPart min-rightPart">
          <global-ts-phoneiframe
            ref="phoneIframe"
            refName="formIframe"
            :src="iframeUrl"
            :fillScroll="true"
            :isInnerIframe="true"
            @loaded="loading"
          >
            <template #header>
              <span class="formTitle ellispsis">{{ editAccountInfoPartOne.title || '请输入表单标题' }}</span>
            </template>
            <div slot="footer" class="formBottom">提交</div>
          </global-ts-phoneiframe>
        </div>
      </div>
      <div class="secondStep" v-if="step == 2">
        <ts-gfwtips :isShow.sync="isSecondShow" tipContent="请勿添加虚假营销、政治敏感等违规内容！"></ts-gfwtips>
        <fa-form-model ref="secondStepRef" layout="vertical" :model="editAccountInfo" :rules="secondRules">
          <fa-form-model-item label="表单分享标题" prop="coverTitle">
            <fa-input
              v-if="step == 2"
              class="accountName"
              placeholder="请输入表单分享标题"
              :maxLength="100"
              v-model="editAccountInfo.coverTitle"
            >
            </fa-input>
          </fa-form-model-item>

          <fa-form-model-item label="表单分享正文" prop="coverContent">
            <fa-input
              v-if="step == 2"
              class="accountName"
              placeholder="请填写表单信息，以便我们更好的为您提供服务"
              type="textarea"
              :maxLength="140"
              v-model="editAccountInfo.coverContent"
            >
            </fa-input>
          </fa-form-model-item>

          <fa-form-model-item prop="coverImgUrl" class="articlePicture">
            <template #label>
              <span>
                表单分享缩略图
                <span class="pictureTips"> 请上传jpg、png格式的图片，建议尺寸为60*60px（不超过1M）</span>
              </span>
            </template>
            <global-ts-fai-img-upload-style-box
              :class="isMax ? 'disabled' : ''"
              :file-list="fileList"
              id="materialUploadBox"
              @upload-click="
                () => {
                  tanshuFileSelectUploadVisible = true;
                }
              "
              @remove="removeCoverImage"
            >
            </global-ts-fai-img-upload-style-box>

            <global-ts-file-select-upload-dialog
              :dialog-visible.sync="tanshuFileSelectUploadVisible"
              :limit-num="1"
              accept-type="img"
              @success="uploadSuccess"
            >
            </global-ts-file-select-upload-dialog>
          </fa-form-model-item>
        </fa-form-model>
      </div>
    </template>
    <template v-slot:card-box-bottom>
      <div class="bottomBtn">
        <global-ts-button v-if="step == 1" class="orderEdit_cancel" type="others" size="small" @click="backManage">
          取消
        </global-ts-button>
        <global-ts-button v-if="step == 1" class="em_add_emp" type="primary" size="small" @click="nextStep">
          下一步
        </global-ts-button>
        <global-ts-button class="orderEdit_cancel" type="others" v-if="step == 2" size="small" @click="lastStep">
          上一步
        </global-ts-button>
        <global-ts-button v-if="step == 2" class="em_add_emp" type="primary" size="small" @click="saveModel">
          保存
        </global-ts-button>
      </div>
    </template>
  </global-ts-card-box>
</template>

<script>
import TsGfwtips from '@/components/base/ts-gfwtips/index.vue';
import { filterData, decodeHtml, getUrL, loading } from '@/utils';
import { mapState } from 'vuex';
import TsCommDef from '@/config/ts-comm-def';
import direct_defaultImgIMG from '@/assets/image/createForm/direct_defaultImg.png';
import slicksortList from './components/slicksort-list/index.vue';
import sortItem from './components/sort-item/index.vue';
import boxDialog from './components/box-dialog/index.vue';
import { getFormTempEditInfo, saveTsFormTemp } from '@/api/modules/views/customer-tools/create-form';
let webFlag = 103; // 前端设置的唯一标识

export default {
  name: 'CreateForm',
  components: { slicksortList, sortItem, boxDialog, TsGfwtips },
  data() {
    return {
      templateId: this.$route.query.templateId, // 这里不再进行赋值，作为判断是否是编辑标识
      isDialog: false, // 单多选选项框
      showInput: false, // 是否展示input添加面板
      editAccountInfoPartOne: {
        // 表单内容
        title: '', // 表单的标题
        describe: '', // 表单说明
      },
      editAccountInfo: {
        // 表单内容
        title: '', // 表单的标题
        describe: '', // 表单说明
        coverTitle: '', // 表单的分享标题
        coverContent: '', // 表单的分享正文内容
        coverImgUrl: this.defaultCoverImg, // 表单分享缩略图
      },
      step: 1,
      isFirstShow: true,
      isSecondShow: true,
      dragData: [
        {
          // 拖拽的数据
          formItemType: 1,
          typeText: '单行文本',
          name: '姓名', // 表单的标题
          value: '', //  表单的默认值
          required: true, //  是否必选
          webFlag: 0,
        },
        {
          formItemType: 3,
          typeText: '手机',
          name: '手机',
          value: '',
          required: true, // 是否必选
          webFlag: 1,
        },
      ],
      currentItem: null, // 当前单选/多选输入框的数据
      currentIndex: -1, // 当前单选/多选输入框的数据对应dragData的下标值
      currentOptions: [], // 当前单选或者多选弹窗的选项列表
      // 添加表单项时会将表单的item添加上去，并加上name/value/required
      addInputController: [
        {
          // 可选择的输入框类型
          formItemType: 1,
          typeText: '单行文本',
          name: '',
          maxlength: 20,
        },
        {
          formItemType: 2,
          typeText: '多行文本',
          name: '',
          maxlength: 50,
        },
        {
          formItemType: 3,
          typeText: '手机',
          name: '',
          maxlength: 11,
        },
        {
          formItemType: 4,
          typeText: '邮箱',
          name: '',
          maxlength: 50,
        },
        {
          formItemType: 5,
          typeText: '单选',
          name: '',
          maxlength: 20,
          optionFlag: '可以', // 这里默认一定要是可以
          isShowList: false,
          data: [''], // 该字段data和后端返回的需要同步
        },
        {
          formItemType: 6,
          typeText: '多选',
          optionFlag: '可以', // 这里默认一定要是可以
          name: '',
          maxlength: 20,
          isShowList: false,
          data: [''], // 该字段data和后端返回的需要同步
        },
        {
          formItemType: 7,
          typeText: '时间',
          name: '',
          maxlength: 20,
        },
        {
          formItemType: 8,
          typeText: '日期',
          name: '',
          maxlength: 20,
        },
      ],
      filesInfo: {},
      picture: '可以',
      greyDelIcon: false, // 是否置灰按钮
      greyOptionIcon: false, // 是否置灰选项的按钮
      del: [], // 编辑时，存放用户删除的输入项
      finishInit: false, // 是否已经加载过iframe了
      fileAcceptCal: '.jpg,.jpeg,.png,.JPG,.JPEG,.PNG',
      isMax: false,
      fileList: [],
      uploadUrl: getUrL('/ajax/upload_h.jsp?cmd=uploadTmpFile'),
      dragDataNew: [],
      hasOptionCheckError: false, // 是否在点击下一步检查出选项为空错误 (针对第一页)
      checkSubmit: false, // 是否有表单项未填 (针对第一页)
      currentCheckDragData: [], // 点击下一步时，当前的拖拽数据
      coverImgUrl: '',
      folderType: TsCommDef.FolderType.PERSON_SYS_FORM,
      tanshuFileSelectUploadVisible: false,
      formBgUploadVisible: false, // 表单背景图
      submitNumList: [
        {
          key: 0,
          value: '一次',
        },
        {
          key: 1,
          value: '不限',
        },
      ],
      commitNumType: 0,
      formBgImgList: [],
      bgImgUrl: '', // 表单背景
      hasLoadContent: false,
    };
  },
  computed: {
    ...mapState({
      addressUrl: state => state.globalData.addressUrl,
      iframeUrl: state => state.globalData.addressUrl?.formiFramePreView,
    }),
    recoverDefault() {
      return {
        // 表单内容
        title: '', // 表单的标题
        describe: '', // 表单说明
        coverTitle: '', // 表单的分享标题
        coverContent: '', // 表单的分享正文内容
        coverImgUrl: this.defaultCoverImg, // 表单分享缩略图
      };
    },
    // 默认缩略图
    defaultCoverImg() {
      return direct_defaultImgIMG;
    },
    // 是否是编辑
    isEdit() {
      return Boolean(this.templateId);
    },
    realDragData() {
      const dragData = this.dragData.filter(item => {
        return item.name;
      });
      return dragData.length;
    },
    firstRules() {
      return {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 0, max: 20, message: '标题不能超过20个字符', trigger: 'blur' },
        ],
      };
    },
    secondRules() {
      return {
        coverTitle: [
          { required: true, message: '请输入表单分享标题', trigger: 'blur' },
          { min: 0, max: 100, message: '标题不能超过100个字符', trigger: 'blur' },
        ],
        coverContent: [
          { required: true, message: '请输入表单分享正文', trigger: 'blur' },
          { min: 0, max: 140, message: '表单分享正文不能超过140个字符', trigger: 'blur' },
        ],
        coverImgUrl: [{ required: true, message: '请上传缩略图', trigger: 'blur' }],
      };
    },
  },
  watch: {
    // 哎。用不了MutationObserver监听元素高度变化，只能监听数据变化了
    realDragData() {
      this.checkIframeLoading().then(() => {
        this.$refs.phoneIframe.updateScroll();
      });
    },
    bgImgUrl() {
      this.setPreviewData('bgImgUrl', this.bgImgUrl);
    },
    dragData(value) {
      if (value.length <= 1) {
        this.greyDelIcon = true;
      } else {
        this.greyDelIcon = false;
      }
      this.setIframeData();
      this.checkHasNullOptions(value);
    },
    currentOptions(value) {
      if (value.length <= 1) {
        this.greyOptionIcon = true;
      } else {
        this.greyOptionIcon = false;
      }
      console.log('currentOptions', value);
    },
    editAccountInfo: {
      handler(newName, oldName) {
        console.log('this.editAccountInfo.coverImgUrl', this.editAccountInfo.coverImgUrl);
        if (this.editAccountInfo.coverImgUrl) {
          this.picture = '可以';
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    loading.addQuene({
      key: 'createForm',
    });
  },
  methods: {
    /**
     * @description 设置右侧手机iframe的数据
     * @author enson
     * @date 2020-06-02
     */
    setIframeData() {
      // 对象存在于堆内存中，让H5的formInitData的对象也指向这个内存地址
      // console.log(this.$refs.phoneIframe.$refs.formIframe.contentWindow.appInfo);
      //review
      this.$refs.phoneIframe &&
        this.$refs.phoneIframe.$refs.formIframe &&
        this.$set(this.$refs.phoneIframe.$refs.formIframe.contentWindow.appInfo, 'formInitData', {
          itemList: [...this.dragData],
          editAccountInfo: this.editAccountInfoPartOne,
        });
      this.$refs.phoneIframe && this.$refs.phoneIframe.updateScroll();
    },
    // 等待iframe的Loading完成才能进入下一步操作
    checkIframeLoading() {
      const chekStatus = resloveFn => {
        if (this.hasLoadContent) {
          resloveFn();
        } else {
          setTimeout(() => {
            chekStatus(resloveFn);
          }, 100);
        }
      };
      return new Promise(reslove => {
        chekStatus(reslove);
      });
    },
    setPreviewData(key, value) {
      this.checkIframeLoading().then(() => {
        const formIframe = this.$refs.phoneIframe.$refs.formIframe;
        formIframe.contentWindow.appInfo[key] = value;
      });
    },
    /**
     * 这里是整个项目的入口！！！！ created
     * @description 监听iframe是否已经加载完成
     * @author enson
     * @date 2020-05-29
     */
    loading() {
      this.hasLoadContent = true;
      this.init();
    },
    /**
     * 检查单选/多选选项是否为空
     * @author enson
     * @date 2020-07-08
     * @returns
     */
    checkOptionIsNull() {
      let isNull = false;

      this.dragData.forEach(item => {
        if ([5, 6].includes(item.formItemType)) {
          console.log('item.data----》', item.data);
          if (item.data.indexOf('') != -1) {
            item.optionFlag = '不可以';
            isNull = true;
          }
        }
      });

      this.hasOptionCheckError = isNull;
      return isNull;
    },
    nextStep() {
      const keys = Object.keys(this.firstRules);
      this.$refs.formContentRef.validate(async (valid, data = {}) => {
        // 检查是否有错误
        if (!valid) {
          let message = '';
          keys.some(key => {
            if (data[key]) {
              message = data[key][0]?.message;
              return true;
            }
          });
          this.$utils.postMessage({
            type: 'error',
            message,
          });
          return;
        }
        this.checkOptionIsNull();

        if (this.hasOptionCheckError) {
          this.$utils.postMessage({
            type: 'error',
            message: '单选/多选题至少要输入一个选项',
          });
          return;
        }

        const flag = this.dragData.every(item => {
          if (!item.name) {
            this.$utils.postMessage({
              type: 'error',
              message: '输入框名称不能为空',
            });
          }
          return item.name;
        });

        if (!flag) {
          return;
        }

        // 表单分享标题没有值的时候会给他赋值
        if (!this.editAccountInfo.coverTitle) {
          this.editAccountInfo.coverTitle = this.editAccountInfoPartOne.title;
        }
        console.log('this.editAccountInfo.coverImgUrl - nextClick', this.editAccountInfo.coverImgUrl);
        if (this.editAccountInfo.coverImgUrl) {
          console.log(this.editAccountInfo, 'editAccountInfo');
          this.fileList = [
            {
              uid: -1,
              name: this.editAccountInfo.coverTitle,
              url: this.editAccountInfo.coverImgUrl,
            },
          ];
          this.isMax = true;
        } else {
          this.fileList = [];
        }

        this.editAccountInfo = Object.assign(this.editAccountInfo, this.editAccountInfoPartOne);
        this.dragDataNew = JSON.parse(JSON.stringify(this.dragData));
        this.step = 2;
      });
    },
    /**
     * @description 返回企业表单页面
     * @author enson
     * @date 2020-05-15
     */
    backManage() {
      this.$router.push({
        path: '/formManage',
      });
    },
    /**
     * @description 保存修改过的表单 | 新建表单
     * @author enson
     * @date 2020-05-15
     * @returns
     */
    saveModel() {
      const keys = Object.keys(this.secondRules);
      this.$refs.secondStepRef.validate(async (valid, data = {}) => {
        // 检查是否有错误
        if (!valid) {
          let message = '';
          keys.some(key => {
            if (data[key]) {
              message = data[key][0]?.message;
              return true;
            }
          });
          this.$utils.postMessage({
            type: 'error',
            message,
          });
          return;
        }
        // 整合成后端小哥哥想要的格式
        const formItemJsonStr = [];
        this.dragDataNew.forEach((element, index) => {
          element = filterData(element, ['name', 'formItemType', 'data', 'id', 'required']);
          console.log('element.required', element.required);
          formItemJsonStr.push(
            Object.assign(
              {},
              element,
              {
                sort: index + 1,
              },
              {
                required: Number(element.required) || 0,
              },
            ),
          );
        });
        let editData = {};
        if (this.templateId) {
          // 编辑
          editData = Object.assign({
            templateId: this.templateId,
            del: JSON.stringify(this.del),
          });
        }
        const [err, response] = await saveTsFormTemp(
          Object.assign(
            {},
            this.editAccountInfo,
            {
              commitNumType: this.commitNumType,
              bgImgUrl: this.bgImgUrl,
            },
            editData,
            {
              formItemJsonStr: JSON.stringify(formItemJsonStr),
            },
          ),
        );
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        this.$utils.postMessage({
          type: 'success',
          message: response.msg || '添加表单成功',
        });
        console.log(!this.templateId);
        console.log('记录添加关键行为');
        !this.templateId && this.$utils.ActLog('ADD_FORM_TEMPLATE');
        this.$utils.logDog('form_saveModel');
        this.$utils.FdpLog('yx_bjbdmb');
        this.backManage();
      });
    },
    /**
     * @description 返回上一步
     * @author enson
     * @date 2020-05-15
     */
    lastStep() {
      /***
				 * 主要是遇到了一个IE+iframe的坑 当iframe消失的时候变量被释放掉了
				   因此通过不同内存地址的变量暂存
				   因此 第一页使用editAccountInfoPartOne(第一页用到的地方只用表单信息的双向数据绑定), 第二页使用dragDataNew数据(第二页仅保存的时候用到而已)
				 */
      this.editAccountInfoPartOne = Object.assign(
        {},
        {
          title: this.editAccountInfo.title, // 表单的标题
          describe: this.editAccountInfo.describe, // 表单说明
        },
      );
      this.dragData = JSON.parse(JSON.stringify(this.dragDataNew));
      this.step = 1;
    },
    /**
     *上传前校验
     *
     * @author guoyijie
     * @date 2020-05-20
     * @param {*} file
     * @returns
     */
    beforeUpload(file) {
      if (file.name && file.name.includes('.')) {
        const fileNames = file.name.split('.');
        const suffixName = fileNames[fileNames.length - 1];
        if (!this.fileAcceptCal.includes(suffixName)) {
          this.$utils.postMessage({
            type: 'error',
            message: '读取图片错误，建议您先使用图像处理软件转换图片格式',
          });
          return false;
        }
        const limitSize = file.size / 1024 / 1024;
        if (limitSize > 1) {
          this.$utils.postMessage({
            type: 'error',
            message: '上传失败：单个文件的大小超过1M',
          });
          return false;
        }
      } else {
        this.$utils.postMessage({
          type: 'error',
          message: '上传失败',
        });
        return false;
      }
    },
    /**
     * 完成上传的回调
     *
     * @author guoyijie
     * @date 2020-05-20
     * @param {*} res
     */
    uploadSuccess(res) {
      const file = res[0];
      const flag = this.beforeUpload(file);
      if (flag === false) {
        return;
      }
      this.fileList = [
        {
          uid: file.id,
          name: file.name,
          url: file.content,
        },
      ];
      this.isMax = true;
      this.editAccountInfo.coverImgUrl = file.content;
    },
    /**
     *删除图片
     *
     * @author guoyijie
     * @date 2020-05-20
     * @param {*} file
     */
    removeCoverImage() {
      this.isMax = false;
      this.picture = '';
      this.editAccountInfo.coverImgUrl = '';
    },
    /**
     * @description 页面初始化调用的函数
     * @author enson
     * @date 2020-05-14
     */
    init() {
      loading.poupQuene('createForm');

      // 已经加载过的话，只需要重新绑定一下数据即可
      if (this.finishInit) {
        this.setIframeData();
        return;
      }

      // 编辑
      if (this.templateId) {
        this.getEditFormData();
      } else {
        this.editAccountInfoPartOne = Object.assign(
          {},
          {
            title: '', // 表单的标题
            describe: '', // 表单说明
          },
        );
        this.editAccountInfo = Object.assign({}, this.recoverDefault);
      }

      this.setIframeData();
      this.finishInit = true; // 防止点击下一步/上一步的时候iframe重新加载又执行了init函数,导致用户自己编写的数据丢失
    },
    /**
     * @description 在企业表单页面点击编辑后获取数据
     * @author enson
     * @date 2020-06-01
     */
    async getEditFormData() {
      const [err, response] = await getFormTempEditInfo({
        templateId: this.templateId,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const data = response.data;
      let { description: describe } = data;
      const { title, coverTitle, content: coverContent, coverImg: coverImgUrl, commitNumType, bgImgUrl } = data;
      describe = decodeHtml(describe);
      this.editAccountInfo = {
        // 表单内容
        title, // 表单的标题
        describe, // 表单说明
        coverTitle, // 表单的分享标题
        coverContent, // 表单的分享正文内容
        coverImgUrl, // 表单分享缩略图
      };
      this.editAccountInfoPartOne = {
        title, // 表单的标题
        describe, // 表单说明
      };
      this.commitNumType = commitNumType; // 表单提交次数限制
      this.bgImgUrl = bgImgUrl; // 背景图
      if (bgImgUrl) {
        this.formBgImgList = [
          {
            uid: -1,
            name: 'bgImgUrl',
            url: bgImgUrl,
          },
        ];
      }
      this.dragData = this.setDragData(data.itemList);
      // console.log('this.dragData', this.dragData);
      return Promise.resolve('');
    },
    /**
     * @description 编辑时设置一下前端需要的字段typeText
     * @author enson
     * @date 2020-06-01
     * @param {*} data - 拖拽数据
     */
    setDragData(data) {
      // formItemType 1-单行文本 2-多行文本 3-手机 4-邮箱 5-单选 6-多选 7-时间 8-日期
      const typeTextList = ['单行文本', '多行文本', '手机', '邮箱', '单选', '多选', '时间', '日期'];
      data.forEach(item => {
        item.webFlag = item.id;
        if (item.formItemType == 6) {
          // 多选
          item.value = []; // 返回的数据是不存在value这个字段的, 对于多选，在H5中需要是数组
          item.preValue = [];
        }
        if ([5, 6].includes(item.formItemType)) {
          item.isShowList = false; // 用于H5显示弹窗
          item.optionFlag = '可以'; // 编辑时都是有数据的
        }
        item.required = Boolean(item.required);
        item.typeText = typeTextList[item.formItemType - 1];
      });
      return data;
    },
    /**
     * @description 切换input的添加面板
     * @author enson
     * @date 2020-05-19
     */
    toShowInput() {
      if (this.dragData.length >= 10) {
        this.$utils.postMessage({
          type: 'error',
          message: '输入框不超过10个',
        });
        return;
      }

      this.showInput = !this.showInput;
      //review
      this.showInput &&
        this.$nextTick(() => {
          const domObj = this.$refs['cardBox-body'].$refs['tanshu-cardBox-body'];
          domObj.scrollTop = domObj.scrollHeight;
        });
    },
    /**
     * @description 添加表单填写项
     * @author enson
     * @date 2020-05-19
     */
    addDrag(item) {
      this.showInput = false;
      if (this.dragData.length >= 10) {
        this.$utils.postMessage({
          type: 'error',
          message: '输入框不超过10个',
        });
        return;
      }
      // 表单输入框通用的数据
      const commData = {
        value: item.formItemType == 6 ? [] : '', // 如果是多选的话，是一个空数组
        required: false, // 是否必选
      };
      if (item.formItemType == 6) {
        commData.preValue = [];
      }
      const addData = JSON.parse(JSON.stringify(item)); // 这里需要深拷贝
      this.dragData.push(Object.assign({}, addData, commData, { webFlag: ++webFlag }));
      this.$nextTick(() => {
        const domObj = this.$refs['cardBox-body'].$refs['tanshu-cardBox-body'];
        domObj.scrollTop = domObj.scrollHeight;
      });
    },
    /**
     * @description 单多选输入框 点击选项后执行的方法
     * @author enson
     * @date 2020-07-13
     * @param {*} item
     * @param {*} index
     * @returns
     */
    toSetOptions(item, index) {
      if (!item.data) {
        return;
      }
      this.currentIndex = index;
      this.currentItem = item;
      this.currentOptions = [].concat(item.data);
    },
    /**
     * @description 点击必选/删除按钮后的回调函数
     * @author enson
     * @date 2020-05-25
     * @param {*} item - 对应输入框的数据
     * @param {*} type - 类型
     */
    changeValue(item, type) {
      console.log(type);
      switch (type) {
        case 'update': // 点击了必选按钮
          console.log('item---->', item);
          this.dragData = Object.assign(this.dragData, item);
          break;
        case 'delete': // 点击了删除按钮
          const deleteIndex = this.dragData.indexOf(item);
          if (item.id) {
            this.del.push(this.dragData[deleteIndex]);
          }
          this.dragData.splice(deleteIndex, 1);
          break;
      }
    },
    /**
     * @description 单多选输入框 点击选项后执行的方法
     * @author enson
     * @date 2020-05-25
     * @param {*} item - 单选/多选输入框对应的数据
     */
    showDialog(item, index) {
      this.isDialog = true;
      this.toSetOptions(item, index);
    },
    /**
     * @description 弹窗中点击添加按钮执行的函数
     * @author enson
     * @date 2020-05-25
     */
    addOptions() {
      if (this.currentOptions.length >= 10) return;
      const defaultOptionValue = ''; // 单选/多选输入框选项默认值
      this.currentOptions.push(defaultOptionValue);
    },
    /**
     * @description 单/多选弹窗点击删除按钮执行的函数
     * @author enson
     * @date 2020-07-13
     * @param {*} index
     * @returns
     */
    deleteOptions(index) {
      if (this.currentOptions.length <= 0 || index === -1) return;
      this.currentOptions.splice(index, 1);
    },
    /**
     * @description 单/多选弹窗更新选项的值
     * @author enson
     * @date 2020-07-13
     * @param {*} index
     * @param {*} value
     */
    updateOptions(index, value) {
      this.$set(this.currentOptions, index, value);
      console.log('this.currentOptions', this.currentOptions);
    },
    /**
     * @description 单选/多选输入框弹窗后保存选项的操作
     * @author enson
     * @date 2020-05-26
     */
    saveOptions() {
      if (this.currentIndex === -1) {
        this.$utils.postMessage({
          type: 'error',
          message: '保存失败，请刷新重试',
        });
      }
      this.$set(this.dragData[this.currentIndex], 'optionFlag', '可以');
      this.$set(this.dragData[this.currentIndex], 'data', this.currentOptions);
      this.checkHasNullOptions(this.dragData);
    },
    checkErrorOption(item) {
      return [5, 6].includes(item.formItemType) && item.optionFlag === '不可以';
    },
    /**
     * 检查是否有optionFlag 等于 ‘不可以’的单多选框
     * 即检查点击完下一步后，哪些输入框是没有填写选项的（根据optionFlag可以排除新增的单/多选输入框）
     * @author enson
     * @date 2020-07-14
     */
    checkHasNullOptions(value) {
      this.hasOptionCheckError = value.some(item => {
        if ([5, 6].includes(item.formItemType) && item.optionFlag === '不可以') {
          return true;
        } else {
          return false;
        }
      });
    },
    /**
     * 完成表单背景图上传的回调
     *
     * @author guoyijie
     * @date 2020-05-20
     * @param {*} res
     */
    formBgUploadSuccess(res) {
      const file = res[0];
      const flag = this.beforeUpload(file);
      if (flag === false) {
        return;
      }
      this.formBgImgList = [
        {
          uid: file.id,
          name: file.name,
          url: file.content,
        },
      ];
      this.bgImgUrl = file.content;
    },
    /**
     * @description 删除表单背景
     * @author enson
     * @date 2021-05-25
     */
    removeFormBg() {
      const { formBgImgList, bgImgUrl } = this.$options.data.call(this);
      this.formBgImgList = formBgImgList;
      this.bgImgUrl = bgImgUrl;
    },
    /**
     * @description : 更新数据
     * @author      : ADI
     * @Date        : 2021-07-01 09:46:51
     * @param        {*} item
     * @param        {*} index
     * @return       {*}
     */
    changeCurrentOptionsItem(item, index, dataName) {
      this.$set(this[dataName], index, item);
    },
  },
};
</script>

<style lang="scss" scoped>
.createForm {
  .firstStep {
    display: flex;
    .inputController {
      width: 100%;
      height: 0;
      margin-top: 4px;
      overflow: hidden;
      font-size: 14px;
      color: $color-53;
      text-align: center;
      cursor: pointer;
      background: $color-ff;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgb(0 0 0 / 16%);
      box-sizing: border-box;
      &.showInput {
        height: 88px;
      }
      .inputItem {
        position: relative;
        float: left;
        width: 25%;
        height: 44px;
        line-height: 44px;
        cursor: pointer;
        &:hover {
          color: $primary-color;
        }
        &:nth-child(-n + 3)::before {
          position: absolute;
          right: 0;
          bottom: 0;
          display: block;
          width: 1px;
          height: 24px;
          background: #eeeeee;
          content: '';
        }
        &:nth-child(n + 5)::before {
          position: absolute;
          top: 0;
          right: 0;
          display: block;
          width: 1px;
          height: 24px;
          background: #eeeeee;
          content: '';
        }
        &:last-child::before {
          background: transparent;
        }
      }
    }
    .leftPart {
      position: relative;
      width: 990px;
      min-width: 576px;
      padding: 20px 10px 50px 20px;
      overflow-x: hidden;
      overflow-y: auto;
      box-sizing: border-box;
      flex: 1 1 auto;
      ::v-deep .tanshu_gfwTips {
        .warnTips {
          margin-bottom: 20px;
        }
      }
      .hideContent {
        position: absolute;
        top: 528px;
        left: 3px;
        z-index: 0;
        width: 300px;
        .tanshu_input_contain {
          height: 0 !important;
        }
      }
      .closeStatusContent {
        top: 473px;
      }
    }
    .rightPart {
      display: flex;
      width: 612px;
      min-width: 400px;
      padding-top: 60px;
      justify-content: center;
      flex: 1 1 auto;
      .ts-phoneIframe {
        &.phoneBox {
          position: fixed;
          top: auto;
          right: auto;
        }
      }
    }
    .linkBox {
      & > div {
        &.inputContainer {
          width: 482px;
        }
        .tanshu-button {
          margin-top: 20px;
        }
      }
    }
    .addBtnWrap {
      position: relative;
      width: 100%;
      margin-top: 12px;
      .addBtn {
        height: 40px;
        font-size: 14px;
        line-height: 40px;
        color: $color-89;
        text-align: center;
        cursor: pointer;
        border: 1px dashed $border-color;
        border-radius: 4px;
        box-sizing: border-box;
        &:hover {
          color: $primary-color;
          border: 1px dashed $primary-color;
          .iconText {
            color: $primary-color;
          }
        }
        .iconText {
          color: $color-53;
        }
      }
    }
    .form-desc {
      .formDescArea {
        .tanshu_input_contain {
          height: auto;
        }
        &.tshu_input {
          .tanshu_err {
            top: 120px;
          }
        }
      }
    }
    .edui-editor {
      position: relative;
      height: 450px;
      overflow: visible;
      background-color: #f4f4f4;
      border: 1px solid #cccccc;
    }
    .content-header {
      display: flex;
      width: 82px;
      height: 34px;
      min-width: 82px;
      margin-right: 12px;
      font-size: 14px;
      line-height: 34px;
      color: $color-53;
      text-align: right;
      align-items: center;
      justify-content: flex-end;
    }
    .tanshu_input_contain {
      height: 34px;
    }
    .tanshu_err {
      /* margin-top: 0; */
    }
    .imgBox {
      .flexRowBox {
        height: 108px;
        overflow: hidden;
      }
      ::v-deep .fa-upload {
        &.fa-upload-select-picture-card {
          margin-bottom: 4px;
        }
      }
    }
  }
  .secondStep {
    width: 742px;
    margin: 30px auto;
    & > div {
      margin-top: 30px;
      .pictureShow {
        position: relative;
        overflow: hidden;
        text-align: center;
        .warp {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 100;
          width: 100%;
          height: 100%;
          background: #000000;
          opacity: 0;
          &:hover {
            opacity: 0.3;
            transition: 0.5s;
          }
        }
        & > img {
          width: 120px;
          height: 120px !important;
        }
        & > .warp {
          & > svg {
            cursor: pointer;
          }
        }
        .icon {
          width: 20px;
          height: 20px;
          margin-right: 0 !important;
          fill: #ffffff;
        }
      }
      .addPictureBox {
        .addIcon {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          margin-top: -10px;
          margin-left: -10px;
          overflow: hidden;
          vertical-align: -0.15em;
          fill: $color-b2;
        }
        & > span {
          padding-left: 5px;
          margin-top: 25px;
          font-size: 14px;
          line-height: 220px;
          color: $color-b2;
        }
        input {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 100;
          width: 148px;
          height: 148px;
          opacity: 0;
        }
      }
    }
    textarea {
      height: 100px;
      padding: 10px 10px;
      font: 400 13.3333px Arial;
    }
    div {
      &:nth-of-type(3) {
        .accountName {
          .tanshu_err {
            margin-top: 58px;
          }
        }
      }
    }
    .articlePicture {
      position: relative;
      .tshu_input {
        .tanshu_err {
          top: 70px;
        }
      }
    }
    .hidePicture {
      position: absolute;
      top: 105px;
      left: 0;
      z-index: 0;
      width: 300px;
    }
    .pictureTips {
      width: 100%;
      font-size: 12px;
      color: $color-b2;
    }
  }
  .rightPart {
    .phoneBox {
      .formTitle {
        position: absolute;
        top: 41px;
        right: 0;
        left: 0;
        display: inline-block;
        width: 17em;
        margin: auto;
        font-size: 12px;
        font-weight: bold;
        color: $color-ff;
        text-align: center;
      }
      .formBottom {
        position: absolute;
        top: 510px;
        right: 0;
        left: 0;
        width: 100%;
        height: 32px;
        margin: auto;
        font-size: 12px;
        line-height: 32px;
        color: $color-ff;
        text-align: center;
        cursor: pointer;
        background: #247af3;
        border-radius: 2px;
        transform: scale(0.8);
        box-sizing: border-box;
      }
    }
  }
  .detailPicture {
    width: 100%;
    margin: 30px auto;
    font-size: 14px;
    font-weight: 400;
    color: rgba(83, 83, 83, 1);
    text-align: center;
    img {
      width: auto;
      margin-top: 30px;
    }
  }
  .ellipsis2 {
    overflow: hidden;
    text-overflow: ellipsis;
    line-clamp: 2;
  }
  .redColor {
    color: $error-color;
  }
  .requiredColor {
    color: #f80530;
  }
  .mainColor {
    color: #247af3;
  }
  .comm-model {
    display: flex;
    margin-bottom: 28px;
    .desc {
      font-size: 12px;
      color: $color-b2;
    }
    .mustIcon {
      width: 6px;
      height: 14px;
      font-size: 6px;
    }
    .radioBoxWrap {
      .radioBox {
        display: flex;
        align-items: center;
        height: 34px;
        margin-bottom: 4px;
      }
    }
  }
  .drag-wrap {
    margin-top: 20px;
  }
  ::v-deep .ts-phoneIframe {
    &.phoneBox {
      &.iframeTyle_1 {
        .iframeWrap {
          position: absolute;
          top: 61px;
          width: 247px;
          height: 445px;
          margin: auto;
          margin-left: 19px;
          overflow: hidden;
          #previewPage {
            position: absolute;
            top: 0;
            left: 0;
            width: 247px;
            height: 445px;
            padding: 0;
            overflow-x: hidden;
            overflow-y: auto;
            color: rgba(31, 33, 31, 0.5);
            background: transparent;
            transform: scale(1);
          }
        }
      }
    }
  }
}
.createForm .secondStep > div .addPictureBox,
.createForm .secondStep > div .pictureShow {
  position: relative;
  width: 148px;
  height: 148px;
  margin-right: 50px;
  line-height: 146px;
  text-align: center;
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 4px;
  border-radius: 6px;
  box-sizing: border-box;
}
.edui-editor-iframeholder {
  height: 390px !important;
}
.createForm .em_add_emp,
.createForm .orderEdit_cancel {
  width: 140px;
}
</style>

<style lang="scss">
.createForm {
  .fa-input-show-count {
    width: 100%;
  }
  .el-date-editor {
    margin-right: 5px;
    cursor: pointer;
  }
  .firstStep {
    .linkBox {
      & > div {
        .el-dialog__body {
          text-align: center;
        }
      }
    }
    .leftPart {
      .hideContent {
        .el-input__inner {
          position: absolute;
          top: 0;
          left: 0;
          height: 0 !important;
          border: 0 none !important;
        }
      }
    }
    .el-input__inner {
      height: 34px;
    }
    .el-input__suffix {
      .el-input__suffix-inner {
        font-size: 12px;
        line-height: 34px;
      }
    }
  }
  .secondStep {
    .el-dialog {
      .tanshu-dialog {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -270px;
        margin-left: -270px;
      }
      .showPicture {
        max-height: 600px;
        overflow-y: scroll;
        text-align: center;
      }
    }
    div {
      &:nth-of-type(3) {
        .el-textarea {
          .el-textarea__inner {
            max-height: 100px;
            resize: none;
          }
        }
      }
    }
    .hidePicture {
      .el-input__inner {
        width: 100px !important;
        height: 0 !important;
        margin-top: -20px;
        border: 0 none !important;
      }
    }
  }
}
.createForm .rightPart .phoneBox .inputWrap .el-select,
.createForm .rightPart .phoneBox .inputWrap .el-date-editor.el-input {
  width: 100%;
}
.disabled {
  .el-upload--picture-card {
    display: none;
  }
}

.createForm {
  .tanshu-cardBox-bottom {
    text-align: center !important;
    .global-button {
      &:nth-of-type(1) {
        margin-right: 10px;
      }
    }
  }
  .firstStep {
    .form-desc {
      .formDescArea {
        & > textarea.fa-input {
          min-height: 100px;
        }
      }
    }
  }
}
.tshu_select {
  .tshu_select_input {
    .tshu_arrow {
      z-index: 1;
    }
  }
}
.view {
  max-width: 100%;
}
.createForm .secondStep .articlePicture #materialUploadBox .fa-upload,
.createForm .secondStep .articlePicture #materialUploadBox .fa-upload-list-picture-card-container,
.createForm .secondStep .articlePicture #materialUploadBox .fa-upload-list-picture-card .fa-upload-list-item {
  width: 146px;
  height: 146px;
}

/* adi: add from 对齐 */
.fa-form-item-label {
  & > :not(.fa-form-item-required) {
    padding-left: 11px;
  }
}

@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .el-date-editor .el-range-separator {
    line-height: 32px;
  }
}
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  /* IE10-specific styles go here */
  .createForm .firstStep .inputController.showInput {
    margin-bottom: 20px;
  }
  .createForm .firstStep {
    user-select: none;
  }
  /* stylelint-disable */

  .createForm :input-placeholder {
    color: #c0c4cc;
  }
  /* stylelint-enable */
  .createForm ::placeholder {
    color: #c0c4cc;
  }
}
@media (max-width: 1500px), (max-height: 850px) {
  .createForm .firstStep .rightPart.min-rightPart .ts-phoneIframe.phoneBox {
    position: relative;
    top: auto;
    right: auto;
  }
}
</style>
