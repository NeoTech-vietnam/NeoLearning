# Cornell Notes

## Topic: Slices and For Loops

## Date: 15/04/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### 1. Arrays in Go
- In Go, an array is a fixed-size collection of elements of the same type. The size of an array is determined at the time of declaration and cannot be changed. For example:
```go
var myArray [5]int
```
- This declares an array of integers with a size of 5. You can also initialize an array with values at the time of declaration:
```go
myArray := [5]int{1, 2, 3, 4, 5}
```
- You can also declare an array without specifying the size, and the compiler will determine the size based on the number of elements provided:
```go
myArray := [...]int{1, 2, 3, 4, 5}
```
- `...` is optional and can be used to let the compiler determine the size of the array based on the number of elements provided. 
- You can also declare with `[]` and the compiler will determine the size based on the number of elements provided:
```go
myArray := []int{1, 2, 3, 4, 5}
```
- Arrays in Go are value types, which means that when you assign an array to another variable, a copy of the array is created. Modifying one array will not affect the other.
```go
myArray1 := [5]int{1, 2, 3, 4, 5}
myArray2 := myArray1 // creates a copy of myArray1
myArray2[0] = 10 // modifies myArray2, but not myArray1
```

#### 2. Slices in Go
- A slice is a more flexible and powerful data structure than an array in Go. It is a reference type that provides a dynamic view into an underlying array. A slice can grow and shrink in size, and it can be created using the `make` function or by slicing an existing array. For example:
```go
mySlice := make([]int, 5) // creates a slice of integers with length 5
```
- You can also create a slice by slicing an existing array:
```go
myArray := [5]int{1, 2, 3, 4, 5}
mySlice := myArray[1:4] // creates a slice that includes elements
```
- Every element in a slice must be of the same type, and the length of a slice can be changed dynamically. 
- When you modify a slice, it modifies the underlying array, which means that changes to one slice can affect other slices that share the same underlying array.

#### 3. Adding Elements to a Slice
- You can add elements to a slice using the `append` function. The `append` function takes a slice and one or more values to add to the slice, and it returns a new slice with the added elements. For example:
```go
mySlice := []int{1, 2, 3}
mySlice = append(mySlice, 4) // adds 4 to the slice
mySlice = append(mySlice, 5, 6) // adds 5 and 6 to the slice
```
- The `append` function may create a new underlying array if the existing array does not have enough capacity to accommodate the new elements. This is an important detail to keep in mind when working with slices, as it can affect performance and memory usage.

#### 4. For Loops with Slices
- You can use a `for` loop to iterate over the elements of a slice. The `for` loop can be used in two ways: with an index or with a `range`. 
- Using an index:
```go
mySlice := []int{1, 2, 3, 4, 5}
for i := 0; i < len(mySlice); i++ {
    fmt.Println(mySlice[i]) // prints each element of the slice
}
```
- Using a range:
```go
mySlice := []int{1, 2, 3, 4, 5}
for index, value := range mySlice {
    fmt.Printf("Index: %d, Value: %d\n", index, value) // prints the index and value of each element in the slice
}
```
- Syntax:
```go
for index, value := range mySlice {
    // code to execute for each element in the slice
}
```
- `index`: The index of the current element in the slice. It starts from 0 and increments by 1 for each iteration.
- `value`: The value of the current element in the slice. It is assigned the value of the current element in each iteration of the loop.
- The `range` keyword is used to iterate over the elements of the slice, and it provides both the index and value of each element in the slice. You can choose to ignore either the index or value by using an underscore `_` in place of the variable name.
```go
mySlice := []int{1, 2, 3, 4, 5}
for _, value := range mySlice {
    fmt.Println(value) // prints only the value of each element in the slice
}
```

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]