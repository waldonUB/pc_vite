<!--
 * @Author       : ADI
 * @Date         : 2021-04-13 10:22:44
 * @LastEditors  : ADI
 * @LastEditTime : 2021-04-16 09:56:08
-->
<template>
  <div class="test-button">
    <global-ts-button :type="disabled ? 'others' : 'primary'" @click="disabled = !disabled">
      toggle disabled => {{ disabled }}
    </global-ts-button>
    <global-ts-button
      :type="iconDirection === 'left' ? 'others' : 'primary'"
      @click="iconDirection = iconDirection === 'left' ? 'right' : 'left'"
    >
      toggle iconDirection => {{ iconDirection }}
    </global-ts-button>
    <global-ts-button :type="loading ? 'others' : 'primary'" @click="loading = !loading">
      toggle loading => {{ loading }}
    </global-ts-button>

    <h2>size & icon</h2>
    <template v-for="size in ['medium', 'small', 'mini']">
      <global-ts-button
        icon="icon-icon-11"
        type="primary"
        :size="size"
        class="test"
        :iconPosition="iconDirection"
        @click="handleFun"
        :disabled="disabled"
        :key="`button-icon-${size}`"
        :loading="loading"
      >
        选择文件
      </global-ts-button>
    </template>

    <br />
    <br />

    <template v-for="size in ['medium', 'small', 'mini']">
      <global-ts-button-old
        icon="icon-icon-11"
        type="primary"
        :size="size"
        class="test"
        :iconPosition="iconDirection"
        @click="handleFun"
        :disabled="disabled"
        :key="`old-button-icon-${size}`"
      >
        选择文件
      </global-ts-button-old>
    </template>

    <br />
    <br />

    <h2>size</h2>
    <template v-for="size in ['medium', 'small', 'mini']">
      <global-ts-button
        type="primary"
        :size="size"
        class="test"
        :iconPosition="iconDirection"
        @click="handleFun"
        :disabled="disabled"
        :key="`button-${size}`"
        :loading="loading"
      >
        选择文件
      </global-ts-button>
    </template>

    <br />
    <br />

    <template v-for="size in ['medium', 'small', 'mini']">
      <global-ts-button-old
        type="primary"
        :size="size"
        class="test"
        :iconPosition="iconDirection"
        @click="handleFun"
        :disabled="disabled"
        :key="`old-button-${size}`"
      >
        选择文件
      </global-ts-button-old>
    </template>

    <h2>type</h2>
    <template v-for="size in ['medium', 'small', 'mini']">
      <template
        v-for="(type, index) in [
          'primary',
          'mainText',
          'greyOther',
          'others',
          'default',
          'black',
          'textGreen',
          'warnText',
          'greyText',
          'blackWarn',
          'greyMain',
        ]"
      >
        <global-ts-button
          :type="type"
          :size="size"
          class="test"
          :iconPosition="iconDirection"
          @click="handleFun"
          :disabled="disabled"
          :key="`button-${size}-${type}`"
        >
          选择文件
        </global-ts-button>
        <br v-if="index % 8 === 0" :key="`button-key-${size}-${type}`" />
      </template>
    </template>

    <br />
    <br />

    <template v-for="size in ['medium', 'small', 'mini']">
      <template
        v-for="(type, index) in [
          'primary',
          'mainText',
          'greyOther',
          'others',
          'default',
          'black',
          'textGreen',
          'warnText',
          'greyText',
          'blackWarn',
          'greyMain',
        ]"
      >
        <global-ts-button-old
          :type="type"
          :size="size"
          class="test"
          :iconPosition="iconDirection"
          @click="handleFun"
          :disabled="disabled"
          :key="`old-button-${size}-${type}`"
        >
          选择文件
        </global-ts-button-old>
        <br v-if="index % 8 === 0" :key="`old-button-key-${size}-${type}`" />
      </template>
    </template>

    <br />
    <br />

    <h2>type & icon</h2>
    <template v-for="size in ['medium', 'small', 'mini']">
      <template
        v-for="(type, index) in [
          'primary',
          'mainText',
          'greyOther',
          'others',
          'default',
          'black',
          'textGreen',
          'warnText',
          'greyText',
          'blackWarn',
          'greyMain',
        ]"
      >
        <global-ts-button
          icon="icon-icon-11"
          :type="type"
          :size="size"
          class="test"
          iconPosition="right"
          @click="handleFun"
          :disabled="disabled"
          :key="`button-icon-${size}-${type}`"
          :loading="loading"
        >
          选择文件
        </global-ts-button>
        <br v-if="index % 8 === 0" :key="`button-icon-key-${size}-${type}`" />
      </template>
    </template>

    <br />
    <br />

    <template v-for="size in ['medium', 'small', 'mini']">
      <template
        v-for="(type, index) in [
          'primary',
          'mainText',
          'greyOther',
          'others',
          'default',
          'black',
          'textGreen',
          'warnText',
          'greyText',
          'blackWarn',
          'greyMain',
        ]"
      >
        <global-ts-button-old
          icon="icon-icon-11"
          :type="type"
          :size="size"
          class="test"
          iconPosition="right"
          @click="handleFun"
          :disabled="disabled"
          :key="`old-button-icon-${size}-${type}`"
        >
          选择文件
        </global-ts-button-old>
        <br v-if="index % 8 === 0" :key="`old-button-icon-key-${size}-${type}`" />
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: 'test-button',
  components: {},
  props: {},
  data() {
    return {
      loading: false,
      disabled: false,
      iconDirection: 'left',
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleFun(e) {
      console.log('e', e);
    },
  },
};
</script>

<style lang="scss" scoped>
.test-button {
}
</style>
