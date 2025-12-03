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
    selectedSubSubtopic,
    selectCourse,
    selectTopic,
    selectSubtopic,
    selectSubSubtopic,
  } = useSelected();

  const [expandedTopics, setExpandedTopics] = useState({});
  const [expandedSubtopics, setExpandedSubtopics] = useState({});

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredCourses = useMemo(() => {
    if (!normalizedQuery) return courses;

    return courses.filter((course) => {
      const matchesCourse =
        course.title.toLowerCase().includes(normalizedQuery) ||
        course.subtitle?.toLowerCase().includes(normalizedQuery);

      if (matchesCourse) return true;

      return course.topics?.some((topic) => {
        const matchesTopic =
          topic.title.toLowerCase().includes(normalizedQuery) ||
          topic.description?.toLowerCase().includes(normalizedQuery);
        if (matchesTopic) return true;

        return topic.subtopics?.some((subtopic) => {
          const matchesSubtopic =
            subtopic.title.toLowerCase().includes(normalizedQuery) ||
            subtopic.description?.toLowerCase().includes(normalizedQuery);

          if (matchesSubtopic) return true;

          return subtopic.subSubtopics?.some((section) =>
            section.title.toLowerCase().includes(normalizedQuery),
          );
        });
      });
    });
  }, [courses, normalizedQuery]);

  const selectedCourseData = courses.find((c) => c.title === selectedCourse);

  const handleCourseSelect = (course) => {
    selectCourse(course.title);
    const firstTopic = course.topics?.[0];
    if (firstTopic) {
      selectTopic(firstTopic.title);
      autoSelectFirstSection(firstTopic);
      setExpandedTopics((prev) => ({ ...prev, [firstTopic.title]: true }));
    }
  };

  const toggleTopic = (topicTitle) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicTitle]: !prev[topicTitle],
    }));
  };

  const toggleSubtopic = (subtopicId) => {
    setExpandedSubtopics((prev) => ({
      ...prev,
      [subtopicId]: !prev[subtopicId],
    }));
  };

  const autoSelectFirstSection = (topic) => {
    if (!topic?.subtopics?.length) return;
    const firstSubtopic = topic.subtopics[0];
    selectSubtopic(firstSubtopic.title);
    const firstSection = firstSubtopic.subSubtopics?.[0];
    if (firstSection) {
      selectSubSubtopic(firstSection.title);
    }
  };

  const handleTopicClick = (topic) => {
    selectTopic(topic.title);
    autoSelectFirstSection(topic);
    setExpandedTopics((prev) => ({ ...prev, [topic.title]: true }));
  };

  const handleSubtopicClick = (topic, subtopic) => {
    selectTopic(topic.title);
    selectSubtopic(subtopic.title);
    const firstSection = subtopic.subSubtopics?.[0];
    if (firstSection) {
      selectSubSubtopic(firstSection.title);
    }
    setExpandedTopics((prev) => ({ ...prev, [topic.title]: true }));
    setExpandedSubtopics((prev) => ({ ...prev, [subtopic.title]: true }));
  };

  const handleSectionClick = (topic, subtopic, section) => {
    selectTopic(topic.title);
    selectSubtopic(subtopic.title);
    selectSubSubtopic(section.title);
    setExpandedTopics((prev) => ({ ...prev, [topic.title]: true }));
    setExpandedSubtopics((prev) => ({ ...prev, [subtopic.title]: true }));
  };

  return (
    <aside className="w-80 bg-[var(--surface-elevated)] text-[var(--text-primary)] h-full overflow-y-auto border-r border-[var(--border-color)] px-4 py-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)] mb-3">
            Courses
          </h2>
          <div className="space-y-2">
            {filteredCourses.length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)]">No matches found</p>
            ) : (
              filteredCourses.map((course) => (
                <button
                  key={course.title}
                  onClick={() => handleCourseSelect(course)}
                  className={`${baseButtonClasses} ${
                    selectedCourse === course.title
                      ? highlightClasses
                      : 'bg-[var(--surface-muted)]/60 text-[var(--text-primary)] hover:border-[var(--accent)]'
                  }`}
                >
                  <div className="font-medium">{course.title}</div>
                  {course.subtitle && (
                    <div className="text-xs text-[var(--text-secondary)] mt-1">
                      {course.subtitle}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {selectedCourseData && (
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)] mb-3">
              Topics
            </h2>
            <div className="space-y-3">
              {selectedCourseData.topics?.map((topic) => {
                const topicExpanded = expandedTopics[topic.title] ?? selectedTopic === topic.title;

                return (
                  <div
                    key={topic.title}
                    className="rounded-xl border border-[var(--border-color)] bg-[var(--surface-muted)]/40"
                  >
                    <button
                      onClick={() => handleTopicClick(topic)}
                      className={`flex w-full items-center justify-between px-4 py-3 text-left ${
                        selectedTopic === topic.title
                          ? 'text-[var(--accent)] font-semibold'
                          : 'text-[var(--text-primary)]'
                      }`}
                    >
                      <div>
                        <p>{topic.title}</p>
                        {topic.description && (
                          <p className="text-xs text-[var(--text-secondary)] mt-1">{topic.description}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTopic(topic.title);
                        }}
                        className="text-[var(--text-secondary)] hover:text-[var(--accent)]"
                        aria-label={topicExpanded ? 'Collapse topic' : 'Expand topic'}
                      >
                        <svg
                          className={`w-4 h-4 transition-transform ${topicExpanded ? 'rotate-90' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </button>

                    {topicExpanded && (
                      <div className="px-4 pb-3">
                        <div className="space-y-2 border-l border-dashed border-[var(--border-color)] ml-2 pl-4">
                          {topic.subtopics?.map((subtopic) => {
                            const subtopicExpanded =
                              expandedSubtopics[subtopic.title] ?? selectedSubtopic === subtopic.title;

                            return (
                              <div key={subtopic.title} className="space-y-2">
                                <button
                                  onClick={() => handleSubtopicClick(topic, subtopic)}
                                  className={`text-sm flex items-center justify-between w-full ${
                                    selectedSubtopic === subtopic.title
                                      ? 'text-[var(--accent)] font-semibold'
                                      : 'text-[var(--text-primary)]'
                                  }`}
                                >
                                  <span>{subtopic.title}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleSubtopic(subtopic.title);
                                    }}
                                    className="text-[var(--text-secondary)] hover:text-[var(--accent)]"
                                    aria-label={subtopicExpanded ? 'Collapse subtopic' : 'Expand subtopic'}
                                  >
                                    <svg
                                      className={`w-3.5 h-3.5 transition-transform ${
                                        subtopicExpanded ? 'rotate-90' : ''
                                      }`}
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
                                </button>

                                {subtopicExpanded && (
                                  <div className="pl-3 border-l border-dotted border-[var(--border-color)] space-y-1">
                                    {subtopic.subSubtopics?.map((section) => (
                                      <button
                                        key={section.title}
                                        onClick={() => handleSectionClick(topic, subtopic, section)}
                                        className={`text-sm w-full text-left py-1 ${
                                          selectedSubSubtopic === section.title
                                            ? 'text-[var(--accent)] font-semibold'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--accent)]'
                                        }`}
                                      >
                                        {section.title}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;

