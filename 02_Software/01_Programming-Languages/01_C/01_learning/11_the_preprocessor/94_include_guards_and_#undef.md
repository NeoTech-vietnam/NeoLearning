# Section 13: The Preprocessor

## Topic: Include guards and #undef

## Date: 04/12/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. include guards using #ifndef**
- the `#ifndef` directive is commonly used to prevent multiple inclusions of a file
- many include files include other files, so you may include a file explicitly that another include file has already included
- this is a problem because some items that appear in include files, such as declarations of structure types, can appear only once in a file
  - prevents multiple definitions of the same variable/function/macro
- the standard C header files uses the `#ifndef` technique to avoid multiple inclusions
- one problem is to make sure the identifier you are testing has not been defined elsewhere
  - use the filename as the identifier (using uppercase, replacing periods with an underscore, and using an underscore)
```c
#ifndef _STDIO_H
#define _STDIO_H
// contents of file
#endif
```

**2. Example**
```c
#ifndef THINGS_H_
#define THINGS_H_
/* rest of include file */
#endif
```
- the definition in the first header file included becomes the active definition and subsequent definitions in other header files are ignored
  - the first time the preprocessor encounters this include file, `THINGS_H_` is undefined, so the program proceeds to define `THINGS_H_ `and to process the rest of the file
  - the next time the preprocessor encounters this file, `THINGS_H_` is defined, so the preprocessor skips the rest of the file
- ensures that the contents of a header file cannot be included more than once into a source file
- using an include directive makes it impossible for the contents of MyHeader.h to appear more than once in a source file
- you should always protect code in your own header files in this way

**3. #undef directive**
- another flexibility that you have with preprocessor directives is the ability to undefine an identifier you have previously defined
- on some occasions, you might need to cause a defined name to become undefined
  - cancels an earlier `#define` definition
- you can accomplish this using the #undef directive
```c
#undef name
#undef LINUX
```
- the above removes the definition of `LINUX`
  - subsequent `#ifdef` `LINUX` statements will evaluate as `FALSE`


---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
