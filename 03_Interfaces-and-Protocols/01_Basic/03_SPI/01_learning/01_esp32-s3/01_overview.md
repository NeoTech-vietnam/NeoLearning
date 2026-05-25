# Cornell Notes

## Topic: Overview

## Date: 16/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- What is SPI?
- How many SPI controllers are integrated in the ESP32-S3 chip? What are they?
- What are the differences between SPI0, SPI1 and GP-SPI controllers?
- What are the key features of GP-SPI controllers?

---

### Notes Section (Main Notes)

#### Overview
- The Serial Peripheral Interfaces (SPI) is a synchronous serial communication protocol useful for communication with external peripherals. The ESP32-S3 chip integrates four SPI controllers:
  - SPI0,
  - SPI1,
  - General Purpose SPI2 (GP-SPI2),
  - General Purpose SPI3 (GP-SPI3).
- SPI0 and SPI1 controllers are primarily reserved for internal uses to communication with external flash and PSRAM memory.
- This section will focus on GP-SPI controlers (i.e, GP-SPI2 and GP-SPI3). Hence, GPI-SPI refers to both GP-SPI2 and GP-SPI3 controllers in the following sections.

#### Glossary
- To better illustrate the functions of GP-SPI, the flowwing terms are used in this chapter:

| Term | Definition |
|-----|------------|
| Master mode | GP-SPI acts as an SPI master and initiates SPI transactions. |
| Slave Mode | GP-SPI acts as an SPI slave and transfers data with its master when its CS is asserted. |
| MISO | Master in, slave out, data transmission from a slave to a master. |
| MOSI | Master out, slave in, data transmission from a master to a slave. |
| Transaction | One instance of a master asserting a CS line, transferring data to and from a slave, and de-asserting the CS line. Transactions are atomic, which means they can never be interrupted by another transaction. |
| SPI Transfer | The whole process of an SPI master exchanges data with a slave. One SPI transfer consists of one or more SPI transactions. |
| Single Transfer | An SPI transfer consists of only one transaction. |
| CPU-Controlled Transfer | A data transfer happens between CPU configured buffer `SPI_W0_REG` ~ `SPI_W15_REG` and SPI peripheral. |
| DMA-Controlled Transfer | A data transfer happens between DMA and SPI peripheral, controlled by DMA engine. |
| Configurable Segmented Transfer | A data transfer controlled by DMA in SPI master mode. Such transfer consists of multiple transactions (segments), and each of transactions can be configured independently. |
| Slave Segmented Transfer | A data transfer controlled by DMA in SPI slave mode. Such transfer consists of multiple transactions (segments). |
| Full-duplex | The sending line and receiving line between the master and the slave are independent. Sending data and receiving data happen at the same time. |
| Half-duplex | Only one side, the master or the slave, sends data first, and the other side receives data. Sending data and receiving data can not happen at the same time. |
| 4-line full-duplex | 4-line here means: clock line, CS line, and two data lines. The two data lines can be used to send or receive data simultaneously. |
| 4-line half-duplex | 4-line here means: clock line, CS line, and two data lines. The two data lines can not be used simultaneously. |
| 3-line half-duplex | 3-line here means: clock line, CS line, and one data line. The data line is used to transmit or receive data. |
| 1-bit SPI | In one clock cycle, one bit can be transferred. |
| (2-bit) Dual SPI | In one clock cycle, two bits can be transferred. |
| Dual Output Read | A data mode of Dual SPI. In one clock cycle, one bit of a command, or one bit of an address, or two bits of data can be transferred. |
| Dual I/O Read | Another data mode of Dual SPI. In one clock cycle, one bit of a command, or two bits of an address, or two bits of data can be transferred. |
| (4-bit) Quad SPI | In one clock cycle, four bits can be transferred. |
| Quad Output Read | A data mode of Quad SPI. In one clock cycle, one bit of a command, or one bit of an address, or four bits of data can be transferred. |
| Quad I/O Read | Another data mode of Quad SPI. In one clock cycle, one bit of a command, or four bits of an address, or four bits of data can be transferred. |
| QPI | In one clock cycle, four bits of a command, or four bits of an address, or four bits of data can be transferred. |
| (8-bit) Octal SPI | In one clock cycle, eight bits can be transferred. |
| Octal Output Read | A data mode of Octal SPI. In one clock cycle, one bit of a command, or one bit of an address, or eight bits of data can be transferred. |
| Octal I/O Read | Another data mode of Octal SPI. In one clock cycle, one bit of a command, or eight bits of an address, or eight bits of data can be transferred. |
| OPI | In one clock cycle, eight bits of a command, or eight bits of an address, or eight bits of data can be transferred. |
| FSPI | Fast SPI. The prefix of the signals for GP-SPI2. FSPI bus signals are routed to GPIO pins via either GPIO matrix or IO MUX. |
| SPI3 | The prefix of the signals for GP-SPI3. SPI3 bus signals are routed to GPIO pins via GPIO matrix only. |

#### Features
- Some of the key features of GP-SPI are:
  - Master and slave modes
  - Half- and full-duplex communications
  - CPU- and DMA-controlled transfers
  - Varius data modes:
    - GP-SPI2:
      - 1-bit SPI mode
      - 2-bit Dual SPI mode
      - 4-bit Quad SPI mode
      - QPI mode
      - 8-bit Octal SPI mode
      - OPI mode
    - GP-SPI3:
      - 1-bit SPI mode
      - 2-bit Dual SPI mode
      - 4-bit Quad SPI mode
      - QPI mode
  - Configurable module clock frequency:
    - Master: up to 80 MHz
    - Slave: up to 60 MHz
  - Configurable data length:
    - CPU-controlled transfer in master mode or in slave mode: 1 ~ 64 B
    - DMA-controlled single transfer in master mode: 1 ~ 32 KB
  - DMA-controlled configurable segmented transfer in master mode: data length is unlimited
  - DMA-controlled single transfer or segmented transfer in slave mode: data length is unlimited
  - Configurable bit read/write order
  - Independent interrupts for CPU-controlled transfer and DMA-controlled transfer
  - Configurable clock polarity and phase
  - Four SPI clock modes: mode 0 ~ mode 3
  - Multiple CS lines in master mode:
    - GP-SPI2: CS0 ~ CS5
    - GP-SPI3: CS0 ~ CS2
  - Able to communicate with SPI devices, such as a sensor, a screen controller, as well as a flash or RAM chip

---

### Summary Section (Summary of Notes)

- The ESP32-S3 chip integrates four SPI controllers: SPI0, SPI1, GP-SPI2 and GP-SPI3. SPI0 and SPI1 are used for internal communication with flash and PSRAM memory, while GP-SPI2 and GP-SPI3 are general-purpose SPI controllers that can be used to communicate with external peripherals. 
- GP-SPI controllers support various features, including master and slave modes, half- and full-duplex communications, CPU- and DMA-controlled transfers, various data modes, configurable clock frequency and data length, independent interrupts, configurable clock polarity and phase, multiple CS lines in master mode, etc.