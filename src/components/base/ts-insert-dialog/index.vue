<!--
 * @Author       : ADI
 * @Date         : 2021-04-01 13:43:53
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-31 15:46:58
-->
<template>
  <div>
    <global-ts-dialog
      wrap-class-name="tanshu-insertDialog"
      :dialog-title="dialogTitle"
      :dialog-visible.sync="dialogVisible"
      :lock-dialog-body-height="false"
      dialog-size="medium"
      @cancel="cancel"
      @sure="sure"
    >
      <div class="setInsertContent" v-if="showType === 1">
        <p class="inputTip">内部链接：</p>
        <global-ts-select
          placeholder="请选择类型"
          class="selectBox"
          type="large"
          :list="insertTypeList"
          v-model="typeNameId"
          :selectkey="{ label: 'name', value: 'id' }"
        >
        </global-ts-select>
        <p class="inputTip">{{ typeName }}：</p>
        <global-ts-input
          class="linkContent"
          tstype="test"
          placeholder="请选择链接"
          :readonly="true"
          @click.native="showSelectBubble"
          size="large"
          v-model="selectTitle"
        >
        </global-ts-input>
      </div>
      <div class="setInsertContent_2" v-if="showType === 2">
        <div class="selectItem smallMarginTop">
          <p class="selectItem-title">链接类型：</p>
          <div class="selectItem-content">
            <div class="radioBox">
              <fa-radio-group v-model="linkType">
                <fa-radio v-for="(item, index) in settingList" :key="index" :value="item.key">
                  {{ item.value }}
                </fa-radio>
              </fa-radio-group>
              <!-- <span v-for="(item, index) in settingList" :key="index">
                <input v-model="linkType" type="radio" :value="item.key" :id="'set' + index" />
                <label :for="'set' + index">{{ item.value }}</label>
              </span> -->
            </div>
          </div>
        </div>
        <div class="selectContent">
          <div v-if="linkType === 1">
            <div class="selectItem">
              <p class="selectItem-title">内部链接：</p>
              <div class="selectItem-content">
                <global-ts-select
                  placeholder="请选择类型"
                  type="large"
                  class="selectBox"
                  :list="insertTypeList"
                  v-model="typeNameId"
                  :selectkey="{ label: 'name', value: 'id' }"
                >
                </global-ts-select>
              </div>
            </div>
            <div class="selectItem">
              <p class="selectItem-title">{{ typeName }}：</p>
              <div class="selectItem-content">
                <global-ts-input
                  class="linkContent"
                  tstype="test"
                  placeholder="请选择链接"
                  :readonly="true"
                  @click.native="showSelectBubble"
                  size="large"
                  v-model="selectTitle"
                >
                </global-ts-input>
              </div>
            </div>
          </div>
          <div v-if="linkType === 2">
            <div class="selectItem">
              <p class="selectItem-title">设置APPID：</p>
              <div class="selectItem-content">
                <global-ts-input
                  class="linkContent defualtCursor"
                  tstype="test"
                  placeholder="请设置APPID"
                  style="cursor: inherit;"
                  size="large"
                  v-model="insertData.appId"
                >
                </global-ts-input>
              </div>
            </div>
            <div class="selectItem">
              <p class="selectItem-title">设置跳转路径：</p>
              <div class="selectItem-content">
                <global-ts-input
                  class="linkContent defualtCursor"
                  tstype="test"
                  placeholder="请设置跳转路径"
                  style="cursor: inherit;"
                  size="large"
                  v-model="insertData.appPath"
                >
                </global-ts-input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </global-ts-dialog>
    <ts-article-bubble
      :dialogVisible.sync="isShowArticleBubble"
      :needProductArticle="needProductArticle"
      :needIndustryArticle="needIndustryArticle"
      :needShareArticle="needShareArticle"
      @cancelbubble="isShowArticleBubble = false"
      @confirmbubble="selectInsert"
    >
    </ts-article-bubble>
    <ts-select-other-bubble
      v-if="typeNameId != 1"
      :dialogVisible.sync="isShowOtherBubble"
      :needMallProduct="needMallProduct"
      :selectType="typeNameId"
      @confirmbubble="selectInsert"
    >
    </ts-select-other-bubble>
    <global-ts-file-select-upload-dialog
      :dialog-visible.sync="editFileSelectUploadConfig.visible"
      :limit-num="editFileSelectUploadConfig.limitNum"
      :accept-type="editFileSelectUploadConfig.acceptType"
      @success="handleEditFileSelectUploadSuccess"
    >
    </global-ts-file-select-upload-dialog>
  </div>
</template>

<script>
import { decodeHtml, encodeHtml, fixImgUrl, postMessage } from '@/utils';
import { mapState } from 'vuex';
import tsArticleBubble from '@/components/base/ts-article-bubble/index.vue';
import tsSelectOtherBubble from '@/components/base/ts-select-other-bubble/index.vue';
import pdfIconIMG from '@/assets/image/commDefault/pdfIcon.png';
import excelIconIMG from '@/assets/image/commDefault/excelIcon.png';
import wordIconIMG from '@/assets/image/commDefault/wordIcon.png';
import pptIconIMG from '@/assets/image/commDefault/pptIcon.png';

export default {
  name: 'ts-insert-dialog',
  components: { tsArticleBubble, tsSelectOtherBubble },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    dialogTitle: {
      type: String,
      default: '设置链接',
    },
    defaultId: {
      type: Number,
      required: true,
      default: 1,
    },
    showType: {
      // 展示类型
      type: Number,
      default: 1,
    },
    filterTypeList: {
      // 需要过滤的类型，[1, 2, 3, 4, 5] -> 代表 [文章, 商品, 表单, 视频, 文档]
      type: Array,
      default: () => {
        return [];
      },
    },
    needProductArticle: {
      // 是否显示产品素材
      type: Boolean,
      default: true,
    },
    needIndustryArticle: {
      // 是否显示行业热文
      type: Boolean,
      default: true,
    },
    needShareArticle: {
      // 是否显示已分享的文章
      type: Boolean,
      default: false,
    },
    needMallProduct: {
      // 是否需要商城的商品
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isShowArticleBubble: false, // 是否显示指定文章弹窗
      isShowOtherBubble: false, // 是否显示其他选择类型弹窗
      typeNameId: 1,
      insertTypeList: [
        {
          id: 1,
          name: '文章',
        },
        {
          id: 2,
          name: '商品',
        },
        {
          id: 3,
          name: '表单',
        },
        {
          id: 4,
          name: '视频',
        },
        {
          id: 5,
          name: '文档',
        },
      ],
      insertData: {
        selectType: '', // 插入的类型
        id: '', // 插入的文件id
        coverImgUrl: '', // 封面图
        title: '', // 标题
        desc: '', // 描述
        priceType: '', // 用于商品 - 价格类型 0-自定义 1-面议 2-不显示价格
        sizeName: '', // 文件大小
        visitUrl: '', // 跳转的链接
        appId: '', // 跳转外部小程序的Appid
        appPath: '', // 跳转外部小程序的路径
      },
      selectTitle: '',
      typeList: [], // 视频/文档的类别
      settingList: [
        {
          key: 1,
          value: '内部链接',
        },
        {
          key: 2,
          value: '外部小程序',
        },
      ],
      linkType: 1,
      editFileSelectUploadConfig: {
        visible: false,
        acceptType: 'video',
        limitNum: 1,
      },
    };
  },
  mounted() {
    this.insertTypeList = this.insertTypeList.filter(item => {
      return !this.filterTypeList.includes(item.id);
    });
  },
  computed: {
    typeName() {
      return this.insertTypeList.find(item => item.id === this.typeNameId).name || ' ';
    },
  },
  watch: {
    'dialogVisible'(newVal) {
      if (newVal) {
        this.typeNameId = this.defaultId;
      }
    },
    'typeNameId'(newVal) {
      // 切换重置
      this.selectTitle = '';
      this.insertData = Object.assign({}, this.insertData, {
        selectType: '', // 插入的类型
        id: '', // 插入的文件id
        coverImgUrl: '', // 封面图
        title: '', // 标题
        desc: '', // 描述
        priceType: '', // 用于商品 - 价格类型 0-自定义 1-面议 2-不显示价格
        sizeName: '', // 文件大小 - 用于视频/文档
        visitUrl: '', // 跳转的链接
      });
    },
    'insertData.title'(newVal) {
      if (newVal) {
        this.selectTitle = decodeHtml(newVal);
      }
    },
    'linkType'(newVal) {
      if (newVal === 2) {
        this.insertData.appId = this.insertData.appId || '';
        this.insertData.appPath = this.insertData.appPath || '';
      }
    },
  },
  methods: {
    /**
     * 关闭后重置数据
     */
    reset() {
      this.typeNameId = 1;
      this.selectTitle = '';
      this.insertData = {
        selectType: '', // 插入的类型
        id: '', // 插入的文件id
        coverImgUrl: '', // 封面图
        title: '', // 标题
        desc: '', // 描述
        priceType: '', // 用于商品 - 价格类型 0-自定义 1-面议 2-不显示价格
        sizeName: '', // 文件大小 - 用于视频/文档
        visitUrl: '', // 跳转的链接
        appId: '', // 跳转外部小程序的Appid
        appPath: '', // 跳转外部小程序的路径
      };
    },
    cancel() {
      this.$emit('update:dialogVisible', false);
      this.reset();
    },
    sure() {
      if (this.linkType === 1) {
        // 设置内部链接
        if (!this.insertData.selectType) {
          postMessage({
            type: 'error',
            message: '请选择需要插入的数据',
          });
          return;
        }
      } else {
        // 设置外部需要跳转的小程序路径
        if (!this.insertData.appId) {
          postMessage({
            type: 'error',
            message: '保存失败，请输入小程序APPID',
          });
          return;
        }
        if (!this.insertData.appPath) {
          postMessage({
            type: 'error',
            message: '保存失败，请输入小程序跳转路径',
          });
          return;
        }
      }

      this.$emit('select', this.insertData, this.linkType);
      this.cancel();
    },
    /**
     * @description
     * @author enson
     * @date 2020-09-20
     * @param {*} selectData
     */
    selectInsert(selectData) {
      // 将变量暂存起来
      switch (this.typeNameId) {
        case 1: // 文章
          this.insertData = Object.assign(
            {},
            {
              selectType: 'tsArticle',
              id: selectData.id,
              productAttribute: selectData.productAttribute,
              coverImgUrl: selectData.coverImgUrl,
              title: encodeHtml(selectData.title),
              desc: selectData.createTimeName,
              visitUrl: selectData.visitUrl,
            },
          );
          break;
        case 2: // 商品
          this.insertData = Object.assign(
            {},
            {
              selectType: 'tsProduct',
              id: selectData.id,
              coverImgUrl: selectData.coverUrl,
              title: encodeHtml(selectData.name),
              desc: selectData.priceType === 1 ? '面议' : '￥' + selectData.price,
              priceType: selectData.priceType, // 0-自定义 1-面议 2-为空不显示
              visitUrl: selectData.visitUrl,
            },
          );
          break;
        case 3: // 表单
          this.insertData = Object.assign(
            {},
            {
              selectType: 'tsForm',
              id: selectData.id,
              coverImgUrl: selectData.coverImg,
              title: encodeHtml(selectData.title),
              desc: selectData.createTimeName,
              visitUrl: selectData.visitUrl,
            },
          );
          break;
      }
    },
    showSelectBubble() {
      switch (this.typeNameId) {
        case 1:
          this.isShowArticleBubble = true;
          break;
        case 4:
          this.editFileSelectUploadConfig = {
            visible: true,
            acceptType: 'video',
            limitNum: 1,
          };
          break;
        case 5:
          this.editFileSelectUploadConfig = {
            visible: true,
            acceptType: 'doc',
            limitNum: 1,
          };
          break;
        default:
          this.isShowOtherBubble = true;
          break;
      }
    },
    getDefaultImg(url) {
      return fixImgUrl(this.getFileIconUrl(url));
    },
    getFileType(url) {
      const arr = url.split('.');
      return arr[arr.length - 1].toLowerCase();
    },
    getFileIconUrl(url) {
      const type = this.getFileType(url);
      switch (type) {
        case 'pdf':
          return pdfIconIMG;
        case 'xls':
        case 'xlsx':
          return excelIconIMG;
        case 'doc':
        case 'docx':
          return wordIconIMG;
        case 'ppt':
        case 'pptx':
          return pptIconIMG;
        default:
          return;
      }
    },
    handleEditFileSelectUploadSuccess(files) {
      const selectData = files[0];
      switch (this.typeNameId) {
        case 4: // 视频
          this.insertData = Object.assign(
            {},
            {
              selectType: 'tsVideo',
              id: selectData.id,
              coverImgUrl: selectData.coverImgUrl,
              title: encodeHtml(selectData.name),
              desc: selectData.createTimeName,
              sizeName: selectData.sizeName,
              visitUrl: selectData.visitUrl,
            },
          );
          break;
        case 5: // 文档
          this.insertData = Object.assign(
            {},
            {
              selectType: 'tsDoc',
              id: selectData.id,
              coverImgUrl: this.getDefaultImg(selectData.name),
              title: encodeHtml(selectData.name),
              desc: selectData.createTimeName,
              sizeName: selectData.sizeName,
              visitUrl: selectData.visitUrl,
            },
          );
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tanshu-insertDialog {
  .setInsertContent {
    .selectBox {
      margin-bottom: 20px;
    }
    .inputTip {
      margin-bottom: 10px;
      font-size: 14px;
      color: #606266;
    }
    .linkContent {
      ::v-deep & > .fa-input {
        cursor: pointer;
      }
    }
  }
  .setInsertContent_2 {
    .linkContent {
      ::v-deep & > .fa-input {
        cursor: pointer;
      }
      ::v-deep &.defualtCursor > .fa-input {
        cursor: inherit;
      }
    }
    .selectContent {
      padding-bottom: 60px;
      margin-top: 24px;
    }
    .selectItem {
      display: flex;
      width: 100%;
      margin-top: 20px;
      font-size: 14px;
      color: $color-53;
      box-sizing: border-box;
      align-items: center;
      &.smallMarginTop {
        margin-top: 14px;
      }
      .selectItem-title {
        width: 108px;
        margin-right: 20px;
        text-align: right;
      }
    }
  }
}
.tanshu-insertDialog .setInsertContent_2 .selectItem .selectItem-content,
.tanshu-insertDialog .setInsertContent_2 .selectItem .selectItem-content .tshu_select {
  width: 432px;
}
</style>
