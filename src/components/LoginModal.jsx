import { useState } from 'react';
import { Avatar } from './ui';
import { ROLE_COLORS, ROLE_LABELS, DEMO_PASSWORDS } from '../data/constants';

export function LoginModal({ targetUser, onSuccess, onClose }) {
  const [pass, setPass]   = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy]   = useState(false);

  async function handleLogin() {
    setBusy(true);
    setError('');
    try {
      await onSuccess(targetUser, pass);
    } catch (e) {
      setError(e.message || 'Đăng nhập thất bại.');
      setPass('');
    } finally {
      setBusy(false);
    }
  }

  const color = ROLE_COLORS[targetUser.role];
  return (
    <div style={{ position:'fixed', inset:0, zIndex:999, background:'#000000bb', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center' }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'#0d1426', border:'1px solid #ffffff15', borderRadius:16, padding:'32px 28px', width:320, boxShadow:'0 24px 64px #000000cc' }}>
        <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div style={{ textAlign:'center', marginBottom:24, animation:'slideUp 0.2s ease' }}>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:12 }}>
            <Avatar user={targetUser} size={56} />
          </div>
          <div style={{ fontWeight:800, fontSize:16 }}>{targetUser.name}</div>
          <div style={{ fontSize:12, color, fontFamily:'var(--font-mono)', marginTop:4 }}>{ROLE_LABELS[targetUser.role]} · {targetUser.dept}</div>
        </div>
        <div style={{ borderTop:'1px solid #ffffff08', marginBottom:20 }} />
        <div style={{ fontSize:12, color:'#64748b', marginBottom:8 }}>Mật khẩu</div>
        <input autoFocus type="password" value={pass}
          onChange={e=>{ setPass(e.target.value); setError(''); }}
          onKeyDown={e=>e.key==='Enter'&&handleLogin()}
          placeholder="Nhập mật khẩu..."
          style={{ width:'100%', padding:'10px 14px', borderRadius:8, background:'#ffffff08', border:`1px solid ${error?'#ef4444':'#ffffff15'}`, color:'#e2e8f0', fontSize:14, outline:'none', boxSizing:'border-box' }}
        />
        {error && <div style={{ fontSize:11, color:'#ef4444', marginTop:8 }}>⚠ {error}</div>}
        <button onClick={handleLogin} disabled={busy} style={{ width:'100%', marginTop:16, padding:'11px 0', background:'linear-gradient(135deg,#3b82f6,#1d4ed8)', border:'none', borderRadius:8, color:'#fff', fontSize:14, fontWeight:700, cursor:busy?'not-allowed':'pointer', opacity:busy?0.7:1 }}>
          {busy ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
        <button onClick={onClose} style={{ width:'100%', marginTop:8, padding:'9px 0', background:'none', border:'1px solid #ffffff10', borderRadius:8, color:'#64748b', fontSize:13, cursor:'pointer' }}>Hủy</button>
        <div style={{ marginTop:16, padding:'10px 12px', background:'#ffffff05', borderRadius:8, border:'1px solid #ffffff08' }}>
          <div style={{ fontSize:10, color:'#475569', fontFamily:'var(--font-mono)' }}>Mật khẩu demo: <span style={{ color:'#60a5fa' }}>{DEMO_PASSWORDS[targetUser.id]}</span></div>
        </div>
      </div>
    </div>
  );
}
