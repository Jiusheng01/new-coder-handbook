# 主体手册自动部署

仓库：`qinsx2002/new-coder-handbook`，默认分支：`main`，协作分支：`develop`。

## GitHub Pages 开发预览

预览地址：**https://qinsx2002.github.io/new-coder-handbook/**。每次提交或合并至 `develop`，工作流通过内容、状态和发布检查后，自动打包静态手册并发布 GitHub Pages，最后逐文件核对线上内容。`assets/release.json` 记录当前发布的 Git commit。

仓库 **Settings → Pages → Build and deployment → Source** 设为 **GitHub Actions**。`github-pages` 环境的部署分支设置为 `develop`，无需额外的云服务器或 SSH 凭据。工作流仅为 Pages 发布作业授予 `contents: read`、`pages: write` 与 `id-token: write` 权限。

`scripts/package-pages.py` 在 runner 临时目录生成静态发布包，仅包含页面入口及阅读所需资源；相对资源路径和 hash 路由可直接用于仓库子路径。每次发布目录新建，校验或发布失败会直接将工作流标记为失败。

归档分支 `archive/main-before-github-pages-20261029` 保存接入前的 `main`，提交为 `f561d8e772392455ff176c93f85754c7006ea59c`。它只用于查阅或恢复，不自动部署。

## 华为云正式版本更新流程

1. 从 `develop` 创建功能分支，修改正文、资源或交互代码。可以直接在 GitHub 网页编辑并提交。
2. 功能分支通过 PR 合并至 `develop`，准备发布时在 GitHub 将 `develop` 的 PR 合并至 `main`。
3. GitHub 托管的 runner 执行内容检查、状态测试和发布测试；检查通过后打包 `index.html`、`assets/`，通过专用 SSH 身份传至服务器。
4. 服务端校验文件范围、完整包和提交号，再原子切换 `/var/www/agent-handbook/current`。
5. Actions 逐文件比对公网内容，确认线上版本与本次提交一致。

`http://139.159.249.100/assets/release.json` 显示当前部署的 Git commit。站点无需构建，部署无需重启 Nginx。

## 在 GitHub 页面发起部署

打开 [检查并部署手册](https://github.com/qinsx2002/new-coder-handbook/actions/workflows/deploy.yml)，点击 **Run workflow**，将 **Use workflow from** 设为 **develop** 发布 GitHub Pages，或设为 **main** 发布华为云，再点击 **Run workflow**。这会重新检查并发布所选分支，不需要创建新提交。

| GitHub 事件 | 执行结果 |
| --- | --- |
| 提交或合并至 `main` | 自动检查，通过后部署华为云 |
| 提交或合并至 `develop` | 自动检查，通过后部署 GitHub Pages |
| 提交至功能分支或其他分支 | 自动检查 |
| PR 目标为 `main` 或 `develop` | 自动检查 |
| 页面手动运行 `main` | 检查，通过后部署华为云 |
| 页面手动运行 `develop` | 检查，通过后部署 GitHub Pages |
| 页面手动运行其他分支 | 检查 |

所有操作由 GitHub 托管的 runner 执行，支持在 GitHub 网页上完成修改、PR 合并和部署。本机无需安装运行依赖，也无需保持开机。仓库协作者需要 **Write** 或更高权限才能提交仓库分支及手动运行工作流；其他贡献者通过 Fork 和 PR 参与。

只有 `DEPLOY_REPOSITORY` 指定的仓库可以执行部署作业。Fork 仓库默认只运行检查；外部 PR 不会获得部署凭据。

## 华为云 GitHub 配置

工作流：[deploy.yml](../.github/workflows/deploy.yml)。部署环境：`production`。

| 配置类型 | 名称 | 用途 |
| --- | --- | --- |
| Actions Secret | `DEPLOY_SSH_KEY` | 专用部署用户的 Ed25519 私钥 |
| Actions Secret | `DEPLOY_KNOWN_HOSTS` | 经现有可信 SSH 连接读取的服务器主机公钥 |
| Actions Variable | `DEPLOY_HOST` | `139.159.249.100` |
| Actions Variable | `DEPLOY_USER` | `handbook-deploy` |
| Actions Variable | `DEPLOY_REPOSITORY` | `qinsx2002/new-coder-handbook` |

私钥只写入 runner 的临时 SSH 文件，任务结束清理。主机公钥固定校验，不在每次部署时临时信任网络扫描结果。PR 不执行部署，只有主分支可以进入部署作业。

## 服务器配置

- 发布脚本：`/usr/local/lib/agent-handbook/publish.py`，由 root 管理，源码为本目录的 `publish.py`。
- 部署用户：`handbook-deploy`，拥有 `/var/www/agent-handbook` 和 `releases` 目录的写权限，无 sudo 权限。
- 公钥位于 `/var/lib/handbook-deploy/.ssh/authorized_keys`，使用 `restrict` 与强制命令：

```text
command="/usr/bin/python3 /usr/local/lib/agent-handbook/publish.py --site-root /var/www/agent-handbook",restrict ssh-ed25519 <公钥>
```

该密钥仅接收 `publish <40 位提交号>` 与标准输入中的 gzip tar 包，不支持交互 shell、SCP、端口转发。发布脚本只允许普通静态文件及目录，拒绝越界路径、符号链接和非手册目录。更新服务端发布脚本需要维护者通过既有管理员连接单独安装，工作流不会自行覆盖它。

同一主分支的 Actions 作业排队执行，服务端还使用文件锁串行切换版本。发布包接收或校验失败会保留原版本并明确失败；公网验收失败会把 Actions 标为失败，不隐式回滚。

## 发布范围

自动部署仅发布 `index.html` 与 `assets/`，使用 `/var/www/agent-handbook/releases` 保存各次版本，并通过 `current` 链接指定当前线上版本。项目说明、测试脚本及部署脚本不进入公开目录。

## 查看发布与人工回退

Actions 页面显示检查和公网验证日志，失败不会被显示为部署成功。服务器保留历史发布目录，不自动删除。

需要回退时，维护者先通过 `readlink -f /var/www/agent-handbook/current` 与 `ls /var/www/agent-handbook/releases` 确认目标，再创建临时链接并使用 `mv -Tf` 替换 `current`。回退后重新核对页面，并在 Git 中修正后续主分支内容；后续推送仍会自动发布主分支。

停止自动部署可在 GitHub Actions 页面禁用工作流；停用部署密钥可移除对应 `authorized_keys` 条目。两者均不影响已经托管的站点。
