// src/data/fallback.js - dữ liệu thật của team
export const FALLBACK_USERS = [
  { id: '1', name: 'Nguyễn Văn Nam',   role: 'admin', avatar: 'NN', dept: 'Management', online: true  },
  { id: '2', name: 'Phạm Đình Tân',    role: 'lead',  avatar: 'PT', dept: 'Management', online: true  },
  { id: '3', name: 'Dương Bảo Khang',  role: 'dev',   avatar: 'DK', dept: 'Detailer',   online: false },
  { id: '4', name: 'Nguyễn Văn Huỳnh', role: 'dev',   avatar: 'NH', dept: 'Detailer',   online: true  },
  { id: '5', name: 'Nguyễn Thế Văn',   role: 'dev',   avatar: 'NV', dept: 'Detailer',   online: true  },
];

export const FALLBACK_PROJECTS = [
  { id: '1', name: 'Dự án mẫu 1', code: 'DA-001', status: 'active',   progress: 60, lead_id: '2', team: ['2','3','4'], deadline: '2026-08-15', phase: 'Thiết kế chi tiết', tasks: 10, done: 6 },
  { id: '2', name: 'Dự án mẫu 2', code: 'DA-002', status: 'planning', progress: 10, lead_id: '2', team: ['2','5'],     deadline: '2026-12-30', phase: 'Lập hồ sơ',         tasks: 5,  done: 0 },
];

export const FALLBACK_TASKS         = [];
export const FALLBACK_DOCS          = [];
export const FALLBACK_QUALITY_ISSUES = [];
export const FALLBACK_PLUGINS = [
  { id: '1', name: 'GitHub Sync',    description: 'Đồng bộ file với GitHub',         icon: '⬡', status: 'connected', category: 'devops'        },
  { id: '2', name: 'Telegram Bot',   description: 'Thông báo qua Telegram channel',  icon: '✈', status: 'connected', category: 'notification'  },
  { id: '3', name: 'AutoCAD Bridge', description: 'Xuất bản vẽ sang AutoCAD/Revit',  icon: '◉', status: 'available', category: 'cad'           },
  { id: '4', name: 'Excel Calc',     description: 'Nhập/xuất bảng tính từ Excel',    icon: '▦', status: 'connected', category: 'data'          },
];
export const FALLBACK_ACTIVITY = [];
