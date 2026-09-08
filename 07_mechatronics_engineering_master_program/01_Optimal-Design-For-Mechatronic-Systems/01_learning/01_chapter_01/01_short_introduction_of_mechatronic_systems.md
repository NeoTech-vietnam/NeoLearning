# Cornell Notes

## Topic: Short Introduction of Mechatronic Systems

## Date: 08/09/2026

---

<p align="center"><strong><em>"DO NOT JUST TALK ABOUT IT — SHOW IT"</em></strong></p>

---

### Cue Column (Questions, Keywords, or Prompts)

- From Mechanical to Mechatronic Systems
- Example of Mechatronic Systems
- Functions of Mechatronic Systems

---

### Notes Section (Main Notes)

### From Mechanical to Mechatronic Systems

![Machine-set schematic, energy and information flows, and variable legend](images/p04-machine-set-and-mechatronic-system.png)

*Source: Chapter 1 PDF, page 4.*

The image explains how a mechanical machine becomes a mechatronic system by combining energy flow with information and feedback control.

Read the left side from top to bottom:

- (a) **A physical machine:** an electric motor drives a pump through a transmission. Electrical energy becomes rotational motion, then useful pumping work.
- (b) **The same machine represented as functional blocks:** power electronics → power-generating machine (motor) → drivetrain → power-consuming machine (pump). This helps you see each component’s role.
- (c) **A generalized model:** an actuator influences the mechanical process, while sensors measure its behavior. This model applies to many machines, beyond this particular motor and pump.

**The right-hand diagram adds the information-processing layer.** A controller receives sensor measurements, compares them with desired values, and sends commands to the actuator. A human–machine interface lets the operator set targets and monitor operation.

For example, if the goal is to maintain a pump’s speed:
1. The operator sets the desired speed.
2. A sensor measures actual speed.
3. The controller adjusts the motor’s electrical input when the speed differs from the target.

The two arrow styles highlight the central distinction: energy flow makes the machine do work; information flow regulates how that work is performed. Their integration is what makes the overall system mechatronic.

**Mechatronics**: synergetic integration of different disciplines

These integrated mechanical–electronic systems are increasingly called **mechatronic systems.**

The word *Mechatronics* was probably first created by a Japanese engineer, Tetsuro Mori, in 1969 and had a trademark by a Japanese company until 1972.

![Synergetic integration of mechanical engineering, electronics, and information technology](images/p05-mechatronics-disciplines.png)

*Source: Chapter 1 PDF, page 5.*

![Historical shift from mechanical systems toward electronic and digital functions](images/p05-mechanical-to-mechatronic-evolution.png)

*Source: Chapter 1 PDF, page 5.*

### Difference of Industrial Automation and Mechatronics

While *mechatronics* and *industrial automation* are two fields that share certain similarities, they have many distinct differences as well.

The solution of tasks to design mechatronic systems is performed on the mechanical as well as on the digital-electronic side.
- Interrelations during the design and construction of mechatronic systems.

![Comparison of conventional and integrated mechatronic design procedures](images/p06-conventional-and-mechatronic-design.png)

*Source: Chapter 1 PDF, page 6.*

On the **left—conventional design**, the mechanical system and electronics are designed largely as separate components, then connected. For example, you start with an existing pump and add sensors, a motor controller, and a PLC to automate its operation.

On the **right—mechatronic design**, mechanics and electronics are developed together as one system. The two-way arrow means decisions in either area influence the other. For example, the pump mechanism, motor, sensors, and control algorithm are chosen together to achieve the required performance.

| Conventional approach                           | Mechatronic approach                                     |
| ----------------------------------------------- | -------------------------------------------------------- |
| Design components separately, then connect them | Design interacting components together                   |
| Adapt controls to the mechanical design         | Let control capabilities influence the mechanical design |
| Focus on individual components                  | Optimize the overall system                              |

However, **the figure compares design approaches; it does not strictly separate industrial automation from mechatronics.** Industrial automation concerns making industrial processes operate automatically. Mechatronics concerns integrating mechanics, electronics, and control in a system’s design.

They overlap: an automated production line can contain many mechatronically designed machines, such as robots and servo-driven positioning systems.

### Examples of Mechatronic Systems

![Classification and examples of mechatronic systems](images/p07-mechatronic-system-examples.png)

*Source: Chapter 1 PDF, page 7.*

![Comparison of manual vacuum cleaning and robotic vacuum cleaners with connecting arrows](images/p13-vacuum-cleaner-comparison.png)

*Source: Chapter 1 PDF, page 13.*

### Functions of Mechatronic Systems

![Comparison table of conventional and mechatronic system properties](images/p08-conventional-and-mechatronic-properties.png)

*Source: Chapter 1 PDF, page 8.*

### Integration Forms of Processes with Electronics

![Classical system structure, hardware integration, and software integration](images/p09-hardware-and-software-integration.png)

*Source: Chapter 1 PDF, page 9.*

### Integration through Components (Hardware Integration)

![Hardware integration examples: measuring instrument and integrated motor unit](images/p10-hardware-integration-examples.png)

*Source: Chapter 1 PDF, page 10.*

### Integration by Information Processing (Software Integration)

![Process automation information-processing levels with variable definitions](images/p11-information-processing-levels.png)

*Source: Chapter 1 PDF, page 11.*

![Knowledge-based information processing and component integration](images/p11-integration-by-information-processing.png)

*Source: Chapter 1 PDF, page 11.*

### Integrated Supervision and Fault Diagnosis

![Integrated supervision, fault detection, and fault diagnosis](images/p12-fault-detection-and-diagnosis.png)

*Source: Chapter 1 PDF, page 12.*

---

### Summary Section (Summary of Notes)

Brief summary of the key ideas and takeaways
