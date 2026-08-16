# Cornell Notes

## Topic: Synchronization and Phase Control

## Date: 23/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- Which synchronization sources can reset timer phase?
- How are phase count and post-sync direction chosen?
- What same-group and routing constraints apply?

---

### Notes Section (Main Notes)

MCPWM provides GPIO, timer-event, and software sync sources. GPIO sync imports an external edge through the GPIO matrix. Timer sync exports TEZ, TEP, or another supported timer event. Software sync is activated by `mcpwm_soft_sync_activate()` and is convenient for deterministic setup but inherits task/interrupt scheduling latency before the hardware trigger.

Apply a source with `mcpwm_timer_set_phase_on_sync(timer, &mcpwm_timer_sync_phase_config_t)`. The configuration supplies the source, `count_value`, and post-sync direction. Source and destination must be in the same MCPWM group. To disable synchronization, pass a valid configuration whose `sync_src` is NULL; the configuration pointer itself must not be NULL. A capture timer uses `mcpwm_capture_timer_set_phase_on_sync()` with its own phase configuration.

For multiple PWM phases, fully configure and enable all destination timers, attach their phase settings, then trigger one shared source. A timer-event source supports repeated hardware synchronization with less jitter than issuing separate software commands. Avoid sync loops where timers continuously retrigger one another.

At LL level the driver selects sync input, enables phase loading, writes phase value/direction, and selects sync-out. The hardware also restarts the timer prescaler on sync. TRM Chapter 36.3.2.2, PDF pp. 1333–1337, is summarized in [PWM timer](../01_technical_reference_manual/03_pwm_timer_submodule.md). A complete flow is in [synchronization and phase control](../03_use_cases/08_synchronization_and_phase_control.md); official example: [mcpwm_sync](https://github.com/espressif/esp-idf/tree/v6.0.1/examples/peripherals/mcpwm/mcpwm_sync).

#### API Reference

##### Functions

```c
esp_err_t mcpwm_new_timer_sync_src(mcpwm_timer_handle_t timer,
    const mcpwm_timer_sync_src_config_t *config, mcpwm_sync_handle_t *ret_sync);
esp_err_t mcpwm_new_gpio_sync_src(const mcpwm_gpio_sync_src_config_t *config,
    mcpwm_sync_handle_t *ret_sync);
esp_err_t mcpwm_new_soft_sync_src(const mcpwm_soft_sync_config_t *config,
    mcpwm_sync_handle_t *ret_sync);
esp_err_t mcpwm_timer_set_phase_on_sync(mcpwm_timer_handle_t timer,
    const mcpwm_timer_sync_phase_config_t *config);
esp_err_t mcpwm_capture_timer_set_phase_on_sync(mcpwm_cap_timer_handle_t cap_timer,
    const mcpwm_capture_timer_sync_phase_config_t *config);
esp_err_t mcpwm_soft_sync_activate(mcpwm_sync_handle_t sync);
esp_err_t mcpwm_del_sync_src(mcpwm_sync_handle_t sync);
```

Timer sync creation permits one sync source per timer and returns `ESP_ERR_INVALID_STATE` if one already exists. GPIO source creation can return `ESP_ERR_NOT_FOUND` when all external sync inputs are occupied. Phase configuration rejects cross-group sources and phase values outside the timer period.

##### Function details

###### `mcpwm_new_timer_sync_src()`

**Parameters:** `timer` **[in]** — source timer; `config` **[in]** — source TEZ/TEP event plus `propagate_input_sync`; `ret_sync` **[out]** — returned source.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_ERR_NO_MEM`; `ESP_ERR_INVALID_STATE` if the timer already has a source; `ESP_FAIL` otherwise.

**Uses internally:** allocate → `mcpwm_timer_sync_src_register_to_timer()` → LL chooses sync-out event or input propagation → save type-specific delete callback.

###### `mcpwm_new_gpio_sync_src()`

**Parameters:** `config` **[in]** — group, valid GPIO, active edge; `ret_sync` **[out]** — returned source.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_ERR_NO_MEM`; `ESP_ERR_NOT_FOUND` for no free external sync; `ESP_FAIL` for GPIO/setup failure.

**Uses internally:** `mcpwm_gpio_sync_src_register_to_group()` → GPIO matrix input connection (**External**) → LL external sync inversion → retain trigger/group reference.

###### `mcpwm_new_soft_sync_src()`

**Parameters:** `config` **[in]** — non-NULL empty config; `ret_sync` **[out]** — returned source.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_ERR_NO_MEM`; `ESP_FAIL` otherwise.

**Uses internally:** heap allocation and base sync-object initialization only. The consumer phase API later installs the timer/capture activation callback and target object.

###### `mcpwm_timer_set_phase_on_sync()`

**Parameters:** `timer` **[in]** — destination; `config` **[in]** — non-NULL sync source/phase/direction structure. Set `config->sync_src = NULL` to disable sync. Count must be below `MCPWM_LL_MAX_COUNT_VALUE`; direction must agree with fixed up/down mode (either direction is allowed for up-down mode).

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_FAIL` otherwise.

**Uses internally:** dynamic source-type resolution → `mcpwm_ll_timer_set_timer_sync_input()` or `mcpwm_ll_timer_set_gpio_sync_input()`, or bind a software source → LL writes phase direction/value → LL enables sync. A software source already bound to another timer returns `ESP_ERR_INVALID_STATE`.

###### `mcpwm_capture_timer_set_phase_on_sync()`

**Parameters:** `cap_timer` **[in]** — destination capture timer; `config` **[in]** — sync source, 32-bit phase `count_value`, and direction. ESP32-S3 capture supports only `MCPWM_TIMER_DIRECTION_UP`.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG` for NULL timer, non-UP direction, or cross-group hardware source; `ESP_FAIL` otherwise.

**Uses internally:** resolve GPIO/timer/software source → `mcpwm_ll_capture_set_gpio_sync()` or `mcpwm_ll_capture_set_timer_sync()`, or bind software source to the capture timer → `mcpwm_ll_capture_set_sync_phase_value()` → `mcpwm_ll_capture_enable_timer_sync()`. Unlike a hypothetical nullable configuration API, this implementation dereferences `config`, so pass a real configuration and set only `sync_src` to NULL when disabling.

###### `mcpwm_soft_sync_activate()`

**Parameters:** `sync` **[in]** — software-sync handle already attached to a timer or capture timer.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_ERR_INVALID_STATE` while unbound; `ESP_FAIL` otherwise.

**Uses internally:** invokes the private `activate` callback selected during phase attachment → timer path toggles timer software sync LL; capture path toggles capture software sync LL.

###### `mcpwm_del_sync_src()`

**Parameters:** `sync` **[in]** — any sync source. Detach destinations first.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_FAIL` for cleanup failure.

**Uses internally:** type-specific delete callback → timer-source LL disable and unregister, GPIO disable/unregister/group release/GPIO reset, or software object free.

##### Structures

```c
typedef struct {
    mcpwm_timer_event_t timer_event;
    struct { uint32_t propagate_input_sync: 1; } flags;
} mcpwm_timer_sync_src_config_t;

typedef struct {
    int group_id;
    int gpio_num;
    struct { uint32_t active_neg: 1; } flags;
} mcpwm_gpio_sync_src_config_t;

typedef struct {
    mcpwm_sync_handle_t sync_src;
    uint32_t count_value;
    mcpwm_timer_direction_t direction;
} mcpwm_timer_sync_phase_config_t;
```

`mcpwm_soft_sync_config_t` is intentionally empty in `v6.0.1`; the driver's software-sync object derives its group when attached to a destination.

##### Detailed information

**Timer source:** private creation stores the source on the timer and calls LL to select TEZ, TEP, or propagated input sync as `SYNCO_SEL`. Deletion restores the source selection and releases the handle.

**GPIO source:** registration claims a group trigger ID, configures the GPIO matrix (**External dependency**), and calls LL for external-sync inversion. The destination LL selects that trigger in `MCPWM_TIMERx_SYNCISEL`.

**Phase application:** `mcpwm_timer_set_phase_on_sync()` obtains the destination lock, resolves the source trigger, writes `MCPWM_TIMERx_PHASE` and `PHASE_DIRECTION`, selects sync input, and enables phase reload. A NULL configuration disables sync input. `mcpwm_soft_sync_activate()` toggles `MCPWM_TIMERx_SYNC_SW` or the capture equivalent through a private activation callback.

#### Related Use Cases

- [Synchronization and Phase Control](../03_use_cases/08_synchronization_and_phase_control.md)
- [Complete MCPWM Application Sequences](../03_use_cases/13_complete_application_sequences.md)

### Summary Section (Summary of Notes)

Keep source and destination in one group, validate phase against the timer period, attach all destinations before triggering, and prefer a shared hardware source for repeatable phase relationships. Remove sync routing before deleting its source.
