import { useState } from 'react';
import { Layout }   from './components/Layout';
import { useAuth }  from './hooks/useAuth';
import { useData }  from './hooks/useData';
import { Dashboard } from './modules/dashboard/Dashboard';
import { Projects }  from './modules/projects/Projects';
import { Documents } from './modules/documents/Documents';
import { Quality }   from './modules/quality/Quality';
import { Plugins }   from './modules/plugins/Plugins';
import { Members }   from './modules/members/Members';
import { FALLBACK_QUALITY_ISSUES } from './data/fallback';

const GUEST = { id:'0', name:'Guest', role:'dev', avatar:'GS', dept:'', online:false };

export default function App() {
  const [page, setPage] = useState('dashboard');
  const { currentUser, login, logout } = useAuth();
  const { data: qualityIssues } = useData('quality_issues', FALLBACK_QUALITY_ISSUES);
  const recurringAlert = qualityIssues.filter(i => i.recurring && i.status === 'open').length;

  function renderPage() {
    const user = currentUser || GUEST;
    if (page === 'dashboard') return <Dashboard currentUser={user} />;
    if (!currentUser) return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:12 }}>
        <div style={{ fontSize:32 }}>🔒</div>
        <div style={{ fontSize:18, fontWeight:800 }}>Yêu cầu đăng nhập</div>
        <div style={{ fontSize:13, color:'#64748b' }}>Chọn tài khoản ở sidebar để đăng nhập.</div>
      </div>
    );
    switch (page) {
      case 'projects': return <Projects  currentUser={currentUser} />;
      case 'docs':     return <Documents currentUser={currentUser} />;
      case 'quality':  return <Quality   currentUser={currentUser} />;
      case 'plugins':  return <Plugins   currentUser={currentUser} />;
      case 'members':  return <Members   currentUser={currentUser} />;
      default: return null;
    }
  }

  return (
    <Layout page={page} setPage={setPage} currentUser={currentUser} onLogin={login} onLogout={logout} recurringAlert={recurringAlert}>
      {renderPage()}
    </Layout>
  );
}
