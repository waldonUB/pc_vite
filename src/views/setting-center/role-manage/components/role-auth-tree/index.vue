<!--
 * @Author       : ADI
 * @Date         : 2021-07-07 16:34:05
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-08 11:16:12
-->
<template>
  <div :class="['staff-auth', 'level-' + level]">
    <template v-if="level >= 3">
      <template v-for="auth in authList">
        <template>
          <div class="flat-item" :key="auth.id" v-if="auth.child && auth.child.length > 0">
            <div class="left">
              <!-- 单选 -->
              <template v-if="auth.radio">
                <fa-radio :checked="auth.selected" :disabled="checkAllAuth" @change="handleRadio(auth)">
                  {{ auth.name }}&nbsp;
                </fa-radio>
                <global-ts-tool-tips v-if="!!auth.tips" effect="dark" popperClass="roleManage-roleAuthTip">
                  <div slot="content">
                    <p>{{ auth.tips }}</p>
                  </div>
                  <global-ts-svg-icon class="icon ts-tabel-header-icon" name="icon-wenhao1616"></global-ts-svg-icon>
                </global-ts-tool-tips>
              </template>
              <!-- 多选 -->
              <template v-else>
                <fa-checkbox
                  :checked="auth.selected || auth.halfSelect"
                  :disabled="checkAllAuth || auth.disabled"
                  @change="handleChecked(auth)"
                >
                  {{ auth.name }}&nbsp;
                </fa-checkbox>
                <global-ts-tool-tips v-if="!!auth.tips" effect="dark" popperClass="roleManage-roleAuthTip">
                  <div slot="content">
                    <p>{{ auth.tips }}</p>
                  </div>
                  <global-ts-svg-icon class="icon ts-tabel-header-icon" name="icon-wenhao1616"></global-ts-svg-icon>
                </global-ts-tool-tips>
              </template>
            </div>
            <div class="right">
              <div class="right-item" v-for="child in auth.child" :key="child.id">
                <!-- 单选 -->
                <template v-if="child.radio">
                  <fa-radio :checked="child.selected" :disabled="checkAllAuth" @change="handleRadio(child)">
                    {{ child.name }}&nbsp;
                  </fa-radio>
                  <fa-popover v-if="!!child.tips" placement="top">
                    <template slot="content">
                      <p>{{ child.tips }}</p>
                    </template>
                    <fa-icon :style="tipsStyle" type="info-circle" />
                  </fa-popover>
                </template>
                <!-- 多选 -->
                <template v-else>
                  <fa-checkbox
                    :checked="child.selected"
                    :indeterminate="child.halfSelect"
                    :disabled="checkAllAuth || child.disabled"
                    @change="handleChecked(child)"
                  >
                    {{ child.name }}&nbsp;
                  </fa-checkbox>
                  <fa-popover v-if="!!child.tips" placement="top">
                    <template slot="content">
                      <p>{{ child.tips }}</p>
                    </template>
                    <fa-icon :style="tipsStyle" type="info-circle" />
                  </fa-popover>
                </template>
              </div>
            </div>
          </div>
          <div v-else class="normal-child" :key="auth.id">
            <fa-checkbox
              :checked="auth.selected || auth.halfSelect"
              :disabled="checkAllAuth || auth.disabled"
              @change="handleChecked(auth)"
            >
              {{ auth.name }}&nbsp;
            </fa-checkbox>
            <global-ts-tool-tips v-if="!!auth.tips" effect="dark" popperClass="roleManage-roleAuthTip">
              <div slot="content">
                <p>{{ auth.tips }}</p>
              </div>
              <global-ts-svg-icon class="icon ts-tabel-header-icon" name="icon-wenhao1616"></global-ts-svg-icon>
            </global-ts-tool-tips>
          </div>
        </template>
      </template>
    </template>
    <!-- 三级以上的权限 -->
    <template v-for="(auth, index) in authList" v-else>
      <template>
        <fa-collapse
          v-model="expandPermissionKeys"
          v-if="auth.child && auth.child.length > 0"
          :bordered="false"
          @change="key => changeExpand(key, auth)"
          :key="index"
        >
          <template v-slot:expandIcon="props">
            <fa-icon type="up" style="font-size: 12px;color: #898989;" :rotate="props.isActive ? 180 : 0" />
          </template>
          <fa-collapse-panel :key="auth.permissionsKey">
            <template #header>
              <div :class="['node-header', 'level-' + level]" @click.stop>
                <fa-checkbox
                  :checked="auth.selected || auth.halfSelect"
                  :disabled="checkAllAuth"
                  @change="handleChecked(auth)"
                >
                  {{ auth.name }}&nbsp;
                </fa-checkbox>
                <global-ts-tool-tips v-if="!!auth.tips" effect="dark" popperClass="roleManage-roleAuthTip">
                  <div slot="content">
                    <p>{{ auth.tips }}</p>
                  </div>
                  <global-ts-svg-icon class="icon ts-tabel-header-icon" name="icon-wenhao1616"></global-ts-svg-icon>
                </global-ts-tool-tips>
              </div>
            </template>
            <role-auth-tree
              :authList="auth.child"
              :allAuthList="allAuthList"
              :level="nextLevel"
              :authType="authType"
            ></role-auth-tree>
          </fa-collapse-panel>
        </fa-collapse>
        <template v-else>
          <div v-if="level < 3" :class="['normal-grey', 'level-' + level]" :key="index">
            <fa-checkbox
              :checked="auth.selected || auth.halfSelect"
              :disabled="checkAllAuth"
              @change="handleChecked(auth)"
            >
              {{ auth.name }}&nbsp;
            </fa-checkbox>
            <global-ts-tool-tips v-if="!!auth.tips" effect="dark" popperClass="roleManage-roleAuthTip">
              <div slot="content">
                <p>{{ auth.tips }}</p>
              </div>
              <global-ts-svg-icon class="icon ts-tabel-header-icon" name="icon-wenhao1616"></global-ts-svg-icon>
            </global-ts-tool-tips>
          </div>
          <div v-else class="normal-child" :key="auth.id">
            <fa-checkbox
              :checked="auth.selected || auth.halfSelect"
              :disabled="checkAllAuth"
              @change="handleChecked(auth)"
            >
              {{ auth.name }}&nbsp;
            </fa-checkbox>
            <global-ts-tool-tips v-if="!!auth.tips" effect="dark" popperClass="roleManage-roleAuthTip">
              <div slot="content">
                <p>{{ auth.tips }}</p>
              </div>
              <global-ts-svg-icon class="icon ts-tabel-header-icon" name="icon-wenhao1616"></global-ts-svg-icon>
            </global-ts-tool-tips>
          </div>
        </template>
      </template>
    </template>
  </div>
</template>

<script>
import { Radio, Checkbox } from '@fk/faicomponent';

export default {
  name: 'role-auth-tree',
  components: {
    [Radio.name]: Radio,
    [Checkbox.name]: Checkbox,
  },
  props: {
    authList: Array,
    level: Number,
    authType: {
      type: Number,
      default: 0,
    },
    allAuthList: {
      type: Array,
      default: () => [],
    },
    // 填补数据
    partList: [],
  },
  data() {
    return {
      notShowList: [],
      expandPermissionKeys: 'clueManage', // 展开面板的节点
    };
  },
  computed: {
    nextLevel() {
      return this.level + 1;
    },
    checkAllAuth() {
      return this.authType == 1;
    },
    checkPartAuth() {
      return this.authType == 2;
    },
    partAuthNumList: {
      get() {
        return this.partList;
      },
      set(val) {
        this.this.partList = val;
      },
    },
    tipsStyle() {
      return 'color:#D0D0D0;';
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /**
     * 展开子节点
     * @author lymn
     * @date 2021-05-24
     * @param {Boolean} param
     * @return {Boolean} return
     */
    changeExpand(key, auth) {
      console.log(key, auth, 'change--key');
      const len = key.length > 0 ? key.length - 1 : key.length;
      if (auth.level === 1) {
        // 一级菜单互斥，只能展开一个
        this.expandPermissionKeys = key[len];
      } else {
        // 二、三级菜单可以一起展开
        this.expandPermissionKeys = key;
      }
      console.log(this.expandPermissionKeys, '最终展开的样板');
    },
    /**
     * 可控展开，点击勾选都要展开子节点
     * @author lymn
     * @date 2021-05-24
     */
    customExpand(auth) {
      if (auth.level === 1) {
        this.expandPermissionKeys = auth.permissionsKey;
      } else {
        this.expandPermissionKeys = [...new Set([...this.expandPermissionKeys, auth.permissionsKey])];
      }
    },
    /**
     * 点击勾选按钮
     * @author lymn
     * @date 2021-05-24
     * @param {Object} auth
     */
    handleChecked(auth) {
      this.customExpand(auth);
      // 选择权限要先先序遍历，然后根据记录的路径处理父级以上的节点
      this.checkedChild(auth, !auth.selected);
      const nodeArr = this.getPath(auth);

      // 最后一个层级的功能权限，交互逻辑比较特殊；如果被取消选中，他的父级状态不要受到影响
      if (!auth.selected && auth.isLastFunc) return;

      for (let i = nodeArr.length - 1; i >= 0; i--) {
        this.checkedParent(nodeArr[i], auth, nodeArr);
      }
    },

    handleRadio(auth) {
      const { partAuthNumList } = this;

      auth.selected = true;

      if (!partAuthNumList.includes(auth.id)) {
        partAuthNumList.push(auth.id);
      }

      const nodeArr = this.getPath(auth);

      for (let i = nodeArr.length - 1; i >= 0; i--) {
        this.checkedParent(nodeArr[i], auth, nodeArr);
      }

      if (auth.child.length > 0) {
        this.checkedChild(auth, true);
      }
    },

    getPath(auth) {
      const { allAuthList } = this;
      console.log(allAuthList, 'allAuthList');
      const pathArr = auth.path.split('-').map(item => Number(item));
      console.log(pathArr, '路径地址');
      let index = 0;
      let node = null;
      let parent = allAuthList;
      const nodeArr = [];
      const pathArrFn = item => item.id === pathArr[index];

      while (index < pathArr.length - 1) {
        node = index === 0 ? parent.find(pathArrFn) : parent.child.find(pathArrFn);
        index++;
        parent = node;

        nodeArr.push(node);
      }

      return nodeArr;
    },
    /**
     * 选中状态联动父级
     * @author lymn
     * @date 2021-04-28
     * @param {Boolean} param
     * @return {Boolean} return
     */
    checkedParent(node, auth, nodeArr) {
      console.log(arguments, '检测父级节点');
      const { id, selected } = auth;
      const numList = nodeArr.map(item => item.id);

      if (node.radio) {
        // 如果父节点是单选，则子节点选了一个都要把父节点设置为选中状态
        node.selected = node.child.some(item => item.selected);
        node.halfSelect = false;
      } else {
        if (auth.isLastFunc && node.id === nodeArr[nodeArr.length - 1].id) {
          // 最后一个层级的功能权限，交互逻辑比较特殊；如果被选中，他的父级状态要设置为全选状态
          node.selected = node.child.some(item => item.selected);
        } else {
          node.selected = node.child.every(item => item.selected);
        }
        node.halfSelect = !node.selected && node.child.some(item => item.selected || item.halfSelect);
      }

      const hasRadioChild = node.child.every(item => item.radio);
      const hasPre = node.child.some(item => item.pre);

      // 子节点是单选时，要把当前选中的节点的兄弟节点都取消选中
      if (hasRadioChild) {
        node.halfSelect = false;
        node.selected = node.child.some(item => !!item.selected);

        node.child.forEach(item => {
          if (item.id !== id && !numList.includes(item.id)) {
            item.selected = false;

            const itemIndex = this.partAuthNumList.findIndex(pan => pan === item.id);
            itemIndex >= 0 && this.partAuthNumList.splice(itemIndex, 1);

            if (item.child.length > 0) {
              this.checkedChild(item, false);
            }
          }
        });
      }

      // 前置权限
      if (hasPre) {
        const preNode = node.child.find(item => item.pre);
        const preChildren = preNode.child;
        const checkedList = node.child.map(item => item.selected).filter(item => !!item);

        if (preNode.id !== id && selected) {
          // 前置节点选中同时兄弟节点有其他被选中，则置灰
          preNode.disabled = preNode.selected ? checkedList.length > 1 : true;
          preNode.selected = true;

          if (!this.partAuthNumList.includes(preNode.id)) {
            this.partAuthNumList.push(preNode.id);
          }

          if (preChildren.length > 0) {
            // 前置选项自动被勾选，它的子节点都要被勾选
            this.checkedChildLoop(true, preChildren);
          }
        } else if (!selected && checkedList.length === 1) {
          preNode.disabled = false;

          if (preChildren.length > 0) {
            this.checkedChildLoop(true, preChildren);
          }
        }
      }
    },

    checkedChild(node, selected) {
      if (node) {
        node.selected = selected;
        node.halfSelect = false;
        const children = node.child;
        if (children && children.length) {
          this.checkedChildLoop(selected, children);
        }
      }
    },
    checkedChildLoop(selected, children) {
      for (let i = 0; i < children.length; i++) {
        this.checkedChild(children[i], selected);
      }
    },
    handleNumList(selected, node) {
      if (selected && !this.partAuthNumList.includes(node.id)) {
        this.partAuthNumList.push(node.id);
      } else if (!selected) {
        const index = this.partAuthNumList.findIndex(item => item === node.id);
        index >= 0 && this.partAuthNumList.splice(index, 1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.staff-auth {
  width: 652px;
  height: 100%;
  background-color: #f8f9fb;
  .flat-item {
    display: flex;
    background-color: #ffffff;
    border-bottom: 1px solid #e3e2e8;
    align-items: center;
    &:last-child {
      border-bottom: 0;
    }
    .left {
      padding-left: 68px;
    }
    .right {
      padding: 10px 0 10px;
      border-left: 1px solid #e3e2e8;
    }
    .right-item {
      padding-left: 20px;
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .node-header {
    display: inline;
    font-size: 14px;
    &.level-1 {
      font-weight: bold;
    }
  }
  .normal-child {
    height: 50px;
    line-height: 50px;
    background-color: #ffffff;
    border-bottom: 1px solid $border-disabled-color;
  }
  .normal-grey {
    height: 40px;
    line-height: 40px;
    background-color: $table-header-bg;
    border-bottom: 1px solid $border-disabled-color;
    &.level-1 {
      padding-left: 20px;
      font-weight: bold;
    }
    &.level-2 {
      padding-left: 44px;
    }
  }
  &.level-2 {
    color: $color-53;
  }
  &.level-3 {
    .normal-child {
      padding-left: 68px;
    }
  }
}
.staff-auth .flat-item .left,
.staff-auth .flat-item .right {
  width: 50%;
  box-sizing: border-box;
}
</style>

<style lang="scss">
.staff-auth {
  .fa-checkbox-wrapper {
    color: $color-53;
  }
  .fa-collapse {
    border-radius: 0;
    .fa-collapse-item {
      border: 0;
      .fa-collapse-header {
        padding-top: 9px;
        padding-bottom: 9px;
        background-color: $table-header-bg;
        border-bottom: 1px solid $border-disabled-color;
        .anticon {
          right: 16px;
          left: initial;
          font-size: 16px !important;
        }
      }
    }
    .fa-collapse-content {
      .fa-collapse-content-box {
        padding: 0 !important;
        .fa-collapse-borderless {
          & > .fa-collapse-item {
            &:last-child {
              border-bottom: none;
            }
          }
        }
      }
    }
  }
  &.level-1 {
    .fa-collapse-header {
      padding-left: 20px;
    }
    .normal-child {
      padding-left: 20px;
    }
  }
  &.level-2 {
    .fa-collapse-header {
      padding-left: 44px;
    }
    .normal-child {
      padding-left: 44px;
    }
  }
  &.level-3 {
    .fa-collapse-header {
      padding-left: 68px;
    }
  }
  .fa-checkbox {
    & + span {
      padding-right: 0;
    }
  }
  .fa-checkbox-disabled {
    .fa-checkbox-inner {
      background-color: #f5f5f5 !important;
      border-color: #d9d9d9 !important;
    }
  }
}
.roleManage-roleAuthTip {
  width: 400px;
  line-height: 20px;
}
</style>
