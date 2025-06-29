# Smail 国际化(i18n)开发方案

本文档详细描述了为Smail临时邮箱服务实施国际化的技术方案。

## 🌍 概述

Smail是一个基于React Router v7和Cloudflare Workers构建的现代化临时邮箱服务。为了服务全球用户，我们需要实施完整的国际化解决方案。

## 📋 目标语言

- **中文 (zh)** - 默认语言
- **英语 (en)** - 主要国际语言
- **日语 (ja)** - 扩展支持

## 🛠️ 技术选型

### 核心库
- **react-i18next** - React国际化框架
- **i18next** - 国际化核心库
- **i18next-browser-languagedetector** - 浏览器语言检测

### 选择理由
1. 与React Router v7完全兼容
2. 支持SSR（服务端渲染）
3. 轻量级，适合Cloudflare Workers环境
4. 丰富的插件生态系统
5. TypeScript支持良好

## 🏗️ 架构设计

### 目录结构
```
app/
├── i18n/
│   ├── index.ts              # i18n配置入口
│   ├── detector.ts           # 语言检测逻辑
│   ├── resources/            # 翻译资源
│   │   ├── en/
│   │   │   ├── common.json   # 通用翻译
│   │   │   ├── home.json     # 首页翻译
│   │   │   ├── about.json    # 关于页翻译
│   │   │   ├── faq.json      # FAQ翻译
│   │   │   ├── contact.json  # 联系页翻译
│   │   │   └── meta.json     # SEO元数据翻译
│   │   ├── zh/
│   │   │   ├── common.json
│   │   │   ├── home.json
│   │   │   ├── about.json
│   │   │   ├── faq.json
│   │   │   ├── contact.json
│   │   │   └── meta.json
│   │   └── ja/              # 日语支持
│   │       ├── common.json
│   │       ├── home.json
│   │       ├── about.json
│   │       ├── faq.json
│   │       ├── contact.json
│   │       └── meta.json
│   ├── utils.ts             # i18n工具函数
│   └── types.ts             # TypeScript类型定义
```

### 语言检测策略

优先级顺序：
1. **URL路径参数**: `/en/`, `/zh/`, `/ja/`
2. **Cookie存储**: 用户手动选择的语言偏好
3. **Accept-Language头部**: 浏览器语言设置
4. **地理位置**: 基于Cloudflare的地理信息
5. **默认语言**: 中文（zh）

## 🚀 实施方案

### 第一阶段：基础框架搭建

#### 1.1 安装依赖
```bash
pnpm add react-i18next i18next i18next-browser-languagedetector
pnpm add -D @types/react-i18next
```

#### 1.2 路由结构调整
```typescript
// app/routes.ts
export default [
  {
    path: "/:lang?",
    file: "routes/layout.tsx",
    children: [
      { index: true, file: "routes/home.tsx" },
      { path: "about", file: "routes/about.tsx" },
      { path: "faq", file: "routes/faq.tsx" },
      { path: "contact", file: "routes/contact.tsx" },
      { path: "privacy", file: "routes/privacy.tsx" },
      { path: "terms", file: "routes/terms.tsx" },
      { path: "mail/:id", file: "routes/mail.$id.tsx" },
      { path: "attachment/:id", file: "routes/attachment.$id.tsx" }
    ]
  }
] satisfies RouteConfig;
```

#### 1.3 i18n配置
```typescript
// app/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 动态导入翻译资源
const resources = {
  zh: {
    common: () => import('./resources/zh/common.json'),
    home: () => import('./resources/zh/home.json'),
    about: () => import('./resources/zh/about.json'),
    faq: () => import('./resources/zh/faq.json'),
    contact: () => import('./resources/zh/contact.json'),
    meta: () => import('./resources/zh/meta.json')
  },
  en: {
    common: () => import('./resources/en/common.json'),
    home: () => import('./resources/en/home.json'),
    about: () => import('./resources/en/about.json'),
    faq: () => import('./resources/en/faq.json'),
    contact: () => import('./resources/en/contact.json'),
    meta: () => import('./resources/en/meta.json')
  },
  ja: {
    common: () => import('./resources/ja/common.json'),
    home: () => import('./resources/ja/home.json'),
    about: () => import('./resources/ja/about.json'),
    faq: () => import('./resources/ja/faq.json'),
    contact: () => import('./resources/ja/contact.json'),
    meta: () => import('./resources/ja/meta.json')
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'zh',
    supportedLngs: ['zh', 'en', 'ja'],
    defaultNS: 'common',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false // React已经处理了XSS
    },
    
    detection: {
      order: ['path', 'cookie', 'header', 'navigator'],
      lookupFromPathIndex: 0,
      checkWhitelist: true
    },
    
    // 资源懒加载
    backend: {
      loadPath: (lng: string, ns: string) => {
        return resources[lng]?.[ns];
      }
    }
  });

export default i18n;
```

### 第二阶段：组件改造

#### 2.1 Layout组件
```typescript
// app/routes/layout.tsx
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router';
import { useEffect } from 'react';

export default function Layout() {
  const { lang = 'zh' } = useParams();
  const { i18n } = useTranslation();
  const location = useLocation();
  
  // 语言切换逻辑
  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);
  
  // 语言切换函数
  const switchLanguage = (newLang: string) => {
    const currentPath = location.pathname.replace(/^\/[a-z]{2}/, '');
    const newPath = `/${newLang}${currentPath}`;
    window.location.href = newPath;
  };
  
  return (
    <html lang={lang} dir={getTextDirection(lang)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navigation currentLang={lang} onLanguageChange={switchLanguage} />
        <Outlet />
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function getTextDirection(lang: string): 'ltr' | 'rtl' {
  // 大部分语言都是从左到右
  return 'ltr';
}
```

#### 2.2 Navigation组件改造
```typescript
// app/components/Navigation.tsx
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

interface NavigationProps {
  currentPath?: string;
  currentLang: string;
  onLanguageChange: (lang: string) => void;
}

export function Navigation({ 
  currentPath = "/", 
  currentLang, 
  onLanguageChange 
}: NavigationProps) {
  const { t } = useTranslation('common');
  
  const navItems = [
    { href: `/${currentLang}`, label: t('navigation.home') },
    { href: `/${currentLang}/about`, label: t('navigation.about') },
    { href: `/${currentLang}/faq`, label: t('navigation.faq') },
    { href: `/${currentLang}/contact`, label: t('navigation.contact') }
  ];
  
  const languages = [
    { code: 'zh', name: '中文' },
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' }
  ];
  
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={`/${currentLang}`} className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-2">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {t('brand.name')}
              </h1>
              <p className="text-sm text-gray-600">{t('brand.tagline')}</p>
            </div>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPath === item.href
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Language Switcher */}
            <div className="relative">
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
```

### 第三阶段：翻译资源

#### 3.1 通用翻译 (common.json)

**中文版本 (zh/common.json)**:
```json
{
  "brand": {
    "name": "Smail",
    "tagline": "临时邮箱服务"
  },
  "navigation": {
    "home": "首页",
    "about": "关于",
    "faq": "FAQ",
    "contact": "联系"
  },
  "actions": {
    "generate": "生成邮箱",
    "refresh": "刷新",
    "copy": "复制",
    "delete": "删除",
    "back": "返回",
    "download": "下载"
  },
  "status": {
    "loading": "加载中...",
    "error": "出错了",
    "success": "成功",
    "empty": "暂无数据"
  },
  "time": {
    "now": "刚刚",
    "minutesAgo": "{{count}}分钟前",
    "hoursAgo": "{{count}}小时前",
    "daysAgo": "{{count}}天前"
  }
}
```

**英文版本 (en/common.json)**:
```json
{
  "brand": {
    "name": "Smail",
    "tagline": "Temporary Email Service"
  },
  "navigation": {
    "home": "Home",
    "about": "About",
    "faq": "FAQ",
    "contact": "Contact"
  },
  "actions": {
    "generate": "Generate Email",
    "refresh": "Refresh",
    "copy": "Copy",
    "delete": "Delete",
    "back": "Back",
    "download": "Download"
  },
  "status": {
    "loading": "Loading...",
    "error": "Error occurred",
    "success": "Success",
    "empty": "No data"
  },
  "time": {
    "now": "Just now",
    "minutesAgo": "{{count}} minutes ago",
    "hoursAgo": "{{count}} hours ago",
    "daysAgo": "{{count}} days ago"
  }
}
```

#### 3.2 首页翻译 (home.json)

**中文版本 (zh/home.json)**:
```json
{
  "hero": {
    "title": "免费临时邮箱生成器",
    "subtitle": "保护隐私，避免垃圾邮件",
    "description": "无需注册，即时获取临时邮箱地址，24小时有效期"
  },
  "mailbox": {
    "title": "您的临时邮箱",
    "placeholder": "点击生成邮箱地址",
    "expiresIn": "有效期：{{hours}}小时{{minutes}}分钟",
    "copySuccess": "邮箱地址已复制到剪贴板"
  },
  "inbox": {
    "title": "收件箱",
    "empty": "暂无邮件",
    "refreshing": "正在刷新...",
    "autoRefresh": "自动刷新：{{seconds}}秒"
  },
  "features": {
    "privacy": {
      "title": "隐私保护",
      "description": "保护您的真实邮箱地址，避免垃圾邮件和隐私泄露"
    },
    "instant": {
      "title": "即时创建",
      "description": "无需注册，一键生成临时邮箱地址，立即开始使用"
    },
    "free": {
      "title": "完全免费",
      "description": "永久免费使用，无隐藏费用，无广告干扰"
    }
  }
}
```

**英文版本 (en/home.json)**:
```json
{
  "hero": {
    "title": "Free Temporary Email Generator",
    "subtitle": "Protect Privacy, Avoid Spam",
    "description": "No registration required, get temporary email address instantly, valid for 24 hours"
  },
  "mailbox": {
    "title": "Your Temporary Email",
    "placeholder": "Click to generate email address",
    "expiresIn": "Expires in: {{hours}}h {{minutes}}m",
    "copySuccess": "Email address copied to clipboard"
  },
  "inbox": {
    "title": "Inbox",
    "empty": "No emails yet",
    "refreshing": "Refreshing...",
    "autoRefresh": "Auto refresh: {{seconds}}s"
  },
  "features": {
    "privacy": {
      "title": "Privacy Protection",
      "description": "Protect your real email address from spam and privacy leaks"
    },
    "instant": {
      "title": "Instant Creation",
      "description": "No registration required, generate temporary email address with one click"
    },
    "free": {
      "title": "Completely Free",
      "description": "Free forever, no hidden fees, no ads"
    }
  }
}
```

### 第四阶段：SEO优化

#### 4.1 多语言Meta标签
```typescript
// app/lib/i18n-meta.ts
import { useTranslation } from 'react-i18next';

export function useLocalizedMeta(page: string = 'home') {
  const { t, i18n } = useTranslation('meta');
  const currentLang = i18n.language;
  
  return [
    { title: t(`${page}.title`) },
    { name: "description", content: t(`${page}.description`) },
    { name: "keywords", content: t(`${page}.keywords`) },
    
    // Open Graph
    { property: "og:title", content: t(`${page}.ogTitle`) },
    { property: "og:description", content: t(`${page}.ogDescription`) },
    { property: "og:locale", content: getOgLocale(currentLang) },
    
    // Hreflang links
    ...getHrefLangLinks(page)
  ];
}

function getOgLocale(lang: string): string {
  const localeMap = {
    zh: 'zh_CN',
    en: 'en_US',
    ja: 'ja_JP'
  };
  return localeMap[lang] || 'zh_CN';
}

function getHrefLangLinks(page: string) {
  const languages = ['zh', 'en', 'ja'];
  const baseUrl = 'https://smail.pw';
  
  return languages.map(lang => ({
    rel: 'alternate',
    hrefLang: lang,
    href: `${baseUrl}/${lang}${page === 'home' ? '' : '/' + page}`
  }));
}
```

#### 4.2 多语言Sitemap
```typescript
// app/routes/sitemap[.]xml.tsx
export async function loader() {
  const languages = ['zh', 'en', 'ja'];
  const pages = ['', 'about', 'faq', 'contact', 'privacy', 'terms'];
  const baseUrl = 'https://smail.pw';
  
  const urls = languages.flatMap(lang => 
    pages.map(page => ({
      loc: `${baseUrl}/${lang}${page ? '/' + page : ''}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly' as const,
      priority: page === '' ? '1.0' : '0.8',
      // 添加多语言链接
      alternates: languages
        .filter(altLang => altLang !== lang)
        .map(altLang => ({
          hreflang: altLang,
          href: `${baseUrl}/${altLang}${page ? '/' + page : ''}`
        }))
    }))
  );
  
  return new Response(generateSitemapXML(urls), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
```

## 🔧 开发工具

### TypeScript类型安全
```typescript
// app/i18n/types.ts
export interface TranslationResources {
  common: {
    brand: {
      name: string;
      tagline: string;
    };
    navigation: {
      home: string;
      about: string;
      faq: string;
      contact: string;
    };
    actions: {
      generate: string;
      refresh: string;
      copy: string;
      delete: string;
    };
  };
  home: {
    hero: {
      title: string;
      subtitle: string;
      description: string;
    };
    features: {
      privacy: {
        title: string;
        description: string;
      };
    };
  };
}

// 扩展i18next类型
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: TranslationResources;
  }
}
```

### 开发脚本
```bash
# package.json scripts
{
  "scripts": {
    "i18n:extract": "node scripts/extract-translations.js",
    "i18n:validate": "node scripts/validate-translations.js",
    "i18n:missing": "node scripts/check-missing-translations.js"
  }
}
```

## 📊 性能优化

### 1. 懒加载策略
- 翻译资源按页面分割
- 使用动态import加载
- 预加载用户可能访问的语言

### 2. 缓存策略
```typescript
// 利用Cloudflare缓存
export async function loader({ request, context }: LoaderArgs) {
  const cacheKey = `i18n:${lang}:${page}`;
  const cached = await context.env.KV.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const translations = await loadTranslations(lang, page);
  await context.env.KV.put(cacheKey, JSON.stringify(translations), {
    expirationTtl: 3600 // 1小时缓存
  });
  
  return translations;
}
```

### 3. Bundle优化
- 不同语言的翻译文件独立打包
- 使用Tree Shaking移除未使用的翻译
- 压缩翻译文件

## 🚀 部署配置

### Cloudflare Workers配置
```javascript
// wrangler.jsonc
{
  "compatibility_date": "2024-01-01",
  "vars": {
    "DEFAULT_LANGUAGE": "zh",
    "SUPPORTED_LANGUAGES": "zh,en,ja"
  },
  "kv_namespaces": [
    {
      "binding": "I18N_CACHE",
      "id": "your-kv-namespace-id"
    }
  ]
}
```

## 📝 实施时间表

### 第一周：基础框架
- [ ] 安装和配置i18next
- [ ] 调整路由结构
- [ ] 实现语言检测

### 第二周：组件改造
- [ ] 改造Navigation组件
- [ ] 改造Layout组件
- [ ] 实现语言切换功能

### 第三周：翻译资源
- [ ] 提取现有中文文本
- [ ] 创建翻译资源文件结构
- [ ] 完成英语翻译

### 第四周：SEO优化
- [ ] 实现多语言Meta标签
- [ ] 添加hreflang链接
- [ ] 生成多语言sitemap

### 第五周：测试和优化
- [ ] 功能测试
- [ ] 性能优化
- [ ] 用户体验优化

### 第六周：日语支持
- [ ] 添加日语翻译
- [ ] 测试和调优
- [ ] 文档完善

## 🧪 测试策略

### 单元测试
```typescript
// 测试翻译函数
import { renderHook } from '@testing-library/react';
import { useTranslation } from 'react-i18next';

test('should translate correctly', () => {
  const { result } = renderHook(() => useTranslation('common'));
  expect(result.current.t('navigation.home')).toBe('首页');
});
```

### E2E测试
- 语言切换功能
- URL路由正确性
- SEO标签验证

## 📚 维护指南

### 添加新翻译
1. 在所有语言的对应JSON文件中添加键值对
2. 运行验证脚本检查完整性
3. 更新TypeScript类型定义

### 添加新语言
1. 创建新的语言目录
2. 复制并翻译所有JSON文件
3. 更新支持的语言列表
4. 添加语言选择器选项

## 🔍 监控和分析

### 语言使用统计
- 通过Cloudflare Analytics监控不同语言的访问量
- 收集用户语言偏好数据
- 优化翻译质量

### 性能监控
- 监控翻译资源加载时间
- 跟踪缓存命中率
- 优化加载策略

---

本方案提供了完整的国际化解决方案，确保Smail能够为全球用户提供优质的多语言服务体验。