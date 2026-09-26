"""Inject a compiled vbaProject.bin into an XLSX package and emit XLSM."""

from __future__ import annotations

import argparse
import tempfile
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

CONTENT_TYPES_NS = "http://schemas.openxmlformats.org/package/2006/content-types"
REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"
WORKBOOK_CONTENT = "application/vnd.ms-excel.sheet.macroEnabled.main+xml"
VBA_CONTENT = "application/vnd.ms-office.vbaProject"
VBA_REL = "http://schemas.microsoft.com/office/2006/relationships/vbaProject"


def extract_vba_project(macro_file: Path) -> bytes:
    with zipfile.ZipFile(macro_file, "r") as archive:
        return archive.read("xl/vbaProject.bin")


def patch_content_types(xml_bytes: bytes) -> bytes:
    ET.register_namespace("", CONTENT_TYPES_NS)
    root = ET.fromstring(xml_bytes)
    workbook_override = None
    workbook_default = None
    vba_override = None
    for child in root:
        if child.tag.endswith("Override"):
            if child.attrib.get("PartName") == "/xl/workbook.xml":
                workbook_override = child
            if child.attrib.get("PartName") == "/xl/vbaProject.bin":
                vba_override = child
        elif child.tag.endswith("Default") and child.attrib.get("Extension") == "xml":
            if child.attrib.get("ContentType", "").endswith("spreadsheetml.sheet.main+xml"):
                workbook_default = child
    if workbook_override is None and workbook_default is None:
        raise ValueError("Workbook content type entry not found")
    if workbook_override is not None:
        workbook_override.set("ContentType", WORKBOOK_CONTENT)
    else:
        workbook_default.set("ContentType", WORKBOOK_CONTENT)
    if vba_override is None:
        ET.SubElement(root, f"{{{CONTENT_TYPES_NS}}}Override", {
            "PartName": "/xl/vbaProject.bin", "ContentType": VBA_CONTENT
        })
    return ET.tostring(root, encoding="utf-8", xml_declaration=True)


def patch_workbook_relationships(xml_bytes: bytes) -> bytes:
    ET.register_namespace("", REL_NS)
    root = ET.fromstring(xml_bytes)
    max_id = 0
    for child in root:
        rel_id = child.attrib.get("Id", "")
        if rel_id.startswith("rId") and rel_id[3:].isdigit():
            max_id = max(max_id, int(rel_id[3:]))
        if child.attrib.get("Type") == VBA_REL:
            return ET.tostring(root, encoding="utf-8", xml_declaration=True)
    ET.SubElement(root, f"{{{REL_NS}}}Relationship", {
        "Id": f"rId{max_id + 1}", "Type": VBA_REL, "Target": "vbaProject.bin"
    })
    return ET.tostring(root, encoding="utf-8", xml_declaration=True)


def inject(input_xlsx: Path, macro_file: Path, output_xlsm: Path) -> None:
    vba_project = extract_vba_project(macro_file)
    output_xlsm.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        delete=False, suffix=".xlsm", dir=output_xlsm.parent
    ) as temp_file:
        temp_path = Path(temp_file.name)
    try:
        with zipfile.ZipFile(input_xlsx, "r") as source, zipfile.ZipFile(
            temp_path, "w", zipfile.ZIP_DEFLATED
        ) as target:
            for info in source.infolist():
                data = source.read(info.filename)
                if info.filename == "[Content_Types].xml":
                    data = patch_content_types(data)
                elif info.filename == "xl/_rels/workbook.xml.rels":
                    data = patch_workbook_relationships(data)
                target.writestr(info, data)
            target.writestr("xl/vbaProject.bin", vba_project)
        temp_path.replace(output_xlsm)
    finally:
        if temp_path.exists():
            temp_path.unlink()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input_xlsx", type=Path)
    parser.add_argument("macro_file", type=Path)
    parser.add_argument("output_xlsm", type=Path)
    args = parser.parse_args()
    inject(args.input_xlsx, args.macro_file, args.output_xlsm)


if __name__ == "__main__":
    main()
