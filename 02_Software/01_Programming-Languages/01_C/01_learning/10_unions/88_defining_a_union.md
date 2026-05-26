# Section 12: Unions

## Topic: Defining a Union

## Date: 03/12/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- the declaration for a union is identical to that of a structure
- except the keyword union is used where the keyword struct is otherwise specified
- a union has the general form
```c
union [union tag] {
type_1 identifier_1;
type_2 identifier_2;
...
type_N identifier_N;
} optional_variable_definitions;
```
- the union tag is optional and each member definition is a normal variable definition
- at the end of the union's definition, before the final semicolon, you can specify one or more union variables but it is optional
- the union definition is normally placed in a header and included in all source files that use the union type

**2. Defining a union (example)**
```c
union Data {
int i;
float f;
char str[20];
} data;
```
- the above does not define data to contain three distinct members called `i`, `f`, and `str`
  - it defines data to contain a single member that is called either `i`, `f`, or `str`
- a variable of Data type can store an integer, a floating-point number, or a string of characters
- a single variable (same memory location) can be used to store multiple types of data
- the memory occupied by a union will be large enough to hold the largest member of the union
  - Data type will occupy `20 bytes` of memory space because this is the maximum space which can be occupied by a character string

**3. Creating union variables**
- when a union is defined, it creates a user-defined type
  - no memory is allocated
  - to allocate memory for a given union type and work with it, we need to create variables
- a union can be defined to contain as many members as desired
- structures can be defined that contain unions, as can arrays
- pointers to unions can also be declared
  - their syntax and rules for performing operations are the same as for structures
```c
union car {
int i_value;
float f_value;
};
int main() {
union car car1, car2, *car3;
return 0;
}
```
- another way of creating union variables is:
```c
union car {
int i_value;
float f_value;
} car1, car2, *car3;
```

**4. Example (displaying the total memory size occupied)**
```c
union Data {
int i;
float f;
char str[20];
};

int main( ) {
union Data data;
printf( "Memory size occupied by data : %d\n", sizeof(data));
return 0;
}
```
```cmd
Memory size occupied by data : 20
```

**5. Anonymous Unions (C11)**
- anonymous unions work much the same as anonymous structures
  - an anonymous union is an unnamed member union of a structure or union
```c
struct owner {
  char socsecurity[12];
};
struct leasecompany {
  char name[40];
  char headquarters[40];
};
struct car_data {
  char make[15];
  int status; /* 0 = owned, 1 = leased */
  union {
    struct owner owncar;
    struct leasecompany leasecar;
  };
};
```
- now, if flits is a car_data structure, we can use flits.owncar.socsecurity

**6. defining a struct containing a union**
- the use of a union enables you to define arrays that can be used to store elements of different data types
```c
struct {
  char *name;
  enum symbolType type;
  union {
    int i;
    float f;
    char c;
  }  data;
} table [entries];
```
- the above sets up an array called table, consisting of ‘entries’ elements
  - each element of the array contains a structure consisting of a character pointer called name, an enumeration member called type, and a union member called data
  - each data member of the array can contain either an int, a float, or a char
- the member type might be used to keep track of the type of value stored in the member data
  - you could assign it the value `INTEGER` if it contained an int
  - `FLOATING` if it contained a float
  - `CHARACTER` if it contained a char
  - this information would enable you to know how to reference the particular data member of a particular array element


---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
