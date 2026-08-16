# Cornell Notes

## Topic: Synchronization and Phase Control

## Date: 20/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- Which signals can synchronize an MCPWM timer?
- What happens to count value and direction on sync?
- Which sources must be in the same MCPWM group?
- How are several timers started with a defined phase relationship?

---

### Notes Section (Main Notes)

#### Sync Sources

| Source | Factory API | Typical use |
|---|---|---|
| Timer event | `mcpwm_new_timer_sync_src()` | chain timers from TEZ/TEP |
| GPIO edge | `mcpwm_new_gpio_sync_src()` | align with external hardware |
| Software | `mcpwm_new_soft_sync_src()` | controlled simultaneous phase load |

A sync event reloads the configured phase count and direction and resets the timer prescaler phase. It can also transfer shadowed values when update-on-sync is enabled.

#### Public Sequence

```c
mcpwm_sync_handle_t sync;
ESP_ERROR_CHECK(mcpwm_new_timer_sync_src(master,
    &(mcpwm_timer_sync_src_config_t){.timer_event = MCPWM_TIMER_EVENT_EMPTY},
    &sync));
ESP_ERROR_CHECK(mcpwm_timer_set_phase_on_sync(slave,
    &(mcpwm_timer_sync_phase_config_t){
        .sync_src = sync,
        .count_value = phase_ticks,
        .direction = MCPWM_TIMER_DIRECTION_UP,
    }));
```

#### Inside the APIs

Timer and GPIO sync factories reserve hardware trigger resources and remember ownership. `mcpwm_timer_set_phase_on_sync()` validates the direction against the timer mode, verifies source compatibility, selects the timer/GPIO sync input through LL, writes phase value and direction, and enables sync. Passing `.sync_src = NULL` disables synchronization.

```mermaid
sequenceDiagram
  participant Master
  participant Sync
  participant Slave
  Master->>Sync: TEZ/TEP event
  Sync->>Slave: synchronization pulse
  Slave->>Slave: load phase + direction; reset prescaler phase
```

Timer and GPIO sources must belong to the same MCPWM group as the destination timer. A software source becomes bound to the timer or capture timer that consumes it and cannot simultaneously serve an incompatible owner.

#### Up-Down Boundary Rule

For up-down counting, zero belongs to the upward phase and peak belongs to the downward phase. Pair count zero with `MCPWM_TIMER_DIRECTION_UP`; pair peak with `MCPWM_TIMER_DIRECTION_DOWN`. An inconsistent boundary/direction can underflow or create an unexpected long half-cycle.

Delete in dependency order: detach with `mcpwm_timer_set_phase_on_sync(...NULL...)`, delete the sync source, then delete its source timer. See [TRM timer synchronization](../01_technical_reference_manual/03_pwm_timer_submodule.md#pwm-timer-synchronization-and-phase-locking).

Reference example: `examples/peripherals/mcpwm/mcpwm_sync`; implementation: `mcpwm_sync.c` and `mcpwm_timer.c`, tag `v6.0.1`.

#### API Catalog Links

- Sources: [`mcpwm_new_timer_sync_src()`](15_mcpwm_apis.md#api-mcpwm-new-timer-sync-src), [`mcpwm_new_gpio_sync_src()`](15_mcpwm_apis.md#api-mcpwm-new-gpio-sync-src), [`mcpwm_new_soft_sync_src()`](15_mcpwm_apis.md#api-mcpwm-new-soft-sync-src)
- Apply/trigger: [`mcpwm_timer_set_phase_on_sync()`](15_mcpwm_apis.md#api-mcpwm-timer-set-phase-on-sync), [`mcpwm_soft_sync_activate()`](15_mcpwm_apis.md#api-mcpwm-soft-sync-activate), [`mcpwm_del_sync_src()`](15_mcpwm_apis.md#api-mcpwm-del-sync-src)
- Types: [`mcpwm_sync_handle_t`](15_mcpwm_apis.md#type-mcpwm-sync-handle-t), [`mcpwm_timer_sync_phase_config_t`](15_mcpwm_apis.md#type-mcpwm-timer-sync-phase-config-t)

---

### Summary Section (Summary of Notes)

- Sync loads phase and direction and aligns the prescaler, not merely the visible count.
- Same-group and ownership checks constrain source routing.
- Up-down mode requires a legal phase/direction pair at zero and peak.
