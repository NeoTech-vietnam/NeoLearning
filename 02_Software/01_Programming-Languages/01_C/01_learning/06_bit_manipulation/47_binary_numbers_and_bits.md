# Section 8: Bit Manipulation

## Topic: Binary numbers and bits

## Date: 07/11/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Binary Numbers**

- A binary number is a number that includes only ones and zeroes
- The number could be of any length
- The following are all examples of binary numbers
```c
0           10101
1           0101010
10          1011110101
01          0110101110
111000      000111
```
- every binary number has a corresponding Decimal value (and vice versa)
- Examples:

| Binary Number | Decimal Equivalent |
| ------------- | ------------------ |
| 1             | 1                  |
| 10            | 2                  |
| 11            | 3                  |

- Each position for a binary number has a value
- For each digit, multiply the digit by its position value
- Add up all of the products to get the final result
- In general, the "position values" in a binary number are the powers of two
- The first position value is 2^0 , i.e. one
- The 2nd position value is 2^1 , i.e. two
- The 3rd position value is 2^2 , i.e. four
- The 4th position value is 2^3 , i.e. eight
- The 5th position value is 2^4 , i.e. sixteen
- Etc.

**2. Bits**
- A byte consists of eight smaller units called bits
- Each 1 and 0 in a binary number represents 1 bit
  - If the number is 1, then the bit is “turned on”
  - If the number is 0, then the bith is “turned off”
- The rightmost bit of a byte is known as the **least significant** or low-order bit, whereas the leftmost bit is known as **the most significant** or high-order bit
- The advantage of grouping bits into bytes, words, and so on is that it makes them easier to handle
- Changing a bit’s value to 1 is referred to as **setting the bit**
- Changing a bit’s value to 0 is referred to as **resetting a bit**

**3. Bits for the basic C data types**
- Basic C data types consist of the following number of bits:

| Column 1 | Column 2  | Column 3 | Column 4                        |
| -------- | --------- | -------- | ------------------------------- |
| BIT      | _Bool     | 1        | 0 to 1                          |
| Byte     | char      | 8        | –128 to 127                     |
| Word     | short int | 16       | –32,768 to 32,767               |
| Long     | long int  | 32       | –2,147,483,648 to 2,147,483,647 |

**4. Negative numbers (signed)**
- The representation of negative numbers is handled slightly differently
- Computers represent such numbers using a “twos complement” notation
  - The leftmost bit represents the sign bit
    - If this bit is 1, the number is negative
    - If the bit is 0, the number is positive
  - The remaining bits represent the value of the number
- In twos complement notation, the value −1 is represented by all bits being equal to 1
```c
11111111
```
- A convenient way to convert a negative number from decimal to binary is to
  - First add 1 to the value
  - Express the absolute value of the result in binary
  - “complement” all the bits
    - Change all 1s to 0s and 0s to 1s
- To convert -5 to binary, 1 is added, which gives -4
- 4 expressed in binary is 00000100
- Complementing the bits produces 11111011
- To convert a negative number from binary back to decimal
  - First complement all of the bits
  - Convert the result to decimal
  - Change the sign of the result
  - Then subtract 1

**5. Bit Operations and Bit fields for packing information**
- We need to understand these concepts (binary numbers and bits) in order to use the bit operators and the concept of bit fields provided by the C programming language
  - You can perform all sorts of sophisticated operations on bits
  - You can manipulate the individual bits in a variable
- A hardware device is often controlled by sending it a byte or two in which each bit has a particular meaning
- Operating system information about files often is stored by using particular bits to indicate particular items
- Many compression and encryption operations manipulate individual bits
- C’s ability to provide high-level language facilities while also being able to work at a level typically reserved for assembly language makes it a preferred language for writing device drivers and embedded code

--- 

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
