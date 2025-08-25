const express = require('express');
const router = express.Router();
const { generateExercises } = require('../services/openaiService');

router.post('/generate', async (req, res) => {
  try {
    const { topic, subtopic } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    console.log(`Generating exercises for topic: ${topic}, subtopic: ${subtopic}`);
    
    const exercises = await generateExercises(topic, subtopic);
    res.json(exercises);
  } catch (error) {
    console.error('Error generating exercises:', error);
    res.status(500).json({ 
      error: 'Failed to generate exercises',
      details: error.message 
    });
  }
});

module.exports = router;
