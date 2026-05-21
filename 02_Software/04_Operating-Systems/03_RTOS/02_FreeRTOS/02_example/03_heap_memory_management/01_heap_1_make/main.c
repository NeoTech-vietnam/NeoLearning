/*
 * heap_1 demonstration — FreeRTOS on Ubuntu (POSIX simulator)
 *
 * What this shows:
 *   1. heap_1 allocates from a fixed pool (configTOTAL_HEAP_SIZE = 1 MB).
 *   2. Memory is NEVER freed — vPortFree() is a no-op that assert-fails.
 *   3. xPortGetFreeHeapSize() only ever decreases.
 *   4. When the pool is exhausted, pvPortMalloc() returns NULL and
 *      vApplicationMallocFailedHook() is called.
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
 * Build:  make
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

/* How many monitor cycles before we attempt to exhaust the heap */
#define EXHAUST_AFTER_CYCLES  3U

/* How much each worker allocates once at startup (bytes) */
#define ALLOC_CHUNK_BYTES     ( 32U * 1024U )  /* 32 KB per worker */

/* ── SIGINT handler ──────────────────────────────────────────────────────── */
static void handle_sigint(int sig) {
  (void)sig;
  printf("\n[main] Ctrl+C — exiting.\n");
  _exit(0);
}

/* =========================================================================
 * Monitor task
 *
 * Periodically prints the remaining free heap so you can observe that
 * heap_1 only goes down, never up.
 * ========================================================================= */
static void prvMonitorTask(void *pvParameters) {
  (void)pvParameters;
  unsigned int uCycle = 0;

  printf("[Monitor] started. Watching free heap ...\n");

  for (;;) {
    vTaskDelay(MONITOR_PERIOD_MS);
    uCycle++;

    size_t xFree = xPortGetFreeHeapSize();
    printf("[Monitor] cycle %u — free heap = %zu bytes\n", uCycle, xFree);

    if (uCycle == EXHAUST_AFTER_CYCLES) {
      /* ── Deliberate exhaustion demo ─────────────────────────────────
       * Try to allocate MORE than what is left.
       * pvPortMalloc() must return NULL and fire the failed hook.
       * ---------------------------------------------------------------- */
      size_t xOversized = xFree + 1024U;  /* guaranteed to fail */
      printf("[Monitor] attempting to allocate %zu bytes "
             "(only %zu available) ...\n", xOversized, xFree);

      void *pv = pvPortMalloc(xOversized);
      if (pv == NULL) {
        printf("[Monitor] pvPortMalloc returned NULL as expected.\n");
        printf("[Monitor] free heap is still %zu bytes "
               "(heap_1 never corrupts on failure).\n",
               xPortGetFreeHeapSize());
      }
      /* Now try a small allocation that DOES fit — heap is not damaged */
      void *pvSmall = pvPortMalloc(64U);
      if (pvSmall != NULL) {
        printf("[Monitor] small 64-byte alloc at %p still succeeded.\n",
               pvSmall);
        printf("[Monitor] free heap now = %zu bytes.\n",
               xPortGetFreeHeapSize());
      }
    }
  }
}

/* =========================================================================
 * Worker task
 *
 * Allocates a chunk of memory from the heap on first activation, then
 * blocks forever — demonstrating that heap_1 memory can never be returned.
 *
 * pvParameters carries a worker ID (cast from int).
 * ========================================================================= */
static void prvWorkerTask(void *pvParameters) {
  int id = (int)(intptr_t)pvParameters;
  void *pvBlock;

  printf("[Worker %d] started. Free heap before alloc = %zu bytes\n", id,
         xPortGetFreeHeapSize());

  /* Allocate a chunk — this permanently consumes heap_1 memory. */
  pvBlock = pvPortMalloc(ALLOC_CHUNK_BYTES);

  if (pvBlock != NULL) {
    printf("[Worker %d] allocated %u bytes at %p. "
           "Free heap after = %zu bytes\n",
           id, ALLOC_CHUNK_BYTES, pvBlock, xPortGetFreeHeapSize());
  } else {
    /* Should not reach here with 10 KB heap and 3 small workers,
     * but heap_1 will call vApplicationMallocFailedHook() above. */
    printf("[Worker %d] allocation FAILED — heap exhausted!\n", id);
  }

  /* Block forever — memory is never freed with heap_1. */
  vTaskSuspend(NULL);
}

/* =========================================================================
 * main
 * ========================================================================= */
int main(void) {
  signal(SIGINT, handle_sigint);

  printf("[main] Total heap (configTOTAL_HEAP_SIZE) = %ld bytes\n",
         configTOTAL_HEAP_SIZE);
  printf("[main] Free heap before any task creation  = %zu bytes\n",
         xPortGetFreeHeapSize());

  /* Create three worker tasks — each permanently consumes ALLOC_CHUNK_BYTES */
  for (int i = 1; i <= 3; i++) {
    xTaskCreate(prvWorkerTask, "Worker", configMINIMAL_STACK_SIZE,
                (void *)(intptr_t)i, /* pass worker ID */
                WORKER_TASK_PRIORITY, NULL);
  }

  /* Create monitor task to keep printing free heap */
  xTaskCreate(prvMonitorTask, "Monitor", configMINIMAL_STACK_SIZE, NULL,
              MONITOR_TASK_PRIORITY, NULL);

  printf("[main] Free heap after task creation = %zu bytes\n",
         xPortGetFreeHeapSize());

  vTaskStartScheduler();

  /* Never reached */
  printf("[main] ERROR: scheduler returned — heap too small!\n");
  for (;;)
    ;

  return 0;
}

/* =========================================================================
 * Required FreeRTOS hook functions
 * ========================================================================= */

/* Called when pvPortMalloc() fails (heap_1 pool exhausted) */
void vApplicationMallocFailedHook(void) {
  printf("[HOOK] vApplicationMallocFailedHook: heap_1 is FULL!\n");
  /* In a real system you would log the error and reset or halt. */
}

void vAssertCalled(const char *pcFile, unsigned long ulLine) {
  volatile int xShouldContinue = 0;

  printf("ASSERT FAILED: %s line %lu\n", pcFile, ulLine);

  taskENTER_CRITICAL();
  while (xShouldContinue == 0) { /* attach gdb and set to 1 to resume */
  }
  taskEXIT_CRITICAL();
}

/* Static-allocation callbacks (required: configSUPPORT_STATIC_ALLOCATION = 1)
 */
void vApplicationGetIdleTaskMemory(
    StaticTask_t **ppxIdleTaskTCBBuffer, StackType_t **ppxIdleTaskStackBuffer,
    configSTACK_DEPTH_TYPE *pulIdleTaskStackSize) {
  static StaticTask_t xIdleTaskTCB;
  static StackType_t uxIdleTaskStack[configMINIMAL_STACK_SIZE];

  *ppxIdleTaskTCBBuffer = &xIdleTaskTCB;
  *ppxIdleTaskStackBuffer = uxIdleTaskStack;
  *pulIdleTaskStackSize = configMINIMAL_STACK_SIZE;
}

static StackType_t uxTimerTaskStack[configTIMER_TASK_STACK_DEPTH];

void vApplicationGetTimerTaskMemory(
    StaticTask_t **ppxTimerTaskTCBBuffer, StackType_t **ppxTimerTaskStackBuffer,
    configSTACK_DEPTH_TYPE *pulTimerTaskStackSize) {
  static StaticTask_t xTimerTaskTCB;

  *ppxTimerTaskTCBBuffer = &xTimerTaskTCB;
  *ppxTimerTaskStackBuffer = uxTimerTaskStack;
  *pulTimerTaskStackSize = configTIMER_TASK_STACK_DEPTH;
}
