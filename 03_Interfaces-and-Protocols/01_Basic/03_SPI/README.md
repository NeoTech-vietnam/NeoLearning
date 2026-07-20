# ESP32-S3 GP-SPI Learning Notes

Cross-layer Cornell notes for ESP32-S3 GP-SPI2/GP-SPI3 and ESP-IDF v6.0.1:

- [Technical Reference Manual](01_learning/01_esp32-s3/01_technical_reference_manual/01_overview_glossary_and_features.md)
- [ESP-IDF Programming Guide](01_learning/01_esp32-s3/02_programming_guide/01_driver_scope_terminology_and_features.md)
- [Use Cases and Source Traces](01_learning/01_esp32-s3/03_use_cases/01_resource_and_software_layer_relationships.md)
- [Complete SPI API/Internal Symbol Inventory](01_learning/01_esp32-s3/03_use_cases/15_spi_apis.md)

Scope: GP-SPI master, normal full-duplex slave, and the Espressif slave-HD protocol. MSPI flash/PSRAM, SDSPI, LCD wrappers, and software SPI are outside the core scope.

Source baseline: [ESP32-S3 TRM v1.8](https://documentation.espressif.com/esp32-s3_technical_reference_manual_en.pdf), [SPI feature guide](https://docs.espressif.com/projects/esp-idf/en/v6.0.1/esp32s3/api-reference/peripherals/spi_features.html), [master guide](https://docs.espressif.com/projects/esp-idf/en/v6.0.1/esp32s3/api-reference/peripherals/spi_master.html), [slave guide](https://docs.espressif.com/projects/esp-idf/en/v6.0.1/esp32s3/api-reference/peripherals/spi_slave.html), and [slave-HD guide](https://docs.espressif.com/projects/esp-idf/en/v6.0.1/esp32s3/api-reference/peripherals/spi_slave_hd.html). Implementation links are pinned to ESP-IDF `v6.0.1` in the API inventory; hashes and extractor versions are recorded in `.notes-manifest.json`.
