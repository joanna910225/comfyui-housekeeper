# ComfyUI Housekeeper Playwright Tests

使用真实 Google Chrome 测试 `http://127.0.0.1:8188/` 上的 ComfyUI Housekeeper 前端扩展。

完整设计和测试记录见：

[Nexus 项目笔记](</Users/rongfeifei/Library/Mobile Documents/iCloud~md~obsidian/Documents/Nexus/10-Life/Projects/Incubator/comfyui-housekeeper/README.md>)

## 安装

依赖已经安装。重新安装时运行：

```bash
npm install
```

## 运行

```bash
npm test
npm run test:headed
npm run test:ui
npm run report
```

自定义 ComfyUI 地址：

```bash
COMFYUI_URL=http://127.0.0.1:8188 npm test
```

## 渲染器

`COMFYUI_RENDERER` 决定这一轮跑在哪个渲染器上，默认 `canvas`（传统 litegraph 画布）：

```bash
COMFYUI_RENDERER=vue npm test    # Nodes 2.0，每个节点是一个 Vue 组件
```

helper 通过 `Comfy.VueNodes.Enabled` 设置渲染器，并在 `openComfyUI()` 里断言
`LiteGraph.vueNodesMode` 与请求一致——这个设置存在服务端，不断言的话
上一轮留下的值会静悄悄地决定这一轮真正测的是哪个渲染器。

Nodes 2.0 目前跑不过：扩展写 `node.pos` 时绕过了 litegraph 的访问器，
Vue 渲染器的布局 store 看不到这个写入，对齐后节点在屏幕上不动（#52）。
CI 里这条腿每晚跑但不作为门禁。

## 当前测试

套件覆盖 issue #27 的完整浏览器检查表：

- `housekeeper.smoke.spec.ts`：启动、扩展资源和控制台错误。
- `geometry.spec.ts`：不同高度、折叠节点、三种缩放级别和 Size-Min 预览。
- `flow-leveling.spec.ts`：H/V Flow 最长路径五层布局和层内顺序。
- `flow-measurement.spec.ts`：第二次运行时重新测量大小、折叠节点及预览/应用一致性。
- `history-input-color.spec.ts`：单步撤销、输入框快捷键隔离和颜色撤销。
- `panel-toast.spec.ts`：面板位置、刷新、侧栏/属性按钮碰撞和 toast 点击穿透。
- `panel-drag.spec.ts`：拖动手柄/标题栏、点击仍可切换、位置持久化与重置、越界钳制。
- `panel-header.spec.ts`：标题与控件在 320–1600px 各宽度下不重叠、不截断（默认 / 拖动后 / 刷新后）。

## 测试隔离

ComfyUI 把部分界面状态存在**服务端**（`user/default/comfy.settings.json`），
不是 localStorage，所以换 context 或清浏览器存储都重置不了。
任何切换右侧面板的用例都会改变后续用例的初始状态，结果因执行顺序而变：
同一份代码连续跑两次曾分别得到 2 个和 1 个失败，而单独跑这些用例都能通过。

因此 `openComfyUI()` 会先调用 `resetComfyUIState()`，
通过 `POST /api/settings` 把这些键恢复到固定基线后再导航。
基线特意让右侧面板保持关闭——这是面板定位更难的情况：
面板打开时有一大块明显的障碍物可测量，关闭时只剩右上角一小组控件需要避让。

新增依赖服务端状态的用例时，请把对应的键加入 helper 里的 `UI_STATE_BASELINE`，
否则套件会重新变得依赖执行顺序，无法作为合并门禁。

默认运行使用 headless Chrome，避免测试窗口抢占当前桌面焦点。只有明确需要观察交互时才运行 `npm run test:headed`。

## 输出

- HTML 报告：`playwright-report/index.html`
- 失败截图、视频和 trace：`test-results/`
