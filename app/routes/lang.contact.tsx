import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { isSupportedLanguage, getCurrentLanguage } from "~/lib/i18n";

// 导入原始联系页面组件
import Contact from "./contact";

/**
 * 多语言联系页面路由组件
 */
export default function LangContact() {
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  
  useEffect(() => {
    if (!lang || !isSupportedLanguage(lang)) {
      navigate("/contact", { replace: true });
      return;
    }
    
    if (lang !== getCurrentLanguage()) {
      i18n.changeLanguage(lang);
    }
  }, [lang, navigate, i18n]);
  
  if (!lang || !isSupportedLanguage(lang)) {
    return null;
  }
  
  return <Contact />;
}