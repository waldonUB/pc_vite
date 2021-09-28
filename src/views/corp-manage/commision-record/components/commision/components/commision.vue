<!--
 * @Author       : ADI
 * @Date         : 2021-07-23 15:02:03
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-30 15:08:49
-->
<template>
  <div class="ts-commision" v-if="isShow">
    <global-ts-card-box :bottomTips="true">
      <template v-slot:card-box-head>
        <global-ts-tabguide @backToPrePage="backLast">
          <template v-slot:leftPart>佣金记录</template>
          <template v-slot:rightPart>佣金申请</template>
        </global-ts-tabguide>
      </template>
      <template v-slot:card-box-body>
        <div class="pro_listBox">
          <el-form label-position="right" label-width="140px">
            <el-form-item label="总佣金:">
              <span>{{ dataInfo.totalBkge }}</span>
            </el-form-item>
            <el-form-item label="已支付佣金:">
              <span>{{ dataInfo.payBkge }}</span>
            </el-form-item>
            <el-form-item label="未支付佣金:">
              <span>{{ dataInfo.notPayBkge }}</span>
            </el-form-item>
            <el-form-item label="已申请待支付佣金:">
              <span>{{ dataInfo.waitPayBkge }}</span>
            </el-form-item>
            <el-form-item label="剩余可申请佣金:">
              <span>{{ dataInfo.optBkge }}</span>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template v-slot:card-box-bottom>
        <global-ts-buttontips>
          <global-ts-button slot="button" type="primary" :disabled="isDisabled" @click="addBkge">
            佣金申请
          </global-ts-button>
          <span slot="buttonTips" v-if="isDisabled">剩余可申请佣金不超过 0 元将无法提交申请</span>
        </global-ts-buttontips>
      </template>
    </global-ts-card-box>
  </div>
</template>

<script>
import { confirm } from '@/utils';
import { Form, FormItem } from 'element-ui';
import { addBkgeRecord, getTsStaffBkgeStat } from '@/api/modules/views/corp-manage/commision-record';

export default {
  name: 'commision',
  components: {
    [Form.name]: Form,
    [FormItem.name]: FormItem,
  },
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  updated() {
    //被挂载的节点，需要重新渲染
    this.parent.payStatus.isShow = false;
    this.parent.payStatus = null;
  },
  created() {},
  mounted() {},
  methods: {
    //返回消费记录
    backLast() {
      this.isShow = false;
      this.parent.isShow = true;
      this.parent.isReload = true;
      this.dataInfo = {};
    },
    addBkge() {
      confirm('是否确认提交申请。', '佣金申请').then(async action => {
        const [err, res] = await addBkgeRecord();
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg,
          });
          return Promise.reject(err);
        }
        // 返回列表
        setTimeout(() => {
          window.location.reload(true);
        }, 1000);
      });
    },

    // 获取员工佣金信息
    async getTsStaffBkgeStat() {
      const [err, response] = await getTsStaffBkgeStat();
      if (err) {
        return Promise.reject(err);
      }
      this.dataInfo = response.data;
      if (this.dataInfo.optBkge > 1) {
        this.isDisabled = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.ts-commision {
  height: 100%;
  .pro_listBox {
    box-shadow: none;
  }
  .bottomBtn {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    width: 350px;
    height: 100px;
    margin: auto;
    text-align: center;
    justify-content: center;
    align-items: center;
  }
}
</style>

<style lang="scss">
.ts-commision {
  .pro_listBox {
    .el-form {
      width: 350px;
      margin: 0 auto;
    }
    .el-form-item__label {
      padding: 0 20px 0 0 !important;
    }
    .el-form-item {
      margin-bottom: 17px;
    }
  }
}
</style>
