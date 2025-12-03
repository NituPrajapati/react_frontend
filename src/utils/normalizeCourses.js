const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || 'untitled';

const createId = (...parts) => parts.filter(Boolean).join('-');

const ensureArray = (value) => (Array.isArray(value) ? value : []);

export function normalizeCoursesData(rawCourses = []) {
  return ensureArray(rawCourses).map((course, courseIndex) => {
    const courseId = course.id ?? createId(courseIndex, slugify(course.title ?? 'course'));

    return {
      ...course,
      id: courseId,
      topics: ensureArray(course.topics)
        .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
        .map((topic, topicIndex) => {
          const topicId = topic.id ?? createId(courseId, topicIndex, slugify(topic.title ?? 'topic'));

          return {
            ...topic,
            id: topicId,
            subtopics: ensureArray(topic.subtopics)
              .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
              .map((subtopic, subtopicIndex) => {
                const subtopicId =
                  subtopic.id ?? createId(topicId, subtopicIndex, slugify(subtopic.title ?? 'subtopic'));

                const providedSubSections = ensureArray(
                  subtopic.subSubtopics ?? subtopic.sections ?? subtopic.lessons,
                );

                const fallbackSubSections =
                  providedSubSections.length > 0
                    ? providedSubSections
                    : [
                        {
                          title: subtopic.title ?? 'Overview',
                          content: subtopic.content ?? '',
                          orderIndex: subtopic.orderIndex ?? 0,
                        },
                      ];

                const normalizedSubSections = fallbackSubSections
                  .map((section, sectionIndex) => ({
                    ...section,
                    title: section.title ?? `${subtopic.title ?? 'Detail'} ${sectionIndex + 1}`,
                    content: section.content ?? subtopic.content ?? '',
                    orderIndex: section.orderIndex ?? sectionIndex,
                    id:
                      section.id ??
                      createId(subtopicId, sectionIndex, slugify(section.title ?? 'sub-section')),
                  }))
                  .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

                return {
                  ...subtopic,
                  id: subtopicId,
                  subSubtopics: normalizedSubSections,
                };
              }),
          };
        }),
    };
  });
}

