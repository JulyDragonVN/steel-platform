import React, { useState, useMemo } from 'react';
import { PROJECTS, TASKS } from '../data/mockData';
import { STATUS_COLORS, PRIORITY_COLORS, ROLE_COLORS, ROLE_LABELS } from '../constants/theme';
import { Avatar, Badge, ProgressBar, getUserById } from './Common';

export default function Projects({ currentUser }) {
  const [selected, setSelected] = useState(null);

  const visibleProjects = useMemo(() => {
    if (!currentUser) return [];
    return currentUser.role === "admin" ? PROJECTS : PROJECTS.filter(p => p.team.includes(currentUser.id));
  }, [currentUser]);

  const statusMap = {
    active: ["var(--color-success)", "Đang chạy"],
    completed: ["var(--color-dev)", "Hoàn thành"],
    planning: ["var(--color-warning)", "Lên kế hoạch"]
  };

  if (selected) {
    const proj = PROJECTS.find(p => p.id === selected);
    const tasks = TASKS.filter(t => t.project === proj.id);
    return (
      <div>
        <button onClick={() => setSelected(null)} style={{
          background: "none", border: "1px solid #ffffff20", borderRadius: 8,
          color: "#94a3b8", padding: "6px 14px", cursor: "pointer", fontSize: 12, marginBottom: 20,
          display: "flex", alignItems: "center", gap: 6,
        }}>← Quay lại</button>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, width: "100%" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{proj.name}</div>
            <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4, fontFamily: "var(--font-mono)" }}>{proj.code} · {proj.phase}</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Badge color={statusMap[proj.status][0]}>{statusMap[proj.status][1]}</Badge>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>⏱ {proj.deadline}</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          <div className="steel-card">
            <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 13, letterSpacing: "0.08em", color: "#94a3b8" }}>TASKS ({tasks.length})</div>
            {tasks.map(t => {
              const u = getUserById(t.assignee);
              return (
                <div key={t.id} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 0", borderBottom: "1px solid #ffffff08" }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: PRIORITY_COLORS[t.priority], flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 12 }}>{t.title}</span>
                  <Avatar user={u} size={24} />
                  <Badge color={STATUS_COLORS[t.status]}>{t.status}</Badge>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="steel-card">
              <div style={{ fontWeight: 700, marginBottom: 14, fontSize: 13, letterSpacing: "0.08em", color: "#94a3b8" }}>TEAM</div>
              {proj.team.map(uid => {
                const u = getUserById(uid);
                return (
                  <div key={uid} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                    <Avatar user={u} size={32} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{u.dept}</div>
                    </div>
                    <Badge color={ROLE_COLORS[u.role]}>{ROLE_LABELS[u.role]}</Badge>
                  </div>
                );
              })}
            </div>
            <div className="steel-card">
              <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 13, letterSpacing: "0.08em", color: "#94a3b8" }}>TIẾN ĐỘ</div>
              <ProgressBar value={proj.progress} color="var(--color-dev)" height={8} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>
                <span>{proj.done}/{proj.tasks} tasks</span>
                <span style={{ color: "var(--color-dev)", fontFamily: "var(--font-mono)", fontWeight: 700 }}>{proj.progress}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 800 }}>Dự Án</div>
        {currentUser?.role !== "dev" && (
          <button className="steel-btn-primary">+ Dự án mới</button>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
        {visibleProjects.map(p => {
          const lead = getUserById(p.lead);
          return (
            <div key={p.id} className="steel-card" onClick={() => setSelected(p.id)} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <Badge color={statusMap[p.status][0]}>{statusMap[p.status][1]}</Badge>
                <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{p.code}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14 }}>{p.phase}</div>
              <ProgressBar value={p.progress} color={p.progress === 100 ? "var(--color-success)" : "var(--color-dev)"} height={5} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, alignItems: "center" }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <Avatar user={lead} size={24} />
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{lead.name}</span>
                </div>
                <div style={{ display: "flex" }}>
                  {p.team.slice(0, 3).map((uid, i) => (
                    <div key={uid} style={{ marginLeft: i > 0 ? -8 : 0 }}>
                      <Avatar user={getUserById(uid)} size={24} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}