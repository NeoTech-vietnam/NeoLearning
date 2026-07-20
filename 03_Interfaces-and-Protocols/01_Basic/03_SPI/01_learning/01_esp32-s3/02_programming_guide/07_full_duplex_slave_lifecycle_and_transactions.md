# Cornell Notes

## Topic: Full-Duplex Slave Lifecycle and Transactions

## Date: 20/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- How is the normal slave driver initialized and queued?
- Who determines actual transaction length?
- What do enable/disable and free require?

---

### Notes Section (Main Notes)

`spi_slave_initialize()` validates the bus and `spi_slave_interface_config_t`, claims the host, configures pins/DMA, creates transaction and return queues, initializes the slave HAL, and installs the ISR. The slot configuration supplies mode, CS pin, queue size, callbacks, flags, and ISR CPU/flags through common configuration.

`spi_slave_queue_trans()` validates buffers and alignment, creates private DMA descriptors/bounce state, and queues a maximum transaction length. The external master determines actual clocks. On completion `spi_intr()` reads the received bit length, stores it in `trans_len`, invokes callbacks, returns the descriptor, and arms the next queued item. `spi_slave_transmit()` wraps queue + get-result.

`spi_slave_disable()` changes the driver's enabled/disabled state so supported clock/power configuration can change; `spi_slave_enable()` restores it. These calls reject an already-disabled/already-enabled transition, but neither waits for application transactions to return.

`spi_slave_free()` checks that the host is an initialized slave, then directly deletes queues and releases the interrupt, DMA, pins, power lock, and common bus context. It does **not** test whether a transaction is active or queued. Therefore the application must stop the external master and recover every owned descriptor before calling it; this is a safety precondition, not a driver-enforced `ESP_ERR_INVALID_STATE` check.

#### Related notes

- [TRM slave flow](../01_technical_reference_manual/09_slave_protocols_and_segmented_transfers.md)
- [Full-duplex slave sequence](../03_use_cases/09_full_duplex_slave_sequences.md)

---

### Summary Section (Summary of Notes)

Queue capacity, not expected clocks, before the master starts. Treat returned `trans_len` as authoritative. Stop the master and recover all descriptors before free because v6.0.1 teardown does not enforce quiescence.
