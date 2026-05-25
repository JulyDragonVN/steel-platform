import { Avatar, Badge, Button } from '../../components/ui';
import { ROLE_COLORS, ROLE_LABELS } from '../../data/constants';
import { useData } from '../../hooks/useData';
import { FALLBACK_USERS } from '../../data/fallback';

const PERMS = {
  'Quản lý user':    {admin:true,  lead:false, dev:false},
  'Tạo dự án':       {admin:true,  lead:false, dev:false},
  'Quản lý dự án':   {admin:true,  lead:true,  dev:false},
  'Duyệt task':      {admin:true,  lead:true,  dev:false},
  'Tạo task':        {admin:true,  lead:true,  dev:false},
  'Nhận task':       {admin:true,  lead:true,  dev:true },
  'Upload tài liệu': {admin:true,  lead:true,  dev:true },
  'Báo lỗi':         {admin:true,  lead:true,  dev:true },
  'Quản lý plugin':  {admin:true,  lead:true,  dev:false},
  'Xuất báo cáo':    {admin:true,  lead:true,  dev:false},
};

function TeamsButton({ email }) {
  if (!email) return null;
  return (
    <a
      href={`https://teams.microsoft.com/l/chat/0/0?users=${email}`}
      target="_blank"
      rel="noreferrer"
      title={`Chat với ${email}`}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '4px 10px', borderRadius: 6, fontSize: 11,
        fontWeight: 600, textDecoration: 'none',
        background: '#464eb822', border: '1px solid #464eb844',
        color: '#7b83eb', whiteSpace: 'nowrap', flexShrink: 0,
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#464eb844'}
      onMouseLeave={e => e.currentTarget.style.background = '#464eb822'}
    >
      💬 Chat
    </a>
  );
}

export function Members({ currentUser }) {
  const { data: users } = useData('users', FALLBACK_USERS);

  if (currentUser.role !== 'admin') {
    return (
      <div>
        <div style={{ fontSize:20, fontWeight:800, marginBottom:20 }}>Thành Viên</div>
        {users.map(u => (
          <div key={u.id} style={{ display:'flex', gap:12, alignItems:'center', padding:'12px 16px', background:'#ffffff06', border:'1px solid #ffffff10', borderRadius:10, marginBottom:8 }}>
            <Avatar user={u} size={36} />
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:13 }}>{u.name}</div>
              <div style={{ fontSize:11, color:'#64748b' }}>{u.dept}</div>
            </div>
            <Badge color={ROLE_COLORS[u.role]}>{ROLE_LABELS[u.role]}</Badge>
            <div style={{ width:8, height:8, borderRadius:'50%', background:u.online?'#4ade80':'#475569' }} />
            <TeamsButton email={u.teams_email} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div style={{ fontSize:20, fontWeight:800 }}>Thành Viên & Quyền</div>
        <Button>+ Thêm thành viên</Button>
      </div>

      {/* Grid thành viên */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:28 }}>
        {users.map(u => (
          <div key={u.id} style={{ background:'#ffffff06', border:'1px solid #ffffff10', borderRadius:10, padding:'14px 16px' }}>
            <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:10 }}>
              <Avatar user={u} size={36} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:13 }}>{u.name}</div>
                <div style={{ fontSize:11, color:'#64748b' }}>{u.dept}</div>
              </div>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: u.teams_email ? 10 : 0 }}>
              <Badge color={ROLE_COLORS[u.role]}>{ROLE_LABELS[u.role]}</Badge>
              <span style={{ fontSize:11, color:u.online?'#4ade80':'#475569' }}>{u.online?'● Online':'○ Offline'}</span>
            </div>
            {u.teams_email && (
              <div style={{ marginTop:8, borderTop:'1px solid #ffffff08', paddingTop:10 }}>
                <TeamsButton email={u.teams_email} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Ma trận phân quyền */}
      <div style={{ background:'#ffffff06', border:'1px solid #ffffff10', borderRadius:12, overflow:'hidden' }}>
        <div style={{ padding:'14px 20px', borderBottom:'1px solid #ffffff10', fontWeight:700, fontSize:13, letterSpacing:'0.08em', color:'#94a3b8' }}>MA TRẬN PHÂN QUYỀN</div>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#ffffff04' }}>
              <th style={{ padding:'10px 20px', textAlign:'left', fontSize:12, color:'#64748b', fontWeight:600 }}>Chức năng</th>
              {[['admin','Admin','#c084fc'],['lead','Team Lead','#4ade80'],['dev','Developer','#60a5fa']].map(([k,l,c])=>(
                <th key={k} style={{ padding:'10px 20px', textAlign:'center', fontSize:12, color:c, fontWeight:700 }}>{l}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(PERMS).map(([fn, perms], i) => (
              <tr key={fn} style={{ borderTop:'1px solid #ffffff08', background:i%2===0?'transparent':'#ffffff03' }}>
                <td style={{ padding:'10px 20px', fontSize:12 }}>{fn}</td>
                {['admin','lead','dev'].map(r=>(
                  <td key={r} style={{ padding:'10px 20px', textAlign:'center' }}>
                    {perms[r] ? <span style={{ color:'#4ade80', fontSize:16 }}>✓</span> : <span style={{ color:'#ffffff20' }}>—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
