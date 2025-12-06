import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ProgressContext = createContext();

const STORAGE_KEY = 'courseProgress';

// Generate unique ID for subtopic: topic-title + subtopic-title
export function getSubtopicId(topicTitle, subtopicTitle) {
  return `${topicTitle}-${subtopicTitle}`;
}

// Load progress from localStorage
function loadProgressFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading progress from localStorage:', error);
    return {};
  }
}

// Save progress to localStorage
function saveProgressToStorage(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress to localStorage:', error);
  }
}

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => loadProgressFromStorage());

  // Save to localStorage whenever progress changes
  useEffect(() => {
    saveProgressToStorage(progress);
  }, [progress]);

  // Toggle subtopic completion
  const toggleSubtopic = useCallback((topicTitle, subtopicTitle) => {
    const subtopicId = getSubtopicId(topicTitle, subtopicTitle);
    setProgress((prev) => ({
      ...prev,
      [subtopicId]: !prev[subtopicId],
    }));
  }, []);

  // Check if subtopic is completed
  const isSubtopicCompleted = useCallback(
    (topicTitle, subtopicTitle) => {
      const subtopicId = getSubtopicId(topicTitle, subtopicTitle);
      return progress[subtopicId] === true;
    },
    [progress]
  );

  // Calculate topic progress percentage
  const getTopicProgress = useCallback(
    (topics) => {
      if (!topics || topics.length === 0) return 0;

      let totalSubtopics = 0;
      let completedSubtopics = 0;

      topics.forEach((topic) => {
        if (topic.subtopics && topic.subtopics.length > 0) {
          totalSubtopics += topic.subtopics.length;
          topic.subtopics.forEach((subtopic) => {
            if (isSubtopicCompleted(topic.title, subtopic.title)) {
              completedSubtopics++;
            }
          });
        }
      });

      return totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0;
    },
    [isSubtopicCompleted]
  );

  // Calculate course progress percentage
  const getCourseProgress = useCallback(
    (course) => {
      if (!course || !course.topics || course.topics.length === 0) return 0;

      let totalSubtopics = 0;
      let completedSubtopics = 0;

      course.topics.forEach((topic) => {
        if (topic.subtopics && topic.subtopics.length > 0) {
          totalSubtopics += topic.subtopics.length;
          topic.subtopics.forEach((subtopic) => {
            if (isSubtopicCompleted(topic.title, subtopic.title)) {
              completedSubtopics++;
            }
          });
        }
      });

      return totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0;
    },
    [isSubtopicCompleted]
  );

  // Calculate progress for a single topic
  const getSingleTopicProgress = useCallback(
    (topic) => {
      if (!topic || !topic.subtopics || topic.subtopics.length === 0) return 0;

      const totalSubtopics = topic.subtopics.length;
      let completedSubtopics = 0;

      topic.subtopics.forEach((subtopic) => {
        if (isSubtopicCompleted(topic.title, subtopic.title)) {
          completedSubtopics++;
        }
      });

      return totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0;
    },
    [isSubtopicCompleted]
  );

  return (
    <ProgressContext.Provider
      value={{
        progress,
        toggleSubtopic,
        isSubtopicCompleted,
        getTopicProgress,
        getCourseProgress,
        getSingleTopicProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
}

