# Research and practice questions

Answer the research questions before consulting the separate answer file. Explain the assumptions and reasoning in your own words.

### Q1: Khi xóa node cuối cùng, tail phải trỏ vào đâu và vì sao không được để tail bằng con trỏ vừa free?

Objectives: O1, O2

### Q2: Tail giúp thao tác nào đạt O(1), và vì sao deleteAtIndex(size - 1) vẫn O(n)?

Objectives: O1, O3

### Q3: Cần làm những gì trước khi đổi predecessor.next, và cấp phát thất bại phải để lại trạng thái nào?

Objectives: O2

### Q4: Một log PASS với 2000 thao tác có chứng minh không rò rỉ và đúng với mọi đầu vào không?

Objectives: O3, O4

## Practice

### P1: Tính tay chuỗi addAtIndex(-2,7), addAtTail(9), addAtIndex(1,8), deleteAtIndex(2), deleteAtIndex(0), deleteAtIndex(0), addAtTail(6). Ghi values, size và tail ở mỗi bước.

Objectives: O1, O3

### P2: Một người sửa addAtIndex bằng cách tăng size trước malloc và bỏ qua cập nhật tail khi thêm vào danh sách rỗng. Đề xuất hai kiểm thử độc lập phát hiện hai lỗi này.

Objectives: O1, O2, O4

### P3: So sánh append 1000 giá trị bằng sentinel + size không tail và bằng sentinel + size + tail. Nêu tổng độ phức tạp và chi phí thiết kế phải trả.

Objectives: O1, O3

### P4: Chạy C11 và C++17, ghi lại compiler/version, exit codes, tổng harness và nơi binaries. So sánh bằng chứng này với oracle độc lập đã lưu: điều gì được và chưa được kiểm tra?

Objectives: O3, O4
