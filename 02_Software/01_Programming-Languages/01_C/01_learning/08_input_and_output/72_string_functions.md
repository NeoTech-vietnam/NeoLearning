# Section 10: Input and Output

## Topic: String Functions

## Date: 18/11/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. gets**
- the gets function stands for get string and reads a line from standard input into a buffer
  - reads until a terminating newline or end-of-file (EOF) is found
  - takes one argument, a pointer to an array of chars where the string is stored
  - returns str on success, and NULL on error or when end of file occurs
```c
char *gets(char *str)
```
- this function is deprecated and should never be used
  - removed from C11
  - as a result, we are not going to discuss it much in this class
    - two options instead (C99) are to use `fgets()` or getchar()
      - we will discuss fgets in the upcoming slides
- **NEVER INVOKE THE gets() FUNCTION**
  - no check for buffer overflow is performed
  - it is impossible to tell without knowing the data in advance how many characters gets() will read
    - gets() will continue to store characters past the end of the buffer

**2. fgets**
- fgets is used for reading entire lines of data from a file/stream (file get string)
  - has similar behavior to gets()
    - accepts two additional arguments
      - the number of characters to read
      - an input stream (when specified as stdin, same behavior as gets())
```c
char *fgets(char *buffer, int n, FILE *stream)
```
- buffer is a pointer to a character array where the line that is read in will be stored
- n is an integer value that represents the maximum number of characters to be stored into buffer, including the null character
- stream is the pointer to object that identifies the stream where characters are read from
  - usually used with a file stream, however, standard input stream is also acceptable
- reads characters from the specified file until a newline character has been read or until n-1 characters have been read (whichever occurs first)
  - a null character is written immediately after the last character read into the array
  - returns the value of buffer if the read is successful
  - returns the value `NULL` if an error occurs on the read or if an attempt is made to read past the end of the file
- the `fgets()` function retains the newline character (unlike gets)
- it is possible to read a partial line when using fgets
  - truncation of user input can be detected because the input buffer will not contain a newline character
- the fgets function protects against overflowing the string and creating a security hazard
  - not recommended for performance reasons
- fgets is deprecated because the function cannot tell whether a null character is included in the string it reads
  - if a null character is read it will be stored in the string along with the rest of the characters read
    - since a null character terminates a string, this will end your string prematurely, right before the first null character
- only use fgets if you are certain the data read cannot contain a null character
  - otherwise, use getline

**3. getline**
- the latest function for reading a string of text is `getline()`
  - a new C library function, having appeared around 2010 or so
- the getline function is the preferred method for reading lines of text
from a stream (including standard input)
  - the other standard functions, including gets, fgets, and scanf, are too
unreliable
- the getline function reads an entire line from a stream
  - up to and including the next newline character and takes three parameters
```c
ssize_t getline(char **buffer, size_t *size, FILE *stream);
```
- the first parameter is a pointer to a block allocated with `malloc` or `calloc (type char **)`
  - the address of the first character position where the input string will be stored
    - this pointer type (a pointer-pointer) causes massive confusion
  - will automatically enlarge the block of memory as needed (realloc)
    - there is never a shortage of space (why getline is so safe)
  - will contain the line read by getline when it returns
- the second parameter is a pointer to a variable of type size_t
  - specifies the size in bytes of the block of memory pointed to by the first parameter
  - the address of the variable that holds the size of the input buffer, another pointer
- the third parameter is simply the stream from which to read the line
- if an error occurs, such as end of file being reached without reading any bytes, getline returns -1
  - otherwise, returns the number of characters read (up to and including the newline, but not the final null character)
- the string input is stored at the memory location referenced by pointer buffer
- uses the size_t variable type, which is a special type of integer
  - required by the getline() function
  - buffer size is 32 characters, must be referenced as a pointer, not a literal value
- 32 bytes of storage are assigned to memory location buffer via the `malloc()` function
- handles the (rare) condition when memory isn’t available. Odds are low that would happen in this program, but it’s good programming practice to check
- the getline() function uses the address of buffer, bufsize, and then stdin for standard input
- because variable characters is a size_t variable type, the %zu placeholder is used in the `printf()` function
- as with the `fgets()` function, getline() reads and stores the newline character as part of the string
- so if the pointer thing bothers you, just use `fgets()` instead

**4. puts**
- the puts() function is used to write a line to the output screen
  - the most convenient function for printing a simple message on standard output
  - automatically appends a newline
  - It is simpler than printf, since you do not need to include a newline character
- the difference between puts and printf is that when using printf the argument is interpreted as a formatting string
  - result will be often the same (except for the added newline) if the string doesn't contain any control characters (%)
  - if you cannot rely on that you should not use puts
- the puts function is safe and simple, but not very flexible as it does not give us an option of formatting our string
```c
int puts(const char *string)
```
---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
