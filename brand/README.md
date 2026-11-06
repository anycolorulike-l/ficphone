# FicPhone 品牌文件包

依据用户提供的手机、引号对话框和圆润字标参考重新绘制。参考图片仅用于观察外观；没有直接嵌入、裁切或放大原图。

主色：**#002FA7**。图标中的屏幕、听筒、引号和按键为纯白，图形外部透明。适合白色或浅灰色页面背景。

## 文件

| 用途 | SVG 矢量原稿 | 高清透明 PNG |
|---|---|---|
| 独立图标，1:1 | svg/ficphone-icon.svg | png/ficphone-icon-2048.png，2048×2048 |
| 独立 FicPhone 字标 | svg/ficphone-wordmark.svg | png/ficphone-wordmark-3200.png，3200×592 |
| 网站横版组合，图标在左 | svg/ficphone-horizontal.svg | png/ficphone-horizontal-4096.png，4096×1115 |
| 竖版组合，1:1 | svg/ficphone-stacked.svg | png/ficphone-stacked-3072.png，3072×3072 |

另附 32、64、128、256、512 像素图标 PNG，用于小尺寸图标、网页标签和项目展示。

`brand-preview.png` 是白／浅灰背景上的展示板；生产 PNG 均为透明底。

字标按参考风格重新排版并转换为矢量轮廓，不依赖使用者安装字体。SVG 均为几何形状和路径，没有嵌入位图或外部资源。

## 网站接入建议

图标和字标可以分别加载，不必把横版图片作为一个整体：

```html
<a class="brand" href="./" aria-label="FicPhone">
  <img src="ficphone-icon.svg" alt="" width="40" height="40">
  <img class="brand-wordmark" src="ficphone-wordmark.svg" alt="FicPhone">
</a>
```

```css
.brand { display: inline-flex; align-items: center; gap: 8px; }
.brand img { display: block; }
.brand-wordmark { height: 22px; width: auto; }
```

本 GitHub 文件包的 docs/ 网站已接入本 Logo，默认电量为 **37%**。原私人托管站点没有改动；尚未创建 GitHub 仓库或对外发布。

## 源文件与复现

- `source/build_vectors.py`：几何图标与字标轮廓构建源文件；需要 Python fontTools，以及脚本注明的本机字标字体。
- `source/render_png.cjs`：用 `@resvg/resvg-js` 将 SVG 原稿输出为 PNG；生产 SVG 本身不需要上述工具或字体。
- `brand.json`：主色和文件规格。
- `validation.json`：输出尺寸与透明通道检查结果。
