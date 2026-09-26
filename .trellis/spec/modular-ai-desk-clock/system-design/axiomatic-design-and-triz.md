# Axiomatic Design and TRIZ: Modular AI Desk Clock

## 1. Scope / Trigger

Use this spec when designing the desk clock or changing the slim core shared with future watch and four-wheel-robot hosts. The core docks behind the clock's balanced outer form. The current product is a **concept**; there is no validated prototype, quantified FR range, or measured FR×DP matrix on this branch.

The design sequence is customer need (CN) → solution-neutral functional requirement (FR) → design parameter (DP) → physical implementation/process variable (PV). Decompose an FR and its selected DP together; do not treat a list of parts as an FR hierarchy. Preserve FR independence where feasible, then compare the probability of meeting specified FR ranges. A low part count by itself does not satisfy the Information Axiom.

## 2. Signatures: product and interface boundaries

| Boundary | Concept-stage signature | Status |
|----------|-------------------------|--------|
| Reusable core ↔ host | Keyed, detachable mechanical retention; power; data; module identification; safe attach/detach behavior | TBC: geometry, pin count, ratings, protocol, lifecycle |
| Desk-clock host ↔ display | Time/status output and touch input | TBC: display, controller, bandwidth, latency |
| Host ↔ battery/power | Regulated supply, charging/protection, power-state reporting | TBC: chemistry, capacity, voltage/current, thermal limits |
| Host ↔ camera/audio/sensors | Acquired events/data with explicit power and privacy states | TBC: local preprocessing, data rates, wake behavior |
| Housing ↔ user/service | Stable viewing, impact protection, repeatable removal, replaceable wear parts | TBC: materials, fasteners, forces, cycle and drop targets |

**Design decision:** Keep portable identity, state, and coordination in the core; allocate host-specific display, energy storage, and high-bandwidth sensing to the host unless measured workload and interface budgets show another allocation is better. Do not require an MCU in every module by default; justify it with local control, processing, identification, or safety needs. This boundary limits changes to one host from propagating into all hosts.

## 3. Contracts: CN → FR → DP

| ID | Customer need | Functional requirement (what, solution-neutral) | Candidate DP (how) | FR acceptance range |
|----|---------------|-------------------------------------------------|--------------------|---------------------|
| 1 | Reuse one brain across products | FR1: Preserve computing, identity, and user state across compatible hosts | DP1: Slim removable core and common host contract | TBC: transfer behavior and compatibility tests |
| 2 | Read and control the desk clock | FR2: Show time/status and accept direct input | DP2: Host display/touch module | TBC: readability, latency, input accuracy |
| 3 | Operate untethered | FR3: Supply and manage energy safely | DP3: Host battery and power-management module | TBC: runtime, peak load, charging safety |
| 4 | Interact by voice and vision | FR4: Acquire and process requested audio/visual input | DP4: Host microphone, speaker, camera, and justified local processing | TBC: response time, detection quality |
| 5 | Swap parts simply and reliably | FR5: Align, connect, retain, and release modules repeatedly | DP5: Rear keyed dock, protected contacts, latch, service fasteners | TBC: insertion force, retention, cycles, contact errors |
| 6 | Protect privacy and save energy | FR6: Control sensing availability and idle energy | DP6: Defined power states, physical camera shutter, microphone control | TBC: idle power, wake time, privacy-state verification |
| 7 | Keep and repair the product | FR7: Protect internals and replace failed parts | DP7: Serviceable housing, replaceable gasket/contact wear parts, limited adhesive | TBC: drops, access time, repair steps |

Recycled metal, low cost, slim size, four pogo contacts, and a proposed 32 × 28 × 8 mm core are **candidate constraints or targets**, not verified DPs or frozen requirements. Record an owner, numeric range, and evidence before adopting any of them. The balanced clock silhouette belongs to the desk-clock host, not to the universal core.

### FR×DP independence check

For each DP, ask: *If this DP changes within its feasible range, which FR outcomes move?* Record an `X` for measured or strongly justified primary influence, `x` for measured secondary influence, `0` only after evidence shows negligible influence, and `?` for unknown. Do not infer coupling solely from a shared cable, power rail, or physical connection. A diagonal matrix is uncoupled; a triangular matrix may be decoupled by design order; cross-coupled effects need redesign or a justified tolerance analysis.

Initial interactions to investigate: DP1/DP5 may affect portability, power, module communication, and retention; DP3 may affect runtime, size, and thermal behavior; DP4/DP6 may affect sensing quality, latency, privacy, and idle power; DP7 may affect wireless performance and service access. **No independence classification is established yet.**

## 4. Validation & Error Matrix

| Condition found during design or testing | Required response |
|------------------------------------------|-------------------|
| A proposed dock cannot carry worst-case power/data safely | Rebudget the interface; change allocation, protocol, contact count, or geometry before freezing the core |
| A DP change moves multiple unrelated FRs outside their ranges | Rework the architecture or establish a valid decoupled design sequence; update the FR×DP matrix |
| A matrix has an off-diagonal mark but no incompatible parameter demands | Treat it as AD coupling/dependency analysis, **not automatically** a TRIZ contradiction |
| One control parameter must increase for one goal and decrease for another | Log a technical/physical contradiction, generate TRIZ alternatives, then re-evaluate the FR×DP matrix |
| A value is shown only in concept art or discussion | Mark TBC; do not cite it as a validated specification |
| A module cannot fail or be replaced without damaging the core/host | Revise retention, contacts, fasteners, or service boundary and repeat cycle testing |

## 5. Good / Base / Bad Cases

- **Good:** The same core moves from clock to robot host, retains user state, and each host meets its own power/interface limits without changing the core hardware.
- **Base:** The desk clock works with one core, but watch/robot compatibility is still a hypothesis; shared interface values and FR ranges remain TBC.
- **Bad:** A fixed four-contact connector is selected before budgeting camera data, charging current, and hot-plug behavior, forcing later core redesign.

## 6. Tests Required Before Architecture Freeze

| Test / analysis | Assertion point |
|-----------------|-----------------|
| Core/host function allocation | Every function has one owner; host-specific changes do not force unplanned core redesign |
| FR×DP sensitivity study | Each marked influence has a measurement or engineering rationale; unknowns remain `?` |
| Interface budget | Worst-case simultaneous current, data rate, fault, and hot-plug cases fit rated contacts and protocol |
| Dock durability | Insertion force, contact errors, retention, misalignment, cycle life, and drop behavior meet numeric FR ranges |
| Energy and sensing states | Measured idle/active power and wake latency meet ranges; shutter/mic states prevent unintended acquisition |
| Enclosure and service | RF/thermal behavior, replacement time, and post-service function meet ranges |

Set the numeric ranges **before** using these tests to declare a design successful. A prototype demonstration is not a substitute for cross-host compatibility and repeated-cycle evidence.

## 7. Wrong vs Correct: AD and TRIZ use

**Wrong:** “The dock influences many FRs, so the TRIZ contradiction matrix says to add more contacts. Four contacts and the core dimensions are already fixed.”

**Correct:** “Measure how dock contact count/area changes data capacity, current capacity, package size, and swap durability. If the same parameter must be both large and small to meet specified ranges, write the contradiction explicitly; explore alternatives such as local preprocessing, separate power/data paths, contact segmentation, or a different keyed interface. Recalculate the budgets and update the AD matrix.”

### Priority contradiction log (hypotheses, not proven failures)

| Priority | Opposing demands | Candidate resolution to test |
|----------|------------------|------------------------------|
| 1 | Small common dock ↔ high power/data and reliable hot-plug | Budget first; local processing, interface segmentation, protective sequencing |
| 2 | Slim reusable core ↔ more compute, heat, and energy | Separate portable functions from host-specific high-load processing |
| 3 | Fast/low-force release ↔ secure retention and contact life | Keyed guide, independent mechanical latch, compliant protected contacts |
| 4 | Ready sensing ↔ low idle energy and privacy | Explicit power states, event-triggered activation, shutter/mic control |
| 5 | Strong metal shell ↔ RF transparency | Localized RF window while metal carries structure/heat |

TRIZ principles are idea prompts, not validation. Re-run AD after each candidate solution; prefer one that removes a harmful interaction over one that merely hides it. A weighted desk-clock base versus a slim transferable core is already a product-family allocation, not necessarily a contradiction.

## Sources and status

Method basis: course PDFs in `07_mechatronics_engineering_master_program/01_Optimal-Design-For-Mechatronic-Systems/03_resources/`: `03_chap_2_mechatronic-system-design-techniques.pdf` (AD), `04_chap_3_mechatronic-system-design-techniques_02.pdf` (TRIZ), `01_AXIOMATIC-DESIGN/01_Modular-Platform-Design-for-Mechatronic-Systems-using-Axiomatic-Design-and-Mechatronic-Function-Modules.pdf`, `01_AXIOMATIC-DESIGN/02_An-Engineering-Systems-Introduction-to-Axiomatic-Design.pdf`, and `02_TRIZ/Applications of TRIZ and Axiomatic Design a Comparison to Deduce Best Practices in Industry.pdf`. This document records **proposed architecture and validation work**, not hardware test results.
