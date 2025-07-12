import { redirect } from "react-router";
import type { Route } from "./+types/lang.blog._index";
import { isSupportedLanguage, getCurrentLanguage } from "~/lib/i18n";
import { getAllPosts, getFeaturedPosts, getAllTags, getAllCategories } from "~/blog/utils/posts";

// 重新导入blog首页组件，但不导出默认组件
import BlogIndexComponent from "./blog._index";

export function meta({ params, location }: Route.MetaArgs) {
  const { lang } = params;
  const currentLanguage = (lang && isSupportedLanguage(lang)) ? lang : getCurrentLanguage(location.pathname);
  
  const metaData = {
    zh: {
      title: "TmpMail 博客 - 邮箱安全与隐私保护指南",
      description: "了解邮箱安全、隐私保护和临时邮箱的最佳实践。获取最新的网络安全资讯和实用技巧。",
      keywords: "邮箱安全,隐私保护,临时邮箱,网络安全,垃圾邮件防护",
    },
    en: {
      title: "TmpMail Blog - Email Security & Privacy Protection Guide",
      description: "Learn about email security, privacy protection, and temporary email best practices. Get the latest cybersecurity news and practical tips.",
      keywords: "email security,privacy protection,temporary email,cybersecurity,spam protection",
    },
    ja: {
      title: "TmpMail ブログ - メールセキュリティとプライバシー保護ガイド",
      description: "メールセキュリティ、プライバシー保護、一時的なメールのベストプラクティスについて学習。最新のサイバーセキュリティニュースと実用的なヒントを入手。",
      keywords: "メールセキュリティ,プライバシー保護,一時的なメール,サイバーセキュリティ,スパム保護",
    },
  };

  const meta = metaData[currentLanguage] || metaData.zh;

  return [
    { title: meta.title },
    { name: "description", content: meta.description },
    { name: "keywords", content: meta.keywords },
    
    // Open Graph
    { property: "og:title", content: meta.title },
    { property: "og:description", content: meta.description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `https://www.tmpmail.online/${currentLanguage === 'zh' ? '' : currentLanguage + '/'}blog` },
    
    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: meta.title },
    { name: "twitter:description", content: meta.description },
    
    // Additional SEO
    { name: "robots", content: "index, follow" },
    { rel: "canonical", href: `https://www.tmpmail.online/${currentLanguage === 'zh' ? '' : currentLanguage + '/'}blog` },
  ];
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const { lang } = params;
  const url = new URL(request.url);
  
  // 验证语言参数
  if (!lang || !isSupportedLanguage(lang)) {
    throw redirect("/blog");
  }
  
  // 如果是中文，重定向到默认路径
  if (lang === "zh") {
    throw redirect("/blog");
  }
  
  const currentLanguage = lang;
  
  try {
    const [allPosts, featuredPosts, tags, categories] = await Promise.all([
      getAllPosts(currentLanguage),
      getFeaturedPosts(currentLanguage, 3),
      getAllTags(currentLanguage),
      getAllCategories(currentLanguage),
    ]);

    return {
      posts: allPosts.slice(0, 10), // 首页显示最新10篇文章
      featuredPosts,
      tags: tags.slice(0, 10), // 显示前10个标签
      categories,
      currentLanguage,
    };
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return {
      posts: [],
      featuredPosts: [],
      tags: [],
      categories: [],
      currentLanguage,
    };
  }
}

export default BlogIndexComponent;