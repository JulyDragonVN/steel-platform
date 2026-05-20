export function ConfigError() {
  return (
    <div style={{
      minHeight: '100vh', background: '#060c18', color: '#e2e8f0',
      fontFamily: "'IBM Plex Sans','Segoe UI',sans-serif",
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#0d1426', border: '1px solid #ef444444',
        borderRadius: 16, padding: '40px 36px', maxWidth: 480, width: '90%',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⚠</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 10, color: '#fca5a5' }}>
          Thiếu cấu hình Supabase
        </div>
        <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, marginBottom: 24 }}>
          Ứng dụng cần 2 biến môi trường để kết nối database.
        </div>

        <div style={{
          background: '#000000aa', borderRadius: 10, padding: '16px 18px',
          fontFamily: 'monospace', fontSize: 12, textAlign: 'left',
          border: '1px solid #ffffff0a', marginBottom: 24,
        }}>
          <div style={{ color: '#475569', marginBottom: 8 }}># File .env (local) hoặc Vercel Environment Variables</div>
          <div style={{ color: '#4ade80' }}>VITE_SUPABASE_URL=https://xxxx.supabase.co</div>
          <div style={{ color: '#4ade80' }}>VITE_SUPABASE_ANON_KEY=eyJhbGci...</div>
        </div>

        <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.8 }}>
          <div>1. Vào <span style={{ color: '#60a5fa' }}>supabase.com</span> → Project Settings → API</div>
          <div>2. Copy <b style={{ color: '#e2e8f0' }}>Project URL</b> và <b style={{ color: '#e2e8f0' }}>anon public key</b></div>
          <div>3. Thêm vào Vercel: Settings → Environment Variables</div>
          <div>4. Redeploy lại project</div>
        </div>
      </div>
    </div>
  );
}
