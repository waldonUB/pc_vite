<!--
 * @Author       : ADI
 * @Date         : 2021-04-01 13:38:08
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-19 17:01:16
-->
<template>
  <global-ts-dialog
    class="commSelectBubble wxCorpDialog center"
    :dialog-title="dialogTitle"
    :dialog-visible.sync="dialogVisible"
    dialog-size="large"
    @cancel="cancel"
    @sure="sure"
  >
    <div class="pro_listBox dialogContent articlePoupBox">
      <div class="pro_line" v-if="selectType !== 9">
        <global-ts-select
          v-if="selectType == 7"
          class="editSelectBox"
          :selectkey="{ label: 'key', value: 'value' }"
          :list.sync="rootClassify"
          :selectVal="activeNum"
          placeholder="类型"
          @change="selectActiveNum"
        >
        </global-ts-select>
        <global-ts-select
          v-if="[4, 5, 7].includes(selectType)"
          class="editSelectBox"
          :selectkey="{ label: 'name', value: 'id' }"
          :list="allGroupTagList"
          v-model="requestParam.groupId"
          placeholder="分类"
        >
        </global-ts-select>
        <global-ts-select
          v-if="[10].includes(selectType)"
          class="editSelectBox"
          :selectkey="{ label: 'name', value: 'id' }"
          :list="videoUrlList"
          v-model="videoCenterUrl"
          placeholder="热门视频"
        >
        </global-ts-select>
        <global-ts-select
          v-if="[10].includes(selectType)"
          class="editSelectBox"
          :selectkey="{ label: 'name', value: 'sortKey' }"
          :list="selectSortList"
          v-model="requestParam.sortKey"
          placeholder="最新发布"
        >
        </global-ts-select>
        <global-ts-input
          class="editSelectBox"
          v-model="searchName"
          :placeholder="placeholder"
          @keyup.enter.native="reloadFormData"
        >
        </global-ts-input>
        <global-ts-button type="primary" size="small" icon="icon-icon-4" ref="button" @click="reloadFormData">
          搜索
        </global-ts-button>
      </div>
      <div class="flex">
        <el-table
          :class="[{ 'selectListBox flexItem': isMultiSelect }]"
          ref="tab"
          :data="tableList"
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
              <global-ts-tool-tips
                v-else
                :disabled="!(selectType === 9 && !scope.row.isPublish)"
                offset="0"
                class="item"
                effect="dark"
                content="该传单已下线，无法选中"
                placement="top"
              >
                <span class="selectItem">
                  <input
                    v-model="tempSelectData.id"
                    :disabled="selectType === 9 && !scope.row.isPublish"
                    type="radio"
                    :value="scope.row.id"
                    :id="'others' + selectType + scope.row.id"
                  />
                  <label
                    :class="getSelectLabel(scope.row)"
                    :for="'others' + selectType + scope.row.id"
                    @click="selectItem(scope.row)"
                  ></label>
                </span>
              </global-ts-tool-tips>
            </template>
          </el-table-column>
          <el-table-column :label="placeholder" min-width="439" :prop="propTitle" class-name="leftText">
            <template slot-scope="scope">
              <p class="titleItem">
                <img class="coverImg" :src="scope.row.coverUrl" v-if="scope.row.coverUrl && [2].includes(selectType)" />
                <span class="titleText">{{ getPropTitle(scope.row) }}</span>
              </p>
            </template>
          </el-table-column>
        </el-table>

        <!-- 多选模式时已选中的列表 start -->
        <div v-if="isMultiSelect" class="flexItem selectedListBox">
          <div class="selectedTitle">已选择</div>
          <div class="selectedList">
            <div
              class="selectedItem flex flex-vc justify-content_flex-justify"
              v-for="(item, index) in tempSelectData"
              :key="index"
            >
              <p class="ellispsis">{{ item.name }}</p>
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
        :tableData="tableList"
        :requestParam="requestParam"
        :isReload.sync="isReload"
        @getData="changeTable"
        :isJson="[4, 5, 6, 10].includes(this.selectType)"
        :httpurl="httpUrl"
        :httpConfigByJson="true"
      >
      </global-ts-pagination>
    </div>
  </global-ts-dialog>
</template>

<script>
import { postMessage } from '@/utils';
import { Table, TableColumn } from 'element-ui';
import { getTsGroupList, getKtPosterGroupList } from '@/api/modules/component/select-other-bubble';

export default {
  name: 'ts-select-other-bubble',
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  props: {
    selectType: {
      type: Number,
      default: 4, // 2-商品 3-表单 4-视频 5-文档 6-文件 7-海报 8-互动 9-传单 10-获客视频
    },
    dialogVisible: {
      // 是否显示分类管理弹窗
      type: Boolean,
      default: false,
    },
    selectInfo: {
      type: [Object, Array],
      default: () => {
        return {};
      },
    },
    isKtuPoster: {
      type: Boolean,
      default: false,
    },
    needMallProduct: {
      // 是否需要商城的商品
      type: Boolean,
      default: true,
    },
    isMultiSelect: {
      // 是否为多选，默认为单选(ps：目前只有商品有多选模式，后续如果其他类型也要增加多选模式的话，逻辑估计要再完善下)
      type: Boolean,
      default: false,
    },
    multiNum: {
      // 多选的数量限制，isMultiSelect为true时才需要传
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      tableList: [],
      httpUrlList: {
        2: '/ajax/mall/tsMall_h.jsp?cmd=getTsProductList', // 商品
        3: '/ajax/form/tsForm_h.jsp?cmd=getTsFormTempList', // 表单
        4: '/rest/manage/material/getTsMaterialList', // 视频
        5: '/rest/manage/material/getTsMaterialList', // 文档
        6: '/rest/manage/material/getTsMaterialList', // 文件
        7: '/rest/manage/card/poster/getPosterTempList', // 海报
        8: '/ajax/hd/tsHd_h.jsp?cmd=getHdGameList', // 互动
        9: '/ajax/hd/tsHd_h.jsp?cmd=getFlyerList', // 传单
        10: '/rest/manage/video/getTsHotVideoList', // 获客视频
      },
      httpUrl: '',
      videoCenterUrl: '/rest/manage/video/getTsHotVideoList', // 获客视频请求url
      requestParam: {
        name: '',
        title: '',
        groupId: -1,
        typeGroup: '',
        sortKey: '',
      }, // 请求的参数
      isReload: false,
      groupTagList: [
        {
          id: -1,
          name: '全部',
        },
        {
          id: 0,
          name: '未分组',
        },
      ], // 分类
      posterTagList: [
        {
          id: -1,
          name: '全部',
        },
      ],
      allGroupTagList: [],
      ktTagList: [],
      selectData: {
        id: '',
      },
      activeNum: 1,
      checkIsKt: false,
      tempSelectData: { id: '' }, // 临时数据，测试大佬想要的交互效果,多选时为数组，单选时为对象
      selectSortList: [
        {
          id: 0,
          name: '最新发布',
          sortKey: 'createTime',
        },
        {
          id: 1,
          name: '最多浏览',
          sortKey: 'clickViewers',
        },
        {
          id: 2,
          name: '最多下载',
          sortKey: 'downloadCnt',
        },
      ],
      videoUrlList: [
        {
          id: '/rest/manage/video/getTsHotVideoList',
          name: '热门视频',
        },
        {
          id: '/rest/manage/video/getTsVideoTemplateList',
          name: '企业视频',
        },
      ],
    };
  },
  computed: {
    rootClassify() {
      if (this.selectType === 7) {
        return [
          {
            isSelect: true,
            key: '企业海报',
            value: 1,
          },
          {
            isSelect: false,
            key: '热门推荐',
            value: 2,
          },
        ];
      }
      return [];
    },
    propTitle() {
      switch (this.selectType) {
        case 2:
        case 4:
        case 5:
        case 6:
        case 8:
        case 9:
        case 10:
          return 'name';
        case 3:
        case 7:
          return 'title';
        default:
          return '';
      }
    },
    dialogTitle() {
      let title = '';
      switch (this.selectType) {
        case 2:
          title = `选择商品${this.needMallProduct ? '' : ' （当前不支持添加商城录入的商品）'}`;
          break;
        case 3:
          title = '选择表单';
          break;
        case 4:
          title = '选择视频';
          break;
        case 5:
          title = '选择文档';
          break;
        case 6:
          title = '选择文件';
          break;
        case 7:
          title = '选择海报';
          break;
        case 8:
          title = '选择活动';
          break;
        case 9:
          title = '选择传单';
          break;
        case 10:
          title = '选择视频';
          break;
      }
      return title;
    },
    direction() {
      if (this.tableList.length > 6) {
        return 'up';
      } else {
        return 'down';
      }
    },
    placeholder() {
      let placeholderText = '';
      switch (this.selectType) {
        case 2: // 商品
          placeholderText = '商品名称';
          break;
        case 3: // 表单
          placeholderText = '表单名称';
          break;
        case 4: // 视频
          placeholderText = '视频名称';
          break;
        case 5: // 文档
          placeholderText = '文档名称';
          break;
        case 6: // 文件
          placeholderText = '文件名称';
          break;
        case 7: // 海报
          placeholderText = '海报名称';
          break;
        case 8: // 互动
          placeholderText = '活动名称';
          break;
        case 9: // 传单
          placeholderText = '传单名称';
          break;
        case 10: // 获客视频
          placeholderText = '视频名称';
          break;
      }
      return placeholderText;
    },
    searchName: {
      get() {
        switch (this.selectType) {
          case 2: // 商品
          case 4: // 视频
          case 5: // 文档
          case 6: // 文件
          case 8: // 互动活动
          case 9: // 传单
          case 10: // 获客视频
            return this.requestParam.name;
          case 3: // 表单
          case 7: // 海报
            return this.requestParam.title;
          default:
            return '';
        }
      },
      set(newVal) {
        switch (this.selectType) {
          case 2: // 商品
          case 4: // 视频
          case 5: // 文档
          case 6: // 文件
          case 8: // 互动活动
          case 9: // 传单
          case 10: // 获客视频
            this.requestParam.name = newVal;
            break;
          case 3: // 表单
          case 7: // 海报
            this.requestParam.title = newVal;
            break;
        }
      },
    },
    /**
     * 选中的文章超过限制数量时，未被选中的按钮置灰
     * @author lymn
     * @date 2020-04-13
     */
    isChekBoxDisabled() {
      return this.tempSelectData.length >= this.multiNum;
    },
  },
  methods: {
    resetParam() {
      this.httpUrl = ''; // 这里要做重置处理，因为视频和文档的httpUrl是相同的
      this.requestParam = {
        // 重置
        name: '',
        title: '',
        groupId: -1,
        typeGroup: '',
      };
    },
    cancel() {
      this.$emit('update:dialogVisible', false);
      this.resetParam();
    },
    sure() {
      console.log(this.tempSelectData);
      let selectData = [];
      if (this.isMultiSelect) {
        selectData = [...this.tempSelectData];
      } else {
        selectData = Object.assign({}, { ...this.tempSelectData });
      }
      this.$emit('confirmbubble', selectData);
      this.$emit('update:isKtuPoster', this.checkIsKt);
      this.cancel();
    },
    /**
     * @description 点击搜索的事件
     * @author enson
     * @date 2020-09-22
     */
    reloadFormData() {
      if (this.selectType === 10) {
        this.httpUrl = this.videoCenterUrl;
      }
      this.isReload = true;
    },
    /**
     * @description 表格数据加载后的回调函数
     * @author enson
     * @date 2020-09-22
     * @param {Array} data - 表格数据
     */
    changeTable(data) {
      if (!this.requestParam.isKtuPoster && this.selectType == 7) {
        this.tableList = [].concat(data.list);
      } else {
        this.tableList = [].concat(data);
      }
    },
    /**

			 * 获取当前页签对应的分组列表
			 * @author waldon
			 * @date 2020/4/10
			 * @param {*} type - 分组类别
			 * */
    async getGroupTagList() {
      if (![4, 5].includes(this.selectType)) {
        return;
      }
      const params = {
        type: this.selectType === 4 ? 8 : 3, // 文档type是3, 视频type是8
      };
      const [err, res] = await getTsGroupList(params);
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.groupTagList = this.groupTagList.concat(res.data);
      return Promise.resolve();
    },
    /**
     * 获取分类列表
     * @author lymn
     * @date 2020-07-15
     * @returns {Promise} 获取到分类列表后回调
     **/
    async getPosterGroupList() {
      // return new Promise(resolve => {
      //企业
      this.posterTagList = [
        {
          id: -1,
          name: '全部',
        },
      ];
      const param = {
        type: 11,
        limit: 100,
      };
      const [getTsGroupListErr, getTsGroupListRes] = getTsGroupList(param);
      if (getTsGroupListErr) {
        postMessage({
          type: 'error',
          message: getTsGroupListErr.msg || '网络错误，请稍候重试',
        });
      } else {
        this.posterTagList = [...this.posterTagList, ...getTsGroupListRes.data];
      }
      this.ktTagList = [];
      const [getKtPosterGroupListErr, getKtPosterGroupListRes] = await getKtPosterGroupList();
      if (getKtPosterGroupListErr) {
        postMessage({
          type: 'error',
          message: getKtPosterGroupListErr.msg || '网络错误，请稍候重试',
        });
      } else {
        this.ktTagList = [...this.ktTagList, ...getKtPosterGroupListRes.data.ktPosterGroupList];
      }
    },
    /**
     * @description 不同的类型请求参数是不一样的
     * @author enson
     * @date 2020-09-23
     */
    initRequestParam() {
      switch (this.selectType) {
        case 2: // 商品
          this.requestParam = Object.assign(
            {},
            {
              name: '',
              selfStatus: 0, // 只拿正常的商品
              forInsert: true, // 无需显示状态
              isPtModuleEdit: !this.needMallProduct, // 是否需要商城的商品(isPtModuleEdit-true 不需要 false-需要)
            },
          );
          break;
        case 3: // 表单
          this.requestParam = Object.assign(
            {},
            {
              title: '',
              status: 0, // 只拿正常的表单
            },
          );
          break;
        case 4: // 视频
          this.requestParam = Object.assign(
            {},
            {
              name: '',
              groupId: -1,
              typeGroup: 12,
              category: 3,
              status: 0,
            },
          );
          break;
        case 5: // 文档
          this.requestParam = Object.assign(
            {},
            {
              name: '',
              groupId: -1,
              typeGroup: 12,
              category: 1,
              status: 0,
            },
          );
          break;
        case 6: // 文件
          this.requestParam = Object.assign(
            {},
            {
              name: '',
              groupId: -1,
              typeGroup: 12,
              status: 0,
              categoryList: [1, 3],
            },
          );
          break;
        case 7: // 海报
          this.requestParam = Object.assign(
            {},
            {
              title: '',
              groupId: -1,
              status: 0,
              isKtuPoster: false,
              isGfwClose: 0,
            },
          );
          break;
      }
    },
    selectItem(selectData) {
      if (this.selectType === 9 && !selectData.isPublish) {
        // 禁用传单未上线的
        return;
      }
      this.tempSelectData = Object.assign({}, { ...selectData });
      this.checkIsKt = this.requestParam.isKtuPoster;
    },
    /**
     * 获取标签样式
     * @author waldon
     * @date 2020/11/21
     * @param {Object} rowData - 行数据
     * @returns {Object} - 返回值说明
     */
    getSelectLabel(rowData) {
      return {
        notAllow: this.selectType === 9 && !rowData.isPublish,
      };
    },
    getPropTitle(data) {
      switch (this.selectType) {
        case 2:
        case 4:
        case 5:
        case 6:
        case 8:
        case 10:
          return data.name;
        case 3:
        case 7:
          return data.title;
        case 9:
          return data.flyerTitle;
      }
    },
    selectActiveNum(val) {
      this.activeNum = val;
      if (this.selectType == 7) {
        this.httpUrl =
          this.activeNum == 1
            ? '/rest/manage/card/poster/getPosterTempList'
            : '/rest/manage/card/poster/getKtPosterList';
        this.allGroupTagList = this.activeNum == 1 ? [...this.posterTagList] : [...this.ktTagList];
        this.requestParam.isKtuPoster = this.activeNum == 2 ? true : false;
        if (this.allGroupTagList[0]) {
          this.requestParam.groupId = this.activeNum == 2 ? this.allGroupTagList[0].id : -1;
        }
      }
    },
    /**
     * =初始化选中的数据
     * @author lymn
     * @date 2021-06-01
     * @param {Number} val 二级分类对应的value值
     */
    initSelectInfo() {
      if (this.isMultiSelect) {
        // 多选
        this.tempSelectData = [...this.selectInfo];
      } else {
        // 单选
        this.tempSelectData = Object.assign({}, { ...this.selectInfo });
      }
    },
    /**
     * 判断是否选中该元素
     * @author lymn
     * @date 2020-08-31
     * @param {Number} id 文章id
     */
    isHasChecked(id) {
      const index = this.tempSelectData.findIndex(item => item.id === id);
      return index > -1;
    },
    /**
     * 多选时点击选中按钮
     * @author lymn
     * @date 2020-08-31
     */
    checkItem(e, data) {
      const checked = e.target.checked;
      const index = this.tempSelectData.findIndex(item => item.id === data.id);
      if (checked) {
        // 选中
        index === -1 && this.tempSelectData.push(data);
      } else {
        // 取消选中
        index > -1 && this.tempSelectData.splice(index, 1);
      }
      console.log(this.tempSelectData, '选中的数据');
    },
    /**
     * 删除选中的元素
     * @author lymn
     * @date 2020-08-31
     */
    deleteCheckedItem(data) {
      const index = this.tempSelectData.findIndex(item => item.id === data.id);
      if (index > -1) {
        this.tempSelectData.splice(index, 1);
      }
    },
  },
  watch: {
    async dialogVisible(newVal) {
      if (newVal) {
        await this.initRequestParam();
        if (this.selectType == 7) {
          await this.getPosterGroupList();
          await this.selectActiveNum(this.activeNum);
        } else {
          this.getGroupTagList().then(() => {
            this.allGroupTagList = [...this.groupTagList];
          }); // 针对视频/文档获取分类
          this.httpUrl = this.httpUrlList[this.selectType];
        }
        if (this.selectType == 6) {
          const parmes = {};
          this.requestParam = Object.assign(this.requestParam, parmes);
        }
        console.log(this.selectInfo);
        this.initSelectInfo();
        // this.tempSelectData = Object.assign({}, { ...this.selectInfo });
        this.checkIsKt = this.isKtuPoster;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/* 选择文章/表单/商品/视频/文档弹窗组件样式 start */
</style>

<style lang="scss"></style>
