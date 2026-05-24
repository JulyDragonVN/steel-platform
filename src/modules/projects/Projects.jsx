import { useState } from 'react';
import { Avatar, Badge, ProgressBar, Button, Card, SectionHeader } from '../../components/ui';
import { ROLE_COLORS, ROLE_LABELS, STATUS_COLORS, PRIORITY_COLORS } from '../../data/constants';
import { useData } from '../../hooks/useData';
import { FALLBACK_PROJECTS, FALLBACK_TASKS, FALLBACK_USERS } from '../../data/fallback';

const STATUS_MAP = { active:['#4ade80','Đang chạy'], completed:['#60a5fa','Hoàn thành'], planning:['#f59e0b','Lên kế hoạch'] };

export function Projects({ currentUser }) {
  const [selected, setSelected] = useState(null);
  const { data: projects } = useData('projects', FALLBACK_PROJECTS);
  const { data: tasks }    = useData('tasks',    FALLBACK_TASKS);
  const { data: users }    = useData('users',    FALLBACK_USERS);

  const getUser    = id => users.find(u => String(u.id) === String(id));
  const getProject = id => projects.find(p => String(p.id) === String(id));

  const visible = currentUser.role === 'admin' ? projects
    : projects.filter(p => (p.team||[]).includes(String(currentUser.id)) || String(p.lead_id) === String(currentUser.id));

  if (selected) {
    const proj = getProject(selected);
    if (!proj) return null;
    const projTasks = tasks.filter(t => String(t.project_id) === String(proj.id));
    const team = proj.team || [];
    return (
      <div>
        <Button variant="ghost" size="sm" onClick={()=>setSelected(null)} style={{marginBottom:20}}>← Quay lại</Button>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
          <div>
            <div style={{ fontSize:22, fontWeight:800 }}>{proj.name}</div>
            <div style={{ color:'#64748b', fontSize:13, marginTop:4, fontFamily:'var(--font-mono)' }}>{proj.code} · {proj.phase}</div>
          </div>
          <Badge color={STATUS_MAP[proj.status]?.[0]}>{STATUS_MAP[proj.status]?.[1]}</Badge>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
          <Card>
            <SectionHeader>TASKS ({projTasks.length})</SectionHeader>
            {projTasks.map(t => {
              const u = getUser(t.assignee_id);
              return (
                <div key={t.id} style={{ display:'flex', gap:10, alignItems:'center', padding:'10px 0', borderBottom:'1px solid #ffffff08' }}>
                  <div style={{ width:8, height:8, borderRadius:2, background:PRIORITY_COLORS[t.priority], flexShrink:0 }} />
                  <span style={{ flex:1, fontSize:12 }}>{t.title}</span>
                  {u && <Avatar user={u} size={22} />}
                  <Badge color={STATUS_COLORS[t.status]}>{t.status}</Badge>
                </div>
              );
            })}
          </Card>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <Card>
              <SectionHeader>TEAM</SectionHeader>
              {team.map(uid => {
                const u = getUser(uid);
                if (!u) return null;
                return (
                  <div key={uid} style={{ display:'flex', gap:10, alignItems:'center', marginBottom:10 }}>
                    <Avatar user={u} size={32} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600 }}>{u.name}</div>
                      <div style={{ fontSize:11, color:'#64748b' }}>{u.dept}</div>
                    </div>
                    <Badge color={ROLE_COLORS[u.role]}>{ROLE_LABELS[u.role]}</Badge>
                  </div>
                );
              })}
            </Card>
            <Card>
              <SectionHeader>TIẾN ĐỘ</SectionHeader>
              <ProgressBar value={proj.progress} color="#60a5fa" height={8} />
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, fontSize:12, color:'#64748b' }}>
                <span>{proj.done}/{proj.tasks} tasks</span>
                <span style={{ color:'#60a5fa', fontFamily:'var(--font-mono)', fontWeight:700 }}>{proj.progress}%</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div style={{ fontSize:20, fontWeight:800 }}>Dự Án</div>
        {currentUser.role !== 'dev' && <Button>+ Dự án mới</Button>}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }}>
        {visible.map(p => {
          const lead = getUser(p.lead_id);
          return (
            <Card key={p.id} onClick={()=>setSelected(p.id)}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                <Badge color={STATUS_MAP[p.status]?.[0]}>{STATUS_MAP[p.status]?.[1]}</Badge>
                <span style={{ fontSize:11, color:'#64748b', fontFamily:'var(--font-mono)' }}>{p.code}</span>
              </div>
              <div style={{ fontSize:15, fontWeight:700, marginBottom:4 }}>{p.name}</div>
              <div style={{ fontSize:12, color:'#64748b', marginBottom:14 }}>{p.phase}</div>
              <ProgressBar value={p.progress} color={p.progress===100?'#4ade80':'#60a5fa'} height={5} />
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:12, alignItems:'center' }}>
                {lead && <div style={{ display:'flex', alignItems:'center', gap:6 }}><Avatar user={lead} size={24} /><span style={{ fontSize:11, color:'#64748b' }}>{lead.name}</span></div>}
                <span style={{ fontSize:11, color:'#475569' }}>⏱ {p.deadline}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
