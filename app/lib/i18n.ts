import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// 导入翻译资源
import zhCommon from "../locales/zh/common.json";
import zhHome from "../locales/zh/home.json";
import zhMail from "../locales/zh/mail.json";
import zhAbout from "../locales/zh/about.json";
import zhFaq from "../locales/zh/faq.json";
import zhContact from "../locales/zh/contact.json";
import zhPrivacy from "../locales/zh/privacy.json";
import zhTerms from "../locales/zh/terms.json";
import zhBlog from "../locales/zh/blog.json";
import enCommon from "../locales/en/common.json";
import enHome from "../locales/en/home.json";
import enMail from "../locales/en/mail.json";
import enAbout from "../locales/en/about.json";
import enFaq from "../locales/en/faq.json";
import enContact from "../locales/en/contact.json";
import enPrivacy from "../locales/en/privacy.json";
import enTerms from "../locales/en/terms.json";
import enBlog from "../locales/en/blog.json";
import jaCommon from "../locales/ja/common.json";
import jaHome from "../locales/ja/home.json";
import jaMail from "../locales/ja/mail.json";
import jaAbout from "../locales/ja/about.json";
import jaFaq from "../locales/ja/faq.json";
import jaContact from "../locales/ja/contact.json";
import jaPrivacy from "../locales/ja/privacy.json";
import jaTerms from "../locales/ja/terms.json";
import jaBlog from "../locales/ja/blog.json";

// 支持的语言列表
export const supportedLanguages = ["zh", "en", "ja"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

// 语言配置
export const languageConfig = {
	zh: {
		name: "中文",
		nativeName: "中文",
		flag: "🇨🇳",
	},
	en: {
		name: "English",
		nativeName: "English",
		flag: "🇺🇸",
	},
	ja: {
		name: "Japanese",
		nativeName: "日本語",
		flag: "🇯🇵",
	},
};

// 默认语言
export const defaultLanguage: SupportedLanguage = "zh";

// 语言检测配置
const detectionOptions = {
	// 检测顺序：URL路径 -> Cookie -> Accept-Language头部 -> 默认语言
	order: ["path", "cookie", "header"],

	// 从URL路径中检测语言
	lookupFromPathIndex: 0,

	// Cookie配置
	caches: ["cookie"],
	cookieMinutes: 60 * 24 * 30, // 30天

	// 检查白名单
	checkWhitelist: true,
};

// 翻译资源配置
const resources = {
	zh: {
		common: zhCommon,
		home: zhHome,
		mail: zhMail,
		about: zhAbout,
		faq: zhFaq,
		contact: zhContact,
		privacy: zhPrivacy,
		terms: zhTerms,
		blog: zhBlog,
	},
	en: {
		common: enCommon,
		home: enHome,
		mail: enMail,
		about: enAbout,
		faq: enFaq,
		contact: enContact,
		privacy: enPrivacy,
		terms: enTerms,
		blog: enBlog,
	},
	ja: {
		common: jaCommon,
		home: jaHome,
		mail: jaMail,
		about: jaAbout,
		faq: jaFaq,
		contact: jaContact,
		privacy: jaPrivacy,
		terms: jaTerms,
		blog: jaBlog,
	},
};

// i18n初始化配置
const i18nConfig = {
	// 默认语言
	fallbackLng: defaultLanguage,

	// 支持的语言
	supportedLngs: supportedLanguages,

	// 调试模式（开发环境启用）
	debug: false,

	// 命名空间
	defaultNS: "common",
	ns: ["common", "home", "mail", "about", "faq", "contact", "privacy", "terms", "blog"],

	// 插值配置
	interpolation: {
		escapeValue: false, // React已经处理了XSS
	},

	// 内置资源
	resources,

	// React配置
	react: {
		useSuspense: false, // 禁用Suspense，避免SSR问题
	},
};

// 简化的初始化 - 直接同步初始化
if (typeof window !== "undefined") {
	// 客户端：使用语言检测器
	i18n.use(LanguageDetector).use(initReactI18next).init({
		...i18nConfig,
		detection: detectionOptions,
	});
} else {
	// 服务器端：使用默认语言
	i18n.use(initReactI18next).init({
		...i18nConfig,
		lng: defaultLanguage,
	});
}

export default i18n;

// 工具函数：检查是否为支持的语言
export const isSupportedLanguage = (
	lang: string,
): lang is SupportedLanguage => {
	return supportedLanguages.includes(lang as SupportedLanguage);
};

// 工具函数：获取当前语言
export const getCurrentLanguage = (pathname?: string): SupportedLanguage => {
	// 优先从提供的路径参数中提取语言
	if (pathname) {
		const pathLang = extractLanguageFromPath(pathname);
		if (pathLang) {
			return pathLang;
		}
		// 如果没有语言前缀，说明是中文默认路径
		return "zh";
	}

	// 在客户端，从URL路径中提取语言
	if (typeof window !== "undefined") {
		const currentPathname = window.location.pathname;
		const pathLang = extractLanguageFromPath(currentPathname);
		if (pathLang) {
			return pathLang;
		}
		// 如果没有语言前缀，说明是中文默认路径
		return "zh";
	}

	// 在服务器端，返回默认语言
	return defaultLanguage;
};

// 工具函数：切换语言
export const changeLanguage = (language: SupportedLanguage) => {
	return i18n.changeLanguage(language);
};

// 工具函数：获取语言显示名称
export const getLanguageDisplayName = (language: SupportedLanguage) => {
	return languageConfig[language]?.nativeName || language;
};

// 工具函数：从URL路径中提取语言
export const extractLanguageFromPath = (
	pathname: string,
): SupportedLanguage | null => {
	const segments = pathname.split("/").filter(Boolean);
	const firstSegment = segments[0];

	if (
		firstSegment &&
		supportedLanguages.includes(firstSegment as SupportedLanguage)
	) {
		return firstSegment as SupportedLanguage;
	}

	return null;
};

// 工具函数：生成多语言路径
export const generateLocalizedPath = (
	path: string,
	language: SupportedLanguage,
): string => {
	// 移除现有的语言前缀
	const cleanPath = path.replace(/^\/(zh|en|ja)/, "") || "/";

	// 中文使用默认路径（无前缀），其他语言添加前缀
	if (language === "zh") {
		return cleanPath;
	} else {
		return `/${language}${cleanPath === "/" ? "" : cleanPath}`;
	}
};

// 工具函数：获取所有语言的路径
export const getAllLocalizedPaths = (path: string) => {
	return supportedLanguages.map((lang) => ({
		language: lang,
		path: generateLocalizedPath(path, lang),
	}));
};
