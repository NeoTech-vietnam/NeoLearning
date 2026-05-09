# Cornell Notes

## Topic: Basic Input and Ouput (I/O) using `cin` and `cout` in C++

## Date: 20/03/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Basic I/O using cin and cout**

- `cout`, `cin`, `cerr`, and `clog` are objects representing streams
- `cout`
  - standard output stream
  - console
- `cin`
  - standard input stream
  - keyboard
- `<<`
  - Insertion operator
  - output streams
- `>>`
  - extraction operator
  - input streams

**2. cout and <<**

- Insert the data into the cout stream
```cpp
cout << data;
```

- Can be chained
```cpp
cout << "data 1 is " << data1;
```

- Does not automatically add line breaks
```cpp
cout << "data 1 is " << data1 << endl;
cout << "data 1 is " << data1 << "\n";
```

**3. cin and >>**

- Extract data from the cin stream based on data’s type
```cpp
cin >> data;
```
- Can be chained
```cpp
cin >> data1 >> data2;
```
- Can fail if the entered data cannot be interpreted
```cpp
data could have an undetermined value
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]