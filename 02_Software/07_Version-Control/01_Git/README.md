# Git

Git là hệ thống quản lý phiên bản phân tán. Mỗi repository lưu lịch sử thay đổi cục bộ; remote như GitHub giúp chia sẻ lịch sử đó với nhóm. Git và GitHub là hai khái niệm liên quan nhưng không thay thế cho nhau.

## Lộ trình đọc

1. [Nền tảng và thiết lập](01_Fundamentals-and-Setup.md) — hiểu mô hình Git và cấu hình danh tính.
2. [Quy trình thay đổi hằng ngày](02_Daily-Change-Workflow.md) — kiểm tra, chọn phần thay đổi và tạo commit.
3. [Nhánh và tích hợp](03_Branches-and-Integration.md) — tách công việc, hợp nhất và xử lý xung đột.
4. [Remote và cộng tác GitHub](04_Remotes-and-GitHub-Collaboration.md) — đồng bộ an toàn và mở pull request.

## Mục tiêu học tập

- Phân biệt working tree, staging area (index), commit, branch và remote.
- Đọc trạng thái và khác biệt trước khi thay đổi lịch sử hoặc đồng bộ với remote.
- Cộng tác bằng nhánh nhỏ và pull request thay vì làm việc trực tiếp trên nhánh bảo vệ.

## Nguyên tắc an toàn

- Luôn bắt đầu bằng `git status`; kiểm tra diff trước khi stage, commit, pull hoặc push.
- Dùng `git add -- <đường-dẫn>` để chỉ stage các tệp đã xem xét.
- Không dùng force push, không viết lại lịch sử đã chia sẻ, và không xóa thay đổi chưa sao lưu nếu chưa hiểu hậu quả.
- Lệnh có thể đổi cấu hình, working tree hoặc remote được ghi rõ phạm vi. Thay giá trị trong dấu `<…>` bằng giá trị của bạn.

## Giới hạn của bộ tài liệu này

Đây là tài liệu khái niệm và quy trình. Bài lab, repository mẫu và ví dụ thực thi được để ở phạm vi triển khai sau.

## Tài liệu chính thức

- [Git Reference](https://git-scm.com/docs) — danh mục lệnh và tài liệu tham chiếu của Git.
- [Pro Git: What is Git?](https://git-scm.com/book/en/v2/Getting-Started-What-is-Git) — giải thích mô hình dữ liệu và tư duy Git.
- [GitHub Docs: Set up Git](https://docs.github.com/en/get-started/git-basics/set-up-git) — thiết lập Git và xác thực với GitHub.
