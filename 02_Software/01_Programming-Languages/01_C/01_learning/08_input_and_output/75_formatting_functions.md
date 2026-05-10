# Section 10: Input and Output

## Topic: Formatting Functions

## Date: 20/11/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. sprintf**
- the `sprintf()` (“string print formatted”) function is is used to write formatted output to a string
- when using sprintf (), you can combine several data variables into a character array
  - instead of printing on the console, you store output data to a char buffer (convert)
```c
int sprintf(char *string, const char *format, ...)
sprintf ( string, “%d %c %f”, value, c, flt ) ;
```
- the **first parameter** is a char pointer that specifies where to send output (buffer to put the data in)
  - terminates the string with a `null` character
- the function returns the number of characters stored in the string, not including the terminating null
- this function will behave unpredictably if the string to which it is printing overlaps any of its arguments
  - you need to make sure the size of the buffer to be written to is large enough to avoid buffer overruns
- sprintf is unsafe because it doesn't check the length of the destination buffer
  - can cause the function to overflow the destination buffer when the result of the format string is unexpectedly long
    - leads to security issues and application instability
    - overflows can cause unexpected results

**2. fprintf**
- `fprintf()` is provided to perform the same operation as printf(), but, on
a file
  - takes an additional argument
  - the `FILE` pointer that identifies the file to which the data is to be
  written to
```c
int fprintf(FILE *stream, const char *format, ...)
fprintf (outFile, “Hello, how are you?\n");
fprintf(outFile, “my number is: %d\n”, 555);
```

**3. fprintf and stderr**
- the reason stderr exists is so that error messages can be logged to a device or file other than where the normal output is written
  - particularly desirable when the program’s output is redirected to a file
    - the normal output is written into the file, but any system error messages still appear in yourwindow
    - you might want to write your own error messages to stderr for this reason
```c
if ( (inFile = fopen ("data", "r")) == NULL )
{
fprintf (stderr, "Can't open data for reading.\n");
...
}
```
- writes the indicated error message to stderr if the file data cannot be opened for reading
  - if the standard output has been redirected to a file, this message still appears in your window

**4. fscanf**
- `fscanf()` is provided to perform the same operations as the scanf() function, but, on a file
  - used to read formatted input (set of characters) from a file
  - most of the arguments of this function are same as scanf() function
    - takes an additional argument, which is the FILE pointer that identifies the file to which the data is to be read
```c
int fscanf(FILE *fp, const char *format [, argument, ...] );
```
- the additional arguments should point to already allocated objects of the type specified by their corresponding format specifier within the format string
- returns the number of arguments that are successfully read and assigned (on success)
- returns the value `EOF`, if the end of the file is reached before any of the conversion specifications have been processed
```c
fscanf (myFile, "%i", &i);
```
- reads in the next integer value from the file “myFile” and stores it in the variable i

**5. sscanf**
- the `sscanf()` function allows you to read formatted data from a string rather than
standard input or keyboard
```c
int sscanf(const char *str, const char * control_string [ arg_1, arg_2, ... ]);
sscanf (buffer,”%s %d”,name,&age);
```
- the `first argument` is a pointer to the string from where we want to read the data
- the rest of the arguments of `sscanf()` is same as that of `scanf()`
- returns the number of items read from the string and `-1` if an error is encountered

**6. using fscanf() vs. fgets()/sscanf**
- if you use `fgets()` + `sscanf()`, you must enter both values on the same line
- if you only use fscanf() on stdin, it will read them off different lines if it does not find the second value on the first line you entered
- if you read a line that you are unable to parse with `sscanf()` after having read it using `fgets()` your program can simply discard the line and move on
- If you read a line using fscanf(), when it fails to convert fields, it leaves all the input on the stream
- so, if you failed to read the input you wanted, you would have to go and read all the data you want to ignore yourself
- you can use `fscanf()` by itself, however, you may be able to avoid some headaches by using
```c
fgets() + sscanf()
```

**7. using fscanf() vs. fgets()/sscanf**
- there is no difference between fscanf() versus fgets()/sscanf() when
  - input data is well-formed
  - two types of errors occur
    - I/O and format
    - `fscanf()` simultaneously handles these two error types in one function but offer few recovery options
    - `fgets()` and `sscanf()` allow logical separation of I/O issues from format ones and thus better recovery
  - only 1 parsing path
  - separating I/O from scanning allows multiple `sscanf()` options
    - if a given scanning of a buffer does not produce the desired results, other `sscanf()` calls with different formats are available
  - no embedded `'\0'`
    - rarely does `'\0'` occur, but should one occur, sscanf() will not see it as scanning stops with its occurrence, whereas `fscanf()` continues
- in all cases, check results of all three functions
- the below is a common question asked by many students in the Q&A (so mention this, another tidbit, unrelated)
  - when `scanf()` converts an `int` for example, it will leave behind a `\n` on the input stream (assuming there was one, like from pressing the enter key)
  - will cause a subsequent call to `fgets()` to return immediately with only that character in the input
    - a really common issue for new programmers

**8. fflush**
- the `fflush()` function is used to flush/clean a file or buffer
  - causes any unwritten data in the output buffer to be sent to the output file
    - this process is called flushing a buffer
- cleans the buffer (making empty) if it has been loaded with any other data already
```c
int fflush(FILE *fp);
fflush(buffer);
```
- buffer is a temporary variable or pointer which loads/points to the data
- if the file is a null pointer, all output buffers are flushed
- the effect of using `fflush()` on an input stream is undefined
- you can use it with an update stream (any of the read-write modes), provided that the most recent operation using the stream was not input

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
