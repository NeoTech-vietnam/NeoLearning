# Cornell Notes

## Topic: Slave-HD Protocol and Lifecycle

## Date: 20/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- What services does slave-HD hardware provide?
- How does its lifecycle differ from normal slave mode?
- What must the master implement?

---

### Notes Section (Main Notes)

Slave-HD is a fixed half-duplex command protocol with shared-register access, DMA read/write services, and command-triggered events. It is not a generic half-duplex version of `spi_slave_*`; the master must implement the documented command values and termination behavior.

`spi_slave_hd_init()` consumes `spi_bus_config_t` and `spi_slave_hd_slot_config_t`, claims the host, configures protocol/segment mode, allocates queues and DMA, initializes HAL, registers callbacks, installs interrupt handling, and starts enabled. `spi_slave_hd_disable()`/`enable()` provide a controlled inactive interval.

`spi_slave_hd_deinit()` only validates that a slot object exists, then deletes queues/semaphores and releases hardware resources. It does **not** inspect queued or active descriptors. The application must first prevent master commands and recover every transaction it needs; otherwise teardown can discard software queue state. As with normal slave free, quiescence is an application discipline rather than a checked API state.

Append mode continuously extends DMA chains. Segment mode exchanges bounded descriptor sequences terminated by protocol commands. The selected mode changes ISR/GDMA callback behavior and therefore cannot be changed as an ordinary transaction property.

#### Related notes

- [TRM slave protocols](../01_technical_reference_manual/09_slave_protocols_and_segmented_transfers.md)
- [Slave-HD sequences](../03_use_cases/10_slave_hd_and_segmented_transfers.md)

---

### Summary Section (Summary of Notes)

Use slave-HD only as a matched protocol on both endpoints. Initialize its mode once and queue channel data. Prevent new master commands and recover descriptors before deinit because v6.0.1 does not enforce that ordering.
