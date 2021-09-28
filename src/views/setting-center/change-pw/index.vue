<!--
 * @Description  : 修改密码
 * @Author       : turbo
 * @Date         : 2021-03-30 15:49:41
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-07 15:12:10
-->

<template>
  <div class="changePW">
    <global-ts-card-box>
      <template v-slot:card-box-head>
        <global-ts-header class="header_changepw">
          <template v-slot:leftPart>修改密码</template>
        </global-ts-header>
      </template>
      <template v-slot:card-box-body>
        <div class="passwordSet">
          <fa-form-model ref="linkEditRuleForm" layout="vertical" :model="formData" :rules="rules">
            <fa-form-model-item label="旧密码" prop="oldpwd">
              <global-ts-input type="password" v-model="formData.oldpwd" placeholder="请输入旧密码"> </global-ts-input>
              <div class="tshuPwdCheck" :class="'nowLevel' + levelInfo[0].level" v-if="levelInfo[0].isShow">
                <div v-for="(item, index) in levelList" :key="index">{{ item.label }}</div>
              </div>
            </fa-form-model-item>

            <fa-form-model-item label="新密码" prop="newpwd">
              <global-ts-input
                class="newPasswordSet"
                :class="levelInfo[1].isShow ? 'hasShowLevel' : ''"
                type="password"
                v-model="formData.newpwd"
                placeholder="请输入新密码"
              >
              </global-ts-input>
              <div class="tshuPwdCheck" :class="'nowLevel' + levelInfo[1].level" v-if="levelInfo[1].isShow">
                <div v-for="(item, index) in levelList" :key="index">{{ item.label }}</div>
              </div>
            </fa-form-model-item>

            <fa-form-model-item label="确认新密码" prop="newpwd$">
              <global-ts-input type="password" v-model="formData.newpwd$" placeholder="请再次输入新密码">
              </global-ts-input>
              <div class="tshuPwdCheck" :class="'nowLevel' + levelInfo[2].level" v-if="levelInfo[2].isShow">
                <div v-for="(item, index) in levelList" :key="index">{{ item.label }}</div>
              </div>
            </fa-form-model-item>
          </fa-form-model>
        </div>
      </template>
      <template v-slot:card-box-bottom>
        <div class="saveButton">
          <global-ts-button type="primary" size="medium" @click="savePwd">
            保存
          </global-ts-button>
        </div>
      </template>
    </global-ts-card-box>
  </div>
</template>

<script>
import { manageRegxp, post, md5 } from '@/utils';
import { setPwd } from '@/api/modules/views/setting-center/change-pw';

const validatorNewpwd = (rule, value, callback) => {
  const reg = manageRegxp(2);
  if (!reg.test(value)) {
    callback(new Error('密码强度过于简单，请重新设置'));
  } else {
    callback();
  }
};

export default {
  name: 'changePW',
  components: {},
  props: {},
  data() {
    return {
      formData: {
        oldpwd: '',
        newpwd: '',
        newpwd$: '',
      },
      levelInfo: [
        {
          level: 1,
          isShow: false,
        },
        {
          level: 1,
          isShow: false,
        },
        {
          level: 1,
          isShow: false,
        },
      ],
      levelList: [
        {
          index: 1,
          label: '弱',
        },
        {
          index: 2,
          label: '中',
        },
        {
          index: 3,
          label: '强',
        },
      ],
    };
  },
  computed: {
    rules() {
      const passwordLengthLimtTip = '密码由6-20位字符组成，区分大小写';
      return {
        oldpwd: [
          { required: true, message: '请输入旧密码', trigger: 'change' },
          { min: 6, max: 20, message: passwordLengthLimtTip, trigger: 'change' },
        ],
        newpwd: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, max: 20, message: passwordLengthLimtTip, trigger: 'change' },
          {
            validator: validatorNewpwd,
            trigger: 'change',
          },
        ],
        newpwd$: [
          { required: true, message: '请输入确认密码', trigger: 'change' },
          { min: 6, max: 20, message: passwordLengthLimtTip, trigger: 'change' },
          {
            validator: this.validatorNewpwd$,
            trigger: 'change',
          },
        ],
      };
    },
  },
  watch: {
    ['formData.newpwd'](value) {
      this.wacthLevel(value, 1);
    },
  },
  created() {
    this.$utils.logDog('showChangePW');
  },
  mounted() {},
  methods: {
    savePwd() {
      this.$refs.linkEditRuleForm.validate(async valid => {
        if (!valid) {
          // 检查是否有错误
          return;
        }
        const Param = {
          oldPwd: md5(this.formData.oldpwd),
          newPwd: md5(this.formData.newpwd),
        };
        const [err, res] = await setPwd(Param);
        if (err) {
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '系统错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        this.$utils.logDog('changePw_savePwd');
        this.$utils.postMessage({
          type: 'success',
          message: '修改成功！',
        });
      });
    },
    wacthLevel(value, index) {
      const levelInfo = this.levelInfo[index];
      levelInfo.isShow = value.length > 0;
      const checkPassWord = function(checkVal) {
        let modes = 0;
        if (/\d/.test(checkVal)) {
          //如果用户输入的密码 包含了数字
          modes++;
        }
        if (/[a-z]|[A-Z]/.test(checkVal)) {
          //如果用户输入的密码 包含了小写的a到z
          modes++;
        }
        if (/\W/.test(checkVal)) {
          //如果是非数字 字母 下划线
          modes++;
        }
        return modes;
      };
      levelInfo.level = checkPassWord(value);
    },
    validatorNewpwd$(rule, value, callback) {
      if (this.formData.newpwd === value) {
        callback();
      } else {
        callback(new Error('密码与确认密码不一致'));
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.changePW {
  height: 100%;
  .title {
    font-size: 16px;
    font-weight: bold;
    color: $color-00;
  }
  .passwordSet {
    width: 350px;
    padding-top: 40px;
    margin-left: 20px;
  }
  .saveButton {
    text-align: center;
    .global-button {
      margin: 0 auto;
    }
  }
  .tshuPwdCheck {
    width: 100%;
    height: 20px;
    margin-top: 8px;
    clear: both;
    & > div {
      float: left;
      width: 115px;
      height: 20px;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #b2b2b2;
      text-align: center;
      background: #eeeeee;
      &:nth-child(2) {
        margin: 0 2px;
      }
    }
    &.nowLevel1 {
      & > div {
        &:nth-child(1) {
          color: #ffffff;
          background: #ff4d4d;
        }
      }
    }
    &.nowLevel2 {
      & > div {
        &:nth-child(2) {
          color: #ffffff;
          background: #ffc96a;
        }
      }
    }
    &.nowLevel3 {
      & > div {
        &:nth-child(3) {
          color: #ffffff;
          background: #247af3;
        }
      }
    }
  }
}
</style>
