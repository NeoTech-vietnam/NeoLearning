# Cornell Notes

## Topic: Interrupt, Queued, and Polling Master Transactions

## Date: 20/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- How do queued and polling transactions execute?
- Which synchronous helpers wrap the lower-level APIs?
- Why must modes not overlap on one device?

---

### Notes Section (Main Notes)

`spi_device_queue_trans()` validates and prepares a private transaction, enqueues it, requests the bus lock background service, and enables the ISR. `spi_intr()` acquires the scheduled device, configures HAL/DMA, starts hardware, completes the previous transaction, invokes callbacks, and places the public descriptor on the return queue. `spi_device_get_trans_result()` blocks for that returned descriptor and frees temporary bounce-buffer state.

`spi_device_transmit()` is queue + get-result. Polling mode uses `spi_device_polling_start()` to acquire/prepare/start directly and `spi_device_polling_end()` to wait, fetch, clean up, and release scheduling state. `spi_device_polling_transmit()` wraps both.

Queued and polling work must not be active simultaneously for the same device. Before entering polling, collect all queued results. Always pair polling start/end, even on application errors. A series of polling transactions should acquire the bus once to avoid repeated arbitration overhead.

Callbacks run around the hardware transaction in ISR context. They cannot block or call ordinary task-only APIs.

#### Related notes

- [Queued ISR sequence](../03_use_cases/05_interrupt_queued_master_sequence.md)
- [Polling sequence](../03_use_cases/06_polling_and_exclusive_bus_sequence.md)

---

### Summary Section (Summary of Notes)

Queued mode trades latency for task availability; polling mode trades CPU time for lower overhead. Synchronous APIs are wrappers, not different hardware paths.
