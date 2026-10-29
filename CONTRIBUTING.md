# 协作说明

这是公开仓库，任何人都可以阅读、Fork 并提交 Pull Request，无需先获得仓库写权限。可以直接在 GitHub 网页编辑和提交。

## 分支用途

| 分支 | 用途 | 提交后的行为 |
| --- | --- | --- |
| `main` | 当前正式版本 | GitHub 自动检查并部署至华为云 |
| `develop` | 汇总协作开发内容 | GitHub 自动检查并部署至 GitHub Pages |
| `feature/<主题>` | 从 `develop` 创建的功能分支 | GitHub 自动检查 |
| `fix/<主题>` | 从 `develop` 创建的修复分支 | GitHub 自动检查 |

`main` 和 `develop` 是长期分支，功能和修复分支按实际任务创建。

已从 `main` 创建并推送[归档分支 `archive/main-before-github-pages-20261029`](https://github.com/qinsx2002/new-coder-handbook/tree/archive/main-before-github-pages-20261029)，保存启用 GitHub Pages 前的完整代码快照，不用于继续开发或部署。

## develop 自动部署与在线验收

开发分支名称为 **`develop`**。该分支已接入 GitHub Pages 自动托管，访问地址：**https://qinsx2002.github.io/new-coder-handbook/**。

1. 将代码推送至本仓库的 `develop`，或在 GitHub 将 PR 合并至 `develop`，即会自动触发部署流程。
2. GitHub Actions 先执行内容检查、状态测试和发布测试，全部通过后自动发布 GitHub Pages，并逐文件核对线上内容。
3. 在 [Actions 发布记录](https://github.com/qinsx2002/new-coder-handbook/actions/workflows/deploy.yml?query=branch%3Adevelop) 中确认“内容与发布检查”和“发布 develop 到 GitHub Pages”成功后，打开上述地址验收改动。“发布到华为云”在此流程中显示跳过。

协作者无需手动上传文件、运行部署命令或保持电脑开机。功能分支提交及尚未合并的 PR 只执行检查；合并至 `develop` 后才更新开发预览。流程失败时应查看 Actions 日志，不能把提交成功当作部署成功。

首次接入于 **2026-10-29** 完成：[首次自动部署记录](https://github.com/qinsx2002/new-coder-handbook/actions/runs/40841467684)及线上文件核对均通过；浏览器验收也已通过章节浏览、笔记保存与导入导出、搜索和移动端布局检查。这是首次接入的验证结果，后续提交需以各自的 Actions 运行结果为准。

## 外部贡献者

1. 点击仓库右上角 **Fork**，复制到自己的 GitHub 账号；如需从 `develop` 开始，创建 Fork 时取消 **Copy the main branch only**。
2. 在自己的 Fork 中，从 `develop` 创建 `feature/<主题>` 或 `fix/<主题>` 分支，修改文件并提交。
3. 创建 Pull Request，将 **base repository** 选为 `qinsx2002/new-coder-handbook`、**base** 选为 `develop`，**head repository** 和 **compare** 选择自己的 Fork 与功能分支。
4. 等待维护者审阅，根据意见补充提交。合并至 `develop` 后自动更新开发预览，正式版本由维护者统一发布。

Fork 仓库默认只运行检查。发布作业仅在指定仓库的 `main` 或 `develop` 分支运行，外部贡献者无需提供或获取部署凭据。

## 有写权限的协作者

1. 维护者可在仓库 **Settings → Collaborators → Add people** 中邀请长期协作者，授予仓库写权限。
2. 协作者在 **Code** 页选择 `develop`，从分支选择器创建 `feature/<主题>` 或 `fix/<主题>`。
3. 打开需要修改的文件，使用编辑按钮修改并提交。多文件编辑也可以使用 GitHub 的网页编辑器（在仓库页面按 `.`）。
4. 创建 Pull Request，选择 **base: develop**、**compare: 功能分支**。查看 **Checks**，处理失败和审阅意见后合并；随后自动更新 [GitHub Pages 开发预览](https://qinsx2002.github.io/new-coder-handbook/)。
5. 准备上线时创建 **base: main**、**compare: develop** 的 PR，在 GitHub 合并。合并会自动触发主分支检查和部署。
6. 发布后将 `main` 的最新提交通过 PR 合并回 `develop`，使后续开发包含主分支上的修复。

PR 检查由 GitHub 自动执行。上述审阅及发布步骤是协作约定，仓库没有额外设置强制审批门槛。

## 手动发布

打开 [Actions → 检查并部署手册](https://github.com/qinsx2002/new-coder-handbook/actions/workflows/deploy.yml)，点击 **Run workflow**，选择 **develop** 发布 GitHub Pages，或选择 **main** 发布华为云，再次点击 **Run workflow**。

页面会执行“内容与发布检查”和所选分支对应的发布作业，另一个发布作业显示跳过。检查、发布与线上文件核对全部成功才表示完成。选择其他分支只运行检查。

GitHub 托管的 runner 负责全部执行；协作者的电脑和维护者的电脑都无需运行部署命令或保持开机。

## 提交与本地检查

提交信息采用 Conventional Commits，简短描述使用中文，例如 `docs: 补充上下文工程练习`、`fix: 修复章节跳转`。

使用本地编辑器时，可以提前运行以下检查；GitHub 仍会独立执行同样的检查：

```bash
npm run check
npm test
npm run test:deploy
```

内容检查需要 Node.js 18+，发布测试需要 Linux 与 Python 3.12+。修改部署方式前请阅读 [部署说明](deploy/README.md)。
