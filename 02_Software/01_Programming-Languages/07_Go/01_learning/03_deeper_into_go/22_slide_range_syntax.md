# Cornell Notes

## Topic: Slice Range Syntax

## Date: 01/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- What is slice range syntax in Go?
- How do you create a slice from an array?
- What are the different ways to specify the start and end indices of a slice?

---

### Notes Section (Main Notes)

#### Slice Range Syntax in Go
```go
slice := array[start:end]
```
- In Go, you can create a slice from an array using the slice range syntax.
- `start` is the index where the slice begins (inclusive), and `end` is the index where the slice ends (exclusive).
- If `start` is omitted, it defaults to 0 (the beginning of the array).
- If `end` is omitted, it defaults to the length of the array (the end of the array).
```go
array := [5]int{1, 2, 3, 4, 5}
slice1 := array[1:4] // This will create a slice containing elements 2, 3, and 4
slice2 := array[:3]  // This will create a slice containing elements 1, 2, and 3
slice3 := array[2:]  // This will create a slice containing elements 3, 4, and 5
```
- In the above example:
  - `slice1` will contain the elements from index 1 to index 3 (2, 3, and 4).
  - `slice2` will contain the elements from the beginning of the array to index 2 (1, 2, and 3).
  - `slice3` will contain the elements from index 2 to the end of the array (3, 4, and 5).
- The resulting slices are views into the original array, meaning that changes to the slice will affect the original array and vice versa.
```go
slice1[0] = 10 // This will change the first element of slice1 to 10
fmt.Println(array) // Output: [1 10 3 4 5]
```
- In this example, changing `slice1[0]` to 10 also changes the first element of the original array to 10, demonstrating that slices are references to the underlying array.

---

### Summary Section (Summary of Notes)

- Slice range syntax in Go allows you to create slices from arrays.
- The start index is inclusive, and the end index is exclusive.
- Omitting the start index defaults to 0, and omitting the end index defaults to the length of the array.
- Slices are references to the underlying array, so changes to a slice affect the original array.