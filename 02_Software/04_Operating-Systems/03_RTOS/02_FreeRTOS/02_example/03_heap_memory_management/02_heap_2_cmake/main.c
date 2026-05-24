/*
* heap_2 demonstration — FreeRTOS on Ubuntu (POSIX simulator)
*
* What this shows:
*   1. 
*   2. 
*   3. 
*   4. 
*      
*
* NOTE — POSIX simulator overhead:
*   On 64-bit Linux, sizeof(StackType_t) = 8 bytes, and
*   PTHREAD_STACK_MIN = 16 384 bytes, so each task stack consumes
*   16 384 * 8 = 128 KB from heap_1. Four tasks alone need ~512 KB.
*   The heap must therefore be large enough for POSIX stack overhead
*   before we can demonstrate the "no free" property.
*
* Demo flow:
*   1. main() prints free heap, creates 3 worker tasks + 1 monitor task.
*   2. Each worker does ONE pvPortMalloc(ALLOC_CHUNK_BYTES) then suspends.
*   3. Monitor prints free heap every 2 s for 3 cycles.
*   4. On the 4th cycle monitor tries to allocate the entire remaining heap
*      in one shot — pvPortMalloc() fails and the hook fires.
*
* Build:  cmake
* Run:    ./build/my_app   (Ctrl+C to quit)
*/

#include <signal.h>
#include <stdio.h>
#include <stdlib.h>

#include "FreeRTOS.h"
#include "queue.h"
#include "task.h"

/* ── Task priorities ─────────────────────────────────────────────────────── */
#define MONITOR_TASK_PRIORITY (tskIDLE_PRIORITY + 3)
#define WORKER_TASK_PRIORITY (tskIDLE_PRIORITY + 1)

/* How often the monitor prints heap stats (ms) */
#define MONITOR_PERIOD_MS pdMS_TO_TICKS(2000UL)
