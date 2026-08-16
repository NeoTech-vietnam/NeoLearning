# Cornell Notes

## Topic: Application Examples and API Reference

## Date: 23/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- Which ESP-IDF examples demonstrate each MCPWM feature family?
- Which headers should application code include and declare as dependencies?
- Where is the exhaustive public/private/HAL/LL symbol inventory?

---

### Notes Section (Main Notes)

Use public driver APIs in applications. The umbrella include is:

```c
#include "driver/mcpwm_prelude.h"
```

Declare the component dependency with `REQUIRES esp_driver_mcpwm` (public propagation) or `PRIV_REQUIRES esp_driver_mcpwm` (private to the component). Focused headers include `mcpwm_timer.h`, `mcpwm_oper.h`, `mcpwm_cmpr.h`, `mcpwm_gen.h`, `mcpwm_fault.h`, `mcpwm_sync.h`, and `mcpwm_cap.h`. Files below `src/`, `esp_private/`, `hal/`, or target `mcpwm_ll.h` explain implementation; applications must not depend on them.

| Example | Main lesson |
|---|---|
| [servo control](https://github.com/espressif/esp-idf/tree/v6.0.1/examples/peripherals/mcpwm/mcpwm_servo_control) | timer/operator/comparator/generator lifecycle and duty updates |
| [synchronization](https://github.com/espressif/esp-idf/tree/v6.0.1/examples/peripherals/mcpwm/mcpwm_sync) | GPIO, timer-event, and software phase alignment |
| [HC-SR04 capture](https://github.com/espressif/esp-idf/tree/v6.0.1/examples/peripherals/mcpwm/mcpwm_capture_hc_sr04) | edge timestamps and pulse-width conversion |
| [BDC speed control](https://github.com/espressif/esp-idf/tree/v6.0.1/examples/peripherals/mcpwm/mcpwm_bdc_speed_control) | motor-control composition with feedback |
| [BLDC Hall control](https://github.com/espressif/esp-idf/tree/v6.0.1/examples/peripherals/mcpwm/mcpwm_bldc_hall_control) | commutation with capture/fault-style events |
| [open-loop SVPWM](https://github.com/espressif/esp-idf/tree/v6.0.1/examples/peripherals/mcpwm/mcpwm_foc_svpwm_open_loop) | coordinated multi-phase generation |

Minimal application order: create timer/operator → connect → create comparator/generator → set compare/actions → register callbacks → enable → start → operate → stop → disable → delete children → delete parents. Full patterns and failure cleanup are in [complete application sequences](../03_use_cases/13_complete_application_sequences.md) and [debugging](../03_use_cases/14_debugging_and_common_failures.md).

The exhaustive classified catalog—public API, private driver, HAL, ESP32-S3 LL, registers, and external boundaries—is [MCPWM APIs](../03_use_cases/15_mcpwm_apis.md). API declarations are pinned to [ESP-IDF v6.0.1](https://github.com/espressif/esp-idf/tree/v6.0.1/components/esp_driver_mcpwm).

#### API Family Reference

##### Public Handles and Ownership

```c
mcpwm_timer_handle_t       /* parent: group */
mcpwm_oper_handle_t        /* parent: group */
mcpwm_cmpr_handle_t        /* parent: operator */
mcpwm_gen_handle_t         /* parent: operator */
mcpwm_fault_handle_t       /* parent: group or software object */
mcpwm_sync_handle_t        /* parent: timer/group/software object */
mcpwm_cap_timer_handle_t   /* parent: group */
mcpwm_cap_channel_handle_t /* parent: capture timer */
```

##### Function Families

| Family | Main public operations | Detailed note |
|---|---|---|
| timer | `new/del`, resolution, period, callbacks, enable/disable, start/stop, phase sync | [timer RAI](04_rai_mcpwm_timers.md), [timer operations](07_timer_and_comparator_operations.md) |
| operator | `new/del`, connect timer, callbacks, carrier, brake/recover | [operator RAI](05_rai_operators_comparators_and_generators.md) |
| comparator | `new/del`, compare value, callbacks | [timer/comparator operations](07_timer_and_comparator_operations.md) |
| generator | `new/del`, event actions, dead time, force | [generator actions](08_generator_actions_and_classical_waveforms.md), [dead time](09_dead_time_and_carrier_modulation.md) |
| fault | GPIO/software create, delete, activate, callbacks | [fault and brake](10_faults_brake_and_force_actions.md) |
| sync | timer/GPIO/software create, activate, delete, apply phase | [synchronization](11_synchronization_and_phase_control.md) |
| capture | timer/channel lifecycle, callbacks, resolution, soft catch, latched value | [capture](12_capture_operations_and_events.md) |

##### Detailed information

Every public handle points to a private driver object containing ownership links, hardware ID, state, locks, callbacks, and the group HAL reference. Public APIs validate and enforce policy; private static registration/destruction helpers claim resources and roll back; HAL establishes reset defaults; ESP32-S3 LL performs field-level register access. GPIO matrix, heap, interrupts, clock tree, PM locks, and FreeRTOS notification/queue calls remain **External dependencies**.

Do not copy internal signatures into application code. Their presence in these notes explains the call path only. Use the symbol-by-symbol classifications and source anchors in [MCPWM APIs](../03_use_cases/15_mcpwm_apis.md) when tracing beyond the public header.

#### Related Use Cases

- [MCPWM Resource Relationships and Software Layers](../03_use_cases/01_overview_and_resource_relationships.md)
- [MCPWM Lifecycle and Common API Flow](../03_use_cases/02_mcpwm_lifecycle_and_common_api_flow.md)
- [Complete MCPWM Application Sequences](../03_use_cases/13_complete_application_sequences.md)
- [MCPWM Debugging and Common Failures](../03_use_cases/14_debugging_and_common_failures.md)
- [Complete MCPWM API Catalog](../03_use_cases/15_mcpwm_apis.md)

### Summary Section (Summary of Notes)

Applications depend on `esp_driver_mcpwm` and call only public headers. Start from the smallest official example matching the feature, preserve lifecycle/error cleanup, and use the API catalog to trace implementation details without importing private interfaces.
