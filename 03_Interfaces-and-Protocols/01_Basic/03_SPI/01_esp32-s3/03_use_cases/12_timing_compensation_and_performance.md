# Cornell Notes

## Topic: Timing Compensation and Performance

## Date: 20/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- How is safe read timing calculated?
- When should dummy cycles or sampling delay be used?
- What limits throughput for short and long transfers?

---

### Notes Section (Main Notes)

Read timing combines SCLK period, peer clock-to-output delay, PCB delay, and IO-MUX/GPIO-matrix delay. On ESP32-S3 v6.0.1 the master driver uses `spi_hal_cal_timing()` and LL internally. Do not use the public compatibility helpers `spi_get_freq_limit()`/`spi_get_timing()` for calculations on this target: their implementation is explicitly unsupported in this release.

Full-duplex reception cannot freely add dummy clocks without changing simultaneous TX framing, so frequency may need reduction. Half-duplex reads can add dummy cycles between output and input phases. Frequency override causes the driver to recalculate device timing before subsequent transfers.

For short transactions, validation, queue operations, ISR/context switches, device reconfiguration, and DMA setup dominate. Use inline data, polling bursts, bus acquisition, and batching. For long transactions, SCLK and DMA bandwidth dominate; avoid copies with compliant buffers.

Measure the realized clock and end-to-end transaction rate rather than inferring throughput from requested SCLK.

#### Related notes

- [TRM timing compensation](../01_technical_reference_manual/11_timing_compensation_and_spi2_spi3_differences.md)
- [TRM CS timing and clock control](../01_technical_reference_manual/10_cs_timing_and_clock_control.md)
- [Master performance guide](../02_programming_guide/06_master_dma_gpio_timing_and_performance.md)
- [Timing helper/HAL/LL inventory](15_spi_apis.md#clocktiming-helpers)

---

### Summary Section (Summary of Notes)

Choose frequency from timing margin, then optimize software overhead according to transaction size. Requested SCLK alone is not an application throughput metric.
