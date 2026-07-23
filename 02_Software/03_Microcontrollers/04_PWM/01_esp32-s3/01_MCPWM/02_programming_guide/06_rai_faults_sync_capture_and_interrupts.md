# Cornell Notes

## Topic: RAI - Faults, Synchronization, Capture, and Interrupt Priority

## Date: 23/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- Which resources belong directly to an MCPWM group?
- How are GPIO, software, and timer synchronization sources different?
- When is interrupt priority selected and shared?

---

### Notes Section (Main Notes)

`mcpwm_new_gpio_fault()` and `mcpwm_new_soft_fault()` create group-level fault sources. A GPIO fault configuration selects group, GPIO, active level, pull mode, and optional input inversion; GPIO matrix setup is external to the MCPWM register block. A software fault has no hardware slot and is activated with `mcpwm_soft_fault_activate()`. Faults affect an operator only after brake mode and generator brake actions are configured.

Synchronization sources are also group-scoped. `mcpwm_new_gpio_sync_src()` consumes an external sync input; `mcpwm_new_timer_sync_src()` exports a timer event; `mcpwm_new_soft_sync_src()` creates a software-triggered source. A sync source and destination timer/capture timer must belong to the same group. Delete a source only after all destinations stop referring to it.

Each group has one capture timer. `mcpwm_new_capture_timer()` claims it; `mcpwm_new_capture_channel()` then claims one of three channel slots and configures GPIO, edge selection, prescale, inversion, pull, and loopback. The capture channel depends on the capture timer and must be deleted first.

Interrupt priority is chosen lazily when the first callback-requiring object allocates the shared group interrupt. Priority `0` asks ESP-IDF for a default; explicit priorities must agree across objects sharing that interrupt. Register callbacks before enabling the resource. ISR callbacks must not block, must use ISR-safe APIs, and should return whether a higher-priority task was woken.

| Resource | Parent | Exhaustion result | Cleanup rule |
|---|---|---|---|
| GPIO fault / sync source | group | `ESP_ERR_NOT_FOUND` | detach users, then delete |
| capture timer | group | `ESP_ERR_NOT_FOUND` | delete channels first |
| capture channel | capture timer/group | `ESP_ERR_NOT_FOUND` | disable before delete |
| interrupt | group | allocation error | freed when final user is removed |

See [faults and brake actions](../03_use_cases/09_faults_and_brake_actions.md), [synchronization](../03_use_cases/08_synchronization_and_phase_control.md), [capture](../03_use_cases/10_capture_timer_and_channels.md), and TRM Chapter 36.2/36.3.3/36.3.4, PDF pp. 1327–1368.

#### API Reference

##### Header Files

```c
#include "driver/mcpwm_fault.h"
#include "driver/mcpwm_sync.h"
#include "driver/mcpwm_cap.h"
```

##### Resource Creation Functions

```c
esp_err_t mcpwm_new_gpio_fault(const mcpwm_gpio_fault_config_t *config,
                               mcpwm_fault_handle_t *ret_fault);
esp_err_t mcpwm_new_soft_fault(const mcpwm_soft_fault_config_t *config,
                               mcpwm_fault_handle_t *ret_fault);
esp_err_t mcpwm_new_gpio_sync_src(const mcpwm_gpio_sync_src_config_t *config,
                                  mcpwm_sync_handle_t *ret_sync);
esp_err_t mcpwm_new_timer_sync_src(mcpwm_timer_handle_t timer,
                                   const mcpwm_timer_sync_src_config_t *config,
                                   mcpwm_sync_handle_t *ret_sync);
esp_err_t mcpwm_new_soft_sync_src(const mcpwm_soft_sync_config_t *config,
                                  mcpwm_sync_handle_t *ret_sync);
esp_err_t mcpwm_new_capture_timer(const mcpwm_capture_timer_config_t *config,
                                  mcpwm_cap_timer_handle_t *ret_cap_timer);
esp_err_t mcpwm_new_capture_channel(mcpwm_cap_timer_handle_t cap_timer,
                                    const mcpwm_capture_channel_config_t *config,
                                    mcpwm_cap_channel_handle_t *ret_cap_channel);
```

All creation functions validate pointers, group IDs, GPIOs, and target limits before allocating. Group-slot exhaustion returns `ESP_ERR_NOT_FOUND`; heap failure returns `ESP_ERR_NO_MEM`. GPIO setup or interrupt allocation failures trigger reverse-order rollback. Corresponding cleanup calls are `mcpwm_del_fault()`, `mcpwm_del_sync_src()`, `mcpwm_del_capture_channel()`, and `mcpwm_del_capture_timer()`.

##### Function details

###### `mcpwm_new_gpio_fault()`

**Parameters:** `config` **[in]** — group, interrupt priority, GPIO, and active level; `ret_fault` **[out]** — returned fault handle.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_ERR_NO_MEM`; `ESP_ERR_NOT_FOUND` when three group GPIO fault inputs are occupied; `ESP_FAIL` for GPIO/initialization failure.

**Uses internally:** allocate → `mcpwm_gpio_fault_register_to_group()` → group/priority checks → GPIO input and matrix connection (**External**) → LL input inversion/enable → save fault ID. Rollback uses `mcpwm_gpio_fault_destroy()`.

###### `mcpwm_new_soft_fault()`

**Parameters:** `config` **[in]** — non-NULL empty `mcpwm_soft_fault_config_t`; `ret_fault` **[out]** — returned software-fault handle.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_ERR_NO_MEM`; `ESP_FAIL` for another error.

**Uses internally:** allocates and initializes a software-only `mcpwm_soft_fault_t`. It claims no GPIO fault slot and writes no register until bound to brake logic and activated.

###### `mcpwm_del_fault()`

```c
esp_err_t mcpwm_del_fault(mcpwm_fault_handle_t fault);
```

**Parameters:** `fault` **[in]** — GPIO or software fault handle.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_FAIL` for type-specific cleanup failure.

**Uses internally:** dynamic dispatch through the private fault object's delete callback. GPIO deletion disables detection, resets GPIO routing, calls `mcpwm_gpio_fault_unregister_from_group()`, releases the group, and frees memory; software deletion only frees its object.

###### `mcpwm_new_gpio_sync_src()`

**Parameters:** `config` **[in]** — group, GPIO, active edge; `ret_sync` **[out]** — returned sync handle.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_ERR_NO_MEM`; `ESP_ERR_NOT_FOUND` when external sync slots are full; `ESP_FAIL` for GPIO/configuration failure.

**Uses internally:** allocate → `mcpwm_gpio_sync_src_register_to_group()` → GPIO matrix input (**External**) → LL external-sync inversion → retain group/trigger ID. Rollback reverses registration and GPIO setup.

###### `mcpwm_new_timer_sync_src()`

**Parameters:** `timer` **[in]** — source timer; `config` **[in]** — TEZ/TEP event and propagation flag; `ret_sync` **[out]** — returned sync handle.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_ERR_NO_MEM`; `ESP_ERR_INVALID_STATE` if that timer already owns a sync-output object; `ESP_FAIL` otherwise.

**Uses internally:** allocate → `mcpwm_timer_sync_src_register_to_timer()` → LL selects timer sync-out event or propagated input. The timer stores the child pointer, so delete the source before the timer.

###### `mcpwm_new_soft_sync_src()`

**Parameters:** `config` **[in]** — non-NULL empty configuration; `ret_sync` **[out]** — returned handle.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_ERR_NO_MEM`; `ESP_FAIL` otherwise.

**Uses internally:** allocates an unbound software-sync object. `mcpwm_timer_set_phase_on_sync()` or capture phase configuration later binds its activation path to a consumer.

###### `mcpwm_del_sync_src()`

```c
esp_err_t mcpwm_del_sync_src(mcpwm_sync_handle_t sync);
```

**Parameters:** `sync` **[in]** — timer, GPIO, or software sync source.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_FAIL` on type-specific cleanup failure.

**Uses internally:** private type-specific delete callback → timer detach/LL sync-out disable, or GPIO unregister/reset/group release, or software-object free.

###### `mcpwm_new_capture_timer()`

**Parameters:** `config` **[in]** — group, clock source, interrupt priority, optional retention flag; `ret_cap_timer` **[out]** — returned handle.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_ERR_NO_MEM`; `ESP_ERR_NOT_FOUND` when the group singleton is occupied; `ESP_ERR_NOT_SUPPORTED` for `allow_pd` on ESP32-S3; `ESP_FAIL` otherwise.

**Uses internally:** allocate → `mcpwm_cap_timer_register_to_group()` → `mcpwm_select_periph_clock()` → `mcpwm_set_prescale()` → LL capture clock/prescale/reset → optional PM lock → FSM `INIT`. Rollback uses `mcpwm_cap_timer_destroy()`.

###### `mcpwm_new_capture_channel()`

**Parameters:** `cap_timer` **[in]** — parent capture timer; `config` **[in]** — GPIO, priority, prescale, positive/negative edges, inversion; `ret_cap_channel` **[out]** — returned channel.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_ERR_NO_MEM`; `ESP_ERR_NOT_FOUND` when three channel slots are occupied; `ESP_FAIL` for GPIO/initialization failure.

**Uses internally:** allocate → `mcpwm_capture_channel_register_to_timer()` → priority check → GPIO matrix input (**External**) → LL prescale/edge/inversion setup → FSM `INIT`. Rollback calls `mcpwm_capture_channel_destroy()`.

###### Capture deletion functions

```c
esp_err_t mcpwm_del_capture_channel(mcpwm_cap_channel_handle_t cap_channel);
esp_err_t mcpwm_del_capture_timer(mcpwm_cap_timer_handle_t cap_timer);
```

**Parameters:** the channel or timer handle to delete.

**Returns:** `ESP_OK`; `ESP_ERR_INVALID_ARG`; `ESP_ERR_INVALID_STATE` unless the resource is in `INIT` (and the timer has no channels); `ESP_FAIL` for cleanup failure.

**Uses internally:** channel deletion disables/clears its interrupt, resets GPIO, unregisters and frees. Timer deletion calls `mcpwm_cap_timer_destroy()` → unregister singleton → release group/PM resources → free.

##### Structures

```c
typedef struct {
    int group_id;
    int gpio_num;
    int intr_priority;
    struct { uint32_t active_level: 1; } flags;
} mcpwm_gpio_fault_config_t;

typedef struct {
    int group_id;
    int gpio_num;
    struct { uint32_t active_neg: 1; } flags;
} mcpwm_gpio_sync_src_config_t;

typedef struct {
    int group_id;
    mcpwm_capture_clock_source_t clk_src;
    int intr_priority;
    struct { uint32_t allow_pd: 1; } flags;
} mcpwm_capture_timer_config_t;

typedef struct {
    int gpio_num;
    int intr_priority;
    uint32_t prescale;
    struct { uint32_t pos_edge: 1; uint32_t neg_edge: 1;
             uint32_t invert_cap_signal: 1; } flags;
} mcpwm_capture_channel_config_t;
```

##### Detailed information

**GPIO fault:** public factory → private `mcpwm_gpio_fault_register_to_group()` → GPIO input/matrix routing (**External**) → target LL fault input/inversion configuration (**LL**) → MCPWM fault-detection fields (**Register**). The source alone does not brake outputs.

**Sync source:** private registration claims a trigger slot. GPIO sync configures matrix input/inversion; timer sync calls LL to select TEZ/TEP sync-out; soft sync retains a group handle and later toggles the software-sync field.

**Capture:** capture timer creation calls `mcpwm_set_prescale()`, resets the capture HAL state, and owns the group capture clock/PM lock. Channel creation registers one of three channels, configures GPIO, and calls LL for edge mode and prescale. Channels must be deleted before the timer.

**Interrupt priority:** `mcpwm_get_intr_priority_flag()` converts the requested level into ESP-IDF interrupt flags. `mcpwm_check_intr_priority()` prevents incompatible users from sharing the group interrupt. Interrupt allocation is an **External dependency**; LL enables/reads/clears MCPWM event bits.

#### Related Use Cases

- [Faults and Brake Actions](../03_use_cases/09_faults_and_brake_actions.md)
- [Synchronization and Phase Control](../03_use_cases/08_synchronization_and_phase_control.md)
- [Capture Timer and Channels](../03_use_cases/10_capture_timer_and_channels.md)
- [Interrupts, Callbacks, and Runtime Safety](../03_use_cases/11_interrupts_callbacks_and_runtime_safety.md)

### Summary Section (Summary of Notes)

Fault, sync, and capture objects are group-local. Capture channels depend on the single group capture timer. Choose compatible shared interrupt priorities, register callbacks before enable, and keep callbacks ISR-safe.
