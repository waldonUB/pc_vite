# USE SVG

## 特性

- 一键压缩。
- 打包自动生成 SVG sprite。
- 按需加载。
- 自动导入。
- 支持多色图标。
- 支持 width、height、color 调整样式。
- 无需 woff|eot|ttf|等字体库，svg 内联在 html 内,减少 HTTP 请求。

## USE

1. [iconfont.cn](https://www.iconfont.cn/manage/index?spm=a313x.7781069.1998910419.12&manage_type=myprojects&projectId=1053694) 下载新增的 svg ,放到 src/icons/svg 目录下。
2. 压缩 SVG : `yarn svgo`。
3. 完成。

## 阅读资料

- [SVG Sprites 技术介绍](https://www.zhangxinxu.com/wordpress/2014/07/introduce-svg-sprite-technology/?spm=a313x.7781069.1998910419.50)
- [svgo](https://github.com/svg/svgo)
