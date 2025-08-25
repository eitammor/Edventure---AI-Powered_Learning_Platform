import React from 'react';
import { useLanguage } from '../App';

function QuestionCard({ question, questionIndex, totalQuestions, selectedAnswer, onAnswerSelect }) {
  const { language } = useLanguage();
  const isRTL = language === 'he';
  
  // Safe numbering - derive from data, not possibly undefined values
  const humanNumber = totalQuestions ? questionIndex + 1 : 0;
  
  // Use the exam-scoped question key
  const qKey = String(question._qid);
  const groupName = `ans-${qKey}`;
  
  return (
    <div className={`border border-gray-200 rounded-lg p-6 ${isRTL ? 'text-right' : ''}`}>
      <h3 className="text-lg font-semibold mb-4">
        <span className="mr-2">{humanNumber}.</span>
        {question.question}
      </h3>
      
      <div 
        className="space-y-3"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {Object.entries(question.choices).map(([key, value], optIdx) => {
          const optId = `opt-${qKey}-${optIdx}`;
          const checked = selectedAnswer === key;
          
          return (
            <div key={optId} className="rounded-lg border bg-white">
              <input
                id={optId}
                type="radio"
                name={groupName}
                value={key}
                checked={checked}
                onChange={() => onAnswerSelect(key)}
                className="sr-only"
              />
              <label
                htmlFor={optId}
                className={`block cursor-pointer p-4 hover:bg-slate-50 transition duration-200 ${
                  checked ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-50 border-2 border-transparent'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onAnswerSelect(key);
                }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className="flex items-start gap-3">
                  <span className={`mt-1 inline-block h-4 w-4 rounded-full border ${
                    checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                  }`}></span>
                  <span className="font-semibold">{key}.</span>
                  <span className="flex-1">{value}</span>
                </div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QuestionCard;
