# Cornell Notes

## Topic: C++ built-in Primitive Types

## Date: 10/04/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. C++ Primitive Data Types**

- Fundamental data types implemented directly by the C++ language
- Character types
- Integer types
  - signed and unsigned
- Floating-point types
- Boolean type
- Size and precision is often compiler-dependent
```cpp
#include <climits>
```
- **Type sizes**
  - Expressed in bits
  - The more bits the more values that can be represented
  - The more bits the more storage required

| Size (in bits) | Representable value        |      |
| -------------- | -------------------------- | ---- |
| 8              | 256                        | 2^8  |
| 16             | 65,536                     | 2^16 |
| 32             | 4,294,967,296              | 2^32 |
| 64             | 18,446,744,073,709,551,615 | 2^64 |

- **Character Types**
  - Used to represent single characters, ‘A’, ‘X’, ‘@’
  - Wider types are used to represent wide character sets

| Type Name | Size / Precision                                  |
| --------- | ------------------------------------------------- |
| char      | Exactly 1 byte. At least 8 bits                   |
| char16_t  | At least 16 bits                                  |
| char32_t  | At least 32 bits                                  |
| wchar_t   | Can represent the largest available character set |

- **Integer Types**
  - Used to represent whole numbers
  - Signed and unsigned versions

| Type Name              | Size / Precision |
| ---------------------- | ---------------- |
| signed short int       | At least 16 bits |
| signed int             | At least 16 bits |
| signed long int        | At least 32 bits |
| signed long long int   | At least 64 bits |
| unsigned short int     | At least 16 bits |
| unsigned int           | At least 16 bits |
| unsigned long int      | At least 32 bits |
| unsigned long long int | At least 64 bits |

- **Floating-point Type**
  - Used to represent non-integer numbers
  - Represented by mantissa and exponent (scientific notation)
  - Precision is the number of digits in the mantissa
  - Precision and size are compiler dependent

| Type Name   | Size / Precision | Typical Range                   |
| ----------- | ---------------- | ------------------------------- |
| float       | At least 16 bits | 1.2 x 10^38 to 3.4 x 10^38      |
| double      | At least 16 bits | 2.2 x 10^-308 to 3.8 x 10^308   |
| long double | At least 32 bits | 3.3 x 10^-4932 to 1.2 x 10^4932 |

- **Boolean Type**
  - Used to represent true and false
  - Zero is false.
  - Non-zero is true.

| Type Name | Size / Precision                                    |
| --------- | --------------------------------------------------- |
| bool      | Usually 8 bits **true** or **false** (C++ keywords) |

**2. Difference between {} and = initialization**
- **= initialization**
  - Can lead to narrowing conversions
  - Can lead to unintended implicit conversions

```cpp
int x = 3.14; // x will be 3, not 3.14
```
- **{} initialization**
  - Prevents narrowing conversions
  - Will cause a compile-time error if a narrowing conversion is attempted
```cpp
int x {3.14}; // Compile-time error: narrowing conversion
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]