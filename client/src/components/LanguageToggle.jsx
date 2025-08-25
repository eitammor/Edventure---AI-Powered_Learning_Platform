import React from 'react';
import { useLanguage } from '../App';

function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded ${
          language === 'en' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        English
      </button>
      <button
        onClick={() => setLanguage('he')}
        className={`px-3 py-1 rounded ${
          language === 'he' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        עברית
      </button>
    </div>
  );
}

export default LanguageToggle;
