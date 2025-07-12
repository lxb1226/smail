import type { LoaderFunctionArgs } from "react-router";
import { getAllPosts } from "~/blog/utils/posts";

export async function loader({ request }: LoaderFunctionArgs) {
	const host =
		request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");

	if (!host) {
		throw new Error("Could not determine domain URL.");
	}

	const protocol = host.includes("localhost") ? "http" : "https";
	const domain = `${protocol}://${host}`;

	// 使用当前日期，ISO 8601格式
	const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD格式

	// 支持的语言
	const languages = ["zh", "en", "ja"];
	
	// 主要页面路径
	const pageRoutes = [
		{ path: "", priority: "1.0", changefreq: "daily" },
		{ path: "/about", priority: "0.8", changefreq: "monthly" },
		{ path: "/contact", priority: "0.7", changefreq: "monthly" },
		{ path: "/faq", priority: "0.7", changefreq: "monthly" },
		{ path: "/privacy", priority: "0.5", changefreq: "yearly" },
		{ path: "/terms", priority: "0.5", changefreq: "yearly" },
		{ path: "/blog", priority: "0.9", changefreq: "weekly" },
	];

	// 定义页面接口
	interface SitemapPage {
		url: string;
		changefreq: string;
		priority: string;
		lastmod: string;
	}

	// 生成所有页面 - 包含多语言版本
	const pages: SitemapPage[] = [];
	
	// 添加默认中文页面（根路径）
	pageRoutes.forEach(route => {
		pages.push({
			url: route.path,
			changefreq: route.changefreq,
			priority: route.priority,
			lastmod: currentDate,
		});
	});

	// 添加多语言页面
	languages.forEach(lang => {
		if (lang !== "zh") { // 默认是中文，跳过
			pageRoutes.forEach(route => {
				const url = route.path === "" ? `/${lang}` : `/${lang}${route.path}`;
				pages.push({
					url,
					changefreq: route.changefreq,
					priority: route.priority,
					lastmod: currentDate,
				});
			});
		}
	});

	// 添加博客文章页面
	for (const lang of languages) {
		try {
			const posts = await getAllPosts(lang);
			
			posts.forEach(post => {
				// 转换文章日期为 ISO 格式
				const postDate = new Date(post.date).toISOString().split("T")[0];
				
				if (lang === "zh") {
					// 中文默认路径
					pages.push({
						url: `/blog/${post.slug}`,
						changefreq: "monthly",
						priority: post.featured ? "0.8" : "0.7",
						lastmod: postDate,
					});
				} else {
					// 其他语言带语言前缀
					pages.push({
						url: `/${lang}/blog/${post.slug}`,
						changefreq: "monthly", 
						priority: post.featured ? "0.8" : "0.7",
						lastmod: postDate,
					});
				}
			});
		} catch (error) {
			console.error(`Error loading posts for language ${lang}:`, error);
		}
	}

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		(page) => `  <url>
    <loc>${domain}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
	)
	.join("\n")}
</urlset>`;

	return new Response(sitemap, {
		status: 200,
		headers: {
			"Content-Type": "application/xml",
			"Cache-Control": "public, max-age=3600", // 缓存1小时
		},
	});
}
