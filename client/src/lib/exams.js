// Exam utility functions
// Note: This file uses JSDoc comments for type documentation instead of TypeScript interfaces

export function buildTopicExam(topicId) {
  // Load all exercises from localStorage for this topic
  const savedExercises = JSON.parse(localStorage.getItem('exerciseHistory') || '[]');
  const topicExercises = savedExercises.filter((exercise) => exercise.topic === topicId);
  
  if (topicExercises.length === 0) {
    throw new Error(`No exercises found for topic: ${topicId}`);
  }
  
  // Collect all questions from all exercises for this topic
  const allQuestionRefs = [];
  
  topicExercises.forEach((exercise) => {
    if (exercise.questions && Array.isArray(exercise.questions)) {
      exercise.questions.forEach((question) => {
        allQuestionRefs.push({
          exerciseId: `${exercise.level}-${exercise.topic}`,
          qId: question.id
        });
      });
    }
  });
  
  if (allQuestionRefs.length === 0) {
    throw new Error(`No questions found for topic: ${topicId}`);
  }
  
  // Randomly sample up to 25 unique questions (or fewer if not enough available)
  const maxQuestions = Math.min(25, allQuestionRefs.length);
  const selectedRefs = shuffleArray([...allQuestionRefs]).slice(0, maxQuestions);
  
  // Generate exam ID
  const examId = generateExamId();
  
  // Create exam object
  const exam = {
    id: examId,
    config: {
      totalQuestions: selectedRefs.length,
      timerMinutes: 20,
      shuffle: true,
      allowAiBackfill: false,
      sourceSets: topicExercises.map((ex) => `${ex.level}-${ex.topic}`)
    },
    questionRefs: selectedRefs,
    attempts: [],
    createdAt: new Date().toISOString()
  };
  
  // Save to localStorage
  const existingExams = JSON.parse(localStorage.getItem('exams') || '[]');
  existingExams.push(exam);
  localStorage.setItem('exams', JSON.stringify(existingExams));
  
  return examId;
}

// Helper function to shuffle array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Helper function to generate short random exam ID
function generateExamId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Helper function to get exam by ID
export function getExamById(examId) {
  const exams = JSON.parse(localStorage.getItem('exams') || '[]');
  return exams.find((exam) => exam.id === examId) || null;
}

// Helper function to get questions for an exam
export function getExamQuestions(exam) {
  const savedExercises = JSON.parse(localStorage.getItem('exerciseHistory') || '[]');
  const questions = [];
  
  exam.questionRefs.forEach(ref => {
    const exercise = savedExercises.find((ex) => 
      `${ex.level}-${ex.topic}` === ref.exerciseId
    );
    
    if (exercise && exercise.questions) {
      const question = exercise.questions.find((q) => q.id === ref.qId);
      if (question) {
        questions.push({
          ...question,
          exerciseId: ref.exerciseId,
          originalExerciseLevel: exercise.level
        });
      }
    }
  });
  
  return questions;
}
