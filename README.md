# Model Preview

一个基于 React Router 和 Three.js 的现代化 3D 模型预览应用，支持多种 3D 格式和实时光照调节。

## ✨ 功能特性

### 🎨 3D 模型预览
- 🗂️ **多格式支持**：支持 glTF/GLB、OBJ、FBX、3DM、3DS、STL、PLY 等多种 3D 模型格式
- 📁 **本地文件预览**：拖拽或选择本地 3D 模型文件进行预览
- 🌐 **网络 URL 加载**：支持通过 URL 加载远程 3D 模型
- 🖱️ **交互式视角**：鼠标拖拽旋转、滚轮缩放、右键平移

### 💡 高级光照系统
- 🌅 **环境光调节**：可调节场景整体亮度
- 🔦 **相机灯光**：跟随相机的动态光源，提供稳定的主光照
- ☀️ **射灯控制**：
  - 2D 圆形控制器直观调节射灯角度
  - 可调节射灯强度（0-10）
  - 支持自定义射灯颜色（RGB 色彩选择器）

### 🎭 材质模式
- **默认材质**：显示模型原始材质和纹理
- **白膜模式**：统一白色材质，用于查看模型形态
- **反照率模式**：仅显示基础颜色，不受光照影响
- **法线模式**：可视化模型法线方向，用于调试

### 🛠️ 技术栈
- ⚛️ **React 19** - 最新版本 React 框架
- 🚦 **React Router 7** - 现代化路由解决方案
- 🎨 **Three.js** - 强大的 3D 图形库
- 🎭 **Zustand** - 轻量级状态管理
- 🌈 **Ant Design** - UI 组件库
- 🎨 **TailwindCSS 4** - 实用优先的 CSS 框架
- 📘 **TypeScript** - 类型安全保障
- ⚡ **Vite** - 快速的构建工具

## 🚀 快速开始

### 安装依赖

使用 npm 安装项目依赖：

```bash
npm install
```

或使用 pnpm：

```bash
pnpm install
```

### 启动开发服务器

启动带有 HMR （热模块替换）的开发服务器：

```bash
npm run dev
```

应用将在 `http://localhost:5173` 上运行。

## 🛠️ 使用指南

### 预览本地模型
1. 点击“本地文件”选项卡
2. 点击上传区域选择你的 3D 模型文件
3. 点击“预览模型”按钮

### 预览网络模型
1. 点击“网络连接”选项卡
2. 输入模型文件的 URL
3. 点击“预览模型”按钮

### 控制面板使用
- **材质模式**：切换不同的材质显示模式
- **相机灯**：开启/关闭相机灯并调节强度
- **环境光强度**：拖动滑块调节场景整体亮度
- **射灯强度**：拖动滑块调节射灯亮度
- **射灯颜色**：点击色块或输入十六进制颜色值
- **射灯角度**：拖动 2D 控制器中的太阳图标来调节射灯位置

### 视角控制
- **旋转**：左键拖拽
- **缩放**：滚轮
- **平移**：右键拖拽

## 📚 项目结构

```
.
├── app/
│   ├── components/
│   │   ├── BlankLayout.tsx          # 空白布局组件
│   │   ├── GlobalModelPreview.tsx   # 全局 3D 模型预览组件
│   │   └── MainLayout.tsx           # 主布局组件
│   ├── routes/
│   │   ├── blank.tsx                # 空白页面路由
│   │   ├── home.tsx                 # 主页路由
│   │   └── test1.tsx                # 测试页面路由
│   ├── store/
│   │   └── modelPreviewStore.ts     # Zustand 状态管理
│   ├── app.css                      # 全局样式
│   ├── root.tsx                     # 根组件
│   └── routes.ts                    # 路由配置
├── public/
│   └── Sun.png                      # 射灯控制器图标
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 📦 构建生产版本

创建生产环境构建：

```bash
npm run build
```

构建完成后，生成的文件将位于 `build/` 目录。

## 🚀 部署

### Docker 部署

使用 Docker 构建和运行：

```bash
# 构建镜像
docker build -t model-preview .

# 运行容器
docker run -p 3000:3000 model-preview
```

容器化应用可部署到任何支持 Docker 的平台，包括：

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### 自定义部署

如果你熟悉 Node 应用的部署，内置的应用服务器已经准备好用于生产环境。

确保部署 `npm run build` 的输出：

```
├── package.json
├── package-lock.json（或 pnpm-lock.yaml）
├── build/
│   ├── client/    # 静态资源
│   └── server/    # 服务端代码
```

启动生产服务器：

```bash
npm run start
```

## 🎭 样式自定义

该项目使用 [Tailwind CSS 4](https://tailwindcss.com/) 进行样式配置，提供了简洁的默认体验。你可以使用任何你喜欢的 CSS 框架或自定义样式。

## 📝 开发说明

### 核心组件

- **GlobalModelPreview**：主要的 3D 模型预览组件，处理 Three.js 场景初始化、模型加载、光照控制和材质切换
- **modelPreviewStore**：Zustand 状态管理，管理预览窗口的开关状态和模型 URL

### Three.js 功能

- **OrbitControls**：提供交互式相机控制
- **GLTFLoader**：加载 glTF/GLB 格式模型
- **PointLight**：点光源用于射灯和相机灯
- **AmbientLight**：环境光提供基础照明

## ✨ 特色功能

1. **高斯模糊背景**：控制面板采用高斯模糊半透明背景，既保持视觉美感又不遮挡 3D 场景
2. **相机跟随灯**：相机灯位置动态跟随相机，始终保持与模型的固定距离，提供稳定的主光照
3. **2D 射灯控制**：创新的 2D 圆形控制器，直观调节射灯的 3D 位置
4. **实时材质切换**：支持在默认、白膜、反照率和法线模式间实时切换
5. **自动模型居中**：加载模型后自动计算边界框并居中显示

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📝 许可证

MIT License

---

❤️ Built with React Router & Three.js
