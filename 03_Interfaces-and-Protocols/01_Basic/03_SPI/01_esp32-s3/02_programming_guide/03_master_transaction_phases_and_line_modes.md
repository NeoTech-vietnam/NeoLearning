# Cornell Notes

## Topic: Master Transaction Phases and Line Modes

## Date: 20/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- How does `spi_transaction_t` map to hardware phases?
- When is `spi_transaction_ext_t` required?
- Which flags select duplex and line width?

---

### Notes Section (Main Notes)

A master transaction can contain command, address, dummy, write, and read phases. `spi_device_interface_config_t` provides default command/address widths, clock, SPI mode, CS timing, queue depth, callbacks, and device flags. `spi_transaction_t` supplies per-transfer lengths, buffers, command/address values, user context, and transaction flags.

`length` is the TX bit length. `rxlength` is the requested RX bit length; zero lets full-duplex reception follow `length`. Null buffers and absent inline-data flags suppress corresponding data movement. `SPI_TRANS_USE_TXDATA`/`SPI_TRANS_USE_RXDATA` use the four-byte inline unions and must not be combined with their buffer pointer aliases.

Use `spi_transaction_ext_t` plus `SPI_TRANS_VARIABLE_CMD`, `SPI_TRANS_VARIABLE_ADDR`, or `SPI_TRANS_VARIABLE_DUMMY` when phase widths differ per transaction. DIO/QIO/OCT and multiline command/address flags map to the TRM line-mode fields. Multi-line data requires half-duplex device operation on ESP32-S3.

Before queueing, `check_trans_valid()` checks phase combinations, buffer presence, bus pins, DMA alignment policy, maximum length, and unsupported target features. `setup_priv_desc()` may allocate bounce buffers and builds the private descriptor consumed by the ISR/HAL.

#### Related notes

- [TRM master state machine](../01_technical_reference_manual/08_master_state_machine_and_sequences.md)
- [TRM data modes and signals](../01_technical_reference_manual/03_data_modes_and_bus_signals.md)
- [Master transaction object](../03_use_cases/04_master_device_and_transaction_model.md)

---

### Summary Section (Summary of Notes)

Device configuration supplies stable timing defaults; transaction structures supply per-transfer phases and buffers. Flags must agree with bus pins, duplex mode, and target capabilities.
