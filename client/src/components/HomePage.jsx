import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../App';
import LanguageToggle from './LanguageToggle';

function HomePage() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const isRTL = language === 'he';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {t.title || 'Edventure'}
            </h1>
            <p className="text-gray-600">
              {t.subtitle || 'Your Learning Journey Starts Here'}
            </p>
          </div>

          {/* Simple Logo */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-4xl font-bold">🧠</span>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="mb-8 flex justify-center">
            <LanguageToggle />
          </div>

          {/* Main Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => navigate('/app')}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
            >
              {t.startLearning || 'Start Learning'}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {t.welcomeMessage || 'Welcome to your personalized learning experience'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
