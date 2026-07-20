# Cornell Notes

## Topic: ESP-IDF v6.0.1 MCPWM API and Type Catalog

## Date: 20/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- Which MCPWM symbols are public application interfaces?
- Which header declares each function, structure, handle, callback, enum, and macro?
- Which objects own or depend on other MCPWM objects?
- Which common declarations are unavailable on ESP32-S3?
- Which use-case note explains each API in context?

---

### Notes Section (Main Notes)

#### Scope and Header Choice

This catalog inventories the **new MCPWM driver** in ESP-IDF `v6.0.1`. Application code can include everything normally needed with:

```c
#include "driver/mcpwm_prelude.h"
```

ETM declarations are also included by the prelude, but ESP32-S3 does not define `SOC_MCPWM_SUPPORT_ETM`; do not call those functions on this target. Symbols under `src/`, `esp_private/`, `hal/`, or `mcpwm_ll.h` are implementation interfaces, not normal application APIs.

<a id="esp32-s3-capability-caveats"></a>
#### ESP32-S3 Capability Caveats

| Common declaration | ESP32-S3 v6.0.1 status |
|---|---|
| Normal timer/operator/comparator/generator/fault/sync/capture APIs | Supported |
| `mcpwm_new_event_comparator()` | Declared, but implementation is excluded because `SOC_MCPWM_SUPPORT_EVENT_COMPARATOR` is absent |
| MCPWM ETM creation APIs | Declared, but `mcpwm_etm.c` is not linked because `SOC_MCPWM_SUPPORT_ETM` is absent |
| `.flags.allow_pd` register retention | Rejected with `ESP_ERR_NOT_SUPPORTED` because `SOC_MCPWM_SUPPORT_SLEEP_RETENTION` is absent |

## Opaque Handle Types

Handles identify driver-owned objects; their private structures must not be dereferenced by application code.

| Handle | Represents | Owner/parent |
|---|---|---|
| <a id="type-mcpwm-timer-handle-t"></a>`mcpwm_timer_handle_t` | PWM timer | MCPWM group |
| <a id="type-mcpwm-oper-handle-t"></a>`mcpwm_oper_handle_t` | PWM operator | MCPWM group |
| <a id="type-mcpwm-cmpr-handle-t"></a>`mcpwm_cmpr_handle_t` | comparator | operator |
| <a id="type-mcpwm-gen-handle-t"></a>`mcpwm_gen_handle_t` | generator/output | operator |
| <a id="type-mcpwm-fault-handle-t"></a>`mcpwm_fault_handle_t` | GPIO/software fault | group or bound operator |
| <a id="type-mcpwm-sync-handle-t"></a>`mcpwm_sync_handle_t` | timer/GPIO/software sync source | group, timer, or consumer |
| <a id="type-mcpwm-cap-timer-handle-t"></a>`mcpwm_cap_timer_handle_t` | capture time base | MCPWM group |
| <a id="type-mcpwm-cap-channel-handle-t"></a>`mcpwm_cap_channel_handle_t` | capture input | capture timer |

Declared by `driver/mcpwm_types.h`. See [resource relationships](01_overview_and_resource_relationships.md) and [lifecycle](02_mcpwm_lifecycle_and_common_api_flow.md).

## Timer APIs and Structures

Header: `driver/mcpwm_timer.h`.

| API | Signature and purpose | Use-case notes |
|---|---|---|
| <a id="api-mcpwm-new-timer"></a>`mcpwm_new_timer()` | `esp_err_t (const mcpwm_timer_config_t *, mcpwm_timer_handle_t *)`; allocate/configure a timer | [clock trace](03_timer_clock_and_prescaler.md) |
| <a id="api-mcpwm-del-timer"></a>`mcpwm_del_timer()` | `esp_err_t (mcpwm_timer_handle_t)`; release an INIT timer | [lifecycle](02_mcpwm_lifecycle_and_common_api_flow.md) |
| <a id="api-mcpwm-timer-set-period"></a>`mcpwm_timer_set_period()` | `esp_err_t (mcpwm_timer_handle_t, uint32_t)`; write a new shadowed period | [clock/period](03_timer_clock_and_prescaler.md) |
| <a id="api-mcpwm-timer-enable"></a>`mcpwm_timer_enable()` | enter ENABLE state; enable ISR and acquire PM lock | [lifecycle](02_mcpwm_lifecycle_and_common_api_flow.md) |
| <a id="api-mcpwm-timer-disable"></a>`mcpwm_timer_disable()` | return to INIT; disable ISR and release PM lock | [lifecycle](02_mcpwm_lifecycle_and_common_api_flow.md) |
| <a id="api-mcpwm-timer-start-stop"></a>`mcpwm_timer_start_stop()` | issue `mcpwm_timer_start_stop_cmd_t` to hardware | [lifecycle](02_mcpwm_lifecycle_and_common_api_flow.md) |
| <a id="api-mcpwm-timer-register-event-callbacks"></a>`mcpwm_timer_register_event_callbacks()` | install/update empty, full, and stop callbacks | [interrupts](11_interrupts_callbacks_and_runtime_safety.md) |
| <a id="api-mcpwm-timer-set-phase-on-sync"></a>`mcpwm_timer_set_phase_on_sync()` | select sync source, count, and direction; NULL source disables sync | [synchronization](08_synchronization_and_phase_control.md) |

| Structure | Key members and role |
|---|---|
| <a id="type-mcpwm-timer-config-t"></a>`mcpwm_timer_config_t` | `group_id`, `clk_src`, `resolution_hz`, `count_mode`, `period_ticks`, `intr_priority`; flags for period update and `allow_pd` |
| <a id="type-mcpwm-timer-event-callbacks-t"></a>`mcpwm_timer_event_callbacks_t` | `on_full`, `on_empty`, `on_stop` |
| <a id="type-mcpwm-timer-sync-phase-config-t"></a>`mcpwm_timer_sync_phase_config_t` | `sync_src`, `count_value`, `direction` |

## Operator and Carrier APIs and Structures

Header: `driver/mcpwm_oper.h`.

| API | Purpose | Use-case notes |
|---|---|---|
| <a id="api-mcpwm-new-operator"></a>`mcpwm_new_operator()` | allocate/reset an operator in a group | [pipeline](04_operator_comparator_and_generator.md) |
| <a id="api-mcpwm-del-operator"></a>`mcpwm_del_operator()` | delete an operator after children are removed | [lifecycle](02_mcpwm_lifecycle_and_common_api_flow.md) |
| <a id="api-mcpwm-operator-connect-timer"></a>`mcpwm_operator_connect_timer()` | select a same-group timer as timing source | [pipeline](04_operator_comparator_and_generator.md) |
| <a id="api-mcpwm-operator-set-brake-on-fault"></a>`mcpwm_operator_set_brake_on_fault()` | bind fault to CBC/OST operator braking | [faults](09_faults_and_brake_actions.md) |
| <a id="api-mcpwm-operator-recover-from-fault"></a>`mcpwm_operator_recover_from_fault()` | verify cleared fault and clear an OST latch | [faults](09_faults_and_brake_actions.md) |
| <a id="api-mcpwm-operator-register-event-callbacks"></a>`mcpwm_operator_register_event_callbacks()` | register CBC/OST brake callbacks | [interrupts](11_interrupts_callbacks_and_runtime_safety.md) |
| <a id="api-mcpwm-operator-apply-carrier"></a>`mcpwm_operator_apply_carrier()` | configure or disable high-frequency carrier modulation | [carrier](07_carrier_and_force_actions.md) |

| Structure | Key members and role |
|---|---|
| <a id="type-mcpwm-operator-config-t"></a>`mcpwm_operator_config_t` | group/priority; generator-action and dead-time shadow update flags |
| <a id="type-mcpwm-brake-config-t"></a>`mcpwm_brake_config_t` | `fault`, `brake_mode`, CBC recovery at TEZ/TEP |
| <a id="type-mcpwm-operator-event-callbacks-t"></a>`mcpwm_operator_event_callbacks_t` | `on_brake_cbc`, `on_brake_ost` |
| <a id="type-mcpwm-carrier-config-t"></a>`mcpwm_carrier_config_t` | `clk_src`, frequency, first-pulse duration, duty, pre/post inversion |

## Comparator APIs and Structures

Header: `driver/mcpwm_cmpr.h`.

| API | Purpose | Use-case notes |
|---|---|---|
| <a id="api-mcpwm-new-comparator"></a>`mcpwm_new_comparator()` | allocate an operator comparator and configure shadow updates | [pipeline](04_operator_comparator_and_generator.md) |
| <a id="api-mcpwm-del-comparator"></a>`mcpwm_del_comparator()` | disable events and release comparator | [lifecycle](02_mcpwm_lifecycle_and_common_api_flow.md) |
| <a id="api-mcpwm-new-event-comparator"></a>`mcpwm_new_event_comparator()` | allocate ETM-only comparator; **not implemented for ESP32-S3** | [power/ETM](12_power_management_and_etm.md) |
| <a id="api-mcpwm-comparator-register-event-callbacks"></a>`mcpwm_comparator_register_event_callbacks()` | register compare-reach callback | [interrupts](11_interrupts_callbacks_and_runtime_safety.md) |
| <a id="api-mcpwm-comparator-set-compare-value"></a>`mcpwm_comparator_set_compare_value()` | validate against timer peak and write compare shadow value | [PWM](05_basic_and_symmetric_pwm.md) |

| Structure | Key members and role |
|---|---|
| <a id="type-mcpwm-comparator-config-t"></a>`mcpwm_comparator_config_t` | interrupt priority and update-on-TEZ/TEP/sync flags |
| <a id="type-mcpwm-event-comparator-config-t"></a>`mcpwm_event_comparator_config_t` | empty configuration; event comparator unsupported on ESP32-S3 |
| <a id="type-mcpwm-comparator-event-callbacks-t"></a>`mcpwm_comparator_event_callbacks_t` | `on_reach` callback |

<a id="generator-apis-action-structures-and-macros"></a>
## Generator APIs, Action Structures, and Macros

Header: `driver/mcpwm_gen.h`.

| API | Purpose | Use-case notes |
|---|---|---|
| <a id="api-mcpwm-new-generator"></a>`mcpwm_new_generator()` | allocate an operator generator and route output GPIO | [pipeline](04_operator_comparator_and_generator.md) |
| <a id="api-mcpwm-del-generator"></a>`mcpwm_del_generator()` | detach GPIO and release generator | [lifecycle](02_mcpwm_lifecycle_and_common_api_flow.md) |
| <a id="api-mcpwm-generator-set-force-level"></a>`mcpwm_generator_set_force_level()` | force 0/1 or release with `-1`; optionally hold | [force actions](07_carrier_and_force_actions.md) |
| <a id="api-mcpwm-generator-set-action-on-timer-event"></a>`mcpwm_generator_set_action_on_timer_event()` | program direction + TEZ/TEP action | [PWM](05_basic_and_symmetric_pwm.md) |
| <a id="api-mcpwm-generator-set-action-on-compare-event"></a>`mcpwm_generator_set_action_on_compare_event()` | program direction + comparator action | [PWM](05_basic_and_symmetric_pwm.md) |
| <a id="api-mcpwm-generator-set-action-on-brake-event"></a>`mcpwm_generator_set_action_on_brake_event()` | program direction + CBC/OST action | [faults](09_faults_and_brake_actions.md) |
| <a id="api-mcpwm-generator-set-action-on-fault-event"></a>`mcpwm_generator_set_action_on_fault_event()` | program direct GPIO-fault action | [faults](09_faults_and_brake_actions.md) |
| <a id="api-mcpwm-generator-set-action-on-sync-event"></a>`mcpwm_generator_set_action_on_sync_event()` | program action on a selected sync trigger | [synchronization](08_synchronization_and_phase_control.md) |
| <a id="api-mcpwm-generator-set-dead-time"></a>`mcpwm_generator_set_dead_time()` | route/invert rising/falling edge delays | [dead time](06_complementary_pwm_and_dead_time.md) |

| Structure | Members |
|---|---|
| <a id="type-mcpwm-generator-config-t"></a>`mcpwm_generator_config_t` | output GPIO and GPIO-matrix inversion |
| <a id="type-mcpwm-gen-timer-event-action-t"></a>`mcpwm_gen_timer_event_action_t` | direction, timer event, action |
| <a id="type-mcpwm-gen-compare-event-action-t"></a>`mcpwm_gen_compare_event_action_t` | direction, comparator, action |
| <a id="type-mcpwm-gen-brake-event-action-t"></a>`mcpwm_gen_brake_event_action_t` | direction, brake mode, action |
| <a id="type-mcpwm-gen-fault-event-action-t"></a>`mcpwm_gen_fault_event_action_t` | direction, GPIO fault, action |
| <a id="type-mcpwm-gen-sync-event-action-t"></a>`mcpwm_gen_sync_event_action_t` | direction, sync source, action |
| <a id="type-mcpwm-dead-time-config-t"></a>`mcpwm_dead_time_config_t` | positive/negative delay ticks and output inversion |

The matching initializer macros are <a id="macro-mcpwm-gen-timer-event-action"></a>`MCPWM_GEN_TIMER_EVENT_ACTION`, <a id="macro-mcpwm-gen-compare-event-action"></a>`MCPWM_GEN_COMPARE_EVENT_ACTION`, <a id="macro-mcpwm-gen-brake-event-action"></a>`MCPWM_GEN_BRAKE_EVENT_ACTION`, <a id="macro-mcpwm-gen-fault-event-action"></a>`MCPWM_GEN_FAULT_EVENT_ACTION`, and <a id="macro-mcpwm-gen-sync-event-action"></a>`MCPWM_GEN_SYNC_EVENT_ACTION`.

## Synchronization APIs and Structures

Header: `driver/mcpwm_sync.h`.

| API | Purpose | Use-case notes |
|---|---|---|
| <a id="api-mcpwm-new-timer-sync-src"></a>`mcpwm_new_timer_sync_src()` | expose a timer event as sync output | [synchronization](08_synchronization_and_phase_control.md) |
| <a id="api-mcpwm-new-gpio-sync-src"></a>`mcpwm_new_gpio_sync_src()` | allocate and route an external GPIO sync source | [synchronization](08_synchronization_and_phase_control.md) |
| <a id="api-mcpwm-new-soft-sync-src"></a>`mcpwm_new_soft_sync_src()` | create a software-triggered sync object | [synchronization](08_synchronization_and_phase_control.md) |
| <a id="api-mcpwm-del-sync-src"></a>`mcpwm_del_sync_src()` | dispatch type-specific sync cleanup | [lifecycle](02_mcpwm_lifecycle_and_common_api_flow.md) |
| <a id="api-mcpwm-soft-sync-activate"></a>`mcpwm_soft_sync_activate()` | trigger the bound software sync source | [synchronization](08_synchronization_and_phase_control.md) |

| Structure | Key members and role |
|---|---|
| <a id="type-mcpwm-timer-sync-src-config-t"></a>`mcpwm_timer_sync_src_config_t` | timer event and input-sync propagation |
| <a id="type-mcpwm-gpio-sync-src-config-t"></a>`mcpwm_gpio_sync_src_config_t` | group, GPIO, active edge |
| <a id="type-mcpwm-soft-sync-config-t"></a>`mcpwm_soft_sync_config_t` | empty factory configuration |

## Fault APIs and Structures

Header: `driver/mcpwm_fault.h`.

| API | Purpose | Use-case notes |
|---|---|---|
| <a id="api-mcpwm-new-gpio-fault"></a>`mcpwm_new_gpio_fault()` | allocate detector and route GPIO active level | [faults](09_faults_and_brake_actions.md) |
| <a id="api-mcpwm-new-soft-fault"></a>`mcpwm_new_soft_fault()` | create a software fault object | [faults](09_faults_and_brake_actions.md) |
| <a id="api-mcpwm-del-fault"></a>`mcpwm_del_fault()` | dispatch type-specific fault cleanup | [lifecycle](02_mcpwm_lifecycle_and_common_api_flow.md) |
| <a id="api-mcpwm-soft-fault-activate"></a>`mcpwm_soft_fault_activate()` | trigger a bound software fault once | [faults](09_faults_and_brake_actions.md) |
| <a id="api-mcpwm-fault-register-event-callbacks"></a>`mcpwm_fault_register_event_callbacks()` | register GPIO fault enter/exit callbacks | [interrupts](11_interrupts_callbacks_and_runtime_safety.md) |

| Structure | Key members and role |
|---|---|
| <a id="type-mcpwm-gpio-fault-config-t"></a>`mcpwm_gpio_fault_config_t` | group, interrupt priority, GPIO, active level |
| <a id="type-mcpwm-soft-fault-config-t"></a>`mcpwm_soft_fault_config_t` | empty factory configuration |
| <a id="type-mcpwm-fault-event-callbacks-t"></a>`mcpwm_fault_event_callbacks_t` | `on_fault_enter`, `on_fault_exit` |

## Capture APIs and Structures

Header: `driver/mcpwm_cap.h`.

| API | Purpose | Use-case notes |
|---|---|---|
| <a id="api-mcpwm-new-capture-timer"></a>`mcpwm_new_capture_timer()` | allocate/configure the group's capture time base | [capture](10_capture_timer_and_channels.md) |
| <a id="api-mcpwm-del-capture-timer"></a>`mcpwm_del_capture_timer()` | delete INIT capture timer after channels | [lifecycle](02_mcpwm_lifecycle_and_common_api_flow.md) |
| <a id="api-mcpwm-capture-timer-enable"></a>`mcpwm_capture_timer_enable()` | enter ENABLE and acquire PM lock | [capture](10_capture_timer_and_channels.md) |
| <a id="api-mcpwm-capture-timer-disable"></a>`mcpwm_capture_timer_disable()` | return to INIT and release PM lock | [capture](10_capture_timer_and_channels.md) |
| <a id="api-mcpwm-capture-timer-start"></a>`mcpwm_capture_timer_start()` | start the free-running capture counter | [capture](10_capture_timer_and_channels.md) |
| <a id="api-mcpwm-capture-timer-stop"></a>`mcpwm_capture_timer_stop()` | stop the capture counter | [capture](10_capture_timer_and_channels.md) |
| <a id="api-mcpwm-capture-timer-get-resolution"></a>`mcpwm_capture_timer_get_resolution()` | return actual capture ticks per second | [capture](10_capture_timer_and_channels.md) |
| <a id="api-mcpwm-capture-timer-set-phase-on-sync"></a>`mcpwm_capture_timer_set_phase_on_sync()` | configure capture-timer sync phase | [synchronization](08_synchronization_and_phase_control.md) |
| <a id="api-mcpwm-new-capture-channel"></a>`mcpwm_new_capture_channel()` | allocate channel, route GPIO, select edges/prescale | [capture](10_capture_timer_and_channels.md) |
| <a id="api-mcpwm-del-capture-channel"></a>`mcpwm_del_capture_channel()` | release an INIT capture channel | [lifecycle](02_mcpwm_lifecycle_and_common_api_flow.md) |
| <a id="api-mcpwm-capture-channel-enable"></a>`mcpwm_capture_channel_enable()` | enable edge capture and installed ISR | [capture](10_capture_timer_and_channels.md) |
| <a id="api-mcpwm-capture-channel-disable"></a>`mcpwm_capture_channel_disable()` | disable edge capture and ISR | [capture](10_capture_timer_and_channels.md) |
| <a id="api-mcpwm-capture-channel-register-event-callbacks"></a>`mcpwm_capture_channel_register_event_callbacks()` | install/update `on_cap` callback | [interrupts](11_interrupts_callbacks_and_runtime_safety.md) |
| <a id="api-mcpwm-capture-channel-trigger-soft-catch"></a>`mcpwm_capture_channel_trigger_soft_catch()` | latch timestamp without an external edge | [capture](10_capture_timer_and_channels.md) |
| <a id="api-mcpwm-capture-get-latched-value"></a>`mcpwm_capture_get_latched_value()` | read the last captured timestamp by polling | [capture](10_capture_timer_and_channels.md) |

| Structure | Key members and role |
|---|---|
| <a id="type-mcpwm-capture-timer-config-t"></a>`mcpwm_capture_timer_config_t` | group, clock source, requested resolution, unsupported-on-S3 `allow_pd` |
| <a id="type-mcpwm-capture-timer-sync-phase-config-t"></a>`mcpwm_capture_timer_sync_phase_config_t` | sync source, count, direction (capture counts up) |
| <a id="type-mcpwm-capture-channel-config-t"></a>`mcpwm_capture_channel_config_t` | GPIO, interrupt priority, input prescale, positive/negative/invert flags |
| <a id="type-mcpwm-capture-event-callbacks-t"></a>`mcpwm_capture_event_callbacks_t` | `on_cap` callback |

## ETM APIs and Structures — Unavailable on ESP32-S3

Header: `driver/mcpwm_etm.h`. These declarations exist in the common component, but ESP32-S3 does not link their implementation.

| API | Purpose on supported targets |
|---|---|
| <a id="api-mcpwm-comparator-new-etm-event"></a>`mcpwm_comparator_new_etm_event()` | create ETM event from comparator equality |
| <a id="api-mcpwm-timer-new-etm-event"></a>`mcpwm_timer_new_etm_event()` | create ETM event from timer TEZ/TEP |

| Structure | Member |
|---|---|
| <a id="type-mcpwm-cmpr-etm-event-config-t"></a>`mcpwm_cmpr_etm_event_config_t` | comparator ETM event type |
| <a id="type-mcpwm-timer-etm-event-config-t"></a>`mcpwm_timer_etm_event_config_t` | timer ETM event type |

See [power management and ETM](12_power_management_and_etm.md) for capability-aware behavior.

Target-gated internal sequence helpers, none of which exist in the ESP32-S3 LL header:

| Internal LL symbol | Meaning on a supported target | Sequence |
|---|---|---|
| `mcpwm_ll_operator_set_event_compare_value()` | Write ETM-only event-comparator threshold | event comparator → public compare-value setter |
| `mcpwm_ll_etm_enable_comparator_event()` | Enable/disable normal comparator-equal ETM source | comparator ETM create/delete |
| `mcpwm_ll_etm_enable_evt_comparator_event()` | Enable/disable event-comparator ETM source | event-comparator ETM create/delete |
| `mcpwm_ll_etm_enable_timer_event()` | Enable/disable timer TEZ/TEP ETM source | timer ETM create/delete |

<a id="event-data-and-callback-types"></a>
## Event Data and Callback Types

Header: `driver/mcpwm_types.h`. All callbacks execute in ISR context and return `true` only when a higher-priority task was woken.

| Event structure | Fields |
|---|---|
| <a id="type-mcpwm-timer-event-data-t"></a>`mcpwm_timer_event_data_t` | `count_value`, `direction` |
| <a id="type-mcpwm-brake-event-data-t"></a>`mcpwm_brake_event_data_t` | empty/reserved in v6.0.1 |
| <a id="type-mcpwm-fault-event-data-t"></a>`mcpwm_fault_event_data_t` | empty/reserved in v6.0.1 |
| <a id="type-mcpwm-compare-event-data-t"></a>`mcpwm_compare_event_data_t` | `compare_ticks`, `direction` |
| <a id="type-mcpwm-capture-event-data-t"></a>`mcpwm_capture_event_data_t` | `cap_value`, `cap_edge` |

| Callback type | Called for |
|---|---|
| <a id="type-mcpwm-timer-event-cb-t"></a>`mcpwm_timer_event_cb_t` | timer empty/full/stop |
| <a id="type-mcpwm-brake-event-cb-t"></a>`mcpwm_brake_event_cb_t` | operator CBC/OST brake |
| <a id="type-mcpwm-fault-event-cb-t"></a>`mcpwm_fault_event_cb_t` | fault enter/exit |
| <a id="type-mcpwm-compare-event-cb-t"></a>`mcpwm_compare_event_cb_t` | comparator reached |
| <a id="type-mcpwm-capture-event-cb-t"></a>`mcpwm_capture_event_cb_t` | capture edge/soft catch |

## Enum and Clock Types

Declared by `esp_hal_mcpwm/include/hal/mcpwm_types.h` and exposed through the driver headers.

| Type | Values/meaning |
|---|---|
| <a id="type-mcpwm-timer-clock-source-t"></a>`mcpwm_timer_clock_source_t` | target-specific timer clock source, normally use `MCPWM_TIMER_CLK_SRC_DEFAULT` |
| <a id="type-mcpwm-capture-clock-source-t"></a>`mcpwm_capture_clock_source_t` | target-specific capture source, normally `MCPWM_CAPTURE_CLK_SRC_DEFAULT` |
| <a id="type-mcpwm-carrier-clock-source-t"></a>`mcpwm_carrier_clock_source_t` | target-specific carrier source |
| <a id="type-mcpwm-timer-direction-t"></a>`mcpwm_timer_direction_t` | `MCPWM_TIMER_DIRECTION_UP`, `MCPWM_TIMER_DIRECTION_DOWN` |
| <a id="type-mcpwm-timer-event-t"></a>`mcpwm_timer_event_t` | `EMPTY`, `FULL`, `INVALID` |
| <a id="type-mcpwm-timer-count-mode-t"></a>`mcpwm_timer_count_mode_t` | `PAUSE`, `UP`, `DOWN`, `UP_DOWN` |
| <a id="type-mcpwm-timer-start-stop-cmd-t"></a>`mcpwm_timer_start_stop_cmd_t` | stop/start now or at empty/full boundary |
| <a id="type-mcpwm-generator-action-t"></a>`mcpwm_generator_action_t` | `KEEP`, `LOW`, `HIGH`, `TOGGLE` |
| <a id="type-mcpwm-operator-brake-mode-t"></a>`mcpwm_operator_brake_mode_t` | `CBC`, `OST`, `INVALID` |
| <a id="type-mcpwm-capture-edge-t"></a>`mcpwm_capture_edge_t` | positive or negative edge |
| <a id="type-mcpwm-timer-etm-event-type-t"></a>`mcpwm_timer_etm_event_type_t` | TEZ/TEP ETM selector; unavailable on ESP32-S3 |
| <a id="type-mcpwm-comparator-etm-event-type-t"></a>`mcpwm_comparator_etm_event_type_t` | comparator-equal ETM selector; unavailable on ESP32-S3 |

<a id="trm-private-api-crosswalk"></a>
## Private/HAL/LL Keywords to Technical Reference Crosswalk

Read each row from software toward hardware: private driver functions decide ownership and policy, HAL establishes a known submodule state, and LL helpers manipulate the fields described by the TRM. A linked LL category means **every function in that category** shares the listed hardware concept; the individual function table below gives the narrower field-level meaning.

| Technical keyword | Related private/HAL/LL functions | TRM relationship and register keywords |
|---|---|---|
| <a id="trm-map-resource-ownership"></a>**Groups, resource allocation, parent/child ownership** | `mcpwm_acquire_group_handle()`, `mcpwm_release_group_handle()`; every `*_register_to_*()`, `*_unregister_from_*()`, and `*_destroy()` helper | Software representation of the fixed MCPWM0/MCPWM1 resource tree in [overview](../01_technical_reference_manual/01_overview_and_features.md#overview) and [submodules](../01_technical_reference_manual/02_submodules.md#overview). These helpers normally do not write datapath registers; they prevent two handles from claiming the same timer/operator/comparator/generator/fault/sync/capture resource. |
| <a id="trm-map-clock-prescale"></a>**PWM clock, group prescaler, timer prescaler, reset** | `mcpwm_select_periph_clock()`, `mcpwm_set_prescale()`, `mcpwm_hal_init()`, `mcpwm_hal_deinit()`, [group/clock LL functions](#ll-group-clock-shadow-interrupt) | [Prescaler submodule](../01_technical_reference_manual/02_submodules.md#prescaler-submodule) and [timer configuration](../01_technical_reference_manual/03_pwm_timer_submodule.md#configurations-of-the-pwm-timer-submodule); keywords `PWM_clk`, `PT_clk`, `MCPWM_CLK_PRESCALE`, `MCPWM_TIMERx_PRESCALE`, `MCPWM_CLK_EN`. Bus/function-clock helpers also touch system RCC registers outside the MCPWM chapter. |
| <a id="trm-map-shadow"></a>**Shadow register, active register, update method, global force update** | `mcpwm_hal_init()`, `mcpwm_hal_timer_reset()`, `mcpwm_hal_operator_reset()`; group flush, timer period update, operator compare/action update, and dead-time update LL helpers | [Timer shadow registers](../01_technical_reference_manual/03_pwm_timer_submodule.md#pwm-timer-shadow-register) and [operator shadow behavior](../01_technical_reference_manual/04_pwm_operator_submodule.md#pwm-generator-submodule); `MCPWM_GLOBAL_UP_EN`, `MCPWM_GLOBAL_FORCE_UP`, `*_UPMETHOD`. |
| <a id="trm-map-interrupts"></a>**Interrupt enable, raw/status, clear, ISR dispatch** | `mcpwm_get_intr_priority_flag()`, `mcpwm_check_intr_priority()`; every `*_default_isr()`; [interrupt LL functions](#ll-group-clock-shadow-interrupt) | [Register list](../01_technical_reference_manual/07_registers.md) keywords `MCPWM_INT_ENA`, `MCPWM_INT_RAW`, `MCPWM_INT_ST`, `MCPWM_INT_CLR`; timer TEZ/TEP/stop, compare, fault, brake, and capture event bits. Priority sharing and callbacks are driver policy above the register model. |
| <a id="trm-map-timer"></a>**Timer counter, period/peak, direction, TEZ/TEP, start/stop** | `mcpwm_timer_get_phase()`, `mcpwm_timer_default_isr()`, `mcpwm_hal_timer_reset()`, [timer LL functions](#ll-timer-sync) | [Working modes and timing events](../01_technical_reference_manual/03_pwm_timer_submodule.md#pwm-timers-working-modes-and-timing-event-generation); `MCPWM_TIMERx_PERIOD`, `MCPWM_TIMERx_MOD`, `MCPWM_TIMERx_START`, `MCPWM_TIMERx_VALUE`, UTEZ/UTEP/DTEZ/DTEP. |
| <a id="trm-map-sync"></a>**Synchronization, phase locking, sync-in/out, software sync** | all timer/GPIO/software sync register/destroy/delete helpers; `mcpwm_soft_sync_activate()`; timer/capture phase APIs; [timer-sync LL](#ll-timer-sync) and capture-sync LL | [Timer synchronization and phase locking](../01_technical_reference_manual/03_pwm_timer_submodule.md#pwm-timer-synchronization-and-phase-locking); `MCPWM_TIMERx_SYNCI_EN`, `SYNCISEL`, `SYNCO_SEL`, `SYNC_SW`, phase value/direction, capture `SYNCI_SEL`/`CAP_SYNC_SW`. |
| <a id="trm-map-operator-compare"></a>**Operator timer selection, comparator timestamp, shadow transfer** | operator/comparator registration and ISR helpers; `mcpwm_hal_operator_reset()`; [operator update/trigger LL](#ll-operator-trigger) | [PWM operator](../01_technical_reference_manual/04_pwm_operator_submodule.md#pwm-operator-submodule) and [PWM generator](../01_technical_reference_manual/04_pwm_operator_submodule.md#pwm-generator-submodule); `MCPWM_OPERATORx_TIMERSEL`, `MCPWM_GENx_TSTMP_A/B`, comparator update methods. |
| <a id="trm-map-generator"></a>**Generator event action, force action, GPIO output** | generator register/unregister/destroy helpers; `mcpwm_hal_generator_reset()`; [generator action/force LL](#ll-generator-force) | [PWM generator event/action logic](../01_technical_reference_manual/04_pwm_operator_submodule.md#pwm-generator-submodule); generator action tables for timer, compare, trigger and brake events plus continuous/non-continuous software force fields. GPIO matrix routing is outside the MCPWM register chapter. |
| <a id="trm-map-deadtime"></a>**RED/FED dead time, bypass, inversion, output swap** | `mcpwm_hal_operator_reset()` and [dead-time LL functions](#ll-deadtime) | [Dead Time Generator Submodule](../01_technical_reference_manual/04_pwm_operator_submodule.md#dead-time-generator-submodule); `MCPWM_DTx_RED/FED`, `RED/FED_INSEL`, `OUTBYPASS`, `OUTINVERT`, `A/B_OUTSWAP`, `DTx_CLK_SEL`, update methods. |
| <a id="trm-map-carrier"></a>**Carrier prescale, duty, one-shot width, inversion** | `mcpwm_set_prescale()` and [carrier LL functions](#ll-carrier) | [PWM Carrier Submodule](../01_technical_reference_manual/04_pwm_operator_submodule.md#pwm-carrier-submodule); `MCPWM_CARRIERx_EN`, `PRESCALE`, `DUTY`, `OSHTWTH`, `IN_INVERT`, `OUT_INVERT`. |
| <a id="trm-map-fault-brake"></a>**Fault detector, CBC, OST, recovery, brake action** | all GPIO/software fault register/destroy/delete/ISR helpers; `mcpwm_hal_operator_reset()`; [fault/brake LL functions](#ll-fault-brake) | [Fault Detection Submodule](../01_technical_reference_manual/02_submodules.md#fault-detection-submodule) and [Fault Handler Submodule](../01_technical_reference_manual/04_pwm_operator_submodule.md#fault-handler-submodule); `MCPWM_FH*_F*_CBC/OST`, `SW_CBC/OST`, `CBCPULSE`, `CLR_OST`, `CBC_ON`, `OST_ON`, A/B brake actions. |
| <a id="trm-map-capture"></a>**Capture timer, edge, prescale, timestamp, software capture** | all capture timer/channel register/destroy/ISR helpers; [capture LL functions](#ll-capture) | [Capture timer and channel](../01_technical_reference_manual/05_pwm_capture_submodule.md#capture-timer); `MCPWM_CAP_TIMER_EN`, `CAPx_EN`, `CAPx_MODE`, `CAPx_PRESCALE`, `CAP_CHx`, `CAPx_EDGE`, `CAPx_SW`, capture sync/phase fields. |
| <a id="trm-map-power-retention"></a>**Power management and sleep retention** | `mcpwm_create_retention_module()`, `mcpwm_create_sleep_retention_link_cb()` and PM-lock operations inside enable/disable | No ESP32-S3 MCPWM datapath register mapping: this is system power/clock policy, and MCPWM sleep retention is unsupported on ESP32-S3 v6.0.1. |
| <a id="trm-map-debug-log"></a>**Debug logging** | `mcpwm_override_default_log_level()` | Software-only diagnostic policy; no MCPWM hardware register relationship. |
| <a id="trm-map-etm"></a>**Event Task Matrix/event comparator** | event-comparator/ETM factory/delete functions and target-gated ETM LL helpers | Not part of the ESP32-S3 MCPWM hardware implementation; common declarations belong to other ESP targets and therefore have no ESP32-S3 MCPWM TRM register mapping. |

<a id="complete-public-api-call-sequences"></a>
## Complete Public API Call Sequences

Arrows show the direct internal path in pristine ESP-IDF `v6.0.1`. Validation, locks, memory allocation, GPIO matrix calls, PM locks, and ESP-IDF interrupt calls are stated where they matter even though their names do not begin with `mcpwm_`.

| Public API | Internal sequence after validation | Final effect |
|---|---|---|
| `mcpwm_new_timer()` | allocate → `mcpwm_timer_register_to_group()` → `mcpwm_acquire_group_handle()` → priority/clock/prescale helpers → `mcpwm_hal_timer_reset()` → timer LL configuration | timer handle in INIT |
| `mcpwm_del_timer()` | require INIT/no sync child → disable/clear timer interrupts → `mcpwm_timer_destroy()` → unregister → release group | timer/group reference freed |
| `mcpwm_timer_set_period()` | compute peak → `mcpwm_ll_timer_set_peak()` | shadowed period written |
| `mcpwm_timer_enable()` | require INIT → enable installed interrupt → acquire PM lock → FSM=ENABLE | runtime resources active |
| `mcpwm_timer_disable()` | require ENABLE → disable interrupt → release PM lock → FSM=INIT | deletion becomes legal |
| `mcpwm_timer_start_stop()` | require ENABLE → timer spinlock → `mcpwm_ll_timer_set_start_stop_command()` | counter command written |
| `mcpwm_timer_register_event_callbacks()` | cache/IRAM checks → lazy `esp_intr_alloc_intrstatus()` → `mcpwm_ll_intr_enable()` → save callbacks | timer ISR connected |
| `mcpwm_timer_set_phase_on_sync()` | validate source/group/direction → select timer/GPIO/software source → phase/direction LL writes → enable sync | timer phase load configured |
| `mcpwm_new_operator()` | allocate → register/acquire group → check priority → `mcpwm_hal_operator_reset()` → update/dead-time LL flags | operator handle created |
| `mcpwm_del_operator()` | require no children → disable/clear operator interrupts → destroy/unregister/release | operator freed |
| `mcpwm_operator_connect_timer()` | verify same group → `mcpwm_ll_operator_connect_timer()` → select dead-time clock → remember timer | timing source connected |
| `mcpwm_operator_set_brake_on_fault()` | verify fault type/ownership → program CBC recovery → enable GPIO/software CBC or OST LL path | hardware brake armed |
| `mcpwm_operator_recover_from_fault()` | read CBC/OST active state → if cleared, `mcpwm_ll_brake_clear_ost()` | OST latch recovered |
| `mcpwm_operator_register_event_callbacks()` | IRAM checks → lazy shared ISR allocation → interrupt event enables → save callbacks | brake ISR connected |
| `mcpwm_operator_apply_carrier()` | select clock → shared prescale negotiation → derive actual ticks → carrier LL writes → enable/disable | carrier configured |
| `mcpwm_new_comparator()` | allocate → register to operator → priority check → compare-update LL flags | comparator created |
| `mcpwm_del_comparator()` | disable/clear comparator interrupt → destroy/unregister/free | comparator released |
| `mcpwm_new_event_comparator()` | allocate → register to operator | target-gated; no ESP32-S3 implementation |
| `mcpwm_comparator_register_event_callbacks()` | IRAM checks → lazy ISR allocation → compare interrupt enable → save callback | compare ISR connected |
| `mcpwm_comparator_set_compare_value()` | require connected timer/value ≤ peak → operator/event comparator LL write | compare shadow updated |
| `mcpwm_new_generator()` | allocate → register to operator → `mcpwm_hal_generator_reset()` → configure/invert GPIO matrix | generator/output created |
| `mcpwm_del_generator()` | disconnect GPIO → destroy/unregister/free | generator released |
| `mcpwm_generator_set_force_level()` | choose continuous/non-continuous path → set/trigger or disable matching LL force | output overridden/released |
| `mcpwm_generator_set_action_on_timer_event()` | validate descriptor → generator lock → timer-event LL action | TEZ/TEP action programmed |
| `mcpwm_generator_set_action_on_compare_event()` | verify same operator → lock → compare-event LL action | compare action programmed |
| `mcpwm_generator_set_action_on_brake_event()` | validate direction/mode → lock → brake-event LL action | CBC/OST action programmed |
| `mcpwm_generator_set_action_on_fault_event()` | allocate/reuse operator trigger → route GPIO fault → trigger-event LL action | direct fault action programmed |
| `mcpwm_generator_set_action_on_sync_event()` | allocate/reuse operator trigger → route sync → trigger-event LL action | sync action programmed |
| `mcpwm_generator_set_dead_time()` | verify same operator/edge ownership → configure RED/FED source, delay, bypass, invert and swap LL paths | delayed output path configured |
| `mcpwm_new_timer_sync_src()` | allocate → register to source timer → select sync-out timer event → optional input propagation | timer sync source created |
| `mcpwm_new_gpio_sync_src()` | allocate → register/acquire group trigger → configure GPIO matrix and LL inversion | GPIO sync source created |
| `mcpwm_new_soft_sync_src()` | validate → allocate base object | unbound software source created |
| `mcpwm_del_sync_src()` | call stored type-specific delete → unregister/release as needed → free | sync source removed |
| `mcpwm_soft_sync_activate()` | inspect bound consumer → timer soft-sync LL or capture software-sync LL | sync pulse emitted |
| `mcpwm_new_gpio_fault()` | allocate → register/acquire group slot → priority/GPIO setup → active-level and detection LL writes | fault detector armed |
| `mcpwm_new_soft_fault()` | validate → allocate base object | unbound software fault created |
| `mcpwm_del_fault()` | call stored type-specific delete → disable detector/unregister if GPIO → free | fault removed |
| `mcpwm_soft_fault_activate()` | inspect bound brake mode → trigger soft CBC or OST LL | one software fault emitted |
| `mcpwm_fault_register_event_callbacks()` | GPIO-only/IRAM checks → lazy ISR allocation → enter/exit interrupt enables → save callbacks | fault ISR connected |
| `mcpwm_new_capture_timer()` | allocate → register/acquire group singleton → select clock/prescale → optional retention → FSM=INIT | capture timer created |
| `mcpwm_del_capture_timer()` | require INIT/no channels → destroy/unregister/release | capture timer freed |
| `mcpwm_capture_timer_enable()` | require INIT → acquire PM lock → FSM=ENABLE | capture runtime active |
| `mcpwm_capture_timer_disable()` | require ENABLE → release PM lock → FSM=INIT | capture timer deletable |
| `mcpwm_capture_timer_start()` | require ENABLE → `mcpwm_ll_capture_enable_timer(true)` | capture counter starts |
| `mcpwm_capture_timer_stop()` | require ENABLE → `mcpwm_ll_capture_enable_timer(false)` | capture counter stops |
| `mcpwm_capture_timer_get_resolution()` | validate → return cached `resolution_hz` | actual tick rate returned |
| `mcpwm_capture_timer_set_phase_on_sync()` | validate up direction/source → select timer/GPIO/software source → phase LL write → enable sync | capture phase load configured |
| `mcpwm_new_capture_channel()` | allocate → register to timer → priority/GPIO setup → prescale/edge/inversion LL writes → FSM=INIT | capture input created |
| `mcpwm_del_capture_channel()` | require INIT → disable/clear interrupt → destroy/unregister/GPIO reset/free | channel released |
| `mcpwm_capture_channel_enable()` | require INIT → enable installed interrupt → channel LL enable → FSM=ENABLE | edge capture active |
| `mcpwm_capture_channel_disable()` | require ENABLE → channel LL disable → interrupt disable → FSM=INIT | edge capture inactive |
| `mcpwm_capture_channel_register_event_callbacks()` | require INIT on first call → IRAM checks → lazy ISR allocation → event interrupt enable → save callback | capture ISR connected |
| `mcpwm_capture_channel_trigger_soft_catch()` | channel lock → `mcpwm_ll_trigger_soft_capture()` | timestamp latched in software |
| `mcpwm_capture_get_latched_value()` | channel lock → `mcpwm_ll_capture_get_value()` | latest timestamp returned |
| `mcpwm_comparator_new_etm_event()` | allocate ETM event → bind delete callback/LL event ID → enable event | unavailable on ESP32-S3 |
| `mcpwm_timer_new_etm_event()` | allocate ETM event → bind delete callback/LL event ID → enable event | unavailable on ESP32-S3 |

<a id="private-and-internal-symbols-seen-while-tracing"></a>
## Private and Internal Symbols Seen While Tracing

These explain public APIs but must not be treated as application interfaces.

#### Private Component API

- <a id="internal-mcpwm-timer-get-phase"></a>`mcpwm_timer_get_phase()` — declared by `esp_private/mcpwm.h`; reads current count and direction. It is for ESP-IDF components, not ordinary applications.

#### Private Driver Structures

Defined in `src/mcpwm_private.h`:

- Ownership/state: `mcpwm_group_t`, `mcpwm_timer_t`, `mcpwm_oper_t`, `mcpwm_cmpr_t`, `mcpwm_oper_cmpr_t`, `mcpwm_evt_cmpr_t`, `mcpwm_gen_t`.
- Fault/sync: `mcpwm_fault_t`, `mcpwm_gpio_fault_t`, `mcpwm_soft_fault_t`, `mcpwm_sync_t`, `mcpwm_gpio_sync_src_t`, `mcpwm_timer_sync_src_t`, `mcpwm_soft_sync_src_t`.
- Capture: `mcpwm_cap_timer_t`, `mcpwm_cap_channel_t`.
- Internal state enums: `mcpwm_timer_fsm_t`, `mcpwm_cap_timer_fsm_t`, `mcpwm_cap_channel_fsm_t`, `mcpwm_trigger_source_t`, `mcpwm_comparator_type_t`, `mcpwm_fault_type_t`, `mcpwm_sync_src_type_t`, `mcpwm_soft_sync_source_t`.

#### Internal Driver Functions by Source File

The public functions are cataloged above; this list contains their private helpers and ISR entry points.

| Source | Internal symbols |
|---|---|
| `mcpwm_com.c` | <a id="internal-mcpwm-acquire-group-handle"></a>`mcpwm_acquire_group_handle()`, `mcpwm_release_group_handle()`, `mcpwm_check_intr_priority()`, `mcpwm_get_intr_priority_flag()`, `mcpwm_select_periph_clock()`, <a id="internal-mcpwm-set-prescale"></a>`mcpwm_set_prescale()`, `mcpwm_create_retention_module()`, `mcpwm_create_sleep_retention_link_cb()`, `mcpwm_override_default_log_level()` |
| `mcpwm_timer.c` | `mcpwm_timer_register_to_group()`, `mcpwm_timer_unregister_from_group()`, `mcpwm_timer_destroy()`, `mcpwm_timer_default_isr()` |
| `mcpwm_oper.c` | `mcpwm_operator_register_to_group()`, `mcpwm_operator_unregister_from_group()`, `mcpwm_operator_destroy()`, `mcpwm_operator_default_isr()` |
| `mcpwm_cmpr.c` | `mcpwm_comparator_register_to_operator()`, `mcpwm_comparator_unregister_from_operator()`, `mcpwm_comparator_destroy()`, `mcpwm_comparator_default_isr()` |
| `mcpwm_gen.c` | `mcpwm_generator_register_to_operator()`, `mcpwm_generator_unregister_from_operator()`, `mcpwm_generator_destroy()` |
| `mcpwm_sync.c` | `mcpwm_timer_sync_src_register_to_timer()`, `mcpwm_timer_sync_src_unregister_from_timer()`, `mcpwm_timer_sync_src_destroy()`, `mcpwm_del_timer_sync_src()`, `mcpwm_gpio_sync_src_register_to_group()`, `mcpwm_gpio_sync_src_unregister_from_group()`, `mcpwm_gpio_sync_src_destroy()`, `mcpwm_del_gpio_sync_src()`, `mcpwm_del_soft_sync_src()` |
| `mcpwm_fault.c` | `mcpwm_gpio_fault_register_to_group()`, `mcpwm_gpio_fault_unregister_from_group()`, `mcpwm_gpio_fault_destroy()`, `mcpwm_del_gpio_fault()`, `mcpwm_del_soft_fault()`, `mcpwm_gpio_fault_default_isr()` |
| `mcpwm_cap.c` | `mcpwm_cap_timer_register_to_group()`, `mcpwm_cap_timer_unregister_from_group()`, `mcpwm_cap_timer_destroy()`, `mcpwm_capture_channel_register_to_timer()`, `mcpwm_capture_channel_unregister_from_timer()`, `mcpwm_capture_channel_destroy()`, `mcpwm_capture_default_isr()` |
| `mcpwm_etm.c` | `mcpwm_del_comparator_etm_event()`, `mcpwm_del_timer_etm_event()`; file is not built for ESP32-S3 |

#### Meaning and Sequence of Every Private Driver Function

| Function | Meaning | Position in sequence |
|---|---|---|
| `mcpwm_timer_get_phase()` | Atomically read live timer count and direction | private caller → timer lock → two timer-read LL helpers → return values |
| `mcpwm_acquire_group_handle()` | Get/create the shared group and increment its reference count | every group-child registration → first reference enables clocks, resets registers, initializes HAL, clears interrupts |
| `mcpwm_release_group_handle()` | Drop a group reference and destroy on zero | unregister child → last reference disables function clock, deinitializes HAL, disables bus clock, deletes PM/retention resources |
| `mcpwm_check_intr_priority()` | Establish or verify the group-wide interrupt priority | factory after group registration → lock group → accept first/default or reject conflict |
| `mcpwm_get_intr_priority_flag()` | Convert stored priority to ESP interrupt-allocation flags | callback registration → `esp_intr_alloc_intrstatus()` |
| `mcpwm_select_periph_clock()` | Establish/verify shared source clock and create PM lock | timer/capture/carrier creation → enable clock-tree source → LL clock-source selection |
| `mcpwm_set_prescale()` | Search legal group/module divider pair and detect group conflict | timer/capture/carrier configuration → LL group prescale; caller writes module prescale |
| `mcpwm_create_retention_module()` | Allocate sleep register-retention link once | timer/capture factory with `allow_pd`; target-gated and unavailable on ESP32-S3 |
| `mcpwm_create_sleep_retention_link_cb()` | Build register-DMA entries for MCPWM retention | retention framework callback → create group retention entries; unavailable on ESP32-S3 |
| `mcpwm_override_default_log_level()` | Raise MCPWM log level when debug Kconfig is enabled | component constructor at startup → `esp_log_level_set()` |
| `mcpwm_timer_register_to_group()` | Reserve first free timer slot and retain group | `mcpwm_new_timer()` → acquire group → locked slot scan → assign group/timer ID or release on failure |
| `mcpwm_timer_unregister_from_group()` | Clear timer slot and release group | timer destroy → locked table clear → group release |
| `mcpwm_timer_destroy()` | Free interrupt, unregister timer, and free memory | factory rollback or public delete → reverse acquired resources |
| `mcpwm_timer_default_isr()` | Dispatch stop/full/empty timer callbacks | hardware IRQ → read/clear timer status → snapshot count/direction → invoke callbacks → optional ISR yield |
| `mcpwm_operator_register_to_group()` | Reserve first free operator slot | `mcpwm_new_operator()` → acquire group → locked slot scan |
| `mcpwm_operator_unregister_from_group()` | Clear operator slot and release group | operator destroy → locked table clear → group release |
| `mcpwm_operator_destroy()` | Free interrupt, unregister operator, and memory | factory rollback/public delete |
| `mcpwm_operator_default_isr()` | Dispatch CBC and OST brake callbacks | hardware IRQ → read/clear operator status → invoke matching callbacks → optional yield |
| `mcpwm_comparator_register_to_operator()` | Reserve operator or event comparator child slot | comparator factory → locked comparator-table scan → set operator/comparator ID |
| `mcpwm_comparator_unregister_from_operator()` | Clear comparator child slot | comparator destroy → locked table clear |
| `mcpwm_comparator_destroy()` | Free comparator ISR, unregister child, free object | factory rollback/public delete |
| `mcpwm_comparator_default_isr()` | Dispatch compare-reached callback | comparator IRQ → read/clear status → capture direction/compare value → callback/yield |
| `mcpwm_generator_register_to_operator()` | Reserve generator A/B child slot | generator factory → locked generator-table scan → set operator/generator ID |
| `mcpwm_generator_unregister_from_operator()` | Clear generator child slot | generator destroy → locked table clear |
| `mcpwm_generator_destroy()` | Unregister and free generator | factory rollback/public delete |
| `mcpwm_timer_sync_src_register_to_timer()` | Enforce one timer sync-output object | timer-sync factory → attach source to timer or fail INVALID_STATE |
| `mcpwm_timer_sync_src_unregister_from_timer()` | Remove timer's sync-source reference | timer-sync destroy before timer deletion |
| `mcpwm_timer_sync_src_destroy()` | Detach and free timer sync object | factory rollback/type-specific delete |
| `mcpwm_del_timer_sync_src()` | Disable timer sync output then destroy | `mcpwm_del_sync_src()` dynamic dispatch |
| `mcpwm_gpio_sync_src_register_to_group()` | Reserve a group GPIO-sync slot | GPIO-sync factory → acquire group → locked slot scan |
| `mcpwm_gpio_sync_src_unregister_from_group()` | Clear GPIO-sync slot and release group | GPIO-sync destroy |
| `mcpwm_gpio_sync_src_destroy()` | Unregister and free GPIO-sync object | factory rollback or after type-specific delete disconnects the matrix input |
| `mcpwm_del_gpio_sync_src()` | Type-specific GPIO sync deletion wrapper | `mcpwm_del_sync_src()` → destroy |
| `mcpwm_del_soft_sync_src()` | Free software-sync object | `mcpwm_del_sync_src()` dynamic dispatch; caller must first remove dependent timer/capture configuration |
| `mcpwm_gpio_fault_register_to_group()` | Reserve a group fault-detector slot | GPIO-fault factory → acquire group → locked scan |
| `mcpwm_gpio_fault_unregister_from_group()` | Clear fault slot and release group | GPIO-fault destroy |
| `mcpwm_gpio_fault_destroy()` | Free ISR, unregister, and free GPIO-fault object | factory rollback or after type-specific delete disables/detaches hardware input |
| `mcpwm_del_gpio_fault()` | Disable detection/interrupts then destroy GPIO fault | `mcpwm_del_fault()` dynamic dispatch |
| `mcpwm_del_soft_fault()` | Free software-fault object | `mcpwm_del_fault()` dynamic dispatch; caller must stop dependent operator use first |
| `mcpwm_gpio_fault_default_isr()` | Dispatch fault-enter/fault-exit callbacks | fault IRQ → read/clear status → callbacks → optional yield |
| `mcpwm_cap_timer_register_to_group()` | Reserve the group's single capture timer | capture-timer factory → acquire group → locked singleton assignment |
| `mcpwm_cap_timer_unregister_from_group()` | Clear capture timer and release group | capture-timer destroy |
| `mcpwm_cap_timer_destroy()` | Unregister and free capture timer | factory rollback/public delete |
| `mcpwm_capture_channel_register_to_timer()` | Reserve a capture-channel child slot | channel factory → locked channel-table scan |
| `mcpwm_capture_channel_unregister_from_timer()` | Clear capture-channel slot | channel destroy |
| `mcpwm_capture_channel_destroy()` | Free ISR, unregister channel, and free object | factory rollback or after public delete disconnects the GPIO matrix input |
| `mcpwm_capture_default_isr()` | Dispatch captured timestamp/edge callback | capture IRQ → read/clear status → LL timestamp/edge reads → callback/yield |
| `mcpwm_del_comparator_etm_event()` | Disable comparator ETM event and free wrapper | `esp_etm_del_event()` callback; unavailable on ESP32-S3 |
| `mcpwm_del_timer_etm_event()` | Disable timer ETM event and free wrapper | `esp_etm_del_event()` callback; unavailable on ESP32-S3 |

#### HAL API and Structures

`esp_hal_mcpwm/include/hal/mcpwm_hal.h` defines `mcpwm_hal_context_t` and `mcpwm_hal_init_config_t`, plus five target-neutral operations:

- <a id="internal-mcpwm-hal-init"></a>`mcpwm_hal_init()`, `mcpwm_hal_deinit()`
- <a id="internal-mcpwm-hal-timer-reset"></a>`mcpwm_hal_timer_reset()`, `mcpwm_hal_operator_reset()`, `mcpwm_hal_generator_reset()`

| HAL function | Meaning | Direct sequence |
|---|---|---|
| `mcpwm_hal_init()` | Bind HAL context to group device and establish shadow mode | first group acquisition → LL shadow enable → LL global shadow flush |
| `mcpwm_hal_deinit()` | Clear HAL device reference | last group release → HAL context invalidated before bus clock off |
| `mcpwm_hal_timer_reset()` | Put one timer in stopped, unsynchronized, immediate-update state | timer factory → clear sync input/output → pause counter → immediate period update |
| `mcpwm_hal_operator_reset()` | Reset compare/action/dead-time/brake update behavior | operator factory → stop shadow updates → immediate compare/action/dead-time update → disable soft brakes |
| `mcpwm_hal_generator_reset()` | Remove continuous/non-continuous force and reset event actions | generator factory → force-disable LL calls → generator action reset |

#### ESP32-S3 LL Function Inventory

All 104 functions below are `static inline` register helpers from `esp_hal_mcpwm/esp32s3/include/hal/mcpwm_ll.h`.

| Area | LL functions |
|---|---|
| Group/RCC/shadow | `mcpwm_ll_enable_bus_clock()`, `mcpwm_ll_reset_register()`, `mcpwm_ll_group_enable_clock()`, `mcpwm_ll_group_set_clock_source()`, `mcpwm_ll_group_set_clock_prescale()`, `mcpwm_ll_group_enable_shadow_mode()`, `mcpwm_ll_group_flush_shadow()` |
| Interrupts | `mcpwm_ll_intr_enable()`, `mcpwm_ll_intr_get_status()`, `mcpwm_ll_intr_get_status_reg()`, `mcpwm_ll_intr_clear_status()` |
| Timer counting/period | <a id="internal-mcpwm-ll-timer-set-peak"></a>`mcpwm_ll_timer_set_peak()`, `mcpwm_ll_timer_set_clock_prescale()`, `mcpwm_ll_timer_set_count_mode()`, `mcpwm_ll_timer_set_start_stop_command()`, `mcpwm_ll_timer_get_count_value()`, `mcpwm_ll_timer_get_count_direction()`, `mcpwm_ll_timer_enable_update_period_on_sync()`, `mcpwm_ll_timer_enable_update_period_on_tez()`, `mcpwm_ll_timer_update_period_at_once()` |
| Timer synchronization | `mcpwm_ll_timer_set_sync_phase_direction()`, `mcpwm_ll_timer_set_sync_phase_value()`, `mcpwm_ll_timer_enable_sync_input()`, `mcpwm_ll_timer_clear_sync_input()`, `mcpwm_ll_timer_set_timer_sync_input()`, `mcpwm_ll_timer_set_gpio_sync_input()`, `mcpwm_ll_timer_trigger_soft_sync()`, `mcpwm_ll_timer_sync_out_on_timer_event()`, `mcpwm_ll_timer_propagate_input_sync()`, `mcpwm_ll_timer_disable_sync_out()`, `mcpwm_ll_invert_gpio_sync_input()` |
| Operator connection/update | `mcpwm_ll_operator_connect_timer()`, `mcpwm_ll_operator_set_compare_value()`, `mcpwm_ll_operator_enable_update_compare_on_tez()`, `mcpwm_ll_operator_enable_update_compare_on_tep()`, `mcpwm_ll_operator_enable_update_compare_on_sync()`, `mcpwm_ll_operator_stop_update_compare()`, `mcpwm_ll_operator_update_compare_at_once()`, `mcpwm_ll_operator_enable_update_action_on_tez()`, `mcpwm_ll_operator_enable_update_action_on_tep()`, `mcpwm_ll_operator_enable_update_action_on_sync()`, `mcpwm_ll_operator_stop_update_action()`, `mcpwm_ll_operator_update_action_at_once()`, `mcpwm_ll_operator_flush_shadow()` |
| Operator trigger routing | `mcpwm_ll_operator_set_trigger_from_gpio_fault()`, `mcpwm_ll_operator_set_trigger_from_sync()` |
| Generator actions/force | `mcpwm_ll_generator_reset_actions()`, `mcpwm_ll_generator_set_action_on_timer_event()`, `mcpwm_ll_generator_set_action_on_compare_event()`, `mcpwm_ll_generator_set_action_on_brake_event()`, `mcpwm_ll_generator_set_action_on_trigger_event()`, `mcpwm_ll_gen_set_continue_force_level()`, `mcpwm_ll_gen_disable_continue_force_action()`, `mcpwm_ll_gen_set_noncontinue_force_level()`, `mcpwm_ll_gen_trigger_noncontinue_force_action()`, `mcpwm_ll_gen_disable_noncontinue_force_action()` |
| Dead time | `mcpwm_ll_operator_set_deadtime_clock_src()`, `mcpwm_ll_deadtime_set_rising_delay()`, `mcpwm_ll_deadtime_set_falling_delay()`, `mcpwm_ll_deadtime_red_select_generator()`, `mcpwm_ll_deadtime_fed_select_generator()`, `mcpwm_ll_deadtime_bypass_path()`, `mcpwm_ll_deadtime_invert_outpath()`, `mcpwm_ll_deadtime_swap_out_path()`, `mcpwm_ll_deadtime_get_switch_topology()`, `mcpwm_ll_deadtime_enable_deb()`, `mcpwm_ll_deadtime_enable_update_delay_on_tez()`, `mcpwm_ll_deadtime_enable_update_delay_on_tep()`, `mcpwm_ll_deadtime_enable_update_delay_on_sync()`, `mcpwm_ll_deadtime_stop_update_delay()`, `mcpwm_ll_deadtime_update_delay_at_once()` |
| Carrier | `mcpwm_ll_carrier_set_prescale()`, `mcpwm_ll_carrier_set_duty()`, `mcpwm_ll_carrier_set_first_pulse_width()`, `mcpwm_ll_carrier_in_invert()`, `mcpwm_ll_carrier_out_invert()`, `mcpwm_ll_carrier_enable()` |
| Fault/brake | `mcpwm_ll_fault_set_active_level()`, `mcpwm_ll_fault_enable_detection()`, `mcpwm_ll_fault_enable_cbc_refresh_on_tep()`, `mcpwm_ll_brake_enable_cbc_refresh_on_tez()`, `mcpwm_ll_brake_enable_cbc_mode()`, `mcpwm_ll_brake_enable_oneshot_mode()`, `mcpwm_ll_brake_enable_soft_cbc()`, `mcpwm_ll_brake_enable_soft_ost()`, `mcpwm_ll_brake_trigger_soft_cbc()`, `mcpwm_ll_brake_trigger_soft_ost()`, `mcpwm_ll_brake_clear_ost()`, `mcpwm_ll_cbc_brake_active()`, `mcpwm_ll_ost_brake_active()` |
| Capture | `mcpwm_ll_capture_enable_timer()`, `mcpwm_ll_capture_enable_channel()`, `mcpwm_ll_capture_enable_posedge()`, `mcpwm_ll_capture_enable_negedge()`, `mcpwm_ll_capture_set_prescale()`, `mcpwm_ll_capture_get_value()`, `mcpwm_ll_capture_get_edge()`, `mcpwm_ll_trigger_soft_capture()`, `mcpwm_ll_capture_enable_timer_sync()`, `mcpwm_ll_capture_set_timer_sync()`, `mcpwm_ll_capture_set_gpio_sync()`, `mcpwm_ll_capture_set_sync_phase_value()`, `mcpwm_ll_capture_trigger_sw_sync()` |
| GPIO input inversion | `mcpwm_ll_invert_input()` |

#### Meaning and Sequence of Every ESP32-S3 LL Function

<a id="ll-group-clock-shadow-interrupt"></a>
##### Group, Clock, Shadow, and Interrupt LL

| LL function | Register-level meaning | Called in sequence by |
|---|---|---|
| `mcpwm_ll_enable_bus_clock()` | Gate/ungate APB register-access clock for group | first `mcpwm_acquire_group_handle()` / last `mcpwm_release_group_handle()` |
| `mcpwm_ll_reset_register()` | Pulse peripheral reset for selected group | first group acquisition, after bus clock on |
| `mcpwm_ll_group_enable_clock()` | Gate/ungate MCPWM functional/core clock | group acquisition/release |
| `mcpwm_ll_group_set_clock_source()` | Select group functional clock mux | `mcpwm_select_periph_clock()` |
| `mcpwm_ll_group_set_clock_prescale()` | Program shared group divider | `mcpwm_set_prescale()` |
| `mcpwm_ll_group_enable_shadow_mode()` | Enable shadow-to-active register mechanism | `mcpwm_hal_init()` |
| `mcpwm_ll_group_flush_shadow()` | Force all shadow values into active registers | `mcpwm_hal_init()`, immediately after shadow enable |
| `mcpwm_ll_intr_enable()` | Set/clear selected MCPWM interrupt enable bits | group init, callback registration, deletion |
| `mcpwm_ll_intr_get_status()` | Read raw MCPWM interrupt status | every default ISR entry |
| `mcpwm_ll_intr_get_status_reg()` | Return status-register address for interrupt allocator filtering | lazy ISR installation |
| `mcpwm_ll_intr_clear_status()` | Write-one-to-clear selected pending events | group init, ISR, deletion |

<a id="ll-timer-sync"></a>
##### Timer and Timer-Synchronization LL

| LL function | Register-level meaning | Called in sequence by |
|---|---|---|
| `mcpwm_ll_timer_set_peak()` | Write timer period/peak and symmetric-mode encoding | timer create, period update |
| `mcpwm_ll_timer_set_clock_prescale()` | Set one timer's divider after shared group divider | `mcpwm_new_timer()` after prescale negotiation |
| `mcpwm_ll_timer_set_count_mode()` | Select pause/up/down/up-down counter mode | HAL reset, timer create |
| `mcpwm_ll_timer_set_start_stop_command()` | Command counter start/stop at immediate/TEZ/TEP boundary | `mcpwm_timer_start_stop()` |
| `mcpwm_ll_timer_get_count_value()` | Read live timer counter | timer phase API and timer ISR snapshot |
| `mcpwm_ll_timer_get_count_direction()` | Read live up/down direction | timer/comparator ISR and phase API |
| `mcpwm_ll_timer_enable_update_period_on_sync()` | Include sync event in period shadow-transfer mask | timer create |
| `mcpwm_ll_timer_enable_update_period_on_tez()` | Include timer-empty event in period shadow transfer | timer create |
| `mcpwm_ll_timer_update_period_at_once()` | Select immediate period transfer | HAL timer reset |
| `mcpwm_ll_timer_set_sync_phase_direction()` | Store direction loaded at synchronization | timer phase configuration |
| `mcpwm_ll_timer_set_sync_phase_value()` | Store counter value loaded at synchronization | timer phase configuration |
| `mcpwm_ll_timer_enable_sync_input()` | Enable/disable timer phase load from selected sync | HAL reset and phase configuration |
| `mcpwm_ll_timer_clear_sync_input()` | Clear timer sync-input selector | HAL timer reset |
| `mcpwm_ll_timer_set_timer_sync_input()` | Select another timer's sync output | timer phase configuration with timer source |
| `mcpwm_ll_timer_set_gpio_sync_input()` | Select group GPIO sync input | timer phase configuration with GPIO source |
| `mcpwm_ll_timer_trigger_soft_sync()` | Pulse timer software-sync bit | `mcpwm_soft_sync_activate()` |
| `mcpwm_ll_timer_sync_out_on_timer_event()` | Choose TEZ/TEP event that produces sync output | timer-sync source creation |
| `mcpwm_ll_timer_propagate_input_sync()` | Route timer input sync through its sync output | timer-sync source creation flag |
| `mcpwm_ll_timer_disable_sync_out()` | Disable a timer's sync-output generation | HAL reset and timer-sync deletion |
| `mcpwm_ll_invert_gpio_sync_input()` | Configure active edge/polarity for group GPIO sync | GPIO-sync source creation |

<a id="ll-operator-trigger"></a>
##### Operator Update and Trigger-Routing LL

| LL function | Register-level meaning | Called in sequence by |
|---|---|---|
| `mcpwm_ll_operator_connect_timer()` | Select which group timer feeds an operator | `mcpwm_operator_connect_timer()` |
| `mcpwm_ll_operator_set_compare_value()` | Write operator comparator threshold | comparator value setter |
| `mcpwm_ll_operator_enable_update_compare_on_tez()` | Allow compare shadow transfer at timer empty | comparator creation |
| `mcpwm_ll_operator_enable_update_compare_on_tep()` | Allow compare shadow transfer at timer peak | comparator creation |
| `mcpwm_ll_operator_enable_update_compare_on_sync()` | Allow compare shadow transfer on sync | comparator creation |
| `mcpwm_ll_operator_stop_update_compare()` | Disable normal compare shadow triggers | HAL operator reset |
| `mcpwm_ll_operator_update_compare_at_once()` | Force immediate compare shadow transfer | HAL operator reset |
| `mcpwm_ll_operator_enable_update_action_on_tez()` | Allow generator-action shadow transfer at empty | operator creation |
| `mcpwm_ll_operator_enable_update_action_on_tep()` | Allow generator-action shadow transfer at peak | operator creation |
| `mcpwm_ll_operator_enable_update_action_on_sync()` | Allow generator-action shadow transfer on sync | operator creation |
| `mcpwm_ll_operator_stop_update_action()` | Disable normal action-table shadow triggers | HAL operator reset |
| `mcpwm_ll_operator_update_action_at_once()` | Force immediate action-table shadow transfer | HAL operator reset |
| `mcpwm_ll_operator_flush_shadow()` | Force this operator's compare/action/dead-time shadows active | internal utility; not called by ESP32-S3 v6.0.1 driver path |
| `mcpwm_ll_operator_set_trigger_from_gpio_fault()` | Route GPIO fault into one operator trigger slot | generator fault-action setup |
| `mcpwm_ll_operator_set_trigger_from_sync()` | Route sync source into one operator trigger slot | generator sync-action setup |

<a id="ll-generator-force"></a>
##### Generator Action and Force LL

| LL function | Register-level meaning | Called in sequence by |
|---|---|---|
| `mcpwm_ll_generator_reset_actions()` | Clear/reset one generator's event-action table | `mcpwm_hal_generator_reset()` during generator creation |
| `mcpwm_ll_generator_set_action_on_timer_event()` | Encode direction + TEZ/TEP generator action | timer-event public action setter |
| `mcpwm_ll_generator_set_action_on_compare_event()` | Encode direction + comparator generator action | compare-event public action setter |
| `mcpwm_ll_generator_set_action_on_brake_event()` | Encode direction + CBC/OST generator action | brake-event public action setter |
| `mcpwm_ll_generator_set_action_on_trigger_event()` | Encode direction + operator trigger action | fault/sync public action setters after trigger routing |
| `mcpwm_ll_gen_set_continue_force_level()` | Select held software-force level | force API with `hold_on=true` and level 0/1 |
| `mcpwm_ll_gen_disable_continue_force_action()` | Release held software force | HAL generator reset or force API level `-1` |
| `mcpwm_ll_gen_set_noncontinue_force_level()` | Select one-shot/non-held force level | force API with `hold_on=false` |
| `mcpwm_ll_gen_trigger_noncontinue_force_action()` | Pulse application of non-held force | immediately after setting its level |
| `mcpwm_ll_gen_disable_noncontinue_force_action()` | Clear non-held force trigger | HAL reset or force release |

<a id="ll-deadtime"></a>
##### Dead-Time LL

| LL function | Register-level meaning | Called in sequence by |
|---|---|---|
| `mcpwm_ll_operator_set_deadtime_clock_src()` | Select operator timer clock as dead-time tick source | operator-to-timer connection |
| `mcpwm_ll_deadtime_set_rising_delay()` | Write positive/rising-edge delay ticks | dead-time setter |
| `mcpwm_ll_deadtime_set_falling_delay()` | Write negative/falling-edge delay ticks | dead-time setter |
| `mcpwm_ll_deadtime_red_select_generator()` | Select generator feeding rising-edge-delay (RED) cell | dead-time setter after ownership validation |
| `mcpwm_ll_deadtime_fed_select_generator()` | Select generator feeding falling-edge-delay (FED) cell | dead-time setter after ownership validation |
| `mcpwm_ll_deadtime_bypass_path()` | Bypass or engage RED/FED path for output | dead-time setter |
| `mcpwm_ll_deadtime_invert_outpath()` | Apply inversion after selected delay path | dead-time setter |
| `mcpwm_ll_deadtime_swap_out_path()` | Swap operator A/B post-dead-time outputs | dead-time setter routing stage |
| `mcpwm_ll_deadtime_get_switch_topology()` | Read current bypass/swap topology | dead-time setter before modifying one route |
| `mcpwm_ll_deadtime_enable_deb()` | Enable internal dead-time edge buffer/filter control | dead-time setter when delay is active |
| `mcpwm_ll_deadtime_enable_update_delay_on_tez()` | Transfer delay shadows at timer empty | operator creation flag |
| `mcpwm_ll_deadtime_enable_update_delay_on_tep()` | Transfer delay shadows at timer peak | operator creation flag |
| `mcpwm_ll_deadtime_enable_update_delay_on_sync()` | Transfer delay shadows on synchronization | operator creation flag |
| `mcpwm_ll_deadtime_stop_update_delay()` | Disable normal dead-time shadow triggers | HAL operator reset |
| `mcpwm_ll_deadtime_update_delay_at_once()` | Force dead-time shadow values active | HAL operator reset |

<a id="ll-carrier"></a>
##### Carrier LL

| LL function | Register-level meaning | Called in sequence by |
|---|---|---|
| `mcpwm_ll_carrier_set_prescale()` | Program high-frequency carrier divider | carrier API after prescale calculation |
| `mcpwm_ll_carrier_set_duty()` | Program carrier high-time/period ratio encoding | carrier API |
| `mcpwm_ll_carrier_set_first_pulse_width()` | Program first carrier pulse duration | carrier API |
| `mcpwm_ll_carrier_in_invert()` | Invert raw PWM before modulation | carrier API flag |
| `mcpwm_ll_carrier_out_invert()` | Invert waveform after modulation | carrier API flag |
| `mcpwm_ll_carrier_enable()` | Enable carrier when real frequency is nonzero | final carrier API step |

<a id="ll-fault-brake"></a>
##### Fault and Brake LL

| LL function | Register-level meaning | Called in sequence by |
|---|---|---|
| `mcpwm_ll_fault_set_active_level()` | Select high/low level that asserts GPIO fault | GPIO-fault creation |
| `mcpwm_ll_fault_enable_detection()` | Enable/disable one hardware fault detector | GPIO-fault create/delete |
| `mcpwm_ll_fault_enable_cbc_refresh_on_tep()` | Permit CBC recovery/refresh at timer peak | operator brake configuration and HAL reset |
| `mcpwm_ll_brake_enable_cbc_refresh_on_tez()` | Permit CBC recovery/refresh at timer empty | operator brake configuration and HAL reset |
| `mcpwm_ll_brake_enable_cbc_mode()` | Bind hardware fault trigger to CBC braking | operator brake configuration for GPIO fault |
| `mcpwm_ll_brake_enable_oneshot_mode()` | Bind hardware fault trigger to latched OST braking | operator brake configuration for GPIO fault |
| `mcpwm_ll_brake_enable_soft_cbc()` | Enable software CBC trigger for operator | soft-fault brake configuration/HAL reset |
| `mcpwm_ll_brake_enable_soft_ost()` | Enable software OST trigger for operator | soft-fault brake configuration/HAL reset |
| `mcpwm_ll_brake_trigger_soft_cbc()` | Pulse software CBC fault bit | soft-fault activation in CBC mode |
| `mcpwm_ll_brake_trigger_soft_ost()` | Pulse software OST fault bit | soft-fault activation in OST mode |
| `mcpwm_ll_brake_clear_ost()` | Clear latched one-shot brake | operator recovery after inactive fault verified |
| `mcpwm_ll_cbc_brake_active()` | Read whether CBC brake remains active | recovery-state check |
| `mcpwm_ll_ost_brake_active()` | Read whether OST brake/fault remains active | recovery-state check |

<a id="ll-capture"></a>
##### Capture and GPIO-Input LL

| LL function | Register-level meaning | Called in sequence by |
|---|---|---|
| `mcpwm_ll_capture_enable_timer()` | Start/stop the capture time-base counter | capture timer start/stop |
| `mcpwm_ll_capture_enable_channel()` | Enable/disable edge latching for one channel | channel enable/disable |
| `mcpwm_ll_capture_enable_posedge()` | Enable rising-edge capture | capture channel creation flag |
| `mcpwm_ll_capture_enable_negedge()` | Enable falling-edge capture | capture channel creation flag |
| `mcpwm_ll_capture_set_prescale()` | Divide incoming edge stream before capture | capture channel creation |
| `mcpwm_ll_capture_get_value()` | Read channel latched timestamp register | capture ISR and polling API |
| `mcpwm_ll_capture_get_edge()` | Read which edge produced latest capture | capture ISR event data |
| `mcpwm_ll_trigger_soft_capture()` | Pulse software capture for a channel | soft-catch public API |
| `mcpwm_ll_capture_enable_timer_sync()` | Enable/disable capture phase load | capture sync-phase API |
| `mcpwm_ll_capture_set_timer_sync()` | Select timer sync output for capture timer | capture sync-phase API with timer source |
| `mcpwm_ll_capture_set_gpio_sync()` | Select group GPIO sync for capture timer | capture sync-phase API with GPIO source |
| `mcpwm_ll_capture_set_sync_phase_value()` | Write capture counter value loaded on sync | capture sync-phase API |
| `mcpwm_ll_capture_trigger_sw_sync()` | Pulse capture-timer software synchronization | software-sync activation bound to capture timer |
| `mcpwm_ll_invert_input()` | Configure GPIO-matrix inversion for MCPWM input signal | capture channel creation with invert flag |

Do not call these to bypass the public driver's resource tables, locks, state machines, clock management, or cleanup.

#### Application and Debugging Navigation

- [Complete servo, BDC, BLDC, and SVPWM construction sequences](13_complete_application_sequences.md)
- [Error decoding and waveform-debugging checklist](14_debugging_and_common_failures.md)

#### Inventory Totals

- 56 public function declarations: 53 implemented for ESP32-S3 and 3 target-gated/unavailable (`mcpwm_new_event_comparator()` plus two ETM factories).
- 34 public structures, including 3 tied to unavailable event-comparator/ETM features.
- 8 opaque MCPWM handles, 5 callback types, 12 enum/clock types, and 5 action initializer macros.
- 105 unique driver-source function definitions in total: the public set plus 1 private component API and 48 private/static helpers or ISR entry points.
- 23 private driver structures/state enums, 5 HAL functions, and all 104 ESP32-S3 LL register helpers.

Sources: pristine ESP-IDF tag `v6.0.1`, `components/esp_driver_mcpwm/include/driver/`, `components/esp_hal_mcpwm/include/hal/mcpwm_types.h`, component `CMakeLists.txt`, and ESP32-S3 `soc_caps.h`.

---

### Summary Section (Summary of Notes)

- Use `driver/mcpwm_prelude.h` and public handles/configuration structures in application code.
- Follow parent ownership and lifecycle rules; do not bypass them with private/HAL/LL calls.
- Check SoC capability macros: a common header declaration does not guarantee an ESP32-S3 implementation.
- Use the catalog anchors from the other fourteen notes to move between API definitions and practical flows.
