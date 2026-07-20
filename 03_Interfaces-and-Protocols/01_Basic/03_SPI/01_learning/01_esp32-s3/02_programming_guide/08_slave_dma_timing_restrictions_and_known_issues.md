# Cornell Notes

## Topic: Slave DMA, Timing, Restrictions, and Known Issues

## Date: 20/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- Which alignment and length rules apply to slave DMA?
- Why must the master wait until the slave is ready?
- How are DMA errors recovered?

---

### Notes Section (Main Notes)

Slave DMA RX buffers require DMA-capable memory, word alignment, and lengths compatible with the driver's descriptor rules. Automatic alignment flags allow bounce buffers where supported; manual/strict paths return an error. TX/RX capacity must cover the largest peer transaction because external CS/SCLK determine the actual length.

The CPU must queue and arm a descriptor before the peer asserts CS. A separate ready GPIO is the usual protocol-level handshake. Prequeueing several descriptors reduces dead time between transfers.

Slave output timing is more constrained than master timing because the external master supplies SCLK. GPIO-matrix delay and duty-cycle distortion reduce the reliable clock. DMA/FIFO error recovery freezes/restores CS when required, resets the slave/FIFO and DMA channel, rebuilds descriptors, and rearms the transaction; clearing an error interrupt alone is insufficient.

Use one task per slave peripheral or explicit application serialization. Callback code runs in ISR context. DMA buffers and callbacks needed while cache is disabled must reside in internal memory/IRAM.

#### Related notes

- [DMA/GDMA sequence](../03_use_cases/08_dma_buffers_descriptors_and_gdma.md)
- [Debugging slave failures](../03_use_cases/14_debugging_and_common_failures.md)

---

### Summary Section (Summary of Notes)

Slave reliability depends on arming before CS, provisioning capacity for peer clocks, respecting DMA alignment, and using a ready handshake at the application protocol layer.
