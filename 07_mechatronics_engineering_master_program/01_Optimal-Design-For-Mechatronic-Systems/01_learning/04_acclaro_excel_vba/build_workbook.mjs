import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputPath = process.argv[2];
if (!outputPath) throw new Error("Usage: node build_workbook.mjs <output.xlsx>");

const workbook = Workbook.create();
const dashboard = workbook.worksheets.add("Dashboard");
const readme = workbook.worksheets.add("ReadMe");
const model = workbook.worksheets.add("CN-FR-DP");
const matrix = workbook.worksheets.add("Design Matrix");
const information = workbook.worksheets.add("Information");
const tree = workbook.worksheets.add("Tree View");
const constraints = workbook.worksheets.add("Constraints");
const impact = workbook.worksheets.add("Impact");
const checks = workbook.worksheets.add("Checks");
const changeLog = workbook.worksheets.add("Change Log");
const lists = workbook.worksheets.add("Lists");

const colors = {
  navy: "#1F4E79",
  blue: "#D9EAF7",
  lightBlue: "#EAF3F8",
  green: "#E2F0D9",
  amber: "#FFF2CC",
  red: "#FCE4D6",
  gray: "#E7E6E6",
  lightGray: "#F5F6F7",
  dark: "#1F1F1F",
  white: "#FFFFFF",
};
const fontName = "Arial";

for (const ws of [dashboard, readme, model, matrix, information, tree, constraints, impact, checks, changeLog, lists]) {
  ws.showGridLines = false;
  ws.getRange("A1:BD250").format.font = { name: fontName, size: 10, color: colors.dark };
  ws.getRange("A1:BD250").format.verticalAlignment = "center";
}

function setTitle(ws, title, subtitle, lastCol = "H") {
  ws.getRange(`A2:${lastCol}2`).merge();
  ws.getRange("A2").values = [[title]];
  ws.getRange("A2").format.font = { name: fontName, size: 16, bold: true, color: colors.navy };
  ws.getRange(`A3:${lastCol}3`).merge();
  ws.getRange("A3").values = [[subtitle]];
  ws.getRange("A3").format.font = { name: fontName, size: 10, italic: true, color: "#666666" };
  ws.getRange(`A3:${lastCol}3`).format.borders = { bottom: { style: "thin", color: colors.navy } };
}

function styleHeader(range) {
  range.format = {
    fill: colors.navy,
    font: { name: fontName, size: 10, bold: true, color: colors.white },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "inside", style: "thin", color: colors.white },
  };
}

function styleInput(range) {
  range.format.fill = colors.amber;
  range.format.borders = { preset: "outside", style: "thin", color: "#D6B656" };
}

setTitle(dashboard, "Axiomatic Design Workbook", "Excel + VBA base toolkit for CN, FR, DP, coupling, information content, and controlled change", "H");
dashboard.tabColor = colors.navy;
dashboard.getRange("A5:B14").values = [
  ["Model rows", null],
  ["Constraints", null],
  ["Matrix FR/DP pairs", null],
  ["Independence classification", "Coupled"],
  ["Design sequence", "Cycle detected - redesign or decompose"],
  ["Total information content (bits)", null],
  ["Consistency errors", 0],
  ["Consistency warnings", 0],
  ["Logged changes", 0],
  ["Workbook version", "1.0.0"],
];
dashboard.getRange("B5").formulas = [["=COUNTA('CN-FR-DP'!$E$5:$E$104)"]];
dashboard.getRange("B6").formulas = [["=COUNTA(Constraints!$A$5:$A$104)"]];
dashboard.getRange("B7").formulas = [["=COUNTA('Design Matrix'!$A$5:$A$54)"]];
dashboard.getRange("B10").formulas = [["=SUM(Information!$N$5:$N$54)"]];
dashboard.getRange("A5:A14").format = { fill: colors.blue, font: { name: fontName, bold: true, color: colors.dark } };
dashboard.getRange("B5:B14").format = { fill: colors.lightGray, font: { name: fontName, bold: true, color: colors.dark } };
dashboard.getRange("A5:B14").format.borders = { preset: "outside", style: "thin", color: "#B4C6E7" };
dashboard.getRange("B10").format.numberFormat = "0.000";
dashboard.getRange("D5:H12").values = [
  ["Workflow", "Purpose", "Input", "Output", "Action"],
  ["1. Define", "Capture CN, FR, DP, ranges, and constraints", "CN-FR-DP", "Stable source model", "Edit yellow cells"],
  ["2. Decompose", "Link parent FR/DP pairs and zig-zag", "Parent IDs", "Tree View", "Refresh model"],
  ["3. Analyze", "Evaluate independence and sequence", "Secondary DP IDs", "Design Matrix", "Refresh model"],
  ["4. Quantify", "Estimate probability and information", "Design/system ranges", "Information", "Review TBC inputs"],
  ["5. Check", "Find structural inconsistencies", "All model tables", "Checks", "Run checks"],
  ["6. Change", "Review affected items", "FR or DP ID", "Impact", "Change impact"],
  ["7. Baseline", "Keep a recoverable version", "Current workbook", "Snapshot copy", "Save snapshot"],
];
styleHeader(dashboard.getRange("D5:H5"));
dashboard.getRange("D6:H12").format.borders = { insideHorizontal: { style: "thin", color: "#D9E2F3" }, bottom: { style: "thin", color: "#D9E2F3" } };
dashboard.getRange("D6:D12").format.font = { name: fontName, bold: true, color: colors.navy };
dashboard.getRange("D14:H16").merge();
dashboard.getRange("D14").values = [["Enable macros when opening the .xlsm file. Use Refresh model after changing CN/FR/DP records. Yellow cells are intended inputs. Values marked TBC require research or engineering validation."]];
dashboard.getRange("D14:H16").format = { fill: colors.amber, wrapText: true, verticalAlignment: "top", borders: { preset: "outside", style: "thin", color: "#D6B656" } };
dashboard.getRange("A:A").format.columnWidth = 30;
dashboard.getRange("B:B").format.columnWidth = 42;
dashboard.getRange("C:C").format.columnWidth = 3;
dashboard.getRange("D:D").format.columnWidth = 18;
dashboard.getRange("E:E").format.columnWidth = 37;
dashboard.getRange("F:F").format.columnWidth = 22;
dashboard.getRange("G:G").format.columnWidth = 22;
dashboard.getRange("H:H").format.columnWidth = 20;

setTitle(readme, "How to use this workbook", "The source table drives every generated analysis view", "D");
readme.tabColor = "#7F8C8D";
readme.getRange("A5:C13").values = [
  ["Step", "What to do", "Important rule"],
  ["1", "Edit or add rows in CN-FR-DP.", "Customer Needs stay in customer language. FRs state what; DPs state how."],
  ["2", "Use stable IDs and parent IDs for decomposition.", "Do not mix a decomposed parent and its children in one matrix level. Mark the parent Decomposed."],
  ["3", "List secondary DP IDs separated by commas.", "One principal DP is the row's DP ID. Secondary links represent coupling."],
  ["4", "Enter design and system range limits when known.", "Use the same unit and orientation for both ranges. Leave both limits blank when TBC."],
  ["5", "Run Refresh model.", "The macro rebuilds the matrix and tree, runs checks, and updates the dashboard."],
  ["6", "Review Design Matrix and Information.", "Uncoupled is diagonal. Decoupled is triangular. Coupled needs redesign or further decomposition."],
  ["7", "Run Change impact before approving a change.", "The report finds direct children and secondary DP interactions; reviewers still make the decision."],
  ["8", "Create a snapshot before a baseline or major revision.", "Snapshots are full workbook copies in a versions folder."],
];
styleHeader(readme.getRange("A5:C5"));
readme.getRange("A6:C13").format.wrapText = true;
readme.getRange("A6:C13").format.borders = { insideHorizontal: { style: "thin", color: "#D9E2F3" } };
readme.getRange("A15:D22").values = [
  ["Feature", "v1 status", "Method", "Limit"],
  ["CN/FR/DP and constraints", "Implemented", "Source tables", "Manual authoring"],
  ["Independence Axiom", "Implemented", "Generated square matrix", "50 active pairs"],
  ["Hierarchy and zig-zagging", "Implemented", "Parent IDs and tree", "Text tree, not a diagram canvas"],
  ["Information Axiom", "Implemented", "Uniform interval approximation", "Replace with measured distributions when available"],
  ["Consistency and propagation", "Implemented", "Rule checks and impact report", "Review support, not automatic approval"],
  ["History/versioning", "Basic", "Audit log and full snapshots", "No semantic merge"],
  ["Multi-user collaboration", "Out of scope", "Use a shared source model later", "VBA event history is not coauthoring-safe"],
];
styleHeader(readme.getRange("A15:D15"));
readme.getRange("A16:D22").format.wrapText = true;
readme.getRange("A16:D22").format.borders = { insideHorizontal: { style: "thin", color: "#D9E2F3" } };
readme.getRange("A24:D27").values = [
  ["Information Axiom convention", "Design range", "System range", "Common range"],
  ["Meaning", "Expected output interval", "Acceptable interval", "Overlap of the two intervals"],
  ["Probability", "Common range / design range", "", "Uniform-distribution screening assumption"],
  ["Information", "-log2(probability)", "", "0 bits is best; no overlap is infinite information"],
];
styleHeader(readme.getRange("A24:D24"));
readme.getRange("A25:D27").format.wrapText = true;
readme.getRange("A:A").format.columnWidth = 15;
readme.getRange("B:B").format.columnWidth = 43;
readme.getRange("C:C").format.columnWidth = 54;
readme.getRange("D:D").format.columnWidth = 48;

setTitle(model, "CN - FR - DP source model", "Example: modular AI desk clock. Replace the content while preserving IDs and columns.", "T");
model.tabColor = "#5B9BD5";
const modelHeaders = ["Level", "CN ID", "Customer Need", "Priority", "FR ID", "Parent FR ID", "Functional Requirement", "Design Low", "Design High", "Unit", "DP ID", "Parent DP ID", "Design Parameter", "Secondary DP IDs", "System Low", "System High", "Constraint IDs", "Verification", "Owner", "Status"];
const modelRows = [
  [1, "CN1", "I can understand time, status, and assistant responses at a glance.", "Must", "FR1", "", "Present time, system state, and assistant output visually.", null, null, "TBC", "DP1", "", "Front visual-interaction subsystem with display control and dimming.", "DP4, DP5, DP6, DP8", null, null, "", "Readability, viewing-angle, refresh-latency, and touch-response tests.", "", "Draft"],
  [1, "CN2", "I can interact naturally by touch, voice, or visible gestures.", "Must", "FR2", "", "Acquire deliberate user commands through supported interaction modes.", null, null, "TBC", "DP2", "", "Coordinated touch, audio-input, and visual-input subsystems.", "DP4, DP5, DP6, DP8, DP9", null, null, "", "Scenario tests for every enabled input mode.", "", "Decomposed"],
  [2, "CN2", "I can interact naturally by touch, voice, or visible gestures.", "Must", "FR2.1", "FR2", "Detect intentional direct-contact commands.", null, null, "TBC", "DP2.1", "DP2", "Capacitive touch sensor and local touch controller.", "DP1, DP4, DP5, DP6, DP8", null, null, "", "Touch activation, false-input, and latency tests.", "", "Draft"],
  [2, "CN2", "I can interact naturally by touch, voice, or visible gestures.", "Must", "FR2.2", "FR2", "Capture speech in the intended desk interaction zone.", null, null, "TBC", "DP2.2", "DP2", "Microphone subsystem with local audio capture and wake management.", "DP4, DP5, DP6, DP8, DP9", null, null, "", "Speech capture and false-wake tests under expected noise.", "", "Draft"],
  [2, "CN2", "I can interact naturally by touch, voice, or visible gestures.", "Must", "FR2.3", "FR2", "Capture visual information for approved gesture and context functions.", null, null, "TBC", "DP2.3", "DP2", "Forward camera module with local control and physical shutter.", "DP4, DP5, DP6, DP8, DP9", null, null, "", "Gesture and privacy-state tests under expected lighting.", "", "Draft"],
  [1, "CN3", "I can hear responses clearly without another device.", "Must", "FR3", "", "Deliver intelligible audible responses.", null, null, "TBC", "DP3", "", "Speaker, amplifier, acoustic chamber, and output controller.", "DP4, DP5, DP6, DP8", null, null, "", "SPL, distortion, frequency-response, and listening tests.", "", "Draft"],
  [1, "CN4", "My assistant identity and processing can move to another product.", "Must", "FR4", "", "Execute portable assistant functions and preserve transferable state.", null, null, "TBC", "DP4", "", "Universal core with compute, protected storage, and wireless connectivity.", "DP5, DP6, DP8, DP9", null, null, "C1", "Transfer the core between two reference hosts and verify continuity.", "", "Draft"],
  [1, "CN5", "Moving the core between products is quick, obvious, and safe.", "Must", "FR5", "", "Exchange required power and information between core and host.", null, null, "TBC", "DP5", "", "Keyed rear dock, distribution controller, and positive retention latch.", "DP4, DP6, DP8, DP10", null, null, "C2, C4", "Electrical margin, hot-plug, misalignment, ESD, and cycle tests.", "", "Draft"],
  [1, "CN6", "The clock remains useful while consuming little energy.", "Must", "FR6", "", "Store, convert, distribute, and supervise energy in every state.", null, null, "TBC", "DP6", "", "Replaceable battery, protection, fuel gauge, rails, and power controller.", "DP1, DP2.1, DP2.2, DP2.3, DP3, DP4, DP5, DP7, DP8, DP10", null, null, "C4, C6", "Energy budget, runtime, charging, fault, and thermal tests.", "", "Draft"],
  [1, "CN12", "The design accepts future host modules without replacing the core.", "Should", "FR7", "", "Determine motion, orientation, and relevant ambient conditions.", null, null, "TBC", "DP7", "", "Locally controlled IMU and environmental-sensor subsystem.", "DP4, DP5, DP6, DP8", null, null, "C6", "Orientation, motion-trigger, ambient-light, and sleep-current tests.", "", "Draft"],
  [1, "CN7", "The clock is stable, compact, and balanced on a desk.", "Must", "FR8", "", "Support, align, protect, and orient the product during normal use.", null, null, "TBC", "DP8", "", "Structural carrier, enclosure, matched volumes, and weighted base.", "DP5, DP6, DP10", null, null, "C3, C5, C7, C8", "Tip, drop, vibration, alignment, RF, and thermal tests.", "", "Draft"],
  [1, "CN8", "I remain in control of the camera and microphone.", "Must", "FR9", "", "Prevent or clearly indicate unintended audio and image capture.", null, null, "TBC", "DP9", "", "Camera shutter, microphone disconnect, and capture-status indicator.", "DP2.2, DP2.3, DP4, DP6, DP8", null, null, "C4", "Verify isolation and attempt capture in every privacy state.", "", "Draft"],
  [1, "CN10", "I can replace a battery or failed module without discarding the product.", "Must", "FR10", "", "Permit core removal and module service without product damage.", null, null, "TBC", "DP10", "", "Release mechanism, captive fasteners, replaceable seals, and service sequence.", "DP1, DP2.1, DP2.2, DP2.3, DP3, DP4, DP5, DP6, DP7, DP8, DP9", null, null, "C5, C7", "Timed disassembly, incorrect-assembly, and service-cycle tests.", "", "Draft"],
];
model.getRange("A4:T17").values = [modelHeaders, ...modelRows];
styleHeader(model.getRange("A4:T4"));
model.getRange("A5:T104").format.wrapText = true;
model.getRange("A5:T17").format.borders = { insideHorizontal: { style: "thin", color: "#D9E2F3" } };
styleInput(model.getRange("A5:T104"));
for (const formulaCol of []) void formulaCol;
model.tables.add("A4:T104", true, "tblModel").style = "TableStyleMedium2";
model.getRange("A:A").format.columnWidth = 8;
model.getRange("B:B").format.columnWidth = 10;
model.getRange("C:C").format.columnWidth = 40;
model.getRange("D:D").format.columnWidth = 10;
model.getRange("E:F").format.columnWidth = 12;
model.getRange("G:G").format.columnWidth = 44;
model.getRange("H:I").format.columnWidth = 12;
model.getRange("J:J").format.columnWidth = 11;
model.getRange("K:L").format.columnWidth = 12;
model.getRange("M:M").format.columnWidth = 48;
model.getRange("N:N").format.columnWidth = 34;
model.getRange("O:P").format.columnWidth = 12;
model.getRange("Q:Q").format.columnWidth = 18;
model.getRange("R:R").format.columnWidth = 44;
model.getRange("S:S").format.columnWidth = 16;
model.getRange("T:T").format.columnWidth = 14;
model.freezePanes.freezeRows(4);
model.freezePanes.freezeColumns(2);
model.getRange("D5:D104").dataValidation = { rule: { type: "list", values: ["Must", "Should", "Could", "Won't"] } };
model.getRange("T5:T104").dataValidation = { rule: { type: "list", values: ["Draft", "Review", "Approved", "Decomposed", "Retired"] } };
model.getRange("A5:A104").dataValidation = { rule: { type: "whole", operator: "between", formula1: 0, formula2: 15 } };

setTitle(constraints, "Constraints", "Limits on acceptable solutions; these are not independent functions", "F");
constraints.tabColor = "#A5A5A5";
const constraintRows = [
  ["C1", "Universal core target envelope is 32 x 28 x 8 mm.", "Concept target; stack-up and thermal feasibility TBC.", "Mechanical", "", "Draft"],
  ["C2", "One rear keyed interface is shown with four electrical contacts.", "Contact count is not validated for power, signal, and safety.", "Interface", "", "Draft"],
  ["C3", "Use durable recycled-aluminum-intent metal where feasible.", "Grade, recycled content, coating, and RF windows TBC.", "Material", "", "Draft"],
  ["C4", "Remain safe during charging, battery faults, misalignment, and misuse.", "Applicable standards and test limits TBC.", "Safety", "", "Draft"],
  ["C5", "Host peripherals do not use the removable core as structure.", "Structural carrier remains host-owned.", "Architecture", "", "Draft"],
  ["C6", "Every module supports defined active, idle, and off states.", "Product energy budget and transition timing TBC.", "Energy", "", "Draft"],
  ["C7", "Minimize adhesive where it prevents repair or separation.", "Prefer captive screws, clips, and replaceable gaskets.", "Service", "", "Draft"],
  ["C8", "External geometry remains balanced for desk use.", "Tip-over, viewing angle, and footprint targets TBC.", "Mechanical", "", "Draft"],
  ["C9", "Meet prototype cost ceiling with obtainable components.", "Budget, quantity, and sourcing region TBC.", "Cost", "", "Draft"],
];
constraints.getRange("A4:F104").values = [["Constraint ID", "Constraint", "Current status / range", "Category", "Owner", "State"], ...constraintRows, ...Array.from({ length: 91 }, () => [null, null, null, null, null, null])];
styleHeader(constraints.getRange("A4:F4"));
styleInput(constraints.getRange("A5:F104"));
constraints.tables.add("A4:F104", true, "tblConstraints").style = "TableStyleMedium2";
constraints.getRange("A:A").format.columnWidth = 14;
constraints.getRange("B:B").format.columnWidth = 48;
constraints.getRange("C:C").format.columnWidth = 48;
constraints.getRange("D:D").format.columnWidth = 18;
constraints.getRange("E:E").format.columnWidth = 16;
constraints.getRange("F:F").format.columnWidth = 14;
constraints.getRange("A5:F104").format.wrapText = true;
constraints.getRange("F5:F104").dataValidation = { rule: { type: "list", values: ["Draft", "Review", "Approved", "Retired"] } };
constraints.freezePanes.freezeRows(4);

setTitle(matrix, "Design Matrix", "X = principal DP; triangle = secondary interaction. Refresh model to rebuild from the source table.", "O");
matrix.tabColor = "#4472C4";
matrix.getRange("Q2:R3").values = [["Classification", "Coupled"], ["Design sequence", "Cycle detected - redesign or decompose"]];
matrix.getRange("Q2:Q3").format.font = { name: fontName, bold: true, color: colors.navy };
matrix.getRange("R2:R3").format.fill = colors.lightBlue;
const activeRows = modelRows.filter((r) => !["decomposed", "retired"].includes(String(r[19]).toLowerCase()));
const matrixHeaders = ["FR \\ DP", ...activeRows.map((r) => r[10]), "Principal", "Secondary"];
const matrixValues = activeRows.map((r, i) => {
  const secondary = String(r[13] || "").split(",").map((x) => x.trim());
  const cells = activeRows.map((other, j) => (i === j ? "X" : secondary.includes(other[10]) ? "△" : ""));
  return [r[4], ...cells, cells.filter((x) => x === "X").length, cells.filter((x) => x === "△").length];
});
const matrixEndColIndex = matrixHeaders.length;
function colName(n) {
  let s = "";
  while (n > 0) { n--; s = String.fromCharCode(65 + (n % 26)) + s; n = Math.floor(n / 26); }
  return s;
}
const matrixEndCol = colName(matrixEndColIndex);
matrix.getRange(`A4:${matrixEndCol}${4 + matrixValues.length}`).values = [matrixHeaders, ...matrixValues];
styleHeader(matrix.getRange(`A4:${matrixEndCol}4`));
matrix.getRange(`B5:${colName(activeRows.length + 1)}${4 + activeRows.length}`).format = {
  horizontalAlignment: "center",
  borders: { preset: "all", style: "thin", color: "#D9D9D9" },
};
matrix.getRange(`B5:${colName(activeRows.length + 1)}${4 + activeRows.length}`).conditionalFormats.add("containsText", { text: "X", format: { fill: colors.green, font: { bold: true, color: "#006100" } } });
matrix.getRange(`B5:${colName(activeRows.length + 1)}${4 + activeRows.length}`).conditionalFormats.add("containsText", { text: "△", format: { fill: colors.amber, font: { color: "#9C6500" } } });
matrix.getRange("A:A").format.columnWidth = 14;
matrix.getRange(`B:${colName(activeRows.length + 1)}`).format.columnWidth = 10;
matrix.getRange(`${colName(activeRows.length + 2)}:${matrixEndCol}`).format.columnWidth = 12;
matrix.getRange("Q:Q").format.columnWidth = 20;
matrix.getRange("R:R").format.columnWidth = 42;
matrix.freezePanes.freezeRows(4);
matrix.freezePanes.freezeColumns(1);

setTitle(information, "Information Axiom", "Uniform interval approximation. Enter ranges in CN-FR-DP, then refresh or recalculate.", "O");
information.tabColor = "#70AD47";
const infoHeaders = ["FR ID", "Functional Requirement", "Unit", "Design Low", "Design High", "Design Range", "System Low", "System High", "System Range", "Common Low", "Common High", "Common Range", "Success Probability", "Information Content (bits)", "Result"];
information.getRange("A4:O54").values = [infoHeaders, ...Array.from({ length: 50 }, () => Array(15).fill(null))];
styleHeader(information.getRange("A4:O4"));
for (let row = 5; row <= 54; row++) {
  const modelRow = row;
  information.getRange(`A${row}:E${row}`).formulas = [[
    `=IF('CN-FR-DP'!E${modelRow}="","",'CN-FR-DP'!E${modelRow})`,
    `=IF('CN-FR-DP'!G${modelRow}="","",'CN-FR-DP'!G${modelRow})`,
    `=IF('CN-FR-DP'!J${modelRow}="","",'CN-FR-DP'!J${modelRow})`,
    `=IF('CN-FR-DP'!H${modelRow}="","",'CN-FR-DP'!H${modelRow})`,
    `=IF('CN-FR-DP'!I${modelRow}="","",'CN-FR-DP'!I${modelRow})`,
  ]];
  information.getRange(`F${row}:O${row}`).formulas = [[
    `=IF(OR(D${row}="",E${row}=""),"",MAX(0,E${row}-D${row}))`,
    `=IF('CN-FR-DP'!O${modelRow}="","",'CN-FR-DP'!O${modelRow})`,
    `=IF('CN-FR-DP'!P${modelRow}="","",'CN-FR-DP'!P${modelRow})`,
    `=IF(OR(G${row}="",H${row}=""),"",MAX(0,H${row}-G${row}))`,
    `=IF(OR(D${row}="",E${row}="",G${row}="",H${row}=""),"",MAX(D${row},G${row}))`,
    `=IF(OR(D${row}="",E${row}="",G${row}="",H${row}=""),"",MIN(E${row},H${row}))`,
    `=IF(OR(J${row}="",K${row}=""),"",MAX(0,K${row}-J${row}))`,
    `=IF(OR(F${row}="",L${row}=""),"",IF(F${row}=0,"",L${row}/F${row}))`,
    `=IF(M${row}="","",IF(M${row}=0,"infinite",-LN(M${row})/LN(2)))`,
    `=IF(A${row}="","",IF(OR(D${row}="",E${row}="",G${row}="",H${row}=""),"TBC",IF(M${row}=0,"No overlap",IF(M${row}>=0.999999,"Pass","Partial"))))`,
  ]];
}
information.getRange("D5:N54").format.numberFormat = "0.000";
information.getRange("M5:M54").format.numberFormat = "0.0%";
information.getRange("B5:B54").format.wrapText = true;
information.getRange("5:54").format.rowHeight = 30;
information.getRange("A5:O54").format.borders = { insideHorizontal: { style: "thin", color: "#E7E6E6" } };
information.getRange("O5:O54").conditionalFormats.add("containsText", { text: "No overlap", format: { fill: colors.red, font: { bold: true, color: "#9C0006" } } });
information.getRange("O5:O54").conditionalFormats.add("containsText", { text: "Partial", format: { fill: colors.amber, font: { color: "#9C6500" } } });
information.getRange("A:A").format.columnWidth = 12;
information.getRange("B:B").format.columnWidth = 48;
information.getRange("C:C").format.columnWidth = 12;
information.getRange("D:N").format.columnWidth = 14;
information.getRange("O:O").format.columnWidth = 16;
information.freezePanes.freezeRows(4);
information.freezePanes.freezeColumns(2);

setTitle(tree, "FR / DP hierarchy", "Generated from Level and Parent IDs; decomposed parents stay visible", "H");
tree.tabColor = "#70AD47";
tree.getRange("A4:H17").values = [["Level", "FR ID", "Functional Requirement", "DP ID", "Design Parameter", "Parent FR", "Parent DP", "Status"], ...modelRows.map((r) => [r[0], r[4], r[6], r[10], r[12], r[5], r[11], r[19]])];
styleHeader(tree.getRange("A4:H4"));
tree.getRange("A5:H17").format.borders = { insideHorizontal: { style: "thin", color: "#D9E2F3" } };
tree.getRange("A:A").format.columnWidth = 8;
tree.getRange("B:B").format.columnWidth = 12;
tree.getRange("C:C").format.columnWidth = 48;
tree.getRange("D:D").format.columnWidth = 12;
tree.getRange("E:E").format.columnWidth = 50;
tree.getRange("F:H").format.columnWidth = 14;
tree.getRange("C5:E17").format.wrapText = true;
tree.freezePanes.freezeRows(4);

setTitle(impact, "Change impact", "Run Change impact and enter an FR or DP ID", "F");
impact.tabColor = "#ED7D31";
impact.getRange("A4:B4").values = [["Selected ID", ""]];
impact.getRange("A4").format.font = { name: fontName, bold: true, color: colors.navy };
styleInput(impact.getRange("B4"));
impact.getRange("A6:F6").values = [["FR ID", "Functional Requirement", "DP ID", "Design Parameter", "Impact reason", "Required action"]];
styleHeader(impact.getRange("A6:F6"));
impact.getRange("A:A").format.columnWidth = 12;
impact.getRange("B:B").format.columnWidth = 44;
impact.getRange("C:C").format.columnWidth = 12;
impact.getRange("D:D").format.columnWidth = 46;
impact.getRange("E:E").format.columnWidth = 28;
impact.getRange("F:F").format.columnWidth = 48;
impact.freezePanes.freezeRows(6);

setTitle(checks, "Consistency checks", "Generated checks are terminal review results and do not drive the model", "E");
checks.tabColor = "#ED7D31";
checks.getRange("A4:E5").values = [["Severity", "Item", "Issue", "Required action", "Checked at"], ["OK", "Workbook", "Run checks after editing the model", "Use the Dashboard button", null]];
styleHeader(checks.getRange("A4:E4"));
checks.getRange("A5:E504").format.borders = { insideHorizontal: { style: "thin", color: "#E7E6E6" } };
checks.getRange("A5:A504").conditionalFormats.add("containsText", { text: "Error", format: { fill: colors.red, font: { bold: true, color: "#9C0006" } } });
checks.getRange("A5:A504").conditionalFormats.add("containsText", { text: "Warning", format: { fill: colors.amber, font: { color: "#9C6500" } } });
checks.getRange("A:A").format.columnWidth = 12;
checks.getRange("B:B").format.columnWidth = 18;
checks.getRange("C:C").format.columnWidth = 48;
checks.getRange("D:D").format.columnWidth = 48;
checks.getRange("E:E").format.columnWidth = 20;
checks.getRange("E5:E504").format.numberFormat = "yyyy-mm-dd hh:mm";
checks.freezePanes.freezeRows(4);

setTitle(changeLog, "Change log", "Automatic event log for model, matrix, constraint, and information inputs", "F");
changeLog.tabColor = "#A5A5A5";
changeLog.getRange("A4:F4").values = [["Timestamp", "User", "Sheet", "Cell", "New value", "Review note"]];
styleHeader(changeLog.getRange("A4:F4"));
changeLog.getRange("A:A").format.columnWidth = 20;
changeLog.getRange("B:B").format.columnWidth = 22;
changeLog.getRange("C:C").format.columnWidth = 20;
changeLog.getRange("D:D").format.columnWidth = 12;
changeLog.getRange("E:E").format.columnWidth = 42;
changeLog.getRange("F:F").format.columnWidth = 52;
changeLog.getRange("A5:A1004").format.numberFormat = "yyyy-mm-dd hh:mm:ss";
changeLog.freezePanes.freezeRows(4);

setTitle(lists, "Controlled lists", "Values used by workbook validations and future extensions", "D");
lists.tabColor = "#BFBFBF";
lists.getRange("A4:D10").values = [
  ["Priority", "Status", "Constraint state", "Mapping mark"],
  ["Must", "Draft", "Draft", "X"],
  ["Should", "Review", "Review", "△"],
  ["Could", "Approved", "Approved", ""],
  ["Won't", "Decomposed", "Retired", ""],
  ["", "Retired", "", ""],
  ["", "", "", ""],
];
styleHeader(lists.getRange("A4:D4"));
lists.getRange("A:D").format.columnWidth = 20;

for (const ws of [dashboard, readme, model, matrix, information, tree, constraints, impact, checks, changeLog, lists]) {
  ws.getRange("1:1").format.rowHeight = 10;
  ws.getRange("2:2").format.rowHeight = 24;
  ws.getRange("3:3").format.rowHeight = 22;
}

workbook.recalculate();
await fs.mkdir(path.dirname(outputPath), { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);

const inspectRanges = [
  ["Dashboard", "A2:H16"],
  ["CN-FR-DP", "A2:T17"],
  ["Design Matrix", `A2:${matrixEndCol}${4 + matrixValues.length}`],
  ["Information", "A2:O17"],
  ["Checks", "A2:E8"],
];
for (const [sheetName, range] of inspectRanges) {
  const result = await workbook.inspect({ kind: "table", range: `${sheetName}!${range}`, include: "values,formulas", tableMaxRows: 20, tableMaxCols: 20, maxChars: 7000 });
  console.log(`INSPECT ${sheetName} ${range}`);
  console.log(result.ndjson);
}
const errors = await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!", options: { useRegex: true, maxResults: 300 }, summary: "final formula error scan" });
console.log("FORMULA_ERRORS");
console.log(errors.ndjson);

const previewDir = path.join(path.dirname(outputPath), "previews");
await fs.mkdir(previewDir, { recursive: true });
const renderSpecs = [
  ["Dashboard", "A1:H17"], ["ReadMe", "A1:D28"], ["CN-FR-DP", "A1:T17"],
  ["Design Matrix", `A1:R${4 + matrixValues.length}`], ["Information", "A1:O17"],
  ["Tree View", "A1:H17"], ["Constraints", "A1:F14"], ["Impact", "A1:F14"],
  ["Checks", "A1:E12"], ["Change Log", "A1:F12"], ["Lists", "A1:D10"],
];
for (const [sheetName, range] of renderSpecs) {
  const preview = await workbook.render({ sheetName, range, scale: 1, format: "png" });
  const safeName = sheetName.replace(/[^A-Za-z0-9]+/g, "_").toLowerCase();
  await fs.writeFile(path.join(previewDir, `${safeName}.png`), new Uint8Array(await preview.arrayBuffer()));
}
