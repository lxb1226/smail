import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { data, redirect, useParams } from "react-router";
import { isSupportedLanguage, getCurrentLanguage, defaultLanguage } from "~/lib/i18n";
import { commitSession, getSession } from "~/.server/session";
import {
	createDB,
	getEmailsByAddress,
	getMailboxStats,
	getOrCreateMailbox,
} from "~/lib/db";
import { customAlphabet } from "nanoid";
import type { Route } from "./+types/lang.home";

// 导入原始首页组件
import Home from "./home";

function generateEmail() {
	const names = ["alice", "bob", "charlie", "diana", "eve", "frank", "grace", "henry"];
	const randomName = () => names[Math.floor(Math.random() * names.length)];
	const random = customAlphabet("0123456789", 4)();
	return `${randomName()}-${random}@heyjude.blog`;
}

export async function loader({ request, params }: Route.LoaderArgs) {
	const { lang } = params;
	
	// 验证语言参数
	if (!lang || !isSupportedLanguage(lang)) {
		return redirect(`/${defaultLanguage}`);
	}
	
	const session = await getSession(request.headers.get("Cookie"));
	let email = session.get("email");

	if (!email) {
		email = generateEmail();
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

export async function action({ request, params }: Route.ActionArgs) {
	const { lang } = params;
	
	// 验证语言参数
	if (!lang || !isSupportedLanguage(lang)) {
		return redirect(`/${defaultLanguage}`);
	}
	
	await new Promise((resolve) => setTimeout(resolve, 1000));
	const formData = await request.formData();
	const actionType = formData.get("action");
	if (actionType === "refresh") {
		return redirect(`/${lang}`);
	}
	if (actionType === "delete") {
		const session = await getSession(request.headers.get("Cookie"));
		session.set("email", generateEmail());
		await commitSession(session);
		return redirect(`/${lang}`);
	}
	return null;
}

/**
 * 多语言首页路由组件
 * 用于处理带有语言参数的首页路由
 */
export default function LangHome(props: Route.ComponentProps) {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  
  // 确保i18n使用正确的语言
  useEffect(() => {
    if (lang && isSupportedLanguage(lang) && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);
  
  // 渲染原始首页组件，传递完整的props
  return <Home {...props} />;
}