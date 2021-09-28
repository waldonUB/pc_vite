<!--
 * @Author       : ADI
 * @Date         : 2021-05-10 15:57:07
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-22 15:31:57
-->
<template>
  <div class="test-edit">
    <div id="content" ref="content"></div>
    <global-ts-file-select-upload-dialog
      :dialog-visible.sync="editFileSelectUploadConfig.visible"
      :limit-num="editFileSelectUploadConfig.limitNum"
      :accept-type="editFileSelectUploadConfig.acceptType"
      @success="handleEditFileSelectUploadSuccess"
    >
    </global-ts-file-select-upload-dialog>
  </div>
</template>

<script>
import { initEdit } from '@/utils/ueditor-config';
import { getFileSelectUploadDialogIcon } from '@/utils';
import importJsCss from 'import-js-css';

export default {
  name: 'test-edit',
  components: {},
  props: {},
  data() {
    return {
      productData: {
        id: 3,
        name: '0101',
        summary: '0101',
        priceType: 1,
        price: '0.00',
        selfStatus: 0,
        details:
          '<p style="line-height:1.5em;"><img src="//9890796.s144i.aaadns.com/4/AJABCAAQBBgAIJeNzIEGKPzQv5kD.png" alt="yx.png" /></p>',
        coverImgUrl: '//9890796.s144i.aaadns.com/2/AJABCAAQAhgAINzp0YEGKOCwoaoD.jpg',
      },
      folderType: 10,
      editFileSelectUploadConfig: { visible: false, acceptType: 'img', limitNum: 10 },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.loading();
  },
  methods: {
    loading() {
      const mergePath = uri => `${this.$utils.host}/${uri}`;
      const scriptUriList = ['js/jquery-core.src.js', 'js/comm/ueditor/ueditor.src.js'].map(uri => mergePath(uri));
      const linkUriList = [
        // 'css/comm/ueditor/mp.src.css',
        'css/comm/ueditor/ueditor.src.css',
      ].map(uri => mergePath(uri));
      importJsCss('ueditor', {
        ueditor: {
          script: scriptUriList,
          link: linkUriList,
        },
      }).then(res => {
        console.log('window.$, window.UE', window.$, window.UE);
        console.log('loading');
        // 小程序不支持视频，因此前端去掉视频，后端过滤视频/音频
        const editStyle =
          '.ts_lazy_load_img{max-width:100%;}video,audio,iframe[src^="https://v.qq.com/"]{display:none !important;}'; // 编辑器内部样式拓展
        initEdit(true, this.productData.details, 'content', editStyle, 'folderType=' + this.folderType, {
          toolbars: [
            [
              // 代表当前编辑器可以使用的功能列表 可查看http://www.aaa.cn/tmp/UEditor1.0-doc/
              'removeformat',
              'pasteplain',
              '|',
              'bold',
              'italic',
              'underline',
              '|',
              'fontsize',
              'forecolor',
              'backcolor',
              '|',
              'insertorderedlist',
              'lineheight',
              'indent',
              'justify',
              '|',
              'tsimg',
              'inserttable',
              'link',
              'unlink',
              '|',
              'source',
              'fullscreen',
            ],
          ],
        }).then(editor => {
          window.editor = this.editor = editor;
          this.editor.addListener('keydown keyup mouseup mousedown onchange', () => {
            this.productData.details = this.editor.getContent && this.editor.getContent(); // 获取编辑器的内容
          });
          this.timer = setInterval(() => {
            this.productData.details = this.editor.getContent();
          }, 500);
          this.editor.addListener('tsInsertEvent', (eventName, insertType) => {
            console.log('insertType--->', insertType);
            this.editFileSelectUploadConfig.visible = true;
            const acceptType = insertType.slice(2) || 'img';
            this.editFileSelectUploadConfig.acceptType = acceptType;
          });
        });
      });
    },
    handleEditFileSelectUploadSuccess(files = []) {
      const selectTypeMap = {
        图片: 'tsImg',
        视频: 'tsVideo',
        文档: 'tsDoc',
      };
      files.forEach(file => {
        const selectObj = Object.assign({}, file);
        const categoryName = file.categoryName;
        const selectType = selectTypeMap[categoryName] || '';
        selectObj.selectType = selectType;
        selectObj.coverImgUrl = selectObj.coverImgUrl || getFileSelectUploadDialogIcon(file); // 默认icon
        const insertArtitleHtml = this.editor.getTsInsertModel(selectObj.selectType, selectObj);
        this.editor.ready(() => {
          this.editor.execCommand('inserthtml', insertArtitleHtml); // 常见的api可查看 - http://fex.baidu.com/ueditor/#api-common
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.test-edit {
}
</style>
