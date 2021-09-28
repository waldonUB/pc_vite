<!--
 * @Description  : 已接入的公司列表
 * @Author       : turbo
 * @Date         : 2021-07-22 11:23:04
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-22 15:13:50
-->

<template>
  <div class="company-list">
    <global-ts-header>
      <template #leftPart>
        第三方接入
        <div class="redTip">*该功能仅限专用版开放使用</div>
      </template>
    </global-ts-header>
    <div v-if="isMainAcct" class="pro_listBox">
      <el-table
        ref="sortTable"
        row-key="id"
        border
        min-width="1010px"
        cell-class-name="cellStyle"
        :data="companyList"
        :span-method="spanMethod"
      >
        <el-table-column label="公司名称" prop="name" min-width="80px"></el-table-column>
        <el-table-column label="接口名称" prop="apiName" min-width="50px"></el-table-column>
        <el-table-column label="接口URL" min-width="150px">
          <template slot-scope="scope">
            <div class="api-url">
              <div class="request-method">POST</div>
              {{ tsportalUrl + scope.row.apiUrl }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="80px">
          <template slot-scope="scope">
            <span class="text_but1" @click="copyUrl(scope.row)">点击复制</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { merge } from 'lodash';

// utils
import { clipboard } from '@/utils';

// api
import { third } from '@/api';

export default {
  name: 'CompanyList',
  data() {
    return {
      companyList: [],
      tableDataTemp: [
        { apiName: '接收产品', apiUrl: '/api/open_h.jsp?cmd=addProduct' },
        { apiName: '接收客户', apiUrl: '/api/open_h.jsp?cmd=addClient' },
        { apiName: '接收订单', apiUrl: '/api/open_h.jsp?cmd=addOrder' },
        { apiName: '订单退款', apiUrl: '/api/open_h.jsp?cmd=refundOrder' },
      ],
    };
  },
  computed: {
    ...mapState({
      isMainAcct: state => state.user.info.isMainAcct,
      tsportalUrl: state => state.globalData.tsportalUrl,
    }),
  },
  created() {
    this.getCompanyList();
  },
  methods: {
    /**
     * @description : 获取已经接入第三方的公司
     * @author      : turbo
     * @Date        : 2021-07-22 11:35:13
     */
    async getCompanyList() {
      const { getTsCompanyList } = third;
      const [err, res] = await getTsCompanyList({
        isGetAll: true,
        openInterface: true,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const list = res.data;
      if (list.length === 0) {
        this.$emit('toOpenForm');
        return;
      }
      list.forEach(item => {
        this.tableDataTemp.forEach(temp => {
          this.companyList.push(
            merge(
              {},
              {
                name: item.name,
              },
              temp,
            ),
          );
        });
      });
    },
    spanMethod({ rowIndex, columnIndex }) {
      const rowspan = this.tableDataTemp.length;
      if (columnIndex === 0) {
        return {
          rowspan: rowIndex % rowspan === 0 ? rowspan : 0,
          colspan: rowIndex % rowspan === 0 ? 1 : 0,
        };
      }
    },
    copyUrl(row) {
      const url = this.tsportalUrl + row.apiUrl;
      clipboard(url, '复制成功', '当前浏览器不支持');
    },
  },
};
</script>

<style lang="scss" scoped>
.company-list {
  .api-url {
    @include flex-left;

    .request-method {
      width: 60px;
      height: 24px;
      margin: 0 10px 0 4px;
      font-size: 12px;
      line-height: 24px;
      color: $color-ff;
      background-color: $primary-color;
      border-radius: 4px;
    }
  }
}
</style>
