const OpenAI = require('openai');

async function generateExercises(topic, subtopic) {
  // Check if API key is available
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env file.');
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const fullTopic = subtopic ? `${topic} - ${subtopic}` : topic;
  
  const prompt = `You must generate exactly 3 multiple-choice exercises about "${fullTopic}".

  CRITICAL REQUIREMENTS - FOLLOW EXACTLY:
  1. Generate exactly 3 exercises (Beginner, Intermediate, Expert)
  2. Each exercise MUST contain exactly 10 questions - NO FEWER, NO MORE
  3. Total questions: 30 (10 per exercise)
  
  Exercise Structure:
  - BEGINNER exercise: exactly 10 questions about basic concepts
  - INTERMEDIATE exercise: exactly 10 questions about application  
  - EXPERT exercise: exactly 10 questions about complex analysis
  
  Each question MUST have:
  - Clear question text
  - Exactly 4 answer choices (A, B, C, D)
  - Only 1 correct answer
  - Detailed explanation
  
  IMPORTANT: If you generate fewer than 10 questions per exercise, the system will fail. You must generate exactly 10 questions for each of the 3 exercises.
  
  Return the response in this exact JSON format:
  {
    "exercises": [
      {
        "level": "Beginner",
        "questions": [
          {
            "id": 1,
            "question": "Question text here",
            "choices": {
              "A": "Choice A text",
              "B": "Choice B text",
              "C": "Choice C text",
              "D": "Choice D text"
            },
            "correctAnswer": "A",
            "explanation": "Explanation of why this is correct"
          }
        ]
      }
    ]
  }`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert educator. You MUST follow instructions exactly. When asked for a specific number of questions, you must generate exactly that number. No more, no less. Always return valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content);
    
    // Validate the response
    if (!response.exercises || response.exercises.length !== 3) {
      throw new Error(`Invalid response: Expected exactly 3 exercises, got ${response.exercises?.length || 0}`);
    }
    
    response.exercises.forEach((exercise, index) => {
      if (!exercise.questions || exercise.questions.length !== 10) {
        throw new Error(`Invalid response: Exercise ${exercise.level || index + 1} has ${exercise.questions?.length || 0} questions, expected 10`);
      }
    });
    
    console.log('✅ Validation passed: 3 exercises with 10 questions each');
    return response;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate exercises from OpenAI');
  }
}

module.exports = { generateExercises };
