#!/usr/bin/env python3
"""Fail when a local Markdown link points outside the repository or to a missing path."""
from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
LINK = re.compile(r"!?\[[^\]]*\]\(([^)]+)\)")
SKIP_PREFIXES = ("#", "http://", "https://", "mailto:", "tel:")


def markdown_files() -> list[Path]:
    files = [ROOT / "README.md", ROOT / "CONTRIBUTING.md"]
    files.extend((ROOT / "docs").rglob("*.md"))
    records = ROOT / "project-records"
    if records.exists():
        files.extend(records.rglob("*.md"))
    template = ROOT / ".github" / "pull_request_template.md"
    if template.exists():
        files.append(template)
    return sorted({path for path in files if path.exists()})


def local_target(source: Path, raw_target: str) -> Path | None:
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
        return (ROOT / path_text.lstrip("/")).resolve()
    return (source.parent / path_text).resolve()


def main() -> int:
    failures: list[str] = []
    for source in markdown_files():
        for line_number, line in enumerate(source.read_text(encoding="utf-8").splitlines(), start=1):
            for match in LINK.finditer(line):
                target = local_target(source, match.group(1))
                if target is None:
                    continue
                try:
                    target.relative_to(ROOT)
                except ValueError:
                    failures.append(f"{source.relative_to(ROOT)}:{line_number}: link escapes repository: {match.group(1)}")
                    continue
                if not target.exists():
                    failures.append(f"{source.relative_to(ROOT)}:{line_number}: missing target: {match.group(1)}")
    if failures:
        print("Documentation link check failed:")
        print("\n".join(f"- {failure}" for failure in failures))
        return 1
    print(f"Documentation links valid across {len(markdown_files())} Markdown files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
