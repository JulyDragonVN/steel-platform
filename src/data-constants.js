// src/data/constants.js

export const ROLE_COLORS = {
  admin: '#c084fc',
  lead:  '#4ade80',
  dev:   '#60a5fa',
};

export const ROLE_LABELS = {
  admin: 'Admin',
  lead:  'Team Lead',
  dev:   'Developer',
};

export const STATUS_COLORS = {
  todo:       '#64748b',
  inprogress: '#f59e0b',
  review:     '#8b5cf6',
  done:       '#22c55e',
};

export const PRIORITY_COLORS = {
  low:      '#22c55e',
  medium:   '#f59e0b',
  high:     '#ef4444',
  critical: '#dc2626',
};

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard',   icon: '▦', public: true  },
  { id: 'projects',  label: 'Dự Án',       icon: '◈', public: false },
  { id: 'docs',      label: 'Tài Liệu',    icon: '◎', public: false },
  { id: 'quality',   label: 'Chất Lượng',  icon: '△', public: false },
  { id: 'plugins',   label: 'Kho Plugin',  icon: '⬡', public: false },
  { id: 'members',   label: 'Thành Viên',  icon: '◉', public: false },
];

// Demo passwords — chỉ dùng khi Supabase Auth chưa được bật
export const DEMO_PASSWORDS = {
  '1': 'admin123',
  '2': 'khoa123',
  '3': 'hoa123',
  '4': 'long123',
  '5': 'mai123',
  '6': 'tu123',
};
