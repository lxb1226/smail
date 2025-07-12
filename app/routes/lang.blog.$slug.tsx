import { redirect } from "react-router";
import type { Route } from "./+types/lang.blog.$slug";
import { isSupportedLanguage } from "~/lib/i18n";

export async function loader({ params }: Route.LoaderArgs) {
  const { lang, slug } = params;
  
  // 验证语言参数
  if (!lang || !isSupportedLanguage(lang)) {
    throw redirect(`/blog/${slug}`);
  }
  
  // 重定向到带语言参数的文章详情页
  throw redirect(`/blog/${slug}?lang=${lang}`);
}

// 这个路由主要用于 URL 重定向
export default function LangBlogPost() {
  return null;
}