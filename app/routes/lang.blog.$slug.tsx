import { redirect } from "react-router";
import type { Route } from "./+types/lang.blog.$slug";
import { isSupportedLanguage } from "~/lib/i18n";
import { getPostBySlug, getAllPosts } from "~/blog/utils/posts";

// 重新导入blog文章组件
import BlogPostComponent from "./blog.$slug";

export function meta({ params, data }: Route.MetaArgs) {
  if (!data?.post) {
    return [{ title: "文章未找到 - TmpMail Blog" }];
  }

  const { post } = data;
  const baseUrl = "https://www.tmpmail.online";
  const currentUrl = `${baseUrl}/${post.lang === 'zh' ? '' : post.lang + '/'}blog/${post.slug}`;

  return [
    { title: `${post.title} - TmpMail Blog` },
    { name: "description", content: post.description },
    { name: "keywords", content: post.seo?.keywords || post.tags.join(", ") },
    { name: "author", content: post.author },
    
    // Open Graph
    { property: "og:title", content: post.title },
    { property: "og:description", content: post.description },
    { property: "og:type", content: "article" },
    { property: "og:url", content: currentUrl },
    { property: "og:image", content: post.seo?.ogImage || `${baseUrl}/og-image.png` },
    { property: "article:published_time", content: post.date },
    { property: "article:author", content: post.author },
    { property: "article:section", content: post.category },
    ...post.tags.map((tag: string) => ({ property: "article:tag", content: tag })),
    
    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: post.title },
    { name: "twitter:description", content: post.description },
    { name: "twitter:image", content: post.seo?.ogImage || `${baseUrl}/og-image.png` },
    
    // Additional SEO
    { name: "robots", content: "index, follow" },
    { rel: "canonical", href: currentUrl },
    
    // Schema.org JSON-LD
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.description,
        "image": post.seo?.ogImage || `${baseUrl}/og-image.png`,
        "author": {
          "@type": "Organization",
          "name": post.author
        },
        "publisher": {
          "@type": "Organization",
          "name": "TmpMail",
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/icon-192.png`
          }
        },
        "datePublished": post.date,
        "dateModified": post.date,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": currentUrl
        },
        "keywords": post.tags.join(", "),
        "articleSection": post.category,
        "inLanguage": post.lang
      }
    }
  ];
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const { lang, slug } = params;
  
  // 验证语言参数
  if (!lang || !isSupportedLanguage(lang)) {
    throw redirect(`/blog/${slug}`);
  }
  
  if (!slug) {
    throw new Response("Not Found", { status: 404 });
  }

  // 如果是中文，重定向到默认路径
  if (lang === "zh") {
    throw redirect(`/blog/${slug}`);
  }

  const currentLanguage = lang;

  try {
    const post = await getPostBySlug(slug, currentLanguage);

    // 获取相关文章（同分类的其他文章）
    const relatedPosts = await getAllPosts(currentLanguage);
    const related = relatedPosts
      .filter(p => p.slug !== slug && p.category === post.category)
      .slice(0, 3);

    return {
      post,
      relatedPosts: related,
      currentLanguage,
    };
  } catch (error) {
    console.error('Error loading blog post:', error);
    throw new Response("Post Not Found", { status: 404 });
  }
}

export default BlogPostComponent;