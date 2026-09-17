---
id: environmental-sentinel
title: Environmental Sentinel
level: intermediate
problem: Build a small embedded monitor that samples an environmental signal, reports it over I2C, and stays observable while it runs.
regions:
  - content:02-software-microcontrollers
  - content:03-protocols-basic
knowledgeLinks:
  - 02_Software/03_Microcontrollers/02_ADC-DAC
  - 02_Software/03_Microcontrollers/06_Interrupts
  - 03_Interfaces-and-Protocols/01_Basic/02_I2C
milestones:
  - id: define-sampling-contract
    title: Define the sampling contract
    order: 1
    description: Choose the signal, sample interval, range, and failure behavior.
    required: true
    evidenceRequired: true
    knowledgeLinks:
      - 02_Software/03_Microcontrollers/02_ADC-DAC
  - id: implement-sensor-loop
    title: Implement a non-blocking sensor loop
    order: 2
    description: Use a timer or interrupt-driven loop that leaves room for communication work.
    required: true
    evidenceRequired: true
    knowledgeLinks:
      - 02_Software/03_Microcontrollers/03_Timers-Counters
      - 02_Software/03_Microcontrollers/06_Interrupts
  - id: publish-i2c-reading
    title: Publish one reading over I2C
    order: 3
    description: Expose a documented reading format and confirm it with a bus capture.
    required: true
    evidenceRequired: true
    knowledgeLinks:
      - 03_Interfaces-and-Protocols/01_Basic/02_I2C
  - id: capture-observability-notes
    title: Capture observability notes
    order: 4
    description: Record the normal reading range and one intentional failure observation.
    required: false
    evidenceRequired: false
    knowledgeLinks:
      - 02_Software/06_Debugging/02_GDB
completionCriteria:
  - Every required milestone is complete and has its required evidence.
  - The evidence identifies the artifact or observation that demonstrates the milestone.
---

# Environmental Sentinel

Create a small environmental monitor. Implementation artifacts are intentionally
left to the learner; use the milestones to capture the evidence that makes the
work reviewable.
