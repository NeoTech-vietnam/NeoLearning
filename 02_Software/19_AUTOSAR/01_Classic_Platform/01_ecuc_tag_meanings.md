# Cornell Notes

## Topic: ECUC Tag Meanings — AUTOSAR_CP_TPS_ECUConfiguration

## Date: 28/05/2026

---

### Cue Column (Questions, Keywords, or Prompts)

- What does `ECUC-MODULE-DEF` represent?
- What is the difference between `ECUC-PARAM-CONF-CONTAINER-DEF` and `ECUC-CHOICE-CONTAINER-DEF`?
- What are the five parameter definition tag types?
- What does `ORIGIN` tag mean? What values can it have?
- When is `POST-BUILD-VARIANT-VALUE` vs `POST-BUILD-VARIANT-MULTIPLICITY` used?
- What do `CONFIG-CLASS` and `CONFIG-VARIANT` control?
- What does `SYMBOLIC-NAME-VALUE` do?
- What is `ECUC-REFERENCE-DEF` and its `DESTINATION-REF`?
- Which AUTOSAR spec defines all these tags?
- What is the difference between TPS and SWS documents?

---

### Notes Section (Main Notes)

> **Source:** `AUTOSAR_CP_TPS_ECUConfiguration` Doc ID 87, R24-11 — §2.3.2–§2.3.6  
> **File studied:** `rba_Nds_EcucParamDef_confrules.arxml` (Bosch RBA `rba_Nds` module)

---

#### Structure / Hierarchy Tags

| Tag                               | UML Class                                            | Meaning                                                                                                                                                            |
| --------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `<ECUC-MODULE-DEF>`               | `EcucModuleDef` §2.3.2                               | Top-level definition of an entire BSW/RBA module's configuration. Contains all containers. Declares `SUPPORTED-CONFIG-VARIANTS` (PRE-COMPILE / LINK / POST-BUILD). |
| `<ECUC-PARAM-CONF-CONTAINER-DEF>` | `EcucParamConfContainerDef` §2.3.3                   | Standard container. Groups `<PARAMETERS>`, `<REFERENCES>`, and `<SUB-CONTAINERS>`.                                                                                 |
| `<ECUC-CHOICE-CONTAINER-DEF>`     | `EcucChoiceContainerDef` §2.3.3.1 `[TPS_ECUC_02011]` | Enforces mutual exclusion — **only one** `<CHOICES>` entry may appear in the actual ECU config value. Used for CAN/FlexRay/LIN PDU variants.                       |
| `<SUB-CONTAINERS>`                | aggregation `subContainer`                           | Nests child containers inside a parent container.                                                                                                                  |
| `<CHOICES>`                       | aggregation `choice`                                 | Lists candidate containers inside an `ECUC-CHOICE-CONTAINER-DEF`.                                                                                                  |
| `<PARAMETERS>`                    | aggregation `parameter`                              | Lists parameter definitions inside a container.                                                                                                                    |
| `<REFERENCES>`                    | aggregation `reference`                              | Lists reference definitions inside a container.                                                                                                                    |

---

#### Parameter Definition Tags (all subclass `EcucParameterDef` §2.3.5)

| Tag                            | UML Class                 | Key Attributes                                                                           |
| ------------------------------ | ------------------------- | ---------------------------------------------------------------------------------------- |
| `<ECUC-INTEGER-PARAM-DEF>`     | `EcucIntegerParamDef`     | `<MIN>`, `<MAX>`, `<DEFAULT-VALUE>`                                                      |
| `<ECUC-FLOAT-PARAM-DEF>`       | `EcucFloatParamDef`       | `<MIN>`, `<MAX>` (Limit type), `<DEFAULT-VALUE>`                                         |
| `<ECUC-BOOLEAN-PARAM-DEF>`     | `EcucBooleanParamDef`     | `<DEFAULT-VALUE>` (true/false)                                                           |
| `<ECUC-STRING-PARAM-DEF>`      | `EcucStringParamDef`      | `<MAX-LENGTH>`, `<MIN-LENGTH>`, `<REGULAR-EXPRESSION>`, `<DEFAULT-VALUE>`                |
| `<ECUC-ENUMERATION-PARAM-DEF>` | `EcucEnumerationParamDef` | Closed set of named values; declared in `<LITERALS>` / `<ECUC-ENUMERATION-LITERAL-DEF>`. |

---

#### Reference Definition Tags (§2.3.6)

| Tag                             | UML Class                      | Meaning                                                                                                                            |
| ------------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `<ECUC-REFERENCE-DEF>`          | `EcucReferenceDef`             | Points to another ECU configuration container. Target is declared in `<DESTINATION-REF DEST="TYPE">path</DESTINATION-REF>`.        |
| `<DESTINATION-REF DEST="TYPE">` | `EcucReferenceDef.destination` | `DEST` attribute gives the metatype of the target (e.g. `ECUC-PARAM-CONF-CONTAINER-DEF`). The text content is the full ARXML path. |

---

#### Common Attributes — `EcucDefinitionElement` / `EcucCommonAttributes` (§2.3.4.3)

| Tag                                 | Model Attribute                                     | Meaning                                                                                                                                             |
| ----------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<SHORT-NAME>`                      | `Referrable.shortName`                              | Unique ID within parent scope; used in ARXML paths.                                                                                                 |
| `<LONG-NAME>` / `<L-4 L="EN">`      | `MultilanguageReferrable.longName`                  | Human-readable display name, language-tagged.                                                                                                       |
| `<DESC>` / `<L-2 L="EN">`           | `Describable.desc`                                  | Description text, language-tagged.                                                                                                                  |
| `<LOWER-MULTIPLICITY>`              | `EcucDefinitionElement.lowerMultiplicity`           | **Minimum** instances allowed. Required `[constr_3570]`.                                                                                            |
| `<UPPER-MULTIPLICITY>`              | `EcucDefinitionElement.upperMultiplicity`           | **Maximum** instances. Exactly one of this or `UPPER-MULTIPLICITY-INFINITE` required `[constr_5342]`.                                               |
| `<UPPER-MULTIPLICITY-INFINITE>true` | `EcucDefinitionElement.upperMultiplicityInfinite`   | If `true`, unlimited instances allowed. Mutually exclusive with `UPPER-MULTIPLICITY`.                                                               |
| `<ORIGIN>`                          | `EcucCommonAttributes.origin`                       | Who defined this parameter. `AUTOSAR_ECUC` = standardized; `RB:x.x.x:date` = Bosch RBA vendor extension. Required `[constr_3571]`, `[constr_5365]`. |
| `<POST-BUILD-VARIANT-VALUE>`        | `EcucCommonAttributes.postBuildVariantValue`        | `true` → the **value** may differ between post-build variants `[TPS_ECUC_08014]`.                                                                   |
| `<POST-BUILD-VARIANT-MULTIPLICITY>` | `EcucCommonAttributes.postBuildVariantMultiplicity` | `true` → the **instance count** may differ between post-build variants `[TPS_ECUC_08015]`.                                                          |

---

#### Configuration Class Tags — Multiplicity & Value Classes (§2.3.4.3)

Control **when** (at which build phase) the count of instances or the value is frozen.

| Tag                                                                         | UML Class                                      | Meaning                                                                                   |
| --------------------------------------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `<MULTIPLICITY-CONFIG-CLASSES>` / `<ECUC-MULTIPLICITY-CONFIGURATION-CLASS>` | `EcucMultiplicityConfigurationClass`           | For each variant, declares at which phase the **instance count** is determined.           |
| `<VALUE-CONFIG-CLASSES>` / `<ECUC-VALUE-CONFIGURATION-CLASS>`               | `EcucValueConfigurationClass`                  | Same structure, but governs when the parameter **value** is determined.                   |
| `<CONFIG-CLASS>`                                                            | `EcucAbstractConfigurationClass.configClass`   | Build phase literals: `PRE-COMPILE`, `LINK`, `POST-BUILD`, `PUBLISHED-INFORMATION`.       |
| `<CONFIG-VARIANT>`                                                          | `EcucAbstractConfigurationClass.configVariant` | Implementation variant: `VARIANT-PRE-COMPILE`, `VARIANT-LINK-TIME`, `VARIANT-POST-BUILD`. |

> **Reading a pair:** `<CONFIG-CLASS>PRE-COMPILE</CONFIG-CLASS>` + `<CONFIG-VARIANT>VARIANT-PRE-COMPILE</CONFIG-VARIANT>` = "for a pre-compile implementation, this value/count is fixed at pre-compile time."  
> `PUBLISHED-INFORMATION` = fixed at specification time; cannot be changed during ECU configuration at all.

---

#### Parameter-Specific Attribute Tags

| Tag                                             | Source                                     | Meaning                                                                                                                             |
| ----------------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `<SYMBOLIC-NAME-VALUE>`                         | `EcucParameterDef.symbolicNameValue`       | `true` → value + container short name generates a C `#define` numeric handle. `false` → no symbolic name. Required `[constr_3572]`. |
| `<DEFAULT-VALUE>`                               | type-specific                              | Pre-filled value if no explicit value is provided by the configuration tool.                                                        |
| `<MIN>` / `<MAX>`                               | `EcucIntegerParamDef`, `EcucFloatParamDef` | Allowed value range.                                                                                                                |
| `<LITERALS>` / `<ECUC-ENUMERATION-LITERAL-DEF>` | `EcucEnumerationLiteralDef`                | Named literal values of an enum parameter. Each must have `<ORIGIN>` `[constr_3575]`.                                               |

---

#### XML ↔ UML Mapping Quick Reference

```
ECUC-MODULE-DEF                       → EcucModuleDef
ECUC-PARAM-CONF-CONTAINER-DEF         → EcucParamConfContainerDef
ECUC-CHOICE-CONTAINER-DEF             → EcucChoiceContainerDef
ECUC-INTEGER-PARAM-DEF                → EcucIntegerParamDef
ECUC-FLOAT-PARAM-DEF                  → EcucFloatParamDef
ECUC-BOOLEAN-PARAM-DEF                → EcucBooleanParamDef
ECUC-STRING-PARAM-DEF                 → EcucStringParamDef
ECUC-ENUMERATION-PARAM-DEF            → EcucEnumerationParamDef
ECUC-REFERENCE-DEF                    → EcucReferenceDef
ECUC-MULTIPLICITY-CONFIGURATION-CLASS → EcucMultiplicityConfigurationClass
ECUC-VALUE-CONFIGURATION-CLASS        → EcucValueConfigurationClass
```

---

#### Spec Documents Referenced

| Role                        | Document                                 | Doc ID | Type | Sections     |
| --------------------------- | ---------------------------------------- | ------ | ---- | ------------ |
| **Normative (definitions)** | `AUTOSAR_CP_TPS_ECUConfiguration`        | 87     | TPS  | §2.3.2–2.3.6 |
| Context only (usage)        | `AUTOSAR_CP_SWS_COMBasedTransformer`     | 662    | SWS  | —            |
| Context only (usage)        | `AUTOSAR_CP_SWS_DataDistributionService` | 1069   | SWS  | —            |
| Context only (usage)        | `AUTOSAR_CP_SWS_IEEE1722TransportLayer`  | 1093   | SWS  | —            |

> **TPS** (Technical Parameter Specification) = defines the metamodel (what tags *mean*).  
> **SWS** (Software Specification) = consumes the metamodel (uses the tags for a specific module).

---

### Summary Section (Summary of Notes)

All ECUC XML tags in `rba_Nds_EcucParamDef_confrules.arxml` are serializations of UML metamodel classes from `M2::AUTOSARTemplates::ECUCParameterDefTemplate`, defined exclusively in **`AUTOSAR_CP_TPS_ECUConfiguration` (Doc ID 87, R24-11)**.

Key takeaways:
1. **Module → Containers → Parameters/References** is the structural hierarchy. `ECUC-CHOICE-CONTAINER-DEF` enforces mutual exclusion between alternatives.
2. All parameters share **common attributes**: `LOWER/UPPER-MULTIPLICITY`, `ORIGIN`, `POST-BUILD-VARIANT-VALUE/MULTIPLICITY`, and config class/variant pairs.
3. `ORIGIN>AUTOSAR_ECUC` = standardized; `ORIGIN>RB:x.x.x:date` = Bosch RBA vendor extension — all `rba_Nds` params use the Bosch origin.
4. **Config classes** (`PRE-COMPILE`, `LINK`, `POST-BUILD`, `PUBLISHED-INFORMATION`) determine the phase at which a parameter's value or instance count is locked in.
5. `SYMBOLIC-NAME-VALUE>true` drives C `#define` generation; `false` means the parameter is a pure configuration value with no code-visible name.
6. R4.2.2 and R24-11 tag names/semantics are stable across versions.