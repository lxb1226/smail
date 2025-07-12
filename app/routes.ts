import {
	type RouteConfig,
	index,
	route,
	layout,
} from "@react-router/dev/routes";

export default [
	// 主要路由（默认中文）
	layout("routes/layout.tsx", [
		index("routes/home.tsx"),
		route("/about", "routes/about.tsx"),
		route("/privacy", "routes/privacy.tsx"),
		route("/terms", "routes/terms.tsx"),
		route("/faq", "routes/faq.tsx"),
		route("/contact", "routes/contact.tsx"),
		route("/mail/:id", "routes/mail.$id.tsx"),

		// Blog 路由
		route("/blog", "routes/blog._index.tsx"),
		route("/blog/:slug", "routes/blog.$slug.tsx"),

		// 多语言路由（使用可选语言参数）
		route("/:lang", "routes/lang.home.tsx"),
		route("/:lang/about", "routes/lang.about.tsx"),
		route("/:lang/privacy", "routes/lang.privacy.tsx"),
		route("/:lang/terms", "routes/lang.terms.tsx"),
		route("/:lang/faq", "routes/lang.faq.tsx"),
		route("/:lang/contact", "routes/lang.contact.tsx"),
		route("/:lang/mail/:id", "routes/lang.mail.$id.tsx"),
		route("/:lang/blog", "routes/lang.blog._index.tsx"),
		route("/:lang/blog/:slug", "routes/lang.blog.$slug.tsx"),
	]),

	// 系统路由（无语言前缀）
	route("/attachment/:id", "routes/attachment.$id.tsx"),
	route("/dev/email-handler", "routes/dev.email-handler.tsx"),
	route("/debug/email-preview", "routes/debug.email-preview.tsx"),
	route("/locales/:lang/:ns", "routes/locales.$lang.$ns.tsx"),
	route("/sitemap.xml", "routes/sitemap[.]xml.tsx"),
	route("/robots.txt", "routes/robots[.]txt.tsx"),
	route("/site.webmanifest", "routes/site[.]webmanifest.tsx"),

	// 捕获所有未匹配的路径，自动跳转到首页
	route("*", "routes/$.ts"),
] satisfies RouteConfig;
