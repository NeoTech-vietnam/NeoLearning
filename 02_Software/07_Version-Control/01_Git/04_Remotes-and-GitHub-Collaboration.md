# Remote và cộng tác với GitHub

## Dành cho ai?

Người đã làm việc được với commit local và cần đồng bộ repository, xác thực với GitHub, hoặc gửi thay đổi để review.

## Khái niệm remote

Remote là một tên cục bộ trỏ đến URL repository khác. `origin` chỉ là quy ước phổ biến, không phải tên bắt buộc. Sau khi clone, Git thường tạo remote `origin` và cấu hình upstream cho nhánh mặc định.

- **Fetch** tải thông tin và commit từ remote, cập nhật remote-tracking branch nhưng không tự thay đổi nhánh hiện tại.
- **Pull** là fetch rồi tích hợp vào nhánh hiện tại; vì vậy cần xem trạng thái và hiểu chiến lược tích hợp trước khi dùng.
- **Push** xuất bản commit local lên remote; thao tác này có ảnh hưởng tới người cộng tác.

Kiểm tra remote trước khi đồng bộ hoặc xuất bản:

```sh
git remote -v
git status
git fetch <tên-remote>
```

Ba lệnh trên không sửa lịch sử local. `git fetch` có thể cập nhật các remote-tracking branch cục bộ, nhưng không merge vào nhánh đang checkout.

## Xác thực với GitHub

GitHub hỗ trợ HTTPS và SSH cho thao tác Git. HTTPS thường dùng credential helper để lưu thông tin xác thực; SSH dùng cặp khóa trên từng máy và public key được thêm vào tài khoản GitHub. Chọn phương thức theo chính sách tổ chức; không gửi private key, token hoặc mật khẩu qua chat, commit hoặc pull request.

Nếu dùng SSH, kiểm tra fingerprint máy chủ theo tài liệu GitHub trước khi tin cậy kết nối lần đầu. Kết quả xác thực SSH thành công có thể trả exit code 1 vì GitHub không cung cấp shell; đọc thông báo thay vì chỉ dựa vào exit code.

## Pull request là nơi cộng tác

Một pull request so sánh nhánh nguồn (head) với nhánh đích (base), cho phép review và kiểm tra tự động trước khi merge. Trước khi tạo pull request:

1. Xem lại commit và diff của nhánh công việc.
2. Xác nhận nhánh base đúng và thay đổi có phạm vi nhỏ, có thể review.
3. Mô tả mục đích, ảnh hưởng, cách kiểm tra và các giới hạn còn lại.
4. Tuân thủ template, review và bảo vệ nhánh của repository.

Sau khi nhận phản hồi, bổ sung commit rõ ràng hoặc cập nhật nhánh theo quy ước nhóm. Không force push vào nhánh dùng chung hoặc nhánh bảo vệ trừ khi chính sách repository và người chịu trách nhiệm đã cho phép rõ ràng.

## Khi pull không an toàn để chạy ngay

Dừng và kiểm tra trước khi pull nếu working tree có thay đổi chưa commit, nhánh đang lệch upstream, hoặc bạn chưa biết repository dùng merge, rebase hay fast-forward-only. `git status`, `git log` và `git diff` giúp hiểu trạng thái trước. Với thay đổi cục bộ có giá trị, hãy commit, cất giữ theo quy ước nhóm, hoặc sao lưu trước khi tích hợp.

## Nguồn chính thức

- [`git-fetch` reference](https://git-scm.com/docs/git-fetch)
- [`git-pull` reference](https://git-scm.com/docs/git-pull)
- [`git-push` reference](https://git-scm.com/docs/git-push)
- [GitHub Docs: Set up Git](https://docs.github.com/en/get-started/git-basics/set-up-git)
- [GitHub Docs: Connecting to GitHub with SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [GitHub Docs: Creating a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)
