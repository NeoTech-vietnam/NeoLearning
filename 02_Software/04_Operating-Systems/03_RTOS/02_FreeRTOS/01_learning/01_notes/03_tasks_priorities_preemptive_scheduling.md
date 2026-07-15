# Cornell Notes

## Topic: Tasks, Priorities, and Preemptive Scheduling

## Date: 2026-07-15

---

### Cue Column (Questions, Keywords, or Prompts)

- How does the scheduler pick which task runs next?
- What does "preemption" actually mean?
- What is a "time slice" / "tick period"?
- Preemptive vs cooperative — what changes?
- Time slicing on vs off — what's the trade-off?
- How do `configUSE_PREEMPTION` / `configUSE_TIME_SLICING` combine?
- Why can starvation happen, and how do you avoid it?
- How do you safely raise/lower a task's own priority at runtime?

---

### Notes Section (Main Notes)

#### 1. The core rule

> The scheduler always runs the **highest-priority Ready-state task** that is able to run.

- `configMAX_PRIORITIES` sets how many priority levels exist: valid range is `0` .. `(configMAX_PRIORITIES - 1)`.
- `0` is the **lowest** priority (the Idle task lives here). Higher numbers = higher priority.
- Multiple tasks can share a priority — they round-robin between each other.
- Priority is set at creation (`uxPriority` param of `xTaskCreate()`) and can be changed later with `vTaskPrioritySet()` / read with `uxTaskPriorityGet()`. Passing `NULL` as the task handle means "myself".

#### 2. Preemption, defined

**Preemption** = the scheduler involuntarily kicks the current *Running* task back to *Ready* the instant a **higher**-priority task becomes able to run (enters *Ready*) — no yield, no block call needed from the running task.

- Can happen at *any time*, not only on the tick interrupt (e.g. immediately when an ISR gives a semaphore that unblocks a higher-priority task).
- The preempted task has no say in it — it's involuntary by definition.
- Contrast with **cooperative scheduling**: a switch only happens when the running task itself blocks or calls `taskYIELD()`. Tasks are never preempted, so time slicing is meaningless there.

#### 3. Time slicing

- The **tick interrupt** fires every `1 / configTICK_RATE_HZ` seconds; each interval between two ticks is one **time slice** = one **tick period**.
- Time slicing only matters for tasks that **share the same priority** — it decides how they take turns.
- With time slicing ON: the scheduler re-evaluates at the *end of every tick*, and same-priority Ready tasks rotate in turn.
- With time slicing OFF: a task keeps running until it blocks/is preempted — no automatic rotation, so equal-priority tasks can get wildly uneven CPU time (see figure 4.21 in ch04 — Idle task ran 4+ tick periods before Task 2 got in edgewise).

#### 4. The three scheduling policies (`FreeRTOSConfig.h`)

| Scheduling Algorithm             | Prioritized | `configUSE_PREEMPTION` | `configUSE_TIME_SLICING` |
|-----------------------------------|-------------|--------------------------|-----------------------------|
| Preemptive + Time Slicing (default, most common) | Yes | 1 | 1 |
| Preemptive, no Time Slicing      | Yes         | 1                        | 0                            |
| Cooperative                      | No          | 0                        | any                          |

- **Preemptive + time slicing**: highest priority always runs; equal-priority tasks share time round-robin every tick. Used by nearly all small RTOS apps.
- **Preemptive, no time slicing**: same preemption rule, but no forced rotation among equal-priority tasks → fewer context switches (less overhead) but riskier CPU-time fairness. Advanced/expert use only.
- **Cooperative**: no preemption at all; task keeps the CPU until it blocks or calls `taskYIELD()`. Simplifies shared-resource access (no risk of being switched out mid-update) but hurts responsiveness — a high-priority event may sit in *Ready* while a lower-priority task refuses to yield.

#### 5. Why preemption matters for responsiveness vs. why cooperative helps with shared resources

- Preemptive: reacts to a high-priority event *immediately* — essential for real-time deadlines. Downside: the running task can be cut off mid-operation on a shared resource (e.g. mid-write to a UART), causing corruption if not protected (queues/semaphores/mutexes).
- Cooperative: you control exactly when a switch can occur (only at blocking calls or `taskYIELD()`), so you can finish touching a shared resource before yielding — but a high-priority ready task must literally wait for the running task to decide to give up the CPU.

#### 6. `configIDLE_SHOULD_YIELD`

- Idle task normally runs at priority 0, the lowest, so it never blocks a real application task — but if the app also creates tasks at priority 0, they share time with Idle.
- `configIDLE_SHOULD_YIELD = 0`: Idle keeps its full time slice even if other priority-0 tasks are Ready.
- `configIDLE_SHOULD_YIELD = 1`: Idle voluntarily yields the rest of its time slice each loop iteration if another priority-0 task is Ready — gives more CPU time to application-level idle-priority tasks.

#### 7. Starvation — the trap of "always ready" tasks

- A task that is *always* able to run (never blocks — e.g. a null-loop delay) will **starve** every lower-priority task if given anything above the lowest priority.
- Fix: make tasks **event-driven** — use `vTaskDelay()` / `vTaskDelayUntil()` / blocking on a queue or semaphore so the task enters the *Blocked* state and frees the CPU for lower-priority (or Idle) tasks.
- `vTaskDelay(x)`: blocks for `x` ticks *relative* to when it's called → period can drift.
- `vTaskDelayUntil(&last, x)`: blocks until an *absolute* tick count → gives a fixed execution period, immune to drift. Prefer this for strictly periodic tasks.

#### 8. Changing priority at runtime is itself a preemption trigger

- Raising another task's priority above the caller's (`vTaskPrioritySet(otherHandle, higher)`) causes an **immediate preemption** if that makes the other task the new highest-priority Ready task.
- Lowering your own priority (`vTaskPrioritySet(NULL, lower)`) can cause you to be immediately preempted by whichever task is now relatively higher.
- This is exactly how Example 4.8 in ch04 demonstrates preemption on demand, without needing an interrupt.

---

### Summary Section

FreeRTOS scheduling boils down to one rule: **always run the highest-priority task that can run.** Preemption is what enforces that rule instantly and involuntarily whenever a higher-priority task becomes Ready — whether from a tick interrupt, an ISR giving a semaphore, or a task changing its own/another's priority. Time slicing only decides fairness *among equal-priority* tasks (rotating every tick) and is orthogonal to preemption; turning it off trades fairness for fewer context switches. Cooperative scheduling removes preemption entirely, trading responsiveness for simpler shared-resource handling. The practical failure mode to guard against is **starvation**: any task with work to do 100% of the time (a busy/null loop) will lock out everything below its priority, so periodic/event-driven work should always block (`vTaskDelay`/`vTaskDelayUntil`/queue waits) rather than poll.
