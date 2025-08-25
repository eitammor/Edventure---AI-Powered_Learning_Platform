import React from 'react';
import { useLanguage } from '../App';

function ResultsDisplay({ 
  exercises, 
  currentLevel, 
  userAnswers, 
  onRetry, 
  onNewExercise, 
  onContinueToLevel,
  // New props for exam mode
  questions,
  score,
  correctAnswers,
  totalQuestions,
  onBackToHome,
  examMode = false
}) {
  const { language, t } = useLanguage();
  const currentExercise = exercises?.find(e => e.level === currentLevel);
  const isRTL = language === 'he';
  
  const calculateResults = () => {
    if (examMode) {
      // Exam mode - use provided data
      const details = questions.map(q => ({
        question: q,
        userAnswer: userAnswers[String(q._qid)],
        isCorrect: userAnswers[String(q._qid)] === q.correctAnswer
      }));
      
      return {
        score: score,
        correct: correctAnswers,
        total: totalQuestions,
        details
      };
    } else {
      // Regular exercise mode
      let correct = 0;
      const details = [];
      
      currentExercise.questions.forEach(q => {
        const userAnswer = userAnswers[`${currentLevel}-${q.id}`];
        const isCorrect = userAnswer === q.correctAnswer;
        if (isCorrect) correct++;
        
        details.push({
          question: q,
          userAnswer,
          isCorrect
        });
      });
      
      return {
        score: (correct / currentExercise.questions.length) * 100,
        correct,
        total: currentExercise.questions.length,
        details
      };
    }
  };
  
  const results = calculateResults();
  
  // Get available levels that haven't been completed yet
  const getAvailableLevels = () => {
    if (examMode) return []; // No level navigation in exam mode
    
    if (!exercises) return [];
    
    // If we have multiple exercises loaded, filter them
    if (exercises.length > 1) {
      return exercises.filter(exercise => {
        if (exercise.level === currentLevel) return false; // Skip current level
        
        // Check if this level has been completed
        const exerciseKey = `${exercise.level}-${exercise.topic || 'unknown'}`;
        const savedAnswers = JSON.parse(localStorage.getItem('lastAnswers') || '{}');
        const levelAnswers = savedAnswers[exerciseKey] || {};
        const answeredCount = Object.keys(levelAnswers).length;
        
        // Return true if not completed (answeredCount < total questions)
        return answeredCount < (exercise.questions ? exercise.questions.length : 10);
      });
    }
    
    // If we have only one exercise (from dashboard), check all levels for this topic
    const currentExercise = exercises[0];
    const topic = currentExercise.topic;
    
    // Get all exercises for this topic from localStorage
    const savedExercises = JSON.parse(localStorage.getItem('exerciseHistory') || '[]');
    const topicExercises = savedExercises.filter(ex => ex.topic === topic);
    
    return topicExercises.filter(exercise => {
      if (exercise.level === currentLevel) return false; // Skip current level
      
      // Check if this level has been completed
      const exerciseKey = `${exercise.level}-${exercise.topic || 'unknown'}`;
      const savedAnswers = JSON.parse(localStorage.getItem('lastAnswers') || '{}');
      const levelAnswers = savedAnswers[exerciseKey] || {};
      const answeredCount = Object.keys(levelAnswers).length;
      
      // Return true if not completed (answeredCount < total questions)
      return answeredCount < (exercise.questions ? exercise.questions.length : 10);
    });
  };
  
  const availableLevels = getAvailableLevels();
  
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${isRTL ? 'text-right' : ''}`}>
      <h2 className="text-3xl font-bold mb-6 text-center">{t.results}</h2>
      
      {/* Score Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-8">
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">
            {results.score.toFixed(1)}%
          </div>
          <div className="text-xl">
            {results.correct} / {results.total} {t.correct}
          </div>
        </div>
      </div>
      
      {/* Detailed Results */}
      <div className="space-y-4 mb-8">
        <h3 className="text-xl font-semibold mb-4">{t.detailedResults}</h3>
        
        {results.details.map((detail, index) => (
          <div 
            key={index}
            className={`border rounded-lg p-4 ${
              detail.isCorrect 
                ? 'border-green-300 bg-green-50' 
                : 'border-red-300 bg-red-50'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold">
                {index + 1}. {detail.question.question}
              </h4>
              <span className={`px-2 py-1 rounded text-sm font-medium ${
                detail.isCorrect 
                  ? 'bg-green-200 text-green-800' 
                  : 'bg-red-200 text-red-800'
              }`}>
                {detail.isCorrect ? '✓' : '✗'}
              </span>
            </div>
            
            <div className="text-sm space-y-1">
              <p>
                <strong>{t.yourAnswer}:</strong> {detail.userAnswer || t.noAnswer} - 
                {detail.userAnswer && detail.question.choices[detail.userAnswer]}
              </p>
              <p>
                <strong>{t.correctAnswer}:</strong> {detail.question.correctAnswer} - 
                {detail.question.choices[detail.question.correctAnswer]}
              </p>
              
              {/* Show explanation */}
              {detail.question.explanation && (
                <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200">
                  <strong>{t.explanation}:</strong> {detail.question.explanation}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Action Buttons */}
      <div className="space-y-4">
        {examMode ? (
          /* Exam Mode - Single Back to Home Button */
          <div className="flex justify-center">
            <button
              onClick={onBackToHome}
              className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
            >
              {t.backToHome || 'Back to Home'}
            </button>
          </div>
        ) : (
          /* Regular Exercise Mode */
          <>
            {/* Main Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={onRetry}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
              >
                {t.retryExercise}
              </button>
              
              <button
                onClick={onNewExercise}
                className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition duration-200"
              >
                {t.newExercise}
              </button>
            </div>
            
            {/* Continue to Other Levels */}
            {availableLevels.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold mb-3 text-center">
                  {t.continueToOtherLevels || 'Continue to Other Levels'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableLevels.map((exercise) => (
                    <button
                      key={exercise.level}
                      onClick={() => onContinueToLevel(exercise.level)}
                      className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
                    >
                      {t.levels[exercise.level] || exercise.level}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ResultsDisplay;
