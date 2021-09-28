<!--
 * @Author       : ADI
 * @Date         : 2021-06-09 14:55:06
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-28 15:46:21
-->
<template>
  <div class="selectFolderList tshu_select">
    <div class="tshu_select_input" :class="bindClass" @click="showSelect">
      <global-ts-svg-icon
        v-if="showInputFolderIcon"
        class="icon folderIcon"
        name="icon-00icon-qiyeweixin-wenjianjiaxiao"
      ></global-ts-svg-icon>
      <div class="motivate" :class="{ motivateIcon: showInputFolderIcon }">
        {{ selectVal == '' ? placeholder : selectVal }}
      </div>
      <global-ts-svg-icon class="icon tshu_arrow" name="icon-xialakuangjiantou"></global-ts-svg-icon>
    </div>
    <div class="treeList" v-show="isShow" v-tsclickoutside="handleClose">
      <el-tree
        ref="folderTree"
        :data="folderList"
        node-key="id"
        :props="defaultProps"
        :default-expand-all="false"
        :expand-on-click-node="true"
        :default-expanded-keys="expandId"
        :current-node-key="selectId"
        :highlight-current="true"
        :auto-expand-parent="true"
        @node-click="selectFolder"
      >
      </el-tree>
    </div>
  </div>
</template>

<script>
import { Tree } from 'element-ui';
import { GROUPTYPE } from '../../config';
import { getMaterialDirTree } from '@/api/modules/views/customer-tools/file-resource';

export default {
  name: 'select-folder-list',
  components: {
    [Tree.name]: Tree,
  },
  props: {
    size: {
      // 选择框尺寸 small:高度34 medium:高度40
      type: String,
      default: 'medium',
    },
    showInputFolderIcon: {
      // 输入框是否显示文件夹icon
      type: Boolean,
      default: false,
    },
    hideSelectIds: {
      // 隐藏掉的节点id集合
      type: Array,
      default: () => [],
    },
    defaultSelectId: {
      // 选中的选项id值
      type: [Number, String],
      default: 0,
    },
    isMutil: {
      // 是否包括企业文件夹和我的文件夹，默认包括，true：包括 false：只显示我的文件夹
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      selectVal: '我的文件夹', // 选中的文件夹值 默认为企业文件
      folderList: [], // 文件夹层级列表
      isShow: false, // 是否显示下拉框
      placeholder: '请选择文件夹',
      selectId: -1, // 选中的id 0:企业文件
      expandId: [-1], // 默认展开的父节点 0:企业文件
      defaultProps: {
        // 层级列表配置
        children: 'child',
        label: 'name',
      },
    };
  },
  computed: {
    bindClass() {
      return 'folder-select-' + this.size;
    },
  },
  watch: {
    hideSelectIds: {
      handler(newVal, oldVal) {
        if (newVal.length) {
          console.log(newVal, '隐藏部分文件夹');
          // this.$refs.folderTree.filter(newVal)
        }
      },
      deep: true,
    },
    /**
     * 监听默认选中项
     * @author lymn
     * @date 2020-11-21
     */
    defaultSelectId(newVal) {
      if (newVal == '') newVal = 0;
      this.selectId = newVal;
      this.getFolderList().then(() => {
        const data = this.$refs.folderTree.getNode(newVal).data;
        this.selectVal = data.name;
        this.$refs.folderTree.setCurrentKey(this.selectId);
        this.expandId = [newVal];
      });
    },
  },
  created() {
    console.log(this.selectVal, this.selectId, 'selectFolderList create1');
    const that = this;
    this.getFolderList().then(() => {
      if (that.defaultSelectId !== '') {
        const data = that.$refs.folderTree.getNode(that.selectId).data;
        that.selectVal = data.name;
      }
    });
    if (this.defaultSelectId !== '') {
      this.selectId = this.defaultSelectId;
    }
    console.log(this.selectVal, this.selectId, 'selectFolderList create');
  },
  mounted() {},
  methods: {
    /**
     * 获取文件夹列表
     * @author lymn
     * @date 2020-11-07
     */
    async getFolderList() {
      const params = {
        type: GROUPTYPE,
      };
      const [err, res] = await getMaterialDirTree(params);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      // 注意：管理员才会返回企业文件夹选项
      res.data.personMaterial.id = -1; // 修改我的文件夹id，假数据（默认为0，与企业文件的id冲突，因此这里用假数据处理一下）
      if (this.isMutil && res.data.corpMaterial) {
        this.folderList = [res.data.corpMaterial, res.data.personMaterial];
      } else {
        this.folderList = [res.data.personMaterial];
      }
      console.log(this.folderList, '文件夹树列表');
      return Promise.resolve();
    },
    /**
     * 选中文件夹
     * @author lymn
     * @date 2020-11-11
     * @param {Boolean} param
     * @return {Boolean} return
     */
    selectFolder(selectItem, e) {
      this.selectVal = selectItem.name;
      this.isShow = false;
      this.expandId = [selectItem.id];
      const item = { ...selectItem };
      if (item.id == -1) {
        // 我的文件 假数据
        item.id = 0;
        item.isCorp = false;
      }
      this.$emit('select', item.id, item);
    },
    /**
     * @author lymn
     * @date 2020-11-09
     * @param {Boolean} param
     * @return {Boolean} return
     */
    showSelect() {
      this.isShow = true;
    },
    /**
     * 隐藏下拉框
     * @author lymn
     * @date 2020-11-09
     * @param {Boolean} param
     * @return {Boolean} return
     */
    handleClose() {
      this.isShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.selectFolderList {
  &.tshu_select {
    position: relative;
    width: 100%;
  }
  .treeList {
    position: absolute;
    top: 44px;
    left: 0;
    z-index: 100;
    width: 100%;
    max-height: 300px;
    padding: 12px 0;
    margin-top: 4px;
    overflow-y: auto;
    background: #ffffff;
    border: 1px solid #dadada;
    border-radius: 4px;
    box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
  }
  .tshu_select_input {
    &.folder-select-small {
      height: 34px;
      .motivate {
        height: 34px;
        line-height: 34px;
      }
      & + .treeList {
        top: 34px;
      }
    }
    .folderIcon {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 12px;
      width: 16px;
      height: 16px;
      margin: auto 0;
      font-size: 16px;
      color: #ffd169;
    }
    .motivate {
      &.motivateIcon {
        padding-left: 36px;
      }
    }
  }
}
</style>

<style lang="scss">
.selectFolderList .el-tree-node__label::before {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  vertical-align: middle;
  background: url('~@/assets/image/material/icon_file.png') no-repeat center;
  background-size: 100% 100%;
  content: '';
}

.selectFolderList .el-tree-node__content {
  height: 28px;
  line-height: 28px;
}
</style>
