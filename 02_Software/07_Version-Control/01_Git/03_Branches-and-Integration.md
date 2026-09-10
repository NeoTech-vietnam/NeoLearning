# Nhánh và tích hợp thay đổi

## Dành cho ai?

Người cần làm việc song song với nhóm, chuẩn bị một thay đổi để review, hoặc xử lý khác biệt giữa hai nhánh.

## Vì sao dùng nhánh?

Nhánh cho phép cô lập một tính năng, bản sửa lỗi hoặc thử nghiệm khỏi nhánh mặc định. Nó là con trỏ tới lịch sử, không phải một bản sao đầy đủ của dự án. Trước khi tạo nhánh, xác nhận nhánh cơ sở đang đúng và working tree sạch hoặc các thay đổi đang được hiểu rõ.

Tên nhánh nên ngắn, mô tả mục đích, và tuân theo quy ước dự án, chẳng hạn tiền tố `feature/`, `fix/` hoặc mã công việc nếu nhóm sử dụng chúng. Không đưa secret hoặc dữ liệu nhạy cảm vào tên nhánh vì tên này có thể được xuất bản lên remote.

## Quy trình cộng tác đề xuất

1. Cập nhật hiểu biết về nhánh cơ sở bằng cách fetch và xem các thay đổi trước khi tích hợp.
2. Tạo nhánh công việc từ nhánh cơ sở đã được nhóm chấp nhận.
3. Tạo các commit nhỏ, tập trung; đẩy nhánh công việc để sao lưu và cộng tác.
4. Mở pull request để so sánh nhánh công việc với nhánh đích.
5. Chỉ tích hợp sau khi yêu cầu review, kiểm tra tự động và chính sách bảo vệ nhánh được thỏa mãn.

## Merge và rebase

**Merge** kết hợp hai lịch sử và có thể tạo merge commit. Đây thường là lựa chọn an toàn cho lịch sử đã chia sẻ vì không thay đổi các commit hiện có.

**Rebase** phát lại commit lên một base mới, nên tạo mã định danh commit mới. Rebase hữu ích khi chuẩn bị nhánh cá nhân gọn gàng, nhưng không nên tự ý dùng trên commit mà người khác có thể đã dựa vào. Trao đổi với nhóm trước khi rebase một nhánh đã chia sẻ.

## Xung đột

Xung đột xuất hiện khi Git không thể tự quyết định cách kết hợp thay đổi. Cách xử lý an toàn là:

1. Đọc thông báo của Git và xác định tất cả tệp có xung đột.
2. Hiểu ý định của cả hai phía, không chỉ chọn một phía để “hết lỗi”.
3. Sửa tệp, kiểm tra lại phần đánh dấu xung đột và chạy kiểm tra phù hợp của dự án.
4. Xem diff cuối cùng trước khi đánh dấu là đã giải quyết và tạo commit tích hợp.

Nếu không hiểu ý định của một thay đổi, dừng lại và hỏi tác giả hoặc maintainer. Không xóa marker xung đột một cách máy móc.

## Nhánh bảo vệ

Trên GitHub, nhánh bảo vệ có thể yêu cầu review, kiểm tra trạng thái, code-owner approval hoặc commit đã ký trước khi merge. Các quy tắc này thuộc repository; tài liệu Git local không thể thay thế chúng. Kiểm tra yêu cầu hiển thị trên pull request thay vì giả định bạn có quyền push hoặc merge.

## Nguồn chính thức

- [Pro Git: Branches in a Nutshell](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell)
- [`git-switch` reference](https://git-scm.com/docs/git-switch)
- [`git-merge` reference](https://git-scm.com/docs/git-merge)
- [`git-rebase` reference](https://git-scm.com/docs/git-rebase)
- [GitHub Docs: Branches](https://docs.github.com/en/pull-requests/reference/branches)
