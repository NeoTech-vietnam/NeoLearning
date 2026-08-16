# Cornell Notes

## Topic: Polling Transactions and Exclusive Bus Ownership

## Date: 20/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- What does polling bypass?
- Why should a polling burst acquire the bus?
- Which pairing rules prevent deadlock?

---

### Notes Section (Main Notes)

Polling still validates, creates private state, configures HAL/DMA, and starts the same hardware. It bypasses device transaction queues and completion ISR scheduling; the calling task spins until `spi_hal_usr_is_done()` and then performs post-processing.

```c
ESP_ERROR_CHECK(spi_device_acquire_bus(dev, portMAX_DELAY));
for (size_t i = 0; i < count; ++i) {
    ESP_ERROR_CHECK(spi_device_polling_transmit(dev, &transactions[i]));
}
spi_device_release_bus(dev);
```

Before polling, retrieve every queued interrupt transaction. Every successful `spi_device_polling_start()` must be paired with `spi_device_polling_end()`. `SPI_TRANS_CS_KEEP_ACTIVE` requires bus acquisition so another device cannot be scheduled while CS is intentionally held.

Polling is useful for short, latency-sensitive bursts. It wastes CPU time for long transfers and does not eliminate DMA setup cost.

#### Related notes

- [Master ownership guide](../02_programming_guide/04_master_lifecycle_devices_and_bus_ownership.md)
- [Interrupt and polling guide](../02_programming_guide/05_interrupt_queued_and_polling_transactions.md)
- [TRM CPU-controlled path](../01_technical_reference_manual/05_cpu_controlled_transfers.md)
- [Private polling functions](15_spi_apis.md#master-private-functions)

---

### Summary Section (Summary of Notes)

Polling changes the waiting mechanism, not the hardware setup. Drain queued work, acquire once for a burst, and always end/release what was started/acquired.
