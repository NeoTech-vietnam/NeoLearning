# Cornell Notes

## Topic: SPI Debugging and Common Failures

## Date: 20/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- Which failures come from lifecycle, routing, phase, DMA, or timing mistakes?
- What evidence distinguishes requested from actual behavior?
- What is the safest recovery order?

---

### Notes Section (Main Notes)

| Symptom | Likely cause | Check/fix |
|---|---|---|
| `ESP_ERR_INVALID_STATE` on init/free | host already owned, devices/outstanding work remain | inspect lifecycle; drain/remove in reverse order |
| invalid argument on queue | phase flags, missing pins, length, or DMA alignment conflict | compare bus/device/transaction configuration |
| correct TX, bad RX at high speed | sampling delay or GPIO matrix path | lower clock, use IO MUX, calculate timing/dummy |
| shifted/garbled bits | CPOL/CPHA, bit order, or byte-order mismatch | capture SCLK/CS/data and compare phase edges |
| CS toggles unexpectedly | no bus acquisition or missing keep-active rules | acquire bus around the sequence |
| DMA underflow/overflow | descriptor length/ownership mismatch | inspect SPI and GDMA status; reset both paths |
| slave loses first frame | master starts before descriptor is armed | add ready GPIO and prequeue |
| queued API blocks forever | queue full, result not drained, callback/ISR fault | retrieve results; inspect ISR/IRAM restrictions |
| crash during flash operation | ISR callback/data not IRAM/internal | satisfy the complete cache-safe chain |
| slave-HD no progress | peer does not implement HD command protocol or wrong mode | verify command values and segment/append selection |

Debug from the outside inward: logic-analyzer waveform → public object state → return codes/logs → SPI/GDMA interrupt status → LL/register configuration. Do not “fix” driver-managed state with direct register writes.

Recovery order for DMA faults is stop/disable scheduling, preserve the failing descriptor for diagnosis, clear status, reset SPI FIFO and GDMA, rebuild descriptors, then rearm.

#### Related notes

- [Register data path](../01_technical_reference_manual/15_dma_interrupt_status_and_data_buffer_registers.md)
- [TRM timing and host differences](../01_technical_reference_manual/11_timing_compensation_and_spi2_spi3_differences.md)
- [Slave restrictions and known issues](../02_programming_guide/08_slave_dma_timing_restrictions_and_known_issues.md)
- [API error paths](15_spi_apis.md#validation-rollback-and-deletion-rules)

---

### Summary Section (Summary of Notes)

Most SPI bugs fall into five axes: ownership, phase framing, routing/timing, buffer/DMA lifetime, or ISR context. Diagnose in that order before inspecting raw registers.
