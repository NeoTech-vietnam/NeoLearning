# Answers and reasoning

These supplied reference answers support comparison; completing the learner's exercises is not claimed.

## Q1

Tail phải trỏ về sentinel nhúng; size về 0 và sentinel.next về null. Nếu giữ địa chỉ node đã free, lần addAtTail sau sẽ ghi qua con trỏ dangling. Predecessor của node duy nhất chính là sentinel, nên đặt tail = predecessor khôi phục đồng thời cả ba bất biến.

## Q2

Tail giúp addAtTail và đường addAtIndex(size) nối trực tiếp trong O(1). Xóa đuôi cần predecessor để đặt next = null và cập nhật tail; danh sách đơn không chứa previous, nên vẫn phải duyệt từ sentinel O(n) tệ nhất.

## Q3

Trước khi đổi liên kết phải xác thực chỉ số, tìm predecessor, lưu successor, cấp phát node và khởi tạo đầy đủ giá trị/next. Nếu cấp phát C trả null hoặc C++ new ném ngoại lệ trước bước nối, danh sách cũ, size và tail đều không đổi. Không tăng size hoặc đổi tail trước khi biết có node mới.

## Q4

Không. Nó chứng minh các trường hợp đã chạy khớp kỳ vọng trên baseline được ghi. Oracle hành vi không nhất thiết thấy node bị rò rỉ không còn reachable. Cần phân biệt lỗi cấu trúc, lỗi API, kiểm tra fault injection và quan sát từ công cụ bộ nhớ; trong workflow này không có Valgrind/sanitizer hay bằng chứng external judge.

## P1

Từ rỗng: [7]/1/tail7; [7,9]/2/tail9; [7,8,9]/3/tail9; [7,8]/2/tail8; [8]/1/tail8; []/0/tailS; [6]/1/tail6. Chèn âm về đầu là hợp đồng phòng vệ cục bộ; khi xóa singleton tail phải về S trước append tiếp.

## P2

Thứ nhất, tạo danh sách có nội dung xác định rồi dùng hook fail-next allocation: sau chèn thất bại, mọi giá trị, size và tail phải giống trước. Thứ hai, bắt đầu rỗng, thêm một node rồi kiểm tra tail là node đó, tail.next null; tiếp tục addAtTail để phát hiện tail còn trỏ sentinel làm mất node đầu. Kiểm tra cả cấu trúc lẫn API; chỉ get(0) sau bước đầu có thể chưa đủ.

## P3

Không tail và không đường khác tìm đuôi: append thứ k duyệt khoảng k node, tổng 0+1+...+999 = 499500 lượt bước, O(n²). Có tail: mỗi append thay vài con trỏ, tổng O(n). Đổi lại phải giữ empty-tail=S, nonempty-tail=last, tail.next=null và sửa tail khi xóa cuối; cấm copy/move mặc định do sentinel tự tham chiếu.

## P4

Ghi kết quả quan sát thật của chính lần chạy, không chép số từ note rồi gọi là quan sát. Hai harness chứng thực các ca đã triển khai, gồm kiểm tra cấu trúc; oracle riêng dùng mô hình array/vector để giảm rủi ro cả thuật toán và test cùng sai. Không suy ra mọi đầu vào, mọi lỗi allocator, leak-tool hay external judge. Nếu compiler/harness trả nonzero, giữ log và phân tích trước khi sửa mã.
