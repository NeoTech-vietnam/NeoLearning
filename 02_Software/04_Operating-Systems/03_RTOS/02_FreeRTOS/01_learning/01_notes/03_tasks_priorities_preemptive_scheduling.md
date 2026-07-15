# Cornell Notes

## Topic: Task Priorities & Preemptive Scheduling

## Date: 2026-07-15

---

### Cue Column (Questions, Keywords, or Prompts)

- How does the scheduler pick the next *Running* task?
- What does "preemption" actually mean?
- How is preemption different from time slicing?
- What is a time slice, and how does it relate to the tick period?
- What are the 3 scheduling policies, and which `FreeRTOSConfig.h` constants select them?
- What is `configIDLE_SHOULD_YIELD` for?
- What is task starvation, and how do `vTaskDelay()` / `vTaskDelayUntil()` prevent it?
- Does changing a task's priority at runtime trigger preemption?

---

### Notes Section (Main Notes)

#### 1. The core rule

> The scheduler always runs the **highest-priority *Ready* task**. Tasks that share a priority take turns (Round Robin).

```
configMAX_PRIORITIES = 5

Priority 4  (highest) │ ██████████████████████████  ← runs whenever Ready
Priority 3             │ ░░░░░░░░░░░░░░░░░░░░░░░░░░  ← runs only if 4 is not Ready
Priority 2             │ ░░░░░░░░░░░░░░░░░░░░░░░░░░  ← runs only if 3 & 4 are not Ready
Priority 1             │ ░░░░░░░░░░░░░░░░░░░░░░░░░░
Priority 0  (Idle)     │ ░░░░░░░░░░░░░░░░░░░░░░░░░░  ← runs only if nothing else is Ready
                        └─ higher priority always wins the CPU ─┘
```

#### 2. Task state machine (where preemption fits in)

```
                 xTaskCreate() / event arrives
                              │
                              ▼
        ┌──────────┐   scheduler picks   ┌──────────┐
        │  Ready   │ ───────────────────▶ │ Running  │
        │          │ ◀─────────────────── │          │
        └──────────┘   PREEMPTED by a     └──────────┘
             ▲          higher-priority         │
             │          Ready task              │ vTaskDelay() /
             │                                   │ queue/semaphore wait
             │          event / timeout          ▼
             └──────────────────────────── ┌──────────┐
                                            │ Blocked  │
                                            └──────────┘
```

Preemption is the **Running → Ready** arrow happening *involuntarily* — the task did not yield or block, a higher-priority task simply became Ready and took the CPU from it.

#### 3. Preemption in action — unique priorities

Based on Figure 4.18 (`ch04.md` §4.5/§4.12.3): Task 1 > Task 2 > Task 3 > Idle.

```
time ──▶            t1  t3      t5    t6      t8  t9        t10  t11  t12
Task 1 (highest)     ·   ·       ·     ·        ·   ·        ▓▓▓▓▓░░░   ·
Task 2               ·   ·       ·     ▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░▓▓▓▓░
Task 3                   ▓▓░░░░░▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓▓▓▓
Idle (lowest)        ▓▓▓▓░       ░              ░                       

▓ = Running   ░ = Ready/Blocked (waiting)

t3: Task 3's event fires → preempts Idle
t5: Task 3's event fires again → preempts Idle
t6: Task 2's period fires → preempts Task 3 (Task 2 has higher priority)
t8: Task 2 blocks → Task 3 resumes where it left off
t9: Task 3 blocks; Idle runs (nothing else Ready)
t10: Task 1's event fires → preempts Task 2 (highest priority always wins)
t11: Task 1 blocks → Task 2 resumes
```

Key takeaway: **whoever has the highest priority and is Ready runs — immediately**, even mid-execution of a lower-priority task. That instantaneous switch is preemption; nothing about it waits for a tick interrupt.

#### 4. Time slicing — sharing the CPU between *equal*-priority tasks

Time slicing only matters when two or more *Ready* tasks share the **same** priority. Based on Figure 4.19.

```
Tick interrupts:     t1  t2  t3  t4  t5      t6      t8  t9  t10 t11
                      │   │   │   │   │       │       │   │   │   │
Idle (prio 0)        [██]    [██]    [██]                [██]
Task 2 (prio 0)          [██]    [██]    [██──┐  preempted at t6
Task 1 (prio 1)                              [██] (event, runs t6→t7)
                                                  └[██] Task 2 resumes at t7

One time slice = one tick period (configTICK_RATE_HZ).
Idle and Task 2 (both prio 0) alternate every tick — that's time slicing.
Task 1 (prio 1) cuts in immediately when its event fires at t6 — that's preemption.
```

`configUSE_TIME_SLICING` turns this alternation on/off; it never affects *whether* a higher-priority task preempts a lower one — only how equal-priority tasks divide leftover time.

#### 5. The three scheduling policies

| Scheduling Algorithm             | Prioritized | `configUSE_PREEMPTION` | `configUSE_TIME_SLICING` |
| --------------------------------- | :---------: | :---------------------: | :------------------------: |
| Preemptive **with** time slicing  | Yes         | 1                        | 1                           |
| Preemptive **without** time slicing | Yes       | 1                        | 0                           |
| Co-operative                      | No          | 0                        | Any (unused)                |

```
Preemptive + time slicing   (default, most common)
  ┌─┬─┬─┬─┬─┬─┬─┬─┬─┐   switch on every tick AND on every preemption event
  A B A B A B │C│ A B    ← C (higher prio) cuts in the instant it's Ready
  └─┴─┴─┴─┴─┴─┴─┴─┴─┘

Preemptive, no time slicing
  ┌───────┬─┬─────────┐  equal-priority tasks run until they block —
  │   A   │C│    B     │  no forced switch at each tick; A/B split can be very unequal
  └───────┴─┴─────────┘

Co-operative
  ┌─────────┬───────────┐ a task only leaves Running when IT calls taskYIELD()
  │    A     │     B      │ or blocks itself — never preempted by a higher-priority task
  └─────────┴───────────┘
```

- **Preemptive, no time slicing**: fewer context switches (less overhead) but equal-priority tasks can get wildly unequal CPU time (Figure 4.21) — an advanced/expert option.
- **Co-operative**: simplest to reason about for shared-resource corruption (a task controls exactly when it gives up the CPU), but far less responsive — a high-priority event can sit in *Ready* for a long time waiting for `taskYIELD()`.

#### 6. `configIDLE_SHOULD_YIELD`

```
configIDLE_SHOULD_YIELD = 0            configIDLE_SHOULD_YIELD = 1
Idle keeps its whole slice:            Idle yields early if another
                                        Idle-priority task is Ready:

 tick t5        t6  t7  t8              tick t5     t6  t7  t8
 [Idle────][Task2──][Idle────]          [Idle][Task2────────][Idle]
                                          └short┘  gets the REST of the
                                                    slice Idle gave up
```

Without it, an application task sharing the Idle priority is forced to fight the Idle task for every full tick; with it, the Idle task politely steps aside as soon as there's real work Ready at that priority.

#### 7. Task starvation & how delays prevent it

```
Without any blocking call:
Task 2 (prio 2, busy loop)   ██████████████████████████████████… forever
Task 1 (prio 1)              ·  (never scheduled — starved)

With vTaskDelay() / vTaskDelayUntil():
Task 2 (prio 2)              ██░░░░░░██░░░░░░██░░░░░░██░░░░░░   ← Blocked while delayed
Task 1 (prio 1)              ░░██░░░░░░██░░░░░░██░░░░░░██░░░   ← gets a turn during the gaps
```

A higher-priority task that never blocks (never calls `vTaskDelay()`, never waits on a queue/semaphore) can run forever and permanently starve every lower-priority task — this is intentional scheduler behavior, not a bug. `vTaskDelay()`/`vTaskDelayUntil()` move the task to *Blocked*, which is what actually frees the CPU for anyone else.

#### 8. Runtime priority changes trigger preemption too

`vTaskPrioritySet()` can raise a task's priority above the current *Running* task's priority. The instant that happens, the scheduler re-evaluates and preempts — exactly like an event unblocking a higher-priority task. Priority changes are not just bookkeeping; they can immediately cause a context switch.

---

### Summary Section

FreeRTOS's scheduler has one governing rule: **the highest-priority *Ready* task runs, always**. Preemption is that rule enforced instantly — a higher-priority task interrupts a lower-priority one the moment it becomes Ready, without waiting for a tick or for the running task to cooperate. Time slicing is a separate, narrower mechanism that only decides how tasks of the *same* priority share the CPU once nothing higher-priority needs it. Three configuration combinations (`configUSE_PREEMPTION` × `configUSE_TIME_SLICING`) produce the three real policies — preemptive with slicing (default), preemptive without slicing (fewer switches, riskier fairness), and cooperative (no preemption at all, simplest but least responsive). Because high-priority tasks can dominate the CPU indefinitely, well-behaved tasks must voluntarily block (`vTaskDelay()`, queue/semaphore waits) to avoid starving everything below them — and even a runtime priority change via `vTaskPrioritySet()` is enough to trigger an immediate preemption.
