<!--
 * @Description  : 话术库
 * @Author       : turbo
 * @Date         : 2021-03-30 15:30:54
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-29 11:19:06
-->

<template>
  <keep-alive>
    <component
      :is="currentComponent"
      :group-type="groupType"
      :group-tag-list="groupTagList"
      :group-tag-parent-list="groupTagParentList"
      @changeGroupType="changeGroupType"
      @getGroupTagList="getGroupTagList"
      @backToPrePage="currentComponent = 'wxChatArtList'"
      @toGroupManage="currentComponent = 'groupManage'"
    ></component>
  </keep-alive>
</template>

<script>
// components
import WxChatArtList from './components/wx-chat-art-list.vue';
import GroupManage from './components/group-manage.vue';

// api
import { customerTools } from '@/api';

export default {
  name: 'WxChatArt',
  components: { WxChatArtList, GroupManage },
  data() {
    return {
      currentComponent: 'wxChatArtList',
      groupType: 5, // 分组类型, 1 - 企业话术, 5 - 我的话术
      groupTagList: [], // 所有分组
      groupTagParentList: [], // 一级分组
      cacheData: new Map(),
    };
  },
  created() {
    this.$pubsub.on('getGroupTagList', this.getGroupTagList);
  },
  methods: {
    changeGroupType(groupType) {
      this.groupType = groupType;
    },
    /**
     * 获取当前页签对应的分组列表
     * @author waldon
     * @date 2020/4/10
     * @param {Number} type - 分组类别
     * @param {Boolean} isRefresh - 是否重新获取数据
     * @Last Modified by: turbo
     * @Last Modified time: 2020-10-23
     */
    async getGroupTagList(type, isRefresh) {
      if (!isRefresh && this.cacheData.get(type)) {
        this.groupTagList = this.cacheData.get(type).groupTagList;
        this.groupTagParentList = this.cacheData.get(type).groupTagParentList;
        return;
      }

      const { getTsGroupList } = customerTools;
      const [err, res] = await getTsGroupList({
        type,
        desc: true,
        sortKey: 'sort',
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      const groupTagList = res.data;
      const groupTagParentList = groupTagList.filter(item => item.parentId === 0); // 筛选出所有一级分组
      groupTagParentList.forEach((parent, index) => {
        if (groupTagParentList.length === 1) {
          parent.noShowUp = true;
          parent.noShowDown = true;
        } else if (index === 0) {
          parent.noShowUp = true;
        } else if (index === groupTagParentList.length - 1) {
          parent.noShowDown = true;
        }
        const childData = groupTagList.filter(child => child.parentId === parent.id);
        if (childData.length) {
          // 将所有二级分组归类到对应的一级分组
          childData.forEach((subItem, subIndex) => {
            // 这边产经说以后也只会有两层，先不抽出来
            if (childData.length === 1) {
              subItem.noShowUp = true;
              subItem.noShowDown = true;
            } else if (subIndex === 0) {
              subItem.noShowUp = true;
            } else if (subIndex === childData.length - 1) {
              subItem.noShowDown = true;
            }
          });
          parent.children = childData;
        }
      });
      this.groupTagList = groupTagList;
      this.groupTagParentList = groupTagParentList;
      this.cacheData.set(type, { groupTagList, groupTagParentList });
    },
  },
};
</script>

<style lang="scss" scoped></style>
