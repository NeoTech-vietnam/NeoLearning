# Cornell Notes

## Topic: Capture Submodule

## Date: 14/06/2026

---

<p align="center"><strong><em>"DO NOT JUST TALK ABOUT IT — SHOW IT"</em></strong></p>

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Capture Submodule

##### Introduction

The capture submodule contains three complete capture channels. Channel inputs CAP0, CAP1 and CAP2 are sourced from the GPIO matrix. Thanks to the flexibility of the GPIO matrix, CAP0, CAP1 and CAP2 can be configured from any pin input. Multiple capture channels can be sourced from the same pin input, while prescaling for each channel can be set differently. Also, capture channels are sourced from different pins. This provides several options for handling capture signals by hardware in the background, instead of having them processed directly by the CPU. A capture submodule has the following independent key resources:

- One 32-bit timer (counter) which can be synchronized with the PWM timer, another submodule or software.
- Three capture channels, each equipped with a 32-bit time-stamp and a capture prescaler.
- Independent edge polarity (rising/falling edge) selection for any capture channe
- Input capture signal prescaling (from 1 to 256).
- Interrupt capabilities on any of the three capture events

##### Capture Timer

The capture timer is a 32-bit counter incrementing continuously. It is enabled by setting `MCPWM_CAP_TIMER_EN` to 1. Its operating clock source is `APB_CLK`. When `MCPWM_CAP_SYNCI_EN` is configured, the counter will be loaded with phase stored in register `MCPWM_CAP_TIMER_PHASE_REG` at the time of a sync event. Sync events can select from PWM timers sync-out, PWM module sync-in by configuring `MCPWM_CAP_SYNCI_SEL`. Sync event can also generate by setting `MCPWM_CAP_SYNC_SW`. The capture timer provides timing references for all three capture channels.

The capture signal coming to a capture channel will be inverted first, if needed, and then prescaled. Each capture channel has a prescaler register of `MCPWM_CAPx_PRESCALE`. Finally, specified edges of preprocessed capture signal will trigger capture events. Setting `MCPWM_CAPx_EN` to enable a capture channel. The capture event occurs at the time selected by the `MCPWM_CAPx_MODE`. When a capture event occurs, the capture timer’s value is stored in time-stamp register `MCPWM_CAP_CHx_REG`. Different interrupts can be generated for different capture channels at capture events. The edge that triggers a capture event is recorded in register MCPWM_CAPx_EDGE. The capture event can be also forced by software setting `MCPWM_CAPx_SW`.

##### Capture Channel

---

#### Related Use Cases

- [Capture Timer, Channels, and Pulse Measurement](../03_use_cases/10_capture_timer_and_channels.md)
- [Interrupts, Callbacks, IRAM, and Thread Safety](../03_use_cases/11_interrupts_callbacks_and_runtime_safety.md)
- [Private/HAL/LL APIs mapped to capture TRM keywords](../03_use_cases/15_mcpwm_apis.md#trm-map-capture)

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
