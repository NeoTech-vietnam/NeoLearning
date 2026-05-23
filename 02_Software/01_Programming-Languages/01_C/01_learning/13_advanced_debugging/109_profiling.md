# Section 15: Advanced Debugging, Analysis, and Compiler Opotions

## Topic: Profiling

## Date: 28/12/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- profiling is a form of dynamic program analysis that measures
  - space (memory)
  - time complexity of a program (efficiency)
  - usage of particular instructions
  - the frequency and duration of function calls
- profiling information serves to aid program optimization
- profiling is achieved by instrumenting either the program source code or its binary executable form using a specific profiling tool
- profilers may use a number of different techniques, such as event-based, statistical, instrumented, and simulation methods

**2. gprof**
- in this lecture, we will discuss the gnu profiling tool gprof and valgrind
- the GNU profiler gprof uses a hybrid approach of compiler assisted instrumentation and sampling
- Instrumentation is used to gather function call information (e.g. to be able to generate call graphs and count the number of function calls)
- to gather profiling information at runtime, a sampling process is used
  - the program counter is probed at regular intervals by interrupting the program with operating system interrupts
  - the resulting profiling data is not exact but are rather a statistical approximation gprof statistical inaccuracy

**3. conclusion and comparison**
- gprof is the dinosaur among the evaluated profilers
  - goes back into the 1980’s
  - it was widely used and a good solution during the past decades
  - limited support for multi-threaded applications, the inability to profile shared libraries make it unsuitable for using it in today’s real-world projects
- Valgrind delivers the most accurate results and is well suited for multi-threaded applications
  - slow execution of the application under test disqualifies it for larger, longer running applications
- there is another tool available called gperftools (from google)
  - CPU profiler has a very little runtime overhead
  - provides some nice features like selectively profiling certain areas of interest and has no problem with multi-threaded applications

---

### Summary Section (Summary of Notes)
- [GCC online documentation](https://gcc.gnu.org/onlinedocs/gcc-15.2.0/gcc.pdf)

[Insert a brief summary of the key ideas and takeaways]
