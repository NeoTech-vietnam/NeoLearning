/*
 * FreeRTOS Configuration for the POSIX/GCC (Linux/Ubuntu) port.
 *
 * This is a minimal configuration file derived from the Posix_GCC demo.
 * Adjust these values for your application's needs.
 *
 * Full reference: https://www.FreeRTOS.org/a00110.html
 */

#ifndef FREERTOS_CONFIG_H
#define FREERTOS_CONFIG_H

#include <pthread.h> /* Required for PTHREAD_STACK_MIN */

/*-----------------------------------------------------------
 * Scheduler behaviour
 *----------------------------------------------------------*/

/* 1 = preemptive scheduling (tasks can be interrupted by higher-priority
 * tasks). 0 = cooperative scheduling (tasks yield voluntarily). */
#define configUSE_PREEMPTION 1

/* Tick rate in Hz.  1000 = 1 ms tick period. */
#define configTICK_RATE_HZ (1000)

/* Maximum number of task priority levels (0 = lowest, configMAX_PRIORITIES-1 =
 * highest). */
#define configMAX_PRIORITIES (7)

/* Minimum stack size for any task (in words).  PTHREAD_STACK_MIN ensures
 * the POSIX thread underneath has enough stack. */
#define configMINIMAL_STACK_SIZE (PTHREAD_STACK_MIN)

/* Total heap size managed by heap_1.
 * On the 64-bit POSIX simulator each task stack =
 *   PTHREAD_STACK_MIN (16384) * sizeof(StackType_t) (8) = 128 KB.
 * 4 tasks need ~512 KB for stacks alone, so 1 MB gives enough room
 * while still letting us demonstrate deliberate heap exhaustion. */
#define configTOTAL_HEAP_SIZE ((size_t)(1 * 1024 * 1024))

/* Maximum length of a task name string (including null terminator). */
#define configMAX_TASK_NAME_LEN (12)

/* 0 = 32-bit tick counter (overflows after ~49 days at 1000 Hz). */
#define configUSE_16_BIT_TICKS 0

/* When 1, the idle task yields immediately if any other task at the idle
 * priority is ready to run. */
#define configIDLE_SHOULD_YIELD 1

/*-----------------------------------------------------------
 * Hook (callback) functions
 *----------------------------------------------------------*/

/* Called on every RTOS tick (from "interrupt" context — keep it short). */
#define configUSE_TICK_HOOK 0

/* Called every time the idle task runs. */
#define configUSE_IDLE_HOOK 0

/* Called once when the timer/daemon task first runs. */
#define configUSE_DAEMON_TASK_STARTUP_HOOK 0

/* Called if pvPortMalloc() fails (heap exhausted).
 * Enable so vApplicationMallocFailedHook() is invoked when heap_1 runs out. */
#define configUSE_MALLOC_FAILED_HOOK 1

/* 0 = no stack-overflow checking (not functional on POSIX port anyway). */
#define configCHECK_FOR_STACK_OVERFLOW 0

/*-----------------------------------------------------------
 * Feature enable/disable
 *----------------------------------------------------------*/

#define configUSE_MUTEXES 1
#define configUSE_RECURSIVE_MUTEXES 1
#define configUSE_COUNTING_SEMAPHORES 1
#define configUSE_QUEUE_SETS 1
#define configUSE_TASK_NOTIFICATIONS 1
#define configUSE_TRACE_FACILITY 1
#define configUSE_APPLICATION_TASK_TAG 0

/* Queue registry — useful for debug/trace tools (0 to disable). */
#define configQUEUE_REGISTRY_SIZE 8

/*-----------------------------------------------------------
 * Memory allocation
 *----------------------------------------------------------*/

/* Allow both static and dynamic allocation (dynamic used in this demo). */
#define configSUPPORT_STATIC_ALLOCATION 1
#define configSUPPORT_DYNAMIC_ALLOCATION 1

/*-----------------------------------------------------------
 * Software timers
 *----------------------------------------------------------*/

#define configUSE_TIMERS 1
#define configTIMER_TASK_PRIORITY (configMAX_PRIORITIES - 1)
#define configTIMER_QUEUE_LENGTH 10
#define configTIMER_TASK_STACK_DEPTH (configMINIMAL_STACK_SIZE * 2)

/*-----------------------------------------------------------
 * Stack type used for depth values
 *----------------------------------------------------------*/
#define configSTACK_DEPTH_TYPE uint32_t

/*-----------------------------------------------------------
 * Run-time stats (disabled — enable if you need profiling)
 *----------------------------------------------------------*/
#define configGENERATE_RUN_TIME_STATS 0

/*-----------------------------------------------------------
 * Optional API functions (set to 1 to include, 0 to exclude)
 *----------------------------------------------------------*/
#define INCLUDE_vTaskPrioritySet 1
#define INCLUDE_uxTaskPriorityGet 1
#define INCLUDE_vTaskDelete                                                    \
  0 /* heap_1 cannot free memory — never call vTaskDelete */
#define INCLUDE_vTaskSuspend 1
#define INCLUDE_vTaskDelayUntil 1
#define INCLUDE_vTaskDelay 1
#define INCLUDE_uxTaskGetStackHighWaterMark 1
#define INCLUDE_xTaskGetSchedulerState 1
#define INCLUDE_eTaskGetState 1
#define INCLUDE_xTimerPendFunctionCall 1
#define INCLUDE_xTaskGetHandle 1

/*-----------------------------------------------------------
 * Assert — calls vAssertCalled() which spins in a debuggable loop
 *----------------------------------------------------------*/
extern void vAssertCalled(const char *pcFile, unsigned long ulLine);
#define configASSERT(x)                                                        \
  if ((x) == 0)                                                                \
  vAssertCalled(__FILE__, __LINE__)

#endif /* FREERTOS_CONFIG_H */
