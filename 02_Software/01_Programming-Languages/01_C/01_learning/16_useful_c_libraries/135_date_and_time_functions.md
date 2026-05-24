# Section 18: Useful C Libraries

## Topic: Date and Time Functions

## Date: 02/02/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- the standard library gives a nice collection of functions which allow us to deal with date and time related
computations
  - the `time.h` header declares functions that produce the time and date when you call them
- these functions provide output in various forms from the hardware timer in your PC
  - you can use these functions to obtain the current time and date
  - you can use these functions to calculate the time elapsed between two events
  - you can use these functions to measure how long the processor has been occupied performing a calculation
- examples include the `clock()` function which returns amount of processor time used by the program
- the `time()` function returns the number of seconds from an arbitrary epoch
- the `ctime()` and `asctime()` functions give current date and day of time as function value
- the `gmtime()` converts time value into Coordinated Universal Time (UTC)

**2. prototypes**
```c
clock_t clock(void);
time_t time(time_t *returned value);
char *ctime(time_t const *time_value);
double difftime(time_t tm1, time_t tm2);
char *asctime(struct tm const *tm_ptr);
struct tm *localtime(time_t const *time_value);
struct tm *gmtime(time_t const *time_value);
```
- `localtime()` returns structure of type struct tm
  - can be passed as an argument to asctime() function
- `asctime()` and `ctime()` functions return current date and time of day
  - the `ctime()` function may call `asctime()` to perform its work

**3. Getting Time Values**
- lets talk about the clock function
  - the simplest function returning a time value
```c
clock_t clock(void);
```
- returns the processor time (not the elapsed time) used by the program since some implementation-defined reference point
  - often since execution began
  - return value is of type `clock_t`, an integer type that is defined in `time.h`
- you typically call the clock() function at the start and end of some process in a program
  - the difference is a measure of the processor time consumed by the process
- the processor time is the total time the processor has been executing on behalf of the process that called the clock() function
  - the value that is returned by the clock() function is measured in clock ticks
  - to convert this value to seconds
    - you divide it by the value that is produced by the macro `CLOCKS_PER_SEC` (time.h)
      - `CLOCKS_PER_SEC` is the number of clock ticks in 1 second
  - returns `–1` if an error occurs
- to determine the processor time used in executing a process
  - you need to record the time when the process starts executing and subtract this from he time returned when the process finishes
```c
clock_t start = 0, end = 0;
double cpu_time = 0.0;
start = clock();
// Execute the process for which you want the processor time...
end = clock();
cpu_time = (double)(end-start)/CLOCKS_PER_SEC;
// Processor time in seconds
```
- stores the total processor time used by the process in cpu_time
  - the cast to type double is necessary in the last statement to get the correct result
- the time() function returns the calendar time as a value of type time_t
  - the calendar time is the current time usually measured in seconds since a fixed time on a particular date
  - the fixed time and date is often 00:00:00 GMT on January 1, 1970
    - typical of how time values are defined
```c
time_t time(time_t *timer);
```
- if the argument is not `NULL`
  - the current calendar time is also stored in timer
- type `time_t` is defined in the header file and is often equivalent to type long
- to calculate the elapsed time in seconds between two successive `time_t` values returned by `time()`
- you use the function `difftime()`
```c
double difftime(time_t T2, time_t T1);
```
- will return the value of T2 - T1 expressed in seconds as a value of type double
  - the time elapsed between the two time() function calls that produce the `time_t` values, `T1` and `T2`

**4. Getting the Date**
- you can get get today’s date as a string using the ctime function
```c
char *ctime(const time_t *timer);
```
- accepts a pointer to a `time_t` variable as an argument that contains a calendar time value returned by the `time()` function
- returns a pointer to a 26-character string containing the day, the date, the time, and the year, which is terminated by a newline and `\0`
- a typical string returned might be the following
```c
"Mon Aug 25 10:45:56 2003\n\0"
```
- the `ctime()` function has no knowledge of the length of the string you have allocated to store the result
- makes this an unsafe operation
- you might use the `ctime()` function like this
```c
char time_str[30] = {'\0'};
time_t calendar = time(NULL);
printf("%s", ctime( &calendar));
```
- you can also get at the various components of the time and date from a calendar time value by using the `localtime()` function
```c
struct tm *localtime(const time_t *timer);
```
- accepts a pointer to a `time_t` value
- returns a pointer to a structure of type `tm` (time.h)
  - the same structure each time you call it
  - structure members are overwritten on each call
- returns `NULL` if timer cannot be converted
- the time that `localtime()` produces is local to where you are
- the `asctime()` generates a string representation of a `tm` structure
```c
char *asctime(const struct tm *time_data);
```
- the `asctime()` returns a char pointer
  - must be an array with at least 26 elements
  - works for `tm` structures where the year is from 1000 to 9999
```c
time_t time_ptr;
time(&time_ptr);
printf("Current date and time = %s", asctime(localtime(&time_ptr)));
```

**5. struct tm**
- all the members are of type `int`
- tm_sec
  - seconds (0 to 60) after the minute on 24-hour clock
  - value goes up to 60 for positive leap-second support
- tm_min
  - minutes after the hour on 24-hour clock (0 to 59)
- tm_hour
  - the hour on 24-hour clock (0 to 23)
- tm_mday
  - day of the month (1 to 31)
- tm_mon
  - month (0 to 11)
- tm_year
  - year (current year minus 1900)
- tm_wday
  - weekday (Sunday is 0; Saturday is 6)
- tm_yday
  - day of year (0 to 365)
- tm_isdst
  - daylight saving flag
    - positive for daylight saving time
    - 0 for not daylight saving time
  - negative for not known

**6. Getting the Day for a Date**
- you can use the mktime() function to determine the day of the week for a given date
```c
time_t mktime(struct tm *ptime);
```
- you pass the address of a tm structure object to the function
  - the tm_mon, tm_mday, and tm_year members set to values corresponding to the date you are interested in
  - the values of the tm_wday and tm_yday members of the structure will be ignored
  - if the operation is successful, the values will be replaced with the values that are correct for the date you have supplied
- returns the calendar time as a value of type `time_t` if the operation is successful
- returns `–1` if the date cannot be represented as a `time_t` value
  - causing the operation to fail

**7. gmtime**
- there is one more function which converts a `time_t` value into `struct tm`
```c
struct tm *gmtime(time_t const *time_value);
```
- converts time value into Coordinated Universal Time (UTC)
- UTC was formerly called Greenwich Mean Time and hence the name gmtime

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
