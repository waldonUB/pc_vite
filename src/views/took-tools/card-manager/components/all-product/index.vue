<!--
 * @Author       : ADI
 * @Date         : 2021-06-03 14:16:25
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-04 14:58:35
-->
<template>
  <div class="cardManager">
    <div id="ts-bubble"></div>
    <div class="cardManagerIndex">
      <div class="">
        <div class="pro_line">
          <ts-select-list
            class="floatLeft"
            v-if="isManager && isNoOneSelfDataAuth"
            :depIdList.sync="requestParam.depIdList"
            :sids.sync="requestParam.sids"
          >
          </ts-select-list>
          <global-ts-button
            class="searchBtn"
            v-if="isManager && isNoOneSelfDataAuth"
            type="primary"
            size="small"
            icon="icon-icon-4"
            @click="reloadDataList"
            >搜索
          </global-ts-button>
        </div>
        <div class="cardManagerList">
          <el-table
            header-row-class-name="employeeHeader"
            :data="cardManagerList"
            border
            min-width="1010px"
            :fit="true"
          >
            <el-table-column prop="staffName" label="成员" min-width="200px">
              <template slot-scope="scope">
                {{ $utils.showStaffName(tsStaffExtraList, scope.row.sid, scope.row.staffName) }}
              </template>
            </el-table-column>
            <el-table-column prop="appMsgShares" label="名片转发次数" min-width="200px">
              <template #header>
                <div class="sortBar" @click="changeSortType('appMsgShares')">
                  <span class="nextTimeBaby">名片转发次数</span>
                  <span class="sortArrow">
                    <global-ts-svg-icon
                      class="icon"
                      :class="requestParam.sortKey === 'appMsgShares' && !requestParam.desc ? '' : 'isNotActive'"
                      name="icon-shaixuanshang"
                    />
                    <global-ts-svg-icon
                      class="icon"
                      :class="requestParam.sortKey === 'appMsgShares' && requestParam.desc ? '' : 'isNotActive'"
                      name="icon-shaixuanxia"
                    />
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="clickViewers" label="名片访问人数" min-width="200px">
              <template #header>
                <div class="sortBar" @click="changeSortType('clickViewers')">
                  <span class="nextTimeBaby">名片访问人数</span>
                  <span class="sortArrow">
                    <global-ts-svg-icon
                      class="icon"
                      :class="requestParam.sortKey === 'clickViewers' && !requestParam.desc ? '' : 'isNotActive'"
                      name="icon-shaixuanshang"
                    />
                    <global-ts-svg-icon
                      class="icon"
                      :class="requestParam.sortKey === 'clickViewers' && requestParam.desc ? '' : 'isNotActive'"
                      name="icon-shaixuanxia"
                    />
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="200px" class-name="operateCol">
              <template slot-scope="scope">
                <div class="bottomBar">
                  <span class="tanshu_linkColor text_but1" v-if="isUpperAdm" @click="setCardModel(scope.row)">
                    设为名片模板
                  </span>
                  <global-ts-button class="text_but1 em_edit" type="default" size="mini">
                    查看名片
                    <div class="qrBox" :class="{ hasSetModel: isManager }">
                      <div class="hoverBox"></div>
                      <img class="qrImg" :src="scope.row.pcShareQrUrl" alt="" />
                      <p class="qrTip">扫码查看名片</p>
                    </div>
                  </global-ts-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <global-ts-pagination
          :tableData="cardManagerList"
          :requestParam="requestParam"
          :isReload.sync="isReload"
          @getData="changeTable"
          :httpurl="httpUrl"
        >
        </global-ts-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { confirm, getWorkerList } from '@/utils';
import TsSelectList from '@/components/base/ts-select-list/index.vue';
import { setCardAsTemplate } from '@/api/modules/views/customer-tools/card-manager';

export default {
  name: 'all-product',
  components: { TsSelectList },
  props: {},
  data() {
    return {
      workList: [], // 创建人列表
      requestParam: {
        sid: -1,
        sids: '',
        sortKey: 'appMsgShares', // appMsgShares名片转发次数，clickViewers名片访问人数
        desc: true,
      },
      cardManagerList: [],
      isReload: false,
      httpUrl: '/rest/manage/card/getTsCardList',
    };
  },
  computed: {
    ...mapGetters({
      isManager: 'user/isManage',
      isUpperAdm: 'user/isUpperAdm',
      isNoOneSelfDataAuth: 'user/isNoOneSelfDataAuth',
    }),
    ...mapState({
      tsStaffExtraList: state => state.user.tsStaffExtraList,
    }),
  },
  watch: {},
  created() {
    this.getAllStaffList();
    this.$utils.logDog('cardManager_show');
  },
  mounted() {},
  methods: {
    /**
     * 克隆成员成功
     * @author waldon
     * @date 2020-06-02
     */
    cloneTempSuccess() {
      this.reloadDataList();
    },
    editCard() {
      this.$utils.logDog('cardManager_edit');
    },
    /**
     * 重查数据
     * @author waldon
     * @date 2020/5/28
     */
    reloadDataList() {
      this.isReload = true;
    },
    /**
     * 列表改变回调
     * @author waldon
     * @date 2020/4/10
     * @param {*} list -
     */
    changeTable(list) {
      this.cardManagerList = list;
    },
    /**
     * @function 表格排序
     * @param row {string} 排序字段
     */
    changeSortType(type) {
      this.requestParam.sortKey = type;
      this.requestParam.desc = !this.requestParam.desc;
      this.reloadDataList();
    },
    getAllStaffList() {
      getWorkerList().then(res => {
        this.workList = res[0];
      });
    },
    /**
     * @description 设置名片模板
     * @author enson
     * @date 2020-07-17
     */
    async setCardModel(data) {
      return confirm(
        '是否将该成员的名片作为名片模板？<br>确认后将替换模板里全部内容',
        '操作确认',
        '确定',
        true,
        true,
      ).then(async action => {
        if (action == 'confirm') {
          const [err, res] = await setCardAsTemplate({
            sid: data.sid,
          });
          if (err) {
            this.$utils.postMessage({
              type: 'error',
              message: err.msg || '网络错误，请稍候重试',
            });
            return Promise.reject(err);
          }
          this.$utils.postMessage({
            type: 'success',
            message: '设置成功',
          });
          return Promise.resolve(res);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.cardManager {
  padding: 0 20px 20px;
  .cardManagerList {
    .bottomBar {
      position: relative;
      .text_but1 {
        vertical-align: middle;
      }
      .qrBox {
        position: absolute;
        top: 50%;
        left: 20%;
        z-index: 99;
        width: 162px;
        height: 0;
        overflow: hidden;
        background-color: #ffffff;
        border-radius: 8px;
        transform: translate(-50%, -50%);
        box-shadow: 0 4px 8px 0 rgba(2, 5, 31, 0.06);
        box-sizing: border-box;
        transition: all 0.3s;
        &.hasSetModel {
          left: 30%;
        }
      }
      .global-button {
        position: static;
        line-height: inherit;
        color: #2882ff;
        &:hover {
          .qrBox {
            height: 205px;
            padding: 10px 10px 0 10px;
            transition: all 0.3s;
          }
        }
      }
      .qrImg {
        width: 100%;
      }
      .qrTip {
        padding: 8px 0;
        color: $color-53;
        text-align: center;
        background-color: #ffffff;
      }
    }
  }
  .cardManagerEdit {
    .sliderBox {
      padding: 20px 20px 0 20px;
      border-bottom: 1px solid $border-disabled-color;
      box-sizing: border-box;
      .slidArray {
        height: 43px;
      }
    }
    .contentEdit {
      padding-bottom: 30px;
      box-sizing: border-box;
      .infoPart {
        padding-left: 20px;
        margin-top: 20px;
        box-sizing: border-box;
        .titleBox {
          display: flex;
          align-items: center;
          .title {
            font-size: 14px;
            color: $color-53;
          }
          .des {
            font-size: 12px;
            color: $color-b2;
          }
        }
        .contentBox {
          margin-top: 10px;
          &.textAreaBox {
            display: flex;
            .textAreaWrapper {
              position: relative;
              .sumData {
                position: absolute;
                right: 11px;
                bottom: 11px;
                font-size: 14px;
                line-height: 14px;
                color: rgba(178, 178, 178, 1);
              }
            }
          }
          .inputItem {
            width: 576px;
            margin-top: 10px;
            &:first-child {
              margin-top: 0;
            }
          }
          .tagBox {
            display: flex;
            flex-flow: row wrap;
            .addClassify {
              display: flex;
              width: 48px;
              height: 38px;
              margin: 5px 10px 5px 0;
              color: $color-b2;
              background: rgba(247, 247, 247, 1);
              border-radius: 4px;
              align-items: center;
              justify-content: center;
              .icon {
                margin-right: 0;
              }
            }
          }
          .uploadBtn_hidden {
            display: none;
          }
        }
      }
    }
    .tanshu-cardBox-bottom {
      .bottomBtn {
        .operateBox {
          height: 100%;
          text-align: center;
        }
      }
    }
    .tanshu-searchSelect {
      width: 560px;
    }
    .selectTip {
      margin-top: 10px;
    }
  }
}
</style>

<style lang="scss">
.cardManager .cardManagerList .el-table__body-wrapper,
.cardManager .cardManagerList .el-table,
.cardManager .cardManagerList .operateCol .cell {
  overflow: visible;
}
</style>
