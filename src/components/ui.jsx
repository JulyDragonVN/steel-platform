import { ROLE_COLORS } from '../data/constants';

export function Avatar({ user, size = 32 }) {
  if (!user) return null;
  const color = ROLE_COLORS[user.role] || '#60a5fa';
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:`linear-gradient(135deg,${color}44,${color}88)`, border:`1.5px solid ${color}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*0.35, fontWeight:700, color, flexShrink:0, position:'relative', fontFamily:'var(--font-mono)' }}>
      {user.avatar}
      {user.online && <span style={{ position:'absolute', bottom:1, right:1, width:8, height:8, borderRadius:'50%', background:'#22c55e', border:'1.5px solid #0a0f1e' }} />}
    </div>
  );
}

export function Badge({ children, color = '#60a5fa' }) {
  return <span style={{ padding:'2px 8px', borderRadius:4, fontSize:11, fontWeight:600, color, background:`${color}22`, border:`1px solid ${color}44`, fontFamily:'var(--font-mono)' }}>{children}</span>;
}

export function ProgressBar({ value, color = '#60a5fa', height = 4 }) {
  return (
    <div style={{ background:'#ffffff10', borderRadius:height, height, overflow:'hidden' }}>
      <div style={{ width:`${Math.min(Number(value)||0,100)}%`, height:'100%', borderRadius:height, background:`linear-gradient(90deg,${color}88,${color})`, transition:'width 0.8s ease' }} />
    </div>
  );
}

export function SectionHeader({ children }) {
  return <div style={{ fontWeight:700, marginBottom:16, fontSize:13, letterSpacing:'0.08em', color:'#94a3b8' }}>{children}</div>;
}

export function Card({ children, style={}, onClick, highlight=false }) {
  return (
    <div style={{ background:highlight?'#7f1d1d22':'#ffffff06', border:`1px solid ${highlight?'#ef444444':'#ffffff10'}`, borderRadius:12, padding:20, ...(onClick?{cursor:'pointer'}:{}), ...style }}
      onClick={onClick}
      onMouseEnter={onClick?(e)=>(e.currentTarget.style.borderColor='#3b82f644'):undefined}
      onMouseLeave={onClick?(e)=>(e.currentTarget.style.borderColor=highlight?'#ef444444':'#ffffff10'):undefined}
    >{children}</div>
  );
}

export function Button({ children, onClick, variant='primary', size='md', style={}, disabled }) {
  const v = { primary:{background:'#3b82f6',border:'none',color:'#fff'}, danger:{background:'#ef4444',border:'none',color:'#fff'}, ghost:{background:'none',border:'1px solid #ffffff20',color:'#94a3b8'}, secondary:{background:'#ffffff08',border:'1px solid #ffffff15',color:'#94a3b8'} };
  const s = { sm:{padding:'5px 12px',fontSize:11}, md:{padding:'8px 16px',fontSize:13}, lg:{padding:'11px 22px',fontSize:14} };
  return <button onClick={onClick} disabled={disabled} style={{ borderRadius:8, fontWeight:600, cursor:disabled?'not-allowed':'pointer', opacity:disabled?0.5:1, fontFamily:"'IBM Plex Sans',sans-serif", ...v[variant], ...s[size], ...style }}>{children}</button>;
}

export function FilterBar({ options, active, onChange }) {
  return (
    <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
      {options.map(([key, label, danger]) => (
        <button key={key} onClick={()=>onChange(key)} style={{ padding:'6px 14px', borderRadius:6, fontSize:12, cursor:'pointer', fontWeight:600, background:active===key?(danger?'#ef4444':'#3b82f6'):'#ffffff08', border:active===key?'none':'1px solid #ffffff10', color:active===key?'#fff':'#94a3b8' }}>{label}</button>
      ))}
    </div>
  );
}
