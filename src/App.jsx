import { useState } from "react";

// ── DATA ─────────────────────────────────────────────────────────────────────
const USERS = [
  { id: 1, name: "Nguyễn Văn Hưng", role: "admin", avatar: "NH", dept: "Management", online: true },
  { id: 2, name: "Trần Minh Khoa", role: "lead", avatar: "MK", dept: "Structure", online: true },
  { id: 3, name: "Lê Thị Hoa", role: "lead", avatar: "TH", dept: "Connection", online: false },
  { id: 4, name: "Phạm Đức Long", role: "dev", avatar: "DL", dept: "Structure", online: true },
  { id: 5, name: "Vũ Thanh Mai", role: "dev", avatar: "TM", dept: "Detailing", online: true },
  { id: 6, name: "Hoàng Văn Tú", role: "dev", avatar: "VT", dept: "BIM", online: false },
];

const PROJECTS = [
  { id: 1, name: "Nhà Máy Thép Bình Dương", code: "BD-2024-01", status: "active", progress: 68, lead: 2, team: [2,4,5], deadline: "2024-08-15", phase: "Thiết kế chi tiết", tasks: 24, done: 16 },
  { id: 2, name: "Cầu Thép Long An", code: "LA-2024-02", status: "active", progress: 42, lead: 3, team: [3,6], deadline: "2024-10-30", phase: "Tính toán kết cấu", tasks: 18, done: 8 },
  { id: 3, name: "Kho Lạnh Đà Nẵng", code: "DN-2023-05", status: "completed", progress: 100, lead: 2, team: [2,4], deadline: "2024-03-20", phase: "Hoàn thành", tasks: 30, done: 30 },
  { id: 4, name: "Tháp Truyền Tải HN", code: "HN-2024-03", status: "planning", progress: 12, lead: 3, team: [3,5,6], deadline: "2025-02-28", phase: "Lập hồ sơ", tasks: 10, done: 1 },
];

const TASKS = [
  { id: 1, project: 1, title: "Tính toán momen uốn dầm B3", assignee: 4, priority: "high", status: "inprogress", due: "2024-07-10", type: "calculation" },
  { id: 2, project: 1, title: "Bản vẽ chi tiết liên kết cột-dầm", assignee: 5, priority: "high", status: "review", due: "2024-07-12", type: "drawing" },
  { id: 3, project: 1, title: "Kiểm tra biến dạng mái", assignee: 4, priority: "medium", status: "todo", due: "2024-07-20", type: "check" },
  { id: 4, project: 2, title: "Mô hình FEM dầm chính", assignee: 6, priority: "high", status: "inprogress", due: "2024-07-15", type: "modeling" },
  { id: 5, project: 2, title: "Báo cáo tải trọng gió", assignee: 3, priority: "medium", status: "todo", due: "2024-07-25", type: "report" },
];

const DOCS = [
  { id: 1, name: "TCVN 5575:2012 - Kết Cấu Thép", category: "standard", size: "4.2 MB", updated: "2024-01-15", project: null, type: "pdf" },
  { id: 2, name: "Template Bản Vẽ Chi Tiết v3.2", category: "template", size: "1.8 MB", updated: "2024-05-20", project: null, type: "dwg" },
  { id: 3, name: "Tính toán kết cấu BD-2024-01", category: "project", size: "2.1 MB", updated: "2024-06-28", project: 1, type: "xlsx" },
  { id: 4, name: "Hướng dẫn BIM Workflow", category: "guide", size: "3.5 MB", updated: "2024-04-10", project: null, type: "pdf" },
  { id: 5, name: "Bản vẽ cầu LA-2024-02 Rev.3", category: "project", size: "12.4 MB", updated: "2024-07-01", project: 2, type: "dwg" },
];

const QUALITY_ISSUES = [
  { id: 1, project: 1, title: "Sai chiều dày bản mã liên kết cột C12", type: "error", severity: "high", status: "open", reporter: 5, date: "2024-07-02", tag: "connection", recurring: true },
  { id: 2, project: 1, title: "Thiếu gia cố tại lỗ khoét trên dầm", type: "error", severity: "critical", status: "resolved", reporter: 4, date: "2024-06-25", tag: "beam", recurring: false },
  { id: 3, project: 2, title: "Đề xuất dùng HEA thay HEB để tối ưu TL", type: "improvement", severity: "low", status: "pending", reporter: 6, date: "2024-07-01", tag: "optimization", recurring: false },
  { id: 4, project: 1, title: "Sai chiều dày bản mã (tái phát)", type: "error", severity: "high", status: "open", reporter: 4, date: "2024-07-05", tag: "connection", recurring: true },
];

const PLUGINS = [
  { id: 1, name: "GitHub Sync", desc: "Tự động đồng bộ file thiết kế với GitHub repository", icon: "⬡", status: "connected", category: "devops" },
  { id: 2, name: "Telegram Bot", desc: "Thông báo task, deadline, lỗi qua Telegram channel", icon: "✈", status: "connected", category: "notification" },
  { id: 3, name: "API Tester", desc: "Kiểm thử API kết nối với phần mềm tính toán bên ngoài", icon: "⚡", status: "available", category: "testing" },
  { id: 4, name: "Docker Logs", desc: "Theo dõi log container tính toán FEM tự động", icon: "◈", status: "available", category: "devops" },
  { id: 5, name: "AutoCAD Bridge", desc: "Xuất bản vẽ trực tiếp sang AutoCAD/Revit", icon: "◉", status: "available", category: "cad" },
  { id: 6, name: "Excel Calc", desc: "Nhập/xuất bảng tính kết cấu từ Excel tự động", icon: "▦", status: "connected", category: "data" },
];

const ACTIVITY = [
  { id: 1, user: 5, action: "upload file", target: "Bản vẽ chi tiết liên kết Rev.4", time: "2 phút trước", project: 1 },
  { id: 2, user: 4, action: "complete task", target: "Tính toán tải trọng tầng 2", time: "18 phút trước", project: 1 },
  { id: 3, user: 6, action: "report issue", target: "Mô hình FEM sai tải trọng gió", time: "1 giờ trước", project: 2 },
  { id: 4, user: 2, action: "approve task", target: "Bản vẽ liên kết cột-dầm", time: "2 giờ trước", project: 1 },
  { id: 5, user: 3, action: "create task", target: "Báo cáo tải trọng gió LA-2024", time: "3 giờ trước", project: 2 },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
const ROLE_COLORS = { admin: "#c084fc", lead: "#4ade80", dev: "#60a5fa" };
const ROLE_LABELS = { admin: "Admin", lead: "Team Lead", dev: "Developer" };
const STATUS_COLORS = { todo: "#64748b", inprogress: "#f59e0b", review: "#8b5cf6", done: "#22c55e" };
const PRIORITY_COLORS = { low: "#22c55e", medium: "#f59e0b", high: "#ef4444", critical: "#dc2626" };


function getUserById(id) { return USERS.find(u => u.id === id); }
function getProjectById(id) { return PROJECTS.find(p => p.id === id); }

function Avatar({ user, size = 32 }) {
  const u = typeof user === "number" ? getUserById(user) : user;
  if (!u) return null;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${ROLE_COLORS[u.role]}44, ${ROLE_COLORS[u.role]}88)`,
      border: `1.5px solid ${ROLE_COLORS[u.role]}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 700, color: ROLE_COLORS[u.role],
      flexShrink: 0, position: "relative", fontFamily: "var(--font-mono)",
    }}>
      {u.avatar}
      {u.online && <span style={{ position:"absolute", bottom:1, right:1, width:8, height:8, borderRadius:"50%", background:"#22c55e", border:"1.5px solid #0a0f1e" }} />}
    </div>
  );
}

function Badge({ children, color = "#60a5fa", bg }) {
  return (
    <span style={{
      padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600,
      color, background: bg || `${color}22`, border: `1px solid ${color}44`,
      fontFamily: "var(--font-mono)", letterSpacing: "0.04em",
    }}>{children}</span>
  );
}

function ProgressBar({ value, color = "#60a5fa", height = 4 }) {
  return (
    <div style={{ background: "#ffffff10", borderRadius: height, height, overflow: "hidden" }}>
      <div style={{
        width: `${value}%`, height: "100%", borderRadius: height,
        background: `linear-gradient(90deg, ${color}88, ${color})`,
        transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
      }} />
    </div>
  );
}

// ── MODULES ───────────────────────────────────────────────────────────────────
function Dashboard({ currentUser }) {
  const myTasks = TASKS.filter(t => t.assignee === currentUser.id);
  const openIssues = QUALITY_ISSUES.filter(i => i.status === "open").length;
  const recurringIssues = QUALITY_ISSUES.filter(i => i.recurring && i.status === "open").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {[
          { label: "Dự Án Đang Chạy", value: PROJECTS.filter(p=>p.status==="active").length, icon: "◈", color: "#60a5fa" },
          { label: "Task Hôm Nay", value: myTasks.length, icon: "◎", color: "#4ade80" },
          { label: "Lỗi Đang Mở", value: openIssues, icon: "△", color: "#f59e0b" },
          { label: "Lỗi Tái Phát ⚠", value: recurringIssues, icon: "⚠", color: "#ef4444" },
        ].map((s, i) => (
          <div key={i} style={{
            background: "#ffffff06", border: "1px solid #ffffff10",
            borderRadius: 12, padding: "20px 24px",
            borderLeft: `3px solid ${s.color}`,
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color, fontFamily: "var(--font-mono)" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Projects */}
        <div style={{ background: "#ffffff06", border: "1px solid #ffffff10", borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 13, letterSpacing: "0.08em", color: "#94a3b8" }}>TIẾN ĐỘ DỰ ÁN</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {PROJECTS.filter(p => p.status === "active").map(p => (
              <div key={p.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</span>
                  <span style={{ fontSize: 12, color: "#60a5fa", fontFamily: "var(--font-mono)" }}>{p.progress}%</span>
                </div>
                <ProgressBar value={p.progress} color={p.progress > 80 ? "#4ade80" : "#60a5fa"} height={6} />
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{p.phase}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ background: "#ffffff06", border: "1px solid #ffffff10", borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 13, letterSpacing: "0.08em", color: "#94a3b8" }}>HOẠT ĐỘNG GẦN ĐÂY</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ACTIVITY.map(a => {
              const u = getUserById(a.user);
              const actionMap = { "upload file": "tải lên", "complete task": "hoàn thành", "report issue": "báo lỗi", "approve task": "duyệt", "create task": "tạo task" };
              return (
                <div key={a.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <Avatar user={u} size={28} />
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: ROLE_COLORS[u.role] }}>{u.name}</span>
                    <span style={{ fontSize: 12, color: "#64748b" }}> {actionMap[a.action]} </span>
                    <span style={{ fontSize: 12 }}>{a.target}</span>
                    <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{a.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* My Tasks */}
      <div style={{ background: "#ffffff06", border: "1px solid #ffffff10", borderRadius: 12, padding: 20 }}>
        <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 13, letterSpacing: "0.08em", color: "#94a3b8" }}>TASK CỦA TÔI</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {myTasks.length ? myTasks.map(t => (
            <div key={t.id} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
              background: "#ffffff04", borderRadius: 8, border: "1px solid #ffffff08",
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: PRIORITY_COLORS[t.priority], flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 13 }}>{t.title}</span>
              <Badge color={STATUS_COLORS[t.status]}>{t.status === "inprogress" ? "Đang làm" : t.status === "review" ? "Đang duyệt" : "Chờ"}</Badge>
              <span style={{ fontSize: 11, color: "#64748b", fontFamily: "var(--font-mono)" }}>{t.due}</span>
            </div>
          )) : (
            <div style={{ color: "#475569", fontSize: 13, padding: "12px 0" }}>Không có task nào được giao.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Projects({ currentUser }) {
  const [selected, setSelected] = useState(null);
  const visible = currentUser.role === "admin" ? PROJECTS : PROJECTS.filter(p => p.team.includes(currentUser.id));

  const statusMap = { active: ["#4ade80", "Đang chạy"], completed: ["#60a5fa", "Hoàn thành"], planning: ["#f59e0b", "Lên kế hoạch"] };

  if (selected) {
    const proj = getProjectById(selected);
    const tasks = TASKS.filter(t => t.project === proj.id);
    return (
      <div>
        <button onClick={() => setSelected(null)} style={{
          background: "none", border: "1px solid #ffffff20", borderRadius: 8,
          color: "#94a3b8", padding: "6px 14px", cursor: "pointer", fontSize: 12, marginBottom: 20,
          display: "flex", alignItems: "center", gap: 6,
        }}>← Quay lại</button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{proj.name}</div>
            <div style={{ color: "#64748b", fontSize: 13, marginTop: 4, fontFamily: "var(--font-mono)" }}>{proj.code} · {proj.phase}</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Badge color={statusMap[proj.status][0]}>{statusMap[proj.status][1]}</Badge>
            <span style={{ fontSize: 12, color: "#64748b" }}>⏱ {proj.deadline}</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Tasks */}
          <div style={{ background: "#ffffff06", border: "1px solid #ffffff10", borderRadius: 12, padding: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 13, letterSpacing: "0.08em", color: "#94a3b8" }}>TASKS ({tasks.length})</div>
            {tasks.map(t => {
              const u = getUserById(t.assignee);
              return (
                <div key={t.id} style={{
                  display: "flex", gap: 10, alignItems: "center", padding: "10px 0",
                  borderBottom: "1px solid #ffffff08",
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: PRIORITY_COLORS[t.priority], flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 12 }}>{t.title}</span>
                  <Avatar user={u} size={24} />
                  <Badge color={STATUS_COLORS[t.status]}>{t.status}</Badge>
                </div>
              );
            })}
          </div>

          {/* Team */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "#ffffff06", border: "1px solid #ffffff10", borderRadius: 12, padding: 20 }}>
              <div style={{ fontWeight: 700, marginBottom: 14, fontSize: 13, letterSpacing: "0.08em", color: "#94a3b8" }}>TEAM</div>
              {proj.team.map(uid => {
                const u = getUserById(uid);
                return (
                  <div key={uid} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                    <Avatar user={u} size={32} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{u.dept}</div>
                    </div>
                    <Badge color={ROLE_COLORS[u.role]}>{ROLE_LABELS[u.role]}</Badge>
                  </div>
                );
              })}
            </div>
            <div style={{ background: "#ffffff06", border: "1px solid #ffffff10", borderRadius: 12, padding: 20 }}>
              <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 13, letterSpacing: "0.08em", color: "#94a3b8" }}>TIẾN ĐỘ</div>
              <ProgressBar value={proj.progress} color="#60a5fa" height={8} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "#64748b" }}>
                <span>{proj.done}/{proj.tasks} tasks</span>
                <span style={{ color: "#60a5fa", fontFamily: "var(--font-mono)", fontWeight: 700 }}>{proj.progress}%</span>
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
        {currentUser.role !== "dev" && (
          <button style={{ background: "#3b82f6", border: "none", borderRadius: 8, color: "#fff", padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>+ Dự án mới</button>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
        {visible.map(p => {
          const lead = getUserById(p.lead);
          return (
            <div key={p.id} onClick={() => setSelected(p.id)} style={{
              background: "#ffffff06", border: "1px solid #ffffff10", borderRadius: 12,
              padding: 20, cursor: "pointer", transition: "all 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#3b82f644"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#ffffff10"}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <Badge color={statusMap[p.status][0]}>{statusMap[p.status][1]}</Badge>
                <span style={{ fontSize: 11, color: "#64748b", fontFamily: "var(--font-mono)" }}>{p.code}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 14 }}>{p.phase}</div>
              <ProgressBar value={p.progress} color={p.progress === 100 ? "#4ade80" : "#60a5fa"} height={5} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, alignItems: "center" }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <Avatar user={lead} size={24} />
                  <span style={{ fontSize: 11, color: "#64748b" }}>{lead.name}</span>
                </div>
                <div style={{ display: "flex" }}>
                  {p.team.slice(0,3).map((uid,i) => (
                    <div key={uid} style={{ marginLeft: i > 0 ? -8 : 0 }}>
                      <Avatar user={getUserById(uid)} size={24} />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 11, color: "#475569" }}>
                <span>{p.done}/{p.tasks} tasks</span>
                <span>⏱ {p.deadline}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Documents({ currentUser }) {
  const [filter, setFilter] = useState("all");
  const cats = ["all", "project", "standard", "template", "guide"];
  const catLabel = { all: "Tất cả", project: "Dự án", standard: "Tiêu chuẩn", template: "Template", guide: "Hướng dẫn" };
  const typeIcon = { pdf: "📄", dwg: "📐", xlsx: "📊", doc: "📝" };
  const visible = filter === "all" ? DOCS : DOCS.filter(d => d.category === filter);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 800 }}>Tài Liệu</div>
        <button style={{ background: "#3b82f6", border: "none", borderRadius: 8, color: "#fff", padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>+ Tải lên</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding: "6px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer", fontWeight: 600,
            background: filter === c ? "#3b82f6" : "#ffffff08",
            border: filter === c ? "none" : "1px solid #ffffff10",
            color: filter === c ? "#fff" : "#94a3b8",
          }}>{catLabel[c]}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {visible.map(d => (
          <div key={d.id} style={{
            display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
            background: "#ffffff06", border: "1px solid #ffffff10", borderRadius: 10,
            cursor: "pointer",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#ffffff0a"}
            onMouseLeave={e => e.currentTarget.style.background = "#ffffff06"}
          >
            <span style={{ fontSize: 20 }}>{typeIcon[d.type] || "📄"}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{d.name}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                Cập nhật: {d.updated} · {d.size}
                {d.project && <span style={{ marginLeft: 8, color: "#60a5fa" }}>• {getProjectById(d.project)?.code}</span>}
              </div>
            </div>
            <Badge color="#60a5fa">{d.type.toUpperCase()}</Badge>
            <Badge color={
              d.category === "standard" ? "#4ade80" :
              d.category === "template" ? "#c084fc" :
              d.category === "guide" ? "#f59e0b" : "#60a5fa"
            }>{catLabel[d.category]}</Badge>
            <button style={{ background: "none", border: "1px solid #ffffff20", borderRadius: 6, color: "#94a3b8", padding: "4px 10px", cursor: "pointer", fontSize: 11 }}>⬇ Tải</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Quality({ currentUser }) {
  const [filter, setFilter] = useState("all");
  const visible = filter === "all" ? QUALITY_ISSUES :
    filter === "recurring" ? QUALITY_ISSUES.filter(i => i.recurring) :
    QUALITY_ISSUES.filter(i => i.status === filter);

  const recurring = QUALITY_ISSUES.filter(i => i.recurring && i.status === "open");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 20, fontWeight: 800 }}>Chất Lượng</div>
        <button style={{ background: "#ef4444", border: "none", borderRadius: 8, color: "#fff", padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>+ Báo lỗi</button>
      </div>

      {recurring.length > 0 && (
        <div style={{
          background: "#7f1d1d44", border: "1px solid #ef444444",
          borderRadius: 10, padding: "14px 18px", marginBottom: 20,
          display: "flex", gap: 12, alignItems: "flex-start",
        }}>
          <span style={{ fontSize: 20 }}>⚠</span>
          <div>
            <div style={{ fontWeight: 700, color: "#fca5a5", marginBottom: 4 }}>CẢNH BÁO: Lỗi Tái Phát ({recurring.length})</div>
            {recurring.map(i => (
              <div key={i.id} style={{ fontSize: 12, color: "#fca5a5", marginBottom: 2 }}>
                • {i.title} — <span style={{ color: "#f87171" }}>xuất hiện lần 2+, cần kiểm tra quy trình</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[
          ["all", "Tất cả"], ["open", "Đang mở"], ["resolved", "Đã xử lý"],
          ["pending", "Chờ duyệt"], ["recurring", "⚠ Tái phát"],
        ].map(([k, v]) => (
          <button key={k} onClick={() => setFilter(k)} style={{
            padding: "6px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer", fontWeight: 600,
            background: filter === k ? (k === "recurring" ? "#ef4444" : "#3b82f6") : "#ffffff08",
            border: filter === k ? "none" : "1px solid #ffffff10",
            color: filter === k ? "#fff" : "#94a3b8",
          }}>{v}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {visible.map(issue => {
          const reporter = getUserById(issue.reporter);
          const project = getProjectById(issue.project);
          const statusColor = { open: "#ef4444", resolved: "#4ade80", pending: "#f59e0b" };
          const typeIcon = { error: "⚡", improvement: "✦" };
          return (
            <div key={issue.id} style={{
              background: issue.recurring && issue.status === "open" ? "#7f1d1d22" : "#ffffff06",
              border: `1px solid ${issue.recurring && issue.status === "open" ? "#ef444444" : "#ffffff10"}`,
              borderRadius: 10, padding: "14px 18px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span>{typeIcon[issue.type]}</span>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{issue.title}</span>
                  {issue.recurring && <Badge color="#ef4444">Tái phát</Badge>}
                </div>
                <Badge color={statusColor[issue.status]}>{issue.status === "open" ? "Đang mở" : issue.status === "resolved" ? "Đã xử lý" : "Chờ duyệt"}</Badge>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <Avatar user={reporter} size={20} />
                  <span style={{ fontSize: 11, color: "#64748b" }}>{reporter.name}</span>
                </div>
                <span style={{ fontSize: 11, color: "#60a5fa", fontFamily: "var(--font-mono)" }}>{project?.code}</span>
                <Badge color={PRIORITY_COLORS[issue.severity]}>{issue.severity}</Badge>
                <Badge color="#8b5cf6">{issue.tag}</Badge>
                <span style={{ fontSize: 11, color: "#475569", marginLeft: "auto", fontFamily: "var(--font-mono)" }}>{issue.date}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Plugins({ currentUser }) {
  const [plugins, setPlugins] = useState(PLUGINS);
  const catColors = { devops: "#60a5fa", notification: "#4ade80", testing: "#f59e0b", cad: "#c084fc", data: "#f472b6" };

  if (currentUser.role === "dev") {
    return <div style={{ color: "#64748b", padding: "40px 0", textAlign: "center" }}>Bạn không có quyền truy cập Kho Plugin.</div>;
  }

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Kho Plugin</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
        {plugins.map(p => (
          <div key={p.id} style={{
            background: "#ffffff06", border: `1px solid ${p.status === "connected" ? "#4ade8033" : "#ffffff10"}`,
            borderRadius: 12, padding: 20,
          }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 20,
                background: `${catColors[p.category]}22`, border: `1px solid ${catColors[p.category]}44`,
                color: catColors[p.category],
              }}>{p.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                <Badge color={catColors[p.category]}>{p.category}</Badge>
              </div>
              <div style={{
                width: 8, height: 8, borderRadius: "50%", marginTop: 6,
                background: p.status === "connected" ? "#4ade80" : "#64748b",
              }} />
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 14 }}>{p.desc}</div>
            <button
              onClick={() => setPlugins(prev => prev.map(x => x.id === p.id ? { ...x, status: x.status === "connected" ? "available" : "connected" } : x))}
              style={{
                width: "100%", padding: "8px 0", borderRadius: 8, cursor: "pointer",
                background: p.status === "connected" ? "#ffffff08" : "#3b82f6",
                border: p.status === "connected" ? "1px solid #ffffff20" : "none",
                color: p.status === "connected" ? "#94a3b8" : "#fff",
                fontSize: 12, fontWeight: 600,
              }}>
              {p.status === "connected" ? "Ngắt kết nối" : "Kết nối"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Members({ currentUser }) {
  const MATRIX = {
    "Quản lý user":       { admin: true,  lead: false, dev: false },
    "Tạo dự án":          { admin: true,  lead: false, dev: false },
    "Xem tất cả dự án":   { admin: true,  lead: false, dev: false },
    "Quản lý dự án":      { admin: true,  lead: true,  dev: false },
    "Duyệt task":         { admin: true,  lead: true,  dev: false },
    "Tạo task":           { admin: true,  lead: true,  dev: false },
    "Nhận task":          { admin: true,  lead: true,  dev: true  },
    "Upload tài liệu":    { admin: true,  lead: true,  dev: true  },
    "Báo lỗi":            { admin: true,  lead: true,  dev: true  },
    "Quản lý plugin":     { admin: true,  lead: true,  dev: false },
    "Xem plugin":         { admin: true,  lead: true,  dev: false },
    "Xuất báo cáo":       { admin: true,  lead: true,  dev: false },
    "Phân quyền user":    { admin: true,  lead: false, dev: false },
  };

  if (currentUser.role !== "admin") {
    return (
      <div>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Thành Viên</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {USERS.map(u => (
            <div key={u.id} style={{
              display: "flex", gap: 12, alignItems: "center", padding: "12px 16px",
              background: "#ffffff06", border: "1px solid #ffffff10", borderRadius: 10,
            }}>
              <Avatar user={u} size={36} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{u.dept}</div>
              </div>
              <Badge color={ROLE_COLORS[u.role]}>{ROLE_LABELS[u.role]}</Badge>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: u.online ? "#4ade80" : "#475569" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 800 }}>Thành Viên & Quyền</div>
        <button style={{ background: "#3b82f6", border: "none", borderRadius: 8, color: "#fff", padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>+ Thêm thành viên</button>
      </div>

      {/* Member list */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 28 }}>
        {USERS.map(u => (
          <div key={u.id} style={{
            background: "#ffffff06", border: "1px solid #ffffff10", borderRadius: 10,
            padding: "14px 16px",
          }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
              <Avatar user={u} size={36} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{u.name}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{u.dept}</div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Badge color={ROLE_COLORS[u.role]}>{ROLE_LABELS[u.role]}</Badge>
              <span style={{ fontSize: 11, color: u.online ? "#4ade80" : "#475569" }}>{u.online ? "● Online" : "○ Offline"}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Permission Matrix */}
      <div style={{ background: "#ffffff06", border: "1px solid #ffffff10", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #ffffff10", fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", color: "#94a3b8" }}>
          MA TRẬN PHÂN QUYỀN
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#ffffff04" }}>
                <th style={{ padding: "10px 20px", textAlign: "left", fontSize: 12, color: "#64748b", fontWeight: 600, whiteSpace: "nowrap" }}>Chức năng</th>
                {[["admin","Admin","#c084fc"],["lead","Team Lead","#4ade80"],["dev","Developer","#60a5fa"]].map(([k,l,c]) => (
                  <th key={k} style={{ padding: "10px 20px", textAlign: "center", fontSize: 12, color: c, fontWeight: 700 }}>{l}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(MATRIX).map(([fn, perms], i) => (
                <tr key={fn} style={{ borderTop: "1px solid #ffffff08", background: i % 2 === 0 ? "transparent" : "#ffffff03" }}>
                  <td style={{ padding: "10px 20px", fontSize: 12 }}>{fn}</td>
                  {["admin","lead","dev"].map(r => (
                    <td key={r} style={{ padding: "10px 20px", textAlign: "center" }}>
                      {perms[r]
                        ? <span style={{ color: "#4ade80", fontSize: 16 }}>✓</span>
                        : <span style={{ color: "#ffffff20", fontSize: 14 }}>—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "projects",  label: "Dự Án",     icon: "◈" },
  { id: "docs",      label: "Tài Liệu",  icon: "◎" },
  { id: "quality",   label: "Chất Lượng",icon: "△" },
  { id: "plugins",   label: "Kho Plugin",icon: "⬡" },
  { id: "members",   label: "Thành Viên",icon: "◉" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState(USERS[0]);
  const [showUserPicker, setShowUserPicker] = useState(false);

  const recurringAlert = QUALITY_ISSUES.filter(i => i.recurring && i.status === "open").length;

  return (
    <div style={{
      minHeight: "100vh", background: "#060c18",
      color: "#e2e8f0", fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
      display: "flex",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;600;700&display=swap');
        :root { --font-mono: 'IBM Plex Mono', monospace; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
        body { background: #060c18; }
      `}</style>

      {/* Sidebar */}
      <div style={{
        width: 220, flexShrink: 0, background: "#070d1c",
        borderRight: "1px solid #ffffff0a", display: "flex", flexDirection: "column",
        position: "fixed", height: "100vh", left: 0, top: 0, zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: "22px 20px 16px", borderBottom: "1px solid #ffffff08" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 800,
            }}>⬡</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: "-0.01em" }}>SteelTeam</div>
              <div style={{ fontSize: 10, color: "#475569", fontFamily: "var(--font-mono)" }}>PLATFORM v2.4</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
          {NAV_ITEMS.map(item => {
            const isActive = page === item.id;
            const showAlert = item.id === "quality" && recurringAlert > 0;
            return (
              <button key={item.id} onClick={() => setPage(item.id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 8, marginBottom: 2, cursor: "pointer",
                background: isActive ? "#3b82f618" : "none",
                border: isActive ? "1px solid #3b82f644" : "1px solid transparent",
                color: isActive ? "#60a5fa" : "#64748b",
                fontSize: 13, fontWeight: isActive ? 700 : 400,
                textAlign: "left", transition: "all 0.15s",
                position: "relative",
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#ffffff06"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "none"; }}
              >
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                {item.label}
                {showAlert && (
                  <span style={{
                    marginLeft: "auto", background: "#ef4444", color: "#fff",
                    borderRadius: 10, fontSize: 10, fontWeight: 700, padding: "1px 6px",
                    fontFamily: "var(--font-mono)",
                  }}>{recurringAlert}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User switcher */}
        <div style={{ padding: "12px", borderTop: "1px solid #ffffff08", position: "relative" }}>
          <button onClick={() => setShowUserPicker(v => !v)} style={{
            width: "100%", display: "flex", gap: 10, alignItems: "center",
            background: "#ffffff06", border: "1px solid #ffffff10", borderRadius: 10,
            padding: "10px 12px", cursor: "pointer",
          }}>
            <Avatar user={currentUser} size={30} />
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{currentUser.name.split(" ").slice(-2).join(" ")}</div>
              <div style={{ fontSize: 10, color: ROLE_COLORS[currentUser.role], fontFamily: "var(--font-mono)" }}>{ROLE_LABELS[currentUser.role]}</div>
            </div>
            <span style={{ color: "#475569", fontSize: 10 }}>▴▾</span>
          </button>
          {showUserPicker && (
            <div style={{
              position: "absolute", bottom: "100%", left: 12, right: 12, marginBottom: 6,
              background: "#0d1426", border: "1px solid #ffffff15", borderRadius: 10,
              overflow: "hidden", boxShadow: "0 -8px 32px #000000aa",
            }}>
              {USERS.map(u => (
                <button key={u.id} onClick={() => { setCurrentUser(u); setShowUserPicker(false); }} style={{
                  width: "100%", display: "flex", gap: 8, alignItems: "center",
                  padding: "9px 12px", background: currentUser.id === u.id ? "#3b82f615" : "none",
                  border: "none", cursor: "pointer", textAlign: "left",
                  borderBottom: "1px solid #ffffff08",
                }}>
                  <Avatar user={u} size={24} />
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600 }}>{u.name.split(" ").slice(-2).join(" ")}</div>
                    <div style={{ fontSize: 10, color: ROLE_COLORS[u.role] }}>{ROLE_LABELS[u.role]}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main */}
      <div style={{ marginLeft: 220, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Header */}
        <div style={{
          padding: "16px 32px", borderBottom: "1px solid #ffffff08",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "#070d1c99", backdropFilter: "blur(12px)",
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>
              {NAV_ITEMS.find(n => n.id === page)?.icon} {NAV_ITEMS.find(n => n.id === page)?.label}
            </div>
            <div style={{ fontSize: 11, color: "#475569", fontFamily: "var(--font-mono)", marginTop: 2 }}>
              {new Date().toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {recurringAlert > 0 && (
              <button onClick={() => setPage("quality")} style={{
                background: "#7f1d1d44", border: "1px solid #ef444444",
                borderRadius: 8, color: "#fca5a5", padding: "6px 12px",
                cursor: "pointer", fontSize: 12, fontWeight: 600,
                display: "flex", alignItems: "center", gap: 6,
              }}>
                ⚠ {recurringAlert} lỗi tái phát
              </button>
            )}
            <div style={{
              width: 36, height: 36, borderRadius: 8, background: "#ffffff08",
              border: "1px solid #ffffff10", display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer", fontSize: 14,
            }}>🔔</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
          {page === "dashboard" && <Dashboard currentUser={currentUser} />}
          {page === "projects"  && <Projects currentUser={currentUser} />}
          {page === "docs"      && <Documents currentUser={currentUser} />}
          {page === "quality"   && <Quality currentUser={currentUser} />}
          {page === "plugins"   && <Plugins currentUser={currentUser} />}
          {page === "members"   && <Members currentUser={currentUser} />}
        </div>
      </div>
    </div>
  );
}
