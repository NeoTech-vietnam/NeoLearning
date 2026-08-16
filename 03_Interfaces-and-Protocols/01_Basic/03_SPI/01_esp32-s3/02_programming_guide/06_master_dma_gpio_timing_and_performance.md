# Cornell Notes

## Topic: Master DMA, GPIO Routing, Timing, and Performance

## Date: 20/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- What must DMA buffers satisfy?
- Why does GPIO-matrix routing reduce timing margin?
- Which settings affect transaction throughput and cache safety?

---

### Notes Section (Main Notes)

DMA buffers should be DMA-capable, correctly aligned, and sized to the configured transfer. When they are not, the master driver may allocate/copy a temporary DMA buffer unless manual-alignment policy forbids it. `SPI_TRANS_DMA_BUFFER_ALIGN_MANUAL` requests validation instead of automatic bounce-buffer allocation; PSRAM use requires the supported flag/capability path.

IO-MUX routing has less input delay than GPIO matrix routing. The master driver internally calls HAL timing calculation using routing and `input_delay_ns`. Although the headers expose `spi_get_freq_limit()` and `spi_get_timing()`, their v6.0.1 implementation warns that they are temporarily unsupported on ESP32-S3 (`spi_get_freq_limit()` returns zero and `spi_get_timing()` does not produce a target result). The device's requested clock is quantized to hardware divider values; `spi_device_get_actual_freq()` reports the result in kHz.

For many short transactions, queue/context-switch/setup time dominates. Polling or batching reduces overhead. For long transfers, SCLK and DMA descriptor setup dominate. A no-DMA transaction cannot exceed the 64-byte CPU buffer.

`CONFIG_SPI_MASTER_ISR_IN_IRAM`, `CONFIG_SPI_MASTER_IN_IRAM`, `ESP_INTR_FLAG_IRAM`, internal-memory queues/data, and IRAM-safe callbacks determine whether transfers continue while flash cache is disabled. Mixing only some of these requirements can still crash or stall.

#### Related notes

- [TRM timing compensation](../01_technical_reference_manual/11_timing_compensation_and_spi2_spi3_differences.md)
- [TRM GDMA-controlled transfer](../01_technical_reference_manual/06_gdma_controlled_transfers.md)
- [Timing/performance use case](../03_use_cases/12_timing_compensation_and_performance.md)

---

### Summary Section (Summary of Notes)

Use IO MUX when possible, inspect realized frequency, make DMA buffers compliant, and optimize transaction count before chasing raw clock rate.
