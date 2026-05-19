// src/modules/dashboard/Dashboard.jsx
import { Avatar, ProgressBar, Badge, SectionHeader, Card } from '../../components/ui';
import { ROLE_COLORS, STATUS_COLORS, PRIORITY_COLORS } from '../../data/constants';
import { useRealtimeData } from '../../hooks/useRealtimeData';
import {
  FALLBACK_PROJECTS, FALLBACK_TASKS,
  FALLBACK_QUALITY_ISSUES, FALLBACK_ACTIVITY, FALLBACK_USERS,
} from '../../data/fallback';

export function Dashboard({ currentUser }) {
  const { data: projects      } = useRealtimeData('projects',      FALLBACK_PROJECTS);
  const { data: tasks         } = useRealtimeData('tasks',         FALLBACK_TASKS);
  const { data: qualityIssues } = useRealtimeData('quality_issues',FALLBACK_QUALITY_ISSUES);
  const { data: activity      } = useRealtimeData('activity',      FALLBACK_ACTIVITY);
  const { data: users         } = useRealtimeData('users',         FALLBACK_USERS);

  // KHÔNG chờ loading — dùng fallback data ngay, cập nhật khi có data thật
  const getUserById     = (id) => users.find((u) => String(u.id) === String(id));
  const myTasks         = tasks.filter((t) => String(t.assignee_id) === String(currentUser.id));
  const openIssues      = qualityIssues.filter((i) => i.status === 'open').length;
  const recurringIssues = qualityIssues.filter((i) => i.recurring && i.status === 'open').length;

  const stats = [
    { label: 'Dự Án Đang Chạy', value: projects.filter((p) => p.status === 'active').length, icon: '◈', color: '#60a5fa' },
    { label: 'Task Hôm Nay',    value: myTasks.length,                                        icon: '◎', color: '#4ade80' },
    { label: 'Lỗi Đang Mở',    value: openIssues,                                            icon: '△', color: '#f59e0b' },
    { label: 'Lỗi Tái Phát ⚠', value: recurringIssues,                                       icon: '⚠', color: '#ef4444' },
  ];

  const actionMap = {
    'upload file':   'tải lên',
    'complete task': 'hoàn thành',
    'report issue':  'báo lỗi',
    'approve task':  'duyệt',
    'create task':   'tạo task',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: '#ffffff06', border: '1px solid #ffffff10',
            borderRadius: 12, padding: '20px 24px', borderLeft: `3px solid ${s.color}`,
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Project progress */}
        <Card>
          <SectionHeader>TIẾN ĐỘ DỰ ÁN</SectionHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {projects.filter((p) => p.status === 'active').map((p) => (
              <div key={p.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</span>
                  <span style={{ fontSize: 12, color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>{p.progress}%</span>
                </div>
                <ProgressBar value={p.progress} color={p.progress > 80 ? '#4ade80' : '#60a5fa'} height={6} />
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{p.phase}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Activity */}
        <Card>
          <SectionHeader>HOẠT ĐỘNG GẦN ĐÂY</SectionHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activity.map((a) => {
              const u = getUserById(a.user_id);
              if (!u) return null;
              return (
                <div key={a.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Avatar user={u} size={28} />
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: ROLE_COLORS[u.role] }}>{u.name}</span>
                    <span style={{ fontSize: 12, color: '#64748b' }}> {actionMap[a.action] || a.action} </span>
                    <span style={{ fontSize: 12 }}>{a.target}</span>
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{a.created_at}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* My Tasks */}
      <Card>
        <SectionHeader>TASK CỦA TÔI</SectionHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {myTasks.length ? myTasks.map((t) => (
            <div key={t.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
              background: '#ffffff04', borderRadius: 8, border: '1px solid #ffffff08',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: PRIORITY_COLORS[t.priority], flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 13 }}>{t.title}</span>
              <Badge color={STATUS_COLORS[t.status]}>
                {t.status === 'inprogress' ? 'Đang làm' : t.status === 'review' ? 'Đang duyệt' : 'Chờ'}
              </Badge>
              <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono)' }}>{t.due}</span>
            </div>
          )) : (
            <div style={{ color: '#475569', fontSize: 13, padding: '12px 0' }}>Không có task nào được giao.</div>
          )}
        </div>
      </Card>
    </div>
  );
}
