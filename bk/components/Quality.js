import React, { useState, useMemo } from 'react';
import { QUALITY_ISSUES, PROJECTS } from '../data/mockData';
import { PRIORITY_COLORS, STATUS_COLORS } from '../constants/theme';
import { Badge, getUserById } from './Common';

export default function Quality({ currentUser }) {
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "all") return QUALITY_ISSUES;
    if (filter === "open") return QUALITY_ISSUES.filter(i => i.status === "open");
    if (filter === "recurring") return QUALITY_ISSUES.filter(i => i.recurring && i.status === "open");
    return QUALITY_ISSUES;
  }, [filter]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Quản Lý Chất Lượng Thiết Kế</div>
          <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4 }}>Hệ thống tracking lỗi hình học bản vẽ và sai sót kết cấu</div>
        </div>
        <button className="steel-btn-primary" style={{ background: "var(--color-danger)" }}>+ Báo cáo lỗi mới (NCR)</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["all", "open", "recurring"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            background: filter === f ? "#ffffff10" : "none",
            border: `1px solid ${filter === f ? "#ffffff30" : "#ffffff10"}`,
            color: filter === f ? "#fff" : "var(--text-muted)",
            padding: "6px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer"
          }}>
            {f === "all" ? "Tất cả" : f === "open" ? "Đang mở" : "Lỗi Tái Phát ⚠"}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(i => {
          const p = PROJECTS.find(proj => proj.id === i.project);
          const reporter = getUserById(i.reporter);
          return (
            <div key={i.id} className="steel-card" style={{
              borderLeft: `4px solid ${PRIORITY_COLORS[i.severity]}`,
              background: i.recurring && i.status === "open" ? "linear-gradient(90deg, #ef44440a, transparent)" : "var(--bg-card)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{i.title}</span>
                  {i.recurring && i.status === "open" && <Badge color="var(--color-danger)" bg="#ef444422">LỖI TÁI PHÁT ⚠</Badge>}
                </div>
                <Badge color={STATUS_COLORS[i.status]}>{i.status === "open" ? "Đang xử lý" : i.status === "resolved" ? "Đã sửa" : "Chờ duyệt"}</Badge>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--text-muted)" }}>
                <div style={{ display: "flex", gap: 16 }}>
                  <span>Dự án: <strong style={{ color: "#e2e8f0" }}>{p?.name}</strong></span>
                  <span>Phân loại: <code style={{ color: "var(--color-dev)" }}>#{i.tag}</code></span>
                  <span>Người phát hiện: <strong style={{ color: "#e2e8f0" }}>{reporter?.name}</strong></span>
                </div>
                <div style={{ fontFamily: "var(--font-mono)" }}>{i.date}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}