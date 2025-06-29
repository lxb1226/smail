import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入翻译资源
import zhCommon from './resources/zh/common.json';
import zhHome from './resources/zh/home.json';
import enCommon from './resources/en/common.json';
import enHome from './resources/en/home.json';
import jaCommon from './resources/ja/common.json';
import jaHome from './resources/ja/home.json';

// 配置翻译资源
const resources = {
  zh: {
    common: zhCommon,
    home: zhHome,
  },
  en: {
    common: enCommon,
    home: enHome,
  },
  ja: {
    common: jaCommon,
    home: jaHome,
  },
};

// 初始化 i18n
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'zh',
      supportedLngs: ['zh', 'en', 'ja'],
      defaultNS: 'common',
      debug: false, // 在生产环境中关闭调试
      
      interpolation: {
        escapeValue: false, // React 已经安全处理了
      },
      
      detection: {
        order: ['path', 'cookie', 'header', 'navigator'],
        lookupFromPathIndex: 0,
        lookupFromSubdomainIndex: 0,
        caches: ['cookie'],
      },
      
      // SSR 支持
      react: {
        useSuspense: false,
      },
    });
}

export default i18n;