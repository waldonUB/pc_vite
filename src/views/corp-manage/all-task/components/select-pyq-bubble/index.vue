<!--
 * @Author       : ADI
 * @Date         : 2021-07-19 13:39:22
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-31 14:04:02
-->
<template>
  <div>
    <global-ts-dialog
      class="selectPyqBubble"
      dialog-title="选择朋友圈素材"
      :dialog-visible.sync="dialogVisible"
      dialog-size="large"
      @cancel="cancel"
      @sure="sure"
    >
      <div class="pro_listBox dialogContent pyqPoupBox">
        <div class="pro_line">
          <ts-select-list
            v-if="isNoOneSelfDataAuth"
            class="headSelect floatLeft workList"
            :selectType="1"
            :limitNum="1"
            :depIdList.sync="requestParam.depIdList"
            :sids.sync="requestParam.sids"
          >
          </ts-select-list>
          <global-ts-input
            style="width: 200px;"
            :clearable="true"
            v-model="requestParam.description"
            @keyup.enter.native="reloadData"
            placeholder="搜索关键词"
          >
          </global-ts-input>
          <global-ts-date-picker @updateTime="getSearchTime" defaultStartTime="year" class="mr10">
          </global-ts-date-picker>
          <global-ts-button type="primary" size="small" icon="icon-icon-4" ref="button" @click="reloadData">
            搜索
          </global-ts-button>
        </div>
        <el-table
          ref="tab"
          :data="pyqResponsibility.pyqList"
          border
          cell-class-name="cellStyle"
          header-row-class-name="employeeHeader"
          box-sizing="border-box"
        >
          <el-table-column label="选择" min-width="128">
            <template slot-scope="scope">
              <span class="selectItem">
                <input v-model="tempSelectData.id" type="radio" :value="scope.row.id" :id="scope.row.id" />
                <label :for="scope.row.id" @click="selectItem(scope.row)"></label>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="内容" min-width="500" class-name="leftText">
            <template slot-scope="scope">
              <div class="contentBox">
                <p class="description">{{ scope.row.description }}</p>
                <div class="imgBoxList">
                  <div class="imgBox" v-for="item of scope.row.contentList" :key="item.regId">
                    <img :src="item.regUrl" @click="previewImg(item.regUrl)" />
                    <ts-img-gfw-tip :gfwStatus="item.gfwStatus" :gfwStatusReason="item.gfwStatusReason">
                    </ts-img-gfw-tip>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <global-ts-pagination
          :direction="direction"
          ref="formPagination"
          :tableData="pyqResponsibility.pyqList"
          :requestParam="requestParam"
          :isReload.sync="pyqResponsibility.isReload"
          :isJson="true"
          @getData="changeTable"
          :httpurl="pyqResponsibility.httpurl"
          :httpConfigByJson="true"
        >
        </global-ts-pagination>
      </div>
    </global-ts-dialog>
    <ts-preview-picture :previewVisible.sync="previewVisible" :previewImgUrl="previewImgUrl"> </ts-preview-picture>
  </div>
</template>

<script>
import TsSelectList from '@/components/base/ts-select-list/index.vue';
import TsImgGfwTip from '@/components/base/ts-img-gfw-tip/index.vue';
import TsPreviewPicture from '@/components/base/ts-preview-picture/index.vue';
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'select-pyq-bubble',
  components: { TsSelectList, TsImgGfwTip, TsPreviewPicture },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    selectInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      pyqResponsibility: {
        // 表格数据
        initTime: '', // 时间
        pyqList: [], // 表格数据
        isReload: false,
        httpurl: '/rest/manage/material/getMaterialByContentList', // 请求地址
      },
      requestParam: {
        // 请求数据
        description: '', // 任务标题
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        sids: '[]', // 多名员工
        depIdList: '', // 部门
        typeGroup: 14,
      },
      tempSelectData: {},
      previewVisible: false,
      previewImgUrl: '',
    };
  },
  computed: {
    ...mapGetters({
      isNoOneSelfDataAuth: 'user/isNoOneSelfDataAuth',
    }),
    direction() {
      if (this.pyqResponsibility.pyqList.length > 6) {
        return 'up';
      } else {
        return 'down';
      }
    },
  },
  watch: {
    dialogVisible() {
      this.tempSelectData = Object.assign({}, { ...this.selectInfo });
      this.reloadData();
    },
  },
  created() {},
  mounted() {},
  methods: {
    previewImg(img) {
      this.previewImgUrl = img;
      this.previewVisible = true;
    },
    selectItem(selectData) {
      this.tempSelectData = Object.assign({}, { ...selectData });
    },
    sure() {
      this.selectData = Object.assign({}, { ...this.tempSelectData });
      this.$emit('confirmbubble', this.selectData);
      this.cancel();
    },
    cancel() {
      this.$emit('update:dialogVisible', false);
    },
    /**
     * 设置搜索时间
     * @author guoyijie
     * @date 2020-11-19
     * @param {Array} val 存放开始和结束时间
     */
    getSearchTime(val) {
      this.pyqResponsibility.initTime = val;
      this.requestParam.startTime = (val && val[0]) || '';
      this.requestParam.endTime = (val && val[1]) || '';
    },
    /**
     * 更新数据
     * @author guoyijie
     * @date 2020-11-19
     */
    reloadData() {
      this.pyqResponsibility.isReload = true;
    },
    /**
     * 更新表格数据
     * @author guoyijie
     * @date 2020-11-19
     * @param {Object} data 表格数据
     */
    changeTable(data, all) {
      this.pyqResponsibility.pyqList = data;
    },
  },
};
</script>

<style lang="scss" scoped>
.selectPyqBubble {
  .description {
    margin-bottom: 10px;
    @include line-clamp(2);
  }
  .imgBoxList {
    display: flex;
    margin-bottom: 0;
    margin-left: 0;
    flex-wrap: wrap;
    img {
      width: 40px;
      height: 40px;
      cursor: pointer;
      border: 1px solid $border-color;
      border-radius: 4px;
      box-sizing: border-box;
    }
  }
  .imgBox {
    position: relative;
    margin-right: 8px;
    margin-bottom: 8px;
    .gfwBox {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 42px;
      height: 42px;
      margin: auto;
      font-size: 12px;
      line-height: 20px;
      color: $error-color;
      text-align: center;
      background: #fef0f0;
      border-radius: 4px;
      .helpIcon {
        &.icon {
          width: 12px;
          height: 12px;
          margin: 0 2px 0 0;
          fill: $error-color;
        }
      }
    }
  }
  .contentBox {
    padding: 0 30px;
  }
}

.pyqPoupBox {
  height: 512px;
  padding: 0;
  overflow-y: unset;
}
.dialogContent {
  .editSelectBox {
    width: 240px;
    height: 40px;
    margin-right: 10px;
    vertical-align: top;
  }
  .selectItem {
    text-align: center;
    label {
      margin-right: 0;
      vertical-align: middle;
    }
  }
}
</style>

<style lang="scss">
.selectPyqBubble {
  .el-date-editor--daterange {
    width: 240px !important;
  }
  .el-range-editor--small {
    height: 34px !important;
  }
}
</style>
