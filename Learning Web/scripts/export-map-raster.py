"""Export derived web images after rendering embedded-world-base-master.png.

Requires Pillow. The SVG remains the artwork source of truth.
"""

from pathlib import Path
from PIL import Image, ImageOps


MAP_DIR = Path(__file__).resolve().parents[1] / "assets" / "maps"
master = Image.open(MAP_DIR / "embedded-world-base-master.png").convert("RGB")
if master.size != (3840, 2160):
    raise SystemExit(f"Expected 3840x2160 raster master, got {master.size}")

master.save(MAP_DIR / "embedded-world-base.webp", "WEBP", quality=88, method=6)
for width, height in [(1280, 800), (1024, 768), (1440, 900)]:
    preview = ImageOps.fit(master, (width, height), method=Image.Resampling.LANCZOS)
    preview.save(MAP_DIR / f"embedded-world-preview-{width}x{height}.jpg", "JPEG", quality=88, optimize=True)
