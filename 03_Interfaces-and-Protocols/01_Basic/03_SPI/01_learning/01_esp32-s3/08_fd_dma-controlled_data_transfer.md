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

##### GDMA Configuration

- Select a GDMA channel`n`, and configure a GDMA TX/RX descriptor, see section GDMA Controller (`GDMA`).
- Set the bit `GDMA_INLINK_START_CHn`/`GDMA_OUTLINK_START_CHn` to start GDMA RX/TX engine.
- Before all the GDMA TX buffer is used or the GDMA TX engine is reset, if `GDMA_OUTLINK_RESTART_CHn` is set, a new TX buffer will be added to the end of the last TX buffer in use.
- GDMA RX buffer is linked in the same way as the GDMA TX buffer, by setting `GDMA_INLINK_START_CHn` or `GDMA_INLINK_RESTART_CHn`.
- The TX and RX data lengths are determined by the configured GDMA TX and RX buffer respectively, both of which can be unlimited.
- Initialize GDMA inlink and outlink before GDMA starts. The bits `SPI_DMA_RX_ENA` and `SPI_DMA_TX_ENA` in register `SPI_DMA_CONF_REG` should be set, otherwise the read/write data will be stored to/sent from the registers `SPI_W0_REG` ~ `SPI_W15_REG`.

In master mode, if `GDMA_IN_SUC_EOF_CHn_INT_ENA` is set, then the interrupt `GDMA_IN_SUC_EOF_CHn_INT` will be triggered when one single transfer or one configurable segmented transfer is finished.

In slave mode, if `GDMA_IN_SUC_EOF_CHn_INT_ENA` is set, then the interrupt `GDMA_IN_SUC_EOF_CHn_INT` will be triggered when one of conditions listed in Table 30.5-7 are met.

![alt text](image-9.png)

##### GDMA TX/RX Buffer Length Control

It is recommended that the length of configured GDMA TX/RX buffer is equal to the length of real transferred data.
- If the length of configured GDMA TX buffer is shorter than that of real transferred data, the extra data will be the same as the last transferred data. `SPI_OUTFIFO_EMPTY_ERR_INT` and `GDMA_OUT_EOF_CHn_INT` are triggered.
- If the length of configured GDMA TX buffer is longer than that of real transferred data, the TX buffer is not fully used, and the remaining buffer is available for following transaction even if a new TX buffer is linked later. Please keep it in mind. Or save the unused data and reset DMA.
- If the length of configured GDMA RX buffer is shorter than that of real transferred data, the extra data will be lost. The interrupts `SPI_INFIFO_FULL_ERR_INT` and `SPI_TRANS_DONE_INT` are triggered. But `GDMA_IN_SUC_EOF_CHn_INT` interrupt is not generated.
- If the length of configured GDMA RX buffer is longer than that of real transferred data, the RX buffer is not fully used, and the remaining buffer is discarded. In the following transaction, a new linked buffer will be used directly.

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]