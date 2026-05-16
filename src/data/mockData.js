export const USERS = [
  { id: 1, name: "Nguyễn Văn Hưng", role: "admin", avatar: "NH", dept: "Management", online: true },
  { id: 2, name: "Trần Minh Khoa", role: "lead", avatar: "MK", dept: "Structure", online: true },
  { id: 3, name: "Lê Thị Hoa", role: "lead", avatar: "TH", dept: "Connection", online: false },
  { id: 4, name: "Phạm Đức Long", role: "dev", avatar: "DL", dept: "Structure", online: true },
  { id: 5, name: "Vũ Thanh Mai", role: "dev", avatar: "TM", dept: "Detailing", online: true },
  { id: 6, name: "Hoàng Văn Tú", role: "dev", avatar: "VT", dept: "BIM", online: false },
];

export const PROJECTS = [
  { id: 1, name: "Nhà Máy Thép Bình Dương", code: "BD-2024-01", status: "active", progress: 68, lead: 2, team: [2,4,5], deadline: "2024-08-15", phase: "Thiết kế chi tiết", tasks: 24, done: 16 },
  { id: 2, name: "Cầu Thép Long An", code: "LA-2024-02", status: "active", progress: 42, lead: 3, team: [3,6], deadline: "2024-10-30", phase: "Tính toán kết cấu", tasks: 18, done: 8 },
  { id: 3, name: "Kho Lạnh Đà Nẵng", code: "DN-2023-05", status: "completed", progress: 100, lead: 2, team: [2,4], deadline: "2024-03-20", phase: "Hoàn thành", tasks: 30, done: 30 },
  { id: 4, name: "Tháp Truyền Tải HN", code: "HN-2024-03", status: "planning", progress: 12, lead: 3, team: [3,5,6], deadline: "2025-02-28", phase: "Lập hồ sơ", tasks: 10, done: 1 },
];

export const TASKS = [
  { id: 1, project: 1, title: "Tính toán momen uốn dầm B3", assignee: 4, priority: "high", status: "inprogress", due: "2024-07-10", type: "calculation" },
  { id: 2, project: 1, title: "Bản vẽ chi tiết liên kết cột-dầm", assignee: 5, priority: "high", status: "review", due: "2024-07-12", type: "drawing" },
  { id: 3, project: 1, title: "Kiểm tra biến dạng mái", assignee: 4, priority: "medium", status: "todo", due: "2024-07-20", type: "check" },
  { id: 4, project: 2, title: "Mô hình FEM dầm chính", assignee: 6, priority: "high", status: "inprogress", due: "2024-07-15", type: "modeling" },
  { id: 5, project: 2, title: "Báo cáo tải trọng gió", assignee: 3, priority: "medium", status: "todo", due: "2024-07-25", type: "report" },
];

export const DOCS = [
  { id: 1, name: "TCVN 5575:2012 - Kết Cấu Thép", category: "standard", size: "4.2 MB", updated: "2024-01-15", project: null, type: "pdf" },
  { id: 2, name: "Template Bản Vẽ Chi Tiết v3.2", category: "template", size: "1.8 MB", updated: "2024-05-20", project: null, type: "dwg" },
  { id: 3, name: "Tính toán kết cấu BD-2024-01", category: "project", size: "2.1 MB", updated: "2024-06-28", project: 1, type: "xlsx" },
  { id: 4, name: "Hướng dẫn BIM Workflow", category: "guide", size: "3.5 MB", updated: "2024-04-10", project: null, type: "pdf" },
  { id: 5, name: "Bản vẽ cầu LA-2024-02 Rev.3", category: "project", size: "12.4 MB", updated: "2024-07-01", project: 2, type: "dwg" },
];

export const QUALITY_ISSUES = [
  { id: 1, project: 1, title: "Sai chiều dày bản mã liên kết cột C12", type: "error", severity: "high", status: "open", reporter: 5, date: "2024-07-02", tag: "connection", recurring: true },
  { id: 2, project: 1, title: "Thiếu gia cố tại lỗ khoét trên dầm", type: "error", severity: "critical", status: "resolved", reporter: 4, date: "2024-06-25", tag: "beam", recurring: false },
  { id: 3, project: 2, title: "Đề xuất dùng HEA thay HEB để tối ưu TL", type: "improvement", severity: "low", status: "pending", reporter: 6, date: "2024-07-01", tag: "optimization", recurring: false },
  { id: 4, project: 1, title: "Sai chiều dày bản mã (tái phát)", type: "error", severity: "high", status: "open", reporter: 4, date: "2024-07-05", tag: "connection", recurring: true },
];

export const PLUGINS = [
  { id: 1, name: "GitHub Sync", desc: "Tự động đồng bộ file thiết kế với GitHub repository", icon: "⬡", status: "connected", category: "devops" },
  { id: 2, name: "Telegram Bot", desc: "Thông báo task, deadline, lỗi qua Telegram channel", icon: "✈", status: "connected", category: "notification" },
  { id: 3, name: "API Tester", desc: "Kiểm thử API kết nối với phần mềm tính toán bên ngoài", icon: "⚡", status: "available", category: "testing" },
  { id: 4, name: "Docker Logs", desc: "Theo dõi log container tính toán FEM tự động", icon: "◈", status: "available", category: "devops" },
  { id: 5, name: "AutoCAD Bridge", desc: "Xuất bản vẽ trực tiếp sang AutoCAD/Revit", icon: "◉", status: "available", category: "cad" },
  { id: 6, name: "Excel Calc", desc: "Nhập/xuất bảng tính kết cấu từ Excel tự động", icon: "▦", status: "connected", category: "data" },
];

export const ACTIVITY = [
  { id: 1, user: 5, action: "upload file", target: "Bản vẽ chi tiết liên kết Rev.4", time: "2 phút trước", project: 1 },
  { id: 2, user: 4, action: "complete task", target: "Tính toán tải trọng tầng 2", time: "18 phút trước", project: 1 },
  { id: 3, user: 6, action: "report issue", target: "Mô hình FEM sai tải trọng gió", time: "1 giờ trước", project: 2 },
  { id: 4, user: 2, action: "approve task", target: "Bản vẽ liên kết cột-dầm", time: "2 giờ trước", project: 1 },
  { id: 5, user: 3, action: "create task", target: "Báo cáo tải trọng gió LA-2024", time: "3 giờ trước", project: 2 },
];

export const MATRIX = {
  "Xem DashboardTổng Quan": { admin: true, lead: true, dev: true },
  "Xem chi tiết dự án tham gia": { admin: true, lead: true, dev: true },
  "Xem toàn bộ dự án hệ thống": { admin: true, lead: true, dev: false },
  "Tạo dự án mới": { admin: true, lead: true, dev: false },
  "Phân công task cho thành viên": { admin: true, lead: true, dev: false },
  "Cập nhật trạng thái Task được giao": { admin: true, lead: true, dev: true },
  "Phê duyệt kết quả duyệt Task": { admin: true, lead: true, dev: false },
  "Tải lên bản vẽ & tài liệu kỹ thuật": { admin: true, lead: true, dev: true },
  "Xóa tài liệu khỏi hệ thống": { admin: true, lead: false, dev: false },
  "Báo cáo lỗi chất lượng (NCR)": { admin: true, lead: true, dev: true },
  "Đóng/Chốt lỗi chất lượng": { admin: true, lead: true, dev: false },
  "Cấu hình tích hợp Plugin hệ thống": { admin: true, lead: false, dev: false },
  "Quản lý phân quyền ma trận thành viên": { admin: true, lead: false, dev: false }
};

export const USER_PASSWORDS = { 1: "admin123", 2: "khoa123", 3: "hoa123", 4: "long123", 5: "mai123", 6: "tu123" };