// src/App.jsx
// Entry point chính — chỉ chứa routing và state cấp cao.
// Mọi UI/logic đã được tách sang module riêng.

import { useState } from 'react';
import { Layout }    from './components/Layout';
import { LoginGate } from './components/LoginGate';
import { useAuth }   from './hooks/useAuth';
import { useRealtimeData } from './hooks/useRealtimeData';

import { Dashboard } from './modules/dashboard/Dashboard';
import { Projects }  from './modules/projects/Projects';
import { Documents } from './modules/documents/Documents';
import { Quality }   from './modules/quality/Quality';
import { Plugins }   from './modules/plugins/Plugins';
import { Members }   from './modules/members/Members';

import { FALLBACK_QUALITY_ISSUES } from './data/fallback';

export default function App() {
  const [page, setPage] = useState('dashboard');
  const { currentUser, loginWithEmail, loginDemo, logout, isSupabaseMode } = useAuth();

  // recurringAlert dùng cho badge trên nav + header
  const { data: qualityIssues } = useRealtimeData('quality_issues', FALLBACK_QUALITY_ISSUES);
  const recurringAlert = qualityIssues.filter((i) => i.recurring && i.status === 'open').length;

  // ── Handler đăng nhập (hỗ trợ cả 2 mode) ────────────────────
  async function handleLogin({ user, password, email }) {
    if (isSupabaseMode) {
      await loginWithEmail(email || user.email, password);
    } else {
      loginDemo(user, password);
    }
  }

  // ── Render page content ──────────────────────────────────────
  function renderPage() {
    if (page === 'dashboard') {
      return <Dashboard currentUser={currentUser || { id: '0', name: 'Guest', role: 'dev', avatar: 'GS', dept: '', online: false }} />;
    }
    if (!currentUser) {
      return <LoginGate onSelectUser={(u) => {/* Layout's LoginModal handles this */}} />;
    }
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
      isSupabaseMode={isSupabaseMode}
      recurringAlert={recurringAlert}
    >
      {renderPage()}
    </Layout>
  );
}
