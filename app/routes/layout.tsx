import { Outlet, useLocation, useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Navigation } from "~/components/Navigation";
import { Footer } from "~/components/Footer";
import {
	getCurrentLanguage,
	generateLocalizedPath,
	type SupportedLanguage,
} from "~/lib/i18n";

export default function Layout() {
	const { lang } = useParams();
	const { i18n } = useTranslation();
	const location = useLocation();
	const navigate = useNavigate();

	// 获取当前语言，如果URL中没有语言参数，使用默认语言
	const currentLang =
		(lang as SupportedLanguage) || getCurrentLanguage(location.pathname);

	// 语言切换逻辑 - 直接同步，避免水合化不匹配
	useEffect(() => {
		if (i18n.language !== currentLang) {
			i18n.changeLanguage(currentLang);
		}
	}, [currentLang, i18n]);

	// 语言切换函数
	const switchLanguage = (newLang: SupportedLanguage) => {
		const newPath = generateLocalizedPath(location.pathname, newLang);
		navigate(newPath);
	};

	return (
		<>
			<Navigation
				currentPath={location.pathname}
				currentLang={currentLang}
				onLanguageChange={switchLanguage}
			/>
			<Outlet />
			<Footer />
		</>
	);
}
