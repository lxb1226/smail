import { FileTextIcon } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

import type { Route } from "./+types/terms";

export function meta(_: Route.MetaArgs) {
	return [
		{ title: "使用条款 - TempMail" },
		{ name: "description", content: "查看TempMail临时邮箱的使用条款和服务协议。" },
	];
}

export default function Terms() {
	const { t } = useTranslation('terms');
	
	return (
		<div className="min-h-dvh bg-gray-50">
			{/* Header */}
			{/* <header className="bg-white border-b">
				<div className="max-w-screen-xl mx-auto px-3 sm:px-4 py-4 flex items-center justify-between">
					<Button asChild variant="ghost" size="sm">
						<Link to="/">
							<span className="font-bold text-xl">TempMail</span>
						</Link>
					</Button>
					<nav className="flex items-center gap-1 sm:gap-4">
						<Button
							asChild
							variant="ghost"
							size="sm"
							className="text-xs sm:text-sm px-2 sm:px-4"
						>
							<Link to="/about">关于我们</Link>
						</Button>
						<Button
							asChild
							variant="ghost"
							size="sm"
							className="text-xs sm:text-sm px-2 sm:px-4"
						>
							<Link to="/faq">FAQ</Link>
						</Button>
						<Button asChild className="text-xs sm:text-sm px-2 sm:px-4">
							<Link to="/">开始使用</Link>
						</Button>
					</nav>
				</div>
			</header> */}

			{/* Hero Section */}
			<section className="py-8 sm:py-16 bg-white">
				<div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-3 sm:px-4 text-center">
					<div className="flex justify-center mb-4 sm:mb-6">
						<div className="bg-blue-100 p-3 sm:p-4 rounded-full">
							<FileTextIcon className="w-6 sm:w-8 h-6 sm:h-8 text-blue-600" />
						</div>
					</div>
					<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
						{t("hero.title")}
					</h1>
					<p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-3 sm:mb-4">
						{t("hero.subtitle")}
					</p>
					<p className="text-sm text-gray-500">{t("hero.lastUpdated")}</p>
				</div>
			</section>

			{/* Terms Content */}
			<section className="py-8 sm:py-16">
				<div className="max-w-screen-lg mx-auto px-3 sm:px-4">
					<div className="space-y-6 sm:space-y-8">
						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl">{t("sections.overview.title")}</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4">
								<p className="text-gray-600 text-sm sm:text-base leading-relaxed">
									{t("sections.overview.content")}
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl">{t("sections.acceptance.title")}</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4">
								<p className="text-gray-600 text-sm sm:text-base leading-relaxed">
									{t("sections.acceptance.content")}
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl">{t("sections.usage.title")}</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4">
								<ul className="list-disc list-inside space-y-2 text-gray-600 text-sm sm:text-base ml-4">
									<li>{t("sections.usage.prohibited.0")}</li>
									<li>{t("sections.usage.prohibited.1")}</li>
									<li>{t("sections.usage.prohibited.2")}</li>
									<li>{t("sections.usage.prohibited.3")}</li>
									<li>{t("sections.usage.prohibited.4")}</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl">{t("sections.limitations.title")}</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4">
								<ul className="list-disc list-inside space-y-2 text-gray-600 text-sm sm:text-base ml-4">
									<li>{t("sections.limitations.items.0")}</li>
									<li>{t("sections.limitations.items.1")}</li>
									<li>{t("sections.limitations.items.2")}</li>
									<li>{t("sections.limitations.items.3")}</li>
									<li>{t("sections.limitations.items.4")}</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl">{t("sections.privacy.title")}</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4">
								<ul className="list-disc list-inside space-y-2 text-gray-600 text-sm sm:text-base ml-4">
									<li>{t("sections.privacy.items.0")}</li>
									<li>{t("sections.privacy.items.1")}</li>
									<li>{t("sections.privacy.items.2")}</li>
									<li>{t("sections.privacy.items.3")}</li>
									<li>{t("sections.privacy.items.4")}</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl">{t("sections.disclaimer.title")}</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4">
								<ul className="list-disc list-inside space-y-2 text-gray-600 text-sm sm:text-base ml-4">
									<li>{t("sections.disclaimer.items.0")}</li>
									<li>{t("sections.disclaimer.items.1")}</li>
									<li>{t("sections.disclaimer.items.2")}</li>
									<li>{t("sections.disclaimer.items.3")}</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl">{t("sections.intellectual.title")}</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4">
								<ul className="list-disc list-inside space-y-2 text-gray-600 text-sm sm:text-base ml-4">
									<li>{t("sections.intellectual.items.0")}</li>
									<li>{t("sections.intellectual.items.1")}</li>
									<li>{t("sections.intellectual.items.2")}</li>
									<li>{t("sections.intellectual.items.3")}</li>
								</ul>
								<p className="text-gray-600 text-sm sm:text-base leading-relaxed">
									{t("sections.intellectual.notice")}
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl">{t("sections.changes.title")}</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4">
								<ul className="list-disc list-inside space-y-2 text-gray-600 text-sm sm:text-base ml-4">
									<li>{t("sections.changes.items.0")}</li>
									<li>{t("sections.changes.items.1")}</li>
									<li>{t("sections.changes.items.2")}</li>
									<li>{t("sections.changes.items.3")}</li>
								</ul>
								<p className="text-gray-600 text-sm sm:text-base leading-relaxed">
									{t("sections.changes.notice")}
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl">{t("sections.law.title")}</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4">
								<ul className="list-disc list-inside space-y-2 text-gray-600 text-sm sm:text-base ml-4">
									<li>{t("sections.law.items.0")}</li>
									<li>{t("sections.law.items.1")}</li>
									<li>{t("sections.law.items.2")}</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl">{t("sections.contact.title")}</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4">
								<ul className="list-disc list-inside space-y-2 text-gray-600 text-sm sm:text-base ml-4">
									<li>{t("sections.contact.items.0")}</li>
									<li>{t("sections.contact.items.1")}</li>
								</ul>
								<p className="text-gray-600 text-sm sm:text-base leading-relaxed">
									{t("sections.contact.response")}
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-8 sm:py-16 bg-white">
				<div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-3 sm:px-4 text-center">
					<h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
					{t("cta.title")}
				</h2>
				<p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
					{t("cta.subtitle")}
				</p>
				<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
					<Button asChild size="lg" className="text-sm sm:text-base px-4 sm:px-6">
						<Link to="/">{t("cta.startButton")}</Link>
					</Button>
					{/* <Button asChild variant="outline" size="lg" className="text-sm sm:text-base px-4 sm:px-6">
						<Link to="/contact">{t("cta.contactButton")}</Link>
					</Button> */}
				</div>
				</div>
			</section>
		</div>
	);
}
