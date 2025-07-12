import React from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { MDXProvider } from "@mdx-js/react";
import type { Route } from "./+types/blog.$slug";
import { getPostBySlug, getAllPosts } from "~/blog/utils/posts";
import { allMdxComponents } from "~/blog/components/mdx-components";
import { getCurrentLanguage } from "~/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ArrowLeft, Clock, User, Calendar, Share2 } from "lucide-react";
import { getMDXComponent } from "~/blog/utils/mdx-loader";

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
  const { slug } = params;
  
  if (!slug) {
    throw new Response("Not Found", { status: 404 });
  }

  const url = new URL(request.url);
  const langParam = url.searchParams.get('lang');

  try {
    // 尝试多语言加载
    const languages = langParam && ['zh', 'en', 'ja'].includes(langParam) 
      ? [langParam as 'zh' | 'en' | 'ja'] 
      : ['zh', 'en', 'ja'];
    
    let post = null;
    let currentLanguage = 'zh';

    for (const lang of languages) {
      try {
        post = await getPostBySlug(slug, lang);
        currentLanguage = lang;
        break;
      } catch {
        continue;
      }
    }

    if (!post) {
      throw new Response("Post Not Found", { status: 404 });
    }

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

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation("blog");
  const { post, relatedPosts, currentLanguage } = loaderData;

  // 直接获取 MDX 组件，支持 SSR
  const MDXContent = getMDXComponent(currentLanguage, post.slug);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      currentLanguage === 'zh' ? 'zh-CN' : 
      currentLanguage === 'ja' ? 'ja-JP' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  };

  const getBlogPath = (slug: string) => {
    return currentLanguage === 'zh' ? `/blog/${slug}` : `/${currentLanguage}/blog/${slug}`;
  };

  const getBlogIndexPath = () => {
    return currentLanguage === 'zh' ? '/blog' : `/${currentLanguage}/blog`;
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: shareUrl,
        });
      } catch (err) {
        console.log('分享失败:', err);
      }
    } else {
      // 回退到复制链接
      navigator.clipboard.writeText(shareUrl);
      // 这里可以添加一个通知提示
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 返回按钮 */}
          <div className="mb-6">
            <Link 
              to={getBlogIndexPath()}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("backToBlog")}
            </Link>
          </div>

          <div className="max-w-4xl mx-auto">
            <article>
              {/* 文章头部 */}
              <header className="mb-8">
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                      {post.title}
                    </CardTitle>
                    
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {post.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{post.readingTime}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleShare}
                        className="flex items-center gap-2"
                      >
                        <Share2 className="h-4 w-4" />
                        {t("share")}
                      </Button>
                    </div>
                  </CardHeader>
                  </Card>
                </header>

              {/* 文章内容 */}
              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="pt-8">
                  <div className="prose prose-lg max-w-none">
                    {MDXContent ? (
                      <MDXProvider components={allMdxComponents}>
                        {React.createElement(MDXContent)}
                      </MDXProvider>
                    ) : (
                      <div className="text-center py-8">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">文章未找到</h2>
                        <p className="text-gray-600">
                          抱歉，所请求的文章内容暂时无法加载。
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 相关文章 */}
              {relatedPosts.length > 0 && (
                <section className="mt-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {t("related.title")}
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedPosts.map((relatedPost) => (
                      <Card key={relatedPost.slug} className="border-0 shadow-md bg-white hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-base">
                            <Link 
                              to={getBlogPath(relatedPost.slug)}
                              className="text-gray-800 hover:text-blue-600 transition-colors"
                            >
                              {relatedPost.title}
                            </Link>
                          </CardTitle>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {relatedPost.description}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xs text-gray-500">
                            {formatDate(relatedPost.date)} • {relatedPost.readingTime}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
            </article>
          </div>
        </div>
      </main>
    </div>
  );
}