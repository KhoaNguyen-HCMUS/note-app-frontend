import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe, FaLanguage } from 'react-icons/fa';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'EN', icon: <FaGlobe />, title: 'English' },
    { code: 'vi', label: 'VI', icon: <FaLanguage />, title: 'Tiếng Việt' },
  ];

  return (
    <div className='flex items-center gap-2 p-2 rounded-lg bg-card-bg dark:bg-gray-700'>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`cursor-pointer p-2 rounded-md transition-colors flex items-center gap-2 ${
            i18n.language === lang.code
              ? 'bg-white dark:bg-gray-800 text-accent shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
          title={lang.title}
        >
          {lang.icon}
          <span className='font-medium'>{lang.label}</span>
        </button>
      ))}
    </div>
  );
}
