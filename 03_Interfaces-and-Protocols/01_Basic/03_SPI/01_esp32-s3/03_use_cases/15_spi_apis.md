# Cornell Notes

## Topic: Complete ESP32-S3 GP-SPI API, Structure, Internal Function, HAL, LL, and Register Inventory

## Date: 20/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- Which symbols are public application interfaces and which are implementation details?
- What does every driver/HAL/LL function do and where does it occur in a sequence?
- Which TRM register or hardware behavior corresponds to each function family?
- What ordering, state, rollback, DMA, ISR, and ownership rules apply?

---

### Notes Section (Main Notes)

This inventory is pinned to ESP-IDF `v6.0.1`, commit `8c19b156084a0753687347cca1f5355782893533`, target ESP32-S3. **Only Public API entries are application interfaces.** Private, HAL, and LL names are explanatory and may change between ESP-IDF releases.

Source set:

- Public: `components/esp_driver_spi/include/driver/spi_{common,master,slave,slave_hd}.h`
- Private/driver: `components/esp_driver_spi/include/esp_private/` and `src/gpspi/`
- HAL/LL: `components/esp_hal_gpspi/` and `esp32s3/include/hal/spi_ll.h`
- Registers: `components/soc/esp32s3/register/soc/spi_{reg,struct}.h`
- Hardware: ESP32-S3 TRM Chapter 30, pages 1106–1184

Stable tagged sources: [public headers](https://github.com/espressif/esp-idf/tree/v6.0.1/components/esp_driver_spi/include/driver), [GP-SPI driver](https://github.com/espressif/esp-idf/tree/v6.0.1/components/esp_driver_spi/src/gpspi), [GP-SPI HAL](https://github.com/espressif/esp-idf/tree/v6.0.1/components/esp_hal_gpspi), and [ESP32-S3 LL](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_hal_gpspi/esp32s3/include/hal/spi_ll.h).

## Layer legend

| Label | Meaning | Application use |
|---|---|---|
| Public API | Installed driver contract in `driver/*.h` | Yes |
| Private driver | allocation, validation, queues, locks, ISR, descriptors | No |
| HAL | role-neutral/role-specific register programming | No |
| LL | ESP32-S3 inline field access | No |
| Register | TRM-visible hardware state | Inspect only while driver owns hardware |
| External | GDMA/GPIO/interrupt/PM/FreeRTOS boundary | Use that subsystem's public API only |

## Public functions

### Common and master lifecycle

Source location: [`spi_common.h`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_driver_spi/include/driver/spi_common.h) and [`spi_master.h`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_driver_spi/include/driver/spi_master.h); implementation in [`spi_common.c`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_driver_spi/src/gpspi/spi_common.c) and [`spi_master.c`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_driver_spi/src/gpspi/spi_master.c).

| Public API | Meaning and required sequence | Internal destination / TRM relationship |
|---|---|---|
| `spi_bus_initialize()` | Claim/configure common host state, GPIO, optional DMA, PM/retention, and lock; call before adding devices. It does not yet install the master ISR. | common allocation and IO/DMA setup; §§30.4–30.5 |
| `spi_bus_free()` | Free a master bus after every device is removed and work is idle. | registered lazy-driver destroy callback → common cleanup |
| `spi_bus_add_device()` | Lazily create the master role/ISR on the first call, then allocate peer configuration, queues, bus-lock device, clock/timing, and CS slot. | `spi_master_init_driver()`, `spi_hal_cal_clock_conf()`, lock registration; §§30.6–30.8 |
| `spi_bus_remove_device()` | Remove an idle, non-acquiring device and free its queues/CS/lock entry. | bus-lock unregister and device cleanup |
| `spi_bus_get_max_transaction_len()` | Return realized bus transfer limit. | common bus context/DMA capability |
| `spi_bus_dma_memory_alloc()` | Allocate memory with host DMA alignment/capability constraints. | `spi_dma_get_alignment_constraints()` and heap capabilities |
| `spi_device_acquire_bus()` | Block until the device exclusively owns the bus. | `spi_bus_lock_acquire_start/end()` |
| `spi_device_release_bus()` | End exclusive ownership; no active polling transaction is allowed. | bus-lock background scheduling resumes |
| `spi_device_get_actual_freq()` | Return the device's realized divider frequency through `freq_khz`; the output unit is **kHz**. | cached clock configuration; §30.7 |

### Master transaction APIs

Source location: [`spi_master.h`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_driver_spi/include/driver/spi_master.h) → [`spi_master.c`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_driver_spi/src/gpspi/spi_master.c).

| Public API | Meaning and required sequence | Internal destination / TRM relationship |
|---|---|---|
| `spi_device_queue_trans()` | Validate, create private/bounce/DMA state, queue, request bus service. | `check_trans_valid()` → `setup_priv_desc()` → ISR |
| `spi_device_get_trans_result()` | Wait for a completed queued descriptor, copy RX bounce data, destroy private state, return original pointer. | return queue → `uninstall_priv_desc()` |
| `spi_device_transmit()` | Synchronous queue + get-result wrapper. | same queued/ISR hardware sequence |
| `spi_device_polling_start()` | Validate, acquire polling ownership, prepare and start hardware without completion ISR scheduling. | `spi_new_trans()` → `spi_hal_user_start()` |
| `spi_device_polling_end()` | Poll completion, run post-processing, release polling ownership, free private state. | `spi_hal_usr_is_done()` → `spi_post_trans()` |
| `spi_device_polling_transmit()` | Synchronous polling start + end wrapper. | CPU wait over the same HAL path |

### Clock/timing helpers

Source location: [`spi_master.h`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_driver_spi/include/driver/spi_master.h) → [`spi_master.c`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_driver_spi/src/gpspi/spi_master.c) → [`spi_hal.c`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_hal_gpspi/spi_hal.c).

| Public API | Meaning | TRM relationship |
|---|---|---|
| `spi_get_actual_clock()` | Deprecated three-argument compatibility helper returning only the nearest legal frequency in Hz; it has no divider-register output argument. Prefer `spi_device_get_actual_freq()`. | `SPI_CLOCK_REG`, §30.7.2 |
| `spi_get_freq_limit()` | Compatibility helper, but **unsupported on ESP32-S3 in v6.0.1**: logs a warning and returns `0`. | intended timing model, §30.8 |
| `spi_get_timing()` | Compatibility helper, but **unsupported on ESP32-S3 in v6.0.1**: logs a warning without producing a target calculation. | intended DIN delay/dummy model, §30.8 |

### Full-duplex slave APIs

Source location: [`spi_slave.h`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_driver_spi/include/driver/spi_slave.h) → [`spi_slave.c`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_driver_spi/src/gpspi/spi_slave.c).

| Public API | Meaning and required sequence | Internal destination / TRM relationship |
|---|---|---|
| `spi_slave_initialize()` | Claim a host exclusively; allocate pins, queues, DMA, HAL, ISR, and armable slave state. | common allocation → `spi_slave_hal_init()`; §§30.5.7/30.5.9 |
| `spi_slave_queue_trans()` | Validate and queue one maximum-capacity slave descriptor; arm if idle. | `spi_slave_setup_priv_trans()` → slave ISR/HAL |
| `spi_slave_get_trans_result()` | Return a completed descriptor with actual `trans_len`; release bounce/private state. | return queue → `spi_slave_uninstall_priv_trans()` |
| `spi_slave_transmit()` | Synchronous queue + get-result wrapper. | normal slave ISR sequence |
| `spi_slave_disable()` | Quiesce the initialized slave before supported clock/power changes. | disable interrupt/clock participation |
| `spi_slave_enable()` | Restore a disabled slave and rearm queued work. | HAL/interrupt enable path |
| `spi_slave_free()` | Directly release an initialized slave host, ISR, DMA, queues, pins, and common context. It does not check queued/active work; the application must quiesce the peer first. | reverse initialization cleanup |

### Half-duplex slave APIs

Source location: [`spi_slave_hd.h`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_driver_spi/include/driver/spi_slave_hd.h) → [`spi_slave_hd.c`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_driver_spi/src/gpspi/spi_slave_hd.c).

| Public API | Meaning and required sequence | Internal destination / TRM relationship |
|---|---|---|
| `spi_slave_hd_init()` | Allocate exclusive HD slot, protocol mode, DMA channels, queues, callbacks, HAL, interrupt, PM state. | `spi_slave_hd_hal_init()`; §30.5.9 |
| `spi_slave_hd_enable()` | Enable an initialized HD slot. | peripheral/interrupt enable |
| `spi_slave_hd_disable()` | Stop HD protocol activity while preserving allocation. | quiesce before power/clock changes |
| `spi_slave_hd_deinit()` | Directly release an initialized HD slot and all owned resources. It does not check queued/active work; the application must quiesce the peer first. | reverse init/retention cleanup |
| `spi_slave_hd_queue_trans()` | Queue one segment-mode data descriptor on TX or RX. | `s_spi_slave_hd_setup_priv_trans()` → channel queue |
| `spi_slave_hd_get_trans_res()` | Return one completed segment-mode descriptor from TX or RX. | `get_ret_queue_result()` |
| `spi_slave_hd_append_trans()` | Append a descriptor to a live append-mode TX/RX GDMA chain. | append ISR/GDMA callback path |
| `spi_slave_hd_get_append_trans_res()` | Return completed append-mode descriptors. | append return queue |
| `spi_slave_hd_write_buffer()` | Directly write the HD shared-register window; `void`, with valid host/pointer/range as caller preconditions and no driver bounds check. | `spi_slave_hd_hal_write_buffer()` |
| `spi_slave_hd_read_buffer()` | Directly read the HD shared-register window; `void`, with valid host/pointer/range as caller preconditions and no driver bounds check. | `spi_slave_hd_hal_read_buffer()` |

## Public structures, enums, callbacks, and handles

| Symbol | Meaning and important fields |
|---|---|
| `spi_host_device_t` | Host selector; ESP32-S3 application GP-SPI hosts are `SPI2_HOST` and `SPI3_HOST`. |
| `spi_dma_chan_t` / `spi_common_dma_t` | On ESP32-S3 the valid selections are `SPI_DMA_DISABLED` and `SPI_DMA_CH_AUTO`. `SPI_DMA_CH1/2` are original-ESP32-only enum members. |
| `spi_clock_source_t` | Target-supported GP-SPI source selector used by device configuration. |
| `spi_sampling_point_t` | Timing result selecting normal or delayed sampling. |
| `SPI_SAMPLING_POINT_PHASE_0` / `SPI_SAMPLING_POINT_PHASE_1` | Target sampling-point enumerators: delayed 50%-cycle phase versus standard master timing. |
| `spi_line_mode_t` | HAL-visible line widths for command, address, and data phases. |
| `spi_command_t` | Slave-HD command-event bitmask type (`SPI_CMD_HD_*`). |
| `spi_bus_config_t` | Bus pins, `max_transfer_sz`, bus flags, interrupt flags/CPU, and data-line idle behavior. |
| `spi_device_interface_config_t` | Mode, clock source/rate, CS pin, command/address/dummy defaults, CS timing, queue size, callbacks, flags. |
| `spi_transaction_t` | TX/RX bit lengths, buffers/inline data, command, address, flags, frequency override, user pointer. |
| `spi_transaction_ext_t` | `spi_transaction_t base` plus variable command/address/dummy bit lengths. |
| `spi_device_t` / `spi_device_handle_t` | Opaque allocated master-device object and handle. |
| `transaction_cb_t` | Master pre/post callback type; executes in ISR context. |
| `spi_slave_interface_config_t` | Normal slave mode, CS, queue size, flags, pre/post callbacks. |
| `spi_slave_transaction_t` | Slave maximum length, actual `trans_len`, TX/RX buffers, user pointer. |
| `slave_transaction_cb_t` | Normal-slave ISR callback type. |
| `spi_slave_chan_t` | Slave-HD channel selector: TX or RX. |
| `spi_slave_hd_data_t` | HD buffer descriptor: data, length, transferred length, user argument. |
| `spi_slave_hd_event_t` / `spi_event_t` | HD callback event identifier and event data. |
| `slave_cb_t` | HD ISR callback returning whether a higher-priority task should wake. |
| `spi_slave_hd_callback_config_t` | Callback table plus shared callback argument. |
| `spi_slave_hd_slot_config_t` | HD mode, command/address rules, DMA mode, queue depths, callbacks, flags. |

## Public flags and function-like macros

Device/framing flags:

`SPI_DEVICE_3WIRE`, `SPI_DEVICE_HALFDUPLEX`, `SPI_DEVICE_POSITIVE_CS`, `SPI_DEVICE_CLK_AS_CS`, `SPI_DEVICE_NO_DUMMY`, `SPI_DEVICE_DDRCLK`, `SPI_DEVICE_TXBIT_LSBFIRST`, `SPI_DEVICE_RXBIT_LSBFIRST`, `SPI_DEVICE_BIT_LSBFIRST`, `SPI_DEVICE_NO_RETURN_RESULT`.

Transaction flags:

`SPI_TRANS_USE_TXDATA`, `SPI_TRANS_USE_RXDATA`, `SPI_TRANS_MODE_DIO`, `SPI_TRANS_MODE_QIO`, `SPI_TRANS_MODE_DIOQIO_ADDR`, `SPI_TRANS_MODE_OCT`, `SPI_TRANS_MULTILINE_CMD`, `SPI_TRANS_MULTILINE_ADDR`, `SPI_TRANS_VARIABLE_CMD`, `SPI_TRANS_VARIABLE_ADDR`, `SPI_TRANS_VARIABLE_DUMMY`, `SPI_TRANS_CS_KEEP_ACTIVE`, `SPI_TRANS_DMA_BUFFER_ALIGN_MANUAL`, `SPI_TRANS_DMA_USE_PSRAM`, `SPI_TRANS_DMA_TX_FAIL`, `SPI_TRANS_DMA_RX_FAIL`.

Slave flags:

`SPI_SLAVE_TXBIT_LSBFIRST`, `SPI_SLAVE_RXBIT_LSBFIRST`, `SPI_SLAVE_BIT_LSBFIRST`, `SPI_SLAVE_NO_RETURN_RESULT`, `SPI_SLAVE_TRANS_DMA_BUFFER_ALIGN_AUTO`, `SPI_SLAVE_HD_TXBIT_LSBFIRST`, `SPI_SLAVE_HD_RXBIT_LSBFIRST`, `SPI_SLAVE_HD_BIT_LSBFIRST`, `SPI_SLAVE_HD_TRANS_DMA_BUFFER_ALIGN_AUTO`, `SPI_SLAVE_HD_APPEND_MODE`.

No-return-result contract: `SPI_DEVICE_NO_RETURN_RESULT` requires a master `post_cb`, and `SPI_SLAVE_NO_RETURN_RESULT` requires a slave `post_trans_cb`. The driver omits the return queue; calling the corresponding `*_get_trans_result()` returns `ESP_ERR_NOT_SUPPORTED`. In v6.0.1, the normal result API is also where automatically allocated DMA bounce buffers are copied back/freed. A no-return configuration should therefore use already-compliant DMA buffers and avoid auto-alignment allocation; completion and application buffer ownership must be handled through the ISR callback protocol.

Slave-HD event and command constants:

`SPI_EV_BUF_TX`, `SPI_EV_BUF_RX`, `SPI_EV_SEND_DMA_READY`, `SPI_EV_SEND`, `SPI_EV_RECV_DMA_READY`, `SPI_EV_RECV`, `SPI_EV_CMD9`, `SPI_EV_CMDA`, `SPI_EV_TRANS`; `SPI_CMD_HD_WRBUF`, `SPI_CMD_HD_RDBUF`, `SPI_CMD_HD_WRDMA`, `SPI_CMD_HD_RDDMA`, `SPI_CMD_HD_SEG_END`, `SPI_CMD_HD_EN_QPI`, `SPI_CMD_HD_WR_END`, `SPI_CMD_HD_INT0`, `SPI_CMD_HD_INT1`, `SPI_CMD_HD_INT2`.

Constants/helpers:

`SPI_MAX_DMA_LEN`, `SPI_MASTER_FREQ_8M`, `SPI_MASTER_FREQ_9M`, `SPI_MASTER_FREQ_10M`, `SPI_MASTER_FREQ_11M`, `SPI_MASTER_FREQ_13M`, `SPI_MASTER_FREQ_16M`, `SPI_MASTER_FREQ_20M`, `SPI_MASTER_FREQ_26M`, `SPI_MASTER_FREQ_40M`, `SPI_MASTER_FREQ_80M`, `SPI_SWAP_DATA_TX()`, and `SPI_SWAP_DATA_RX()`.

## Private and HAL data structures seen in traces

| Type | Layer and meaning | Lifetime/ordering |
|---|---|---|
| `spi_trans_priv_t` | Master-private wrapper around the public transaction, DMA-visible buffers, bounce-buffer ownership, and descriptor state. | Created before queue/start; destroyed only after completion/result processing. |
| `spi_host_t` | Master role context containing HAL state, ISR, devices, current transaction, bus attributes, and PM state. | Lazily allocated for the first device; freed after every device is removed. |
| `spi_slave_t` | Normal-slave host context with queues, current private transaction, HAL, ISR, DMA/common-bus pointers, FSM, and configuration. | Exclusive from initialize through free. |
| `spi_slave_trans_priv_t` | Normal-slave private transaction plus aligned/bounce-buffer state. | Queue preparation through result uninstall, or discarded by premature free. |
| `spi_slave_hd_slot_t` | Slave-HD role context with channel queues/semaphores, HAL, GDMA, callbacks, and mode. | Exclusive from init through deinit. |
| `spi_slave_hd_trans_priv_t` | Slave-HD private descriptor/bounce-buffer bookkeeping. | Queue/append preparation through the matching result path. |
| `spi_dma_ctx_t` | Common-private TX/RX GDMA handles, descriptor arrays, counts, and internal/external-memory alignment constraints. | Allocated after bus claim when DMA is enabled; released during role/common teardown. |
| `spi_bus_attr_t` | Common bus pins, flags, maximum transfer size, lock, PM lock, DMA-enabled state, and GPIO ownership. | Shared by the selected role after common allocation. |
| `spi_hal_context_t` | Master HAL binding to `spi_dev_t`, host ID, DMA handles, transaction state, and SCT state. | Owned by `spi_host_t`; initialized before any transaction. |
| `spi_hal_dev_config_t` | HAL-normalized per-device mode, CS, clock, bit order, timing, and line configuration. | Calculated at add-device; loaded when scheduling changes device. |
| `spi_hal_trans_config_t` | HAL-normalized command/address/dummy/data lengths, buffers, and transaction flags. | Formatted immediately before each master hardware start. |
| `spi_slave_hal_context_t` | Normal-slave HAL binding, DMA handles, mode/bit-order state, and active transaction pointers. | Owned by `spi_slave_t`. |
| `spi_slave_hd_hal_context_t` | Slave-HD HAL binding, append/segment state, descriptor heads, EOF state, and command/event configuration. | Owned by `spi_slave_hd_slot_t`. |
| `spi_slave_hd_hal_desc_append_t` | HAL bookkeeping for an append-mode descriptor chain. | Updated as the driver appends and retires GDMA descriptors. |

Additional private boundary/configuration types:

| Symbols | Meaning |
|---|---|
| `spi_bus_fsm_t`, `SPI_BUS_FSM_DISABLED`, `SPI_BUS_FSM_ENABLED` | Atomic enabled-state model used by the normal slave driver. |
| `spi_bus_lock_config_t`, `spi_bus_lock_dev_config_t`, `spi_bus_lock_handle_t`, `spi_bus_lock_dev_handle_t` | Private bus-arbitration configuration and opaque handles. |
| `spi_destroy_func_t` | Common-bus callback type used to destroy the installed role before bus free. |
| `spi_dma_chan_dir_t`, `spi_dma_chan_handle_t`, `spi_dma_desc_t`, `spi_dma_dev_t` | Shared abstraction for DMA direction, channel, descriptor, and legacy DMA device. On ESP32-S3 the channel handle resolves to GDMA state. |
| `spi_hal_timing_param_t`, `spi_hal_timing_conf_t`, `spi_hal_seg_config_t` | HAL inputs/results for delay compensation and configurable-segmented transfers. |
| `spi_ipc_param_t` | Driver-local argument used when ISR allocation must run on a selected CPU. |
| `spi_ll_clock_val_t` | LL-computed divider register value and realized clock. |
| `spi_ll_intr_t` | LL interrupt bitmask type; its `SPI_LL_INTR_*` members map semantic events to register bits. |
| `spi_ll_base_command_t`, `spi_ll_trans_len_cond_t` | LL slave-HD base-command and transfer-termination selectors. |
| `spi_multi_transaction_t`, `spi_sct_trans_priv_t`, `spi_sct_desc_ctx_t` | Private configurable-segmented public wrapper, per-set state, and descriptor-pool context. |
| `spi_reg_retention_info_t` | Target table entry describing GP-SPI registers retained across supported sleep states. |
| `spi_signal_conn_t` | Target pin-map description for IO-MUX input/output signals. |
| `spi_slave_hal_config_t`, `spi_slave_hd_hal_config_t` | Normal-slave and slave-HD initialization inputs passed from driver to HAL. |

Private implementation macros and constants are grouped by purpose below. They are source-level sequencing aids, attributes, masks, and limits—not application APIs:

- Validation/allocation/placement: `SPI_CHECK`, `SPI_CHECK_PIN`, `SPI_COMMON_ISR_ATTR`, `SPI_COMMON_MALLOC_CAPS`, `SPI_DMA_ISR_ATTR`, `SPI_MASTER_ATTR`, `SPI_MASTER_ISR_ATTR`, `SPI_MASTER_MALLOC_CAPS`, `SPI_SLAVE_ATTR`, `SPI_SLAVE_ISR_ATTR`.
- Atomic clock/control wrappers and defaults: `SPI_COMMON_PERI_CLOCK_ATOMIC`, `SPI_MASTER_PERI_CLOCK_ATOMIC`, `SPI_GDMA_NEW_CHANNEL`, `SPI_MAIN_BUS_DEFAULT`, `SPI_HOST_MAX`, `SPI_PERIPH_SRC_FREQ_MAX`, `SPI_EDMA_SETUP_TIME_US`.
- Public/target DMA selections: `SPI_DMA_CH1` and `SPI_DMA_CH2` exist only when building the original ESP32; ESP32-S3 accepts `SPI_DMA_DISABLED` or `SPI_DMA_CH_AUTO`.
- SCT change markers: `SPI_MULTI_TRANS_CMD_LEN_UPDATED`, `SPI_MULTI_TRANS_ADDR_LEN_UPDATED`, `SPI_MULTI_TRANS_DUMMY_LEN_UPDATED`, `SPI_MULTI_TRANS_PREP_LEN_UPDATED`, `SPI_MULTI_TRANS_DONE_LEN_UPDATED`.
- LL layout, access, and target limits: `SPI_LL_GET_HW`, `SPI_LL_ADDR_REG_POS`, `SPI_LL_CLOCK_REG_POS`, `SPI_LL_CTRL_REG_POS`, `SPI_LL_DIN_MODE_REG_POS`, `SPI_LL_DIN_NUM_REG_POS`, `SPI_LL_DOUT_MODE_REG_POS`, `SPI_LL_DMA_CONF_REG_POS`, `SPI_LL_DMA_INT_CLR_REG_POS`, `SPI_LL_DMA_INT_ENA_REG_POS`, `SPI_LL_MISC_REG_POS`, `SPI_LL_MS_DLEN_REG_POS`, `SPI_LL_USER_REG_POS`, `SPI_LL_USER1_REG_POS`, `SPI_LL_USER2_REG_POS`, `SPI_LL_CPU_MAX_BIT_LEN`, `SPI_LL_DMA_MAX_BIT_LEN`, `SPI_LL_MOSI_FREE_LEVEL`, `SPI_LL_RX_MINI_EXTRA_BITS`, `SPI_LL_TX_MINI_EXTRA_BITS`, `SPI_LL_ONE_LINE_CTRL_MASK`, `SPI_LL_ONE_LINE_USER_MASK`, `SPI_LL_UNUSED_INT_MASK`.
- SCT configuration-buffer encoders: `SPI_LL_CONF_BITMAP_POS`, `SPI_LL_CONF_BUFFER_OFFSET`, `SPI_LL_CONF_BUF_CLR_BIT`, `SPI_LL_CONF_BUF_GET_FIELD`, `SPI_LL_CONF_BUF_SET_BIT`, `SPI_LL_CONF_BUF_SET_FIELD`, `SPI_LL_SCT_MAGIC_NUMBER`.
- LL slave-HD command encodings: `SPI_LL_BASE_CMD_HD_WRBUF`, `SPI_LL_BASE_CMD_HD_RDBUF`, `SPI_LL_BASE_CMD_HD_WRDMA`, `SPI_LL_BASE_CMD_HD_RDDMA`, `SPI_LL_BASE_CMD_HD_SEG_END`, `SPI_LL_BASE_CMD_HD_EN_QPI`, `SPI_LL_BASE_CMD_HD_WR_END`, `SPI_LL_BASE_CMD_HD_INT0`, `SPI_LL_BASE_CMD_HD_INT1`, `SPI_LL_BASE_CMD_HD_INT2`.
- LL slave-HD termination encodings: `SPI_LL_TRANS_LEN_COND_WRBUF`, `SPI_LL_TRANS_LEN_COND_RDBUF`, `SPI_LL_TRANS_LEN_COND_WRDMA`, `SPI_LL_TRANS_LEN_COND_RDDMA`.
- LL interrupt masks: `SPI_LL_INTR_IN_FULL`, `SPI_LL_INTR_OUT_EMPTY`, `SPI_LL_INTR_CMD7`, `SPI_LL_INTR_CMD8`, `SPI_LL_INTR_CMD9`, `SPI_LL_INTR_CMDA`, `SPI_LL_INTR_RDBUF`, `SPI_LL_INTR_WRBUF`, `SPI_LL_INTR_RDDMA`, `SPI_LL_INTR_WRDMA`, `SPI_LL_INTR_SEG_DONE`, `SPI_LL_INTR_TRANS_DONE`.
- Channel enumerators: `SPI_SLAVE_CHAN_TX` selects slave-HD transmit service; `SPI_SLAVE_CHAN_RX` selects receive service.

## Master call sequences

```text
spi_bus_initialize
  → spicommon_periph_claim / spicommon_bus_alloc
  → spicommon_dma_chan_alloc (when enabled)
  → spi_bus_init_lock → spicommon_bus_initialize_io

first spi_bus_add_device
  → spi_master_init_driver
  → spi_hal_init → spi_ll_master_init
  → allocate device queues → clock/timing calculation
  → spi_bus_lock_register_dev → spicommon_cs_initialize

spi_device_queue_trans
  → check_trans_valid
  → setup_priv_desc → spicommon_dma_setup_priv_buffer
  → queue + spi_bus_lock_bg_request
  → spi_intr
  → spi_setup_device
  → spi_new_trans
  → spi_format_hal_trans_struct
  → s_spi_dma_prepare_data (DMA) / spi_hal_push_tx_buffer (CPU)
  → spi_hal_setup_device → spi_hal_setup_trans → spi_hal_user_start
  → SPI hardware / SPI_TRANS_DONE_INT
  → spi_intr → spi_post_trans → return queue
  → spi_device_get_trans_result → uninstall_priv_desc
```

## Common driver and lifecycle symbols

Source location: [`spi_common_internal.h`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_driver_spi/include/esp_private/spi_common_internal.h) and [`spi_common.c`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_driver_spi/src/gpspi/spi_common.c). Preprocessor guards in those files determine whether a legacy or ESP32-S3 GDMA symbol is executable.

| Private/internal function | Meaning and sequence position | Hardware/TRM link |
|---|---|---|
| `is_valid_host()` | File-local host/range/capability validation before any allocation. | GP-SPI2/3 availability |
| `spi_bus_lock_init_main_bus()` | Constructor that initializes the shared memory-SPI/main-bus lock context. | software arbitration only |
| `_spicommon_dma_rcc_clock_ctrl()` | Legacy-only reference-count/critical-section control of DMA peripheral clocks; excluded by `SOC_GDMA_SUPPORTED` on ESP32-S3. | legacy DMA boundary |
| `claim_dma_chan()` | Legacy-only static selected-channel claim; excluded by `SOC_GDMA_SUPPORTED` on ESP32-S3. | legacy DMA ownership |
| `connect_spi_and_dma()` | Legacy-only channel-to-host routing; excluded by `SOC_GDMA_SUPPORTED` on ESP32-S3. ESP32-S3 uses `gdma_connect()`. | legacy SPI DMA handshake |
| `alloc_dma_chan()` | Target-selected static allocator. ESP32-S3 compiles the GDMA branch, accepts only auto allocation, creates separate TX/RX channels, connects GP-SPI triggers, configures burst/access, and rolls back on failure. | GDMA boundary |
| `check_iomux_pins_oct()` | Verify the complete GP-SPI2 octal dedicated-pin set. | FSPI signals, §30.5.2 |
| `check_iomux_pins_quad()` | Verify the single/quad dedicated-pin set. | FSPI/SPI3 signals |
| `bus_uses_iomux_pins()` | Select all-IO-MUX versus GPIO-matrix routing. | timing path, §30.8 |
| `bus_iomux_pins_set_oct()` | Program dedicated octal pin functions. | GP-SPI2 octal signals |
| `bus_iomux_pins_set_quad()` | Program dedicated single/dual/quad pin functions. | bus signals |
| `s_spi_common_gpio_check_reserve()` | Warn/check GPIO reservation before routing. | pin ownership |
| `s_spi_common_bus_via_gpio()` | Route one signal through matrix and update the owned IO mask. | GPIO matrix |
| `s_bus_create_sleep_retention_cb()` | Create sleep-retention context for common bus registers when supported. | clock/register retention |
| `spicommon_periph_claim()` | Atomically claim one SPI host for a role. | exclusive register instance |
| `spicommon_periph_free()` | Release the host claim after role cleanup. | resource release |
| `spicommon_bus_alloc()` | Allocate/store common bus context. | software ownership |
| `spicommon_bus_free()` | Destroy common context after role/device cleanup. | software ownership |
| `spicommon_bus_initialize_io()` | Validate and configure data/SCLK pins and routing flags. | §§30.5.1–30.5.2 |
| `spicommon_bus_free_io_cfg()` | Disconnect and release bus GPIO configuration. | pin release |
| `spicommon_cs_initialize()` | Route/configure one device or slave CS. | CS controls, §30.6 |
| `spicommon_cs_free_io()` | Disconnect/release a CS pin. | CS release |
| `spicommon_irqsource_for_host()` | Map host to its SPI peripheral interrupt source. | §30.10 |
| `spicommon_irqdma_source_for_host()` | Map host/DMA to combined legacy interrupt source when applicable. | SPI/GDMA boundary |
| `spicommon_dma_chan_alloc()` | Public-private wrapper around DMA channel/context allocation. | GDMA boundary |
| `spicommon_dma_chan_free()` | Stop/free DMA channels and descriptors. | reverse DMA ownership |
| `spicommon_dma_desc_alloc()` | Allocate RX/TX descriptor arrays sized for max transfer. | DMA path |
| `spicommon_dma_desc_setup_link()` | Populate descriptors for a buffer and direction. | descriptor chain |
| `spicommon_dma_setup_priv_buffer()` | Select original or aligned bounce buffer and prepare descriptor metadata. | CPU memory ↔ GDMA |
| `spicommon_dma_rx_mb()` | Apply RX memory barrier before CPU consumption. | memory visibility |
| `spicommon_dmaworkaround_transfer_active()` | Mark legacy DMA channel active for silicon workaround tracking. | legacy DMA boundary |
| `spicommon_dmaworkaround_idle()` | Mark channel idle and perform pending reset callback. | legacy DMA recovery |
| `spicommon_dmaworkaround_req_reset()` | Request coordinated reset when another channel is active. | DMA error recovery |
| `spicommon_dmaworkaround_reset_in_progress()` | Report coordinated-reset state. | DMA error recovery |
| `spi_bus_init_lock()` / `spi_bus_deinit_lock()` | Create/destroy the host bus-lock object around driver lifetime. | software arbitration |
| `spi_bus_get_attr()` | Return common bus attributes for an initialized host. | common context |
| `spi_bus_get_dma_ctx()` | Return the host's private DMA context to role drivers. | DMA ownership |
| `spi_bus_register_destroy_func()` | Register role-specific destruction used by `spi_bus_free()`. | reverse lifecycle |
| `spi_bus_multi_trans_mode_enable()` | Enable/disable private configurable-segmented scheduling. | §30.5.8.5 |

## Master private functions

Source location: [`spi_master_internal.h`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_driver_spi/include/esp_private/spi_master_internal.h) and [`spi_master.c`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_driver_spi/src/gpspi/spi_master.c).

| Private function | Meaning and position | Main lower layer |
|---|---|---|
| `spi_master_init_driver()` | Allocate host context, queues/interrupt callbacks, HAL and PM state after common bus setup. | `spi_hal_init()` |
| `spi_master_deinit_driver()` | Disable/free ISR and driver context during bus destruction. | `spi_hal_deinit()` |
| `ipc_isr_reg_to_core()` | Install interrupt on the requested CPU through IPC when required. | interrupt allocator |
| `s_spi_find_clock_src_pre_div()` | Find source pre-divider used by device clock calculation. | clock tree |
| `spi_setup_device()` | Load device clock/mode/CS/timing when scheduled device changes. | `spi_hal_setup_device()` |
| `get_acquiring_dev()` | Resolve the bus-lock device currently owning hardware. | bus lock |
| `spi_bus_device_is_polling()` | Test whether current owner is in polling mode. | scheduling state |
| `spi_bus_intr_enable()` | Enable host interrupt when background work becomes runnable. | interrupt enable |
| `spi_bus_intr_disable()` | Disable host interrupt when no queued work is runnable. | interrupt disable |
| `check_trans_valid()` | Validate flags, lengths, buffers, duplex, pins, DMA, and target capabilities. | pre-hardware guard |
| `setup_priv_desc()` | Build private descriptor and optional DMA bounce buffers. | common DMA helper |
| `uninstall_priv_desc()` | Copy back RX bounce data and free private resources. | result cleanup |
| `spi_format_hal_trans_struct()` | Convert public/private transaction fields to `spi_hal_trans_config_t`. | HAL transaction config |
| `s_spi_dma_prepare_data()` | Reset/link/start master RX/TX DMA around the formatted transaction. | SPI DMA + GDMA |
| `spi_new_trans()` | Invoke pre-callback, setup device/transaction/data path, then start hardware. | HAL/LL start |
| `spi_post_trans()` | Fetch CPU RX data, inspect DMA errors, invoke post-callback, finalize current descriptor. | HAL result path |
| `spi_trans_dma_error_check()` | Inspect/clear master FIFO underflow/overflow and coordinate DMA reset. | DMA interrupt fields |
| `spi_intr()` | Master ISR state machine: complete current, return it, select/start next, manage bus lock. | §30.10 |
| `spi_sct_set_hal_trans_config()` | Build HAL configuration for one configurable-segmented transaction. | SCT hardware fields |
| `s_sct_load_dma_link()` | Load current segmented RX/TX descriptor heads into DMA. | GDMA links |
| `spi_new_sct_trans()` | Start one segmented transaction/configuration stream. | `spi_hal_sct_*` |
| `spi_post_sct_trans()` | Complete segmented transfer and recycle descriptor/configuration resources. | SCT result path |
| `s_sct_setup_desc_anywhere()` | Fill a descriptor range from an arbitrary pool position. | descriptor pool |
| `s_sct_desc_get_required_num()` | Compute descriptor count for byte length. | DMA sizing |
| `spi_hal_sct_tx_dma_desc_recycle()` | Return completed TX descriptors to the SCT pool. | pool ownership |
| `s_sct_prepare_tx_seg()` | Format/link one TX segment. | DMA descriptors |
| `spi_hal_sct_new_tx_dma_desc_head()` | Allocate first TX segment chain/head. | DMA descriptors |
| `spi_hal_sct_link_tx_seg_dma_desc()` | Append a TX segment chain. | DMA descriptors |
| `spi_hal_sct_rx_dma_desc_recycle()` | Return completed RX descriptors to the pool. | pool ownership |
| `s_sct_prepare_rx_seg()` | Format/link one RX segment. | DMA descriptors |
| `spi_hal_sct_new_rx_dma_desc_head()` | Allocate first RX segment chain/head. | DMA descriptors |
| `spi_hal_sct_link_rx_seg_dma_desc()` | Append an RX segment chain. | DMA descriptors |
| `s_spi_sct_reset_dma_pool()` | Reset segmented descriptor pools after completion/error. | DMA recovery |
| `s_sct_init_conf_buffer()` | Initialize hardware segmented-configuration words. | SCT config buffer |
| `s_sct_format_conf_buffer()` | Encode one segment's phase configuration and end marker. | `spi_ll_format_*` |
| `spi_device_queue_multi_trans()` | **Private API:** validate and queue a configurable-segmented transaction set. | SCT descriptor/configuration path |
| `spi_device_get_multi_trans_result()` | **Private API:** return a completed segmented set and recycle its private resources. | SCT return/recycle path |

## DMA helper functions

Source location: [`spi_dma.h`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_driver_spi/include/esp_private/spi_dma.h), [`spi_dma.c`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_driver_spi/src/gpspi/spi_dma.c), and the ESP32-S3 GDMA branch in [`spi_common.c`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_driver_spi/src/gpspi/spi_common.c).

The following `spi_dma_*` and `spi_dma_ll_*` names are visible in the shared source tree but their implementations/declarations are guarded by `!SOC_GDMA_SUPPORTED`. ESP32-S3 executes the GDMA branch instead. They are inventoried to explain traces, not as target call-path functions.

| Function | Meaning |
|---|---|
| `spi_dma_get_alignment_constraints()` | Return buffer and transfer-size alignment constraints for this target/DMA backend. |
| `spi_dma_append()` | Retrigger a hardware preload after a linked descriptor was appended; on ESP32-S3 the corresponding operation is the `gdma_append` alias, not descriptor construction. |
| `spi_dma_reset()` | Reset SPI DMA FIFOs and selected DMA channels before reuse. |
| `spi_dma_start()` | Start prepared RX then TX DMA links. |
| `spi_dma_enable_burst()` | Configure supported data/descriptor burst behavior. |
| `spi_dma_get_eof_desc()` | Obtain the descriptor address reported at EOF. |
| `spi_dma_ll_reset_register()` | Reset target DMA register interface. |
| `spi_dma_ll_rx_reset()` / `spi_dma_ll_tx_reset()` | Reset RX/TX channel state. |
| `spi_dma_ll_rx_start()` / `spi_dma_ll_tx_start()` | Start linked RX/TX channels. |
| `spi_dma_ll_rx_restart()` / `spi_dma_ll_tx_restart()` | Append/restart an active channel. |
| `spi_dma_ll_get_in_suc_eof_desc_addr()` / `spi_dma_ll_get_out_eof_desc_addr()` | Read completed descriptor address. |
| `spi_dma_ll_rx_enable_burst_data()` / `spi_dma_ll_tx_enable_burst_data()` | Enable data bursts. |
| `spi_dma_ll_rx_enable_burst_desc()` / `spi_dma_ll_tx_enable_burst_desc()` | Enable descriptor bursts. |
| `spi_dma_ll_enable_out_auto_wrback()` | Enable TX descriptor ownership writeback. |
| `spi_dma_ll_set_out_eof_generation()` | Configure TX EOF generation. |
| `spi_dma_ll_get_rx_alignment_require()` | Query RX alignment requirement. |
| `spi_dma_ll_enable_bus_clock()` | Enable DMA bus clock. |

## Full-duplex slave private functions

Source location: [`spi_slave_internal.h`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_driver_spi/include/esp_private/spi_slave_internal.h) and [`spi_slave.c`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_driver_spi/src/gpspi/spi_slave.c).

| Private function | Meaning and sequence position | Main lower layer |
|---|---|---|
| `bus_is_iomux()` | Test slave SCLK/data route for timing and CS-freeze behavior. | IO MUX/matrix |
| `freeze_cs()` / `restore_cs()` | Temporarily prevent external CS activity around unsafe DMA reset, then restore routing. | CS/pin boundary |
| `ipc_isr_reg_to_core()` | Install slave ISR on configured CPU. | interrupt allocator |
| `s_spi_create_sleep_retention_cb()` | Register slave register retention callback when supported. | sleep retention |
| `spi_slave_setup_priv_trans()` | Validate/copy/descriptorize queued slave buffers. | DMA helpers |
| `spi_slave_uninstall_priv_trans()` | Copy RX bounce data and free slave-private state. | result cleanup |
| `s_spi_slave_dma_prepare_data()` | Reset/link/start RX/TX DMA for the next slave descriptor. | slave HAL/GDMA |
| `s_spi_slave_prepare_data()` | Pop/format next queue item and arm slave hardware. | `spi_slave_hal_*` |
| `spi_slave_restart_after_dmareset()` | Callback that rearms slave after coordinated DMA reset. | DMA recovery |
| `spi_slave_trans_dma_error_check()` | Inspect FIFO errors and request/reset DMA safely. | DMA interrupt fields |
| `spi_intr()` | Slave ISR: finish current, store actual length, callback/return descriptor, arm next. | slave done interrupt |
| `spi_slave_queue_reset()` / `spi_slave_queue_reset_isr()` | Reset task/ISR queue state during teardown or recovery. | FreeRTOS queues |
| `spi_slave_queue_trans_isr()` | ISR-safe internal queue operation used by role logic. | FreeRTOS ISR queue |

## Slave-HD private functions

Source location: [`spi_slave_hd.c`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_driver_spi/src/gpspi/spi_slave_hd.c).

| Private function | Meaning and sequence position | Main lower layer |
|---|---|---|
| `s_spi_create_sleep_retention_cb()` | Create HD register-retention context during init. | sleep retention |
| `tx_invoke()` / `rx_invoke()` | Invoke configured TX/RX event callbacks. | ISR callback boundary |
| `intr_check_clear_callback()` | Check/clear one HD event, call callback, combine task-woken result. | HD interrupt status |
| `spi_slave_hd_tx_dma_error_check()` / `spi_slave_hd_rx_dma_error_check()` | Validate channel completion/error and repair descriptor state. | SPI/GDMA errors |
| `s_spi_slave_hd_segment_isr()` | Handle HD segment commands/events and return finished descriptors. | HD event interrupts |
| `spi_slave_hd_append_tx_isr()` / `spi_slave_hd_append_rx_isr()` | Process legacy append-mode TX/RX completion. | append descriptor EOF |
| `s_spi_slave_hd_append_gdma_isr()` | GDMA event callback for append mode; route TX/RX completion. | GDMA callback |
| `s_spi_slave_hd_append_legacy_isr()` | SPI ISR entry for legacy append backend. | SPI interrupt |
| `s_spi_slave_hd_setup_priv_trans()` | Validate and descriptorize one HD TX/RX buffer. | DMA helpers |
| `s_spi_slave_hd_destroy_priv_trans()` | Copy/free completed HD private buffer state. | result cleanup |
| `get_ret_queue_result()` | Wait on selected channel return queue and expose public descriptor. | FreeRTOS queue |

## Validation, rollback, and deletion rules

- All initialization functions validate host, pins, mode, queue size, flags, interrupt CPU, and DMA selection before or during staged allocation.
- Partial failure unwinds in reverse order; host claims and DMA channels are not intentionally retained after an error.
- Master device removal requires no outstanding/queued/polling work and no bus acquisition.
- Master bus free requires zero devices. Slave free/deinit only checks that the corresponding role object exists; it does not check queues or active transactions. Quiescing the external master and recovering descriptors is an application safety precondition.
- Public descriptors and their buffers remain application-owned but must stay alive until the matching result API returns them.
- Internal functions never become safe application APIs merely because they are declared in an `esp_private` header.

## HAL functions

### Master/common HAL

Source location: [`spi_hal.h`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_hal_gpspi/include/hal/spi_hal.h), [`spi_hal.c`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_hal_gpspi/spi_hal.c), and [`spi_hal_iram.c`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_hal_gpspi/spi_hal_iram.c).

| HAL function | Meaning and sequence position | LL/register relationship |
|---|---|---|
| `spi_hal_init()` / `spi_hal_deinit()` | Bind/unbind the host device, DMA context, and default master hardware state. | `spi_ll_master_init()`, reset/clock state |
| `spi_hal_setup_device()` | Apply stable clock, mode, CS, bit order, line, and timing configuration. | `SPI_CLOCK`, `SPI_CTRL`, `SPI_USER`, `SPI_MISC` |
| `spi_hal_setup_trans()` | Apply command/address/dummy/data enables, lengths, and per-transaction flags. | `SPI_USER1/2`, `SPI_MS_DLEN`, `SPI_CTRL` |
| `spi_hal_user_start()` | Start the configured transaction after data path is ready. | `spi_ll_user_start()` → `SPI_USR` |
| `spi_hal_usr_is_done()` | Test hardware completion for polling. | `spi_ll_usr_is_done()` |
| `spi_hal_push_tx_buffer()` | Copy CPU-mode TX data into the W-register bank. | `spi_ll_write_buffer()` |
| `spi_hal_fetch_result()` | Copy CPU-mode RX data from W registers. | `spi_ll_read_buffer()` |
| `spi_hal_hw_prepare_rx()` / `spi_hal_hw_prepare_tx()` | Reset/enable SPI-side RX/TX DMA FIFO path. | `SPI_DMA_CONF` reset/enable fields |
| `spi_hal_enable_data_line()` | Enable required MOSI/MISO/quad/octal signals. | line-mode fields |
| `spi_hal_set_data_pin_idle_level()` | Set configured idle output levels. | target line idle controls |
| `spi_hal_cal_clock_conf()` | Compute divider register data and realized rate. | `spi_ll_master_cal_clock()` |
| `spi_hal_master_cal_clock()` | HAL wrapper for target clock-divider calculation. | `SPI_CLOCK` |
| `spi_hal_cal_timing()` | Convert input delay/frequency into dummy and sampling settings. | DIN delay and dummy fields |
| `spi_hal_get_freq_limit()` | Calculate no-extra-dummy timing limit. | §30.8 timing model |
| `spi_hal_clear_intr_mask()` / `spi_hal_get_intr_mask()` | Clear/read selected SPI interrupt bits. | DMA interrupt clear/status registers |

### Configurable-segmented-transfer HAL

| HAL function | Meaning |
|---|---|
| `spi_hal_sct_init()` / `spi_hal_sct_deinit()` | Allocate/clear SCT HAL state and hardware segmented mode. |
| `spi_hal_sct_init_conf_buffer()` | Initialize a hardware configuration buffer. |
| `spi_hal_sct_format_conf_buffer()` | Encode one segment's command/address/dummy/data configuration. |
| `spi_hal_sct_setup_conf_base()` | Point hardware at the base configuration stream. |
| `spi_hal_sct_set_conf_bits_len()` | Set total configuration-bit count/end boundary. |

### Full-duplex slave HAL

Source location: [`spi_slave_hal.h`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_hal_gpspi/include/hal/spi_slave_hal.h), [`spi_slave_hal.c`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_hal_gpspi/spi_slave_hal.c), and [`spi_slave_hal_iram.c`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_hal_gpspi/spi_slave_hal_iram.c).

| HAL function | Meaning and sequence position | LL/register relationship |
|---|---|---|
| `spi_slave_hal_init()` / `spi_slave_hal_deinit()` | Bind/unbind slave host and establish default slave state. | `spi_ll_slave_init()` / reset |
| `spi_slave_hal_setup_device()` | Apply slave mode, bit order, CS and routing-dependent timing. | slave mode/control fields |
| `spi_slave_hal_hw_reset()` | Reset complete slave transaction state. | `spi_ll_slave_reset()` |
| `spi_slave_hal_hw_fifo_reset()` | Reset CPU/DMA FIFO state only. | CPU/DMA FIFO reset fields |
| `spi_slave_hal_hw_prepare_rx()` / `spi_slave_hal_hw_prepare_tx()` | Prepare SPI-side DMA receive/transmit paths. | `SPI_DMA_CONF` |
| `spi_slave_hal_push_tx_buffer()` | Load CPU-mode slave TX bytes. | W-register bank |
| `spi_slave_hal_store_result()` | Copy CPU RX bytes and record result after completion. | W registers/received length |
| `spi_slave_hal_set_trans_bitlen()` | Program maximum slave TX/RX bit lengths. | slave length registers |
| `spi_slave_hal_get_rcv_bitlen()` | Read actual externally clocked bit length. | slave received-length field |
| `spi_slave_hal_user_start()` / `spi_slave_hal_usr_is_done()` | Arm/test the slave transaction state. | slave transaction state |
| `spi_slave_hal_clear_intr_status()` / `spi_slave_hal_get_intr_status()` | Acknowledge/read slave completion/error events. | DMA interrupt registers |
| `spi_slave_hal_dma_need_reset()` | Decide whether FIFO/DMA error state requires coordinated reset. | FIFO error bits |
| `spi_slave_hal_enable_data_line()` | Configure slave line enables for selected mode. | `SPI_CTRL`/`SPI_USER` line fields |

### Slave-HD HAL

Source location: [`spi_slave_hd_hal.h`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_hal_gpspi/include/hal/spi_slave_hd_hal.h) and [`spi_slave_hd_hal.c`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_hal_gpspi/spi_slave_hd_hal.c).

| HAL function | Meaning and sequence position | TRM relationship |
|---|---|---|
| `spi_slave_hd_hal_init()` | Configure HD base commands, segment/append mode, shared-register and interrupt state. | §30.5.9 command protocol |
| `spi_slave_hd_hal_enable_event_intr()` | Enable the interrupt corresponding to a registered callback. | HD event enable bits |
| `spi_slave_hd_hal_check_clear_event()` | Test and acknowledge one HD event. | raw/status/clear |
| `spi_slave_hd_hal_check_clear_intr()` | Test and clear direct HD interrupt source. | DMA interrupt group |
| `spi_slave_hd_hal_check_disable_event()` | Disable a handled/one-shot event when required. | event enable fields |
| `spi_slave_hd_hal_invoke_event_intr()` | Software-trigger an HD event path. | interrupt set register |
| `spi_slave_hd_hal_txdma()` / `spi_slave_hd_hal_rxdma()` | Load/start bounded TX/RX DMA service. | HD DMA commands |
| `spi_slave_hd_hal_txdma_append()` / `spi_slave_hd_hal_rxdma_append()` | Extend an active append-mode chain. | GDMA restart/descriptor link |
| `spi_slave_hd_hal_hw_prepare_tx()` / `spi_slave_hd_hal_hw_prepare_rx()` | Reset and prepare SPI-side HD DMA path. | `SPI_DMA_CONF` |
| `spi_slave_hd_hal_get_tx_finished_trans()` / `spi_slave_hd_hal_get_rx_finished_trans()` | Resolve the completed descriptor from hardware EOF state. | DMA EOF address |
| `spi_slave_hd_hal_rxdma_seg_get_len()` | Calculate received length for a segment chain. | descriptor lengths |
| `spi_slave_hd_hal_get_last_addr()` / `spi_slave_hd_hal_get_rxlen()` | Read HD shared-window last address and RX length. | HD status fields |
| `spi_slave_hd_hal_write_buffer()` / `spi_slave_hd_hal_read_buffer()` | Copy to/from the HD shared-register buffer without adding public API range checks. | shared data registers |
| `s_desc_get_received_len_addr()` | HAL-local descriptor walk that totals received bytes and finds next buffer. | GDMA descriptor state |
| `get_event_intr()` | HAL-local mapping from `spi_event_t` to target LL interrupt mask. | HD event bits |

## ESP32-S3 LL functions

Source location for every LL entry below: target-pinned [`esp32s3/include/hal/spi_ll.h`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/esp_hal_gpspi/esp32s3/include/hal/spi_ll.h).

### Initialization, start, and interrupt access

| LL function | Direct hardware meaning |
|---|---|
| `spi_ll_enable_bus_clock()` / `spi_ll_enable_clock()` | Enable GP-SPI peripheral/register clocking. |
| `spi_ll_reset_register()` | Restore the SPI register block to driver-expected defaults. |
| `spi_ll_master_init()` / `spi_ll_slave_init()` / `spi_ll_slave_hd_init()` | Program role-specific baseline fields. |
| `spi_ll_apply_config()` | Commit/update buffered configuration where required. |
| `spi_ll_user_start()` / `spi_ll_usr_is_done()` | Set/test the master user-command start state. |
| `spi_ll_get_running_cmd()` | Read current slave-HD command/state. |
| `spi_ll_enable_int()` / `spi_ll_disable_int()` / `spi_ll_get_intr()` / `spi_ll_clear_int_stat()` / `spi_ll_set_int_stat()` | Access the newer typed interrupt-mask interface. |
| `spi_ll_enable_intr()` / `spi_ll_disable_intr()` / `spi_ll_set_intr()` / `spi_ll_clear_intr()` | Access compatible interrupt enable/set/clear helpers. |
| `spi_ll_infifo_full_clr()` / `spi_ll_outfifo_empty_clr()` | Clear RX overflow/TX underflow error events. |

### Master clock, CS, mode, and timing

| LL function | Direct hardware meaning |
|---|---|
| `spi_ll_freq_for_pre_n()` | Compute frequency for a candidate pre/N divider. |
| `spi_ll_master_cal_clock()` | Search legal divider/duty values and build register config. |
| `spi_ll_master_set_clock()` / `spi_ll_master_set_clock_by_reg()` | Program divider from frequency/config word. |
| `spi_ll_clk_source_pre_div()` / `spi_ll_set_clk_source()` | Calculate/select source-clock predivision. |
| `spi_ll_master_set_mode()` | Program CPOL/CPHA edge fields. |
| `spi_ll_master_select_cs()` | Select/enable a hardware CS output. |
| `spi_ll_master_set_pos_cs()` | Configure active-high CS. |
| `spi_ll_master_keep_cs()` | Keep CS asserted after a transaction. |
| `spi_ll_master_set_cs_setup()` / `spi_ll_master_set_cs_hold()` | Enable and size CS setup/hold intervals. |
| `spi_ll_master_set_rx_timing_mode()` | Program sampling delay/timing compensation. |
| `spi_ll_master_is_rx_std_sample_supported()` | Report whether standard sample timing is valid for this host/path. |
| `spi_ll_set_mosi_delay()` / `spi_ll_set_miso_delay()` | Program output/input delay mode and count. |
| `spi_ll_set_data_pin_idle_level()` | Program supported idle data-line levels. |

### Phase, line-mode, and buffer access

| LL function | Direct hardware meaning |
|---|---|
| `spi_ll_set_command()` / `spi_ll_set_command_bitlen()` | Load command value and command-phase width. |
| `spi_ll_set_address()` / `spi_ll_set_addr_bitlen()` | Load address value and address-phase width. |
| `spi_ll_set_dummy()` | Enable/size dummy phase. |
| `spi_ll_set_mosi_bitlen()` / `spi_ll_set_miso_bitlen()` | Set TX/RX data bit lengths. |
| `spi_ll_set_half_duplex()` | Select sequential versus simultaneous data phases. |
| `spi_ll_master_set_line_mode()` | Set command/address/data single/dual/quad/octal fields. |
| `spi_ll_enable_mosi()` / `spi_ll_enable_miso()` | Enable output/input data phases. |
| `spi_ll_set_sio_mode()` | Enable shared single-data-line mode. |
| `spi_ll_set_tx_lsbfirst()` / `spi_ll_set_rx_lsbfirst()` | Select TX/RX wire bit order. |
| `spi_ll_write_buffer()` / `spi_ll_read_buffer()` | Copy words between memory and W-register bank. |
| `spi_ll_write_buffer_byte()` / `spi_ll_read_buffer_byte()` | Copy byte-granular tails safely. |

### SPI-side DMA/FIFO access

| LL function | Direct hardware meaning |
|---|---|
| `spi_ll_dma_rx_enable()` / `spi_ll_dma_tx_enable()` | Select GDMA as RX/TX FIFO data mover. |
| `spi_ll_dma_rx_fifo_reset()` / `spi_ll_dma_tx_fifo_reset()` | Reset SPI-side RX/TX DMA FIFOs. |
| `spi_ll_cpu_rx_fifo_reset()` / `spi_ll_cpu_tx_fifo_reset()` | Reset CPU-buffer/FIFO paths. |
| `spi_ll_dma_set_rx_eof_generation()` | Choose SPI condition that produces RX EOF. |

### Slave and slave-HD control

| LL function | Direct hardware meaning |
|---|---|
| `spi_ll_slave_reset()` | Reset slave state machine and transaction status. |
| `spi_ll_slave_set_mode()` | Program slave CPOL/CPHA mode. |
| `spi_ll_slave_set_tx_bitlen()` / `spi_ll_slave_set_rx_bitlen()` | Program maximum slave TX/RX lengths. |
| `spi_ll_slave_get_rcv_bitlen()` / `spi_ll_slave_get_rx_byte_len()` | Read actual externally clocked receive length. |
| `spi_ll_slave_set_seg_mode()` | Select slave single/segmented behavior. |
| `spi_ll_slave_hd_set_len_cond()` | Select HD DMA length/termination condition. |
| `spi_ll_get_slave_hd_base_command()` / `spi_ll_get_slave_hd_command()` | Read configured base and current HD command. |
| `spi_ll_get_slave_hd_dummy_bits()` | Read required HD dummy count. |
| `spi_ll_slave_hd_get_last_addr()` | Read last shared-register address accessed. |
| `spi_ll_set_magic_number()` | Program target-required HD protocol magic/default field. |

### Segmented configuration formatter

| LL function | Direct hardware meaning |
|---|---|
| `spi_ll_conf_state_enable()` | Enable segmented configuration-state engine. |
| `spi_ll_init_conf_buffer()` | Initialize configuration buffer words. |
| `spi_ll_set_conf_base_bitslen()` | Program base configuration-stream bit length. |
| `spi_ll_format_conf_bitslen_buffer()` | Encode configuration length into the stream. |
| `spi_ll_set_conf_phase_bits_len()` | Set encoded configuration phase width. |
| `spi_ll_format_cmd_phase_conf_buffer()` | Encode command phase. |
| `spi_ll_format_addr_phase_conf_buffer()` | Encode address phase. |
| `spi_ll_format_dummy_phase_conf_buffer()` | Encode dummy phase. |
| `spi_ll_format_dout_phase_conf_buffer()` | Encode output data phase. |
| `spi_ll_format_din_phase_conf_buffer()` | Encode input data phase. |
| `spi_ll_format_line_mode_conf_buff()` | Encode phase line widths. |
| `spi_ll_format_prep_phase_conf_buffer()` | Encode preparation transition. |
| `spi_ll_format_done_phase_conf_buffer()` | Encode segment completion transition. |
| `spi_ll_format_conf_phase_conf_buffer()` | Encode a generic configuration phase. |

`spi_ll_master_set_cksel()` selects the target master clock source/multiplexer before divider programming.

## Register and TRM crosswalk

| Register(s) | Logical fields/meaning | Driver/HAL/LL keywords | TRM |
|---|---|---|---|
| `SPI_CMD_REG` | `conf_bitlen`, `update`, `usr` start/update state | `spi_ll_apply_config`, `spi_ll_user_start`, `spi_ll_usr_is_done` | §30.5.8 state machine |
| `SPI_ADDR_REG` | address payload | `spi_ll_set_address` | command/address phases |
| `SPI_CTRL_REG` | dual/quad/octal command/address/read modes, IO polarity, TX/RX bit order | line-mode and bit-order LL calls | §§30.5.1–30.5.3 |
| `SPI_CLOCK_REG` | `clkcnt_l/h/n`, `clkdiv_pre`, system-clock bypass | clock calculation/setters | §30.7.2 |
| `SPI_USER_REG` | duplex, QPI/OPI, CS setup/hold, edge, phase enables, line/write modes | setup-device/setup-trans | §§30.5.8, 30.7 |
| `SPI_USER1_REG` | dummy cycles, CS setup/hold counts, address length | dummy/address/CS setters | phase timing |
| `SPI_USER2_REG` | command value/length and error-end controls | command setters | command phase |
| `SPI_MS_DLEN_REG` | master data bit length | MOSI/MISO bit-length setters | data phases |
| `SPI_MISC_REG` | CS disables/polarity, slave/master CS controls, clock idle edge | CS/mode setup | §§30.6–30.7; SPI2-only fields noted by TRM |
| `SPI_DIN_MODE_REG`, `SPI_DIN_NUM_REG` | per-input delay mode/count | RX timing and MISO delay | §30.8 |
| `SPI_DOUT_MODE_REG` | per-output delay mode | MOSI delay/timing | §30.8 |
| `SPI_DMA_CONF_REG` | RX/TX DMA enable, FIFO resets, descriptor/segment controls | HAL prepare and DMA LL calls | §§30.5.6–30.5.7 |
| `SPI_DMA_INT_RAW_REG`, `SPI_DMA_INT_ENA_REG`, `SPI_DMA_INT_ST_REG`, `SPI_DMA_INT_CLR_REG`, `SPI_DMA_INT_SET_REG` | transaction done, slave events, FIFO errors, HD events | ISR/HAL interrupt calls | §30.10 |
| `SPI_SLAVE_REG`, `SPI_SLAVE1_REG` | slave mode/state, received length, segment/HD controls | slave and HD LL calls | §30.5.9 |
| `SPI_CLK_GATE_REG` | register/core clock gates | peripheral clock enable/PM | clock/power boundary |
| `SPI_W0_REG`…`SPI_W15_REG` | 16 × 32-bit CPU-visible TX/RX buffer words | HAL/LL buffer push/fetch | §30.5.5 |
| `SPI_DATE_REG` | peripheral register version | diagnostics | §30.12 |

The individual CPU-buffer register symbols are `SPI_W0_REG`, `SPI_W1_REG`, `SPI_W2_REG`, `SPI_W3_REG`, `SPI_W4_REG`, `SPI_W5_REG`, `SPI_W6_REG`, `SPI_W7_REG`, `SPI_W8_REG`, `SPI_W9_REG`, `SPI_W10_REG`, `SPI_W11_REG`, `SPI_W12_REG`, `SPI_W13_REG`, `SPI_W14_REG`, and `SPI_W15_REG`.

The register header emits `_V`, `_M`, and `_S` value/mask/shift macros for each logical field. They are representations of the fields above, not separate behaviors. `spi_dev_t` mirrors the same register order and exposes each logical field plus `.val`; reserved members must never be repurposed.

Coverage classification: all `SPI_*` register-address macros and all 170 non-reserved logical `spi_dev_t` fields are represented in this crosswalk/catalog. The mechanically generated per-field aliases such as `SPI_<FIELD>_V`, `_M`, and `_S`, plus reserved-bit macros, are intentionally classified as duplicate numeric encodings rather than separate semantic symbols. Consult the pinned [`spi_reg.h`](https://github.com/espressif/esp-idf/blob/v6.0.1/components/soc/esp32s3/register/soc/spi_reg.h) for their exact values.

### Complete logical `spi_dev_t` field catalog

The following are all non-reserved logical fields in the ESP32-S3 v6.0.1 `spi_dev_t`. Repeated raw/enable/status/clear event layouts share the base event names; the `_int_set` fields belong to the software-set register.

Command, address, clock, phase, mode, CS, and line fields:

`conf_bitlen`, `update`, `usr`, `addr`, `dummy_out`, `faddr_dual`, `faddr_quad`, `faddr_oct`, `fcmd_dual`, `fcmd_quad`, `fcmd_oct`, `fread_dual`, `fread_quad`, `fread_oct`, `q_pol`, `d_pol`, `hold_pol`, `wp_pol`, `rd_bit_order`, `wr_bit_order`, `clkcnt_l`, `clkcnt_h`, `clkcnt_n`, `clkdiv_pre`, `clk_equ_sysclk`, `doutdin`, `qpi_mode`, `opi_mode`, `tsck_i_edge`, `cs_hold`, `cs_setup`, `rsck_i_edge`, `ck_out_edge`, `fwrite_dual`, `fwrite_quad`, `fwrite_oct`, `usr_conf_nxt`, `sio`, `usr_miso_highpart`, `usr_mosi_highpart`, `usr_dummy_idle`, `usr_mosi`, `usr_miso`, `usr_dummy`, `usr_addr`, `usr_command`, `usr_dummy_cyclelen`, `mst_wfull_err_end_en`, `cs_setup_time`, `cs_hold_time`, `usr_addr_bitlen`, `usr_command_value`, `mst_rempty_err_end_en`, `usr_command_bitlen`, `ms_data_bitlen`, `cs0_dis`, `cs1_dis`, `cs2_dis`, `cs3_dis`, `cs4_dis`, `cs5_dis`, `ck_dis`, `master_cs_pol`, `clk_data_dtr_en`, `data_dtr_en`, `addr_dtr_en`, `cmd_dtr_en`, `slave_cs_pol`, `dqs_idle_edge`, `ck_idle_edge`, `cs_keep_active`, `quad_din_pin_swap`.

Input/output timing fields:

`din0_mode`, `din1_mode`, `din2_mode`, `din3_mode`, `din4_mode`, `din5_mode`, `din6_mode`, `din7_mode`, `timing_hclk_active`, `din0_num`, `din1_num`, `din2_num`, `din3_num`, `din4_num`, `din5_num`, `din6_num`, `din7_num`, `dout0_mode`, `dout1_mode`, `dout2_mode`, `dout3_mode`, `dout4_mode`, `dout5_mode`, `dout6_mode`, `dout7_mode`, `d_dqs_mode`.

DMA configuration, event, and interrupt-set fields:

`outfifo_empty`, `infifo_full`, `dma_seg_trans_en`, `rx_seg_trans_clr_en`, `tx_seg_trans_clr_en`, `rx_eof_en`, `dma_rx_ena`, `dma_tx_ena`, `rx_afifo_rst`, `buf_afifo_rst`, `dma_afifo_rst`, `infifo_full_err`, `outfifo_empty_err`, `ex_qpi`, `en_qpi`, `cmd7`, `cmd8`, `cmd9`, `cmda`, `rd_dma_done`, `wr_dma_done`, `rd_buf_done`, `wr_buf_done`, `trans_done`, `dma_seg_trans_done`, `seg_magic_err`, `buf_addr_err`, `cmd_err`, `mst_rx_afifo_wfull_err`, `mst_tx_afifo_rempty_err`, `app2`, `app1`, `infifo_full_err_int_set`, `outfifo_empty_err_int_set`, `ex_qpi_int_set`, `en_qpi_int_set`, `cmd7_int_set`, `cmd8_int_set`, `cmd9_int_set`, `cmda_int_set`, `rd_dma_done_int_set`, `wr_dma_done_int_set`, `rd_buf_done_int_set`, `wr_buf_done_int_set`, `trans_done_int_set`, `dma_seg_trans_done_int_set`, `seg_magic_err_int_set`, `buf_addr_err_int_set`, `cmd_err_int_set`, `mst_rx_afifo_wfull_err_int_set`, `mst_tx_afifo_rempty_err_int_set`, `app2_int_set`, `app1_int_set`.

Slave, buffer, protocol, clock-gate, and version fields:

`data_buf`, `clk_mode`, `clk_mode_13`, `rsck_data_out`, `rddma_bitlen_en`, `wrdma_bitlen_en`, `rdbuf_bitlen_en`, `wrbuf_bitlen_en`, `dma_seg_magic_value`, `slave_mode`, `soft_reset`, `usr_conf`, `data_bitlen`, `last_command`, `last_addr`, `clk_en`, `mst_clk_active`, `mst_clk_sel`, `date`.

## Interrupt, callback, and power boundaries

| External/private symbol family | Why SPI calls it | Ordering constraint |
|---|---|---|
| `esp_intr_alloc*`, interrupt enable/disable/free | install and control the role ISR | allocate after host context exists; free before context |
| `gdma_new_channel`, `gdma_connect`, callbacks/start/stop/delete | supply descriptor transport | RX prepared before TX/SPI start; stop before free |
| `spi_bus_lock_*` | arbitrate master devices and polling/ISR work | device registered before request; idle before unregister |
| GPIO matrix/IO-MUX calls | route SCLK/CS/data | claim/validate before HAL starts |
| FreeRTOS queues/semaphores | transaction/result ownership and blocking | ISR uses only ISR-safe variants |
| PM lock/clock-tree calls | keep source frequency stable during transfers | acquire before active transfer; release after idle |
| sleep-retention registration | preserve supported register state | create after allocation; destroy before context free |

Bus-lock boundary functions encountered in master sequences:

| Function | Meaning |
|---|---|
| `spi_bus_lock_get_by_id()` | Resolve the lock object for a host. |
| `spi_bus_lock_register_dev()` / `spi_bus_lock_unregister_dev()` | Add/remove a master device from arbitration. |
| `spi_bus_lock_get_dev_id()` | Obtain the lock's stable identifier for a registered device. |
| `spi_bus_lock_acquire_start()` / `spi_bus_lock_acquire_end()` | Begin/finish exclusive device acquisition. |
| `spi_bus_lock_get_acquiring_dev()` | Return the device currently granted hardware. |
| `spi_bus_lock_bg_request()` / `spi_bus_lock_bg_clear_req()` | Add/clear a device's queued background request. |
| `spi_bus_lock_bg_req_exist()` | Test whether background work remains. |
| `spi_bus_lock_bg_check_dev_req()` / `spi_bus_lock_bg_check_dev_acq()` | Check request/acquisition state during ISR scheduling. |
| `spi_bus_lock_bg_entry()` / `spi_bus_lock_bg_exit()` | Enter/leave background service ownership. |
| `spi_bus_lock_wait_bg_done()` | Wait for background work to quiesce. |
| `spi_bus_lock_set_bg_control()` | Install callbacks that enable/disable background ISR service. |
| `spi_bus_lock_touch()` | Notify the lock that scheduling state changed. |

`spi_flash_cache_enabled()` is an external cache-state probe used to enforce cache/IRAM-safe behavior; it does not access the GP-SPI data path.

## Technical keyword linkage

| Code keyword | TRM keyword/register | Read next |
|---|---|---|
| `spi_hal_setup_trans`, `spi_ll_set_command/address/dummy` | master phase state machine, `SPI_USER*` | [Master state machine](../01_technical_reference_manual/08_master_state_machine_and_sequences.md) |
| `spi_dma_*`, `spicommon_dma_*` | DMA-controlled transfer, `SPI_DMA_CONF` | [GDMA transfer](../01_technical_reference_manual/06_gdma_controlled_transfers.md) |
| `spi_get_timing` (unsupported public compatibility helper on ESP32-S3), `spi_hal_cal_timing` (used internally) | timing compensation, DIN mode/number | [Timing compensation](../01_technical_reference_manual/11_timing_compensation_and_spi2_spi3_differences.md) |
| `spi_intr`, HAL interrupt masks | master/slave interrupts | [Interrupts](../01_technical_reference_manual/12_interrupts.md) |
| `spi_slave_hd_*` | slave commands and segmented transfer | [Slave protocols](../01_technical_reference_manual/09_slave_protocols_and_segmented_transfers.md) |
| `spi_slave_hd_*_buffer`, `SPI_EV_*`, `SPI_CMD_HD_*` | shared registers, slave-HD commands/events | [Slave-HD API crosswalk](../02_programming_guide/10_slave_hd_dma_callbacks_shared_registers_and_api_crosswalk.md) |
| `spi_bus_lock_*` | no direct register; software arbitration | [Ownership](02_lifecycle_ownership_and_cleanup.md) |
| `spicommon_bus_initialize_io` | FSPI/SPI3 bus signals | [Signals](../01_technical_reference_manual/03_data_modes_and_bus_signals.md) |

Reciprocal collection index: [TRM overview](../01_technical_reference_manual/01_overview_glossary_and_features.md), [CPU transfers](../01_technical_reference_manual/05_cpu_controlled_transfers.md), [register summary](../01_technical_reference_manual/13_register_summary_and_access_rules.md), and [control/clock/timing registers](../01_technical_reference_manual/14_control_clock_timing_and_phase_registers.md).

---

### Summary Section (Summary of Notes)

Public APIs define ownership and sequencing; private functions validate and schedule; HAL groups hardware operations; ESP32-S3 LL implements every field write. Trace an operation downward only to explain behavior—application code must stop at the public layer.
