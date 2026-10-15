# Qwen Create Demo · 本地部署包

这是当前 Demo 的完整静态网页，包含页面、交互代码、图片、Logo 和字体。直接运行现有文件即可复现，无需重新生成界面、安装 npm 依赖或配置 API Key。

## 发给朋友的 Codex

将 ZIP 完整解压，让 Codex 打开解压后的 Qwen-Create-Demo 文件夹，然后发送：

> 请阅读这个文件夹里的 README.md，使用现有源码在本地启动这个 Demo，不要重新设计或重写页面。检查 Python 3 是否可用，运行 start.py，并保持服务运行。使用启动日志中实际打印的 localhost 地址在浏览器打开页面，检查图片、字体、侧边栏和 Auto / Image / Video 模型菜单正常加载。只需本地运行，不需要发布到公网。

## 手动启动

要求：Python 3.8 或以上，以及现代 Chrome、Edge 或 Safari 浏览器。

macOS / Linux：

```sh
cd Qwen-Create-Demo
python3 start.py --open
```

Windows：

```powershell
cd Qwen-Create-Demo
py -3 start.py --open
```

如果 Windows 没有 py 命令但已有 Python，可使用 python start.py --open。如未安装 Python，请通过 Python 官方安装程序安装后重试。

默认地址为 http://127.0.0.1:8767/。端口被占用时会自动尝试后续端口，请以终端打印的地址为准。也可指定 python3 start.py --port 9000。保持终端运行，Ctrl+C 停止服务。

不要只复制 README，也不要只双击 HTML；需要保留整个 dist 文件夹并通过本地 HTTP 服务运行。

## 包内内容

- dist/：可直接运行的 HTML、CSS、JavaScript 和全部静态资源。
- start.py：仅依赖 Python 标准库的本地启动器，绑定 127.0.0.1。
- README.md：本说明。
- SHA256SUMS.json：文件校验值，方便核对分享包完整性。

## 可以体验的交互

- 网页素材 hover 收藏、拖入千问入口收藏、文件夹选择和新建。
- 侧边栏展开/收起、会话切换、新建会话、File / Assets / Photo 上传、拖入参考素材。
- 紧凑的 Auto / Image / Video 菜单，Image 和 Video 分别选择并记住各自模型。
- 英文 Optimize Prompt、横向滚动工具胶囊。
- AI Analysis、Transcript、Remake、Hooks、Script、Localization 六个胶囊，包含简短结果概括、Markdown 编辑/下载和相应的多轮引导；Localization 包含分析、Video Redo 本土化方案与脚本三个阶段。
- 默认发送需求：分析上传参考 → 生成创作脚本 → 去 Qwen Create 创作。Thinking 为静态文字，建议回复竖向排列。
- “去 Qwen Create 创作”和 Open in app 在新标签跳转到指定的 Qwen Create 会话页面；收藏成功 toast 的“查看收藏”跳转到指定的主端 Assets 页面。此 Demo 仅执行固定 URL 跳转，不向主端同步本地收藏或会话数据。

## 与原 Demo 的一致性

代码、素材和交互均来自现有 Demo，没有根据文字重新搭建。字体已随包保存，启动后不依赖 Google Fonts 网络请求。为对比视觉效果，使用相同浏览器、100% 缩放和相近窗口尺寸；页面本身会根据窗口尺寸自适应，不同系统的中文系统字体渲染可能略有差异。

此包复现当前 Demo：网页视频使用静态封面，分析、复刻、自动模型判断和生成均为模拟交互，不调用真实 AI 服务、不扣费。模型名称仍为原 Demo 的占位名称。

收藏保存在各自浏览器的 localStorage 中；朋友首次运行会使用默认收藏夹，未包含发送者浏览器里的收藏记录、临时上传文件或当前会话。会话和上传参考在刷新后重置，行为与原 Demo 一致。字体许可证保存在 dist/assets/fonts/ 中。
