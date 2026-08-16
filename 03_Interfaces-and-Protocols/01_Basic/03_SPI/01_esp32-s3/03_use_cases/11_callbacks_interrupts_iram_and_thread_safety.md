# Cornell Notes

## Topic: Callbacks, Interrupts, IRAM, and Thread Safety

## Date: 20/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- Which callbacks run in ISR context?
- What must be in internal memory during cache-disabled periods?
- Which APIs are thread-safe and which need serialization?

---

### Notes Section (Main Notes)

Master pre/post callbacks, normal-slave pre/post callbacks, and slave-HD event callbacks execute in interrupt context. They must not block, allocate ordinary heap, log through non-ISR-safe paths, or call task-only SPI APIs. Use the task-woken mechanism where supplied and defer work to a queue/task.

With IRAM-safe interrupt flags, the ISR, every callback and callee, queues/objects touched by the ISR, DMA descriptors, and active buffers must remain accessible while flash cache is disabled. `CONFIG_SPI_MASTER_ISR_IN_IRAM` covers the ISR path; `CONFIG_SPI_MASTER_IN_IRAM` expands driver placement but cannot relocate application callbacks/data automatically.

The master bus lock serializes devices and public master APIs provide task-level protection within documented limits. A device should normally be owned by one task when mixing polling/queued operations. Slave drivers recommend one controlling task per host; callbacks and task code still need application synchronization for shared state.

#### Related notes

- [TRM interrupts](../01_technical_reference_manual/12_interrupts.md)
- [Interrupt API symbols](15_spi_apis.md#interrupt-callback-and-power-boundaries)

---

### Summary Section (Summary of Notes)

Treat callbacks as minimal ISR adapters. IRAM safety is an end-to-end property of code and data, and driver locking does not replace application ownership rules.
