import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import type { Route } from "./+types/blog._index";
import { getAllPosts, getFeaturedPosts, getAllTags, getAllCategories } from "~/blog/utils/posts";
import { getCurrentLanguage } from "~/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

export function meta({ location }: Route.MetaArgs) {
  const currentLanguage = getCurrentLanguage(location.pathname);
  
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

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const langParam = url.searchParams.get('lang');
  const currentLanguage = langParam && ['zh', 'en', 'ja'].includes(langParam) 
    ? langParam as 'zh' | 'en' | 'ja'
    : getCurrentLanguage(url.pathname);
  
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

export default function BlogIndex({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation("blog");
  const { posts, featuredPosts, tags, categories, currentLanguage } = loaderData;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLanguage === 'zh' ? 'zh-CN' : currentLanguage === 'ja' ? 'ja-JP' : 'en-US');
  };

  const getBlogPath = (slug: string) => {
    return currentLanguage === 'zh' ? `/blog/${slug}` : `/${currentLanguage}/blog/${slug}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {t("title")}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {t("highlight")}
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 主内容区 */}
            <div className="lg:col-span-2 space-y-8">
              {/* 推荐文章 */}
              {featuredPosts.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {t("featured.title")}
                  </h2>
                  <div className="grid gap-6">
                    {featuredPosts.map((post) => (
                      <Card key={post.slug} className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <CardTitle className="text-xl mb-2">
                                <Link 
                                  to={getBlogPath(post.slug)}
                                  className="text-gray-800 hover:text-blue-600 transition-colors"
                                >
                                  {post.title}
                                </Link>
                              </CardTitle>
                              <p className="text-gray-600 text-sm line-clamp-2">
                                {post.description}
                              </p>
                            </div>
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              {t("featured.badge")}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{formatDate(post.date)}</span>
                            <span>•</span>
                            <span>{post.readingTime}</span>
                            <span>•</span>
                            <span>{post.author}</span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* 最新文章 */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {t("latest.title")}
                </h2>
                <div className="space-y-6">
                  {posts.map((post) => (
                    <Card key={post.slug} className="border-0 shadow-md bg-white hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          <Link 
                            to={getBlogPath(post.slug)}
                            className="text-gray-800 hover:text-blue-600 transition-colors"
                          >
                            {post.title}
                          </Link>
                        </CardTitle>
                        <p className="text-gray-600 text-sm">
                          {post.description}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{formatDate(post.date)}</span>
                            <span>•</span>
                            <span>{post.readingTime}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </div>

            {/* 侧边栏 */}
            <div className="space-y-6">
              {/* 标签云 */}
              {tags.length > 0 && (
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">{t("sidebar.tags")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-blue-100">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 分类 */}
              {categories.length > 0 && (
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">{t("sidebar.categories")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <Link
                          key={category}
                          to="#"
                          className="block text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 返回首页 */}
              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="pt-6">
                  <Link to={currentLanguage === 'zh' ? '/' : `/${currentLanguage}`}>
                    <Button className="w-full">
                      {t("sidebar.backHome")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}