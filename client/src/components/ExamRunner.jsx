import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExamById, getExamQuestions } from '../lib/exams.js';
import { useLanguage } from '../App';
import QuestionCard from './QuestionCard';
import ResultsDisplay from './ResultsDisplay';

function ExamRunner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadExam();
  }, [id]);

  useEffect(() => { 
    setUserAnswers({}); 
  }, [id]);

  useEffect(() => {
    if (exam && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up! Auto-submit
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [exam, timeLeft]);

  const loadExam = () => {
    try {
      const examData = getExamById(id);
      if (!examData) {
        setError('Exam not found');
        setIsLoading(false);
        return;
      }
      //Load questions
      const examQuestions = getExamQuestions(examData);
      if (examQuestions.length === 0) {
        setError('No questions found for this exam');
        setIsLoading(false);
        return;
      }

      const questionsWithKeys = examQuestions.map((q, idx) => ({
        ...q,
        _qid: `${examData.id}-${idx}`   // exam-scoped key
      }));

      setExam(examData);
      setQuestions(questionsWithKeys);
      setTimeLeft((examData.config.timerMinutes ?? 20) * 60); // Convert minutes to seconds with fallback
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load exam');
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionKey, answer) => {
    const qKey = String(questionKey);
    setUserAnswers(prev => ({ ...prev, [qKey]: answer }));
  };

  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
    // Save exam attempt
    const attempt = {
      id: Date.now().toString(),
      answers: userAnswers,
      completedAt: new Date().toISOString(),
      timeSpent: ((exam.config.timerMinutes ?? 20) * 60) - timeLeft
    };

    const updatedExam = {
      ...exam,
      attempts: [...(exam.attempts || []), attempt]
    };

    // Update localStorage
    const store = JSON.parse(localStorage.getItem('exams') || '{}');
    store[exam.id] = updatedExam;
    localStorage.setItem('exams', JSON.stringify(store));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const answeredCount = questions.filter(q => userAnswers[String(q._qid)] !== undefined).length;
    const total = questions.length;
    return total ? Math.round((answeredCount / total) * 100) : 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t.loading || 'Loading exam...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{t.error || 'Error'}</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/app')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {t.backToHome || 'Back to Home'}
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const correctAnswers = questions.filter(q => userAnswers[String(q._qid)] === q.correctAnswer).length;
    const score = (correctAnswers / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <ResultsDisplay
            questions={questions}
            userAnswers={userAnswers}
            score={score}
            correctAnswers={correctAnswers}
            totalQuestions={questions.length}
            onBackToHome={() => navigate('/app')}
            examMode={true}
          />
        </div>
      </div>
    );
  }

  // Safe numbering - derive from data, not possibly undefined values
  const total = questions.length;
  const qIndex = Math.max(0, Math.min(currentQuestionIndex, total - 1)); // clamp
  const humanNumber = total ? qIndex + 1 : 0;
  const currentQuestion = questions[qIndex];
  const progress = getProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {t.examTitle || 'Exam'} - {exam?.config?.sourceSets?.[0]?.split('-')?.[1] ?? 'Topic'}
              </h1>
              <p className="text-gray-600">
                {t.examSubtitle || 'Complete all questions within the time limit'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-600">
                {t.timeRemaining || 'Time Remaining'}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{t.progress || 'Progress'}: {Math.round(progress)}%</span>
              <span>{Object.keys(userAnswers).length}/{total} {t.questions || 'Questions'}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question Navigation */}
          <div className="flex flex-wrap gap-2">
            {questions.map((q, index) => {
              const qKey = String(q._qid);
              const isAnswered = userAnswers[qKey] !== undefined;

              return (
                <button
                  key={qKey}
                  type="button"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    goToQuestion(index); 
                  }}
                  className={`h-8 w-8 rounded-full flex items-center justify-center border transition duration-200 ${
                    index === currentQuestionIndex
                      ? 'bg-blue-600 text-white border-blue-600'
                      : isAnswered
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
                  aria-label={`Go to question ${index + 1}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question */}
        {currentQuestion && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="mb-4">
              <span className="text-sm text-gray-500">
                {t.question || 'Question'} {humanNumber} {t.of || 'of'} {total}
              </span>
            </div>
            
            <QuestionCard
              question={currentQuestion}
              questionIndex={qIndex}
              totalQuestions={total}
              selectedAnswer={userAnswers[String(currentQuestion._qid)]}
              onAnswerSelect={(answer) => handleAnswerSelect(currentQuestion._qid, answer)}
              showExplanation={false}
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-3 rounded-lg transition duration-200 ${
              currentQuestionIndex === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            {t.previous || 'Previous'}
          </button>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); navigate('/app?currentView=dashboard'); }}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
            >
              {t.exitExam || 'Exit Exam'}
            </button>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleSubmit(); }}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
              >
                {t.submitExam || 'Submit Exam'}
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                {t.next || 'Next'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamRunner;
