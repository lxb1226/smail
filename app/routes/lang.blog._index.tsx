import { redirect } from "react-router";
import type { Route } from "./+types/lang.blog._index";
import { isSupportedLanguage } from "~/lib/i18n";

export async function loader({ params }: Route.LoaderArgs) {
  const { lang } = params;
  
  // 验证语言参数
  if (!lang || !isSupportedLanguage(lang)) {
    throw redirect("/blog");
  }
  
  // 重定向到带语言参数的 blog 首页
  throw redirect(`/blog?lang=${lang}`);
}

// 这个路由主要用于多语言 URL 重定向
export default function LangBlogIndex() {
  return null;
}