# Cornell Notes

## Topic: Capture Operations and Events

## Date: 23/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- What is the capture timer/channel state and ownership sequence?
- How are edge timestamps delivered and converted to elapsed time?
- What are prescale, overflow, ISR, and software-capture constraints?

---

### Notes Section (Main Notes)

Create the group capture timer, then channels. Register `mcpwm_capture_event_callbacks_t::on_cap` before enabling a channel. Enable the capture timer and channel, start the timer, and then accept edges. For cleanup, stop and disable the timer/channels, delete channels, then delete the timer.

The callback receives `mcpwm_capture_event_data_t { cap_value, cap_edge }`. Store the previous timestamp and use unsigned subtraction so normal 32-bit wraparound is handled. Convert ticks using `mcpwm_capture_timer_get_resolution()`; elapsed seconds are `delta_ticks / resolution_hz`. A channel prescaler accepts only every Nth eligible edge, reducing interrupt rate but discarding intermediate timestamps.

`mcpwm_capture_channel_trigger_soft_catch()` forces a capture through the channel. `mcpwm_capture_get_latched_value()` reads the latest latched timestamp without waiting for a new callback. Neither operation replaces synchronization when measurements across time bases require a common phase.

Callbacks run in ISR context: copy minimal data to a queue/ring buffer, avoid blocking and floating-point processing there, and return whether a higher-priority task was woken. If cache-disabled execution matters, enable the IRAM-safe option and ensure callback code and accessed data are internal-memory safe.

The LL layer controls capture timer enable/start, edge mode, input inversion, prescale, software trigger, timestamp, edge status, and interrupts. TRM Chapter 36.3.4, PDF pp. 1362–1368, is summarized in [capture submodule](../01_technical_reference_manual/05_pwm_capture_submodule.md). See [capture timer and channels](../03_use_cases/10_capture_timer_and_channels.md) and the [HC-SR04 example](https://github.com/espressif/esp-idf/tree/v6.0.1/examples/peripherals/mcpwm/mcpwm_capture_hc_sr04).

#### API Reference

##### Functions

```c
esp_err_t mcpwm_capture_timer_get_resolution(mcpwm_cap_timer_handle_t cap_timer,
                                              uint32_t *out_resolution);
esp_err_t mcpwm_capture_timer_enable(mcpwm_cap_timer_handle_t cap_timer);
esp_err_t mcpwm_capture_timer_start(mcpwm_cap_timer_handle_t cap_timer);
esp_err_t mcpwm_capture_timer_stop(mcpwm_cap_timer_handle_t cap_timer);
esp_err_t mcpwm_capture_timer_disable(mcpwm_cap_timer_handle_t cap_timer);
esp_err_t mcpwm_capture_channel_register_event_callbacks(
    mcpwm_cap_channel_handle_t cap_channel,
    const mcpwm_capture_event_callbacks_t *cbs, void *user_data);
esp_err_t mcpwm_capture_channel_enable(mcpwm_cap_channel_handle_t cap_channel);
esp_err_t mcpwm_capture_channel_disable(mcpwm_cap_channel_handle_t cap_channel);
esp_err_t mcpwm_capture_channel_trigger_soft_catch(mcpwm_cap_channel_handle_t cap_channel);
esp_err_t mcpwm_capture_get_latched_value(mcpwm_cap_channel_handle_t cap_channel,
                                          uint32_t *value);
```

Enable/disable calls enforce `INIT ↔ ENABLE`; start/stop control the shared capture counter and require an enabled timer. Channel enable configures edge interrupts after callbacks are installed. Resolution and latched-value getters require non-NULL output pointers.

##### Function details

###### `mcpwm_capture_timer_get_resolution()`

**Parameters:** `cap_timer` **[in]** — capture timer; `out_resolution` **[out]** — non-NULL destination in hertz.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG` for bad pointers.

**Uses internally:** returns the cached achieved resolution calculated during creation; no register read or lock is necessary.

###### `mcpwm_capture_timer_enable()`

**Parameters:** `cap_timer` **[in]** — timer in `INIT`.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_ERR_INVALID_STATE` if already enabled; `ESP_FAIL` otherwise.

**Uses internally:** atomic FSM `INIT → ENABLE` → acquire PM lock if present. It prepares runtime resources but does not start the counter.

###### `mcpwm_capture_timer_start()`

**Parameters:** `cap_timer` **[in]** — enabled timer.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_ERR_INVALID_STATE` unless enabled; `ESP_FAIL` otherwise.

**Uses internally:** capture-timer lock → `mcpwm_ll_capture_enable_timer(..., true)` writes `MCPWM_CAP_TIMER_EN`.

###### `mcpwm_capture_timer_stop()`

**Parameters:** `cap_timer` **[in]** — enabled capture timer.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_ERR_INVALID_STATE` unless enabled; `ESP_FAIL` otherwise.

**Uses internally:** capture-timer lock → `mcpwm_ll_capture_enable_timer(..., false)`. Existing channel latch values remain readable.

###### `mcpwm_capture_timer_disable()`

**Parameters:** `cap_timer` **[in]** — timer in `ENABLE`. Stopping first is the safe application sequence, but this function checks only the FSM state.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_ERR_INVALID_STATE` if already disabled; `ESP_FAIL` otherwise.

**Uses internally:** atomic FSM `ENABLE → INIT` → release PM lock. Channel ownership is unchanged.

###### `mcpwm_capture_channel_register_event_callbacks()`

**Parameters:** `cap_channel` **[in]** — channel; `cbs` **[in]** — `on_cap` callback (NULL deregisters); `user_data` **[in]** — callback context.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_ERR_INVALID_STATE` if first registration is attempted after channel enable; `ESP_FAIL` if ISR allocation fails.

**Uses internally:** IRAM checks → `mcpwm_get_intr_priority_flag()` → lazy shared interrupt allocation with `mcpwm_capture_default_isr()` → LL enable capture channel event bit → store callback/context.

###### `mcpwm_capture_channel_enable()`

**Parameters:** `cap_channel` **[in]** — channel in `INIT`.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_ERR_INVALID_STATE` if already enabled; `ESP_FAIL` otherwise.

**Uses internally:** enable installed interrupt handle → `mcpwm_ll_capture_enable_channel(..., true)` → FSM `INIT → ENABLE`. Edge and prescale fields were configured during channel creation.

###### `mcpwm_capture_channel_disable()`

**Parameters:** `cap_channel` **[in]** — channel in `ENABLE`.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_ERR_INVALID_STATE` if already disabled; `ESP_FAIL` otherwise.

**Uses internally:** LL disables channel → disables installed interrupt → atomic FSM `ENABLE → INIT`.

###### `mcpwm_capture_channel_trigger_soft_catch()`

**Parameters:** `cap_channel` **[in]** — channel in `ENABLE`.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_ERR_INVALID_STATE` unless the channel is enabled.

**Uses internally:** `mcpwm_ll_trigger_soft_capture()` pulses `MCPWM_CAPx_SW`; hardware copies the current capture timer count to `MCPWM_CAP_CHx` and can raise the normal capture interrupt.

###### `mcpwm_capture_get_latched_value()`

**Parameters:** `cap_channel` **[in]** — channel; `value` **[out]** — non-NULL destination for the latest 32-bit timestamp.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_FAIL` otherwise.

**Uses internally:** direct `mcpwm_ll_capture_get_value()` read of `MCPWM_CAP_CHx`. It does not lock, clear the latch, or report which edge caused it.

##### Structures

```c
typedef struct {
    int gpio_num;
    int intr_priority;
    uint32_t prescale;
    struct {
        uint32_t pos_edge: 1;
        uint32_t neg_edge: 1;
        uint32_t invert_cap_signal: 1;
    } flags;
} mcpwm_capture_channel_config_t;

typedef struct { mcpwm_capture_event_cb_t on_cap; }
    mcpwm_capture_event_callbacks_t;

typedef struct {
    uint32_t cap_value;
    mcpwm_capture_edge_t cap_edge;
} mcpwm_capture_event_data_t;
```

##### Detailed information

**Enable path:** capture timer enable changes the FSM atomically, acquires its PM lock, enables the functional clock, and initializes the group interrupt if needed. Channel enable calls LL with positive/negative edge masks and enables its capture interrupt.

**Capture ISR:** `mcpwm_capture_default_isr()` reads raw status, reads the channel timestamp and recorded edge, clears status, constructs `mcpwm_capture_event_data_t`, and invokes `on_cap`. The callback's Boolean return participates in the final ISR yield.

**Software catch/readback:** LL pulses `MCPWM_CAPx_SW`; hardware latches the current 32-bit capture timer into `MCPWM_CAP_CHx`. `mcpwm_capture_get_latched_value()` reads that register but does not report a new edge or guarantee atomic association with separately read application state.

#### Related Use Cases

- [Capture Timer and Channels](../03_use_cases/10_capture_timer_and_channels.md)
- [Interrupts, Callbacks, and Runtime Safety](../03_use_cases/11_interrupts_callbacks_and_runtime_safety.md)
- [Complete MCPWM Application Sequences](../03_use_cases/13_complete_application_sequences.md)

### Summary Section (Summary of Notes)

Register callback → enable timer/channel → start → capture. Compute deltas with unsigned arithmetic, convert with the queried resolution, and move processing out of the ISR. Delete channels before their capture timer.
