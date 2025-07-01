import { ShieldIcon } from "lucide-react";
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

import type { Route } from "./+types/privacy";

export function meta({ params }: Route.MetaArgs) {
	const lang = (params as any).lang || "zh";

	const titles = {
		zh: "隐私政策 - TmpMail",
		en: "Privacy Policy - TmpMail",
		ja: "プライバシーポリシー - TmpMail",
	};

	const descriptions = {
		zh: "了解 TmpMail 如何保护您的隐私和数据安全。",
		en: "Learn how TmpMail protects your privacy and data security.",
		ja: "TmpMail がお客様のプライバシーとデータセキュリティをどのように保護するかをご覧ください。",
	};

	return [
		{ title: titles[lang as keyof typeof titles] || titles.zh },
		{
			name: "description",
			content:
				descriptions[lang as keyof typeof descriptions] || descriptions.zh,
		},
	];
}

export default function Privacy() {
	const { t } = useTranslation("privacy");

	return (
		<div className="min-h-dvh bg-gray-50">
			{/* Header */}
			{/* <header className="bg-white border-b">
				<div className="max-w-screen-xl mx-auto px-3 sm:px-4 py-4 flex items-center justify-between">
					<Button asChild variant="ghost" size="sm">
						<Link to="/">
							<span className="font-bold text-xl">TmpMail</span>
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
							<ShieldIcon className="w-6 sm:w-8 h-6 sm:h-8 text-blue-600" />
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

			{/* Privacy Content */}
			<section className="py-8 sm:py-16">
				<div className="max-w-screen-lg mx-auto px-3 sm:px-4">
					<div className="space-y-6 sm:space-y-8">
						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl">
									{t("sections.collection.title")}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4">
								<p className="text-gray-600 text-sm sm:text-base leading-relaxed">
									{t("sections.collection.description")}
								</p>
								<div className="space-y-3 sm:space-y-4">
									<div>
										<h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
											{t("sections.collection.automatic.title")}
										</h4>
										<ul className="list-disc list-inside space-y-1 text-gray-600 text-sm sm:text-base ml-4">
											<li>{t("sections.collection.automatic.items.0")}</li>
											<li>{t("sections.collection.automatic.items.1")}</li>
											<li>{t("sections.collection.automatic.items.2")}</li>
											<li>{t("sections.collection.automatic.items.3")}</li>
											<li>{t("sections.collection.automatic.items.4")}</li>
										</ul>
									</div>
									<div>
										<h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
											{t("sections.collection.provided.title")}
										</h4>
										<ul className="list-disc list-inside space-y-1 text-gray-600 text-sm sm:text-base ml-4">
											<li>{t("sections.collection.provided.items.0")}</li>
											<li>{t("sections.collection.provided.items.1")}</li>
										</ul>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl">
									{t("sections.usage.title")}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4">
								<p className="text-gray-600 text-sm sm:text-base leading-relaxed">
									{t("sections.usage.description")}
								</p>
								<div className="space-y-2">
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.usage.items.0.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.usage.items.0.value")}
										</span>
									</div>
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.usage.items.1.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.usage.items.1.value")}
										</span>
									</div>
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.usage.items.2.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.usage.items.2.value")}
										</span>
									</div>
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.usage.items.3.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.usage.items.3.value")}
										</span>
									</div>
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.usage.items.4.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.usage.items.4.value")}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl">
									{t("sections.protection.title")}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4">
								<p className="text-gray-600 text-sm sm:text-base leading-relaxed">
									{t("sections.protection.description")}
								</p>
								<div className="space-y-2">
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.protection.items.0.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.protection.items.0.value")}
										</span>
									</div>
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.protection.items.1.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.protection.items.1.value")}
										</span>
									</div>
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.protection.items.2.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.protection.items.2.value")}
										</span>
									</div>
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.protection.items.3.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.protection.items.3.value")}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl">
									{t("sections.retention.title")}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4">
								<p className="text-gray-600 text-sm sm:text-base leading-relaxed">
									{t("sections.retention.description")}
								</p>
								<div className="space-y-2">
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.retention.items.0.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.retention.items.0.value")}
										</span>
									</div>
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.retention.items.1.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.retention.items.1.value")}
										</span>
									</div>
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.retention.items.2.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.retention.items.2.value")}
										</span>
									</div>
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.retention.items.3.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.retention.items.3.value")}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl">
									{t("sections.sharing.title")}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4">
								<p className="text-gray-600 text-sm sm:text-base leading-relaxed">
									{t("sections.sharing.description")}
								</p>
								<div className="space-y-2">
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.sharing.items.0.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.sharing.items.0.value")}
										</span>
									</div>
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.sharing.items.1.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.sharing.items.1.value")}
										</span>
									</div>
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.sharing.items.2.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.sharing.items.2.value")}
										</span>
									</div>
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.sharing.items.3.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.sharing.items.3.value")}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl">
									{t("sections.rights.title")}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4">
								<p className="text-gray-600 text-sm sm:text-base leading-relaxed">
									{t("sections.rights.description")}
								</p>
								<div className="space-y-2">
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.rights.items.0.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.rights.items.0.value")}
										</span>
									</div>
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.rights.items.1.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.rights.items.1.value")}
										</span>
									</div>
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.rights.items.2.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.rights.items.2.value")}
										</span>
									</div>
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.rights.items.3.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.rights.items.3.value")}
										</span>
									</div>
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.rights.items.4.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.rights.items.4.value")}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl">
									{t("sections.cookies.title")}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4">
								<p className="text-gray-600 text-sm sm:text-base leading-relaxed">
									{t("sections.cookies.description")}
								</p>
								<div className="space-y-2">
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.cookies.items.0.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.cookies.items.0.value")}
										</span>
									</div>
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.cookies.items.1.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.cookies.items.1.value")}
										</span>
									</div>
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.cookies.items.2.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.cookies.items.2.value")}
										</span>
									</div>
									<div className="bg-blue-50 p-3 rounded-lg">
										<p className="text-blue-800 text-sm">
											{t("sections.cookies.note")}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl">
									{t("sections.updates.title")}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4">
								<p className="text-gray-600 text-sm sm:text-base leading-relaxed">
									{t("sections.updates.description")}
								</p>
								<div className="space-y-2">
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.updates.items.0.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.updates.items.0.value")}
										</span>
									</div>
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.updates.items.1.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.updates.items.1.value")}
										</span>
									</div>
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.updates.items.2.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.updates.items.2.value")}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg sm:text-xl">
									{t("sections.contact.title")}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4">
								<p className="text-gray-600 text-sm sm:text-base leading-relaxed">
									{t("sections.contact.description")}
								</p>
								<div className="space-y-2">
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.contact.items.0.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.contact.items.0.value")}
										</span>
									</div>
									<div className="flex items-start space-x-2">
										<span className="font-semibold text-gray-900 text-sm sm:text-base min-w-fit">
											{t("sections.contact.items.1.label")}
										</span>
										<span className="text-gray-600 text-sm sm:text-base">
											{t("sections.contact.items.1.value")}
										</span>
									</div>
								</div>
								<p className="text-gray-600 text-sm sm:text-base">
									{t("sections.contact.note")}
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
						<Button asChild size="lg" className="text-sm sm:text-base">
							<Link to="/">{t("cta.buttons.start")}</Link>
						</Button>
						<Button
							asChild
							variant="outline"
							size="lg"
							className="text-sm sm:text-base"
						>
							<Link to="/contact">{t("cta.buttons.contact")}</Link>
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
}
