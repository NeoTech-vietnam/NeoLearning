/*
 * alignment_demo.c — Standalone demonstration of heap_1.c alignment logic
 *
 * This file reproduces the EXACT same alignment calculations from heap_1.c
 * but with step-by-step prints so you can see every bit operation.
 *
 * Compile: gcc -o alignment_demo alignment_demo.c
 * Run:     ./alignment_demo
 *
 * No FreeRTOS dependency — pure C.
 */

#include <stdint.h>
#include <stdio.h>

/* ── Mirror the constants from heap_1.c / portmacro.h ───────────────────── */
#define HEAP_SIZE 64     /* keep small so the visual bar fits         */
#define BYTE_ALIGNMENT 8 /* portBYTE_ALIGNMENT on 64-bit POSIX        */
#define ALIGNMENT_MASK (BYTE_ALIGNMENT - 1) /* 0x07                     */

/* ── The heap array (same as ucHeap[] in heap_1.c) ──────────────────────── */
static uint8_t ucHeap[HEAP_SIZE];
static uint8_t *pucAlignedHeap = NULL; /* will be set once on first alloc */
static size_t xNextFreeByte = 0;

/* =========================================================================
 * Helpers
 * ========================================================================= */

/* Print the low 'bits' of 'val' in binary, grouped by 4 */
static void print_binary(uintptr_t val, int bits) {
  for (int i = bits - 1; i >= 0; i--) {
    printf("%c", (val >> i) & 1u ? '1' : '0');
    if (i % 4 == 0 && i > 0)
      printf(" ");
  }
}

/* Visual bar showing how much of the heap is used */
static void print_heap_bar(size_t used, size_t total) {
  int bar = 40;
  int filled = (int)((used * (size_t)bar) / total);
  printf("  heap [");
  for (int i = 0; i < bar; i++)
    printf("%s", i < filled ? "█" : "░");
  printf("]  %zu / %zu bytes\n", used, total);
}

/* =========================================================================
 * my_malloc — exact clone of pvPortMalloc() from heap_1.c with prints
 * ========================================================================= */
static void *my_malloc(size_t xWantedSize) {
  void *pvReturn = NULL;
  size_t xAdditionalRequiredSize;

  printf("\n╔══════════════════════════════════════════════════╗\n");
  printf("║  pvPortMalloc( %2zu bytes requested )              ║\n",
         xWantedSize);
  printf("╚══════════════════════════════════════════════════╝\n");

  /* ── Step 1: is xWantedSize already a multiple of BYTE_ALIGNMENT? ── */
  size_t remainder = xWantedSize & ALIGNMENT_MASK;

  printf("\n  STEP 1 — Check alignment\n");
  printf("    xWantedSize              = %zu\n", xWantedSize);
  printf("    binary (low 8 bits)      = ");
  print_binary(xWantedSize, 8);
  printf("\n");
  printf("    ALIGNMENT_MASK (0x%02X)    = ", ALIGNMENT_MASK);
  print_binary(ALIGNMENT_MASK, 8);
  printf("\n");
  printf("    xWantedSize & MASK       = %zu  ← %s\n", remainder,
         remainder == 0 ? "0 means already aligned, no padding needed"
                        : "non-0 means NOT aligned, need padding");

  /* ── Step 2: calculate and apply padding ──────────────────────────── */
  printf("\n  STEP 2 — Apply padding\n");
  if (remainder != 0) {
    xAdditionalRequiredSize = BYTE_ALIGNMENT - remainder;
    printf("    padding = BYTE_ALIGNMENT - remainder\n");
    printf("            = %d - %zu = %zu bytes\n", BYTE_ALIGNMENT, remainder,
           xAdditionalRequiredSize);
    xWantedSize += xAdditionalRequiredSize;
    printf("    padded xWantedSize       = %zu  (next multiple of %d)\n",
           xWantedSize, BYTE_ALIGNMENT);
  } else {
    printf("    No padding needed — xWantedSize stays %zu\n", xWantedSize);
  }

  /* ── Step 3: bump-pointer allocation ─────────────────────────────── */
  printf("\n  STEP 3 — Bump the pointer\n");
  printf("    xNextFreeByte (before)   = %zu\n", xNextFreeByte);
  printf("    xNextFreeByte + wanted   = %zu + %zu = %zu\n", xNextFreeByte,
         xWantedSize, xNextFreeByte + xWantedSize);
  printf("    HEAP_SIZE                = %d\n", HEAP_SIZE);

  if ((xWantedSize > 0) &&
      ((xNextFreeByte + xWantedSize) <= (size_t)HEAP_SIZE)) {
    pvReturn = pucAlignedHeap + xNextFreeByte;
    xNextFreeByte += xWantedSize;

    printf("    → FITS\n");
    printf("    pvReturn               = pucAlignedHeap + %zu = %p\n",
           xNextFreeByte - xWantedSize, pvReturn);
    printf("    xNextFreeByte (after)  = %zu\n", xNextFreeByte);

    /* Prove the returned pointer is aligned */
    uintptr_t addr = (uintptr_t)pvReturn;
    printf("\n  STEP 4 — Verify returned pointer alignment\n");
    printf("    pvReturn address         = 0x%016lX\n", addr);
    printf("    binary (low 8 bits)      = ");
    print_binary(addr, 8);
    printf("\n");
    printf("    addr & MASK (0x%02X)      = %lu  → %s\n", ALIGNMENT_MASK,
           addr & ALIGNMENT_MASK,
           (addr & ALIGNMENT_MASK) == 0 ? "8-BYTE ALIGNED ✓" : "NOT ALIGNED ✗");
  } else {
    printf("    → DOES NOT FIT — pvPortMalloc returns NULL\n");
  }

  printf("\n");
  print_heap_bar(xNextFreeByte, HEAP_SIZE);
  return pvReturn;
}

/* =========================================================================
 * main
 * ========================================================================= */
int main(void) {
  printf("╔═══════════════════════════════════════════════════════╗\n");
  printf("║        heap_1 Alignment — Step-by-Step Demo           ║\n");
  printf("╚═══════════════════════════════════════════════════════╝\n\n");

  /* ── Phase 1: Show the raw heap address and compute pucAlignedHeap ── */
  uintptr_t raw = (uintptr_t)&ucHeap[0];

  printf("━━━ PHASE 1: Computing pucAlignedHeap ━━━━━━━━━━━━━━━━━\n\n");
  printf("  ucHeap[0] raw address      = 0x%016lX\n", raw);
  printf("  binary (low 8 bits)        = ");
  print_binary(raw, 8);
  printf("\n  bottom 3 bits              = %lu  (%s)\n\n", raw & ALIGNMENT_MASK,
         (raw & ALIGNMENT_MASK) == 0 ? "already aligned"
                                     : "NOT aligned — gap needed");

  /* Formula from heap_1.c:
   *   pucAlignedHeap = ( &ucHeap[ALIGNMENT-1] ) & ~ALIGNMENT_MASK
   *
   * Trick: adding (ALIGNMENT-1) guarantees we are PAST the next boundary,
   *        then masking snaps DOWN to it.
   */
  uintptr_t step_a = (uintptr_t)&ucHeap[BYTE_ALIGNMENT - 1];
  uintptr_t mask = ~(uintptr_t)ALIGNMENT_MASK;
  uintptr_t aligned = step_a & mask;

  printf("  heap_1.c formula:\n");
  printf("    &ucHeap[ALIGNMENT-1]     = &ucHeap[%d] = 0x%016lX\n",
         BYTE_ALIGNMENT - 1, step_a);
  printf("    binary (low 8 bits)      = ");
  print_binary(step_a, 8);
  printf("\n\n");

  printf("    ~ALIGNMENT_MASK          = ~0x%02X = 0x%016lX\n", ALIGNMENT_MASK,
         mask);
  printf("    binary (low 8 bits)      = ");
  print_binary(mask, 8);
  printf("  ← zeros in bottom 3 bits clear any offset\n\n");

  printf("    step_a & mask            = 0x%016lX  ← pucAlignedHeap\n",
         aligned);
  printf("    binary (low 8 bits)      = ");
  print_binary(aligned, 8);
  printf("  ← bottom 3 bits are 000 → 8-byte aligned ✓\n\n");

  size_t wasted = aligned - raw;
  printf("  Bytes lost to alignment    = pucAlignedHeap - ucHeap[0]\n");
  printf("                             = 0x%lX - 0x%lX = %zu byte(s)\n",
         aligned, raw, wasted);
  printf("  Usable heap                = %d - %zu = %zu bytes\n\n", HEAP_SIZE,
         wasted, (size_t)HEAP_SIZE - wasted);

  print_heap_bar(wasted, HEAP_SIZE);

  pucAlignedHeap = (uint8_t *)aligned;

  /* ── Phase 2: Allocate various sizes and watch the rounding ──────── */
  printf("\n━━━ PHASE 2: Allocations (watch padding applied) ━━━━━━\n");

  void *p1 = my_malloc(1);  /* 1  → padded to  8 */
  void *p2 = my_malloc(8);  /* 8  → already aligned, no padding */
  void *p3 = my_malloc(13); /* 13 → padded to 16 */
  void *p4 = my_malloc(5);  /* 5  → padded to  8 */

  /* ── Phase 3: Summary table ───────────────────────────────────────── */
  printf("\n━━━ PHASE 3: Summary ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
  printf("  %-6s  %-8s  %-8s  %-18s  %-8s\n", "Ptr", "Requested", "Actual",
         "Address", "Aligned?");
  printf("  %-6s  %-8s  %-8s  %-18s  %-8s\n", "──────", "─────────", "────────",
         "──────────────────", "────────");

  struct {
    void *p;
    size_t req;
    size_t actual;
  } rows[] = {
      {p1, 1, 8},
      {p2, 8, 8},
      {p3, 13, 16},
      {p4, 5, 8},
  };
  for (int i = 0; i < 4; i++) {
    uintptr_t a = (uintptr_t)rows[i].p;
    printf("  p%-5d  %-9zu  %-8zu  0x%016lX  %s\n", i + 1, rows[i].req,
           rows[i].actual, a, (a & ALIGNMENT_MASK) == 0 ? "YES ✓" : "NO ✗");
  }
  printf("\n  Key point: every returned pointer has (addr & 0x07) == 0\n");
  printf("  The CPU can always read from these addresses in ONE access.\n");

  return 0;
}
