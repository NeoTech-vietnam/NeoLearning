# Cornell Notes

## Topic: Task Priorities & Preemptive Scheduling

## Date: 2026-07-15

---

### Cue Column (Questions, Keywords, or Prompts)

- What's the one rule the scheduler always follows?
- What does "preemption" actually mean?
- Time slice vs. tick period — same thing?
- What are the 3 scheduling policies, and their config flags?
- What does `configIDLE_SHOULD_YIELD` fix?
- How is task starvation avoided?
- Does changing a task's priority at runtime trigger preemption?

---

### Notes Section (Main Notes)

#### 1. The core scheduling rule

> The scheduler always ensures the **highest-priority *Ready* task** is the one in the *Running* state.

```
Priority
  3   [ Task A ]  ←── if Ready, this always wins the CPU
  2   [ Task B ]
  1   [ Task C ]
  0   [  Idle  ]  ←── only runs when nothing else is Ready
```

Tasks of equal priority share the CPU in turn (Round Robin); any number of tasks may share a priority. Priority range is `0 .. (configMAX_PRIORITIES - 1)`, 0 = lowest.

#### 2. Preemption vs. cooperative scheduling

**Preemption** = a task is involuntarily moved *Running → Ready* the instant a higher-priority task becomes Ready — it does not need to yield or block first. This can happen at any time, not just on the tick interrupt.

```
Task state machine (single core):

        created/unblocked
   ┌───────────────────────►┌─────────┐
   │                        │  Ready  │◄────────────┐
   │                        └────┬────┘             │
   │                    scheduler picks              │ involuntary
   │                    highest priority              │ (preemption)
   │                             ▼                    │
┌──┴──────┐   blocks/delays  ┌─────────┐   higher-prio │
│ Blocked │◄─────────────────┤ Running │───────────────┘
└─────────┘   (voluntary)    └─────────┘
```

Without preemption (**cooperative scheduling**, `configUSE_PREEMPTION = 0`), the Running task keeps the CPU until it voluntarily blocks or calls `taskYIELD()` — never preempted, so time slicing cannot apply.

#### 3. Time slice vs. tick period

- Tick interrupt fires every `1 / configTICK_RATE_HZ` seconds → that interval is one **tick period**.
- One tick period = one **time slice**.
- Time slicing only matters for tasks that **share the same priority** — it doesn't affect who wins across different priorities (preemption already decided that).

#### 4. Preemption timeline (unique priorities) — based on ch04 Fig. 4.18

```
priority: Task1 > Task2 > Task3 > Idle

Task1        Blocked ───────────────────────┐t10  ┌─Blocked
                                             ▼     │
Task2   Blocked ┐t1        ┌Blocked   ┌──────┴─────┴t7,t11
                ▼          │t6        ▼(resume)
Task3      ┌────┴──Blocked┴t8   ┌─────────Blocked┐t9      t12┌──
            (t3 ready)          (t5 ready)        └(event)───┘resume
Idle    ────┘t3      └──┘t5             └────────┘t9  preempted
        runs whenever nothing above is Ready
```

- t3, t5, t9: Idle is preempted the instant Task 3 / Task 2 become Ready.
- t6: Task 2 preempts Task 3 (higher priority).
- t10: Task 1 preempts Task 2 (highest priority, can preempt anyone).
- Task 3's event between t9–t12 waits until t12, because until then Task 1 and/or Task 2 are still occupying the CPU.

#### 5. Time-slicing timeline (equal priorities) — based on ch04 Fig. 4.19

```
Idle & Task2 share priority 0, ticks at t1..t11

tick:    t1  t2  t3  t4  t5      t6      t7  t8  t9  t10 t11
CPU:    [Idle][T2][Idle][T2][Idle|Task1 preempts|T2][Idle][T2]...
                                  (t6-t7, Task1 event, prio > 0)
```

- Idle and Task 2 alternate **every tick** (Round Robin) since they're equal priority.
- At t6, Task 1 (higher priority) preempts mid-slice; normal alternation resumes once Task 1 blocks again at t7.

#### 6. `configIDLE_SHOULD_YIELD`

```
= 0 (default): Idle runs its full time slice even if another
               Idle-priority task is Ready.
   [ Idle full slice ][ Task2 full slice ]

= 1: Idle voluntarily yields the REST of its slice as soon as
     another Idle-priority task is Ready — fairer sharing.
   [Idle(partial)][Task2 gets remainder + own slice]
```

#### 7. The 3 scheduling policies

| Policy | Prioritized | `configUSE_PREEMPTION` | `configUSE_TIME_SLICING` |
|---|---|---|---|
| Preemptive + Time Slicing (default, most common) | Yes | 1 | 1 |
| Preemptive, no Time Slicing (advanced) | Yes | 1 | 0 |
| Cooperative | No | 0 | any |

```
+Slicing:    [A][B][A][B]  ← equal-prio tasks swap every tick
no Slicing:  [ A running until blocked/preempted ][ B... ]
Cooperative: [ A running until it calls taskYIELD()/blocks ][ B... ]
```

Turning off time slicing reduces context-switch overhead but can let one equal-priority task hog the CPU for far longer than another (ch04 Fig. 4.21) — an advanced, expert-only tuning.

#### 8. Task starvation & how it's avoided

A lower-priority task **starves** if higher-priority tasks never block. FreeRTOS avoids this in well-behaved applications because tasks call `vTaskDelay()` / `vTaskDelayUntil()` to voluntarily enter the *Blocked* state, freeing the CPU for lower-priority Ready tasks:

```
Busy loop (bad):      [ HighPrio runs forever ] ...  LowPrio never runs
With vTaskDelay():     [High][ Blocked → Low runs ][High][ Blocked → Low ]...
```

#### 9. Runtime priority changes

`vTaskPrioritySet()` can raise or lower a task's priority after creation. If this makes some *other* Ready task now the highest priority, the scheduler preempts immediately — a priority change is itself a preemption trigger, not just a bookkeeping update.

---

### Summary Section

The scheduler's single governing rule — always run the highest-priority Ready task — explains everything else in this topic. **Preemption** is what enforces that rule instantly, even mid-execution of a lower-priority task. **Time slicing** is a secondary, narrower mechanism that only decides fairness *among tasks that already share a priority*, using the tick period as its unit. FreeRTOS exposes the interaction of these two mechanisms as three selectable policies (preemptive+slicing, preemptive-only, cooperative) via `configUSE_PREEMPTION` / `configUSE_TIME_SLICING`. Starvation of lower-priority tasks is avoided by well-behaved tasks blocking (`vTaskDelay()`), not by the scheduler itself; changing priority at runtime plugs into the same preemption rule as any other Ready-state change.
