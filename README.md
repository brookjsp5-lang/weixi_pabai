# 微信公众号一键排版工具

本项目是一个本地网页应用，用于把公众号文章初稿转换为微信兼容的富文本排版。

## 功能

- 粘贴纯文本或轻量 Markdown 文章
- 自动识别一级标题、二级标题、正文、引用、列表、重点句和分割线
- 手动调整每个内容块的类型
- 内置 10 套微信公众号排版模板
- 实时预览微信富文本效果
- 一键复制 `text/html` 富文本，并提供纯文本 fallback
- 自动保存草稿、最近模板和手动类型调整到浏览器本地

## 运行

```bash
npm install
npm run dev
```

打开终端输出的本地地址即可使用。

## 验证

```bash
npm run test
npm run build
```

## 部署到 Vercel

导入 Git 仓库后，Vercel 会按 `vercel.json` 使用以下配置：

- Framework Preset: `Vite`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`
