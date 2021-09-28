<!--
 * @Author       : ADI
 * @Date         : 2021-07-07 16:30:50
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-19 10:34:22
-->
<template>
  <div class="roleManageDetail">
    <global-ts-card-box>
      <template v-slot:card-box-head>
        <global-ts-tabguide @backToPrePage="backManage">
          <template v-slot:leftPart>权限管理</template>
          <template v-slot:rightPart>{{ requestParam.id ? '编辑' : '添加' }}角色</template>
        </global-ts-tabguide>
      </template>
      <template v-slot:card-box-body>
        <fa-form-model class="groupBox flex" ref="ruleForm" :model="requestParam" layout="vertical" :rules="formRules">
          <fa-form-model-item label="角色名称" prop="roleName" style="margin-right: 10px;">
            <global-ts-input
              class="roleNameInputBox"
              :maxLength="8"
              v-model="requestParam.roleName"
              placeholder="请输入角色名称"
            >
            </global-ts-input>
          </fa-form-model-item>
          <fa-form-model-item label="数据权限" prop="dataAuthType">
            <global-ts-select
              class="dataAuthSelectBox"
              :selectkey="{ label: 'value', value: 'key' }"
              :list="dataPermissionList"
              :selectVal="requestParam.dataAuthType"
              placeholder="请选择数据权限"
              @change="selectDataAuth"
            >
            </global-ts-select>
          </fa-form-model-item>
        </fa-form-model>

        <div class="rolePermission">
          <div class="roleAuthTitle">
            角色权限
          </div>
        </div>
        <div class="roleAuthTreeWrapper">
          <role-auth-tree
            v-if="rolePermissionList.length"
            :allAuthList="rolePermissionList"
            :authList="rolePermissionList"
            :authType="2"
            :level="1"
          ></role-auth-tree>
        </div>
      </template>
      <template v-slot:card-box-bottom>
        <global-ts-button @click="savePermission" slot="button" type="primary" size="medium">保存 </global-ts-button>
      </template>
    </global-ts-card-box>
  </div>
</template>

<script>
import commData from '../../mixins/comm-data/index.vue';
import roleAuthTree from '../role-auth-tree/index.vue';
import { saveRole, getRole, getDataPermissionsTypeDef } from '@/api/modules/views/setting-center/role-manage';

export default {
  name: 'role-manage-detail',
  mixins: [commData],
  components: {
    roleAuthTree,
  },
  props: {
    currentRowData: {
      type: Object,
      default: () => {
        return {
          roleName: '',
        };
      },
    },
  },
  data() {
    return {
      text: 'hhh',
      rules: {
        roleName: [
          {
            type: 1,
            min: {
              limitNum: 0,
              tips: '角色名称为空',
              topTips: '角色名称为空',
            },
          },
        ],
        roleNameErrCount: 0,
      },
      dataPermissionList: [], // 数据权限列表选项
      listProps: {
        label: 'name',
        children: 'child',
      },
      rolePermissionList: [], // 角色权限列表
      expandKey: '', // 当前展开的最外层节点key值
      authTreeNodeRoot: {}, // 树顶层节点
      requestParam: {
        // 保存数据
        id: 0, // 不传id或者id为0，则为新增角色；传id为编辑角色
        roleName: '', // 角色名
        dataAuthType: 3, // 数据权限，默认选中“只能查看自己的数据”
        permissionsNewStr: '', // 权限集（json）
      },
      defaultCheckedKeys: [], // 默认选中的角色权限选项
    };
  },
  computed: {
    formRules() {
      return {
        roleName: [
          { required: true, message: '角色名称为空', trigger: 'blur' },
          { min: 1, max: 8, message: '分类不能超过8个字符', trigger: 'blur' },
        ],
        dataAuthType: [{ required: true, message: '请选择数据权限', trigger: 'blur' }],
      };
    },
  },
  watch: {},
  async created() {
    Object.assign(this.$data, this.$options.data());
    if (this.currentRowData.id) this.requestParam.id = this.currentRowData.id;
    await this.getDataPermissionsTypeDef();
    await this.getRoleInfo();
  },
  mounted() {},
  methods: {
    /**
     * 保存角色管理设置
     * @author waldon
     * @date 2021/1/5
     */
    savePermission() {
      // this.getSelectStatus()
      this.$refs['ruleForm'].validate(async valid => {
        if (!valid) {
          return false;
        }
        this.rolePermissionList.forEach(item => {
          delete item.isParent;
        });
        console.log(this.rolePermissionList, '最终的结果');
        this.requestParam.permissionsNewStr = JSON.stringify(this.rolePermissionList);
        const [err, res] = await saveRole(this.requestParam);
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        this.backManage();
      });
    },
    backManage() {
      this.$emit('changeTemp', {}, 'list');
    },
    /**
     * 获取角色管理信息
     * @author lymn
     * @date 2021-03-09
     * @param {Boolean} param
     * @return {Boolean} return
     */
    async getRoleInfo() {
      const [err, res] = await getRole({ id: this.requestParam.id });
      if (err) {
        return Promise.reject(err);
      }
      const data = res.data;
      let { dataAuthType } = data;
      const { roleName = '', id = 0 } = data;
      if (dataAuthType == 0) dataAuthType = this.dataPermissionList[2].key; // 默认选中“只查看自己的数据” lymn test 后端好像去掉了数据
      Object.assign(this.requestParam, { roleName, id, dataAuthType });
      this.rolePermissionList = data.permissionsNew;
    },
    /**
     * 获取数据权限列表
     * @author lymn
     * @date 2021-03-09
     */
    async getDataPermissionsTypeDef() {
      const [err, res] = await getDataPermissionsTypeDef();
      if (err) {
        return Promise.reject(err);
      }
      const data = res.data;
      this.dataPermissionList = data;
    },
    /**
     * 选择数据权限
     * @author lymn
     * @date 2021-03-09
     * @param {Boolean} param
     * @return {Boolean} return
     */
    selectDataAuth(newVal) {
      this.requestParam.dataAuthType = newVal;
    },
    /**
     * 展示/隐藏树的某个节点及其子节点
     * @author lymn
     * @date 2021-03-03
     * @param {Object} node 对应的node节点
     * @param {Boolean} isExpand 展开/隐藏
     */
    changeTreeNodeStatus(node, isExpand) {
      node.expanded = isExpand; // 根据该属性设置节点展开/隐藏 true为展开 false为隐藏
      for (let i = 0; i < node.childNodes.length; i++) {
        // 改变节点的子节点expanded状态
        node.childNodes[i].expanded = isExpand;
        // 遍历子节点
        if (node.childNodes[i].childNodes.length > 0) {
          this.changeTreeNodeStatus(node.childNodes[i], isExpand);
        }
      }
    },
    /**
     * 展开/收起子节点
     * @author lymn
     * @date 2021-03-03
     * @param {Boolean} param
     * @return {Boolean} return
     */
    toggleTreeList(data, node) {
      if (data.isParent && data.child) {
        if (this.expandKey && this.expandKey != node.key) {
          // 如果原先已有其他展开的节点，需要先收起其子节点
          const nodeIndex = this.rolePermissionList.findIndex(item => item.permissionsKey == this.expandKey);
          const lastNode = this.authTreeNodeRoot.childNodes[nodeIndex];
          this.changeTreeNodeStatus(lastNode, false);
        }
        const isExpand = !node.expanded;
        if (isExpand) this.expandKey = node.key;
        else this.expandKey = '';
        this.changeTreeNodeStatus(node, isExpand); // 展开/隐藏子节点
      }
    },
    /**
     * 初始化选中的角色权限选项
     * @author lymn
     * @date 2021-03-11
     * @param {Boolean} param
     * @return {Boolean} return
     */
    getSelectedKeys(list) {
      list.forEach(item => {
        if (item.selected) this.defaultCheckedKeys.push(item.permissionsKey);
        if (item.child && item.child.length > 0) this.getSelectedKeys(item.child);
      });
    },
    /**
     * 处理角色权限树列表选中情况
     * @author lymn
     * @date 2021-03-20
     */
    getSelectStatus() {
      console.log(this.$refs.roleAuthTree.getCheckedKeys(), '所有选中的节点==');
      console.log(this.$refs.roleAuthTree.getHalfCheckedKeys(), '所有半选中的节点');
      const list = this.rolePermissionList;
      const checkedKeys = this.$refs.roleAuthTree.getCheckedKeys(); // 获取所有全选中的节点key值
      const halfCheckedKeys = this.$refs.roleAuthTree.getHalfCheckedKeys(); // 获取所有半选中的节点key值
      this.setSelectStatus(list, checkedKeys, halfCheckedKeys);
      console.log(this.rolePermissionList, '经过处理的角色权限');
    },
    setSelectStatus(list, checkedKeys, halfCheckedKeys) {
      for (let i = 0, len = list.length; i < len; i++) {
        const curItem = list[i];
        curItem.selected = checkedKeys.includes(curItem.permissionsKey); // 设置全选
        if (curItem.child) {
          curItem.halfSelect = halfCheckedKeys.includes(curItem.permissionsKey); // 设置半选
          this.setSelectStatus(curItem.child, checkedKeys, halfCheckedKeys);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.roleManageDetail {
  width: 100%;
  height: 100%;
  .tanshu-cardBox-body {
    .groupItem {
      margin-right: 12px;
    }
    .dataAuthSelectBox {
      .motivate {
        height: 34px;
        line-height: 34px;
        color: $color-53;
      }
    }
    .setRoleName {
      margin-bottom: 6px;
      font-size: 14px;
      line-height: 19px;
      color: $color-53;
    }
    .rolePermission {
      margin-top: 40px;
      margin-bottom: 13px;
      .roleAuthTitle {
        font-size: 16px;
        font-weight: bold;
        color: $color-00;
      }
    }
    .checkGroupBox {
      width: 560px;
      .checkboxItem {
        width: 25%;
        margin-bottom: 20px;
      }
    }
  }
  .tanshu-cardBox-body .roleNameInputBox,
  .tanshu-cardBox-body .dataAuthSelectBox {
    width: 320px;
  }
}
.roleAuthTreeWrapper {
  display: inline-block;
  border: 1px solid #eeeeee;
}
</style>

<style lang="scss">
.roleManageDetail {
  .tanshu-cardBox-body {
    padding: 20px;
    box-sizing: border-box;
  }
  .fa-checkbox-wrapper + .fa-checkbox-wrapper {
    margin-left: 0;
  }
}
</style>
