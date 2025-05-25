// src/components/LanguageSwitcher.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <div className='flex items-center gap-2'>
      <label htmlFor='language-select'>🌐 Language:</label>
      <select id='language-select' value={i18n.language} onChange={handleChange} className='border rounded px-2 py-1'>
        <option value='en'>🇺🇸 English</option>
        <option value='vi'>🇻🇳 Tiếng Việt</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
