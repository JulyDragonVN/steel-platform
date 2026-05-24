import { useState } from 'react';
import { Avatar, Badge } from './ui';
import { LoginModal } from './LoginModal';
import { ROLE_COLORS, ROLE_LABELS, NAV_ITEMS } from '../data/constants';
import { FALLBACK_USERS } from '../data/fallback';

export function Layout({ children, page, setPage, currentUser, onLogin, onLogout, recurringAlert=0 }) {
  const [loginTarget, setLoginTarget] = useState(null);
  const [pendingPage, setPendingPage] = useState(null);
  const [showPicker,  setShowPicker]  = useState(false);

  function handleNav(item) {
    if (item.public || currentUser) { setPage(item.id); }
    else { setPendingPage(item.id); setShowPicker(true); }
  }

  async function handleLoginSuccess(user, password) {
    await onLogin(user, password);
    setLoginTarget(null);
    if (pendingPage) { setPage(pendingPage); setPendingPage(null); }
    setShowPicker(false);
  }

  return (
    <div style={{ minHeight:'100vh', background:'#060c18', color:'#e2e8f0', fontFamily:"'IBM Plex Sans','Segoe UI',sans-serif", display:'flex' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;600;700&display=swap');
        :root{--font-mono:'IBM Plex Mono',monospace}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:#334155;border-radius:2px}
        body{background:#060c18}
      `}</style>

      {loginTarget && <LoginModal targetUser={loginTarget} onSuccess={handleLoginSuccess} onClose={()=>{setLoginTarget(null);setPendingPage(null);}} />}

      {/* Sidebar */}
      <div style={{ width:220, flexShrink:0, background:'#070d1c', borderRight:'1px solid #ffffff0a', display:'flex', flexDirection:'column', position:'fixed', height:'100vh', left:0, top:0, zIndex:100 }}>
        <div style={{ padding:'22px 20px 16px', borderBottom:'1px solid #ffffff08' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, background:'linear-gradient(135deg,#3b82f6,#1d4ed8)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800 }}>⬡</div>
            <div>
              <div style={{ fontSize:14, fontWeight:800 }}>SteelTeam</div>
              <div style={{ fontSize:10, color:'#475569', fontFamily:'var(--font-mono)' }}>PLATFORM v2.4</div>
            </div>
          </div>
        </div>

        <nav style={{ flex:1, padding:'12px 10px', overflowY:'auto' }}>
          {NAV_ITEMS.map(item => {
            const isActive = page === item.id;
            const locked   = !item.public && !currentUser;
            return (
              <button key={item.id} onClick={()=>handleNav(item)} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:8, marginBottom:2, cursor:'pointer', background:isActive?'#3b82f618':'none', border:isActive?'1px solid #3b82f644':'1px solid transparent', color:isActive?'#60a5fa':locked?'#334155':'#64748b', fontSize:13, fontWeight:isActive?700:400, textAlign:'left' }}>
                <span style={{ fontSize:14 }}>{item.icon}</span>
                {item.label}
                {locked && <span style={{ marginLeft:'auto', fontSize:11 }}>🔒</span>}
                {item.id==='quality' && recurringAlert>0 && currentUser && <span style={{ marginLeft:'auto', background:'#ef4444', color:'#fff', borderRadius:10, fontSize:10, fontWeight:700, padding:'1px 6px' }}>{recurringAlert}</span>}
              </button>
            );
          })}
        </nav>

        {/* User area */}
        <div style={{ padding:'12px', borderTop:'1px solid #ffffff08' }}>
          {currentUser ? (
            <div style={{ position:'relative' }}>
              <button onClick={()=>setShowPicker(v=>!v)} style={{ width:'100%', display:'flex', gap:10, alignItems:'center', background:'#ffffff06', border:'1px solid #ffffff10', borderRadius:10, padding:'10px 12px', cursor:'pointer' }}>
                <Avatar user={currentUser} size={30} />
                <div style={{ flex:1, textAlign:'left' }}>
                  <div style={{ fontSize:12, fontWeight:600, color:'#e2e8f0' }}>{currentUser.name.split(' ').slice(-2).join(' ')}</div>
                  <div style={{ fontSize:10, color:ROLE_COLORS[currentUser.role], fontFamily:'var(--font-mono)' }}>{ROLE_LABELS[currentUser.role]}</div>
                </div>
                <span style={{ color:'#475569', fontSize:10 }}>▴▾</span>
              </button>
              {showPicker && (
                <div style={{ position:'absolute', bottom:'100%', left:0, right:0, marginBottom:6, background:'#0d1426', border:'1px solid #ffffff15', borderRadius:10, overflow:'hidden', boxShadow:'0 -8px 32px #000000aa' }}>
                  <div style={{ padding:'8px 12px 6px', fontSize:10, color:'#475569', fontFamily:'var(--font-mono)', borderBottom:'1px solid #ffffff08' }}>CHUYỂN TÀI KHOẢN</div>
                  {FALLBACK_USERS.filter(u=>u.id!==currentUser.id).map(u=>(
                    <button key={u.id} onClick={()=>{setShowPicker(false);setLoginTarget(u);}} style={{ width:'100%', display:'flex', gap:8, alignItems:'center', padding:'9px 12px', background:'none', border:'none', cursor:'pointer', borderBottom:'1px solid #ffffff08' }}>
                      <Avatar user={u} size={24} />
                      <div style={{ flex:1, textAlign:'left' }}>
                        <div style={{ fontSize:11, fontWeight:600, color:'#e2e8f0' }}>{u.name.split(' ').slice(-2).join(' ')}</div>
                        <div style={{ fontSize:10, color:ROLE_COLORS[u.role] }}>{ROLE_LABELS[u.role]}</div>
                      </div>
                    </button>
                  ))}
                  <button onClick={onLogout} style={{ width:'100%', padding:'9px 12px', background:'none', border:'none', cursor:'pointer', textAlign:'left', color:'#ef4444', fontSize:12, fontWeight:600 }}>⏻ Đăng xuất</button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{ fontSize:10, color:'#334155', fontFamily:'var(--font-mono)', marginBottom:8 }}>CHỌN TÀI KHOẢN</div>
              {FALLBACK_USERS.map(u=>(
                <button key={u.id} onClick={()=>setLoginTarget(u)} style={{ width:'100%', display:'flex', gap:8, alignItems:'center', padding:'8px 10px', borderRadius:8, marginBottom:3, background:'#ffffff04', border:'1px solid #ffffff08', cursor:'pointer' }}>
                  <Avatar user={u} size={26} />
                  <div style={{ flex:1, textAlign:'left' }}>
                    <div style={{ fontSize:11, fontWeight:600, color:'#cbd5e1' }}>{u.name.split(' ').slice(-2).join(' ')}</div>
                    <div style={{ fontSize:10, color:ROLE_COLORS[u.role], fontFamily:'var(--font-mono)' }}>{ROLE_LABELS[u.role]}</div>
                  </div>
                  <span style={{ fontSize:10, color:'#334155' }}>→</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main */}
      <div style={{ marginLeft:220, flex:1, display:'flex', flexDirection:'column', minHeight:'100vh' }}>
        <div style={{ padding:'16px 32px', borderBottom:'1px solid #ffffff08', display:'flex', alignItems:'center', justifyContent:'space-between', background:'#070d1c99', backdropFilter:'blur(12px)', position:'sticky', top:0, zIndex:50 }}>
          <div>
            <div style={{ fontSize:18, fontWeight:800 }}>{NAV_ITEMS.find(n=>n.id===page)?.icon} {NAV_ITEMS.find(n=>n.id===page)?.label}</div>
            <div style={{ fontSize:11, color:'#475569', fontFamily:'var(--font-mono)', marginTop:2 }}>{new Date().toLocaleDateString('vi-VN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            {currentUser ? (
              <div style={{ display:'flex', alignItems:'center', gap:8, background:'#ffffff06', border:'1px solid #ffffff10', borderRadius:8, padding:'6px 12px' }}>
                <Avatar user={currentUser} size={22} />
                <span style={{ fontSize:12, fontWeight:600 }}>{currentUser.name.split(' ').slice(-1)[0]}</span>
                <Badge color={ROLE_COLORS[currentUser.role]}>{ROLE_LABELS[currentUser.role]}</Badge>
              </div>
            ) : (
              <div style={{ fontSize:12, color:'#475569' }}>🔒 Chưa đăng nhập</div>
            )}
          </div>
        </div>

        <div style={{ flex:1, padding:'28px 32px', overflowY:'auto' }}>{children}</div>

        <div style={{ borderTop:'1px solid #ffffff08', padding:'12px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'#070d1c99' }}>
          <span style={{ fontSize:11, color:'#475569', fontFamily:'var(--font-mono)' }}>© {new Date().getFullYear()} <span style={{ color:'#60a5fa' }}>JulyDragonVN</span> · SteelTeam Platform</span>
          <span style={{ fontSize:10, color:'#334155', fontFamily:'var(--font-mono)' }}>v2.4.0</span>
        </div>
      </div>
    </div>
  );
}
