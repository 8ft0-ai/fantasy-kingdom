#!/usr/bin/env python3
"""Extract the current single-file runtime into canonical subsystem sources.

This migration helper is intentionally separate from the normal build. Run it only
when bootstrapping or deliberately re-slicing an existing annals.html. After the
sources exist, scripts/build.py is the canonical path back to annals.html.
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "annals.html"
SRC = ROOT / "src"
STYLE_TOKEN = "{{ANNALS_STYLES}}"
SCRIPT_TOKEN = "{{ANNALS_SCRIPTS}}"

SECTIONS = [
    ("core/runtime.js", "'use strict';", "function riverFrom"),
    ("world/generation.js", "function riverFrom", "function dt("),
    ("simulation/history.js", "function dt(", "function setupScene"),
    ("rendering/scene.js", "function setupScene", "function renderChronicle"),
    ("ui/interface.js", "function renderChronicle", "function fly("),
    ("director/camera.js", "function fly(", "function runHeadless"),
    ("core/debug.js", "function runHeadless", "function boot("),
    ("boot.js", "function boot(", None),
]


def extract_tag(html: str, pattern: str, label: str) -> re.Match[str]:
    match = re.search(pattern, html, flags=re.DOTALL)
    if not match:
        raise RuntimeError(f"Could not locate {label} in annals.html")
    return match


def main() -> None:
    html = RUNTIME.read_text(encoding="utf-8")
    style = extract_tag(html, r"<style>\n(?P<body>.*?)\n</style>", "inline styles")
    scripts = list(re.finditer(r"<script(?:\s[^>]*)?>\n(?P<body>.*?)\n</script>", html, flags=re.DOTALL))
    inline = [match for match in scripts if "src=" not in match.group(0)]
    if len(inline) != 1:
        raise RuntimeError(f"Expected one inline runtime script, found {len(inline)}")
    script = inline[0]

    template = html
    replacements = [
        (script.start("body"), script.end("body"), SCRIPT_TOKEN),
        (style.start("body"), style.end("body"), STYLE_TOKEN),
    ]
    for start, end, token in sorted(replacements, reverse=True):
        template = template[:start] + token + template[end:]

    js = script.group("body")
    SRC.mkdir(parents=True, exist_ok=True)
    (SRC / "shell.html").write_text(template, encoding="utf-8")
    (SRC / "styles.css").write_text(style.group("body") + "\n", encoding="utf-8")

    manifest: list[str] = []
    cursor = 0
    for relative, start_marker, end_marker in SECTIONS:
        start = js.index(start_marker, cursor)
        if start != cursor:
            gap = js[cursor:start]
            if gap.strip():
                raise RuntimeError(f"Unexpected JavaScript between sections before {relative}")
        end = js.index(end_marker, start) if end_marker else len(js)
        body = js[start:end]
        path = SRC / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(body, encoding="utf-8")
        manifest.append(relative)
        cursor = end

    (SRC / "manifest.txt").write_text("\n".join(manifest) + "\n", encoding="utf-8")
    print(f"Extracted {len(manifest)} JavaScript modules from {RUNTIME.name}")


if __name__ == "__main__":
    main()
