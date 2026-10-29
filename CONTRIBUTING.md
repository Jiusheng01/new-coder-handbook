# 协作说明

这是公开仓库，任何人都可以阅读、Fork 并提交 Pull Request，无需先获得仓库写权限。可以直接在 GitHub 网页编辑和提交。

## 分支用途

| 分支 | 用途 | 提交后的行为 |
| --- | --- | --- |
| `main` | 当前线上版本 | GitHub 自动检查并部署 |
| `develop` | 汇总协作开发内容 | GitHub 自动检查 |
| `feature/<主题>` | 从 `develop` 创建的功能分支 | GitHub 自动检查 |
| `fix/<主题>` | 从 `develop` 创建的修复分支 | GitHub 自动检查 |

`main` 和 `develop` 是长期分支，功能和修复分支按实际任务创建。

## 外部贡献者

1. 点击仓库右上角 **Fork**，复制到自己的 GitHub 账号；如需从 `develop` 开始，创建 Fork 时取消 **Copy the main branch only**。
2. 在自己的 Fork 中，从 `develop` 创建 `feature/<主题>` 或 `fix/<主题>` 分支，修改文件并提交。
3. 创建 Pull Request，将 **base repository** 选为 `qinsx2002/linuxdo-learning-handbook`、**base** 选为 `develop`，**head repository** 和 **compare** 选择自己的 Fork 与功能分支。
4. 等待维护者审阅，根据意见补充提交。合并后由维护者统一发布。

Fork 仓库默认只运行检查。部署凭据只用于指定仓库的主分支发布，外部贡献者无需提供或获取这些凭据。

## 有写权限的协作者

1. 维护者可在仓库 **Settings → Collaborators → Add people** 中邀请长期协作者，授予仓库写权限。
2. 协作者在 **Code** 页选择 `develop`，从分支选择器创建 `feature/<主题>` 或 `fix/<主题>`。
3. 打开需要修改的文件，使用编辑按钮修改并提交。多文件编辑也可以使用 GitHub 的网页编辑器（在仓库页面按 `.`）。
4. 创建 Pull Request，选择 **base: develop**、**compare: 功能分支**。查看 **Checks**，处理失败和审阅意见后合并。
5. 准备上线时创建 **base: main**、**compare: develop** 的 PR，在 GitHub 合并。合并会自动触发主分支检查和部署。
6. 发布后将 `main` 的最新提交通过 PR 合并回 `develop`，使后续开发包含主分支上的修复。

PR 检查由 GitHub 自动执行。上述审阅及发布步骤是协作约定，仓库没有额外设置强制审批门槛。

## 手动发布主分支

打开 [Actions → 检查并部署手册](https://github.com/qinsx2002/linuxdo-learning-handbook/actions/workflows/deploy.yml)，点击 **Run workflow**，选择 **main**，再次点击 **Run workflow**。

页面会显示“内容与发布检查”和“发布到华为云”两个作业，全部成功表示发布及线上文件核对通过。选择其他分支只运行检查。

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
