# Make and CMake

## Overview

Make and CMake solve related but different build problems. GNU Make reads rules
that describe how targets depend on their inputs and runs the recipes needed to
update them. CMake configures a project and generates a native buildsystem,
such as Makefiles, Ninja files, or an IDE project. Understanding that boundary
helps embedded developers separate *how a project is described* from *which
tool actually executes the build*.

This unit introduces the concepts needed to read and maintain small build
definitions before moving on to toolchain files, testing, packaging, and
project-specific build conventions.

## Learning Path

1. [Build-system orientation](00_Build-System-Orientation.md) — learn the
   vocabulary and the relationship between Make, CMake, generators, and build
   directories.
2. [GNU Make fundamentals](01_GNU-Make-Fundamentals.md) — understand rules,
   dependencies, variables, phony targets, and common commands.
3. [CMake fundamentals](02_CMake-Fundamentals.md) — learn configure/generate/
   build phases and target-oriented project descriptions.
4. [CMake workflows and presets](03_CMake-Workflows-and-Presets.md) — make
   local and CI configuration repeatable without committing machine-specific
   settings.

## Intended Audience

- Learners who can already compile a small C or C++ program with a compiler.
- Embedded developers reading build files supplied by an SDK, middleware, or
  board-support package.
- Developers moving from a hand-written Makefile to target-oriented CMake.

## Scope

The notes describe concepts, terminology, and safe workflows. They deliberately
do **not** include a runnable project or a complete Makefile/CMake project.
Those exercises belong in the `Examples/` submodule when this learning unit is
ready for hands-on material.

## Primary References

- [GNU Make Manual](https://www.gnu.org/software/make/manual/make.html)
- [CMake documentation](https://cmake.org/cmake/help/latest/)
- [CMake tutorial](https://cmake.org/cmake/help/latest/guide/tutorial/index.html)
