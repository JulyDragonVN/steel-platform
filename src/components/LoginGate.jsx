// src/components/LoginGate.jsx
// Hiển thị khi user chưa đăng nhập và cố vào trang cần xác thực

import { Avatar } from './ui';
import { ROLE_COLORS, ROLE_LABELS } from '../data/constants';
import { FALLBACK_USERS } from '../data/fallback';

export function LoginGate({ onSelectUser }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh', gap: 20, textAlign: 'center',
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20,
        background: 'linear-gradient(135deg, #3b82f622, #1d4ed822)',
        border: '1px solid #3b82f633',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
      }}>🔒</div>
      <div>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Yêu cầu đăng nhập</div>
        <div style={{ fontSize: 13, color: '#64748b', maxWidth: 320, lineHeight: 1.6 }}>
          Bạn cần đăng nhập bằng tài khoản được cấp phép để truy cập module này.
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 400 }}>
        {FALLBACK_USERS.map((u) => (
          <button
            key={u.id}
            onClick={() => onSelectUser(u)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
              background: '#ffffff06', border: '1px solid #ffffff10', borderRadius: 10,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = ROLE_COLORS[u.role] + '66')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#ffffff10')}
          >
            <Avatar user={u} size={28} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{u.name.split(' ').slice(-2).join(' ')}</div>
              <div style={{ fontSize: 10, color: ROLE_COLORS[u.role], fontFamily: 'var(--font-mono)' }}>{ROLE_LABELS[u.role]}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
