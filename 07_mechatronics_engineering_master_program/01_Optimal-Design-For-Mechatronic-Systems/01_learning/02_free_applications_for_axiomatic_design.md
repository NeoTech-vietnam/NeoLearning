# Free Applications for Axiomatic Design

## Project context

The Modular AI Desk Clock needs a tool that can record and relate:

- customer needs and constraints;
- hierarchical functional requirements (FRs);
- design parameters (DPs);
- the FR–DP design matrix used to identify uncoupled, decoupled, and coupled designs;
- allocation of the resulting functions to mechatronic function modules;
- verification criteria and later design changes.

The course reference on modular platform design also uses FR decomposition, FR-to-module and generic-function-to-DP matrices, and analysis of dependencies introduced by varying a DP. A suitable tool therefore needs structured decomposition and traceability; drawing alone is insufficient for the complete workflow.

## Recommendation

For one general application that can grow from the desk clock into a modular product family, use **Eclipse Capella as the primary model and source of truth**. Keep the numeric or binary FR×DP design matrix as a generated or manually maintained analysis view until a reliable Capella viewpoint is created for it.

Capella is free, open source, and maintained by the Eclipse Foundation. It supports operational needs, system functions, logical architecture, physical architecture, functional exchanges, scenarios, and function-to-component allocation. This scope is suitable for developing the universal core across a desk clock, robot, watch, and later products. Capella implements the Arcadia method rather than Axiomatic Design, so FR and DP conventions must be defined explicitly in the model.

No mature free application found during this review reproduces all of Acclaro's native Axiomatic Design decomposition and coupling-analysis features. Capella is therefore the general engineering platform, while the AD matrix remains a method-specific analysis within that platform.

### Capella and DSM4Capella are not the same tool

**Capella is the application. DSM4Capella is an optional research workflow that operates on a Capella model through Python4Capella.**

The [DSM4Capella project](https://github.com/labs4capella/DSM4Capella) minimizes coupling when allocating Logical Functions to Logical Components. Its matrix is a square Design Structure Matrix showing relationships within one domain. By contrast, Axiomatic Design uses a design matrix that maps FR rows to DP columns and evaluates whether the mapping is uncoupled, decoupled, or coupled.

DSM4Capella therefore does not replace the Axiomatic Design matrix, FR/DP zigzag decomposition, or the Information Axiom. Its current README also states that only data inputs and outputs are considered, while control values are treated as zero. The accompanying [user guide](https://github.com/labs4capella/DSM4Capella/blob/master/DSM4Capella/User%20guide/Userguide.md) describes a manual Python4Capella/PyDev setup rather than a normal packaged Capella add-on, and the repository publishes no formal releases.

Use DSM4Capella only after the desk-clock Logical Architecture contains stable functions, exchanges, components, and genuine flexibility in function allocation. Treat its result as a candidate architecture, not as proof that the design satisfies the Independence Axiom.

## Compared applications

| Application | Cost and license | Useful capabilities | Limitation for this project | Recommendation |
| --- | --- | --- | --- | --- |
| [Gaphor](https://gaphor.org/) | Free, Apache-2.0 | SysML requirements, blocks, relationships, model tree, documentation export; Windows/macOS/Linux | No native Independence-Axiom or FR×DP coupling analysis | Lighter alternative when Capella is too demanding |
| [LibreOffice Calc](https://www.libreoffice.org/discover/calc/) | Free and open source | FR/DP registers, binary matrices, formulas, filtering, CSV and spreadsheet export | Relationships and decomposition are maintained manually | **Use for the design matrix** |
| [Eclipse Capella](https://mbse-capella.org/) | Free, EPL-2.0 | Strong operational, functional, logical, and physical architecture with allocation and traceability | Implements Arcadia rather than Axiomatic Design; FR×DP conventions must be added | **Use as the long-term general platform** |
| [DSM4Capella](https://github.com/labs4capella/DSM4Capella) | Public research repository; verify its included license and version compatibility before deployment | Optimizes Logical Function allocation using DSM coupling and a genetic algorithm | Experimental workflow, not standalone, not an FR×DP AD matrix, manual Python4Capella setup, no packaged releases | Optional later experiment |
| [diagrams.net](https://www.drawio.com/) | Free; browser and desktop editions | Fast FR/DP trees, system diagrams, offline editing, common image/PDF exports | No enforced traceability or coupling analysis | Use only for presentation diagrams |
| [DSMEditor](https://github.com/ajcarney/DSMEditor) | Free, MIT | Asymmetric and multi-domain DSMs, propagation analysis, clustering, CSV/Excel/PNG export | Does not manage the full AD lifecycle or requirement hierarchy | Optional dependency-analysis companion |
| [Cambridge Advanced Modeller](https://camtoolkit.eng.cam.ac.uk/download-overview) | Free for research, teaching, and evaluation | Hierarchical DSM algorithms, modularity and structural metrics, spreadsheet exchange | Commercial use has separate conditions; not an AD requirements workspace | Useful for academic dependency studies |
| [Acclaro DFSS](https://www.axiomaticdesign.com/software/) | Commercial; demo by request | Purpose-built FR/DP decomposition, design matrices, coupling analysis, impact assessment and change history | [Official pricing](https://www.axiomaticdesign.com/pricing/) lists paid permanent licenses; free student access is limited to sponsored courses | Use only if the university provides a sponsored license |

## Suggested desk-clock workspace

Create one Capella model using these Arcadia layers and AD conventions:

1. **Operational Analysis** — users, desk environment, interaction scenarios, charging, maintenance, core removal, and product switching.
2. **System Analysis** — solution-neutral FRs such as “present information,” “capture user input,” “exchange data with the removable core,” and “provide stored energy.”
3. **Logical Architecture** — candidate DPs and logical components for the core interface, display, audio, sensing, power, and structural carrier.
4. **Physical Architecture** — actual universal core, docking board, display, camera, speaker/microphones, sensor module, battery base, enclosure, and their interfaces.
5. **Requirements and verification** — power, communication, thermal limits, retention force, removal cycles, disassembly, and acceptance tests.

Keep the corresponding matrix in `axiomatic-design-matrix.csv`, using FR identifiers as rows and DP identifiers as columns. Use `X` for a meaningful dependency and `0` for no dependency. Reorder rows and columns to reveal whether the design is diagonal, triangular, or coupled. Commit both the Gaphor model and CSV so design decisions evolve with the repository.

## Decision

Use **Capella as the one primary application** and model repository. Maintain the AD FR×DP matrix as an analysis view linked by stable identifiers. Add DSM4Capella only after the Logical Architecture is populated, its version compatibility is verified, and automated function allocation provides clear value.
