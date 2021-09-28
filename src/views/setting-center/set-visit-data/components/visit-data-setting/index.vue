<!-- 获取访客数据设置
 * @Author       : ADI
 * @Date         : 2021-07-13 11:01:17
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-13 11:01:18
-->
<template>
  <div class="visitDataSetting">
    <div class="visitDataList">
      <el-table
        ref="tab"
        :data="visitDataList"
        border
        cell-class-name="cellStyle"
        header-row-class-name="employeeHeader"
        box-sizing="border-box"
      >
        <el-table-column label="触发场景" prop="name">
          <template slot-scope="scope">
            <div class="sceneBox">
              <div class="title">
                <span class="mr4">{{ scope.row.name }}</span>
                <global-ts-tool-tips effect="dark" popperClass="visitDataTitlteTip" v-if="scope.row.nameToolTip">
                  <div slot="content">
                    {{ scope.row.nameToolTip }}
                  </div>
                  <global-ts-svg-icon class="icon tanshu_color" name="icon-bianzu"></global-ts-svg-icon>
                </global-ts-tool-tips>
              </div>
              <el-popover
                placement="bottom-start"
                title=""
                trigger="hover"
                class="exampleBox"
                v-if="!scope.row.optDisabled"
              >
                <img
                  :src="
                    TsViewerConfParam[scope.row.authType.confKey] == 1
                      ? resRoot + scope.row.sampleImgs[0]
                      : resRoot + scope.row.sampleImgs[1]
                  "
                  style="width: 245px;"
                />
                <div slot="reference">
                  <div class="tanshu_color">查看示例</div>
                </div>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="授权信息" prop="authInfoList">
          <template #header>
            <span class="headerTitle">
              授权信息
            </span>
            <global-ts-tool-tips effect="dark" popperClass="visitDataTitlteTip">
              <div slot="content">
                1、同时勾选多种授权信息时，优先触发头像昵称授权，访客下次访问才触发手机号码授权； <br />
                2、如果访客授权过微信头像昵称，30天内不会再要求授权相同信息。
              </div>
              <global-ts-svg-icon class="icon ts-tabel-header-icon" name="icon-wenhao1616"></global-ts-svg-icon>
            </global-ts-tool-tips>
          </template>
          <template slot-scope="scope">
            <div class="authInfo visitCheckBox" v-for="(item, index) in scope.row.authInfoList" :key="index">
              <el-checkbox class="checkBox" v-model="TsViewerConfParam[item.confKey]" :disabled="isDisplayMode">{{
                item.name
              }}</el-checkbox>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template #header>
            <span class="headerTitle">
              类型
            </span>
            <global-ts-tool-tips effect="dark" popperClass="visitDataTitlteTip">
              <div slot="content">
                1. 引导授权：不授权也可进行下一步操作；<br />
                2. 必须授权：只有授权才能进行下一步操作。
              </div>
              <global-ts-svg-icon class="icon ts-tabel-header-icon" name="icon-wenhao1616"></global-ts-svg-icon>
            </global-ts-tool-tips>
          </template>
          <template slot-scope="scope">
            <div class="authType visitCheckBox">
              <input v-if="scope.row.optDisabled" disabled type="radio" class="radioBox" />
              <input
                v-else
                :disabled="isDisplayMode"
                :id="'guideAuth' + scope.$index"
                type="radio"
                class="radioBox"
                :value="1"
                v-model="TsViewerConfParam[scope.row.authType.confKey]"
              />
              <label :for="'guideAuth' + scope.$index">引导授权</label>
            </div>
            <div class="authType visitCheckBox">
              <input v-if="scope.row.optDisabled" disabled type="radio" class="radioBox" />
              <input
                v-else
                :disabled="isDisplayMode"
                :id="'mustAuth' + scope.$index"
                type="radio"
                class="radioBox"
                :value="2"
                v-model="TsViewerConfParam[scope.row.authType.confKey]"
              />
              <label :for="'mustAuth' + scope.$index">必须授权</label>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="触发时机">
          <template slot-scope="scope">
            <div v-if="scope.$index == 0">
              <div class="previewBox visitCheckBox">
                <input v-if="scope.row.optDisabled" disabled type="radio" class="radioBox" />
                <input
                  v-else
                  :disabled="isDisplayMode"
                  id="firstPre"
                  type="radio"
                  class="radioBox"
                  :value="1"
                  v-model="TsViewerConfParam[scope.row.isFirstPreview.confKey]"
                />
                <label for="firstPre">首次浏览</label>
              </div>
              <div class="previewBox visitCheckBox">
                <input v-if="scope.row.optDisabled" disabled type="radio" class="radioBox" />
                <input
                  v-else
                  :disabled="isDisplayMode"
                  id="nonFirstPre"
                  type="radio"
                  class="radioBox"
                  :value="2"
                  v-model="TsViewerConfParam[scope.row.isFirstPreview.confKey]"
                />
                <label for="nonFirstPre">非首次浏览</label>
              </div>
            </div>
            <div v-if="scope.$index == 1">
              访客进入超过
              <global-ts-input
                :disabled="isDisplayMode || scope.row.optDisabled"
                class="secondBox"
                :min="0"
                :max="99"
                placeholder=""
                limitInput="int"
                tstype="text"
                v-model="TsViewerConfParam[scope.row.seconds.confKey]"
                size="small"
              ></global-ts-input>
              秒弹出欢迎语
            </div>
            <div v-if="scope.$index == 2 || scope.$index == 3">
              首次点击按钮
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="visitDataBottom">
      <global-ts-button
        class="visitDataBtn"
        global-ts-button
        slot="button"
        type="primary"
        size="medium"
        @click="changeMode"
        >{{ btnText }}
      </global-ts-button>
    </div>
  </div>
</template>

<script>
import { Popover, Checkbox } from 'element-ui';
import { getTsViewerConf, saveTsViewerConfForWxAuth } from '@/api/modules/views/setting-center/set-visit-data';

export default {
  name: 'visit-data-setting',
  components: {
    [Popover.name]: Popover,
    [Checkbox.name]: Checkbox,
  },
  props: {},
  data() {
    return {
      // currentTemp: 'visitDataList',
      visitDataList: [
        {
          name: '浏览文章/名片/商品/表单/文件/视频',
          sampleImgs: [
            // 示例图片
            '/image/visitData/base_guide.png',
            '/image/visitData/base_must.png',
          ], // 示例图片
          authInfoList: [
            // 授权信息
            {
              name: '微信头像昵称',
              confKey: 'isOpenBaseAuthUserInfo', // 对应的TsViewerConfParam对象中的key
            },
          ],
          authType: {
            // 类型 是否为引导
            confKey: 'baseAuthType', // 对应的TsViewerConfParam对象中的key
          },
          isFirstPreview: {
            // 触发时机
            confKey: 'baseAuthTrigger',
          }, // 是否首次预览
          optDisabled: false, // 其他按钮选项是否置灰不可操作，当没有勾选任何授权信息时，则置灰不可操作
        },
        {
          name: '欢迎语弹窗（仅名片）',
          // tooltip: '',
          sampleImgs: ['/image/visitData/imTip_guide.png', '/image/visitData/imTip_must.png'],
          authInfoList: [
            // 授权信息
            {
              name: '微信头像昵称',
              confKey: 'isOpenImTipAuthUserInfo',
            },
            {
              name: '手机号码',
              confKey: 'isOpenImTipAuthMobile',
            },
          ],
          authType: {
            // 类型
            confKey: 'imTipAuthType',
          },
          seconds: {
            confKey: 'imTipAuthDelay',
          },
          optDisabled: false, // 其他按钮选项是否置灰不可操作，当没有勾选任何授权信息时，则置灰不可操作
        },
        {
          name: '点击聊一聊按钮',
          nameToolTip: 'H5文章暂不支持该授权',
          sampleImgs: ['/image/visitData/imBtn.png', '/image/visitData/imBtn.png'],
          authInfoList: [
            // 授权信息
            {
              name: '微信头像昵称',
              confKey: 'isOpenImBtnAuthUserInfo',
            },
            {
              name: '手机号码',
              confKey: 'isOpenImBtnAuthMobile',
            },
          ],
          authType: {
            // 类型
            // disabled: true, // 类型选项是否置灰不可操作，当没有勾选任何授权信息时，则置灰不可操作
            confKey: 'imBtnAuthType',
          },
          optDisabled: false, // 其他按钮选项是否置灰不可操作，当没有勾选任何授权信息时，则置灰不可操作
        },
        {
          name: '点击打电话、加微信按钮',
          nameToolTip: 'H5文章暂不支持该授权',
          sampleImgs: ['/image/visitData/imBtn.png', '/image/visitData/imBtn.png'],
          authInfoList: [
            // 授权信息
            {
              name: '微信头像昵称',
              confKey: 'isOpenWxMobileBtnAuthUserInfo',
            },
            {
              name: '手机号码',
              confKey: 'isOpenWxMobileBtnAuthMobile',
            },
          ],
          authType: {
            // 类型
            // disabled: true, // 类型选项是否置灰不可操作，当没有勾选任何授权信息时，则置灰不可操作
            confKey: 'mobileWxAuthType',
          },
          optDisabled: false, // 其他按钮选项是否置灰不可操作，当没有勾选任何授权信息时，则置灰不可操作
        },
      ],
      TsViewerConfParam: {
        // 授权数据，用于获取和保存
        baseAuthType: 0, // 基础授权类型（浏览名片\文章\表单\文件\视频) 1:引导授权 2:必须授权
        imTipAuthType: 0, // im欢迎语弹窗授权类型 1:引导授权 2:必须授权
        imBtnAuthType: 0, // im聊一聊按钮授权类型 1:引导授权 2: 必须授权
        mobileWxAuthType: 0, //手机微信号授权 1：引导授权 2：必须授权
        baseAuthTrigger: 0, // 基础授权触发时机 1: 首次浏览 2: 非首次浏览
        imTipAuthDelay: 0, // im欢迎语弹窗触发延迟时间
        isOpenBaseAuthUserInfo: false, // 是否开启基础功能的显式授权（浏览名片\文章\表单\文件\视频)
        isOpenImTipAuthUserInfo: false, // 是否开启IM欢迎语弹窗的显式授权
        isOpenImTipAuthMobile: false, // 是否开启IM欢迎语弹窗的手机号授权
        isOpenImBtnAuthUserInfo: false, // 是否开启IM聊一聊按钮的显式授权
        isOpenImBtnAuthMobile: false, // 是否开启IM聊一聊按钮的手机号授权
        isOpenWxMobileBtnAuthUserInfo: false, //是否开启手机微信号授权的显式授权
        isOpenWxMobileBtnAuthMobile: false, //是否开启手机微信号授权的手机号授权
      },
      isDisplayMode: true, // 是否为展示态 true：展示态不可编辑 false:编辑态可编辑
    };
  },
  computed: {
    btnText() {
      // 按钮文案
      return this.isDisplayMode ? '编辑' : '保存';
    },
    resRoot() {
      return this.$store.state.globalData?.resRoot;
    },
  },
  watch: {
    /**
     * 监听设置选项变化，
     * @author lymn
     * @date 2020-12-01
     * @param {Boolean} param
     * @return {Boolean} return
     */
    TsViewerConfParam: {
      handler(newVal) {
        // 判断触发时机的秒数设置是否需要置为0
        // if (newVal.imTipAuthDelay == '') {
        //     this.TsViewerConfParam.imTipAuthDelay = 0
        // }

        // 判断选项按钮是否需要置灰
        this.visitDataList.forEach((item, index) => {
          const checkItems = item.authInfoList.filter(subItem => this.TsViewerConfParam[subItem.confKey]);
          if (checkItems.length) this.visitDataList[index].optDisabled = false;
          else this.visitDataList[index].optDisabled = true; // 没有勾选任何授权信息
        });
      },
      deep: true,
    },
  },
  created() {
    this.getTsViewerConf();
  },
  mounted() {},
  methods: {
    /**
     * 获取访客授权设置
     * @author lymn
     * @date 2020-11-30
     */
    async getTsViewerConf() {
      const [err, res] = await getTsViewerConf();
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      // this.TsViewerConfParam = {}
      const data = res.data;
      Object.keys(this.TsViewerConfParam).forEach(key => {
        this.TsViewerConfParam[key] = data[key];
      });
    },
    /**
     * 点击按钮修改状态
     * @author lymn
     * @date 2020-12-01
     * @param {Boolean} param
     * @return {Boolean} return
     */
    async changeMode() {
      if (this.isDisplayMode) {
        this.isDisplayMode = !this.isDisplayMode;
      } else {
        // 当前为编辑态，保存修改的数据
        await this.saveTsViewerConf();
        this.isDisplayMode = !this.isDisplayMode;
      }
    },
    /**
     * 保存设置
     * @author lymn
     * @date 2020-12-01
     * @param {Boolean} param
     * @return {Boolean} return
     */
    async saveTsViewerConf() {
      const [err, res] = await saveTsViewerConfForWxAuth(this.TsViewerConfParam);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '系统错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      if (this.TsViewerConfParam.imTipAuthDelay == '') {
        // 欢迎语弹窗时间若没设置，则重置为0
        this.TsViewerConfParam.imTipAuthDelay = 0;
      }
      this.$utils.postMessage({
        type: 'success',
        message: '保存成功！',
      });
      return Promise.resolve();
    },
  },
};
</script>

<style lang="scss" scoped>
.visitDataSetting {
  height: calc(100% - 54px);
  box-sizing: border-box;
  .visitDataList {
    padding: 20px;
    .pro_listBox {
      height: calc(100% - 54px);
    }
    .sceneBox {
      .exampleBox {
        display: inline-block;
        cursor: pointer;
      }
    }
    .secondBox {
      display: inline-block;
      width: 26px;
      min-width: 40px;
      text-align: center;
    }
    .visitCheckBox {
      display: inline-block;
      margin-right: 24px;
      &:last-child {
        margin-right: 0;
      }
      label {
        margin-right: 0;
      }
    }
    .radioBox {
      width: 16px;
      height: 16px;
    }
  }
}

.visitDataTitlteTip {
  line-height: 20px;
}

.visitDataBottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  padding-top: 30px;
  text-align: center;
  border-top: 1px solid #eeeeee;
  box-shadow: 0 1px 4px rgb(0 0 0 / 4%);
  box-sizing: border-box;
  .visitDataBtn {
    margin: 0 auto;
  }
}
</style>

<style lang="scss">
.visitDataSetting {
  .visitDataList {
    .secondBox {
      .el-input__inner {
        text-align: center;
      }
    }
  }
  .el-checkbox__input {
    &.is-disabled {
      & + span {
        &.el-checkbox__label {
          color: $color-53;
        }
      }
      .el-checkbox__inner {
        background-color: #e5e5e5;
      }
    }
    &.is-checked {
      .el-checkbox__inner {
        background-color: #247af3;
      }
    }
  }
  .el-table--enable-row-transition {
    .el-table__body {
      td {
        height: 70px;
      }
    }
  }
  input[type='radio'] {
    & + label {
      &::before {
        background: $color-ff;
      }
      &:hover {
        &::before {
          border: solid 1px #247af3;
        }
      }
    }
  }
  input[type='radio']:disabled {
    & + label {
      cursor: not-allowed;
      &::before {
        background: #e5e5e5;
      }
      &:hover {
        &::before {
          border: solid 1px $border-color;
        }
      }
    }
  }
}
</style>
