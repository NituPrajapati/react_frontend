import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { SelectedProvider } from './contexts/SelectedContext';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import MainContent from './components/MainContent';
import Admin from './pages/Admin';
import coursesData from './data/courses.json';
import { normalizeCoursesData } from './utils/normalizeCourses';
import './App.css';

const ThemeToggle = ({ theme, onToggle }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-pressed={theme === 'dark'}
    >
      <span className="text-sm font-medium">{theme === 'dark' ? 'Dark' : 'Light'} mode</span>
      <svg
        className="w-4 h-4 text-[var(--accent)]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        {theme === 'dark' ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
          />
        )}
      </svg>
    </button>
  );
};

function HomePage() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setCourses(normalizeCoursesData(coursesData.courses));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[var(--surface-page)]" role="status" aria-live="polite" aria-label="Loading courses">
        <div className="text-center text-[var(--text-secondary)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto mb-4" aria-hidden="true" />
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[var(--surface-page)]" role="alert" aria-live="assertive">
        <div className="text-center">
          <p className="text-red-500 text-xl font-semibold mb-2">Cannot load courses</p>
          <p className="text-sm text-[var(--text-secondary)]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row flex-1 h-full bg-[var(--surface-page)] overflow-hidden relative">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <Sidebar 
        courses={courses} 
        searchQuery={searchQuery} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main id="main-content" className="flex-1 flex flex-col overflow-hidden min-h-0" role="main" aria-label="Course content">
        <div className="p-4 md:p-6 border-b border-[var(--border-color)] bg-[var(--surface-elevated)] shadow-sm flex items-center gap-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[var(--surface-muted)]/60 focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
            aria-label="Toggle sidebar"
            aria-expanded={sidebarOpen}
            aria-controls="course-sidebar"
          >
            <svg
              className="w-6 h-6 text-[var(--text-primary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex-1">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
        </div>
        <MainContent courses={courses} onContentSelect={() => setSidebarOpen(false)} />
      </main>
    </div>
  );
}

function Navigation({ theme, onToggleTheme }) {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <nav className="bg-[var(--surface-elevated)] border-b border-[var(--border-color)] px-4 md:px-6 py-3 md:py-4 shadow-sm" role="navigation" aria-label="Main navigation">
      <div className="flex items-center justify-between gap-2 md:gap-4 flex-wrap">
        <Link 
          to="/" 
          className="text-lg md:text-xl font-bold text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 rounded"
          aria-label="CourseExplorer - Home"
        >
          CourseExplorer
        </Link>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <Link
            to="/"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 ${
              !isAdmin
                ? 'bg-[var(--accent)] text-white shadow'
                : 'text-[var(--text-secondary)] hover:text-[var(--accent)]'
            }`}
            aria-current={!isAdmin ? 'page' : undefined}
          >
            Courses
          </Link>
          <Link
            to="/admin"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 ${
              isAdmin
                ? 'bg-[var(--accent)] text-white shadow'
                : 'text-[var(--text-secondary)] hover:text-[var(--accent)]'
            }`}
            aria-current={isAdmin ? 'page' : undefined}
          >
            Admin
          </Link>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </nav>
  );
}

function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <Router>
      <SelectedProvider>
        <div className="min-h-screen bg-[var(--surface-page)] transition-colors duration-300 flex flex-col">
          <a href="#main-content" className="skip-to-content">
            Skip to main content
          </a>
          <Navigation theme={theme} onToggleTheme={toggleTheme} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </div>
        </div>
      </SelectedProvider>
    </Router>
  );
}

export default App;
