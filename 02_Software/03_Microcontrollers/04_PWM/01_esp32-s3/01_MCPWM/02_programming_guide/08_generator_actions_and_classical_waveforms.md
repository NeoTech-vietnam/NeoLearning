# Cornell Notes

## Topic: Generator Actions and Classical PWM Waveforms

## Date: 23/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- How does a generator turn timer, compare, sync, and fault events into output levels?
- Which action pairs create common asymmetric and symmetric PWM waveforms?
- What constraints apply to action updates?

---

### Notes Section (Main Notes)

Generator action APIs program an event/action table. Each entry selects an event, optional timer direction, and `MCPWM_GEN_ACTION_KEEP`, `LOW`, `HIGH`, or `TOGGLE`. Use `mcpwm_generator_set_action_on_timer_event()`, `_compare_event()`, `_fault_event()`, or `_sync_event()` for one entry, or the variadic convenience macros for several entries terminated by `MCPWM_GEN_*_EVENT_ACTION_END()`.

Common recipes:

| Waveform | Timer mode | Actions |
|---|---|---|
| active-high edge-aligned | up | HIGH at TEZ; LOW at compare |
| active-low edge-aligned | up | LOW at TEZ; HIGH at compare |
| center-aligned active-low | up-down | LOW on upward compare; HIGH on downward compare |
| center-aligned complementary basis | up-down | opposite A/B actions at the same compare events, then optional dead time |

For up-down counting, distinguish `MCPWM_TIMER_DIRECTION_UP` and `DOWN`; otherwise the same compare threshold can trigger twice per cycle with unintended actions. Timer and compare action registers are shadowed. Operator flags choose TEZ, TEP, or sync transfer; configure them before enable and use a synchronized update point for live changes.

Generator fault actions are immediate event responses; operator brake actions are the preferred coordinated protection mechanism when CBC or OST behavior is required. Sync actions can establish a known output state at a phase-alignment event.

The LL layer selects fields in the generator A/B action registers documented by TRM Chapter 36.3.3.2, PDF pp. 1338–1350. Work through [basic and symmetric PWM](../03_use_cases/05_basic_and_symmetric_pwm.md) and the [operator pipeline](../03_use_cases/04_operator_comparator_and_generator.md). Stable source: [mcpwm_gen.h](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_driver_mcpwm/include/driver/mcpwm_gen.h).

#### API Reference

##### Functions

```c
esp_err_t mcpwm_generator_set_action_on_timer_event(
    mcpwm_gen_handle_t gen, mcpwm_gen_timer_event_action_t action);
esp_err_t mcpwm_generator_set_action_on_compare_event(
    mcpwm_gen_handle_t gen, mcpwm_gen_compare_event_action_t action);
esp_err_t mcpwm_generator_set_action_on_fault_event(
    mcpwm_gen_handle_t gen, mcpwm_gen_fault_event_action_t action);
esp_err_t mcpwm_generator_set_action_on_sync_event(
    mcpwm_gen_handle_t gen, mcpwm_gen_sync_event_action_t action);
```

Each function validates the generator, event enum, direction, action enum, and referenced comparator/fault/sync handle. Referenced objects must be compatible with the generator's group/operator. The functions return `ESP_ERR_INVALID_ARG` for invalid combinations, `ESP_ERR_INVALID_STATE` where the hardware trigger table cannot accept the request, or `ESP_OK`.

Use the initializer macro to construct one entry and call the singular setter once for each event/action row:

```c
mcpwm_generator_set_action_on_timer_event(gen,
    MCPWM_GEN_TIMER_EVENT_ACTION(MCPWM_TIMER_DIRECTION_UP,
                                 MCPWM_TIMER_EVENT_EMPTY,
                                 MCPWM_GEN_ACTION_HIGH));
```

##### Function details

###### `mcpwm_generator_set_action_on_timer_event()`

**Parameters:** `gen` **[in]** — generator handle; `action` **[in, by value]** — timer direction, TEZ/TEP event, and KEEP/LOW/HIGH/TOGGLE output action.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG` for invalid handle/enums; `ESP_ERR_INVALID_STATE` if no timer is connected; `ESP_FAIL` otherwise.

**Uses internally:** validate descriptor → generator/operator lock → `mcpwm_ll_generator_set_action_on_timer_event()` → map to UTEZ/UTEP/DTEZ/DTEP in generator A/B action shadow.

###### `mcpwm_generator_set_action_on_compare_event()`

**Parameters:** `gen` **[in]** — generator handle; `action` **[in, by value]** — direction, comparator handle, action. Comparator must share the generator's operator.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG` for bad/cross-operator input; `ESP_FAIL` otherwise.

**Uses internally:** resolve comparator A/B → lock generator → `mcpwm_ll_generator_set_action_on_compare_event()` → program UTEA/UTEB/DTEA/DTEB field.

###### `mcpwm_generator_set_action_on_fault_event()`

**Parameters:** `gen` **[in]** — generator; `action` **[in, by value]** — direction, GPIO fault handle, output action. Only a compatible GPIO fault can route directly as a trigger.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG` for a NULL generator; `ESP_ERR_NOT_SUPPORTED` for a non-GPIO fault; `ESP_ERR_NOT_FOUND` when no operator trigger slot is free.

**Uses internally:** validate same group/type → find or claim trigger with operator lock → LL routes GPIO fault trigger → `mcpwm_ll_generator_set_action_on_trigger_event()` programs UT0/UT1/DT0/DT1 action.

###### `mcpwm_generator_set_action_on_sync_event()`

**Parameters:** `gen` **[in]** — generator; `action` **[in, by value]** — direction, sync-source handle, output action. Source must be usable in the same group.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_ERR_NOT_FOUND`/`ESP_ERR_INVALID_STATE` for trigger routing exhaustion/conflict; `ESP_FAIL` otherwise.

**Uses internally:** resolve sync trigger → reserve/reuse operator trigger → LL trigger selection → `mcpwm_ll_generator_set_action_on_trigger_event()` writes the matching direction/trigger field.

##### Structures

```c
typedef struct {
    mcpwm_timer_direction_t direction;
    mcpwm_timer_event_t event;
    mcpwm_generator_action_t action;
} mcpwm_gen_timer_event_action_t;

typedef struct {
    mcpwm_timer_direction_t direction;
    mcpwm_cmpr_handle_t comparator;
    mcpwm_generator_action_t action;
} mcpwm_gen_compare_event_action_t;

typedef struct {
    mcpwm_timer_direction_t direction;
    mcpwm_fault_handle_t fault;
    mcpwm_generator_action_t action;
} mcpwm_gen_fault_event_action_t;

typedef struct {
    mcpwm_timer_direction_t direction;
    mcpwm_sync_handle_t sync;
    mcpwm_generator_action_t action;
} mcpwm_gen_sync_event_action_t;
```

##### Detailed information

**Timer event action:** maps `(direction, TEZ/TEP)` to a UTEZ/UTEP/DTEZ/DTEP field in `MCPWM_GENx_A_REG` or `B_REG` through `mcpwm_ll_generator_set_action_on_timer_event()`.

**Compare event action:** resolves comparator A/B, then maps up/down reach to UTEA/UTEB/DTEA/DTEB. The comparator must belong to the same operator.

**Fault/sync action:** private code allocates or reuses one of the operator trigger slots, associates it with the fault/sync source, then programs UT0/UT1/DT0/DT1 action fields. Trigger scarcity is why arbitrary combinations can fail even when handles are valid.

**Shadow behavior:** LL writes action shadows; operator creation flags select TEZ, TEP, or sync activation. A global force-update exists internally but is not an application synchronization API.

#### Related Use Cases

- [Operator, Comparator, and Generator Pipeline](../03_use_cases/04_operator_comparator_and_generator.md)
- [Basic and Symmetric PWM](../03_use_cases/05_basic_and_symmetric_pwm.md)
- [Complete MCPWM Application Sequences](../03_use_cases/13_complete_application_sequences.md)

### Summary Section (Summary of Notes)

Define output behavior as explicit event/action rows. Include timer direction in center-aligned modes, choose a safe shadow-transfer point for live changes, and use brake actions—not ad hoc generator actions—for coordinated protection.
