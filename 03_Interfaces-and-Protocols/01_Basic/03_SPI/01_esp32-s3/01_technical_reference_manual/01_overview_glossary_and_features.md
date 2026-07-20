# Cornell Notes

## Topic: ESP32-S3 GP-SPI Overview, Glossary, and Features

## Date: 20/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- Which ESP32-S3 SPI controllers are application-usable?
- What do transaction, transfer, CPU-controlled, and DMA-controlled mean?
- Which modes and limits apply to GP-SPI2 and GP-SPI3?

---

### Notes Section (Main Notes)

The ESP32-S3 contains SPI0, SPI1, GP-SPI2, and GP-SPI3. SPI0/SPI1 form the memory-SPI subsystem used by flash and PSRAM; this collection covers only GP-SPI2 and GP-SPI3 from TRM Chapter 30. ESP-IDF calls a controller a **host**, a configured peer a **device**, and one CS assertion with its command/address/dummy/data phases a **transaction**.

| Concept | Hardware meaning | ESP-IDF relationship |
|---|---|---|
| CPU-controlled | CPU moves up to 64 bytes through `SPI_W0_REG`…`SPI_W15_REG` | Master/slave drivers when DMA is disabled or unnecessary |
| DMA-controlled | GDMA descriptors feed or drain the SPI FIFO | Selected by `spi_bus_initialize()`/slave initialization DMA argument |
| Full duplex | MOSI and MISO data phases overlap | Default master and normal slave model |
| Half duplex | output and input phases occur sequentially | `SPI_DEVICE_HALFDUPLEX`; also the separate slave-HD protocol |
| Single/Dual/Quad/Octal | 1/2/4/8 data lines per clock | Transaction flags plus configured bus pins |
| Transaction | One atomic CS-active command/address/dummy/data sequence | `spi_transaction_t` or slave transaction descriptor |

GP-SPI2 exposes FSPI signals through IO MUX or GPIO matrix and supports octal modes. GP-SPI3 uses the GPIO matrix and supports up to quad modes. Both support master/slave operation, configurable CPOL/CPHA, MSB/LSB order, CPU/GDMA data movement, multiple CS outputs in master mode, and transfer-completion interrupts. The practical frequency depends on clock source, divider realizability, routing delay, input timing, and slave characteristics—not only the nominal TRM maximum.

TRM source: [ESP32-S3 TRM v1.8](https://documentation.espressif.com/esp32-s3_technical_reference_manual_en.pdf), Chapter 30 §§30.1–30.3, PDF pages 1106–1109.

#### Related notes

- [Driver scope and terminology](../02_programming_guide/01_driver_scope_terminology_and_features.md)
- [Resource relationships](../03_use_cases/01_resource_and_software_layer_relationships.md)
- [Complete API inventory](../03_use_cases/15_spi_apis.md)

---

### Summary Section (Summary of Notes)

Use GP-SPI2/3 for application SPI. Choose host, role, line mode, routing, and CPU/DMA path separately; each choice maps to different driver objects and register fields.
