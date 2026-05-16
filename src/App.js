import React, { useState, useMemo } from 'react';
import { USERS, QUALITY_ISSUES } from './data/mockData';
import { ROLE_COLORS, ROLE_LABELS } from './constants/theme';
import { Avatar } from './components/Common';

// Import các modules con độc lập
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import Documents from './components/Documents';
import Quality from './components/Quality';
import Plugins from './components/Plugins';
import Members from './components/Members';
import LoginModal from './components/LoginModal';

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "▦", public: true },
  { id: "projects",  label: "Dự Án",     icon: "◈", public: false },
  { id: "docs",      label: "Tài Liệu",  icon: "◎", public: false },
  { id: "quality",   label: "Chất Lượng",icon: "△", public: false },
  { id: "plugins",   label: "Kho Plugin",icon: "⬡", public: false },
  { id: "members",   label: "Thành Viên",icon: "◉", public: false },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [loginTarget, setLoginTarget] = useState(null);
  const [pendingPage, setPendingPage] = useState(null);

  const recurringAlert = useMemo(() => {
    return QUALITY_ISSUES.filter(i => i.recurring && i.status === "open").length;
  }, []);

  const handleNavClick = (item) => {
    if (item.public || currentUser) {
      setPage(item.id);
    } else {
      setPendingPage(item.id);
      setLoginTarget(USERS[0]);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-main)", color: "var(--text-primary)", display: "flex", width: "100%" }}>
      {loginTarget && (
        <LoginModal
          targetUser={loginTarget}
          onSuccess={(user) => {
            setCurrentUser(user);
            setLoginTarget(null);
            if (pendingPage) {
              setPage(pendingPage);
              setPendingPage(null);
            }
          }}
          onClose={() => setLoginTarget(null)}
        />
      )}

      {/* Sidebar Layout */}
      <div style={{ width: 240, background: "var(--bg-sidebar)", borderRight: "1px solid var(--border-color)", position: "fixed", height: "100vh", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px 20px", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff" }}>S</div>
          <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: "0.02em" }}>SteelTeam Platform</span>
        </div>

        <nav style={{ padding: 16, display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {NAV_ITEMS.map(item => {
            const isActive = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 8,
                  background: isActive ? "#3b82f615" : "none", border: "none",
                  color: isActive ? "var(--color-dev)" : "var(--text-muted)",
                  textAlign: "left", cursor: "pointer", fontSize: 13, fontWeight: isActive ? 600 : 500,
                  display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s"
                }}
              >
                <span style={{ fontSize: 16, opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {!item.public && !currentUser && <span style={{ fontSize: 10, opacity: 0.4 }}>🔒</span>}
              </button>
            );
          })}
        </nav>

        {/* User Account Bar */}
        <div style={{ padding: 16, borderTop: "1px solid var(--border-color)", background: "#00000015" }}>
          {currentUser ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ cursor: "pointer" }} onClick={() => setShowUserPicker(!showUserPicker)}>
                <Avatar user={currentUser} size={36} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentUser.name}</div>
                <div style={{ fontSize: 11, color: ROLE_COLORS[currentUser.role], fontFamily: "var(--font-mono)" }}>{ROLE_LABELS[currentUser.role]}</div>
              </div>
              <button onClick={() => { setCurrentUser(null); setPage("dashboard"); }} style={{ background: "none", border: "none", color: "var(--color-danger)", cursor: "pointer", fontSize: 14 }}>✕</button>
            </div>
          ) : (
            <button onClick={() => { setLoginTarget(USERS[0]); }} className="steel-btn-primary" style={{ width: "100%", padding: "8px 0" }}>
              🔒 Đăng nhập Hệ thống
            </button>
          )}

          {/* User Quick Switcher Dropdown */}
          {showUserPicker && (
            <div style={{
              position: "absolute", bottom: 70, left: 16, right: 16, background: "#0d1426",
              border: "1px solid var(--border-color)", borderRadius: 10, padding: 6, zIndex: 100,
              boxShadow: "0 -10px 25px #00000050"
            }}>
              <div style={{ fontSize: 10, color: "var(--text-muted)", padding: "4px 8px 6px" }}>CHUYỂN TÀI KHOẢN MOCK:</div>
              {USERS.map(u => (
                <div key={u.id} onClick={() => { setLoginTarget(u); setShowUserPicker(false); }} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: 6, borderRadius: 6, cursor: "pointer",
                  background: currentUser?.id === u.id ? "#ffffff05" : "none"
                }}>
                  <Avatar user={u} size={24} />
                  <span style={{ fontSize: 12, flex: 1 }}>{u.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Container Dashboard */}
      <div style={{ marginLeft: 240, flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Header */}
        <header style={{ height: 64, borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", background: "var(--bg-sidebar)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)", background: "#ffffff04", padding: "4px 8px", borderRadius: 4, border: "1px solid #ffffff06" }}>
              SYS_STATUS: ONLINE
            </span>
            {recurringAlert > 0 && (
              <span style={{ fontSize: 11, background: "var(--color-danger)22", color: "var(--color-danger)", border: "1px solid var(--color-danger)44", padding: "3px 8px", borderRadius: 4, fontWeight: 600 }}>
                ⚠ PHÁT HIỆN LỖI TÁI PHÁT KHẨN CẤP
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Server: Đông Nam Á (Vercel Edge)</span>
          </div>
        </header>

        {/* Dynamic Inner Router Render Module */}
        <main style={{ flex: 1, padding: 32, overflowY: "auto" }}>
          {page === "dashboard" && <Dashboard currentUser={currentUser} />}
          {page === "projects" && <Projects currentUser={currentUser} />}
          {page === "docs" && <Documents currentUser={currentUser} />}
          {page === "quality" && <Quality currentUser={currentUser} />}
          {page === "plugins" && <Plugins currentUser={currentUser} />}
          {page === "members" && <Members currentUser={currentUser} />}
        </main>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid var(--border-color)", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#070d1c99", fontSize: 12, color: "var(--text-muted)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "var(--color-primary)" }}>⬡</span>
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>
              © {new Date().getFullYear()} JulyDragonVN · SteelTeam Platform v2.0
            </span>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>
            Stack: React 18 · Vite · Paged UI Vercel
          </div>
        </footer>
      </div>
    </div>
  );
}