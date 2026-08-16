# Cornell Notes

## Topic: CPU-Controlled Data Transfer

## Date: 16/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### CPU-Controlled Data Transfer
- GP-SPI provides 16 x 32-bit data buffers, i.e., SPI_W0_REG ~ SPI_W15_REG, see below figure. 
- CPU-controlled transfer indicates the transfer, in which the data to send is from GP-SPI data buffer and the received data is stored to GP-SPI data buffer. In such transfer, every single transaction needs to be triggered by the CPU, after its related registers are configured. 
- For such reason, the CPU-controlled transfer is always single transfers (consisting of only one transaction).
- CPU-controlled transfer supports full-duplex communication and half-duplex communication.
![alt text](image-8.png)

##### CPU-Controlled Master Mode
- In a CPU-controlled master full-duplex or half-duplex transfer, the RX or TX data is saved to or sent from `SPI_W0_REG` ~ `SPI_W15_REG`. The bits `SPI_USR_MOSI_HIGHPART` and `SPI_USR_MISO_HIGHPART` control which buffers are used, see the list below.
- TX data:
  - When `SPI_USR_MOSI_HIGHPART` is cleared, i.e., high part mode is disabled, TX data is from `SPI_W0_REG` ~ `SPI_W15_REG` and the data address is incremented by 1 on each byte transferred. 
    - If the data byte length is larger than 64, the data in `SPI_W0_REG` ~ `SPI_W15_REG` may be sent more than once. 
    - For instance, 66 bytes (byte0 ~ byte65) need to send out, the address of byte65 is the result of (65 % 64 = 1), i.e., byte65 is from `SPI_W0_REG[15:8]`, and byte64 is from `SPI_W0_REG[7:0]`. For this case, the content of `SPI_W0_REG[15:0]` may be sent more than once.
  - When `SPI_USR_MOSI_HIGHPART` is set, i.e., high part mode is enabled, TX data is from `SPI_W8_REG` ~ `SPI_W15_REG` and the data address is incremented by 1 on each byte transferred. 
    - If the data byte length is larger than 32, the data in `SPI_W8_REG` ~ `SPI_W15_REG` may be sent more than once.
- RX data:
  - When `SPI_USR_MISO_HIGHPART` is cleared, i.e., high part mode is disabled, RX data is saved to `SPI_W0_REG` ~ `SPI_W15_REG`, and the data address is incremented by 1 on each byte transferred.
    - If the data byte length is larger than 64, the data in `SPI_W0_REG` ~ `SPI_W15_REG` may be overwritten. 
    - For instance, 66 bytes (byte0 ~ byte65) are received, byte65 and byte64 will be stored to the addresses of (65 % 64 = 1) and (64 % 64 = 0), i.e., `SPI_W0_REG`[15:8] and `SPI_W0_REG`[7:0]. For this case, the content of `SPI_W0_REG`[15:0] may be overwritten
  - When `SPI_USR_MISO_HIGHPART` is set, i.e., high part mode is enabled, the RX data is saved to `SPI_W8_REG` ~ `SPI_W15_REG`, and the data address is incremented by 1 on each byte transferred.
    - If the data byte length is larger than 32, the content of `SPI_W8_REG` ~ `SPI_W15_REG` may be overwritten.

- *Note:*
  - *TX/RX data address mentioned above both are byte-addressable. Address 0 stands for `SPI_W0_REG`[7:0], and Address 1 for `SPI_W0_REG`[15:8], and so on. The largest address is `SPI_W15_REG`[31:24].*
  - *To avoid any possible error in TX/RX data, such as TX data being sent more than once or RX data being overwritten, please make sure the registers are configured correctly.*

##### CPU-Controlled Slave Mode
- In a CPU-controlled slave full-duplex or half-duplex transfer, the RX data or TX data is saved to or sent from `SPI_W0_REG` ~ `SPI_W15_REG`, which are byte-addressable.
  - In full-duplex communication, the address of `SPI_W0_REG` ~ `SPI_W15_REG` starts from 0 and is incremented by 1 on each byte transferred. If the data address is larger than 63, the content of `SPI_W15_REG`[31:24] is overwritten
  - In half-duplex communication, the ADDR value in transmission format is the start address of the RX or TX data, corresponding to the registers `SPI_W0_REG` ~ `SPI_W15_REG`. The RX or TX address is incremented by 1 on each byte transferred. If the address is larger than 63 (the highest byte address, i.e., `SPI_W15_REG`[31:24]), the address of overflowing data is always 63 and only the content of `SPI_W15_REG`[31:24] is overwritten.
- Hence, according to your applications, the registers `SPI_W0_REG` ~ `SPI_W15_REG` can be used as:
  - data buffers only
  - data buffers and status buffers
  - status buffers only

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]