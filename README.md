# 高旭辰 · 个人主页

一个纯静态的个人主页（HTML / CSS / JS，零依赖、零构建），用于整理项目作品、竞赛经历与联系方式。

```
portfolio/
├── index.html          页面结构（含全部文案）
├── assets/
│   ├── styles.css      设计系统与样式
│   └── main.js         主题切换 / 滚动动效 / 导航滑块与进度 / 一键复制
└── README.md
```

本地预览：直接双击 `index.html`，或在当前目录执行

```bash
python -m http.server 8080
# 然后打开 http://localhost:8080
```

---

## 零、想改样子时看这里

所有视觉参数都集中在 `assets/styles.css` 顶部的 `:root` 里，改那几行就能整体换调性：

| 变量 | 作用 |
| --- | --- |
| `--bg` / `--bg-soft` / `--surface` | 三层底色（页面 / 交替区块 / 卡片） |
| `--ink` / `--ink-2` / `--ink-3` / `--muted` | 四级文字色，从主标题到最浅的说明文字 |
| `--accent` / `--accent-soft` / `--accent-line` | 全站唯一的强调色相（标记、链接、悬停） |
| `--container` | 版心宽度，默认 `1140px` |
| `--r-*` / `--shadow-*` | 圆角与四级标高 |

- `--muted` 是正文级的最小灰度，**不要再调浅**，否则会低于 WCAG AA 的 4.5:1 对比度。
- 页脚的「最后更新」在 `index.html` 最底部，改文案时顺手改一下日期。
- 卡片序号 `P01 / P02 …` 是 CSS 计数器（`counter-reset: proj`）自动生成的，
  **在中间插入新项目不用手动改后面的编号**。

---

## 一、上线前请确认

| 位置 | 当前值 | 说明 |
| --- | --- | --- |
| 顶部按钮 / 联系方式 | `hzqtgxc@163.com` | 已填真实邮箱 |
| 顶部按钮 / 联系方式 | `github.com/cn-gxc` | 已填真实账号 |
| 联系方式 | `2476157252` | QQ，默认公开显示 |
| `index.html` 页脚 | 「最后更新 · 2026 年 9 月 16 日」 | 有更新时改一下 |

**关于项目链接**：目前讲稿、实验记录和代码都还没放到线上，所以项目卡片底部没有外链，
页面里也没有任何「代码已开源」之类的描述，不会出现点不开的死链接。
之后如果想把某个项目放上文档站或开源，在对应的 `<article class="card project-card">` 里补一行即可：

```html
<p class="project-links"><a class="link-arrow" href="真实链接" target="_blank" rel="noopener">查看报告</a></p>
```

并给 `assets/styles.css` 补上 `.project-links` / `.link-arrow` 两组样式。

**隐私提醒**：页面只放了邮箱、GitHub、QQ 和所在城市，没有手机号、学籍号等敏感信息。
如果不想公开 QQ，删掉 `index.html` 里含 `data-copy="2476157252"` 的整个 `<li class="contact-row">` 即可。

---

## 二、免费部署方案

下面三种都是免费的，按「省事程度」从易到难排列，任选一种即可。

### 方案 A · Netlify Drop（最快，不用 Git，约 1 分钟）

1. 打开 <https://app.netlify.com/drop>
2. 把整个 `portfolio` 文件夹直接拖进浏览器窗口
3. 几秒后拿到一个公开链接，形如 `https://random-name-123.netlify.app`
4. 注册一个免费账号可以把链接固定下来，并在后台改成 `https://gaoxuchen.netlify.app` 之类的名字
5. 想更新：把新文件夹再拖一次即可覆盖

**优点**：零门槛、自带 HTTPS、自带 CDN。
**注意**：默认域名比较长，建议注册后改成自定义子域名。

---

### 方案 B · GitHub Pages（最通用，推荐）

**第 1 步：建仓库**

登录 GitHub → 右上角 `+` → `New repository`
- 仓库名填 `gaoxuchen.github.io`（把 `gaoxuchen` 换成你的 GitHub 用户名）
- 勾选 `Public`（Pages 免费版要求公开仓库）
- 不要勾选任何初始化文件 → `Create repository`

> 仓库名用 `<用户名>.github.io` 时，网址就是 `https://<用户名>.github.io/`，最干净。
> 如果用了别的仓库名（例如 `portfolio`），网址会是 `https://<用户名>.github.io/portfolio/`。

**第 2 步：上传文件**

在本地 `portfolio` 目录执行（把地址换成你自己的）：

```bash
git init
git add .
git commit -m "Add personal homepage"
git branch -M main
git remote add origin https://github.com/gaoxuchen/gaoxuchen.github.io.git
git push -u origin main
```

或者完全不用命令行：在仓库页面点 `Add file` → `Upload files`，把 `index.html` 和 `assets/` 文件夹一起拖进去。

**第 3 步：开启 Pages**

仓库页面 → `Settings` → 左侧 `Pages`
- `Source` 选 `Deploy from a branch`
- `Branch` 选 `main`，目录选 `/ (root)` → `Save`

**第 4 步：等待 1–2 分钟**

刷新 `Settings → Pages`，顶部会出现绿色提示与公开链接：
`https://gaoxuchen.github.io/`

**以后更新**：改完文件 `git add . && git commit -m "update" && git push`，1 分钟内自动生效。

---

### 方案 C · Cloudflare Pages（国内访问通常比 GitHub Pages 快）

1. 把代码传到 GitHub 仓库（同上第 1、2 步）
2. 打开 <https://dash.cloudflare.com/> → 左侧 `Workers & Pages` → `Create` → `Pages` → `Connect to Git`
3. 授权选择刚才的仓库
4. 构建配置全部留空：
   - Framework preset：`None`
   - Build command：**留空**
   - Build output directory：`/`
5. 点 `Save and Deploy`，几十秒后得到 `https://<项目名>.pages.dev`

也可以不接 Git，直接把文件夹拖到 Cloudflare Pages 的 `Upload assets` 入口，效果同 Netlify Drop。

---

### 方案 D · Gitee Pages（国内服务器，但有限制）

1. 在 <https://gitee.com> 建仓库并推送文件
2. 仓库 → `服务` → `Gitee Pages`
3. 部署分支选 `master` 或 `main`，部署目录留空 → 勾选 `强制使用 HTTPS` → `启动`

**注意**：Gitee Pages 免费版需要实名认证，且每次更新代码后要手动点一次「更新」才会重新发布；仓库必须公开。国内校园网访问速度不错，但流程比前几种麻烦。

---

## 三、几个小建议

- **域名**：上面几种方式都自带免费域名。如果以后想用 `gaoxuchen.com` 这类独立域名，Cloudflare Pages 和 GitHub Pages 都支持绑定，域名本身需要按年付费（约 ¥60–80/年），托管依然免费。
- **隐私**：页面里没有放手机号、学籍号等敏感信息，只有邮箱和 GitHub。邮箱如果不想公开，可以换成 `GitHub 主页` + `Issues` 作为联系方式。
- **国内访问**：`*.github.io` 在部分网络环境下会不稳定，若担心评审打不开，**建议同时部署到 Cloudflare Pages 与 GitHub Pages**，两个链接都留着，哪个通用哪个。
- **验证**：部署完成后，用手机流量（不是校园网 / 家庭 Wi-Fi）打开一次，确认外网可访问。
