# Section 6: Advanced Data Types

## Topic: Complex number types

## Date: 02/11/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- A complex number is a number of the form `a + bi`
  - `i` is the square root of minus one (imaginary)
  - `a` and `b` are real numbers
- `a` is called the real part, and `bi` is called the imaginary part of the
complex number
- A complex number can also be regarded as an ordered pair of real
numbers `(a, b)`

**2. Operations on Complex Numbers**
- You can apply the following operations to complex numbers
- **Modulus**
  - The modulus of a complex number `a + bi` is `√(a 2 + b 2)`
- **Equality**
  - The complex numbers `a + bi` and `c + di` are equal if `a` equals `c` and `b` equals `d`
- **Addition**
  - The sum of the complex numbers `a + bi` and `c + di` is `(a + c) + (b + d)i`
- **Multiplication**
  - The product of the complex numbers `a + bi` and `c + di` is `(ac − bd) + (ad + bc)i`
- **Division**
  - The result of dividing the complex number `a + bi` by `c + di` is `(ac + bd) / (c2 + d2) + ((bc − ad)/(c2 + d2))i`
- **Conjugate**
  - The conjugate of a complex number `a + bi` is `a − bi`

**3. C programming and Complex numbers**
- The C99 standard introduces support for complex numbers and complex arithmetic
- A C11 conforming compiler is not obliged to implement complex arithmetic
- If it does not, it must implement the macro `__STDC_NO_COMPLEX__`
- You can test whether your compiler supports complex arithmetic using preprocessor directives
```c
#ifdef __STDC_NO_COMPLEX__
printf("Complex arithmetic is not supported.\n");
#else
printf("Complex arithmetic is supported.\n");
#endif
```
- When the code executes, you will see output telling you whether complex arithmetic is supported

**4. Complex and Imaginary types in C**
- `float _Complex`
  - Stores a complex number with real and imaginary parts as type float
- `double _Complex`
  - Stores a complex number with real and imaginary parts as type double
- `long double _Complex`
  - Stores a complex number with real and imaginary parts as type long double
- `float _Imaginary`
  - Stores an imaginary number as type float
- `double _Imaginary`
  - Stores an imaginary number as type double
- `long double _Imaginary`
  - Stores an imaginary number as type long double

**5. Declaring Imaginary Numbers**
- You use the `_Imaginary` keyword to define variables that store purely imaginary numbers
  - There is no real component
- The `complex.h` header defines imaginary as a more readable equivalent of `_Imaginary`
```c
double imaginary ix = 2.4*I;
```
- Casting an imaginary value to a complex type produces a complex number with a zero real part and a complex part the same as the imaginary number
- Casting a value of an imaginary type to a real type other than `_Bool` results in 0
- Casting a value of an imaginary type to type `_Bool` results in `0` for a zero imaginary value and `1` otherwise

**6. Complex Functions**
- The `creal()` function returns the real part of a value of type double complex that is passed as the argument
- The `cimag()` function returns the imaginary part
```c
double real_part = creal(z1); // Get the real part of z1
double imag_part = cimag(z1); // Get the imaginary part of z1
```
- You append an `f` to these function names when you are working with float complex values (`crealf()` and `cimagf()`)
- You append a lowercase `l` when you are working with long double complex values (`creall()` and `cimagl()`)
- The `conj()` function returns the complex conjugate of its double complex argument
- The `conjf()` and `conjl()` functions return the complex conjugate for the other two complex types
- You can write arithmetic expressions involving complex and imaginary values using the arithmetic operators `+`, `-`, `*`, and `/`
- The `<complex.h>` header also defines several math functions (`cpow`)
- You can also use the operators `!`, `++`, `--`, `&&`, `||`, `==`, `!=` and unary `&` with complex numbers

**7. Creating Complex Numbers**
- To construct complex numbers you need a way to indicate the imaginary part of a number
- There is no standard notation for an imaginary floating point constant
- `complex.h` defines two keywords that can be used to create complex numbers
- A representation of the complex number “`0+1i`”
```c
const float complex _Complex_I
```
- `complex.h` also defines a shorter name for the same constant
  - _`Complex_I` is a bit of a mouthful
```c
const float complex I
```
- The above (`I`) can causes problems if you want to use the identifier `I` for something else
  - `#include <complex.h>`
  - `#undef I`

--- 

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
