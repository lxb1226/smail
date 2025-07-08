import randomName from "@scaleway/random-name";
import { Loader2Icon, Mail, RefreshCcwIcon } from "lucide-react";
import { customAlphabet } from "nanoid";
import React from "react";
import { useTranslation } from "react-i18next";
import {
	Form,
	Link,
	data,
	redirect,
	useNavigation,
	useRevalidator,
} from "react-router";

import { commitSession, getSession } from "~/.server/session";
import { CopyButton } from "~/components/copy-button";
import { MailItem } from "~/components/mail-item";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
	createDB,
	getEmailsByAddress,
	getMailboxStats,
	getOrCreateMailbox,
} from "~/lib/db";

import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
	return [
		{
			title:
				"TmpMail - 免费临时邮箱生成器 | 一次性邮箱地址生成 | 24小时有效保护隐私",
		},
		{
			name: "description",
			content:
				"TmpMail提供最专业的免费临时邮箱服务，无需注册即可获得一次性邮件地址。24小时有效期，支持附件下载，完全匿名保护隐私。告别垃圾邮件，立即免费使用临时邮箱！",
		},
		{
			name: "keywords",
			content:
				"临时邮箱,一次性邮箱,临时邮件,临时email,免费邮箱,隐私保护,垃圾邮件防护,临时邮箱网站,免费临时邮箱,临时邮箱服务,24小时邮箱,无需注册邮箱",
		},

		// Open Graph 优化
		{
			property: "og:title",
			content: "TmpMail - 免费临时邮箱生成器 | 一次性邮件地址",
		},
		{
			property: "og:description",
			content:
				"保护隐私的免费临时邮箱，无需注册，即时使用，24小时有效，支持附件下载。",
		},
		{ property: "og:type", content: "website" },
		{ property: "og:url", content: "https://smail.pw" },
		{ property: "og:site_name", content: "TmpMail" },
		{ property: "og:locale", content: "zh_CN" },

		// Twitter Card
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: "TmpMail - 免费临时邮箱生成器" },
		{
			name: "twitter:description",
			content: "保护隐私的免费临时邮箱，无需注册，即时使用。",
		},

		// 额外的SEO优化
		{
			name: "robots",
			content:
				"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
		},
		{ name: "googlebot", content: "index, follow" },
		{ name: "bingbot", content: "index, follow" },
		{ name: "format-detection", content: "telephone=no" },
		{ name: "theme-color", content: "#2563eb" },

		// 结构化数据
		{ name: "application-name", content: "TmpMail" },
		{ name: "apple-mobile-web-app-title", content: "TmpMail" },
		{ name: "msapplication-TileColor", content: "#2563eb" },
	];
}

function generateEmail(domain: string = "tmpmail.online") {
	const name = randomName();
	const random = customAlphabet("0123456789", 4)();
	return `${name}-${random}@${domain}`;
}

export async function loader({ request, context }: Route.LoaderArgs) {
	const session = await getSession(request.headers.get("Cookie"));
	let email = session.get("email");

	if (!email) {
		const emailDomain = process.env.EMAIL_DOMAIN || "tmpmail.online";
		email = generateEmail(emailDomain);
		session.set("email", email);
		return data(
			{
				email,
				mails: [],
				stats: { total: 0, unread: 0 },
			},
			{
				headers: {
					"Set-Cookie": await commitSession(session),
				},
			},
		);
	}

	try {
		// 创建数据库连接
		const db = createDB();

		// 获取或创建邮箱
		const mailbox = await getOrCreateMailbox(db, email);

		// 获取邮件列表
		const emails = await getEmailsByAddress(db, email);

		// 获取统计信息
		const stats = await getMailboxStats(db, mailbox.id);

		// 转换邮件数据格式以适配前端组件
		const mails = emails.map((emailRecord) => ({
			id: emailRecord.id,
			name: emailRecord.fromAddress.split("@")[0] || emailRecord.fromAddress,
			email: emailRecord.fromAddress,
			subject: emailRecord.subject || "(无主题)",
			date: emailRecord.receivedAt.toISOString().split("T")[0], // 格式化日期
			isRead: emailRecord.isRead,
		}));

		return { email, mails, stats };
	} catch (error) {
		console.error("Error loading emails:", error);
		// 出错时返回空数据
		return {
			email,
			mails: [],
			stats: { total: 0, unread: 0 },
		};
	}
}

export async function action({ request, context }: Route.ActionArgs) {
	await new Promise((resolve) => setTimeout(resolve, 1000));
	const formData = await request.formData();
	const action = formData.get("action");
	if (action === "refresh") {
		return redirect("/");
	}
	if (action === "delete") {
		const session = await getSession(request.headers.get("Cookie"));
		const emailDomain = process.env.EMAIL_DOMAIN || "tmpmail.online";
		session.set("email", generateEmail(emailDomain));
		await commitSession(session);
		return redirect("/");
	}
	return null;
}

export default function Home({ loaderData }: Route.ComponentProps) {
	const { t } = useTranslation("home");
	const navigation = useNavigation();
	const revalidator = useRevalidator();
	const isSubmitting = navigation.state === "submitting";
	const isRefreshing =
		navigation.formData?.get("action") === "refresh" && isSubmitting;
	const isDeleting =
		navigation.formData?.get("action") === "delete" && isSubmitting;

	// 安全检查：确保 loaderData 存在
	if (!loaderData || !loaderData.email) {
		console.log("can't find email in loaderData");
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 flex items-center justify-center">
				<div className="text-center">
					<Loader2Icon className="h-8 w-8 animate-spin mx-auto mb-4" />
					<p className="text-gray-600">{t("loading")}</p>
				</div>
			</div>
		);
	}

	// 自动刷新逻辑 - 每30秒自动重新验证数据
	React.useEffect(() => {
		const interval = setInterval(() => {
			// 只有在页面可见且没有正在进行其他操作时才自动刷新
			if (
				document.visibilityState === "visible" &&
				navigation.state === "idle" &&
				revalidator.state === "idle"
			) {
				revalidator.revalidate();
			}
		}, 10000); // 10秒

		// 页面重新获得焦点时也刷新一次
		const handleFocus = () => {
			if (navigation.state === "idle" && revalidator.state === "idle") {
				revalidator.revalidate();
			}
		};

		window.addEventListener("focus", handleFocus);

		return () => {
			clearInterval(interval);
			window.removeEventListener("focus", handleFocus);
		};
	}, [navigation.state, revalidator]);

	// 判断是否正在自动刷新
	const isAutoRefreshing =
		revalidator.state === "loading" && navigation.state === "idle";

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50">
			<main className="container mx-auto px-4 py-8">
				<div className="max-w-6xl mx-auto">
					{/* Hero Section */}
					<div className="text-center mb-12">
						<h2 className="text-4xl font-bold text-gray-800 mb-4">
							{t("hero.title")}
							<span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
								{t("hero.highlight")}
							</span>
						</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							{t("hero.description")}
						</p>
					</div>

					<div className="grid lg:grid-cols-2 gap-8">
						{/* 左侧：邮箱地址 */}
						<div className="space-y-6">
							{/* 邮箱地址卡片 */}
							<Card className="border-0 shadow-lg bg-white h-full">
								<CardHeader className="pb-4">
									<CardTitle className="flex items-center space-x-2 text-xl">
										<div className="bg-blue-600 rounded-lg p-2">
											<Mail className="h-5 w-5 text-white" />
										</div>
										<span className="text-gray-800">{t("mailbox.title")}</span>
									</CardTitle>
									<div className="flex flex-wrap items-center gap-2 text-sm">
										<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
											✓ {t("mailbox.features.validity")}
										</span>
										<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
											⚡ {t("mailbox.features.autoRefresh")}
										</span>
										<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
											🎁 {t("mailbox.features.free")}
										</span>
									</div>
								</CardHeader>
								<CardContent>
									{/* 邮箱地址显示区域 */}
									<div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
										<div className="text-center">
											<p className="text-xs text-gray-500 mb-2 font-medium">
												{t("mailbox.emailLabel")}
											</p>
											<span className="font-mono text-base sm:text-lg font-bold text-gray-900 tracking-wide select-all break-all block">
												{loaderData.email}
											</span>
										</div>
									</div>

									{/* Action Buttons */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
										<CopyButton
											text={loaderData.email}
											size="default"
											variant="default"
											className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
										/>
										<Form method="post" className="w-full">
											<Button
												variant="outline"
												size="default"
												type="submit"
												name="action"
												value="delete"
												disabled={isDeleting}
												className="w-full h-10 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
											>
												{isDeleting ? (
													<>
														<Loader2Icon className="w-4 h-4 animate-spin mr-2" />
														{t("mailbox.generating")}
													</>
												) : (
													<>🔄 {t("mailbox.generateNew")}</>
												)}
											</Button>
										</Form>
									</div>

									{/* Tips */}
									<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
										<div className="flex items-start gap-3">
											<div className="bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
												<span className="text-white text-sm">💡</span>
											</div>
											<div className="text-sm">
												<p className="font-semibold text-blue-800 mb-1">
													{t("mailbox.tips.title")}
												</p>
												<p className="text-blue-700 leading-relaxed">
													{t("mailbox.tips.description")}
												</p>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* 右侧：收件箱 */}
						<div>
							<Card className="h-full">
								<CardHeader>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<CardTitle className="flex items-center space-x-2">
												<span>{t("inbox.title")}</span>
											</CardTitle>
											<span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
												{loaderData.stats.unread} {t("inbox.unread")}
											</span>
											<span className="text-gray-500 text-xs">
												{t("inbox.total", { count: loaderData.stats.total })}
											</span>
										</div>
										<Form method="post">
											<Button
												variant="secondary"
												size="sm"
												name="action"
												value="refresh"
												disabled={isRefreshing || isAutoRefreshing}
												className="text-xs"
											>
												{isRefreshing ? (
													<>
														<Loader2Icon className="w-3 h-3 animate-spin mr-1" />
														{t("inbox.refreshing")}
													</>
												) : (
													<>
														<RefreshCcwIcon className="w-3 h-3 mr-1" />
														{t("inbox.manualRefresh")}
													</>
												)}
											</Button>
										</Form>
									</div>
									{isAutoRefreshing && (
										<div className="text-xs text-blue-600 flex items-center gap-1">
											<Loader2Icon className="w-3 h-3 animate-spin" />
											{t("inbox.autoRefreshing")}
										</div>
									)}
								</CardHeader>
								<CardContent className="p-0">
									<ScrollArea className="h-96">
										{loaderData.mails.length > 0 ? (
											<div className="divide-y">
												{loaderData.mails.map((mail) => (
													<MailItem key={mail.id} {...mail} />
												))}
											</div>
										) : (
											<div className="flex flex-col items-center justify-center py-12 text-gray-500 px-4">
												<div className="text-4xl mb-3">📭</div>
												<h3 className="text-lg font-semibold mb-2 text-center">
													{t("inbox.empty.title")}
												</h3>
												<p className="text-sm text-center">
													{t("inbox.empty.description")}
												</p>
												<p className="text-xs text-gray-400 mt-2 text-center break-all">
													{t("inbox.empty.testHint", {
														email: loaderData.email,
													})}
												</p>
											</div>
										)}
									</ScrollArea>
								</CardContent>
							</Card>
						</div>
					</div>

					{/* Features Section */}
					<div className="mt-16">
						<div className="text-center mb-8">
							<h3 className="text-2xl font-bold text-gray-800 mb-2">
								{t("features.title")}
							</h3>
							<p className="text-gray-600">{t("features.subtitle")}</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<Card className="text-center">
								<CardContent className="pt-6">
									<div className="text-4xl mb-4">🔒</div>
									<h4 className="text-lg font-semibold mb-2">
										{t("features.privacy.title")}
									</h4>
									<p className="text-gray-600 text-sm">
										{t("features.privacy.description")}
									</p>
								</CardContent>
							</Card>
							<Card className="text-center">
								<CardContent className="pt-6">
									<div className="text-4xl mb-4">⚡</div>
									<h4 className="text-lg font-semibold mb-2">
										{t("features.instant.title")}
									</h4>
									<p className="text-gray-600 text-sm">
										{t("features.instant.description")}
									</p>
								</CardContent>
							</Card>
							<Card className="text-center">
								<CardContent className="pt-6">
									<div className="text-4xl mb-4">💰</div>
									<h4 className="text-lg font-semibold mb-2">
										{t("features.free.title")}
									</h4>
									<p className="text-gray-600 text-sm">
										{t("features.free.description")}
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
