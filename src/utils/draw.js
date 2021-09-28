/*
 * @Author: ADI
 * @Date: 2021-03-23 11:29:43
 * @LastEditors  : ADI
 * @LastEditTime : 2021-07-15 10:25:24
 */

import { getTsImgUrl } from './index';

export class Draw {
  constructor() {
    this.canvas = null;
  }
  /**
   * 创建Canvas对象
   * @author enson
   * @date 2020-07-08
   * @param {*} width
   * @param {*} height
   * @param {Boolean} isRatio 是否处理设备像素比
   * @returns
   * @memberof Draw
   */
  createCanvas(width, height, isRatio) {
    try {
      const body = document.getElementsByTagName('body')[0];
      const canvas = document.createElement('canvas');
      this.canvas = canvas;
      const ctx = canvas.getContext('2d');
      console.log('ctx----->', ctx);
      const ratio = this.getRatio(ctx);
      console.log('ratio-----', ratio);
      // 当我们想要绘制一条 1px 的线时，由于当前浏览器的设备像素比是 2，所以实际上是通过 2 个像素点来绘制的
      // style.width是Canvas的物理宽度，width是canvas的像素宽度，手机的设备像素比一般都大于1，所以设置像素宽度后图片会更加清晰
      canvas.width = width;
      canvas.height = height;
      //压缩画布
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      if (isRatio) {
        canvas.width *= ratio;
        canvas.height *= ratio;
        ctx.scale(ratio, ratio); // 解决浏览器缩放问题、处理物理像素模糊问题
      }
      canvas.className = 'createElementCanvas'; // 这个类的样式在base.src.css, 因此需要在base.src.css后引入
      body.appendChild(canvas);
      return ctx;
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * 获取像素比
   * @author enson
   * @date 2020-07-08
   * @returns
   * @memberof Draw
   */
  getRatio(context) {
    let backingStore = 1;
    try {
      backingStore =
        context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        1;
    } catch (e) {
      console.log('e', e);
    }
    return (window.devicePixelRatio || 1) / backingStore;
  }

  /**
   * 存取器 - 获取私有cavnas变量
   * @author enson
   * @date 2020-07-14
   * @returns
   * @memberof Draw
   */
  getCanvas() {
    return this.canvas;
  }

  /**
   *
   * 圆角长方形
   * @author guoyijie
   * @date 2020-04-09
   * @export
   * @param {Object} ctx-canvas对象
   * @param {number} x-起点横坐标
   * @param {number} y-起点纵坐标
   * @param {number} w-宽
   * @param {number} h-高
   * @param {number} r-圆角半径
   */
  rountRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
    ctx.lineTo(x + w, y + h - r);
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
    ctx.lineTo(x + r, y + h);
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
    ctx.lineTo(x, y + r);
    ctx.closePath();
  }

  /**
   * @description :
   * @author      : ADI
   * @Date        : 2021-06-25 13:54:27
   * @param        {String} url 图片路径
   * @param        {Object} ctx 画布
   * @param        {Number} x 绘制位置x
   * @param        {Number} y 绘制位置y
   * @param        {Number} width 图片宽度
   * @param        {Number} height 图片高度
   * @param        {Number} height 图片高度
   * @param        {Boolean} isOrigin 是否为远程资源
   * @return       {*} Promise
   */
  drawImage(url, ctx, x, y, width, height, isOrigin = true) {
    return new Promise(resolve => {
      const tem = new Image();
      tem.crossOrigin = 'anonymous'; // 图像跨域
      tem.src = isOrigin ? getTsImgUrl(url) : url;
      tem.onload = () => {
        ctx.drawImage(tem, x, y, width, height);
        ctx.restore();
        resolve();
      };
    });
  }

  /**
   * 绘制最大宽高的图片
   * @author waldon
   * @param {String} url 图片路径
   * @param {Object} ctx 画布
   * @param {Object} option - 额外参数
   */
  drawLimitImage(url, ctx, { x = 0, y = 0, maxWidth = 0, maxHeight = 0 }) {
    return new Promise(resolve => {
      const tem = new Image();
      tem.crossOrigin = 'anonymous'; // 图像跨域
      tem.src = getTsImgUrl(url);
      const drawFn = () => {
        let zoomWidth = 1;
        let zoomHeight = 1;
        let width = tem.width;
        let height = tem.height;
        // 根据超出的部分计算缩放比，选最小的
        if (maxWidth < width) {
          zoomWidth = maxWidth / width;
        }
        if (maxHeight < height) {
          zoomHeight = maxHeight / height;
        }
        if (zoomWidth < 1 || zoomHeight < 1) {
          if (zoomWidth < zoomHeight) {
            width = maxWidth;
            height = height * zoomWidth;
          } else {
            width = width * zoomHeight;
            height = maxHeight;
          }
        }
        ctx.drawImage(tem, x, y, width, height);
        ctx.restore();
        resolve();
      };
      if (tem.complete) {
        drawFn();
        return;
      }
      tem.onload = () => {
        drawFn();
        tem.onload = null;
      };
    });
  }

  /**
   * @funcion 绘制文本，超出范围的字体用省略号表示
   * @author lymn
   * @param {Object} ctx 画布
   * @param {String} text 文本内容
   * @param {Number} maxWidth 最大宽度
   * @param {Number} x 绘制位置x
   * @param {Number} y 绘制位置y
   */
  drawTextInArea(ctx, text, maxWidth, x, y) {
    var textArray = text.split(''); // 分割成字符串数组
    var temp = '';
    var result = 'textArray';

    for (var i = 0; i < textArray.length; i++) {
      if (ctx.measureText(temp + textArray[i]).width < maxWidth) {
        temp += textArray[i];
      } else {
        const ellipsis = '...';
        while (ctx.measureText(temp + ellipsis).width > maxWidth) {
          temp = temp.slice(0, -1);
        }
        temp += ellipsis;
        break;
      }
    }
    ctx.fillText(temp, x, y);
  }

  /**
   * @function 绘制圆形图片
   * @author lymn
   * @param {Object} ctx 画布
   * @param {String} url 图片地址
   * @param {Number} r 半径
   * @param {Number} x 绘制位置x
   * @param {Number} y 绘制位置y
   */
  async drawArcImg(ctx, url, r, x, y) {
    ctx.save();
    ctx.beginPath();
    var d = 2 * r;
    var cx = x + r;
    var cy = y + r;
    ctx.lineWidth = 0;
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.clip();
    await this.drawImage(url, ctx, x - 1, y - 1, d + 2, d + 2); // 为了去除绘制时产生的黑边框
  }

  /**
   * @description
   * @author enson
   * @date 2020-07-23
   * @param {*} ctx - 上下文
   * @param {Object} imgSrc - 图片对象
   * @param {*} x - x坐标
   * @param {*} y - y坐标
   * @param {*} width  - canvas的width
   * @param {*} height - canvas的height
   * @param {*} radius - 圆角
   * @param {*} mode   - cover(取图片中间部分保持其宽高比铺满)，
                       - contain(被替换的内容将被缩放， 以在填充元素的内容框时保持其宽高比)
                       - aspectFill(产品说想要这种效果，这里参考的是微信小程序img的aspectFill缩放模式，
                          缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取)
   * @returns
   * @memberof Draw
   */
  drawImageWithMode(ctx, imgSrc, x, y, width, height, radius, mode) {
    return new Promise(resolve => {
      console.log(ctx, imgSrc, x, y, width, height, radius, mode);
      console.log(imgSrc, 'IMGsRC==');
      const coverImgWidth = imgSrc.width; // 图片的宽度
      const coverImgHeight = imgSrc.height; // 图片的高度
      const scale = coverImgWidth / coverImgHeight;
      let displacement, sx, sy, swidth, sheight;
      let clip_left,
        clip_top, //左偏移值，上偏移值，
        clip_width,
        clip_height, //截取宽度，截取高度
        img_width,
        img_height;
      switch (mode) {
        case 'cover': // 取图片中间部分(正方形)保持其宽高比铺满
          displacement = Math.abs((coverImgWidth - coverImgHeight) / 2);
          sx = coverImgWidth > coverImgHeight ? displacement : 0; //开始剪切的 x 坐标位置
          sy = coverImgHeight > coverImgWidth ? displacement : 0; //开始剪切的 y 坐标位置
          swidth = coverImgWidth > coverImgHeight ? coverImgHeight : coverImgWidth; //被剪切图像的宽高
          sheight = swidth;
          ctx.save(); //用来保存Canvas的状态。save之后，可以调用Canvas的平移、放度缩、旋转、错切、裁剪问等操作。
          this.rountRect(ctx, x, y, width, height, radius);
          ctx.clip();
          console.log(sx, sy, swidth, sheight, x, y, width, height, '很奇怪');
          ctx.drawImage(imgSrc, sx, sy, swidth, sheight, x, y, width, height);
          resolve();
          break;
        case 'contain': // 这里针对的是canvas的width和height相等的情况
          if (scale > 1) {
            height = width / scale;
            // x = x;
            y = y + (width - height) / 2;
          } else {
            width = height * scale;
            x = x + (height - width) / 2;
            // y = y;
          }
          ctx.drawImage(imgSrc, x, y, width, height);
          resolve();
          break;
        case 'aspectFill':
          // 保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取
          (img_width = coverImgWidth), (img_height = coverImgHeight);

          clip_height = img_width * (height / width);
          if (clip_height > img_height) {
            // 判断是否发生截取
            clip_height = img_height;
            clip_width = clip_height * (width / height);
            clip_left = (img_width - clip_width) / 2;
            clip_top = 0;
          } else {
            clip_left = 0;
            clip_top = (img_height - clip_height) / 2;
            clip_width = img_width;
          }
          ctx.drawImage(imgSrc, clip_left, clip_top, clip_width, clip_height, 0, 0, width, height);
          resolve();
          break;
        default:
          console.log('test==hhhh');
          ctx.drawImage(imgSrc, x, y, width, height);
          resolve();
      }
    });
  }
}
