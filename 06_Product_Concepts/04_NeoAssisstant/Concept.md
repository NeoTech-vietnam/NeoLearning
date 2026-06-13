# NeoAssistant — Detailed Design Document

## 1. Product Overview

NeoAssistant is an embedded AI assistant device built on the ESP32-S3, combining voice, vision, motion sensing, wireless connectivity, and a touch display into a single compact unit. It is designed for local and cloud-assisted AI inference, real-time audio/video processing, and remote monitoring via a companion mobile app.

---

## 2. Hardware Components

### 2.1 Core Processing Unit
| Component | Details |
|-----------|---------|
| MCU | ESP32-S3 (Xtensa LX7 dual-core, 240 MHz, 512 KB SRAM, 8 MB PSRAM) |
| Flash | 16 MB SPI Flash (for firmware + OTA partition) |
| Power | LiPo battery with integrated charging IC (e.g., TP4056 or IP5306) |

### 2.2 Audio Subsystem
| Component | Details |
|-----------|---------|
| Microphone | INMP441 or SPH0645 (I2S PDM digital microphone board) |
| Speaker | MAX98357A amplifier board + 4Ω/3W speaker |
| Interface | I2S (full-duplex: separate CLK/WS/DIN for mic, DOUT for amp) |

### 2.3 Vision Subsystem
| Component | Details |
|-----------|---------|
| Camera | OV2640 (2MP, up to 1600×1200, DVP parallel interface) |
| Interface | ESP32-S3 camera controller via `esp_camera` library |
| Use cases | Face detection, QR/barcode scan, image capture to SD |

### 2.4 Display & Interaction
| Component | Details |
|-----------|---------|
| Screen | SPI TFT (e.g., ILI9341 / ST7789, 240×320 or 320×480) |
| Touch | Capacitive touch overlay or ESP32-S3 built-in touch sensor pads |
| UI Framework | LVGL (Light and Versatile Graphics Library) |
| LED | WS2812B RGB LED (single or strip, driven via RMT peripheral) |

### 2.5 Motion & Orientation
| Component | Details |
|-----------|---------|
| IMU | MPU-6050 (3-axis accelerometer + 3-axis gyroscope, I2C) |
| Magnetometer | QMC5883L or HMC5883L (3-axis compass, I2C) |
| Sensor Fusion | Madgwick / Mahony filter for attitude estimation |

### 2.6 Storage & Connectivity
| Component | Details |
|-----------|---------|
| SD Card | MicroSD via SPI (FAT32, for logs, audio clips, images) |
| Wi-Fi | 802.11 b/g/n (2.4 GHz), integrated in ESP32-S3 |
| Bluetooth | BT 5.0 + BLE, integrated in ESP32-S3 |

---

## 3. Hardware Interface Map

```
ESP32-S3
├── I2S (0)     → MAX98357A amplifier (speaker output)
├── I2S (1)     → INMP441 microphone (audio input)
├── SPI (2)     → ILI9341/ST7789 TFT display
├── SPI (3)     → MicroSD card
├── DVP/CAMERA  → OV2640 camera
├── I2C (0)     → MPU-6050 (0x68) + Magnetometer (0x0D)
├── RMT         → WS2812B RGB LED
├── GPIO        → Touch buttons (capacitive touch or physical)
├── USB-JTAG    → Debugging / programming (built-in USB on S3)
```

---

## 4. Software Architecture

### 4.1 Firmware Stack (ESP-IDF + FreeRTOS)

```
┌─────────────────────────────────────────────────┐
│              Application Layer                  │
│  AI Engine │ Voice UI │ Camera App │ Sensor App │
├─────────────────────────────────────────────────┤
│              Middleware Layer                   │
│  LVGL (GUI) │ DSP (audio) │ Sensor Fusion       │
│  OTA Manager                                    │
├─────────────────────────────────────────────────┤
│              Driver / HAL Layer                 │
│  I2S │ SPI │ I2C │ RMT │ Camera │ SD (FAT)      │
├─────────────────────────────────────────────────┤
│           ESP-IDF + FreeRTOS Kernel             │
│  Tasks │ Queues │ Semaphores │ Event Groups      │
├─────────────────────────────────────────────────┤
│              ESP32-S3 Hardware                  │
└─────────────────────────────────────────────────┘
```

### 4.2 FreeRTOS Task Layout

| Task | Priority | Stack | Description |
|------|----------|-------|-------------|
| `AudioCaptureTask` | High | 8 KB | DMA-driven mic capture, feeds DSP queue |
| `AudioPlaybackTask` | High | 4 KB | Dequeues TTS/audio frames → I2S DMA |
| `CameraTask` | Medium | 8 KB | Frame capture, JPEG encode, event trigger |
| `DisplayTask` | Medium | 8 KB | LVGL tick + UI state machine |
| `SensorTask` | Medium | 4 KB | IMU + magnetometer polling, sensor fusion |
| `AITask` | Medium | 16 KB | Wake-word detection, command inference |
| `ConnectivityTask` | Low | 6 KB | Wi-Fi/BLE event handling, MQTT/HTTP |
| `OTATask` | Low | 8 KB | Firmware update (spawned on demand) |
| `MonitorTask` | Idle+1 | 2 KB | Heap watchdog, diagnostic logging |

### 4.3 Memory Partitioning (ESP32-S3)

| Region | Allocator | Usage |
|--------|-----------|-------|
| Internal SRAM | `MALLOC_CAP_INTERNAL` | TCBs, stacks, DMA buffers |
| PSRAM (8 MB) | `MALLOC_CAP_SPIRAM` | LVGL frame buffer, JPEG buffers, AI model |
| DMA-capable | `MALLOC_CAP_DMA` | I2S DMA descriptors, SPI TX/RX buffers |
| Flash (NVS) | NVS API | Wi-Fi credentials, user config, device ID |

---

## 5. Key Software Modules

### 5.1 Voice Pipeline
```
Microphone (I2S DMA)
    → Circular ring buffer
    → Wake-word detection (e.g., ESP-SR / WakeNet)
    → ASR (SpeechRecognition or cloud STT via HTTP)
    → NLP / AI command resolution
    → TTS response → audio playback queue → Speaker (I2S DMA)
```

### 5.2 AI & Machine Learning
- **On-device**: ESP-SR (wake word + SR), TensorFlow Lite Micro for edge inference
- **Cloud-assisted**: HTTP/S REST to inference API (OpenAI, Gemini, or custom MCP server)
- **MCP Server**: Remote control, model updates, telemetry push

### 5.3 Display UI (LVGL)
- Screen driven by `DisplayTask` at 30 fps
- UI states: Idle screen → Listening → Processing → Response → Camera live view
- Widgets: status bar, waveform animation, camera preview, sensor dashboard

### 5.4 OTA Updates
- Dual-partition OTA (factory + ota_0 / ota_1)
- Triggered via BLE command or MQTT topic
- Rollback on boot failure

---

## 6. Communication Protocols Summary

| Protocol | Peripheral | Usage |
|----------|-----------|-------|
| I2S | Mic, Speaker | Full-duplex audio streaming |
| SPI | TFT Display, SD Card | High-speed data transfer |
| I2C | MPU-6050, Magnetometer | Sensor register access |
| DVP (parallel) | OV2640 Camera | Frame data |
| Wi-Fi (HTTP/S, MQTT, WebSocket) | ESP32-S3 | Cloud AI, OTA, telemetry |
| BLE (GATT) | ESP32-S3 | Mobile app companion, device config |
| UART/USB-JTAG | Built-in USB | Debugging, flashing |
| RMT | WS2812B LED | LED color animation |

---

## 7. Development Toolchain

| Domain | Tool |
|--------|------|
| Firmware | ESP-IDF (C/C++), FreeRTOS |
| UI | LVGL |
| AI/ML | ESP-SR, TFLite Micro, Python (model training) |
| Mobile App | Flutter (Android/iOS companion app) |
| PCB Design | KiCad |
| Mechanical | SolidWorks |
| Scripting / Automation | Python |
| Version Control | Git |
| Debugging | OpenOCD + GDB via USB-JTAG, ESP-IDF monitor |

---

## 8. Power Management

- **Normal operation**: ~200–300 mA (Wi-Fi active, display on)
- **Light sleep**: Wi-Fi modem sleep, display off, wake on touch/voice → ~10 mA
- **Deep sleep**: Only RTC + wake-up stub active → <100 µA
- **Charging**: USB-C input → TP4056 or IP5306 charging IC → LiPo cell

---

## 9. Diagnostic & Monitoring

- `esp_task_wdt` watchdog on all critical tasks
- `heap_caps_check_integrity_all()` periodic heap integrity check
- Runtime stats via `vTaskGetRunTimeStats()`
- UART log levels configurable per module (`ESP_LOG_*`)
- Telemetry pushed to MCP Server over MQTT (heap free, CPU load, sensor data)

---

## 10. Project Roadmap

### Phase 1 — Learning & BSP Development

Goal: Build deep, hands-on knowledge of every component and technology used in NeoAssistant. Each topic produces a working, reviewed code example. At the end of Phase 1, a full Board Support Package (BSP) exists for the target hardware.

---

#### 1.1 Programming Languages & Tools

| # | Topic | Deliverable |
|---|-------|------------|
| 1 | C (embedded idioms, pointers, bitfields, volatile) | Exercises + review |
| 2 | C++ (classes, RAII, templates for embedded) | Exercises + review |
| 3 | Python (scripting, test automation, model tooling) | Scripts + review |
| 4 | ESP-IDF project structure, Kconfig, CMake | Template project |
| 5 | Git workflow (branching, PR, semantic commits) | Conventions doc |
| 6 | Debugging — OpenOCD, GDB, ESP-IDF monitor | Debug session log |

---

#### 1.2 FreeRTOS & System Fundamentals

| # | Topic | Deliverable |
|---|-------|------------|
| 1 | Tasks, priorities, scheduling | Demo + review |
| 2 | Queues, semaphores, mutexes, event groups | Demo + review |
| 3 | DMA — I2S / SPI DMA transfers | Demo + review |
| 4 | Interrupts & ISR-safe APIs | Demo + review |
| 5 | Timers — hardware timers, `esp_timer`, RTC | Demo + review |
| 6 | Watchdog (`esp_task_wdt`) | Demo + review |
| 7 | Memory management — `heap_caps_malloc`, PSRAM, stack sizing | Demo + review |
| 8 | Power management — light sleep, deep sleep, wake stubs | Demo + review |
| 9 | Clock management — CPU freq scaling, peripheral clocks | Demo + review |
| 10 | OTA — dual-partition, rollback, TLS-verified download | Demo + review |

---

#### 1.3 BSP Driver Development (one driver per peripheral)

| # | Peripheral | Interface | Deliverable |
|---|-----------|-----------|------------|
| 1 | INMP441 microphone | I2S DMA | `bsp_mic.c/.h` + review |
| 2 | MAX98357A amplifier / speaker | I2S DMA | `bsp_speaker.c/.h` + review |
| 3 | OV2640 camera | DVP + `esp_camera` | `bsp_camera.c/.h` + review |
| 4 | ILI9341 / ST7789 TFT display | SPI | `bsp_display.c/.h` + review |
| 5 | Capacitive touch / GPIO touch pads | Touch sensor | `bsp_touch.c/.h` + review |
| 6 | WS2812B RGB LED | RMT | `bsp_led.c/.h` + review |
| 7 | MPU-6050 (accel + gyro) | I2C | `bsp_imu.c/.h` + review |
| 8 | QMC5883L magnetometer | I2C | `bsp_mag.c/.h` + review |
| 9 | MicroSD card | SPI + VFS/FAT | `bsp_sdcard.c/.h` + review |
| 10 | Battery voltage monitor | ADC | `bsp_battery.c/.h` + review |

---

#### 1.4 Communication Protocols (standalone demos)

| # | Protocol | Demo scenario | Deliverable |
|---|---------|--------------|------------|
| 1 | Wi-Fi STA/AP, HTTP/S client | Fetch REST API | Demo + review |
| 2 | MQTT (pub/sub, QoS, TLS) | Telemetry to broker | Demo + review |
| 3 | BLE GATT server | Custom service for companion app | Demo + review |
| 4 | WebSocket client | Streaming JSON to server | Demo + review |
| 5 | UART / USB-CDC | Debug shell | Demo + review |

---

#### 1.5 Algorithms & Data Structures (DSA)

| # | Topic | Application in NeoAssistant | Deliverable |
|---|-------|-----------------------------|------------|
| 1 | Ring / circular buffer | Audio capture pipeline | Implementation + review |
| 2 | Lock-free queue | ISR → task audio handoff | Implementation + review |
| 3 | State machine (FSM) | Voice UI states, connectivity states | Implementation + review |
| 4 | Sorting & search | Command lookup table | Exercises + review |
| 5 | Hash map / LUT | Fast command dispatch | Implementation + review |
| 6 | Linked list | Dynamic event list | Exercises + review |

---

#### 1.6 Digital Signal Processing (DSP)

| # | Topic | Application | Deliverable |
|---|-------|-------------|------------|
| 1 | Sampling, Nyquist, quantisation | Mic / speaker pipeline | Theory + demo |
| 2 | FFT / IFFT (ESP-DSP library) | Frequency analysis of audio | Demo + review |
| 3 | FIR / IIR filters | Noise removal from mic input | Demo + review |
| 4 | VAD (Voice Activity Detection) | Trigger wake-word stage | Demo + review |
| 5 | MFCC (Mel-frequency cepstral coefficients) | Feature extraction for ASR | Demo + review |
| 6 | Image processing basics | OV2640 frame pre-processing | Demo + review |

---

#### 1.7 Sensor Fusion

| # | Topic | Deliverable |
|---|-------|------------|
| 1 | Complementary filter (accel + gyro) | Roll/pitch estimation demo |
| 2 | Madgwick / Mahony filter | Full attitude (roll/pitch/yaw) demo |
| 3 | Hard/soft iron calibration for magnetometer | Calibrated heading demo |
| 4 | Fused pose data → LVGL UI widget | Live sensor dashboard |

---

#### 1.9 UI — LVGL

| # | Topic | Deliverable |
|---|-------|------------|
| 1 | LVGL setup, display flush callback, tick task | "Hello NeoAssistant" screen |
| 2 | Widgets: label, button, arc, chart | Component gallery demo |
| 3 | Animations & transitions | UI state transitions demo |
| 4 | Touch input integration | Interactive demo |
| 5 | PSRAM frame buffer for smooth rendering | Performance benchmark |

---

#### 1.10 AI & Machine Learning (Edge)

| # | Topic | Deliverable |
|---|-------|------------|
| 1 | ESP-SR: WakeNet wake-word detection | "Hey Neo" wake demo |
| 2 | ESP-SR: MultiNet command recognition | 10-command recognition demo |
| 3 | TensorFlow Lite Micro basics | Custom keyword model on-device |
| 4 | Cloud STT/TTS integration (HTTP REST) | Full voice roundtrip demo |
| 5 | MCP Server integration | Remote command + telemetry demo |

---

#### Phase 1 — Review Gate

Before proceeding to Phase 2, the following must be completed and reviewed:

- [ ] All BSP drivers pass hardware-in-the-loop tests
- [ ] All FreeRTOS demos reviewed with stack + heap profiling
- [ ] DSP pipeline produces clean audio capture and playback
- [ ] Sensor fusion outputs stable roll/pitch/yaw at ≥50 Hz
- [ ] LVGL UI runs at ≥25 fps with PSRAM frame buffer
- [ ] Wake-word detection accuracy ≥ 95% in quiet environment
- [ ] OTA tested end-to-end with rollback scenario
- [ ] Code review: style, MISRA-C subset compliance, no memory leaks

---

### Phase 2 — Detailed Design, Implementation, Testing & Release

Goal: Integrate all Phase 1 components into the final NeoAssistant product, validate it end-to-end, and release firmware + hardware files.

---

#### 2.1 System Architecture & Detailed Design

| # | Task | Deliverable |
|---|------|------------|
| 1 | Finalise block diagram — all tasks, queues, shared resources | Architecture diagram |
| 2 | Define inter-task communication contracts (queue depths, data types) | IPC spec document |
| 3 | Partition table design (factory, ota_0, ota_1, nvs, storage) | `partitions.csv` |
| 4 | Pin assignment & conflict resolution | Final `pins.h` |
| 5 | PSRAM heap budget allocation per subsystem | Memory map document |

---

#### 2.2 PCB & Mechanical Design

| # | Task | Deliverable |
|---|------|------------|
| 1 | Schematic capture in KiCad (all components, decoupling, ESD) | KiCad schematic |
| 2 | PCB layout — 4-layer stackup, EMC rules, RF keep-out | KiCad PCB |
| 3 | Design Rule Check (DRC) + ERC pass | DRC/ERC clean report |
| 4 | Gerber generation + BOM + CPL | Fabrication package |
| 5 | Enclosure design in SolidWorks | 3D-printable enclosure files |
| 6 | Prototype PCB fabrication & assembly | Assembled prototype v1 |

---

#### 2.3 Firmware Integration

| # | Task | Deliverable |
|---|------|------------|
| 1 | Integrate all BSP drivers into unified `bsp.h` init sequence | `bsp.c/.h` |
| 2 | Implement `AudioCaptureTask` + `AudioPlaybackTask` with ring buffer | Audio subsystem |
| 3 | Implement `AITask` — wake-word → ASR → NLP → TTS full pipeline | AI subsystem |
| 4 | Implement `CameraTask` — frame capture, JPEG, face detect trigger | Vision subsystem |
| 5 | Implement `DisplayTask` — LVGL state machine, all UI screens | UI subsystem |
| 6 | Implement `SensorTask` — IMU + mag + fusion → pose queue | Sensor subsystem |
| 7 | Implement `ConnectivityTask` — Wi-Fi STA, MQTT, BLE GATT server | Connectivity |
| 8 | Implement `OTATask` — triggered OTA with progress UI | OTA subsystem |
| 9 | Implement `MonitorTask` — WDT, heap stats, MQTT telemetry | Diagnostics |
| 10 | Power management — auto light/deep sleep, wake-on-voice | Power modes |

---

#### 2.4 Mobile App (Flutter)

| # | Task | Deliverable |
|---|------|------------|
| 1 | BLE GATT client — device discovery, pairing, config push | BLE module |
| 2 | Live telemetry dashboard — heap, CPU, sensor data via MQTT | Dashboard screen |
| 3 | OTA trigger UI — firmware update from app | OTA screen |
| 4 | Voice/chat UI — send text commands, receive AI responses | Chat screen |
| 5 | Camera live view — MJPEG stream from device | Camera screen |
| 6 | Build + publish (Android APK, iOS IPA) | Release builds |

---

#### 2.5 Testing

| # | Test Type | Scope | Pass Criteria |
|---|-----------|-------|--------------|
| 1 | Unit tests | Each BSP driver | All register reads/writes correct |
| 2 | Integration tests | Task interactions via queues | No deadlocks, correct data flow |
| 3 | Audio quality test | SNR of mic capture, speaker THD | SNR > 50 dB, THD < 1% |
| 4 | Wake-word accuracy test | 100-utterance test set | Accuracy ≥ 95%, false positive < 1/hr |
| 5 | Display frame-rate test | LVGL render loop | ≥ 25 fps sustained |
| 6 | Memory stress test | 24-hour run, heap monitor | No leaks, watermark stable |
| 7 | OTA end-to-end test | Full update + rollback | Binary verified, rollback works |
| 8 | Power consumption test | Each sleep mode | Matches targets in Section 8 |
| 9 | EMC / hardware test | Assembled PCB v1 | Wi-Fi RSSI nominal, no I2C glitches |

---

#### 2.6 PC Monitor Tool (Python)

A desktop diagnostics and monitoring application that connects to NeoAssistant over USB-CDC / UART or MQTT and provides real-time visibility into device state.

| # | Feature | Details | Deliverable |
|---|---------|---------|------------|
| 1 | Serial / MQTT connection | Auto-detect USB-CDC port or connect to MQTT broker; reconnect on drop | `connection.py` |
| 2 | Real-time heap monitor | Live line chart of free heap, PSRAM free, and all-time watermark (matplotlib / pyqtgraph) | `heap_monitor.py` |
| 3 | CPU & task stats | Parse `vTaskGetRunTimeStats()` output; display per-task CPU% bar chart | `task_stats.py` |
| 4 | Audio waveform viewer | Stream PCM samples over serial; render real-time waveform + FFT spectrum | `audio_viewer.py` |
| 5 | IMU / sensor live plot | Roll, pitch, yaw + raw accel/gyro/mag on scrolling time-series chart | `sensor_plot.py` |
| 6 | Log viewer | Colour-coded ESP_LOG output with level filter (E/W/I/D/V) and regex search | `log_viewer.py` |
| 7 | OTA trigger | Select local `.bin` file, push to device via HTTP or MQTT; show progress bar | `ota_tool.py` |
| 8 | Config editor | Read/write NVS keys over serial command protocol; form-based UI | `config_editor.py` |
| 9 | Screenshot / snapshot | Capture LVGL screen over serial and save as PNG | `screen_capture.py` |
| 10 | Packaged app | `pyinstaller` single-executable for Windows/Linux/macOS; `requirements.txt` | `dist/neoassistant-monitor` |

**Tech stack**: Python 3.11+, `pyserial`, `paho-mqtt`, `pyqtgraph` or `matplotlib`, `PyQt6` / `tkinter`, `pyinstaller`

---

#### 2.7 Release

| # | Task | Deliverable |
|---|------|------------|
| 1 | Tag firmware release `v1.0.0` in Git | Git tag + changelog |
| 2 | Generate signed OTA binary | `neoassistant_v1.0.0.bin` |
| 3 | Publish KiCad hardware files | Hardware repo release |
| 4 | Publish Flutter app to internal track | APK / IPA |
| 5 | Write user-facing README + quickstart guide | `README.md` |
| 6 | Post-release monitoring — telemetry dashboard live | MCP Server active |
