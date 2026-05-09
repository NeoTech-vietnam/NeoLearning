# Cornell Notes

## Topic: Dereferencing a Pointer

## Date: 06/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Dereferencing a Pointer
- Access the data we’re pointing to – dereferencing a pointer
  - If score_ptr is a pointer and has a valid address
  - Then you can access the data at the address contained in the score_ptr using the dereferencing operator `*`
```cpp
int score {100};
int *score_ptr {&score};
cout << *score_ptr << endl; // 100
*score_ptr = 200;
cout << *score_ptr << endl; // 200
cout << score << endl; // 200
```

- Access the data we’re pointing to
```cpp
double high_temp {100.7};
double low_temp {37.4};
double *temp_ptr {&high_temp};
cout << *temp_ptr << endl; // 100.7
temp_ptr = &low_temp;
cout << *temp_ptr << endl; // 37.4
```
- Access the data we’re pointing to
```cpp
string name {"Frank"};
string *string_ptr {&name}; // Frank
cout << *string_ptr << endl;
name = "James";
cout << *string_ptr << endl; // James
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]