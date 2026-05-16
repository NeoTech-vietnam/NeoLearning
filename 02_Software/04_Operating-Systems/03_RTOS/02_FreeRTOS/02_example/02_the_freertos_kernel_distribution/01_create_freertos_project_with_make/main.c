/*
 * MyApp_Posix_GCC — FreeRTOS on Ubuntu (POSIX simulator)
 *
 * This file is structured following "Listing 2.1" from the FreeRTOS book:
 *   1. prvSetupHardware() equivalent — signal setup, nothing board-specific
 *   2. Create application tasks
 *   3. vTaskStartScheduler()
 *
 * It demonstrates the three most fundamental FreeRTOS building blocks:
 *   - Tasks      : prvSenderTask, prvReceiverTask
 *   - Queues     : xMessageQueue (passing data between tasks)
 *   - Delays     : vTaskDelay() / pdMS_TO_TICKS()
 *
 * On Ubuntu the POSIX port maps every FreeRTOS task to a Linux pthread.
 * Real-time guarantees are NOT provided by this port — it is a simulator
 * intended for development, learning, and unit testing.
 *
 * Build:  make
 * Run:    ./build/my_app          (Ctrl+C to quit)
 */

/* Standard C library */
#include <stdio.h>
#include <stdlib.h>
#include <signal.h>
#include <errno.h>
#include <unistd.h>

/* FreeRTOS kernel headers — order matters */
#include "FreeRTOS.h"
#include "task.h"
#include "queue.h"
#include "timers.h"

/* =========================================================================
 *  Application constants
 * ========================================================================= */

/* Task priorities (higher number = higher priority) */
#define SENDER_TASK_PRIORITY    ( tskIDLE_PRIORITY + 1 )
#define RECEIVER_TASK_PRIORITY  ( tskIDLE_PRIORITY + 2 )

/* How often the sender task sends a message (milliseconds → ticks) */
#define SEND_PERIOD_MS          pdMS_TO_TICKS( 500UL )

/* Queue capacity */
#define QUEUE_LENGTH            ( 5 )

/* =========================================================================
 *  Module-level handle for the queue
 * ========================================================================= */
static QueueHandle_t xMessageQueue = NULL;

/* =========================================================================
 *  Task function declarations
 * ========================================================================= */
static void prvSenderTask( void * pvParameters );
static void prvReceiverTask( void * pvParameters );

/* =========================================================================
 *  SIGINT handler — lets Ctrl+C exit cleanly
 * ========================================================================= */
static void handle_sigint( int sig )
{
    ( void ) sig;
    printf( "\n[main] Ctrl+C — exiting.\n" );
    _exit( 0 );
}

/* =========================================================================
 *  Hardware / platform setup
 *  (On real hardware this configures clocks, GPIOs, UART, etc.
 *   On the POSIX simulator we only need the signal handler.)
 * ========================================================================= */
static void prvSetupHardware( void )
{
    /* Register SIGINT so Ctrl+C terminates the process gracefully.
     * Note: the FreeRTOS POSIX port does not block SIGINT. */
    signal( SIGINT, handle_sigint );
}

/* =========================================================================
 *  main() — Listing 2.1 skeleton
 * ========================================================================= */
int main( void )
{
    /* --- Step 1: hardware / platform initialisation -------------------- */
    prvSetupHardware();

    /* --- Step 2: create the queue -------------------------------------- */
    /*
     * xQueueCreate( uxQueueLength, uxItemSize )
     *   uxQueueLength : max items that can sit in the queue at one time
     *   uxItemSize    : size of each item in bytes
     */
    xMessageQueue = xQueueCreate( QUEUE_LENGTH, sizeof( uint32_t ) );

    configASSERT( xMessageQueue != NULL );

    /* --- Step 3: create application tasks ------------------------------ */
    /*
     * xTaskCreate( pvTaskCode,      Task function
     *              pcName,          Debug name (≤ configMAX_TASK_NAME_LEN)
     *              usStackDepth,    Stack size in WORDS
     *              pvParameters,    Passed to pvTaskCode as argument
     *              uxPriority,      Priority (0 = idle, configMAX_PRIORITIES-1 = highest)
     *              pxCreatedTask )  Optional handle output (NULL if not needed)
     */
    xTaskCreate( prvSenderTask,
                 "Sender",
                 configMINIMAL_STACK_SIZE,
                 NULL,
                 SENDER_TASK_PRIORITY,
                 NULL );

    xTaskCreate( prvReceiverTask,
                 "Receiver",
                 configMINIMAL_STACK_SIZE,
                 NULL,
                 RECEIVER_TASK_PRIORITY,
                 NULL );

    /* --- Step 4: start the scheduler ----------------------------------- */
    /*
     * vTaskStartScheduler() never returns under normal operation.
     * If it does return, there was not enough heap to create the idle task.
     */
    vTaskStartScheduler();

    /* Should never reach here */
    printf( "[main] ERROR: scheduler returned — not enough heap!\n" );
    for( ;; );

    return 0; /* suppress compiler warning */
}

/* =========================================================================
 *  Sender task
 *
 *  Sends an incrementing counter value to the queue every SEND_PERIOD_MS.
 *  Uses vTaskDelay() to block (sleep) without burning CPU.
 * ========================================================================= */
static void prvSenderTask( void * pvParameters )
{
    uint32_t ulCounter = 0;
    BaseType_t xStatus;

    ( void ) pvParameters; /* unused */

    printf( "[Sender] task started.\n" );

    for( ;; )
    {
        /* Block this task for SEND_PERIOD_MS milliseconds.
         * Other tasks (or the idle task) run during this time. */
        vTaskDelay( SEND_PERIOD_MS );

        /* Send the counter value to the back of the queue.
         * Third argument 0 = don't wait if the queue is full (fail immediately). */
        xStatus = xQueueSendToBack( xMessageQueue, &ulCounter, 0 );

        if( xStatus == pdPASS )
        {
            printf( "[Sender] sent: %lu\n", ( unsigned long ) ulCounter );
            ulCounter++;
        }
        else
        {
            /* Queue was full — the receiver is not keeping up */
            printf( "[Sender] queue full, discarding value %lu\n",
                    ( unsigned long ) ulCounter );
        }
    }
}

/* =========================================================================
 *  Receiver task
 *
 *  Waits (blocks) until a message arrives in the queue, then prints it.
 *  portMAX_DELAY causes it to wait forever — no CPU is consumed while
 *  waiting.
 * ========================================================================= */
static void prvReceiverTask( void * pvParameters )
{
    uint32_t ulReceivedValue;
    BaseType_t xStatus;

    ( void ) pvParameters; /* unused */

    printf( "[Receiver] task started.\n" );

    for( ;; )
    {
        /* Block indefinitely until an item is available in the queue.
         * portMAX_DELAY = wait forever (suspends the task, no busy-wait). */
        xStatus = xQueueReceive( xMessageQueue, &ulReceivedValue, portMAX_DELAY );

        if( xStatus == pdPASS )
        {
            printf( "[Receiver] received: %lu\n", ( unsigned long ) ulReceivedValue );
        }
    }
}

/* =========================================================================
 *  Required FreeRTOS hook functions
 *
 *  These are called by the kernel and MUST be defined when the corresponding
 *  configUSE_xxx_HOOK setting is 1 in FreeRTOSConfig.h.
 * ========================================================================= */

/*
 * vAssertCalled — triggered by configASSERT() when an assertion fails.
 * Spins in a loop so you can attach a debugger and inspect the call stack.
 */
void vAssertCalled( const char * pcFile, unsigned long ulLine )
{
    volatile int xShouldContinue = 0; /* set to 1 in debugger to continue */

    printf( "ASSERT FAILED: %s line %lu\n", pcFile, ulLine );

    taskENTER_CRITICAL();
    while( xShouldContinue == 0 )
    {
        /* Spin here.  Attach gdb and set xShouldContinue = 1 to resume. */
    }
    taskEXIT_CRITICAL();
}

/* -------------------------------------------------------------------------
 * Static-allocation callbacks
 *
 * Required because configSUPPORT_STATIC_ALLOCATION = 1.
 * The kernel needs memory for the Idle task and (when timers are enabled)
 * the Timer/Daemon task.  We provide static buffers here.
 * ------------------------------------------------------------------------- */

/* Idle task buffers */
void vApplicationGetIdleTaskMemory( StaticTask_t ** ppxIdleTaskTCBBuffer,
                                    StackType_t  ** ppxIdleTaskStackBuffer,
                                    configSTACK_DEPTH_TYPE * pulIdleTaskStackSize )
{
    static StaticTask_t xIdleTaskTCB;
    static StackType_t  uxIdleTaskStack[ configMINIMAL_STACK_SIZE ];

    *ppxIdleTaskTCBBuffer   = &xIdleTaskTCB;
    *ppxIdleTaskStackBuffer = uxIdleTaskStack;
    *pulIdleTaskStackSize   = configMINIMAL_STACK_SIZE;
}

/* Timer/Daemon task buffers */
static StackType_t uxTimerTaskStack[ configTIMER_TASK_STACK_DEPTH ];

void vApplicationGetTimerTaskMemory( StaticTask_t ** ppxTimerTaskTCBBuffer,
                                     StackType_t  ** ppxTimerTaskStackBuffer,
                                     configSTACK_DEPTH_TYPE * pulTimerTaskStackSize )
{
    static StaticTask_t xTimerTaskTCB;

    *ppxTimerTaskTCBBuffer   = &xTimerTaskTCB;
    *ppxTimerTaskStackBuffer = uxTimerTaskStack;
    *pulTimerTaskStackSize   = configTIMER_TASK_STACK_DEPTH;
}
