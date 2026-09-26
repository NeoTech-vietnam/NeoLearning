# Axiomatic Design Excel + VBA Toolkit

This folder contains the maintainable source for a macro-enabled Excel workbook
that covers the practical core of an Acclaro-like Axiomatic Design workflow.
The workbook is a learning and early-design tool, not a drop-in replacement for
commercial DFSS/MBSE software.

## Release scope

The v1 workbook provides:

- one source table for Customer Needs (CN), Functional Requirements (FR),
  Design Parameters (DP), parent links, ranges, constraints, verification, and
  status;
- a generated FR x DP design matrix using `X` for principal ownership and a
  triangle mark for secondary interaction;
- Independence Axiom classification as uncoupled, decoupled, or coupled;
- a proposed design sequence when the dependency graph is acyclic;
- hierarchical FR/DP tree generation;
- Information Axiom calculations using design, system, and common ranges;
- consistency checks for duplicate IDs, missing definitions, invalid ranges,
  missing parents, and unresolved DP references;
- change-impact analysis from a selected FR or DP;
- a timestamped audit log and full-workbook version snapshots;
- a populated modular desk-clock example that can be replaced with another
  project.

## Workbook files

The generated `.xlsm` workbook is delivered in the conversation output folder.
Its VBA source remains readable here:

- `vba/modAxiomaticDesign.bas` - matrix, hierarchy, information, impact, and
  version functions;
- `vba/modChecks.bas` - consistency validation;
- `vba/modEventBootstrap.bas` and `vba/CAppEvents.cls` - workbook startup and
  change events without requiring access to the host document module;
- `build_workbook.mjs` - workbook structure, example data, formulas, and style;
- `package_xlsm.ps1` - compiles the VBA project and packages the final `.xlsm`.

## Calculation convention

For each FR, the workbook treats the design result as uniformly distributed
over the entered design range. The common range is the overlap of the design
range and the acceptable system range. Therefore:

`probability of success = common range / design range`

`information content = -log2(probability of success)`

This interval approximation is suitable for screening. Replace it with a
validated distribution or test data when the real process behavior is known.

## Development plan

### Phase 1 - MVP implemented here

1. Establish the single source table and stable IDs.
2. Generate the matrix and hierarchy from that source.
3. Implement Independence and Information Axiom analysis.
4. Add consistency checks, impact analysis, logging, and snapshots.
5. Verify formulas, VBA compilation, representative edits, and visual layout.

### Phase 2 - recommended next

1. Add controlled import/export to Capella-compatible CSV mappings.
2. Add configurable probability distributions and measured capability data.
3. Add matrix filters and pagination for 50-200 FR/DP pairs.
4. Add release baselines and comparison reports between snapshots.

### Phase 3 - only if needed

1. Move the model source of truth to a database or MBSE tool.
2. Keep Excel as an analysis/export client.
3. Add role-based collaboration outside VBA; Excel/VBA is not a reliable
   multi-user model repository.

## Known limits

- The matrix builder is intentionally limited to 50 active FR/DP pairs.
- Change propagation reports candidates for review; it does not automatically
  approve or rewrite requirements.
- Version snapshots are full workbook copies, not semantic merges.
- Excel coauthoring can conflict with macros and event-based history. Use one
  editor at a time or move the source model to a collaborative system.
- Inputs inherited from the desk-clock concept remain TBC until validated.

## First use

1. Open the delivered `.xlsm` in desktop Excel.
2. Choose **Enable Content** if Excel shows the macro security banner.
3. Click **Refresh model** on the Dashboard.
4. Edit the yellow cells in `CN-FR-DP`, then refresh again.

If an organization policy disables all unsigned macros, the formulas and source
tables still work, but the generated views will not refresh until the VBA
project is trusted or signed.
