# Cornell Notes

## Topic: Complete GP-SPI Application Sequences

## Date: 20/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- Which API sequence fits a register device, display, or peer MCU?
- When should polling, queued DMA, normal slave, or slave-HD be selected?
- What cleanup is required in each case?

---

### Notes Section (Main Notes)

| Application | Recommended path | Related note |
|---|---|---|
| sensor register access | master half-duplex or full-duplex polling | [Polling](06_polling_and_exclusive_bus_sequence.md) |
| display/frame burst | master queued DMA | [Queued master](05_interrupt_queued_master_sequence.md) |
| EEPROM command/address/data | master half-duplex with variable phases | [Transaction model](04_master_device_and_transaction_model.md) |
| peer MCU generic frames | normal full-duplex slave with ready GPIO | [Slave sequence](09_full_duplex_slave_sequences.md) |
| high-throughput matched peer | slave-HD segment/append protocol | [Slave-HD](10_slave_hd_and_segmented_transfers.md) |

Minimal master lifecycle:

```c
spi_bus_config_t bus = {.mosi_io_num = MOSI, .miso_io_num = MISO,
                        .sclk_io_num = SCLK, .max_transfer_sz = 4096};
spi_device_interface_config_t device = {.clock_speed_hz = 10 * 1000 * 1000,
                                        .mode = 0, .spics_io_num = CS,
                                        .queue_size = 4};
spi_device_handle_t handle = NULL;
ESP_ERROR_CHECK(spi_bus_initialize(SPI2_HOST, &bus, SPI_DMA_CH_AUTO));
ESP_ERROR_CHECK(spi_bus_add_device(SPI2_HOST, &device, &handle));
spi_transaction_t transaction = {.length = tx_bytes * 8, .tx_buffer = tx};
ESP_ERROR_CHECK(spi_device_transmit(handle, &transaction));
ESP_ERROR_CHECK(spi_bus_remove_device(handle));
ESP_ERROR_CHECK(spi_bus_free(SPI2_HOST));
```

Minimal normal-slave ownership sequence:

```c
spi_slave_transaction_t transaction = {
    .length = buffer_size * 8,
    .tx_buffer = tx,
    .rx_buffer = rx,
};
ESP_ERROR_CHECK(spi_slave_initialize(SPI2_HOST, &bus, &slave, SPI_DMA_CH_AUTO));
ESP_ERROR_CHECK(spi_slave_queue_trans(SPI2_HOST, &transaction, portMAX_DELAY));
spi_slave_transaction_t *completed = NULL;
ESP_ERROR_CHECK(spi_slave_get_trans_result(SPI2_HOST, &completed, portMAX_DELAY));
assert(completed == &transaction);
ESP_ERROR_CHECK(spi_slave_free(SPI2_HOST));
```

Minimal slave-HD buffer-ownership sequence after filling `bus` and `slot`:

```c
spi_slave_hd_data_t transfer = {.data = buffer, .len = buffer_size};
ESP_ERROR_CHECK(spi_slave_hd_init(SPI2_HOST, &bus, &slot));
ESP_ERROR_CHECK(spi_slave_hd_queue_trans(SPI2_HOST, SPI_SLAVE_CHAN_RX,
                                         &transfer, portMAX_DELAY));
spi_slave_hd_data_t *completed = NULL;
ESP_ERROR_CHECK(spi_slave_hd_get_trans_res(SPI2_HOST, SPI_SLAVE_CHAN_RX,
                                           &completed, portMAX_DELAY));
assert(completed == &transfer);
ESP_ERROR_CHECK(spi_slave_hd_deinit(SPI2_HOST));
```

For queued DMA, keep every transaction and buffer alive until `spi_device_get_trans_result()` returns it. For slave, queue capacity before raising ready. For slave-HD, implement the matching master protocol and retrieve every channel descriptor before deinit.

Official cross-checks at `v6.0.1`: [master HD EEPROM](https://github.com/espressif/esp-idf/tree/v6.0.1/examples/peripherals/spi_master/hd_eeprom), [master LCD](https://github.com/espressif/esp-idf/tree/v6.0.1/examples/peripherals/spi_master/lcd), [normal slave sender/receiver](https://github.com/espressif/esp-idf/tree/v6.0.1/examples/peripherals/spi_slave), and [slave-HD segment/append modes](https://github.com/espressif/esp-idf/tree/v6.0.1/examples/peripherals/spi_slave_hd).

#### Related notes

- [Complete public/internal API inventory](15_spi_apis.md#public-functions)

---

### Summary Section (Summary of Notes)

Select the simplest role/waiting model that matches the peer protocol. Object and buffer lifetimes extend until the corresponding result API returns ownership.
