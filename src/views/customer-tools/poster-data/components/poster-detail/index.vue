<!--
 * @Author       : ADI
 * @Date         : 2021-06-28 11:05:23
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-28 11:39:18
-->
<template>
  <div class="posterDetail">
    <div class="pro_line">
      <ts-select-list
        class="floatLeft"
        v-if="isCanSelect"
        :depIdList.sync="requestParam.depIdList"
        :sids.sync="requestParam.sids"
      >
      </ts-select-list>
      <fa-input
        style="width: 200px;"
        v-model="requestParam.title"
        @keyup.enter.native="reloadFormData"
        placeholder="标题"
      >
      </fa-input>
      <global-ts-date-picker @updateTime="getSearchTime" defaultStartTime="year"> </global-ts-date-picker>
      <global-ts-button type="primary" size="small" icon="icon-icon-4" ref="button" @click="reloadFormData">
        搜索
      </global-ts-button>
      <global-ts-button type="primary" size="small" icon="icon-daochu" ref="button" @click="onExportExcel">
        导出
      </global-ts-button>
    </div>
    <el-table
      ref="tab"
      :data="posterResponsinility.formTableList"
      border
      cell-class-name="cellStyle"
      header-row-class-name="employeeHeader"
      box-sizing="border-box"
    >
      <el-table-column label="成员" min-width="60" prop="staffName">
        <template slot-scope="scope">
          {{ $utils.showStaffName(tsStaffExtraList, scope.row.sid, scope.row.staffName) }}
        </template>
      </el-table-column>
      <el-table-column label="海报图片" min-width="60" prop="url">
        <template slot-scope="scope">
          <img class="posterImg" :src="scope.row.isGfwCloseName ? banIMG : scope.row.url" />
        </template>
      </el-table-column>
      <el-table-column label="海报标题" min-width="60" prop="name"></el-table-column>
      <el-table-column label="分类" min-width="60" prop="groupName"></el-table-column>
      <el-table-column label="创建时间" min-width="60" prop="createTimeName">
        <template #header>
          <div class="sortBar" @click="changeSortType('createTime')">
            <span class="createTime">创建时间</span>
            <span class="sortArrow">
              <global-ts-svg-icon
                class="icon"
                :class="requestParam.desc == false && requestParam.sortKey == 'createTime' ? '' : 'isNotActive'"
                name="icon-shaixuanshang"
              ></global-ts-svg-icon>
              <global-ts-svg-icon
                class="icon"
                :class="requestParam.desc == true && requestParam.sortKey == 'createTime' ? '' : 'isNotActive'"
                name="icon-shaixuanxia"
              ></global-ts-svg-icon>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="获客人数" min-width="60" prop="newViewers">
        <template #header>
          <div class="sortBar" @click="changeSortType('newViewers')">
            <span class="createTime">获客人数</span>
            <span class="sortArrow">
              <global-ts-svg-icon
                class="icon"
                :class="requestParam.desc == false && requestParam.sortKey == 'newViewers' ? '' : 'isNotActive'"
                name="icon-shaixuanshang"
              ></global-ts-svg-icon>
              <global-ts-svg-icon
                class="icon"
                :class="requestParam.desc == true && requestParam.sortKey == 'newViewers' ? '' : 'isNotActive'"
                name="icon-shaixuanxia"
              ></global-ts-svg-icon>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" min-width="60" prop="isGfwCloseName">
        <template slot-scope="scope">
          <span class="circle" :class="[scope.row.isGfwCloseName ? 'red' : 'green']"></span>
          <span :class="{ GfwClose: scope.row.isGfwCloseName }">
            &nbsp;{{ scope.row.isGfwCloseName ? '审查关闭' : '正常' }}
          </span>
          <global-ts-tool-tips
            v-if="scope.row.isGfwCloseName"
            class="item tanshu_linkColor"
            offset="10"
            effect="dark"
            content=""
            placement="top-start"
          >
            <div slot="content">
              您的海报已被关闭，请删除后再提交申诉。<br />
              原因：{{ scope.row.closeReason }}
            </div>
            <global-ts-svg-icon class="icon" name="icon-bianzu"></global-ts-svg-icon>
          </global-ts-tool-tips>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120px" prop="status">
        <template slot-scope="scope">
          <span
            v-if="!scope.row.isGfwCloseName"
            class="tanshu_linkColor"
            @click="downloadPoster(scope.row.pcDownloadPath, scope.row.name)"
          >
            下载
          </span>
          <span class="tanshu_linkColor" @click="deletePoster(scope.row.id)">
            删除
          </span>
        </template>
      </el-table-column>
      <template slot="empty">
        <div class="noScroll">暂无数据 马上 <a class="createBtn" @click="createPoster">创建海报</a> 吧</div>
      </template>
    </el-table>
    <global-ts-pagination
      ref="formPagination"
      :tableData="posterResponsinility.formTableList"
      :requestParam="requestParam"
      :isReload.sync="posterResponsinility.isReload"
      @getData="changeTable"
      :httpurl="posterResponsinility.httpurl"
    >
    </global-ts-pagination>
  </div>
</template>

<script>
import TsSelectList from '@/components/base/ts-select-list/index.vue';
import banIMG from '@/assets/image/createPoster/ban.png';
import { mapGetters, mapState } from 'vuex';
import { post, confirm, exportExcel, getWorkerList } from '@/utils';
import { delPoster, getPosterData } from '@/api/modules/views/customer-tools/poster-data';

export default {
  name: 'poster-detail',
  components: { TsSelectList },
  props: {},
  data() {
    return {
      sid: -1,
      posterResponsinility: {
        staffList: [],
        isReload: false, // 是否重新加载数据
        httpurl: '',
        formTableList: [], // 表格数据
        initTime: '', // 初始默认选中时间
      },
      requestParam: {
        sids: '[]',
        timeStart: '',
        timeEnd: '',
        isReload: false,
        title: '',
        sortKey: 'createTime', // 排序的属性
        desc: true, // 排序的顺序，正序为false，倒序为true
      },
    };
  },
  computed: {
    ...mapGetters({
      isManage: 'user/isManage',
      isCanSelect: 'user/isNoOneSelfDataAuth',
    }),
    ...mapState({
      userInfo: state => state.user.info,
      tsStaffExtraList: state => state.user.tsStaffExtraList,
    }),
    banIMG() {
      return banIMG;
    },
  },
  watch: {},
  async created() {
    this.sid = this.isManage ? -1 : this.userInfo.staffInfo.sid; //跟进员工
    await this.getTsStaffList();
    this.posterResponsinility.httpurl = '/rest/manage/card/poster/getPosterData';
  },
  mounted() {},
  methods: {
    /**
     * 下载海报
     * @author lymn
     * @date 2020-07-15
     * @param {String} url 下载的地址
     * @param {String} name 图片命名
     */
    downloadPoster(url) {
      window.open(url);
    },
    /**
     * 获取员工列表
     * @author lymn
     * @date 2020-07-15
     * @returns {Promise} 获取到数据后回调
     */
    getTsStaffList() {
      return new Promise(resolve => {
        if (this.isCanSelect) {
          getWorkerList().then(list => {
            this.posterResponsinility.staffList = list[0];
            this.posterResponsinility.staffList = this.posterResponsinility.staffList.filter(item => item.sid != 0);
            if (list[1] == 2) {
              //成员
              this.sid = this.posterResponsinility.staffList.sid;
            }
            resolve();
          });
        } else {
          resolve();
        }
      });
    },
    /**
     * 设置搜索时间
     * @author lymn
     * @date 2020-07-15
     * @param {Array} val 数组存放开始和结束时间
     */
    getSearchTime(val) {
      this.posterResponsinility.initTime = val;
      this.requestParam.timeStart = val[0];
      this.requestParam.timeEnd = val[1];
    },
    /**
     * 重新加载数据
     * @author lymn
     * @date 2020-07-15
     */
    reloadFormData() {
      this.posterResponsinility.isReload = true; // 会触发changeTable事件
    },
    /**
     * 导出
     * @author lymn
     * @date 2020-07-15
     */
    async onExportExcel() {
      this.requestParam.isGetAll = true;
      const [err, response] = await getPosterData(this.requestParam);
      this.requestParam.isGetAll = false;
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      var excelList = [...response.data];
      var keyJson = {
        staffName: '成员',
        name: '海报标题',
        groupName: '分类',
        createTimeName: '创建时间',
        newViewers: '获客人数',
      };
      exportExcel(excelList, '海报数据', keyJson);
    },
    /**
     * 获取表格数据
     * @author lymn
     * @date 2020-07-15
     */
    changeTable(data) {
      this.posterResponsinility.formTableList = data;
    },
    /**
     * @function 删除海报数据
     * @author lymn
     * @date 2020-07-15
     * @param {Number} id 海报id
     */
    async deletePoster(id) {
      confirm('是否删除该海报？删除后无法撤回', '删除确认').then(async () => {
        const param = {
          id,
          isTemp: false, // 只有删除企业海报才需要传true
        };
        const [err, res] = await delPoster(param);
        if (err) {
          return Promise.reject(err);
        }
        this.$utils.postMessage({
          type: 'success',
          message: res.msg,
        });
        this.reloadFormData();
      });
    },
    /**
     * @function 改变数据顺序
     * @author lymn
     * @date 2020-07-15
     * @param {String} sortKey 排序的属性
     * @param {Boolean} desc 排序的顺序，正序为true，倒序为false
     */
    changeSortType(sortKey) {
      this.requestParam.sortKey = sortKey;
      this.requestParam.desc = !this.requestParam.desc;
      this.reloadFormData();
    },
    /**
     * @function 跳转创建海报页
     * @author lymn
     * @date 2020-07-15
     */
    createPoster() {
      this.$router.push({
        path: 'posterManage/createPoster',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.posterDetail {
  .posterImg {
    width: 50%;
  }
  .GfwClose {
    color: $error-color;
  }
  .circle {
    display: inline-block;
    width: 5px;
    height: 5px;
    vertical-align: middle;
    border-radius: 50%;
    &.green {
      background: #247af3;
    }
    &.red {
      background: $error-color;
    }
  }
}
</style>
