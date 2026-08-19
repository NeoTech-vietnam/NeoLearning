# Cornell Notes

## Topic: Lambda Expressions Overview

## Date: 02/07/2026

---

<p align="center"><strong><em>"DO NOT JUST TALK ABOUT IT — SHOW IT"</em></strong></p>

---

### Cue Column (Questions, Keywords, or Prompts)

- [Insert question or keyword]
- [Insert question or keyword]
- [Insert question or keyword]

---

### Notes Section (Main Notes)

#### C++ Lambda expressions

A lambda creates an unnamed function object near its point of use. This section covers:

1. [Motivation](266_motivation.md): function objects and why concise local behavior helps.
2. [Syntax and captures](267_lambda_syntax_and_captures.md): closure syntax, state, ownership, and lifetime hazards.
3. [Generic lambdas and algorithms](268_generic_lambdas_and_algorithms.md): templated call operators and standard algorithm policies.

Stateless lambdas carry no captured context. Stateful lambdas capture values, references, or objects. Their generated closure type is unique and usually stored with `auto`.

---

### Summary Section (Summary of Notes)

Lambdas are concise function objects. Keep them small, make captures explicit, and use them mainly to express local behavior passed to algorithms or callbacks.