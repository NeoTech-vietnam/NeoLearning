# Modular AI Desk Clock — Initial Axiomatic Design

## Scope and assumptions

This is the first Customer Needs (CN) → Functional Requirements (FR) → Design Parameters (DP) decomposition for the desk-clock product. It describes the current concept:

- a slim removable universal AI core mounted in a rear pocket;
- a balanced desk-clock housing with a structural carrier;
- host-specific display, camera, audio, sensor, and battery subsystems;
- repairable construction and replaceable modules.

The values marked **TBC** are design ranges that must be confirmed through user research or engineering tests. Proposed DPs are candidates, not frozen component selections.

## Level 0

| ID | Definition |
| --- | --- |
| CN0 | Provide a calm, useful AI assistant that fits naturally on a desk and lets the user move their personal AI core to other products. |
| FR0 | Provide glanceable information and multimodal AI interaction in a stable desk device while preserving transfer of the user's core. |
| DP0 | A modular desk-clock host built around a rear-docked slim universal core and independently serviceable host peripherals. |

## Customer needs

Customer needs stay in the customer's language. They should not contain components, protocols, or implementation choices.

| CN ID | Customer need | Priority | Translated FRs | Why it matters |
| --- | --- | --- | --- | --- |
| CN1 | I can understand the time, status, and assistant response at a glance. | Must | FR1 | The product must work first as a useful desk clock. |
| CN2 | I can interact naturally by touch, voice, or visible gestures. | Must | FR2.1–FR2.3 | Different situations require different input modes. |
| CN3 | I can hear responses clearly without using another device. | Must | FR3 | The clock should provide complete local interaction. |
| CN4 | My personal AI identity and processing can move to another compatible product. | Must | FR4, FR5 | This is the defining value of the universal core. |
| CN5 | Moving the core between products is quick, obvious, and safe. | Must | FR5, FR10 | Users should not expose or damage electronics during transfer. |
| CN6 | The clock remains useful while consuming little energy. | Must | FR6 and C6 | Energy use affects battery size, heat, and standby behavior. |
| CN7 | The clock is stable, compact, and visually balanced on a desk. | Must | FR8 | The product should not look like modules attached around a hub. |
| CN8 | I remain in control of the camera and microphone. | Must | FR9 | Physical privacy controls create understandable trust. |
| CN9 | The product tolerates normal handling and repeated module changes. | Must | FR8, FR10 | Docking and service operations must not shorten product life unacceptably. |
| CN10 | I can replace the battery or a failed module without discarding the whole product. | Must | FR10 | Repairability reduces cost and waste. |
| CN11 | The product uses durable and environmentally responsible materials. | Should | C3, C7 | Material choices should support long life and recovery. |
| CN12 | The design can accept future host modules without replacing the core. | Should | FR5 | The interface should remain stable as product variants evolve. |

## First-level FR–DP decomposition

FR statements describe **what the design must accomplish** without embedding a specific component. The design range column gives a provisional success condition; final values require validation.

| FR ID | Functional requirement | Provisional design range | DP ID | Proposed design parameter | Verification approach |
| --- | --- | --- | --- | --- | --- |
| FR1 | Present time, system state, and assistant output visually. | Readable in the intended desk viewing range and ambient light; UI response target **TBC**. | DP1 | Front visual-interaction subsystem with touch display, local display controller, and dimming control. | Readability, viewing-angle, refresh-latency, and touch-response tests. |
| FR2 | Acquire deliberate user commands through the supported interaction modes. | Each enabled mode meets its recognition target with controlled false activations; values **TBC**. | DP2 | Coordinated touch, audio-input, and visual-input subsystems, decomposed below. | Scenario tests for touch, voice, and gesture under expected desk conditions. |
| FR3 | Deliver intelligible audible responses to the user. | Intelligibility at intended desk distance without objectionable distortion; SPL range **TBC**. | DP3 | Speaker, amplifier, acoustic chamber, and local audio-output controller. | SPL, distortion, frequency-response, and listening tests. |
| FR4 | Execute portable assistant functions and preserve transferable user state. | Core continues the defined identity/session functions after transfer; boot and handover time **TBC**. | DP4 | Slim universal core containing compute, protected storage, and wireless connectivity. | Transfer the same core between two reference hosts and verify state continuity. |
| FR5 | Exchange required power and information between the core and desk host. | Meet peak power, average power, bandwidth, latency, error-rate, and insertion-life ranges; all **TBC**. | DP5 | Keyed rear docking interface plus host docking/distribution controller and positive retention latch. | Electrical margin, protocol load, hot-plug, misalignment, ESD, and cycle tests. |
| FR6 | Store, convert, distribute, and supervise energy for every operating state. | Meet runtime, charge time, standby loss, temperature, and protection limits; values **TBC**. | DP6 | Replaceable battery pack with charging, protection, fuel-gauge, regulated rails, and power-domain controller. | Power-state energy budget, runtime, charging, fault, and thermal tests. |
| FR7 | Determine device motion, orientation, and relevant ambient conditions. | Meet sampling, accuracy, wake-detection, and standby-power ranges; values **TBC**. | DP7 | Locally controlled IMU and environmental-sensor subsystem. | Calibrated orientation, motion-trigger, ambient-light, and sleep-current tests. |
| FR8 | Support, align, protect, and orient the product during normal desk use. | Remain stable at the specified viewing angle and loads; envelope and tip-over limits **TBC**. | DP8 | Internal structural carrier, matched side volumes, protective enclosure, and centered weighted battery base. | Tip, drop, vibration, alignment, enclosure-load, RF, and thermal tests. |
| FR9 | Prevent or clearly indicate unintended audio and image capture. | Physical disabled state is independently observable and prevents capture; indicator behavior **TBC**. | DP9 | Mechanical camera shutter, hardware microphone disconnect/mute path, and capture-status indicator. | Inspect electrical isolation and attempt capture in every privacy state. |
| FR10 | Permit core removal, module replacement, and battery service without product damage. | Core removal without tools; planned modules accessible with common tools; service time and cycle targets **TBC**. | DP10 | Rear release mechanism, captive fasteners, replaceable seals, connector protection, and documented service sequence. | Timed disassembly, incorrect-assembly, fastener-cycle, and serviceability tests. |

## Decomposition of multimodal input

FR2 is decomposed so that failure or replacement of one input mode does not force redesign of the others.

| FR ID | Functional requirement | DP ID | Proposed design parameter |
| --- | --- | --- | --- |
| FR2.1 | Detect intentional direct contact commands. | DP2.1 | Capacitive touch sensor and local touch controller integrated with the display module. |
| FR2.2 | Capture speech within the intended desk interaction zone. | DP2.2 | Microphone subsystem with acoustic ports, local audio capture, and wake-management support. |
| FR2.3 | Capture visual information needed for approved gesture and context functions. | DP2.3 | Forward camera module with local image control, activity indication, and mechanical shutter. |

## Constraints

Constraints limit acceptable solutions but are not independently satisfied functions.

| Constraint ID | Constraint | Current status |
| --- | --- | --- |
| C1 | Universal core target envelope is 32 × 28 × 8 mm. | Concept target; component, antenna, connector, and thermal stack-up must be verified. |
| C2 | The core uses one rear keyed docking interface; the present concept shows four electrical contacts. | Four contacts are not yet validated against simultaneous power, grounding, signaling, discovery, and safety needs. |
| C3 | Primary enclosure material should be durable recycled-aluminum-intent metal with only necessary polymer/insulating regions. | Material grade, recycled content, coating, RF windows, and end-of-life process are TBC. |
| C4 | The assembled product must be safe under charging, battery fault, connector misalignment, and foreseeable misuse. | Applicable standards and test limits are TBC. |
| C5 | Host peripherals must not depend on the removable core for structural support. | Structural carrier is part of the current architecture. |
| C6 | Every module must support defined active, idle, and off states within a product-level energy budget. | Power budget and state-transition timing are TBC. |
| C7 | Adhesive use should be minimized where it prevents repair or material separation. | Prefer captive screws, clips, replaceable gaskets, and separable material groups. |
| C8 | External geometry must remain balanced and suitable for desk use. | Matched side volumes and centered base are part of the current concept. |
| C9 | The design must meet the prototype cost ceiling and use obtainable components. | Budget, quantity, and sourcing region are TBC. |

## Initial design matrix

`X` means the DP is intended to be the principal means of satisfying the FR. `△` marks a likely secondary interaction that must be reduced, bounded, or explicitly accepted.

| FR \ DP | DP1 Visual | DP2 Input | DP3 Audio out | DP4 Core | DP5 Dock | DP6 Power | DP7 Context sensors | DP8 Structure | DP9 Privacy | DP10 Service |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FR1 Present information | X |  |  | △ | △ | △ |  | △ |  |  |
| FR2 Acquire commands |  | X |  | △ | △ | △ |  | △ | △ |  |
| FR3 Deliver audio |  |  | X | △ | △ | △ |  | △ |  |  |
| FR4 Preserve portable intelligence |  |  |  | X | △ | △ |  | △ | △ |  |
| FR5 Exchange core power/data |  |  |  | △ | X | △ |  | △ |  | △ |
| FR6 Manage energy | △ | △ | △ | △ | △ | X | △ | △ |  | △ |
| FR7 Sense motion/environment |  |  |  | △ | △ | △ | X | △ |  |  |
| FR8 Support/protect/orient |  |  |  |  | △ | △ |  | X |  | △ |
| FR9 Enforce capture privacy |  | △ |  | △ |  | △ |  | △ | X |  |
| FR10 Enable service | △ | △ | △ | △ | △ | △ | △ | △ | △ | X |

The diagonal entries establish intended ownership, but the matrix is currently coupled. FR6 and FR10 interact with nearly every physical subsystem. At the next decomposition level, energy states and service interfaces should be allocated as standard contracts so they constrain each module without forcing one DP to control every FR.

## Decisions required before freezing Level 1

1. Define the desk interaction distance and lighting range.
2. Decide which AI functions must run locally, which may use a phone, and which may use cloud services.
3. Define continuity expectations when moving the core between products.
4. Establish peak/average power, desired unplugged runtime, and charge-time targets.
5. Determine the required camera resolution, frame rate, and on-device vision workload.
6. Define audio range, background-noise conditions, and privacy behavior.
7. Validate whether four contacts can safely provide the required power and communication architecture.
8. Set core and module insertion-cycle targets, drop conditions, service time, and prototype cost ceiling.
