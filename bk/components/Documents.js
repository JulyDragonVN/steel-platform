import React, { useState, useMemo } from 'react';
import { DOCS, PROJECTS } from '../data/mockData';
import { Badge } from './Common';

export default function Documents({ currentUser }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");

  const filtered = useMemo(() => {
    return DOCS.filter(d => {
      const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = cat === "all" || d.category === cat;
      return matchSearch && matchCat;
    });
  }, [search, cat]);

  const catMap = { all: "Tất cả", standard: "Tiêu chuẩn", template: "Template", project: "Dự án", guide: "Hướng dẫn" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 800 }}>Hồ Sơ & Tài Liệu Kỹ Thuật</div>
        <button className="steel-btn-primary">↑ Tải tài liệu lên</button>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <input
          type="text"
          className="steel-input"
          placeholder="Tìm tên tài liệu, tiêu chuẩn..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 300 }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          {Object.entries(catMap).map(([k, v]) => (
            <button key={k} onClick={() => setCat(k)} style={{
              background: cat === k ? "#3b82f622" : "none",
              border: `1px solid ${cat === k ? "var(--color-primary)" : "#ffffff15"}`,
              color: cat === k ? "#fff" : "var(--text-muted)",
              padding: "0 12px", borderRadius: 8, fontSize: 12, cursor: "pointer"
            }}>{v}</button>
          ))}
        </div>
      </div>

      <div className="steel-card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="steel-table">
          <thead>
            <tr>
              <th>TÊN TÀI LIỆU</th>
              <th>DANH MỤC</th>
              <th>KÍCH THƯỚC</th>
              <th>CẬP NHẬT</th>
              <th>DỰ ÁN LIÊN QUAN</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => {
              const p = PROJECTS.find(proj => proj.id === d.project);
              return (
                <tr key={d.id}>
                  <td style={{ fontWeight: 600 }}>{d.type === "dwg" ? "📐" : d.type === "xlsx" ? "📊" : "📄"} {d.name}</td>
                  <td><Badge color="#94a3b8">{catMap[d.category]}</Badge></td>
                  <td style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{d.size}</td>
                  <td style={{ color: "var(--text-muted)" }}>{d.updated}</td>
                  <td>{p ? <span style={{ color: "var(--color-dev)" }}>{p.name}</span> : <span style={{ color: "#334155" }}>—</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}