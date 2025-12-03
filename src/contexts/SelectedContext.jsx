import { createContext, useContext, useState } from 'react';

const SelectedContext = createContext();

export function SelectedProvider({ children }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [selectedSubSubtopic, setSelectedSubSubtopic] = useState(null);

  const selectCourse = (courseId) => {
    setSelectedCourse(courseId);
    setSelectedTopic(null);
    setSelectedSubtopic(null);
    setSelectedSubSubtopic(null);
  };

  const selectTopic = (topicId) => {
    setSelectedTopic(topicId);
    setSelectedSubtopic(null);
    setSelectedSubSubtopic(null);
  };

  const selectSubtopic = (subtopicId) => {
    setSelectedSubtopic(subtopicId);
    setSelectedSubSubtopic(null);
  };

  const selectSubSubtopic = (subSubtopicId) => {
    setSelectedSubSubtopic(subSubtopicId);
  };

  return (
    <SelectedContext.Provider
      value={{
        selectedCourse,
        selectedTopic,
        selectedSubtopic,
        selectedSubSubtopic,
        selectCourse,
        selectTopic,
        selectSubtopic,
        selectSubSubtopic,
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

