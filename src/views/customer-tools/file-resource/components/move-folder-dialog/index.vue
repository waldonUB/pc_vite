<!--
 * @Author       : ADI
 * @Date         : 2021-06-09 15:07:19
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-10 15:17:15
-->
<template>
  <global-ts-wx-work-dialog
    class="moveFolderDialog"
    :dialogTitle="dialogTitle"
    :tsDialogVisible.sync="dialogVisible"
    @cancel="cancel"
    @sure="sure"
  >
    <selectFolderList v-if="dialogVisible" @select="selectFolder" :hideSelectIds="checkIds"></selectFolderList>
  </global-ts-wx-work-dialog>
</template>

<script>
import selectFolderList from '../select-folder-list/index.vue';
import { GROUPTYPE } from '../../config';
import { batchMoveFileOrDir } from '@/api/modules/views/customer-tools/file-resource';

export default {
  name: 'move-folder-dialog',
  components: {
    selectFolderList,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: true,
    },
    checkItems: {
      // 选中的文件/文件夹集合
      type: Array,
      default: () => [],
    },
    checkIds: {
      // 选中的文件/文件夹id集合
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialogTitle: '移动至',
      requestParam: {
        // 请求数据
        groupId: 0, // 目标文件夹id,默认为0, 0:企业文件夹
        moveList: [], // 移动的文件/文件夹集合
        type: GROUPTYPE, // 类型 12:企业文件夹 13:个人文件夹
      },
      selectItem: {}, // 选中的文件夹
    };
  },
  computed: {},
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        // 初始化数据
        this.requestParam = {
          groupId: 0, // 目标文件夹id,默认为0, 0:产品文件夹
          moveList: [], // 移动的文件/文件夹集合
          type: GROUPTYPE, // 类型 12:企业文件夹 13:产品文件夹
        };
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    cancel() {
      this.$emit('update:dialogVisible', false);
    },
    async sure() {
      if (!this.checkItems.length) {
        this.$utils.postMessage({
          type: 'error',
          message: '请选择文件',
        });
        return;
      }

      if (this.checkIds.includes(this.requestParam.groupId)) {
        // 错误情况:被移动到其中一个选中的文件夹
        this.$utils.postMessage({
          type: 'error',
          message: '移动失败，不允许移动到当前文件夹内',
        });
        return;
      }

      this.requestParam.moveList = JSON.stringify(this.checkItems);
      const [err, res] = await batchMoveFileOrDir(this.requestParam);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.$emit('updateData');
      this.cancel();
      this.$utils.postMessage({
        type: 'success',
        message: '移动成功',
      });
    },
    /**
     * 选择文件夹
     * @author lymn
     * @date 2020-11-09
     * @param {Number} selectId 选中的文件夹id
     */
    selectFolder(selectId, selectItem) {
      this.selectItem = selectItem;
      this.requestParam.groupId = selectId;
    },
  },
};
</script>

<style lang="scss" scoped>
.move-folder-dialog {
}
</style>
