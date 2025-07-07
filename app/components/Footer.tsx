import { Github, Mail, MessageSquare, Shield, Twitter } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import friendlyLinksData from "../data/friendly-links.json";

export function Footer() {
	const { t } = useTranslation(["common", "home"]);
	return (
		<footer className="bg-gray-900 text-white">
			<div className="container mx-auto px-4 py-12">
				<div className="grid md:grid-cols-5 gap-8">
				{/* 品牌信息 */}
				<div className="col-span-1 md:col-span-2">
						<div className="flex items-center space-x-3 mb-4">
							<div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-2">
								<Mail className="h-6 w-6 text-white" />
							</div>
							<div>
								<h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
									{t("brand.name")}
								</h3>
								<p className="text-sm text-gray-400">{t("brand.tagline")}</p>
							</div>
						</div>
						<p className="text-gray-300 leading-relaxed mb-4">
							{t("home:hero.description")}
						</p>
						<div className="flex space-x-4">
							<Link
								to="/contact"
								className="text-gray-400 hover:text-blue-400 transition-colors"
								aria-label={t("navigation.contact")}
							>
								<MessageSquare className="h-5 w-5" />
							</Link>
							{/* <a
								href="https://github.com/akazwz/smail"
								className="text-gray-400 hover:text-blue-400 transition-colors"
								aria-label="GitHub"
							>
								<Github className="h-5 w-5" />
							</a>
							<a
								href="https://twitter.com/akazwz_"
								className="text-gray-400 hover:text-blue-400 transition-colors"
								aria-label="Twitter"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Twitter className="h-5 w-5" />
							</a> */}
							<Link
								to="/privacy"
								className="text-gray-400 hover:text-blue-400 transition-colors"
								aria-label={t("navigation.privacy")}
							>
								<Shield className="h-5 w-5" />
							</Link>
						</div>
					</div>

					{/* 快速链接 */}
					<div>
						<h4 className="text-lg font-semibold mb-4">
							{t("footer.quickLinks")}
						</h4>
						<ul className="space-y-2">
							<li>
								<Link
									to="/"
									className="text-gray-300 hover:text-blue-400 transition-colors"
								>
									{t("navigation.home")}
								</Link>
							</li>
							<li>
								<Link
									to="/about"
									className="text-gray-300 hover:text-blue-400 transition-colors"
								>
									{t("navigation.about")}
								</Link>
							</li>
							<li>
								<Link
									to="/faq"
									className="text-gray-300 hover:text-blue-400 transition-colors"
								>
									{t("navigation.faq")}
								</Link>
							</li>
							<li>
								<Link
									to="/terms"
									className="text-gray-300 hover:text-blue-400 transition-colors"
								>
									{t("navigation.terms")}
								</Link>
							</li>
						</ul>
					</div>

					{/* 友情链接 */}
				<div>
					<h4 className="text-lg font-semibold mb-4">
						{t("footer.friendlyLinks")}
					</h4>
					<ul className="space-y-2">
						{friendlyLinksData.links.map((link) => (
							<li key={link.id}>
								<a
									href={link.url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-300 hover:text-blue-400 transition-colors"
									title={link.description}
								>
									{link.name}
								</a>
							</li>
						))}
					</ul>
				</div>

				{/* 联系我们 */}
				<div>
					<h4 className="text-lg font-semibold mb-4">
						{t("footer.support")}
					</h4>
						<ul className="space-y-2">
							{/* <li>
								<Link
									to="/contact"
									className="text-gray-300 hover:text-blue-400 transition-colors"
								>
									{t('navigation.contact')}
								</Link>
							</li> */}
							<li>
								<Link
									to="/privacy"
									className="text-gray-300 hover:text-blue-400 transition-colors"
								>
									{t("navigation.privacy")}
								</Link>
							</li>
							<li>
								<Link
									to="/faq"
									className="text-gray-300 hover:text-blue-400 transition-colors"
								>
									{t("footer.help")}
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* 分割线 */}
				<div className="border-t border-gray-800 mt-8 pt-8">
					<div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
						<div className="text-sm text-gray-400">{t("footer.copyright")}</div>
						<div className="flex space-x-6 text-sm text-gray-400">
							<span className="text-gray-500">{t("footer.features")}</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
