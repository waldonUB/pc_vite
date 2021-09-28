<!--
 * @Author       : ADI
 * @Date         : 2021-07-12 11:38:36
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-12 14:28:26
-->
<template>
  <div class="setCluePage">
    <global-ts-header>
      <template v-slot:leftPart>
        <p class="pageHeardTitle">
          成员在进行放弃客户操作时，需填写放弃的原因，企业管理者可以通过内容更好地管理客户资源。
        </p>
      </template>
      <template v-slot:rightPart>
        <global-ts-button
          class="header-right-btn"
          type="primary"
          size="small"
          icon="icon-tianjia1616"
          @click="addNewReason"
          >新增原因
        </global-ts-button>
      </template>
    </global-ts-header>
    <el-table
      class="clueReasonList"
      min-width="1010px"
      :data="clueReasonList"
      border
      cell-class-name="cellStyle"
      header-row-class-name="employeeHeader"
      box-sizing="border-box"
    >
      <el-table-column prop="name" label="放弃原因"> </el-table-column>
      <el-table-column label="启用">
        <template slot-scope="scope">
          <fa-switch :disabled="scope.row.banEdit" v-model="scope.row.isAble" @click="openClueReason(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column key="sort" prop="sort" label="排序">
        <template slot-scope="scope">
          <div class="positionBox" style="display: inline-block;">
            <span
              @click="removeClassify(scope.row, 'up')"
              v-if="!scope.row.noShowUp && scope.$index != 0"
              class="removeClassify"
            >
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-shangyi1616"></use>
              </svg>
            </span>
            <span
              @click="removeClassify(scope.row, 'down')"
              v-if="!scope.row.noShowDown && scope.$index != clueReasonList.length - 1"
              class="removeClassify"
            >
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-xiayi1616"></use>
              </svg>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span
            :class="{ 'tanshu_color text_but1': true, 'banBtn': scope.row.banEdit }"
            @click="editClueReason(scope.row)"
            >编辑
          </span>
          <span
            :class="{ 'tanshu_color text_but1': true, 'banBtn': scope.row.banEdit }"
            @click="delClueReason(scope.row)"
            >删除
          </span>
        </template>
      </el-table-column>
    </el-table>
    <reasonDialog
      :dialogVisible.sync="reasonDialogVisible"
      :isEdit="isEdit"
      :name.sync="currentName"
      placeholder="请输入放弃原因"
      @sure="sureClueReason"
    >
    </reasonDialog>
  </div>
</template>

<script>
import reasonDialog from '../reason-dialog/index.vue';
import { confirm } from '@/utils';
import { Switch } from '@fk/faicomponent';

export default {
  name: 'set-clue-page',
  components: { reasonDialog, [Switch.name]: Switch },
  props: {},
  data() {
    return {
      clueReasonList: [],
      reasonDialogVisible: false,
      isEdit: false,
      currentEditId: -1,
      type: 19, // 线索池固定是19, 接口传参需要
      currentName: '',
    };
  },
  computed: {},
  watch: {},
  created() {
    this.$nextTick(() => {
      this.getList();
    });
  },
  mounted() {},
  methods: {
    async removeClassify(row, type) {
      await this.$parent.updateSort(row, type, this.clueReasonList);
      this.getList();
    },
    /**
     * @description 新增/编辑放弃原因名称
     * @author enson
     * @date 2021-03-11
     */
    async sureClueReason(name) {
      if (this.isEdit) {
        // 编辑
        await this.$parent.setTsGroup({
          id: this.currentEditId,
          name,
        });
      } else {
        await this.$parent.addTsGroup({
          type: this.type, // 线索池
          name,
        });
      }
      this.reasonDialogVisible = false;
      this.getList();
    },
    /**
     * @description 编辑线索原因
     * @author enson
     * @date 2021-03-10
     */
    editClueReason(itemData) {
      if (itemData.banEdit) return;
      this.currentEditId = itemData.id;
      this.currentName = itemData.name;
      this.isEdit = true;
      this.reasonDialogVisible = true;
    },
    /**
     * @description 删除线索原因
     * @author enson
     * @date 2021-03-10
     */
    delClueReason(itemData) {
      if (itemData.banEdit) return;
      confirm('删除后不会影响公海的历史数据，确认删除吗？').then(async () => {
        await this.$parent.delTsGroup(itemData.id);
        this.getList();
      });
    },
    /**
     * @description 开启线索原因
     * @author enson
     * @date 2021-03-10
     */
    async openClueReason(itemData) {
      await this.$parent.setTsGroup({
        id: itemData.id,
        isOpen: itemData.isAble,
      });

      this.getList();
    },
    /**
     * @description 新增线索原因
     * @author enson
     * @date 2021-03-10
     */
    addNewReason() {
      if (this.clueReasonList.length >= 20) {
        this.$utils.postMessage({
          type: 'error',
          message: '最多只能创建20条原因',
        });
        return;
      }
      const { currentEditId, currentName, isEdit } = this.$options.data();
      this.currentEditId = currentEditId;
      this.currentName = currentName;
      this.isEdit = isEdit;
      this.reasonDialogVisible = true;
    },
    async getList() {
      this.clueReasonList = await this.$parent.initList(this.type);
    },
  },
};
</script>

<style lang="scss" scoped>
.setCluePage {
  color: red;
  .pageHeardTitle {
    font-size: 14px;
    font-weight: 400;
    color: #898989;
  }
}
</style>
