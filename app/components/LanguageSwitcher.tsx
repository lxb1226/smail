import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router';
import {
  supportedLanguages,
  type SupportedLanguage,
  languageConfig,
  getCurrentLanguage,
  changeLanguage,
  generateLocalizedPath
} from '~/lib/i18n';

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLanguage = getCurrentLanguage();
  
  const handleLanguageChange = async (newLanguage: SupportedLanguage) => {
    try {
      // 切换i18n语言
      await changeLanguage(newLanguage);
      
      // 生成新的路径
      const newPath = generateLocalizedPath(location.pathname, newLanguage);
      
      // 导航到新路径
      navigate(newPath);
      
      // 关闭下拉菜单
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };
  
  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        className="inline-flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="mr-2">{languageConfig[currentLanguage]?.flag}</span>
        <span className="hidden sm:inline">{languageConfig[currentLanguage]?.nativeName}</span>
        <svg
          className="w-4 h-4 ml-2 -mr-1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* 下拉菜单 */}
          <div className="absolute right-0 z-20 w-48 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical">
              {supportedLanguages.map((language) => {
                const config = languageConfig[language];
                const isActive = language === currentLanguage;
                
                return (
                  <button
                    key={language}
                    className={`${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    } group flex items-center w-full px-4 py-2 text-sm transition-colors duration-150`}
                    role="menuitem"
                    onClick={() => handleLanguageChange(language)}
                  >
                    <span className="mr-3 text-lg">{config?.flag}</span>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{config?.nativeName}</span>
                      <span className="text-xs text-gray-500">{config?.name}</span>
                    </div>
                    {isActive && (
                      <svg
                        className="w-4 h-4 ml-auto text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// 简化版语言切换器（仅显示标志）
export function LanguageSwitcherCompact({ className = '' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentLanguage = getCurrentLanguage();
  const currentIndex = supportedLanguages.indexOf(currentLanguage);
  
  const handleToggleLanguage = async () => {
    // 循环切换到下一个语言
    const nextIndex = (currentIndex + 1) % supportedLanguages.length;
    const nextLanguage = supportedLanguages[nextIndex];
    
    try {
      await changeLanguage(nextLanguage);
      const newPath = generateLocalizedPath(location.pathname, nextLanguage);
      navigate(newPath);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };
  
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center w-10 h-10 text-lg bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ${className}`}
      onClick={handleToggleLanguage}
      title={`Switch to ${languageConfig[supportedLanguages[(currentIndex + 1) % supportedLanguages.length]]?.nativeName}`}
    >
      {languageConfig[currentLanguage]?.flag}
    </button>
  );
}