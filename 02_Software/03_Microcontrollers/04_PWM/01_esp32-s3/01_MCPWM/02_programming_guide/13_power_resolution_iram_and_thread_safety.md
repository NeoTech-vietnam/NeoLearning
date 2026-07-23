# Cornell Notes

## Topic: Power Management, Resolution, IRAM Safety, Thread Safety, and Kconfig

## Date: 23/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- How do clock selection and prescalers constrain resolution?
- What power-management and sleep behavior applies on ESP32-S3?
- Which APIs and callbacks are safe across tasks or cache-disabled windows?

---

### Notes Section (Main Notes)

The first timer in a group selects the shared group prescaler. Each timer then receives a module prescaler to approach `resolution_hz`. Later timers must be compatible with the already-fixed group clock; otherwise creation reports a prescaler conflict. Allocate requested resolutions in a consistent high-to-low or low-to-high order, and derive `period_ticks = resolution_hz / pwm_frequency_hz` (with the driver's up-down interpretation accounted for).

When a selected clock can vary under dynamic frequency scaling, the driver acquires a power-management lock while an MCPWM timer or capture timer is enabled. Disabling releases it. ESP32-S3 `v6.0.1` lacks `SOC_MCPWM_SUPPORT_SLEEP_RETENTION`, so `.flags.allow_pd = 1` returns `ESP_ERR_NOT_SUPPORTED`; do not describe register backup/restore as available on this target. See [power management and ETM](../03_use_cases/12_power_management_and_etm.md).

`CONFIG_MCPWM_ISR_CACHE_SAFE` places the driver ISR path in IRAM and keeps ISR-accessed driver data in internal memory. Application callbacks and every function/data item they touch must also be cache-safe. `CONFIG_MCPWM_CTRL_FUNC_IN_IRAM` moves selected control functions into IRAM for lower latency during cache-disabled windows, at an IRAM cost. Debug logging changes timing and should not be enabled casually in a hard real-time path.

Factory functions that allocate/delete resources are task-context operations. The driver documents control operations protected by locks as thread-safe, but that does not make a multi-call application transaction atomic. Serialize related compare/period/action updates in the application. ISR callbacks may use only ISR-safe primitives; do not call allocation/deletion APIs from them.

ESP32-S3 does not implement MCPWM ETM or event-comparator support in this tag even though common headers contain guarded declarations. Target capability source: [soc_caps.h](https://github.com/espressif/esp-idf/blob/v6.0.1/components/soc/esp32s3/include/soc/soc_caps.h). Runtime guidance: [interrupts, callbacks, and safety](../03_use_cases/11_interrupts_callbacks_and_runtime_safety.md).

#### Configuration Reference

##### Resolution-related Functions and Fields

```c
esp_err_t mcpwm_capture_timer_get_resolution(mcpwm_cap_timer_handle_t cap_timer,
                                             uint32_t *out_resolution);
```

`mcpwm_timer_config_t::{clk_src,resolution_hz,period_ticks,count_mode}` determines the requested PWM time base. ESP-IDF `v6.0.1` has no public timer-resolution getter: the driver may log a warning if prescaling adjusts the request, so choose an exactly divisible clock/resolution when application math must use the configured value. `mcpwm_capture_timer_config_t::clk_src` selects the capture clock and its achieved resolution is available through `mcpwm_capture_timer_get_resolution()`. Never assume a fixed APB frequency.

##### Function details

###### `mcpwm_capture_timer_get_resolution()`

**Parameters:** `cap_timer` **[in]** — handle created by `mcpwm_new_capture_timer()`; `out_resolution` **[out]** — non-NULL pointer receiving the actual capture tick frequency in hertz.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG` if either pointer is NULL.

**Uses internally:** copies private `cap_timer->resolution_hz` to the caller. That value was computed during creation after `mcpwm_select_periph_clock()` and `mcpwm_set_prescale()`. The getter performs no HAL/LL call because the driver caches the achieved value.

##### Kconfig Options

| Option | Detailed effect | Cost/constraint |
|---|---|---|
| `CONFIG_MCPWM_ISR_CACHE_SAFE` | ISR and required driver objects remain accessible while flash cache is disabled | IRAM/internal RAM use; callbacks and their data must also be safe |
| `CONFIG_MCPWM_CTRL_FUNC_IN_IRAM` | Places selected timer/generator control paths in IRAM | additional IRAM consumption |
| `CONFIG_MCPWM_ENABLE_DEBUG_LOG` | increases component logging detail | timing/flash overhead; inappropriate for tight ISR paths |

##### Detailed information

**Clock/prescaler call chain:** timer or capture creation → `mcpwm_select_periph_clock()` (**Private driver**) → clock-tree query/configuration (**External dependency**) → `mcpwm_set_prescale()` (**Private policy**) → group and timer/capture prescaler LL writes (**LL/Register**). The group resolution is shared and protected atomically.

**Power lock call chain:** creation prepares a PM lock when the selected source requires frequency stability; enable acquires it; disable releases it; deletion destroys it. PM-lock functions are an **External dependency**. ESP32-S3 has no MCPWM register-retention path in this tag.

**Thread-safety boundary:** driver spinlocks protect individual register transactions and resource lists. They do not make `set_period()` followed by `set_compare_value()` one atomic waveform update. Use an application mutex/task owner and common shadow-transfer event for multi-call updates.

#### Related Use Cases

- [Timer Creation, Clock Selection, and Prescaling](../03_use_cases/03_timer_clock_and_prescaler.md)
- [Interrupts, Callbacks, and Runtime Safety](../03_use_cases/11_interrupts_callbacks_and_runtime_safety.md)
- [Power Management and ETM](../03_use_cases/12_power_management_and_etm.md)

### Summary Section (Summary of Notes)

The first timer constrains group resolution; plan allocations together. Enabled resources may hold PM locks, while sleep retention, ETM, and event comparators are unavailable on ESP32-S3 v6.0.1. IRAM-safe driver settings do not automatically make application callbacks safe, and thread-safe calls still need application-level transaction locking.
