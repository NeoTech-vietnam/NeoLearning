# Cornell Notes

## Topic: Signal Conversion for ComScl-NetMtrx

## Date: 01/06/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- First question or keyword
- Second question or keyword
- Third question or keyword

---

### Notes Section (Main Notes)

#### 1. Motivation

The signal `API_PrctDrvPed` is received from the bus and needs to be converted to the interface signals.

As in the application software, there are tons of interfaces can be provided by other components.
  - Signals on bus: `API_PrctDrvPed` should be provided with a specific value with a specific unit, computation methods.
  - Interfaces: Components from other suppliers may have different requirements for the signal, such as different units, scaling, or data types.

The conversion process is necessary to ensure that the signal can be correctly interpreted and used by the receiving component.

For the note to be easy to visualize, we will use a specific example for the signal `API_PrctDrvPed` to be recieved from bus and the convert to the interface signal `Eng_rAcepedVal_VW`. with some given values in the ARXML files.

#### 2. Complete Trace: How `{ (0), 0, 32, 25, 0 }` is Generated

##### ARXML Source Values

File: `comscl_netmtrx_bus_<xx>_ecucvalues.arxml` (NetworkReresentation):

```
rba_Nds_Signal "rba_Nds_Signal_API_PrctDrvPed_XIX_HCP1_02_XIX_HCP1_FlexRay_A"
{
    rba_Nds_BitSize = 8 (= 0x08)
    rba_Nds_Description = "driver acceleration pedal in percent"
    rba_Nds_Encoding = "UNSIGNED"
    rba_Nds_Name = "API_PrctDrvPed_XIX_HCP1_02_XIX_HCP1_FlexRay_A"
    rba_Nds_NetworkRepresentation "rba_Nds_NetworkRepresentation_0_API_PrctDrvPed_XIX_HCP1_02_XIX_HCP1_FlexRay_A"
    {
        rba_Nds_RationalFunctionRepresentation "rba_Nds_RationalFunctionRepresentation"
        {
            rba_Nds_Denominator0 = "1"
            rba_Nds_Denominator1 = ""
            rba_Nds_MaxNetworkValue = "200"
            rba_Nds_MaxPhysicalValue = "100"
            rba_Nds_MinNetworkValue = "0"
            rba_Nds_MinPhysicalValue = "0"
            rba_Nds_Numerator0 = "0"
            rba_Nds_Numerator1 = "0.5"
            rba_Nds_Unit = "Unit_PerCent"
        }
    }
}
```
- `Numerator0` = `0` → InN0 = 0.0
- `Numerator1` = `0.5` → InN1 = 0.5
- `Denominator0` = `1` → InD0 = 1.0
- `Denominator1` = `(empty)` → InD1 = 0.0

File: `comscl_netmtrx_signal_mapping_ecucvalues.arxml` (ApplicationRepresentation):

```
rba_Nds_ReceiveSignalApplicationPort "rba_Nds_ReceiveSignalApplicationPort_Eng_rAcepedVal_VW"
{
    rba_Nds_DataType = "UINT8"
    rba_Nds_InitValue = "MAXUINT8"
    rba_Nds_Name = "Eng_rAcepedVal_VW"
    rba_Nds_ApplicationRepresentation "rba_Nds_ApplicationRepresentation_1f690f05_fdf1_4672_bdb4_0213c82f3fb0"
    {
        rba_Nds_RationalFunctionRepresentation "rba_Nds_RationalFunctionRepresentation"
        {
            rba_Nds_Denominator0 = "256.0"
            rba_Nds_Denominator1 = "0.0"
            rba_Nds_Numerator0 = "0.0"
            rba_Nds_Numerator1 = "100.0"
            rba_Nds_Unit = "%"
        }
    }
}
```

- `Numerator0` = `0.0` → OutN0 = 0.0
- `Numerator1` = `100.0` → OutN1 = 100.0
- `Denominator0` = `256.0` → OutD0 = 256.0
- `Denominator1` = `0.0` → OutD1 = 0.0

##### Script/Function Chain
##### 1. `rba_Nds_SignalClassUtil.ext` → `calculateSignalClassNew(map, netRepr, appRepr)` (line 817)

Orchestrates the whole chain:

```
appRepr.getNumeratorsAndDenominators(map, "Out")   // reads App repr N/D values
netRepr.getNumeratorsAndDenominators(map, "In")    // reads Net repr N/D values
getABCDReal(map, root)                             // computes real-valued A,B,C,D
calculateShiftFactor(map)                          // computes shift factor (0 here)
calculateABCDLong(map)                             // converts real→integer using GCD
```

##### 2. `rba_Nds_SignalClassUtil.ext` → `getNumeratorsAndDenominators` (lines 1116, 1210)

Reads `rba_Nds_RationalFunctionRepresentation` fields from the loaded ARXML model and stores them as `InN0`, `InN1`, `InD0`, `InD1` (for network) and `OutN0`, `OutN1`, `OutD0`, `OutD1` (for application) in the computation map.

##### 3. `rba_Nds_SignalClassUtil.ext` → `getABCDReal(map, root)` (line 1443)

No unit conversion needed (same unit). Uses this formula:

> $A=InN0×OutD0−InD0×OutN0=0×256−1×0=0.0$
> $B=InN1×OutD0−InD1×OutN0=0.5×256−0×0=128.0$
> $C=InD0×OutN1−InN0×OutD1=1×100−0×0=100.0$
> $D=InD1×OutN1−InN1×OutD1=0×100−0.5×0=0.0$

→ `A_r=0.0, B_r=128.0, C_r=100.0, D_r=0.0`

##### 4. `rba_Nds_SignalClassUtil.ext` → `calculateShiftFactor(map)` (line 1720)

All `A_r, B_r, C_r, D_r` are already integers → ShiftFactor = 0

##### 5. `rba_Nds_SignalClassUtil.ext` → `calculateABCDLong(map)` (line 1887)

```
shiftFactor_toMultiply = 2^0 = 1
A_l = 0,  B_l = 128,  C_l = 100,  D_l = 0

GCD(0, 128, 100, 0) = GCD(128, 100) = 4    ← rba_Nds_getGCD (rba_Nds_MathUtil.ext)

A_l / 4 = 0
B_l / 4 = 32
C_l / 4 = 25
D_l / 4 = 0
```
→ map: `"A_l"=0, "B_l"=32, "C_l"=25, "D_l"=0`, `"ShiftFactor"=0`

##### 6. `rba_Nds_SignalClassUtil.ext` → `getFactor / getShiftFactorNew` (lines 622, 389)

These are thin wrappers that just read from the map:

- `rba_Nds_getShiftFactorNew(sigConv)` → returns `map.get- ("ShiftFactor")` = 0
- `rba_Nds_getFactor(sigConv, "A")` → returns `map.get("A_l")` = 0
- `rba_Nds_getFactor(sigConv, "B")` → returns `map.get("B_l")` = 32
- `rba_Nds_getFactor(sigConv, "C")` → returns `map.get("C_l")` = 25
- `rba_Nds_getFactor(sigConv, "D")` → returns `map.get("D_l")` = 0

##### 7. `rba_ComScl_ConversionFactors_Util.xpt` → `printFactorsRx` (lines ~681–693)

Template emits the array element (non-float, usage=="array" path):

```
{
 («rba_Nds_getShiftFactorNew(this)»),       // → (0)
    «rba_Nds_getFactor(this, "A")»,          // → 0
    «rba_Nds_getFactor(this, "B")»,          // → 32
    «rba_Nds_getFactor(this, "C")»,          // → 25
    «rba_Nds_getFactor(this, "D")»           // → 0
}
```

Output → `ComScl_NetMtrx_Scl_ConversionFactors.c` line 205:

```c
{ (0), 0, 32, 25, 0 }
```

##### Complete Call Chain Summary
```
ARXML (Net: N0=0, N1=0.5, D0=1, D1=0 | App: N0=0, N1=100, D0=256, D1=0)
  ↓ EOS reads into rba_Nds model objects
rba_Nds_SignalClassUtil.ext :: calculateSignalClassNew()
  ├─ getNumeratorsAndDenominators() → InN0=0, InN1=0.5, InD0=1 | OutN0=0, OutN1=100, OutD0=256
  ├─ getABCDReal()  → A_r=0, B_r=128, C_r=100, D_r=0
  ├─ calculateShiftFactor() → ShiftFactor=0 (values already integers)
  └─ calculateABCDLong()
       └─ rba_Nds_MathUtil.ext :: rba_Nds_getGCD(0,128,100,0) = 4
       → A_l=0, B_l=32, C_l=25, D_l=0
  ↓
rba_Nds_SignalClassUtil.ext :: rba_Nds_getShiftFactorNew() → 0
rba_Nds_SignalClassUtil.ext :: rba_Nds_getFactor("A/B/C/D") → 0, 32, 25, 0
  ↓
rba_ComScl_ConversionFactors_Util.xpt :: printFactorsRx (usage="array")
  → emits: { (0), 0, 32, 25, 0 }
  ↓
_out/ComScl_NetMtrx_Scl_ConversionFactors.c  line 205
```

---

### Summary Section (Summary of Notes)

Brief summary of key ideas and takeaways