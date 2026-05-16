import React, { useMemo } from 'react';
import { PROJECTS, TASKS, QUALITY_ISSUES, ACTIVITY } from '../data/mockData';
import { PRIORITY_COLORS, STATUS_COLORS } from '../constants/theme';
import { Avatar, Badge, ProgressBar, getUserById } from './Common';

export default function Dashboard({ currentUser }) {
  const myTasks = useMemo(() => {
    return currentUser ? TASKS.filter(t => t.assignee === currentUser.id) : [];
  }, [currentUser]);

  const stats = useMemo(() => [
    { label: "Dự Án Đang Chạy", value: PROJECTS.filter(p => p.status === "active").length, icon: "◈", color: "var(--color-dev)" },
    { label: "Task Của Bạn", value: myTasks.length, icon: "◎", color: "var(--color-success)" },
    { label: "Lỗi Đang Mở", value: QUALITY_ISSUES.filter(i => i.status === "open").length, icon: "△", color: "var(--color-warning)" },
    { label: "Lỗi Tái Phát ⚠", value: QUALITY_ISSUES.filter(i => i.recurring && i.status === "open").length, icon: "⚠", color: "var(--color-danger)" },
  ], [myTasks]);

  const actionMap = {
    "upload file": "tải lên",
    "complete task": "hoàn thành",
    "report issue": "báo lỗi",
    "approve task": "duyệt",
    "create task": "tạo task"
  };

  const statusLabelMap = {
    inprogress: "Đang làm",
    review: "Đang duyệt",
    todo: "Chờ",
    done: "Xong"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {stats.map((s, i) => (
          <div key={i} className="steel-card" style={{ borderLeft: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color, fontFamily: "var(--font-mono)" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        <div className="steel-card">
          <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 13, letterSpacing: "0.08em", color: "#94a3b8" }}>TIẾN ĐỘ DỰ ÁN</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {PROJECTS.filter(p => p.status === "active").map(p => (
              <div key={p.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</span>
                  <span style={{ fontSize: 12, color: "var(--color-dev)", fontFamily: "var(--font-mono)" }}>{p.progress}%</span>
                </div>
                <ProgressBar value={p.progress} color={p.progress > 80 ? "var(--color-success)" : "var(--color-dev)"} height={6} />
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{p.phase}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="steel-card">
          <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 13, letterSpacing: "0.08em", color: "#94a3b8" }}>HOẠT ĐỘNG GẦN ĐÂY</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ACTIVITY.map(a => {
              const u = getUserById(a.user);
              return (
                <div key={a.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <Avatar user={u} size={28} />
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: `var(--color-${u.role})` }}>{u.name}</span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}> {actionMap[a.action] || a.action} </span>
                    <span style={{ fontSize: 12 }}>{a.target}</span>
                    <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="steel-card">
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 13, letterSpacing: "0.08em", color: "#94a3b8" }}>TASK CỦA TÔI</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {myTasks.length ? myTasks.map(t => (
            <div key={t.id} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
              background: "#ffffff04", borderRadius: 8, border: "1px solid #ffffff08",
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: PRIORITY_COLORS[t.priority], flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 13 }}>{t.title}</span>
              <Badge color={STATUS_COLORS[t.status]}>{statusLabelMap[t.status] || t.status}</Badge>
              <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{t.due}</span>
            </div>
          )) : (
            <div style={{ color: "#475569", fontSize: 13, padding: "12px 0" }}>
              {currentUser ? "Không có task nào được giao." : "Vui lòng đăng nhập để xem danh sách nhiệm vụ cá nhân."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}