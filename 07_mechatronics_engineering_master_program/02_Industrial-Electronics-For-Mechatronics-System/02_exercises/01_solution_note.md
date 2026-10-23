# Chỉnh lưu cầu một pha nạp ắc quy qua điện trở

> **Ý chính:** Cầu diode giữ dòng qua ắc quy theo một chiều. Tuy nhiên, dòng chỉ chạy khi điện áp nguồn sau chỉnh lưu **lớn hơn 120 V**. Vì vậy, dòng nạp là các xung, không phải dòng không đổi 40 A.

Ngày: 2026-10-23 · Ghi chú Cornell

<p align="center"><strong><em>"DO NOT JUST TALK ABOUT IT — SHOW IT"</em></strong></p>

## 1. Đề bài và giả thiết

Dùng cầu chỉnh lưu một pha nạp điện cho ắc quy. Tính thời điểm bắt đầu nạp, điện trở nối tiếp, dòng tải hiệu dụng và hiệu suất. [S1]

| Ký hiệu | Ý nghĩa | Giá trị |
|---|---|---:|
| $U$ | Điện áp **hiệu dụng** của nguồn xoay chiều | $220\ \mathrm V$ |
| $f$ | Tần số nguồn | $50\ \mathrm{Hz}$ |
| $E$ | Sức điện động của ắc quy | $120\ \mathrm V$ |
| $I_d$ | Dòng nạp **trung bình**, giả thiết theo đề | $40\ \mathrm A$ |
| $R$ | Điện trở nối tiếp cần tìm | $\Omega$ |
| $I_{\mathrm{rms}}$ | Dòng nạp hiệu dụng cần tìm | $\mathrm A$ |

**Giả thiết tính toán:** diode lý tưởng, nguồn hình sin, $E$ không đổi; bỏ qua điện trở trong của nguồn và ắc quy; không có tụ lọc hoặc cuộn cảm.

> **An toàn:** Đây là mô hình bài tập, không phải thiết kế bộ sạc để chế tạo. Điện lưới 220 V không cách ly có thể gây điện giật chết người. Điện trở tính được tiêu tán hơn 6 kW; hệ thống thật cần cách ly và bảo vệ chuyên dụng.

### Câu hỏi gợi nhớ

| Câu hỏi | Ý cần nhớ |
|---|---|
| Vì sao đầu nửa chu kỳ chưa có dòng nạp? | Điện áp nguồn chưa thắng được sức điện động $E$. |
| $40\ \mathrm A$ có phải dòng tại mọi thời điểm? | Không. Đó là giá trị trung bình của dòng dạng xung. |
| Vì sao $I_{\mathrm{rms}}>I_d$? | RMS phản ánh tác dụng nhiệt của các xung dòng. |
| Hiệu suất phải nói rõ điều gì? | Công suất nào được coi là hữu ích. |

## 2. Sơ đồ nguyên lí và đường đi của dòng

Trong sơ đồ, `|>|` chỉ diode có **anode bên trái, cathode bên phải**. Các điểm cùng tên được nối điện với nhau.

```text
                  D1                      D2
     a o----------|>|---------o----------|<|----------o b
                              p (+)
                                |
                                R
                                |
                                v  i(t)
                                |
                              (+)
                           Ac quy E
                              (-)
                                |
                              n (-)
     a o----------|<|---------o----------|>|----------o b
                  D3                      D4

     Nguon AC:     a o--------(~)--------o b
                          220 V, 50 Hz
```

Để đọc đúng chiều diode:

| Diode | Anode | Cathode |
|---|---|---|
| D1 | a | p |
| D2 | b | p |
| D3 | n | a |
| D4 | n | b |

- **Khi a dương so với b:** dòng đi từ a, qua D1, R, cực dương ắc quy, cực âm ắc quy, D4 rồi về b.
- **Khi b dương so với a:** dòng đi từ b, qua D2, R, ắc quy, D3 rồi về a.
- Hai trường hợp đều nạp vào **cực dương ắc quy**, nhưng chỉ khi $|u(t)|>E$.

## 3. Câu 1 — Khi nào bắt đầu có dòng nạp?

### Bước 1: Đổi điện áp hiệu dụng sang biên độ

Điện áp tức thời của nguồn là:

$$
u(t)=U_m\sin(\omega t).
$$

Trong đó:

$$
U_m=\sqrt2\,U=220\sqrt2=311.127\ \mathrm V,
$$

$$
\omega=2\pi f=100\pi\ \mathrm{rad/s},
\qquad T=\frac1f=20\ \mathrm{ms}.
$$

**Chú ý:** $220\ \mathrm V$ là giá trị hiệu dụng; đỉnh sóng là $311.127\ \mathrm V$.

### Bước 2: Tìm góc bắt đầu dẫn

Xét nửa chu kỳ dương. Ngưỡng bắt đầu dẫn xảy ra khi:

$$
U_m\sin\alpha=E.
$$

Vì thế:

$$
\alpha=\arcsin\left(\frac{E}{U_m}\right)
=\arcsin\left(\frac{120}{311.127}\right)
=0.395961\ \mathrm{rad}
\approx22.6869^\circ.
$$

Tại đúng ngưỡng, dòng vẫn bằng không; ngay sau đó, điện áp nguồn lớn hơn $E$ nên dòng bắt đầu tăng.

### Bước 3: Đổi góc sang thời gian

$$
\boxed{t_1=\frac\alpha\omega
=\frac{0.395961}{100\pi}
=1.2604\ \mathrm{ms}}
$$

**Mốc đo:** điểm nguồn qua không ở đầu mỗi nửa chu kỳ.

Khi điện áp giảm trở lại bằng $E$, dòng ngừng:

$$
t_2=\frac{\pi-\alpha}{\omega}=8.7396\ \mathrm{ms}.
$$

| Nửa chu kỳ | Bắt đầu nạp | Ngừng nạp |
|---|---:|---:|
| Từ $0$ đến $10\ \mathrm{ms}$ | $1.2604\ \mathrm{ms}$ | $8.7396\ \mathrm{ms}$ |
| Từ $10$ đến $20\ \mathrm{ms}$ | $11.2604\ \mathrm{ms}$ | $18.7396\ \mathrm{ms}$ |

Dạng diễn biến trong mỗi nửa chu kỳ:

```text
Thoi gian:  0       1.2604 ms           8.7396 ms       10 ms
            |----------|-------------------|-------------|
Dong nap:      i = 0       i > 0, dang xung      i = 0
```

## 4. Câu 2 — Tính điện trở R

### Bước 1: Viết dòng điện trong khoảng dẫn

Khi diode dẫn, áp dụng định luật điện áp Kirchhoff:

$$
U_m\sin\theta=Ri+E,\qquad \theta=\omega t.
$$

Suy ra:

$$
i(\theta)=
\begin{cases}
\dfrac{U_m\sin\theta-E}{R}, & \alpha\leq\theta\leq\pi-\alpha,\\[6pt]
0, & \text{ngoài khoảng dẫn trong nửa chu kỳ.}
\end{cases}
$$

### Bước 2: Lấy trung bình trên cả nửa chu kỳ

Hai nửa chu kỳ tạo dòng tải giống nhau, nên chỉ cần lấy trung bình trên khoảng góc dài $\pi$:

$$
I_d=\frac1\pi\int_0^\pi i(\theta)\,d\theta
=\frac1{\pi R}\int_\alpha^{\pi-\alpha}
\left(U_m\sin\theta-E\right)d\theta.
$$

**Vì sao chia cho $\pi$, không chia cho $\pi-2\alpha$?** Vì $40\ \mathrm A$ là trung bình theo toàn bộ thời gian, gồm cả lúc dòng bằng không.

Tính tích phân:

$$
I_d=\frac{\left[-U_m\cos\theta-E\theta\right]_\alpha^{\pi-\alpha}}{\pi R}
=\frac{2U_m\cos\alpha-E(\pi-2\alpha)}{\pi R}.
$$

### Bước 3: Giải R và thay số

$$
R=\frac{2U_m\cos\alpha-E(\pi-2\alpha)}{\pi I_d}
$$

$$
=\frac{2(311.127)\cos(0.395961)-120(\pi-2\times0.395961)}{40\pi}.
$$

$$
\boxed{R\approx2.3248\ \Omega}
$$

Không dùng ngay $R=(0.9U-E)/I_d$: cách đó chưa xét khoảng **không có dòng** do ắc quy chặn.

## 5. Câu 3 — Tính dòng tải hiệu dụng

Dòng hiệu dụng dùng để tính tác dụng nhiệt. Định nghĩa:

$$
I_{\mathrm{rms}}=\sqrt{\frac1\pi\int_0^\pi i^2(\theta)\,d\theta}.
$$

Thế biểu thức dòng vào:

$$
I_{\mathrm{rms}}^2=\frac1{\pi R^2}
\int_\alpha^{\pi-\alpha}
\left(U_m\sin\theta-E\right)^2d\theta.
$$

Khai triển bình phương:

$$
\left(U_m\sin\theta-E\right)^2
=U_m^2\sin^2\theta-2U_mE\sin\theta+E^2.
$$

Đặt $\beta=\pi-2\alpha$. Các tích phân cần dùng là:

$$
\int_\alpha^{\pi-\alpha}\sin^2\theta\,d\theta
=\frac\beta2+\frac{\sin2\alpha}{2},
\qquad
\int_\alpha^{\pi-\alpha}\sin\theta\,d\theta=2\cos\alpha.
$$

Vì $U_m\sin\alpha=E$, rút gọn được:

$$
I_{\mathrm{rms}}^2=
\frac{\left(\dfrac{U_m^2}{2}+E^2\right)\beta-3U_mE\cos\alpha}{\pi R^2}.
$$

Thay số với $\beta\approx2.349672\ \mathrm{rad}$:

$$
\boxed{I_{\mathrm{rms}}\approx51.0319\ \mathrm A}
$$

**Kiểm tra hợp lí:** $51.03>40$. Dòng dạng xung có RMS lớn hơn giá trị trung bình.

## 6. Câu 4 — Tính hiệu suất

### Cách hiểu phù hợp mục đích nạp ắc quy

Chọn **công suất đưa vào sức điện động ắc quy** là công suất hữu ích. Đây là hiệu suất điện theo mô hình, không phải hiệu suất hóa học thực tế của ắc quy.

**Công suất nạp hữu ích:**

$$
P_E=EI_d=120\times40=4800\ \mathrm W.
$$

**Công suất tổn hao trên R:**

$$
P_R=RI_{\mathrm{rms}}^2
=2.3248353\times51.0319193^2
=6054.47\ \mathrm W.
$$

Phải dùng $I_{\mathrm{rms}}^2R$, **không phải** $I_d^2R$.

**Công suất lấy từ nguồn:** diode lý tưởng không tổn hao, nên

$$
P_{\mathrm{in}}=P_E+P_R=4800+6054.47=10854.47\ \mathrm W.
$$

Vậy:

$$
\boxed{\eta_{\mathrm{nạp}}=\frac{P_E}{P_{\mathrm{in}}}
=\frac{4800}{10854.47}\approx44.22\%}
$$

### Vì sao có thể gặp đáp án hiệu suất khác?

Đề chỉ ghi “hiệu suất của thiết bị”, chưa định nghĩa công suất hữu ích. Khi nộp bài, nên ghi rõ định nghĩa đang dùng.

| Cách định nghĩa | Công thức | Kết quả |
|---|---|---:|
| **Hiệu suất nạp hữu ích** của toàn mạch | $EI_d/P_{\mathrm{in}}$ | **44.22%** |
| Tỉ số công suất thành phần DC trên toàn tải so với đầu vào | $(E+RI_d)I_d/P_{\mathrm{in}}$ | **78.49%** |
| Hiệu suất riêng cầu diode lý tưởng, không tính R | Công suất ra cầu / công suất vào cầu | **100%** |

Ở cách thứ hai, $E+RI_d$ là điện áp tải trung bình; công suất DC có chứa cả phần $RI_d^2$, nên **không đồng nghĩa với công suất nạp hữu ích**.

Không áp dụng máy móc **81.2%**: đó là tỉ số công suất DC quen thuộc của cầu lý tưởng với **tải thuần trở**, khác tải $R$–$E$ ở đây.

## 7. Tổng kết — Bốn đáp số cần nhớ

| Yêu cầu | Kết quả | Điều kiện diễn giải |
|---|---:|---|
| Thời điểm bắt đầu nạp $t_1$ | **1.2604 ms** | Sau điểm không đầu mỗi nửa chu kỳ |
| Điện trở nối tiếp $R$ | **2.3248 Ω** | Để dòng trung bình bằng 40 A |
| Dòng tải hiệu dụng | **51.0319 A** | Tính cả thời gian không dẫn |
| Hiệu suất nạp hữu ích | **44.22%** | Công suất hữu ích là $EI_d$ |

**Mạch chỉ nạp khi $|u|>E$. Trung bình dùng để tính dòng nạp; RMS dùng để tính nhiệt.**

## 8. Minh họa và tự luyện

### Minh họa: dòng tại đỉnh sóng

[inferred] Tại đỉnh sóng, nguồn đạt $311.127\ \mathrm V$:

$$
i_{\max}=\frac{U_m-E}{R}
=\frac{311.127-120}{2.3248353}
\approx82.21\ \mathrm A.
$$

Tại điểm không, $i=0$. Vì thế, **40 A trung bình không có nghĩa dòng luôn bằng 40 A**.

### Bài tự luyện

Giữ nguyên nguồn và ắc quy, giảm dòng trung bình xuống **20 A**:

1. Góc bắt đầu dẫn có thay đổi không?
2. $R$ và $I_{\mathrm{rms}}$ thay đổi thế nào?
3. Hiệu suất nạp hữu ích có thay đổi không?

[Bài tập riêng](01_practice.md) · [Đáp án — xem sau khi tự giải](01_practice_answer.md)

### Các lỗi thường gặp

- Dùng $220$ thay cho $220\sqrt2$ khi viết điện áp tức thời.
- Chỉ lấy trung bình trên khoảng dẫn.
- Đồng nhất dòng trung bình với dòng hiệu dụng.
- Tính tổn hao bằng $RI_d^2$.
- Nêu một con số hiệu suất nhưng không nói định nghĩa.

## 9. Phụ lục — Kiểm tra và nguồn tham khảo

### Phạm vi xác minh

- **Dữ kiện:** lấy từ đề [S1]. Các bước giải là suy luận theo giả thiết ở mục 1.
- **Rà soát trước đây:** [S2] xác nhận công thức; không phải kiểm chứng phần cứng hoặc rà soát bản trình bày mới này.
- **Kiểm tra số trước đây:** báo cáo phiên làm việc ghi nhận tích phân midpoint 200.000 mẫu cho trung bình $39.99999999949775\ \mathrm A$ và RMS $51.03191934203767\ \mathrm A$; các assert đạt, mã thoát 0. Đây là kết quả được báo cáo, chưa có bản ghi kiểm chứng bất biến.
- **Giới hạn:** chưa thử mạch thật. Không coi ghi chú này là thiết kế bộ sạc đã được nghiệm thu. Chỉ dùng nguồn cục bộ; upstream not searched.

### Kiểm tra nhanh điện trở bằng Python

Lệnh dưới dạng danh sách đối số; chỉ kiểm tra **R**, không kiểm tra toàn bộ bài:

```json
["python","-c","import math;v=220*math.sqrt(2);a=math.asin(120/v);r=(2*v*math.cos(a)-120*(math.pi-2*a))/(40*math.pi);assert abs(r-2.3248353048152)<1e-10;print(r)"]
```

[expected] In giá trị xấp xỉ `2.3248353048152`; assert không báo lỗi. Không khẳng định đã chạy lại lệnh này trong lần sửa trình bày.

Kiểm tra nhanh quan hệ điện trở của bài tự luyện:

```json
["python","-c","assert abs(2*2.3248353048152-4.6496706096304)<1e-10;print(\"PASS\")"]
```

[expected] In `PASS`. Đây chỉ là kiểm tra quan hệ gấp đôi điện trở, không thay thế phần giải thích vật lí.

### Nguồn

- **[S1]** [Đề bài gốc — câu 1–4](01_requirements.md). Đọc ngày 2026-10-23. SHA-256: `991c40c7e1b7a1665912060779b87584d589bbcd3367395768db2378a38d1eb5`.
- **[S2]** Báo cáo rà soát công thức `NM-11D03369-KNW-0012`; nguồn quản lý `record:NM-11D03369-KNW-0012`, đọc ngày 2026-10-23. Báo cáo thuộc phiên bản trước khi viết lại phần trình bày.
