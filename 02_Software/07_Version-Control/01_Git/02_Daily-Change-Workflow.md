# Quy trình thay đổi hằng ngày

## Dành cho ai?

Người đã có một repository local và cần biến thay đổi đã xem xét thành các commit nhỏ, rõ ràng, dễ review.

## Vòng lặp an toàn

1. **Nhận biết bối cảnh** — ở đúng repository và đúng nhánh; chạy `git status`.
2. **Xem xét thay đổi** — dùng `git diff` cho phần chưa stage, hoặc `git diff --staged` cho phần đã chọn.
3. **Chọn có chủ đích** — stage từng đường dẫn đã xem xét, không mặc định stage toàn bộ workspace.
4. **Ghi nhận** — tạo một commit mô tả một ý thay đổi hoàn chỉnh.
5. **Xác minh** — xem lại trạng thái và lịch sử ngắn trước khi chia sẻ.

## Lệnh tham khảo

```sh
git status
git diff
git add -- <đường-dẫn-đã-xem-xét>
git diff --staged
git commit -m "<mô tả ngắn ở thể mệnh lệnh>"
git log --oneline -n 5
```

`git status`, `git diff` và `git log` chỉ đọc dữ liệu. `git add` thay đổi staging area; `git commit` tạo lịch sử local mới. Hãy dùng `--` trước đường dẫn để Git phân biệt đường dẫn với tên branch hoặc revision.

## Đặt commit dễ hiểu

Một commit tốt có một mục đích, đủ nhỏ để review và có thông điệp nói rõ thay đổi đang làm gì. Tránh trộn định dạng lại tệp, đổi tên lớn và sửa chức năng không liên quan trong cùng commit. Nếu có giới hạn hoặc lý do không hiển nhiên, ghi chúng trong phần nội dung commit hoặc pull request.

## `.gitignore` không phải cơ chế bảo mật

`.gitignore` nói với Git các tệp **chưa được theo dõi** nào nên bỏ qua. Nó không tự xóa tệp đã được commit, không bảo vệ secret đã xuất hiện trong lịch sử, và không thay thế việc quản lý bí mật. Kiểm tra nội dung trước khi stage; không commit khóa riêng, token hoặc thông tin đăng nhập.

## Sửa sai: dừng và kiểm tra trước

- Stage nhầm: xem `git diff --staged` trước khi tạo commit; có thể bỏ stage mà không xóa nội dung working tree bằng `git restore --staged -- <đường-dẫn>`.
- Sửa nhầm tệp: sao chép nội dung cần giữ ở nơi an toàn trước khi dùng bất kỳ lệnh restore nào.
- Đã tạo commit local nhưng chưa chia sẻ: kiểm tra diff và lịch sử, rồi trao đổi với người hướng dẫn hoặc maintainer trước khi viết lại lịch sử.
- Đã push: ưu tiên một commit mới để sửa; đừng tự ý force push vào nhánh dùng chung.

`git restore` có thể bỏ thay đổi khi dùng trên working tree. Đọc kỹ phạm vi lệnh và chỉ chạy sau khi đã xác nhận nội dung cần giữ đã được bảo toàn.

## Nguồn chính thức

- [`git-status` reference](https://git-scm.com/docs/git-status)
- [`git-diff` reference](https://git-scm.com/docs/git-diff)
- [`git-add` reference](https://git-scm.com/docs/git-add)
- [`git-commit` reference](https://git-scm.com/docs/git-commit)
- [`git-restore` reference](https://git-scm.com/docs/git-restore)
- [`gitignore` reference](https://git-scm.com/docs/gitignore)
