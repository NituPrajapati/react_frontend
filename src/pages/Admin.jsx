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
    <div className="min-h-[60vh] flex items-center justify-center bg-[var(--surface-page)] text-[var(--text-secondary)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto mb-4" />
        <p>Loading users...</p>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="min-h-[60vh] flex items-center justify-center bg-[var(--surface-page)]">
      <div className="text-center text-red-500">
        <p className="text-xl font-semibold mb-2">Something went wrong</p>
        <p className="text-sm text-[var(--text-secondary)]">{error}</p>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="min-h-[60vh] flex items-center justify-center bg-[var(--surface-page)]">
      <p className="text-lg text-[var(--text-secondary)]">No users found.</p>
    </div>
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;
  if (users.length === 0) return <EmptyState />;

  return (
    <div className="min-h-screen bg-[var(--surface-page)] text-[var(--text-primary)] px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--accent)]">Admin · Users</h1>
          <p className="text-[var(--text-secondary)] mt-1">Read-only snapshot of the current learners and authors.</p>
        </div>

        <div className="card-surface overflow-hidden bg-[var(--surface-elevated)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--surface-muted)]/60">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-wide text-[var(--text-secondary)] uppercase">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-wide text-[var(--text-secondary)] uppercase">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-wide text-[var(--text-secondary)] uppercase">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-wide text-[var(--text-secondary)] uppercase">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-wide text-[var(--text-secondary)] uppercase">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-[var(--surface-muted)]/40 transition-colors">
                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{user.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'teacher'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                      {user.role === 'student' && user.enrolledCourses && (
                        <div className="space-y-1">
                          <div className="text-xs">
                            Enrolled: <span className="font-medium">{user.enrolledCourses.length}</span>
                          </div>
                          {user.progress && Object.keys(user.progress).length > 0 && (
                            <div className="text-xs flex flex-wrap gap-2">
                              {Object.entries(user.progress).map(([courseId, progress]) => (
                                <span key={courseId} className="px-2 py-0.5 rounded-full bg-[var(--surface-muted)]/80">
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
    </div>
  );
}

export default Admin;

