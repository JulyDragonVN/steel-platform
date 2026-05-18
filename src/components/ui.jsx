// src/components/ui.jsx
// Các component dùng chung toàn app

import { ROLE_COLORS } from '../data/constants';

// ── Avatar ────────────────────────────────────────────────────
export function Avatar({ user, size = 32 }) {
  if (!user) return null;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${ROLE_COLORS[user.role]}44, ${ROLE_COLORS[user.role]}88)`,
      border: `1.5px solid ${ROLE_COLORS[user.role]}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, color: ROLE_COLORS[user.role],
      flexShrink: 0, position: 'relative', fontFamily: 'var(--font-mono)',
    }}>
      {user.avatar}
      {user.online && (
        <span style={{
          position: 'absolute', bottom: 1, right: 1,
          width: 8, height: 8, borderRadius: '50%',
          background: '#22c55e', border: '1.5px solid #0a0f1e',
        }} />
      )}
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────
export function Badge({ children, color = '#60a5fa', bg }) {
  return (
    <span style={{
      padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
      color, background: bg || `${color}22`, border: `1px solid ${color}44`,
      fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
    }}>
      {children}
    </span>
  );
}

// ── ProgressBar ───────────────────────────────────────────────
export function ProgressBar({ value, color = '#60a5fa', height = 4 }) {
  return (
    <div style={{ background: '#ffffff10', borderRadius: height, height, overflow: 'hidden' }}>
      <div style={{
        width: `${value}%`, height: '100%', borderRadius: height,
        background: `linear-gradient(90deg, ${color}88, ${color})`,
        transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
      }} />
    </div>
  );
}

// ── LoadingSpinner ─────────────────────────────────────────────
export function LoadingSpinner({ text = 'Đang tải...' }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '40vh', gap: 16,
    }}>
      <div style={{
        width: 36, height: 36, border: '3px solid #ffffff10',
        borderTop: '3px solid #60a5fa', borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span style={{ fontSize: 12, color: '#475569', fontFamily: 'var(--font-mono)' }}>{text}</span>
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────────
export function EmptyState({ icon = '◎', title, desc }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '48px 0', gap: 12, color: '#475569',
    }}>
      <div style={{ fontSize: 32 }}>{icon}</div>
      {title && <div style={{ fontSize: 14, fontWeight: 700, color: '#64748b' }}>{title}</div>}
      {desc  && <div style={{ fontSize: 12, color: '#475569', textAlign: 'center', maxWidth: 280 }}>{desc}</div>}
    </div>
  );
}

// ── SectionHeader ─────────────────────────────────────────────
export function SectionHeader({ children }) {
  return (
    <div style={{
      fontWeight: 700, marginBottom: 16, fontSize: 13,
      letterSpacing: '0.08em', color: '#94a3b8',
    }}>
      {children}
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────────
export function Card({ children, style = {}, onClick, highlight = false }) {
  const base = {
    background: highlight ? '#7f1d1d22' : '#ffffff06',
    border: `1px solid ${highlight ? '#ef444444' : '#ffffff10'}`,
    borderRadius: 12, padding: 20,
    ...(onClick ? { cursor: 'pointer', transition: 'all 0.2s' } : {}),
    ...style,
  };
  return (
    <div
      style={base}
      onClick={onClick}
      onMouseEnter={onClick ? (e) => (e.currentTarget.style.borderColor = '#3b82f644') : undefined}
      onMouseLeave={onClick ? (e) => (e.currentTarget.style.borderColor = highlight ? '#ef444444' : '#ffffff10') : undefined}
    >
      {children}
    </div>
  );
}

// ── Button ────────────────────────────────────────────────────
export function Button({ children, onClick, variant = 'primary', size = 'md', style = {}, disabled }) {
  const variants = {
    primary:   { background: '#3b82f6',    border: 'none',                  color: '#fff' },
    danger:    { background: '#ef4444',    border: 'none',                  color: '#fff' },
    ghost:     { background: 'none',       border: '1px solid #ffffff20',   color: '#94a3b8' },
    secondary: { background: '#ffffff08',  border: '1px solid #ffffff15',   color: '#94a3b8' },
  };
  const sizes = {
    sm: { padding: '5px 12px', fontSize: 11 },
    md: { padding: '8px 16px', fontSize: 13 },
    lg: { padding: '11px 22px', fontSize: 14 },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        borderRadius: 8, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'opacity 0.15s', opacity: disabled ? 0.5 : 1,
        fontFamily: "'IBM Plex Sans', sans-serif",
        ...variants[variant], ...sizes[size], ...style,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.opacity = '0.85'; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.opacity = '1'; }}
    >
      {children}
    </button>
  );
}

// ── FilterBar ─────────────────────────────────────────────────
export function FilterBar({ options, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
      {options.map(([key, label, dangerActive]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          style={{
            padding: '6px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600,
            background: active === key ? (dangerActive ? '#ef4444' : '#3b82f6') : '#ffffff08',
            border: active === key ? 'none' : '1px solid #ffffff10',
            color: active === key ? '#fff' : '#94a3b8',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
