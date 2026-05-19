// src/components/LoginGate.jsx
// Hiển thị khi user chưa đăng nhập và cố vào trang cần xác thực

export function LoginGate({ onOpenLogin }) {
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
      <button
        onClick={onOpenLogin}
        style={{
          padding: '10px 28px',
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          border: 'none', borderRadius: 10,
          color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
        }}
      >
        Đăng nhập
      </button>
    </div>
  );
}
