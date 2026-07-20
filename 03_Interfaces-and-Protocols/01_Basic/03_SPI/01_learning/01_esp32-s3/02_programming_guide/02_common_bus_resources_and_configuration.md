# Cornell Notes

## Topic: Common Bus Resources and Configuration

## Date: 20/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- What does `spi_bus_config_t` configure?
- When are IO MUX, GPIO matrix, DMA, and interrupts allocated?
- Which resources must be released on failure?

---

### Notes Section (Main Notes)

`spi_bus_config_t` declares MOSI/MISO/SCLK and optional quad/octal pins, maximum transfer size, bus flags, ISR CPU, interrupt flags, and data-line idle behavior. A negative pin disables that signal. The driver checks output/input capability, host limits, and whether all requested signals match the dedicated IO-MUX set; otherwise it routes through the GPIO matrix.

For master, `spi_bus_initialize(host, &buscfg, dma_chan)` claims the common host, initializes the bus lock, sets pins, creates DMA context when requested, and records maximum transfer size. The master role object, HAL context, and ISR are initialized lazily by the first `spi_bus_add_device()`. `spi_bus_free()` succeeds only after all devices are removed. Slave initialization performs common setup and installs the exclusive slave role in one public call.

On ESP32-S3, DMA selection is exactly `SPI_DMA_DISABLED` or `SPI_DMA_CH_AUTO`. The explicit `SPI_DMA_CH1` and `SPI_DMA_CH2` enumerators are compiled only for the original ESP32 target; passing an arbitrary channel on an ESP32-S3 fails validation. With `SPI_DMA_CH_AUTO`, the driver allocates separate GP-SPI-triggered GDMA TX and RX channels. `spi_bus_dma_memory_alloc()` returns memory satisfying the driver's DMA alignment/capability constraints. `spi_bus_get_max_transaction_len()` reports the realized limit after initialization.

Rollback must unwind in reverse order: interrupt/role object → DMA channel/context → GPIO/host claim → bus lock/context. This sequence is implemented by private common-driver cleanup, not by application code.

#### Related notes

- [Hardware resources](../01_technical_reference_manual/02_architecture_and_hardware_resources.md)
- [Lifecycle and rollback](../03_use_cases/02_lifecycle_ownership_and_cleanup.md)

---

### Summary Section (Summary of Notes)

Bus configuration is resource ownership, not only pin assignment. Initialize once, add role-specific objects, remove them, then free the bus.
