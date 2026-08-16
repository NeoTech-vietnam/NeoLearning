# Cornell Notes

## Topic: MCPWM Debugging and Common Failures

## Date: 20/07/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- What does each common ESP-IDF error imply?
- Why can valid timer configurations conflict when combined?
- How should a missing or incorrect waveform be debugged?
- Which mistakes are dangerous on a power stage?

---

### Notes Section (Main Notes)

#### Error Decoder

| Error | Likely MCPWM cause | First check |
|---|---|---|
| `ESP_ERR_INVALID_ARG` | bad ID/range/direction, null handle, parent mismatch | configuration and same-group relationships |
| `ESP_ERR_NOT_FOUND` | no free timer/operator/channel/trigger slot | resource tree and deletion leaks |
| `ESP_ERR_INVALID_STATE` | wrong lifecycle, shared clock/priority conflict, child still attached | call order and first group user |
| `ESP_ERR_NOT_SUPPORTED` | SoC/config lacks requested feature | ESP32-S3 capability macro and Kconfig |
| `ESP_ERR_NO_MEM` | heap/object/group allocation failed | memory and cleanup path |

#### No PWM on the Pin

Check from left to right:

```text
timer enabled and started?
→ operator connected to same-group timer?
→ compare value within peak?
→ actions match count direction/events?
→ force/brake inactive?
→ generator routed to correct output-capable GPIO?
→ scope ground/reference correct?
```

Enable `CONFIG_MCPWM_ENABLE_DEBUG_LOG` during investigation, then remove it when binary size/log volume matters.

#### Wrong Frequency or Duty

- Recalculate from the **actual** resolution; the driver can warn that it adjusted the request.
- In up-down mode remember that ESP-IDF `period_ticks` represents the full cycle while internal `peak_ticks` is half.
- Confirm integer divider quantization for carrier/dead-time timing.
- Ensure a new compare/period value has reached the active register at the selected TEZ/TEP/sync boundary.

#### Prescaler and Priority Conflicts

Clock source, group prescaler, and explicit interrupt priority are shared. The first group object establishes them. Reorder allocations by resolution, choose compatible resolutions, or place incompatible sets in different MCPWM groups.

#### Sync/Capture Problems

- Sync: check same-group source, GPIO polarity, legal phase/direction, and that the source event occurs.
- Capture: check GPIO routing, selected edges, channel enable, timer enable/start, ISR-safe callback, and unsigned wraparound arithmetic.

#### Power-Stage Danger Checklist

- Reversed fault polarity or an unconfigured brake action.
- Complementary outputs with insufficient or wrongly routed dead time.
- Held software force overriding normal safe actions.
- Enabling the gate driver before GPIO levels and fault behavior are known.
- Performing shutdown in a task callback instead of the hardware brake path.

Use an oscilloscope/logic analyzer and current-limited supply. Compare observed events with [TRM registers](../01_technical_reference_manual/07_registers.md), then trace the corresponding LL call rather than writing registers around the driver.

#### API Catalog Links

- Factory functions and their resource errors: [timer](15_mcpwm_apis.md#api-mcpwm-new-timer), [operator](15_mcpwm_apis.md#api-mcpwm-new-operator), [comparator](15_mcpwm_apis.md#api-mcpwm-new-comparator), [generator](15_mcpwm_apis.md#api-mcpwm-new-generator), [capture channel](15_mcpwm_apis.md#api-mcpwm-new-capture-channel)
- State-sensitive controls: [`mcpwm_timer_enable()`](15_mcpwm_apis.md#api-mcpwm-timer-enable), [`mcpwm_timer_start_stop()`](15_mcpwm_apis.md#api-mcpwm-timer-start-stop), [`mcpwm_capture_channel_enable()`](15_mcpwm_apis.md#api-mcpwm-capture-channel-enable)
- [Complete API/type catalog and ESP32-S3 capability notes](15_mcpwm_apis.md)

---

### Summary Section (Summary of Notes)

- Diagnose MCPWM as a pipeline: time base, connection, event, action, post-processing, GPIO.
- Shared group settings explain many individually valid configurations that fail together.
- Verify faults and complementary timing before connecting power hardware.
