# Cornell Notes

## Topic: Master Device and Transaction Model

## Date: 20/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- Which settings belong to a device versus a transaction?
- What happens inside `spi_bus_add_device()` and transaction validation?
- How is configuration applied before hardware starts?

---

### Notes Section (Main Notes)

`spi_bus_add_device()` validates CS index, queue size, mode, timing, flags, and clock source; allocates the device and queues; calculates clock/timing registers; registers the device with the bus lock; and returns an opaque handle. Failure unregisters and frees partial state.

Device configuration holds stable peer properties: SPI mode, SCLK, CS, CS setup/hold, command/address defaults, queue depth, callback pointers, and duplex/bit-order flags. A transaction holds volatile phase lengths, buffers, command/address values, line-mode flags, optional frequency override, and user context.

```mermaid
sequenceDiagram
    participant App
    participant Driver
    participant HAL
    participant LL
    App->>Driver: queue/transmit(handle, transaction)
    Driver->>Driver: check_trans_valid + setup_priv_desc
    Driver->>HAL: setup_device + setup_trans
    HAL->>LL: clock, mode, CS, phases, lengths, line widths
    LL->>LL: write FIFO or enable DMA; set SPI_USR
```

The private descriptor preserves the public transaction pointer while adding bounce buffers and DMA metadata. Result collection copies RX bounce data back and destroys only private state.

#### Related notes

- [Programming-guide phase model](../02_programming_guide/03_master_transaction_phases_and_line_modes.md)
- [TRM bit order and transfer modes](../01_technical_reference_manual/04_bit_order_and_transfer_modes.md)
- [TRM master state machine](../01_technical_reference_manual/08_master_state_machine_and_sequences.md)
- [Master call sequences](15_spi_apis.md#master-call-sequences)

---

### Summary Section (Summary of Notes)

Stable peer settings live on the device; per-transfer phase/data settings live on the transaction; the private descriptor connects them to HAL/DMA execution.
