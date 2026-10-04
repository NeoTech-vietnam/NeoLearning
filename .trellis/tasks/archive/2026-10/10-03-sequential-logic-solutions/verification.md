# Verification results

All checks PASS. Executed with the bundled Python runtime on 2026-10-03.

| Check group | Finite rows / sequences / assertions represented |
|---|---:|
| Bài 1-2: D=B tại A↑; chuỗi chiều theo quy ước | 5 |
| Bài 3: pha/chu kỳ chia 2, chia 4 và bảng 8 cạnh | 9 |
| Bài 4: mọi trạng thái, ba loại D/T/JK | 24 |
| Bài 4: bảng kích D/T tổng quát | 4 |
| Bài 5: SIPO 0001,0010,0101,1011 | 4 |
| Bài 6: mod-16, 11/16 xung và 160 ms | 19 |
| Bài 7: 64 tổ hợp, bão hòa biên, IN/OUT đồng thời, ví dụ | 65 |
| Bài 8: giữ/đảo T, JK, D | 8 |
| Bài 9: 16 bảng/hàm + 2047 chuỗi nhị phân dài 0-10 đối chiếu tìm hậu tố 101 | 2063 |
| Bài 10: 8 bảng/hàm, chuỗi đề, 511 chuỗi + mở kéo dài/đóng | 526 |
| Bài 11: 24 dòng FSM, mọi 64 mã one-hot × 4 ngõ vào, gap/overlap/rearm/ambiguous | 284 |
| Bài 12: 24 dòng Moore/Mealy, 1093 chuỗi tiền/idle, bốn chuỗi đủ tiền, busy/reset | 1121 |
| Bài 13: mọi trạng thái/timer, phục hồi mã 11 và ngõ ra loại trừ | 8 |
| Bài 14-15: setup/hold slack và đơn vị 50 Hz, Tmin/fmax | 8 |
| Bài 16: 16 dòng enable/carry, 32 sản phẩm + idle, báo 8/16/24/32, 4 s | 115 |
| Markdown: 16 bài, 8 FSM Mermaid, block toán/code, liên kết nguồn, whitespace | 25 |

Numbers count the grouped reference cases described; sequence loops also assert every sampled step. They are not a claim about physical timing, coverage of electrical behavior or formal proof.

## Method and limits

- D/T/JK and FSM equations are transcribed from the solution, then compared with arithmetic/state-table references. The verifier checks selected equation strings remain in the saved Markdown; it does not execute LaTeX.
- 101 and door outputs are checked independently against suffix matching and a run-length count. Vending Mealy is compared with running credit arithmetic, including idle input. Direction is compared with the explicit sensor/rearm policy table and all one-hot/invalid bit patterns.
- Moore output is observed after the receiving edge; Mealy is evaluated with pre-edge state and current input. Output registration/busy timing is described in the artifact.
- Text timing diagram levels agree with the divider table; hardware delays, async clear recovery/removal, metastability probabilities and lamp pulse perception are outside this logical test.
- Mermaid transition syntax is checked by a narrow static grammar, not a visual Mermaid renderer. A separate reviewer can render/inspect the Markdown.

## Source subpart coverage

| Exercise | Source page | Subparts covered |
|---|---:|---|
| 1 | 1 | DFF direction circuit and phase convention |
| 2 | 1 | All five B samples |
| 3 | 1 | a,b,c |
| 4 | 2 | a,b,c,d,e,f |
| 5 | 2 | a,b,c,d |
| 6 | 2 | a,b,c,d,e |
| 7 | 3 | a,b |
| 8 | 3 | a,b,c |
| 9 | 3 | a,b,c,d,e |
| 10 | 4 | a,b,c,d,e,f |
| 11 | 4 | a,b,c,d,e |
| 12 | 4-5 | a,b,c,d,e,f |
| 13 | 5 | a,b,c,d,e,f |
| 14 | 5-6 | a,b,c,d,e |
| 15 | 6 | a,b,c |
| 16 | 6 | a,b,c,d,e,f |
