<!--
 * @Author       : ADI
 * @Date         : 2021-03-30 15:39:58
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-15 10:58:54
-->
<template>
  <global-ts-dialog
    class="orgSelectDialog wxCorpDialog"
    :dialog-title="dialogTitle"
    :dialog-visible.sync="dialogVisible"
    dialog-size="large"
    @cancel="cancel"
    @reset="reset"
    :with-reset-btn="true"
    :with-cancel-btn="false"
    resetName="清空"
    @sure="sure"
  >
    <div class="orgSelectContent">
      <div class="orgSelectWrapper">
        <div class="selectTitle">
          <p class="titleText left">组织架构</p>
          <p class="titleText">已选择</p>
        </div>
        <div class="selectContent">
          <div class="leftContent">
            <div class="selectInputBox">
              <global-ts-input style="width: 250px;" v-model="orgKeyWord" placeholder="快速搜索"> </global-ts-input>
            </div>
            <div class="selectTree">
              <el-tree
                :auto-expand-parent="true"
                :check-strictly="true"
                :default-expanded-keys="expandKeyCal"
                ref="orgTree"
                :data="orgList"
                show-checkbox
                node-key="id"
                :filter-node-method="filterNode"
                @check-change="handleCheckChange"
                :props="defaultProps"
              >
              </el-tree>
            </div>
          </div>
          <div class="selectedBox">
            <div class="selectWrapper">
              <div class="orgTypeName">
                <span>部门</span><span v-if="this.selectedDeptList.length === 0" class="nothingText">暂无数据</span>
              </div>
              <div class="selectLabelBox">
                <ts-wxtag
                  :withCancel="true"
                  @deletetag="deleteTag('dept', item)"
                  v-for="(item, index) of selectedDeptList"
                  :key="index"
                  class="selectLabel"
                >
                  {{ item.name }}
                </ts-wxtag>
              </div>
            </div>
            <div class="selectWrapper">
              <div class="orgTypeName">
                <span>员工</span><span v-if="this.selectedUserList.length === 0" class="nothingText">暂无数据</span>
              </div>
              <div class="selectLabelBox">
                <ts-wxtag
                  :withCancel="true"
                  @deletetag="deleteTag('staff', item)"
                  v-for="(item, index) of selectedUserList"
                  :key="index"
                  class="selectLabel"
                >
                  {{ item.name }}
                </ts-wxtag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </global-ts-dialog>
</template>

<script>
import { postMessage, post } from '@/utils';
import { Tree } from 'element-ui';
import tsWxtag from '@/components/base/ts-wxtag/index.vue';

export default {
  name: 'ts-org-select-dialog',
  components: {
    [Tree.name]: Tree,
    tsWxtag,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: false,
    },
    defaultExpandKeys: {
      // 需要默认展开的数组,以及默认选中的数组
      type: Array,
      default: () => {
        return [];
      },
    },
    // 选中的成员数组
    selectedOrgData: {
      type: Object,
      default: () => {
        return {
          dept: [], // 部门
          staff: [], // 成员
        };
      },
    },
    isGetAll: {
      // 默认查所有，传false查未添加的企微成员
      type: Boolean,
      default: true,
    },
    isNecessary: {
      // 是否必选
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      type: String,
      default: '选择通知发送人',
    },
    selectType: {
      // 判断是否是用于选择框 selectList - 选择框
      type: String,
      default: '',
    },
  },
  data() {
    return {
      orgKeyWord: '',
      orgList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      selectedDeptList: [],
      selectedUserList: [],
      allUserList: [], // 懒加载后的所有员工
      rootKey: [],
      expandKeyCal: [],
    };
  },
  watch: {
    orgKeyWord(newVal) {
      this.$refs.orgTree.filter(newVal);
    },
    dialogVisible(newVal) {
      if (newVal) {
        this.getAllOrgList();
        this.orgKeyWord = '';
      }
    },
    selectedOrgData(newVal) {
      this.selectedDeptList = newVal.dept;
      this.selectedUserList = newVal.staff;
    },
    orgList() {
      console.log(this.orgList);
    },
  },
  computed: {
    // expandKeyCal() {
    //   if (this.defaultExpandKeys && this.defaultExpandKeys.length) {
    //     return this.defaultExpandKeys;
    //   }
    //   return this.rootKey;
    // },
  },
  methods: {
    filterNode(value, data) {
      console.log(data);
      if (!value) {
        return true;
      }
      return data.name.indexOf(value) !== -1;
    },
    /**
     * 处理勾选情况。
     * 勾选部门则勾选下面子部门和员工。勾选员工后根据员工的department字段判断员工是否
     * 隶属于多个部门，是则都勾选；某个部门下的节点勾选完后，父节点添加到右侧已选项；取消
     * 勾选则做相反的操作，可参考朋友圈的分组和“不让他看朋友圈”的逻辑
     * @param {Object} data - 当前选择节点
     * @param {Boolean} checked - 是否被选中
     * @param {Boolean} indeterminate - 带有子节点的父节点样式
     * @modify waldon 2021年5月12日 将name改回userId
     * */
    handleCheckChange(data, checked, indeterminate) {
      let checkedNodes = this.$refs.orgTree.getCheckedNodes();
      if (checked) {
        // 只有用户才需要做多个部门的判断
        checkedNodes.forEach(item => {
          this.allUserList.forEach(subItem => {
            if (item.departmentId && item.userId === subItem.userId) {
              checkedNodes.push(subItem);
            }
          });
        });
      } else {
        checkedNodes = checkedNodes.filter(item => {
          if (item.departmentId) {
            // 用户
            return item.userId !== data.userId;
          } else {
            // 部门
            return item.id !== data.id;
          }
        });
      }
      this.selectedDeptList = checkedNodes.filter(item => !item.departmentId); // 将部门添加到右侧已选择
      this.selectedUserList = checkedNodes.reduce((prev, curr) => {
        const index = prev.findIndex(item => item.userId === curr.userId); // 将人员添加到右侧已选择，不存在的时候才加进去
        if (curr.departmentId && index === -1) {
          prev.push(curr);
        }
        return prev;
      }, []);
      this.$emit(
        'update:defaultExpandKeys',
        checkedNodes.map(item => item.id),
      );
      this.$refs.orgTree.setCheckedNodes(checkedNodes);
    },
    /**
     * 删除已选择的部门/员工
     * @param {Object} orgItem - 被移除的部门/员工
     * @param {string} type - 被移除的类型
     * */
    deleteTag(type, orgItem) {
      let checkedNodes = this.$refs.orgTree.getCheckedNodes();
      if (type === 'dept') {
        checkedNodes = checkedNodes.filter(item => item.id !== orgItem.id);
        this.selectedDeptList = this.selectedDeptList.filter(item => !item.departmentId && item.id !== orgItem.id); // 将部门添加到右侧已选择
      } else {
        checkedNodes = checkedNodes.filter(item => item.userId !== orgItem.userId);
        this.selectedUserList = this.selectedUserList.filter(
          item => item.departmentId && item.userId !== orgItem.userId,
        );
      }
      this.$refs.orgTree.setCheckedNodes(checkedNodes);
    },
    reset() {
      this.$refs.orgTree.setCheckedKeys([]);
      if (this.selectType === 'selectList') {
        this.selectedDeptList = [];
        this.selectedUserList = [];
      }
    },
    sure() {
      const params = {
        dept: this.selectedDeptList,
        staff: this.selectedUserList,
      };
      if (this.isNecessary && this.selectedUserList.length == 0) {
        postMessage({
          type: 'error',
          message: '请选择员工',
        });
        return;
      }
      this.$emit('getSelectedData', params);
      this.cancel();
    },
    cancel() {
      this.$emit('update:dialogVisible', false);
    },
    /**
     * 获取所有员工和部门
     * */
    getAllOrgList() {
      this.orgList = [];
      const promiseDept = post('/ajax/wxWork/corp/tsUser_h.jsp?cmd=getAllDepartmentList');
      const promiseUser = post('/ajax/wxWork/corp/tsUser_h.jsp?cmd=getAllUserlist', {
        isGetAll: this.isGetAll,
      });
      Promise.all([promiseDept, promiseUser]).then(res => {
        if (res[0].data && res[0].success) {
          const deptList = res[0].data;
          const userList = res[1].data;
          // let RootDeptList = [];
          for (const item of deptList) {
            if (item.parentid === 0) {
              this.rootKey.push(item.id);
              this.orgList.push(item);
              this.addChildren(item, [...res[0].data, ...res[1].data]);
            }
          }
          this.$nextTick(() => {
            if (Object.keys(this.selectedOrgData).length) {
              // modify by lymn 现在用选中的数据设置勾选状态，代码更清晰，也能与展开数据解耦
              const { dept = [], staff = [] } = this.selectedOrgData;
              const checkedKeys = [...dept, ...staff].map(item => {
                if (item.departmentId) {
                  // 成员
                  return item.id.toString().includes('#') ? item.id : item.id + '#' + item.departmentId; // 注意：初始化时需要拼接数据，初始化后返回的数据已经是拼接过了，所以不需要再拼接
                } else {
                  return item.id;
                }
              });
              this.$refs.orgTree.setCheckedKeys(checkedKeys);
              if (checkedKeys.length) {
                this.expandKeyCal = checkedKeys;
              } else {
                this.expandKeyCal = this.rootKey;
              }
            } else {
              // 兼容旧数据，就数据用默认展开数据，设置勾选状态
              this.$refs.orgTree.setCheckedKeys(this.defaultExpandKeys);
              if (this.defaultExpandKeys && this.defaultExpandKeys.length) {
                this.expandKeyCal = this.defaultExpandKeys;
              } else {
                this.expandKeyCal = this.rootKey;
              }
            }
          });
        } else {
          postMessage({
            type: 'error',
            message: res[0].msg || '网络错误，请稍候重试',
          });
        }
      });
    },
    /**
     * 递归子节点
     * @param {Object} parentObj - 父节点
     * @param {Array} orgData - 所有的组织的list
     * */
    addChildren(parentObj, orgData) {
      if (orgData && orgData.length) {
        const copyUserList = [];
        orgData.forEach(item => {
          if (item.parentid && item.parentid === parentObj.id) {
            // 部门
            if (!parentObj.children) {
              parentObj.children = [];
            }
            parentObj.children.push(item);
            this.addChildren(item, orgData);
          } else if (item.departmentId && item.departmentId === parentObj.id) {
            // 员工
            item.id = item.id + '#' + parentObj.id; // 用于tree的遍历判断
            const copyItem = Object.assign({}, item); // 复制一份到各自的部门下
            if (!copyUserList.includes(item.id)) {
              copyUserList.push(copyItem);
            }
            if (!parentObj.children) {
              parentObj.children = [];
            }
            parentObj.children.push(copyItem);
          }
        });
        this.allUserList = this.allUserList.concat(copyUserList);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/* start:组织架构选择通知发送对话框样式 */
.orgSelectDialog {
  .orgSelectContent {
    .orgSelectWrapper {
      position: relative;
      border: 1px solid rgba(238, 238, 238, 0.9);
      box-sizing: border-box;
      &::after {
        position: absolute;
        top: 0;
        left: 300px;
        width: 1px;
        height: 100%;
        background-color: rgba(238, 238, 238, 0.9);
        content: '';
      }
      .selectTitle {
        display: flex;
        height: 47px;
        background: #fafafa;
        border-bottom: 1px solid rgba(238, 238, 238, 0.9);
        align-items: center;
        flex-flow: row nowrap;
      }
      .titleText {
        font-size: 16px;
        color: $color-00;
        text-align: center;
        flex: 1;
        &.left {
          flex: 0 0 300px;
        }
      }
      .selectContent {
        display: flex;
        flex-flow: row nowrap;
        .leftContent {
          padding: 20px;
          overflow-x: scroll;
          box-sizing: border-box;
          flex: 0 0 300px;
        }
        .selectInputBox {
          margin-bottom: 15px;
        }
        .selectedBox {
          height: 337px;
          padding: 20px 0 20px 20px;
          overflow-y: auto;
          box-sizing: border-box;
          .selectWrapper {
            .orgTypeName {
              display: flex;
              height: 38px;
              margin-right: 10px;
              align-items: center;
              .nothingText {
                margin-left: 10px;
                font-size: 14px;
                color: $color-b2;
              }
            }
            .selectLabelBox {
              display: flex;
              margin-bottom: 10px;
              flex-flow: row wrap;
              flex: 0 0 270px;
              .selectLabel {
                margin-right: 10px;
                margin-bottom: 10px;
              }
            }
          }
        }
      }
    }
  }
}

/* end:组织架构选择通知发送对话框样式 */
</style>

<style lang="scss">
.orgSelectDialog {
  .orgSelectContent {
    .orgSelectWrapper {
      .selectContent {
        .el-tree-node__content {
          & > .el-tree-node__expand-icon {
            padding: 6px 6px 0 6px;
          }
        }
      }
    }
  }
}
</style>
