# SteelTeam Platform

Ứng dụng quản lý nhóm kỹ thuật kết cấu thép — React + Supabase + Vercel.

---

## Cấu trúc thư mục

```
src/
├── App.jsx                      # Entry: routing + state cấp cao
├── index.js
│
├── lib/
│   └── supabase.js              # Khởi tạo Supabase client
│
├── data/
│   ├── constants.js             # Màu, labels, NAV_ITEMS, DEMO_PASSWORDS
│   └── fallback.js              # Dữ liệu tĩnh (dùng khi offline/chưa cấu hình)
│
├── hooks/
│   ├── useAuth.js               # Auth: Supabase Auth hoặc demo login
│   └── useRealtimeData.js       # Fetch + Realtime + CRUD cho bất kỳ bảng nào
│
├── components/                  # Component dùng chung
│   ├── ui.jsx                   # Avatar, Badge, ProgressBar, Card, Button...
│   ├── Layout.jsx               # Sidebar + Header + Footer wrapper
│   ├── LoginModal.jsx           # Modal đăng nhập
│   └── LoginGate.jsx            # Màn hình chặn khi chưa đăng nhập
│
└── modules/                     # Mỗi trang = 1 folder
    ├── dashboard/Dashboard.jsx
    ├── projects/Projects.jsx
    ├── documents/Documents.jsx
    ├── quality/Quality.jsx
    ├── plugins/Plugins.jsx
    └── members/Members.jsx
```

---

## Thiết lập Supabase

### 1. Tạo project
Vào [supabase.com](https://supabase.com) → New project.

### 2. Chạy schema
Vào **SQL Editor** → **New query** → paste nội dung file `supabase_schema.sql` → Run.

### 3. Tạo users thật (tùy chọn)
Vào **Authentication → Users → Invite user** để tạo tài khoản thật.
Sau đó insert profile vào bảng `public.users` với cùng `id` (UUID).

### 4. Lấy API keys
Vào **Project Settings → API**:
- `Project URL` → `VITE_SUPABASE_URL`
- `anon public` → `VITE_SUPABASE_ANON_KEY`

### 5. Tạo file `.env.local`
```bash
cp .env.example .env.local
# Điền URL và key vào file .env.local
```

---

## Chạy locally

```bash
npm install
npm run dev
```

> Nếu chưa điền Supabase key, app tự động dùng dữ liệu fallback (demo mode).

---

## Deploy lên Vercel

### Cách 1: Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

### Cách 2: GitHub → Vercel dashboard
1. Push code lên GitHub
2. Vào [vercel.com](https://vercel.com) → Import repository
3. Thêm Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

---

## Chế độ hoạt động

| Trạng thái | Auth | Dữ liệu |
|---|---|---|
| Chưa điền key | Demo login (password cứng) | Dữ liệu tĩnh fallback |
| Đã điền key | Supabase Auth (email/password) | Supabase DB + Realtime |

---

## Demo passwords (chỉ dùng khi chưa có Supabase)
| User | Password |
|---|---|
| Nguyễn Văn Hưng (Admin) | `admin123` |
| Trần Minh Khoa (Lead) | `khoa123` |
| Lê Thị Hoa (Lead) | `hoa123` |
| Phạm Đức Long (Dev) | `long123` |
| Vũ Thanh Mai (Dev) | `mai123` |
| Hoàng Văn Tú (Dev) | `tu123` |
