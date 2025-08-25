import React from 'react';
import { useLanguage } from '../App';

function ExerciseCard({ exercise, onSelect, getStatusIcon, getStatusColor }) {
  const { language, t } = useLanguage();
  const isRTL = language === 'he';

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
        exercise.status === 'completed' ? 'border-green-300 bg-green-50' :
        exercise.status === 'in-progress' ? 'border-yellow-300 bg-yellow-50' :
        'border-gray-300 bg-gray-50'
      }`}
      onClick={() => onSelect(exercise)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getStatusIcon(exercise.status)}</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(exercise.status)}`}>
            {t[exercise.status] || exercise.status}
          </span>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(exercise.level)}`}>
          {t.levels[exercise.level] || exercise.level}
        </span>
      </div>

      {/* Topic */}
      <h3 className="font-semibold text-gray-800 mb-2" dir={isRTL ? 'rtl' : 'ltr'}>
        {exercise.topic}
        {exercise.subtopic && (
          <span className="text-sm text-gray-600 block">
            {exercise.subtopic}
          </span>
        )}
      </h3>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>{t.progress || 'Progress'}</span>
          <span>{Math.round(exercise.progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              exercise.status === 'completed' ? 'bg-green-500' :
              exercise.status === 'in-progress' ? 'bg-yellow-500' :
              'bg-gray-400'
            }`}
            style={{ width: `${exercise.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div className="text-gray-600">
          {t.questions || 'Questions'}: {exercise.answeredCount}/{exercise.totalQuestions}
        </div>
        {exercise.status === 'completed' && exercise.correctAnswers !== undefined ? (
          <div className="text-right font-semibold text-green-600">
            {t.correctAnswers || 'Correct'}: {exercise.correctAnswers}/{exercise.totalQuestions}
          </div>
        ) : exercise.score !== null ? (
          <div className="text-right font-semibold text-green-600">
            {t.score || 'Score'}: {exercise.score.toFixed(1)}%
          </div>
        ) : null}
      </div>

      {/* Date */}
      <div className="text-xs text-gray-500 text-center">
        {exercise.dateCreated ? formatDate(exercise.dateCreated) : t.noDate || 'No date'}
      </div>

      {/* Action Button */}
      <div className="mt-3">
        <button
          className={`w-full py-2 px-3 rounded text-sm font-medium transition duration-200 ${
            exercise.status === 'completed' 
              ? 'bg-green-600 text-white hover:bg-green-700' :
            exercise.status === 'in-progress'
              ? 'bg-yellow-600 text-white hover:bg-yellow-700' :
              'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(exercise);
          }}
        >
          {exercise.status === 'completed' ? (t.review || 'Review') :
           exercise.status === 'in-progress' ? (t.continue || 'Continue') :
           (t.start || 'Start')}
        </button>
      </div>
    </div>
  );
}

export default ExerciseCard;
