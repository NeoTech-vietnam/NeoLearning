# Cornell Notes

## Topic: Go Packages

## Date: 14/04/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### What does "package main" mean?
- In Go, a package is a way to organize and reuse code. 
- The `main` package is a special package that serves as the entry point for a Go program. 
- When you run a Go program, the Go runtime looks for the `main` package and executes the `main` function within it. This is where the execution of the program begins.
- The `main` package will include all the `.go` files that are part of the program, means they also belong to the `main` package by including this line of code.
```go
package main
```
- Must have a func called `main` in the `main` package, which is the starting point of the program. If not, the program will not compile.
```go
package apple

func main() {
    // This will not compile because it's not in the main package
}
```
#### Types of Packages?
- There are two types of packages in Go:
  - Executable Packages: Generates a file that we can run.
  - Reusable Packages: Code used as 'helper'. Good place to put reusable logic.

##### 1. Executable Packages 
- These are packages that contain a `main` function and can be compiled to produce an executable program. 
- They are used for applications and command-line tools.

##### 2. Reusable Packages
- These packages do not contain a `main` function and are meant to be imported and used by other packages. 
- They provide functionality that can be reused across different programs.


### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]