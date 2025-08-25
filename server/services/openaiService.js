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
  
  const prompt = `Generate 3 multiple-choice exercises about "${fullTopic}".
  
  Create one exercise for each level:
  1. Beginner level (basic concepts and definitions)
  2. Intermediate level (application and understanding)
  3. Expert level (complex analysis and synthesis)
  
  Each exercise should have exactly 10 questions.
  Each question must have:
  - A clear question
  - 4 answer choices (A, B, C, D)
  - Only 1 correct answer
  - An explanation for why the answer is correct
  
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
          content: "You are an expert educator creating educational exercises. Always return valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content);
    return response;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate exercises from OpenAI');
  }
}

module.exports = { generateExercises };
