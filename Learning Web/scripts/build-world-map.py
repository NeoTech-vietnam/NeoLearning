"""Build the NeoLearning atlas from pinned Azgaar and Kenney source assets.

Run from anywhere with: python3 "Learning Web/scripts/build-world-map.py"
The source, click mask, land mask, and label anchors are regenerated together.
"""

from __future__ import annotations

import base64
import copy
import json
from pathlib import Path
from xml.etree import ElementTree as ET


MAP_DIR = Path(__file__).resolve().parents[1] / "assets" / "maps"
SVG = "http://www.w3.org/2000/svg"
INKSCAPE = "http://www.inkscape.org/namespaces/inkscape"
ET.register_namespace("", SVG)
ET.register_namespace("inkscape", INKSCAPE)

SCALE = 2.88
OFFSET_X = -384
OFFSET_Y = -216
TRANSFORM = f"translate({OFFSET_X} {OFFSET_Y}) scale({SCALE})"

# The six state paths come from pinned Azgaar seed 663386647. The ordering is
# the stable NeoLearning topic order, not the generator's random naming order.
COUNTRIES = [
    ("state1", "country-01", "#b88658", (370, 385), (349.12, 412.10), "rocksMountain.png"),
    ("state2", "country-02", "#648596", (1080, 320), (1068.08, 227.39), "castle.png"),
    ("state6", "country-03", "#86a89b", (1265, 445), (1304.76, 574.81), "bridge.png"),
    ("state4", "country-04", "#bda173", (480, 535), (467.35, 597.00), "treePines.png"),
    ("state3", "country-05", "#a68091", (825, 455), (839.95, 599.61), "tower.png"),
    ("state5", "country-06", "#8c9f81", (625, 305), (615.61, 233.74), "compass.png"),
]


def tag(local_name: str) -> str:
    return f"{{{SVG}}}{local_name}"


def new_svg() -> ET.Element:
    return ET.Element(tag("svg"), {"viewBox": "0 0 3840 2160", "width": "3840", "height": "2160"})


def layer(root: ET.Element, label: str) -> ET.Element:
    return ET.SubElement(root, tag("g"), {
        "id": label,
        f"{{{INKSCAPE}}}groupmode": "layer",
        f"{{{INKSCAPE}}}label": label,
    })


def copy_element(parent: ET.Element, source: ET.Element) -> ET.Element:
    cloned = copy.deepcopy(source)
    parent.append(cloned)
    return cloned


def get(source: ET.Element, element_id: str) -> ET.Element:
    found = source.find(f'.//*[@id="{element_id}"]')
    if found is None:
        raise ValueError(f"Missing Azgaar element: {element_id}")
    return found


def data_uri(filename: Path) -> str:
    payload = base64.b64encode(filename.read_bytes()).decode("ascii")
    return f"data:image/png;base64,{payload}"


def position(point: tuple[float, float]) -> dict[str, float]:
    x, y = point
    return {"x": round((x * SCALE + OFFSET_X) / 3840, 5),
            "y": round((y * SCALE + OFFSET_Y) / 2160, 5)}


def add_icon(parent: ET.Element, filename: str, x: float, y: float, size: float, opacity: str = "0.78") -> None:
    ET.SubElement(parent, tag("image"), {
        "href": data_uri(MAP_DIR / "vendor" / "kenney" / filename),
        "x": str(x - size / 2), "y": str(y - size / 2),
        "width": str(size), "height": str(size), "opacity": opacity,
    })


def write_svg(path: Path, root: ET.Element) -> None:
    ET.ElementTree(root).write(path, encoding="utf-8", xml_declaration=True)
    print(f"wrote {path.name}: {path.stat().st_size:,} bytes")


def main() -> None:
    source = ET.parse(MAP_DIR / "azgaar-source-663386647.svg").getroot()
    original_defs = copy.deepcopy(source.find(tag("defs")))
    if original_defs is None:
        raise ValueError("Azgaar SVG has no definitions")
    waves = get(original_defs, "oceanicPattern")
    waves.set("href", data_uri(MAP_DIR / "vendor" / "azgaar-waves.png"))

    master = new_svg()
    master.append(ET.Comment("Geography: Azgaar Fantasy Map Generator (MIT), seed 663386647. Decoration: Kenney Cartography Pack (CC0)."))
    master.append(original_defs)
    paper = layer(master, "00_paper")
    ET.SubElement(paper, tag("rect"), {"width": "3840", "height": "2160", "fill": "#d5ccb3"})

    sea = layer(master, "01_sea")
    sea_native = ET.SubElement(sea, tag("g"), {"transform": TRANSFORM})
    ocean = copy_element(sea_native, get(source, "ocean"))
    ocean_waves = get(ocean, "oceanWaves")
    ocean_waves.set("fill", "none")
    ocean_waves.set("opacity", "0.22")

    land = layer(master, "02_continent_base")
    land_native = ET.SubElement(land, tag("g"), {"transform": TRANSFORM})
    landmass = copy_element(land_native, get(source, "landmass"))
    landmass.set("mask", "url(#land)")

    country_layer = layer(master, "03_country_washes")
    country_paths = ET.SubElement(country_layer, tag("g"), {"transform": TRANSFORM, "opacity": "0.47"})
    for azgaar_id, country_id, color, *_ in COUNTRIES:
        azgaar_path = get(source, azgaar_id)
        ET.SubElement(country_paths, tag("path"), {"id": country_id, "d": azgaar_path.get("d", ""), "fill": color})

    mountains = layer(master, "04_mountains")
    mountain_native = ET.SubElement(mountains, tag("g"), {"transform": TRANSFORM})
    for x, y in [(430, 290), (505, 310), (595, 365), (750, 315), (785, 355), (975, 490), (1050, 475)]:
        add_icon(mountain_native, "rocksMountain.png", x, y, 45, "0.44")

    waters = layer(master, "05_rivers_lakes")
    water_native = ET.SubElement(waters, tag("g"), {"transform": TRANSFORM})
    lakes = copy_element(water_native, get(source, "lakes"))
    lakes.set("mask", "url(#water)")
    rivers = copy_element(water_native, get(source, "rivers"))
    rivers.set("mask", "url(#land)")

    forests = layer(master, "06_forests")
    forest_native = ET.SubElement(forests, tag("g"), {"transform": TRANSFORM})
    for x, y in [(480, 455), (545, 485), (665, 280), (725, 255), (810, 515), (910, 525), (1185, 375), (1235, 400)]:
        add_icon(forest_native, "treePines.png", x, y, 34, "0.43")

    roads = layer(master, "07_roads_bridges")
    road_native = ET.SubElement(roads, tag("g"), {"transform": TRANSFORM})
    routes = copy_element(road_native, get(source, "routes"))
    routes.set("opacity", "0.62")

    settlements = layer(master, "08_settlements_landmarks")
    settlement_native = ET.SubElement(settlements, tag("g"), {"transform": TRANSFORM})
    for _, _, _, _, capital, icon in COUNTRIES:
        add_icon(settlement_native, icon, *capital, 57, "0.87")

    outlines = layer(master, "09_coastline_borders")
    outline_native = ET.SubElement(outlines, tag("g"), {"transform": TRANSFORM})
    copy_element(outline_native, get(source, "borders"))
    coastline = copy_element(outline_native, get(source, "coastline"))
    coastline.set("fill", "none")

    decoration = layer(master, "10_compass_decoration")
    add_icon(decoration, "compass.png", 3480, 390, 168, "0.70")
    ET.SubElement(decoration, tag("rect"), {
        "x": "35", "y": "35", "width": "3770", "height": "2090",
        "fill": "none", "stroke": "#655747", "stroke-opacity": "0.42", "stroke-width": "3",
    })

    grading = layer(master, "11_texture_grading")
    ET.SubElement(grading, tag("image"), {
        "href": data_uri(MAP_DIR / "vendor" / "kenney" / "parchmentBasic.png"),
        "width": "3840", "height": "2160", "preserveAspectRatio": "xMidYMid slice",
        "opacity": "0.22", "style": "mix-blend-mode:multiply;pointer-events:none",
    })
    write_svg(MAP_DIR / "embedded-world-source.svg", master)

    country_mask = new_svg()
    for azgaar_id, country_id, *_ in COUNTRIES:
        path = get(source, azgaar_id)
        ET.SubElement(country_mask, tag("path"), {
            "id": country_id, "d": path.get("d", ""), "transform": TRANSFORM,
        })
    write_svg(MAP_DIR / "embedded-world-country-mask.svg", country_mask)

    land_mask = new_svg()
    land_defs = ET.SubElement(land_mask, tag("defs"))
    copy_element(land_defs, get(source, "featurePaths"))
    copy_element(land_defs, get(source, "land"))
    native_land = ET.SubElement(land_mask, tag("g"), {"transform": TRANSFORM})
    ET.SubElement(native_land, tag("rect"), {
        "id": "embedded-world-land", "width": "1600", "height": "900",
        "fill": "#fff", "mask": "url(#land)",
    })
    write_svg(MAP_DIR / "embedded-world-land-mask.svg", land_mask)

    anchors = {}
    for _, country_id, _, label, capital, _ in COUNTRIES:
        anchors[country_id] = {
            "label": position(label), "capital": position(capital),
            "focus": position(label), "recommendedLabelWidth": 0.15,
        }
    (MAP_DIR / "embedded-world-label-anchors.json").write_text(
        json.dumps(anchors, indent=2) + "\n", encoding="utf-8"
    )


if __name__ == "__main__":
    main()
