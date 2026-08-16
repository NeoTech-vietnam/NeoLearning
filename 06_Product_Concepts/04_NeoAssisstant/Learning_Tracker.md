# NeoAssistant — Learning & Practice Tracker

> A tracker for the knowledge and hands-on skills required to build NeoAssistant.
>
> **Importance scale (simplified Bloom's Taxonomy):**
>
> - **L1 — Know**: Recognize and recall concepts, terminology, APIs.
> - **L2 — Understand**: Explain principles, read code fluently, draw diagrams.
> - **L3 — Apply**: Write working code/demos on real hardware independently.
> - **L4 — Master**: Optimize, debug deeply, integrate across subsystems, production-ready.
>
> **Status:** ☐ Not started • ◐ In progress • ☑ Done

---

## 1. Programming Languages & Tools

| # | Topic | Level | Status | Notes |
|---|-------|:-----:|:------:|-------|
| 1 | C — embedded idioms, pointers, bitfields, volatile, memory layout | **L4** | ☐ | Primary language for ESP-IDF firmware |
| 2 | C++ — classes, RAII, templates for embedded | **L3** | ☐ | LVGL wrappers, driver classes |
| 3 | Python — scripting, test automation, model tooling | **L3** | ☐ | PC Monitor Tool, ML training |
| 4 | ESP-IDF — project structure, Kconfig, CMake, component model | **L4** | ☐ | Mandatory for every firmware module |
| 5 | Git — branching, PR flow, semantic commits, submodules | **L3** | ☐ | Source + KiCad files management |
| 6 | Debugging — OpenOCD, GDB, ESP-IDF monitor, core dump | **L3** | ☐ | Survival skill during integration |
| 7 | KiCad — schematic capture, PCB layout, footprint editing | **L3** | ☐ | Phase 2 — PCB design |
| 8 | SolidWorks — basic mechanical / enclosure design | **L2** | ☐ | Enough to design a 3D-printable case |
| 9 | Flutter / Dart — mobile app development | **L3** | ☐ | Companion app (Android/iOS) |

---

## 2. FreeRTOS & System Fundamentals

| #   | Topic                                                          | Level  | Status | Notes                                |
| --- | -------------------------------------------------------------- | :----: | :----: | ------------------------------------ |
| 1   | Tasks, priorities, preemptive scheduling                       | **L4** |   ☐    | Foundation of every firmware task    |
| 2   | Queues, semaphores, mutexes, event groups                      | **L4** |   ☐    | IPC between tasks (Audio↔AI↔UI)      |
| 3   | DMA — I2S / SPI descriptors, double buffering                  | **L4** |   ☐    | Required for audio + display latency |
| 4   | Interrupts & ISR-safe APIs (`xQueueSendFromISR`, …)            | **L3** |   ☐    | Touch, GPIO, timer ISR               |
| 5   | Timers — hardware timers, `esp_timer`, RTC                     | **L3** |   ☐    | LVGL tick, sensor sampling period    |
| 6   | Watchdog — `esp_task_wdt`, task subscription                   | **L3** |   ☐    | Required by MonitorTask              |
| 7   | Memory — `heap_caps_malloc`, PSRAM, stack sizing, watermark    | **L4** |   ☐    | Directly tied to 8 MB PSRAM budget   |
| 8   | Power management — light/deep sleep, wake stubs, wake-on-voice | **L3** |   ☐    | Hit <100 µA deep-sleep target        |
| 9   | Clock management — CPU freq scaling, peripheral clocks         | **L2** |   ☐    | Battery + performance trade-offs     |
| 10  | OTA — dual-partition, rollback, TLS-verified download          | **L3** |   ☐    | Phase 1 review-gate requirement      |

---

## 3. BSP Driver Development

| # | Peripheral / Interface | Level | Status | Notes |
|---|------------------------|:-----:|:------:|-------|
| 1 | INMP441 microphone (I2S DMA) | **L4** | ☐ | Entry point of the entire voice pipeline |
| 2 | MAX98357A speaker amplifier (I2S DMA) | **L3** | ☐ | TTS playback |
| 3 | OV2640 camera (DVP + `esp_camera`) | **L3** | ☐ | Vision subsystem |
| 4 | ILI9341 / ST7789 TFT (SPI) | **L3** | ☐ | Display backend for LVGL |
| 5 | Capacitive touch / touch pads | **L2** | ☐ | User input |
| 6 | WS2812B RGB LED (RMT) | **L2** | ☐ | Status indicator |
| 7 | MPU-6050 accel + gyro (I2C) | **L3** | ☐ | Sensor-fusion input |
| 8 | QMC5883L magnetometer (I2C) | **L2** | ☐ | Heading reference |
| 9 | MicroSD card (SPI + VFS/FAT) | **L2** | ☐ | Logging, audio dump |
| 10 | Battery voltage monitor (ADC) | **L2** | ☐ | Power UI indicator |

---

## 4. Communication Protocols

| # | Protocol | Level | Status | Notes |
|---|----------|:-----:|:------:|-------|
| 1 | I2S — full-duplex audio | **L4** | ☐ | Mic + Speaker, DMA mandatory |
| 2 | SPI — TFT + SD card | **L3** | ☐ | Bus sharing, CS management |
| 3 | I2C — IMU + magnetometer | **L3** | ☐ | Multi-device addressing |
| 4 | DVP (parallel camera bus) | **L2** | ☐ | Mostly via `esp_camera`, low-touch |
| 5 | RMT — WS2812B timing | **L2** | ☐ | LED animation |
| 6 | Wi-Fi STA/AP + HTTP/S client | **L3** | ☐ | Cloud AI access |
| 7 | MQTT — pub/sub, QoS, TLS | **L3** | ☐ | Telemetry → MCP server |
| 8 | BLE GATT server | **L3** | ☐ | Companion-app pairing/config |
| 9 | WebSocket client | **L2** | ☐ | Streaming JSON |
| 10 | UART / USB-CDC | **L3** | ☐ | Debug shell + PC monitor link |

---

## 5. Algorithms & Data Structures (DSA)

| # | Topic | Level | Status | Notes |
|---|-------|:-----:|:------:|-------|
| 1 | Ring / circular buffer | **L4** | ☐ | Core of the audio pipeline |
| 2 | Lock-free queue (SPSC) | **L3** | ☐ | ISR → task handoff |
| 3 | Finite State Machine (FSM) | **L3** | ☐ | Voice UI + connectivity state |
| 4 | Sorting & search | **L2** | ☐ | Command table |
| 5 | Hash map / LUT | **L2** | ☐ | Fast command dispatch |
| 6 | Linked list | **L2** | ☐ | Event list, callbacks |

---

## 6. Digital Signal Processing (DSP)

| # | Topic | Level | Status | Notes |
|---|-------|:-----:|:------:|-------|
| 1 | Sampling, Nyquist, quantisation | **L2** | ☐ | Theoretical foundation |
| 2 | FFT / IFFT (ESP-DSP) | **L3** | ☐ | Audio spectrum, viewer tool |
| 3 | FIR / IIR filters | **L3** | ☐ | Noise removal pre-ASR |
| 4 | VAD — Voice Activity Detection | **L3** | ☐ | Trigger wake-word stage |
| 5 | MFCC — feature extraction | **L2** | ☐ | Input for ASR model |
| 6 | Image processing basics | **L2** | ☐ | OV2640 pre-processing |

---

## 7. Sensor Fusion

| # | Topic | Level | Status | Notes |
|---|-------|:-----:|:------:|-------|
| 1 | Complementary filter | **L2** | ☐ | Basic roll/pitch |
| 2 | Madgwick / Mahony filter | **L3** | ☐ | Full attitude quaternion |
| 3 | Hard/soft iron calibration (mag) | **L2** | ☐ | Accurate heading |
| 4 | Fusion → LVGL widget | **L3** | ☐ | UI dashboard integration |

---

## 8. UI — LVGL

| # | Topic | Level | Status | Notes |
|---|-------|:-----:|:------:|-------|
| 1 | LVGL setup, display flush, tick task | **L3** | ☐ | Required for every UI screen |
| 2 | Widgets — label, button, arc, chart | **L3** | ☐ | Component gallery |
| 3 | Animations & transitions | **L2** | ☐ | UX polish |
| 4 | Touch input integration | **L3** | ☐ | Interactive control |
| 5 | PSRAM frame buffer | **L3** | ☐ | Hit ≥25 fps (review gate) |
| 6 | Custom widgets / styles | **L2** | ☐ | Branding, theming |

---

## 9. AI & Machine Learning (Edge + Cloud)

| # | Topic | Level | Status | Notes |
|---|-------|:-----:|:------:|-------|
| 1 | ESP-SR WakeNet — wake-word | **L3** | ☐ | "Hey Neo", ≥95% accuracy |
| 2 | ESP-SR MultiNet — command recognition | **L3** | ☐ | On-device 10+ commands |
| 3 | TensorFlow Lite Micro | **L3** | ☐ | Custom keyword model |
| 4 | Cloud STT/TTS (HTTP REST) | **L3** | ☐ | Full voice roundtrip |
| 5 | NLP / prompt engineering (OpenAI / Gemini) | **L3** | ☐ | Command resolution layer |
| 6 | MCP Server integration | **L3** | ☐ | Remote ops + telemetry |
| 7 | Model quantisation (INT8) | **L2** | ☐ | Fit models within PSRAM |

---

## 10. Power & Hardware Design

| # | Topic | Level | Status | Notes |
|---|-------|:-----:|:------:|-------|
| 1 | LiPo charging (TP4056 / IP5306) | **L2** | ☐ | Safe charging circuit |
| 2 | Sleep modes & power budget | **L3** | ☐ | Hit targets in Section 8 |
| 3 | PCB EMC rules, decoupling, ground plane | **L3** | ☐ | Phase 2 PCB layout |
| 4 | RF antenna keep-out (Wi-Fi 2.4 GHz) | **L2** | ☐ | Avoid RSSI degradation |
| 5 | ESD protection | **L2** | ☐ | USB port, touch pads |

---

## 11. Testing & Quality

| # | Topic | Level | Status | Notes |
|---|-------|:-----:|:------:|-------|
| 1 | Unit testing (Unity / CMock) for ESP-IDF | **L3** | ☐ | Driver-level tests |
| 2 | Integration / HIL testing | **L3** | ☐ | Task-interaction validation |
| 3 | Memory leak detection (`heap_caps_check_integrity_all`) | **L3** | ☐ | 24 h stress run |
| 4 | Profiling — `vTaskGetRunTimeStats`, GDB profiling | **L3** | ☐ | CPU% per task |
| 5 | EMC / RF testing — basic awareness | **L1** | ☐ | Enough to read lab reports |
| 6 | Code style — MISRA-C subset | **L2** | ☐ | Phase 1 review gate |

---

## 12. Tooling & Release

| # | Topic | Level | Status | Notes |
|---|-------|:-----:|:------:|-------|
| 1 | Python — `pyserial`, `paho-mqtt`, `pyqtgraph`, `PyQt6` | **L3** | ☐ | PC Monitor Tool |
| 2 | `pyinstaller` packaging | **L2** | ☐ | Single-executable distribution |
| 3 | Flutter BLE / MQTT client | **L3** | ☐ | Mobile companion |
| 4 | Firmware signing & OTA binary build | **L2** | ☐ | Release pipeline |
| 5 | Versioning, changelog, semantic releases | **L2** | ☐ | v1.0.0 tagging |

---

## Priority Overview

| Level | Topic count | Meaning |
|:-----:|:-----------:|---------|
| **L4 — Master** | ~10 | Core skills, full mastery (C, FreeRTOS scheduling, DMA, memory, I2S, ring buffer) |
| **L3 — Apply** | ~50 | Enough to write production-quality drivers/features |
| **L2 — Understand** | ~25 | Enough to read code/datasheets and call APIs correctly |
| **L1 — Know** | ~2 | Reference-only concepts, no deep practice required |

---

## How to use this tracker

1. Before starting a topic, switch its **Status** to ◐.
2. Once the matching deliverable in [Concept.md](Concept.md) (Phase 1) is complete, mark it ☑.
3. Re-review L3/L4 topics every 2–4 weeks to reinforce (spaced repetition).
4. If a new required topic surfaces during implementation, add it to the matching section.
