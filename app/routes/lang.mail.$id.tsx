import { useEffect } from "react";
import { data, redirect, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { isSupportedLanguage, getCurrentLanguage, defaultLanguage } from "~/lib/i18n";
import { createDB, getEmailById } from "~/lib/db";
import type { Route } from "./+types/lang.mail.$id";

// 导入原始邮件详情页面组件
import MailDetail from "./mail.$id";

export async function loader({ params, context }: Route.LoaderArgs) {
	const { lang, id } = params;

	// 验证语言参数
	if (!lang || !isSupportedLanguage(lang)) {
		return redirect(`/${defaultLanguage}/mail/${id}`);
	}

	if (!id) {
		return redirect(`/${lang}`);
	}

	try {
		const db = createDB();
		const email = await getEmailById(db, id);

		if (!email) {
			return redirect(`/${lang}`);
		}

		// 将 rawEmail 解析为 HTML
		const emailHTML = email.htmlContent || email.textContent || "";

		return {
			email,
			attachments: [], // 假设没有附件处理逻辑
			emailHTML,
		};
	} catch (error) {
		console.error("Error loading email:", error);
		return redirect(`/${lang}`);
	}
}

/**
 * 多语言邮件详情页面路由组件
 */
export default function LangMailDetail(props: Route.ComponentProps) {
	const { lang } = useParams();
	const { i18n } = useTranslation();

	useEffect(() => {
		if (lang && isSupportedLanguage(lang) && i18n.language !== lang) {
			i18n.changeLanguage(lang);
		}
	}, [lang, i18n]);

	// 渲染原始邮件详情组件，传递所有loader数据
	return <MailDetail loaderData={props.loaderData} />;
}
