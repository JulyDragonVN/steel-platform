// src/components/LoginModal.jsx
import { useState } from 'react';
import { Avatar } from './ui';
import { ROLE_COLORS, ROLE_LABELS } from '../data/constants';

export function LoginModal({ targetUser, onSuccess, onClose }) {
  const [email, setEmail] = useState('');
  const [pass,  setPass]  = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [busy,  setBusy]  = useState(false);

  async function handleLogin() {
    if (!email.trim()) { setError('Vui lòng nhập email.'); return; }
    if (!pass.trim())  { setError('Vui lòng nhập mật khẩu.'); return; }
    setBusy(true);
    setError('');
    try {
      await onSuccess({ user: targetUser, email: email.trim(), password: pass });
    } catch (e) {
      setError(e.message || 'Đăng nhập thất bại.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPass('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: '#000000bb', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0d1426', border: '1px solid #ffffff15',
          borderRadius: 16, padding: '32px 28px', width: 340,
          boxShadow: '0 24px 64px #000000cc',
          animation: shake ? 'shake 0.4s ease' : 'slideUp 0.2s ease',
        }}
      >
        <style>{`
          @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          @keyframes shake   { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 60%{transform:translateX(8px)} 80%{transform:translateX(-4px)} }
          .login-input:focus { border-color: #3b82f6 !important; outline: none; }
        `}</style>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <div style={{ position: 'relative' }}>
              <Avatar user={targetUser} size={56} />
              <div style={{
                position: 'absolute', bottom: -2, right: -2,
                width: 18, height: 18, borderRadius: '50%',
                background: '#0d1426', border: `2px solid ${ROLE_COLORS[targetUser.role]}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9,
              }}>🔒</div>
            </div>
          </div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>{targetUser.name}</div>
          <div style={{ fontSize: 12, color: ROLE_COLORS[targetUser.role], fontFamily: 'var(--font-mono)', marginTop: 4 }}>
            {ROLE_LABELS[targetUser.role]}{targetUser.dept ? ` · ${targetUser.dept}` : ''}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #ffffff08', marginBottom: 22 }} />

        {/* Email */}
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>Email</div>
        <input
          autoFocus
          className="login-input"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          placeholder="email@domain.com"
          style={inputStyle(!!error && !email)}
        />

        {/* Password */}
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, marginTop: 14 }}>Mật khẩu</div>
        <input
          className="login-input"
          type="password"
          value={pass}
          onChange={(e) => { setPass(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          placeholder="Nhập mật khẩu..."
          style={inputStyle(!!error && !pass)}
        />

        {error && (
          <div style={{ fontSize: 11, color: '#ef4444', marginTop: 8, display: 'flex', gap: 5, alignItems: 'center' }}>
            <span>⚠</span>{error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={busy}
          style={{
            width: '100%', marginTop: 16, padding: '11px 0',
            background: busy ? '#1d4ed8' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            border: 'none', borderRadius: 8, color: '#fff',
            fontSize: 14, fontWeight: 700, cursor: busy ? 'not-allowed' : 'pointer',
          }}
        >
          {busy ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>

        <button
          onClick={onClose}
          style={{
            width: '100%', marginTop: 8, padding: '9px 0',
            background: 'none', border: '1px solid #ffffff10',
            borderRadius: 8, color: '#64748b', fontSize: 13, cursor: 'pointer',
          }}
        >
          Hủy
        </button>
      </div>
    </div>
  );
}

function inputStyle(hasError) {
  return {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    background: '#ffffff08',
    border: `1px solid ${hasError ? '#ef4444' : '#ffffff15'}`,
    color: '#e2e8f0', fontSize: 14, outline: 'none',
    fontFamily: "'IBM Plex Sans', sans-serif",
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };
}
