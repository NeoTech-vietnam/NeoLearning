# Cornell Notes

## Topic: Random Number Generation

## Date: 14/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### New Functions for Random Number Generation
- To generate random numbers in Go, we can use the `math/rand` package.
- The `rand.NewSource` function creates a new random source, which is seeded with the current time in nanoseconds using `time.Now().UnixNano()`. This ensures that we get different random numbers each time we run the program.
- The `rand.New` function creates a new random number generator that uses the specified source. This allows us to generate random numbers using the `Intn` method of the generator.
```go
source := rand.NewSource(time.Now().UnixNano())
r := rand.New(source)
```
- In the above code, we create a new random source and a new random number generator. We can then use the `Intn` method of the generator to generate random numbers within a specified range.
```go
newPosition := r.Intn(len(d) - 1)
```
- This line generates a random integer between 0 and the length of the deck minus one, which is used to determine the new position for shuffling the deck.

#### Time Package
- The `time` package in Go provides functionality for measuring and displaying time. In this context, we use it to get the current time in nanoseconds to seed our random number generator. This is important because it ensures that we get different random numbers each time we run the program, rather than the same sequence of numbers every time.
```go
time.Now().UnixNano()
```
- This function returns the current time in nanoseconds since January 1, 1970 (the Unix epoch), which is a common way to seed random number generators.


---

### Summary Section (Summary of Notes)

- The `math/rand` package in Go is used for generating random numbers.
- The `rand.NewSource` function creates a new random source, seeded with the current time in nanoseconds using `time.Now().UnixNano()`.
- The `rand.New` function creates a new random number generator that uses the specified source.
- The `Intn` method of the generator is used to generate random numbers within a specified range.
- The `time` package provides functionality for measuring and displaying time, and is used here to seed the random number generator to ensure different random numbers each time the program runs.
