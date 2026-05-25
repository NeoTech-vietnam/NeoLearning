# Cornell Notes

## Topic: FreeRTOS Heap Schemes — Overview and Dynamic vs Static Allocation

## Date: 2026-05-23

---

### Cue Column (Questions, Keywords, or Prompts)

- What are the 5 heap schemes?
- Why was Heap_2 replaced?
- What makes Heap_3 different?
- When do you use Heap_5?
- Dynamic vs Static: key trade-offs?
- Can Heap_3 and Static coexist?

---

### Notes Section (Main Notes)

#### 1. The 5 Heap Schemes

| Scheme | Free? | Key characteristic |
|--------|-------|--------------------|
| Heap_1 | No    | Simplest; no fragmentation; fully deterministic |
| Heap_2 | Yes   | No block merging → fragmentation risk; **deprecated by Heap_4** |
| Heap_3 | Yes   | Wraps `malloc()`/`free()`; heap size set by linker, not `configTOTAL_HEAP_SIZE` |
| Heap_4 | Yes   | **Most common**; merges adjacent free blocks to reduce fragmentation |
| Heap_5 | Yes   | Like Heap_4, but heap can span multiple non-contiguous RAM regions |

#### 2. Dynamic vs Static Allocation

| Aspect | Dynamic (Heap 1/2/4/5) | Static |
|--------|------------------------|--------|
| API convenience | `xTaskCreate()` — automatic | `xTaskCreateStatic()` — caller supplies TCB + stack arrays |
| RAM reclaim | Freed when task is deleted | Occupied permanently from compile time |
| Failure mode | `pdFAIL` at runtime | Linker error at build time |
| Safety | Runtime risk | Linker-guaranteed before execution |

**Heap_1 vs Static:** Both allocate once and never free — but Heap_1 lets the kernel auto-slice one shared `ucHeap[]`, while Static requires the caller to declare a separate array per object.

#### 3. Mixing Heap_3 with Static

Heap_3 handles only `malloc()`/`free()` calls. Static allocation via `xTaskCreateStatic()` is a completely independent mechanism — the two can coexist without conflict.

---

### Summary Section

FreeRTOS offers five heap schemes ranging from the no-free simplicity of Heap_1 to Heap_5's multi-region support. **Heap_4 is the standard choice** for most applications. Dynamic allocation is convenient but carries a runtime out-of-memory risk; static allocation eliminates that risk by letting the linker verify RAM at build time. The two approaches are not mutually exclusive.
