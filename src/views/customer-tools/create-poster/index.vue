<!--
 * @Description  : 海报上传
 * @Author       : turbo
 * @Date         : 2021-03-30 16:41:27
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-25 14:56:03
-->

<template>
  <global-ts-card-box class="createPoster">
    <template #card-box-head>
      <global-ts-tabguide @backToPrePage="backManage">
        <template #leftPart>海报模板</template>
        <template #rightPart>海报上传</template>
      </global-ts-tabguide>
    </template>
    <template #card-box-body>
      <div class="createBody">
        <div class="leftPart">
          <div class="infoPart">
            <div class="titlePart">海报样式</div>
            <div class="stylePart">
              <global-ts-button
                class="styleItem"
                v-for="item in styleList"
                :key="item.id"
                :type="editAccountInfo.style == item.id ? 'primary' : 'others'"
                size="medium"
                ref="button"
                @click="changeType(item.id)"
                >{{ item.value }}
              </global-ts-button>
            </div>
          </div>
          <div class="infoPart">
            <div class="titlePart">上传图片</div>
            <el-upload
              :style="uploadBtnStyle"
              name="filedata"
              :class="['posterUploadBox', { hiddleElUpload: hiddleElUpload }]"
              :file-list="fileList"
              :limit="1"
              action=""
              :multiple="false"
              list-type="picture-card"
              :on-remove="removeCoverImage"
            >
              <div
                class="fileUploadSelect_pictureCardWrapper"
                slot="trigger"
                @click.stop="
                  () => {
                    tanshuFileSelectUploadVisible = true;
                  }
                "
              >
                <i class="el-icon-plus"></i>
              </div>
            </el-upload>

            <global-ts-file-select-upload-dialog
              :dialog-visible.sync="tanshuFileSelectUploadVisible"
              :limit-num="1"
              accept-type="img"
              @success="uploadSuccess"
            >
            </global-ts-file-select-upload-dialog>
          </div>
          <div class="infoPart">
            <div class="titlePart">海报名称</div>
            <fa-input
              class="posterTitle"
              placeholder="请输入海报标题"
              :maxLength="20"
              v-model="editAccountInfo.title"
              :showCount="true"
            >
            </fa-input>
          </div>
          <div class="infoPart" v-if="isManage">
            <div class="classifyBox" v-show="editAccountInfo.saveToTemp">
              <div class="titlePart flex justify-content_flex-justify">
                <div>海报分类</div>
                <div class="addClassifyBtn" @click="addClassify($event)">+创建分类</div>
              </div>
              <global-ts-select
                class="posterClassify"
                type="large"
                :selectkey="{ label: 'name', value: 'id' }"
                :list.sync="classifyList"
                :selectVal="editAccountInfo.groupId"
                placeholder="请创建分类"
                :disabled="classifyList.length === 0 ? 'disabled' : ''"
                :direction="'up'"
                v-model="editAccountInfo.groupId"
              >
              </global-ts-select>
            </div>
            <div class="posterTemplate">
              <el-checkbox v-model="editAccountInfo.saveToTemp">
                <span>同时保存到企业海报模板</span>
              </el-checkbox>
            </div>
          </div>
        </div>
        <div class="rightPart">
          <global-ts-phoneiframe :showFrame="false">
            <template #header>
              <span class="formTitle ellispsis">我的海报</span>
            </template>
            <div slot="content">
              <previewPoster :posterInfo="posterInfo" :index="editAccountInfo.style" :uploadImgUrl="tmpUploadUrl">
              </previewPoster>
            </div>
          </global-ts-phoneiframe>
        </div>
      </div>
      <ts-classify-bubble
        :param="initParam"
        :isShow.sync="showClassifyBubble"
        ref="classifyBubble"
        :httpurl="addClassifyUrl"
        :linkTarget="linkTarget"
        @submitSuccess="reloadClassify"
      >
      </ts-classify-bubble>
    </template>
    <template #card-box-bottom>
      <div class="bottomBtn">
        <global-ts-button class="em_add_emp" type="primary" size="medium" @click="save">保存 </global-ts-button>
      </div>
    </template>
  </global-ts-card-box>
</template>

<script>
import { Upload } from 'element-ui';
import previewPoster from './components/preview-poster/index.vue';
import TsCommDef from '@/config/ts-comm-def';
import { getUrL, loading, Draw } from '@/utils';
import { mapGetters, mapState } from 'vuex';
import { Checkbox } from 'element-ui';
import TsClassifyBubble from '@/components/base/ts-classify-bubble/index.vue';
import icon_companyIMG from '@/assets/image/createPoster/icon_company.jpg';
import icon_mobileIMG from '@/assets/image/createPoster/icon_mobile.jpg';
import {
  getTsGroupList,
  createPoster,
  getTmpPosterIdAndCardInfo,
  uploadTmpFile,
} from '@/api/modules/views/customer-tools/create-poster';

export default {
  name: 'CreatePoster',
  components: {
    [Upload.name]: Upload,
    [Checkbox.name]: Checkbox,
    previewPoster,
    TsClassifyBubble,
  },
  data() {
    return {
      uploadUrl: getUrL(`/ajax/upload_h.jsp?cmd=uploadTmpFile&folderType=${TsCommDef.FolderType.PERSON_SYS_POSTER}`), // 上传临时图片接口
      fileAcceptCal: '.jpg,.jpeg,.png,.JPG,.JPEG,.PNG', // 可接受图片类型
      // isHideUpload: false, // 是否隐藏图片上传按钮
      iframeUrl: '', // 预览地址
      classifyList: [], // 分类列表
      editAccountInfo: {
        // 用户编辑信息
        originUrl: '', // 用户上传的海报图
        tmpId: '', // 临时海报id
        style: 1, // 样式
        // style: 2, // 样式
        title: '', // 海报标题
        groupId: -1, // 海报分类
        url: '', // 上传的图片路径
        saveToTemp: true, // 是否保存到企业模板，非管理员不可以操作该项
      }, // 编辑
      styleList: [
        // 样式列表
        {
          id: 1,
          value: '样式一',
        },
        {
          id: 2,
          value: '样式二',
        },
        {
          id: 3,
          value: '样式三',
        },
      ],
      fileList: [],
      uploadBoxStyleDef: [
        {
          // 样式一上传图片按钮尺寸
          width: '210px',
          height: '306px',
        },
        {
          // 样式二、三上传图片按钮尺寸
          width: '210px',
          height: '375px',
        },
      ],
      showClassifyBubble: false, // 是否显示创建分类弹窗
      linkTarget: {}, // 创建分类弹窗目标位置信息 {target: '相对位置元素', position: '相对位置'}
      initParam: {
        // 添加分类时调用接口额外传的参
        type: 11,
      },
      addClassifyUrl: '/ajax/comm/tsGroup_h.jsp?cmd=addTsGroup', // 添加分类的请求路径
      posterInfo: {},
      tmpUploadUrl: '', // 上传的图片
      posterCanvas: null,
      toUrltimeWaiter: null, // 定时器
      canvasToUrlErr: false, // canvas转为图片错误
      canvasCtx: null, // cancas绘制上下文对象
      canvasDraw: null, // draw对象
      tanshuFileSelectUploadVisible: false,
      canvasSymbol: 0, // 每次绘制canvas的标识
    };
  },
  computed: {
    ...mapGetters({
      isManage: 'user/isManage',
    }),
    ...mapState({
      isTest: state => state.user?.info?.isTest,
    }),
    uploadBtnStyle() {
      // 上传图片按钮尺寸
      return this.editAccountInfo.style == 1 ? this.uploadBoxStyleDef[0] : this.uploadBoxStyleDef[1];
    },
    hiddleElUpload() {
      return this.fileList.length > 0;
    },
  },
  created() {
    this.getTmpposterId(); // 进入页面先获取临时海报id
    this.getClassifyList();
    this.posterCanvas = null;
    this.tmpUploadUrl = '';
    this.initCanvas();
  },
  methods: {
    /**
     * 获取企业海报分类列表
     * @author lymn
     * @date 2020-07-16
     */
    async getClassifyList() {
      const params = {
        type: 11,
        limit: 100,
      };
      const [err, res] = await getTsGroupList(params);
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '网络错误，请稍候重试',
        });
        return Promise.reject(err);
      }
      this.classifyList = res.data;
      if (this.classifyList.length > 0) {
        this.editAccountInfo.groupId = this.classifyList[0].id;
        if (this.classifyList.length > 1 && this.editAccountInfo.groupId == 0) {
          // 海报默认选中分类，如果第一个选项是未分类，则选择第二个选项
          this.editAccountInfo.groupId = this.classifyList[1].id;
        }
      }
    },
    /**
     * 创建分类
     * @author lymn
     * @date 2020-07-16
     * @param {Object} event 事件
     */
    addClassify(event) {
      this.linkTarget = {
        target: event.target,
        position: 'left,top',
      };
      this.showClassifyBubble = true;
    },
    /**
     * 返回父级页面
     * @author lymn
     * @date 2020-07-16
     */
    backManage() {
      let typeId = 3;
      if (this.isManage && this.editAccountInfo.saveToTemp) {
        // 管理员选中了“保存到企业海报”
        typeId = 2;
      }
      this.$router.push({
        path: '/posterManage',
        query: { typeId },
      });
    },
    /**
     * 切换样式
     * @author lymn
     * @param {Int} id 样式id
     * @date 2020-07-16
     */
    changeType(id) {
      this.editAccountInfo.style = id;
      this.editAccountInfo.url = ''; // 避免新的样式还没绘制完就保存了
      this.drawPoster();
    },
    /**
     * 上传前校验
     * @author guoyijie
     * @date 2020-05-20
     * @param { object} file
     * @returns {Boolean} 是否通过校验
     */
    beforeUpload(file) {
      if (file.name && file.name.includes('.')) {
        const fileNames = file.name.split('.');
        const suffixName = fileNames[fileNames.length - 1];
        if (!this.fileAcceptCal.includes(suffixName)) {
          this.$utils.postMessage({
            type: 'error',
            message: '上传失败：格式错误，请上传jpg、png格式的图片',
          });
          return false;
        }
        const limitSize = file.size / 1024 / 1024;
        if (limitSize > 1) {
          this.$utils.postMessage({
            type: 'error',
            message: '上传失败：单个文件的大小超过1M',
          });
          return false;
        }
        // this.isHideUpload = true;
      } else {
        this.$utils.postMessage({
          type: 'error',
          message: '上传失败',
        });
        return false;
      }
    },
    /**
     * 初始化画布绘制上下文
     * @author lymn
     * @date 2020-07-16
     */
    initCanvas() {
      this.canvasDraw = new Draw();
      const canvasW = 720;
      const canvasH = 1280;
      this.canvasCtx = this.canvasDraw.createCanvas(canvasW, canvasH, false); // 传第三个参数为false,不处理设备像素比问题,原因:如果处理设备像素比,后端绘制企业海报也要处理这个问题,导致前后端海报逻辑藕合较多
    },
    /**
     * 用canvas绘制个人海报
     * @author lymn
     * @param {String} url 图片地址
     * @param {Number0} canvasSymbol 当前的绘制唯一标识
     * @date 2020-07-16
     */
    async drawPoster(url) {
      url = url || this.tmpUploadUrl;
      if (!url) {
        return;
      }
      const canvasSymbol = ++this.canvasSymbol; // 当前的绘制唯一标识
      // 要删除原本存在的canvas，防止绘制出错
      // let prevCanavs = document.getElementsByTagName('canvas') // lymn todo改为类名删除
      const prevCanavs = document.getElementsByClassName('createElementCanvas'); // lymn todo改为类名删除
      const len = prevCanavs.length;
      for (let i = 0; i < len; i++) {
        document.body.removeChild(prevCanavs[0]);
      }

      const drawInstance = new Draw();
      const canvasW = 720;
      const canvasH = 1280;
      const ctx = drawInstance.createCanvas(canvasW, canvasH, false);
      ctx.clearRect(0, 0, canvasW, canvasH);

      // 绘制背景
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvasW, canvasH);
      console.log('绘制背景矩形');

      // 绘制海报
      let imgW;
      let imgH;
      if (this.editAccountInfo.style == 1) {
        imgW = 720;
        imgH = 1044;
      } else {
        imgW = 720;
        imgH = 1280;
      }
      await drawInstance.drawImage(url, ctx, 0, 0, imgW, imgH);

      // 边框
      // ctx.rect(10 * 2, 9 * 2, 210 * 2, 374 * 2);
      // ctx.lineWidth = 2; //若是给定了值就用给定的值否则给予默认值2
      // ctx.strokeStyle = "#F7F7F7";
      // ctx.stroke();
      // console.log('绘制边框');

      // 文字
      if (this.editAccountInfo.style == 1) {
        ctx.font = '47px bolder 微软雅黑';
        // 设置颜色
        ctx.fillStyle = '#535353';
        // 设置水平对齐方式
        ctx.textAlign = 'start';
        // 设置垂直对齐方式
        ctx.textBaseline = 'top';
        // 绘制文字（参数：要写的字，x坐标，y坐标）
        drawInstance.drawTextInArea(ctx, this.posterInfo.name + ' ' + this.posterInfo.position, 405, 41, 1072); // 姓名 职位

        ctx.font = '33px bolder 微软雅黑';
        ctx.fillStyle = '#B2B2B2';
        drawInstance.drawTextInArea(ctx, this.posterInfo.company || '公司', 363, 104, 1146); // 公司
        ctx.fillText(this.posterInfo.mobile || '电话', 104, 1212); // 电话
        console.log('绘制图片');
      }

      // icon
      if (this.editAccountInfo.style == 1) {
        const companyIconSrc = icon_companyIMG;
        await drawInstance.drawImage(companyIconSrc, ctx, 45, 1141, 41, 39, false).catch(e => {
          console.log('e', e);
        });
        const mobileIconSrc = icon_mobileIMG;
        await drawInstance.drawImage(mobileIconSrc, ctx, 45, 1208, 40, 42, false).catch(e => {
          console.log('e', e);
        });
        console.log('绘制icon');
      }

      // 二维码
      let shareCode_l;
      let shareCode_t;
      if (this.editAccountInfo.style == 1 || this.editAccountInfo.style == 2) {
        shareCode_l = 501;
        shareCode_t = 1071;
      } else {
        shareCode_l = 271;
        shareCode_t = 1071;
      }
      // 如果 测试 || 企微二维码  不画圆
      this.isTest || this.posterInfo.isUserWxWork
        ? await drawInstance.drawImage(this.posterInfo.shareQrUrl, ctx, shareCode_l, shareCode_t, 180, 180)
        : await drawInstance.drawArcImg(ctx, this.posterInfo.shareQrUrl, 89, shareCode_l, shareCode_t);
      const posterCanvas = drawInstance.getCanvas();
      console.log('posterCanvas', posterCanvas);
      await this.canvasToUrl(posterCanvas, canvasSymbol);
    },
    /**
     * canvas转为图片并获取临时url
     * @author lymn
     * @date 2020-07-16
     * @param {Object} canvas 画布
     * @param {Number} symbol 当前绘制的唯一标识,解决多次异步绘制,样式错乱问题;正确方法应该是拿最后一次绘制的图
     * @returns {Promise}
     */
    canvasToUrl(canvas, symbol) {
      const that = this;
      return canvas.toBlob(async blob => {
        //使用ajax发送
        const fd = new FormData();
        const name = 'img.png';
        fd.append('filedata', blob, name);
        const [err, res] = await uploadTmpFile(fd);
        if (err || !that.tmpUploadUrl) {
          that.canvasToUrlErr = true;
          this.$utils.postMessage({
            type: 'error',
            message: err.msg || '网络错误，请稍候重试',
          });
          return Promise.reject(err);
        }
        if (this.canvasSymbol == symbol) {
          // 判断是不是最后一次图片绘制
          that.editAccountInfo.url = res.data.path;
        }
        return Promise.resolve();
      });
    },
    /**
     * 完成上传的回调
     * @author lymn
     * @date 2020-07-16
     * @param {Object} res 上传成功返回的对象
     */
    uploadSuccess(res) {
      const file = res[0];
      this.tmpUploadUrl = file.content;
      this.drawPoster(this.tmpUploadUrl, this.canvasSymbol);
      this.$set(this.fileList, 0, {
        name: file.name,
        url: file.content,
      });
    },
    /**
     * 移除海报图
     * @author lymn
     * @date 2020-07-16
     */
    removeCoverImage() {
      this.fileList = [];
      // this.isHideUpload = false;
      this.editAccountInfo.url = '';
      this.tmpUploadUrl = '';
    },
    /**
     * 检查信息是否填写完整
     * @author lymn
     * @date 2020-07-16
     * @returns {Boolean} 是否填写完整
     */
    checkSubmit() {
      // 判断数据是否填写完整
      let errorTip = '';
      if (!this.tmpUploadUrl) {
        // 没上传图片
        errorTip = '图片未上传，保存失败';
      } else if (!this.editAccountInfo.title) {
        // 没填写标题
        errorTip = '海报名称未填写，保存失败';
      }
      if (errorTip) {
        this.$utils.postMessage({
          type: 'error',
          message: errorTip,
        });
        return false;
      } else {
        return true;
      }
    },
    /**
     * 保存
     * @author lymn
     * @date 2020-07-16
     */
    async save() {
      const that = this;
      const waitKey = 'waitCanvasToUrl';
      if (!this.isManage) {
        // 非管理员不可选择保存到企业海报
        this.editAccountInfo.saveToTemp = false;
      }
      if (!this.editAccountInfo.saveToTemp) {
        // 没有选择保存到企业海报模板的情况下，去掉groupId属性
        delete this.editAccountInfo.groupId;
      }
      if (this.toUrltimeWaiter) {
        // 如果有定时器，先清除，避免绘制完出现多个定时任务的情况
        clearTimeout(this.toUrltimeWaiter);
        this.toUrltimeWaiter = null;
      }

      // 保存时 新增字段- 用户上传海报原图
      this.editAccountInfo.originUrl = this.tmpUploadUrl;

      if (this.checkSubmit()) {
        // 图片还未绘制完成的情况, 等待两秒后再请求
        if (!loading.getQuene(waitKey)) {
          console.log('显示loading弹窗');
          loading.addQuene({
            // 显示加载动画
            key: waitKey,
            loadingType: 'waitSave',
            waitTime: 0,
          });
        }
        if (this.editAccountInfo.url) {
          // 图片已经绘制完毕且转为url
          const [err, res] = await createPoster(this.editAccountInfo);
          loading.poupQuene(waitKey); // 清除加载动画
          if (err) {
            this.$utils.postMessage({
              type: 'error',
              message: err.msg || '网络错误，请稍候重试',
            });
            return Promise.reject(err);
          }
          this.$utils.ActLog('ADD_CARD_POSTER');
          that.backManage();
        } else if (this.canvasToUrlErr) {
          // canvas转图片过程中报错了
          loading.poupQuene(waitKey); // 清除加载动画
          this.$utils.postMessage({
            type: 'error',
            message: '网络错误，请刷新重试',
          });
        } else {
          this.toUrltimeWaiter = setTimeout(() => {
            this.save();
          }, 2000); // 两秒后重新请求
        }
      }
    },
    /**
     * 保存到企业海报模板
     * @author lymn
     * @date 2020-07-16
     */
    saveToTemplate() {
      this.editAccountInfo.saveToTemp = true;
    },
    /**
     * 获取临时海报id
     * @author lymn
     * @date 2020-07-16
     */
    async getTmpposterId() {
      const [err, res] = await getTmpPosterIdAndCardInfo({ ts_hideLoading: true });
      if (err) {
        this.$utils.postMessage({
          type: 'error',
          message: err.msg || '请刷新页面后重新进入',
        });
        return Promise.reject(err);
      }
      this.editAccountInfo.tmpId = res.data.id;
      this.posterInfo = res.data;
    },
    /**
     * 重新加载分类列表
     * @author lymn
     * @date 2020-07-16
     */
    reloadClassify() {
      this.getClassifyList();
    },
  },
};
</script>

<style lang="scss" scoped>
.createPoster {
  .createBody {
    display: flex;
    flex: 2;
  }
  .tshu-bubble {
    position: fixed;
    transform: translate(170px, 68px);
  }
  .leftPart {
    width: calc(100% - 650px);
    min-width: 650px;
    margin: 22px 0 22px 20px;
    .infoPart {
      margin-bottom: 22px;
    }
    .titlePart {
      width: 576px;
      margin-bottom: 10px;
      font-size: 14px;
      color: $color-53;
      .addClassifyBtn {
        color: #247af3;
        cursor: pointer;
      }
    }
    .global-button {
      &.global-button-size-medium {
        width: 74px;
        height: 34px;
        min-width: 74px;
        padding: 0;
        margin-left: 0;
        line-height: 34px;
      }
    }
    .styleItem {
      border-radius: 0;
      box-sizing: border-box;
      &:first-child {
        border-radius: 4px 0 0 4px;
      }
      &:last-child {
        border-radius: 0 4px 4px 0;
      }
    }
    .posterTemplate {
      margin-top: 10px;
    }
  }
}

.createPoster .leftPart .posterTitle,
.createPoster .leftPart .posterClassify {
  width: 576px;
}
</style>

<style lang="scss">
.createPoster {
  .hiddleElUpload {
    .el-upload {
      &.el-upload--picture-card {
        display: none;
      }
    }
  }
  .posterUploadBox {
    overflow: hidden;
    &.disabled {
      .el-upload--picture-card {
        display: none;
      }
    }
  }
  .el-upload--picture-card {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    i {
      font-size: 36px;
    }
  }
  .el-upload-list--picture-card {
    .el-upload-list__item {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
