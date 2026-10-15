# Process, traceability, and knowledge

Apply a V-model iteratively to each increment. Plan checks while writing requirements and designs; run analysis, review, and simulation early. Verification evaluates a specified requirement. Validation evaluates the intended use and user need.

## Profiles

| Profile | Required engineering coverage |
| --- | --- |
| Basic | Requirements, bounded tasks, checks, evidence, independent review, work records |
| Software | Basic plus architecture, interfaces, unit/integration/system coverage, release configuration |
| Embedded | Software plus software/hardware allocation, hardware-software interfaces, board/BOM/firmware configuration, measurement conditions |

Choose the profile for the project's actual risks and deliverables. Record a reason for each non-applicable item. Combining roles is allowed; review must be a separate invocation from implementation.

## Process mapping

The following mapping provides navigational guidance to Automotive SPICE 4.1. Read the official process outcomes when performing an assessment. These templates and checks do not establish an ASPICE capability rating.

| Engineering activity | Verification counterpart | Process references |
| --- | --- | --- |
| Stakeholder needs and intended use | Acceptance and validation | SYS.1, VAL.1 |
| System requirements | System verification | SYS.2, SYS.5 |
| System architecture and interfaces | System integration verification | SYS.3, SYS.4 |
| Software requirements, architecture, and unit design | Unit, component integration, and software verification | SWE.1-SWE.6 |
| Hardware requirements and design | Hardware verification | HWE.1-HWE.4 |

Configuration management, change/problem handling, project management, and quality assurance are cross-cutting responsibilities. Their evidence lives in configuration baselines, change/problem records, task state, and review records.

| Cross-cutting activity | Process reference | VeryThinker records and responsible roles |
| --- | --- | --- |
| Quality assurance | SUP.1 | Independent reviews, unresolved findings, gate reports; reviewer and manager |
| Configuration management | SUP.8 | Version/hash locks, Git/workspace baselines, board/BOM/firmware identifiers, release records; release engineer |
| Problem resolution | SUP.9 | Problem records, failure evidence, corrective tasks and closure review; verifier and component owner |
| Change request management | SUP.10 | Change records, impact queries, owner decisions and baseline reassessment; manager and requirements engineer |
| Project management | MAN.3 | Scope, owners, dependencies, bounded assignments, blockers and integration decisions; manager |
| Risk management | MAN.5 | Assumptions, risk/limitation sections, escalation and verification strategy; architect and manager |
| Measurement | MAN.6 | Defined evaluation metrics, actual run results and unavailable observations; verifier and release engineer |

These references identify relevant processes. They do not assert that templates alone fulfill every base practice or outcome.

Sources: [VDA publications](https://vda-qmc.de/en/automotive-spice/automotive-spice-veroeffentlichungen/), [Automotive SPICE 4.1 PAM](https://vda-qmc.de/wp-content/uploads/2026/09/Automotive-SPICE-PAM-v41.pdf), [NASA product realization](https://www.nasa.gov/reference/5-0-product-realization/).

## Traceability

Maintain `Requirement <-> Design <-> Implementation <-> Check <-> Evidence <-> Review`. Tasks link the implementation artifacts and engineering records they satisfy. Store a relationship once; the query layer supplies its reverse view. A Git commit identifies a source baseline; a build artifact or schematic revision identifies the relevant engineering output.

Use stable IDs when referencing records. Keep structured metadata consistent with the body's meaning. Record creation and update commands maintain the index; direct database changes are outside the supported workflow.

## Gates

| Gate | Completion criterion |
| --- | --- |
| Ready | Requirements and acceptance criteria are measurable; dependencies, allowed scope, checks, and baseline are recorded. |
| Design ready | Applicable interfaces, allocations, decisions, and verification approach have been reviewed. |
| Verified | Required checks passed on the relevant revision and configuration; evidence records actual results and limitations. |
| Accepted | Applicable traceability is complete, review findings have dispositions, and intended-use acceptance or an owner-approved exception is recorded. |

Automated validation checks record integrity and available evidence. The responsible owner still evaluates whether the evidence is sufficient for the engineering claim. Record exceptions with approver, reason, affected criterion, and remaining limitation as reviewed changes to the requirement baseline. Reassess affected designs and run checks against that revised baseline. An exception does not bypass missing or mismatched execution evidence.

## Evidence and change impact

Evidence identifies the check, result, timestamp, source revision, execution environment, tool versions, logs, and limitations. Label the method as automated test, analysis, inspection, simulation, bench measurement, HIL, or manual acceptance. Embedded results additionally identify board, BOM, firmware, and measurement configuration where applicable.

Keep historical evidence tied to its original baseline. Changing a requirement or interface requires downstream reassessment. Use `trace` impact queries to find candidates and document which designs, implementations, checks, and evidence need updating. Apply evidence to a new baseline only after confirming the affected inputs remain valid.

## Work records and knowledge

Every completed or interrupted assignment writes these sections:

1. Objective
2. Inputs and Sources
3. Decisions and Rationale
4. Results
5. Evidence
6. Limitations
7. Lessons

Core task submission stores the substantive seven-section body as a knowledge record with `kind: work-record`, linked to its originating task and invocation. Role history is a view of these records, avoiding separate contradictory journals. Required project documentation is an assignment deliverable and part of the reviewed baseline.

Promote knowledge through `Work Record -> Project Lesson -> Generalized Candidate -> Review -> Upstream PR -> Human Approval -> Versioned Pack`. A candidate contains the generalized lesson, provenance, applicability, assumptions, limitations, and verification status. Inspect it for project-specific data before creating an upstream proposal. The manager automatically creates the independently reviewed draft PR when `.verythinker/automation.json` enables submission; human approval applies to merging shared knowledge. Read `manager.md` for automatic closure and external-blocker handling.

Install compatible packs at recorded versions and hashes. Similarity finds candidates; applicability and assumptions decide reuse. Record conflicts with project requirements and their disposition. Reassess a lesson when its source revision, environment, or applicability changes.

## Evaluation

Compare one strong agent, a coordinator with same-model workers, and a strong coordinator with tiered workers using identical requirements, tools, and checks. Measure acceptance, elapsed time, retries, escalations, escaped defects, human correction effort, and observed cost/quota. Mark missing observations `unavailable`. Choose routing by demonstrated outcomes for that task category.
