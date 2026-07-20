# Cornell Notes

## Topic: SPI Lifecycle, Ownership, and Cleanup

## Date: 20/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- What are the valid master and slave lifecycle sequences?
- Which objects own queues, DMA, ISR, and pins?
- How should partial initialization roll back?

---

### Notes Section (Main Notes)

Master sequence:

```text
spi_bus_initialize → spi_bus_add_device → transfer APIs
→ drain results/release bus → spi_bus_remove_device → spi_bus_free
```

Normal slave sequence:

```text
spi_slave_initialize → queue/transmit/get-result
→ optional disable/enable → spi_slave_free
```

Slave-HD sequence:

```text
spi_slave_hd_init → queue/append/read/write/get-result
→ optional disable/enable → spi_slave_hd_deinit
```

Initialization validates first, then claims the host, bus lock, GPIO, DMA, queues, HAL, interrupt, and power/sleep resources. Failure labels unwind only resources already acquired, in reverse order. Master device/bus deletion checks ownership constraints; normal-slave free and slave-HD deinit do not inspect queued or active transactions.

Applications should use one cleanup label per owned object and set handles to `NULL` after release. Never call `spi_bus_free()` while devices exist or remove a device with outstanding transactions. Before slave teardown, stop peer clocks/commands and recover every needed descriptor because v6.0.1 does not enforce this precondition.

#### Related notes

- [Bus configuration guide](../02_programming_guide/02_common_bus_resources_and_configuration.md)
- [Master lifecycle guide](../02_programming_guide/04_master_lifecycle_devices_and_bus_ownership.md)
- [TRM resource architecture](../01_technical_reference_manual/02_architecture_and_hardware_resources.md)
- [Common/private lifecycle symbols](15_spi_apis.md#common-driver-and-lifecycle-symbols)

---

### Summary Section (Summary of Notes)

Release in exact reverse ownership order. Master state checks protect device/bus ownership; slave quiescence remains an application responsibility.
