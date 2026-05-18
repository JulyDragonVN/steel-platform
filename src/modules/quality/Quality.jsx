// src/modules/quality/Quality.jsx
import { useState } from 'react';
import { Avatar, Badge, Button, FilterBar, LoadingSpinner } from '../../components/ui';
import { PRIORITY_COLORS } from '../../data/constants';
import { useRealtimeData } from '../../hooks/useRealtimeData';
import { FALLBACK_QUALITY_ISSUES, FALLBACK_PROJECTS, FALLBACK_USERS } from '../../data/fallback';

const FILTER_OPTIONS = [
  ['all',       'Tất cả'],
  ['open',      'Đang mở'],
  ['resolved',  'Đã xử lý'],
  ['pending',   'Chờ duyệt'],
  ['recurring', '⚠ Tái phát', true],
];

const STATUS_COLOR = { open: '#ef4444', resolved: '#4ade80', pending: '#f59e0b' };
const STATUS_LABEL = { open: 'Đang mở', resolved: 'Đã xử lý', pending: 'Chờ duyệt' };
const TYPE_ICON    = { error: '⚡', improvement: '✦' };

export function Quality({ currentUser }) {
  const [filter, setFilter] = useState('all');

  const { data: issues,   loading: li } = useRealtimeData('quality_issues', FALLBACK_QUALITY_ISSUES);
  const { data: projects }              = useRealtimeData('projects',        FALLBACK_PROJECTS);
  const { data: users }                 = useRealtimeData('users',           FALLBACK_USERS);

  if (li) return <LoadingSpinner />;

  const getUserById    = (id) => users.find((u) => String(u.id) === String(id));
  const getProjectById = (id) => projects.find((p) => String(p.id) === String(id));

  const recurring = issues.filter((i) => i.recurring && i.status === 'open');

  const visible = filter === 'all'       ? issues
    : filter === 'recurring'             ? issues.filter((i) => i.recurring)
    : issues.filter((i) => i.status === filter);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 20, fontWeight: 800 }}>Chất Lượng</div>
        <Button variant="danger">+ Báo lỗi</Button>
      </div>

      {/* Recurring alert banner */}
      {recurring.length > 0 && (
        <div style={{
          background: '#7f1d1d44', border: '1px solid #ef444444',
          borderRadius: 10, padding: '14px 18px', marginBottom: 20,
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 20 }}>⚠</span>
          <div>
            <div style={{ fontWeight: 700, color: '#fca5a5', marginBottom: 4 }}>
              CẢNH BÁO: Lỗi Tái Phát ({recurring.length})
            </div>
            {recurring.map((i) => (
              <div key={i.id} style={{ fontSize: 12, color: '#fca5a5', marginBottom: 2 }}>
                • {i.title} — <span style={{ color: '#f87171' }}>xuất hiện lần 2+, cần kiểm tra quy trình</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <FilterBar options={FILTER_OPTIONS} active={filter} onChange={setFilter} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {visible.map((issue) => {
          const reporter = getUserById(issue.reporter_id);
          const project  = getProjectById(issue.project_id);
          const isRecurringOpen = issue.recurring && issue.status === 'open';

          return (
            <div
              key={issue.id}
              style={{
                background: isRecurringOpen ? '#7f1d1d22' : '#ffffff06',
                border: `1px solid ${isRecurringOpen ? '#ef444444' : '#ffffff10'}`,
                borderRadius: 10, padding: '14px 18px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span>{TYPE_ICON[issue.type]}</span>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{issue.title}</span>
                  {issue.recurring && <Badge color="#ef4444">Tái phát</Badge>}
                </div>
                <Badge color={STATUS_COLOR[issue.status]}>{STATUS_LABEL[issue.status]}</Badge>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                {reporter && (
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <Avatar user={reporter} size={20} />
                    <span style={{ fontSize: 11, color: '#64748b' }}>{reporter.name}</span>
                  </div>
                )}
                {project && (
                  <span style={{ fontSize: 11, color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
                    {project.code}
                  </span>
                )}
                <Badge color={PRIORITY_COLORS[issue.severity]}>{issue.severity}</Badge>
                <Badge color="#8b5cf6">{issue.tag}</Badge>
                <span style={{ fontSize: 11, color: '#475569', marginLeft: 'auto', fontFamily: 'var(--font-mono)' }}>
                  {issue.created_at?.substring?.(0, 10) || issue.created_at}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
