# 协作说明

这是公开仓库，欢迎所有人阅读、Fork 并提交 Pull Request。**本仓库的写权限仅授予经仓库所有者 `qinsx2002` 确认的内部成员；`main` 主分支仅由 `qinsx2002` 更新和合并。** 外部贡献者可以在自己的 Fork 中自由修改，通过 PR 向本仓库提交贡献。

## 身份与权限

| 身份 | 开发分支与功能分支 | 向本仓库提交 PR | 合并至 `develop` | 更新或合并至 `main` |
| --- | --- | --- | --- | --- |
| 仓库所有者 `qinsx2002` | 可以直接修改 | 可以 | 可以 | 可以，拥有最终决定权 |
| 已接受 Write 邀请的内部成员 | 可以直接修改，无需每次申请 | 可以 | 可以，包括审阅后接收外部 PR | 不可以，只能提交 PR 等待所有者处理 |
| 外部贡献者 | 只能修改自己的 Fork | 可以，目标通常为 `develop` | 不可以 | 不可以 |

内部身份由所有者确认，再通过 **Settings → Collaborators → Add people** 发出邀请；接受邀请后写权限才生效。仅向内部成员授予 **Write** 权限，不因外部人员提交过 PR 就授予写权限。人员离开内部协作范围时，由所有者撤销其权限或未接受的邀请。

GitHub 已启用 [main-owner-only 主分支保护规则](https://github.com/qinsx2002/new-coder-handbook/rules/26109105)，限制 `main` 的更新、删除与强制推送，唯一豁免账号为 `qinsx2002`。规则同样限制通过网页编辑或合并 PR 更新 `main`，内部成员的 Write 权限不能绕过它。

## 分支用途

| 分支 | 用途 | 本仓库内可修改人员 | 提交后的行为 |
| --- | --- | --- | --- |
| `main` | 当前正式版本 | 仅 `qinsx2002` | GitHub 自动检查并部署至华为云 |
| `develop` | 汇总协作开发内容 | 所有者与内部成员 | GitHub 自动检查并部署至 GitHub Pages |
| `feature/<主题>` | 从 `develop` 创建的功能分支 | 所有者与内部成员 | GitHub 自动检查 |
| `fix/<主题>` | 从 `develop` 创建的修复分支 | 所有者与内部成员 | GitHub 自动检查 |

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
4. 等待内部成员审阅，根据意见补充提交。只有内部成员或所有者可以将 PR 合并至 `develop`；合并后自动更新开发预览。进入 `main` 的正式发布由 `qinsx2002` 决定。

外部 Fork 提交的 PR 可以正常创建和讨论，但在本仓库运行其 GitHub Actions 工作流前，需要有写权限的内部成员批准；此要求适用于所有外部贡献者。**批准运行检查不等于批准或合并 PR**，外部作者不能自行合并。

Fork 仓库默认只运行检查。发布作业仅在指定仓库的 `main` 或 `develop` 分支运行，外部 PR 不执行部署，也不会获得本仓库的部署凭据。

## 内部成员

1. 接受 `qinsx2002` 发出的仓库协作邀请，获得 Write 权限。
2. 日常修改可以直接提交至 `develop`，无需每次请求所有者审批。需要集中讨论或多人协作时，从 `develop` 创建 `feature/<主题>` 或 `fix/<主题>` 分支，再通过 PR 合并至 `develop`。
3. 在 GitHub **Code** 页选择目标分支，打开文件并编辑提交；多文件编辑可在仓库页面按 `.` 使用网页编辑器。也可以使用本地 Git 推送。
4. 合并内部或外部 PR 前，检查改动和 **Checks**。外部 Fork PR 若显示等待工作流批准，先审查其代码与工作流变更，再批准运行检查；检查完成后决定是否合并至 `develop`。
5. 准备正式发布时创建 **base: main**、**compare: develop** 的 PR，交由 `qinsx2002` 决定是否合并。内部成员不能自行更新 `main`。
6. 发布后将 `main` 的最新提交合并回 `develop`，使后续开发包含主分支上的修复。

`develop` 不设置强制 PR 或审批人数要求，内部成员可直接提交；合并前检查是协作约定。`main` 的所有者专属权限和外部 PR 工作流的运行批准要求则由 GitHub 配置实际执行。

## 手动发布

所有者与已获得 Write 权限的内部成员可以打开 [Actions → 检查并部署手册](https://github.com/qinsx2002/new-coder-handbook/actions/workflows/deploy.yml)，点击 **Run workflow**，选择 **develop** 发布 GitHub Pages，或选择 **main** 重新部署所有者已确定的正式版本，再次点击 **Run workflow**。手动运行不赋予修改或合并 `main` 的权限；外部贡献者不能手动运行本仓库工作流。

GitHub 环境配置将 `github-pages` 限定为 `develop` 分支，将 `production` 限定为 `main` 分支，不允许其他分支或标签进入对应部署环境。

页面会执行“内容与发布检查”和所选分支对应的发布作业。检查、发布与线上文件核对全部成功才表示完成。选择其他分支只运行检查。

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
