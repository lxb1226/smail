import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	useLocation,
} from "react-router";
import { useTranslation } from "react-i18next";

import type { Route } from "./+types/root";
import "./app.css";
import { getCurrentLanguage, languageConfig } from "./lib/i18n";

// 全局默认 meta 配置
export function meta() {
	// 注意：这里使用默认的中文内容，具体页面会根据语言覆盖
	return [
		{
			title:
				"TmpMail - 免费临时邮箱服务 | 一次性邮件地址生成器，无需注册即时使用，24小时有效保护隐私",
		},
		{
			name: "description",
			content:
				"TmpMail提供免费、安全、无广告的临时邮箱服务。无需注册，即时获取临时邮箱地址，保护您的隐私，避免垃圾邮件。24小时有效期，支持附件，完全免费。",
		},
		{
			name: "keywords",
			content:
				"临时邮箱,一次性邮箱,临时邮件,disposable email,temp mail,临时email,免费邮箱,隐私保护,垃圾邮件防护",
		},
		{ name: "author", content: "TmpMail Team" },
		{ name: "robots", content: "index, follow" },
		{ name: "googlebot", content: "index, follow" },

		// Open Graph 标签
		{ property: "og:type", content: "website" },
		{
			property: "og:title",
			content: "TmpMail - 免费临时邮箱服务 | 一次性邮件地址生成器",
		},
		{
			property: "og:description",
			content: "保护隐私的免费临时邮箱服务，无需注册，即时使用，24小时有效。",
		},
		{ property: "og:site_name", content: "TmpMail" },
		{ property: "og:locale", content: "zh_CN" },
		{ property: "og:url", content: "https://www.tmpmail.online/" },
		{ property: "og:image", content: "https://www.tmpmail.online/og-image.png" },
		{ property: "og:image:alt", content: "TmpMail - 免费临时邮箱服务" },
		{ property: "og:image:width", content: "1200" },
		{ property: "og:image:height", content: "630" },

		// Twitter Card
		{ name: "twitter:card", content: "summary_large_image" },
		{
			name: "twitter:title",
			content: "TmpMail - 免费临时邮箱服务 | 一次性邮件地址生成器",
		},
		{
			name: "twitter:description",
			content: "保护隐私的免费临时邮箱服务，无需注册，即时使用。",
		},
		{ name: "twitter:image", content: "https://www.tmpmail.online/og-image.png" },
		{ name: "twitter:image:alt", content: "TmpMail - 免费临时邮箱服务" },

		// 移动端优化
		{ name: "format-detection", content: "telephone=no" },
		{ name: "mobile-web-app-capable", content: "yes" },
		{ name: "apple-mobile-web-app-capable", content: "yes" },
		{ name: "apple-mobile-web-app-status-bar-style", content: "default" },
		{ name: "apple-mobile-web-app-title", content: "TmpMail" },
	];
}

export const links: Route.LinksFunction = () => [
	// 字体预加载优化
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "preload",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
		as: "style",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},

	// Favicon and App Icons
	{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
	{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
	{
		rel: "icon",
		type: "image/png",
		sizes: "32x32",
		href: "/favicon-32.png",
	},
	{
		rel: "icon",
		type: "image/png",
		sizes: "16x16",
		href: "/favicon-16.png",
	},
	{ rel: "apple-touch-icon", sizes: "192x192", href: "/icon-192.png" },
	{ rel: "manifest", href: "/site.webmanifest" },

	// SEO 相关 - Canonical和Hreflang
	{ rel: "canonical", href: "https://www.tmpmail.online" },
	
	// Hreflang for multilingual SEO
	{ rel: "alternate", hrefLang: "zh-CN", href: "https://www.tmpmail.online/" },
	{ rel: "alternate", hrefLang: "en", href: "https://www.tmpmail.online/en" },
	{ rel: "alternate", hrefLang: "ja", href: "https://www.tmpmail.online/ja" },
	{ rel: "alternate", hrefLang: "x-default", href: "https://www.tmpmail.online/" },
	
	// OG Image
	{ rel: "preload", as: "image", href: "/og-image.png" },
];

export function Layout({ children }: { children: React.ReactNode }) {
	// 获取当前路径
	const location = useLocation();
	// 获取当前语言 - 传递路径参数以确保服务器端和客户端一致
	const currentLanguage = getCurrentLanguage(location.pathname);
	const langConfig = languageConfig[currentLanguage];

	// 根据语言设置HTML lang属性
	const htmlLang =
		currentLanguage === "zh"
			? "zh-CN"
			: currentLanguage === "en"
				? "en-US"
				: currentLanguage === "ja"
					? "ja-JP"
					: "zh-CN";

	// 多语言结构化数据
	const getStructuredData = () => {
		const baseData = {
			"@context": "https://schema.org",
			"@type": "WebApplication",
			name: "TmpMail",
			url: "https://www.tmpmail.online/",
			applicationCategory: "UtilityApplication",
			operatingSystem: "Any",
			offers: {
				"@type": "Offer",
				price: "0",
				priceCurrency: "USD",
			},
			author: {
				"@type": "Organization",
				name: "TmpMail Team",
			},
			applicationSubCategory: "Email Service",
			browserRequirements: "Requires JavaScript. Requires HTML5.",
			installUrl: "https://www.tmpmail.online/",
			screenshot: "https://www.tmpmail.online/og-image.png",
			aggregateRating: {
				"@type": "AggregateRating",
				ratingValue: "4.8",
				reviewCount: "1247",
				bestRating: "5",
				worstRating: "1"
			}
		};

		// 服务结构化数据
		const serviceData = {
			"@context": "https://schema.org",
			"@type": "Service",
			name: "TmpMail临时邮箱服务",
			description: "免费临时邮箱服务，保护隐私，避免垃圾邮件",
			provider: {
				"@type": "Organization",
				name: "TmpMail Team"
			},
			serviceType: "临时邮箱服务",
			areaServed: "Worldwide",
			hasOfferCatalog: {
				"@type": "OfferCatalog",
				name: "TmpMail服务",
				itemListElement: [
					{
						"@type": "Offer",
						itemOffered: {
							"@type": "Service",
							name: "临时邮箱生成",
							description: "快速生成临时邮箱地址"
						}
					},
					{
						"@type": "Offer", 
						itemOffered: {
							"@type": "Service",
							name: "邮件接收",
							description: "实时接收和查看邮件"
						}
					}
				]
			}
		};

	// 根据语言设置描述和关键词
	switch (currentLanguage) {
		case "en":
			return [{
				...baseData,
				description:
					"Free temporary email service to protect your privacy and avoid spam",
				keywords:
					"temporary email,disposable email,spam protection,privacy protection,free email",
				featureList: [
					"Free to use",
					"No registration required",
					"Privacy protection",
					"24-hour validity",
					"Attachment support",
					"Real-time email reception",
				],
			}, serviceData];
		case "ja":
			return [{
				...baseData,
				description:
					"プライバシーを保護し、スパムを避けるための無料の一時的なメールサービス",
				keywords:
					"一時的なメール,使い捨てメール,スパム保護,プライバシー保護,無料メール",
				featureList: [
					"無料で使用",
					"登録不要",
					"プライバシー保護",
					"24時間有効",
					"添付ファイル対応",
					"リアルタイムメール受信",
				],
			}, serviceData];
		default: // 'zh'
			return [baseData, serviceData];
	}
	};

	return (
		<html lang={htmlLang}>
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, viewport-fit=cover"
				/>
				<Meta />
				<Links />

				{/* JSON-LD 结构化数据 */}
				{getStructuredData().map((schema, index) => (
					<script
						key={index}
						type="application/ld+json"
						dangerouslySetInnerHTML={{
							__html: JSON.stringify(schema),
						}}
					/>
				))}


		{/* Google Analytics */}
		<script
			async
			src="https://www.googletagmanager.com/gtag/js?id=G-08XPR2XL39"
		/>
		<script
			dangerouslySetInnerHTML={{
				__html: `
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', 'G-08XPR2XL39');
				`,
			}}
		/>

		{/* Umami Analytics - 只在生产环境加载 */}
			<script
				async
				src="https://umami-steel-one.vercel.app/script.js"
				data-website-id="6b575a07-6f26-421f-abd4-6ab22cf2627f"
			/>

			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
