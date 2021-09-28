<!--
 * @Author       : ADI
 * @Date         : 2021-07-12 11:44:56
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-12 11:46:36
-->
<template>
  <div class="realseReasonList">
    <div class="desc">成员在进行放弃客户操作时，需填写放弃的原因，企业管理者可以通过内容更好地管理客户资源。</div>
    <el-table
      class="realseReasonList"
      min-width="1010px"
      :data="realseReasonList"
      border
      cell-class-name="cellStyle"
      header-row-class-name="employeeHeader"
      box-sizing="border-box"
    >
      <el-table-column prop="name" label="放弃原因"> </el-table-column>
      <el-table-column label="启用">
        <template slot-scope="scope">
          <fa-switch :disabled="!scope.row.banEdit" v-model="scope.row.isAble" @click="openRealseReason(scope.row)" />
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
              v-if="!scope.row.noShowDown && scope.$index != realseReasonList.length - 1"
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
            @click="editRealseReason(scope.row)"
          >
            编辑
          </span>
          <span
            :class="{ 'tanshu_color text_but1': true, 'banBtn': scope.row.banEdit }"
            @click="delRealseReason(scope.row)"
          >
            删除
          </span>
        </template>
      </el-table-column>
    </el-table>
    <reasonDialog
      :dialogVisible.sync="realseDialog"
      :isEdit="isEdit"
      placeholder="请输入放弃原因"
      :name.sync="currentName"
      @sure="setRealseReason"
    >
    </reasonDialog>
  </div>
</template>

<script>
import reasonDialog from '../reason-dialog/index.vue';
import { confirm } from '@/utils';

export default {
  name: 'realse-reason-list',
  components: { reasonDialog },
  props: {},
  data() {
    return {
      realseReasonList: [],
      realseDialog: false,
      isEdit: false, // 是否是编辑
      type: 20, // 客户废弃原因, 获取数据需要
      currentEditId: -1,
      currentName: '',
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    async removeClassify(row, type) {
      await this.$parent.$parent.updateSort(row, type, this.realseReasonList);
      this.getList();
    },
    async setRealseReason(name) {
      if (this.isEdit) {
        await this.$parent.$parent.setTsGroup({
          id: this.currentEditId,
          name,
        });
      } else {
        await this.$parent.$parent.addTsGroup({
          type: this.type,
          name,
        });
      }
      this.realseDialog = false;
      this.getList();
    },
    /**
     * @description 客户设置 - 开启放弃原因
     * @author enson
     * @date 2021-03-11
     */
    async openRealseReason(itemData) {
      await this.$parent.$parent.setTsGroup({
        id: itemData.id,
        isOpen: itemData.isAble,
      });
      this.getList();
    },
    /**
     * @description 客户设置 - 编辑放弃原因
     * @author enson
     * @date 2021-03-11
     */
    editRealseReason(itemData) {
      if (itemData.banEdit) return;
      this.isEdit = true;
      this.currentName = itemData.name;
      this.currentEditId = itemData.id;
      this.realseDialog = true;
    },
    /**
     * @description 客户设置 - 删除放弃原因
     * @author enson
     * @date 2021-03-11
     */
    delRealseReason(itemData) {
      if (itemData.banEdit) return;
      confirm('删除后不会影响公海的历史数据，确认删除吗？').then(async () => {
        await this.$parent.$parent.delTsGroup(itemData.id);
        this.getList();
      });
    },
    /**
     * @description 客户设置 - 新增放弃原因
     * @author enson
     * @date 2021-03-11
     */
    addReason() {
      if (this.delReasonList.length >= 20) {
        this.$utils.postMessage({
          type: 'error',
          message: '最多只能创建20条原因',
        });
        return;
      }

      const { isEdit, currentEditId, currentName } = this.$options.data();
      this.isEdit = isEdit;
      this.currentEditId = currentEditId;
      this.currentName = currentName;
      this.realseDialog = true;
    },
    async getList() {
      await this.$parent.$parent.initList(this.type);
    },
  },
};
</script>

<style lang="scss" scoped>
.realse-reason-list {
}
</style>
