# MoclifFood 的个人网站

技术文章、学习笔记、项目和日常分享。首期使用 GitHub Pages，页面与文章可迁移到其他静态托管平台。

- 网站：https://mocliffood.github.io
- 源码：`source` 分支；静态产物：`main` 分支。
- 框架：Hexo 8；主题：`themes/mocliffood/`，独立 EJS/CSS/JavaScript。
- npm 构建与预览入口固定使用 Asia/Shanghai，确保 UTC 构建机器上的文章日期与链接不偏移。

## 本地使用

安装 Node.js 24，在项目根目录执行：

```bash
npm ci
npm run server
```

## 写文章

`source/_posts/` 保存已发布的 Markdown。文章开头的 `kind` 可以使用“编程与建站”“学习笔记”“日常分享”。日常文章会自动出现在日常页。未完成的内容放 `source/_drafts/` 或设置 `published: false`。

```bash
npx hexo new "文章标题"
```

图片放 `source/images/`。不要把私人资料、密钥或不准备公开的笔记提交到公开仓库。

## 验证与发布

```bash
npm run build
npm run check
git add .
git commit -m "Update website"
git push origin source
```

GitHub Actions 在 `source` 更新时构建、检查并保存静态产物。在源码已提交后运行 `npm run publish` 发布网站。发布脚本使用独立工作树，保留原有 main 历史，不强制推送；本地 SSH 推送会触发现有 Pages 发布流程。

GitHub 仓库 Settings → Pages 应保持从 `main` 分支根目录发布。生成结果包含 `.nojekyll`。源码分支里的工作流负责验证并打包；Pages 自己不编译 Hexo。

## 迁移与个性化

修改 `_config.yml` 中的 `url` 后重建，将 `public/` 上传到新平台即可。主题样式在 `themes/mocliffood/source/css/site.css`，页面在 `themes/mocliffood/layout/`，内容与界面分开维护。

页面字体与图片本地托管，运行时不依赖外部字体 CDN。图片和字体来源见站点 `/credits/` 与 `assets/credits.json`。

项目记录从 [preset.md](preset.md) 开始；Obsidian 可打开项目内 `Obsidian/` 文件夹。

- [开发计划图](Library/项目-开发计划图.md) · [运行流程图](Library/项目-系统运行流程图.md)
- [计划 Canvas](Obsidian/思维导图/项目-开发计划图.canvas) · [运行 Canvas](Obsidian/思维导图/项目-系统运行流程图.canvas)
- [设计与素材记录](Library/设计-个人工作台.md) · [验收记录](Library/验证-首版验收.md)
