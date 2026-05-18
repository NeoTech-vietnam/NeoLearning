# Cornell Notes

## Topic: Intergration

## Date: 18/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- First question or keyword
- Second question or keyword
- Third question or keyword

---

### Notes Section (Main Notes)

#### Accessing the OS in your Source Code
- To access RTA-OS in your source code you simply include `#include <Os.h>` in every C compilation unit (i.e. every C source code file) where you need to access RTA-OS.
- The header file is protected against multiple-inclusion. RTA-OS does not place any restrictions on how you organize your source code - you can put all of your code into a single source file or put each task and interrupt implementation into its own source file.

- *Note: Only documented OS APIs are considered to be public. Functions and data in OS header files that are not documented should not be used in non-OS code.*

#### Implementing Tasks and ISRs
##### Tasks
- For each task that you declare at configuration time you must provide an implementation of the task. Each task needs to be marked using the `TASK(x)` macro. Tasks typically have the following structure:
```c
#include <Os.h>
TASK(MyTask){
/* Do something */
TerminateTask ();
}
```
##### Category 2 ISRs
- Each Category 2 ISR that you declare needs to be implemented. This is also marked, this time by `ISR(x)`:
```c
#include <Os.h>
ISR(MyISR){
/* Do something */
}
```
- *Note: A Category 2 ISR handler does not need a return from interrupt call - RTAOS does this automatically. Depending on the behavior of interrupt sources on your target hardware, you may need to clear the interrupt pending flag. Please consult the hardware documentation provided by your silicon vendor for further details.*

##### Category 1 ISRs
- Each Category 1 ISR that you declared also needs to be implemented. Your compiler will use a special convention for marking a C function as an interrupt. RTA-OS provides a macro that expands to the correct directive for your compiler. Your Category 1 handler will therefore look something this:
```c
#include <Os.h>
CAT1_ISR(MyCat1ISR) {
/* Do something */
}
```

#### Starting the OS
- RTA-OS does not take control of your hardware so you need to start the OS manually using the `StartOS()` API call, usually in your main() program. RTA-OS provides a macro called `OS_MAIN()` which expands to the correct type of `main()` definition for your compiler toolchain[^1].
```c
#include <Os.h>
OS_MAIN () {
/* Initialize target hardware */
...
/* Do any mode management , pre -OS functions etc. */
...
/* Use RTA -OS to initialize interrupts */
Os_InitializeVectorTable ();
StartOS ();
/* Call does not return so you never reach here */
}
```
- The expansion of `OS_MAIN()` to the `main()`:
```c
typedef int Os_main_int;
#define OS_MAIN()                \
  extern void inner_main(void);  \
  extern Os_main_int main(void); \
  Os_main_int main(void)         \
  {                              \
    Os_CacheCoreID();            \
    Os_AwaitStartup();           \
    inner_main();                \
    for (;;)                     \
    {                            \
    }                            \
  }                              \
```

#### Interacting with the RTA-OS
- You interact with RTA-OS by making kernel API calls.

#### Compiling and Linking
- When you compile your code you must make sure that `Os.h` and `Os_Cfg.h` are reachable on your compiler include path. When you link your application you must link against `RTAOS.<lib>`, and the library must be on your linker’s library path.

#### Memory Images and Linker Files
- When you build your application, the various pieces of code, data, ROM and RAM that were placed into the sections defined in MemMap.h need to be located at the right place in memory.
- This is typically done by your linker[^2] which resolves references made by user-supplied code to the RTA-OS library, binds together the relevant object modules and allocates the resultant code and data to addresses in memory before producing an image that can be loaded onto the target.
- The linker needs to know what parts of the program to place in which types of memory, where the ROM and RAM are on the micro-controller, and how map the parts of the program to the correct sort of memory.
- Example Assembler Output Showing Sections:
```c
.section CODE
.public MYPROC
mov r1 , FRED
add r1 , r1
ret
.end CODE
.section DATA
.public FRED
.word 100, 200, 300, 400
.end DATA
.section BSS
.public WORKSPACE
.space 200
.end BSS
```
##### Sections
- Code and data output by compilers and assemblers is typically organized into **sections**.
- Some sections will contain just code, some code and data and some will contain data only.
- This means that the code for `MYPROC` should be assembled and the object code should assume that it will be located in a section of memory called `CODE` whose location we will specify later in the linker control file.
- Similarly, the data labeled `FRED` will be placed in a section called `DATA`, and a space of 200 bytes labeled `WORKSPACE` will be allocated in section `BSS`.
- C compilers typically output your code into a section called **code** or **text**, constants that must go into ROM in a section called something like **const**, and variables into **data**. 
- There will usually be more - consult the reference manual for your toolchain for more details on what the sections are called and familiarize yourself with where they need to go.
- Under AUTOSAR, your `MemMap.h` will define the actual names of the sections that need to be located, for example. So far we have yet to map these onto addresses in **real** memory. We must therefore look at how these sections are mapped into a memory image.

#### The Linker Control File
- The linker control file governs the placement of code, data and reserved space in the image that is downloaded to the target microcontroller. Linker files vary considerably between platforms and targets, but typically include at least the following:
  - declarations of where ROM and RAM are located on chip - these may vary across different variants in a CPU family.
  - Lists of sections that can be placed into each memory space
  - Initialization of the stack pointer, reset address, interrupt vectors etc.

- A linker control file can be seen as follow:
```c
ONCHIPRAM start 0x0000 {
Section .stack size 0x200 align 16 # system stack
Section .sdata align 16 # small data
Section bsw_near align 16 # near data
}
def __SP = start stack # initialize stack ptr
RAM start 0x4000 {
Section .data align 16 # compiler data
Section .bss align 16 # compiler BSS
Section bsw_zero_init align 16 # Basic Software zeroed RAM
Section bsw_startup_init align 16 # Basic Software initialized RAM
Section swc_startup_init align 16 # Application initialized RAM
}
ROM start 0x8000 {
Section .text # compiler code
Section .const # compiler constants
Section swc_data align 16 # Application static data
Section swc_init align 16 # Application initial data
Section bsw_init align 16 # Basic Software initial data
}
VECTBL start 0xFF00 {
Section OsVectorTable # RTA -OS's vector table
}
def __RESET = __main # reset to __main
```
- The example defines four separate parts of memory - `ONCHIPRAM`, `RAM`, `ROM`, and `VECTBL`. Into each section are placed the appropriate data, as described by the comments.
- The example applications supplied with RTA-OS embedded ports will contain a fully-commented linker control file; consult this and the **Target/Compiler Port Guide** for details of how to locate the sections correctly for your target platform.

---

### Summary Section (Summary of Notes)

- There are 5 steps to integrate RTA-OS with your application:

- There are 5 steps to integrate RTA-OS with your application:
  1. Configure the features of the OS you want to use
  2. Generate a customized RTA-OS kernel library
  3. Write application code that uses the OS
  4. Compile your application code and linking with the RTA-OS library
  5. Run your application on your target
- There are two offline tools: **RTAOSCfg** to configure RTA-OS and **RTAOSGen** to generate and build the kernel library
- RTA-OS is an AUTOSAR Basic Software module and has dependencies to AUTOSAR header files. These can be generated by `RTAOSGen` if required.
- Linking and locating of RTA-OS depends on the content of the `Os_MemMap.h` file
with which `RTAOSGen` builds the kernel library.

[^1]: On many compilers this will be `void main(void)`, but there are compilers that insist upon the `main()` program returning an **integer** or other **(non void)** type.
[^2]: An historical note: Technically this job is that of the locator which locates sections into memory by mapping virtual to physical addresses and these tools used to be called linker/locators. In modern times the locator part has dropped out of common usage and the tools are commonly
referred to as `linkers`.
