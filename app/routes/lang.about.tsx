import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { isSupportedLanguage, getCurrentLanguage } from "~/lib/i18n";

import type { Route } from "./+types/lang.about";

// 导入原始关于页面组件
import About from "./about";

// 多语言meta函数
export function meta({ params }: Route.MetaArgs) {
  const lang = params.lang;
  
  // 根据语言返回对应的meta信息
  const metaData = {
    zh: {
      title: "关于我们 - TempMail临时邮箱服务介绍",
      description: "了解TempMail临时邮箱服务：免费、安全、便捷的一次性邮箱解决方案。保护您的隐私，避免垃圾邮件，适用于注册验证、测试等场景。"
    },
    en: {
      title: "About Us - TempMail Temporary Email Service Introduction",
      description: "Learn about TempMail temporary email service: Free, secure, and convenient disposable email solution. Protect your privacy, avoid spam, perfect for registration verification and testing."
    },
    ja: {
      title: "私たちについて - TempMail一時メールサービス紹介",
      description: "TempMail一時メールサービスについて：無料、安全、便利な使い捨てメールソリューション。プライバシーを保護し、スパムを回避し、登録確認やテストに最適です。"
    }
  };
  
  const currentMeta = metaData[lang as keyof typeof metaData] || metaData.zh;
  
  return [
    { title: currentMeta.title },
    {
      name: "description",
      content: currentMeta.description,
    },
  ];
}

/**
 * 多语言关于页面路由组件
 */
export default function LangAbout() {
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  
  useEffect(() => {
    console.log('[ABOUT Debug] useEffect triggered:', { lang, currentLang: getCurrentLanguage(), isSupported: isSupportedLanguage(lang || '') });
    
    if (!lang || !isSupportedLanguage(lang)) {
      console.log('[ABOUT Debug] Invalid language, redirecting to /about');
      navigate("/about", { replace: true });
      return;
    }
    
    if (lang !== getCurrentLanguage()) {
      console.log('[ABOUT Debug] Language change needed:', lang, '->', getCurrentLanguage());
      i18n.changeLanguage(lang).then(() => {
        console.log('[ABOUT Debug] Language changed successfully to:', lang);
      }).catch((error) => {
        console.error('[ABOUT Debug] Language change failed:', error);
      });
    } else {
      console.log('[ABOUT Debug] Language already matches:', lang);
    }
  }, [lang, navigate, i18n]);
  
  if (!lang || !isSupportedLanguage(lang)) {
    return null;
  }
  
  return <About />;
}