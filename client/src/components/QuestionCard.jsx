import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';

function QuestionCard({ question, questionIndex, totalQuestions, selectedAnswer, onAnswerSelect }) {
  const { language } = useLanguage();
  const isRTL = language === 'he';
  
  // Local state for this question's answer
  const [localAnswer, setLocalAnswer] = useState(selectedAnswer || null);
  
  // Update local state when selectedAnswer prop changes (but only if it's different)
  useEffect(() => {
    if (selectedAnswer !== localAnswer) {
      setLocalAnswer(selectedAnswer || null);
    }
  }, [selectedAnswer]);
  
  // Safe numbering - derive from data, not possibly undefined values
  const humanNumber = totalQuestions ? questionIndex + 1 : 0;
  
  const handleAnswerClick = (answerKey) => {
    // Update local state immediately
    setLocalAnswer(answerKey);
    // Notify parent component
    onAnswerSelect(question.id, answerKey);
  };
  
  return (
    <div className={`border border-gray-200 rounded-lg p-6 ${isRTL ? 'text-right' : ''}`}>
      <h3 className="text-lg font-semibold mb-4">
        <span className="mr-2">{humanNumber}.</span>
        {question.question}
      </h3>
      
      <div className="space-y-3">
        {Object.entries(question.choices).map(([key, value], optIdx) => {
          const isSelected = localAnswer === key;
          const optId = `question-${question.id}-option-${key}-${questionIndex}`;
          
          return (
            <div 
              key={`${question.id}-${key}-${optIdx}`}
              className={`rounded-lg border cursor-pointer transition duration-200 ${
                isSelected ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-50 border-2 border-transparent hover:bg-slate-50'
              }`}
              onClick={() => handleAnswerClick(key)}
            >
              <div className="block p-4">
                <div className="flex items-start gap-3">
                  <span className={`mt-1 inline-block h-4 w-4 rounded-full border ${
                    isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                  }`}></span>
                  <span className="font-semibold">{key}.</span>
                  <span className="flex-1">{value}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QuestionCard;