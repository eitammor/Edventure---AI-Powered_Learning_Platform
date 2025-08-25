// Utility to clean up duplicate or erroneous exercise entries from localStorage
export const cleanupExerciseHistory = () => {
  try {
    // Get current exercise history
    const history = JSON.parse(localStorage.getItem('exerciseHistory') || '[]');
    console.log('Original history length:', history.length);
    
    // Group exercises by topic and level to identify duplicates
    const grouped = {};
    const cleaned = [];
    
    history.forEach(exercise => {
      const key = `${exercise.topic}-${exercise.level}`;
      
      if (!grouped[key]) {
        grouped[key] = exercise;
        cleaned.push(exercise);
      } else {
        console.log(`Removing duplicate: ${exercise.topic} - ${exercise.level}`);
      }
    });
    
    // Save cleaned history
    localStorage.setItem('exerciseHistory', JSON.stringify(cleaned));
    console.log('Cleaned history length:', cleaned.length);
    console.log('Removed', history.length - cleaned.length, 'duplicates');
    
    return cleaned;
  } catch (error) {
    console.error('Error cleaning up exercise history:', error);
    return [];
  }
};

// Utility to remove exercises for a specific topic
export const removeTopicExercises = (topic) => {
  try {
    const history = JSON.parse(localStorage.getItem('exerciseHistory') || '[]');
    const filtered = history.filter(exercise => exercise.topic !== topic);
    
    localStorage.setItem('exerciseHistory', JSON.stringify(filtered));
    console.log(`Removed all exercises for topic: ${topic}`);
    console.log('Remaining exercises:', filtered.length);
    
    return filtered;
  } catch (error) {
    console.error('Error removing topic exercises:', error);
    return [];
  }
};


