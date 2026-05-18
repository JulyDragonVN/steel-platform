// src/components/Layout.jsx
import { useState } from 'react';
import { Avatar, Badge } from './ui';
import { LoginModal } from './LoginModal';
import { ROLE_COLORS, ROLE_LABELS, NAV_ITEMS } from '../data/constants';

export function Layout({ children, page, setPage, currentUser, onLogin, onLogout, isSupabaseMode, recurringAlert = 0 }) {
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [loginTarget,    setLoginTarget]    = useState(null);
  const [pendingPage,    setPendingPage]    = useState(null);

  function handleNavClick(item) {
    if (item.public || currentUser) {
      setPage(item.id);
    } else {
      setPendingPage(item.id);
      // Khi chưa đăng nhập, mở picker trực tiếp trong sidebar
      setShowUserPicker(true);
    }
  }

  function handleSelectUserToLogin(u) {
    setShowUserPicker(false);
    setLoginTarget(u);
  }

  async function handleLoginSuccess({ user, password, email }) {
    await onLogin({ user, password, email });
    setLoginTarget(null);
    if (pendingPage) { setPage(pendingPage); setPendingPage(null); }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#060c18', color: '#e2e8f0', fontFamily: "'IBM Plex Sans','Segoe UI',sans-serif", display: 'flex' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;600;700&display=swap');
        :root { --font-mono: 'IBM Plex Mono', monospace; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
        body { background: #060c18; }
      `}</style>

      {/* Login Modal */}
      {loginTarget && (
        <LoginModal
          targetUser={loginTarget}
          isSupabaseMode={isSupabaseMode}
          onSuccess={handleLoginSuccess}
          onClose={() => { setLoginTarget(null); setPendingPage(null); }}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <div style={{
        width: 220, flexShrink: 0, background: '#070d1c',
        borderRight: '1px solid #ffffff0a', display: 'flex', flexDirection: 'column',
        position: 'fixed', height: '100vh', left: 0, top: 0, zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: '22px 20px 16px', borderBottom: '1px solid #ffffff08' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800,
            }}>⬡</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.01em' }}>SteelTeam</div>
              <div style={{ fontSize: 10, color: '#475569', fontFamily: 'var(--font-mono)' }}>PLATFORM v2.4</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          {NAV_ITEMS.map((item) => {
            const isActive  = page === item.id;
            const locked    = !item.public && !currentUser;
            const showAlert = item.id === 'quality' && recurringAlert > 0 && currentUser;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 8, marginBottom: 2, cursor: 'pointer',
                  background: isActive ? '#3b82f618' : 'none',
                  border: isActive ? '1px solid #3b82f644' : '1px solid transparent',
                  color: isActive ? '#60a5fa' : locked ? '#334155' : '#64748b',
                  fontSize: 13, fontWeight: isActive ? 700 : 400,
                  textAlign: 'left', transition: 'all 0.15s', position: 'relative',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = '#ffffff06'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'none'; }}
              >
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                {item.label}
                {locked    && <span style={{ marginLeft: 'auto', fontSize: 11, color: '#334155' }}>🔒</span>}
                {showAlert && (
                  <span style={{
                    marginLeft: 'auto', background: '#ef4444', color: '#fff',
                    borderRadius: 10, fontSize: 10, fontWeight: 700, padding: '1px 6px', fontFamily: 'var(--font-mono)',
                  }}>{recurringAlert}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User area */}
        <UserArea
          currentUser={currentUser}
          showUserPicker={showUserPicker}
          setShowUserPicker={setShowUserPicker}
          onSelectUser={handleSelectUserToLogin}
          onLogout={onLogout}
        />
      </div>

      {/* ── Main ────────────────────────────────────────────── */}
      <div style={{ marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{
          padding: '16px 32px', borderBottom: '1px solid #ffffff08',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#070d1c99', backdropFilter: 'blur(12px)',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>
              {NAV_ITEMS.find((n) => n.id === page)?.icon}{' '}
              {NAV_ITEMS.find((n) => n.id === page)?.label}
            </div>
            <div style={{ fontSize: 11, color: '#475569', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
              {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {currentUser && recurringAlert > 0 && (
              <button
                onClick={() => setPage('quality')}
                style={{
                  background: '#7f1d1d44', border: '1px solid #ef444444',
                  borderRadius: 8, color: '#fca5a5', padding: '6px 12px',
                  cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                ⚠ {recurringAlert} lỗi tái phát
              </button>
            )}
            {currentUser ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#ffffff06', border: '1px solid #ffffff10', borderRadius: 8, padding: '6px 12px',
              }}>
                <Avatar user={currentUser} size={22} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>
                  {currentUser.name.split(' ').slice(-1)[0]}
                </span>
                <Badge color={ROLE_COLORS[currentUser.role]}>{ROLE_LABELS[currentUser.role]}</Badge>
              </div>
            ) : (
              <div style={{ fontSize: 12, color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#334155' }}>🔒</span> Chưa đăng nhập
              </div>
            )}
            <div style={{
              width: 36, height: 36, borderRadius: 8, background: '#ffffff08',
              border: '1px solid #ffffff10', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', fontSize: 14,
            }}>🔔</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
          {children}
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #ffffff08', padding: '12px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#070d1c99', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 18, height: 18, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
            }}>⬡</div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
              © {new Date().getFullYear()} <span style={{ color: '#60a5fa' }}>JulyDragonVN</span> · SteelTeam Platform
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: '#334155', fontFamily: 'var(--font-mono)' }}>v2.4.0</span>
            <span style={{ fontSize: 10, color: '#334155' }}>·</span>
            <span style={{ fontSize: 10, color: '#334155', fontFamily: 'var(--font-mono)' }}>All rights reserved</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── UserArea (phần dưới sidebar) ──────────────────────────────
import { FALLBACK_USERS } from '../data/fallback';

function UserArea({ currentUser, showUserPicker, setShowUserPicker, onSelectUser, onLogout }) {
  if (currentUser) {
    return (
      <div style={{ padding: '12px', borderTop: '1px solid #ffffff08', position: 'relative' }}>
        <button
          onClick={() => setShowUserPicker((v) => !v)}
          style={{
            width: '100%', display: 'flex', gap: 10, alignItems: 'center',
            background: '#ffffff06', border: '1px solid #ffffff10', borderRadius: 10,
            padding: '10px 12px', cursor: 'pointer',
          }}
        >
          <Avatar user={currentUser} size={30} />
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>
              {currentUser.name.split(' ').slice(-2).join(' ')}
            </div>
            <div style={{ fontSize: 10, color: ROLE_COLORS[currentUser.role], fontFamily: 'var(--font-mono)' }}>
              {ROLE_LABELS[currentUser.role]}
            </div>
          </div>
          <span style={{ color: '#475569', fontSize: 10 }}>▴▾</span>
        </button>

        {showUserPicker && (
          <div style={{
            position: 'absolute', bottom: '100%', left: 12, right: 12, marginBottom: 6,
            background: '#0d1426', border: '1px solid #ffffff15', borderRadius: 10,
            overflow: 'hidden', boxShadow: '0 -8px 32px #000000aa',
          }}>
            <div style={{ padding: '8px 12px 6px', fontSize: 10, color: '#475569', fontFamily: 'var(--font-mono)', borderBottom: '1px solid #ffffff08' }}>
              CHUYỂN TÀI KHOẢN
            </div>
            {FALLBACK_USERS.filter((u) => u.id !== currentUser.id).map((u) => (
              <button
                key={u.id}
                onClick={() => onSelectUser(u)}
                style={{
                  width: '100%', display: 'flex', gap: 8, alignItems: 'center',
                  padding: '9px 12px', background: 'none', border: 'none',
                  cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid #ffffff08',
                }}
              >
                <Avatar user={u} size={24} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#e2e8f0' }}>{u.name.split(' ').slice(-2).join(' ')}</div>
                  <div style={{ fontSize: 10, color: ROLE_COLORS[u.role] }}>{ROLE_LABELS[u.role]}</div>
                </div>
                <span style={{ fontSize: 10, color: '#334155' }}>🔒</span>
              </button>
            ))}
            <button
              onClick={onLogout}
              style={{
                width: '100%', padding: '9px 12px', background: 'none', border: 'none',
                cursor: 'pointer', textAlign: 'left', color: '#ef4444',
                fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <span>⏻</span> Đăng xuất
            </button>
          </div>
        )}
      </div>
    );
  }

  // Chưa đăng nhập
  return (
    <div style={{ padding: '12px', borderTop: '1px solid #ffffff08' }}>
      <div style={{ fontSize: 10, color: '#334155', fontFamily: 'var(--font-mono)', marginBottom: 8, paddingLeft: 2 }}>
        CHỌN TÀI KHOẢN ĐỂ ĐĂNG NHẬP
      </div>
      {FALLBACK_USERS.map((u) => (
        <button
          key={u.id}
          onClick={() => onSelectUser(u)}
          style={{
            width: '100%', display: 'flex', gap: 8, alignItems: 'center',
            padding: '8px 10px', borderRadius: 8, marginBottom: 3,
            background: '#ffffff04', border: '1px solid #ffffff08',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#3b82f615')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff04')}
        >
          <Avatar user={u} size={26} />
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#cbd5e1' }}>{u.name.split(' ').slice(-2).join(' ')}</div>
            <div style={{ fontSize: 10, color: ROLE_COLORS[u.role], fontFamily: 'var(--font-mono)' }}>{ROLE_LABELS[u.role]}</div>
          </div>
          <span style={{ fontSize: 10, color: '#334155' }}>→</span>
        </button>
      ))}
    </div>
  );
}
