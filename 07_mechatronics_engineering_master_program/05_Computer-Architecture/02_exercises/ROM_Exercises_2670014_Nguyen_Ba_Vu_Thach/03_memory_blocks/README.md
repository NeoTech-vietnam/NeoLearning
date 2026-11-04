# Bài 3 — Mô phỏng ROM, RAM, thanh ghi bằng SystemVerilog

Các mô hình theo Lecture 7 và tách module/testbench như các bài CPU:

- `rom.sv`: ROM 4 × 3, đọc tổ hợp. Với địa chỉ `00`, `01`, `10`, `11`, dữ liệu là `011`, `110`, `100`, `010`, theo slide 24–25. Không có ngõ ghi.
- `ram.sv`: RAM `2^N × M` theo tham số như slide; mặc định `N=6`, `M=32` tức 64 × 32; ghi tại cạnh lên `clk` khi `write_enable=1`; đọc không đồng bộ theo địa chỉ. RAM ban đầu chưa xác định; phải ghi trước khi đọc. Khi đọc và ghi cùng địa chỉ tại cạnh ghi, mô hình đọc dữ liệu mới sau cập nhật mô phỏng; phần cứng thực tế có thể phụ thuộc linh kiện.
- `register_file.sv`: 32 thanh ghi × 32 bit, hai cổng đọc không đồng bộ, một cổng ghi ở cạnh lên. Địa chỉ 0 luôn đọc ra 0; các thanh ghi khác chưa xác định cho đến khi được ghi. Bài giảng khai báo 32 thanh ghi nhưng dùng địa chỉ 6 bit; ở đây dùng **5 bit** để biểu diễn đúng địa chỉ 0–31. Ghi vào địa chỉ 0 được bỏ qua.
- `register_8bit.sv`: ví dụ bổ sung về một thanh ghi đơn 8 bit. Reset **đồng bộ** có ưu tiên hơn enable; ở cạnh lên reset đưa `q=0`, nếu không reset và enable thì nạp `d`, còn lại giữ giá trị. Trước cạnh reset/nạp đầu tiên, `q` chưa xác định. Đây là lựa chọn minh họa, không phải thông số bắt buộc trong đề.

## Chạy mô phỏng với Icarus Verilog

Mở PowerShell tại thư mục `03_memory_blocks`:

```powershell
# Neu dung NeoHDL tren may nay, uu tien thu muc DLL cua NeoHDL:
$env:PATH = "$env:LOCALAPPDATA\Programs\NeoHDL\ucrt64\bin;" + $env:PATH
New-Item -ItemType Directory -Force build | Out-Null
iverilog -g2012 -s tb_rom -o build/rom.vvp rom.sv tb_rom.sv
vvp build/rom.vvp
iverilog -g2012 -s tb_ram -o build/ram.vvp ram.sv tb_ram.sv
vvp build/ram.vvp
iverilog -g2012 -s tb_register_file -o build/register_file.vvp register_file.sv tb_register_file.sv
vvp build/register_file.vvp
iverilog -g2012 -s tb_register_8bit -o build/register_8bit.vvp register_8bit.sv tb_register_8bit.sv
vvp build/register_8bit.vvp
```

Mỗi testbench báo `PASS` sau khi kiểm tra và tạo một tệp VCD trong `build/` để xem bằng GTKWave. Test RAM ghi và đọc cả 64 ô, kiểm tra tắt ghi và thử cấu hình `N=2`, `M=8`; test register file kiểm tra cả hai cổng đọc, các thanh ghi và địa chỉ 0; test thanh ghi đơn kiểm tra reset, nạp, giữ và cạnh clock.
