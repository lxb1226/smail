import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { isSupportedLanguage, getCurrentLanguage } from "~/lib/i18n";
import type { Route } from "./+types/lang.mail.$id";

// 导入原始邮件详情页面组件
import MailDetail from "./mail.$id";

/**
 * 多语言邮件详情页面路由组件
 */
export default function LangMailDetail() {
	const { lang, id } = useParams<{ lang: string; id: string }>();
	const navigate = useNavigate();
	const { i18n } = useTranslation();

	useEffect(() => {
		if (!lang || !isSupportedLanguage(lang)) {
			navigate(`/mail/${id}`, { replace: true });
			return;
		}

		if (lang !== getCurrentLanguage()) {
			i18n.changeLanguage(lang);
		}
	}, [lang, id, navigate, i18n]);

	if (!lang || !isSupportedLanguage(lang)) {
		return null;
	}

	// 使用空的props，实际上应该从loader中获取数据
	return <MailDetail loaderData={{}} params={{ id: id || "" }} matches={[]} />;
}
