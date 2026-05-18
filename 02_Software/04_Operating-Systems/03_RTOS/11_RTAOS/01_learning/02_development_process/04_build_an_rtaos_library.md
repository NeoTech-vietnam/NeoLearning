# Cornell Notes

## Topic: Build an RTA-OS Library

## Date: 18/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- First question or keyword
- Second question or keyword
- Third question or keyword

---

### Notes Section (Main Notes)

#### Build an RTA-OS Library
- To build an RTA-OS library it follows that all the standard AUTOSAR header files are required as inputs to the build process and these are outside the scope of the OS.
- However, RTA-OS can generate sample versions of the AUTOSAR standard header files if required.

#### Introduction about RTAOS Tools

##### RTAOSGen and RTAOSCfg
- RTAOSGen is a command line tool. You can invoke it from the Windows command prompt, from a make script, Ant script, in fact from anywhere where you can call a Windows application. 
- The **RTAOSGen** tool can be run from the **RTAOSCfg** Builder if you prefer to use a graphical environment.
- RTAOSGen is available for both Windows and Linux systems.
- RTAOSGen takes one or more configuration files as input.
- Configuration files can be:
  - AUTOSAR XML
  - RTA-OS project files
  - A mixture of both
- For more information about how to build the library by **RTAOSGen**, please refer to the official documentation of RTA-OS.
- After getting successful build from the library, you can get generated files as follow:

| File name           | Contents                                                                                                                                                                                                                                                  |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Os.h`, `Os_Cfg.h`  | The main header file for the RTA-OS library. It contains declarations of all the functions, types, and macros that are part of the RTA-OS API.                                                                                                            |
| `Os_MemMap.h`       | AUTOSAR memory mapping configuration used by RTA-OS to merge with the system-wide MemMap.h file in AUTOSAR versions 4.0 and earlier. From AUTOSAR version 4.1, Os_MemMap.h is used by the OS instead of MemMap.h. This is an optionally generated sample. |
| `RTAOS.<lib>`       | The RTA-OS library for your application. The extension <lib> depends on your target.                                                                                                                                                                      |
| `RTAOS.<lib>.sig`   | A signature file for the library for your application. This is used by RTAOSGen to work out which parts of the kernel library need to be rebuilt if the configuration has changed. The extension `<lib>` depends on your target.                          |
| `<projectname>.log` | A log file that contains a copy of the text that the tool and compiler sent to the screen during the build process.                                                                                                                                       |

---

### Summary Section (Summary of Notes)

Brief summary of key ideas and takeaways