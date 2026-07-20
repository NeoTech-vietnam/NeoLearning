# Cornell Notes

## Topic: Overview and Features of MCPWM

## Date: 06/06/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Overview

The **M**otor **C**ontrol **P**ulse **W**idth **M**odulator (MCPWM) peripheral is intended for motor and power control. It provides **six** PWM outputs that can be set up to operate in several topologies. One common topology uses a pair of PWM outputs driving an **H-bridge** to control motor rotation speed and rotation direction.

The timing and control resources inside are allocated into two major types of submodules: PWM timers and PWM operators. 
  - Each PWM timer provides timing references that can either run freely or be synced to other timers or external sources. 
  - Each PWM operator has all necessary control resources to generate waveform pairs for one PWM channel. 
  - The MCPWM peripheral also contains a dedicated capture submodule that is used in systems where accurate timing of external events is important.

ESP32-S3 contains two MCPWM peripherals: MCPWM0 and MCPWM1.

#### Features

Each MCPWM peripheral has one clock divider (prescaler), three PWM timers, three PWM operators, and a capture module. Figure 36.2-1 shows the submodules inside and the signals on the interface. PWM timers are used for generating timing references. The PWM operators generate desired waveform based on the timing references. Any PWM operator can be configured to use the timing references of any PWM timers. Different PWM operators can use the same PWM timer’s timing references to produce related PWM signals. PWM operators can also use different PWM timers’ values to produce the PWM signals that work alone. Different PWM timers can also be synchronized together.

An overview of the submodules’ function in Figure 36.2-1 is shown below:

- PWM Timers 0, 1 and 2 
  - Every PWM timer has a dedicated 8-bit clock prescaler.
  - The 16-bit counter in the PWM timer can work in count-up mode, count-down mode or count-up-down mode.
  - A hardware sync or software sync can trigger a reload on the PWM timer with a phase register. It will also trigger the prescaler’s restart, so that the timer’s clock can also be synced. The source of the hard sync can come from any GPIO or any other PWM timer’s sync_out. The source of the soft sync comes from writing toggle value to the `MCPWM_TIMERx_SYNC_SW` bit.

- PWM Operators 0, 1 and 2 
  - Every PWM operator has two PWM outputs: PWMxA and PWMxB. They can work independently, in symmetric and asymmetric configuration.
  - Software, asynchronously override control of PWM signals.
  - Configurable dead-time on rising and falling edges; each set up independently.
  - All events can trigger CPU interrupts.
  - Modulating of PWM output by high-frequency carrier signals, useful when gate drivers are insulated with a transformer.
  - Period, time stamps and important control registers have shadow registers with flexible updating methods.

![alt text](image-2.png)

- Fault Detection Module
  - Programmable fault handling allocated on fault condition in both cycle-by-cycle mode and one-shot mode.
  - A fault condition can force the PWM output to either high or low logic levels.
- Capture Module
  - Speed measurement of rotating machinery (for example, toothed sprockets sensed with Hall sensors)
  - Measurement of elapsed time between position sensor pulses
  - Period and duty-cycle measurement of pulse train signals
  - Decoding current or voltage amplitude derived from duty-cycle-encoded signals of current/voltage sensors
  - Three individual capture channels, each of which has a time-stamp register (32 bits)
  - Selection of edge polarity and prescaling of input capture signal
  - The capture timer can sync with a PWM timer or external signals.
  - Interrupt on each of the three capture channels


---

#### Related Use Cases

- [MCPWM Resource Relationships and Software Layers](../03_use_cases/01_overview_and_resource_relationships.md)
- [Complete MCPWM Application Sequences](../03_use_cases/13_complete_application_sequences.md)
- [Private APIs: resource ownership and group mapping](../03_use_cases/15_mcpwm_apis.md#trm-map-resource-ownership)

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
