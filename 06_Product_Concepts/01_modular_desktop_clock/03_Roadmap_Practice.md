# Product-owner roadmap practice

Use the roadmap’s hypothetical assumptions only. Show units; distinguish arithmetic from evidence. Answer every question before checking `04_Roadmap_Practice_Answers.md`.

## A. Product and learning decisions

1. A user likes a clock, but gives no reason to carry a removable core between hosts. What evidence would you gather before investing in portability? Name two alternatives.
2. Which decisions belong to the product owner, and which need specialist review? Give two examples of each.
3. The university calendar and course syllabi are unreadable/unavailable. What may you safely claim about the five-course mapping? What must remain unknown?
4. The illustrative plan totals 720 active hours. At 6 hours/week, how many active weeks are needed? Why is this not a guaranteed calendar duration?
5. For each requirement family, name a relevant phase: FR1 clock/readability; FR4 portable state; FR6 energy; FR9 privacy; C2 four contacts; C7 serviceable materials.

## B. Contribution and cloud cost

Assume net receipt = 100 currency units; landed hardware = 45; warranty/support = 10; expected cloud subsidy = 12. Ignore NRE, tax and fixed overhead.
6. Calculate contribution per unit. State what is excluded.
7. At 100 requests/day and 0.002 units/request, calculate 30-day cloud cost. How long does a 12-unit reserve last at this usage? Name one policy that limits heavy-user exposure without disabling the local clock.

## C. Energy and runtime

Assume nominal battery voltage 3.7 V, capacity 2 Ah, usable fraction 0.8, average battery-input load 0.8 W.
8. Calculate idealized usable energy in Wh and idealized runtime in hours.
9. Is this a runtime promise? Name two measurements or conditions needed before making one.

## D. Data rates and interface feasibility

Assume mono PCM at 16,000 samples/s and 16 bits/sample. Camera example: 320×240 RGB565, 10 frames/s, 2 bytes/pixel.
10. Calculate PCM bit rate before overhead.
11. Calculate one RGB565 frame size in bytes and camera stream rate in Mbit/s. Calculate combined stream rate before overhead.
12. Do these calculations prove a four-contact dock can carry the streams? What evidence is missing?

## E. Owner decision

13. A shutter blocks the camera lens, but firmware still powers microphones. Is privacy fully protected? State a safer acceptance check.
14. Choose a next-7-days action: user discovery, instrumented clock, portability proof, or packaging. State the hypothesis, smallest test, evidence to capture, and stop/pivot condition. Avoid claiming an unapproved numeric threshold.