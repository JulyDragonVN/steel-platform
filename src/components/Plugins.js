import React from 'react';
import { PLUGINS } from '../data/mockData';
import { Badge } from './Common';

export default function Plugins() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 800 }}>Kho Plugin & Automation API</div>
        <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4 }}>Kết nối nền tảng với Tekla Open API, AutoCAD .NET API và tự động hóa kết cấu</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {PLUGINS.map(p => (
          <div key={p.id} className="steel-card" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{
              width: 40, height: 40, borderRadius: 8, background: p.status === "connected" ? "#22c55e15" : "#ffffff05",
              border: `1px solid ${p.status === "connected" ? "#22c55e30" : "#ffffff10"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, color: p.status === "connected" ? "var(--color-success)" : "var(--text-muted)", flexShrink: 0
            }}>{p.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</span>
                <Badge color={p.status === "connected" ? "var(--color-success)" : "var(--text-muted)"}>
                  {p.status === "connected" ? "Đã bật" : "Sẵn sàng"}
                </Badge>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.4 }}>{p.desc}</p>
              <div style={{ marginTop: 10, fontSize: 11, fontFamily: "var(--font-mono)", color: "#475569" }}>
                category: {p.category}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}