# Bài tập Lecture 7 – Memory Blocks

## Mở bài làm

- [Bài 1 – ROM 4 × 3 trong Logisim-evolution](01_rom_lecture/bai_1_rom.circ): mô phỏng ví dụ ROM ở trang 20–22 của bài giảng. Địa chỉ là `A1 A0`, dữ liệu là `D2 D1 D0`.
- [Bài 2 – ROM thực hiện hàm logic](02_rom_ham_logic/bai_2_rom.circ): địa chỉ `A1 A0` tương ứng `{A,B}`; đầu ra là `Y`.
- [Bài 3 – ROM, RAM, thanh ghi bằng SystemVerilog](03_memory_blocks/README.md): các module, testbench, lệnh chạy và giải thích.
- [Bài 4 – ROM giải mã LED 8 đoạn](04_led_8_doan_rom/README.md): SystemVerilog, testbench và file nội dung ROM cho Logisim.

## Bài 1: Đọc dữ liệu từ ROM

| Địa chỉ A1 A0 | Dữ liệu D2 D1 D0 | Giá trị hex |
|:---:|:---:|:---:|
| 00 | 011 | 3 |
| 01 | 110 | 6 |
| 10 | 100 | 4 |
| 11 | 010 | 2 |

ROM có 2 bit địa chỉ nên có 2² = 4 ô; mỗi ô lưu 3 bit. Trong mạch, khối ROM của Logisim chứa sẵn bốn giá trị trên. Dùng công cụ hình bàn tay (Poke), nhấp vào từng bit của ô `ADDR_A1_A0` để đổi địa chỉ và quan sát `DATA`. Giá trị được hiển thị ở bảng trong khối là hệ 16; đầu ra `DATA` là nhị phân. Nếu thấy các bit `U`, hãy dùng Poke đặt cả hai bit địa chỉ về 0 hoặc 1.

Để kiểm tra tự động: mở mạch, chọn **Simulate → Test Vector… → Load Vector**, chọn `01_rom_lecture/test_vector.txt`. Bốn dòng kiểm tra là bốn địa chỉ trong bảng trên.

## Bài 2: Lập bảng ROM cho Y

`Y = AB + not(A)B = B(A + not(A)) = B`.

Dù có thể nối trực tiếp B ra Y sau khi rút gọn, bài này vẫn dùng ROM 4 × 1 để luyện tra bảng:

| A | B | Địa chỉ AB | AB | not(A)B | Y |
|:-:|:-:|:---:|:-:|:---:|:-:|
| 0 | 0 | 00 | 0 | 0 | 0 |
| 0 | 1 | 01 | 0 | 1 | 1 |
| 1 | 0 | 10 | 0 | 0 | 0 |
| 1 | 1 | 11 | 1 | 0 | 1 |

Mở `02_rom_ham_logic/bai_2_rom.circ` và thay đổi địa chỉ như bài 1. Kiểm tra tự động qua **Simulate → Test Vector…** với `02_rom_ham_logic/test_vector.txt`.

## Lưu ý

Các ví dụ SystemVerilog là mô hình học tập; giả định về thời điểm đọc/ghi, reset và cực tính LED được ghi cạnh từng bài. Đề không chỉ định loại LED nên bài 4 chọn ngõ ra active-high và ghi rõ thứ tự bit. Tệp `.vcd` là dạng sóng mô phỏng, mở bằng GTKWave sau khi chạy testbench.
