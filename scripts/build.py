#!/usr/bin/env python3
"""Build the deployable annals.html from validated modular source files."""
from __future__ import annotations

import argparse
import difflib
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
OUTPUT = ROOT / "annals.html"
STYLE_TOKEN = "{{ANNALS_STYLES}}"
SCRIPT_TOKEN = "{{ANNALS_SCRIPTS}}"
FORBIDDEN_BROWSER_STORAGE = re.compile(r"\b(?:localStorage|sessionStorage)\b")
REQUIRED_FIRST = "core/runtime.js"
REQUIRED_LAST = "simulation/chronicle-regression.js"
REQUIRED_MODULES = {
    "core/guards.js",
    "world/guards.js",
    "world/generation.js",
    "simulation/events.js",
    "simulation/history.js",
    "rendering/scene.js",
    "director/camera.js",
    "ui/interface.js",
    "core/debug.js",
    "boot.js",
}
ORDER_CONSTRAINTS = (
    ("core/runtime.js", "core/guards.js"),
    ("core/guards.js", "world/generation.js"),
    ("world/generation.js", "world/guards.js"),
    ("world/guards.js", "simulation/events.js"),
    ("simulation/events.js", "simulation/history.js"),
    ("simulation/history.js", "simulation/economy.js"),
    ("simulation/economy.js", "simulation/war.js"),
    ("simulation/war.js", "simulation/threats.js"),
    ("simulation/threats.js", "simulation/stability.js"),
    ("simulation/stability.js", "rendering/scene.js"),
    ("rendering/scene.js", "ui/interface.js"),
    ("director/camera.js", "director/cinematic.js"),
    ("rendering/performance.js", "rendering/performance-counts.js"),
    ("core/debug.js", "boot.js"),
    ("boot.js", "simulation/character-debug.js"),
)


def read_manifest() -> list[str]:
    manifest = [
        line.strip()
        for line in (SRC / "manifest.txt").read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.lstrip().startswith("#")
    ]
    if not manifest:
        raise RuntimeError("src/manifest.txt contains no JavaScript modules")
    return manifest


def validate_manifest(manifest: list[str]) -> dict[str, str]:
    if len(manifest) != len(set(manifest)):
        duplicates = sorted({item for item in manifest if manifest.count(item) > 1})
        raise RuntimeError(f"src/manifest.txt contains duplicate modules: {', '.join(duplicates)}")
    if manifest[0] != REQUIRED_FIRST:
        raise RuntimeError(f"src/manifest.txt must start with {REQUIRED_FIRST}")
    if manifest[-1] != REQUIRED_LAST:
        raise RuntimeError(f"src/manifest.txt must end with {REQUIRED_LAST}")
    missing_required = sorted(REQUIRED_MODULES.difference(manifest))
    if missing_required:
        raise RuntimeError(f"src/manifest.txt is missing required modules: {', '.join(missing_required)}")

    positions = {relative: index for index, relative in enumerate(manifest)}
    for before, after in ORDER_CONSTRAINTS:
        if positions[before] >= positions[after]:
            raise RuntimeError(f"manifest order requires {before} before {after}")

    source_root = SRC.resolve()
    sources: dict[str, str] = {}
    for relative in manifest:
        candidate = Path(relative)
        if candidate.is_absolute() or ".." in candidate.parts or candidate.suffix != ".js":
            raise RuntimeError(f"unsafe or unsupported manifest entry: {relative}")
        path = (SRC / candidate).resolve()
        try:
            path.relative_to(source_root)
        except ValueError as error:
            raise RuntimeError(f"manifest entry escapes src/: {relative}") from error
        if not path.is_file():
            raise RuntimeError(f"manifest module does not exist: {relative}")
        source = path.read_text(encoding="utf-8")
        if not source.strip():
            raise RuntimeError(f"manifest module is empty: {relative}")
        storage_match = FORBIDDEN_BROWSER_STORAGE.search(source)
        if storage_match:
            raise RuntimeError(f"browser persistence API {storage_match.group(0)} is forbidden in {relative}")
        sources[relative] = source
    return sources


def module_section(relative: str) -> str:
    if relative == "core/runtime.js":
        return "CONSTANTS, RNG & RUNTIME STATE"
    if relative == "core/guards.js" or relative == "world/guards.js":
        return "RUNTIME GUARDS & ASSERTIONS"
    if relative.startswith("world/"):
        return "WORLD GENERATION"
    if relative == "boot.js":
        return "ANIMATION & BOOT"
    if "debug" in relative or relative.endswith("regression.js"):
        return "DEBUG & ACCEPTANCE"
    if relative.startswith("simulation/"):
        return "SIMULATION & CHRONICLE SYSTEMS"
    if relative.startswith("rendering/"):
        return "RENDERING"
    if relative.startswith("director/"):
        return "CAMERA & DIRECTOR"
    if relative.startswith("ui/"):
        return "UI & CONTROLS"
    return "RUNTIME MODULE"


def render_scripts(manifest: list[str], sources: dict[str, str]) -> str:
    index_lines = [
        "/*",
        " * ANNALS GENERATED MODULE INDEX",
        " * Runtime order is defined by src/manifest.txt.",
        " * Generation and history RNG streams are separated in core/runtime.js.",
    ]
    index_lines.extend(f" * {index:02d}. {relative}" for index, relative in enumerate(manifest, start=1))
    index_lines.append(" */")

    modules = ["\n".join(index_lines)]
    total = len(manifest)
    for index, relative in enumerate(manifest, start=1):
        section = module_section(relative)
        banner = (
            "\n/* ============================================================\n"
            f" * ANNALS MODULE {index:02d}/{total:02d} · {section}\n"
            f" * Source: src/{relative}\n"
            " * ============================================================ */\n"
        )
        modules.append(banner + sources[relative].rstrip() + "\n")
    return "".join(modules).rstrip()


def build() -> str:
    shell = (SRC / "shell.html").read_text(encoding="utf-8")
    styles = (SRC / "styles.css").read_text(encoding="utf-8").removesuffix("\n")
    manifest = read_manifest()
    sources = validate_manifest(manifest)
    scripts = render_scripts(manifest, sources)
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
            print("annals.html is up to date and the manifest is valid")
            return 0
        diff = difflib.unified_diff(
            current.splitlines(),
            generated.splitlines(),
            fromfile="annals.html",
            tofile="generated annals.html",
            lineterm="",
        )
        print("\n".join(list(diff)[:200]))
        print("annals.html is stale; run: python3 scripts/build.py")
        return 1
    OUTPUT.write_text(generated, encoding="utf-8")
    print(f"Wrote {OUTPUT} ({len(generated)} characters, {len(read_manifest())} modules)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
