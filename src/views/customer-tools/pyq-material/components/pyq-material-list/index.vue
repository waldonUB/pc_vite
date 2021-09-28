<!--
 * @Author       : ADI
 * @Date         : 2021-06-02 11:50:23
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-02 16:20:13
-->
<template>
  <div class="pyqMaterialList">
    <global-ts-header>
      <template v-slot:leftPart>
        朋友圈素材
      </template>
      <template v-slot:rightPart>
        <global-ts-button
          class="pro_header_addEm"
          type="primary"
          size="small"
          icon="icon-icon-11"
          @click="addPyqMaterial"
          >添加素材
        </global-ts-button>
      </template>
    </global-ts-header>
    <div class="pro_listBox" v-cloak>
      <div class="pro_line">
        <ts-select-list
          v-if="requestParam.typeGroup == 14"
          class="headSelect floatLeft workList"
          :selectType="1"
          :limitNum="1"
          :depIdList.sync="requestParam.depIdList"
          :sids.sync="requestParam.sids"
          :width="200"
        >
        </ts-select-list>
        <fa-input
          :clearable="true"
          style="width: 200px;"
          v-model="requestParam.description"
          @keyup.enter.native="reloadData"
          placeholder="搜索关键词"
        >
        </fa-input>
        <global-ts-date-picker @updateTime="getSearchTime" defaultStartTime="year"> </global-ts-date-picker>
        <global-ts-button type="primary" size="small" icon="icon-icon-4" ref="button" @click="reloadData">
          搜索
        </global-ts-button>
      </div>
      <global-ts-slide
        ref="pyqSlider"
        :activeNum="activeNum"
        class="tanshu-bottomBorder"
        :slidArray="slideList"
        @changeStatus="changeResonsibilityStatus"
      >
      </global-ts-slide>
      <el-table
        ref="tab"
        min-width="1010px"
        :data="pyqResponsibility.pyqList"
        border
        cell-class-name="cellStyle"
        header-row-class-name="employeeHeader"
        box-sizing="border-box"
      >
        <el-table-column label="内容" min-width="200">
          <template slot-scope="scope">
            <div class="contentBox">
              <p class="description">{{ scope.row.description }}</p>
              <div class="imgBoxList">
                <div v-for="(item, index) of scope.row.contentList" :key="index" class="imgBox">
                  <img class="img" :src="item.regUrl" @click="previewImg(item.regUrl)" />
                  <ts-img-gfw-tip :gfwStatus="item.gfwStatus" :gfwStatusReason="item.gfwStatusReason"> </ts-img-gfw-tip>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="上传人" min-width="80" prop="creatorName" v-if="requestParam.typeGroup == 14">
          <template slot-scope="scope">
            {{ $utils.showStaffName(tsStaffExtraList, scope.row.creator, scope.row.creatorName) }}
          </template>
        </el-table-column>
        <el-table-column label="上传时间" min-width="80" prop="createTimeName"></el-table-column>
        <el-table-column label="操作" min-width="100" fixed="right">
          <template slot-scope="scope">
            <span class="tanshu_color text_but1" @click="seeDetail(scope.row)"> 查看 </span>
            <span
              class="tanshu_color text_but1"
              @click="editPyqMaterial(scope.row.id)"
              v-if="requestParam.typeGroup == 15 || isUpperAdm || (isDepartmentAdm && !scope.row.isAdm)"
            >
              编辑
            </span>
            <span
              class="tanshu_color text_but1"
              @click="createTask(scope.row)"
              v-if="isManage && requestParam.typeGroup == 14"
            >
              发起任务
            </span>
            <span
              class="red operateBtn"
              @click="deleteMaterial(scope.row.typeGroup, scope.row.id)"
              v-if="requestParam.typeGroup == 15 || isUpperAdm || (isDepartmentAdm && !scope.row.isAdm)"
            >
              删除
            </span>
          </template>
        </el-table-column>
      </el-table>
      <global-ts-pagination
        ref="formPagination"
        :tableData="pyqResponsibility.pyqList"
        :requestParam="requestParam"
        :isReload.sync="pyqResponsibility.isReload"
        @getData="changeTable"
        :httpurl="pyqResponsibility.httpurl"
      >
      </global-ts-pagination>
      <pyqDetailDialog :dialogVisible.sync="detailDialogVisible" :pyqMaterialInfo="pyqMaterialInfo"> </pyqDetailDialog>
      <ts-preview-picture :previewVisible.sync="previewVisible" :previewImgUrl="previewImgUrl"> </ts-preview-picture>
    </div>
  </div>
</template>

<script>
import TsPreviewPicture from '@/components/base/ts-preview-picture/index.vue';
import pyqDetailDialog from '../pyq-detail-dialog/index.vue';
import TsSelectList from '@/components/base/ts-select-list/index.vue';
import { mapGetters, mapState } from 'vuex';
import { confirm, encodeHtml } from '@/utils';
import TsImgGfwTip from '@/components/base/ts-img-gfw-tip/index.vue';
import { batchDelMaterial } from '@/api/modules/views/customer-tools/pyq-material';

export default {
  name: 'pyqMaterialList',
  components: { TsPreviewPicture, pyqDetailDialog, TsSelectList, TsImgGfwTip },
  props: {
    isPartUpdate: {
      // 是否需要局部刷新数据，即只更新当前请求状态下的数据
      type: Boolean,
      default: false,
    },
    typeGroup: {
      type: Number,
      default: 14,
    },
  },
  data() {
    return {
      pyqResponsibility: {
        // 表格数据
        initTime: '', // 时间
        pyqList: [], // 表格数据
        isReload: false,
        httpurl: '/ajax/wxWork/material/tsMaterial_h.jsp?cmd=getMaterialByContentList', // 请求地址
      },
      sliderType: 0,
      slideList: [
        {
          key: '企业素材',
          value: 14,
        },
        {
          key: '我的素材',
          value: 15,
        },
      ],
      activeNum: 14,
      requestParam: {
        // 请求数据
        description: '', // 任务标题
        startTimeStr: '', // 开始时间
        endTimeStr: '', // 结束时间
        typeGroup: 14,
        sids: '[]', // 多名员工
        depIdList: '', // 部门
      },
      detailDialogVisible: false,
      pyqMaterialInfo: {},
      previewVisible: false,
      previewImgUrl: '',
    };
  },
  computed: {
    ...mapGetters({
      isManage: 'user/isManage',
      isUpperAdm: 'user/isUpperAdm',
      isDepartmentAdm: 'user/isDepartmentAdm',
    }),
    ...mapState({
      tsStaffExtraList: state => state.user.tsStaffExtraList,
    }),
  },
  watch: {},
  created() {},
  activated() {
    this.requestParam;
    this.requestParam.typeGroup = this.typeGroup;
    this.activeNum = this.typeGroup;
    const sliderItem = this.$refs.pyqSlider.$refs.sliderItem;
    const index = this.typeGroup == 14 ? 0 : 1;
    this.$refs.pyqSlider.target = sliderItem[index];
    this.reloadData();
  },
  mounted() {},
  methods: {
    previewImg(img) {
      this.previewImgUrl = img;
      this.previewVisible = true;
    },
    /**
     * 设置搜索时间
     * @author guoyijie
     * @date 2020-11-19
     * @param {Array} val 存放开始和结束时间
     */
    getSearchTime(val) {
      this.pyqResponsibility.initTime = val;
      this.requestParam.startTimeStr = (val && val[0]) || '';
      this.requestParam.endTimeStr = (val && val[1]) || '';
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
     * 切换分类
     * @author guoyijie
     * @date 2020-11-19
     * @param {object} e node节点
     * @param {Number} value 选中一级分类的value
     */
    changeResonsibilityStatus(e, value, index) {
      this.requestParam.description = '';
      this.requestParam.sids = '[]';
      this.requestParam.depIdList = '';
      this.requestParam.typeGroup = value;
      this.reloadData();
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
    addPyqMaterial() {
      const params = {
        component: 'addPyqMaterial',
        isAdd: true,
      };
      this.$emit('changeComponent', params);
    },
    editPyqMaterial(id) {
      const params = {
        component: 'addPyqMaterial',
        editId: id,
        isAdd: false,
      };
      this.$emit('changeComponent', params);
    },
    deleteMaterial(typeGroup, id) {
      confirm('确认删除朋友圈素材？删除后无法恢复', '删除确认').then(async action => {
        if (action == 'confirm') {
          const [err, res] = await batchDelMaterial({
            ids: '[' + id + ']',
            typeGroup,
          });
          if (err) {
            this.$utils.postMessage({
              type: 'error',
              message: err.msg || '系统错误，请稍候重试',
            });
            return Promise.reject(err);
          }
          this.$utils.postMessage({
            type: 'success',
            message: '删除成功！',
          });
          this.reloadData();
        }
      });
    },
    seeDetail(info) {
      this.detailDialogVisible = true;
      this.pyqMaterialInfo = {
        description: info.description,
        contentList: info.contentList,
      };
    },
    createTask(item) {
      this.$router.push({
        name: 'allTask',
        params: {
          componentName: 'taskNewAdd',
          chooseItem: encodeHtml(JSON.stringify(item)),
          taskType: 4,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.pyqMaterialList {
  .description {
    max-height: 46px;
    margin-bottom: 10px;
    text-align: left;
    @include line-clamp(2);
  }
  .imgBoxList {
    display: flex;
    flex-wrap: wrap;
    .imgBox {
      margin-right: 8px;
      margin-bottom: 8px;
    }
    .img {
      width: 40px;
      height: 40px;
      cursor: pointer;
      border: 1px solid $border-color;
      border-radius: 4px;
      box-sizing: border-box;
    }
  }
  .contentBox {
    padding: 0 30px;
  }
  .operateBtn {
    cursor: pointer;
    &.red {
      color: $error-color;
    }
  }
  .imgBox {
    position: relative;
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
          color: $error-color;
        }
      }
    }
  }
}
</style>
