# Cornell Notes

## Topic: Full Duplex, Half Duplex, Dual, Quad, and Octal Modes

## Date: 20/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- Which flags select line width per phase?
- Why are multiline transfers half duplex?
- Which ESP32-S3 host supports octal operation?

---

### Notes Section (Main Notes)

| Desired behavior | Device/transaction configuration |
|---|---|
| one-line full duplex | default device; TX/RX buffers may both be present |
| one-line half duplex | `SPI_DEVICE_HALFDUPLEX` |
| dual data | half-duplex device + `SPI_TRANS_MODE_DIO` |
| quad data | half-duplex device + `SPI_TRANS_MODE_QIO` |
| octal data | GP-SPI2 pins + half-duplex device + `SPI_TRANS_MODE_OCT` |
| multiline address | DIO/QIO address flag or `SPI_TRANS_MULTILINE_ADDR` |
| multiline command | `SPI_TRANS_MULTILINE_CMD` |
| shared bidirectional line | `SPI_DEVICE_3WIRE` with valid routing |

Configure every physical line in `spi_bus_config_t`. The transaction flags only select the line mode; they cannot create missing pins. Variable command/address/dummy widths require `spi_transaction_ext_t` and their respective variable flags.

Active-high CS, clock-as-CS, no-dummy, DDR clock, and bit-order flags change hardware framing and must match the peer. Unsupported host/flag combinations fail validation rather than silently downgrade.

#### Related notes

- [TRM data modes](../01_technical_reference_manual/03_data_modes_and_bus_signals.md)
- [Public flags](15_spi_apis.md#public-flags-and-function-like-macros)

---

### Summary Section (Summary of Notes)

Line mode is phase-specific, while pin availability is bus-wide. On ESP32-S3 only GP-SPI2 provides the octal FSPI path.
