# GitHub Pages 与后续迁移

## 当前约定
- 目标仓库：MoclifFood/MoclifFood.github.io。
- source 分支：Hexo 源码、Markdown、主题、锁文件和说明。
- main 分支：public 构建结果；沿用旧发布历史，禁止强制推送。
- 目标地址：https://mocliffood.github.io。
- GitHub SSH 身份已验证；不在文件中保存凭证。

## 发布流程
先本地构建和检查，再提交 source，最后使用 `npm run publish` 将生成产物提交到 main。首次发布后核验 Pages 状态与实际页面。GitHub Actions 在 source 更新时验证并打包，不使用仓库密钥；本地 SSH 发布触发现有 Pages 流程。

## 迁移
更换 `_config.yml` 中的 `url` 后重建，把 `public/` 上传至其他静态托管平台；或在服务器用 Caddy/Nginx 提供静态服务。Markdown 和主题不依赖 GitHub 数据库。

## 待验证
- main 分支当前 Pages 发布设置和新版本上线结果。
- 源码验证作业的实际执行结果。

对应：[P4 上线](项目-开发计划图.md)、[S6/S7 发布与分发](项目-系统运行流程图.md)。
