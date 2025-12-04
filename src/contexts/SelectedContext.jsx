import { createContext, useContext, useState } from 'react';

const SelectedContext = createContext();

export function SelectedProvider({ children }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);

  const selectCourse = (courseId) => {
    setSelectedCourse(courseId);
    setSelectedTopic(null);
    setSelectedSubtopic(null);
  };

  const selectTopic = (topicId) => {
    setSelectedTopic(topicId);
    setSelectedSubtopic(null);
  };

  const selectSubtopic = (subtopicId) => {
    setSelectedSubtopic(subtopicId);
  };

  return (
    <SelectedContext.Provider
      value={{
        selectedCourse,
        selectedTopic,
        selectedSubtopic,
        selectCourse,
        selectTopic,
        selectSubtopic,
      }}
    >
      {children}
    </SelectedContext.Provider>
  );
}

export function useSelected() {
  const context = useContext(SelectedContext);
  if (!context) {
    throw new Error('useSelected must be used within SelectedProvider');
  }
  return context;
}

