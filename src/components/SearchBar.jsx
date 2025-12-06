import { useState, useEffect, useRef } from 'react';
import { debounce } from '../utils/searchHelpers';

function SearchBar({ searchQuery, setSearchQuery, sidebarRef }) {
  const searchId = 'course-search-input';
  const resultsId = 'search-results-announcement';
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const debouncedSearchRef = useRef(null);

  // Initialize debounced search function
  useEffect(() => {
    debouncedSearchRef.current = debounce((value) => {
      setSearchQuery(value);
    }, 300);

    return () => {
      if (debouncedSearchRef.current) {
        // Clear any pending debounced calls
        debouncedSearchRef.current.cancel?.();
      }
    };
  }, [setSearchQuery]);

  // Sync local query with prop
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
    
    // Call debounced search
    if (debouncedSearchRef.current) {
      debouncedSearchRef.current(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setLocalQuery('');
      setSearchQuery('');
      e.target.blur();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      // Cancel any pending debounced calls
      if (debouncedSearchRef.current) {
        debouncedSearchRef.current.cancel?.();
      }
      // Trigger immediate search (don't wait for debounce)
      setSearchQuery(localQuery);
      // Navigate to first match
      if (sidebarRef?.current?.navigateToFirstMatch) {
        sidebarRef.current.navigateToFirstMatch();
      }
    }
  };

  return (
    <div className="w-full">
      <label htmlFor={searchId} className="sr-only">
        Search courses, topics, and subtopics
      </label>
      <div className="relative">
        <input
          id={searchId}
          type="search"
          placeholder="Search courses, topics, subtopics..."
          value={localQuery}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-3 pl-12 bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent placeholder:text-[var(--text-secondary)] shadow-sm"
          aria-label="Search courses, topics, and subtopics"
          aria-describedby={resultsId}
          autoComplete="off"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <div id={resultsId} className="sr-only" aria-live="polite" aria-atomic="true">
        {searchQuery ? `Searching for ${searchQuery}. Use arrow keys to navigate results.` : 'Showing all courses'}
      </div>
    </div>
  );
}

export default SearchBar;

