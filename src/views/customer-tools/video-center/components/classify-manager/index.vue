<!--
 * @Author       : ADI
 * @Date         : 2021-06-28 14:28:55
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-28 14:41:48
-->
<template>
  <ts-classify-manager
    backPageName="视频中心"
    backClassifyName="视频"
    :initClassifyParam="initClassifyParam"
    :initRequestParam="initRequestParam"
    @changeComponent="changeComponent"
  >
  </ts-classify-manager>
</template>

<script>
import TsClassifyManager from '@/components/base/ts-classify-manager/index.vue';

export default {
  name: 'classify-manager',
  components: { TsClassifyManager },
  props: {
    initClassifyParam: {
      type: Object,
      default: () => {
        return {
          type: '',
        };
      },
    },
    initRequestParam: {
      type: Object,
      default: () => {
        return {
          type: '',
        };
      },
    },
  },
  data() {
    return {
      backWithParams: {
        page: 'videoList',
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    changeComponent() {
      this.$emit('changeComponent', this.backWithParams);
    },
  },
};
</script>

<style lang="scss" scoped>
.classify-manager {
}
</style>
