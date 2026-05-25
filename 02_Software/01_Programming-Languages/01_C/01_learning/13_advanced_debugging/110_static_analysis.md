# Section 15: Advanced Debugging, Analysis, and Compiler Opotions

## Topic: Static Analysis

## Date: 28/12/2025

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

**1. Static analysis**
- static analysis is a method of debugging by automatically examining source code before a program is run
  - do not actually run the program
  - contrast with dynamic analysis (profiling), analysis performed on programs while they are executing
- the analysis is performed on some version of the source code
- the process provides an understanding of the code structure, and can help to ensure that the code adheres to industry standards
- this type of analysis addresses weaknesses in source code that might lead to vulnerabilities
  - could also be achieved through manual code reviews
- analysis is often performed by an automated tool
- much more effective than code reviews
- the sophistication of the analysis performed by tools varies
  - from those that only consider the behavior of individual statements and declarations
  - to those that include the complete source code of a program in their analysis
- software metrics and reverse engineering can be described as forms of static analysis

**2. Static Analysis vs. Dynamic Analysis**
- both types of analysis detect defects
- the big difference is where they find defects in the development lifecycle
- static analysis identifies defects before you run a program (e.g., between coding and unit testing)
- dynamic analysis identifies defects after you run a program (e.g., during unit testing)
  - some coding errors might not surface during unit testing
- there are defects that dynamic testing might miss that static code analysis can find

**3. Benefits of the Best Static Code Analysis Tools**
- the best static code analysis tools offer speed, depth, and accuracy.
- **Speed**
  - It takes time for developers to do manual code reviews
  - automated tools are much faster
- **Static code checking addresses problems early on**
  - pinpoints exactly where the error is in the code
  - you will be able to fix those errors faster
  - coding errors found earlier are less costly to fix
- **Depth**
  - testing cannot cover every possible code execution path, but a static code analyzer can
- Accuracy
  - manual code reviews are prone to human error, however, automated tools are not
  - they scan every line of code to identify potential problems
    - helps you ensure the highest-quality code is in place (before testing begins)
- tools can check the code as you work on your program
  - You will get an in-depth analysis of where there might be potential problems in your code, based on the rules you’ve applied

**3. Limitations of Static Analysis**
- limitations include
- no understanding of developer intent
- may detect a possible overflow in this calculation
  - it can not determine that function fundamentally does not do what is expected
- rules that are not statically enforceable
  - some coding rules depend on external documentation
  - some rules are open to subjective interpretation
- possible defects lead to false positives and false negatives
- in some situations, a tool can only report that there is a possible defect

**4. Some tools available**
- there are a ton of tools available that perform static analysis
- the two tools that I have experience with are coverity and codesonar
- **Coverity (by Synopsis)**
  - reasonably fast and returns few false positives
  - latest versions supports an option to choose between three levels of aggressiveness, with the number of reports increasing (and the number of possible false positives going up) at the higher levels
- **CodeSonar (by Grammatech)**
  - performs a whole-program, interprocedural analysis on C
  - identifies programming bugs and security vulnerabilities
  - also provides rules checkers for the Power of Ten coding rules
  - can be slow on large code bases
- the U.S. Food and Drug Administration uses CodeSonar to detect defects in fielded medical devices
- NASA uses CodeSonar in its Study on Sudden Unintended Acceleration in the electronic throttle control systems of Toyota vehicles

**5. How CodeSonar works**
- employs a unified dataflow and symbolic execution analysis that examines the computation of the complete application
- by not relying on pattern matching or similar approximations, CodeSonar's static analysis engine is extraordinarily deep, finding 3-5 times more defects on average than other static analysis tools
- like a compiler, CodeSonar does a build of your code using your existing build environment, but instead of creating object code, CodeSonar creates an abstract model of your entire program
  - from the derived model, CodeSonar’s symbolic execution engine explores program paths
    - reasoning about program variables and how they relate
  - advanced theorem-proving technology prunes infeasible program paths from the exploration
- checkers perform static code analysis to find common defects, violations of policies, etc
  - operate by traversing or querying the model, looking for particular properties or patterns that indicate defects
- an astronomical number of combinations of circumstances must be modeled and explored, so CodeSonar employs a variety of strategies to ensure scalability
  - procedure summaries are refined and compacted during the analysis, and paths are explored in an order that minimizes paging

---

### Summary Section (Summary of Notes)
- [GCC online documentation](https://gcc.gnu.org/onlinedocs/gcc-15.2.0/gcc.pdf)

[Insert a brief summary of the key ideas and takeaways]
