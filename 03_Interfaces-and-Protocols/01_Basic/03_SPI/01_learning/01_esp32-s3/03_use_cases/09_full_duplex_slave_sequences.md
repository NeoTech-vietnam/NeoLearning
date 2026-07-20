# Cornell Notes

## Topic: Full-Duplex Slave Sequences

## Date: 20/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- How is a slave descriptor armed and completed?
- How is actual length reported?
- How should the application coordinate with the external master?

---

### Notes Section (Main Notes)

```mermaid
sequenceDiagram
    participant S as Slave task
    participant D as Slave driver/ISR
    participant H as HAL/GDMA
    participant M as External master
    S->>D: spi_slave_queue_trans(max length, buffers)
    D->>H: prepare private descriptor and arm hardware
    D-->>M: optional ready GPIO asserted by application
    M->>H: assert CS and clock data
    H-->>D: slave done + received bit length
    D->>D: post callback; return descriptor; arm next
    S->>D: spi_slave_get_trans_result
    D-->>S: descriptor with trans_len
```

Queue before signaling ready. Size RX/TX for the largest permitted peer transaction. `trans_len` reports the actual bounded result; if the peer clocks more than capacity, only the configured portion is safe.

`spi_slave_transmit()` is appropriate for one-at-a-time protocols. Prequeueing several descriptors minimizes gaps. The application's ready GPIO is separate from the SPI driver's pin configuration and must follow protocol-level ownership.

#### Related notes

- [Slave programming guide](../02_programming_guide/07_full_duplex_slave_lifecycle_and_transactions.md)
- [TRM CPU-controlled slave path](../01_technical_reference_manual/05_cpu_controlled_transfers.md)
- [TRM master/slave data flow](../01_technical_reference_manual/07_master_slave_data_flow.md)
- [Slave private functions](15_spi_apis.md#full-duplex-slave-private-functions)

---

### Summary Section (Summary of Notes)

The slave prepares capacity; the master supplies actual timing. Queue first, then advertise readiness, and trust returned `trans_len`.
