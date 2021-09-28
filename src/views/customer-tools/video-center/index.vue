<!--
 * @Description  : 获客视频 - 视频
 * @Author       : turbo
 * @Date         : 2021-03-30 13:52:23
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-28 15:08:55
-->

<template>
  <div class="videoCenterWrapper">
    <keep-alive :exclude="['classifyManager']">
      <component
        @changeComponent="changeComponent"
        @changeSlide="changeSlide"
        :initClassifyParam="initClassifyParam"
        :initRequestParam="initRequestParam"
        :isManager="isManager"
        ref="videoTemp"
        :is="currentTemp"
        :key="currentTemp"
      >
      </component>
    </keep-alive>
  </div>
</template>

<script>
import addVideoDialog from './components/add-video-dialog/index.vue';
import videoList from './components/video-list/index.vue';
import classifyManager from './components/classify-manager/index.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'VideoCenter',
  components: {
    addVideoDialog,
    videoList,
    classifyManager,
  },
  data() {
    return {
      currentTemp: '', // videoList classifyManager
      initClassifyParam: {
        type: 0,
      },
      initRequestParam: {
        type: 0,
        set: true,
      },
    };
  },
  computed: {
    ...mapGetters({
      isManager: 'user/isManage',
    }),
  },
  created() {
    this.currentTemp = 'videoList';
  },
  methods: {
    /**
     * 页签改变回调
     * @author waldon
     * @date 2020/11/27
     * @param {Object} rowData - 页签附带参数
     */
    changeSlide(rowData) {
      this.initClassifyParam.type = rowData.type;
      this.initRequestParam.type = rowData.type;
    },
    backManage() {
      this.currentTemp = 'classifyManager';
    },
    /**
     * 改变组件类型
     * @author waldon
     * @date 2020/11/27
     * @param {Object} backParam - 组件类型
     */
    changeComponent(backParam) {
      this.currentTemp = backParam.page;
    },
  },
};
</script>

<style lang="scss" scoped></style>
