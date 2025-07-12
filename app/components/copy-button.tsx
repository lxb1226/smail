import type { VariantProps } from "class-variance-authority";
import { CheckIcon, CopyIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, type buttonVariants } from "~/components/ui/button";

interface CopyButtonProps extends VariantProps<typeof buttonVariants> {
	text: string;
	className?: string;
}

export function CopyButton({ text, ...props }: CopyButtonProps) {
	const { t } = useTranslation("common");
	const icons = {
		idle: <CopyIcon />,
		success: <CheckIcon className="text-green-500" />,
		error: <XIcon className="text-red-500" />,
	};
	const texts = {
		idle: t("actions.copyAddress"),
		success: t("actions.copySuccess"),
		error: t("actions.copyError"),
	};
	const [icon, setIcon] = useState<keyof typeof icons>("idle");
	return (
		<Button
			variant="outline"
			onClick={() => {
				// 确保在浏览器环境中才使用 clipboard API
				if (typeof window !== "undefined" && navigator.clipboard) {
					navigator.clipboard
						.writeText(text)
						.then(() => {
							setIcon("success");
						})
						.catch(() => {
							setIcon("error");
						})
						.finally(() => {
							setTimeout(() => {
								setIcon("idle");
							}, 2000);
						});
				} else {
					// 备用方案：使用传统的选择和复制方法
					try {
						const textArea = document.createElement("textarea");
						textArea.value = text;
						document.body.appendChild(textArea);
						textArea.select();
						document.execCommand("copy");
						document.body.removeChild(textArea);
						setIcon("success");
					} catch {
						setIcon("error");
					} finally {
						setTimeout(() => {
							setIcon("idle");
						}, 2000);
					}
				}
			}}
			{...props}
		>
			{icons[icon]}
			<span>{texts[icon]}</span>
		</Button>
	);
}
