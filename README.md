[README.md](https://github.com/user-attachments/files/25539118/README.md)
# 📊 销售数据透视分析平台

一个功能完整的销售数据分析和可视化平台，支持实时数据透视、多维度分析和数据导出。

## ✨ 主要功能

- 📈 **实时数据可视化** - 折线图、柱状图、饼图等多种图表
- 🔄 **数据透视表** - 按地区、产品等多维度透视数据
- 🔍 **高级筛选** - 按日期、地区、产品等条件筛选
- 📥 **数据导出** - 支持 CSV 格式导出
- 📊 **汇总统计** - 关键指标一览
- 🔐 **用户认证** - JWT 用户认证系统
- 📱 **响应式设计** - 支持移动端访问

## 🛠️ 技术栈

### 前端
- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Recharts** - 图表库
- **Axios** - HTTP 客户端
- **Vite** - 快速构建工具

### 后端
- **Node.js + Express** - Web 框架
- **PostgreSQL** - 数据库
- **TypeScript** - 类型安全
- **JWT** - 身份认证

### DevOps
- **Docker** - 容器化
- **Docker Compose** - 容器编排
- **GitHub Actions** - CI/CD

## 🚀 快速开始

### 前置条件
- Node.js 18+
- PostgreSQL 13+
- Docker & Docker Compose (可选)

### 安装和运行

#### 方式一：使用 Docker Compose

```bash
# 启动所有服务
docker-compose up -d

# 访问应用
# 前端: http://localhost:3000
# 后端: http://localhost:3001
```

#### 方式二：本地运行

```bash
# 1. 安装依赖
npm install

# 2. 设置数据库
# 编辑 .env 文件，配置数据库连接

# 3. 初始化数据库
psql -U postgres -d sales_analytics -f server/src/db/init.sql

# 4. 启动开发服务器
npm run dev

# 应用将在以下地址运行:
# 前端: http://localhost:5173 (Vite)
# 后端: http://localhost:3001
```

## 📁 项目结构

```
.
├── client/                 # 前端应用
│   ├── src/
│   │   ├── App.tsx        # 主组件
│   │   ├── App.css        # 样式
│   │   └── main.tsx       # 入口
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                # 后端应用
│   ├── src/
│   │   ├── index.ts       # 服务器入口
│   │   └── db/
│   │       └── init.sql   # 数据库初始化脚本
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🔗 API 端点

### 销售数据
- `GET /api/sales` - 获取销售数据列表
  - 查询参数: `startDate`, `endDate`, `region`, `product`

### 统计数据
- `GET /api/summary` - 获取统计汇总

### 透视数据
- `GET /api/pivot` - 获取透视表数据
  - 查询参数: `rows`, `columns`, `values`

### 数据导出
- `GET /api/export` - 导出 CSV 格式数据

## 🔐 环境变量

复制 `.env.example` 为 `.env` 并配置:

```env
PORT=3001
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sales_analytics
```

## 📊 示例数据

应用启动时会自动生成 500 条示例销售数据，包括:
- 多个地区 (华东、华北、华南、华西)
- 5 种产品
- 过去 90 天的销售记录

## 🧪 测试

```bash
# 运行测试
npm test

# 代码检查
npm run lint
```

## 📝 生产部署

### 构建
```bash
npm run build
```

### 运行
```bash
npm start
```

### 使用 Docker
```bash
docker-compose -f docker-compose.yml up -d --build
```

## 🐛 故障排除

### 数据库连接失败
- 检查 PostgreSQL 是否运行
- 验证 .env 中的数据库配置
- 确保数据库已创建

### 跨域错误
- 确保后端 CORS 配置正确
- 检查前端 API_BASE 地址

### 构建失败
- 清除 node_modules 和 dist 目录
- 重新安装依赖: `npm install`

## 📄 许可证

MIT License

## 👤 作者

Created by Raaaachelhu

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
