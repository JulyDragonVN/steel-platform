import React from 'react';
import { USERS, MATRIX } from '../data/mockData';
import { ROLE_COLORS, ROLE_LABELS } from '../constants/theme';
import { Avatar, Badge } from './Common';

export default function Members({ currentUser }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <div style={{ fontSize: 20, fontWeight: 800 }}>Thành Viên Ban Thiết Kế</div>
        <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4 }}>Quản lý nhân sự kỹ thuật và ma trận phân quyền hệ thống (RBAC)</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        {USERS.map(u => (
          <div key={u.id} className="steel-card" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Avatar user={u} size={40} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{u.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Bộ phận: {u.dept}</div>
            </div>
            <Badge color={ROLE_COLORS[u.role]}>{ROLE_LABELS[u.role]}</Badge>
          </div>
        ))}
      </div>

      <div className="steel-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-color)", fontWeight: 700, fontSize: 13, color: "#94a3b8" }}>
          MA TRẬN QUYỀN TRUY CẬP (ROLE-BASED ACCESS CONTROL)
        </div>
        <table className="steel-table">
          <thead>
            <tr>
              <th>CHỨC NĂNG HỆ THỐNG</th>
              <th style={{ textAlign: "center" }}>ADMIN</th>
              <th style={{ textAlign: "center" }}>TEAM LEAD</th>
              <th style={{ textAlign: "center" }}>DEVELOPER / ENGINEER</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(MATRIX).map(([fn, perms]) => (
              <tr key={fn}>
                <td style={{ fontWeight: 500 }}>{fn}</td>
                <td style={{ textAlign: "center", fontSize: 16 }}>{perms.admin ? "🟢" : "❌"}</td>
                <td style={{ textAlign: "center", fontSize: 16 }}>{perms.lead ? "🟢" : "❌"}</td>
                <td style={{ textAlign: "center", fontSize: 16 }}>{perms.dev ? "🟢" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}