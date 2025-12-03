import ReactMarkdown from 'react-markdown';
import { useSelected } from '../contexts/SelectedContext';

function MainContent({ courses }) {
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

  const selectedCourseData = courses.find((c) => c.title === selectedCourse);
  const selectedTopicData = selectedCourseData?.topics.find((t) => t.title === selectedTopic);
  const selectedSubtopicData = selectedTopicData?.subtopics.find((s) => s.title === selectedSubtopic);
  const selectedSection = selectedSubtopicData?.subSubtopics?.find((s) => s.title === selectedSubSubtopic);

  const breadcrumbs = [];
  if (selectedCourseData) breadcrumbs.push({ label: selectedCourseData.title, type: 'course' });
  if (selectedTopicData) breadcrumbs.push({ label: selectedTopicData.title, type: 'topic' });
  if (selectedSubtopicData && selectedSubtopicData.title !== selectedSection?.title) {
    breadcrumbs.push({ label: selectedSubtopicData.title, type: 'subtopic' });
  }
  if (selectedSection) breadcrumbs.push({ label: selectedSection.title, type: 'section' });

  const handleBreadcrumbClick = (crumb) => {
    switch (crumb.type) {
      case 'course':
        selectCourse(crumb.label);
        break;
      case 'topic': {
        selectTopic(crumb.label);
        const topic = selectedCourseData?.topics.find((t) => t.title === crumb.label);
        if (topic?.subtopics?.length) {
          const firstSubtopic = topic.subtopics[0];
          selectSubtopic(firstSubtopic.title);
          const firstSection = firstSubtopic.subSubtopics?.[0];
          if (firstSection) {
            selectSubSubtopic(firstSection.title);
          }
        } else {
          selectSubtopic(null);
          selectSubSubtopic(null);
        }
        break;
      }
      case 'subtopic': {
        selectSubtopic(crumb.label);
        const subtopic = selectedTopicData?.subtopics.find((s) => s.title === crumb.label);
        if (subtopic?.subSubtopics?.length) {
          selectSubSubtopic(subtopic.subSubtopics[0].title);
        } else {
          selectSubSubtopic(null);
        }
        break;
      }
      default:
        break;
    }
  };

  const EmptyState = () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center text-[var(--text-secondary)]">
        <p className="text-xl mb-2 font-semibold">Select content to begin</p>
        <p className="text-sm">Choose a course, topic, subtopic, and sub-subtopic from the sidebar.</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--surface-page)]">
      {breadcrumbs.length > 0 && (
        <div className="px-6 py-4 border-b border-[var(--border-color)] bg-[var(--surface-elevated)]">
          <nav className="flex items-center flex-wrap gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <div key={`${crumb.label}-${crumb.type}-${index}`} className="flex items-center gap-2">
                  {index > 0 && <span className="text-[var(--breadcrumb-divider)]">/</span>}
                  <button
                    type="button"
                    disabled={isLast}
                    onClick={() => handleBreadcrumbClick(crumb)}
                    className={`${
                      isLast
                        ? 'text-[var(--accent)] font-semibold'
                        : 'text-[var(--text-secondary)] hover:text-[var(--accent)]'
                    } ${isLast ? 'cursor-default' : 'underline-offset-4 hover:underline'}`}
                  >
                    {crumb.label}
                  </button>
                </div>
              );
            })}
          </nav>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6">
        {selectedSection ? (
          <div className="max-w-4xl mx-auto card-surface p-8 bg-[var(--surface-elevated)]">
            <div className="prose prose-lg max-w-none text-[var(--text-primary)]">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-3xl font-bold mb-4 text-[var(--accent)]" {...props} />
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
                    <ol className="list-decimal list-inside mb-4 space-y-2 text-[var(--text-primary)]/90" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-[var(--text-primary)]/90" {...props} />
                  ),
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
                {selectedSection.content}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

export default MainContent;

