# Cornell Notes

## Topic: Dead Time and Carrier Modulation

## Date: 23/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- How are RED/FED delays routed between generator inputs and outputs?
- Which complementary waveform arrangements are safe and supported?
- How is the high-frequency carrier configured?

---

### Notes Section (Main Notes)

`mcpwm_generator_set_dead_time(in_generator, out_generator, config)` routes an operator generator through rising-edge-delay (RED) and falling-edge-delay (FED) cells. `posedge_delay_ticks` and `negedge_delay_ticks` use the MCPWM dead-time clock; flags select input/output inversion and output swapping. Input and output generators must belong to the same operator. Each delay cell is a scarce routing resource, so a second conflicting assignment fails with `ESP_ERR_INVALID_STATE`.

For active-high complementary PWM, derive one output from RED and the other from FED with the necessary inversion. Do not assume that simply delaying two independent complementary action tables prevents shoot-through during every live update. Configure a shared source and update at a controlled boundary. Delay ticks must cover the switching device and gate-driver turn-off interval but should remain small relative to the PWM period.

Carrier modulation is configured per operator with `mcpwm_operator_apply_carrier()`. `mcpwm_carrier_config_t` selects `frequency_hz`, duty cycle, first-pulse width, and input/output inversion. Passing `NULL` disables carrier modulation. The driver derives a prescaler from the operator/group clock and rejects an unrepresentable frequency or duty setting.

Carrier inserts a higher-frequency pulse train into the generated PWM; it is not a replacement for the base timer. The LL layer programs enable, prescale, duty, one-shot width, and inversion fields. TRM Chapter 36.3.3.3–36.3.3.4, PDF pp. 1350–1357, is summarized in [PWM operator](../01_technical_reference_manual/04_pwm_operator_submodule.md). See [complementary PWM and dead time](../03_use_cases/06_complementary_pwm_and_dead_time.md) and [carrier/force actions](../03_use_cases/07_carrier_and_force_actions.md).

#### API Reference

##### Functions

```c
esp_err_t mcpwm_generator_set_dead_time(mcpwm_gen_handle_t in_generator,
                                        mcpwm_gen_handle_t out_generator,
                                        const mcpwm_dead_time_config_t *config);
esp_err_t mcpwm_operator_apply_carrier(mcpwm_oper_handle_t oper,
                                       const mcpwm_carrier_config_t *config);
```

Dead-time configuration requires two valid same-operator generator handles and a non-NULL configuration. Delay values must not exceed `MCPWM_LL_MAX_DEAD_DELAY`. Conflicting use of RED/FED resources returns `ESP_ERR_INVALID_STATE`. Carrier requires a valid operator and representable frequency/duty/first-pulse values; `config == NULL` disables it.

##### Function details

###### `mcpwm_generator_set_dead_time()`

**Parameters:**
- `in_generator` **[in]** — generator whose raw waveform feeds RED/FED.
- `out_generator` **[in]** — same-operator generator output receiving the routed waveform.
- `config` **[in]** — non-NULL positive/negative delay ticks and optional output inversion. Each delay must be strictly below `MCPWM_LL_MAX_DEAD_DELAY`.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG` for NULL, cross-operator handles, or delay overflow; `ESP_ERR_INVALID_STATE` when another input generator owns a requested RED/FED cell.

**Uses internally:** operator spinlock reserves/releases `posedge_delay_owner` and `negedge_delay_owner` → derive bypass/both-edge routing → LL selects RED/FED input generator → LL programs bypass, delay ticks, output inversion, and output swap. Fields reside in `MCPWM_DTx_CFG`, `RED_CFG`, and `FED_CFG`; operator creation flags control shadow updates.

###### `mcpwm_operator_apply_carrier()`

**Parameters:** `oper` **[in]** — operator handle; `config` **[in, optional]** — carrier clock, requested frequency, duty `[0,1]`, first-pulse microseconds, and inversion flags. NULL or zero frequency disables carrier.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG` for NULL operator/invalid first-pulse duration; `ESP_ERR_INVALID_STATE` when the shared clock cannot represent the requested carrier; clock/prescale errors propagated from private helpers.

**Uses internally:** `mcpwm_select_periph_clock()` → `mcpwm_set_prescale()` → divide prescaler by eight for the 3-bit duty hardware → `mcpwm_ll_carrier_set_prescale()` → quantize duty with `(uint8_t)(duty_cycle * 8)` → `mcpwm_ll_carrier_set_duty()` → convert first-pulse microseconds to ticks → set first-pulse width/inversions → `mcpwm_ll_carrier_enable()`. Disabling only clears carrier enable.

##### Structures

```c
typedef struct {
    uint32_t posedge_delay_ticks;
    uint32_t negedge_delay_ticks;
    struct {
        uint32_t invert_output: 1;
    } flags;
} mcpwm_dead_time_config_t;

typedef struct {
    mcpwm_carrier_clock_source_t clk_src;
    uint32_t frequency_hz;
    float duty_cycle;
    uint32_t first_pulse_duration_us;
    struct {
        uint32_t invert_before_modulate: 1;
        uint32_t invert_after_modulate: 1;
    } flags;
} mcpwm_carrier_config_t;
```

##### Detailed information

**Dead-time validation and ownership:** `mcpwm_generator_set_dead_time()` identifies input/output generator IDs, checks they share one operator, verifies delay ranges, and reserves RED/FED resources under the operator lock. It calls LL helpers to choose RED/FED input, bypass, output inversion, output swap, update method, and delay ticks. The fields are `MCPWM_DTx_CFG`, `RED_CFG`, and `FED_CFG` described in TRM 36.3.3.3.

**Classical complementary arrangement:** a zero-delay side is bypassed; RED and FED can source the same generator and route to different outputs. `invert_output` changes the routed delayed output, not the original generator event table. Reconfiguration must account for existing resource ownership.

**Carrier calculation:** the driver calls `mcpwm_set_prescale()` for the requested carrier resolution, calculates carrier prescale, converts floating duty to the supported discrete field, and converts first-pulse microseconds into one-shot clock ticks. LL then writes enable, prescale, duty, one-shot width, and pre/post inversion. Unsupported numeric combinations return an error instead of silently approximating beyond hardware limits.

#### Related Use Cases

- [Complementary PWM and Dead Time](../03_use_cases/06_complementary_pwm_and_dead_time.md)
- [Carrier Modulation and Generator Force Actions](../03_use_cases/07_carrier_and_force_actions.md)
- [MCPWM Debugging and Common Failures](../03_use_cases/14_debugging_and_common_failures.md)

### Summary Section (Summary of Notes)

Dead time is operator-local routing through scarce RED/FED cells; use a shared waveform source, deliberate inversion, and controlled updates. Carrier modulation further gates the base PWM and must use representable frequency, duty, and first-pulse settings.
