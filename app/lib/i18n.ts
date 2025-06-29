import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
// import Backend from 'i18next-http-backend'; // 暂时禁用HTTP后端

// 支持的语言列表
export const supportedLanguages = ['zh', 'en', 'ja'] as const;
export type SupportedLanguage = typeof supportedLanguages[number];

// 语言配置
export const languageConfig = {
  zh: {
    name: '中文',
    nativeName: '中文',
    flag: '🇨🇳'
  },
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  },
  ja: {
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵'
  }
};

// 默认语言
export const defaultLanguage: SupportedLanguage = 'zh';

// 语言检测配置
const detectionOptions = {
  // 检测顺序：URL路径 -> Cookie -> Accept-Language头部 -> 默认语言
  order: ['path', 'cookie', 'header'],
  
  // 从URL路径中检测语言
  lookupFromPathIndex: 0,
  
  // Cookie配置
  caches: ['cookie'],
  cookieMinutes: 60 * 24 * 30, // 30天
  cookieDomain: typeof window !== 'undefined' ? window.location.hostname : undefined,
  
  // 检查白名单
  checkWhitelist: true
};

// 内置翻译资源
const resources = {
  zh: {
    common: {
      "navigation": {
        "home": "首页",
        "about": "关于",
        "faq": "常见问题",
        "contact": "联系我们",
        "privacy": "隐私政策",
        "terms": "服务条款"
      },
      "home": {
        "title": "临时邮箱服务",
        "subtitle": "快速生成临时邮箱地址，保护您的隐私",
        "generateEmail": "生成邮箱",
        "copyEmail": "复制邮箱",
        "refreshInbox": "刷新收件箱"
      },
      "about": {
        "title": "关于我们",
        "description": "我们提供安全、快速的临时邮箱服务"
      },
      "faq": {
        "title": "常见问题"
      },
      "contact": {
        "title": "联系我们",
        "description": "如有任何问题，请联系我们"
      },
      "common": {
        "close": "关闭",
        "loading": "加载中...",
        "error": "错误"
      }
    }
  },
  en: {
    common: {
      "navigation": {
        "home": "Home",
        "about": "About",
        "faq": "FAQ",
        "contact": "Contact",
        "privacy": "Privacy Policy",
        "terms": "Terms of Service"
      },
      "home": {
        "title": "Temporary Email Service",
        "subtitle": "Generate temporary email addresses quickly to protect your privacy",
        "generateEmail": "Generate Email",
        "copyEmail": "Copy Email",
        "refreshInbox": "Refresh Inbox"
      },
      "about": {
        "title": "About Us",
        "description": "We provide secure and fast temporary email services"
      },
      "faq": {
        "title": "Frequently Asked Questions"
      },
      "contact": {
        "title": "Contact Us",
        "description": "Please contact us if you have any questions"
      },
      "common": {
        "close": "Close",
        "loading": "Loading...",
        "error": "Error"
      }
    }
  },
  ja: {
    common: {
      "navigation": {
        "home": "ホーム",
        "about": "について",
        "faq": "よくある質問",
        "contact": "お問い合わせ",
        "privacy": "プライバシーポリシー",
        "terms": "利用規約"
      },
      "home": {
        "title": "一時メールサービス",
        "subtitle": "プライバシーを保護するために一時的なメールアドレスを素早く生成",
        "generateEmail": "メール生成",
        "copyEmail": "メールをコピー",
        "refreshInbox": "受信箱を更新"
      },
      "about": {
        "title": "私たちについて",
        "description": "安全で高速な一時メールサービスを提供しています"
      },
      "faq": {
        "title": "よくある質問"
      },
      "contact": {
        "title": "お問い合わせ",
        "description": "ご質問がございましたらお気軽にお問い合わせください"
      },
      "common": {
        "close": "閉じる",
        "loading": "読み込み中...",
        "error": "エラー"
      }
    }
  }
};

// i18n初始化配置
const i18nConfig = {
  // 默认语言
  fallbackLng: defaultLanguage,
  
  // 支持的语言
  supportedLngs: supportedLanguages,
  
  // 调试模式（开发环境启用）
  debug: typeof window !== 'undefined' ? window.location.hostname === 'localhost' : false,
  
  // 命名空间
  defaultNS: 'common',
  ns: ['common'],
  
  // 插值配置
  interpolation: {
    escapeValue: false, // React已经处理了XSS
  },
  
  // 内置资源
  resources,
  
  // 语言检测配置 - 仅在客户端启用
  detection: typeof window !== 'undefined' ? detectionOptions : undefined,
  
  // React配置
  react: {
    useSuspense: false, // 禁用Suspense，避免SSR问题
  },
  
  // 在服务器端始终使用默认语言
  lng: typeof window === 'undefined' ? defaultLanguage : undefined
};

// 初始化i18n
if (typeof window !== 'undefined') {
  // 客户端：使用语言检测器
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init(i18nConfig);
} else {
  // 服务器端：不使用语言检测器
  i18n
    .use(initReactI18next)
    .init(i18nConfig);
}

export default i18n;

// 工具函数：检查是否为支持的语言
export const isSupportedLanguage = (lang: string): lang is SupportedLanguage => {
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
  }
  
  // 在客户端，从URL路径中提取语言
  if (typeof window !== 'undefined') {
    const currentPathname = window.location.pathname;
    const pathLang = extractLanguageFromPath(currentPathname);
    if (pathLang) {
      return pathLang;
    }
    
    // 回退到i18n检测的语言
    const currentLang = i18n.language;
    return supportedLanguages.includes(currentLang as SupportedLanguage) 
      ? (currentLang as SupportedLanguage)
      : defaultLanguage;
  }
  
  // 在服务器端，如果没有提供路径参数，返回默认语言
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
export const extractLanguageFromPath = (pathname: string): SupportedLanguage | null => {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment && supportedLanguages.includes(firstSegment as SupportedLanguage)) {
    return firstSegment as SupportedLanguage;
  }
  
  return null;
};

// 工具函数：生成多语言路径
export const generateLocalizedPath = (path: string, language: SupportedLanguage): string => {
  // 移除现有的语言前缀
  const cleanPath = path.replace(/^\/(zh|en|ja)/, '') || '/';
  
  // 所有语言都添加前缀，确保路径一致性
  return `/${language}${cleanPath === '/' ? '' : cleanPath}`;
};

// 工具函数：获取所有语言的路径
export const getAllLocalizedPaths = (path: string) => {
  return supportedLanguages.map(lang => ({
    language: lang,
    path: generateLocalizedPath(path, lang)
  }));
};