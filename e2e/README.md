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

## 当前测试

套件覆盖 issue #27 的完整浏览器检查表：

- `housekeeper.smoke.spec.ts`：启动、扩展资源和控制台错误。
- `geometry.spec.ts`：不同高度、折叠节点、三种缩放级别和 Size-Min 预览。
- `flow-leveling.spec.ts`：H/V Flow 最长路径五层布局和层内顺序。
- `flow-measurement.spec.ts`：第二次运行时重新测量大小、折叠节点及预览/应用一致性。
- `history-input-color.spec.ts`：单步撤销、输入框快捷键隔离和颜色撤销。
- `panel-toast.spec.ts`：面板位置、刷新、侧栏/属性按钮碰撞和 toast 点击穿透。

最新 `origin/test` (`774ec13`) 完整 Google Chrome 结果：**16 passed, 1 failed, 1 skipped**。
唯一失败是折叠后的 Housekeeper 手柄覆盖 ComfyUI 属性按钮；legacy docked sidebar 在当前前端不存在，因此相应 resize 检查跳过。

默认运行使用 headless Chrome，避免测试窗口抢占当前桌面焦点。只有明确需要观察交互时才运行 `npm run test:headed`。

## 输出

- HTML 报告：`playwright-report/index.html`
- 失败截图、视频和 trace：`test-results/`
