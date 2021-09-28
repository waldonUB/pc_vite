<!--
 * @Description  : 商品列表
 * @Author       : turbo
 * @Date         : 2021-08-04 10:12:23
 * @LastEditors  : ADI
 * @LastEditTime : 2021-08-03 17:35:26
-->
<template>
  <div class="mallProductManage">
    <keep-alive include="manageProduct">
      <component :is="currentComponent" :isEdit="isEdit" :productId="productId"></component>
    </keep-alive>
  </div>
</template>

<script>
import manageProduct from './components/manage-product/index.vue';
import leadProduct from './components/lead-product/index.vue';
import controllerProduct from './components/controller-product/index.vue';

export default {
  name: 'mallProductManage',
  components: { manageProduct, leadProduct, controllerProduct },
  props: {},
  data() {
    return {
      currentComponent: 'manageProduct',
      isEdit: false, // 是否是编辑商品
      productId: -1, // 商品Id
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    changeComponets(targetComponent, isEdit = false, productId = -1) {
      this.isEdit = isEdit;
      this.productId = productId;
      this.currentComponent = targetComponent;
    },
  },
};
</script>

<style lang="scss">
.mallProductManage {
  height: 100%;
  a {
    font-size: 14px;
    font-weight: 400;
    color: #247af3;
    text-decoration: none;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  .tanshu-cardBox {
    .tanshu-cardBox-bottom {
      display: flex;
      flex: 1;
      justify-content: center;
    }
  }
  .productWrap {
    .productWrap-item {
      &.priceWrap {
        ::v-deep .el-input {
          width: auto;
        }
      }
    }
  }
  .mainColor {
    color: #247af3;
  }
  .avatar-uploader-icon {
    width: 125px;
    height: 125px;
    line-height: 125px;
  }
  .productList {
    .green {
      display: inline-block;
      width: 5px;
      height: 5px;
      vertical-align: middle;
      background: #247af3;
      border-radius: 50%;
    }
    .red {
      display: inline-block;
      width: 5px;
      height: 5px;
      vertical-align: middle;
      background: $error-color;
      border-radius: 50%;
    }
  }
}
.tooltipContent {
  max-width: 300px;
  line-height: 20px;
}

/* ueditor start */
.edui-editor iframe body {
  background-color: #ffffff !important;
}
.ts_lazy_load_img {
  width: 100%;
}
.edui-editor {
  position: relative;
  height: 450px;
  overflow: visible;
  background-color: #f4f4f4;
  border: 1px solid #cccccc;
}
#edui_fixedlayer input {
  height: 12px;
  margin: 0;
  font-size: 12px !important;
  line-height: 12px;
  border-color: #afb8c0;
  border-style: solid;
  border-width: 1px;
}
#edui_fixedlayer input[type='button'] {
  width: 80px;
  height: 24px;
  padding-left: 0;
  line-height: 24px;
  color: #000000;
  background: #ffffff;
  border: 1px solid #000000;
}
#tablewrapper_id label {
  float: left !important;
}
#tablewrapper_id input {
  float: left !important;
}
#edui_fixedlayer .tool4edit {
  z-index: 100;
}
#edui_fixedlayer .tool4edit div input {
  display: inline;
  width: 50px;
}
#edui_fixedlayer .tool4edit div .tool4edit-submit {
  width: 100px;
  margin-top: 10px;
}
#faiscoWebFileImage,
#faiscoWebFileImageSpan {
  display: none;
}
#edui-tool-a.edui-tool-a.edui-tool-content .edui-tool-line .edui-tool-input {
  height: 24px;
}

/* ueditor end */

@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .el-date-editor .el-range-separator {
    line-height: 32px;
  }
}
</style>
