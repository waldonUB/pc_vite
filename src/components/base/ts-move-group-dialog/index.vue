<!--
 * @Author       : ADI
 * @Date         : 2021-04-01 13:52:43
 * @LastEditors  : ADI
 * @LastEditTime : 2021-05-25 18:19:51
-->
<template>
  <global-ts-dialog
    class="moveGroupDialogBox wxCorpDialog center"
    :dialog-title="'选择' + moveText"
    :dialog-visible.sync="dialogVisible"
    dialog-size="medium"
    @cancel="cancel"
    @sure="sure"
  >
    <fa-cascader
      v-if="groupType == 1 || groupType == 5"
      size="large"
      v-model="value"
      :placeholder="'请选择分组'"
      :options="groupTagParentList"
      :fieldNames="{ value: 'id', label: 'name', children: 'children' }"
      :displayRender="displayRender"
      :popupStyle="{ zIndex: 3000 }"
      :changeOnSelect="true"
      @change="handleCascaderChange"
    ></fa-cascader>
    <div v-else class="groupLabelContent">
      <ts-wxtag
        v-for="(item, index) of groupTagList"
        :key="index"
        class="moveGroupLabel"
        :type="item.id === group.id ? 'selected' : 'normal'"
        @click="changeTag(item)"
      >
        {{ item.name }}
      </ts-wxtag>
    </div>
  </global-ts-dialog>
</template>

<script>
import { postMessage } from '@/utils';
import { Cascader } from '@fk/faicomponent';
import tsWxtag from '@/components/base/ts-wxtag/index.vue';
import { batchChangeGroup } from '@/api/modules/component/move-group-dialog';

export default {
  name: 'ts-move-group-dialog',
  components: {
    [Cascader.name]: Cascader,
    tsWxtag,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    groupTagList: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
    groupTagParentList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    moveIds: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
    beforeMoveGroupIds: {
      // 被移动前的的分组，只有一个时默认选中，多个时就取消选中分组
      type: Array,
      default: () => {
        return [];
      },
    },
    groupType: {
      type: Number,
      default: 0,
    },
    moveType: {
      // 移动类型 1：分组 2：文件夹
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      group: {
        id: '',
      },
      value: [],
    };
  },
  computed: {
    /**
     * 文案
     * @author lymn
     * @date 2020-10-27
     */
    moveText() {
      switch (this.moveType) {
        case 1:
          return '分组';
        case 2:
          return '文件夹';
        default:
          return '';
      }
    },
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal && ![1, 5].includes(this.groupType)) {
        if (this.beforeMoveGroupIds.length === 1) {
          this.group.id = this.beforeMoveGroupIds[0];
        } else {
          this.group.id = '';
        }
      } else {
        this.group.id = '';
        this.value = [];
      }
    },
  },
  methods: {
    /**
     * 移动到了某个分组
     * @author waldon
     * @date 2020/4/10
     */
    async sure() {
      if (!this.group.id) {
        postMessage({
          type: 'error',
          message: '请先选择分组',
        });
        return;
      }
      const params = {
        ids: JSON.stringify(this.moveIds),
        groupId: this.group.id,
      };
      const [err, res] = await batchChangeGroup(params);
      if (err) {
        postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return err;
      }
      this.$emit('moveSuccess', this.group);
    },
    /**
     * 取消对话框
     * @author waldon
     * @date 2020/4/10
     */
    cancel() {
      this.$emit('update:dialogVisible', false);
    },
    /**
     * 改变标签
     * @param {*} item - 当前标签数据
     * @author waldon
     * @date 2020/4/10
     */
    changeTag(item) {
      this.group = {
        ...item,
      };
    },
    /**
     * 自定义级联选择显示
     * @author turbo
     * @date 2020/10/21
     * */
    displayRender({ labels }) {
      return labels.join(' - ');
    },
    /**
     * 处理级联选择的值改变
     * @author turbo
     * @date 2020/10/21
     * */
    handleCascaderChange(value) {
      this.group.id = value.length > 1 ? value[1] : value[0];
    },
  },
};
</script>

<style lang="scss" scoped>
.ts-move-group-dialog {
}
</style>
