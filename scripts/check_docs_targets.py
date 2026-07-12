#!/usr/bin/env python3
"""Fail when an inline local Markdown target escapes the repository or is missing.

This deliberately checks path existence only. It does not validate heading anchors,
reference-style links, rendered Markdown, or external URLs.
"""
from __future__ import annotations

import re
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
LINK = re.compile(r"!?\[[^\]]*\]\(([^)]+)\)")
SKIP_PREFIXES = ("#", "http://", "https://", "mailto:", "tel:")


def markdown_files(root: Path = ROOT) -> list[Path]:
    files = [root / "README.md", root / "CONTRIBUTING.md"]
    files.extend((root / "docs").rglob("*.md"))
    records = root / "project-records"
    if records.exists():
        files.extend(records.rglob("*.md"))
    template = root / ".github" / "pull_request_template.md"
    if template.exists():
        files.append(template)
    return sorted({path for path in files if path.exists()})


def local_target(root: Path, source: Path, raw_target: str) -> Path | None:
    target = raw_target.strip()
    if target.startswith("<") and target.endswith(">"):
        target = target[1:-1]
    if not target or target.startswith(SKIP_PREFIXES):
        return None
    target = target.split(maxsplit=1)[0]
    path_text = unquote(target.split("#", 1)[0].split("?", 1)[0])
    if not path_text:
        return None
    if path_text.startswith("/"):
        return (root / path_text.lstrip("/")).resolve()
    return (source.parent / path_text).resolve()


def check_targets(root: Path, files: list[Path]) -> list[str]:
    failures: list[str] = []
    root = root.resolve()
    for source in files:
        for line_number, line in enumerate(source.read_text(encoding="utf-8").splitlines(), start=1):
            for match in LINK.finditer(line):
                target = local_target(root, source, match.group(1))
                if target is None:
                    continue
                try:
                    target.relative_to(root)
                except ValueError:
                    failures.append(
                        f"{source.relative_to(root)}:{line_number}: target escapes repository: {match.group(1)}"
                    )
                    continue
                if not target.exists():
                    failures.append(
                        f"{source.relative_to(root)}:{line_number}: missing target: {match.group(1)}"
                    )
    return failures


def main() -> int:
    files = markdown_files(ROOT)
    failures = check_targets(ROOT, files)
    if failures:
        print("Documentation local-target check failed:")
        print("\n".join(f"- {failure}" for failure in failures))
        return 1
    print(f"Documentation local targets valid across {len(files)} Markdown files")
    print("Scope: inline local path existence only; anchors, reference-style links, rendering and external URLs are not checked")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
