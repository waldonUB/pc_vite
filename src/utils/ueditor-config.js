/*
 * @Author: ADI
 * @Date: 2021-03-23 10:31:17
 * @LastEditors  : ADI
 * @LastEditTime : 2021-06-22 14:12:34
 */
/*
 * @description: 对ueditor创建的进行一层封装
 * @author: enson
 * @date: 2020-07-21 19:21:05
 */

import store from '@/store';

var $ = window.$;
// require('../../public/common/ueditor@1.0.0/ueditor.src');
// require('../../public/common/ueditor@1.0.0/ueditor.src.css');
const getStoreState = () => store.state;

export const insertEditorGlobalConfig = function(
  config = {
    toolbarsClass: {
      tsvideo: { id: 4, priority: '' },
      tsarticle: { id: 4, priority: '' },
      link: { id: 4, priority: '' },
      unlink: { id: 4, priority: '' },
      inserttable: { id: 4, priority: '' },
      tsimg: { id: 4, priority: '' },
    },
    labelMap: {
      tsarticle: '文章',
      tsvideo: '视频',
      tsdoc: '文档',
      tsform: '表单',
      tsproduct: '商品',
      tsimg: '图片',
    },
  },
) {
  const utils = window.baidu.editor.utils;
  const editorui = window.baidu.editor.ui;
  const tsUeditor = window.baidu.editor;
  const toolbarsClass = window.UEDITOR_CONFIG.toolbarsClass;
  let labelMap = window.UE.I18N['zh-cn']['labelMap'];
  const defaultConfig = {
    labelMap: {
      tsarticle: '文章',
      tsvideo: '视频',
      tsdoc: '文档',
      tsform: '表单',
      tsproduct: '商品',
      tsimg: '图片',
    },
  };
  config = Object.assign({}, defaultConfig, config);

  window.UEDITOR_CONFIG.toolbarsClass = Object.assign({}, toolbarsClass, config.toolbarsClass);
  labelMap = Object.assign({}, labelMap, config.labelMap);
  // ----------------------- 这里放相关的配置 --------------------------

  // ----------------------- 这里放ui组件 -------------------------
  // 插入文章
  editorui.tsarticle = function(editor) {
    const title = window.editor.options.labelMap['tsarticle'] || window.editor.getLang('labelMap.tsarticle') || '文章';
    const ui = new editorui.Button({
      showText: true,
      label: title,
      editor: editor,
      title: title,
      className: 'edui-for-tsarticle edui-for-commInsert',
      onclick: function() {
        window.editor.execCommand('tsinsert', editor, 'tsarticle');
      },
    });
    window.editor.addListener('selectionchange', function() {
      ui.setDisabled(editor.queryCommandState('tsarticle') == -1);
    });
    return ui;
  };

  // 插入商品
  editorui.tsproduct = function(editor) {
    const title = window.editor.options.labelMap['tsproduct'] || window.editor.getLang('labelMap.tsproduct') || '商品';
    const ui = new editorui.Button({
      showText: true,
      label: title,
      editor: editor,
      title: title,
      className: 'edui-for-tsproduct edui-for-commInsert',
      onclick: function() {
        window.editor.execCommand('tsinsert', editor, 'tsproduct');
      },
    });
    window.editor.addListener('selectionchange', function() {
      ui.setDisabled(editor.queryCommandState('tsproduct') == -1);
    });
    return ui;
  };

  // 插入表单
  editorui.tsform = function(editor) {
    const title = window.editor.options.labelMap['tsform'] || window.editor.getLang('labelMap.tsform') || '表单';
    const ui = new editorui.Button({
      showText: true,
      label: title,
      editor: editor,
      title: title,
      className: 'edui-for-tsform edui-for-commInsert',
      onclick: function() {
        window.editor.execCommand('tsinsert', editor, 'tsform');
      },
    });
    window.editor.addListener('selectionchange', function() {
      ui.setDisabled(editor.queryCommandState('tsform') == -1);
    });
    return ui;
  };

  // 插入视频
  editorui.tsvideo = function(editor) {
    const title = window.editor.options.labelMap['tsvideo'] || window.editor.getLang('labelMap.tsvideo') || '视频';
    const ui = new editorui.Button({
      showText: true,
      label: title,
      editor: editor,
      title: title,
      className: 'edui-for-tsvideo edui-for-commInsert',
      onclick: function() {
        window.editor.execCommand('tsinsert', editor, 'tsvideo');
      },
    });
    window.editor.addListener('selectionchange', function() {
      ui.setDisabled(editor.queryCommandState('tsvideo') == -1);
    });
    return ui;
  };

  // 插入文档
  editorui.tsdoc = function(editor) {
    const title = window.editor.options.labelMap['tsdoc'] || window.editor.getLang('labelMap.tsdoc') || '文档';
    const ui = new editorui.Button({
      showText: true,
      label: title,
      editor: editor,
      title: title,
      className: 'edui-for-tsdoc edui-for-commInsert',
      onclick: function() {
        window.editor.execCommand('tsinsert', editor, 'tsdoc');
      },
    });
    window.editor.addListener('selectionchange', function() {
      ui.setDisabled(editor.queryCommandState('tsdoc') == -1);
    });
    return ui;
  };

  // 插入图片
  editorui.tsimg = function(editor) {
    const title = window.editor.options.labelMap['tsimg'] || window.editor.getLang('labelMap.tsimg') || '图片';
    const ui = new editorui.Button({
      showText: true,
      label: title,
      editor: editor,
      title: title,
      className: 'edui-for-tsimg edui-for-commInsert',
      onclick: function() {
        window.editor.execCommand('tsinsert', editor, 'tsimg');
      },
    });
    window.editor.addListener('selectionchange', function() {
      ui.setDisabled(editor.queryCommandState('tsimg') == -1);
    });
    return ui;
  };

  // 插入link
  editorui.link = function(editor) {
    const title = '链接';
    var ui = new editorui.LinkSetButton({
      showText: true,
      label: title,
      editor: editor,
      title: title,
      className: 'edui-for-link',
      onbuttonclick: function() {
        window.editor.execCommand('link');
      },
    });
    window.editor.addListener('selectionchange', function() {
      ui.setDisabled(editor.queryCommandState('link') == -1);
    });
    return ui;
  };

  // 插入源代码
  editorui.source = function() {
    const title = window.editor.options.labelMap['source'] || window.editor.getLang('labelMap.source') || '源代码';
    var ui = new editorui.Button({
      className: 'edui-for-source',
      title: title,
      onclick: function() {
        window.editor.execCommand('source');
      },
      label: title,
      showText: false,
    });
    window.editor.addListener('selectionchange', function(type, causeByUi, uiReady) {
      var state = window.editor.queryCommandState('source');

      if (state == -1) {
        ui.setDisabled(true);
        ui.setChecked(false);
      } else {
        if (!uiReady) {
          ui.setDisabled(false);
          ui.setChecked(state);
        }
      }
    });
    return ui;
  };

  // 插入内嵌表格
  editorui.inserttable = function(editor, iframeUrl, title) {
    var iframeUrlMap = {
      insertimage: '/manage/fileUploadV2.jsp',
      inserttable: '~//js/comm/ueditor/dialogs/table/table.html',
      edittd: '~//js/comm/ueditor/dialogs/table/table.html',
    };
    iframeUrl = iframeUrl || (editor.options.iframeUrlMap || {})['inserttable'] || iframeUrlMap['inserttable'];
    var ueditorUrl = iframeUrl;
    title = window.editor.options.labelMap['inserttable'] || window.editor.getLang('labelMap.inserttable') || '';
    if (iframeUrl) {
      var dialog = new editorui.Dialog({
        iframeUrl: window.editor.ui.mapUrl(iframeUrl),
        editor: editor,
        className: 'edui-for-inserttable',
        title: title,
        getContentHtml: function() {
          var contentHtml = '';
          var iframeContent = '';
          if (typeof this.content == 'string') {
            contentHtml = this.content;
          } else if (this.iframeUrl) {
            contentHtml =
              '<span id="' +
              this.id +
              '_contmask" class="dialogcontmask"></span><div id="' +
              this.id +
              'divContetnt" ></div>';
            // '<iframe id="'+ this.id +'_iframe" class="%%-iframe" disabled=true height="100%" width="100%" frameborder="0"></iframe>';
          }

          return contentHtml;
        },
        reset: function() {
          this.getDom('content').innerHTML = this.getContentHtml();
        },
        open: function() {
          if (this.autoReset) {
            //有可能还没有渲染
            try {
              this.reset();
            } catch (e) {
              this.render();
              this.open();
            }
          }
          this.showAtCenter();
          if (this.iframeUrl) {
            try {
              this.getDom('iframe').focus();
            } catch (ex) {
              console.log('ex', ex);
            }
          }
          this.insertIframeHtml();
        },
        alterTableOpen: function() {
          if (this.autoReset) {
            //有可能还没有渲染
            try {
              this.reset();
            } catch (e) {
              this.render();
              this.open();
            }
          }
          this.showAtCenter();
          this.insertIframeHtml();
          // baidu.editor._internal(this.id);
          window.editor.execCommand('inittablepopup', this.id);
          // baidu.editor._inserttable(this);
          window.editor.execCommand('tablepopupevent', this);

          if (typeof window.editor.options.ueditorChangeEvent == 'function') {
            window.editor.options.ueditorChangeEvent();
          }
        },

        insertIframeHtml: function() {
          var iframe = document.getElementById(this.id + 'divContetnt');
          //把原来的弹出框的确定与取消按钮隐藏了
          $('#' + this.id)
            .parent()
            .css('z-index', '1000');
          if (window.browser.version < 9) {
            document.getElementById(this.id + '_body').style.height = '332px';
          } else {
            document.getElementById(this.id + '_body').style.height = '532px';
          }
          document.getElementById(this.id + '_body').style.width = '715px';
          document.getElementById(this.id).style.top = '12px';
          document.getElementById(this.id).style.left = '0';
          document.getElementById(this.id + '_body').style.backgroundColor = '#ffffff';
          $(this.id).css({ top: '0px', left: '0px' });
          $('.edui-dialog-draghandle').css('height', '60px');
          $('.edui-dialog-closebutton').css({ top: '22px', right: '12px' });
          $('.edui-dialog-caption').css({
            'line-height': '60px',
            'font-size': '16px',
            'font-weight': 'normal',
            'padding-left': '20px',
          });
          document.getElementById(this.id + '_titlebar').style.height = '60px';
          document.getElementById(this.id + '_content').style.height = '460px';
          document.getElementById(this.id + '_content').style.width = '713px';
          document.getElementById(this.id + '_titlebar').style.background = 'none';
          var iframeContent = [
            '<div class="wrapper" id="tablewrapper_id" style="height: 460px;background-color:#ffffff;">',
            '<fieldset  class="base">',
            '<legend style="margin-left: 5px; font-weight: bold;font-size: 12px;color: #0066cc;">',
            // '<var id="lang_baseInfo"></var>',
            '</legend>',
            '<table style="margin-left: 15px;float: left;">',
            '<tr style="margin:10px 0 0 0;"><td>基础信息</td></tr>',
            '<tr>',
            '<td width="170"><label for="numRows"><var id="lang_rows"></var>：</label><input id="numRows" maxLength="2" value="5" type="text" style="border:1px solid #ccc;" /> <var id="lang_rowUnit"></var></td>',
            '<td width="170">',
            '<label for="ueditorWidth"><var id="lang_width"></var>：</label><input id="ueditorWidth" type="text" style="border:1px solid #ccc;" />',
            '<label for="ueditorWidthUnit"> px</label>',
            /*'<select id="ueditorWidthUnit" style="width: 50px">',

                                                            '<option value="px">px</option>',
                                                            '<option value="%">%</option>',
                                                        '</select>',*/
            '</td>',
            '</tr>',
            '<tr>',
            '<td width="170"><label for="numCols"><var id="lang_cols"></var>：</label><input id="numCols" maxLength="2" value="5" type="text" style="border:1px solid #ccc;" /> <var id="lang_colUnit"></var></td>',
            '<td width="170">',
            '<label for="ueditorHeight"><var id="lang_height"></var>：</label><input id="ueditorHeight" type="text" style="border:1px solid #ccc;" />',
            '<label for="ueditorHeightUnit"> px</label>',
            /*'<select id="ueditorHeightUnit" style="width: 50px">',

                                                            '<option value="px">px</option>',
                                                            '<option value="%">%</option>',*/
            '</select>',
            '</td>',
            '</tr>',
            '</table>',
            '<div id="message" style="display: none">',
            '<p><var id="lang_warmPrompt"></var>：</p>',
            '<p id="messageContent"><var id="lang_maxPadding"></var></p>',
            '</div>',
            '</fieldset>',
            '<div>',
            '<fieldset  class="extend">',
            '<legend style="color: #0066cc;font-weight: bold;">',
            // '<var id="lang_extendInfo"></var><span style="font-weight: normal;">(<var id="lang_preview"></var>)</span>',
            '</legend>',
            '<table style="margin-left:15px;">',
            '<tr style="margin:10px 0;"><td>扩展信息(可预览)</td></tr>',
            '<tr>',
            // '<td width="60"><span class="bold"><var id="lang_tableBorder"></var></span>：</td>',
            '<td width="182"><label for="border"><var id="lang_borderSize"></var>：</label><input id="border" type="text" style="border:1px solid #ccc;" /> px&nbsp;</td>',
            // '<td><label for="borderColor"><var id="lang_borderColor"></var>: </label><input id="borderColor" type="text" style="width: 55px;border:1px solid #ccc;" /></td>',
            '<td colspan="3">',
            '<span class="bold"><var id="lang_borderStyle"></var></span>：',
            // '<select id="borderStyle" style="height:32px;width:78px;">',
            //     '<option value="solid"></option>',
            //     '<option value="dashed"></option>',
            //     '<option value="dotted"></option>',
            // '</select>',

            '</td>',
            '<td>',
            '<div id="borderStyle" style="width: 76px;height:30px;margin-right: 10px;position:relative;border:1px solid #ccc;border-radius:3px;" value="solid">',
            '<nobr class="borderStyleInner" style="width: 34px;overflow: hidden;margin: 6px 0 0 10px;display:inline-block;">————</nobr>',
            '<p class="borderStyleIcon tableIcon" style="width: 12px;height: 12px;position:absolute;top:10px;right:8px;"></p>',
            '<p class="borderStyleMask tableMask" style="position:absolute;top:0;left:0;right:0;bottom:0;cursor:pointer;"></p>',
            '<ul class="borderStyleCon" style="width: 78px;height:97px;box-sizing: border-box;padding-top:8px;position:absolute;top:36px;left:-1px;border:1px solid #ccc;border-radius:3px;background-color:#fff;display:none;">',
            '<li value="solid">————</li>',
            '<li value="dashed">----------</li>',
            '<li value="dotted">·················</li>',
            '</ul>',
            '</div>',
            '</td>',
            '</tr>',
            '<tr>',
            '<td width="182"><label for="borderColor"><var id="lang_borderColor"></var>：</label><input id="borderColor" type="text" style="border:1px solid #ccc;" /></td>',
            '<td colspan="3"><span class="bold"><var id="lang_table_background"></var></span>：<input id="bgColor" type="text" style="border:1px solid #ccc;" /></td>',
            '</tr>',
            '<tr>',
            // '<td><span class="bold"><var id="lang_mar_pad"></var></span>：</td>',
            '<td width="158" style="padding-left:24px;"><label for="cellPadding"><var id="lang_margin"></var>：</label><input id="cellPadding" type="text" style="border:1px solid #ccc;" /> px&nbsp;</td>',
            '<td style="padding-left:24px;"><label for="cellSpacing"><var id="lang_padding"></var>：</label><input id="cellSpacing" type="text" style="border:1px solid #ccc;" /> px </td>',
            '</tr>',
            // '<tr>',
            //     '<td colspan="3"><span class="bold"><var id="lang_table_background"></var></span>：',
            //         '<input id="bgColor" type="text" style="width: 90px;border:1px solid #ccc;" />',
            //     '</td>',
            // '</tr>',
            '<tr>',
            '<td colspan="3"><span class="bold"><var id="lang_table_alignment"></var></span>：',
            // '<select id="align" style="width: 110px;height:32px;border-radius:3px;">',
            //     '<option value=""></option>',
            //     '<option value="center"></option>',
            //     '<option value="left"></option>',
            //     '<option value="right"></option>',
            // '</select>',
            '</td>',
            '<td>',
            '<div id="align" style="width: 108px;height:30px;margin-right: 10px;position:relative;border:1px solid #ccc;border-radius:3px;" value="left">',
            '<nobr class="alignInner" style="margin: 6px 0 0 10px;display:inline-block;">左对齐</nobr>',
            '<p class="alignIcon tableIcon" style="width: 12px;height: 12px;position:absolute;top:10px;right:8px;"></p>',
            '<p class="alignMask tableMask" style="position:absolute;top:0;left:0;right:0;bottom:0;cursor:pointer;"></p>',
            '<ul class="alignCon" style="width: 110px;height:106px;box-sizing: border-box;padding-top:8px;position:absolute;top:36px;left:-1px;border:1px solid #ccc;border-radius:3px;background-color:#fff;z-index:999;display:none;">',
            '<li value="left">左对齐</li>',
            '<li value="center">居中对齐</li>',
            '<li value="right">右对齐</li>',
            '</ul>',
            '</div>',
            '</td>',
            '</tr>',
            '<tr>',
            '<td colspan="3">',
            '<span class="bold"><var id="lang_borderFor"></var></span>：',
            // '<select id="borderType" style="width: 110px;height:32px;border-radius:3px;">',
            //     '<option value="0"></option>',
            //     '<option value="1"></option>',
            // '</select>',
            '</td>',
            '<td>',
            '<div id="borderType" style="width: 108px;height:30px;margin-right: 10px;position:relative;border:1px solid #ccc;border-radius:3px;" value="0">',
            '<nobr class="borderTypeInner" style="margin: 6px 0 0 10px;display:inline-block;">所有单元格</nobr>',
            '<p class="borderTypeIcon tableIcon" style="width: 12px;height: 12px;position:absolute;top:10px;right:8px;"></p>',
            '<p class="borderTypeMask tableMask" style="position:absolute;top:0;left:0;right:0;bottom:0;cursor:pointer;"></p>',
            '<ul class="borderTypeCon" style="width: 110px;height:72px;box-sizing: border-box;padding-top:8px;position:absolute;top:36px;left:-1px;border:1px solid #ccc;border-radius:3px;background-color:#fff;display:none;">',
            '<li value="0">所有单元格</li>',
            '<li value="1">仅表格</li>',
            '</ul>',
            '</div>',
            '</td>',
            '</tr>',
            /*'<tr>',
                                                      '<td colspan="3">',
                                                          '<span class="bold"><var id="lang_cellPadding"></var></span>：',
                                                          '<select id="commCellPadding">',
                                                              '<option value="0"></option>',
                                                              '<option value="1"></option>',
                                                          '</select>',
                                                      '</td>',
                                                    '</tr>',*/

            '</table>',
            '</fieldset>',

            '<div id="preview">',
            '<table border="1" borderColor="#000" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">',
            '<tr><td colspan="3" style="width:90px;"><var id="lang_forPreview"></var></td></tr>',
            '<tr><td></td><td></td><td></td></tr>',
            '<tr><td></td><td></td><td></td></tr>',
            '</table>',
            '</div>',
            '</div>',
            '<div style="float: right;margin: 10px 240px 10px 0px; _width:200px;_margin-right:0px;">',
            '<button style=" height: 37px;margin-right: 20px;width: 104px;border:1px solid #5874d8;border-radius:3px;background-color:#5874d8;color:#fff;font-size: 12px;line-height: 18px;text-align: center;cursor: pointer;line-height: 18px;">确定</button>',
            '<button style=" height: 37px;width: 104px;border:1px solid #ccc;border-radius:3px;background-color:#fff;color:#333;font-size: 12px;line-height: 18px;text-align: center;cursor: pointer;line-height: 18px;">取消</button>',
            '</div>',
            '</div>',
          ];

          iframe.innerHTML = iframeContent.join('');
          if (
            $('#' + this.id + '_body')
              .parent()
              .find('>iframe').length == 0
          ) {
            $('#' + this.id + '_body').before(
              ' <iframe style="position:absolute;z-index:-1;left:0;top:0;background-color: white;" frameborder="0" width="100%" height="100%" src="javascript:"></iframe>',
            );
          }
        },
      });

      dialog.render();
      window.editor.ui._dialogs['inserttableDialog'] = dialog;
    }
    var openDialog = function() {
      if (dialog) {
        //打开后再关闭再打开是为了解决fieldset文字错位问题
        if (window.browser.webkit) {
          dialog.open();
          dialog.close();
        }
        dialog.open();
      }
    };
    var ui = new editorui.TableButton({
      showText: true,
      label: title,
      dialogId: dialog.id,
      editor: editor,
      title: title,
      className: 'edui-for-inserttable',
      onpicktable: function(t, numCols, numRows) {
        window.editor.execCommand('InsertTable', {
          numRows: numRows,
          numCols: numCols,
          border: 1,
        });
      },
      onmore: openDialog,
      onbuttonclick: openDialog,
    });
    window.editor.addListener('selectionchange', function() {
      ui.setDisabled(editor.queryCommandState('inserttable') == -1);
    });
    return ui;
  };
  // ----------------------- 这里放ui组件 ---------------------------

  // ---------------------- 这里放相关的事件 --------------------
  window.UE.commands['tsinsert'] = {
    execCommand: function(commmand, editor, insertType) {
      window.editor.fireEvent('tsInsertEvent', insertType);
    },
  };
  // ---------------------- 这里放相关的事件 --------------------

  // ---------------------- 这里放业务上需要插入的模板 -----------------------
  window.UE.Editor.prototype.getTsInsertModel = function(type, insertData) {
    console.log('insertData', insertData);
    let tempModel = '';
    switch (type) {
      case 'tsArticle':
      case 'tsForm':
      case 'tsProduct':
        // data-src要放在data-productAttribute class统一放data后面
        // 这个的a标签class应放到最前面，后续在小程序文章中可正则匹配获取真实链接
        tempModel =
          '<p class="tsspacing"></br></p><div><p class="' +
          type +
          'Wrap" style="position: relative;" readonly="readonly" contenteditable="false">' +
          '<span data-type="' +
          type +
          '"data-id="' +
          insertData.id +
          '" data-productAttribute="' +
          (insertData.productAttribute || -1) +
          '" data-src="%VISITURL%"  class="' +
          type +
          ' tsInsertComm" contenteditable="false" >' +
          '<img class="tsInsertCommImg" data-defaultImg="' +
          (type === 'tsProduct' && insertData.noPic) +
          '" src="' +
          insertData.coverImgUrl +
          '">' +
          '<span class="tsInsertCommContent">' +
          '<span class="tsCommTitle">' +
          insertData.title +
          '</span>' +
          (type === 'tsProduct' && insertData.priceType === 2
            ? ''
            : '<span class="tsCommDesc' +
              (type === 'tsProduct' ? ' redColor' : '') +
              '">' +
              insertData.desc +
              '</span>') +
          '</span>' +
          '<a class="' +
          type +
          ' wxAppTsModel" data-type="' +
          type +
          '" data-id="' +
          insertData.id +
          '" data-productAttribute="' +
          (insertData.productAttribute || -1) +
          '" data-src="%VISITURL%" contenteditable="false"></a>' +
          '</span>' +
          '</p></div>';
        break;
      case 'tsDoc': //  后端根据判断 data-key="ts-embed" -> 后端会通过这个去判断替换成wx-open-launch-weapp去跳转 class统一放data后面
        // 这个的a标签class应放到最前面，后续在小程序文章中可正则匹配获取真实链接
        tempModel =
          '<p class="tsspacing"></br></p><div><p data-key="ts-embed" data-type="' +
          insertData.selectType +
          '" style="position: relative;" class="tsPDocWrap" readonly="readonly" contenteditable="false">' +
          '<span class="tsDocWrap" contenteditable="false">' +
          '<span data-type="' +
          insertData.selectType +
          '" data-id="' +
          insertData.id +
          '"  class="' +
          insertData.selectType +
          ' tsInsertComm">' +
          '<img class="tsInsertCommImg" data-defaultImg="true" src="' +
          insertData.coverImgUrl +
          '">' +
          '<span class="tsInsertCommContent">' +
          '<span class="tsCommTitle">' +
          insertData.name +
          '</span>' +
          '<span class="tsCommDesc">' +
          insertData.createTimeName +
          '<span class="division">|</span>' +
          insertData.sizeName +
          '</span>' +
          '</span>' +
          '<a class="' +
          insertData.selectType +
          ' wxAppTsModel" data-type="' +
          insertData.selectType +
          '" data-id="' +
          insertData.id +
          '"  data-src="%VISITURL%" contenteditable="false"></a>' +
          '</span>' +
          '<span data-key="ts-embed" class="jumpWxapp tsDocJump" style="display: block;opacity: 0;width: 100%;height: 999px;"></span>' +
          '</span>' +
          '</p></div>';
        break;
      case 'tsVideo':
        tempModel =
          '<p class="tsspacing"></br></p><p data-type="' +
          insertData.selectType +
          '" data-id="' +
          insertData.id +
          '" style="text-align:left;" class="insertTsVideo ' +
          insertData.selectType +
          '"  readonly="readonly" contenteditable="false" data-src="' +
          insertData.coverImgUrl +
          '?id=' +
          insertData.id +
          '">' +
          '<video preload="meta" key="local" name = "' +
          insertData.name +
          '" style="width:400px;background:#000;height:400px;max-width:100%;" controls="controls" controlsList="nodownload" data-coverurl="' +
          insertData.coverImgUrl +
          '" x5-playsinline="" playsinline="true" webkit-playsinline="true" x-webkit-airplay="true" x5-video-player-type="h5" x5-video-player-fullscreen="" x5-video-orientation="portraint" id="' +
          insertData.id +
          '">' +
          '<source src="' +
          insertData.visitUrl +
          '" type="video/mp4" />' + //Safari / iOS video
          '<embed width="400" height="400" type="application/x-shockwave-flash" src="' +
          window.Fai.top._resRoot +
          '/js/comm/jwplayer/jwplayer.swf?file=' +
          insertData.visitUrl +
          '" allowfullscreen="true" />' +
          '</video></br>' +
          '</p>';
        break;
      case 'tsImg':
        tempModel = '<img src="' + insertData.content + '" alt=' + insertData.name + ' />';
    }
    return tempModel;
  };
  // ---------------------- 这里放业务上需要插入的模板 -----------------------
};

export const initEdit = function(
  isInit,
  initialContent,
  domKey,
  editStyle,
  extraUploadUrlOption,
  otherConfig = {
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
        'link',
        'unlink',
        'insertimage',
        'inserttable',
        '|',
        'source',
      ],
    ],
  },
) {
  const resRoot = getStoreState().globalData.resRoot;
  if (isInit) {
    //因为editor编辑器是生成代码的，在路由页面重新打需要清空之前生成的代码
    if (document.getElementById('edui_fixedlayer') != null) {
      document.getElementById('edui_fixedlayer').innerHTML = '';
    }
  }

  return new Promise(resolve => {
    // Ts_util.Res.loadg('udeditInfo').then(() => {
    insertEditorGlobalConfig({
      toolbarsClass: {
        link: { id: 4, priority: '' },
        unlink: { id: 4, priority: '' },
        inserttable: { id: 4, priority: '' },
        tsimg: { id: 4, priority: '' },
      },
    });
    const UEDITOR_HOME_URL = resRoot;
    window.editor = new window.UE.ui.Editor({
      UEDITOR_HOME_URL: UEDITOR_HOME_URL, // 编辑器资源文件根路径
      BUS_UEDITOR_HOME_URL_IMAGE: `${UEDITOR_HOME_URL}/image/comm/ueditor`,
      initialStyle: editStyle, // 编辑器内部样式拓展
      upLoadImageUrl:
        '/ajax/ue/tsUploadImg_h.jsp?cmd=uploadTmpFile&_TOKEN=' +
        getStoreState().globalData.token +
        '&_LOGIN_SIGN=' +
        getStoreState().globalData.login_sign +
        '&' +
        extraUploadUrlOption, // 上传图片AJAX的URL
      upPasteIamgeUrl:
        '/ajax/ue/tsUploadImg_h.jsp?cmd=uploadTmpFileForPaste&_TOKEN=' +
        getStoreState().globalData.token +
        '&_LOGIN_SIGN=' +
        getStoreState().globalData.login_sign +
        '&' +
        extraUploadUrlOption, // 粘贴图片直接上传AJAX的URL
      upSitePasteIamgeUrl:
        '/ajax/ue/tsUploadImg_h.jsp?cmd=uploadTmpFileForPaste&_TOKEN=' +
        getStoreState().globalData.token +
        '&_LOGIN_SIGN=' +
        getStoreState().globalData.login_sign +
        '&' +
        extraUploadUrlOption, //
      upImgApp: 144, // 各产品上传资源库标识
      isPasteImage: true, // 是否开启粘贴图片直接上传到服务器
      // 三处设置配置项的优先级: 实例化时传入参数 > setOpt()设置 > config文件里设置
      // initialContent: that.editAccountInfo.content,
      focus: true, // 初始化时，是否让编辑器获取焦点true或者false
      toolbars: otherConfig.toolbars,
      minFrameHeight: 390,
    });

    // ue config
    if (resRoot !== 'undefined') {
      window.UEDITOR_CONFIG.UEDITOR_HOME_URL = resRoot;
    }

    window.editor.setOpt({
      iframeCssUrl: '//st.aaadns.com/css/comm/ueditor/mp.src.css',
    });
    window.editor.setOpt({ initialContent: initialContent });
    window.editor.render(domKey); // 渲染编辑器的DOM到指定容器

    window.editor.addListener('changeDataWH', function(type, node, dataW, dataH) {
      node.setAttribute('data-w', dataW);
      node.setAttribute('data-h', dataH);
    });

    /*
     * 在使用ueditor后，跳转页面后按F12改变页面大小，会触发ueditor的window.onresize，导致报错
     * 目前的解决方案和articleMatrial.src.js类似，通过覆盖的方式解决
     */
    window.UE.Editor.prototype.$tsDestroy = function(isReset, callBack) {
      try {
        window.editor.destroy();
        window.editor = null;
      } catch (e) {
        console.log(e);
      }
      // isReset && (window.onresize = () => {window.screenWidth = document.body.clientWidth});
      callBack && callBack();
    };

    resolve(window.editor);
  });
};
