# Antigravity CLI 0.3.3

Adapter nối Nimbalyst với chương trình `agy` trên máy đích. Source cần cho build và các backend đã bundle nằm trong gói này; tài khoản, CLI executable, session, permission grants và node_modules không đi kèm.

Đọc `../../AI_SETUP.md` trước khi cài. Có thể cài trực tiếp từ thư mục này bằng Extension Developer Kit vì `dist/` đã build sẵn. Nếu build lại, cần Node.js 22.12+, chạy `npm ci` rồi `npm run build`. Tests, model-refresh và smoke scripts không có trong bộ cài.

Cài `agy` và đăng nhập riêng bằng tài khoản người dùng trên máy đích. Adapter mặc định tìm `%LOCALAPPDATA%\agy\bin\agy.exe` trên Windows, hoặc `agy` trên hệ khác; có thể đổi CLI path trong Settings. Host cần hỗ trợ backend modules và agent providers, và hỏi quyền native lần đầu.

Bản này mặc định Normal (Accept Edits), Turbo bật; Turbo bỏ bước hỏi quyền tool trong subprocess CLI. Tắt Turbo trong Settings để dùng quy tắc quyền CLI. Model khả dụng phụ thuộc tài khoản; manifest chỉ chứa snapshot danh sách model.

Hỗ trợ streaming, resume hội thoại và ảnh; các định dạng tài liệu khác chưa được hỗ trợ. Quota indicator phụ thuộc backend/CLI tương thích; lỗi quota không đồng nghĩa đã hết quota. Không khởi động model để thử cài nếu chưa được cho phép.
