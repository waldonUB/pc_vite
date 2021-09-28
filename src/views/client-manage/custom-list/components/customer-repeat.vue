<!--
 * @Description  : 客户查重
 * @Author       : turbo
 * @Date         : 2021-07-09 15:48:04
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-13 13:45:45
-->

<template>
  <div class="customer-repeat">
    <global-ts-tabguide @backToPrePage="$emit('backToPrePage')">
      <template #leftPart>客户列表</template>
      <template #rightPart>客户查重<global-ts-version :hide-hover-text="true"></global-ts-version></template>
    </global-ts-tabguide>
    <div class="pro_listBox" v-infinite-scroll="loadMore" infinite-scroll-immediate="false">
      <div class="head-tip">1、将根据以下客户字段进行查重：姓名/昵称、手机号码、微信号</div>
      <div class="head-tip">2、暂不支持企微客户的查重和合并</div>
      <el-table
        ref="sortTable"
        row-key="id"
        border
        min-width="1010px"
        empty-text="暂无重复客户"
        :data="customList"
        :span-method="toFixSpan"
        :row-style="setRowStyle"
        :cell-style="setCellStyle"
      >
        <el-table-column label="序号" prop="index" min-width="88px" fixed></el-table-column>
        <el-table-column label="客户" prop="contacts" min-width="325px" class-name="contacts" fixed>
          <template slot-scope="scope">
            <div class="contactsContent">
              <global-ts-text-img
                :img-url="scope.row.wxHeadImgUrl"
                :img-text="scope.row.contacts"
                :sex-color="sexColor(scope.row.sex)"
              ></global-ts-text-img>
              <span class="contactsBox" v-html="customerName(scope.row)"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="item.name"
          :min-width="item.width + 'px'"
          v-for="item of initSelectedList"
          :key="item.field"
        >
          <template slot-scope="scope">
            <div v-if="item.field === 'tagIdList'" class="tag-list">
              <ts-wxtag v-for="(item, index) of tagList(scope.row)" :key="index">
                {{ item.name }}
              </ts-wxtag>
              <span v-if="tagList(scope.row).length === 0">-</span>
            </div>
            <span v-else-if="item.field === 'relState'" class="text_but1" @click="showDetailInfo(scope.row.id)">
              详细
            </span>
            <span v-else v-html="columnName(scope.row, item.field)"></span>
          </template>
        </el-table-column>
        <el-table-column min-width="197px" fixed="right">
          <template #header>
            <div class="operate-table-header">
              <span>操作</span>
              <global-ts-tool-tips>
                <template #content>
                  <div>1、点击【忽略】后，该客户不进行此次合并</div>
                  <div>2、点击某个客户操作栏的【合并】后，将保留该客户，把其他相同的客户的信息</div>
                  <div>合并给TA（信息以最新更新的为准进行合并），关联跟进人不变</div>
                  <div>3、合并后，客户资料会互补，客户动态和跟进记录会合并</div>
                </template>
                <global-ts-svg-icon
                  class="header-icon"
                  name="icon-wenhao"
                  color="#898989"
                  hover-color="#333333"
                  :size="16"
                ></global-ts-svg-icon>
              </global-ts-tool-tips>
              <global-ts-svg-icon
                class="header-icon"
                name="icon-shezhi"
                color="#898989"
                hover-color="#333333"
                @click="showCustomFiled"
              ></global-ts-svg-icon>
            </div>
          </template>
          <template slot-scope="scope">
            <span class="text_but1" @click="ignoreCustomer(scope.row)">忽略</span>
            <span class="text_but1" @click="mergeCustomer(scope.row)">合并</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ts-custom-file
      :init-all-filed-list="allDefinedFieldList"
      :init-selected-list="initSelectedList"
      :dialog-visible.sync="customFiledDialogVisible"
      @changeSortSuccess="changeSortSuccess"
    ></ts-custom-file>
    <relevance-dialog :cid="selectedCustomId" :dialog-visible.sync="relevanceDialogVisible"></relevance-dialog>
  </div>
</template>

<script>
// components
import TsWxtag from '@/components/base/ts-wxtag/index.vue';
import TsCustomFile from '@/components/base/ts-custom-file/index.vue';
import RelevanceDialog from './relevance-dialog.vue';

// utils
import { encodeHtml, confirm } from '@/utils';
import { getCustomFiledList, getTagList } from '../utils';

// api
import { client } from '@/api';

export default {
  name: 'CustomerRepeat',
  components: { TsWxtag, TsCustomFile, RelevanceDialog },
  props: {
    allTagList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      customFiledDialogVisible: false,
      relevanceDialogVisible: false,
      selectedCustomId: 0,
      customList: [],
      allDefinedFieldList: [],
      initSelectedList: [],
      loadLock: false,
      pageNow: 1,
      lastIndex: 1, // 传递给后端的索引
      ignoreIdList: [],
    };
  },
  computed: {
    sexColor() {
      return function(sex) {
        return sex === 1 ? 'man' : sex === 2 ? 'woman' : '';
      };
    },
    customerName() {
      return function(row) {
        let name = row.myContacts || encodeHtml(row.contacts);
        const wxName = row.myWxName || row.wxName;
        name = wxName && wxName !== name ? `${name}<span class="custom-nick-name">（${wxName}）</span>` : name;
        return name;
      };
    },
    /**
     * 标签数据翻译
     * @author waldon
     * @date 2020-05-19
     * @param {Object} row
     * @returns
     */
    tagList() {
      return function(row) {
        return getTagList(this.allTagList, row);
      };
    },
    /**
     * 获取渲染的表格列数据
     * @author han
     * @date 2020-11-17
     * @param {Object} row - 表格列数据
     * @param {String} field - 表格列的字段名
     */
    columnName() {
      return function(row, field) {
        const name = `my${field[0].toUpperCase()}${field.slice(1)}`;
        let str = '';
        if (row[field]) {
          if (row[name]) {
            str = row[name];
          } else {
            if (field === 'salesRelTime') {
              str = row['salesRelTimeName'];
            } else if (field === 'birthday') {
              str = row['birthdayTimeName'];
            } else {
              str = encodeHtml(row[field].toString());
            }
          }
        } else {
          str = field === 'staffName' ? '无' : '-';
        }
        return str;
      };
    },
  },
  created() {
    this.getCustomFiledList();
    this.getRepeatList();
  },
  methods: {
    /**
     * 获得用户自定义列表
     * @author han
     * @date 2020-11-16
     */
    async getCustomFiledList() {
      this.initSelectedList = []; // 为了清空饿了么表格的列缓存
      const { allDefinedFieldList, initSelectedList } = await getCustomFiledList(3);
      this.allDefinedFieldList = allDefinedFieldList;
      this.initSelectedList = initSelectedList;
    },
    /**
     * 获得重复数据客户
     * @author han
     * @date 2020-11-16
     */
    async getRepeatList() {
      this.lastIndex = this.customList.length ? this.customList.length - 1 : 1;
      const { getTsRepeatClientList } = client;
      const [err, res] = await getTsRepeatClientList({
        pageNow: this.pageNow,
        index: this.lastIndex,
        limit: 3000,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const list = res.data;
      this.getAssignRepeat(list);
      !list.length && (this.loadLock = true);
    },
    /**
     * 合并刚请求来的数据
     * @author han
     * @date 2020-11-19
     * @param {Array} list - 刚请求来的数据
     */
    getAssignRepeat(list) {
      if (!list.length) return;
      if (this.pageNow !== 1) {
        if (this.lastIndex === list[0].index) {
          // 反转数组找上个数组中应该合并的第一个数组.反转找更快一些
          let reversCustomList = [...this.customList].reverse();
          reversCustomList.findIndex((item, index) => {
            if (item.myLength) {
              reversCustomList = [...this.customList.splice(-index - 1)];
              return true;
            }
          });
          reversCustomList[reversCustomList.length - 1].setBorder = false;
          reversCustomList[0].myLength = list[0].myLength + reversCustomList[0].myLength;
          list[0].myLength = null;
          list.unshift(...reversCustomList);
        }
      }
      while (list.length && list[0].myLength) {
        this.getFlatData(list.splice(0, list[0].myLength));
      }
    },
    /**
     * 把相似数组归类
     * @author han
     * @date 2020-11-16
     * @param {Array} needFlatArr - 需要合并的数组
     */
    getFlatData(needFlatArr) {
      let arr = [...needFlatArr];
      arr = this.setHtmlTag([...arr]);
      this.customList.push(...arr);
      this.$nextTick(() => {
        this.$refs.sortTable.doLayout();
      });
    },
    /**
     * 设置数组查询的富文本
     * @author han
     * @date 2020-11-18
     * @param {Array} sameClassArr - 需要设置富文本的数组
     * @returns {Array} 更改后富文本的数组
     */
    setHtmlTag(sameClassArr) {
      const replaceArr = ['contacts', 'wxName', 'mobile', 'wx'];
      const sign = { contacts: {}, mobile: {}, wx: {} };
      sameClassArr.forEach((sameItem, index) => {
        replaceArr.forEach(replaceItem => {
          const replaceNum =
            replaceItem === 'wxName' ? sign.contacts[sameItem.wxName] : sign[replaceItem][sameItem[replaceItem]];
          if (!replaceNum) {
            if (replaceItem === 'wxName') {
              sign.contacts[sameItem.wxName] = 0;
            } else {
              sign[replaceItem][sameItem[replaceItem]] = 0;
            }
          }

          if (replaceItem === 'wxName') {
            sign.contacts[sameItem.wxName]++;
            if (sameItem.wxName === sameItem.contacts) {
              sign.contacts[sameItem.wxName]--;
            }
          } else {
            sign[replaceItem][sameItem[replaceItem]]++;
          }
        });
      });
      sameClassArr.forEach((sameItem, index) => {
        replaceArr.forEach(replaceItem => {
          const replaceNum =
            replaceItem === 'wxName' ? sign.contacts[sameItem.wxName] : sign[replaceItem][sameItem[replaceItem]];
          const replaceStr = encodeHtml(sameClassArr[index][replaceItem]);
          if (replaceNum > 1) {
            const name = `my${replaceItem[0].toUpperCase()}${replaceItem.slice(1)}`;
            sameClassArr[index][name] = replaceStr
              ? replaceStr.replace(replaceStr, `<span class="high-light">${replaceStr}</span>`)
              : replaceStr;
          } else {
            // contacts要用于首显头像
            if (replaceItem !== 'contacts') {
              sameClassArr[index][replaceItem] = replaceStr;
            }
          }
        });
      });
      return sameClassArr;
    },
    /**
     * 合并客户列表
     * @author han
     * @date 2020-11-16
     * @param {Number} row - 一行的数据
     * @param {Number} columnIndex - 当前列索引
     */
    toFixSpan({ row, columnIndex }) {
      if (columnIndex === 0) {
        return {
          rowspan: row.myLength ? row.myLength : 0,
          colspan: row.myLength ? 1 : 0,
        };
      }
    },
    /**
     * 设置border
     * @author han
     * @date 2020-11-18
     * @param {Object} row - 这一行的信息
     * @param {Number} rowIndex - 当前行的索引
     */
    setRowStyle({ row, rowIndex, columnIndex }) {
      let style =
        (row.setBorder && rowIndex !== this.customList.length - 1) || (rowIndex === 0 && columnIndex === 0)
          ? {
              height: '49px',
              borderBottom: '10px solid #F3F3F5',
            }
          : {
              height: '49px',
            };
      // 解决设置了border-collapse: collapse;fix的表格没有border的问题
      if (columnIndex === this.initSelectedList.length) {
        style = Object.assign(style, { borderRight: '2px solid #ebeef5' });
      }
      return style;
    },
    /**
     * 设置cell的样式
     * @author han
     * @date 2020-11-18
     * @param {Number} columnIndex - 当前列
     * @param {Number} row - 当前行信息
     */
    setCellStyle({ columnIndex, row }) {
      let style =
        columnIndex === 0 && row.index !== this.customList[this.customList.length - 1].index
          ? {
              borderBottom: '10px solid #F3F3F5',
            }
          : {};
      if (row.myLength && columnIndex === 0) {
        style = Object.assign(style, { background: '#fff', pointerEvents: 'none' });
      }
      return style;
    },
    /**
     * 下拉加载
     * @author han
     * @date 2020-11-23
     */
    loadMore() {
      if (this.loadLock) return;
      this.pageNow++;
      this.getRepeatList();
    },
    showDetailInfo(customId) {
      this.selectedCustomId = customId;
      this.relevanceDialogVisible = true;
    },
    showCustomFiled() {
      this.customFiledDialogVisible = true;
    },
    /**
     * 点击忽略
     * @author han
     * @date 2020-11-16
     * @param {Object} row - 行数据
     */
    async ignoreCustomer(row) {
      const { getTsRepeatClientList } = client;
      this.ignoreIdList.push(row.id);
      const [err, res] = await getTsRepeatClientList({
        ignoreIdList: JSON.stringify(this.ignoreIdList),
        limit: 3000,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.customList = [];
      this.getAssignRepeat(res.data);
    },
    /**
     * 点击合并
     * @author han
     * @date 2020-11-16
     * @param {Object} row - 行数据
     */
    mergeCustomer(row) {
      let repeatNum = -1,
        start = -1;
      const rowIndex = row.index,
        clientId = row.id,
        sameClientIdList = [];
      for (let i = rowIndex; i >= 0; i--) {
        if (this.customList[i].myLength) {
          repeatNum = this.customList[i].myLength;
          break;
        }
      }
      this.customList.forEach((item, i) => {
        if (item.index === row.index) {
          if (item.id !== clientId) {
            sameClientIdList.push(item.id);
          }
          if (item.myLength) {
            repeatNum = item.myLength;
            start = i;
          }
        }
      });
      confirm(
        `此次将合并${repeatNum}条客户数据，跟进人指定为"${row.staffName}"，合并后无法撤销，请慎重`,
        '合并确认',
      ).then(async () => {
        const { mergerRepeatTsClient } = client;
        const [err, res] = await mergerRepeatTsClient({
          clientId,
          ignoreIdList: JSON.stringify(this.ignoreIdList),
          sameClientIdList: JSON.stringify(sameClientIdList),
        });
        this.$utils.postMessage({
          type: err ? 'error' : 'success',
          message: err ? err.msg || '网络错误，请稍候重试' : res.msg || '操作成功',
        });
        if (!err) {
          this.customList.splice(start, repeatNum);
          if (start) {
            for (let i = start; i < this.customList.length - 1; ) {
              this.customList[i].index--;
              i += this.customList[i].myLength;
            }
            this.customList[this.customList.length - 1].index--;
          }
        }
      });
    },
    /**
     * 获得用户自定义数据
     * @author han
     * @date 2020-11-17
     * @param {Object} selectData - 已选择的数据
     */
    async changeSortSuccess(selectData) {
      const { batchSetTsUserDefinedList } = client;
      const [err, res] = await batchSetTsUserDefinedList({
        fieldJson: selectData.fieldJson,
        type: 3, // 3为客户查重
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.customFiledDialogVisible = false;
      this.getCustomFiledList();
    },
  },
};
</script>

<style lang="scss" scoped>
.customer-repeat {
  position: relative;
  width: 100%;
  height: 100%;

  ::v-deep {
    .el-table__body,
    .el-table__footer,
    .el-table__header {
      border-collapse: collapse;
    }

    .high-light {
      background-color: $primary-color-bg;
    }
  }

  .head-tip {
    margin-bottom: 20px;
    color: $color-53;

    &:first-child {
      margin-bottom: 8px;
    }
  }

  .custom-nick-name {
    color: $color-53;
  }

  .tag-list {
    @include flex-center;

    ::v-deep .tagText {
      max-width: 5em;
      min-width: 5em;
    }
  }
}
</style>
