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

const ThemeToggle = ({ theme, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent)] transition-colors"
    aria-label="Toggle light/dark theme"
  >
    <span className="text-sm font-medium">{theme === 'dark' ? 'Dark' : 'Light'} mode</span>
    <svg
      className="w-4 h-4 text-(--accent)"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
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

function HomePage() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div className="min-h-[70vh] flex items-center justify-center bg-[var(--surface-page)]">
        <div className="text-center text-[var(--text-secondary)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto mb-4" />
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[var(--surface-page)]">
        <div className="text-center">
          <p className="text-red-500 text-xl font-semibold mb-2">Cannot load courses</p>
          <p className="text-sm text-[var(--text-secondary)]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-[70vh] bg-[var(--surface-page)]">
      <Sidebar courses={courses} searchQuery={searchQuery} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[var(--border-color)] bg-[var(--surface-elevated)] shadow-sm">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
        <MainContent courses={courses} />
      </div>
    </div>
  );
}

function Navigation({ theme, onToggleTheme }) {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <nav className="bg-[var(--surface-elevated)] border-b border-[var(--border-color)] px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <Link to="/" className="text-xl font-bold text-[var(--accent)]">
          Course Platform
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !isAdmin
                ? 'bg-[var(--accent)] text-white shadow'
                : 'text-[var(--text-secondary)] hover:text-[var(--accent)]'
            }`}
          >
            Courses
          </Link>
          <Link
            to="/admin"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isAdmin
                ? 'bg-[var(--accent)] text-white shadow'
                : 'text-[var(--text-secondary)] hover:text-[var(--accent)]'
            }`}
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
        <div className="min-h-screen bg-[var(--surface-page)] transition-colors duration-300">
          <Navigation theme={theme} onToggleTheme={toggleTheme} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </SelectedProvider>
    </Router>
  );
}

export default App;
