// src/data/fallback.js
// Dữ liệu tĩnh dùng làm fallback khi Supabase chưa được cấu hình
// hoặc trong môi trường dev/offline.

export const FALLBACK_USERS = [
  { id: '1', name: 'Nguyễn Văn Hưng', role: 'admin', avatar: 'NH', dept: 'Management', online: true },
  { id: '2', name: 'Trần Minh Khoa',  role: 'lead',  avatar: 'MK', dept: 'Structure',  online: true },
  { id: '3', name: 'Lê Thị Hoa',      role: 'lead',  avatar: 'TH', dept: 'Connection', online: false },
  { id: '4', name: 'Phạm Đức Long',   role: 'dev',   avatar: 'DL', dept: 'Structure',  online: true },
  { id: '5', name: 'Vũ Thanh Mai',    role: 'dev',   avatar: 'TM', dept: 'Detailing',  online: true },
  { id: '6', name: 'Hoàng Văn Tú',    role: 'dev',   avatar: 'VT', dept: 'BIM',        online: false },
];

export const FALLBACK_PROJECTS = [
  { id: 1, name: 'Nhà Máy Thép Bình Dương', code: 'BD-2024-01', status: 'active',    progress: 68,  lead_id: '2', team: ['2','4','5'], deadline: '2024-08-15', phase: 'Thiết kế chi tiết',   tasks: 24, done: 16 },
  { id: 2, name: 'Cầu Thép Long An',        code: 'LA-2024-02', status: 'active',    progress: 42,  lead_id: '3', team: ['3','6'],     deadline: '2024-10-30', phase: 'Tính toán kết cấu',   tasks: 18, done: 8  },
  { id: 3, name: 'Kho Lạnh Đà Nẵng',        code: 'DN-2023-05', status: 'completed', progress: 100, lead_id: '2', team: ['2','4'],     deadline: '2024-03-20', phase: 'Hoàn thành',          tasks: 30, done: 30 },
  { id: 4, name: 'Tháp Truyền Tải HN',      code: 'HN-2024-03', status: 'planning',  progress: 12,  lead_id: '3', team: ['3','5','6'], deadline: '2025-02-28', phase: 'Lập hồ sơ',          tasks: 10, done: 1  },
];

export const FALLBACK_TASKS = [
  { id: 1, project_id: 1, title: 'Tính toán momen uốn dầm B3',          assignee_id: '4', priority: 'high',   status: 'inprogress', due: '2024-07-10', type: 'calculation' },
  { id: 2, project_id: 1, title: 'Bản vẽ chi tiết liên kết cột-dầm',    assignee_id: '5', priority: 'high',   status: 'review',     due: '2024-07-12', type: 'drawing' },
  { id: 3, project_id: 1, title: 'Kiểm tra biến dạng mái',              assignee_id: '4', priority: 'medium', status: 'todo',       due: '2024-07-20', type: 'check' },
  { id: 4, project_id: 2, title: 'Mô hình FEM dầm chính',               assignee_id: '6', priority: 'high',   status: 'inprogress', due: '2024-07-15', type: 'modeling' },
  { id: 5, project_id: 2, title: 'Báo cáo tải trọng gió',               assignee_id: '3', priority: 'medium', status: 'todo',       due: '2024-07-25', type: 'report' },
];

export const FALLBACK_DOCS = [
  { id: 1, name: 'TCVN 5575:2012 - Kết Cấu Thép',      category: 'standard', size: '4.2 MB',  updated_at: '2024-01-15', project_id: null, type: 'pdf' },
  { id: 2, name: 'Template Bản Vẽ Chi Tiết v3.2',       category: 'template', size: '1.8 MB',  updated_at: '2024-05-20', project_id: null, type: 'dwg' },
  { id: 3, name: 'Tính toán kết cấu BD-2024-01',        category: 'project',  size: '2.1 MB',  updated_at: '2024-06-28', project_id: 1,    type: 'xlsx' },
  { id: 4, name: 'Hướng dẫn BIM Workflow',              category: 'guide',    size: '3.5 MB',  updated_at: '2024-04-10', project_id: null, type: 'pdf' },
  { id: 5, name: 'Bản vẽ cầu LA-2024-02 Rev.3',         category: 'project',  size: '12.4 MB', updated_at: '2024-07-01', project_id: 2,    type: 'dwg' },
];

export const FALLBACK_QUALITY_ISSUES = [
  { id: 1, project_id: 1, title: 'Sai chiều dày bản mã liên kết cột C12',           type: 'error',       severity: 'high',     status: 'open',     reporter_id: '5', created_at: '2024-07-02', tag: 'connection', recurring: true  },
  { id: 2, project_id: 1, title: 'Thiếu gia cố tại lỗ khoét trên dầm',             type: 'error',       severity: 'critical', status: 'resolved', reporter_id: '4', created_at: '2024-06-25', tag: 'beam',       recurring: false },
  { id: 3, project_id: 2, title: 'Đề xuất dùng HEA thay HEB để tối ưu TL',         type: 'improvement', severity: 'low',      status: 'pending',  reporter_id: '6', created_at: '2024-07-01', tag: 'optimization',recurring: false},
  { id: 4, project_id: 1, title: 'Sai chiều dày bản mã (tái phát)',                 type: 'error',       severity: 'high',     status: 'open',     reporter_id: '4', created_at: '2024-07-05', tag: 'connection', recurring: true  },
];

export const FALLBACK_PLUGINS = [
  { id: 1, name: 'GitHub Sync',     description: 'Tự động đồng bộ file thiết kế với GitHub repository',          icon: '⬡', status: 'connected', category: 'devops' },
  { id: 2, name: 'Telegram Bot',    description: 'Thông báo task, deadline, lỗi qua Telegram channel',            icon: '✈', status: 'connected', category: 'notification' },
  { id: 3, name: 'API Tester',      description: 'Kiểm thử API kết nối với phần mềm tính toán bên ngoài',        icon: '⚡', status: 'available', category: 'testing' },
  { id: 4, name: 'Docker Logs',     description: 'Theo dõi log container tính toán FEM tự động',                  icon: '◈', status: 'available', category: 'devops' },
  { id: 5, name: 'AutoCAD Bridge',  description: 'Xuất bản vẽ trực tiếp sang AutoCAD/Revit',                      icon: '◉', status: 'available', category: 'cad' },
  { id: 6, name: 'Excel Calc',      description: 'Nhập/xuất bảng tính kết cấu từ Excel tự động',                 icon: '▦', status: 'connected', category: 'data' },
];

export const FALLBACK_ACTIVITY = [
  { id: 1, user_id: '5', action: 'upload file',    target: 'Bản vẽ chi tiết liên kết Rev.4',  created_at: '2 phút trước',  project_id: 1 },
  { id: 2, user_id: '4', action: 'complete task',  target: 'Tính toán tải trọng tầng 2',       created_at: '18 phút trước', project_id: 1 },
  { id: 3, user_id: '6', action: 'report issue',   target: 'Mô hình FEM sai tải trọng gió',    created_at: '1 giờ trước',   project_id: 2 },
  { id: 4, user_id: '2', action: 'approve task',   target: 'Bản vẽ liên kết cột-dầm',          created_at: '2 giờ trước',   project_id: 1 },
  { id: 5, user_id: '3', action: 'create task',    target: 'Báo cáo tải trọng gió LA-2024',    created_at: '3 giờ trước',   project_id: 2 },
];
