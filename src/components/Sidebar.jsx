import { useMemo, useState, useEffect, useRef } from 'react';
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
  const courseRefs = useRef([]);
  const topicRefs = useRef([]);
  const subtopicRefs = useRef([]);

  courseRefs.current = [];
  topicRefs.current = [];
  subtopicRefs.current = [];

  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Reset expansion states when course changes
  useEffect(() => {
    setExpandedTopics({});
    setExpandedSubtopics({});
  }, [selectedCourse]);

  // Auto-expand topics that contain matching subtopics when searching
  useEffect(() => {
    if (!selectedCourse || !normalizedQuery) return;
    const courseData = courses.find((c) => c.title === selectedCourse);
    if (!courseData) return;

    const topicsWithMatches = courseData.topics?.reduce((acc, topic) => {
      const hasMatchingSubtopic = topic.subtopics?.some((subtopic) => {
        const titleMatch = subtopic.title.toLowerCase().includes(normalizedQuery);
        const contentMatch = subtopic.content?.toLowerCase().includes(normalizedQuery);
        return titleMatch || contentMatch;
      });
      if (hasMatchingSubtopic) {
        acc[topic.title] = true;
      }
      return acc;
    }, {});

    if (topicsWithMatches && Object.keys(topicsWithMatches).length > 0) {
      setExpandedTopics((prev) => ({ ...prev, ...topicsWithMatches }));
    }
  }, [courses, normalizedQuery, selectedCourse]);

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

  const focusButton = (refs, index) => {
    const target = refs.current[index];
    if (target) {
      target.focus();
    }
  };

  const handleCourseKeyDown = (event, index) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusButton(courseRefs, Math.min(courseRefs.current.length - 1, index + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusButton(courseRefs, Math.max(0, index - 1));
    }
  };

  const handleTopicKeyDown = (event, index) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusButton(topicRefs, Math.min(topicRefs.current.length - 1, index + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusButton(topicRefs, Math.max(0, index - 1));
    }
  };

  const handleSubtopicKeyDown = (event, index) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusButton(subtopicRefs, Math.min(subtopicRefs.current.length - 1, index + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusButton(subtopicRefs, Math.max(0, index - 1));
    }
  };

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
    <aside className="w-80 bg-[var(--surface-elevated)] text-[var(--text-primary)] h-full border-r border-[var(--border-color)] flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-6 sidebar-scroll" role="navigation" aria-label="Course navigation">
        <div className="space-y-2" role="tree" aria-label="Courses">
          {filteredCourses.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">No matches found</p>
          ) : (
            filteredCourses.map((course, courseIndex) => {
              const isSelected = selectedCourse === course.title;
              const selectedCourseData = isSelected ? courses.find((c) => c.title === course.title) : null;
              const normalizedId = course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

              return (
                <div key={course.title} className="space-y-2" role="treeitem" aria-expanded={isSelected} aria-selected={isSelected}>
                  <button
                    ref={(el) => {
                      courseRefs.current[courseIndex] = el;
                    }}
                    onClick={() => handleCourseSelect(course)}
                    onKeyDown={(event) => handleCourseKeyDown(event, courseIndex)}
                    className={`${baseButtonClasses} ${
                      isSelected
                        ? highlightClasses
                        : 'bg-[var(--surface-muted)]/60 text-[var(--text-primary)] hover:border-[var(--accent)]'
                    }`}
                    role="button"
                    aria-pressed={isSelected}
                    aria-controls={`course-${normalizedId}-topics`}
                    aria-label={`Course ${course.title}`}
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
                    <div
                      className="ml-4 space-y-2 border-l-2 border-[var(--border-color)] pl-4"
                      id={`course-${normalizedId}-topics`}
                      role="group"
                      aria-label={`${course.title} topics`}
                    >
                      {selectedCourseData.topics?.map((topic, topicIndex) => {
                        const topicExpanded = expandedTopics[topic.title] ?? selectedTopic === topic.title;
                        const topicId = `${normalizedId}-topic-${topic.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

                        return (
                          <div key={topic.title} className="space-y-2" role="treeitem" aria-expanded={topicExpanded} aria-selected={selectedTopic === topic.title}>
                            <div className="flex items-center gap-2">
                              <button
                                ref={(el) => {
                                  topicRefs.current[topicIndex] = el;
                                }}
                                onClick={() => handleTopicClick(topic)}
                                onKeyDown={(event) => handleTopicKeyDown(event, topicIndex)}
                                className={`flex-1 text-left text-sm p-2 rounded transition-colors ${
                                  selectedTopic === topic.title
                                    ? 'text-[var(--accent)] font-semibold bg-[var(--surface-muted)]/40'
                                    : 'text-[var(--text-primary)] hover:text-[var(--accent)]'
                                }`}
                                role="button"
                                aria-pressed={selectedTopic === topic.title}
                                aria-controls={`${topicId}-subtopics`}
                                aria-label={`Topic ${topic.title}`}
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
                                <div
                                  className="ml-4 space-y-1 border-l-2 border-dashed border-[var(--border-color)] pl-4"
                                  id={`${topicId}-subtopics`}
                                  role="group"
                                  aria-label={`${topic.title} subtopics`}
                                >
                                  {topic.subtopics.map((subtopic, subtopicIndex) => (
                                    <button
                                      key={subtopic.title}
                                      ref={(el) => {
                                        subtopicRefs.current[subtopicIndex] = el;
                                      }}
                                      onClick={() => handleSubtopicClick(subtopic)}
                                      onKeyDown={(event) => handleSubtopicKeyDown(event, subtopicIndex)}
                                      className={`w-full text-left text-xs p-1.5 rounded transition-colors ${
                                        selectedSubtopic === subtopic.title
                                          ? 'text-[var(--accent)] font-semibold bg-[var(--surface-muted)]/40'
                                          : 'text-[var(--text-secondary)] hover:text-[var(--accent)]'
                                      }`}
                                      role="treeitem"
                                      aria-selected={selectedSubtopic === subtopic.title}
                                      aria-label={`Subtopic ${subtopic.title}`}
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
