# Bộ extension Nimbalyst local

Cập nhật ngày **22/10/2026**, gồm **6 extension**, source cần cho build và bản build sẵn:

- Agent Office **0.17.0**
- Browser Internal Tabs **1.0.1-local.3**
- Browser Launcher **0.1.0**
- Project Calendar **0.1.4**
- Claude Inspired Theme **0.5.3**
- Antigravity CLI **0.3.3**

Cho AI trên máy đích đọc [AI_SETUP.md](AI_SETUP.md) để cài. Có thể gửi:

> Đọc AI_SETUP.md trong bộ này, rồi cài toàn bộ extension vào Nimbalyst trên máy này. Giữ Browser ở chế độ thủ công. Dùng bản build sẵn; chỉ build lại khi cần.

Các project nằm trong `extensions/`. Copy chúng tới thư mục bền vững ngoài thư mục cài ứng dụng trước khi đăng ký với Nimbalyst. Kiểm tra bộ cài bằng `node verify.mjs` nếu có Node.js.

Không kèm tài khoản, API key hoặc dữ liệu workspace. Office cần nhập key thời tiết riêng; Antigravity CLI cần cài và đăng nhập `agy` riêng. Mỗi extension đã build thành công; khả năng chạy trên máy khác còn phụ thuộc phiên bản Nimbalyst và cấu hình máy đích.
