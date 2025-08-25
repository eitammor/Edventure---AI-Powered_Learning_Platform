import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExerciseCard from './ExerciseCard';
import { useLanguage } from '../App';
import { cleanupExerciseHistory } from '../utils/cleanupStorage';
import { buildTopicExam } from '../lib/exams.js';

function Dashboard({ onSelectExercise, onBackToGenerator }) {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [exercises, setExercises] = useState([]);
  const [filter, setFilter] = useState('all'); // all, completed, in-progress, not-started

  useEffect(() => {
    // Clean up duplicates automatically when dashboard loads
    cleanupExerciseHistory();
    loadExercises();
  }, []);

  // Refresh exercises when component becomes visible (when returning from exercise)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadExercises();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const loadExercises = () => {
    const savedExercises = JSON.parse(localStorage.getItem('exerciseHistory') || '[]');
    const savedAnswers = JSON.parse(localStorage.getItem('lastAnswers') || '{}');
    
    // Process exercises to add status and progress
    const processedExercises = savedExercises.map(exercise => {
      const exerciseKey = `${exercise.level}-${exercise.topic}`;
      const userAnswers = savedAnswers[exerciseKey] || {};
      
      // Count answered questions for this specific exercise
      const answeredCount = Object.keys(userAnswers).length;
      const totalQuestions = exercise.questions ? exercise.questions.length : 10;
      const progress = (answeredCount / totalQuestions) * 100;
      
      // Determine status based on progress
      let status = 'not-started';
      if (progress === 100) {
        status = 'completed';
      } else if (progress > 0) {
        status = 'in-progress';
      }

      // Calculate score and correct answers count if completed
      let score = null;
      let correctAnswers = 0;
      if (status === 'completed' && exercise.questions) {
        exercise.questions.forEach(q => {
          if (userAnswers[q.id] === q.correctAnswer) {
            correctAnswers++;
          }
        });
        score = (correctAnswers / totalQuestions) * 100;
      }



      return {
        ...exercise,
        status,
        progress,
        score,
        answeredCount,
        totalQuestions,
        correctAnswers,
        userAnswers
      };
    });

    setExercises(processedExercises);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '⏳';
      case 'not-started': return '❌';
      default: return '❌';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'not-started': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredExercises = exercises.filter(exercise => {
    if (filter === 'all') return true;
    return exercise.status === filter;
  });

  const groupedExercises = filteredExercises.reduce((groups, exercise) => {
    const key = exercise.topic;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(exercise);
    return groups;
  }, {});

  const handleExerciseSelect = (exercise) => {
    onSelectExercise(exercise);
  };



  const handleClearAllData = () => {
    // Show confirmation dialog
    const isConfirmed = window.confirm(
      language === 'he' 
        ? 'האם אתה בטוח שברצונך למחוק את כל הנתונים? פעולה זו אינה הפיכה.'
        : 'Are you sure you want to clear all data? This action cannot be undone.'
    );
    
    if (isConfirmed) {
      // Clear all exercise data from localStorage
      localStorage.removeItem('exerciseHistory');
      localStorage.removeItem('lastAnswers');
      localStorage.removeItem('scoreHistory');
      localStorage.removeItem('lastExercises');
      
      // Reload exercises (will be empty now)
      loadExercises();
    }
  };

  const handleBuildTopicExam = (topicId) => {
    try {
      const examId = buildTopicExam(topicId);
      // Navigate to the exam runner
      navigate(`/exam/${examId}`);
    } catch (error) {
      console.error('Error building topic exam:', error);
      alert(language === 'he' 
        ? 'שגיאה ביצירת בחינה. אנא ודא שיש תרגילים זמינים לנושא זה.'
        : 'Error creating exam. Please ensure there are exercises available for this topic.'
      );
    }
  };



  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {t.dashboardTitle || 'My Learning Path'}
            </h1>
            <p className="text-gray-600">
              {t.dashboardSubtitle || 'Track your learning progress and revisit exercises'}
            </p>
          </div>
                                                                                                               <div className="flex gap-3">
                      <button
                        onClick={handleClearAllData}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                      >
                        {t.clearAllData || 'Clear All Data'}
                      </button>
                   </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{exercises.length}</div>
            <div className="text-sm text-blue-600">{t.totalExercises || 'Total Exercises'}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {exercises.filter(e => e.status === 'completed').length}
            </div>
            <div className="text-sm text-green-600">{t.completed || 'Completed'}</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {exercises.filter(e => e.status === 'in-progress').length}
            </div>
            <div className="text-sm text-yellow-600">{t.inProgress || 'In Progress'}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">
              {exercises.filter(e => e.status === 'not-started').length}
            </div>
            <div className="text-sm text-gray-600">{t.notStarted || 'Not Started'}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition duration-200 ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t.all || 'All'}
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg transition duration-200 ${
              filter === 'completed' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t.completed || 'Completed'}
          </button>
          <button
            onClick={() => setFilter('in-progress')}
            className={`px-4 py-2 rounded-lg transition duration-200 ${
              filter === 'in-progress' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t.inProgress || 'In Progress'}
          </button>
          <button
            onClick={() => setFilter('not-started')}
            className={`px-4 py-2 rounded-lg transition duration-200 ${
              filter === 'not-started' 
                ? 'bg-gray-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t.notStarted || 'Not Started'}
          </button>
        </div>
      </div>

      {/* Exercise Groups */}
      {Object.keys(groupedExercises).length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {t.noExercisesTitle || 'No Exercises Yet'}
          </h2>
          <p className="text-gray-600 mb-6">
            {t.noExercisesSubtitle || 'Start your learning journey by generating your first exercise!'}
          </p>
          <button
            onClick={onBackToGenerator}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {t.createFirstExercise || 'Create Your First Exercise'}
          </button>
        </div>
      ) : (
                 <div className="space-y-8">
           {Object.entries(groupedExercises).map(([topic, topicExercises]) => (
             <div key={topic} className="bg-white rounded-lg shadow-lg p-6">
               <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-semibold text-gray-800">{topic}</h2>
                 <button 
                   onClick={() => handleBuildTopicExam(topic)}
                   className="px-3 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200 text-sm font-medium"
                 >
                   {t.topicExam || 'Exam'}
                 </button>
               </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                 {topicExercises.map((exercise, index) => (
                   <ExerciseCard
                     key={`${exercise.level}-${index}`}
                     exercise={exercise}
                     onSelect={handleExerciseSelect}
                     getStatusIcon={getStatusIcon}
                     getStatusColor={getStatusColor}
                   />
                 ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
