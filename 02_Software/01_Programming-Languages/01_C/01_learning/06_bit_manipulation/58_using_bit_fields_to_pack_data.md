# Section 8: Bit Manipulation

## Topic: Using Bit Fields to pack data

## Date: 16/11/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Overview**
- we understand that you can perform all sorts of sophisticated operations on bits
  - often performed on data items that contain packed information
- you can pack information into the bits of a byte if you do not need to use the entire byte to represent the data
  - flags that are used for a boolean true or false condition can be represented in a single bit on a computer
- two methods are available in C that can be used to pack information together to make better use of memory
  - bit fields and bitwise operators
- you could use an `unsigned int`/`long` variable to hold the same information
- OR you could use a structure the same size as unsigned int to hold state information
- we will discuss the second option in this lecture
  - you can use bit fields in a structure to address individual bits or groups of bits in a value
  - details are implementation independent

**2. Bit Fields**
- a bit field allows you to specify the number of bits in which an int member of a structure is stored
  - uses a special syntax in the structure definition that allows you to define a field of bits and assign a name to that field
  - should use the explicit declarations signed int or unsigned int to avoid problems
with hardware dependencies
    - **C99** and **C11** additionally allow type _Bool bit fields
- bit fields enable better memory utilization by storing data in the minimum number of
bits required
  - format enables you to allocate a specified number of bits for a data item
  - can easily set and retrieve its value without having to use masking and shifting
- a bit field is declared by following an unsigned int member name with a colon `(:)`
  - an integer constant is placed after the colon which represents the width of the field
    - the number of bits in which the member is stored
  - the constant representing the width must be an integer between 0 and the total number of bits used to store an int (on your platform)
- bit-field members of structures are accessed exactly as any other structure member
- it is possible to specify an unnamed bit field to be used as padding in the structure
- an unnamed bit field with a zero width is used to align the next bit field on a new storage unit boundary.

**3. Example**
```c
struct packed_struct {
unsigned int :3;
unsigned int f1:1;
unsigned int f2:1;
unsigned int f3:1;
unsigned int type:8;
unsigned int index:18;
};
```
- the first member is not named
  - `:3` specifies three unnamed bits
- the second member, called `f1`, is also an `unsigned int`
  - `:1` follows the member name and specifies that this member is to be stored in one bit
- the flags `f2` and `f3` are similarly defined as being a single bit in length
- the member `type` is defined to occupy eight bits
- the member `index` is defined as being 18 bits long

**Setting bits:**
- the C compiler automatically packs the preceding bit field definitions together
- the fields of a variable defined to be of type packed_struct can now be referenced in the same convenient way normal structure members are referenced
```c
struct packed_struct packed_data;
```
- you can easily set the type field of packed_data to 7 with the simple statement
```c
packed_data.type = 7;
```
- or you could set this field to the value of n with the similar statement
```c
packed_data.type = n;
```
- you do not need to worry about whether the value of n is too large to fit into the type field
- only the low-order eight bits of n will be assigned to `packed_data.type`

**Reading bits:**
- extraction of the value from a bit field is also automatically handled
```c
n = packed_data.type;
```
- extracts the type field from packed_data
  - automatically shifts the type field into the low-order bits as required and assigns it to n
- bit fields can be used in normal expressions and are automatically converted to integers
```c
i = packed_data.index / 5 + 1;
if ( packed_data.f2 )
```

**4. Misc. information about bit fields**
- you can also include normal data types within a structure that contains bit fields
```c
struct table_entry {
intcount;
charc;
unsigned int f1:1;
unsigned int f2:1;
};
```
- a bit field cannot be dimensioned
  - you cannot have an array of fields, such as flag:1[5]
- you cannot take the address of a bit field
  - no such thing as a type “pointer to bit field”
- you can initialize a bit-field structure by using the same syntax regular structures use
```c
struct box_props box = {YES, YELLOW , YES, GREEN, DASHED};
```

--- 

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
