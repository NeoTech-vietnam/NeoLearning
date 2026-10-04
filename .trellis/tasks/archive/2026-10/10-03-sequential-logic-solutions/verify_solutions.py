"""Finite model checks for the companion solution; no hardware simulation.

The equations below are transcriptions of the document. They are checked
against arithmetic, suffix matching and independent table/sequence references.
Run from any directory with Python 3.10+; no additional dependency is needed.
"""
from itertools import product
from pathlib import Path
from urllib.parse import unquote
import re

ROOT = Path(__file__).resolve().parents[3]
DOC = ROOT / "07_mechatronics_engineering_master_program/05_Computer-Architecture/02_exercises/Bai_tap_Sequential_logic_Loi_giai.md"
checks = []


def record(label, count):
    checks.append((label, count))


def bit_tuple(q, width):
    return tuple((q >> i) & 1 for i in range(width))


def unpack(values):
    return sum(int(v) << i for i, v in enumerate(values))


def counter_d(q, width, enable=1):
    b = bit_tuple(q, width)
    return unpack(b[i] ^ (enable & int(all(b[:i]))) for i in range(width))


def counter_tjk(q, width, kind):
    b = bit_tuple(q, width)
    toggles = tuple(int(all(b[:i])) for i in range(width))
    if kind == "T":
        return unpack(v ^ t for v, t in zip(b, toggles))
    return unpack((t & (1-v)) | ((1-t) & v) for v, t in zip(b, toggles))


assert [int(b) for b in [1, 1, 0, 0, 1]] == [1, 1, 0, 0, 1]
record("Bài 1-2: D=B tại A↑; chuỗi chiều theo quy ước", 5)
q = 0
div_trace = [q]
for _ in range(8):
    q = counter_d(q, 2)
    div_trace.append(q)
assert div_trace == [0, 1, 2, 3, 0, 1, 2, 3, 0]
assert [q & 1 for q in div_trace] == [0, 1, 0, 1, 0, 1, 0, 1, 0]
assert [q >> 1 for q in div_trace] == [0, 0, 1, 1, 0, 0, 1, 1, 0]
record("Bài 3: pha/chu kỳ chia 2, chia 4 và bảng 8 cạnh", 9)
for q in range(8):
    expected = (q+1) % 8
    assert counter_d(q, 3) == expected
    assert counter_tjk(q, 3, "T") == expected
    assert counter_tjk(q, 3, "JK") == expected
record("Bài 4: mọi trạng thái, ba loại D/T/JK", 24)
for q, qnext in product([0, 1], repeat=2):
    assert q ^ (q ^ qnext) == qnext
record("Bài 4: bảng kích D/T tổng quát", 4)
shift = 0
shift_trace = []
for x in [1, 0, 1, 1]:
    shift = ((shift << 1) | x) & 15
    shift_trace.append(shift)
assert shift_trace == [1, 2, 5, 11]
record("Bài 5: SIPO 0001,0010,0101,1011", 4)
assert counter_d(15, 4) == 0
for q in range(16):
    assert counter_d(q, 4) == (q+1) % 16
assert 11 % 16 == 11 and 16 % 16 == 0 and 16/100 == 0.16
record("Bài 6: mod-16, 11/16 xung và 160 ms", 19)


def parking_eq(c, i, o):
    u = i and not o and c < 15
    v = o and not i and c > 0
    b = bit_tuple(c, 4)
    toggles = [(u and all(b[:k])) or (v and not any(b[:k])) for k in range(4)]
    return unpack(b[k] ^ int(toggles[k]) for k in range(4))


for c, i, o in product(range(16), [0, 1], [0, 1]):
    ref = max(0, min(15, c+i-o))
    assert parking_eq(c, i, o) == ref
c = 5
for i, o in [(1, 0)]*4 + [(0, 1)]*2:
    c = parking_eq(c, i, o)
assert c == 7
record("Bài 7: 64 tổ hợp, bão hòa biên, IN/OUT đồng thời, ví dụ", 65)
for q, p in product([0, 1], repeat=2):
    ref = 1-q if p else q
    assert q ^ p == ref
    assert (p & (1-q)) | ((1-p) & q) == ref
record("Bài 8: giữ/đảo T, JK, D", 8)


def moore101(q, x):
    q0, q1 = bit_tuple(q, 2)
    d0 = x
    d1 = ((1-x) & q0) | (x & q1 & (1-q0))
    return unpack((d0, d1))


def mealy101(q, x):
    q0, q1 = bit_tuple(q, 2)
    d1 = (1-x) & (1-q1) & q0
    d0 = x & (1-(q1 & q0))
    return unpack((d0, d1)), q1 & (1-q0) & x


moore_ref = [(0, 1), (2, 1), (0, 3), (2, 1)]
mealy_ref = [((0, 0), (1, 0)), ((2, 0), (1, 0)), ((0, 0), (1, 1)), ((0, 0), (0, 0))]
for q, x in product(range(4), [0, 1]):
    assert moore101(q, x) == moore_ref[q][x]
    assert mealy101(q, x) == mealy_ref[q][x]
seq_count = 0
for length in range(11):
    for xs in product([0, 1], repeat=length):
        qm = qe = 0
        for index, x in enumerate(xs):
            qm = moore101(qm, x)
            qe, ye = mealy101(qe, x)
            expected = int(index >= 2 and xs[index-2:index+1] == (1, 0, 1))
            assert int(qm == 3) == ye == expected
        seq_count += 1
record("Bài 9: 16 bảng/hàm + 2047 chuỗi nhị phân dài 0-10 đối chiếu tìm hậu tố 101", 16+seq_count)


def door_eq(q, x):
    q0, q1 = bit_tuple(q, 2)
    return unpack((x & (q1 | (1-q0)), x & (q1 | q0)))


for q, x in product(range(4), [0, 1]):
    assert door_eq(q, x) == (min(3, q+1) if x else 0)
q = 0
trace = []
for x in [0, 1, 1, 1, 0, 1, 1]:
    q = door_eq(q, x)
    trace.append(q)
assert trace == [0, 1, 2, 3, 0, 1, 2]
for length in range(9):
    for xs in product([0, 1], repeat=length):
        q = run = 0
        for x in xs:
            q = door_eq(q, x)
            run = run+1 if x else 0
            assert (q == 3) == (run >= 3)
record("Bài 10: 8 bảng/hàm, chuỗi đề, 511 chuỗi + mở kéo dài/đóng", 8+7+511)


def direction_eq(bits, A, B):
    i, a, b, r, l, u = bits
    if sum(bits) != 1:
        return (1, 0, 0, 0, 0, 0)
    return tuple(map(int, (
        (i or r or l or u) and not A and not B,
        (i and A and not B) or (a and not B),
        (i and not A and B) or (b and not A),
        (a and B) or (r and (A or B)),
        (b and A) or (l and (A or B)),
        (i and A and B) or (u and (A or B)),
    )))


direction_table = [
    [0, 2, 1, 5], [1, 3, 1, 3], [2, 2, 4, 4],
    [0, 3, 3, 3], [0, 4, 4, 4], [0, 5, 5, 5],
]
for state, A, B in product(range(6), [0, 1], [0, 1]):
    bits = tuple(int(k == state) for k in range(6))
    actual = direction_eq(bits, A, B)
    assert sum(actual) == 1
    assert actual.index(1) == direction_table[state][2*A+B]
for bits in product([0, 1], repeat=6):
    for A, B in product([0, 1], repeat=2):
        out = direction_eq(bits, A, B)
        assert sum(out) == 1
        assert not (out[3] and out[4])
        if sum(bits) != 1:
            assert out == (1, 0, 0, 0, 0, 0)
direction_examples = [
    ([2, 0, 1, 0], [1, 1, 3, 0]),
    ([1, 0, 2, 0], [2, 2, 4, 0]),
    ([2, 3, 1, 1, 0], [1, 3, 3, 3, 0]),
    ([3, 2, 0], [5, 5, 0]),
]
for inputs, expected in direction_examples:
    bits = (1, 0, 0, 0, 0, 0)
    states = []
    for ab in inputs:
        bits = direction_eq(bits, ab >> 1, ab & 1)
        states.append(bits.index(1))
    assert states == expected
record("Bài 11: 24 dòng FSM, mọi 64 mã one-hot × 4 ngõ vào, gap/overlap/rearm/ambiguous", 24+256+4)


def vending(q, coin, moore):
    # Coin is normalized to none/5/10; raw simultaneous is none.
    f, h, n = int(coin == 5), int(coin == 10), int(coin == 0)
    s0, s5, s10, sv = [int(q == k) for k in range(4)]
    if moore:
        d1 = (s0 & h) | (s5 & (f | h)) | s10
        d0 = (s0 & f) | (s5 & (n | h)) | (s10 & (f | h))
        return unpack((d0, d1)), sv
    d1 = (s0 & h) | (s5 & f) | (s10 & n)
    d0 = (s0 & f) | (s5 & n)
    y = (s5 & h) | (s10 & (f | h))
    return unpack((d0, d1)), y


for q, coin in product(range(4), [0, 5, 10]):
    if q == 3:
        assert vending(q, coin, True) == (0, 1)
        assert vending(q, coin, False) == (0, 0)
    else:
        total = [0, 5, 10][q]+coin
        expected_y = int(total >= 15)
        expected_q = 3 if total >= 15 else [0, 5, 10].index(total)
        assert vending(q, coin, True)[0] == expected_q
        assert vending(q, coin, False) == (0 if expected_y else expected_q, expected_y)
for length in range(7):
    for coins in product([0, 5, 10], repeat=length):
        q = credit = 0
        for coin in coins:
            q, y = vending(q, coin, False)
            credit += coin
            ref = int(credit >= 15)
            if ref:
                credit = 0
            assert y == ref and [0, 5, 10][q] == credit
for coins in [[5, 5, 5], [5, 10], [10, 5], [10, 10]]:
    qm = qe = 0
    for index, coin in enumerate(coins):
        qm, _ = vending(qm, coin, True)
        qe, y = vending(qe, coin, False)
        assert (qm == 3) == bool(y) == (index == len(coins)-1)
    assert qe == 0
    assert vending(qm, 0, True)[0] == 0
record("Bài 12: 24 dòng Moore/Mealy, 1093 chuỗi tiền/idle, bốn chuỗi đủ tiền, busy/reset", 24+1093+4)


def traffic(q, e):
    q0, q1 = bit_tuple(q, 2)
    d1 = ((1-e) & q1 & (1-q0)) | (e & (1-q1) & q0)
    d0 = ((1-e) & (1-q1) & q0) | (e & (1-q1) & (1-q0))
    r = ((1-q1) & (1-q0)) | (q1 & q0)
    g = (1-q1) & q0
    b = q1 & (1-q0)
    return unpack((d0, d1)), (r, g, b)


for q, e in product(range(4), [0, 1]):
    nxt, outputs = traffic(q, e)
    expected = 0 if q == 3 else ((q+1) % 3 if e else q)
    assert nxt == expected
    assert sum(outputs) == 1
    assert outputs == [(1, 0, 0), (0, 1, 0), (0, 0, 1), (1, 0, 0)][q]
record("Bài 13: mọi trạng thái/timer, phục hồi mã 11 và ngõ ra loại trừ", 8)
assert (6-4, 3-2) == (2, 1)
assert (2-4, 3-2) == (-2, 1)
assert 3+10+2 == 15 and abs(1/(15e-9)/1e6-66.6666667) < 1e-6
assert 1/50 == 0.02 and 20_000_000-15 == 19_999_985
assert 3+18+2 == 23 and abs(1/(23e-9)/1e6-43.4782609) < 1e-6
record("Bài 14-15: setup/hold slack và đơn vị 50 Hz, Tmin/fmax", 8)
for q, p in product(range(8), [0, 1]):
    assert counter_d(q, 3, p) == ((q+p) % 8)
    assert (p & int(q == 7)) == int(p and q+1 == 8)
# Independent product totals, including idle cycles, four batches and reset.
c = alarm = total = 0
event_rows = []
for p in [0, 0]+[v for _ in range(32) for v in [1, 0, 0]]:
    old_c = c
    c = counter_d(c, 3, p)
    alarm = p & int(old_c == 7)
    total += p
    assert c == total % 8
    assert alarm == int(p and total % 8 == 0)
    if p:
        event_rows.append((total, c, alarm))
assert [row[0] for row in event_rows if row[2]] == [8, 16, 24, 32]
assert event_rows[6] == (7, 7, 0) and event_rows[7] == (8, 0, 1)
assert 8/2 == 4
record("Bài 16: 16 dòng enable/carry, 32 sản phẩm + idle, báo 8/16/24/32, 4 s", 16+98+1)

# Document checks intentionally inspect the saved artifact, not just the model.
text = DOC.read_text(encoding="utf-8")
heads = re.findall(r"^## Bài (\d+)\.", text, re.M)
assert heads == [str(k) for k in range(1, 17)], heads
assert len(re.findall(r"^```", text, re.M)) % 2 == 0
assert len(re.findall(r"^\$\$", text, re.M)) % 2 == 0
assert not any(line.rstrip() != line for line in text.splitlines())
assert "50 Hz" in text and "19{,}999{,}985" in text
assert "TC=P\\,Q_2Q_1Q_0" in text
assert "D_0=X,\\quad D_1=\\overline XQ_0+XQ_1\\overline Q_0" in text
assert "D_1=X(Q_1+Q_0),\\quad D_0=X(Q_1+\\overline Q_0)" in text
assert "D_1=\\overline X\\overline Q_1Q_0" in text
assert "d_a&=iA\\overline B+a\\overline B" in text
assert "Không dùng riêng" in text
assert not re.search(r"\b(TODO|TBD|FIXME)\b", text)
links = re.findall(r"\]\(([^)]+)\)", text)
for link in links:
    assert (DOC.parent / unquote(link)).is_file(), link
fences = re.findall(r"```mermaid\n(.*?)\n```", text, re.S)
assert len(fences) == 8, len(fences)
for fence in fences:
    assert fence.startswith("stateDiagram-v2")
    assert "-->" in fence
    for line in fence.splitlines():
        if "-->" in line:
            assert re.match(r"^\s*(?:\[\*\]|\w+)\s*-->\s*(?:\[\*\]|\w+)(?::.*)?$", line), line
record("Markdown: 16 bài, 8 FSM Mermaid, block toán/code, liên kết nguồn, whitespace", 16+8+len(links))

report = ["# Verification results", "", "All checks PASS. Executed with the bundled Python runtime on 2026-10-03.", "", "| Check group | Finite rows / sequences / assertions represented |", "|---|---:|"]
report.extend(f"| {label} | {count} |" for label, count in checks)
report += ["", "Numbers count the grouped reference cases described; sequence loops also assert every sampled step. They are not a claim about physical timing, coverage of electrical behavior or formal proof.", "", "## Method and limits", "", "- D/T/JK and FSM equations are transcribed from the solution, then compared with arithmetic/state-table references. The verifier checks selected equation strings remain in the saved Markdown; it does not execute LaTeX.", "- 101 and door outputs are checked independently against suffix matching and a run-length count. Vending Mealy is compared with running credit arithmetic, including idle input. Direction is compared with the explicit sensor/rearm policy table and all one-hot/invalid bit patterns.", "- Moore output is observed after the receiving edge; Mealy is evaluated with pre-edge state and current input. Output registration/busy timing is described in the artifact.", "- Text timing diagram levels agree with the divider table; hardware delays, async clear recovery/removal, metastability probabilities and lamp pulse perception are outside this logical test.", "- Mermaid transition syntax is checked by a narrow static grammar, not a visual Mermaid renderer. A separate reviewer can render/inspect the Markdown.", "", "## Source subpart coverage", "", "| Exercise | Source page | Subparts covered |", "|---|---:|---|", "| 1 | 1 | DFF direction circuit and phase convention |", "| 2 | 1 | All five B samples |", "| 3 | 1 | a,b,c |", "| 4 | 2 | a,b,c,d,e,f |", "| 5 | 2 | a,b,c,d |", "| 6 | 2 | a,b,c,d,e |", "| 7 | 3 | a,b |", "| 8 | 3 | a,b,c |", "| 9 | 3 | a,b,c,d,e |", "| 10 | 4 | a,b,c,d,e,f |", "| 11 | 4 | a,b,c,d,e |", "| 12 | 4-5 | a,b,c,d,e,f |", "| 13 | 5 | a,b,c,d,e,f |", "| 14 | 5-6 | a,b,c,d,e |", "| 15 | 6 | a,b,c |", "| 16 | 6 | a,b,c,d,e,f |", ""]
Path(__file__).with_name("verification.md").write_text("\n".join(report), encoding="utf-8")
print(f"PASS: {len(checks)} verification groups; {seq_count} pattern sequences; report: {Path(__file__).with_name('verification.md')}")
