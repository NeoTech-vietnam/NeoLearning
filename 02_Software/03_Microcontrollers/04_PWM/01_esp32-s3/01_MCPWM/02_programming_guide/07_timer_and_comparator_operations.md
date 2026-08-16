# Cornell Notes

## Topic: Timer and Comparator Operations and Events

## Date: 23/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- What is the legal timer state sequence?
- When do period and compare shadow values take effect?
- How are timer and comparator callbacks delivered?

---

### Notes Section (Main Notes)

The timer lifecycle is `init → enabled → running → enabled → init`. Call `mcpwm_timer_enable()` before `mcpwm_timer_start_stop()`. Valid start/stop commands are `MCPWM_TIMER_START_NO_STOP`, `MCPWM_TIMER_START_STOP_EMPTY`, `MCPWM_TIMER_START_STOP_FULL`, `MCPWM_TIMER_STOP_EMPTY`, `MCPWM_TIMER_STOP_FULL`, and `MCPWM_TIMER_STOP_IMMEDIATELY`. Disabling a running timer is invalid.

`mcpwm_timer_set_period()` writes a shadow period. Creation flags decide whether transfer occurs at TEZ (timer equals zero) or on sync. `mcpwm_comparator_set_compare_value()` similarly writes a shadow timestamp whose transfer point comes from comparator creation flags. A value that lies outside the current period cannot produce a compare event; coordinate period and compare updates to avoid a transient invalid duty cycle.

Register `mcpwm_timer_event_callbacks_t` before enabling the timer. `on_full`, `on_empty`, and `on_stop` execute from the shared MCPWM ISR. Register a comparator's `on_reach` callback before the comparator is active. Callback registration enables the matching LL interrupt mask; the ISR reads raw status, clears the asserted bits, constructs event data, invokes callbacks, and yields if requested.

`mcpwm_operator_connect_timer()` selects the operator's hardware timer input. Both handles must be valid and in the same group. Reconnecting changes the operator time base; perform topology changes while stopped to avoid malformed output.

Hardware mapping: period/count/start fields and TEZ/TEP events are described in TRM Chapter 36.3.2, PDF pp. 1329–1337; comparator timestamp and update fields are in Chapter 36.3.3, PDF pp. 1337–1362. See [timer clock and prescaler](../03_use_cases/03_timer_clock_and_prescaler.md) and [runtime safety](../03_use_cases/11_interrupts_callbacks_and_runtime_safety.md).

#### API Reference

##### Timer Functions

```c
esp_err_t mcpwm_timer_set_period(mcpwm_timer_handle_t timer, uint32_t period_ticks);
esp_err_t mcpwm_timer_register_event_callbacks(
    mcpwm_timer_handle_t timer, const mcpwm_timer_event_callbacks_t *cbs,
    void *user_data);
esp_err_t mcpwm_timer_enable(mcpwm_timer_handle_t timer);
esp_err_t mcpwm_timer_disable(mcpwm_timer_handle_t timer);
esp_err_t mcpwm_timer_start_stop(mcpwm_timer_handle_t timer,
                                 mcpwm_timer_start_stop_cmd_t command);
```

`mcpwm_timer_set_period()` rejects zero/out-of-range periods and updates the timer shadow period through LL. `mcpwm_timer_enable()` changes `INIT → ENABLE`, acquires a PM lock when present, and lazily installs the group ISR. `mcpwm_timer_start_stop()` accepts only valid commands in enabled/running states and writes the `MCPWM_TIMERx_START` field. `mcpwm_timer_disable()` requires the timer to be stopped, masks events, and releases the PM lock.

##### Comparator Functions

```c
esp_err_t mcpwm_comparator_register_event_callbacks(
    mcpwm_cmpr_handle_t cmpr, const mcpwm_comparator_event_callbacks_t *cbs,
    void *user_data);
esp_err_t mcpwm_comparator_set_compare_value(mcpwm_cmpr_handle_t cmpr,
                                             uint32_t cmp_ticks);
```

Callback registration saves callback/user-data pointers under lock and enables the comparator-equal interrupt. Compare writes are protected against concurrent updates. The driver does not infer application duty-cycle intent; the application must keep the threshold meaningful for the connected timer period.

##### Function details

###### `mcpwm_timer_set_period()`

**Parameters:** `timer` **[in]** — timer handle; `period_ticks` **[in]** — full requested period, nonzero and no greater than `MCPWM_LL_MAX_COUNT_VALUE`. In up-down mode the driver uses half as the hardware peak.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG` for NULL/invalid period; `ESP_FAIL` otherwise.

**Uses internally:** computes `peak_ticks` → timer spinlock → updates private peak → `mcpwm_ll_timer_set_peak()`. Hardware receives the shadow; TEZ/sync creation flags choose transfer.

###### `mcpwm_timer_register_event_callbacks()`

**Parameters:** `timer` **[in]** — timer handle; `cbs` **[in]** — non-NULL callbacks (`on_full`, `on_empty`, `on_stop`; NULL members deregister); `user_data` **[in]** — opaque pointer returned to callbacks.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG` for bad handles/callback location under IRAM-safe mode; `ESP_ERR_INVALID_STATE` when first registration occurs after enable; `ESP_FAIL` for interrupt allocation failure.

**Uses internally:** IRAM checks → `mcpwm_get_intr_priority_flag()` → lazy `esp_intr_alloc_intrstatus()` (**External interrupt allocator**) with `mcpwm_timer_default_isr()` → `mcpwm_ll_intr_enable()` per callback → store callbacks/context.

###### `mcpwm_timer_enable()`

**Parameters:** `timer` **[in]** — timer in `MCPWM_TIMER_FSM_INIT`.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_ERR_INVALID_STATE` if already enabled/running; `ESP_FAIL` otherwise.

**Uses internally:** atomic FSM transition `INIT → ENABLE` → enable installed interrupt handle (**External**) → acquire PM lock if present (**External**). It does not start counting.

###### `mcpwm_timer_disable()`

**Parameters:** `timer` **[in]** — stopped timer in `ENABLE`.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_ERR_INVALID_STATE` if running/already disabled; `ESP_FAIL` otherwise.

**Uses internally:** atomic FSM `ENABLE → INIT` → disable interrupt → release PM lock. Hardware timer must be stopped separately first.

###### `mcpwm_timer_start_stop()`

**Parameters:** `timer` **[in]** — enabled timer; `command` **[in]** — one `mcpwm_timer_start_stop_cmd_t` value controlling immediate/event-bound start or stop.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_ERR_INVALID_STATE` unless enabled; `ESP_FAIL` otherwise.

**Uses internally:** timer spinlock → `mcpwm_ll_timer_set_start_stop_command()` writes the `MCPWM_TIMERx_START` command field. The driver does not wait for TEZ/TEP stop completion.

###### `mcpwm_comparator_register_event_callbacks()`

**Parameters:** `cmpr` **[in]** — comparator handle; `cbs` **[in]** — `on_reach` callback or NULL member to deregister; `user_data` **[in]** — callback context.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_ERR_INVALID_STATE` for late first ISR installation; `ESP_FAIL` if interrupt setup fails.

**Uses internally:** IRAM checks → lazy shared group interrupt allocation with `mcpwm_comparator_default_isr()` → `mcpwm_ll_intr_enable()` for comparator-equal bit → store callback/context.

###### `mcpwm_comparator_set_compare_value()`

**Parameters:** `cmpr` **[in]** — comparator handle; `cmp_ticks` **[in]** — threshold not exceeding connected timer peak.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_ERR_INVALID_STATE` when no timer is connected; `ESP_FAIL` otherwise.

**Uses internally:** inspect `cmpr->oper->timer` → validate peak → comparator lock → `mcpwm_ll_operator_set_compare_value()` → shadow timestamp register A/B.

##### Structures and Event Data

```c
typedef struct {
    mcpwm_timer_event_cb_t on_full;
    mcpwm_timer_event_cb_t on_empty;
    mcpwm_timer_event_cb_t on_stop;
} mcpwm_timer_event_callbacks_t;

typedef struct {
    mcpwm_comparator_event_cb_t on_reach;
} mcpwm_comparator_event_callbacks_t;

typedef struct { mcpwm_timer_direction_t direction; uint32_t count_value; }
    mcpwm_timer_event_data_t;
typedef struct { mcpwm_timer_direction_t direction; }
    mcpwm_compare_event_data_t;
```

Callbacks use `bool callback(handle, const event_data *, void *user_ctx)` and return `true` when a higher-priority task was woken.

##### Detailed information

**Timer ISR sequence:** `mcpwm_timer_default_isr()` → `mcpwm_ll_intr_get_status()` → test the timer's full/empty/stop masks → read direction/count where required → invoke registered callback → `mcpwm_ll_intr_clear_status()`. The ISR is shared at group level.

**Period update:** public validation → timer spinlock → `mcpwm_ll_timer_set_peak()` writes `MCPWM_TIMERx_PERIOD`; `mcpwm_ll_timer_enable_update_period_on_tez()` and `mcpwm_ll_timer_enable_update_period_on_sync()` configured at creation control shadow transfer.

**Comparator update:** public validation → comparator lock → `mcpwm_ll_operator_set_compare_value()` writes `MCPWM_GENx_TSTMP_A/B`; update-method LL configuration selects TEZ/TEP/sync. Register details are in [PWM operator](../01_technical_reference_manual/04_pwm_operator_submodule.md).

#### Related Use Cases

- [Timer Creation, Clock Selection, and Prescaling](../03_use_cases/03_timer_clock_and_prescaler.md)
- [Operator, Comparator, and Generator Pipeline](../03_use_cases/04_operator_comparator_and_generator.md)
- [Interrupts, Callbacks, and Runtime Safety](../03_use_cases/11_interrupts_callbacks_and_runtime_safety.md)

### Summary Section (Summary of Notes)

Enable before start, stop before disable, and disable before delete. Period and compare writes are shadowed; select and coordinate their transfer events. Register ISR callbacks before enabling and keep topology changes out of active output windows.
