import { data, type LoaderFunctionArgs } from 'react-router';
import { supportedLanguages } from '~/lib/i18n';

// 翻译文件映射
const translations: Record<string, Record<string, any>> = {
  'zh': {
    'common': {
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
  'en': {
    'common': {
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
  'ja': {
    'common': {
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

// 翻译文件加载器
export async function loader({ params }: LoaderFunctionArgs) {
  const { lang, ns } = params;
  
  // 验证语言是否支持
  if (!lang || !supportedLanguages.includes(lang as any)) {
    throw new Response('Language not supported', { status: 404 });
  }
  
  // 验证命名空间
  if (!ns || ns !== 'common') {
    throw new Response('Namespace not found', { status: 404 });
  }
  
  try {
    const langTranslations = translations[lang];
    if (!langTranslations || !langTranslations[ns]) {
      throw new Error('Translation not found');
    }
    
    return data(langTranslations[ns], {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // 缓存1小时
      },
    });
  } catch (error) {
    console.error(`Failed to load translation file: ${lang}/${ns}.json`, error);
    throw new Response('Translation file not found', { status: 404 });
  }
}

// 这个组件不会被渲染，因为这是一个API路由
export default function LocalesRoute() {
  return null;
}