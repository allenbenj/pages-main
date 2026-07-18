#!/usr/bin/env python3
"""Compress embedded data:image assets inside a draw.io XML file."""

from __future__ import annotations

import argparse
import base64
import io
import re
from pathlib import Path

from PIL import Image

# draw.io often stores embeds as data:image/png,<base64> without ";base64,".
DATA_URI_RE = re.compile(
    r"data:image/(png|jpeg|jpg|webp|gif)(?:;base64)?,([A-Za-z0-9+/=\s]+)",
    re.IGNORECASE,
)


def compress_image(
    raw: bytes,
    *,
    max_edge: int,
    jpeg_quality: int,
    webp_quality: int,
) -> tuple[str, bytes]:
    with Image.open(io.BytesIO(raw)) as im:
        im.load()
        has_alpha = im.mode in {"RGBA", "LA"} or (
            im.mode == "P" and "transparency" in im.info
        )
        if has_alpha:
            im = im.convert("RGBA")
        else:
            im = im.convert("RGB")

        w, h = im.size
        longest = max(w, h)
        if longest > max_edge:
            scale = max_edge / float(longest)
            im = im.resize(
                (max(1, int(w * scale)), max(1, int(h * scale))),
                Image.Resampling.LANCZOS,
            )

        out = io.BytesIO()
        if has_alpha:
            im.save(out, format="WEBP", quality=webp_quality, method=6)
            return "webp", out.getvalue()

        im.save(out, format="JPEG", quality=jpeg_quality, optimize=True, progressive=True)
        return "jpeg", out.getvalue()


def replace_data_uris(
    text: str,
    *,
    max_edge: int,
    jpeg_quality: int,
    webp_quality: int,
) -> tuple[str, dict]:
    stats = {
        "count": 0,
        "original_bytes": 0,
        "compressed_bytes": 0,
        "failures": 0,
    }

    def repl(match: re.Match[str]) -> str:
        kind = match.group(1).lower()
        b64 = re.sub(r"\s+", "", match.group(2))
        try:
            raw = base64.b64decode(b64, validate=False)
        except Exception:
            stats["failures"] += 1
            return match.group(0)

        stats["count"] += 1
        stats["original_bytes"] += len(raw)

        try:
            out_kind, out_bytes = compress_image(
                raw,
                max_edge=max_edge,
                jpeg_quality=jpeg_quality,
                webp_quality=webp_quality,
            )
        except Exception:
            # Keep original if a single image fails.
            stats["failures"] += 1
            stats["compressed_bytes"] += len(raw)
            return f"data:image/{kind};base64,{b64}"

        stats["compressed_bytes"] += len(out_bytes)
        encoded = base64.b64encode(out_bytes).decode("ascii")
        # Keep draw.io-compatible form without requiring ";base64,".
        return f"data:image/{out_kind},{encoded}"

    return DATA_URI_RE.sub(repl, text), stats


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--max-edge", type=int, default=1400)
    parser.add_argument("--jpeg-quality", type=int, default=72)
    parser.add_argument("--webp-quality", type=int, default=72)
    args = parser.parse_args()

    source = args.source
    output = args.output
    text = source.read_text(encoding="utf-8", errors="ignore")
    new_text, stats = replace_data_uris(
        text,
        max_edge=args.max_edge,
        jpeg_quality=args.jpeg_quality,
        webp_quality=args.webp_quality,
    )
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(new_text, encoding="utf-8")

    src_mb = source.stat().st_size / 1e6
    out_mb = output.stat().st_size / 1e6
    print(f"source: {source} ({src_mb:.2f} MB)")
    print(f"output: {output} ({out_mb:.2f} MB)")
    print(f"images: {stats['count']}")
    print(f"image_payload_in_mb: {stats['original_bytes'] / 1e6:.2f}")
    print(f"image_payload_out_mb: {stats['compressed_bytes'] / 1e6:.2f}")
    print(f"failures: {stats['failures']}")
    if src_mb:
        print(f"file_reduction: {(1 - out_mb / src_mb) * 100:.1f}%")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
