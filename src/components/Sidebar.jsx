import { useMemo, useState, useEffect, useRef } from 'react';
import { useSelected } from '../contexts/SelectedContext';
import { useProgress } from '../contexts/ProgressContext';
import { highlightText, hasMatch, topicHasMatch, subtopicHasMatch } from '../utils/searchHelpers';

const highlightClasses =
  'bg-[var(--accent)] text-white shadow-[0_4px_12px_rgba(8,166,150,0.35)]';
const baseButtonClasses =
  'w-full text-left p-3 rounded-lg transition-all duration-200 border border-transparent';

function Sidebar({ courses, searchQuery, isOpen = false, onClose }) {
  const {
    selectedCourse,
    selectedTopic,
    selectedSubtopic,
    selectCourse,
    selectTopic,
    selectSubtopic,
  } = useSelected();

  const {
    toggleSubtopic,
    isSubtopicCompleted,
    getCourseProgress,
    getSingleTopicProgress,
  } = useProgress();

  const [expandedTopics, setExpandedTopics] = useState({});
  const [expandedCourses, setExpandedCourses] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const courseRefs = useRef([]);
  const topicRefs = useRef([]);
  const subtopicRefs = useRef([]);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  courseRefs.current = [];
  topicRefs.current = [];
  subtopicRefs.current = [];

  const normalizedQuery = searchQuery?.trim().toLowerCase() || '';

  // Reset expansion states when course changes (only if not searching)
  useEffect(() => {
    if (!normalizedQuery) {
      setExpandedTopics({});
      setExpandedCourses({});
    }
  }, [selectedCourse, normalizedQuery]);

  // Ensure selected topic is expanded when topic changes (when not searching)
  // Only expand if not already manually toggled
  useEffect(() => {
    if (!normalizedQuery && selectedCourse && selectedTopic) {
      setExpandedTopics((prev) => ({
        ...prev,
        [selectedCourse]: {
          ...prev[selectedCourse],
          [selectedTopic]: true,
        },
      }));
    }
  }, [selectedCourse, selectedTopic, normalizedQuery]);

  // Auto-expand courses and topics that contain matches when searching
  useEffect(() => {
    if (!normalizedQuery) {
      // Reset to default state when search is cleared
      setExpandedCourses({});
      setExpandedTopics({});
      return;
    }

    const coursesToExpand = {};
    const topicsToExpand = {};

    courses.forEach((course) => {
      // Check if course name matches
      const courseMatches = course.title?.toLowerCase().includes(normalizedQuery);
      
      // Check if any topic name matches
      const hasMatchingTopic = course.topics?.some((topic) =>
        topic.title?.toLowerCase().includes(normalizedQuery)
      );

      // Check if any subtopic name matches
      const hasMatchingSubtopic = course.topics?.some((topic) =>
        topic.subtopics?.some((subtopic) =>
          subtopic.title?.toLowerCase().includes(normalizedQuery)
        )
      );

      // Expand course if it has matches or contains matching topics/subtopics
      if (courseMatches || hasMatchingTopic || hasMatchingSubtopic) {
        coursesToExpand[course.title] = true;

        // Also expand topics that have matches
        course.topics?.forEach((topic) => {
          const topicMatches = topic.title?.toLowerCase().includes(normalizedQuery);
          const topicHasMatchingSubtopic = topic.subtopics?.some((subtopic) =>
            subtopic.title?.toLowerCase().includes(normalizedQuery)
          );

          if (topicMatches || topicHasMatchingSubtopic) {
            if (!topicsToExpand[course.title]) {
              topicsToExpand[course.title] = {};
            }
            topicsToExpand[course.title][topic.title] = true;
          }
        });
      }
    });

    setExpandedCourses(coursesToExpand);
    setExpandedTopics((prev) => {
      const newState = { ...prev };
      Object.keys(topicsToExpand).forEach((courseTitle) => {
        newState[courseTitle] = { ...newState[courseTitle], ...topicsToExpand[courseTitle] };
      });
      return newState;
    });
  }, [courses, normalizedQuery]);

  // Filter courses - only show courses that match or contain matching topics/subtopics
  const filteredCourses = useMemo(() => {
    if (!normalizedQuery) return courses;

    return courses.filter((course) => hasMatch(course, normalizedQuery));
  }, [courses, normalizedQuery]);

  // Filter topics within a course
  const getFilteredTopics = (courseTopics) => {
    if (!normalizedQuery) return courseTopics || [];

    return (courseTopics || []).filter((topic) => topicHasMatch(topic, normalizedQuery));
  };

  // Filter subtopics within a topic
  const getFilteredSubtopics = (subtopics) => {
    if (!normalizedQuery) return subtopics || [];

    return (subtopics || []).filter((subtopic) => subtopicHasMatch(subtopic, normalizedQuery));
  };

  const focusButton = (refs, index) => {
    const target = refs.current[index];
    if (target) {
      target.focus();
    }
  };

  const handleCourseKeyDown = (event, index, course) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusButton(courseRefs, Math.min(courseRefs.current.length - 1, index + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusButton(courseRefs, Math.max(0, index - 1));
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCourseSelect(course);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusButton(courseRefs, 0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusButton(courseRefs, courseRefs.current.length - 1);
    }
  };

  const handleTopicKeyDown = (event, index, topic) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusButton(topicRefs, Math.min(topicRefs.current.length - 1, index + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusButton(topicRefs, Math.max(0, index - 1));
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTopicClick(topic);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusButton(topicRefs, 0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusButton(topicRefs, topicRefs.current.length - 1);
    }
  };

  const handleSubtopicKeyDown = (event, index, subtopic) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusButton(subtopicRefs, Math.min(subtopicRefs.current.length - 1, index + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusButton(subtopicRefs, Math.max(0, index - 1));
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSubtopicClick(subtopic);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusButton(subtopicRefs, 0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusButton(subtopicRefs, subtopicRefs.current.length - 1);
    }
  };

  const handleCourseSelect = (course) => {
    const isCurrentlyExpanded = isCourseExpanded(course.title);
    
    // Toggle course expansion - if expanded, collapse; if collapsed, expand
    if (!normalizedQuery) {
      // Normal behavior: toggle expansion
      if (isCurrentlyExpanded) {
        // Collapse course
        setExpandedCourses((prev) => {
          const newState = { ...prev };
          delete newState[course.title];
          return newState;
        });
        selectCourse(null);
      } else {
        // Expand course
        setExpandedCourses((prev) => ({ ...prev, [course.title]: true }));
        selectCourse(course.title);
      }
    } else {
      // When searching, just select the course
      if (!isCurrentlyExpanded) {
        selectCourse(course.title);
      } else {
        selectCourse(null);
      }
    }
    
    // Close sidebar on mobile when course is selected
    if (onClose && isMobile && !isCurrentlyExpanded) {
      onClose();
    }
  };

  const toggleTopic = (courseTitle, topicTitle, e) => {
    e.stopPropagation();
    e.preventDefault();
    setExpandedTopics((prev) => ({
      ...prev,
      [courseTitle]: {
        ...prev[courseTitle],
        [topicTitle]: !prev[courseTitle]?.[topicTitle],
      },
    }));
  };

  const handleExpandKeyDown = (e, courseTitle, topicTitle) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      toggleTopic(courseTitle, topicTitle, e);
    }
  };

  const handleTopicClick = (topic) => {
    const currentCourse = selectedCourse;
    if (!currentCourse) return;
    
    // Toggle topic expansion - if expanded, collapse; if collapsed, expand
    const isCurrentlyExpanded = isTopicExpanded(currentCourse, topic.title);
    
    setExpandedTopics((prev) => ({
      ...prev,
      [currentCourse]: {
        ...prev[currentCourse],
        [topic.title]: !isCurrentlyExpanded,
      },
    }));
    
    // Only select topic if it's being expanded (not collapsed)
    if (!isCurrentlyExpanded) {
      selectTopic(topic.title);
    } else {
      // If collapsing, clear topic selection
      selectTopic(null);
    }
    
    // Close sidebar on mobile when topic is selected
    if (onClose && isMobile && !isCurrentlyExpanded) {
      onClose();
    }
  };

  const handleSubtopicClick = (subtopic) => {
    selectSubtopic(subtopic.title);
    // Close sidebar on mobile when subtopic is selected
    if (onClose && isMobile) {
      onClose();
    }
  };

  // Determine if course should be expanded
  const isCourseExpanded = (courseTitle) => {
    if (normalizedQuery) {
      return expandedCourses[courseTitle] || selectedCourse === courseTitle;
    }
    return selectedCourse === courseTitle;
  };

  // Determine if topic should be expanded
  // Only expand the currently selected topic (or topics expanded by search)
  const isTopicExpanded = (courseTitle, topicTitle) => {
    // If searching, use expanded state from search logic
    if (normalizedQuery) {
      return expandedTopics[courseTitle]?.[topicTitle] ?? false;
    }
    // When not searching, only expand the selected topic
    return selectedTopic === topicTitle;
  };

  return (
    <aside
      id="course-sidebar"
      className={`fixed md:static inset-y-0 left-0 w-80 bg-[var(--surface-elevated)] text-[var(--text-primary)] h-full border-b lg:border-b-0 md:border-r border-[var(--border-color)] flex flex-col overflow-y:scroll max-w-full min-h-0 z-50 md:z-auto transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
      aria-label="Course navigation"
    >
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6 sidebar-scroll" role="navigation" aria-label="Course navigation">
        <h2 className="sr-only">Course Navigation</h2>
        <div className="space-y-2" role="tree" aria-label="Courses">
          {filteredCourses.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]" role="status" aria-live="polite">
              No matches found
            </p>
          ) : (
            filteredCourses.map((course, courseIndex) => {
              const isSelected = selectedCourse === course.title;
              const isExpanded = isCourseExpanded(course.title);
              const normalizedId = course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              const filteredTopics = getFilteredTopics(course.topics);
              const courseProgress = getCourseProgress(course);

              return (
                <div key={course.title} className="space-y-2">
                  <div className="space-y-1">
                    <button
                      ref={(el) => {
                        courseRefs.current[courseIndex] = el;
                      }}
                      onClick={() => handleCourseSelect(course)}
                      onKeyDown={(event) => handleCourseKeyDown(event, courseIndex, course)}
                      className={`${baseButtonClasses} ${
                        isSelected
                          ? highlightClasses
                          : 'bg-[var(--surface-muted)]/60 text-[var(--text-primary)] hover:border-[var(--accent)]'
                      } focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2`}
                      role="treeitem"
                      aria-pressed={isSelected}
                      aria-expanded={isExpanded}
                      aria-controls={isExpanded ? `course-${normalizedId}-topics` : undefined}
                      aria-label={`Course: ${course.title}${course.subtitle ? `, ${course.subtitle}` : ''}`}
                      aria-level="1"
                    >
                      <div className="font-medium">
                        {normalizedQuery ? highlightText(course.title, searchQuery) : course.title}
                      </div>
                      {course.subtitle && (
                        <div className="text-xs text-[var(--text-secondary)] mt-1">
                          {normalizedQuery ? highlightText(course.subtitle, searchQuery) : course.subtitle}
                        </div>
                      )}
                    </button>
                    {/* Course Progress Bar */}
                    <div className="w-full bg-[var(--surface-muted)]/40 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-[var(--accent)] transition-all duration-300 ease-out"
                        style={{ width: `${courseProgress}%` }}
                        role="progressbar"
                        aria-valuenow={courseProgress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-label={`Course progress: ${courseProgress}%`}
                      />
                    </div>
                  </div>

                  {/* Nested topics and subtopics under expanded course */}
                  {isExpanded && filteredTopics.length > 0 && (
                    <div
                      className="ml-4 space-y-2 border-l-2 border-[var(--border-color)] pl-4"
                      id={`course-${normalizedId}-topics`}
                      role="group"
                      aria-label={`${course.title} topics`}
                      aria-expanded={isExpanded}
                    >
                      {filteredTopics.map((topic, topicIndex) => {
                        const topicExpanded = isTopicExpanded(course.title, topic.title);
                        const topicId = `${normalizedId}-topic-${topic.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                        const filteredSubtopics = getFilteredSubtopics(topic.subtopics);
                        const topicProgress = getSingleTopicProgress(topic);

                        return (
                          <div key={topic.title} className="space-y-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <button
                                  ref={(el) => {
                                    topicRefs.current[topicIndex] = el;
                                  }}
                                  onClick={() => handleTopicClick(topic)}
                                  onKeyDown={(event) => handleTopicKeyDown(event, topicIndex, topic)}
                                  className={`flex-1 text-left text-sm p-2 rounded transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 ${
                                    selectedTopic === topic.title
                                      ? 'text-[var(--accent)] font-semibold bg-[var(--surface-muted)]/40'
                                      : 'text-[var(--text-primary)] hover:text-[var(--accent)]'
                                  }`}
                                  role="treeitem"
                                  aria-pressed={selectedTopic === topic.title}
                                  aria-expanded={topicExpanded}
                                  aria-controls={filteredSubtopics.length > 0 ? `${topicId}-subtopics` : undefined}
                                  aria-label={`Topic: ${topic.title}`}
                                  aria-level="2"
                                >
                                  {normalizedQuery ? highlightText(topic.title, searchQuery) : topic.title}
                                </button>
                                {filteredSubtopics.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={(e) => toggleTopic(course.title, topic.title, e)}
                                    onKeyDown={(e) => handleExpandKeyDown(e, course.title, topic.title)}
                                    className="text-[var(--text-secondary)] hover:text-[var(--accent)] p-1 focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 rounded"
                                    aria-label={topicExpanded ? `Collapse ${topic.title} subtopics` : `Expand ${topic.title} subtopics`}
                                    aria-expanded={topicExpanded}
                                    aria-controls={`${topicId}-subtopics`}
                                  >
                                    <svg
                                      className={`w-4 h-4 transition-transform ${topicExpanded ? 'rotate-90' : ''}`}
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
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
                              {/* Topic Progress Bar */}
                              <div className="w-full bg-[var(--surface-muted)]/40 rounded-full h-1 overflow-hidden">
                                <div
                                  className="h-full bg-[var(--accent)] transition-all duration-300 ease-out"
                                  style={{ width: `${topicProgress}%` }}
                                  role="progressbar"
                                  aria-valuenow={topicProgress}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                  aria-label={`Topic progress: ${topicProgress}%`}
                                />
                              </div>
                            </div>

                            {/* Nested subtopics under expanded topic */}
                            {topicExpanded && filteredSubtopics.length > 0 && (
                              <div
                                className="ml-4 space-y-1 border-l-2 border-dashed border-[var(--border-color)] pl-4"
                                id={`${topicId}-subtopics`}
                                role="group"
                                aria-label={`${topic.title} subtopics`}
                                aria-expanded={topicExpanded}
                              >
                                {filteredSubtopics.map((subtopic, subtopicIndex) => {
                                  const isCompleted = isSubtopicCompleted(topic.title, subtopic.title);
                                  const isSelected = selectedSubtopic === subtopic.title && selectedTopic === topic.title;

                                  return (
                                    <div
                                      key={`${topic.title}-${subtopic.title}`}
                                      className="flex items-center gap-2 group"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isCompleted}
                                        onChange={() => toggleSubtopic(topic.title, subtopic.title)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-4 h-4 rounded-full border-[var(--border-color)] text-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] cursor-pointer flex-shrink-0"
                                        aria-label={`Mark ${subtopic.title} as ${isCompleted ? 'incomplete' : 'complete'}`}
                                      />
                                      <button
                                        ref={(el) => {
                                          subtopicRefs.current[subtopicIndex] = el;
                                        }}
                                        onClick={() => handleSubtopicClick(subtopic)}
                                        onKeyDown={(event) => handleSubtopicKeyDown(event, subtopicIndex, subtopic)}
                                        className={`flex-1 text-left text-xs p-1.5 rounded transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 ${
                                          isSelected
                                            ? 'text-[var(--accent)] font-semibold bg-[var(--surface-muted)]/40'
                                            : isCompleted
                                            ? 'text-[var(--text-secondary)] opacity-60'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--accent)]'
                                        }`}
                                        role="treeitem"
                                        aria-selected={isSelected}
                                        aria-label={`Subtopic: ${subtopic.title}`}
                                        aria-level="3"
                                      >
                                        {normalizedQuery ? highlightText(subtopic.title, searchQuery) : subtopic.title}
                                      </button>
                                    </div>
                                  );
                                })}
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
