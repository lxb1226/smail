import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { initializeI18n, getCurrentLanguage } from "./lib/i18n";

// 在客户端初始化i18n，确保与服务器端状态同步
const currentLang = getCurrentLanguage(window.location.pathname);
initializeI18n(currentLang).then(() => {
	hydrateRoot(document, <HydratedRouter />);
});