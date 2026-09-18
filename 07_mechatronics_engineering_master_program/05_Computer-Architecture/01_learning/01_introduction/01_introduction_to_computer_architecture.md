# Cornell Notes

## Topic: Introduction to Computer Architecture

## Date: 16/09/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- First question or keyword
- Second question or keyword
- Third question or keyword

---

### Notes Section (Main Notes)

#### The Moore's Law (Empirical Law)

Moore's Law states that the number of transistors on a microchip doubles approximately every two years, though the cost of computers is halved. This empirical observation has driven the exponential growth of computing power over the past several decades.

![alt text](image.png)

#### Computer Revolution

The first generation:
- Vaccuum tubes were used as the main electronic component.
- 1946 - 1955

![alt text](image-1.png)

The second generation:
- Transistors replaced vacuum tubes, leading to smaller, faster, and more reliable computers.
- 1955 - 1965

![alt text](image-2.png)

Examples:

**ENIAC - 1946**

![alt text](image-3.png)

**UNIVAC I - 1952**

![alt text](image-4.png)

As the generations progressed, computers became more powerful, efficient, and accessible to a wider range of users. The transition from vacuum tubes to transistors marked a significant milestone in the evolution of computer architecture, paving the way for the development of integrated circuits and modern computing systems.

With the development of transistors, Moore's Law is reaching its limits.

![alt text](image-5.png)

As the number of transistors on a chip increases, the physical limitations of miniaturization and heat dissipation become more pronounced.

#### What's Next?

**Supercomputer**: the development of supercomputers has pushed the boundaries of computational power, enabling complex simulations, scientific research, and data analysis at unprecedented scales.

![alt text](image-6.png)

**Quantum Computing**: Quantum computing represents a paradigm shift in computation, leveraging the principles of quantum mechanics to perform calculations that are infeasible for classical computers. This emerging field holds the potential to revolutionize areas such as cryptography, optimization, and drug discovery.

![alt text](image-7.png)

Referenced from: [sci.news](https://www.sci.news/othersciences/computerscience/qubit-copies-14467.html)

**Parallel and Tensor/ Neural computing**: Parallel computing involves the simultaneous execution of multiple tasks, improving computational efficiency and performance. Tensor and neural computing focus on specialized hardware and algorithms for deep learning and artificial intelligence applications, enabling faster training and inference of neural networks.

![alt text](image-8.png)

*TPU Printed Circuit Board. It can be inserted in the slot for an SATA disk in a server, but the card uses PCIe Gen3 x16.*

![alt text](image-10.png)

Referenced from: [Cuda-2](https://blogs.nvidia.com/blog/what-is-cuda-2/)

![alt text](image-11.png)

![alt text](image-9.png)

*Systolic data flow of the Matrix Multiply Unit. Software has the illusion that each 256B input is read at once, and they instantly update one location of each of 256 accumulator RAMs.*

**Cloud and Edge**

![alt text](image-12.png)

- **Traditional Cloud Computing**: Centralized data centers that provide computing resources and services over the internet. Users can access and utilize these resources without the need for local infrastructure.
- **Modern Edge Computing**: Distributed computing paradigm that brings computation and data storage closer to the location where it is needed, reducing latency and improving performance for applications such as IoT, autonomous vehicles, and real-time analytics.


#### Computer Architecture

![alt text](image-13.png)

**Algorithm:** Step-by-step procedure that is guaranteed to terminate where each step is precisely stated and can be carried out by a computer.
- Finiteness.
- Definiteness.
- Effective computability.

**Microarchitecture:** The way a given instruction set architecture (ISA) is implemented in a particular processor. It includes the datapath, control unit, and memory hierarchy.

**Digital logic circuits:** Buidling blocks of micro-arch (e.g., gates)

**ISA (Instruction Set Architecture)**: Interface between software and hardware. It defines the set of instructions that a processor can execute, along with the associated data types, registers, and memory addressing modes.

#### Basic Structure of a Computer

![alt text](image-14.png)

**Devices**

![alt text](image-15.png)

*Apple M1 Ultra System (2022)*

![alt text](image-16.png)

*Intel Alder Lake (2021)*

![alt text](image-17.png)

#### Architecture

**Princeton (Von Neumann) Architecture**: A computer architecture model that describes a system where the CPU, memory, and input/output devices share a single communication pathway. It is characterized by the use of a single memory space for both instructions and data.

![alt text](image-18.png)

**Harvard Architecture**: A computer architecture model that describes a system where the CPU, memory, and input/output devices have separate communication pathways. It is characterized by the use of separate memory spaces for instructions and data.

![alt text](image-19.png)

#### ISA - Instruction Set Architecture

MIPS (Microprocessor without Interlocked Pipeline Stages) is a RISC (Reduced Instruction Set Computer) architecture that emphasizes simplicity and efficiency in instruction execution. It features a load/store architecture, fixed-length instructions, and a small set of general-purpose registers.

RISC (Reduced Instruction Set Computer) is a computer architecture that focuses on a small, highly optimized set of instructions, allowing for faster execution and simpler hardware design. RISC architectures typically use fixed-length instructions and a load/store model for memory access.

RISC-V (RISC-V) is an open standard instruction set architecture based on the principles of RISC. It is designed to be extensible, allowing for custom instructions and features while maintaining compatibility with existing RISC-V implementations.

ARM (Advanced RISC Machine) is a family of RISC-based architectures widely used in embedded systems, mobile devices, and other low-power applications. ARM processors are known for their energy efficiency and performance.

...

#### Abstraction Layers

**Abstraction Layers:** Different levels of abstraction in computer architecture, ranging from high-level programming languages down to digital logic circuits. Each layer provides a simplified view of the underlying hardware, allowing designers and programmers to focus on specific aspects of the system.

- **Application**: Software applications that run on a computer system, utilizing the underlying layers of abstraction.
- High-level Languages: Programming languages that provide a higher level of abstraction, allowing developers to write code that is more human-readable and easier to understand. Examples include Python, Java, and C++.
- **Assembly Language**: Low-level programming language that provides a symbolic representation of machine code instructions. Assembly language allows programmers to write code that is closely tied to the underlying hardware architecture.
- **Instruction Set Architecture (ISA)**: The interface between software and hardware, defining the set of instructions that a processor can execute, along with the associated data types, registers, and memory addressing modes. Many processors can implement the same ISA.
- **Microarchitecture**: The implementation of a specific ISA in a processor, including the datapath, control unit, and memory hierarchy. Microarchitecture determines how instructions are executed and how data is processed within the CPU.
- **Digital Logic**: The fundamental building blocks of computer architecture, consisting of logic gates and circuits that perform basic operations such as AND, OR, and NOT. Digital logic circuits are used to implement the microarchitecture and execute instructions.
- **Devices / Transistors**: The physical components of a computer system, including transistors, which are the basic building blocks of digital circuits. Transistors are used to create logic gates and other electronic components that enable computation and data processing.

![alt text](image-20.png)

---

### Summary Section (Summary of Notes)

Brief summary of key ideas and takeaways