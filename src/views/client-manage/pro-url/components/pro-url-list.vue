<!--
 * @Description  : 推广链接列表
 * @Author       : turbo
 * @Date         : 2021-07-22 17:26:21
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-23 09:49:33
-->

<template>
  <div class="pro-url-list">
    <global-ts-header>
      <template #leftPart>
        推广链接
        <div class="redTip">*该功能仅限专用版开放使用</div>
      </template>
    </global-ts-header>
    <div v-if="!isMainAcct" class="empty-content">
      <div class="tip">第三方接入功能正在内测中，敬请期待</div>
    </div>
    <div v-else-if="!isCreator" class="pro_listBox">
      <el-table ref="sortTable" row-key="id" border min-width="1010px" cell-class-name="cellStyle" :data="dataList">
        <el-table-column label="公司名称" prop="name" min-width="80px"></el-table-column>
        <el-table-column label="推广链接" prop="showProUrl" min-width="250px"></el-table-column>
        <el-table-column label="操作" min-width="100px">
          <template slot-scope="scope">
            <span class="text_but1" @click="copyUrl(scope.row.showProUrl)">点击复制</span>
          </template>
        </el-table-column>
      </el-table>
      <global-ts-pagination
        :table-data="dataList"
        :httpurl="ajaxUrl"
        :is-reload.sync="isReload"
        @getData="changeTable"
      ></global-ts-pagination>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

// utils
import { clipboard } from '@/utils';

export default {
  name: 'ProUrlList',
  data() {
    return {
      isReload: false,
      ajaxUrl: '/ajax/third/tsProUrl_h.jsp?cmd=getProUrlCompanyList',
      dataList: [],
    };
  },
  computed: {
    ...mapState({
      isMainAcct: state => state.user.info.isMainAcct,
    }),
    ...mapGetters({
      isCreator: 'user/isCreator',
    }),
  },
  created() {
    if (!this.isMainAcct || !this.isCreator) return;
    this.$emit('toOpenForm');
  },
  methods: {
    changeTable(data) {
      this.dataList = data;
    },
    copyUrl(url) {
      clipboard(url, '复制成功', '当前浏览器不支持');
    },
  },
};
</script>

<style lang="scss" scoped>
.pro-url-list {
  height: 100%;

  .empty-content {
    width: 100%;
    height: calc(100% - 60px);
    padding-top: 40px;
    background-color: $color-ff;

    .tip {
      font-size: 18px;
      color: $color-89;
      text-align: center;
    }
  }
}
</style>
