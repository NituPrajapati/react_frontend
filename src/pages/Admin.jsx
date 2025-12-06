import { useState, useEffect } from 'react';
import usersData from '../data/users.json';

function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setUsers(usersData.users);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const LoadingState = () => (
    <div className="min-h-[60vh] flex items-center justify-center bg-[var(--surface-page)] text-[var(--text-secondary)]" role="status" aria-live="polite" aria-label="Loading users">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto mb-4" aria-hidden="true" />
        <p>Loading users...</p>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="min-h-[60vh] flex items-center justify-center bg-[var(--surface-page)]" role="alert" aria-live="assertive">
      <div className="text-center text-red-500">
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-sm text-[var(--text-secondary)]">{error}</p>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="min-h-[60vh] flex items-center justify-center bg-[var(--surface-page)]" role="status" aria-live="polite">
      <p className="text-lg text-[var(--text-secondary)]">No users found.</p>
    </div>
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;
  if (users.length === 0) return <EmptyState />;

  return (
    <main className="min-h-screen bg-[var(--surface-page)] text-[var(--text-primary)] px-4 md:px-6 py-6 md:py-8" role="main" aria-label="Admin users page">
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
        <header>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--accent)]">Users</h1>
          <p className="text-sm md:text-base text-[var(--text-secondary)] mt-1">Current learners and authors – read-only view.</p>
        </header>

        <div className="card-surface overflow-hidden bg-[var(--surface-elevated)]">
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full min-w-[640px]" role="table" aria-label="Users table">
              <caption className="sr-only">Table of users including ID, name, email, role, and details</caption>
              <thead className="bg-[var(--surface-muted)]/60">
                <tr>
                  <th scope="col" className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold tracking-wide text-[var(--text-secondary)] uppercase">
                    ID
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold tracking-wide text-[var(--text-secondary)] uppercase">
                    Name
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold tracking-wide text-[var(--text-secondary)] uppercase">
                    Email
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold tracking-wide text-[var(--text-secondary)] uppercase">
                    Role
                  </th>
                  <th scope="col" className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold tracking-wide text-[var(--text-secondary)] uppercase">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-[var(--surface-muted)]/40 transition-colors">
                    <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[var(--text-secondary)]">{user.id}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium">{user.name}</td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[var(--text-secondary)]">
                      <a href={`mailto:${user.email}`} className="hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 rounded break-all">
                        {user.email}
                      </a>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'teacher'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                        }`}
                        aria-label={`Role: ${user.role}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-[var(--text-secondary)]">
                      {user.role === 'student' && user.enrolledCourses && (
                        <div className="space-y-1">
                          <div className="text-xs">
                            Enrolled: <span className="font-medium">{user.enrolledCourses.length}</span>
                          </div>
                          {user.progress && Object.keys(user.progress).length > 0 && (
                            <div className="text-xs flex flex-wrap gap-2" role="list" aria-label="Course progress">
                              {Object.entries(user.progress).map(([courseId, progress]) => (
                                <span key={courseId} className="px-2 py-0.5 rounded-full bg-[var(--surface-muted)]/80" role="listitem">
                                  Course {courseId}: {Math.round(progress * 100)}%
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {user.role === 'teacher' && user.authoredCourses && (
                        <div className="text-xs">Authored: {user.authoredCourses.length} course(s)</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Admin;

