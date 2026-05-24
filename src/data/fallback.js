export const FALLBACK_USERS = [
  { id:'1', name:'Nguyễn Văn Nam',   role:'admin', avatar:'NN', dept:'Management', online:true  },
  { id:'2', name:'Phạm Đình Tân',    role:'lead',  avatar:'PT', dept:'Management', online:true  },
  { id:'3', name:'Dương Bảo Khang',  role:'dev',   avatar:'DK', dept:'Detailer',   online:false },
  { id:'4', name:'Nguyễn Văn Huỳnh', role:'dev',   avatar:'NH', dept:'Detailer',   online:true  },
  { id:'5', name:'Nguyễn Thế Văn',   role:'dev',   avatar:'NV', dept:'Detailer',   online:false },
];
export const FALLBACK_PROJECTS = [
  { id:'1', name:'Dự án mẫu 1', code:'DA-001', status:'active',   progress:60, lead_id:'2', team:['2','3','4'], deadline:'2026-08-15', phase:'Thiết kế chi tiết', tasks:10, done:6 },
  { id:'2', name:'Dự án mẫu 2', code:'DA-002', status:'planning', progress:10, lead_id:'2', team:['2','5'],     deadline:'2026-12-30', phase:'Lập hồ sơ',         tasks:5,  done:0 },
];
export const FALLBACK_TASKS = [
  { id:'1', project_id:'1', title:'Tính toán kết cấu dầm B1', assignee_id:'3', priority:'high',   status:'inprogress', due:'2026-06-10' },
  { id:'2', project_id:'1', title:'Bản vẽ chi tiết liên kết', assignee_id:'4', priority:'medium', status:'todo',       due:'2026-06-20' },
];
export const FALLBACK_DOCS = [
  { id:'1', name:'TCVN 5575:2012 - Kết Cấu Thép', category:'standard', size:'4.2 MB', type:'pdf', updated_at:'2026-01-15', project_id:null },
  { id:'2', name:'Template Bản Vẽ Chi Tiết v3.2',  category:'template', size:'1.8 MB', type:'dwg', updated_at:'2026-05-20', project_id:null },
];
export const FALLBACK_QUALITY_ISSUES = [
  { id:'1', project_id:'1', title:'Sai chiều dày bản mã liên kết', type:'error', severity:'high', status:'open', reporter_id:'3', tag:'connection', recurring:false, created_at:'2026-05-10' },
];
export const FALLBACK_PLUGINS = [
  { id:'1', name:'GitHub Sync',    description:'Đồng bộ file với GitHub',        icon:'⬡', status:'connected', category:'devops'       },
  { id:'2', name:'Telegram Bot',   description:'Thông báo qua Telegram channel', icon:'✈', status:'connected', category:'notification' },
  { id:'3', name:'AutoCAD Bridge', description:'Xuất bản vẽ sang AutoCAD/Revit', icon:'◉', status:'available', category:'cad'          },
  { id:'4', name:'Excel Calc',     description:'Nhập/xuất bảng tính từ Excel',   icon:'▦', status:'connected', category:'data'         },
];
export const FALLBACK_ACTIVITY = [
  { id:'1', user_id:'4', action:'upload file',   target:'Bản vẽ chi tiết Rev.4', created_at:'2 phút trước',  project_id:'1' },
  { id:'2', user_id:'3', action:'complete task', target:'Tính toán tải trọng',   created_at:'30 phút trước', project_id:'1' },
  { id:'3', user_id:'2', action:'create task',   target:'Kiểm tra biến dạng mái',created_at:'1 giờ trước',   project_id:'1' },
];
