<!--
 * @Author       : ADI
 * @Date         : 2021-04-01 13:36:22
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-14 16:43:04
-->
<template>
  <global-ts-dialog
    class="commSelectBubble"
    no-body-padding
    :with-footer="true"
    dialog-title="选择文章"
    :dialog-visible.sync="dialogVisible"
    dialog-size="large"
    @cancel="cancel"
    @sure="sure"
  >
    <div class="pro_listBox dialogContent articlePoupBox">
      <div class="pro_line">
        <global-ts-fai-input-search v-model="requestParam.title" placeholder="文章标题" @search="reloadFormData">
        </global-ts-fai-input-search>
        <global-ts-select
          class="editSelectBox"
          :selectkey="{ label: 'key', value: 'value' }"
          :list.sync="rootClassify"
          :selectVal="activeNum"
          placeholder="文章类型"
          @change="selectActiveNum"
        >
        </global-ts-select>
        <global-ts-select
          class="editSelectBox"
          :selectkey="{ label: 'name', value: 'id' }"
          :list.sync="typeList"
          v-model="realType"
          placeholder="分类"
          @change="selectRealType"
        >
        </global-ts-select>
        <!-- <global-ts-fai-input-search v-model="requestParam.title" placeholder="文章标题" @search="reloadFormData">
        </global-ts-fai-input-search> -->
        <!-- <global-ts-input
          class="editSelectBox"
          size="small"
          v-model="requestParam.title"
          placeholder="文章标题"
          @keyup.enter.native="reloadFormData"
        >
        </global-ts-input>
        <global-ts-button type="primary" size="small" icon="icon-icon-4" ref="button" @click="reloadFormData">
          搜索
        </global-ts-button> -->
      </div>
      <div class="flex">
        <!-- 文章列表 start -->
        <el-table
          :class="[{ 'selectListBox flexItem': isMultiSelect }]"
          ref="tab"
          :data="articleResponsibility.formTableList"
          border
          cell-class-name="cellStyle"
          header-row-class-name="employeeHeader"
          box-sizing="border-box"
        >
          <el-table-column label="选择" min-width="70">
            <template slot-scope="scope">
              <fa-checkbox
                v-if="isMultiSelect"
                :disabled="isChekBoxDisabled && !isHasChecked(scope.row.id)"
                :checked="isHasChecked(scope.row.id)"
                @change="e => checkItem(e, scope.row)"
              >
              </fa-checkbox>
              <span class="selectItem" v-else>
                <input
                  v-model="tempSelectArticle.id"
                  type="radio"
                  :value="scope.row.id"
                  :id="'article' + scope.row.id"
                />
                <label :for="'article' + scope.row.id" @click="selectItem(scope.row)"></label>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="文章标题" min-width="439" prop="title" class-name="leftText">
            <template slot-scope="scope">
              <p class="titleItem">
                <img class="coverImg" :src="scope.row.coverImgUrl" v-if="scope.row.coverImgUrl" />
                <span class="titleText">{{ scope.row.title }}</span>
              </p>
            </template>
          </el-table-column>
        </el-table>
        <!-- 文章列表 end -->

        <!-- 多选模式时已选中的列表 start -->
        <div v-if="isMultiSelect" class="flexItem selectedListBox">
          <div class="selectedTitle">已选择</div>
          <div class="selectedList">
            <div
              class="selectedItem flex flex-vc justify-content_flex-justify"
              v-for="(item, index) in tempSelectArticle"
              :key="index"
            >
              <p class="ellispsis">{{ item.title }}</p>
              <svg class="icon deleteBtn flexItem" aria-hidden="true" @click="deleteCheckedItem(item)">
                <use xlink:href="#icon-guanbi1616"></use>
              </svg>
            </div>
          </div>
        </div>
        <!-- 多选模式时已选中的列表 end -->
      </div>
      <global-ts-pagination
        :direction="direction"
        ref="formPagination"
        :tableData="articleResponsibility.formTableList"
        :requestParam="requestParam"
        :isReload.sync="articleResponsibility.isReload"
        @getData="changeTable"
        :httpurl="articleResponsibility.httpurl"
      >
      </global-ts-pagination>
    </div>
  </global-ts-dialog>
</template>

<script>
import { postMessage } from '@/utils';
import { Table, TableColumn } from 'element-ui';
import { getTsArticleRouterInfo } from '@/api/modules/views/customer-tools/article-material';

export default {
  name: 'ts-article-bubble',
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      typeList: [], // 文章二级分类列表
      articleTypeList: [], // 文章类型列表
      articleResponsibility: {
        // 表格数据
        formTableList: [],
        isReload: false, // 是否重新加载
        httpurl: '', // 数据请求地址
      },
      articleId: 0, // 选中的文章id
      requestParam: {
        // 请求数据
        createTimeStart: '', // 开始时间
        createTimeEnd: '', // 结束时间
        title: '', // 标题
        typeId: -1, // 分类id 企业文库的二级分类
        type: -1, // 产品素材和行业热文的二级分类
        fatherId: 1, // 1：产品素材 2：行业热文
        isPublicShow: true, // 审查关闭和手动关闭的文章不要显示在文章列表中,作用于企业文库接口/已分享的文章接口
      },
      activeNum: 1, // 文章类型
      currentUrl: '', // 当前请求文章的地址
      resonsibilityStatusDef: [
        {
          // 文章类型
          key: '产品素材',
          value: 1,
        },
        {
          key: '行业热文',
          value: 2,
        },
        {
          key: '企业文库',
          value: 3,
        },
        {
          key: '已分享文章',
          value: 4,
        },
      ],
      httpUrlArr: [
        '/rest/manage/article/library/getArticleLibraryList',
        '/rest/manage/article/template/getListForPc',
        '/rest/manage/article/getListForPc',
      ], // 产品素材/行内热文接口、企业文库接口、已分享文章接口
      allSubClassify: {
        // 文章的一级二级分类
        showProductRouter: false, // 是否显示产品素材
        showIndustryRouter: false, // 是否显示行业热文
        productTypeList: [], // 产品素材
        industryTypeList: [], // 行业热文
        templateTypeList: [], // 企业文库
      },
      // selectArticle: { // 选中的文章数据
      // 	id: 0, // 选中的文章id
      // 	title: '', // 选中的文章标题
      // 	type: 0, // 选中的文章来源
      // },
      tempSelectArticle: {
        // 选中的文章数据，多选时为数组，单选时为对象
        id: 0, // 选中的文章id
        title: '', // 选中的文章标题
        type: 0, // 选中的文章来源
      },
      // tempSelectIds: [], // 多选模式时选中的文章id集合
      testChecked: false,
    };
  },
  props: {
    dialogVisible: {
      // 是否显示分类管理弹窗
      type: Boolean,
      default: false,
    },
    selectArticle: {
      type: [Object, Array],
      default: () => {
        return {};
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
    fatherTypeId: {
      type: Number,
      default: 1,
    },
    isMultiSelect: {
      // 是否为多选，默认为单选
      type: Boolean,
      default: false,
    },
    multiNum: {
      // 多选的数量限制，isMultiSelect为true时才需要传
      type: Number,
      default: 1,
    },
  },
  computed: {
    direction() {
      if (this.articleResponsibility.formTableList.length > 6) {
        return 'up';
      } else {
        return 'down';
      }
    },
    /**
     * 文章的二级分类
     * @author lymn
     * @date 2020-08-31
     * @param {Number} 文章的二级分类
     */
    realType: {
      get() {
        return this.activeNum == 3 ? this.requestParam.typeId : this.requestParam.type;
      },
      set(newVal) {
        if (this.activeNum == 3) {
          this.requestParam.typeId = newVal;
        } else {
          this.requestParam.type = newVal;
        }
      },
    },
    /**
     * 文章的一级分类的初始化
     * @author waldon
     * @date 2020-04-13
     * @returns {Object} 文章的所有一级分类。（直销的不显示产品素材）
     */
    rootClassify() {
      let permissionClassify = [];
      if (this.allSubClassify.showProductRouter && this.needProductArticle) {
        const proItem = this.resonsibilityStatusDef.find(item => item.value === 1);
        permissionClassify = permissionClassify.concat(proItem);
      }
      if (this.allSubClassify.showIndustryRouter && this.needIndustryArticle) {
        const hotItem = this.resonsibilityStatusDef.find(item => item.value === 2);
        permissionClassify = permissionClassify.concat(hotItem);
      }
      const tempItem = this.resonsibilityStatusDef.find(item => item.value === 3);
      permissionClassify = permissionClassify.concat(tempItem);

      if (this.needShareArticle) {
        const shareItem = this.resonsibilityStatusDef.find(item => item.value === 4);
        permissionClassify = permissionClassify.concat(shareItem);
      }
      return permissionClassify;
    },
    /**
     * 选中的文章超过限制数量时，未被选中的按钮置灰
     * @author lymn
     * @date 2020-04-13
     */
    isChekBoxDisabled() {
      return this.tempSelectArticle.length >= this.multiNum;
    },
  },
  methods: {
    /**
     * 搜索
     * @author lymn
     * @date 2020-08-26
     */
    reloadFormData() {
      this.articleResponsibility.httpurl = this.currentUrl;
      this.articleResponsibility.isReload = true;
    },
    /**
     * 单选时选中文章
     * @author lymn
     * @date 2020-08-26
     * @param {Number} id 文章的id
     * @param {String} title 文章的标题
     *
     */
    selectItem(selectData) {
      this.tempSelectArticle = Object.assign(
        {},
        { ...selectData },
        { cloneSource: this.activeNum == 3 ? 0 : 1 }, // 文章来源 0：企业文库 1：热文素材和行业热文
      );
    },
    /**
     * 多选时点击选中按钮
     * @author lymn
     * @date 2020-08-31
     */
    checkItem(e, data) {
      const checked = e.target.checked;
      const index = this.tempSelectArticle.findIndex(item => item.id === data.id);
      if (checked) {
        // 选中
        index === -1 &&
          this.tempSelectArticle.push(Object.assign({}, { ...data }, { cloneSource: this.activeNum == 3 ? 0 : 1 })); // cloneSource文章来源 0：企业文库 1：热文素材和行业热文
      } else {
        // 取消选中
        index > -1 && this.tempSelectArticle.splice(index, 1);
      }
    },
    /**
     * 删除选中的元素
     * @author lymn
     * @date 2020-08-31
     */
    deleteCheckedItem(data) {
      const index = this.tempSelectArticle.findIndex(item => item.id === data.id);
      if (index > -1) {
        this.tempSelectArticle.splice(index, 1);
      }
    },
    /**
     * 判断是否选中该元素
     * @author lymn
     * @date 2020-08-31
     * @param {Number} id 文章id
     */
    isHasChecked(id) {
      const index = this.tempSelectArticle.findIndex(item => item.id === id);
      return index > -1;
    },
    /**
     * 重新加载数据
     * @author lymn
     * @date 2020-08-26
     * @param {Array} data 数据列表
     */
    changeTable(data) {
      this.articleResponsibility.formTableList = data;
    },
    /**
     * 关闭弹窗
     * @author lymn
     * @date 2020-08-26
     */
    cancel() {
      this.$emit('cancelbubble');
    },
    /**
     * 确定
     * @author lymn
     * @date 2020-08-26
     */
    sure() {
      if (
        (!this.isMultiSelect && !this.tempSelectArticle.id) ||
        (this.isMultiSelect && !this.tempSelectArticle.length)
      ) {
        // 没选中文章
        this.$utils.postMessage({
          type: 'error',
          message: '请先选择文章',
        });
        return;
      }
      let selectData = [];
      if (this.isMultiSelect) {
        selectData = [...this.tempSelectArticle];
      } else {
        selectData = Object.assign({}, { ...this.tempSelectArticle });
      }
      // this.selectArticle = Object.assign({}, { ...this.tempSelectArticle });
      this.$emit('confirmbubble', selectData);
      this.$emit('update:dialogVisible', false);
    },
    /**
     * 获取全部二级分类，并返回一级分类的序号
     * @author waldon
     * @date 2020-04-19
     * @returns {Promise} - 返回一级分类的序号
     */
    async getAllSubClassify() {
      const [err, res] = await getTsArticleRouterInfo();
      if (err) {
        return Promise.reject(err);
      }
      const type = {
        id: -1,
        name: '全部',
      };
      this.allSubClassify = res.data;
      this.allSubClassify.productTypeList.unshift(type); // 产品素材增加一个默认的分类
      this.allSubClassify.templateTypeList.unshift(type); // 企业文库增加一个默认的分类
      return Promise.resolve(3); // 默认显示企业文库
    },
    /**
     * 更新对应的请求数据
     * @author lymn
     * @date 2020-08-31
     * @param {Number} activeNum 当前选择的文章类型
     * @return {Boolean} return
     */
    initRequestData(activeNum) {
      switch (activeNum) {
        case 1:
          // 产品素材
          this.typeList = this.allSubClassify.productTypeList;
          this.currentUrl = this.httpUrlArr[0];
          this.requestParam.fatherId = 1;
          this.requestParam.type = -1;
          break;
        case 2:
          this.typeList = this.allSubClassify.industryTypeList;
          this.currentUrl = this.httpUrlArr[0];
          this.requestParam.fatherId = 2;
          this.requestParam.type = this.allSubClassify.industryTypeList[0]
            ? this.allSubClassify.industryTypeList[0].id
            : -1;
          break;
        case 3:
          this.typeList = this.allSubClassify.templateTypeList;
          this.currentUrl = this.httpUrlArr[1];
          this.requestParam.typeId = -1; // typeId才是企业文库的二级分类
          break;
        case 4:
          this.typeList = [];
          this.currentUrl = this.httpUrlArr[2];
          break;
      }
    },
    /**
     * 切换文章类型
     * @author lymn
     * @date 2020-08-31
     * @param {Number} val 文章类型对应的value值
     */
    selectActiveNum(val) {
      this.activeNum = val;
      this.initRequestData(val);
      this.reloadFormData();
    },
    /**
     * 切换二级分类
     * @author lymn
     * @date 2020-08-31
     * @param {Number} val 二级分类对应的value值
     */
    selectRealType(val) {
      if (this.activeNum == 3) {
        this.requestParam.typeId = val;
      } else {
        this.requestParam.type = val;
      }
      this.reloadFormData();
    },
  },
  created() {
    this.getAllSubClassify().then(activeNum => {
      this.initRequestData(activeNum);
      this.activeNum = activeNum;
      this.articleResponsibility.httpurl = this.currentUrl;
    });
  },
  watch: {
    dialogVisible(newVal) {
      if (this.isMultiSelect) {
        console.log(this.isMultiSelect, '是否多选');
        // 多选
        if (newVal) {
          this.tempSelectArticle = [...this.selectArticle];
          console.log(this.tempSelectArticle, '???');
        } else {
          this.tempSelectArticle = [];
        }
      } else {
        // 单选
        if (newVal) {
          this.tempSelectArticle = Object.assign({}, { ...this.selectArticle });
        } else {
          this.tempSelectArticle = {};
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>

<style lang="scss"></style>
