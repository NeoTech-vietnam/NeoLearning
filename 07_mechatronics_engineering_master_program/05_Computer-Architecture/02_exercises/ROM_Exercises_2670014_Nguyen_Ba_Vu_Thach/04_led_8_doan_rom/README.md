# Bài 4 - ROM giải mã LED 8 đoạn

## Yêu cầu và quy ước

Dùng ROM làm bảng tra để hiển thị một chữ số hệ 16 từ `0` đến `F` trên LED 7 thanh và điều khiển thêm dấu chấm thập phân `dp` (tổng cộng 8 đoạn). Đề không quy định mã, cực tính hay cách dùng dấu chấm, nên bài này **giả sử** đầu ra active-high: `1` làm đoạn sáng, `0` làm đoạn tắt.

```text
       a
     -----
  f |     | b
    |  g  |
     -----
  e |     | c
    |     |
     -----  . dp
       d
```

ROM có 32 từ, mỗi từ 8 bit. Địa chỉ là `{dp_enable, hex_digit[3:0]}`; dữ liệu là `{dp,g,f,e,d,c,b,a}`, trong đó `a` là bit 0, `dp` là bit 7. Các từ ở địa chỉ `0x00`–`0x0F` để `dp` tắt; từ `0x10`–`0x1F` hiển thị cùng ký tự và bật `dp`. Tín hiệu ra thay đổi khi địa chỉ thay đổi, không cần xung clock. Chữ `b` và `d` hiển thị thường để phân biệt với `8` và `0`.

| Ký tự | Đoạn sáng (không tính dp) | Dữ liệu hex khi dp=0 |
|:--:|:--|:--:|
| 0 | a b c d e f | 3F |
| 1 | b c | 06 |
| 2 | a b d e g | 5B |
| 3 | a b c d g | 4F |
| 4 | b c f g | 66 |
| 5 | a c d f g | 6D |
| 6 | a c d e f g | 7D |
| 7 | a b c | 07 |
| 8 | a b c d e f g | 7F |
| 9 | a b c d f g | 6F |
| A | a b c e f g | 77 |
| b | c d e f g | 7C |
| C | a d e f | 39 |
| d | b c d e g | 5E |
| E | a d e f g | 79 |
| F | a e f g | 71 |

Ví dụ: chọn `hex_digit=4'h2`, `dp_enable=0` thì địa chỉ `00010`, ROM xuất `01011011` (`5B`), làm sáng a, b, d, e, g. Nếu bật dấu chấm, địa chỉ thành `10010` và dữ liệu thành `11011011` (`DB`).

## Các file

- `rom_led_8_doan.sv`: ROM và cổng đọc bất đồng bộ.
- `tb_rom_led_8_doan.sv`: kiểm tra toàn bộ 32 địa chỉ; xuất dạng sóng.
- `rom_led_8_doan.hex`: cùng nội dung theo định dạng `v2.0 raw` để nạp vào ROM Logisim-evolution; từ trái sang phải tương ứng địa chỉ tăng dần.
- `build/rom_led_8_doan.vcd`: dạng sóng được sinh khi chạy testbench; có thể mở bằng GTKWave.

## Tự chạy SystemVerilog

Tại PowerShell mở trong thư mục bài 4, với Icarus Verilog và GTKWave đã cài:

```powershell
# Neu dung NeoHDL tren may nay, uu tien thu muc DLL cua NeoHDL:
$env:PATH = "$env:LOCALAPPDATA\Programs\NeoHDL\ucrt64\bin;" + $env:PATH
New-Item -ItemType Directory -Force build | Out-Null
iverilog -g2012 -s tb_rom_led_8_doan -o build/rom_led_8_doan.vvp rom_led_8_doan.sv tb_rom_led_8_doan.sv
vvp build/rom_led_8_doan.vvp
gtkwave build/rom_led_8_doan.vcd
```

Kết quả mong đợi: `PASS: tat ca 32 dia chi ROM.` Testbench kiểm tra đầy đủ các mã và cả hai trạng thái `dp`, không chỉ các ví dụ được in trên màn hình. Việc khởi tạo ROM bằng `initial` có thể được công cụ FPGA hỗ trợ, nhưng khả năng tổng hợp và nội dung khởi tạo phụ thuộc công cụ/công nghệ đích; mô phỏng ở đây không chứng minh khả năng tổng hợp trên một chip cụ thể.

## Nạp bảng ROM vào Logisim-evolution

1. Thêm ROM, đặt `Address Bit Width = 5`, `Data Bit Width = 8` và cho phép chip hoạt động theo cấu hình của linh kiện.
2. Mở trình sửa nội dung ROM, nạp file `rom_led_8_doan.hex`. Địa chỉ nối 5 bit `{dp_enable, hex_digit}`: `dp_enable` là bit cao nhất.
3. Dùng splitter tách 8 bit dữ liệu; nối bit 0..7 lần lượt vào a, b, c, d, e, f, g, dp trên LED. Kiểm tra tên từng chân trong Logisim vì vị trí chân tùy cách đặt linh kiện.
4. Thử `hex_digit=2`, `dp_enable=0` và `1`: ROM phải lần lượt xuất `5B` và `DB`.

Với LED phần cứng active-low (thường gặp ở common-anode), phải đảo từng tín hiệu đầu ra hoặc chuyển bảng mã theo đúng cực tính và kiểm tra sơ đồ phần cứng; mã trong bài này là active-high.
