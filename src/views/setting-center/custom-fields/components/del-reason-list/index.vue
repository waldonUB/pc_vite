<!--
 * @Author       : ADI
 * @Date         : 2021-07-12 11:47:00
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-12 11:48:26
-->
<template>
  <div class="delReasonList">
    <div class="desc">成员在进行删除客户操作时，需填写删除的原因，企业管理者可以通过内容更好地管理客户资源。</div>
    <el-table
      class="delReasonList"
      min-width="1010px"
      :data="delReasonList"
      border
      cell-class-name="cellStyle"
      header-row-class-name="employeeHeader"
      box-sizing="border-box"
    >
      <el-table-column prop="name" label="删除原因"> </el-table-column>
      <el-table-column label="启用">
        <template slot-scope="scope">
          <fa-switch :disabled="!scope.row.banEdit" v-model="scope.row.isAble" @click="openDelReason(scope.row)" />
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
              v-if="!scope.row.noShowDown && scope.$index != delReasonList.length - 1"
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
            @click="editDelReason(scope.row)"
            >编辑
          </span>
          <span
            :class="{ 'tanshu_color text_but1': true, 'banBtn': scope.row.banEdit }"
            @click="delDelReason(scope.row)"
            >删除
          </span>
        </template>
      </el-table-column>
    </el-table>
    <reasonDialog
      :dialogVisible.sync="delDialog"
      :isEdit="isEdit"
      :name.sync="currentName"
      placeholder="请输入删除原因"
      @sure="setDelReason"
    >
    </reasonDialog>
  </div>
</template>

<script>
import reasonDialog from '../reason-dialog/index.vue';
import { confirm } from '@/utils';

export default {
  name: 'del-reason-list',
  components: { reasonDialog },
  props: {},
  data() {
    return {
      delReasonList: [],
      type: 21, // 客户删除原因
      isEdit: false, // 是否编辑
      delDialog: false, // 是否显示弹窗
      currentEditId: -1, // 当前编辑的原因id
      currentName: '',
    };
  },
  computed: {},
  watch: {},
  created() {
    console.log('this.$parent', this.$parent);
    this.$nextTick(() => {
      this.getList();
    });
  },
  mounted() {},
  methods: {
    async removeClassify(row, type) {
      await this.$parent.$parent.updateSort(row, type, this.delReasonList);
      this.getList();
    },
    /**
     * @description 客户设置 - 开启删除原因
     * @author enson
     * @date 2021-03-11
     */
    async openDelReason(itemData) {
      await this.$parent.$parent.setTsGroup({
        id: itemData.id,
        isOpen: itemData.isAble,
      });
      this.getList();
    },
    async setDelReason(name) {
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
      this.delDialog = false;
      this.getList();
    },
    /**
     * @description 客户设置 - 编辑删除原因
     * @author enson
     * @date 2021-03-11
     */
    editDelReason(itemData) {
      if (itemData.banEdit) return;
      this.isEdit = true;
      this.delDialog = true;
      this.currentName = itemData.name;
      this.currentEditId = itemData.id;
    },
    /**
     * @description 客户设置 - 删除删除原因
     * @author enson
     * @date 2021-03-11
     */
    delDelReason(itemData) {
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

      const { isEdit, currentName, currentEditId } = this.$options.data();
      this.isEdit = isEdit;
      this.currentName = currentName;
      this.currentEditId = currentEditId;
      this.delDialog = true;
    },
    async getList() {
      this.delReasonList = await this.$parent.$parent.initList(this.type);
    },
  },
};
</script>

<style lang="scss" scoped>
.del-reason-list {
}
</style>
