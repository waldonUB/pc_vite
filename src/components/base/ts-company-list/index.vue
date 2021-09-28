<!--
 * @Author       : ADI
 * @Date         : 2021-03-31 16:52:48
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-17 14:26:17
-->
<template>
  <div class="tanshu-companyList " :class="bindClass" ref="companyList" @scroll="rollingLoad" style="overflow: auto;">
    <div class="companyName" v-if="showCompanyName && companyNameData">
      <span class="companyNameText">{{ companyNameData.name }}</span>
      <el-popover
        :value="0 === currentClickId && operateVisible"
        :visible-arrow="false"
        :placement="placement"
        :popper-class="popperClass"
        @show="showOperate(companyNameData)"
        @hide="hideOperate(companyNameData)"
        trigger="click"
      >
        <slot name="companyDialog" :data="{ data: companyNameData }"></slot>
        <span v-if="isUpperAdm" class="iconBtn isShow" slot="reference">
          <global-ts-svg-icon class="icon" name="icon-icon-18" />
        </span>
      </el-popover>
    </div>
    <el-tree
      ref="companyTree"
      :props="defaultProps"
      :data="data"
      node-key="id"
      :current-node-key="currentNodekey"
      lazy
      :auto-expand-parent="true"
      :check-strictly="checkStrictly"
      :show-checkbox="showCheckBox"
      :default-expanded-keys="defaultExpandKeys"
      :expand-on-click-node="expandOnClickNode"
      :check-on-click-node="expandClickNode"
      :highlight-current="showHighlightCurrent"
      @current-change="handleCurrentChange"
      @node-expand="handleExpand"
      @node-collapse="handleCollapse"
      @node-click="checkNode"
    >
      <template slot-scope="{ node, data }">
        <span class="custom-tree-node" :class="showCheckBox ? 'custom-checkbox-style' : ''">
          <el-tooltip
            :ref="'tip' + data.id"
            :disabled="data.isHideTooltip"
            class="item"
            effect="dark"
            :content="node.label"
            :open-delay="300"
            transition="el-fade-in-linear el-zoom-in-bottom"
            placement="top-start"
          >
            <span class="name" @mouseover="isOverflow($event, data)">{{ node.label }}</span>
          </el-tooltip>
          <span @click.stop>
            <el-popover
              v-if="!data.isStaff && hasOperate"
              ref="popover"
              :value="data.id === currentClickId && operateVisible"
              :visible-arrow="false"
              :placement="placement"
              :popper-class="popperClass"
              @show="showOperate(data)"
              @hide="hideOperate(data)"
              trigger="click"
            >
              <slot name="popoverDialog" :data="{ data, node }"></slot>
              <span v-if="isUpperAdm" :class="'iconBtn ' + data.isShowIcon" slot="reference">
                <global-ts-svg-icon class="icon" name="icon-icon-18" />
              </span>
            </el-popover>
          </span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { filterData } from '@/utils';
import { Tree, Popover } from 'element-ui';
import { getDepartmentList } from '@/api/modules/component/company-list';

export default {
  name: 'ts-company-list',
  components: {
    [Tree.name]: Tree,
    [Popover.name]: Popover,
  },
  props: {
    bindClass: {
      type: String,
      default: '',
    },
    showCheckBox: {
      // 是否展示复选框
      type: Boolean,
      default: false,
    },
    hasOperate: {
      // 是否有...
      type: Boolean,
      default: false,
    },
    placement: {
      // 操作框显示的位置
      type: String,
      default: 'bottom',
    },
    popperClass: {
      // 弹窗的自定义样式类
      type: String,
      default: '',
    },
    operateVisible: {
      // 操作框是否显示
      type: Boolean,
      default: false,
    },
    showCompanyName: {
      // 是否展示公司名称
      type: Boolean,
      default: false,
    },
    needStaff: {
      // 是否需要获取员工数据
      type: Boolean,
      default: true,
    },
    expandOnClickNode: {
      type: Boolean,
      default: false, //是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。
    },
    needCorp: {
      type: Boolean, // 是否需要公司节点
      default: true,
    },
    updateTree: {
      // 是否更新树
      type: Boolean,
      default: false,
    },
    selectKeyList: {
      // 勾选过的节点ID
      type: Array,
      default: () => {
        return [];
      },
    },
    delKeyList: {
      // 删除的节点ID
      type: Array,
      default: () => {
        return [];
      },
    },
    addKeyList: {
      // 添加的节点ID
      type: Array,
      default: () => {
        return [];
      },
    },
    isWorker: {
      type: Boolean,
      default: false,
    },
    showHighlightCurrent: {
      // 选中的节点是否高亮
      type: Boolean,
      default: false,
    },
    permissions: {
      type: [String, Number],
      default: '',
    },
    checkStrictly: {
      // check-strictly 是否开启父子关联  true为关闭 false为开启
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'isLeaf',
      },
      data: [], // 数据
      currentClickId: '', // 当前点击的id
      defaultParam: {
        // 分页需要的默认参数
        pageNow: 1,
        limit: 200, //超过200才分页
        maxPage: 1,
      },
      currentNodeArr: [], // 存储每一个展开的节点的参数 [key: [parentValue1, sonValue2, superSonvalue3 ....]]形式
      hasClosedNodeArr: [], // 存储每一个关闭后的节点 key-value的形式
      httpParamesIndex: null, // 当前请求的参数的数组下标
      firstId: -1, // 未点击节点的请求的参数
      firstHttpParams: {
        // 未点击节点的请求参数
        id: -1,
      },
      scrollLoadingFlag: true,
      rootDepartmentId: -1, // 二级部门的id （假设公司为一级部门, 公司下一层次的部门为二级部门）
      checkNodes: [], // 目前被选中的节点所组成的数组
      unSelectIdList: [], // 取消的节点的id
      companyNameData: '', // 公司名称信息
      defaultExpandKeys: [],
      firstIdArr: [], // 第一层级的部门的id
      currentChangeData: null, // 当前选中节点数据
      currentNodekey: 0, // 默认选中的节点id
      indeterminateDebounce: undefined,
    };
  },
  computed: {
    ...mapState({
      isUpperAdm: state => state.user.info?.staffInfo?.isUpperAdm, // 超级管理员
    }),
    expandClickNode() {
      return this.showCheckBox;
    },
  },
  methods: {
    isOverflow(event, data) {
      const target = event.target;
      const cWidth = target.clientWidth;
      const sWidth = target.scrollWidth;
      if (sWidth > cWidth) {
        this.$set(data, 'isHideTooltip', false);
      } else {
        this.$set(data, 'isHideTooltip', true);
      }
    },
    showOperate(data) {
      if (!this.isUpperAdm) return;
      this.$emit('update:operateVisible', true);
      this.$set(data, 'isShowIcon', 'isShow');
      this.currentClickId = data.id;
    },
    hideOperate(data) {
      if (data.id != this.currentChangeData.id) {
        this.$set(data, 'isShowIcon', 'isHide');
      }
    },
    checkNode(value, node) {
      this.$nextTick(() => {
        this.handleCheckChange(value, node.checked);
        this.setSameStaffStatus(node);
      });
      if (!value.isStaff) {
        return;
      } else {
        this.$emit('checkNode', value);
      }
    },
    /**
     * 当前员工在其他部门下也存在时,需要设置其选中状态
     * @author JHao
     * @date 2021-03-05
     * @param {*} node
     */
    setSameStaffStatus(node) {
      const data = node.data;
      const checked = node.checked;
      const list = [];
      if (data.isStaff) {
        for (const depItem of data.depIdList) {
          const id = `${data.sid}#${depItem}`;
          if (id !== data.id) {
            list.push(id);
          }
        }
        for (const item of list) {
          const staffNode = this.$refs.companyTree.getNode(item);
          this.$refs.companyTree.setChecked(item, checked);
          if (staffNode) {
            this.handleCheckChange(staffNode.data, checked);
          }
        }
      } else {
        const len = node.childNodes.length;
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            this.setSameStaffStatus(node.childNodes[i]);
          }
        }
      }
    },
    /**
     * 当前选中节点变化时触发的事件
     * @author lymn
     * @date 2020-09-16
     * @param {Object} data 当前选中的节点对象
     */
    handleCurrentChange(data) {
      this.$emit('handleCurrentChange', data);
      if (this.currentChangeData) {
        this.$emit('update:operateVisible', false); // 隐藏操作弹窗
        this.$set(this.currentChangeData, 'isShowIcon', 'isHide'); // 隐藏其他节点的省略按钮
      }
      this.$set(data, 'isShowIcon', 'isShow');
      this.currentChangeData = data;
    },
    /**
     * @description 节点选中状态发生变化时的回调
     * @author enson
     * @date 2020-08-28
     * @param {Object} data - 当前选择节点
     * @param {Boolean} checked - 是否被选中
     */
    handleCheckChange(data, checked) {
      if (!this.showCheckBox) return;

      if (!this.checkStrictly) {
        const node = this.$refs.companyTree.getNode(data);
        if (this.delKeyList.includes(data.id)) {
          // 当右侧tab删除部门时 需要去处理部门下的子节点状态
          this.childNodeChange(node);
        }
      }

      if (checked) {
        this.$emit('checkItem', data.isStaff);
      }
      this.$emit('changeSelectList', data, checked);
      this.setCheckNodesValue();
      // getCheckedNodes()只能获取到当前的数据，对于编辑的话，可能是下一层级的数据，导致没有获取到
      // 因此需要先通过unSelectIdList 取消勾选的数据以及获取到编辑的数据，进行数据的处理
      this.$emit('handleCheckChange', this.$refs.companyTree.getCheckedNodes());
    },
    // 遍历子节点
    childNodeChange(node) {
      const len = node.childNodes.length;
      if (len > 0) {
        for (let i = 0; i < len; i++) {
          this.$refs.companyTree.setChecked(node.childNodes[i], node.checked);
          this.setSameStaffStatus(node.childNodes[i]);
          this.childNodeChange(node.childNodes[i]);
        }
      }
    },
    /**
     * @description
     * @author enson
     * @date 2020-08-31
     * @param {boolean} isPageLoad - 是否是分页加载 true-分页加载 false-首次加载
     * @returns
     */
    async loadData(isPageLoad = false) {
      const dataId = this.rootDepartmentId;
      let httpParames;
      let httpParamesIndex = 0;
      if (dataId !== this.firstId) {
        const dataArr = this.currentNodeArr[dataId];
        for (let index = dataArr.length - 1; index >= 0; index--) {
          /**
           * 满足三个条件才进行赋值
           * 1 httpParames没有赋值过
           * 2 未加载完
           * 3 加载的节点是展开的
           */
          if (!httpParames && !dataArr[index].isAll && !dataArr[index].isClose) {
            if (isPageLoad) {
              if (dataArr[index].maxPage > dataArr[index].pageNow) {
                dataArr[index].pageNow++;
              }
            }
            httpParames = dataArr[index];
            httpParamesIndex = index;
          }
        }
      } else {
        if (isPageLoad) {
          if (this.firstHttpParams.maxPage > this.firstHttpParams.pageNow) {
            this.firstHttpParams.pageNow++;
          }
        }
        this.firstHttpParams = Object.assign({}, this.defaultParam, this.firstHttpParams);
        httpParames = this.firstHttpParams;
      }

      if (!httpParames || httpParames.isAll) {
        return [];
      }

      if (this.showCheckBox) {
        this.setCheckNodesValue();
      }

      httpParames = filterData(httpParames, ['id', 'maxPage', 'pageNow', 'limit']);
      // 2021年1月14日 waldon 新增一个permissions字段
      let params = {
        needStaff: this.needStaff,
        needCorp: this.needCorp,
        isWorker: this.isWorker,
        permissions: this.permissions,
      };
      params = { ...params, ...httpParames };
      const [err, res] = await getDepartmentList(params);
      if (err) {
        return Promise.reject(err);
      }
      let departmentData = null;
      if (dataId !== this.firstId) {
        this.currentNodeArr[dataId][httpParamesIndex].maxPage = Math.ceil(
          res.total / this.currentNodeArr[dataId][httpParamesIndex].limit,
        );
        this.currentNodeArr[dataId][httpParamesIndex].isAll = res.data.isAll;
        departmentData = this.currentNodeArr[dataId][httpParamesIndex];
      } else {
        this.firstHttpParams.maxPage = Math.ceil(res.total / this.firstHttpParams.limit);
        this.firstHttpParams.isAll = res.data.isAll;
      }
      this.companyNameData = res.data.corpDep;
      const companyList = res.data.departmentList;
      companyList.forEach(item => {
        if (item.isStaff) {
          // 如果是员工数据的话需要对员工数据加上部门id，避免员工id和部门id重复
          item.id = `${item.sid}#${item.depId}`;
          item.isLeaf = true;
        } else {
          item.isLeaf = !item.hasChild;
        }
      });
      return Promise.resolve([departmentData, companyList]);
    },
    /**
     * @description 设置checkNodes的值
     * @author enson
     * @date 2020-09-06
     */
    setCheckNodesValue() {
      // 获取当前已经勾选的，去除已经取消勾选的
      const checkNodeIdList = this.$refs.companyTree.getCheckedKeys();
      this.checkNodes = checkNodeIdList;
    },
    updateExpandKeys(list) {
      this.defaultExpandKeys = [...this.defaultExpandKeys, ...list];
    },
    /**
     * @description 节点展开时的回调函数
     * @author enson
     * @date 2020-08-28
     * @param {Object} data - 当前节点的数据
     * @param {Object} node - 当前节点的Node
     */
    handleExpand(data, node, nodeDom) {
      // this.$refs['companyList'].scrollTop = 0;
      const initDefaultParam = Object.assign({ isClose: false }, data, this.defaultParam);
      this.$emit('update:operateVisible', false); // 隐藏操作弹窗
      // 是否是第一层的部门
      if (this.firstIdArr.includes(data.id)) {
        this.rootDepartmentId = data.id; // 根部门Id
        this.currentNodeArr[this.rootDepartmentId] = [initDefaultParam];
      } else {
        const index = this.currentNodeArr[this.rootDepartmentId].findIndex(item => item.id === data.id);
        if (index < 0) {
          this.currentNodeArr[this.rootDepartmentId].push(initDefaultParam);
        } else {
          this.currentNodeArr[this.rootDepartmentId].splice(index, 1, initDefaultParam);
        }
      }

      this.loadData().then(([departmentData, resData]) => {
        resData && this.appendData(departmentData, resData, false, node);
      });
    },
    /**
     * @description 节点关闭时的操作
     * @author enson
     * @date 2020-08-30
     * @param {*} data
     */
    handleCollapse(data, node, nodeDom) {
      this.$emit('update:operateVisible', false); // 隐藏操作弹窗
      if (this.firstIdArr.includes(data.id)) {
        // 是否是第一层的部门
        this.resetParam();
      } else {
        // 针对一种场景：用户关闭节点后，底部加载更多的时, 不加载已闭合的节点
        let currentNodeData;
        this.currentNodeArr[this.rootDepartmentId].forEach(item => {
          if (item.id === data.id) {
            currentNodeData = item;
            currentNodeData && this.$set(currentNodeData, 'isClose', true);
          }
        });
      }

      // 关闭时删除节点
      const children = node.data.children || node.data;
      children.splice(0, children.length - 1);
    },
    /**
     * 滚动加载
     * @return {Boolean} 滚动加载开关
     */
    scrollLoad(event) {
      const target = event.target;
      const offsetHeight = target.offsetHeight; // 元素的高度
      const scrollTop = target.scrollTop; // 获取元素的内容垂直滚动的像素数
      const scrollHeight = target.scrollHeight; // 是一个元素内容高度的度量，包括由于溢出导致的视图中不可见内容。
      if (offsetHeight + scrollTop - scrollHeight === 0) {
        return true;
      } else {
        return false;
      }
    },
    /**
     * 判断当前tab是否需要滚动加载
     * @param {String} name 那个地方触发了滚动加载
     */
    rollingLoad(event) {
      clearTimeout(this.scrollTimer);
      this.scrollTimer = setTimeout(() => {
        if (this.scrollLoad(event) && this.scrollLoadingFlag) {
          //scrollLoadingFlag为true说明可以进行下一次请求
          this.scrollLoadingFlag = false;
          this.loadData(true).then(([departmentData, treeData]) => {
            if (departmentData && treeData) {
              const node = this.$refs.companyTree.getNode(this.currentNodekey);
              this.appendData(departmentData, treeData, true, node);
              const target = event.target;
              const scrollTop = target.scrollTop - target.scrollTop / 4;
              target.scrollTop = scrollTop > 0 ? scrollTop : 0;
            }
            this.scrollLoadingFlag = true;
          });
        }
      }, 300);
    },
    /**
     * @description 为部门添加子节点
     * @author enson
     * @date 2020-08-31
     * @param {*} departmentData
     * @param {*} childrenData
     * @param {*} isMore 是否是加载更多
     */
    appendData(departmentData, childrenData, isMore = false, node) {
      if (!departmentData && this.rootDepartmentId === this.firstId) {
        isMore && this.data.push(childrenData);
        return;
      }

      if (departmentData.isStaff) return; // 如果不是部门直接return;

      if (!departmentData.children) {
        this.$set(departmentData, 'children', []);
      }

      this.$nextTick(() => {
        const parentNode = this.$refs['companyTree'].getNode(departmentData.id);
        if (isMore) {
          // 加载更多
          const children = departmentData.children.concat(childrenData);
          this.$set(departmentData, 'children', children);

          childrenData.forEach(item => {
            this.$refs['companyTree'].append(item, parentNode);
          });
        } else {
          // 点击节点
          this.$set(parentNode, 'isLeafByUser', false); //是否有子节点
          this.$set(parentNode, 'expanded', true); //是否展开
          this.$set(departmentData, 'children', childrenData);
          // departmentData 是请求参数传过来的数据，因此需要更新一下节点
          this.$refs['companyTree'].updateKeyChildren(departmentData.id, departmentData.children);
        }

        // 避免勾选的数据被重新加载的数据覆盖掉
        if (this.showCheckBox && node) {
          this.$refs.companyTree.setCheckedKeys(this.checkNodes);
          this.handleCheckChange(node.data, node.checked);
        }
      });
    },
    /**
     * @description 需要重置的数据
     * @author enson
     * @date 2020-08-31
     */
    resetParam() {
      this.currentNodeArr = []; // 重置
      this.rootDepartmentId = this.firstId; // 重置
    },
    /**
     * @description 树的初始化函数
     * @author enson
     * @date 2020-09-07
     */
    initData() {
      this.firstId = this.needCorp ? -1 : 0; // 是否需要公司这个层级
      this.rootDepartmentId = this.firstId;
      this.firstHttpParams = {
        id: this.firstId,
      };
      this.loadData().then(([departmentData, initData]) => {
        this.$nextTick(() => {
          this.currentNodeArr = [];
          this.unSelectIdList = [];
          this.checkNodes = [];
          this.$refs.companyTree.setCheckedKeys([]);
          this.data = initData;
          this.currentNodekey = initData[0].id; // 初始化时默认选中的节点
          this.currentChangeData = initData[0];
          this.$set(initData[0], 'isShowIcon', 'isShow'); // 初始化时默认展示选中节点的省略号按钮
          initData.forEach(item => {
            !item.isStaff && this.firstIdArr.push(item.id);
          });
          const companyData = this.needCorp && this.data[0];
          // 特殊逻辑 ！！！ 如果有公司这个层级，那么就展开公司这个层级
          if (companyData && companyData.hasChild && companyData.id === 0 && companyData.fid === -1) {
            this.defaultExpandKeys = [companyData.id];
            this.handleExpand(companyData);
          }
          this.$emit('update:updateTree', false);
          this.$emit('start'); // 把需要勾选的逻辑发送出去
        });
      });
    },
  },
  mounted() {
    this.initData();
    this.checkNodes = [].concat(this.selectKeyList);
  },
  watch: {
    updateTree(newVal) {
      if (newVal) {
        this.initData();
      }
    },
    data(newVal) {
      if (newVal) {
        console.log('datadatadatadatadata');
        console.log(this.data);
      }
    },
    delKeyList(newVal) {
      if (newVal) {
        for (const item of newVal) {
          this.$refs.companyTree.setChecked(item, false);
          const node = this.$refs.companyTree.getNode(item);
          node && this.handleCheckChange(node.data, node.checked);
        }
      }
    },
    addKeyList(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.checkNodes = [...new Set([...newVal, ...this.checkNodes])];
          this.$refs.companyTree.setCheckedKeys(this.checkNodes);
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/* tanshu-companyList组件样式 start */
.tanshu-companyList {
  .companyName {
    margin-bottom: 14px;
    font-size: 14px;
    color: $color-00;
    cursor: pointer;
    .companyNameText {
      max-width: 160px;
    }
    .iconBtn {
      &.isShow {
        display: inline-block;
      }
    }
    &:hover {
      .iconBtn {
        display: inline-block;
      }
    }
  }
  .custom-tree-node {
    position: relative;
    display: flex;
    // font-family: MicrosoftYaHei;
    font-size: 14px;
    color: $color-00;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    &.custom-checkbox-style {
      &::before {
        position: absolute;
        top: 2px;
        left: -23px;
        z-index: 999;
        display: block;
        width: 16px;
        height: 16px;
        content: '';
      }
    }
    .iconBtn {
      &.isShow {
        display: block;
      }
    }
    &:hover {
      .iconBtn {
        display: block;
      }
    }
    span {
      &:focus {
        outline: none;
      }
    }
  }
  .iconBtn {
    display: none;
    float: right;
    color: $color-b2;
    &:focus {
      outline: none;
    }
  }
}
.tanshu-companyList .custom-tree-node .name,
.tanshu-companyList .companyName .companyNameText {
  display: inline-block;
  max-width: 110px;
  padding-right: 20px;
  overflow: hidden;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
}

/* tanshu-companyList组件样式 end */
</style>

<style lang="scss">
.tanshu-companyList .el-tree {
  display: inline-block;
  min-width: 100%;
}

/* 控制树形的箭头点击范围 */
.orgSelectDialog
  .orgSelectContent
  .orgSelectWrapper
  .selectContent
  .tanshu-companyList
  .el-tree-node__content
  > .el-tree-node__expand-icon {
  padding: 6px;
}
</style>
