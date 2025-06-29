import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { isSupportedLanguage, getCurrentLanguage } from "~/lib/i18n";

import type { Route } from "./+types/lang.faq";

// 导入原始FAQ页面组件
import FAQ from "./faq";

// 多语言meta函数
export function meta({ params }: Route.MetaArgs) {
  const lang = params.lang;
  
  // 根据语言返回对应的meta信息
  const metaData = {
    zh: {
      title: "常见问题解答 - Smail临时邮箱使用指南及疑难解答",
      description: "Smail临时邮箱常见问题全面解答：如何使用一次性邮箱、邮件保存时长、附件下载、隐私安全等。快速找到使用临时邮箱服务的答案，轻松上手免费临时邮件服务。"
    },
    en: {
      title: "FAQ - Smail Temporary Email Service Guide & Troubleshooting",
      description: "Comprehensive FAQ for Smail temporary email: How to use disposable email, email retention time, attachment downloads, privacy security, etc. Quickly find answers for using temporary email service."
    },
    ja: {
      title: "よくある質問 - Smail一時メールサービスガイド＆トラブルシューティング",
      description: "Smail一時メールの包括的なFAQ：使い捨てメールの使用方法、メール保存期間、添付ファイルのダウンロード、プライバシーセキュリティなど。一時メールサービスの使用に関する回答を素早く見つけられます。"
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
 * 多语言FAQ页面路由组件
 */
export default function LangFAQ() {
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  
  useEffect(() => {
    console.log('[FAQ Debug] useEffect triggered:', { lang, currentLang: getCurrentLanguage(), isSupported: isSupportedLanguage(lang || '') });
    
    if (!lang || !isSupportedLanguage(lang)) {
      console.log('[FAQ Debug] Invalid language, redirecting to /faq');
      navigate("/faq", { replace: true });
      return;
    }
    
    if (lang !== getCurrentLanguage()) {
      console.log('[FAQ Debug] Language change needed:', lang, '->', getCurrentLanguage());
      i18n.changeLanguage(lang).then(() => {
        console.log('[FAQ Debug] Language changed successfully to:', lang);
      }).catch((error) => {
        console.error('[FAQ Debug] Language change failed:', error);
      });
    } else {
      console.log('[FAQ Debug] Language already matches:', lang);
    }
  }, [lang, navigate, i18n]);
  
  if (!lang || !isSupportedLanguage(lang)) {
    return null;
  }
  
  return <FAQ />;
}