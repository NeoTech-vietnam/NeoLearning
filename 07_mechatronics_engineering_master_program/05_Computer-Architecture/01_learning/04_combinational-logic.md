# Cornell Notes

## Topic: Combinational Logic

## Date: 22/09/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- First question or keyword
- Second question or keyword
- Third question or keyword

---

### Notes Section (Main Notes)

#### Logic Gates and Truth Tables

- **BUF Gate**: Output is the same as the input.

![BUF Gate Truth Table](image-31.png)

- **AND Gate**: Output is true if all inputs are true.

![AND Gate Truth Table](image-24.png)

- **OR Gate**: Output is true if at least one input is true.

![OR Gate Truth Table](image-25.png)

- **NOT Gate**: Output is the inverse of the input.

![NOT Gate Truth Table](image-27.png)

- **NAND Gate**: Output is true if at least one input is false.

![NAND Gate Truth Table](image-28.png)

- **NOR Gate**: Output is true if all inputs are false.

![NOR Gate Truth Table](image-29.png)

- **XOR Gate**: Output is true if an odd number of inputs are true.

![XOR Gate Truth Table](image-26.png)


- **XNOR Gate**: Output is true if an even number of inputs are true.

![XNOR Gate Truth Table](image-30.png)

- There are two types of MOS transistors: n-type and p-type.

- They both operate `logically`, very similar to the way wall switches work.

  - **N-type MOS transistor**: The circuit is closed when the gate is supplied with 3V.

![N-type MOS transistor](image-32.png)

  - **P-type MOS transistor**: The circuit is closed when the gate is supplied with 0V.

![P-type MOS transistor](image-33.png)

- The general form used to construct any inverting logic gate, such as: NOT, NAND, or NOR.
  - The networks may consist of transistors in series or in parallel.
  - When transistors are in parallel, the network is **ON** if one of the transistors is **ON**.

> pMOS transistors are used for pull-up
> nMOS transistors are used for pull-down

- Exactly one network should be **ON**, and the other network should be **OFF** at any given time
  - If both networks are **ON** at the same time, there is a **short circuit** -> likely incorrect operation.
  - If both networks are **OFF** at the same time, the output is **floating** -> undefined

![alt text](image-34.png)

- MOS transistors are imperfect switches.
- pMOS transistors pass 1's well but 0's poorly. (holes carry charge)
- nMOS transistors pass 0's well but 1's poorly. (electrons carry charge)

- pMOS transistors are good at `pulling up` the output
- nMOS transistors are good at `pulling down` the output

![alt text](image-35.png)

#### 

**Digital Circuits**

- A circuit is a network that processes discrete-valued variables:
  - One or more discrete-valued input terminals.
  - One or more discrete-valued output terminals.
  - A functional specification describing the relationship between the inputs and outputs.
  - A timing specification describing the delay between inputs changing and outputs responding.

![Digital Circuit Example](image-36.png)

- Inside a circuit:

  - Element: is itself a circuit with inputs and outputs, specification.
  - Node: Wire, whose voltage conveys a discrete-valued variable.

- A digital circuit can be:
  - Combinational logic circuit: Memoryless (without information of the previous states)
  - Sequential logic circuit: with Memory (with information of the previous states).
- Example: A combinatory

$$
Y = F(A,B) = A + B
$$

![Combinational Logic Circuit Example](image-38.png)

- A function can have different implementation forms

- Example: Full Adder circuit

![Full Adder Circuit Example](image-39.png)

- 2 Output with 3 Input

$$
S = F(A,B,C_{in})
C_{out} = G(A,B,C_{in})
$$

- Bus: Bundle of multiple signals

![Bus Example](image-40.png)

3 input and 2 output

- Combination Composition: build a large combinational circuit from the smaller ones.

![Combination Composition Example](image-41.png)

![Combination Composition Example 2](image-42.png)


**Simple Equations**

- **NOT** — $\overline{A}$ (reads "not A") is `1` if `A` is `0`.
  - Complement of `A`:
    - $A$: true form
    - $\overline{A}$: complement form

  |  $A$  | $\overline{A}$ |
  | :---: | :------------: |
  |   0   |       1        |
  |   1   |       0        |

- **AND** — $A \cdot B$ (reads "A and B") is `1` if `A` and `B` are both `1`.
  - $A, B, \overline{A}, \overline{B}, \dots$ — **literal**
  - **Product**: AND of literals
  - **Implicant**: product of literals

  |  $A$  |  $B$  | $A \cdot B$ |
  | :---: | :---: | :---------: |
  |   0   |   0   |      0      |
  |   0   |   1   |      0      |
  |   1   |   0   |      0      |
  |   1   |   1   |      1      |

- **OR** — $A + B$ (reads "A or B") is `1` if either `A` or `B` is `1`.
  - **Sum**: OR of literals

  |  $A$  |  $B$  | $A + B$ |
  | :---: | :---: | :-----: |
  |   0   |   0   |    0    |
  |   0   |   1   |    1    |
  |   1   |   0   |    1    |
  |   1   |   1   |    1    |

**Boolean Equations**

- Complex equations are built from the 3 basic equations
- The order of operations (basic equations):
  - **NOT** has the highest precedence.
  - **AND** comes next.
  - **OR** has the lowest precedence.
- A sample of boolen equation:

$$
F(A,B,C) = A \cdot B + \overline{C} 
$$

---

### Summary Section (Summary of Notes)

Brief summary of key ideas and takeaways