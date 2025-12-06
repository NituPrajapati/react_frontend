/**
 * Debounce function to delay execution
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function with cancel method
 */
export function debounce(func, delay) {
  let timeoutId;
  const debouncedFunc = function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
  
  debouncedFunc.cancel = function () {
    clearTimeout(timeoutId);
  };
  
  return debouncedFunc;
}

import React from 'react';

/**
 * Highlights matching text in a string
 * @param {string} text - Text to highlight
 * @param {string} query - Search query
 * @returns {Array} Array of React elements with highlighted matches
 */
export function highlightText(text, query) {
  if (!query || !text) return text;

  const normalizedText = String(text);
  const normalizedQuery = query.trim();
  
  if (!normalizedQuery) return text;

  // Escape special regex characters in query
  const escapedQuery = normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = normalizedText.split(regex);

  // When splitting with a capturing group, odd indices (1, 3, 5...) are matches
  return parts.map((part, index) => {
    if (!part) return null; // Skip empty parts
    
    // Odd indices are matches (because of the capturing group in split)
    const isMatch = index % 2 === 1;
    
    if (isMatch) {
      return React.createElement(
        'mark',
        { key: index, 'aria-label': `Highlighted: ${part}` },
        part
      );
    }
    return React.createElement('span', { key: index }, part);
  }).filter(Boolean); // Remove null values
}

/**
 * Checks if a course matches the search query (only checks names)
 * @param {Object} course - Course object
 * @param {string} query - Search query
 * @returns {boolean} True if course matches
 */
export function hasMatch(course, query) {
  if (!query || !query.trim()) return true;

  const normalizedQuery = query.trim().toLowerCase();

  // Check course name
  if (course.title?.toLowerCase().includes(normalizedQuery)) {
    return true;
  }

  // Check if any topic name matches
  if (course.topics?.some((topic) => topic.title?.toLowerCase().includes(normalizedQuery))) {
    return true;
  }

  // Check if any subtopic name matches (within topics)
  if (
    course.topics?.some((topic) =>
      topic.subtopics?.some((subtopic) => subtopic.title?.toLowerCase().includes(normalizedQuery))
    )
  ) {
    return true;
  }

  return false;
}

/**
 * Checks if a topic matches the search query (only checks names)
 * @param {Object} topic - Topic object
 * @param {string} query - Search query
 * @returns {boolean} True if topic matches
 */
export function topicHasMatch(topic, query) {
  if (!query || !query.trim()) return true;

  const normalizedQuery = query.trim().toLowerCase();

  // Check topic name
  if (topic.title?.toLowerCase().includes(normalizedQuery)) {
    return true;
  }

  // Check if any subtopic name matches
  if (topic.subtopics?.some((subtopic) => subtopic.title?.toLowerCase().includes(normalizedQuery))) {
    return true;
  }

  return false;
}

/**
 * Checks if a subtopic matches the search query (only checks names)
 * @param {Object} subtopic - Subtopic object
 * @param {string} query - Search query
 * @returns {boolean} True if subtopic matches
 */
export function subtopicHasMatch(subtopic, query) {
  if (!query || !query.trim()) return true;

  const normalizedQuery = query.trim().toLowerCase();
  return subtopic.title?.toLowerCase().includes(normalizedQuery);
}

