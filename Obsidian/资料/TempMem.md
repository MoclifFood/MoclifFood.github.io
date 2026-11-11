**更新时间：2026-11-11 22:45 +08:00**

## 接手定位
- 目标：个人技术与日常博客首版已上线；后续按用户需求迭代。
- 工程：Hexo 8，自定义 themes/mocliffood；网站 https://mocliffood.github.io/。
- 当前 source 代码提交 28ed6fc5e7fedd880c5c3f1150e61ec088cefdd5；保存本摘要时维护文档尚未提交，随后将单独提交至 source。
- main 静态发布 65b13cfd0814d31b5301be07063e649ee75721eb，沿用旧历史，无强推。

## 当前状态与验证
- 用户要求已实现：米黄 #f5f1e8、柔黑 #2d2c28、简约阅读；首页介绍只显示 `:)`。
- 文章、项目、日常、关于、搜索、RSS、站点地图、自定义 404 已实现；旧文章保留，空 CS2 草稿不发布。
- build/check 通过 19 页；源码 CI 与 Pages 部署成功。线上 10 页返回 200，5 项资源哈希与本地一致，自定义 404 正确。
- 本地 Ego DOM 验证筛选、搜索、主题切换；最终视觉检查覆盖 1440/768/390，0 FAIL、4 项经说明的 WARN；全部截图已复核。
- 线上 HTTP 验证已通过；收尾时 Ego TaskSpace 3 已不存在，无法追加线上 Ego 检查，未新建空间绕过。
- Canvas 结构与链接已验证；未在 Obsidian GUI 目视验收。

## 关键结论
- 构建必须使用 package scripts 经 tools/hexo.mjs 固定 Asia/Shanghai；文章保留 Hexo 本地日期语法，避免 UTC CI 链接偏移。
- source CI 只构建与检查；提交 source 后运行 npm run publish，通过本地 SSH 更新 main 并触发 Pages。
- tools/ 放运维脚本；不要放根 scripts/，Hexo 会把其中 ESM 文件当 CommonJS 加载。
- npm ci 报告旧构建依赖 19 项漏洞；本次未强制升级。

## 下一步
1. 按用户提供的真实文章、项目与照片继续填充内容，入口 source/_posts/、source/projects/index.md。
2. 后续改站遵循 README 的构建、提交与发布流程；评论和换托管仅为可选支线，未承诺实施。

## 相关文件
- [项目约定](preset.md)、[任务状态](todo.md)、[维护说明](https://github.com/MoclifFood/MoclifFood.github.io/blob/source/README.md)。
- [部署](Library/部署-GitHub-Pages.md)、[验收](Library/验证-首版验收.md)、[设计](Library/设计-个人工作台.md)。
