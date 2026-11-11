---
title: 用 Markdown 写下一篇记录
date: 2026-11-11T00:01:00+08:00
kind: 学习笔记
description: 一篇文章需要哪些信息，图片放在哪里，以及写完后怎样预览和发布。
tags: [Markdown, 写作]
---

这个网站的文章保存在工程的 `source/_posts/` 目录中。每篇文章都是一个 Markdown 文件，正文可以直接阅读和修改。

## 创建文章

在工程目录运行：

```bash
npx hexo new "文章标题"
```

也可以直接新建一个 `.md` 文件。在文件开头写下标题、时间与主题：

```yaml
---
title: 一次新的记录
date: 2026-11-11T12:00:00+08:00
kind: 日常分享
description: 用一句话介绍这篇文章。
tags: [日常]
---
```

`kind` 决定文章出现在首页的哪个主题下。当前使用“编程与建站”“学习笔记”和“日常分享”；其中日常文章也会自动出现在日常页。

## 写正文和代码

用二级标题组织主要段落。代码写在三个反引号之间，并注明语言，就能保留缩进和代码格式。

```javascript
const note = '把过程记下来';
console.log(note);
```

## 加入图片

把自己的图片放到 `source/images/`，再在正文中引用：

```markdown
![对图片内容的描述](/images/my-photo.jpg)
```

图片说明尽量描述实际内容。外部素材需要保留作者与许可信息。

## 先预览，再发布

```bash
npm run server
```

浏览器打开终端显示的本地地址，检查标题、图片和正文。确认后构建并检查：

```bash
npm run build
npm run check
```

源码提交到 `source` 分支后，运行 `npm run publish` 更新静态网站。还没写完的内容可以放到 `source/_drafts/`，或者设置 `published: false`，避免提前公开。
