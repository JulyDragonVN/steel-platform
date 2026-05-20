// src/modules/documents/Documents.jsx
import { useState } from 'react';
import { Badge, Button, FilterBar, LoadingSpinner } from '../../components/ui';
import { useRealtimeData } from '../../hooks/useRealtimeData';

const CAT_OPTIONS = [
  ['all',      'Tất cả'],
  ['project',  'Dự án'],
  ['standard', 'Tiêu chuẩn'],
  ['template', 'Template'],
  ['guide',    'Hướng dẫn'],
];

const CAT_COLORS = {
  standard: '#4ade80',
  template: '#c084fc',
  guide:    '#f59e0b',
  project:  '#60a5fa',
};

const TYPE_ICON = { pdf: '📄', dwg: '📐', xlsx: '📊', doc: '📝' };
const CAT_LABEL = Object.fromEntries(CAT_OPTIONS);

export function Documents({ currentUser }) {
  const [filter, setFilter] = useState('all');

  const { data: docs,     loading: ld } = useRealtimeData('documents');
  const { data: projects }              = useRealtimeData('projects');

  if (ld) return <LoadingSpinner />;

  const getProjectById = (id) => projects.find((p) => String(p.id) === String(id));
  const visible = filter === 'all' ? docs : docs.filter((d) => d.category === filter);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 800 }}>Tài Liệu</div>
        <Button>+ Tải lên</Button>
      </div>

      <FilterBar options={CAT_OPTIONS} active={filter} onChange={setFilter} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {visible.map((d) => (
          <div
            key={d.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
              background: '#ffffff06', border: '1px solid #ffffff10', borderRadius: 10, cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#ffffff0a')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff06')}
          >
            <span style={{ fontSize: 20 }}>{TYPE_ICON[d.type] || '📄'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{d.name}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                Cập nhật: {d.updated_at} · {d.size}
                {d.project_id && (
                  <span style={{ marginLeft: 8, color: '#60a5fa' }}>
                    • {getProjectById(d.project_id)?.code}
                  </span>
                )}
              </div>
            </div>
            <Badge color="#60a5fa">{d.type?.toUpperCase()}</Badge>
            <Badge color={CAT_COLORS[d.category] || '#60a5fa'}>{CAT_LABEL[d.category]}</Badge>
            <Button variant="ghost" size="sm">⬇ Tải</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
