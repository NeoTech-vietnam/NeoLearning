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
│  OTA Manager │ Security (TLS/NVS encrypt)       │
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
- TLS-verified binary download with rollback on boot failure

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