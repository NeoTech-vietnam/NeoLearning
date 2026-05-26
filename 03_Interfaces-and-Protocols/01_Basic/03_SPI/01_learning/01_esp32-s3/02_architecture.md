# Cornell Notes

## Topic: Architecture

## Date: 16/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Architectural Overview
![alt text](image.png)

- The image shows an overview of SPI module. GP-SPI2 and GP-SPI3 exchange data with SPI devices in the following ways:
  - CPU-controlled transfer: CPU ←> GP-SPI2 (GP-SPI3) ←> SPI devices
  - DMA-controlled transfer: GDMA ←> GP-SPI2 (GP-SPI3) ←> SPI devices
- The signals for GP-SPI2 and GP-SPI3 are prefixed with “FSPI” (Fast SPI) and “SPI3”, respectively. FSPI bus signals are routed to GPIO pins via either GPIO matrix or IO MUX. SPI3 bus signals are routed to GPIO pins via GPIO matrix only.
- The functionalities of GP-SPI3 are nearly the same as those of GP-SPI2. GP-SPI2’s functionalities.


---

### Summary Section (Summary of Notes)

- The ESP32-S3 chip integrates four SPI controllers: SPI0, SPI1, GP-SPI2 and GP-SPI3. SPI0 and SPI1 are used for internal communication with flash and PSRAM memory, while GP-SPI2 and GP-SPI3 are general-purpose SPI controllers that can be used to communicate with external peripherals. 
- GP-SPI controllers support various features, including master and slave modes, half- and full-duplex communications, CPU- and DMA-controlled transfers, various data modes, configurable clock frequency and data length, independent interrupts, configurable clock polarity and phase, multiple CS lines in master mode, etc.
