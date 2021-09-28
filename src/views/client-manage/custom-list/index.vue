<!--
 * @Description  : 客户列表
 * @Author       : turbo
 * @Date         : 2021-03-30 14:11:28
 * @LastEditors  : turbo
 * @LastEditTime : 2021-07-07 13:37:28
-->

<template>
  <keep-alive include="customerList">
    <component
      :is="currentComponent"
      :is-manage="isManage"
      :is-part-update="isPartUpdate"
      :all-tag-list="allTagList"
      @backToPrePage="backToPrePage"
      @customerEdit="currentComponent = 'customerEdit'"
      @customerRepeat="currentComponent = 'customerRepeat'"
    ></component>
  </keep-alive>
</template>

<script>
import { mapGetters } from 'vuex';

// components
import CustomerList from './components/customer-list.vue';
import CustomerEdit from './components/customer-edit.vue';
import CustomerRepeat from './components/customer-repeat.vue';

// api
import { client } from '@/api';

export default {
  name: 'CustomList',
  components: { CustomerList, CustomerEdit, CustomerRepeat },
  data() {
    return {
      currentComponent: 'customerList',
      isPartUpdate: false, // 是否需要部分刷新
      allTagList: [],
    };
  },
  computed: {
    ...mapGetters({
      isManage: 'user/isManage',
    }),
  },
  created() {
    this.$utils.logDog('show_customList');
    this.getAllTagList();
  },
  methods: {
    async getAllTagList() {
      const { getCorpTagList } = client;
      const [err, res] = await getCorpTagList({
        type: 0, // 查所有的标签
        isGetAll: true,
      });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.allTagList = res.data;
    },
    backToPrePage(isUpdate = false) {
      this.isPartUpdate = isUpdate;
      this.currentComponent = 'customerList';
    },
  },
};
</script>

<style lang="scss" scoped></style>
