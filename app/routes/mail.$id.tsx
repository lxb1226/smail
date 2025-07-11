import {
	ArrowLeft,
	Download,
	File,
	FileText,
	Image,
	Loader2,
	Paperclip,
} from "lucide-react";
import React from "react";
import { Link, data, useNavigation } from "react-router";
import { useTranslation } from "react-i18next";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
	createDB,
	getEmailAttachments,
	getEmailById,
	markEmailAsRead,
} from "~/lib/db";

import type { Route } from "./+types/mail.$id";

// 生成邮件 HTML 内容
function generateEmailHTML(
	email: {
		fromAddress: string;
		toAddress: string;
		subject?: string | null;
		htmlContent?: string | null;
		textContent?: string | null;
		receivedAt: Date;
	},
	title: string = "邮件内容",
) {
	const content =
		email.htmlContent || email.textContent?.replace(/\n/g, "<br>") || "";

	return `
		<!DOCTYPE html>
		<html>
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
					word-wrap: break-word;
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
					white-space: pre-wrap;
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
			<script>
				// 自动调整 iframe 高度
				function resizeIframe() {
					const height = document.body.scrollHeight;
					window.parent.postMessage({ type: 'resize', height }, '*');
				}
				
				// 页面加载完成后调整高度
				if (document.readyState === 'loading') {
					document.addEventListener('DOMContentLoaded', resizeIframe);
				} else {
					resizeIframe();
				}
				
				// 监听内容变化
				const observer = new MutationObserver(resizeIframe);
				observer.observe(document.body, { 
					childList: true, 
					subtree: true,
					attributes: true 
				});
			</script>
		</body>
		</html>
	`;
}

// 根据文件类型返回图标
function getFileIcon(filename?: string | null, contentType?: string | null) {
	if (!filename && !contentType) return <File className="w-4 h-4" />;

	const extension = filename?.toLowerCase().split(".").pop();
	const mimeType = contentType?.toLowerCase();

	if (
		mimeType?.startsWith("image/") ||
		["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")
	) {
		return <Image className="w-4 h-4" />;
	}

	if (
		mimeType?.includes("text/") ||
		["txt", "md", "html", "css", "js", "json"].includes(extension || "")
	) {
		return <FileText className="w-4 h-4" />;
	}

	return <File className="w-4 h-4" />;
}

// 格式化文件大小
function formatFileSize(t: any, bytes?: number | null) {
	if (!bytes) return t("mail.errors.unknownSize");
	const sizes = ["Bytes", "KB", "MB", "GB"];
	if (bytes === 0) return "0 Bytes";
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${Math.round((bytes / 1024 ** i) * 100) / 100} ${sizes[i]}`;
}

export function meta({ data }: Route.MetaArgs) {
	// Note: meta函数无法直接使用useTranslation，需要在应用层面处理i18n
	// 这里暂时保留硬编码，或者考虑从data中传递翻译后的文本
	if (!data?.email) {
		return [
			{ title: "邮件详情 - TmpMail临时邮箱" },
			{
				name: "description",
				content: "查看您在TmpMail临时邮箱中收到的邮件详情。",
			},
			// 即使是404页面也要阻止索引
			{
				name: "robots",
				content: "noindex, nofollow, noarchive, nosnippet, noimageindex",
			},
			{
				name: "googlebot",
				content: "noindex, nofollow, noarchive, nosnippet, noimageindex",
			},
			{
				name: "bingbot",
				content: "noindex, nofollow, noarchive, nosnippet, noimageindex",
			},
		];
	}

	const { email } = data;
	const fromDomain = email.fromAddress.split("@")[1] || "未知发件人";
	const shortSubject = email.subject?.substring(0, 30) || "无主题";

	return [
		{ title: `${shortSubject} - 来自${fromDomain}的邮件 | TmpMail临时邮箱` },
		{
			name: "description",
			content: `查看来自${email.fromAddress}的邮件"${email.subject || "无主题"}"。接收时间：${new Date(email.receivedAt).toLocaleDateString("zh-CN")}。`,
		},
		// 阻止搜索引擎索引邮件内容页面
		{
			name: "robots",
			content: "noindex, nofollow, noarchive, nosnippet, noimageindex",
		},
		{
			name: "googlebot",
			content: "noindex, nofollow, noarchive, nosnippet, noimageindex",
		},
		{
			name: "bingbot",
			content: "noindex, nofollow, noarchive, nosnippet, noimageindex",
		},
		// 阻止缓存
		{
			"http-equiv": "cache-control",
			content: "no-cache, no-store, must-revalidate",
		},
		{ "http-equiv": "pragma", content: "no-cache" },
		{ "http-equiv": "expires", content: "0" },
	];
}

export async function loader({ params, context }: Route.LoaderArgs) {
	const { id } = params;

	// Note: loader函数无法直接使用useTranslation，错误消息暂时保留硬编码
	// 或者考虑从context中获取语言设置来选择错误消息
	if (!id) {
		throw new Response("邮件 ID 是必需的", { status: 400 });
	}

	try {
		const db = createDB();

		// 获取邮件详情
		const email = await getEmailById(db, id);

		if (!email) {
			throw new Response("邮件未找到", { status: 404 });
		}

		// 获取附件列表
		const attachments = await getEmailAttachments(db, id);

		// 标记邮件为已读
		if (!email.isRead) {
			await markEmailAsRead(db, id);
		}

		// 生成邮件 HTML 内容
		const emailHTML = generateEmailHTML(email);

		return data({
			email,
			attachments,
			emailHTML,
		});
	} catch (error) {
		console.error("Error loading email:", error);

		if (error instanceof Response) {
			throw error;
		}

		throw new Response("服务器错误", { status: 500 });
	}
}

export default function MailDetail({ loaderData }: Route.ComponentProps) {
	const { t, i18n } = useTranslation("mail");
	const navigation = useNavigation();
	const { email, attachments, emailHTML } = loaderData;

	// 格式化日期
	const locale =
		i18n.language === "en"
			? "en-US"
			: i18n.language === "ja"
				? "ja-JP"
				: "zh-CN";
	const formattedDate = new Date(email.receivedAt).toLocaleString(locale, {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});

	// 处理 iframe 高度调整
	const handleIframeMessage = React.useCallback((event: MessageEvent) => {
		if (event.data.type === "resize") {
			const iframe = document.getElementById(
				"email-content-iframe",
			) as HTMLIFrameElement;
			if (iframe) {
				iframe.style.height = `${event.data.height}px`;
			}
		}
	}, []);

	// 监听来自 iframe 的消息
	React.useEffect(() => {
		window.addEventListener("message", handleIframeMessage);
		return () => window.removeEventListener("message", handleIframeMessage);
	}, [handleIframeMessage]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50">
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				<div className="h-[calc(100vh-8rem)] bg-white rounded-lg shadow-lg border-0 overflow-hidden flex flex-col">
					{/* Header */}
					<header className="bg-white border-b px-3 sm:px-4 py-3 shrink-0">
						<div className="w-full flex items-center justify-between">
					<div className="flex items-center gap-2 sm:gap-3">
						<Button
							asChild
							variant="ghost"
							size="sm"
							className="text-xs sm:text-sm p-1 sm:p-2"
						>
							<Link to="/">
								<ArrowLeft className="w-3 sm:w-4 h-3 sm:h-4" />
								<span className="hidden sm:inline ml-1">
									{t("backToInbox")}
								</span>
								<span className="sm:hidden">{t("back")}</span>
							</Link>
						</Button>
						<Separator orientation="vertical" className="h-4 sm:h-6" />
						<span className="text-xs sm:text-sm text-gray-600">
							{t("detail")}
						</span>
					</div>

					<div className="flex items-center gap-2">
						{navigation.state === "loading" && (
							<Loader2 className="w-3 sm:w-4 h-3 sm:h-4 animate-spin" />
						)}
					</div>
				</div>
			</header>

			{/* Email Header - Compact */}
			<div className="bg-white border-b px-3 sm:px-4 py-3 shrink-0">
				<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
					<div className="flex-1 min-w-0">
						<h1 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 break-words">
							{email.subject || t("noSubject")}
						</h1>
						<div className="space-y-1 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-4 text-xs sm:text-sm text-gray-600">
							<div className="truncate">
								<strong>{t("from")}:</strong> {email.fromAddress}
							</div>
							<div className="truncate">
								<strong>{t("to")}:</strong> {email.toAddress}
							</div>
							<div>
								<strong>{t("time")}:</strong> {formattedDate}
							</div>
						</div>
					</div>

					<div className="flex items-center gap-2 flex-shrink-0">
						<Badge
							variant={email.isRead ? "secondary" : "default"}
							className="text-xs"
						>
							{email.isRead ? t("read") : t("unread")}
						</Badge>
						<span className="text-xs text-gray-500">
							{formatFileSize(t, email.size)}
						</span>
					</div>
				</div>

				{/* Attachments - Compact */}
				{attachments.length > 0 && (
					<div className="mt-3 pt-3 border-t">
						<div className="flex items-center gap-2 mb-2">
							<Paperclip className="w-3 sm:w-4 h-3 sm:h-4" />
							<span className="text-xs sm:text-sm font-medium">
								{t("attachments", { count: attachments.length })}
							</span>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
							{attachments.map((attachment) => (
								<div
								key={attachment.id}
								className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow text-xs"
							>
									{getFileIcon(attachment.filename, attachment.contentType)}
									<div className="flex-1 min-w-0">
										<div className="truncate font-medium">
											{attachment.filename || t("unnamedAttachment")}
										</div>
										<div className="text-gray-500 text-xs">
											{formatFileSize(t, attachment.size)}
										</div>
									</div>
									{attachment.uploadStatus === "uploaded" ? (
										<a
											href={`/attachment/${attachment.id}`}
											className="inline-flex items-center justify-center h-6 w-6 p-0 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground flex-shrink-0"
											title={t("downloadAttachment")}
										>
											<Download className="w-3 h-3" />
										</a>
									) : (
										<span className="text-xs text-gray-400 flex-shrink-0">
											{attachment.uploadStatus === "pending"
												? t("processing")
												: t("failed")}
										</span>
									)}
								</div>
							))}
						</div>
					</div>
				)}
			</div>

					{/* Email Content - Full Height */}
					<div className="flex-1 min-h-0 p-4">
						<div className="h-full bg-white rounded-lg shadow-lg border-0 overflow-hidden">
							<iframe
								id="email-content-iframe"
								srcDoc={emailHTML}
								className="w-full h-full border-0"
								sandbox="allow-same-origin"
								title={t("content")}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
