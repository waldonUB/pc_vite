<!--
 * @Description  : 标签管理
 * @Author       : turbo
 * @Date         : 2021-03-30 14:14:30
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-22 10:43:35
-->

<template>
  <div class="tag-manage">
    <ts-corp-top-tip from-page="标签管理"></ts-corp-top-tip>
    <global-ts-header>
      <template #leftPart>标签管理</template>
      <template #rightPart>
        <global-ts-button type="primary" size="small" @click="beforeSyncWxTagManage">
          同步企微标签
        </global-ts-button>
        <global-ts-button type="primary" size="small" icon="icon-icon-11" @click="editWxTagManager()">
          添加标签
        </global-ts-button>
      </template>
    </global-ts-header>
    <div class="pro_listBox">
      <el-table
        ref="sortTable"
        row-key="id"
        border
        min-width="1010px"
        cell-class-name="cellStyle"
        :data="wxTagManagerList"
      >
        <el-table-column label="序号" type="index" min-width="60px"></el-table-column>
        <el-table-column label="标签组" prop="name" min-width="200px"></el-table-column>
        <el-table-column label="标签" min-width="800px">
          <template slot-scope="scope">
            <div class="tag-list">
              <ts-wxtag
                class="wxtag"
                type="selected"
                v-for="item in tagList(scope.row)"
                :key="item.id"
                :class="{ withMore: scope.row.withMore }"
                :tips="item.nameWithCnt"
                @click="getMoreTagList(scope.row)"
              >
                {{ item.nameWithCnt }}
              </ts-wxtag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100px">
          <template slot-scope="scope">
            <span class="text_but1" @click="editWxTagManager(scope.row)">编辑</span>
            <span class="text_but1" @click="deleteWxTagManager(scope.row.id)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <confirm-sync-dialog :dialog-visible.sync="confirmDialogVisible" @sure="syncWxTagManage"></confirm-sync-dialog>
    <edit-tag-dialog
      :tag-group-info="tagGroupInfo"
      :dialog-visible.sync="editTagDialogVisible"
      @editTagSuccess="reloadTable"
    ></edit-tag-dialog>
  </div>
</template>

<script>
// components
import TsCorpTopTip from '@/components/base/ts-corp-top-tip/index.vue';
import TsWxtag from '@/components/base/ts-wxtag/index.vue';
import ConfirmSyncDialog from './components/confirm-sync-dialog.vue';
import EditTagDialog from './components/edit-tag-dialog.vue';

// utils
import { getWxWorkConfInfo, confirm, gotoWxCorpSet } from '@/utils';

// api
import { wxwork } from '@/api';

export default {
  name: 'TagManage',
  components: { TsCorpTopTip, TsWxtag, ConfirmSyncDialog, EditTagDialog },
  data() {
    return {
      requestParam: {
        // 标签组请求参数
        type: 0, // type状态 0 - 全部 1 - 标签 2 - 标签组
        isGetAll: true,
      },
      tagGroupInfo: {},
      wxTagManagerList: [], // 企微标签列表
      isShowType: false,
      screenWidth: document.body.clientWidth,
      lineNum: 8, // 1920屏幕下，每行显示8个
      confirmDialogVisible: false, // 确定同步弹窗
      editTagDialogVisible: false,
    };
  },
  computed: {
    /**
     * 获取标签列表
     * @author waldon
     * @date 2020/4/10
     * @param {Object} row - 当前行数据
     */
    tagList() {
      return function(row) {
        if (this.screenWidth >= 1767) {
          this.lineNum = 8;
        } else if (this.screenWidth >= 1589) {
          this.lineNum = 7;
        } else {
          this.lineNum = 6;
        }
        let tagList = row.tag; // 2020年8月5日 14:47:31，统计标签使用数，直接拿tag的List
        if (tagList && tagList.length > this.lineNum * 3 && !row.isShowMore) {
          tagList = tagList.slice(0, this.lineNum * 3 - 1);
          tagList.push('更多标签 >');
          row.withMore = true;
        }
        return tagList;
      };
    },
  },
  async created() {
    const wxWorkConfInfo = await getWxWorkConfInfo();
    this.isShowType = !wxWorkConfInfo?.wxWorkChannelListConf?.available ? 1 : 2;
    this.getTagManagerList();
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        this.screenWidth = window.screenWidth;
        this.screenWidth += 1;
      })();
    };
  },
  methods: {
    /**
     * 获取标签组列表
     * @author waldon
     * @date 2020/4/10
     */
    async getTagManagerList() {
      const { getCorpTagList } = wxwork;
      const [err, res] = await getCorpTagList(this.requestParam);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.wxTagManagerList = res.data;
    },
    reloadTable() {
      setTimeout(() => {
        // 调企微接口延迟1秒再查询
        this.getTagManagerList();
      }, 1000);
    },
    /**
     * 同步企微标签
     * @author waldon
     * @date 2020/4/10
     */
    beforeSyncWxTagManage() {
      if (this.isShowType === 1) {
        return confirm('您还未完成企业微信相关信息设置，无法使用此功能', '通知', '去设置').then(() => {
          gotoWxCorpSet();
        });
      }
      this.confirmDialogVisible = true;
    },
    /**
     * 同步企微标签
     * @author waldon
     * @date 2020/8/3
     * @param {*} synced - 是否同步系统标签
     */
    async syncWxTagManage(synced) {
      const { syncCorpTagList } = wxwork;
      const [err, res] = await syncCorpTagList({
        synced,
      });
      this.$utils.postMessage({
        type: err ? 'error' : 'success',
        message: err ? err.msg || '网络错误，请稍候重试' : '同步成功',
      });
      !err && this.reloadTable();
    },
    /**
     * 获取更多数据
     * @author waldon
     * @date 2020/4/10
     * @param {Object} row - 当前行数据
     */
    getMoreTagList(row) {
      row.isShowMore = true;
      // 每个标签组最多有100个标签，并更改监听触发渲染
      this.lineNum = 100;
      row.withMore = false;
    },
    editWxTagManager(row = {}) {
      this.tagGroupInfo = row;
      this.editTagDialogVisible = true;
    },
    /**
     * 删除标签和分组
     * @param {string} id - 当前分组的id
     * @author waldon
     * @date 2020/4/10
     */
    deleteWxTagManager(id) {
      confirm('是否确认删除整个标签组，一旦删除企业微信的标签也会被同步删除且无法恢复').then(async () => {
        const { delCorpTag } = wxwork;
        const [err, res] = await delCorpTag({ id });
        if (err) {
          this.$utils.postMessage({
            type: err ? 'error' : 'success',
            message: err ? err.msg || '网络错误，请稍候重试' : '操作成功',
          });
          return Promise.reject(err);
        }
        this.reloadTable();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.tag-manage {
  ::v-deep {
    .tag-list {
      @include flex-center-wrap;

      position: sticky;
    }
  }

  .wxtag {
    cursor: default;

    &.withMore {
      &:last-child {
        background-color: transparent;
        border-color: transparent;
      }
    }

    ::v-deep {
      .tagText {
        width: 6em;
      }
    }
  }
}
</style>
