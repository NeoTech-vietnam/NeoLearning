# Section 9: Advanced Control Flow

## Topic: The null statement

## Date: 16/11/2025 

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)
**1. Overview**
- the "null statement" is an expression statement with the expression missing
- C permits a solitary semicolon to be placed wherever a normal program statement can appear
- the null statement has the effect of doing nothing, but exists for syntactical reasons
- although the null statement might seem useless, it is often used by C programmers in while, for, and do loops
- it is useful when the syntax of the language calls for a statement but no expression evaluation

**2. Examples**
- the purpose of the following statement is to store all the characters read in from the standard input into the character array pointed to by text until a newline character is encountered
```c
while ( (*text++ = getchar ()) != '\n' )
;
```
- all of the operations are performed inside the looping-conditions part of the while  statement
- the null statement is needed because the compiler takes the statement that follows the looping expression as the body of the loop
- without the null statement, whatever statement that follows in the program is treated as the body of the program loop by the compiler
- the following for statement copies characters from the standard input to the standard output until the end of file is encountered
```c
for ( ; (c = getchar ()) != EOF; putchar (c) )
  ;
```
- the next for statement counts the number of characters that appear in the standard input
```c
for ( count = 0; getchar () != EOF; ++count )
  ;
```
- the following loop copies the character string pointed to by from to the one pointed to by to
```c
while ( (*to++ = *from++) != '\0' )
  ;
```
- when you want to find the index of first occurrence of a certain character in a string
```c
int a[50] = "the empire strikes back";
int i;
for(i = 0; a[i] != 't'; i++)
  ;//null statement
//as no operation is required
```
```c
if (condition1)
  if (condition2)
  dosomething();
  else
    ; /* null statement */
else
  dosomethingelse();
```
- in this case the inner else and null statement keeps the outer else from binding to the inner if

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
