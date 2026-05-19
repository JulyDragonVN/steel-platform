// src/App.jsx
import { useState } from 'react';
import { Layout }    from './components/Layout';
import { useAuth }   from './hooks/useAuth';
import { useRealtimeData } from './hooks/useRealtimeData';

import { Dashboard } from './modules/dashboard/Dashboard';
import { Projects }  from './modules/projects/Projects';
import { Documents } from './modules/documents/Documents';
import { Quality }   from './modules/quality/Quality';
import { Plugins }   from './modules/plugins/Plugins';
import { Members }   from './modules/members/Members';

export default function App() {
  const [page, setPage] = useState('dashboard');
  const { currentUser, loginWithEmail, logout } = useAuth();

  const { data: qualityIssues } = useRealtimeData('quality_issues');
  const recurringAlert = qualityIssues.filter((i) => i.recurring && i.status === 'open').length;

  async function handleLogin({ email, password }) {
    await loginWithEmail(email, password);
  }

  function renderPage() {
    if (page === 'dashboard') {
      return <Dashboard currentUser={currentUser} />;
    }
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
      onLogin={handleLogin}
      onLogout={logout}
      recurringAlert={recurringAlert}
    >
      {renderPage()}
    </Layout>
  );
}
