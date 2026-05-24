# Section 9: Advanced Control Flow

## Topic: The goto statement

## Date: 16/11/2025 

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)
**1. Overview**
- you have probably previously heard about the goto statement and its bad reputation
  - virtually every computer language has such a statement
- a goto statement causes program control to jump to a particular line of code in your program
  - this branch is made immediately and unconditionally upon execution of the goto
- to identify where in the program the branch is to be made, a label is needed
- a label is a name that is formed with the same rules as variable names
- the label is placed directly before the statement to which the branch is to be made and must appear in the same function as the goto

**2. Syntax**
- as mentioned, the goto statement has two parts
  - the goto
  - a label name
```c
Form:
goto label; // ends in a semicolon
.
.
.
label : statement // must have a semicolon after the label name
```
**3. Example**
```c
goto someLabel;
```
- causes the program to branch immediately to the statement that is preceded by the label “someLabel”
- this label can be located anywhere in the function
  - before or after the goto, and might be used as shown
```c
someLabel: printf ("Unexpected end of data.\n");
```
**4. Problems with goto**
- programmers who are lazy frequently abuse the goto statement to branch to other portions of their code
- the goto statement interrupts the normal sequential flow of a program
  - as a result, programs are harder to follow and thus harder to maintain
- using many gotos in a program can make it impossible to decipher
- this style of programming is often derisively referred to as “spaghetti code.”
- for these reasons, goto statements are not considered part of good programming style

**5. Example of spaghetti code using goto**
```c
one:
for (i = 0; i < number; ++i) {
test += i;
goto two;
}
two:
if (test > 5) {
goto three;
}
... .. ...
```

**6. Avoiding goto**
- in principle, you never need to use the goto statement in a C program, however, some programmers develop bad habits
  - or have learned programming languages where a goto was necessary, i.e. fortran
- most gotos are used for helping ifs, simulating if elses, controlling loops, or are just there because you have programmed yourself into a corner
- instead of skipping to the end of a loop and starting the next cycle using a goto statement, use `continue`
  - instead of leaving a loop using a goto statement, use break
    - actually, break and continue are specialized forms of a goto statement
      - the advantages of using them are that their names tell you what they are supposed to do
      - also they do not use labels and thus, there is no danger of putting a label in the wrong place
- the alternative forms are clearer than the goto forms
- If you are used to using goto statements, try to train yourself not to

**7. When to use the goto statement**
- there is one situation in which the goto statement can be very useful because it provides a way to avoid a lot of complicated logic
- can be used to exit deeply nested control structures efficiently
```c
for(int i = 0 ; i < 10 ; ++i) {
    for(int j = 0 ; j < 20 ; ++j) {// Loop executed 10 times
        for(int k = 0 ; k < 30 ; ++k) {// Loop executed 10x20 times
            // Loop body executed 10x20x30 times
            /* Do something useful */
            if(must_escape)
                goto out;
            }
    }
}
out:
/*Statement following the nested loops */
```
- you have a direct exit from the complete nest of loops without any complicated decision making in the outer loop levels

---

### Summary Section (Summary of Notes)

[Insert a brief summary of the key ideas and takeaways]
