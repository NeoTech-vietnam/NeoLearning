# Cornell Notes

## Topic: DMA-Controlled Data Transfer

## Date: 17/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### DMA-Controlled Data Transfer

- DMA-controlled transfer refers to the transfer, in which GDMA RX module receives data and GDMA TX module sends data. This transfer is supported both in master mode and in slave mode.
- A DMA-controlled transfer can be:
  - A single transfer, consisting of only one transaction. GP-SPI supports this transfer both in master and slave modes.
  - A configurable segmented transfer, consisting of several transactions (segments). Only GP-SPI2 supports this transfer in master mode.
  - A slave segmented transfer, consisting of several transactions (segments). GP-SPI supports this transfer only in slave mode.
- A DMA-controlled transfer **only needs to be triggered once by CPU**. When such transfer is triggered, data is transferred by the GDMA engine from or to the DMA-linked memory, without CPU operation.
- DMA-controlled transfer supports full-duplex communication, half-duplex communication. Meanwhile, the GDMA RX module is independent from the GDMA TXmodule, which means that there are four kinds of full-duplex communications:
  - Data is received in DMA-controlled mode **and** sent in **DMA**-controlled mode.
  - Data is received in DMA-controlled mode **but** sent in **CPU**-controlled mode.
  - Data is received in CPU-controlled mode **but** sent in **DMA**-controlled mode.
  - Data is received in CPU-controlled mode **and** sent in **CPU**-controlled mode.

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]