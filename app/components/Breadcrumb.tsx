import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { getCurrentLanguage, generateLocalizedPath } from "~/lib/i18n";

interface BreadcrumbItem {
	label: string;
	href: string;
	current?: boolean;
}

export function Breadcrumb() {
	const { t } = useTranslation(["common", "navigation"]);
	const location = useLocation();
	const currentLang = getCurrentLanguage(location.pathname);

	// 生成面包屑项
	const generateBreadcrumbs = (): BreadcrumbItem[] => {
		const pathSegments = location.pathname.split("/").filter(Boolean);
		const breadcrumbs: BreadcrumbItem[] = [];

		// 添加首页
		breadcrumbs.push({
			label: t("navigation.home"),
			href: generateLocalizedPath("/", currentLang),
		});

		// 如果是根路径，直接返回首页
		if (pathSegments.length === 0 || (pathSegments.length === 1 && ["zh", "en", "ja"].includes(pathSegments[0]))) {
			breadcrumbs[0].current = true;
			return breadcrumbs;
		}

		// 处理多语言路径
		let startIndex = 0;
		if (["zh", "en", "ja"].includes(pathSegments[0])) {
			startIndex = 1;
		}

		// 根据路径生成面包屑
		for (let i = startIndex; i < pathSegments.length; i++) {
			const segment = pathSegments[i];
			const isLast = i === pathSegments.length - 1;
			
			let label = segment;
			let href = "";

			// 生成正确的href
			if (currentLang === "zh") {
				href = "/" + pathSegments.slice(startIndex, i + 1).join("/");
			} else {
				href = "/" + currentLang + "/" + pathSegments.slice(startIndex, i + 1).join("/");
			}

			// 根据路径段设置标签
			switch (segment) {
				case "about":
					label = t("navigation.about");
					break;
				case "faq":
					label = t("navigation.faq");
					break;
				case "contact":
					label = t("navigation.contact");
					break;
				case "privacy":
					label = t("navigation.privacy");
					break;
				case "terms":
					label = t("navigation.terms");
					break;
				case "mail":
					label = t("navigation.mail");
					// 邮件详情页面不添加到面包屑
					if (i + 1 < pathSegments.length) {
						continue;
					}
					break;
				default:
					// 如果是邮件ID，显示为"邮件详情"
					if (pathSegments[i - 1] === "mail") {
						label = t("navigation.mailDetail");
					}
			}

			breadcrumbs.push({
				label,
				href,
				current: isLast,
			});
		}

		return breadcrumbs;
	};

	const breadcrumbs = generateBreadcrumbs();

	// 如果只有首页，不显示面包屑
	if (breadcrumbs.length <= 1) {
		return null;
	}

	return (
		<nav className="bg-gray-50 border-b border-gray-200" aria-label="Breadcrumb">
			<div className="container mx-auto px-4 py-3">
				<ol className="flex items-center space-x-2 text-sm">
					{breadcrumbs.map((item, index) => (
						<li key={item.href} className="flex items-center">
							{index === 0 && (
								<Home className="h-4 w-4 text-gray-400 mr-2" />
							)}
							
							{index > 0 && (
								<ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
							)}
							
							{item.current ? (
								<span className="text-gray-900 font-medium" aria-current="page">
									{item.label}
								</span>
							) : (
								<Link
									to={item.href}
									className="text-blue-600 hover:text-blue-800 transition-colors"
								>
									{item.label}
								</Link>
							)}
						</li>
					))}
				</ol>
			</div>
		</nav>
	);
}