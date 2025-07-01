import { ChevronDownIcon, HelpCircleIcon } from "lucide-react";
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

import type { Route } from "./+types/faq";

export function meta(_: Route.MetaArgs) {
	// 注意：meta函数在服务器端运行，无法直接使用useTranslation
	// 这里使用默认的中文内容，多语言版本的meta将在lang.faq.tsx中处理
	return [
		{ title: "常见问题解答 - TempMail临时邮箱使用指南及疑难解答" },
		{
			name: "description",
			content:
				"TempMail临时邮箱常见问题全面解答：如何使用一次性邮箱、邮件保存时长、附件下载、隐私安全等。快速找到使用临时邮箱服务的答案，轻松上手免费临时邮件服务。",
		},
	];
}

export default function FAQ() {
	const { t } = useTranslation('faq');
	
	const faqs = [
		{
			id: "what-is-temp-email",
			question: t("items.0.question"),
			answer: t("items.0.answer"),
		},
		{
			id: "is-free",
			question: t("items.1.question"),
			answer: t("items.1.answer"),
		},
		{
			id: "retention-time",
			question: t("items.2.question"),
			answer: t("items.2.answer"),
		},
		{
			id: "can-send",
			question: t("items.3.question"),
			answer: t("items.3.answer"),
		},
		{
			id: "security",
			question: t("items.4.question"),
			answer: t("items.4.answer"),
		},
		{
			id: "verification-issues",
			question: t("items.5.question"),
			answer: t("items.5.answer"),
		},
		{
			id: "custom-address",
			question: t("items.6.question"),
			answer: t("items.6.answer"),
		},
		{
			id: "email-limits",
			question: t("items.7.question"),
			answer: t("items.7.answer"),
		},
		{
			id: "attachments",
			question: t("items.8.question"),
			answer: t("items.8.answer"),
		},
		{
			id: "support",
			question: t("items.9.question"),
			answer: t("items.9.answer"),
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50">
			{/* Hero Section */}
			<section className="py-8 sm:py-16 bg-white">
				<div className="max-w-screen-xl mx-auto px-3 sm:px-4 text-center">
				<div className="flex justify-center mb-4 sm:mb-6">
					<div className="bg-blue-100 p-3 sm:p-4 rounded-full">
						<HelpCircleIcon className="w-6 sm:w-8 h-6 sm:h-8 text-blue-600" />
					</div>
				</div>
				<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
					<span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
						{t("hero.title")}
					</span>
				</h1>
				<p className="text-base sm:text-lg lg:text-xl text-gray-600">
					{t("hero.subtitle")}
				</p>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="py-8 sm:py-16">
				<div className="max-w-4xl mx-auto px-3 sm:px-4">
					<div className="space-y-3 sm:space-y-4">
						{faqs.map((faq) => (
							<Card key={faq.id} className="hover:shadow-md transition-shadow">
								<CardHeader className="pb-2 sm:pb-4">
									<CardTitle className="flex items-center justify-between text-left text-sm sm:text-base lg:text-lg">
										<span className="pr-2">{faq.question}</span>
										<ChevronDownIcon className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 flex-shrink-0" />
									</CardTitle>
								</CardHeader>
								<CardContent className="pt-0">
									<CardDescription className="text-gray-600 text-sm sm:text-base leading-relaxed">
										{faq.answer}
									</CardDescription>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Help Section */}
			<section className="py-8 sm:py-16 bg-white">
				<div className="max-w-2xl mx-auto px-3 sm:px-4 text-center">
					<h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
				{t("help.title")}
			</h2>
			<p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
				{t("help.subtitle")}
			</p>
			<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
				<Button
					asChild
					variant="outline"
					size="lg"
					className="text-sm sm:text-base"
				>
					<Link to="/contact">{t("help.contactButton")}</Link>
				</Button>
				<Button asChild size="lg" className="text-sm sm:text-base">
					<Link to="/">{t("help.startButton")}</Link>
				</Button>
			</div>
				</div>
			</section>

			{/* Quick Start */}
			<section className="py-8 sm:py-16 bg-blue-50">
				<div className="max-w-screen-xl mx-auto px-3 sm:px-4">
					<h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
					{t("quickStart.title")}
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
					<div className="w-full text-center">
						<div className="bg-blue-600 text-white w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl font-bold">
							1
						</div>
						<h3 className="text-lg sm:text-xl font-semibold mb-2">
							{t("quickStart.steps.0.title")}
						</h3>
						<p className="text-gray-600 text-sm sm:text-base">
							{t("quickStart.steps.0.description")}
						</p>
					</div>
					<div className="w-full text-center">
						<div className="bg-blue-600 text-white w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl font-bold">
							2
						</div>
						<h3 className="text-lg sm:text-xl font-semibold mb-2">
							{t("quickStart.steps.1.title")}
						</h3>
						<p className="text-gray-600 text-sm sm:text-base">
							{t("quickStart.steps.1.description")}
						</p>
					</div>
					<div className="w-full text-center">
						<div className="bg-blue-600 text-white w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-lg sm:text-xl font-bold">
							3
						</div>
						<h3 className="text-lg sm:text-xl font-semibold mb-2">
							{t("quickStart.steps.2.title")}
						</h3>
						<p className="text-gray-600 text-sm sm:text-base">
							{t("quickStart.steps.2.description")}
						</p>
					</div>
					</div>
				</div>
			</section>
		</div>
	);
}
