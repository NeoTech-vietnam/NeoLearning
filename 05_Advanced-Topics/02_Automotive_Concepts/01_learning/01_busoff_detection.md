# Cornell Notes

## Topic: Bus Off Detection

## Date: 11/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- First question or keyword
- Second question or keyword
- Third question or keyword

---

### Notes Section (Main Notes)

#### 1. Requirement Analysis

- Customer has a requirement for the BusOff-End-Detection: BusOff-State is left after the first successful transmission.

- For BusOff-End-Detection and leaving the BusOff-State, the BSW offers 2 different options:
  - **Option 1**: Wait a configured time and check if at least one PDU was transmitted successfully.
  - **Option 2**: Immediately after successful transmission of one PDU.

##### Option 1
- To leave the BusOff-State, a configured time needs to elapse (CanSMBorTimeTxEnsured).
- The value for the configured time depends on the cycle-time of the TX-PDUs on the bus and therefore is dependent on the K-Matrix.
- The value of CanSMBorTimeTxEnsured is set to 60ms in all the line. The value assumes, that if only the slowest PDU was enabled, that PDU was transmitted within 60ms. The PDU-Start-Delay-Time-Configuration shall ensure this. 
- The Lastenheft-Requirement [A: CAN_1193] (BusOff-State is left after the first successful transmission.) is not fulfilled.

##### Option 2
- Immediately after successful transmission of one PDU, BusOff-Sate is left and there is no need to wait for a configured time. Hence, the requirement is fulfilled.
- No need to configure a K-Matrix dependent time to check for the BusOff-End. Configuration is simplified.
- This can be activated via CanSMBorTxConfirmationPolling set to True.

#### 2. Fundamentals Knowledge About Bus Off

##### 2.1. What is Bus-Off
- A bus-off event means the ECU’s CAN controller has seen so many transmission/reception errors that it is forced out of normal bus communication. In the image below, the bus-off condition is reached when the Transmit Error Counter (TEC) reaches 256. The bus-off condition is detected by the CAN controller and reported to the software (CAN State Manager) via an interrupt.

![alt text](image-1.png)

- *Note:*
  - *The TEC field has 8-bit and so, it could happen that on the base of counter values the addiction of 8 units, due to the last error before entering bus off condition, will cause the counter overflow and so the counter is not updated also if the bus off condition is detected.*
  - *The bus off condition can be easily reached for debugging reasons with a **short circuit** between CAN-H and CAN-L lines while the controller is transmitting messages.*

- When a bus-off event occurs, the software (will be handled by the CAN State Manager) then:
  - Recognizes the event,
  - Switches the network into silent mode,
  - Raises a diagnostic event,
  - Waits for a configured recovery delay,
  - Restarts the controller,
  - Checks whether communication succeeds again or whether bus-off repeats.

- Let's look at the bus-off procedure in more details.

##### 2.2. Bus-Off-Detection
- The bus-off event is detected by the CAN controller and reported to the software (CAN State Manager) via an interrupt. The CAN State Manager then handles the bus-off event as described in the previous point.
```c
// Flow of bus-off event recieve 
ISR(OS_2Q1_Can_Transfer_ISR_MCAN_1) // Operating System
{
  Can_Transfer_ISR_MCAN_1();
}
// Can_Transfer_ISR_MCAN_1()
void Can_Transfer_ISR_MCAN_1(void) // Can_Cfg.c -> CanStack/rba_Can
{
  rba_CanMcan_TransferISR((uint8)MCAN_1);
}
// rba_CanMcan_TransferISR
void rba_CanMcan_TransferISR(uint8 Controller_u8) // Can.c -> CanStack/rba_Can
{
  rba_CanMcan_Prv_ProcessTxFIFOList(Controller_u8);
}
// rba_CanMcan_Prv_ProcessTxFIFOList
static void rba_CanMcan_Prv_ProcessTxFIFOList(uint8 Controller_u8) // Can.c -> CanStack/rba_Can
{
  rba_CanMcan_Prv_OnInterruptTxEventReceived(idxController_u8, MessageMarkerVal_u8);
}
// rba_CanMcan_Prv_OnInterruptTxEventReceived
LOCAL_INLINE void rba_CanMcan_Prv_OnInterruptTxEventReceived(uint8 idxController_u8, uint8 MessageMarkerVal_u8) // Can.c -> CanStack/rba_Can
{
  CanIf_TxConfirmation(idxTxPdu_u16);
}
// CanIf_TxConfirmation
#define CANIF_TXCONFIRMATION_FNAME                 CanIf_TxConfirmation
void CANIF_TXCONFIRMATION_FNAME(PduIdType CanTxPduId) // CanIf_TxConfirmation.c -> CanStack/CanIf
{
    lControllerState_p->CanIf_TxCnfmStatus = CANIF_TX_RX_NOTIFICATION;
}
CanIf_NotifStatusType CanIf_GetTxConfirmationState(
    uint8 ControllerId) // CanIf_GetTxConfirmationState.c -> CanStack/CanIf
{
      /*Read TxConfirmationState of the requested controller*/
    lTxConfmStatus = (CanIf_Prv_ControllerState_ast + ControllerId)->CanIf_TxCnfmStatus;
    return lTxConfmStatus;
}
```
- After the bus-off event is reported via `lTxConfmStatus`, the CAN State Manager can then handle the bus-off event via the flow below:
```c
Std_ReturnType CanSM_CheckTxRxNotification(NetworkHandleType network) // CanSM_ControllerBusOff.c -> CanStack/CanSM
{
    CanSM_NetworkConf_ps = &CanSM_Network_pcst[network];
  ... = CanIf_GetTxConfirmationState(CanSM_ControllerId_u8)
}
```
- Now, the sequence comes to picture, the handling for the recovery action in the `CanSM_MainFunction()`
```c
void CanSM_MainFunction(void) // CanSM_Main.c -> CanStack/CanSM
{
... = CanSM_CheckTxRxNotification((uint8)CanSM_NetworkIdx_u8)
}
```
- And obviously, it is matched with the AUTOSAR architecture for the bus-off event handling as shown in the image below:

![alt text](image-2.png)

##### 2.3. Bus-Off-End-Detection (Bus-Off Recovery)
- Bus-off recovery is the procedure the CAN State Manager uses after a CAN controller enters the bus-off state, in order to bring communication back and verify that recovery was successful.
- Bus-off recovery includes these parts:
  - **Detect the bus-off**: After receiving the information from Can controller -> CanIf, the bus-off data is then considered by the CAN network state machine.
  - **Enter bus-off handling**:
    - When bus-off occurs, CanSM: 
      - reports `CANSM_BSWM_BUS_OFF` to BswM
      - informs ComM with `COMM_SILENT_COMMUNICATION`
      - sets the DEM event `CANSM_E_BUS_OFF`
      - to `DEM_EVENT_STATUS_PRE_FAILED`
  - **Wait the configured recovery time**: 
    - The recovery waiting time is configurable:
      - `CanSMBorTimeL1` = level 1, short recovery time
      - `CanSMBorTimeL2` = level 2, long recovery time
    - When the time is exceeds the CanSMBorTimeL2, the CAN State Manager will then try to recover from the bus-off state by restarting the CAN controller and checking if communication is successful again. by jumping to the state `CANSM_S_BUS_OFF_CHECK`.
      - If it is successful, the CAN State Manager will then report `CANSM_S_NO_BUS_OFF`, else, it just looping the state `CANSM_S_BUS_OFF_RECOVERY_L2`.

#### 3. AUTOSAR Specification for BusOff-End-Detection
- The AUTOSAR specification for BusOff-End-Detection with two options is described in the AUTOSAR SWS for CAN State Manager (CanSM), [AUTOSAR_CP_SWS_CANStateManager](https://www.autosar.org/fileadmin/standards/R23-11/CP/AUTOSAR_CP_SWS_CANStateManager.pdf).

#### 4. Scope of the requirement

##### CanSMBorTimeTxEnsured
![alt text](image.png)
- Which means: 



---

### Summary Section (Summary of Notes)

Brief summary of key ideas and takeaways