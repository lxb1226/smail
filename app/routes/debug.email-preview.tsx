import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

// 模拟邮件数据
const mockEmails = [
  {
    id: "1",
    fromAddress: "test@example.com",
    toAddress: "user@tmpmail.online",
    subject: "测试邮件 - HTML内容",
    htmlContent: `
      <h1>欢迎使用我们的服务</h1>
      <p>这是一封包含<strong>HTML内容</strong>的测试邮件。</p>
      <blockquote>
        这是一个引用块，用来测试样式效果。
      </blockquote>
      <p>这里有一个链接：<a href="https://example.com">点击访问</a></p>
      <ul>
        <li>列表项目 1</li>
        <li>列表项目 2</li>
        <li>列表项目 3</li>
      </ul>
      <pre><code>// 这是代码块
function hello() {
  console.log("Hello World!");
}</code></pre>
      <table>
        <thead>
          <tr>
            <th>姓名</th>
            <th>邮箱</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>张三</td>
            <td>zhangsan@example.com</td>
            <td>活跃</td>
          </tr>
          <tr>
            <td>李四</td>
            <td>lisi@example.com</td>
            <td>待激活</td>
          </tr>
        </tbody>
      </table>
    `,
    textContent: null,
    receivedAt: new Date(),
    isRead: false,
    size: 2048
  },
  {
    id: "2",
    fromAddress: "newsletter@company.com",
    toAddress: "user@tmpmail.online",
    subject: "Newsletter - Rich Content",
    htmlContent: `
      <div style="font-family: Arial, sans-serif;">
        <h2 style="color: #2563eb;">Monthly Newsletter</h2>
        <p>Dear valued customer,</p>
        <p>We're excited to share our latest updates with you:</p>
        <hr>
        <h3>New Features</h3>
        <ol>
          <li><strong>Enhanced Security</strong> - We've implemented advanced encryption</li>
          <li><strong>Better Performance</strong> - 50% faster loading times</li>
          <li><strong>Mobile Optimization</strong> - Improved mobile experience</li>
        </ol>
        <blockquote style="border-left: 4px solid #2563eb; padding-left: 16px; margin: 20px 0; font-style: italic;">
          "This update represents our commitment to providing the best user experience possible."
          <br><em>- Product Team</em>
        </blockquote>
        <p>For more information, visit our <a href="https://example.com/docs" style="color: #2563eb;">documentation</a>.</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4>Quick Stats</h4>
          <ul>
            <li>99.9% Uptime</li>
            <li>1M+ Active Users</li>
            <li>24/7 Support</li>
          </ul>
        </div>
      </div>
    `,
    textContent: null,
    receivedAt: new Date(Date.now() - 3600000),
    isRead: true,
    size: 4096
  },
  {
    id: "3",
    fromAddress: "noreply@service.com",
    toAddress: "user@tmpmail.online",
    subject: "纯文本邮件测试",
    htmlContent: null,
    textContent: `这是一封纯文本邮件。

它包含多个段落，用来测试文本内容的渲染效果。

第二段内容，包含一些特殊字符：
- 项目符号
- 另一个项目

联系我们：support@service.com
网站：https://service.com

感谢您的使用！`,
    receivedAt: new Date(Date.now() - 7200000),
    isRead: false,
    size: 512
  }
];

// 生成邮件HTML的函数（复制自mail.$id.tsx）
function generateEmailHTML(
  email: {
    fromAddress: string;
    toAddress: string;
    subject?: string | null;
    htmlContent?: string | null;
    textContent?: string | null;
    receivedAt: Date;
  },
  title: string = "邮件内容"
) {
  const content = email.htmlContent || (email.textContent ? `<pre style="white-space: pre-wrap; font-family: inherit;">${email.textContent}</pre>` : '<p>无内容</p>');
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #1f2937;
          margin: 0;
          padding: 0;
          min-height: 100vh;
          background: linear-gradient(to bottom right, #dbeafe, #cffafe, #dbeafe);
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        .email-content {
          background: white;
          padding: 2rem;
          border-radius: 0.625rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          border: 0;
        }
        h1, h2, h3, h4, h5, h6 {
          color: #1f2937;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        p {
          margin-bottom: 1rem;
          color: #374151;
        }
        img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
        a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
        }
        a:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }
        blockquote {
          border-left: 4px solid #2563eb;
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
          color: #4b5563;
          background: #f8fafc;
          border-radius: 0.5rem;
          font-style: italic;
        }
        pre, code {
          background: #f1f5f9;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          color: #334155;
          border: 1px solid #e2e8f0;
        }
        code {
          padding: 0.25rem 0.5rem;
          display: inline;
          font-size: 0.875rem;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }
        th, td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
        }
        ul, ol {
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        li {
          margin-bottom: 0.5rem;
          color: #374151;
        }
        hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 2rem 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="email-content">
          ${content}
        </div>
      </div>
    </body>
    </html>
  `;
}

export function meta() {
  return [
    { title: "邮件样式调试页面 - TmpMail" },
    { name: "description", content: "用于测试邮件内容渲染样式的调试页面" },
    { name: "robots", content: "noindex, nofollow" }
  ];
}

export default function EmailPreviewDebug() {
  const { t } = useTranslation("mail");
  const [selectedEmail, setSelectedEmail] = React.useState(mockEmails[0]);

  const emailHTML = generateEmailHTML(selectedEmail);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button asChild variant="ghost" size="sm">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回首页
                </Link>
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              邮件样式调试页面
            </h1>
            <p className="text-gray-600">
              用于测试和预览邮件内容的渲染效果，确保样式与网站整体设计保持一致。
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 左侧：邮件列表 */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">测试邮件列表</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockEmails.map((email) => (
                    <div
                      key={email.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedEmail.id === email.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedEmail(email)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {email.subject}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {email.fromAddress}
                          </p>
                        </div>
                        <Badge
                          variant={email.isRead ? "secondary" : "default"}
                          className="text-xs ml-2"
                        >
                          {email.isRead ? "已读" : "未读"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {email.htmlContent ? "HTML" : "文本"}
                        </span>
                        <span>
                          {Math.round(email.size / 1024)}KB
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* 右侧：邮件预览 */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg mb-2">
                        {selectedEmail.subject}
                      </CardTitle>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div>
                          <strong>发件人：</strong> {selectedEmail.fromAddress}
                        </div>
                        <div>
                          <strong>收件人：</strong> {selectedEmail.toAddress}
                        </div>
                        <div>
                          <strong>时间：</strong> {selectedEmail.receivedAt.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={selectedEmail.isRead ? "secondary" : "default"}
                      >
                        {selectedEmail.isRead ? "已读" : "未读"}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {Math.round(selectedEmail.size / 1024)}KB
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-96 lg:h-[600px]">
                    <iframe
                      srcDoc={emailHTML}
                      className="w-full h-full border-0 rounded-b-lg"
                      sandbox="allow-same-origin"
                      title="邮件内容预览"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 底部说明 */}
          <div className="mt-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">样式说明</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">设计特点</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• 使用与网站一致的渐变背景</li>
                      <li>• 现代化的卡片设计和阴影效果</li>
                      <li>• 统一的颜色方案和字体样式</li>
                      <li>• 响应式布局，适配各种屏幕</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">支持的元素</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• 标题、段落、链接</li>
                      <li>• 引用块、代码块</li>
                      <li>• 表格、列表</li>
                      <li>• 图片、分隔线</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}