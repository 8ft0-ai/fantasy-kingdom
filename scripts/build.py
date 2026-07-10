#!/usr/bin/env python3
"""Build the deployable annals.html from modular source files."""
from __future__ import annotations

import argparse
import difflib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
OUTPUT = ROOT / "annals.html"
STYLE_TOKEN = "{{ANNALS_STYLES}}"
SCRIPT_TOKEN = "{{ANNALS_SCRIPTS}}"


def build() -> str:
    shell = (SRC / "shell.html").read_text(encoding="utf-8")
    styles = (SRC / "styles.css").read_text(encoding="utf-8").removesuffix("\n")
    manifest = [line.strip() for line in (SRC / "manifest.txt").read_text(encoding="utf-8").splitlines() if line.strip()]
    if not manifest:
        raise RuntimeError("src/manifest.txt contains no JavaScript modules")
    scripts = "".join((SRC / relative).read_text(encoding="utf-8") for relative in manifest)
    if shell.count(STYLE_TOKEN) != 1 or shell.count(SCRIPT_TOKEN) != 1:
        raise RuntimeError("src/shell.html must contain each build token exactly once")
    return shell.replace(STYLE_TOKEN, styles).replace(SCRIPT_TOKEN, scripts)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="fail if annals.html differs from generated output")
    args = parser.parse_args()
    generated = build()
    if args.check:
        current = OUTPUT.read_text(encoding="utf-8")
        if current == generated:
            print("annals.html is up to date")
            return 0
        diff = difflib.unified_diff(current.splitlines(), generated.splitlines(), fromfile="annals.html", tofile="generated annals.html", lineterm="")
        print("\n".join(list(diff)[:200]))
        print("annals.html is stale; run: python3 scripts/build.py")
        return 1
    OUTPUT.write_text(generated, encoding="utf-8")
    print(f"Wrote {OUTPUT} ({len(generated)} characters)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
