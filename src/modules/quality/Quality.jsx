import { useState } from 'react';
import { Avatar, Badge, Button, FilterBar } from '../../components/ui';
import { PRIORITY_COLORS } from '../../data/constants';
import { useData } from '../../hooks/useData';
import { FALLBACK_QUALITY_ISSUES, FALLBACK_PROJECTS, FALLBACK_USERS } from '../../data/fallback';

const FILTER_OPTIONS = [['all','Tất cả'],['open','Đang mở'],['resolved','Đã xử lý'],['pending','Chờ duyệt'],['recurring','⚠ Tái phát',true]];
const STATUS_COLOR   = { open:'#ef4444', resolved:'#4ade80', pending:'#f59e0b' };
const STATUS_LABEL   = { open:'Đang mở', resolved:'Đã xử lý', pending:'Chờ duyệt' };

export function Quality() {
  const [filter, setFilter] = useState('all');
  const { data: issues }   = useData('quality_issues', FALLBACK_QUALITY_ISSUES);
  const { data: projects } = useData('projects',       FALLBACK_PROJECTS);
  const { data: users }    = useData('users',          FALLBACK_USERS);

  const getUser    = id => users.find(u => String(u.id) === String(id));
  const getProject = id => projects.find(p => String(p.id) === String(id));
  const recurring  = issues.filter(i => i.recurring && i.status === 'open');

  const visible = filter === 'all' ? issues
    : filter === 'recurring' ? issues.filter(i=>i.recurring)
    : issues.filter(i=>i.status===filter);

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <div style={{ fontSize:20, fontWeight:800 }}>Chất Lượng</div>
        <Button variant="danger">+ Báo lỗi</Button>
      </div>
      {recurring.length > 0 && (
        <div style={{ background:'#7f1d1d44', border:'1px solid #ef444444', borderRadius:10, padding:'14px 18px', marginBottom:20 }}>
          <div style={{ fontWeight:700, color:'#fca5a5', marginBottom:4 }}>⚠ CẢNH BÁO: {recurring.length} lỗi tái phát</div>
          {recurring.map(i=><div key={i.id} style={{ fontSize:12, color:'#fca5a5' }}>• {i.title}</div>)}
        </div>
      )}
      <FilterBar options={FILTER_OPTIONS} active={filter} onChange={setFilter} />
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {visible.map(issue => {
          const reporter = getUser(issue.reporter_id);
          const project  = getProject(issue.project_id);
          return (
            <div key={issue.id} style={{ background:issue.recurring&&issue.status==='open'?'#7f1d1d22':'#ffffff06', border:`1px solid ${issue.recurring&&issue.status==='open'?'#ef444444':'#ffffff10'}`, borderRadius:10, padding:'14px 18px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <span style={{ fontSize:13, fontWeight:600 }}>{issue.title}</span>
                  {issue.recurring && <Badge color="#ef4444">Tái phát</Badge>}
                </div>
                <Badge color={STATUS_COLOR[issue.status]}>{STATUS_LABEL[issue.status]}</Badge>
              </div>
              <div style={{ display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
                {reporter && <div style={{ display:'flex', gap:6, alignItems:'center' }}><Avatar user={reporter} size={20} /><span style={{ fontSize:11, color:'#64748b' }}>{reporter.name}</span></div>}
                {project  && <span style={{ fontSize:11, color:'#60a5fa', fontFamily:'var(--font-mono)' }}>{project.code}</span>}
                <Badge color={PRIORITY_COLORS[issue.severity]}>{issue.severity}</Badge>
                {issue.tag && <Badge color="#8b5cf6">{issue.tag}</Badge>}
                <span style={{ fontSize:11, color:'#475569', marginLeft:'auto', fontFamily:'var(--font-mono)' }}>{issue.created_at}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
