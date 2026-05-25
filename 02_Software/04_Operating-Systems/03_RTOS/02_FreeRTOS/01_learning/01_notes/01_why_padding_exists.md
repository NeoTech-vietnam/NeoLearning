# Cornell Notes

## Topic: Why padding exists in heap_1 memory alignment?

## Date: 2026-05-22

---

### Cue Column (Questions, Keywords, or Prompts)

- What is a bus boundary?
- Why does an unaligned access cause problems?
- What is `ALIGNMENT_MASK` and how is it used?
- What does `xWantedSize & ALIGNMENT_MASK` tell us?
- How is padding calculated?
- Why must every returned pointer be a multiple of 8?

---

### Notes Section (Main Notes)

#### 1. The hardware reason — CPU bus width

A 64-bit CPU fetches **8 bytes at a time** from a bus-aligned address (a multiple of 8).

```
Bus boundary every 8 bytes:
│ 0   1   2   3   4   5   6   7 │ 8   9  10  11  12  13  14  15 │

Aligned uint64 at address 8:
│                                 [■   ■   ■   ■   ■   ■   ■   ■]│
                                   └── ONE fetch ──────────────┘  ✓ fast

Unaligned uint64 at address 5:
│                     [■   ■   ■ │ ■   ■   ■   ■   ■]            │
                        fetch 1    └── fetch 2                    ✗ slow / FAULT
```

- On **ARM Cortex-M** (most FreeRTOS targets): unaligned access → **Hard Fault**
- On **x86**: unaligned access is allowed but costs extra cycles

#### 2. Without padding — the problem

```c
pvPortMalloc(1);  // cursor moves 1 byte
pvPortMalloc(8);  // starts at offset 1 ← NOT aligned!
```

```
Address: 0    1    2    3    4    5    6    7    8 ...
         [■]  [■   ■   ■   ■   ■   ■   ■   ■]
          p1   p2 starts here — straddles boundary → 2 fetches needed ✗
```

#### 3. With padding — the fix

Round every allocation up to the next multiple of 8 so the **next** allocation always starts on a boundary:

```c
pvPortMalloc(1);  // padded to 8, cursor moves 8 bytes
pvPortMalloc(8);  // starts at offset 8 ← perfectly aligned ✓
```

```
Address: 0    1    2    3    4    5    6    7  │  8    9   10   11   12   13   14   15
         [■   ·    ·    ·    ·    ·    ·    ·]    [■   ■    ■    ■    ■    ■    ■    ■]
          p1  └────── 7 padding bytes ────────┘    p2 — aligned, ONE fetch ✓
```

#### 4. The padding formula (from heap_1.c)

```c
// portBYTE_ALIGNMENT = 8, portBYTE_ALIGNMENT_MASK = 0x07

remainder = xWantedSize & ALIGNMENT_MASK;   // low 3 bits

if (remainder != 0) {
    padding      = BYTE_ALIGNMENT - remainder;
    xWantedSize += padding;                 // round up
}
```

Equivalently:

$$\text{actual} = \lceil \frac{\text{wanted}}{8} \rceil \times 8$$

#### 5. Padding table

| Requested | `wanted & 0x07` | Padding | Actual allocated |
|-----------|-----------------|---------|-----------------|
| 1         | 1               | 7       | **8**           |
| 5         | 5               | 3       | **8**           |
| 8         | 0               | 0       | **8**           |
| 13        | 5               | 3       | **16**          |
| 16        | 0               | 0       | **16**          |

#### 6. Why this guarantees all future pointers are aligned

Because every allocation is a **multiple of 8**, `xNextFreeByte` is always a multiple of 8 after each call. The next `pvReturn = pucAlignedHeap + xNextFreeByte` therefore always points to an 8-byte boundary — **automatically, forever**.

#### 7. Demo code location

```
02_example/03_heap_memory_management/01_heap_1_make/alignment_demo.c
```

Run with:
```bash
gcc -o alignment_demo alignment_demo.c && ./alignment_demo
```

---

### Summary Section

Padding in heap_1 exists because **CPUs require data to sit on natural address boundaries** (multiples of 8 on 64-bit systems) for efficient — or even correct — memory access. heap_1 rounds every allocation **up** to the next multiple of `portBYTE_ALIGNMENT` by adding padding bytes. This wastes a few bytes per allocation but guarantees every returned pointer is aligned, keeping the CPU happy and preventing hard faults on strict architectures like ARM Cortex-M.
The cost is small; the correctness guarantee is absolute.