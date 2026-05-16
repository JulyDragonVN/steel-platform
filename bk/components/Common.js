import React from 'react';
import { USERS } from '../data/mockData';
import { ROLE_COLORS } from '../constants/theme';

export function getUserById(id) {
  return USERS.find(u => u.id === id);
}

export function getProjectById(id, projects) {
  return projects.find(p => p.id === id);
}

export function Avatar({ user, size = 32 }) {
  const u = typeof user === "number" ? getUserById(user) : user;
  if (!u) return null;
  const roleColor = ROLE_COLORS[u.role] || "var(--color-dev)";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${roleColor}44, ${roleColor}88)`,
      border: `1.5px solid ${roleColor}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 700, color: roleColor,
      flexShrink: 0, position: "relative", fontFamily: "var(--font-mono)",
    }}>
      {u.avatar}
      {u.online && (
        <span style={{
          position: "absolute", bottom: 1, right: 1, width: 8, height: 8,
          borderRadius: "50%", background: "var(--color-success)", border: "1.5px solid #070d1c"
        }} />
      )}
    </div>
  );
}

export function Badge({ children, color = "var(--color-dev)", bg }) {
  return (
    <span style={{
      padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600,
      color, background: bg || `${color}22`, border: `1px solid ${color}44`,
      fontFamily: "var(--font-mono)", letterSpacing: "0.04em",
    }}>{children}</span>
  );
}

export function ProgressBar({ value, color = "var(--color-dev)", height = 4 }) {
  return (
    <div style={{ background: "#ffffff10", borderRadius: height, height, overflow: "hidden", width: "100%" }}>
      <div style={{
        width: `${value}%`, height: "100%", borderRadius: height,
        background: `linear-gradient(90deg, ${color}88, ${color})`,
        transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
      }} />
    </div>
  );
}