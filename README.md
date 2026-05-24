# SteelTeam Platform Dashboard

Một nền tảng quản lý và hiển thị dữ liệu tích hợp cho đội ngũ ngành thép, cung cấp giao diện quản lý hợp nhất cho các module dashboard, dự án, tài liệu, chất lượng, plugin và thành viên.

## 📋 Mô Tả Dự Án

**SteelTeam Platform** là một ứng dụng web React hiện đại được xây dựng với **Vite**, cung cấp một dashboard tương tác cho quản lý:
- 📊 Dashboard: Hiển thị tổng quan dữ liệu chính
- 📁 Projects: Quản lý dự án
- 📄 Documents: Quản lý tài liệu
- ⚙️ Quality: Theo dõi các vấn đề chất lượng
- 🔌 Plugins: Quản lý plugin hệ thống
- 👥 Members: Quản lý thành viên đội

## 🛠️ Công Nghệ Sử Dụng

- **React**: 18.3.1 - Thư viện UI
- **Vite**: 5.4.1 - Build tool và dev server
- **Vercel**: Nền tảng deployment
- **Google Apps Script**: Integration backend
- **JavaScript/JSX**: Ngôn ngữ chính
- **CSS-in-JS**: Styling với inline styles

## 📁 Cấu Trúc Dự Án

```
steel-platform/
├── src/
│   ├── App.jsx                 # Thành phần ứng dụng chính
│   ├── index.jsx               # Entry point React
│   ├── components/
│   │   ├── Layout.jsx          # Layout chính của ứng dụng
│   │   ├── LoginModal.jsx      # Modal đăng nhập
│   │   └── ui.jsx              # Các thành phần UI cơ bản
│   ├── hooks/
│   │   ├── useAuth.js          # Hook quản lý xác thực
│   │   └── useData.js          # Hook lấy dữ liệu
│   ├── modules/
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx   # Module dashboard
│   │   ├── projects/
│   │   │   └── Projects.jsx    # Module dự án
│   │   ├── documents/
│   │   │   └── Documents.jsx   # Module tài liệu
│   │   ├── quality/
│   │   │   └── Quality.jsx     # Module chất lượng
│   │   ├── plugins/
│   │   │   └── Plugins.jsx     # Module plugin
│   │   └── members/
│   │       └── Members.jsx     # Module thành viên
│   ├── lib/
│   │   └── sheetsApi.js        # API tương tác với Google Sheets
│   └── data/
│       ├── constants.js        # Các hằng số (màu role, nhãn, item nav)
│       └── fallback.js         # Dữ liệu mặc định khi không có dữ liệu
├── index.html                  # File HTML chính
├── package.json                # Dependencies và scripts
├── vite.config.js              # Cấu hình Vite
├── vercel.json                 # Cấu hình Vercel
└── GoogleAppsScript.js         # Script Google Apps tích hợp
```

## 🚀 Cài Đặt và Chạy

### Yêu Cầu
- Node.js 16+ 
- npm hoặc yarn

### Bước Cài Đặt

1. **Clone hoặc tải dự án**
   ```bash
   cd steel-platform
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Chạy development server**
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ mở tại `http://localhost:5173` (mặc định Vite)

4. **Build cho production**
   ```bash
   npm run build
   ```

5. **Preview build production**
   ```bash
   npm run preview
   ```

## 🔐 Hệ Thống Xác Thực

Ứng dụng sử dụng hệ thống xác thực demo với tài khoản mẫu:

- **Hook `useAuth`**: Quản lý trạng thái đăng nhập và người dùng hiện tại
- **Demo Passwords**: Mật khẩu được định nghĩa trong `constants.js` cho mỗi tài khoản
- **Guest Mode**: Các trang công khai (dashboard) có thể xem mà không cần đăng nhập
- **Protected Pages**: Các module khác yêu cầu đăng nhập

### Luồng Đăng Nhập
1. Người dùng chọn tài khoản từ sidebar
2. Hệ thống hiển thị modal đăng nhập
3. Xác thực mật khẩu qua `useAuth` hook
4. Nếu thành công, người dùng được chuyển đến trang mong muốn
5. Logout xóa thông tin người dùng hiện tại

## 📊 Module Chất Lượng

Module Quality có tính năng đặc biệt:
- Theo dõi **recurring alerts** (cảnh báo tái diễn)
- Badge thông báo trên icon navigation
- Dữ liệu từ hook `useData('quality_issues', FALLBACK_QUALITY_ISSUES)`

## 🔗 Tích Hợp Google Sheets

Ứng dụng tích hợp với Google Sheets thông qua:
- **Google Apps Script** (`GoogleAppsScript.js`): Script backend
- **sheetsApi.js**: Module API để tương tác với Sheets
- **useData Hook**: Tự động lấy dữ liệu từ backend

## 📱 Thiết Kế Giao Diện

- **Màu sắc**: Dark theme (nền: `#060c18`, chữ: `#e2e8f0`)
- **Font**: IBM Plex Sans cho UI, IBM Plex Mono cho code
- **Responsive**: Flex layout để thích ứng nhiều kích thước màn hình
- **Styling**: CSS-in-JS inline styles (có thể nâng cấp sang CSS modules)

## 🚢 Deployment

Ứng dụng được cấu hình cho **Vercel**:

- **vercel.json**: Cấu hình rewrites cho SPA routing
- **Build Command**: `npm run build`
- **Output Directory**: Mặc định Vite (`dist/`)

Để deploy lên Vercel:
1. Push code lên GitHub
2. Kết nối repository với Vercel
3. Vercel sẽ tự động build và deploy theo cấu hình

## 📝 Scripts Có Sẵn

```json
{
  "dev": "vite",           // Chạy development server
  "build": "vite build",   // Build production
  "preview": "vite preview" // Xem preview build
}
```

## 🔄 Luồng Dữ Liệu

```
Google Sheets ↔ Google Apps Script ↔ sheetsApi.js ↔ useData Hook → Components
                                   ↓
                            FALLBACK_DATA (nếu lỗi)
```

## 💡 Các Tính Năng Chính

✅ **Multi-module architecture**: Dễ mở rộng thêm module  
✅ **Demo authentication**: Hệ thống login hoàn chỉnh  
✅ **Real-time data sync**: Kết nối Google Sheets  
✅ **Responsive UI**: Hoạt động trên nhiều thiết bị  
✅ **Alert system**: Cảnh báo về vấn đề chất lượng  
✅ **Dark theme**: Giao diện hiện đại, dễ nhìn  
✅ **SPA routing**: Điều hướng mượt mà không tải lại trang  

## 📦 Version

- **Phiên bản hiện tại**: 2.4.0
- **Node.js tối thiểu**: 16+

## 🔧 Lưu Ý Phát Triển

1. **Custom UI Components**: Các component UI cơ bản được định nghĩa trong `ui.jsx`
2. **Fallback Data**: Luôn cung cấp dữ liệu fallback để tránh lỗi
3. **Constants**: Tất cả các hằng số (màu, nhãn) được tập trung trong `constants.js`
4. **Hooks**: Sử dụng custom hooks (`useAuth`, `useData`) để tái sử dụng logic

## 🌐 Ngôn Ngữ

Ứng dụng được phát triển cho **thị trường Việt Nam** (ngôn ngữ giao diện là Tiếng Việt).

## 📄 Giấy Phép

**Private** - Dự án riêng tư, không sử dụng công cộng.

---

**Phát triển bởi**: SteelTeam  
**Cập nhật cuối**: 2026
