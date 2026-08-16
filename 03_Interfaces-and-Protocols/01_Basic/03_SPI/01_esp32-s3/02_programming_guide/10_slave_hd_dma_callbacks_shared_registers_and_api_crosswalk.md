# Cornell Notes

## Topic: Slave-HD DMA, Callbacks, Shared Registers, and API Crosswalk

## Date: 20/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- How are TX and RX descriptors queued and returned?
- Which events invoke callbacks?
- How are shared registers accessed safely?

---

### Notes Section (Main Notes)

`spi_slave_hd_data_t` carries a data pointer, length, transferred length, and user argument. `spi_slave_hd_queue_trans()` queues it on `SPI_SLAVE_CHAN_TX` or `SPI_SLAVE_CHAN_RX`; `spi_slave_hd_get_trans_res()` returns completed segment-mode descriptors. Append mode uses `spi_slave_hd_append_trans()` and `spi_slave_hd_get_append_trans_res()`.

`spi_slave_hd_callback_config_t` contains event callbacks for buffer, DMA, command, and segment conditions. Non-null callbacks cause the related interrupt to be enabled. Callbacks receive the configured argument, event, and task-woken pointer and must remain ISR-safe.

`spi_slave_hd_write_buffer()`/`spi_slave_hd_read_buffer()` are `void` functions that directly forward the supplied host, address, pointer, and length to HAL/LL copies of the hardware shared-register window. They perform no public-driver bounds or null checks. The documented ranges (`addr < SOC_SPI_MAXIMUM_BUFFER_SIZE` and `len <= SOC_SPI_MAXIMUM_BUFFER_SIZE - addr`) and valid buffers are caller preconditions. These registers are control-plane storage, not substitutes for DMA payload queues.

| Public family | Internal/HAL direction | TRM concept |
|---|---|---|
| init/enable/disable/deinit | slot allocation and `spi_slave_hd_hal_init()` | slave-HD mode and interrupts |
| queue/get | private descriptors and TX/RX queues | DMA single/segmented service |
| append/get-append | GDMA callbacks and descriptor-chain extension | append/segmented flow |
| read/write buffer | `spi_slave_hd_hal_*_buffer()` | shared registers |

Full signatures and every private/HAL/LL symbol are indexed in [the SPI API inventory](../03_use_cases/15_spi_apis.md).

---

### Summary Section (Summary of Notes)

Slave-HD separates control-plane shared registers from data-plane DMA channels. Queue/return ownership and ISR-safe event callbacks are the core programming model; shared-register ranges must be validated by the caller.
