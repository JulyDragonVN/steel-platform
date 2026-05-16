import React, { useState } from 'react';
import { USER_PASSWORDS } from '../data/mockData';
import { ROLE_COLORS, ROLE_LABELS } from '../constants/theme';
import { Avatar } from './Common';

export default function LoginModal({ targetUser, onSuccess, onClose }) {
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  function handleLogin() {
    if (USER_PASSWORDS[targetUser.id] === pass) {
      setError("");
      onSuccess(targetUser);
    } else {
      setError("Mật khẩu không đúng. Vui lòng thử lại.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPass("");
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "#000000bb", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#0d1426", border: "1px solid var(--border-color)",
        borderRadius: 16, padding: "32px 28px", width: 340,
        boxShadow: "0 24px 64px #000000cc",
        animation: shake ? "shake 0.4s ease" : "slideUp 0.2s ease",
      }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Avatar user={targetUser} size={56} />
          <div style={{ fontWeight: 800, fontSize: 16, marginTop: 10 }}>{targetUser.name}</div>
          <div style={{ fontSize: 12, color: ROLE_COLORS[targetUser.role], fontFamily: "var(--font-mono)" }}>
            {ROLE_LABELS[targetUser.role]}
          </div>
        </div>
        <input
          autoFocus
          type="password"
          className="steel-input"
          value={pass}
          onChange={e => { setPass(e.target.value); setError(""); }}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          placeholder="Nhập mật khẩu..."
          style={{ textAlign: "center" }}
        />
        {error && <div style={{ color: "var(--color-danger)", fontSize: 11, marginTop: 8, textAlign: "center" }}>{error}</div>}
        <button onClick={handleLogin} className="steel-btn-primary" style={{ width: "100%", marginTop: 16, padding: "11px 0" }}>
          Đăng nhập
        </button>
      </div>
    </div>
  );
}