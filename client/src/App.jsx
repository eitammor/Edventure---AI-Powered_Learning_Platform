import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import ExerciseGenerator from './components/ExerciseGenerator';
import Dashboard from './components/Dashboard';
import ExamRunner from './components/ExamRunner';
import LanguageToggle from './components/LanguageToggle';
import { translations } from './translations/translations';
import './App.css';

// Create a context for language
const LanguageContext = createContext();

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

function AppContent() {
  const { language, setLanguage, t } = useLanguage();
  const [currentView, setCurrentView] = useState('generator'); // 'generator' or 'dashboard'
  const [selectedExercise, setSelectedExercise] = useState(null);
  const location = useLocation();

  // Don't show header and navigation on exam pages
  const isExamPage = location.pathname.startsWith('/exam/');

  if (isExamPage) {
    return <ExamRunner language={language} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-gray-800">
              {t.title}
            </h1>
            <div className="flex items-center gap-4">
              <nav className="flex gap-2">
                <button
                  onClick={() => {
                    setCurrentView('generator');
                    setSelectedExercise(null);
                  }}
                  className={`px-4 py-2 rounded-lg transition duration-200 ${
                    currentView === 'generator'
                      ? 'bg-blue-600 text-white hover:bg-blue-900'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {t.generateExercises}
                </button>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-4 py-2 rounded-lg transition duration-200 ${
                    currentView === 'dashboard'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {t.myLearningPath}
                </button>
              </nav>
              <LanguageToggle />
            </div>
          </div>
          <p className="text-gray-600 mt-2">{t.subtitle}</p>
        </header>
        
        {currentView === 'generator' ? (
          <ExerciseGenerator 
            selectedExercise={selectedExercise}
            onExerciseCompleted={(exercise) => {
              // Save exercise to history when completed
              const history = JSON.parse(localStorage.getItem('exerciseHistory') || '[]');
              const exerciseWithDate = {
                ...exercise,
                dateCreated: new Date().toISOString()
              };
              history.push(exerciseWithDate);
              localStorage.setItem('exerciseHistory', JSON.stringify(history));
            }}
          />
        ) : (
          <Dashboard
            key="dashboard"
            onSelectExercise={(exercise) => {
              setSelectedExercise(exercise);
              setCurrentView('generator');
            }}
            onBackToGenerator={() => {
              setCurrentView('generator');
              setSelectedExercise(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

function App() {
  const [language, setLanguage] = useState('en');
  const [t, setT] = useState(translations.en);

  useEffect(() => {
    setT(translations[language]);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/app" element={<AppContent />} />
          <Route path="/exam/:id" element={<ExamRunner />} />
        </Routes>
      </Router>
    </LanguageContext.Provider>
  );
}

export default App;
