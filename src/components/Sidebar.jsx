import { useMemo, useState } from 'react';
import { useSelected } from '../contexts/SelectedContext';

const highlightClasses =
  'bg-[var(--accent)] text-white shadow-[0_4px_12px_rgba(8,166,150,0.35)]';
const baseButtonClasses =
  'w-full text-left p-3 rounded-lg transition-all duration-200 border border-transparent';

function Sidebar({ courses, searchQuery }) {
  const {
    selectedCourse,
    selectedTopic,
    selectedSubtopic,
    selectCourse,
    selectTopic,
    selectSubtopic,
  } = useSelected();

  const [expandedTopics, setExpandedTopics] = useState({});
  const [expandedSubtopics, setExpandedSubtopics] = useState({});

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredCourses = useMemo(() => {
    if (!normalizedQuery) return courses;

    return courses.filter((course) => {
      const matchesCourse =
        course.title.toLowerCase().includes(normalizedQuery) ||
        course.subtitle?.toLowerCase().includes(normalizedQuery) ||
        course.description?.toLowerCase().includes(normalizedQuery);

      if (matchesCourse) return true;

      return course.topics?.some((topic) => {
        const matchesTopic =
          topic.title.toLowerCase().includes(normalizedQuery) ||
          topic.description?.toLowerCase().includes(normalizedQuery);
        if (matchesTopic) return true;

        return topic.subtopics?.some((subtopic) => {
          const matchesSubtopic =
            subtopic.title.toLowerCase().includes(normalizedQuery) ||
            subtopic.content?.toLowerCase().includes(normalizedQuery);
          return matchesSubtopic;
        });
      });
    });
  }, [courses, normalizedQuery]);

  const handleCourseSelect = (course) => {
    selectCourse(course.title);
  };

  const toggleTopic = (topicTitle, e) => {
    e.stopPropagation();
    setExpandedTopics((prev) => ({
      ...prev,
      [topicTitle]: !prev[topicTitle],
    }));
  };

  const handleTopicClick = (topic) => {
    selectTopic(topic.title);
    setExpandedTopics((prev) => ({ ...prev, [topic.title]: true }));
  };

  const handleSubtopicClick = (subtopic) => {
    selectSubtopic(subtopic.title);
  };

  return (
    <aside className="w-80 bg-[var(--surface-elevated)] text-[var(--text-primary)] h-full border-r border-[var(--border-color)] flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-6 sidebar-scroll">
        <div className="space-y-2">
          {filteredCourses.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">No matches found</p>
          ) : (
            filteredCourses.map((course) => {
              const isSelected = selectedCourse === course.title;
              const selectedCourseData = isSelected ? courses.find((c) => c.title === course.title) : null;

              return (
                <div key={course.title} className="space-y-2">
                  <button
                    onClick={() => handleCourseSelect(course)}
                    className={`${baseButtonClasses} ${
                      isSelected
                        ? highlightClasses
                        : 'bg-[var(--surface-muted)]/60 text-[var(--text-primary)] hover:border-[var(--accent)]'
                    }`}
                  >
                    <div className="font-medium">{course.title}</div>
                    {course.subtitle && (
                      <div className="text-xs text-[var(--text-secondary)] mt-1 opacity-80">
                        {course.subtitle}
                      </div>
                    )}
                  </button>

                  {/* Nested topics and subtopics under selected course */}
                  {isSelected && selectedCourseData && (
                    <div className="ml-4 space-y-2 border-l-2 border-[var(--border-color)] pl-4">
                      {selectedCourseData.topics?.map((topic) => {
                        const topicExpanded = expandedTopics[topic.title] ?? selectedTopic === topic.title;

                        return (
                          <div key={topic.title} className="space-y-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleTopicClick(topic)}
                                className={`flex-1 text-left text-sm p-2 rounded transition-colors ${
                                  selectedTopic === topic.title
                                    ? 'text-[var(--accent)] font-semibold bg-[var(--surface-muted)]/40'
                                    : 'text-[var(--text-primary)] hover:text-[var(--accent)]'
                                }`}
                              >
                                {topic.title}
                              </button>
                              {topic.subtopics && topic.subtopics.length > 0 && (
                                <button
                                  type="button"
                                  onClick={(e) => toggleTopic(topic.title, e)}
                                  className="text-[var(--text-secondary)] hover:text-[var(--accent)] p-1"
                                  aria-label={topicExpanded ? 'Collapse topic' : 'Expand topic'}
                                >
                                  <svg
                                    className={`w-4 h-4 transition-transform ${topicExpanded ? 'rotate-90' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>

                            {/* Nested subtopics under expanded topic */}
                            {topicExpanded && topic.subtopics && topic.subtopics.length > 0 && (
                              <div className="ml-4 space-y-1 border-l-2 border-dashed border-[var(--border-color)] pl-4">
                                {topic.subtopics.map((subtopic) => (
                                  <button
                                    key={subtopic.title}
                                    onClick={() => handleSubtopicClick(subtopic)}
                                    className={`w-full text-left text-xs p-1.5 rounded transition-colors ${
                                      selectedSubtopic === subtopic.title
                                        ? 'text-[var(--accent)] font-semibold bg-[var(--surface-muted)]/40'
                                        : 'text-[var(--text-secondary)] hover:text-[var(--accent)]'
                                    }`}
                                  >
                                    {subtopic.title}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
