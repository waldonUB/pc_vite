<!--
 * @Author       : ADI
 * @Date         : 2021-05-19 10:41:36
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-30 18:09:42
-->
<template>
  <div id="classifyManager" class="classifyManager" v-show="isShow">
    <div class="classifyHeader">
      <global-ts-tabguide @backToPrePage="backLast">
        <template v-slot:leftPart>企业文库</template>
        <template v-slot:rightPart>
          分类管理
        </template>
      </global-ts-tabguide>
      <global-ts-button
        v-if="!version"
        class="pro_header_addEm"
        type="primary"
        size="small"
        icon="icon-icon-11"
        @click="addClassifyRel"
        ref="addButton"
        >新增分类
      </global-ts-button>
    </div>
    <div class="showTabList">
      <el-table
        :class="'tshu-tableset'"
        :data="classifyData.dataList"
        border
        min-width="1010px"
        header-row-class-name="employeeHeader"
        cell-class-name="cellStyle"
      >
        <template slot="empty">
          <global-ts-nodata :isDefaultText="version">
            暂无数据
          </global-ts-nodata>
        </template>
        <el-table-column v-cloak key="name" prop="name" label="分类" min-width="240px"></el-table-column>
        <el-table-column v-cloak key="sort" prop="sort" label="排序" min-width="240px">
          <template slot-scope="scope">
            <div class="positionBox" style="display: inline-block;">
              <span @click="removeClassify(scope.row, 'up')" v-if="!scope.row.noShowUp" class="removeClassify">
                上移
              </span>
              <span @click="removeClassify(scope.row, 'down')" v-if="!scope.row.noShowDown" class="removeClassify">
                下移
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-cloak key="operate" prop="operate" label="编辑" min-width="240px">
          <template slot-scope="scope">
            <div class="positionBox" style="display: inline-block;">
              <span class="tanshu_linkColor" @click="e => editClassify(scope.row, e)">重命名</span>
              <span class="tanshu_linkColor" style="color: #ff4d4d;" @click="deleteClassify(scope.row.id)">删除 </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <global-ts-pagination
      :tableData="classifyData.dataList"
      :requestParam="requestParam"
      :isReload.sync="isReload"
      @getData="changeTable"
      :httpurl="classifyData.httpurl"
    >
    </global-ts-pagination>
    <ts-classify-bubble
      ref="tanShuBubble"
      :initForm="bubbleInitForm"
      :isShow.sync="isShowBubble"
      :linkTarget="linkTarget"
      :httpurl="classifyUrl"
      @submitSuccess="reloadTable"
    >
    </ts-classify-bubble>
  </div>
</template>

<script>
import commonData from '../../mixins/common-data/index.js';
import { Table, TableColumn } from 'element-ui';
import TsClassifyBubble from '@/components/base/ts-classify-bubble/index.vue';
import { mapState } from 'vuex';
import { confirm, postMessage } from '@/utils';
import { delArticleType, updateSort } from '@/api/modules/views/customer-tools/article-material';

export default {
  name: 'classify-manager-vm',
  mixins: [commonData],
  components: { [Table.name]: Table, [TableColumn.name]: TableColumn, TsClassifyBubble },
  props: {},
  data() {
    return {
      classifyData: {
        dataList: [],
        httpurl: '/rest/manage/article/type/getTempTypeList',
      },
      requestParam: {},
      isReload: false,
      isShow: true,
      classifyBubble: null,
      classifyUrl: '',
      bubbleInitForm: {}, // 气泡初始值
    };
  },
  computed: {
    ...mapState({
      version: state => !state.globalData?.functionInfo?.articleTypeAdd?.condition,
    }),
  },
  watch: {},
  created() {
    this.isReload = true;
  },
  mounted() {},
  methods: {
    /**
     * 返回上一级
     * */
    backLast() {
      this.isShow = false;
      this.parent.isShow = true;
      this.getTempTypeList().then(res => {
        // 这个方式不涉及到路由，直接显示然后重新加载数据即可
        this.parent.typeList = res;
        this.parent.allSubClassify.templateTypeList = res;
        const current = this.parent.typeList.find(item => item.id === this.parent.requestParam.typeId);
        if (!current) {
          this.parent.requestParam.type = -1;
          this.parent.requestParam.typeId = -1;
        }
        this.parent.isReload = true;
      });
    },
    changeTable(data) {
      if (!this.version) {
        this.classifyData.dataList = data;
        this.classifyData.dataList = this.classifyData.dataList.filter(item => item.name !== '未分类');
        this.classifyData.dataList.forEach((item, index) => {
          if (index === 0) {
            item.noShowUp = true;
          } else if (index === this.classifyData.dataList.length - 1) {
            item.noShowDown = true;
          }
        });
      }
    },
    deleteClassify(id) {
      confirm('提示：分类删除后，该分类下文章可在“未分类”选项中找回', '确定删除此分类？').then(async () => {
        const [err, res] = await delArticleType({
          id,
        });
        if (err) {
          postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        postMessage({
          type: 'success',
          message: res.msg,
        });
        this.isReload = true;
      });
    },
    addClassifyRel() {
      this.classifyUrl = '/rest/manage/article/type/addArticleType';
      this.addClassify(this.$refs.addButton.$el);
    },
    editClassify(item, event) {
      this.classifyUrl = '/rest/manage/article/type/updateArticleType';
      this.bubbleInitForm = { ...item };
      this.addClassify(event.target);
    },
    addClassify(target, position = 'right') {
      this.linkTarget = {
        target,
        position,
      };
      this.isShowBubble = true;
    },
    /**
     * 上移或下移操作
     * @author waldon
     * @date 2020-04-19
     * @param {number} row - 移位的分类
     * @param {string} type - 移位的类型 up: 上移 down: 下移
     */
    async removeClassify(row, type) {
      let swapItem = null;
      if (type === 'up') {
        const list = [...this.classifyData.dataList];
        swapItem = list.reverse().find(item => item.sort > row.sort);
      } else {
        swapItem = this.classifyData.dataList.find(item => item.sort < row.sort);
      }
      if (!swapItem) {
        return;
      }
      const params = {
        id: row.id,
        swapId: swapItem.id,
      };
      const [err, res] = await updateSort(params);
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.isReload = true;
    },
    reloadTable() {
      this.isReload = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.classifyManager {
  .positionBox {
    .tanshu_linkColor {
      margin-left: 6px;
      &:first-child {
        margin-left: 0;
      }
    }
  }
}
</style>

<style lang="scss">
.classifyManager {
  .el-table {
    .cellStyle {
      text-align: center;
    }
  }
}
</style>
