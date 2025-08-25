import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const generateExercises = async (topic, subtopic) => {
  try {
    const response = await axios.post(`${API_URL}/exercises/generate`, {
      topic,
      subtopic
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
