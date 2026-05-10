# Cornell Notes

## Topic: Byte Slices

## Date: 01/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### Byte Slices
- In Go, a byte slice is a slice of bytes (`[]byte`), which is commonly used for handling binary data or strings.
- A byte slice can be created from a string using the `[]byte` conversion:
```go
s := "Hello, World!"
b := []byte(s)
```
- This allows you to manipulate the string as a slice of bytes, which can be useful for tasks like encoding, decoding, or working with binary data.
- You can also create a byte slice directly using a byte literal:
```go
b := []byte{72, 101, 108, 108, 111} // Represents "Hello"
```
- Byte slices can be modified, and they are mutable, unlike strings which are immutable in Go.
- When working with byte slices, you can use the `copy` function to copy data from one byte slice to another:
```go
src := []byte("Hello, World!")
dst := make([]byte, len(src))
copy(dst, src)
```
- This is useful for creating a new byte slice with the same content as an existing one, or for copying a portion of a byte slice to another.

---

### Summary Section (Summary of Notes)

- Byte slices (`[]byte`) are used for handling binary data or strings in Go.
- They can be created from strings or directly using byte literals.
- Byte slices are mutable, unlike strings which are immutable.
- The `copy` function can be used to copy data between byte slices, useful for creating new slices or copying portions of existing slices.
