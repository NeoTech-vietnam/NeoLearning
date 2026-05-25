# Section 10: Input and Output

## Topic: char functions (input)

## Date: 16/11/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- we already learned from the previous class that all I/O operations in C must be carried out through function calls
  - I/O operations transport information to and from your program
  - these functions are contained in the standard C library
```c
#include <stdio.h>
```
- this include file contains function declarations and macro definitions associated with the I/O routines from the standard library
- I would like to cover the following I/O functions in this section so that you have a complete understanding of input and output in C

| Char Functions | String Functions | Formatting Functions |
| -------------- | ---------------- | -------------------- |
| getc           | gets             | sprint               |
| getchar        | fgets            | fprintf              |
| fgetc          | puts             | fflush               |
| ungetc         | fputs            | fscanf               |
| putc           | getline          | sscanf               |
| putchar        |                  |                      |
| fputc          |                  |                      |

- originally, input/output functions were not part of the definition of C
  - their development was left to C implementations
  - the Unix implementation of C has served as a model for these functions
  - these are standard functions that must work in a wide variety of computer environments
    - they seldom take advantage of features peculiar to a particular system
- we focus on the standard I/O functions available on all systems
  - they enable you to write portable programs that can be moved easily from one system to another
  - also generalize to programs using files for input and output
- when a C program is executed, three files are automatically opened by the system for use by the program
  - `stdin`, `stdout`, and `stderr` (defined in `<stdio.h>`)
    - `stdin` identifies the standard input of the program and is normally associated with your terminal window
      - all standard I/O functions that perform input and do not take a `FILE` pointer as an argument get their input from `stdin`
    - `stdout` refers to the standard output, which is normally also associated with your terminal window
    - `stderr` identifies the standard error file
      - where most of the error messages produced by the system are written and is also normally associated with your terminal window

**2. input functions - getc**
- the function `getc()` enables you to read in a single character from a file
  - takes a `FILE` pointer as an argument that identifies the file from which the character is to be read
  - must first call `fopen()` in read mode
```c
int getc(FILE *stream);
int c = getc (inputFile);
```
- has the effect of reading a single character from the file data
  - ubsequent characters can be read from the file simply by making additional calls to the `getc()` function
- this function returns the corresponding integer value (ASCII value of read character) on success
- this function will return the value `EOF` (special int value used to indicate failure) when the end of file is reached

**3. input functions – getc example**
```c
#include <stdio.h>
int main() {
  char ch;
  FILE *fp;
  if (fp = fopen("someFile.c", "rw"))
  {
    ch = getc(fp);
    while (ch != EOF)
    {
      // write ch somewhere
      ch = getc(fp);
    }
    fclose(fp);
  return 0;
  }
  return 1;
}
```
**3. input functions – getchar**
- this function is very similar to the `getc()` function described previously
  - reads one character at a time from stdin where getc can read from any input stream
    - `getchar()` is equivalent to calling `getc()` with stdin as the argument
- the `getchar()` function requires no arguments, and it returns the code for the character read from the input stream as type int
```c
int getchar(void);
#include <stdio.h>
int main()
{
printf("%c", getchar());
return(0);
}
```
```
Input: g (press enter key)
Output: g
```
**4. input functions - getchar with EOF example**
- you can use `EOF` in a program by comparing the return value of `getchar()` with EOF
  - if they are different, you have not yet reached the end of a file
  - you do not have to define `EOF` because it is already defined in `stdio.h`
```c
while ((ch = getchar()) != EOF)
```
- when reading from the keyboard as opposed to the file, most systems have a way
to simulate an end-of-file condition from the keyboard
  - you cannot just type the letters `E O F`, and you can’t just type `–1`
  - pressing `Ctrl+D` at the beginning of a line causes the end-of-file signal to be
  transmitted in Linux
- some interpret a `Ctrl+Z` anywhere as an end-of-file signal
```c
#include <stdio.h>
int main(void) {
  int ch;
  while ((ch = getchar()) != EOF)
    // doSomething
  return 0;
}
```
- the value returned by getchar() is assigned to an int and not a char variable
  - works fine because C allows you to store characters inside ints
- always remember to store the result of getchar() inside an int so that you can properly detect an end-of-file condition
  - if you store the result of the getchar() function inside a char variable, the results are unpredictable
    - on systems that do sign extension of characters, the code might still work okay

**5. input functions - fgetc**
- `fgetc` is a file handling function which is used to read a character from a file
  - reads a single character at a time
  - moves the file pointer position to the next location to read the next character
```C
int fgetc(FILE *fp)
fgetc (fp);
```
- fp – file pointer

**6. input functions – fgetc example**
```C
/* Open, Read and close a file: Reading char by char */
# include <stdio.h>
int main(void) {
  FILE *fp ;
  char c ;
  fp = fopen ( "myFile.c", "r" ) ; // opening an existing file
  if ( fp == NULL ) {
    printf ( "Could not open file myFile.c" ) ;
    return 1;
  }
  printf( "Reading the file myFile.c" ) ;
  return 0;
}
```
```c
/* Open, Read and close a file: Reading char by char */
# include <stdio.h>
int main( ) {
  FILE *fp ;
  char c ;
  fp = fopen ( "myFile.c", "r" ) ; // opening an existing file
  if ( fp == NULL ) {
    printf ( "Could not open file myFile.c" ) ;
    return 1;
  }
  printf( "Reading the file myFile.c" ) ;
  return 0;
}
```
**7. ungetc**
- the `ungetc()` function enables you to put a character you have just read back into an input stream
- we already have read from and written to individual characters from/to standard input/standard output and file I/O
  - we cannot determine what character is on the stream until we have read it
    - we would read one character beyond the character we wanted
- this function requires two arguments
  - the **first** is the character to be pushed back into the stream
  - the **second** is the identifier for the stream
    -  `stdin` for the standard input stream
- this function returns a value of type int that corresponds to the character pushed back into the stream, or a special character, EOF, if the operation fails
```c
int ungetc(int ch, FILE * stream);
```
- you can push a succession of characters back into an input stream, but only one character is guaranteed
  - you should check for EOF this if you are attempting to return several characters to a stream
- this function is useful when you are reading input character by character and do not know how many characters make up a data unit
  - might be reading an integer value, but do not know how many digits there are

**8. Ungetc example**
- here is a function that ignores spaces and tabs from the standard input stream using the getchar() and ungetc() functions
```c
void eatspaces(void)
{
  char ch = 0;
  while(isspace(ch = (char)getchar())); // Read as long as there are spaces
  ungetc(ch, stdin);
  // Put back the nonspace character
}
```
- the while loop continues to read characters as long as they are whitespace characters, storing each character in `ch`
- the first nonwhitespace character that is read will end the loop, and the character will be left in ch
- the call to `ungetc()` returns the nonwhitespace character back to the stream for future processing

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
