import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

// 直接进行hydration，不等待i18n初始化
// i18n已经在模块导入时初始化了
hydrateRoot(document, <HydratedRouter />);