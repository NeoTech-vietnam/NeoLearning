# Cornell Notes

## Topic: ComVeh Overview

## Date: 28/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- First question or keyword
- Second question or keyword
- Third question or keyword

---

### Notes Section (Main Notes)

#### Basic Information

**Long name:** Communication Vehicle (ComVeh)

#### Software Architecture Description

**ComVeh - Communication Vehicle**

**Task**

ComVeh contains customer specific functions on application layer for the CAN, LIN and Flexray communication between the ECU and other control units in the vehicle. The package contains the frame manager with functions for the receiving and the sending of information from / to the:
- Transmission / Gearbox /Clutch control unit
- Brake / Traction Control / Electronic Stability Program control unit
- A/C control unit
- Airbag control unit
- Adaptive Cruise Control control unit
- All Wheel Drive control unit
- Starter generator control unit
- Steering assistance control unit
- Battery control unit
- NOx-Sensor
- Gateway

#### Package List

- BC : ComVeh / x.x.x;
  - MC : ComCIL / x.x.x;
    - FC : ComCIL_Adapt / x.x.x;
    - FC : ComCIL_CoProPostDrv / x.x.x;
    - FC : ComCIL_Diag / x.x.x;
    - FC : ComCIL_Lib / x.x.x;
    - FC-ARB : ComCIL_CalidCvn / x.x.x;
    - GC : SnsrECU / x.x.x;
    - SC : ComCIL / x.x.x;
  - MC : ComScl / x.x.x;
    - FC : ComScl_IfFct / x.x.x;
    - FC : ComScl_Misc / x.x.x;
    - FC : ComScl_MonBusErr / x.x.x;
    - FC : ComScl_MonPduErr / x.x.x;
    - FC : ComScl_MonRprt / x.x.x;
    - FC-ARB : ComScl_Appl / x.x.x;
    - FC-ARB : ComScl_Coor / x.x.x;
    - FC-ARB : ComScl_Lib / x.x.x;
    - FC-ARB : ComScl_NetMtrx / x.x.x;
    - FC-ARB : rba_ComScl / x.x.x;
    - FC-ARB : rba_Nds / x.x.x;
  - MC : ComVehPduRAcs / x.x.x;
    - FC-ARB : ComVehPduRAcs_Gatewy / x.x.x;
  - SC : ComVeh / x.x.x;
    - DOCHINT : BC_ComVeh_Integration_Hints / x.x.x;
    - MISC : ComVeh / x.x.x;
    - MWCFG : comveh / x.x.x;
    - SPEC : ComVeh / x.x.x;
    - SWHDR : comveh / x.x.x;
    - TDATA : comveh_dysched / x.x.x;

| Package Name                          | Class                                  | Long Name                                                            |
| ------------------------------------- | -------------------------------------- | -------------------------------------------------------------------- |
| BC : ComVeh / x.x.x                   | Basic Component                        | Communication Vehicle                                                |
| MC : ComCIL / x.x.x                   | Main Component                         | Communication Customer Interface Layer                               |
| FC : ComCIL_Adapt / x.x.x             | Functional Component                   | ---                                                                  |
| FC : ComCIL_CoProPostDrv / x.x.x      | Functional Component                   | ---                                                                  |
| FC : ComCIL_Diag / x.x.x              | Functional Component                   | ---                                                                  |
| FC : ComCIL_Lib / x.x.x               | Functional Component                   | ---                                                                  |
| FC-ARB : ComCIL_CalidCvn / x.x.x      | Functional Component for AUTOSAR (BSW) | ---                                                                  |
| GC : SnsrECU / x.x.x                  | Group Component                        | ---                                                                  |
| SC : ComCIL / x.x.x                   | Self Component                         | ---                                                                  |
| MC : ComScl / x.x.x                   | Main Component                         | Com Signal Conversion Layer                                          |
| FC : ComScl_IfFct / x.x.x             | Functional Component                   | ---                                                                  |
| FC : ComScl_Misc / x.x.x              | Functional Component                   | ---                                                                  |
| FC : ComScl_MonBusErr / x.x.x         | Functional Component                   | ---                                                                  |
| FC : ComScl_MonPduErr / x.x.x         | Functional Component                   | ---                                                                  |
| FC : ComScl_MonRprt / x.x.x           | Functional Component                   | ---                                                                  |
| FC-ARB : ComScl_Appl / x.x.x          | Functional Component for AUTOSAR (BSW) | ---                                                                  |
| FC-ARB : ComScl_Coor / x.x.x          | Functional Component for AUTOSAR (BSW) | ---                                                                  |
| FC-ARB : ComScl_Lib / x.x.x           | Functional Component for AUTOSAR (BSW) | ---                                                                  |
| FC-ARB : ComScl_NetMtrx / x.x.x       | Functional Component for AUTOSAR (BSW) | Communication Signal Conversion Layer - Network Matrix Configuration |
| FC-ARB : rba_ComScl / x.x.x           | Functional Component for AUTOSAR (BSW) | ---                                                                  |
| FC-ARB : rba_Nds / x.x.x              | Functional Component for AUTOSAR (BSW) | ---                                                                  |
| MC : ComVehPduRAcs / x.x.x            | Main Component                         | ---                                                                  |
| FC-ARB : ComVehPduRAcs_Gatewy / x.x.x | Functional Component for AUTOSAR (BSW) | ---                                                                  |
| SC : ComVeh / x.x.x                   | Self Component                         | ---                                                                  |
| MISC : ComVeh / x.x.x                 | Miscellaneous                          | ---                                                                  |
| MWCFG : comveh / x.x.x                | Make Ware: Configuration File          | ---                                                                  |
| SPEC : ComVeh / x.x.x                 | Specification of a Component           | ---                                                                  |
| SWHDR : comveh / x.x.x                | Software Header                        | ---                                                                  |
| TDATA : comveh_dysched / x.x.x        | Technical Data Description             | ---                                                                  |



---

### Summary Section (Summary of Notes)

Brief summary of key ideas and takeaways