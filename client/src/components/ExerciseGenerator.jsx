import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';
import ResultsDisplay from './ResultsDisplay';
import { generateExercises } from '../services/api';
import { useLanguage } from '../App';

function ExerciseGenerator({ onExerciseCompleted, selectedExercise }) {
  const { language, t } = useLanguage();
  const [topic, setTopic] = useState('');
  const [subtopic, setSubtopic] = useState('');
  const [exercises, setExercises] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  // Load saved data from localStorage or selected exercise
  useEffect(() => {
    if (selectedExercise) {
      // Load selected exercise from dashboard
      setExercises([selectedExercise]);
      setTopic(selectedExercise.topic);
      setSubtopic(selectedExercise.subtopic || '');
      setCurrentLevel(selectedExercise.level);
      
      // Load saved answers for this exercise
      const savedAnswers = JSON.parse(localStorage.getItem('lastAnswers') || '{}');
      const exerciseKey = `${selectedExercise.level}-${selectedExercise.topic}`;
      const exerciseAnswers = savedAnswers[exerciseKey] || {};
      
      // Convert to the format expected by the component
      const formattedAnswers = {};
      Object.keys(exerciseAnswers).forEach(questionId => {
        formattedAnswers[`${selectedExercise.level}-${questionId}`] = exerciseAnswers[questionId];
      });
      setUserAnswers(formattedAnswers);
    } else {
      // Reset for new exercise generation
      setExercises(null);
      setUserAnswers({});
      setCurrentLevel(null);
      setProgress(0);
      setShowResults(false);
    }
  }, [selectedExercise]);

  // Update progress when currentLevel or userAnswers change
  useEffect(() => {
    if (currentLevel && exercises) {
      const currentExercise = exercises.find(e => e.level === currentLevel);
      const answeredCount = Object.keys(userAnswers).filter(
        key => key.startsWith(`${currentLevel}-`)
      ).length;
      setProgress((answeredCount / currentExercise.questions.length) * 100);
    }
  }, [currentLevel, userAnswers, exercises]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError(t.errorTopicRequired);
      return;
    }

    setLoading(true);
    setError(null);
    setShowResults(false);
    setUserAnswers({});
    setCurrentLevel(null);
    setProgress(0);

    try {
      const data = await generateExercises(topic, subtopic);
      setExercises(data.exercises);
      localStorage.setItem('lastExercises', JSON.stringify(data.exercises));
      
      // Save to exercise history
      const history = JSON.parse(localStorage.getItem('exerciseHistory') || '[]');
      
      // Save all exercises with proper structure
      data.exercises.forEach(exercise => {
        const exerciseWithDate = {
          ...exercise,
          topic,
          subtopic,
          dateCreated: new Date().toISOString()
        };
        history.push(exerciseWithDate);
      });
      
      localStorage.setItem('exerciseHistory', JSON.stringify(history));
    } catch (err) {
      setError(t.errorGeneration);
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setUserAnswers(prev => {
      const newAnswers = {
        ...prev,
        [`${currentLevel}-${questionId}`]: answer
      };
      
      // Save answers to localStorage with proper structure
      const savedAnswers = JSON.parse(localStorage.getItem('lastAnswers') || '{}');
      const exerciseKey = `${currentLevel}-${topic}`;
      if (!savedAnswers[exerciseKey]) {
        savedAnswers[exerciseKey] = {};
      }
      savedAnswers[exerciseKey][questionId] = answer;
      localStorage.setItem('lastAnswers', JSON.stringify(savedAnswers));
      
      // Update progress with the new answers
      const currentExercise = exercises.find(e => e.level === currentLevel);
      const answeredCount = Object.keys(newAnswers).filter(
        key => key.startsWith(`${currentLevel}-`)
      ).length;
      setProgress((answeredCount / currentExercise.questions.length) * 100);
      
      return newAnswers;
    });
  };

  const handleSubmit = () => {
    // Don't overwrite the properly structured answers - they're already saved in handleAnswerSelect
    setShowResults(true);
    
    // Save score to history
    const score = calculateScore();
    const history = JSON.parse(localStorage.getItem('scoreHistory') || '[]');
    history.push({
      date: new Date().toISOString(),
      topic,
      level: currentLevel,
      score
    });
    localStorage.setItem('scoreHistory', JSON.stringify(history));
    
    // Notify parent component about completed exercise
    if (onExerciseCompleted) {
      const completedExercise = {
        topic,
        subtopic,
        level: currentLevel,
        score,
        dateCompleted: new Date().toISOString()
      };
      onExerciseCompleted(completedExercise);
    }
  };

  const calculateScore = () => {
    const currentExercise = exercises.find(e => e.level === currentLevel);
    let correct = 0;
    
    currentExercise.questions.forEach(q => {
      if (userAnswers[`${currentLevel}-${q.id}`] === q.correctAnswer) {
        correct++;
      }
    });
    
    return (correct / currentExercise.questions.length) * 100;
  };

  const resetExercise = () => {
    setShowResults(false);
    setUserAnswers({});
    setProgress(0);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Input Section */}
      {!exercises && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t.generateExercises}</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.topicLabel}
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={t.topicPlaceholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dir={language === 'he' ? 'rtl' : 'ltr'}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.subtopicLabel}
              </label>
              <input
                type="text"
                value={subtopic}
                onChange={(e) => setSubtopic(e.target.value)}
                placeholder={t.subtopicPlaceholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dir={language === 'he' ? 'rtl' : 'ltr'}
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t.generating}
                </span>
              ) : (
                t.generateButton
              )}
            </button>
          </div>
        </div>
      )}

      {/* Level Selection */}
      {exercises && !currentLevel && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">{t.selectLevel}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exercises.map(exercise => (
              <button
                key={exercise.level}
                onClick={() => setCurrentLevel(exercise.level)}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition duration-200"
              >
                <h3 className="text-xl font-bold mb-2">{t.levels[exercise.level]}</h3>
                <p className="text-gray-600">{t.questionsCount}: 10</p>
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setExercises(null)}
            className="mt-6 text-blue-600 hover:text-blue-800 font-medium"
          >
            ← {t.backToTopics}
          </button>
        </div>
      )}

      {/* Questions Display */}
      {exercises && currentLevel && !showResults && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                {t.levels[currentLevel]} - {topic}
              </h2>
              <button
                onClick={() => setCurrentLevel(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                ← {t.back}
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {t.progress}: {Math.round(progress)}%
            </p>
          </div>

          <div className="space-y-6">
            {exercises
              .find(e => e.level === currentLevel)
              .questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  questionIndex={index}
                  totalQuestions={exercises.find(e => e.level === currentLevel).questions.length}
                  selectedAnswer={userAnswers[`${currentLevel}-${question.id}`]}
                  onAnswerSelect={handleAnswerSelect}
                />
              ))}
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={(() => {
                const currentExercise = exercises.find(e => e.level === currentLevel);
                const answeredCount = Object.keys(userAnswers).filter(key => 
                  key.startsWith(`${currentLevel}-`)
                ).length;
                return answeredCount < currentExercise.questions.length;
              })()}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.submitExercise}
            </button>
            
            <button
              onClick={resetExercise}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              {t.reset}
            </button>
          </div>
        </div>
      )}

      {/* Results Display */}
      {showResults && (
        <ResultsDisplay
          exercises={exercises}
          currentLevel={currentLevel}
          userAnswers={userAnswers}
          onRetry={resetExercise}
          onNewExercise={() => {
            setExercises(null);
            setCurrentLevel(null);
            setShowResults(false);
            setUserAnswers({});
            setProgress(0);
          }}
          onContinueToLevel={(level) => {
            // If we're continuing to a level that's not in current exercises, load it from history
            const currentExercise = exercises.find(e => e.level === level);
            if (!currentExercise) {
              // Load the exercise from history
              const savedExercises = JSON.parse(localStorage.getItem('exerciseHistory') || '[]');
              const targetExercise = savedExercises.find(ex => 
                ex.topic === topic && ex.level === level
              );
              if (targetExercise) {
                setExercises([targetExercise]);
              }
            }
            
            setCurrentLevel(level);
            setShowResults(false);
            setProgress(0);
          }}
        />
      )}
    </div>
  );
}

export default ExerciseGenerator;
