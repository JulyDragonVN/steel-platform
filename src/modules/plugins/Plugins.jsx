// src/modules/plugins/Plugins.jsx
import { Badge, Button, LoadingSpinner } from '../../components/ui';
import { useSheetsData } from '../../hooks/useSheetsData';
import { FALLBACK_PLUGINS } from '../../data/fallback';

const CAT_COLORS = {
  devops:       '#60a5fa',
  notification: '#4ade80',
  testing:      '#f59e0b',
  cad:          '#c084fc',
  data:         '#f472b6',
};

export function Plugins({ currentUser }) {
  const { data: plugins, loading, update } = useSheetsData('plugins', FALLBACK_PLUGINS);

  if (loading) return <LoadingSpinner />;

  if (currentUser.role === 'dev') {
    return (
      <div style={{ color: '#64748b', padding: '40px 0', textAlign: 'center' }}>
        Bạn không có quyền truy cập Kho Plugin.
      </div>
    );
  }

  async function togglePlugin(plugin) {
    const newStatus = plugin.status === 'connected' ? 'available' : 'connected';
    await update(plugin.id, { status: newStatus });
  }

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Kho Plugin</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
        {plugins.map((p) => (
          <div
            key={p.id}
            style={{
              background: '#ffffff06',
              border: `1px solid ${p.status === 'connected' ? '#4ade8033' : '#ffffff10'}`,
              borderRadius: 12, padding: 20,
            }}
          >
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 20,
                background: `${CAT_COLORS[p.category]}22`,
                border: `1px solid ${CAT_COLORS[p.category]}44`,
                color: CAT_COLORS[p.category],
              }}>
                {p.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                <Badge color={CAT_COLORS[p.category]}>{p.category}</Badge>
              </div>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', marginTop: 6,
                background: p.status === 'connected' ? '#4ade80' : '#64748b',
              }} />
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>{p.description}</div>
            <Button
              onClick={() => togglePlugin(p)}
              variant={p.status === 'connected' ? 'secondary' : 'primary'}
              style={{ width: '100%' }}
            >
              {p.status === 'connected' ? 'Ngắt kết nối' : 'Kết nối'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
