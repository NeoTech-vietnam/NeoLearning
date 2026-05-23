# Cornell Notes

## Topic: Features of RTA-OS Kernel - AUTOSAR

## Date: 16/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- First question or keyword
- Second question or keyword
- Third question or keyword

---

### Notes Section (Main Notes)

#### AUTOSAR OS
- AUTOSAR OS is an extension to the OSEK OS specification. An AUTOSAR OS includes all the features of OSEK OS and adds some new functionality which is divided into four **Scalability Classes** as follows:
  - **Scalability Class 1**: includes OSEK OS plus:
    - **Schedule Tables**: 
      - Schedule tables provide an easier alternative to OSEK Alarms when programming repeating activities.
      -  Each schedule table can be managed as a single unit and you can switch between tables at runtime, allowing you to build modal systems easily.
     -  **Software Counter Interface**: The interaction between the OS and counters has been standardized. It was vendor specific in OSEK.
     -  **Stack Monitoring**: Additional debugging support has been added to assist with stack-faults.
  - **Scalability Class 2**: includes Scalability Class 1 plus:
    - **Schedule Table Synchronization**: Schedule tables can be synchronized with a global time source (although this is trivially possible within Scalability Class 1).
    - **Timing Protection**: Protection is added to guard against tasks and interrupts executing for too long or too often. The protection scheme allows you to constrain at runtime those aspects of system timing that control whether your system meets its deadlines or not.
  - **Scalability Class 3**: includes Scalability Class 1 plus
    - **Memory Protection**:
      - Memory protection allows a system to be partitioned into OS-Applications.
      - OS-Applications can be configured to be trusted, i.e. they run in what is typically called ’supervisor mode’, 
      - Or untrusted, i.e. they run in what is typically called ’user mode’. 
      - Memory access constraints can be programmed for untrusted OS-Applications and the OS manages the target microcontroller’s memory management features at runtime to provide protection. 
      - There is also a trusted-with protection mode where the code is trusted, but also can have memory access constraints.
    - **Service Protection**:
      - Access to the OS API can be allowed or denied for configured tasks/ISRs. For example you can forbid a task in one OS-Application from activating tasks in another OS-Application. 
      - API call protection also provides a mechanism for extending the API by adding trusted functions and granting or denying access to these functions as you would for the OS API.
  - **Scalability Class 4**: is a superset of Scalability Classes 2 and 3.
- RTA-OS 12.3.0 supports all AUTOSAR OS features from Scalability Classes 1 to 4. 
- It also supports multicore applications described in the AUTOSAR multicore OS specification, including the IOC (Inter OsApplication Communication) mechanism. The IOC provides services for the AUTOSAR RTE, and is not discussed further here
- As AUTOSAR OS is based on OSEK OS, it is backwards compatible to existing OSEK OS-based applications - i.e. applications written for OSEK OS will largely run on AUTOSAR OS without modification.
- However, the AUTOSAR OS standard also clarifies some of the ambiguities in the OSEK OS specification that arise when the behavior of OSEK OS is undefined or vendor specific because these represent a barrier to portability. 
- Users who are migrating from an OSEK OS and rely upon a particular implementation of an OSEK OS feature should be aware that AUTOSAR OS defines the required OSEK OS behavior in the following cases:

| OSEK OS                                                                               | AUTOSAR OS                                                          |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Behavior of relative alarms started at an offset of zero is undefined                 | Relative alarms cannot be started at a relative time of zero        |
| The `StartOS()` API call may or may not return depending on the vendor implementation | `StartOS()` must not return                                         |
| The behavior of `ShutdownOS()` is not defined if the `ShutdownHook()` returns.        | `ShutdownOS()` disables all interrupts and enters an infinite loop. |

---

### Summary Section (Summary of Notes)

Brief summary of key ideas and takeaways