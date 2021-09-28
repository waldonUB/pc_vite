<!--
 * @Author       : ADI
 * @Date         : 2021-05-26 15:36:45
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-28 10:54:50
-->
<template>
  <div class="corpSearchDetail">
    <global-ts-button class="headerBtn" v-if="isManager" size="small" icon="icon-daochu" @click="onExportExcel">
      导出
    </global-ts-button>
    <div class="detailContent">
      <table class="borderTable">
        <tbody>
          <tr class="tableColBox" v-for="(item, index) of detailFiledList" :key="index">
            <!--虚拟节点上不需要指定key，如果装了eslint的话，手动把这一段移除控制-->
            <template v-for="subItem of item">
              <td :key="subItem.name" rowspan="1" colspan="1" class="tableCol tableColName">{{ subItem.name }}</td>
              <td :key="subItem.field" rowspan="1" :colspan="col5Cal(subItem.field)" class="tableCol">
                {{ corpDetailInfo[subItem.field] }}
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { FdpLog, exportExcel } from '@/utils';
import { getCorpDetail } from '@/api/modules/views/customer-tools/data-center';

export default {
  name: 'corp-search-detail',
  components: {},
  props: {
    isManager: {
      type: Boolean,
      default: false,
    },
    currentDetailId: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      corpDetailInfo: {},
      detailFiledList: [
        [
          {
            field: 'acctName',
            name: '企业名称',
            width: 1,
          },
          {
            field: 'legalRep',
            name: '法人',
            width: 1,
          },
          {
            field: 'industry',
            name: '行业',
            width: 1,
          },
        ],
        [
          {
            field: 'phone',
            name: '电话',
            width: 1,
          },
          {
            field: 'email',
            name: '邮箱',
            width: 1,
          },
          {
            field: 'districtAllName',
            name: '省/市/区',
            width: 1,
          },
        ],
        [
          {
            field: 'coyStatus',
            name: '经营状态',
            width: 1,
          },
          {
            field: 'regFund',
            name: '注册资本',
            width: 1,
          },
          {
            field: 'startDate',
            name: '成立日期',
            width: 1,
          },
        ],
        [
          {
            field: 'unifiedSocialCreditCode',
            name: '统一社会信用代码',
            width: 1,
          },
          {
            field: 'organizationCode',
            name: '组织机构代码',
            width: 1,
          },
          {
            field: 'businessRegistrationNo',
            name: '工商注册号',
            width: 1,
          },
        ],
        [
          {
            field: 'taxpayerIdentificationNumber',
            name: '纳税人识别号',
            width: 1,
          },
          {
            field: 'staffSize',
            name: '人员规模',
            width: 1,
          },
          {
            field: 'regAuthority',
            name: '登记机关',
            width: 1,
          },
        ],
        [
          {
            field: 'coyType',
            name: '企业类型',
            width: 1,
          },
          {
            field: 'businessTerm',
            name: '营业期限',
            width: 1,
          },
          {
            field: 'website',
            name: '官网',
            width: 1,
          },
        ],
        [
          {
            field: 'address',
            name: '企业地址',
            width: 5,
          },
        ],
        [
          {
            field: 'introduction',
            name: '企业简介',
            width: 5,
          },
        ],
        [
          {
            field: 'businessScope',
            name: '经营范围',
            width: 5,
          },
        ],
      ],
    };
  },
  computed: {},
  watch: {},
  created() {},
  activated() {
    this.getDetailInfo();
  },
  mounted() {},
  methods: {
    /**
     * 计算字段宽度
     * @author waldon
     * @date 2020/8/17
     * @param {String} field - 5列的字段
     * @returns {String} - 5列的类名
     */
    col5Cal(field) {
      return ['address', 'introduction', 'businessScope'].includes(field) ? '5' : '1';
    },
    onExportExcel() {
      var excelList = [this.corpDetailInfo];
      var keyJson = {};
      this.detailFiledList.forEach(item => {
        item.forEach(subItem => {
          keyJson[subItem.field] = subItem.name;
        });
      });
      exportExcel(excelList, '企业详情', keyJson);
      FdpLog('yx_dcqy', {
        // 导出企业
        yx_free_text_0: '导出单个企业详情',
        yx_app_terminal: 1,
      });
    },
    /**
     * @description : 获取详情信息
     * @author      : ADI
     * @Date        : 2021-05-28 10:48:58
     * @param        {*}
     * @return       {*}
     */
    async getDetailInfo() {
      const params = {
        id: this.currentDetailId,
      };
      const [err, res] = await getCorpDetail(params);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.corpDetailInfo = res.data;
    },
  },
};
</script>

<style lang="scss" scoped>
.corpSearchDetail {
  .detailContent {
    margin-top: 20px;
    font-size: 14px;
    color: #333333;
    .borderTable {
      width: 100%;
      border-collapse: collapse;
      .tableColBox {
        .tableCol {
          width: 16.66%;
          height: 60px;
          padding: 12px;
          box-sizing: border-box;
          box-sizing: border-box;
          &.tableColName {
            text-align: center;
            background-color: #f7f7f7;
            border: none;
            border-bottom: 1px solid $border-disabled-color;
          }
        }
      }
    }
  }
}
.corpSearchDetail .detailContent table,
.corpSearchDetail .detailContent table tr td {
  border: 1px solid $border-disabled-color;
}
</style>
