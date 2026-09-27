#!/usr/bin/env python3
"""Save a permitted direct web image or render a selected PDF page/crop."""

from __future__ import annotations

import argparse
import io
import json
import math
import re
import sys
import urllib.request
from pathlib import Path
from typing import Sequence
from urllib.parse import urlsplit


DEFAULT_MAX_BYTES = 8 * 1024 * 1024
MAX_DOWNLOAD_BYTES = 25 * 1024 * 1024
MAX_RENDER_SCALE = 8.0
MAX_IMAGE_PIXELS = 25_000_000
MAX_RENDER_PIXELS = 25_000_000
IMAGE_SIGNATURES = {
    ".png": ("PNG", "image/png"),
    ".jpg": ("JPEG", "image/jpeg"),
    ".jpeg": ("JPEG", "image/jpeg"),
    ".webp": ("WEBP", "image/webp"),
}
PLACEHOLDER_NAME = re.compile(r"(?i)^(?:image|figure|download|capture|output|untitled)(?:[-_. ]*\d*)?$")


class CaptureError(ValueError):
    """An unsafe or unsupported capture request."""


class HttpsOnlyRedirectHandler(urllib.request.HTTPRedirectHandler):
    """Reject redirect hops that leave HTTPS before following them."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        parsed = urlsplit(newurl)
        if parsed.scheme.lower() != "https" or not parsed.hostname or parsed.username or parsed.password:
            raise CaptureError("image URL redirected away from a credential-free HTTPS URL")
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def _open_https_request(request: urllib.request.Request, timeout: float):
    opener = urllib.request.build_opener(HttpsOnlyRedirectHandler())
    return opener.open(request, timeout=timeout)


def _validate_output(path: Path, allowed_suffixes: set[str]) -> Path:
    destination = path.expanduser().resolve()
    if destination.suffix.lower() not in allowed_suffixes:
        allowed = ", ".join(sorted(allowed_suffixes))
        raise CaptureError(f"output must use one of these extensions: {allowed}")
    if PLACEHOLDER_NAME.fullmatch(destination.stem):
        raise CaptureError("output filename must be descriptive, not a placeholder")
    return destination


def _write_new(destination: Path, data: bytes) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    try:
        handle = destination.open("xb")
    except FileExistsError as error:
        raise CaptureError(f"refusing to overwrite existing file: {destination}") from error
    except OSError:
        # No file was opened by this call, so there is nothing safe to clean up.
        raise

    try:
        with handle:
            handle.write(data)
    except OSError:
        # The exclusive open succeeded, so this invocation owns the partial file.
        if destination.exists():
            try:
                destination.unlink()
            except OSError:
                pass
        raise


def _detect_image(data: bytes) -> str:
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return "PNG"
    if data.startswith(b"\xff\xd8\xff"):
        return "JPEG"
    if len(data) >= 12 and data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "WEBP"
    raise CaptureError("response is not a PNG, JPEG, or WebP image")


def download_image(url: str, output: Path, max_bytes: int = DEFAULT_MAX_BYTES, timeout: float = 30.0) -> dict[str, object]:
    """Download and validate a bounded direct HTTPS raster image."""
    parsed = urlsplit(url)
    if parsed.scheme.lower() != "https" or not parsed.hostname or parsed.username or parsed.password:
        raise CaptureError("image URL must be a direct HTTPS URL without embedded credentials")
    if max_bytes < 1 or max_bytes > MAX_DOWNLOAD_BYTES:
        raise CaptureError(f"--max-bytes must be between 1 and {MAX_DOWNLOAD_BYTES}")
    if timeout <= 0 or timeout > 120:
        raise CaptureError("timeout must be greater than 0 and no more than 120 seconds")

    destination = _validate_output(output, set(IMAGE_SIGNATURES))
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "NeoLearning-research-notes/1.0",
            "Accept": "image/png,image/jpeg,image/webp",
        },
    )
    try:
        with _open_https_request(request, timeout=timeout) as response:
            final_url = response.geturl()
            final_parts = urlsplit(final_url)
            if final_parts.scheme.lower() != "https" or not final_parts.hostname or final_parts.username or final_parts.password:
                raise CaptureError("image URL redirected away from a credential-free HTTPS URL")
            content_type = response.headers.get_content_type().lower()
            if content_type not in {"image/png", "image/jpeg", "image/webp", "application/octet-stream"}:
                raise CaptureError(f"response Content-Type is not an allowed image: {content_type}")
            content_length = response.headers.get("Content-Length")
            if content_length:
                try:
                    declared_length = int(content_length)
                except ValueError as error:
                    raise CaptureError("response has an invalid Content-Length header") from error
                if declared_length > max_bytes:
                    raise CaptureError(f"image exceeds the {max_bytes}-byte limit")
            data = response.read(max_bytes + 1)
    except CaptureError:
        raise
    except Exception as error:
        raise CaptureError(f"could not download image: {error}") from error

    if len(data) > max_bytes:
        raise CaptureError(f"image exceeds the {max_bytes}-byte limit")
    detected = _detect_image(data)
    extension = destination.suffix.lower()
    expected_format = IMAGE_SIGNATURES[extension][0]
    if detected != expected_format:
        raise CaptureError(f"image bytes are {detected}, but output extension is {extension}")
    if content_type.startswith("image/") and content_type != IMAGE_SIGNATURES[extension][1]:
        raise CaptureError(f"response Content-Type {content_type} does not match {extension}")
    try:
        from PIL import Image

        with Image.open(io.BytesIO(data)) as image:
            if image.format != detected:
                raise CaptureError("image decoder format does not match its file signature")
            width, height = image.size
            if width < 1 or height < 1 or width * height > MAX_IMAGE_PIXELS:
                raise CaptureError(f"image exceeds the {MAX_IMAGE_PIXELS}-pixel decoding limit")
            image.verify()
    except ImportError as error:
        raise CaptureError("Pillow is required to validate images; install the skill requirements") from error
    except CaptureError:
        raise
    except Exception as error:
        raise CaptureError(f"image data is incomplete or invalid: {error}") from error

    _write_new(destination, data)
    return {"kind": "download", "source_url": final_url, "output": str(destination), "format": detected, "bytes": len(data)}


def render_pdf_page(
    pdf_path: Path,
    page_number: int,
    output: Path,
    scale: float = 2.0,
    crop: tuple[int, int, int, int] | None = None,
) -> dict[str, object]:
    """Render a 1-based PDF page to PNG; crop is in rendered pixel coordinates."""
    source = pdf_path.expanduser().resolve()
    if not source.is_file():
        raise CaptureError(f"PDF does not exist: {source}")
    if page_number < 1:
        raise CaptureError("PDF pages are 1-based; --page must be at least 1")
    if not 0.25 <= scale <= MAX_RENDER_SCALE:
        raise CaptureError(f"--scale must be between 0.25 and {MAX_RENDER_SCALE}")
    destination = _validate_output(output, {".png"})
    try:
        import pypdfium2 as pdfium
        from PIL import Image
    except ImportError as error:
        raise CaptureError(
            "PDF rendering requires pypdfium2 and Pillow; install the skill requirements"
        ) from error

    document = None
    page = None
    try:
        document = pdfium.PdfDocument(str(source))
        page_count = len(document)
        if page_number > page_count:
            raise CaptureError(f"PDF has {page_count} pages; requested page {page_number}")
        page = document[page_number - 1]
        page_width, page_height = page.get_size()
        estimated_width = math.ceil(page_width * scale)
        estimated_height = math.ceil(page_height * scale)
        if estimated_width * estimated_height > MAX_RENDER_PIXELS:
            raise CaptureError(f"render would exceed {MAX_RENDER_PIXELS} pixels; reduce --scale")
        bitmap = page.render(scale=scale)
        image = bitmap.to_pil()
        width, height = image.size
        if width * height > MAX_RENDER_PIXELS:
            raise CaptureError(f"render would exceed {MAX_RENDER_PIXELS} pixels; reduce --scale")
        if crop is not None:
            left, top, right, bottom = crop
            if not (0 <= left < right <= width and 0 <= top < bottom <= height):
                raise CaptureError(f"crop must fit rendered page bounds 0,0,{width},{height}")
            image = image.crop((left, top, right, bottom))
        buffer = io.BytesIO()
        image.save(buffer, format="PNG", optimize=True)
        data = buffer.getvalue()
    except CaptureError:
        raise
    except Exception as error:
        raise CaptureError(f"could not render PDF page {page_number}: {error}") from error
    finally:
        if page is not None:
            page.close()
        if document is not None:
            document.close()

    _write_new(destination, data)
    result: dict[str, object] = {
        "kind": "pdf_render",
        "source_pdf": str(source),
        "pdf_page": page_number,
        "output": str(destination),
        "size_pixels": list(image.size),
        "scale": scale,
    }
    if crop is not None:
        result["crop_pixels"] = list(crop)
    return result


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)

    download_parser = subparsers.add_parser("download", help="download a direct HTTPS PNG, JPEG, or WebP image")
    download_parser.add_argument("--url", required=True, help="direct HTTPS URL of a permitted image asset")
    download_parser.add_argument("--output", required=True, type=Path, help="new descriptive .png, .jpg, .jpeg, or .webp path")
    download_parser.add_argument("--max-bytes", type=int, default=DEFAULT_MAX_BYTES, help="download cap (maximum 25 MiB)")
    download_parser.add_argument("--timeout", type=float, default=30.0, help="network timeout in seconds (maximum 120)")

    pdf_parser = subparsers.add_parser("render-pdf", help="render one selected PDF page or crop to a PNG")
    pdf_parser.add_argument("--pdf", required=True, type=Path, help="local PDF source")
    pdf_parser.add_argument("--page", required=True, type=int, help="1-based printed PDF page number")
    pdf_parser.add_argument("--output", required=True, type=Path, help="new descriptive PNG path")
    pdf_parser.add_argument("--scale", type=float, default=2.0, help="render scale from 0.25 to 8 (default 2)")
    pdf_parser.add_argument(
        "--crop",
        nargs=4,
        type=int,
        metavar=("LEFT", "TOP", "RIGHT", "BOTTOM"),
        help="optional crop rectangle in rendered pixel coordinates",
    )
    return parser


def main(argv: Sequence[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    try:
        if args.command == "download":
            result = download_image(args.url, args.output, args.max_bytes, args.timeout)
        else:
            crop = tuple(args.crop) if args.crop is not None else None
            result = render_pdf_page(args.pdf, args.page, args.output, args.scale, crop)
    except (CaptureError, OSError) as error:
        print(f"capture error: {error}", file=sys.stderr)
        return 1
    print(json.dumps(result, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
