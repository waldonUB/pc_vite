<!--
 * @Author       : ADI
 * @Date         : 2021-06-21 14:07:32
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-24 10:41:25
-->
<template>
  <div id="classifyManager" class="classifyManager">
    <div class="classifyHeader">
      <global-ts-tabguide @backToPrePage="backLast">
        <template v-slot:leftPart>海报模板</template>
        <template v-slot:rightPart>
          分类管理
        </template>
      </global-ts-tabguide>
      <global-ts-button
        class="pro_header_addEm"
        type="primary"
        size="small"
        icon="icon-icon-11"
        @click="addClassify"
        ref="addButton"
        >新增分类
      </global-ts-button>
    </div>
    <div class="showTabList">
      <el-table
        :class="'tshu-tableset'"
        :data="classifyData.dataList"
        border
        min-width="1010px"
        header-row-class-name="employeeHeader"
        cell-class-name="cellStyle"
      >
        <template slot="empty">
          <global-ts-nodata>
            暂无数据
          </global-ts-nodata>
        </template>
        <el-table-column v-cloak key="name" prop="name" label="分类" min-width="240px"></el-table-column>
        <el-table-column v-cloak key="sort" prop="sort" label="排序" min-width="240px">
          <template slot-scope="scope">
            <div class="positionBox" style="display: inline-block;">
              <span @click="removeClassify(scope.row, 'up')" v-if="!scope.row.noShowUp" class="removeClassify">
                上移
              </span>
              <span @click="removeClassify(scope.row, 'down')" v-if="!scope.row.noShowDown" class="removeClassify">
                下移
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-cloak key="operate" prop="operate" label="编辑" min-width="240px">
          <template slot-scope="scope">
            <div class="positionBox" style="display: inline-block;">
              <span class="tanshu_linkColor" @click="editClassify(scope.row, $event)">重命名</span>
              <span
                class="tanshu_linkColor inlineGapLeft"
                style="color: #ff4d4d;"
                @click="deleteClassify(scope.row.id)"
              >
                删除
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <global-ts-pagination
      :tableData="classifyData.dataList"
      :requestParam="requestParam"
      :isReload.sync="classifyData.isReload"
      @getData="changeTable"
      :httpurl="classifyData.httpurl"
    >
    </global-ts-pagination>
    <ts-classify-bubble
      :initForm.sync="initForm"
      :isShow.sync="isShowBubble"
      :linkTarget="linkTarget"
      :httpurl="classifyData.submitClassifyUrl"
      :param="classifyParam"
      @submitSuccess="reloadClassify"
    >
    </ts-classify-bubble>
  </div>
</template>

<script>
import TsClassifyBubble from '@/components/base/ts-classify-bubble/index.vue';
import { delTsGroup, updateSort } from '@/api/modules/views/customer-tools/poster-manage';
import { confirm } from '@/utils';

export default {
  name: 'classify-manager',
  components: { TsClassifyBubble },
  props: {},
  data() {
    return {
      classifyData: {
        isReload: false,
        dataList: [], // 分类列表数据
        httpurl: '/ajax/comm/tsGroup_h.jsp?cmd=getTsGroupList', // 获取分类列表的路径
        submitClassifyUrl: '', // 分类管理提交请求按钮
      },
      addClassifyUrl: '/ajax/comm/tsGroup_h.jsp?cmd=addTsGroup', // 添加分类的请求路径
      updateClassifyUrl: '/ajax/comm/tsGroup_h.jsp?cmd=setTsGroup', // 更新分类的请求路径
      requestParam: {
        // 获取分类请求参数
        type: 11,
        set: true,
      },
      classifyParam: {
        // 添加分类请求时需要额外携带的参数
        type: '11',
      },
      initForm: {}, // 初始内容
      linkTarget: {}, // 分类弹窗跟随的元素
      isShowBubble: false, // 是否显示文件夹管理弹窗
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /**
     * 返回上一级
     * @author lymn
     * @date 2020-07-15
     * */
    backLast() {
      this.$emit('changeComponent', 'posterList', 2);
    },
    /**
     * 新增分类
     * @author lymn
     * @date 2020-07-15
     * */
    addClassify() {
      this.linkTarget = {
        target: this.$refs.addButton.$el,
        position: 'right',
      };
      this.classifyData.submitClassifyUrl = this.addClassifyUrl;
      this.classifyParam = { type: '11' };
      this.isShowBubble = true;
    },
    /**
     * 移动分类
     * @author lymn
     * @date 2020-07-15
     * @param {number} row - 移位的分类
     * @param {string} type - 移位的类型 up: 上移 down: 下移
     */
    async removeClassify(row, type) {
      let swapItem = null;
      if (type === 'up') {
        const list = [...this.classifyData.dataList];
        swapItem = list.reverse().find(item => item.sort > row.sort);
      } else {
        swapItem = this.classifyData.dataList.find(item => item.sort < row.sort);
      }
      if (!swapItem) {
        return;
      }
      const params = {
        id: row.id,
        swapId: swapItem.id,
      };
      // TODO:上下移动接口
      const [err, res] = await updateSort(params);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.reloadClassify();
    },
    /**
     * 编辑分类
     * @author lymn
     * @date 2020-07-15
     * @param {Object} item - 编辑元素
     * @param {Object} event - 事件对象
     */
    editClassify(item, event) {
      this.initForm = item;
      this.linkTarget = {
        target: event.target,
        position: 'right',
      };
      this.classifyData.submitClassifyUrl = this.updateClassifyUrl;
      this.classifyParam = {};
      this.isShowBubble = true;
    },
    /**
     * 删除分类
     * @author lymn
     * @date 2020-07-15
     * @param {Number} id 要删除的分类id
     */
    deleteClassify(id) {
      const that = this;
      confirm('提示：分类删除后，该分类下海报可在“未分类”选项中找回', '确定删除此分类？').then(async () => {
        const [err, res] = await delTsGroup({ id });
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        this.$utils.postMessage({
          type: 'success',
          message: res.msg,
        });
        that.reloadClassify();
      });
    },
    /**
     * 获取分类列表数据
     * @author lymn
     * @date 2020-07-15
     * @param {Object} data 分类列表数据
     */
    changeTable(data) {
      this.classifyData.dataList = data;
      this.classifyData.dataList.forEach((item, index) => {
        if (index === 0) {
          item.noShowUp = true;
        } else if (index === this.classifyData.dataList.length - 1) {
          item.noShowDown = true;
        }
      });
    },
    /**
     * 分类管理添加/修改提交
     * @author lymn
     * @date 2020-07-15
     */
    reloadClassify() {
      this.classifyData.isReload = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.classifyManager {
  .classifyHeader {
    display: flex;
  }
  .pro_header_addEm {
    margin-left: auto;
  }
  .removeClassify {
    cursor: pointer;
  }
}
</style>
