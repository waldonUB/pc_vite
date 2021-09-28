<!--
 * @Description  : 文件夹 - 回收站
 * @Author       : turbo
 * @Date         : 2021-03-30 14:06:13
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-16 14:27:21
-->

<template>
  <div class="materialRecycle">
    <global-ts-header>
      <template v-slot:leftPart>
        回收站
        <global-ts-tool-tips>
          <global-ts-svg-icon class="icon helpIcon" name="icon-bianzu" @click="toHelpCenter"></global-ts-svg-icon>
          <div slot="content">
            内容会在回收站保留15天，之后会永久删除
          </div>
        </global-ts-tool-tips>
      </template>
    </global-ts-header>
    <div class="pro_listBox" v-cloak>
      <div class="pro_line">
        <fa-input
          style="width: 200px;"
          v-model="requestParam.name"
          @keyup.enter.native="reloadFormData"
          placeholder="搜索文件/文件夹"
        >
        </fa-input>
        <global-ts-select
          class="typeGroupBox"
          style="width: 200px;"
          v-model="requestParam.typeGroup"
          :selectkey="{ label: 'key', value: 'value' }"
          :list="typeGroupList"
          v-if="isManage"
        >
        </global-ts-select>
        <global-ts-select
          class="typeGroupBox"
          style="width: 200px;"
          v-model="requestParam.isDir"
          :selectkey="{ label: 'key', value: 'value' }"
          :list="dirTypeList"
        >
        </global-ts-select>
        <global-ts-button
          type="primary"
          size="small"
          class="queryBtn"
          icon="icon-icon-4"
          ref="button"
          @click="reloadFormData"
        >
          搜索
        </global-ts-button>
        <global-ts-dropdown placement="bottom" :downData="downData" @handleClick="downItemClick">
          <template v-slot:link>
            <global-ts-button class="queryBtn" type="primary" size="small">批量操作 </global-ts-button>
          </template>
        </global-ts-dropdown>
      </div>
      <div class="recycleList">
        <el-table
          :data="recycleList"
          header-row-class-name="employeeHeader"
          cell-class-name="cellStyle"
          :fit="true"
          border
          @select="changeSelect"
          @select-all="changeSelect"
        >
          <el-table-column type="selection" width="74"> </el-table-column>
          <el-table-column prop="position" label="位置"></el-table-column>
          <el-table-column prop="position" label="类型">
            <template slot-scope="scope">
              {{ scope.row.isDir ? '文件夹' : '文件' }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="名称" min-width="400"></el-table-column>
          <el-table-column prop="delName" label="删除人" min-width="130">
            <template slot-scope="scope">
              {{ $utils.showStaffName(tsStaffExtraList, scope.row.deler, scope.row.delName) }}
            </template>
          </el-table-column>
          <el-table-column prop="delTime" label="删除时间" min-width="187"></el-table-column>
          <el-table-column prop="sizeName" label="文件大小" min-width="116"></el-table-column>
          <el-table-column prop="name" label="操作" min-width="150">
            <template slot-scope="scope">
              <global-ts-button
                class="text_but1 em_edit delBtn"
                type="default"
                size="mini"
                @click="batchDelFile([{ isDir: scope.row.isDir, id: scope.row.id }])"
              >
                彻底删除
              </global-ts-button>
              <global-ts-button
                class="text_but1 em_edit resetBtn"
                type="default"
                size="mini"
                @click="batchRevertFile([{ isDir: scope.row.isDir, id: scope.row.id }])"
              >
                还原
              </global-ts-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <global-ts-fai-pagination
        class="paginationBox"
        @changePage="getFileList"
        :withMargin="false"
        :pageOption.sync="pages"
      >
      </global-ts-fai-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { batchDelFileOrDir, batchRevertFileOrDir } from '@/api/modules/views/customer-tools';
import { getFileMatList } from '@/api/modules/component/file-select-dialog';

export default {
  name: 'MaterialRecycle',
  data() {
    return {
      requestParam: {
        typeGroup: 13, // 文件类型
        groupId: -1, // 回收站列表调用时传-1
        name: '', // 根据名称查询
        del: 1, // 回收站列表调用时传1
        isDir: -1, // 是否为文件夹，-1:全部 0：文件 1：文件夹
      },
      downData: [
        // 批量处理按钮
        {
          type: 1,
          name: '批量还原',
        },
        {
          type: 2,
          name: '批量删除',
        },
      ],
      recycleList: [
        // 回收文件列表
      ],
      pages: {
        // 分页
        pageNow: 1,
        limit: 10,
        maxPage: 2,
        total: 20,
      },
      typeGroupList: [
        // 文件类型
        {
          key: '我的文件',
          value: 13,
        },
        {
          key: '企业文件',
          value: 12,
        },
      ],
      dirTypeList: [
        {
          key: '全部类型',
          value: -1,
        },
        {
          key: '文件夹',
          value: 1,
        },
        {
          key: '文件',
          value: 0,
        },
      ],
      checkIds: [], // 选中的文件列表
    };
  },
  computed: {
    ...mapGetters({
      isManage: 'user/isManage',
    }),
    ...mapState({
      tsStaffExtraList: state => state.user.tsStaffExtraList,
    }),
  },
  created() {
    this.getFileList();
  },
  methods: {
    toHelpCenter() {},
    /**
     * 加载数据
     * @author lymn
     * @date 2020-11-03
     */
    reloadFormData() {
      this.pages.pageNow = 1;
      this.getFileList();
    },
    /**
     * 批量操作
     * @author lymn
     * @date 2020-11-03
     * @param {Boolean} param
     * @return {Boolean} return
     */
    downItemClick(item) {
      switch (item.type) {
        case 1:
          // 批量还原
          this.batchRevertFile(this.checkIds);
          break;
        case 2:
          // 批量删除
          this.batchDelFile(this.checkIds);
          break;
      }
    },
    /**
     * 改变选中数据
     * @author lymn
     * @date 2020-11-12
     * @param {Array}} selection 选中数据
     */
    changeSelect(selection) {
      this.checkIds = selection.map(item => {
        return {
          isDir: item.isDir,
          id: item.id,
        };
      });
    },
    changePage() {},
    /**
     * 获取回收站文件列表
     * @author lymn
     * @date 2020-11-12
     * @param {Boolean} param
     * @return {Boolean} return
     */
    async getFileList() {
      const [err, res] = await getFileMatList(Object.assign(this.requestParam, this.pages));
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.recycleList = res.data;
      this.pages.total = res.total;
    },
    /**
     * 永久删除文件
     * @author lymn
     * @date 2020-11-12
     * @param {Array} checkIds 要删除的文件列表,格式如下[{isDir:是否为文件夹, id:文件/文件夹id}]
     */
    async batchDelFile(checkIds) {
      const params = {
        delList: JSON.stringify(checkIds),
        isPhyl: true, // 是否物理删除,回收站传true
        type: this.requestParam.typeGroup,
      };
      const [err, res] = await batchDelFileOrDir(params);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.getFileList();
    },
    /**
     * 还原文件
     * @author lymn
     * @date 2020-11-12
     * @param {Array} checkIds 要删除的文件列表,格式如下[{isDir:是否为文件夹, id:文件/文件夹id}]
     */
    async batchRevertFile(checkIds) {
      const params = {
        revertList: JSON.stringify(checkIds),
      };
      const [err, res] = await batchRevertFileOrDir(params);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.getFileList();
    },
  },
};
</script>

<style lang="scss" scoped>
.materialRecycle {
  .delBtn {
    color: $error-color;
  }
  .resetBtn {
    color: $primary-color;
  }
  .queryBtn {
    margin-right: 10px;
  }
  .paginationBox {
    margin-top: 20px;
  }
}
</style>
