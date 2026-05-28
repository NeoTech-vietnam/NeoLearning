# Cornell Notes

## Topic: Can_GeneralTypes Configuration

## Date: 28/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- What is the `<AUTOSAR>` root element? Which spec defines it?
- How do you read the `xsi:schemaLocation` to identify the AUTOSAR version?
- What does `<ADMIN-DATA>` contain and when is it required?
- What is `<AR-PACKAGE>` and its `<CATEGORY>`?
- What does `<COMPU-METHOD>` do? What category values exist?
- What does `TEXTTABLE` mean on a `COMPU-METHOD`?
- What is the role of `<COMPU-SCALE>`, `<LOWER-LIMIT>`, `<UPPER-LIMIT>`, `<COMPU-CONST>`, `<VT>`?
- What is `<IMPLEMENTATION-DATA-TYPE>` and its category values (VALUE / STRUCTURE / DATA_REFERENCE)?
- What does `<SW-DATA-DEF-PROPS>` contain?
- What does `<TYPE-EMITTER>HEADER_FILE</TYPE-EMITTER>` mean?

---

### Notes Section (Main Notes)

### Defined AUTOSAR Tags
*(from `Can_GeneralTypes.arxml` — tags that are NOT ECUC-specific; globally defined across all AUTOSAR ARXML files)*

#### Global File Structure (Generic Structure Template + AutosarTopLevelStructure)

> Normative source: `AUTOSAR_CP_TPS_SoftwareComponentTemplate` Doc ID 62, R24-11, Appendix E — UML classes `AUTOSAR`, `ARPackage`, `AdminData` from packages `M2::AUTOSARTemplates::AutosarTopLevelStructure` and `M2::MSR::AsamHdo::AdminData`

##### XML Prologue

| Tag / Declaration                                                                           | Domain              | Meaning                                                                                                                                                             |
| ------------------------------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<?xml version="1.0" encoding="UTF-8"?>`                                                    | XML Standard (W3C)  | Standard XML processing instruction. Not AUTOSAR-specific. Declares XML version 1.0 and UTF-8 character encoding. Required in every `.arxml` file.                  |
| `<AUTOSAR xmlns="http://autosar.org/schema/r4.0" xmlns:xsi="..." xsi:schemaLocation="...">` | UML class `AUTOSAR` | Root element of every ARXML file. `xmlns` binds the default namespace to the AUTOSAR R4 schema. `xsi:schemaLocation` names the actual XSD file used for validation. |

> **Version identification via `xsi:schemaLocation`:**
> | Schema filename | AUTOSAR release |
> |---|---|
> | `autosar_4-2-2.xsd` | R4.2.2 (Classic Platform, schema era) |
> | `AUTOSAR_00048.xsd` | R24-11 (current, schema revision 48) |
> | `AUTOSAR_4-1-1.xsd`, `AUTOSAR_4-2-1.xsd`, ... | Intermediate R4.x releases |
>
> The **schema filename in `xsi:schemaLocation`** is the primary indicator of which AUTOSAR release an ARXML file was generated for.

---

##### Root Element — `<AUTOSAR>`

| UML Class | Package                                          | Role                                                                                                                                          |
| --------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `AUTOSAR` | `M2::AUTOSARTemplates::AutosarTopLevelStructure` | Single root element. Aggregates `<ADMIN-DATA>` (0..1), `<AR-PACKAGES>` (0..*), `<FILE-INFO-COMMENT>` (0..1). Tagged `xml.globalElement=true`. |

---

##### Administrative Data — `<ADMIN-DATA>`

| Tag                                                      | UML Class / Attribute                       | Meaning                                                                                                                          |
| -------------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `<ADMIN-DATA>`                                           | `AdminData` (`M2::MSR::AsamHdo::AdminData`) | Meta-data header for a file or individual model element. Required at file level for every ECUC Param Def XML `[TPS_ECUC_06004]`. |
| `<LANGUAGE>EN`                                           | `AdminData.language`                        | Master (authoritative) language of the document.                                                                                 |
| `<USED-LANGUAGES>` / `<L-10 L="EN" xml:space="default">` | `AdminData.usedLanguages`                   | Lists all languages present in the document. `L-10` is a plain-text string per language.                                         |
| `<DOC-REVISIONS>` / `<DOC-REVISION>`                     | `AdminData.docRevision`                     | Ordered revision history (descending by date). First entry = current version.                                                    |
| `<REVISION-LABEL>`                                       | `DocRevision.revisionLabel`                 | Version string (e.g. `4.2.2`, `2.3.1`).                                                                                          |
| `<ISSUED-BY>`                                            | `DocRevision.issuedBy`                      | Issuing organization (e.g. `AUTOSAR`, `VendorX`, `BOSCH`).                                                                       |
| `<DATE>`                                                 | `DocRevision.date`                          | ISO-8601 date of the revision.                                                                                                   |
---

##### Package Hierarchy — `<AR-PACKAGES>` / `<AR-PACKAGE>`

| Tag                        | UML Class                | Meaning                                                                                                                                                                                                                        |
| -------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `<AR-PACKAGES>`            | (wrapper)                | Container for a list of `ARPackage` elements.                                                                                                                                                                                  |
| `<AR-PACKAGE>`             | `ARPackage`              | Namespace/folder for AUTOSAR model elements. Supports unlimited nesting via child `<AR-PACKAGES>`. Each has `<SHORT-NAME>` (forms part of the ARXML path), optional `<CATEGORY>`, `<ELEMENTS>`.                                |
| `<ELEMENTS>`               | `ARPackage.element`      | Contains `PackageableElement` instances (e.g. `COMPU-METHOD`, `IMPLEMENTATION-DATA-TYPE`).                                                                                                                                     |
| `<CATEGORY>` on AR-PACKAGE | `Categorizable.category` | Free-form string classifying the package. Well-known values: `STANDARD`, `BLUEPRINT`, `EXAMPLE`, `VENDOR_SPECIFIC_MODULE_DEFINITION`. **Not an ECUC tag** — applies to packages, data types, and many other elements globally. |

---

##### CompuMethod Tags (`<COMPU-METHOD>`)

> Normative source: `AUTOSAR_CP_TPS_SoftwareComponentTemplate` Doc ID 62, R24-11, §5.5 "CompuMethod"  
> Purpose: Maps an internal (binary/integer) representation to a physical (engineering/symbolic) value or vice versa. Always referenced by a data type via `<COMPU-METHOD-REF>`.

| Tag                                    | UML Class / Attribute   | Meaning                                                                                                                                                                                                                                                                  |
| -------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `<COMPU-METHOD>`                       | `CompuMethod`           | Defines the value computation for a data type. Must have `<SHORT-NAME>` and `<CATEGORY>`.                                                                                                                                                                                |
| `<CATEGORY>TEXTTABLE</CATEGORY>`       | `CompuMethod.category`  | **Enumeration mapping** — each integer maps to a named text symbol. Used for state types (`Can_ControllerStateType`). Other categories: `IDENTICAL` (pass-through), `LINEAR` (factor+offset), `RAT_FUNC` (rational), `SCALE_LINEAR_AND_TEXTTABLE`, `BITFIELD_TEXTTABLE`. |
| `<COMPU-INTERNAL-TO-PHYS>`             | `CompuInternalToPhys`   | Direction: internal integer → physical value/text. Contains the `<COMPU-SCALES>` list. Counterpart: `<COMPU-PHYS-TO-INTERNAL>`.                                                                                                                                          |
| `<COMPU-SCALES>`                       | wrapper                 | Ordered list of `<COMPU-SCALE>` entries.                                                                                                                                                                                                                                 |
| `<COMPU-SCALE>`                        | `CompuScale`            | Defines one range segment of the computation. Covers `[LOWER-LIMIT, UPPER-LIMIT]`.                                                                                                                                                                                       |
| `<LOWER-LIMIT INTERVAL-TYPE="CLOSED">` | `CompuScale.lowerLimit` | Lower bound of the internal value range. `INTERVAL-TYPE="CLOSED"` = inclusive (≤). `INTERVAL-TYPE="OPEN"` = exclusive (<).                                                                                                                                               |
| `<UPPER-LIMIT INTERVAL-TYPE="CLOSED">` | `CompuScale.upperLimit` | Upper bound of the internal value range. Same `INTERVAL-TYPE` semantics.                                                                                                                                                                                                 |
| `<COMPU-CONST>`                        | `CompuConst`            | Constant result value for this scale. Contains either `<VT>` (text) or `<V>` (numeric).                                                                                                                                                                                  |
| `<VT>`                                 | `CompuConst.vt`         | **"Verbal Text"** — the symbolic string name for the enumeration literal (e.g. `CAN_CS_UNINIT`). The RTE uses `<VT>` to generate C `#define` constants. This is the equivalent of an enum member name in C.                                                              |

> **Reading a TEXTTABLE COMPU-SCALE:**
> ```xml
> <COMPU-SCALE>
>   <LOWER-LIMIT INTERVAL-TYPE="CLOSED">0</LOWER-LIMIT>   <!-- internal value = 0 -->
>   <UPPER-LIMIT INTERVAL-TYPE="CLOSED">0</UPPER-LIMIT>   <!-- exactly 0 -->
>   <COMPU-CONST><VT>CAN_CS_UNINIT</VT></COMPU-CONST>    <!-- symbolic name -->
> </COMPU-SCALE>
> ```
> Means: internal integer `0` ↔ symbol `CAN_CS_UNINIT`.

#### ImplementationDataType Tags (`<IMPLEMENTATION-DATA-TYPE>`)

> Normative source: `AUTOSAR_CP_TPS_SoftwareComponentTemplate` Doc ID 62, R24-11, §5.2.6 "ImplementationDataType"  
> Purpose: Defines the C-level type representation — how data is stored and typed in compiled code.

##### Type-Level Tags

| Tag                                                     | UML Class                            | Meaning                                                                                                                                                                                                      |
| ------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `<IMPLEMENTATION-DATA-TYPE>`                            | `ImplementationDataType`             | C type definition. `<CATEGORY>` distinguishes the kind. Must have `<SHORT-NAME>` and `<SW-DATA-DEF-PROPS>` (or reference a base type).                                                                       |
| `<CATEGORY>VALUE</CATEGORY>`                            | IDT category                         | Primitive scalar type (maps to a `SwBaseType` like `uint8`, `uint32`). Generates a C `typedef`.                                                                                                              |
| `<CATEGORY>STRUCTURE</CATEGORY>`                        | IDT category                         | C struct type. Has `<SUB-ELEMENTS>` listing its members.                                                                                                                                                     |
| `<CATEGORY>ARRAY</CATEGORY>`                            | IDT category                         | C array type. Has `<SUB-ELEMENTS>` with array element definition.                                                                                                                                            |
| `<CATEGORY>DATA_REFERENCE</CATEGORY>`                   | IDT category                         | C pointer type. Has `<SW-POINTER-TARGET-PROPS>` describing the pointed-to type.                                                                                                                              |
| `<SUB-ELEMENTS>` / `<IMPLEMENTATION-DATA-TYPE-ELEMENT>` | `ImplementationDataTypeElement`      | Member of a STRUCTURE or element of an ARRAY. Has its own `<SHORT-NAME>`, `<CATEGORY>`, and `<SW-DATA-DEF-PROPS>`.                                                                                           |
| `<CATEGORY>TYPE_REFERENCE</CATEGORY>`                   | on IDT-Element                       | Element references another `ImplementationDataType` by `<IMPLEMENTATION-DATA-TYPE-REF>`. Generates a `typedef` reference.                                                                                    |
| `<TYPE-EMITTER>HEADER_FILE</TYPE-EMITTER>`              | `ImplementationDataType.typeEmitter` | Which tool emits the C `typedef`. `HEADER_FILE` = emitted directly into a standard AUTOSAR-generated header. `RTE` = emitted by the RTE generator into `Rte_Type.h`. `BSW-MODULE` = emitted by a BSW module. |

---

#### Software Data Definition Properties

| Tag                                                                  | UML Class                                      | Meaning                                                                                                                                                                                |
| -------------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<SW-DATA-DEF-PROPS>`                                                | `SwDataDefProps`                               | Container for software data properties of a type or element. Always wrapped in variants.                                                                                               |
| `<SW-DATA-DEF-PROPS-VARIANTS>`                                       | (wrapper)                                      | Allows multiple conditional property sets (for different PostBuild variants).                                                                                                          |
| `<SW-DATA-DEF-PROPS-CONDITIONAL>`                                    | `SwDataDefPropsContent`                        | One set of properties, optionally conditioned on a variant criterion. In simple cases there is exactly one entry with no condition.                                                    |
| `<BASE-TYPE-REF DEST="SW-BASE-TYPE">path`                            | `SwDataDefPropsContent.baseType`               | Reference to `SwBaseType` (e.g. `/AUTOSAR_Platform/BaseTypes/uint8`). Defines the binary representation (bit width, encoding).                                                         |
| `<COMPU-METHOD-REF DEST="COMPU-METHOD">path`                         | `SwDataDefPropsContent.compuMethod`            | Reference to a `CompuMethod`. Connects the type to its value semantics/units/enumeration.                                                                                              |
| `<IMPLEMENTATION-DATA-TYPE-REF DEST="IMPLEMENTATION-DATA-TYPE">path` | `SwDataDefPropsContent.implementationDataType` | Reference to another `ImplementationDataType`. Used in `TYPE_REFERENCE` elements.                                                                                                      |
| `<SW-IMPL-POLICY>STANDARD`                                           | `SwDataDefPropsContent.swImplPolicy`           | Code generation policy. `STANDARD` = normal variable. `CONST` = compile-time constant. `FIXED` = value cannot be changed at runtime. `MEASUREMENT-POINT` = observable via calibration. |
| `<SW-POINTER-TARGET-PROPS>`                                          | `SwPointerTargetProps`                         | Describes the target of a pointer (`DATA_REFERENCE` IDT). Contains `<TARGET-CATEGORY>` and nested `<SW-DATA-DEF-PROPS>` for the pointee type.                                          |
| `<TARGET-CATEGORY>`                                                  | `SwPointerTargetProps.targetCategory`          | Category of the pointed-to object: `VALUE`, `TYPE_REFERENCE`, etc.                                                                                                                     |

---


### Functionality of the `Can_GeneralTypes` Module

`Can_GeneralTypes.arxml` is defined for other modules to reference the general types it contains by using `<IMPLEMENTATION-DATA-TYPE-REF>` and `<COMPU-METHOD-REF>`. It does not define any ECUC parameters itself, but provides the building blocks (data types, compu methods) that other ECUC modules can use to define their parameters.

#### configured element inside `Can_GeneralTypes.arxml`:

##### Package: `AUTOSAR_Can_GeneralTypes/CompuMethods`

| `<SHORT-NAME>`            | `<CATEGORY>` | Scale | `<LOWER-LIMIT>` | `<UPPER-LIMIT>` | `<VT>` (symbol)  | Description                                |
| ------------------------- | ------------ | ----- | --------------- | --------------- | ---------------- | ------------------------------------------ |
| `Can_ControllerStateType` | `TEXTTABLE`  | 0     | `0`             | `0`             | `CAN_CS_UNINIT`  | CAN controller state UNINIT                |
|                           |              | 1     | `1`             | `1`             | `CAN_CS_STARTED` | CAN controller state STARTED               |
|                           |              | 2     | `2`             | `2`             | `CAN_CS_STOPPED` | CAN controller state STOPPED               |
|                           |              | 3     | `3`             | `3`             | `CAN_CS_SLEEP`   | CAN controller state SLEEP                 |
| `Can_HwHandleType`        | `TEXTTABLE`  | 0     | `0`             | `0x0FF`         | `Standard`       | Standard HW handle range (≤ 255 objects)   |
|                           |              | 1     | `0`             | `0xFFFF`        | `Extended`       | Extended HW handle range (> 255 objects)   |
| `Can_IdType`              | `TEXTTABLE`  | 0     | `0`             | `0x400007FF`    | `Standard32Bit`  | Standard CAN ID (11-bit) encoded in 32-bit |
|                           |              | 1     | `0`             | `0xDFFFFFFF`    | `Extended32Bit`  | Extended CAN ID (29-bit) encoded in 32-bit |

---

##### Package: `AUTOSAR_Can_GeneralTypes/ImplementationDataTypes`

###### Scalar Types (`CATEGORY = VALUE`)

| `<SHORT-NAME>`            | `<LONG-NAME>`                                                                                                                                                     | `<CATEGORY>` | `<BASE-TYPE-REF>` | `<COMPU-METHOD-REF>`      | `<TYPE-EMITTER>` |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ----------------- | ------------------------- | ---------------- |
| `Can_IdType`              | Represents the Identifier of an L-PDU. Two MSBs specify the frame type: `00` = Standard CAN, `01` = CAN FD Standard, `10` = Extended CAN, `11` = CAN FD Extended. | `VALUE`      | `uint32`          | `Can_IdType`              | `HEADER_FILE`    |
| `Can_ControllerStateType` | State transitions used by `CAN_SetControllerMode`.                                                                                                                | `VALUE`      | `uint8`           | `Can_ControllerStateType` | `HEADER_FILE`    |
| `Can_HwHandleType`        | Represents HW object handles of a CAN hardware unit. Use extended range for > 255 HW objects.                                                                     | `VALUE`      | `uint32`          | `Can_HwHandleType`        | `HEADER_FILE`    |

###### Structure Types (`CATEGORY = STRUCTURE`)

**`Can_PduType`** — Unites PduId (`swPduHandle`), SduLength (`length`), SduData (`sdu`), and CanId (`id`) for any CAN L-SDU. `<TYPE-EMITTER>`: `HEADER_FILE`.

| Member `<SHORT-NAME>` | Member `<CATEGORY>` | Type / Reference                                                 | `<SW-IMPL-POLICY>` | Notes                             |
| --------------------- | ------------------- | ---------------------------------------------------------------- | ------------------ | --------------------------------- |
| `sdu`                 | `DATA_REFERENCE`    | → `uint8` (pointer target)                                       | `STANDARD`         | Pointer to the payload byte array |
| `id`                  | `TYPE_REFERENCE`    | → `/AUTOSAR_Can_GeneralTypes/ImplementationDataTypes/Can_IdType` | `STANDARD`         | CAN identifier (32-bit)           |
| `swPduHandle`         | `TYPE_REFERENCE`    | → `/AUTOSAR_Comtype/ImplementationDataTypes/PduIdType`           | `STANDARD`         | PDU handle used by the COM stack  |
| `length`              | `TYPE_REFERENCE`    | → `/AUTOSAR_Platform/ImplementationDataTypes/uint8`              | `STANDARD`         | SDU data length in bytes          |

**`Can_HwType`** — Provides a HW Object Handle together with its CAN Controller ID and the specific CanId. `<TYPE-EMITTER>`: `HEADER_FILE`.

| Member `<SHORT-NAME>` | Member `<CATEGORY>` | Type / Reference                                                       | `<SW-IMPL-POLICY>` | Notes                                            |
| --------------------- | ------------------- | ---------------------------------------------------------------------- | ------------------ | ------------------------------------------------ |
| `CanId`               | `TYPE_REFERENCE`    | → `/AUTOSAR_Can_GeneralTypes/ImplementationDataTypes/Can_IdType`       | `STANDARD`         | CAN identifier of the received/transmitted frame |
| `Hoh`                 | `TYPE_REFERENCE`    | → `/AUTOSAR_Can_GeneralTypes/ImplementationDataTypes/Can_HwHandleType` | `STANDARD`         | Hardware Object Handle index                     |
| `ControllerId`        | `TYPE_REFERENCE`    | → `/AUTOSAR_Platform/ImplementationDataTypes/uint8`                    | `STANDARD`         | Index of the CAN controller owning the HOH       |

---

### Summary Section (Summary of Notes)

**Defined AUTOSAR Tags** (`Can_GeneralTypes.arxml`): These tags appear across all ARXML file types, not only ECUC files. They are defined in **`AUTOSAR_CP_TPS_SoftwareComponentTemplate` (Doc ID 62, R24-11)** and the Generic Structure Template.

Key global-tag takeaways:
1. **`xsi:schemaLocation`** is the version fingerprint: `autosar_4-2-2.xsd` = R4.2.2; `AUTOSAR_00048.xsd` = R24-11.
2. **`<COMPU-METHOD>` + `<COMPU-SCALE>` + `<VT>`** = the AUTOSAR enumeration mechanism. The `TEXTTABLE` category maps integers to symbolic string names (the `<VT>` text becomes the C `#define` constant name).
3. **`<IMPLEMENTATION-DATA-TYPE>`** is the C-level type. Its `<CATEGORY>` determines the shape: `VALUE` = scalar, `STRUCTURE` = struct, `DATA_REFERENCE` = pointer, `ARRAY` = array.
4. **`<SW-DATA-DEF-PROPS>`** is the "glue layer" linking a type to its base type (`SwBaseType`) and semantics (`CompuMethod`). It always appears as `VARIANTS > CONDITIONAL` to support post-build variant configurations.
5. **`<TYPE-EMITTER>HEADER_FILE`** means the typedef is owned by the BSW/standard header generator; `RTE` means it is under RTE control.
6. `<ADMIN-DATA>` with `<DOC-REVISIONS>` / `<ISSUED-BY>` is required at the top of every AUTOSAR ECUC Param Def XML file (`[TPS_ECUC_06004]`) and is used for version traceability.