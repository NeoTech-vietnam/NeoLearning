# Lời giải toàn bộ bài tập Logic tổ hợp

**Nguồn:** [Bài tập Logic Tổ hợp.pdf](Bài%20tập%20Logic%20Tổ%20hợp.pdf), 8 trang, Bài 1-17.

Tài liệu trình bày lời giải, bước biến đổi, bảng chân trị/bìa Karnaugh và cách nối mạch cho toàn bộ các câu. Các biểu thức có dấu phủ định được đối chiếu trực tiếp với hình trang PDF.

## Quy ước

- $+$ là OR; viết liền hoặc $\cdot$ là AND; $\overline A$ là NOT; $\oplus$ là XOR.
- Chỉ số minterm theo thứ tự biến ghi trong đề, biến bên trái là MSB: $m=8A+4B+2C+D$ với bốn biến.
- $\Sigma m$ liệt kê các hàng có đầu ra 1; $\Pi M$ liệt kê các hàng có đầu ra 0.
- Bìa Karnaugh dùng thứ tự Gray $00,01,11,10$; hai mép đối diện kề nhau. `x` là don't care: được chọn 0 hoặc 1 để rút gọn, không phải ngõ vào bắt buộc bằng 0.
- Trong sơ đồ chữ, mỗi khối có tên cổng là một cổng thật; nhãn tín hiệu trùng nhau chỉ cùng một dây. `NAND(u,v)` là $\overline{uv}$; `NOR(u,v)` là $\overline{u+v}$. `NOT`, `AND`, `OR` có nghĩa thông thường.
- Ngoài các câu ghi rõ “2 ngõ vào”, cho phép dùng cổng nhiều ngõ vào. MUX chọn $D_i$ khi mã chọn bằng $i$.

**Các điểm cần lưu ý trong đề:** Bài 2c có một tích bị lặp; Bài 9 ghi không nhất quán số ngõ ra; Bài 17 cần khả năng đảo ngõ ra để vừa 5 tích. Các điểm này được giải thích tại từng bài.

## Bài 1. SOP, POS, rút gọn và hiện thực cổng

*Nguồn: trang 1. Có 5 bảng, tương ứng (a)-(e); mỗi bảng cần giải đủ sáu yêu cầu (i)-(vi).*

Với một hàng đầu vào, minterm lấy biến thường khi bit bằng 1, biến đảo khi bit bằng 0. Maxterm làm ngược lại. Ví dụ, hàng $ABC=010$ cho $m_2=\overline A B\overline C$ và $M_2=A+\overline B+C$.

### 1a

**(i) SOP chính tắc:**

$$
Y=\Sigma m(0,2,3)
$$

$$
Y=\overline{A}\overline{B}+A\overline{B}+AB
$$

**(ii) POS chính tắc:**

$$
Y=\Pi M(1)
$$

$$
\begin{aligned}
Y={}&(A+\overline{B})
\end{aligned}
$$

**(iii) Rút gọn:**

Các nhóm minterm: $\{0,2\}\to \overline{B}$; $\{2,3\}\to A$.

$$
\boxed{Y=\overline{B}+A}
$$

**(iv)-(v) Cổng logic và mạch chỉ dùng NOT, AND, OR:**

```text
B ──[NOT]── B' ──┐
                 [OR]── Y
A ───────────────┘
```

**(vi) Chỉ dùng NOT, NAND, NOR:**

$$Y=\operatorname{NAND}(\overline A,B).$$

Một NOT tạo $\overline A$, sau đó đưa $\overline A,B$ vào NAND.

### 1b

**(i) SOP chính tắc:**

$$
Y=\Sigma m(0,7)
$$

$$
Y=\overline{A}\overline{B}\overline{C}+ABC
$$

**(ii) POS chính tắc:**

$$
Y=\Pi M(1,2,3,4,5,6)
$$

$$
\begin{aligned}
Y={}&(A+B+\overline{C})(A+\overline{B}+C)(A+\overline{B}+\overline{C})\\
&\cdot (\overline{A}+B+C)(\overline{A}+B+\overline{C})(\overline{A}+\overline{B}+C)
\end{aligned}
$$

**(iii) Rút gọn:**

Các nhóm minterm: $\{0\}\to \overline{A}\overline{B}\overline{C}$; $\{7\}\to ABC$.

$$
\boxed{Y=\overline{A}\overline{B}\overline{C}+ABC}
$$

**(iv) Mạch dùng cổng logic:**

$$Y=\overline{A\oplus B}\;\overline{B\oplus C}.$$

```text
A,B ──[XNOR]── p ──┐
                    [AND]── Y
B,C ──[XNOR]── q ──┘
```

Hai kết quả so sánh đều bằng 1 khi $A=B=C$.

**(v) Chỉ NOT, AND, OR:** tạo $\overline A,\overline B,\overline C$ bằng ba NOT; nối mạch:

```text
A',B',C' ──[AND3]── p ──┐
                        [OR]── Y
A, B, C  ──[AND3]── q ──┘
```

**(vi) Chỉ NOT, NAND, NOR:** dùng cùng ba tín hiệu đảo và:

$$n_1=\operatorname{NAND}(\overline A,\overline B,\overline C),\quad
n_2=\operatorname{NAND}(A,B,C),\quad
Y=\operatorname{NAND}(n_1,n_2).$$

Đây là mạch NAND-NAND tương đương SOP.

### 1c

**(i) SOP chính tắc:**

$$
Y=\Sigma m(0,2,4,5,7)
$$

$$
\begin{aligned}
Y={}&\overline{A}\overline{B}\overline{C}+\overline{A}B\overline{C}+A\overline{B}\overline{C}+\\
&A\overline{B}C+ABC
\end{aligned}
$$

**(ii) POS chính tắc:**

$$
Y=\Pi M(1,3,6)
$$

$$
\begin{aligned}
Y={}&(A+B+\overline{C})(A+\overline{B}+\overline{C})(\overline{A}+\overline{B}+C)
\end{aligned}
$$

**(iii) Rút gọn:**

Các nhóm minterm: $\{0,2\}\to \overline{A}\overline{C}$; $\{5,7\}\to AC$; $\{0,4\}\to \overline{B}\overline{C}$.

$$
\boxed{Y=\overline{A}\overline{C}+AC+\overline{B}\overline{C}}
$$

**(iv)-(v) Cổng logic và mạch chỉ NOT, AND, OR:** tạo các tín hiệu đảo cần thiết rồi nối:

```text
A',C' ──[AND]── p1 ──┐
A, C  ──[AND]── p2 ──[OR3]── Y
B',C' ──[AND]── p3 ──┘
```

**(vi) Chỉ NOT, NAND, NOR:**

$$
\begin{aligned}
n_1&=\operatorname{NAND}(\overline A,\overline C),\\
n_2&=\operatorname{NAND}(A,C),\\
n_3&=\operatorname{NAND}(\overline B,\overline C),\\
Y&=\operatorname{NAND}(n_1,n_2,n_3).
\end{aligned}
$$

### 1d

**(i) SOP chính tắc:**

$$
Y=\Sigma m(0,1,2,3,8,10,14)
$$

$$
\begin{aligned}
Y={}&\overline{A}\overline{B}\overline{C}\overline{D}+\overline{A}\overline{B}\overline{C}D+\overline{A}\overline{B}C\overline{D}+\\
&\overline{A}\overline{B}CD+A\overline{B}\overline{C}\overline{D}+A\overline{B}C\overline{D}+\\
&ABC\overline{D}
\end{aligned}
$$

**(ii) POS chính tắc:**

$$
Y=\Pi M(4,5,6,7,9,11,12,13,15)
$$

$$
\begin{aligned}
Y={}&(A+\overline{B}+C+D)(A+\overline{B}+C+\overline{D})(A+\overline{B}+\overline{C}+D)\\
&\cdot (A+\overline{B}+\overline{C}+\overline{D})(\overline{A}+B+C+\overline{D})(\overline{A}+B+\overline{C}+\overline{D})\\
&\cdot (\overline{A}+\overline{B}+C+D)(\overline{A}+\overline{B}+C+\overline{D})(\overline{A}+\overline{B}+\overline{C}+\overline{D})
\end{aligned}
$$

**(iii) Rút gọn:**

Các nhóm minterm: $\{0,1,2,3\}\to \overline{A}\overline{B}$; $\{0,2,8,10\}\to \overline{B}\overline{D}$; $\{10,14\}\to AC\overline{D}$.

$$
\boxed{Y=\overline{A}\overline{B}+\overline{B}\overline{D}+AC\overline{D}}
$$

**(iv)-(v) Cổng logic và mạch chỉ NOT, AND, OR:**

```text
A',B'   ──[AND2]── p1 ──┐
B',D'   ──[AND2]── p2 ──[OR3]── Y
A,C,D'  ──[AND3]── p3 ──┘
```

Tạo $\overline A,\overline B,\overline D$ bằng NOT.

**(vi) Chỉ NOT, NAND, NOR:**

$$
\begin{aligned}
n_1&=\operatorname{NAND}(\overline A,\overline B),\\
n_2&=\operatorname{NAND}(\overline B,\overline D),\\
n_3&=\operatorname{NAND}(A,C,\overline D),\\
Y&=\operatorname{NAND}(n_1,n_2,n_3).
\end{aligned}
$$

### 1e

**(i) SOP chính tắc:**

$$
Y=\Sigma m(0,3,5,6,9,10,12,15)
$$

$$
\begin{aligned}
Y={}&\overline{A}\overline{B}\overline{C}\overline{D}+\overline{A}\overline{B}CD+\overline{A}B\overline{C}D+\\
&\overline{A}BC\overline{D}+A\overline{B}\overline{C}D+A\overline{B}C\overline{D}+\\
&AB\overline{C}\overline{D}+ABCD
\end{aligned}
$$

**(ii) POS chính tắc:**

$$
Y=\Pi M(1,2,4,7,8,11,13,14)
$$

$$
\begin{aligned}
Y={}&(A+B+C+\overline{D})(A+B+\overline{C}+D)(A+\overline{B}+C+D)\\
&\cdot (A+\overline{B}+\overline{C}+\overline{D})(\overline{A}+B+C+D)(\overline{A}+B+\overline{C}+\overline{D})\\
&\cdot (\overline{A}+\overline{B}+C+\overline{D})(\overline{A}+\overline{B}+\overline{C}+D)
\end{aligned}
$$

**(iii) Rút gọn:**

Các hàng bằng 1 đều có số bit 1 chẵn. Không có hai ô 1 kề nhau trên bìa Karnaugh, nên SOP hai tầng không gộp được tích nào. Nếu cho phép XOR/XNOR, biểu thức gọn là:

$$
\boxed{Y=\overline{A\oplus B\oplus C\oplus D}}
$$

**(iv) Mạch dùng XOR:**

```text
A,B ──[XOR]── p ──┐
                   [XOR]── r ──[NOT]── Y
C,D ──[XOR]── q ──┘
```

**(v) Chỉ NOT, AND, OR:** hiện thực ba XOR trong sơ đồ trên bằng khối:

$$\operatorname{XOR}(u,v)=u\overline v+\overline u v.$$

Mỗi khối gồm hai NOT, hai AND và một OR; nối ba khối theo sơ đồ rồi đảo kết quả. Một lựa chọn khác là tám AND4 tạo tám minterm của SOP chính tắc, sau đó OR8.

**(vi) Chỉ NOT, NAND, NOR:** thay mỗi XOR bằng bốn NAND2:

$$
\begin{aligned}
t&=\operatorname{NAND}(u,v),\\
p&=\operatorname{NAND}(u,t),\qquad q=\operatorname{NAND}(v,t),\\
\operatorname{XOR}(u,v)&=\operatorname{NAND}(p,q).
\end{aligned}
$$

Nối ba khối này như (iv), rồi dùng NOT ở đầu ra: tổng cộng 12 NAND2 và 1 NOT. Có thể thay NOT cuối bằng NAND2 nối chung hai đầu vào để dùng hoàn toàn NAND.


## Bài 2. Rút gọn bằng đại số Boole

*Nguồn: trang 1.*

### 2a

$$
Y=\overline A BC+\overline A B\overline C
=\overline A B(C+\overline C)
=\boxed{\overline A B}.
$$

Dùng luật phân phối và luật bù $C+\overline C=1$.

### 2b

Dấu gạch ở số hạng thứ hai phủ **$BCD$**, không phủ $A$. Đề được đọc là:

$$Y=ABC\overline D+A\overline{BCD}+\overline{A+B+C+D}.$$

Áp dụng De Morgan:

$$Y=ABC\overline D+A(\overline B+\overline C+\overline D)
+\overline A\overline B\overline C\overline D.$$

$ABC\overline D$ bị hấp thụ bởi $A\overline D$. Đặt $Q=\overline B\overline C\overline D$ và $R=\overline B+\overline C+\overline D$. Vì $Q$ kéo theo $R$:

$$AR+\overline A Q=AR+Q.$$

Có thể kiểm tra bằng cách viết $Q=AQ+\overline A Q$, trong đó $AQ$ bị $AR$ hấp thụ. Vậy:

$$\boxed{Y=A\overline B+A\overline C+A\overline D+\overline B\overline C\overline D}.$$

Dạng đặt nhân tử tương đương:

$$\boxed{Y=A(\overline B+\overline C+\overline D)+\overline B\overline C\overline D}.$$

### 2c

Đọc đúng biểu thức trong PDF:

$$
\begin{aligned}
Y={}&ABC+ABD+ABE+ACD+ACE+\overline{(A+D+E)}\\
&+\overline B\overline C D+\overline B\overline C E
+\overline B\overline C E
+\overline B\overline D\overline E+\overline C\overline D\overline E.
\end{aligned}
$$

Số hạng $\overline B\overline C E$ xuất hiện hai lần; bỏ một lần theo $X+X=X$.

Đặt $Q=D+E$, nên $\overline Q=\overline D\overline E$. Gom nhóm:

$$
Y=A[BC+(B+C)Q]+\overline A\overline Q
+\overline B\overline C Q+(\overline B+\overline C)\overline Q.
$$

**Khi $A=0$:**

$$Y_0=\overline Q+\overline B\overline C Q
=\overline Q+\overline B\overline C.$$

Đã dùng $X+\overline X Z=X+Z$; các tích còn chứa $\overline Q$ bị hấp thụ.

**Khi $A=1$:**

$$
\begin{aligned}
Y_1
&=BC+[(B+C)+\overline B\overline C]Q
 +(\overline B+\overline C)\overline Q\\
&=BC+Q+\overline{BC}\,\overline Q\\
&=(BC+Q)+\overline{(BC+Q)}=1.
\end{aligned}
$$

Khai triển theo $A$ rồi hấp thụ:

$$Y=AY_1+\overline A Y_0
=A+\overline A(\overline Q+\overline B\overline C).$$

$$\boxed{Y=A+\overline B\overline C+\overline D\overline E}.$$

### Kiểm chứng yêu cầu của Bài 2

Đã kiểm tra bằng chương trình mô phỏng logic tổ hợp: so sánh biểu thức gốc và biểu thức rút gọn tại mọi tổ hợp đầu vào, không có sai khác.

| Câu | Số tổ hợp đã kiểm tra | Chỉ số đầu vào cho $Y=1$ |
|---|---:|---|
| 2a | 8 | 2, 3 |
| 2b | 16 | 0, 8, 9, 10, 11, 12, 13, 14 |
| 2c | 32 | 0, 1, 2, 3, 4, 8, 12 và toàn bộ 16-31 |

Đây là kiểm chứng chức năng bằng bảng chân trị, không phải mô phỏng trễ transistor. Để dựng lại trong phần mềm mạch số, nối mạch gốc và mạch rút gọn song song, đưa hai đầu ra vào XOR rồi quét tất cả đầu vào; XOR phải luôn bằng 0.

## Bài 3. Đọc mạch và rút gọn hai đầu ra

*Nguồn: phần yêu cầu ở trang 1, sơ đồ ở đầu trang 2.*

### a) Biểu thức từ sơ đồ

Đánh số năm cổng AND từ trên xuống dưới. Các dây nối vào từng cổng là:

| Cổng | Tích đầu ra | Nối đến |
|---|---|---|
| $P_1$ | $\overline A D$ | $Y$ |
| $P_2$ | $BD$ | $Z$ |
| $P_3$ | $A\overline C D$ | $Y$, $Z$ |
| $P_4$ | $A\overline B C$ | $Y$ |
| $P_5$ | $ABCD$ | $Y$ |

Vì hai cổng cuối là OR:

$$\boxed{Y=\overline A D+A\overline C D+A\overline B C+ABCD}$$

$$\boxed{Z=BD+A\overline C D}.$$

### b) Rút gọn

Tách $A\overline B C=A\overline B C\overline D+A\overline B CD$:

$$
\begin{aligned}
Y
&=D(\overline A+A\overline C+A\overline B C+ABC)
 +A\overline B C\overline D\\
&=D[\overline A+A(\overline C+\overline B C+BC)]
 +A\overline B C\overline D\\
&=D[\overline A+A(\overline C+C)]
 +A\overline B C\overline D\\
&=D+A\overline B C\overline D
=\boxed{D+A\overline B C}.
\end{aligned}
$$

Đầu ra còn lại:

$$\boxed{Z=D(B+A\overline C)}.$$

Hai tích của $Z$ đều cần thiết: hàng $ABCD=0101$ cần $BD$, còn hàng $1001$ cần $A\overline C D$.

## Bài 4. Karnaugh có don't care

*Nguồn: trang 2. Hàng là $AB$, cột là $CD$.*

### 4a

$$Y=\Sigma m(8,11,12,13,15),\qquad d=\Sigma m(0,1,2,5,7,10,14).$$

| $AB\backslash CD$ | 00 | 01 | 11 | 10 |
|---|---:|---:|---:|---:|
| 00 | x | x | 0 | x |
| 01 | 0 | x | x | 0 |
| 11 | 1 | 1 | 1 | x |
| 10 | 1 | 0 | 1 | x |

Chọn ba nhóm bốn ô:

| Nhóm | Các chỉ số ô | Tích |
|---|---|---|
| 1 | 8, 10, 12, 14 | $A\overline D$ |
| 2 | 10, 11, 14, 15 | $AC$ |
| 3 | 12, 13, 14, 15 | $AB$ |

Nhóm 1 nối qua mép trái/phải của bìa. Chỉ dùng các ô 1 và `x`, không nhóm ô 0.

$$\boxed{Y=A\overline D+AC+AB=A(\overline D+C+B)}.$$

### 4b

$$Y=\Sigma m(1,8,11,13,15),\qquad d=\Sigma m(2,3,5,6,7,14).$$

| $AB\backslash CD$ | 00 | 01 | 11 | 10 |
|---|---:|---:|---:|---:|
| 00 | 0 | 1 | x | x |
| 01 | 0 | x | x | x |
| 11 | 0 | 1 | 1 | x |
| 10 | 1 | 0 | 1 | 0 |

| Nhóm | Các chỉ số ô | Tích |
|---|---|---|
| 1 | 1, 3, 5, 7 | $\overline A D$ |
| 2 | 3, 7, 11, 15 | $CD$ |
| 3 | 5, 7, 13, 15 | $BD$ |
| 4 | 8 | $A\overline B\overline C\overline D$ |

Ô 8 bị cô lập: bốn ô kề 0, 9, 10, 12 đều bằng 0, nên không được gộp.

$$\boxed{Y=\overline A D+CD+BD+A\overline B\overline C\overline D}.$$

Dạng đặt nhân tử:

$$Y=D(\overline A+B+C)+A\overline B\overline C\overline D.$$

Ở cả hai câu, đầu ra tại các hàng `x` được phép khác với một cách chọn don't care khác; chỉ các hàng xác định phải khớp.

## Bài 5. Rút gọn biểu thức có phủ định toàn bộ

*Nguồn: đầu trang 3. Trong cả bốn câu, gạch dài phủ toàn bộ biểu thức bên trong.*

### 5a

$$X=\overline{\overline A(B+C+D)+A+\overline D}.$$

Dùng $A+\overline A K=A+K$:

$$X=\overline{A+B+C+D+\overline D}=\overline 1=\boxed{0}.$$

### 5b

$$X=\overline{\overline A B(C+D)+A\overline D}.$$

Có thể áp dụng De Morgan để được POS:

$$X=(A+\overline B+\overline C\overline D)(\overline A+D).$$

Rút gọn thuận tiện bằng cách xét $A$:

- $A=0$: $X=\overline{B(C+D)}=\overline B+\overline C\overline D$.
- $A=1$: $X=\overline{\overline D}=D$.

$$\boxed{X=\overline A\overline B+\overline A\overline C\overline D+AD}.$$

### 5c

Trong số hạng cuối, chỉ **$B$** có gạch riêng; $C$ không bị đảo:

$$Y=\overline{\overline A(BC+\overline B\overline C)+A\overline B C}.$$

- $A=0$: $Y=\overline{BC+\overline B\overline C}=B\overline C+\overline B C$.
- $A=1$: $Y=\overline{\overline B C}=B+\overline C$.

Do đó:

$$Y=\overline A B\overline C+\overline A\overline B C+AB+A\overline C.$$

Gom $\overline A B\overline C+AB=B(\overline A\overline C+A)=B\overline C+AB$:

$$\boxed{Y=B\overline C+AB+A\overline C+\overline A\overline B C}.$$

Bốn nhóm phủ các ô 1 là $(2,6)$, $(6,7)$, $(4,6)$ và ô đơn $1$.

### 5d

Trong số hạng cuối, chỉ **$B$** có gạch riêng; $C,D$ không bị đảo:

$$Y=\overline{\overline A(B+\overline C D)+A\overline B CD}.$$

- $A=0$: $Y=\overline B(C+\overline D)$.
- $A=1$: $Y=B+\overline C+\overline D$.

Khai triển:

$$Y=\overline A\overline B C+\overline A\overline B\overline D+AB+A\overline C+A\overline D.$$

Nhóm các tích chứa $\overline D$:

$$\overline A\overline B\overline D+A\overline D
=\overline B\overline D+A\overline D.$$

Lại có $A\overline D=AB\overline D+A\overline B\overline D$, bị $AB+\overline B\overline D$ hấp thụ. Kết quả:

$$\boxed{Y=\overline B\overline D+\overline A\overline B C+AB+A\overline C}.$$

## Bài 6. Dùng NAND2 làm cổng cơ bản và MUX

*Nguồn: trang 3. Đặt $N(u,v)=\overline{uv}$.*

**Lưu ý về phần dẫn của đề:** NAND2 và NOR2 CMOS tĩnh bổ sung đều dùng 4 transistor; AND2/OR2 thông thường dùng 6 khi ghép cổng đảo. Vì vậy, không nên hiểu “NAND ít transistor hơn NOR” hoặc “NAND luôn nhanh hơn mọi cổng” là kết luận tổng quát. Phần tính dưới đây dùng đúng giả thiết đề: **mỗi NAND2 là 4 transistor**, không tối ưu lại ở cấp transistor.

### (i-a) Biểu thức và sơ đồ

**NOT: một NAND2 nối chung hai ngõ vào.**

$$Y=N(A,A)=\overline A.$$

```text
A ──┬──► in1 ┌───────┐
    └──► in2 │ NAND2 │──► Y
             └───────┘
```

**AND: hai NAND2.**

$$t=N(A,B),\qquad Y=N(t,t)=AB.$$

```text
A,B ──[NAND2]── t ──[NAND2: t,t]── Y
```

**OR: ba NAND2, dùng De Morgan.**

$$a=N(A,A),\quad b=N(B,B),\quad Y=N(a,b)=\overline{\overline A\overline B}=A+B.$$

```text
A ──[NAND2: A,A]── a ──┐
                       [NAND2]── Y
B ──[NAND2: B,B]── b ──┘
```

**XOR: bốn NAND2.**

$$t=N(A,B),\quad p=N(A,t),\quad q=N(B,t),\quad Y=N(p,q).$$

Chứng minh:

$$Y=At+Bt=(A+B)\overline{AB}=A\overline B+\overline A B=A\oplus B.$$

```text
A,B ──[NAND2]── t
A,t ──[NAND2]── p ──┐
                     [NAND2]── Y
B,t ──[NAND2]── q ──┘
```

### (i-b) Số transistor

| Chức năng | Số NAND2 | Số transistor theo cấu trúc NAND2 |
|---|---:|---:|
| NOT | 1 | 4 |
| AND | 2 | 8 |
| OR | 3 | 12 |
| XOR | 4 | 16 |

Đây là số transistor của cách ghép NAND đã yêu cầu. Một inverter CMOS trực tiếp chỉ cần 2 transistor, nhưng không phải cách triển khai “chỉ dùng NAND2” đang xét.

### (ii-a) Đổi MUX sang NAND-NAND

$$Y=\overline S D_0+SD_1
=\overline{\overline{\overline S D_0}\;\overline{SD_1}}.$$

### (ii-b) Sơ đồ chỉ dùng NAND

$$s_n=N(S,S),\quad p=N(s_n,D_0),\quad q=N(S,D_1),\quad Y=N(p,q).$$

```text
S ──[NAND2: S,S]── s_n
s_n,D0 ──[NAND2]── p ──┐
                        [NAND2]── Y
S,D1   ──[NAND2]── q ──┘
```

Mạch gồm 4 NAND2, tương ứng 16 transistor theo giả thiết. Khi $S=0$, $Y=D_0$; khi $S=1$, $Y=D_1$.

### (ii-c) Đường trễ tới hạn

Giả sử mọi NAND có cùng trễ $t_{pd}$, bỏ qua trễ dây và sai khác tải:

| Đường truyền | Số tầng NAND | Trễ |
|---|---:|---:|
| $D_0\to p\to Y$ | 2 | $2t_{pd}$ |
| $D_1\to q\to Y$ | 2 | $2t_{pd}$ |
| $S\to q\to Y$ | 2 | $2t_{pd}$ |
| $S\to s_n\to p\to Y$ | 3 | $3t_{pd}$ |

$$\boxed{t_{pd,\mathrm{MUX}}=3t_{pd}}.$$

Đường ba tầng có thể truyền thay đổi thật, chẳng hạn giữ $D_0=1,D_1=0$ rồi thay đổi $S$. Nếu $S$ đã ổn định và chỉ dữ liệu thay đổi, độ trễ là $2t_{pd}$.

## Bài 7. Rút gọn mạch dùng MUX

*Nguồn: sơ đồ trang 4. Nhãn (a), (b) bị đặt lệch trong PDF; ở đây gọi hình phía trên là (a), hình phía dưới là (b). Thanh nguồn phía trên là logic 1, ký hiệu đất là logic 0.*

### 7a. MUX4 nối tiếp MUX2

MUX4 chọn theo $(C,D)$ có dữ liệu:

| $CD$ | 00 | 01 | 10 | 11 |
|---|---:|---:|---:|---:|
| Đầu vào MUX4 | 1 | 0 | 0 | 1 |

Vì vậy đầu ra trung gian là:

$$T=\overline C\overline D+CD=\overline{C\oplus D}.$$

MUX2 chọn theo $A$, nhận $D_0=T,D_1=1$:

$$Y=\overline A T+A=A+T.$$

$$\boxed{Y=A+\overline C\overline D+CD=A+\overline{C\oplus D}}.$$

### 7b. Hai MUX4 nối tiếp

MUX4 bên trái nhận $(1,0,0,0)$ tại các ngõ $00,01,10,11$, chọn theo $(C,D)$:

$$T=\overline C\overline D.$$

MUX4 bên phải nhận $(1,T,T,0)$, chọn theo $(A,B)$:

$$Y=\overline A\overline B+\overline A BT+A\overline B T.$$

Áp dụng hấp thụ:

$$\overline A\overline B+\overline A BT
=\overline A(\overline B+T),$$

và $\overline A T+A\overline B T=T(\overline A+\overline B)$. Do đó:

$$\boxed{Y=\overline A\overline B+\overline A\overline C\overline D+\overline B\overline C\overline D}.$$

Dạng đặt nhân tử:

$$Y=\overline A\overline B+(\overline A+\overline B)\overline C\overline D.$$

## Bài 8. Hiện thực một hàm bằng ba loại MUX

*Nguồn: trang 4.*

Bảng chân trị chỉ có hai hàng 1 tại $ABC=000,111$:

$$Y=\Sigma m(0,7)=\overline A\overline B\overline C+ABC.$$

### a) Một MUX8:1

Chọn $S_2=A,S_1=B,S_0=C$; nối:

| Ngõ dữ liệu | $D_0$ | $D_1$ | $D_2$ | $D_3$ | $D_4$ | $D_5$ | $D_6$ | $D_7$ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Mức nối | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |

```text
D[0..7] = [1,0,0,0,0,0,0,1] ──[MUX8:1]── Y
                                 ▲
                            S[2..0]=ABC
```

### b) Một MUX4:1 và một inverter

Chọn $S_1=A,S_0=B$, xét hai giá trị của $C$ trong mỗi trường hợp:

| $AB$ | Ngõ chọn | Dữ liệu nối |
|---|---|---|
| 00 | $D_0$ | $\overline C$ |
| 01 | $D_1$ | 0 |
| 10 | $D_2$ | 0 |
| 11 | $D_3$ | $C$ |

```text
C ──[NOT]── C' ──► D0
0 ───────────────► D1 ┌────────┐
0 ───────────────► D2 │ MUX4:1 │── Y
C ───────────────► D3 └────────┘
                       ▲
                      AB
```

### c) Một MUX2:1 và hai cổng logic

Chọn $S=A$. Cần:

$$D_0=\overline B\overline C=\overline{B+C},\qquad D_1=BC.$$

Dùng đúng **một NOR2 và một AND2**:

```text
B,C ──[NOR2]── D0 ──┐
                     [MUX2:1, S=A]── Y
B,C ──[AND2]── D1 ──┘
```

Không cần inverter riêng vì NOR đã tạo $\overline B\overline C$.

## Bài 9. Bộ mã hóa ưu tiên 8 ngõ vào

*Nguồn: trang 4-5. Ưu tiên cao nhất là $A_7$, thấp nhất là $A_0$.*

Câu mở đầu ghi “$2^N$ ngõ vào và 2 ngõ ra”, nhưng mô tả chi tiết yêu cầu **bus $Y$ rộng $N$ bit và một ngõ NONE**. Với 8 ngõ vào, có 3 bit mã $Y_2,Y_1,Y_0$ và một bit NONE, tổng cộng 4 dây đầu ra.

### Bảng chân trị rút gọn

`x` trong bảng này nghĩa là các bit thấp hơn không ảnh hưởng khi đã có bit ưu tiên cao bằng 1; các đầu ra vẫn được xác định đầy đủ.

| $A_7A_6A_5A_4A_3A_2A_1A_0$ | $Y_2Y_1Y_0$ | NONE |
|---|---|---:|
| 1xxxxxxx | 111 | 0 |
| 01xxxxxx | 110 | 0 |
| 001xxxxx | 101 | 0 |
| 0001xxxx | 100 | 0 |
| 00001xxx | 011 | 0 |
| 000001xx | 010 | 0 |
| 0000001x | 001 | 0 |
| 00000001 | 000 | 0 |
| 00000000 | 000 | 1 |

### Phương trình Boole rút gọn

Có thể bắt đầu từ các tín hiệu thắng ưu tiên:

$$P_i=A_i\prod_{j=i+1}^{7}\overline{A_j}.$$

Sau đó $Y_2=P_4+P_5+P_6+P_7$, $Y_1=P_2+P_3+P_6+P_7$, $Y_0=P_1+P_3+P_5+P_7$. Hấp thụ các điều kiện đã được đầu vào ưu tiên cao hơn bao phủ, được:

$$\boxed{Y_2=A_7+A_6+A_5+A_4}$$

$$\boxed{Y_1=A_7+A_6+\overline{A_5}\overline{A_4}(A_3+A_2)}$$

$$\boxed{Y_0=A_7+\overline{A_6}A_5+
\overline{A_6}\overline{A_4}A_3+
\overline{A_6}\overline{A_4}\overline{A_2}A_1}$$

$$\boxed{\mathrm{NONE}=\overline{A_7+A_6+A_5+A_4+A_3+A_2+A_1+A_0}}.$$

Dạng gọn để nối mạch cho $Y_0$:

$$Y_0=A_7+\overline{A_6}\left[A_5+\overline{A_4}(A_3+\overline{A_2}A_1)\right].$$

$A_0$ không xuất hiện trong ba phương trình mã vì chỉ số của nó là 0; nó vẫn phải được tính trong NONE.

### Sơ đồ mạch

Tạo các tín hiệu đảo bằng NOT. Các nhãn trung gian trong sơ đồ là dây dùng chung:

```text
A7,A6,A5,A4 ──[OR4]────────────────────────────── Y2

A3,A2 ──[OR2]── u
A5',A4',u ──[AND3]── v
A7,A6,v ──[OR3]────────────────────────────────── Y1

A2',A1 ──[AND2]── p
A3,p   ──[OR2]── q
A4',q  ──[AND2]── r
A5,r   ──[OR2]── s
A6',s  ──[AND2]── t
A7,t   ──[OR2]─────────────────────────────────── Y0

A7,A6,A5,A4,A3,A2,A1,A0 ──[NOR8]──────────────── NONE
```

Ví dụ $00100000$: $A_5=1$, do đó $Y=101$, NONE $=0$. Nếu cả $A_5$ và $A_2$ bằng 1, kết quả vẫn là 101.

## Bài 10. Bộ chuyển mã nhị phân sang mã nhiệt kế 3:7

*Nguồn: trang 5.*

Đặt đầu vào $ABC$ biểu diễn $k=4A+2B+C$. Đầu ra ghi theo thứ tự $T_6T_5\ldots T_0$, trong đó $T_0$ là LSB.

### Bảng chân trị

| $ABC$ | $k$ | $T_6T_5T_4T_3T_2T_1T_0$ |
|---|---:|---|
| 000 | 0 | 0000000 |
| 001 | 1 | 0000001 |
| 010 | 2 | 0000011 |
| 011 | 3 | 0000111 |
| 100 | 4 | 0001111 |
| 101 | 5 | 0011111 |
| 110 | 6 | 0111111 |
| 111 | 7 | 1111111 |

### Phương trình rút gọn

Mỗi bit là một điều kiện ngưỡng: $T_i=1$ khi và chỉ khi $k\ge i+1$.

| Đầu ra | Điều kiện | Hàm tối giản |
|---|---|---|
| $T_0$ | $k\ge1$ | $A+B+C$ |
| $T_1$ | $k\ge2$ | $A+B$ |
| $T_2$ | $k\ge3$ | $A+BC$ |
| $T_3$ | $k\ge4$ | $A$ |
| $T_4$ | $k\ge5$ | $A(B+C)$ |
| $T_5$ | $k\ge6$ | $AB$ |
| $T_6$ | $k\ge7$ | $ABC$ |

Ví dụ, $k\ge3$ xảy ra nếu $A=1$ hoặc $BC=11$, nên $T_2=A+BC$.

### Sơ đồ mạch có dùng chung tín hiệu

```text
B,C ──[OR2]── p
B,C ──[AND2]── q

A,p ──[OR2]──────────────── T0
A,B ──[OR2]──────────────── T1
A,q ──[OR2]──────────────── T2
A ──────────────────────── T3
A,p ──[AND2]─────────────── T4
A,B ──[AND2]─────────────── T5
A,q ──[AND2]─────────────── T6
```

Với $ABC=110$, nhận $T_6\ldots T_0=0111111$, đúng ví dụ trong đề.

## Bài 11. Trễ lan truyền và trễ nhiễm

*Nguồn: bảng thông số trang 5, hai sơ đồ trang 6.*

Với mô hình cộng trễ theo đường đi, bỏ qua trễ dây:

$$t_{pd,\mathrm{mạch}}=\max_{\text{đường vào-ra}}\sum t_{pd,\mathrm{cổng}},\qquad
 t_{cd,\mathrm{mạch}}=\min_{\text{đường vào-ra}}\sum t_{cd,\mathrm{cổng}}.$$

$t_{pd}$ là thời gian muộn nhất để đầu ra ổn định; $t_{cd}$ là thời gian sớm nhất đầu ra có thể bắt đầu thay đổi.

### a) Chuỗi NAND2

Các cổng trong hình đều là NAND2. Hai NAND đầu nhận $(A,B)$ và $(C,D)$; đầu ra của chúng đi qua NAND thứ ba; NAND cuối nhận kết quả đó và $E$.

| Ngõ vào xuất phát | Chuỗi cổng | Tổng $t_{pd}$ (ps) | Tổng $t_{cd}$ (ps) |
|---|---|---:|---:|
| A hoặc B | NAND2 → NAND2 → NAND2 | $20+20+20=60$ | $15+15+15=45$ |
| C hoặc D | NAND2 → NAND2 → NAND2 | 60 | 45 |
| E | NAND2 | 20 | 15 |

$$\boxed{t_{pd}=60\ \mathrm{ps},\qquad t_{cd}=15\ \mathrm{ps}}.$$

### b) Mạch hỗn hợp

Đọc từ sơ đồ:

- Nhánh trên: NAND3$(A,B,C)$, sau đó NAND2 với $D$.
- Nhánh dưới: AND2$(F,G)$, sau đó NOR2 với $E$.
- Hai nhánh vào một NOR2.
- Cổng cuối là **NAND2 có hai ngõ vào nối chung**, không phải ký hiệu NOT.

Cổng cuối thực hiện phép đảo, nhưng vẫn dùng thông số NAND2 của bảng: $t_{pd}=20$ ps, $t_{cd}=15$ ps. Không thay bằng trễ NOT 15/10 ps khi tính mạch đang vẽ.

| Ngõ vào xuất phát | Chuỗi cổng | Tổng $t_{pd}$ (ps) | Tổng $t_{cd}$ (ps) |
|---|---|---:|---:|
| A, B hoặc C | NAND3 → NAND2 → NOR2 → NAND2 | $30+20+30+20=100$ | $25+15+25+15=80$ |
| D | NAND2 → NOR2 → NAND2 | $20+30+20=70$ | $15+25+15=55$ |
| E | NOR2 → NOR2 → NAND2 | $30+30+20=80$ | $25+25+15=65$ |
| F hoặc G | AND2 → NOR2 → NOR2 → NAND2 | $30+30+30+20=110$ | $25+25+25+15=90$ |

$$\boxed{t_{pd}=110\ \mathrm{ps},\qquad t_{cd}=55\ \mathrm{ps}}.$$

Đường tới hạn bắt đầu từ F/G; đường sớm nhất bắt đầu từ D. Các đường này đều có thể được kích hoạt: để truyền thay đổi từ F, giữ $G=1,E=0,D=1,A=B=C=0$; để truyền từ D, giữ $A=B=C=0,E=1$. Vì thế không chỉ chọn một đường hình học bị chặn về logic.

## Bài 12. Half-adder chỉ dùng NAND2

*Nguồn: trang 6.*

### a) Bảng chân trị

| A | B | Sum $S$ | Carry $C$ |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 1 |

### b) Biểu thức và chuyển sang NAND

$$S=A\oplus B=\overline A B+A\overline B,\qquad C=AB.$$

Đặt $n=\overline{AB}$, dùng chung tích đảo này cho cả hai đầu ra:

$$
\begin{aligned}
n&=N(A,B),\\
p&=N(A,n),\quad q=N(B,n),\\
S&=N(p,q),\\
C&=N(n,n).
\end{aligned}
$$

Bằng De Morgan:

$$S=\overline{\overline{An}\,\overline{Bn}}
=An+Bn=(A+B)\overline{AB}=A\overline B+\overline A B.$$

$$C=\overline{nn}=\overline n=AB.$$

### c) Sơ đồ

```text
A,B ──[NAND2]── n ──[NAND2: n,n]──────── C

A,n ──[NAND2]── p ──┐
                     [NAND2]──────────── S
B,n ──[NAND2]── q ──┘
```

Tổng cộng **5 NAND2**. Nhánh Sum dùng bốn NAND; nhánh Carry chỉ thêm một NAND nhờ dùng chung $n$.

## Bài 13. Full-adder bằng hai half-adder và OR

*Nguồn: trang 6.*

### a) Phương trình Boole chuẩn

Theo thứ tự đầu vào $(A,B,C_{in})$:

$$Sum=\Sigma m(1,2,4,7),\qquad C_{out}=\Sigma m(3,5,6,7).$$

SOP chính tắc:

$$
\begin{aligned}
Sum={}&\overline A\overline B C_{in}
+\overline A B\overline{C_{in}}
+A\overline B\overline{C_{in}}+ABC_{in},\\
C_{out}={}&\overline A BC_{in}+A\overline B C_{in}
+AB\overline{C_{in}}+ABC_{in}.
\end{aligned}
$$

Dạng rút gọn:

$$\boxed{Sum=A\oplus B\oplus C_{in}},\qquad
\boxed{C_{out}=AB+AC_{in}+BC_{in}}.$$

| A | B | $C_{in}$ | Sum | $C_{out}$ |
|---:|---:|---:|---:|---:|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 | 0 |
| 0 | 1 | 0 | 1 | 0 |
| 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 | 0 |
| 1 | 0 | 1 | 0 | 1 |
| 1 | 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 | 1 |

### b) Chứng minh kết nối

Half-adder thứ nhất nhận $A,B$:

$$S_1=A\oplus B,\qquad C_1=AB.$$

Half-adder thứ hai nhận $S_1,C_{in}$:

$$Sum=S_1\oplus C_{in},\qquad C_2=S_1C_{in}.$$

Cổng OR nối hai bit nhớ:

$$
\begin{aligned}
C_{out}
&=C_1+C_2=AB+(A\oplus B)C_{in}\\
&=AB+A\overline B C_{in}+\overline A BC_{in}\\
&=AB+AC_{in}+BC_{in}.
\end{aligned}
$$

Bước cuối dùng lần lượt $AB+A\overline B C_{in}=A(B+C_{in})$ và $AB+\overline A BC_{in}=B(A+C_{in})$. Hai ngõ ra đúng công thức full-adder.

### c) Sơ đồ khối

```text
A ──┐    ┌─────────┐
    ├───►│   HA1   │── S1 ──┐    ┌─────────┐
B ──┘    └─────────┘        ├───►│   HA2   │── Sum
              │ C1    Cin ──┘    └─────────┘
              │                       │ C2
              └─────────┐   ┌─────────┘
                        ▼   ▼
                        [OR]──────────── Cout
```

Kiểm tra số học cho mọi hàng: $A+B+C_{in}=2C_{out}+Sum$.

## Bài 14. Decoder4:16 bằng hai decoder3:8

*Nguồn: trang 7.*

### a) Cách kết nối

Gọi đầu vào là $A_3A_2A_1A_0$, trong đó $A_3$ là MSB. Giả sử các đầu ra decoder tích cực mức cao và đều bằng 0 khi decoder bị vô hiệu hóa.

- Nối $A_2,A_1,A_0$ vào ba ngõ địa chỉ tương ứng của **cả hai** decoder3:8.
- Decoder thấp tạo $Y_0$ đến $Y_7$, được cho phép khi $A_3=0$.
- Decoder cao tạo $Y_8$ đến $Y_{15}$, được cho phép khi $A_3=1$.

Nếu có EN chung, đặt:

$$\boxed{EN_L=EN\,\overline{A_3},\qquad EN_H=EN\,A_3}.$$

Nếu không cần EN chung, buộc $EN=1$: $EN_L=\overline{A_3},EN_H=A_3$, chỉ cần thêm một NOT bên ngoài hai decoder.

### b) Bảng chân trị rút gọn

Đặt $j=4A_2+2A_1+A_0$.

| EN chung | $A_3$ | $EN_L$ | $EN_H$ | Ngõ ra mức 1 |
|---:|---:|---:|---:|---|
| 0 | x | 0 | 0 | Không có |
| 1 | 0 | 1 | 0 | $Y_j$ |
| 1 | 1 | 0 | 1 | $Y_{8+j}$ |

Ở hàng EN $=1$, mọi đầu ra khác đều bằng 0. Ví dụ $A_3A_2A_1A_0=1011$ kích hoạt decoder cao và ngõ cục bộ 3, tức $Y_{11}=1$.

### c) Sơ đồ khối

```text
A3 ──[NOT]── A3'
EN,A3' ──[AND]── EN_L ──►┌─────────────────┐
A2,A1,A0 ────────────────►│ decoder3:8 thấp │── Y0..Y7
                         └─────────────────┘

EN,A3 ───[AND]── EN_H ──►┌─────────────────┐
A2,A1,A0 ────────────────►│ decoder3:8 cao  │── Y8..Y15
                         └─────────────────┘
```

Khi EN được buộc bằng 1, bỏ hai AND và nối trực tiếp $A_3'$/$A_3$ đến các chân enable.

## Bài 15. PLA 3 ngõ vào, 4 tích và 2 ngõ ra

*Nguồn: trang 7.*

$$F_1=\Sigma m(0,1,3,4),\qquad F_2=\Sigma m(1,2,3,4,5).$$

### a) Rút gọn và chọn tích dùng chung

Bìa Karnaugh chung cách sắp xếp:

| A | $BC=00$ | 01 | 11 | 10 |
|---|---:|---:|---:|---:|
| 0, $F_1$ | 1 | 1 | 1 | 0 |
| 1, $F_1$ | 1 | 0 | 0 | 0 |
| 0, $F_2$ | 0 | 1 | 1 | 1 |
| 1, $F_2$ | 1 | 1 | 0 | 0 |

Chọn:

$$P_1=\overline A C\;(1,3),\quad P_2=\overline B\overline C\;(0,4),\quad
P_3=\overline A B\;(2,3),\quad P_4=A\overline B\;(4,5).$$

$$\boxed{F_1=P_1+P_2=\overline A C+\overline B\overline C}$$

$$\boxed{F_2=P_1+P_3+P_4=\overline A C+\overline A B+A\overline B}.$$

$P_1$ được dùng chung cho hai đầu ra, nên chỉ cần **4 hàng AND**. Không phải tạo hai bản sao của $\overline A C$.

### b) Bảng lập trình PLA

Trong cột đầu vào: `1` lấy biến thường; `0` lấy biến đảo; `-` không dùng biến. Trong cột đầu ra: `1` nối tích đó vào OR tương ứng.

| Tích | A | B | C | $F_1$ | $F_2$ |
|---|:---:|:---:|:---:|:---:|:---:|
| $P_1$ | 0 | - | 1 | 1 | 1 |
| $P_2$ | - | 0 | 0 | 1 | 0 |
| $P_3$ | 0 | 1 | - | 0 | 1 |
| $P_4$ | 1 | 0 | - | 0 | 1 |

### c) Ma trận điểm nối

`X` là điểm nối được lập trình; `.` là không nối. Mỗi hàng bên trái là một AND, mỗi cột đầu ra bên phải là một OR. PLA cung cấp cả biến thường và biến đảo cho mặt phẳng AND.

```text
          MẶT PHẲNG AND                 MẶT PHẲNG OR
          A   A'  B   B'  C   C'        F1  F2
P1        .   X   .   .   X   .    ───   X   X
P2        .   .   .   X   .   X    ───   X   .
P3        .   X   X   .   .   .    ───   .   X
P4        X   .   .   X   .   .    ───   .   X
```

## Bài 16. Bộ chuyển BCD sang Excess-3 bằng PLA

*Nguồn: trang 7. Đầu vào $ABCD$ và đầu ra $WXYZ$ đều viết từ MSB đến LSB.*

### a) Bảng chân trị và don't care

Với đầu vào BCD hợp lệ $n\in\{0,\ldots,9\}$, đầu ra là biểu diễn nhị phân của $n+3$.

| Thập phân | A | B | C | D | W | X | Y | Z |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| 1 | 0 | 0 | 0 | 1 | 0 | 1 | 0 | 0 |
| 2 | 0 | 0 | 1 | 0 | 0 | 1 | 0 | 1 |
| 3 | 0 | 0 | 1 | 1 | 0 | 1 | 1 | 0 |
| 4 | 0 | 1 | 0 | 0 | 0 | 1 | 1 | 1 |
| 5 | 0 | 1 | 0 | 1 | 1 | 0 | 0 | 0 |
| 6 | 0 | 1 | 1 | 0 | 1 | 0 | 0 | 1 |
| 7 | 0 | 1 | 1 | 1 | 1 | 0 | 1 | 0 |
| 8 | 1 | 0 | 0 | 0 | 1 | 0 | 1 | 1 |
| 9 | 1 | 0 | 0 | 1 | 1 | 1 | 0 | 0 |
| 10 | 1 | 0 | 1 | 0 | x | x | x | x |
| 11 | 1 | 0 | 1 | 1 | x | x | x | x |
| 12 | 1 | 1 | 0 | 0 | x | x | x | x |
| 13 | 1 | 1 | 0 | 1 | x | x | x | x |
| 14 | 1 | 1 | 1 | 0 | x | x | x | x |
| 15 | 1 | 1 | 1 | 1 | x | x | x | x |

Các don't care chung cho bốn đầu ra là $d=\Sigma m(10,11,12,13,14,15)$.

### b) Karnaugh và tối ưu tích dùng chung

Bìa dưới ghi **bốn giá trị $WXYZ$ trong mỗi ô**; tách từng vị trí bit sẽ được bốn bìa Karnaugh tương ứng:

| $AB\backslash CD$ | 00 | 01 | 11 | 10 |
|---|---|---|---|---|
| 00 | 0011 | 0100 | 0110 | 0101 |
| 01 | 0111 | 1000 | 1010 | 1001 |
| 11 | xxxx | xxxx | xxxx | xxxx |
| 10 | 1011 | 1100 | xxxx | xxxx |

Các nhóm tối giản riêng từng đầu ra:

| Hàm | Các nhóm minterm | Kết quả |
|---|---|---|
| W | 8-15; (6,7,14,15); (5,7,13,15) | $A+BC+BD$ |
| X | (2,3,10,11); (1,3,9,11); (4,12) | $\overline B C+\overline B D+B\overline C\overline D$ |
| Y | (3,7,11,15); (0,4,8,12) | $CD+\overline C\overline D$ |
| Z | (0,2,4,6,8,10,12,14) | $\overline D$ |

Nếu hiện thực trực tiếp các biểu thức này, cần **9 tích khác nhau**. Để tiết kiệm hàng AND, không tạo riêng $\overline D$; phân rã nó thành các tích có thể dùng chung:

$$\overline D=BC\overline D+\overline B C\overline D+\overline C\overline D.$$

Đồng thời viết lại:

$$BC+BD=BC\overline D+BD,$$

$$\overline B C+\overline B D=\overline B C\overline D+\overline B D.$$

Chọn **8 tích**:

$$
\begin{array}{llll}
P_1=A,&P_2=BD,&P_3=BC\overline D,&P_4=\overline B D,\\
P_5=\overline B C\overline D,&P_6=B\overline C\overline D,&
P_7=\overline C\overline D,&P_8=CD.
\end{array}
$$

Các đầu ra:

$$\boxed{
\begin{aligned}
W&=P_1+P_2+P_3,\\
X&=P_4+P_5+P_6,\\
Y&=P_7+P_8,\\
Z&=P_3+P_5+P_7.
\end{aligned}}
$$

$P_3$ dùng chung cho W/Z; $P_5$ cho X/Z; $P_7$ cho Y/Z. Cách này giảm từ 9 xuống 8 hàng AND, dù một số tích dài hơn. Đây là khác biệt giữa tối giản riêng từng hàm và tối ưu số hàng của PLA.

### c) Bảng lập trình và điểm nối

Quy ước đầu vào `1/0/-` giống Bài 15; `1` ở cột đầu ra nghĩa là có nối.

| Tích | A | B | C | D | W | X | Y | Z |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| $P_1$ | 1 | - | - | - | 1 | 0 | 0 | 0 |
| $P_2$ | - | 1 | - | 1 | 1 | 0 | 0 | 0 |
| $P_3$ | - | 1 | 1 | 0 | 1 | 0 | 0 | 1 |
| $P_4$ | - | 0 | - | 1 | 0 | 1 | 0 | 0 |
| $P_5$ | - | 0 | 1 | 0 | 0 | 1 | 0 | 1 |
| $P_6$ | - | 1 | 0 | 0 | 0 | 1 | 0 | 0 |
| $P_7$ | - | - | 0 | 0 | 0 | 0 | 1 | 1 |
| $P_8$ | - | - | 1 | 1 | 0 | 0 | 1 | 0 |

```text
          MẶT PHẲNG AND                        MẶT PHẲNG OR
          A   A'  B   B'  C   C'  D   D'       W   X   Y   Z
P1        X   .   .   .   .   .   .   .    ───  X   .   .   .
P2        .   .   X   .   .   .   X   .    ───  X   .   .   .
P3        .   .   X   .   X   .   .   X    ───  X   .   .   X
P4        .   .   .   X   .   .   X   .    ───  .   X   .   .
P5        .   .   .   X   X   .   .   X    ───  .   X   .   X
P6        .   .   X   .   .   X   .   X    ───  .   X   .   .
P7        .   .   .   .   .   X   .   X    ───  .   .   X   X
P8        .   .   .   .   X   .   X   .    ───  .   .   X   .
```

Các hàng 10-15 không có yêu cầu đầu ra. Không diễn giải kết quả của mạch ở các hàng này như một phép đổi mã BCD hợp lệ.

## Bài 17. PLA 3 ngõ vào, tối đa 5 tích, 3 ngõ ra

*Nguồn: trang 8.*

$$F_1=\Sigma m(0,1,2,4),\quad F_2=\Sigma m(0,5,6,7),\quad
F_3=\Sigma m(0,3,4,7).$$

**Kết luận về điều kiện phần cứng:** Có thể dùng đúng **5 tích nếu ngõ ra thứ nhất được đảo cực tính**. Nếu chip chỉ có mặt phẳng AND-OR với ba đầu ra không đảo và không cho thêm cổng đảo, yêu cầu “vừa 5 tích” không khả thi: cần tối thiểu **7 tích**. Đề không nêu rõ khả năng đảo ngõ ra, nên phải phân biệt hai trường hợp.

### a) Rút gọn và tìm thành phần chung

Rút gọn trực tiếp:

$$F_1=\overline x\overline y+\overline x\overline z+\overline y\overline z,$$

$$F_2=xy+xz+\overline x\overline y\overline z,$$

$$F_3=yz+\overline y\overline z.$$

Có tổng cộng 7 tích khác nhau sau khi dùng chung $\overline y\overline z$ giữa $F_1,F_3$.

**Vì sao không thể giảm xuống 5 trong PLA AND-OR không đảo?**

1. $F_1$ cần hai tích khác nhau để phủ các ô 1 và 2; một tích không thể phủ cả hai mà không phủ ô 3, nơi $F_1=0$. Hai tích này không thể nối vào $F_2$ hay $F_3$ vì cả hai hàm đó đều bằng 0 tại 1 và 2.
2. $F_2$ cần hai tích khác nhau để phủ 5 và 6; không thể gộp chúng vì sẽ phủ 4, nơi $F_2=0$. Hai tích này không thể nối vào $F_1$ hoặc $F_3$, vì các hàm đó bằng 0 tại 5 và 6.
3. Ô 0 của $F_2$ bị cô lập, bắt buộc có tích riêng $\overline x\overline y\overline z$.
4. $F_3$ còn phải phủ ô 3 và ô 4. Không tích nào ở ba bước trên có thể phủ hai ô này cho $F_3$. Hai ô 3 và 4 cũng không thể được một tích hợp lệ duy nhất phủ cùng lúc. Do đó cần ít nhất hai tích nữa.

Tổng cận dưới: $2+2+1+2=7$, và các biểu thức trực tiếp trên đạt được cận này.

**Cách vừa 5 tích khi cho phép đảo đầu ra:**

Thay vì tạo trực tiếp $F_1$, tạo $G_1=\overline{F_1}$:

$$G_1=\Sigma m(3,5,6,7)=xy+xz+yz.$$

Chọn các tích:

$$P_1=xy,\quad P_2=xz,\quad P_3=yz,\quad
P_4=\overline x\overline y\overline z,\quad P_5=\overline y\overline z.$$

Khi đó:

$$\boxed{
\begin{aligned}
F_1&=\overline{P_1+P_2+P_3},\\
F_2&=P_1+P_2+P_4,\\
F_3&=P_3+P_5.
\end{aligned}}
$$

$P_1,P_2$ dùng chung cho $G_1,F_2$; $P_3$ dùng chung cho $G_1,F_3$. Tổng cộng đúng **5 AND và 3 OR**, cộng chức năng đảo cực tính ở đầu ra thứ nhất. Chức năng này phải do chip hỗ trợ; nếu không, cần thêm **một NOT ngoài chip**, tức đã bổ sung phần cứng so với PLA AND-OR thuần túy.

Không thể đưa các biểu thức OR trung gian trở lại làm đầu vào AND để “tiết kiệm tích” nếu chip chỉ có hai mặt phẳng AND-OR và không hỗ trợ hồi tiếp.

### b) Bảng lập trình và sơ đồ ma trận 5 tích

| Tích | x | y | z | $G_1$ | $F_2$ | $F_3$ |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| $P_1=xy$ | 1 | 1 | - | 1 | 1 | 0 |
| $P_2=xz$ | 1 | - | 1 | 1 | 1 | 0 |
| $P_3=yz$ | - | 1 | 1 | 1 | 0 | 1 |
| $P_4=\overline x\overline y\overline z$ | 0 | 0 | 0 | 0 | 1 | 0 |
| $P_5=\overline y\overline z$ | - | 0 | 0 | 0 | 0 | 1 |
| Cực tính đầu ra | - | - | - | Đảo để được $F_1$ | Không đảo | Không đảo |

```text
          MẶT PHẲNG AND                MẶT PHẲNG OR
          x   x'  y   y'  z   z'       G1  F2  F3
P1        X   .   X   .   .   .   ───   X   X   .
P2        X   .   .   .   X   .   ───   X   X   .
P3        .   .   X   .   X   .   ───   X   .   X
P4        .   X   .   X   .   X   ───   .   X   .
P5        .   .   .   X   .   X   ───   .   .   X
                                       │   │   │
                                     [NOT] │   │
                                       │   │   │
                                       F1  F2  F3
```

### Kiểm tra toàn bộ tám tổ hợp

| xyz | $G_1$ trước đảo | $F_1$ | $F_2$ | $F_3$ |
|---|---:|---:|---:|---:|
| 000 | 0 | 1 | 1 | 1 |
| 001 | 0 | 1 | 0 | 0 |
| 010 | 0 | 1 | 0 | 0 |
| 011 | 1 | 0 | 0 | 1 |
| 100 | 0 | 1 | 0 | 1 |
| 101 | 1 | 0 | 1 | 0 |
| 110 | 1 | 0 | 1 | 0 |
| 111 | 1 | 0 | 1 | 1 |

## Tổng kết kiểm chứng

- Đã đối chiếu đủ 17 bài trên cả 8 trang nguồn, bao gồm các hình và phạm vi dấu phủ định.
- Các biểu thức gốc/rút gọn, cách nối cổng và phương án MUX được so sánh bằng vét cạn đầu vào trong mô hình logic nhị phân. Các ngõ don't care chỉ được bỏ qua đúng tại những hàng đề cho phép.
- Bộ mã hóa ưu tiên được kiểm tra trên 256 đầu vào; mã nhiệt kế trên 8 đầu vào; half-adder trên 4 đầu vào; full-adder trên 8 đầu vào; decoder trên 32 trường hợp có tính EN chung.
- PLA Bài 15 và 17 được kiểm tra trên đủ 8 đầu vào; PLA Bài 16 trên 10 mã BCD hợp lệ. Bài 17 dùng đúng giả thiết đảo ngõ ra thứ nhất đã nêu.
- Trễ Bài 11 được cộng theo đúng loại cổng trong hình, kể cả NAND2 nối chung đầu vào ở cuối mạch (b). Đây là phân tích theo mô hình trễ đề cho, không phải mô phỏng transistor hay đo phần cứng.
