# Umami 分析配置指南

本项目集成了 Umami 网站分析工具，用于收集网站访问数据和用户行为分析。

## 什么是 Umami

Umami 是一个开源的网站分析工具，具有以下特点：
- 🔒 隐私友好，不使用 cookies
- 🚀 轻量级，加载速度快
- 📊 提供详细的访问统计
- 🌍 支持自托管
- 💰 免费使用

## 配置步骤

### 1. 获取 Umami 网站 ID

#### 选项 A：使用 Umami Cloud（推荐）
1. 访问 [Umami Cloud](https://analytics.umami.is/)
2. 注册账户并登录
3. 点击「Add Website」添加网站
4. 输入网站信息（域名：tmpmail.online）
5. 复制生成的 Website ID

#### 选项 B：自托管 Umami
1. 按照 [Umami 官方文档](https://umami.is/docs) 部署自己的实例
2. 在控制台中添加网站
3. 获取 Website ID 和脚本 URL

### 2. 配置环境变量

#### 开发环境配置
1. 复制 `.dev.vars.example` 为 `.dev.vars`：
   ```bash
   cp .dev.vars.example .dev.vars
   ```

2. 编辑 `.dev.vars` 文件，填入 Umami 配置：
   ```bash
   # Umami 分析配置
   VITE_UMAMI_WEBSITE_ID=your_actual_website_id_here
   VITE_UMAMI_SCRIPT_URL=https://analytics.umami.is/script.js
   ```

#### 生产环境配置（Cloudflare）
1. 复制 `wrangler.example.jsonc` 为 `wrangler.jsonc`：
   ```bash
   cp wrangler.example.jsonc wrangler.jsonc
   ```

2. 编辑 `wrangler.jsonc` 文件中的 `vars` 部分：
   ```json
   {
     "vars": {
       "VITE_UMAMI_WEBSITE_ID": "your_actual_website_id_here",
       "VITE_UMAMI_SCRIPT_URL": "https://analytics.umami.is/script.js"
     }
   }
   ```

3. 部署到 Cloudflare：
   ```bash
   npm run deploy
   ```

### 3. 验证配置

1. 启动开发服务器：
   ```bash
   npm run dev
   ```

2. 在开发模式下，Umami 脚本不会加载（这是预期行为）

3. 部署到生产环境后，检查浏览器开发者工具：
   - 在 Network 标签中应该能看到 Umami 脚本的加载
   - 在 Console 中不应该有相关错误

4. 在 Umami 控制台中查看实时访问数据

## 环境变量说明

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `VITE_UMAMI_WEBSITE_ID` | Umami 网站 ID（必需） | `12345678-1234-1234-1234-123456789abc` |
| `VITE_UMAMI_SCRIPT_URL` | Umami 脚本 URL（可选） | `https://analytics.umami.is/script.js` |

## 工作原理

1. **环境检测**：只在生产环境（`import.meta.env.PROD === true`）下加载 Umami 脚本
2. **条件加载**：只有当 `VITE_UMAMI_WEBSITE_ID` 环境变量存在时才加载脚本
3. **脚本注入**：在 HTML `<head>` 中动态注入 Umami 跟踪脚本
4. **数据收集**：Umami 自动收集页面访问、用户行为等数据

## 开发模式说明

为了避免开发过程中产生测试数据污染分析结果，Umami 脚本在以下情况下不会加载：
- 开发环境（`import.meta.env.PROD === false`）
- 未配置 `VITE_UMAMI_WEBSITE_ID` 环境变量

## 故障排除

### 脚本未加载
1. **检查环境变量配置**：
   - 开发环境：确认 `.dev.vars` 文件中的变量设置
   - 生产环境：确认 `wrangler.jsonc` 文件中的 `vars` 配置
2. **确认环境状态**：检查是否在生产环境（`import.meta.env.PROD === true`）
3. **验证 Website ID**：确认从 Umami 控制台获取的 ID 是否有效

### 数据未显示
1. **等待数据同步**：Umami 数据可能有 1-5 分钟的延迟
2. **检查网站配置**：在 Umami 控制台中确认网站域名设置
3. **验证部署状态**：确认 Cloudflare 部署成功且环境变量生效

### Cloudflare 部署问题
1. **环境变量未生效**：
   ```bash
   # 检查部署状态
   npx wrangler tail
   # 重新部署
   npm run deploy
   ```
2. **配置文件错误**：检查 `wrangler.jsonc` 语法是否正确
3. **权限问题**：确认 Cloudflare 账户权限和 API Token 配置

### 控制台错误
1. **脚本加载失败**：检查 Umami 脚本 URL 是否可访问
2. **Website ID 格式错误**：确认 ID 格式为 UUID 格式
3. **网络问题**：检查 CDN 和防火墙设置

## 隐私说明

Umami 是隐私友好的分析工具：
- 不使用 cookies
- 不收集个人身份信息
- 数据匿名化处理
- 符合 GDPR 要求

## 相关链接

- [Umami 官网](https://umami.is/)
- [Umami 文档](https://umami.is/docs)
- [Umami GitHub](https://github.com/umami-software/umami)
- [Umami Cloud](https://analytics.umami.is/)