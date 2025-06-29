import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { isSupportedLanguage, getCurrentLanguage } from "~/lib/i18n";

// 导入原始FAQ页面组件
import FAQ from "./faq";

/**
 * 多语言FAQ页面路由组件
 */
export default function LangFAQ() {
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  
  useEffect(() => {
    if (!lang || !isSupportedLanguage(lang)) {
      navigate("/faq", { replace: true });
      return;
    }
    
    if (lang !== getCurrentLanguage()) {
      i18n.changeLanguage(lang);
    }
  }, [lang, navigate, i18n]);
  
  if (!lang || !isSupportedLanguage(lang)) {
    return null;
  }
  
  return <FAQ />;
}