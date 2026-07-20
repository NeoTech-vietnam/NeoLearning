# Cornell Notes

## Topic: ESP-IDF GP-SPI Driver Scope, Terminology, and Features

## Date: 20/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- Which ESP-IDF drivers correspond to TRM Chapter 30?
- What are host, bus, device, and transaction objects?
- Which adjacent SPI components are outside this collection?

---

### Notes Section (Main Notes)

ESP-IDF v6.0.1 exposes three GP-SPI application interfaces:

| Role | Public header | Primary object |
|---|---|---|
| Master | `driver/spi_master.h` | bus plus one or more `spi_device_handle_t` objects |
| Full-duplex slave | `driver/spi_slave.h` | one exclusive slave host with queued transactions |
| Half-duplex slave protocol | `driver/spi_slave_hd.h` | one exclusive HD slot with separate RX/TX services |

`driver/spi_common.h` supplies shared host, clock, bus-pin, and DMA types. SPI flash/PSRAM uses the separate MSPI stack; SDSPI and SPI LCD are clients layered on GP-SPI rather than part of the core driver.

The public driver owns validation, object lifetime, GPIO routing, interrupts, DMA, queues, locks, callbacks, and error conversion. Private driver functions implement scheduling. HAL converts object/transaction configuration into portable hardware operations. ESP32-S3 LL writes the registers described in TRM Chapter 30.

Guide sources at ESP-IDF tag `v6.0.1`: [spi_features.rst](https://github.com/espressif/esp-idf/blob/v6.0.1/docs/en/api-reference/peripherals/spi_features.rst), [spi_master.rst](https://github.com/espressif/esp-idf/blob/v6.0.1/docs/en/api-reference/peripherals/spi_master.rst), [spi_slave.rst](https://github.com/espressif/esp-idf/blob/v6.0.1/docs/en/api-reference/peripherals/spi_slave.rst), and [spi_slave_hd.rst](https://github.com/espressif/esp-idf/blob/v6.0.1/docs/en/api-reference/peripherals/spi_slave_hd.rst).

#### Related notes

- [TRM overview](../01_technical_reference_manual/01_overview_glossary_and_features.md)
- [Layer ownership](../03_use_cases/01_resource_and_software_layer_relationships.md)

---

### Summary Section (Summary of Notes)

Select exactly one GP-SPI role per host. Common types describe the physical bus; role-specific drivers own the state machine and scheduling policy.
