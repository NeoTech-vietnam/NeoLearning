# Section 15: Advanced Debugging, Analysis, and Compiler Opotions

## Topic: GCC Compiler Options (Part 2)

## Date: 22/12/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Optimization flags**
- there are options to control various sorts of optimizations
- without any optimization option, the compiler’s goal is to reduce the cost of compilation and to make debugging
produce the expected results
- turning on optimization flags makes the compiler attempt to improve the performance and/or code size at the expense
of compilation time and possibly the ability to debug the program
- the compiler performs optimization based on the knowledge it has of the program
  - compiling multiple files at once to a single output file mode allows the compiler to use information gained from all of the files when compiling each of them
- not all optimizations are controlled directly by a flag
- most optimizations are completely disabled
- you can invoke GCC with `-Q` `--help=optimizers` to find out the exact set of optimizations that are enabled at each level

- `-O`
  - with `-O`, the compiler tries to reduce code size and execution time, without performing any optimizations that take a great deal of compilation time
- `-O1`
  - optimizing compilation takes somewhat more time, and a lot more memory for a large function
- `-O2`
  - optimize even more
  - GCC performs nearly all supported optimizations that do not involve a space-speed tradeoff
  - ss compared to `-O`, this option increases both compilation time and the performance of the generated code
- `-O3`
  - O3 turns on all optimizations specified by -O2 and also turns on more
- `-Ofast`
  - Disregard strict standards compliance. -Ofast enables all -O3 optimizations. It also enables optimizations that are not valid for all standard-compliant programs. It turns on -ffast-math, -fallow-store-data-races and the Fortran-specific -fstack-arrays, unless -fmax-stack-var-size is specified, and `-fno-protect-parens`.
- `-Og`
  - Optimize debugging experience. `-Og` should be the optimization level of choice for the standard edit-compile-debug cycle, offering a reasonable level of optimization while maintaining fast compilation and a good debugging experience. It is a better choice than `-O0` for producing debuggable code because some compiler passes that collect debug information are disabled at `-O0`

**2. GCC Environment Variables**
- GCC uses the following environment variables
- `PATH`
  - for searching the executables and run-time shared libraries (.dll, .so)
- `CPATH`
  - for searching the include-paths for headers
  - searched after paths specified in `-I<dir>` options
  - C_INCLUDE_PATH can be used to specify C headers if the particular language was indicated in pre-processing
- `LIBRARY_PATH`
  - for searching library-paths for link libraries
  - it is searched after paths specified in `-L<dir>` options

**3. Misc. Tools**
- "nm" is commonly-used to check if a particular function is defined in an object file
  - a 'T' in the second column indicates a function that is defined
  - a 'U' indicates a function which is undefined and should be resolved by the
  linker
- "ldd" Utility (List Dynamic-Link Libraries)
- examines an executable and displays a list of the shared libraries that it needs
```
ldd a.out
linux-vdso.so.1 (0x00007ffccddde000)
libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f9b389cf000)
/lib64/ld-linux-x86-64.so.2 (0x00007f9b38fc2000)
```

---

### Summary Section (Summary of Notes)
- [GCC online documentation](https://gcc.gnu.org/onlinedocs/gcc-15.2.0/gcc.pdf)

[Insert a brief summary of the key ideas and takeaways]
