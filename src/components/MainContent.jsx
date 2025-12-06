import { useMemo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { useSelected } from '../contexts/SelectedContext';

function MainContent({ courses, onContentSelect }) {
  const {
    selectedCourse,
    selectedTopic,
    selectedSubtopic,
    selectCourse,
    selectTopic,
    selectSubtopic,
  } = useSelected();

  const { selectedCourseData, selectedTopicData, selectedSubtopicData } = useMemo(() => {
    const courseData = courses.find((c) => c.title === selectedCourse);
    if (!courseData) {
      return { selectedCourseData: null, selectedTopicData: null, selectedSubtopicData: null };
    }
    
    const topicData = selectedTopic ? courseData.topics?.find((t) => t.title === selectedTopic) : null;
    
    // Only find subtopic if both topic and subtopic are selected, and subtopic exists in the current topic
    const subtopicData = 
      selectedTopic && selectedSubtopic && topicData
        ? topicData.subtopics?.find((s) => s.title === selectedSubtopic)
        : null;
    
    return { selectedCourseData: courseData, selectedTopicData: topicData, selectedSubtopicData: subtopicData };
  }, [courses, selectedCourse, selectedTopic, selectedSubtopic]);

  const breadcrumbs = useMemo(() => {
    const crumbs = [];
    if (selectedCourseData) crumbs.push({ label: selectedCourseData.title, type: 'course' });
    if (selectedTopicData) crumbs.push({ label: selectedTopicData.title, type: 'topic' });
    if (selectedSubtopicData) crumbs.push({ label: selectedSubtopicData.title, type: 'subtopic' });
    return crumbs;
  }, [selectedCourseData, selectedTopicData, selectedSubtopicData]);

  const handleBreadcrumbClick = useCallback(
    (crumb) => {
      switch (crumb.type) {
        case 'course':
          selectCourse(crumb.label);
          break;
        case 'topic':
          selectTopic(crumb.label);
          break;
        case 'subtopic':
          selectSubtopic(crumb.label);
          break;
        default:
          break;
      }
      // Close sidebar on mobile when breadcrumb is clicked
      if (onContentSelect) {
        onContentSelect();
      }
    },
    [selectCourse, selectTopic, selectSubtopic, onContentSelect],
  );

  // Determine what content to display
  const displayContent = useMemo(() => {
    if (selectedSubtopicData?.content) {
      return { type: 'subtopic', content: selectedSubtopicData.content, title: selectedSubtopicData.title || 'Subtopic' };
    }
    if (selectedTopicData?.description) {
      return { type: 'topic', content: selectedTopicData.description, title: selectedTopicData.title };
    }
    if (selectedCourseData?.description) {
      return { type: 'course', content: selectedCourseData.description, title: selectedCourseData.title };
    }
    return null;
  }, [selectedCourseData, selectedTopicData, selectedSubtopicData]);

  const EmptyState = () => (
    <div className="flex items-center justify-center h-full" role="status" aria-live="polite">
      <div className="text-center text-[var(--text-secondary)]">
        <h2 className="text-xl mb-2 font-semibold">Select content to begin</h2>
        <p className="text-sm">Choose a course, topic, or subtopic from the sidebar.</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--surface-page)] overflow-hidden min-h-0">
      {breadcrumbs.length > 0 && (
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-[var(--border-color)] bg-[var(--surface-elevated)] flex-shrink-0">
          <nav className="flex items-center flex-wrap gap-2 text-xs md:text-sm" aria-label="Breadcrumb navigation">
            <ol className="flex items-center flex-wrap gap-2" role="list">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <li key={`${crumb.label}-${crumb.type}-${index}`} className="flex items-center gap-2">
                    {index > 0 && (
                      <span className="text-[var(--breadcrumb-divider)]" aria-hidden="true">
                        /
                      </span>
                    )}
                    <button
                      type="button"
                      disabled={isLast}
                      onClick={() => handleBreadcrumbClick(crumb)}
                      onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && !isLast) {
                          e.preventDefault();
                          handleBreadcrumbClick(crumb);
                        }
                      }}
                      className={`focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 rounded ${
                        isLast
                          ? 'text-[var(--accent)] font-semibold'
                          : 'text-[var(--text-secondary)] hover:text-[var(--accent)]'
                      } ${isLast ? 'cursor-default' : 'underline-offset-4 hover:underline'}`}
                      aria-current={isLast ? 'page' : undefined}
                      aria-label={isLast ? `Current page: ${crumb.label}` : `Navigate to ${crumb.label}`}
                    >
                      {crumb.label}  
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-8 main-content-scroll" role="region" aria-label="Course content" aria-live="polite" aria-atomic="true">
        {displayContent ? (
          <article className="max-w-4xl mx-auto card-surface p-4 md:p-8 bg-[var(--surface-elevated)]">
            <header>
              <h1 className="text-2xl md:text-3xl font-bold mb-4 text-[var(--accent)]">{displayContent.title || 'Content'}</h1>
            </header>
            <div className="prose prose-sm md:prose-lg max-w-none text-[var(--text-primary)]" role="article">
              {displayContent.type === 'subtopic' ? (
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="text-xl md:text-2xl font-bold mb-3 text-[var(--accent)]" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-2xl font-bold mt-6 mb-3 text-[var(--accent)]" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-xl font-semibold mt-4 mb-2 text-[var(--accent)]" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="mb-4 text-[var(--text-primary)]/90 leading-relaxed" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc list-inside mb-4 space-y-2 text-[var(--text-primary)]/90" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal list-inside mb-4 space-y-2 text-[var(--text-primary)]/90"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => <li className="text-[var(--text-primary)]/90" {...props} />,
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 border-[var(--accent)]/70 pl-4 italic my-4 text-[var(--text-secondary)]"
                        {...props}
                      />
                    ),
                    code: ({ node, inline, className, children, ...props }) => {
                      if (inline) {
                        return (
                          <code
                            className="bg-[var(--surface-muted)] text-[var(--accent)] px-1.5 py-0.5 rounded text-sm font-mono"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      }
                      return (
                        <code
                          className={`block bg-[var(--surface-contrast)] text-[var(--text-primary)] p-4 rounded-lg overflow-x-auto my-4 font-mono text-sm ${className || ''}`}
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    pre: ({ node, children, ...props }) => (
                      <pre className="bg-[var(--surface-contrast)] p-4 rounded-lg overflow-x-auto my-4" {...props}>
                        {children}
                      </pre>
                    ),
                  }}
                >
                  {displayContent.content}
                </ReactMarkdown>
              ) : (
                <p className="text-[var(--text-primary)]/90 leading-relaxed whitespace-pre-line">
                  {displayContent.content}
                </p>
              )}
            </div>
          </article>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

export default MainContent;
