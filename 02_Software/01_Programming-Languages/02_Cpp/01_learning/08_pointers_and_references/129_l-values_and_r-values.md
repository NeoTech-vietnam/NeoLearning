# Cornell Notes

## Topic: L-Values and R-Values

## Date: 08/06/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### l-values
- l-values
  - values that have names and are addressable
  - modiﬁable if they are not constants
```cpp
int x {100}; // x is an l-value
x = 1000;
x = 1000 + 20;
string name; // name is an l-value
name = "Frank";
```
```cpp
100 = x; // 100 is NOT an l-value
(1000 + 20) = x; // (1000 + 20) is NOT an l-value
string name;
name = "Frank";
"Frank" = name; // "Frank" is NOT an l-value
```

#### r-values
- r-value (non-addressable and non-assignable)
  - A value that’s not an l-value
    - on the right-hand side of an assignment expression
    - a literal
    - a temporary which is intended to be non-modiﬁable
```cpp
int x {100};  // 100 is an r-value
int y = x + 200; // (x+200)is an r-value

string name;
name = "Frank"; // "Frank" is an r-value
int max_num = max(20,30); // max(20,30) is an r-value
```
- r-values can be assigned to l-values explicitly
```cpp
int x {100};
int y {0};
y = 100;// r-value 100 assigned to l-value y
x = x + y;// r-value (x+y) assigned to l-value x
```

#### l-value references
- The references we’ve used are l-value references
  - Because we are referencing l-values
```cpp
int x {100};
int &ref1 = x; // ref1 is reference to l-value
ref1 = 1000;
int &ref2 = 100; // Error 100 is an r-value
```

- The same when we pass-by-reference
```cpp
int square(int &n) {
return n*n;
}
int num {10};
square(num); // OK – num is an l-value
square(5); // Error – can’t reference r-value 5

```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]