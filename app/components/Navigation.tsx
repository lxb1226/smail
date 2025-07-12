import { Mail, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { LanguageSwitcher } from "~/components/LanguageSwitcher";
import {
	getCurrentLanguage,
	generateLocalizedPath,
	type SupportedLanguage,
} from "~/lib/i18n";

interface NavigationProps {
	currentPath?: string;
	currentLang: SupportedLanguage;
	onLanguageChange: (lang: SupportedLanguage) => void;
}

export function Navigation({
	currentPath = "/",
	currentLang,
	onLanguageChange,
}: NavigationProps) {
	const { t } = useTranslation(["common", "home", "about", "faq", "contact", "blog"]);
	const location = useLocation();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	// 生成多语言导航项
	const navItems = [
		{
			href: generateLocalizedPath("/", currentLang),
			label: t("navigation.home"),
			description: t("home:features.subtitle"),
		},
		{
			href: generateLocalizedPath("/about", currentLang),
			label: t("navigation.about"),
			description: t("about:meta.description"),
		},
		{
			href: generateLocalizedPath("/faq", currentLang),
			label: t("navigation.faq"),
			description: t("faq:hero.subtitle"),
		},
		{
			href: generateLocalizedPath("/contact", currentLang),
			label: t("navigation.contact"),
			description: t("contact:subtitle"),
		},
		{
			href: generateLocalizedPath("/blog", currentLang),
			label: t("navigation.blog"),
			description: t("blog:description"),
		},
		{
			href: generateLocalizedPath("/privacy", currentLang),
			label: t("navigation.privacy"),
			description: t("privacy:meta.description"),
		},
		{
			href: generateLocalizedPath("/terms", currentLang),
			label: t("navigation.terms"),
			description: t("terms:meta.description"),
		},
	];

	return (
		<header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Link
						to={generateLocalizedPath("/", currentLang)}
						className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
					>
						<div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-2">
							<Mail className="h-6 w-6 text-white" />
						</div>
						<div>
							<h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
								TmpMail
							</h1>
							<p className="text-sm text-gray-600">
								{t("home:features.subtitle")}
							</p>
						</div>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-6">
						{navItems.map((item) => (
							<Link
								key={item.href}
								to={item.href}
								className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:text-blue-600 ${
									location.pathname === item.href
										? "text-blue-600 bg-blue-50"
										: "text-gray-700 hover:bg-gray-50"
								}`}
							>
								{item.label}
							</Link>
						))}

						{/* 语言切换器 */}
						<LanguageSwitcher
							currentLang={currentLang}
							onLanguageChange={onLanguageChange}
						/>

						<Button
							asChild
							className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
						>
							<Link to={generateLocalizedPath("/", currentLang)}>
								{t("home:generateEmail")}
							</Link>
						</Button>
					</nav>

					{/* Mobile Menu Button */}
					<button
						type="button"
						className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						aria-label={t("actions.close")}
					>
						{isMobileMenuOpen ? (
							<X className="h-6 w-6" />
						) : (
							<Menu className="h-6 w-6" />
						)}
					</button>
				</div>

				{/* Mobile Navigation */}
				{isMobileMenuOpen && (
					<nav className="md:hidden mt-4 pb-4 border-t border-gray-100">
						<div className="pt-4 space-y-2">
							{navItems.map((item) => (
								<Link
									key={item.href}
									to={item.href}
									className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
										location.pathname === item.href
											? "text-blue-600 bg-blue-50"
											: "text-gray-700 hover:bg-gray-50"
									}`}
									onClick={() => setIsMobileMenuOpen(false)}
								>
									<div>
										<div>{item.label}</div>
										<div className="text-xs text-gray-500 mt-1">
											{item.description}
										</div>
									</div>
								</Link>
							))}

							{/* 移动端语言切换器 */}
							<div className="px-4 py-2">
								<LanguageSwitcher
									className="w-full"
									currentLang={currentLang}
									onLanguageChange={onLanguageChange}
								/>
							</div>

							<div className="pt-2">
								<Button
									asChild
									className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
								>
									<Link to={generateLocalizedPath("/", currentLang)}>
										{t("home:generateEmail")}
									</Link>
								</Button>
							</div>
						</div>
					</nav>
				)}
			</div>
		</header>
	);
}
