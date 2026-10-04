# Cornell Notes

## Topic: Why cross-coupled inverters are bistable

## Date: 03/10/2026

### Cue Column

- Why can two inverters remember a value?
- Why are there two stable states?
- What happens near the switching threshold?
- Why do two output nodes store only one bit?

### Notes Section

#### Two inversions preserve the original value

In the slide, inverter I2 takes Q and produces Q̅; inverter I1 takes Q̅ and produces Q. Thus the feedback loop has two inversions:

$$Q \rightarrow \neg Q \rightarrow \neg(\neg Q)=Q.$$

Either binary assignment is self-consistent:

| Q | Q̅ | I2 produces | I1 produces | Result |
|---|---|---|---|---|
| 0 | 1 | 1 | 0 | Holds 0 |
| 1 | 0 | 0 | 1 | Holds 1 |

The feedback continuously maintains the stored value while the circuit is powered. This is why it acts as memory. [MIT 6.004](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/f423c43074131fc9a9dfd98db8969922_z3DEmSG8kPk.pdf), pp. 4–5.

#### Why “stable” means more than logically consistent

Real inverters have analog voltage transfer curves. Around either valid stored state, the magnitude of the loop gain is below one, so small voltage disturbances shrink. Around the intermediate equilibrium, the gain exceeds one and disturbances grow. [NPTEL, Lecture 20, section 20.4](https://archive.nptel.ac.in/content/storage2/courses/117101058/Slides/20.2.htm).

To see regeneration, suppose Q rises slightly near that intermediate point. I2 drives Q̅ downward; I1 responds by driving Q further upward. Two negative inverter gains multiply to a positive loop gain. The difference grows until the outputs approach opposite logic rails. This explanation applies the transfer-curve gain analysis in [NPTEL section 20.4](https://archive.nptel.ac.in/content/storage2/courses/117101058/Slides/20.2.htm).

#### The third equilibrium is metastable

The analog circuit has three equilibria, but only two are stable. The intermediate one can theoretically persist with perfect balance; a tiny disturbance can send it toward either stable state. It is therefore not a reliable third digital value. [MIT 6.111, Lecture 4](https://web.mit.edu/6.111/www/s2007/LECTURES/l4.pdf), slide 5.

#### Why the capacity is one bit

Two distinguishable stable states encode one binary choice:

$$\log_2 2=1\text{ bit}.$$

Q̅ adds no independent information: knowing Q already determines Q̅ in either stable state. This is a direct counting argument using the two stable states and MIT's relationship between bits and state count. [MIT 6.004](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/f423c43074131fc9a9dfd98db8969922_z3DEmSG8kPk.pdf), pp. 2 and 5.

### Summary

Two inverters form positive feedback that sustains either complementary binary state. Their analog gain makes those states stable and the intermediate state metastable. The two reliable states represent one bit.
