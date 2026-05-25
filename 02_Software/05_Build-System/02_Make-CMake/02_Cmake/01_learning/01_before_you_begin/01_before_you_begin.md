# Cornell Notes

## Topic: Before You Begin

## Date: 18/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Before You Begin
- CMake stands for "Cross-Platform Make". It is a build system generator that helps manage the build process of software projects across different platforms and compilers.
- CMake solves progressively more complex build requirements such as libraries, code generators, tests, and external dependencies. 
- Before we are ready to even begin the first step of that journey, we need to ensure we have the correct tools at hand and understand how to use them.
- This prerequisite step provides recommendations for how to acquire and run CMake. 
- If you're already familiar with the basics of how to run CMake, you can feel free to move on to the rest of the tutorial.

#### Getting CMake
- The most obvious way to get your hands on CMake is to download it from the CMake website. 
- [The website's "Download" section](https://cmake.org/download/) contains the latest builds of CMake for all common (and some uncommon) desktop platforms.
- However, it is preferable to acquire CMake via the usual delivery mechanism for developer tools on your platform. 
- CMake is available in most packaging repositories, as a Visual Studio component, and can even be installed from the Python package index.
- Additionally, CMake is often available as part of the base image of most CI/CD runners targeting C/C++. 
- You should consult the documentation for your software build environment to see if CMake is already available.
- CMake can also be compiled from source using the instructions described by `README.rst`, found in the root of the CMake source tree.
- CMake, like any program, needs to be available in PATH in order to be run from a shell. You can verify CMake is available by running any CMake command.

```cmake
$ cmake --version
cmake version 3.23.5
CMake suite maintained and supported by Kitware (kitware.com/cmake).
```
- *Note: If using a Visual Studio-provided development environment, it is best to run CMake from inside a Developer Command Prompt or Developer Powershell. This ensures CMake has access to all the required developer tooling and environment variables.*


#### CMake Generators
- CMake is a configuration program, sometimes called a "meta" build system. As with other configuration systems, CMake is not ultimately responsible for running the commands which produce the software build. 
- Instead, CMake generates a build system based on project, environment, and user-provided configuration information.
- CMake supports multiple build systems as the output of this configuration process. These output backends are called "generators", because they generate the build system. 
- CMake supports many generators, the documentation for which can be found at [cmake-generators(7)](https://cmake.org/cmake/help/latest/manual/cmake-generators.7.html#manual:cmake-generators(7)). Information about supported generators for your particular CMake installation can be found via [cmake --help](https://cmake.org/cmake/help/latest/manual/cmake.1.html#cmdoption-cmake-h) under the "Generators" heading.
- Using CMake thus requires one of the build programs which consumes this generator output be available. The Unix `Makefiles`, `Ninja`, and `Visual Studio` generators require a compatible `make`, `ninja`, and `Visual Studio` installation respectively.
- ***Note:** The default generator on Windows is typically the newest available Visual Studio version on the machine running CMake, everywhere else it is `Unix Makefiles`.*
- Which generator is used can be controlled via the [`CMAKE_GENERATOR`](https://cmake.org/cmake/help/latest/envvar/CMAKE_GENERATOR.html#envvar:CMAKE_GENERATOR) environment variable, or the [`cmake -G`](https://cmake.org/cmake/help/latest/manual/cmake.1.html#cmdoption-cmake-G) option.

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]