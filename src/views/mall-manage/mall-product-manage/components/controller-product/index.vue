<!--
 * @Author       : ADI
 * @Date         : 2021-08-04 10:12:23
 * @LastEditors  : ADI
 * @LastEditTime : 2021-08-03 17:35:48
-->
<template>
  <div class="controllerProduct">
    <global-ts-card-box>
      <template v-slot:card-box-head>
        <div class="operateList">
          <global-ts-tabguide @backToPrePage="backManage">
            <template v-slot:leftPart>商品列表</template>
            <template v-slot:rightPart>{{ !isEdit ? '商品录入' : '商品编辑' }}</template>
          </global-ts-tabguide>
        </div>
      </template>
      <template v-slot:card-box-body>
        <div class="partContent">
          <div class="leftPart floatLeft">
            <div class="moduleWrap">
              <p class="moduleTitle">基础信息</p>
              <fa-form-model ref="controllerProductFormRef" layout="vertical" :model="productData" :rules="rules">
                <el-row>
                  <el-col :span="24">
                    <fa-form-model-item label="商品名称" prop="name">
                      <global-ts-input
                        size="large"
                        v-model="productData.name"
                        placeholder=""
                        :max-length="20"
                        :show-count="true"
                        :block="true"
                        @focus="saveBtnDisable = false"
                      >
                      </global-ts-input>
                    </fa-form-model-item>
                  </el-col>
                </el-row>
                <el-row class="comm-top">
                  <el-col :span="24">
                    <fa-form-model-item label="商品名称描述" prop="summary">
                      <global-ts-input
                        size="large"
                        v-model="productData.summary"
                        placeholder=""
                        :max-length="20"
                        :show-count="true"
                        :block="true"
                      >
                      </global-ts-input>
                    </fa-form-model-item>
                  </el-col>
                </el-row>
                <el-row class="comm-top">
                  <el-col :span="24">
                    <fa-form-model-item prop="_addImgUrlList">
                      <template #label>
                        <span class="content-header">
                          商品头图
                          <span class="des">
                            （请上传jpg、png格式的图片，最多添加15张图片，每张不超过1M）
                          </span>
                        </span>
                      </template>
                      <div class="productImgWrap">
                        <div class="productImgList">
                          <div class="productImage-wrap" v-for="(item, index) in addImgUrlList" :key="index">
                            <div class="productImage" :style="setProductImgStyle(item.url)"></div>
                            <i class="el-icon-close img-close" @click="removeMaterial(item, index)"></i>
                            <div class="productImage-hoverWrap">
                              <span class="setMainPic" v-show="!item.isCoverImg" @click="setMainPic(item, index)">
                                设置封面
                              </span>
                            </div>
                            <span v-show="item.isCoverImg" class="setMainPic">封面</span>
                          </div>
                          <el-upload
                            name="filedata"
                            :file-list="fileList"
                            id="materialUploadBox"
                            class="materialUploadBox"
                            action=""
                            :limit="15"
                            :multiple="false"
                            list-type="picture-card"
                            :show-file-list="false"
                            :on-exceed="overChooseImg"
                          >
                            <div
                              class="fileUploadSelect_pictureCardWrapper"
                              slot="trigger"
                              @click.stop="
                                () => {
                                  tanshuFileSelectUploadVisible = true;
                                }
                              "
                            >
                              <i class="el-icon-plus avatar-uploader-icon"></i>
                            </div>
                          </el-upload>

                          <global-ts-file-select-upload-dialog
                            :dialog-visible.sync="tanshuFileSelectUploadVisible"
                            :limit-num="15 - addImgUrlList.length"
                            accept-type="img"
                            @success="uploadSuccess"
                          >
                          </global-ts-file-select-upload-dialog>
                          <global-ts-input class="hidePicture" v-model="picture" placeholder=" "> </global-ts-input>
                        </div>
                      </div>
                    </fa-form-model-item>
                  </el-col>
                </el-row>
                <el-row class="comm-top productWrap">
                  <el-col :span="15">
                    <div class="content-header">商品价格</div>
                    <div class="productWrap-item flex flex-vc priceWrap">
                      <span v-for="(item, index) in priceTypeList" :key="index">
                        <input
                          v-model="productData.priceType"
                          type="radio"
                          :id="'priceTypeList' + index"
                          :value="item.key"
                        />
                        <label :for="'priceTypeList' + index" :class="{ selectSetPrice: selectSetPrice }">{{
                          item.value
                        }}</label>
                      </span>
                      <el-input
                        v-if="selectSetPrice"
                        :value="productData.price"
                        @input="moneyInput"
                        :max-length="15"
                        type="text"
                        class="priceWrap__input"
                      >
                      </el-input>
                    </div>
                  </el-col>
                  <el-col :span="9">
                    <div class="content-header">上架状态</div>
                    <div class="productWrap-item flex flex-vc">
                      <span v-for="(item, index) in productType" :key="index">
                        <input
                          v-model="productData.selfStatus"
                          type="radio"
                          :id="'productType' + index"
                          :value="item.key"
                        />
                        <label :for="'productType' + index">{{ item.value }}</label>
                      </span>
                    </div>
                  </el-col>
                </el-row>
              </fa-form-model>
            </div>
            <div class="moduleWrap" v-if="paramList.length > 0">
              <p class="moduleTitle">商品参数</p>
              <div class="module-param">
                <div class="module-param-item" v-for="(item, index) in paramList" :key="index">
                  <div class="module-param-content">
                    <p class="module-param-title">{{ item.name }}</p>
                    <fa-select
                      class="selectMallParam"
                      v-model="item.value"
                      mode="multiple"
                      style="width: 100%;"
                      placeholder="请选择"
                      option-label-prop="label"
                      :getPopupContainer="triggerNode => triggerNode.parentNode"
                      :filterOption="filterOption"
                    >
                      <fa-select-option
                        :value="item.propValId"
                        :label="item.val"
                        v-for="(item, index) in item.propValList"
                        :key="index"
                      >
                        {{ item.val }}
                      </fa-select-option>
                    </fa-select>
                  </div>
                </div>
              </div>
            </div>
            <div class="moduleWrap">
              <p class="moduleTitle">商品详情介绍</p>
              <el-row class="comm-top">
                <el-col :span="24">
                  <div id="content" ref="content"></div>
                  <global-ts-file-select-upload-dialog
                    :dialog-visible.sync="editFileSelectUploadConfig.visible"
                    :limit-num="editFileSelectUploadConfig.limitNum"
                    :accept-type="editFileSelectUploadConfig.acceptType"
                    @success="handleEditFileSelectUploadSuccess"
                  >
                  </global-ts-file-select-upload-dialog>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="rightPart floatLeft min-rightPart">
            <global-ts-phoneiframe
              bindClass="article"
              ref="phoneIframe"
              refName="productIframe"
              :src="iframeUrl"
              @loaded="loading"
            >
              <template #header>
                <div class="iframeTop">
                  <span class="currentDate">{{ currentDate }}</span>
                  <span class="currentPower"></span>
                </div>
              </template>
            </global-ts-phoneiframe>
          </div>
        </div>
      </template>
      <template v-slot:card-box-bottom>
        <global-ts-button :disabled="saveBtnDisable" @click="saveProduct">保存 </global-ts-button>
      </template>
    </global-ts-card-box>
  </div>
</template>

<script>
import { post, loading, format, getUrL, postLimitVer, getFileSelectUploadDialogIcon } from '@/utils';
import TsCommDef from '@/config/ts-comm-def';
import { mapState } from 'vuex';
import { initEdit } from '@/utils/ueditor-config';
import importJsCss from 'import-js-css';
import { Row, Col, Upload, Input } from 'element-ui';

export default {
  name: 'controller-product',
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Upload.name]: Upload,
    [Input.name]: Input,
  },
  props: {
    isEdit: {
      // 是否是编辑商品
      type: Boolean,
      default: false,
    },
    productId: {
      // 商品Id
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      radio: false,
      // 这里的数据类型和H5-productDetail数据类型一致，以便同步数据 进来不要再里面放复杂类型的数据结构
      productData: {
        // 商品数据
        id: -1, // 商品的id
        name: '', // 商品名称
        summary: '', // 商品描述名称
        priceType: 1, // 面议 0-自定义 1-面议
        price: '', // 商品价格
        selfStatus: 0, // 上下架状态 0-上架 1-下架
        details: '', // 文章详情
        coverImgUrl: '', // 商品封面图url List - 字符串
        _addImgUrlList: [], // 前端用来做表单校验的prop, 与addImgUrlList相联通
      },
      paramList: [], // 商品参数
      addImgUrlList: [], // 商品头图图片数据List 包含Url - 对象数组
      picture: '',
      firstRules: {
        name: [
          {
            type: 1,
            min: {
              limitNum: 0,
              tips: '请输入商品名称',
              topTips: '请输入商品名称',
            },
            max: {
              limitNum: 20,
              tips: '名称不能超过20个字符',
              topTips: '名称长度超过上限',
            },
          },
        ],
        picture: [
          {
            type: 1,
            min: {
              limitNum: 0,
              tips: '请至少上传1张商品图片',
              topTips: '请至少上传1张商品图片',
            },
            max: {
              limitNum: 2,
              tips: '商品图片不能超过1M',
              topTips: '商品图片大小超过上限',
            },
          },
        ],
      },
      priceTypeList: [
        {
          key: 1,
          value: '面议',
        },
        {
          key: 0,
          value: '自定义',
        },
      ],
      productType: [
        {
          key: 0,
          value: '上架',
        },
        {
          key: 1,
          value: '下架',
        },
      ],
      editor: null,
      timer: -1,
      setMainPicTime: -1,
      uploadUrl: getUrL(`/ajax/upload_h.jsp?cmd=uploadTmpFile&folderType=${TsCommDef.FolderType.PERSON_SYS_PRODUCT}`),
      fileList: [], // 图片的列表，用于暂存图片和清空
      folderType: TsCommDef.FolderType.PERSON_SYS_PRODUCT,
      tanshuFileSelectUploadVisible: false,
      editFileSelectUploadConfig: {
        visible: false,
        acceptType: 'img',
        limitNum: 10,
      },
      saveBtnDisable: false,
    };
  },
  computed: {
    ...mapState({
      addressUrl: state => state.globalData.addressUrl,
    }),
    iframeUrl() {
      return this.addressUrl?.productiFramePreView;
    },
    /*
     * 是否是自定义价格
     * @author: enson
     * @date: 2020-07-20 10:33:35
     */
    selectSetPrice() {
      return this.productData.priceType === 0;
    },
    /**
     * 文件限制类型
     * @author waldon
     * @date 2020/5/28
     * @returns {*} 对话框标题
     */
    fileAcceptCal() {
      return '.jpg,.jpeg,.png,.JPG,.JPEG,.PNG';
    },
    /**
     * 文件上传提示
     * @author waldon
     * @date 2020/4/10
     * @returns {*} 对话框标题
     */
    fileTypeTip() {
      return '上传失败：格式错误，请上传jpg、png格式的图片';
    },
    /*
     * @description: 获取当前时间的时分
     * @author: enson
     * @date: 2020-07-16 20:56:56
     */
    currentDate() {
      return format.date(new Date(), 'HH:mm');
    },
    /**
     * @description : _addImgUrlList工具集
     * @author      : ADI
     * @Date        : 2021-07-29 16:28:31
     * @param        {*}
     * @return       {*}
     */
    addImgUrlListFormRuleUtil() {
      const key = '_addImgUrlList';
      const that = this;
      return {
        // 同步数据源
        syncData(newList = []) {
          that.productData[key] = newList;
          that.saveBtnDisable = false;
          return this;
        },
        // 表单校验
        checkRule() {
          that.$refs?.controllerProductFormRef.validateField(key);
          return this;
        },
        // 移除数据中的key
        cleanSideEffect(data) {
          delete data[key];
          return data;
        },
      };
    },
    rules() {
      return {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'change' },
          { min: 1, max: 20, message: '名称不能超过20个字符', trigger: 'change' },
        ],
        _addImgUrlList: [
          { required: true, message: '请至少上传1张商品图片', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (!value.length) {
                callback(new Error('请至少上传1张商品图片'));
              } else {
                callback();
              }
            },
          },
        ],
      };
    },
  },
  watch: {
    // 操作这个this.addImgUrlList数组都应该被监听到
    addImgUrlList(nVal) {
      this.addImgUrlListFormRuleUtil.syncData([...nVal]).checkRule();

      let setMainPicFlag = false; // 是否有设置主图
      if (nVal.length > 0) {
        this.picture = '可以';
      } else {
        this.picture = '';
      }

      setMainPicFlag = nVal.some(item => {
        return item.isCoverImg;
      });
      // 如果添加/添加图片的时候没有设置主图，默认第一张就是主图
      if (!setMainPicFlag && nVal.length >= 1) {
        nVal[0].isCoverImg = true;
        this.productData.coverImgUrl = nVal[0].url;
      }

      // 这里做统一的控制, 提高头图多于15张则不显示添加按钮
      // 少于15张则显示
      if (nVal.length >= 15) {
        this.isShowUploadBtn('hidden');
      } else {
        this.isShowUploadBtn('show');
      }

      this.setIframeData();
    },
  },
  created() {
    loading.addQuene({
      key: 'loadingProduct',
    });
  },
  mounted() {},
  destroyed() {
    try {
      this.editor.$tsDestroy(true);
      this.editor = null;
    } catch (e) {
      console.log(e);
    }

    clearInterval(this.timer);
  },
  methods: {
    loadEditAssets() {
      const mergePath = uri => `${this.$utils.host}/${uri}`;
      const scriptUriList = ['js/jquery-core.src.js', 'js/comm/ueditor/ueditor.src.js'].map(uri => mergePath(uri));
      const linkUriList = [
        // 'css/comm/ueditor/mp.src.css',
        'css/comm/ueditor/ueditor.src.css',
      ].map(uri => mergePath(uri));
      return importJsCss('ueditor', {
        ueditor: {
          script: scriptUriList,
          link: linkUriList,
        },
      });
    },
    /**
     * @description 页面开始加载后的逻辑入口
     * @author enson
     * @date 2020-07-17
     */
    async init() {
      loading.poupQuene('loadingProduct');

      // 初始化数据
      if (this.isEdit) {
        // 编辑商品
        await this.getProductDataById();
      } else {
        await this.getProductParam(-1);
      }

      this.setIframeData();
    },
    /**
     * @description iframe加载完的回调函数
     * @author enson
     * @date 2020-07-17
     */
    async loading() {
      await this.loadEditAssets();
      console.log('window.$, window.UE', window.$, window.UE);
      // 小程序不支持视频，因此前端去掉视频，后端过滤视频/音频
      const editStyle =
        '.ts_lazy_load_img{max-width:100%;}video,audio,iframe[src^="https://v.qq.com/"]{display:none !important;}'; // 编辑器内部样式拓展
      initEdit(true, this.productData.details, 'content', editStyle, 'folderType=' + this.folderType, {
        toolbars: [
          [
            // 代表当前编辑器可以使用的功能列表 可查看http://www.aaa.cn/tmp/UEditor1.0-doc/
            'removeformat',
            'pasteplain',
            '|',
            'bold',
            'italic',
            'underline',
            '|',
            'fontsize',
            'forecolor',
            'backcolor',
            '|',
            'insertorderedlist',
            'lineheight',
            'indent',
            'justify',
            '|',
            'tsimg',
            'inserttable',
            'link',
            'unlink',
            '|',
            'source',
            'fullscreen',
          ],
        ],
      }).then(editor => {
        window.editor = this.editor = editor;
        this.editor.addListener('keydown keyup mouseup mousedown onchange', () => {
          this.productData.details = this.editor.getContent && this.editor.getContent(); // 获取编辑器的内容
        });
        this.timer = setInterval(() => {
          this.productData.details = this.editor.getContent();
        }, 500);
        this.editor.addListener('tsInsertEvent', (eventName, insertType) => {
          console.log('insertType--->', insertType);
          this.editFileSelectUploadConfig.visible = true;
          const acceptType = insertType.slice(2) || 'img';
          this.editFileSelectUploadConfig.acceptType = acceptType;
        });
        this.init();
      });
    },
    /**
     * @description 设置右侧手机iframe的数据
     * @author enson
     * @date 2020-06-02
     */
    setIframeData() {
      if (this.$refs.phoneIframe && this.$refs.phoneIframe.$refs.productIframe) {
        console.log('this.$refs.phoneIframe.$refs.productIframe', this.$refs.phoneIframe.$refs.productIframe);
        this.$set(this.$refs.phoneIframe.$refs.productIframe.contentWindow.productDetailBox, 'info', this.productData);
        this.$set(
          this.$refs.phoneIframe.$refs.productIframe.contentWindow.productDetailBox,
          'imgList',
          this.addImgUrlList.concat(),
        );
        this.$set(
          this.$refs.phoneIframe.$refs.productIframe.contentWindow.productDetailBox,
          'paramList',
          this.paramList,
        );
      }
    },
    /**
     * @description 保存商品
     * @author enson
     * @date 2020-07-13
     */
    saveProduct() {
      this.$refs['controllerProductFormRef'].validate(valid => {
        if (!valid) {
          this.saveBtnDisable = true;
          return;
        }
        const addUrlList = [];
        const addPropList = [];

        // 这里只用不直接用url是为了保持和H5的productDetail.src.js的数据结构一致
        this.addImgUrlList.forEach(item => {
          addUrlList.push(item.url);
        });

        this.paramList.forEach(item => {
          item.value.forEach(propValId => {
            addPropList.push({
              rlPropId: item.rlPropId,
              propValId: propValId,
            });
          });
        });
        let param = Object.assign(
          {},
          { ...this.productData },
          {
            addImgUrlList: JSON.stringify(addUrlList),
            addPropList: JSON.stringify(addPropList),
          },
        );
        param = this.addImgUrlListFormRuleUtil.cleanSideEffect(param);

        // 特殊逻辑，当用户选择了自定义价格，但是又没有填写价格时，productData.priceType赋值为2
        if (!param.price && param.priceType === 0) {
          param.priceType = 2;
        }

        post('/ajax/mall/tsMall_h.jsp?cmd=saveTsProduct', param).then(response => {
          if (response && response.success) {
            this.$utils.postMessage({
              type: 'success',
              message: '保存成功',
            });
            this.$utils.ActLog('ADD_PRODUCT');
            setTimeout(() => {
              this.backManage();
            }, 300);
          } else if (response && response.rt === 6032) {
            postLimitVer(response.msg);
          } else {
            this.$utils.postMessage({
              type: 'error',
              message: response.msg || '网络错误，请稍候重试',
            });
          }
        });
      });
    },
    /**
     * @description 根据商品id获取商品信息
     * @author enson
     * @date 2020-08-04
     */
    getProductDataById() {
      return new Promise(resolve => {
        post('/ajax/mall/tsMall_h.jsp?cmd=getTsProductInfoById', {
          id: this.productId,
        }).then(response => {
          if (response && response.success) {
            // 解构赋值，再用object.assign复制到this.productData
            this.productData.id = response.data.id; // 获取商品Id
            this.productData.details = response.data.details; // 获取商品详情
            this.productData.summary = response.data.summary; // 获取商品描述
            this.productData.name = response.data.name; // 获取商品名称
            this.productData.selfStatus = response.data.selfStatus; // 获取商品上下架状态
            this.productData.coverImgUrl = response.data.coverUrl; // 获取商品封面图
            this.productData.priceType = response.data.priceType; // 获取商品价格类型
            this.productData.price = response.data.price; // 获取商品价格

            // 特殊逻辑，如果选择了自定义价格，没有填写价格，则priceType为2
            if (this.productData.priceType === 2) {
              this.productData.priceType = 0;
              this.productData.price = '';
            }

            // 因为每次都会去校验addImgUrlList数组的isCoverImg是否有封面图
            // 因此需要先操作一下封面图
            this.productData.coverImgUrl &&
              this.addImgUrlList.unshift({
                url: this.productData.coverImgUrl, // 商品封面图
                isCoverImg: true, // 是否是封面图
              });

            const picUrlList = response.data.picUrlList; // 获取商品头图Url集合（不包含封面图）
            picUrlList.forEach(item => {
              item &&
                this.addImgUrlList.push({
                  url: item,
                  isCoverImg: false, // 是否是封面图
                });
            });
            this.paramList = response.data.prodPropList;

            if (Object.keys(this.editor).length > 0) {
              try {
                this.editor.setContent(this.productData.details);
              } catch (e) {
                console.log('error', e);
              }
            }
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
     * 回到商品管理页面
     * @author enson
     * @date 2020-07-14
     */
    backManage() {
      clearInterval(this.timer);
      this.$parent.changeComponets('manageProduct');
    },
    /**
     * 上传前操作
     * 限制图片大小，保存上传顺序，限制上传图片的格式
     * 图片的uid是唯一的，根据这个来作为排序
     * @param {*} file - 图片数据
     * @author enson
     * @date 2020/5/28
     * */
    beforeUpload(file) {
      if (file.name && file.name.includes('.')) {
        const fileNames = file.name.split('.');
        const suffixName = fileNames[fileNames.length - 1]; // 获取图片类型
        if (!this.fileAcceptCal.includes(suffixName.toLowerCase())) {
          this.$utils.postMessage({
            type: 'error',
            message: this.fileTypeTip,
          });
          return false;
        }
        const limitSize = file.size / 1024 / 1024;
        if (limitSize > 1) {
          this.$utils.postMessage({
            type: 'error',
            message: '图片大小不能超过1M',
          });
          return false;
        }
        // 可以上传才出loading
        loading.addQuene({
          key: 'uploading',
          msg: '上传中...',
        });
      } else {
        this.$utils.postMessage({
          type: 'error',
          message: this.fileTypeTip,
        });
        return false;
      }
    },
    /**
     * 完成上传的回调
     * @param {Object} res - 后端返回数据
     * @param {Object} file - 文件数据
     * @author waldon
     * @date 2020/5/28
     * */
    uploadSuccess(res = []) {
      res.forEach(file => {
        loading.poupQuene('uploading');
        const flag = this.beforeUpload(file);
        if (flag === false) {
          return;
        }
        this.addImgUrlList.push({
          url: file.content,
        });
      });
    },
    /**
     * 移除图片
     * @param {*} file - 图片数据 对应的是addImgUrlList的Item
     * @author waldon
     * @date 2020/5/28
     * */
    removeMaterial(file, index) {
      this.addImgUrlList.splice(index, 1);
    },
    /**
     * 是否显示上传按钮
     * @param {*} type - 显示/隐藏
     * @author waldon
     * @date 2020/5/28
     * */
    isShowUploadBtn(type) {
      this.$nextTick(() => {
        const uploadBox = document.getElementById('materialUploadBox');
        if (type === 'hidden') {
          uploadBox.lastElementChild.classList.add('uploadBtn_hidden');
        } else {
          uploadBox.lastElementChild.classList.remove('uploadBtn_hidden');
        }
      });
    },
    /**
     * @description 超出上传个数的钩子
     * @author enson
     * @date 2020-07-16
     */
    overChooseImg() {
      console.log('超过上传的函数的钩子');
    },
    /**
     * @description 与小程序的逻辑一致
     * @author enson
     * @date 2020-07-20
     */
    moneyInput(value) {
      let money;
      value = value.replace(/[^\d.]/g, '');
      if (/^(\d?)+(\.\d{0,2})?$/.test(value)) {
        //正则验证，提现金额小数点后不能大于两位数字
        money = value;
      } else {
        money = Math.floor(value * 100) / 100;
      }
      console.log('money', money);
      if (!isNaN(money)) {
        // 再做一层校验
        this.$set(this.productData, 'price', money);
      }
    },
    /**
     * @description 将图片设置成主图
     * @author enson
     * @date 2020-08-05
     * @param {*} file - 当前图片文件的数据
     * @param {*} index - 当前图片的左边
     */
    setMainPic(fileData, index) {
      if (this.setMainPicTime) clearTimeout(this.setMainPicTime);
      this.setMainPicTime = setTimeout(() => {
        const currentFile = fileData;
        currentFile.isCoverImg = true;
        this.addImgUrlList.splice(index, 1);
        this.addImgUrlList.forEach(item => {
          item.isCoverImg = false;
        });
        this.addImgUrlList.unshift(currentFile);
        this.productData.coverImgUrl = currentFile.url; // 设置封面图的url
      }, 500);
    },
    /**
     * @description 由于el-image的fit属性不支持ie，改用background-image
     * @author enson
     * @date 2020-08-18
     * @param {String} url
     * @returns
     */
    setProductImgStyle(url) {
      return `background-image: url(${url});`;
    },
    /**
     * @description 根据商品id获取商品参数
     * @author enson
     * @date 2020-12-17
     * @param {*} id - 商品id
     * @returns
     */
    getProductParam(id) {
      return new Promise(resolve => {
        post('/ajax/product/tsProductProp_h.jsp?cmd=getTsProductPropList', {
          id,
        }).then(response => {
          if (response && response.success) {
            this.paramList = response.data;
          }
          resolve();
        });
      });
    },
    /**
     * @description 商品参数筛选
     * @author enson
     * @date 2020-12-28
     */
    filterOption(inputValue, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
    },
    handleEditFileSelectUploadSuccess(files = []) {
      const selectTypeMap = {
        图片: 'tsImg',
        视频: 'tsVideo',
        文档: 'tsDoc',
      };
      files.forEach(file => {
        const selectObj = Object.assign({}, file);
        const categoryName = file.categoryName;
        const selectType = selectTypeMap[categoryName] || '';
        selectObj.selectType = selectType;
        selectObj.coverImgUrl = selectObj.coverImgUrl || getFileSelectUploadDialogIcon(file); // 默认icon
        const insertArtitleHtml = this.editor.getTsInsertModel(selectObj.selectType, selectObj);
        this.editor.ready(() => {
          this.editor.execCommand('inserthtml', insertArtitleHtml); // 常见的api可查看 - http://fex.baidu.com/ueditor/#api-common
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.controllerProduct {
  height: 100%;
  .redColor {
    color: #f80530;
  }
  .floatLeft {
    float: left;
  }
  .floatRight {
    float: right;
  }
  .leftPart {
    width: calc(100% - 700px);
    min-width: 576px;
    padding: 30px 20px;
    padding-top: 0;
    padding-left: 0;
    .comm-top {
      /* margin-top: 20px; */
    }
    .ts-input {
      .tanshu_err {
        margin-top: 0;
      }
    }
    input[type='radio'] {
      & + label {
        &.priceTypeList1 {
          margin-right: 12px;
        }
      }
    }
    .productWrap {
      margin-top: 0;
    }
    .productWrap-item {
      height: 40px;
      &.priceWrap {
        padding-right: 40px;
        .priceWrap__input {
          width: auto;
        }
      }
    }
  }
  .content-header {
    height: 19px;
    margin-bottom: 10px;
    font-size: 14px;
    line-height: 19px;
    color: $color-53;
    .des {
      font-size: 12px;
      color: $color-b2;
      vertical-align: text-bottom;
    }
  }
  .uploadBtn_hidden {
    display: none;
  }
  .productImage {
    width: 125px;
    height: 125px;
    overflow: hidden;
    background-attachment: scroll;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
    border: 1px solid $border-disabled-color;
    border-radius: 4px;
    box-sizing: border-box;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .productImgWrap {
    display: inline-block;
    .productImgList {
      float: left;
      .productImage-wrap {
        position: relative;
        float: left;
        width: 125px;
        height: 125px;
        margin-right: 20px;
        margin-bottom: 20px;
        cursor: pointer;
        &:hover {
          .productImage-hoverWrap {
            opacity: 1;
          }
          .img-close {
            display: inline-block;
          }
        }
        .productImage-hoverWrap {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 9;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 4px;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .img-close {
          position: absolute;
          top: 5px;
          right: 5px;
          z-index: 9999;
          display: none;
          font-size: 18px;
          color: #ffffff;
          cursor: pointer;
        }
      }
      .setMainPic {
        position: absolute;
        right: 4px;
        bottom: 4px;
        display: block;
        width: 60px;
        height: 20px;
        line-height: 20px;
        color: $color-ff;
        text-align: center;
        background: $color-00;
        border-radius: 4px;
      }
    }
    #materialUploadBox {
      position: relative;
      z-index: 2;
      float: left;

      /* margin-bottom: 20px; */
    }
  }
  .hidePicture {
    position: absolute;
    top: 114px;
    left: 0;
    z-index: 0;
    width: 300px;
    opacity: 0;
  }
  .rightPart {
    position: relative;
    float: left;
    width: 300px;
    padding-top: 32px;
    margin-right: 160px;
    margin-left: 154px;
    .ts-phoneIframe {
      &.phoneBox {
        &.article {
          position: fixed;
          top: auto;
          right: auto;
          #previewPage {
            top: 60px;
            right: 0;
            left: 1px;
            width: 236px;
            height: 472px;
            margin: auto;
            transform: scale(1);
          }
        }
      }
    }
  }
  .moduleWrap {
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
    border-bottom: 1px solid $border-disabled-color;
    .moduleTitle {
      margin-bottom: 20px;
      // font-family: MicrosoftYaHei;
      font-size: 14px;
      line-height: 14px;
      color: $color-00;
    }
    &:last-child {
      border-bottom: none;
    }
    .module-param {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      .module-param-title {
        margin-bottom: 10px;
        // font-family: MicrosoftYaHei;
        font-size: 14px;
        line-height: 14px;
        color: $color-89;
      }
      .module-param-item {
        width: calc(50% - 42px);
        margin-bottom: 20px;
      }
    }
  }
  .selectMallParam {
    .fa-select-selection--multiple {
      .fa-select-selection__choice {
        box-sizing: border-box;
      }
    }
  }
}
.directSale {
  .controllerProduct {
    .rightPart {
      .ts-phoneIframe {
        &.phoneBox {
          &.article {
            #previewPage {
              top: 61px;
            }
          }
        }
      }
    }
  }
}
@media (max-width: 1548px) {
  .controllerProduct .rightPart.min-rightPart {
    margin: 0 60px;
  }
}
@media (max-width: 1700px) {
  .controllerProduct .rightPart.min-rightPart .ts-phoneIframe.phoneBox.article {
    position: relative;
    top: auto;
    right: auto;
  }
}
</style>

<style lang="scss">
.controllerProduct {
  .leftPart {
    .inputContainer {
      .el-input {
        .el-input__suffix {
          line-height: 40px;
        }
      }
    }
  }
  #materialUploadBox {
    .el-upload--picture-card {
      width: 125px;
      height: 125px;
      line-height: 125px;
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
.materialUploadBox {
  .el-upload__input {
    display: none !important;
  }
}
</style>
