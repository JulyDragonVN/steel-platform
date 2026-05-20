import { useState } from 'react';
import { Layout }          from './components/Layout';
import { useAuth }         from './hooks/useAuth';
import { useRealtimeData } from './hooks/useRealtimeData';

import { Dashboard } from './modules/dashboard/Dashboard';
import { Projects }  from './modules/projects/Projects';
import { Documents } from './modules/documents/Documents';
import { Quality }   from './modules/quality/Quality';
import { Plugins }   from './modules/plugins/Plugins';
import { Members }   from './modules/members/Members';

export default function App() {
  const [page, setPage] = useState('dashboard');
  const { currentUser, loading, loginWithEmail, logout } = useAuth();

  const { data: qualityIssues } = useRealtimeData('quality_issues');
  const recurringAlert = qualityIssues.filter(i => i.recurring && i.status === 'open').length;

  // Chờ kiểm tra session Supabase trước khi render
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#060c18',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#475569', fontFamily: 'monospace', fontSize: 13,
        flexDirection: 'column', gap: 16,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '3px solid #1d4ed8', borderTopColor: '#60a5fa',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span>Đang khởi động...</span>
      </div>
    );
  }

  function renderPage() {
    if (page === 'dashboard') return <Dashboard currentUser={currentUser} />;
    if (!currentUser) return null;
    switch (page) {
      case 'projects': return <Projects  currentUser={currentUser} />;
      case 'docs':     return <Documents currentUser={currentUser} />;
      case 'quality':  return <Quality   currentUser={currentUser} />;
      case 'plugins':  return <Plugins   currentUser={currentUser} />;
      case 'members':  return <Members   currentUser={currentUser} />;
      default:         return null;
    }
  }

  return (
    <Layout
      page={page}
      setPage={setPage}
      currentUser={currentUser}
      onLogin={({ email, password }) => loginWithEmail(email, password)}
      onLogout={logout}
      recurringAlert={recurringAlert}
    >
      {renderPage()}
    </Layout>
  );
}
