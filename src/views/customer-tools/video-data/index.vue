<!--
 * @Description  : 获客视频 - 数据
 * @Author       : turbo
 * @Date         : 2021-03-30 13:53:29
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-30 14:17:27
-->

<template>
  <div class="videoData">
    <global-ts-header>
      <template v-slot:leftPart>
        <div class="flex flex-vc">
          视频数据
        </div>
      </template>
    </global-ts-header>
    <div class="pro_listBox">
      <div class="pro_line">
        <ts-select-list
          class="floatLeft"
          v-if="isNoOneSelfDataAuth"
          :depIdList.sync="requestParam.depIdList"
          :sids.sync="requestParam.sids"
        >
        </ts-select-list>
        <fa-input
          style="width: 200px;"
          v-model="requestParam.name"
          @keyup.enter.native="getTsVideoDataList"
          placeholder="视频名称"
        >
        </fa-input>
        <global-ts-date-picker :clearable="false" @updateTime="getSearchTime" defaultStartTime="year" />
        <global-ts-button type="primary" size="small" icon="icon-icon-4" ref="button" @click="getTsVideoDataList">
          搜索
        </global-ts-button>
      </div>
      <el-table
        ref="tab"
        :data="videoList"
        border
        cell-class-name="cellStyle"
        header-row-class-name="employeeHeader"
        box-sizing="border-box"
      >
        <el-table-column label="成员" min-width="150" prop="staffName">
          <template slot-scope="scope">
            {{ $utils.showStaffName(tsStaffExtraList, scope.row.sid, scope.row.staffName) }}
          </template>
        </el-table-column>
        <el-table-column label="视频名称" min-width="500" prop="name"></el-table-column>
        <el-table-column label="分享次数" min-width="150" prop="shares">
          <template #header>
            <div class="sortBar" @click="changeSortType('shares')">
              <span class="createTime">分享次数</span>
              <span class="sortArrow">
                <global-ts-svg-icon
                  class="icon"
                  name="icon-shaixuanshang"
                  :class="!requestParam.desc && requestParam.sortKey === 'shares' ? '' : 'isNotActive'"
                ></global-ts-svg-icon>
                <global-ts-svg-icon
                  class="icon"
                  name="icon-shaixuanxia"
                  :class="requestParam.desc && requestParam.sortKey === 'shares' ? '' : 'isNotActive'"
                ></global-ts-svg-icon>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="播放次数" min-width="150" prop="clicks">
          <template #header>
            <div class="sortBar" @click="changeSortType('clicks')">
              <span class="createTime">播放次数</span>
              <span class="sortArrow">
                <global-ts-svg-icon
                  class="icon"
                  name="icon-shaixuanshang"
                  :class="!requestParam.desc && requestParam.sortKey === 'clicks' ? '' : 'isNotActive'"
                ></global-ts-svg-icon>
                <global-ts-svg-icon
                  class="icon"
                  name="icon-shaixuanxia"
                  :class="requestParam.desc && requestParam.sortKey === 'clicks' ? '' : 'isNotActive'"
                ></global-ts-svg-icon>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="分享人数" min-width="150" prop="shareViewers">
          <template #header>
            <div class="sortBar" @click="changeSortType('shareViewers')">
              <span class="createTime">分享人数</span>
              <span class="sortArrow">
                <global-ts-svg-icon
                  class="icon"
                  name="icon-shaixuanshang"
                  :class="!requestParam.desc && requestParam.sortKey === 'shareViewers' ? '' : 'isNotActive'"
                ></global-ts-svg-icon>
                <global-ts-svg-icon
                  class="icon"
                  name="icon-shaixuanxia"
                  :class="requestParam.desc && requestParam.sortKey === 'shareViewers' ? '' : 'isNotActive'"
                ></global-ts-svg-icon>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="播放人数" min-width="150" prop="clickViewers">
          <template #header>
            <div class="sortBar" @click="changeSortType('clickViewers')">
              <span class="createTime">播放人数</span>
              <span class="sortArrow">
                <global-ts-svg-icon
                  class="icon"
                  name="icon-shaixuanshang"
                  :class="!requestParam.desc && requestParam.sortKey === 'clickViewers' ? '' : 'isNotActive'"
                ></global-ts-svg-icon>
                <global-ts-svg-icon
                  class="icon"
                  name="icon-shaixuanxia"
                  :class="requestParam.desc && requestParam.sortKey === 'clickViewers' ? '' : 'isNotActive'"
                ></global-ts-svg-icon>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="播放总时长" min-width="150" prop="visitTime"></el-table-column>
      </el-table>
      <global-ts-fai-pagination @changePage="changePage" :pageOption.sync="pages"> </global-ts-fai-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { format } from '@/utils';
import TsSelectList from '@/components/base/ts-select-list/index.vue';
import { getTsVideoDataList } from '@/api/modules/views/customer-tools/video-data';

export default {
  name: 'VideoData',
  components: { TsSelectList },
  data() {
    return {
      requestParam: {
        sids: '[]',
        depIdList: '[]',
        timeStart: format.date(format.subDate(new Date(), 1, 'years'), 'yyyy-MM-dd'),
        timeEnd: format.date(new Date(), 'yyyy-MM-dd'),
        name: '',
        sortKey: 'shares', // 排序的属性
        desc: true, // 排序的顺序，正序为false，倒序为true
      },
      isReload: false,
      pages: {
        pageNow: 1,
        limit: 10,
        maxPage: 2,
        total: 20,
      },
      videoList: [],
    };
  },
  computed: {
    ...mapGetters({
      isNoOneSelfDataAuth: 'user/isNoOneSelfDataAuth',
    }),
    ...mapState({
      tsStaffExtraList: state => state.user.tsStaffExtraList,
    }),
  },
  created() {
    this.getTsVideoDataList();
  },
  methods: {
    /**
     * 设置搜索时间
     * @author lymn
     * @date 2020-07-15
     * @param {Array} val 数组存放开始和结束时间
     */
    getSearchTime(val) {
      const [timeStart, timeEnd] = val || ['', ''];
      this.requestParam.timeStart = timeStart;
      this.requestParam.timeEnd = timeEnd;
    },
    /**
     * 改变数据顺序
     * @author lymn
     * @date 2020-07-15
     * @param {String} sortKey 排序的属性
     */
    changeSortType(sortKey) {
      this.requestParam.sortKey = sortKey;
      this.requestParam.desc = !this.requestParam.desc;
      this.getTsVideoDataList();
    },
    /**
     * 视频列表
     * @author waldon
     * @date 2020/11/29
     */
    async getTsVideoDataList() {
      const params = { ...this.requestParam, ...this.pages };
      const [err, res] = await getTsVideoDataList(params);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.videoList = res.data;
      this.pages.total = res.total;
    },
    /**
     * 改变分页回调
     * @author waldon
     * @date 2020/10/21
     * @param {String} type - 改变分页的类型
     */
    changePage(type) {
      this.getTsVideoDataList();
    },
  },
};
</script>

<style lang="scss" scoped></style>
