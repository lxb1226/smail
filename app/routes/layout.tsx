import { Outlet, useLocation, useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Navigation } from "~/components/Navigation";
import { Footer } from "~/components/Footer";
import { getCurrentLanguage, generateLocalizedPath } from "~/lib/i18n";

export default function Layout() {
	const { lang } = useParams();
	const { i18n } = useTranslation();
	const location = useLocation();
	const navigate = useNavigate();
	const [isHydrated, setIsHydrated] = useState(false);
	
	// 获取当前语言，如果URL中没有语言参数，使用默认语言
	const currentLang = lang || getCurrentLanguage(location.pathname);
	
	// 水合化完成后设置标志
	useEffect(() => {
		setIsHydrated(true);
	}, []);
	
	// 语言切换逻辑 - 只在水合化完成后执行
	useEffect(() => {
		if (isHydrated && i18n.language !== currentLang) {
			i18n.changeLanguage(currentLang);
		}
	}, [currentLang, i18n, isHydrated]);
	
	// 语言切换函数
	const switchLanguage = (newLang: string) => {
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
