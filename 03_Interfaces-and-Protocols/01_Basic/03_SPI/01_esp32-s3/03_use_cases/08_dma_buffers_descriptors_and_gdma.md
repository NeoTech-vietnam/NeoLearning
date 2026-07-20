# Cornell Notes

## Topic: DMA Buffers, Descriptors, Bounce Buffers, and GDMA

## Date: 20/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- How does a public buffer become a GDMA chain?
- When are bounce buffers allocated?
- What is the reset/start/completion order?

---

### Notes Section (Main Notes)

`setup_priv_desc()` or the slave equivalent checks DMA capability and alignment. It uses the original buffer when legal, allocates a TX/RX bounce buffer when policy permits, and records both public and DMA-visible addresses. `spicommon_dma_desc_setup_link()` is the common helper that divides a buffer into descriptor-sized links and marks ownership/EOF.

Do not infer descriptor construction from the name `spi_dma_append()`: that legacy helper only retriggers a preloaded DMA link after descriptors were appended. On ESP32-S3, `SOC_GDMA_SUPPORTED` is true, `spi_dma.h` maps the append operation to `gdma_append`, and the legacy `spi_dma_*`/`spi_dma_ll_*` implementation branch is not part of the target's executed path.

```text
validate buffer → allocate/copy bounce if needed → build RX/TX descriptors
→ reset SPI DMA FIFOs and GDMA channels → enable SPI DMA
→ start RX GDMA → start TX GDMA → start/arm SPI
→ wait SPI done and required GDMA EOF → inspect errors
→ copy RX bounce data → free private descriptors/buffers
```

RX starts first so incoming bytes always have storage. Error checks inspect SPI FIFO error interrupts and GDMA descriptor state. Recovery resets both endpoints before descriptors are reused. Segmented master and slave-HD append paths maintain pools and link/recycle descriptors incrementally.

`spi_bus_dma_memory_alloc()` is the safest allocation helper when alignment constraints are unknown. A long transfer is not proof of DMA use; initialization must select a DMA channel.

#### Related notes

- [TRM GDMA transfer](../01_technical_reference_manual/06_gdma_controlled_transfers.md)
- [TRM bit order and transfer modes](../01_technical_reference_manual/04_bit_order_and_transfer_modes.md)
- [TRM DMA/interrupt/status registers](../01_technical_reference_manual/15_dma_interrupt_status_and_data_buffer_registers.md)
- [Slave DMA restrictions](../02_programming_guide/08_slave_dma_timing_restrictions_and_known_issues.md)
- [DMA helper symbols](15_spi_apis.md#dma-helper-functions)

---

### Summary Section (Summary of Notes)

DMA correctness is an ownership protocol across public buffers, optional bounce buffers, descriptor chains, SPI FIFO state, and GDMA completion.
