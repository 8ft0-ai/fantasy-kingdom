#!/usr/bin/env python3
"""Deterministic positive and negative fixtures for check_docs_targets.py."""
from __future__ import annotations

import tempfile
from pathlib import Path

from check_docs_targets import check_targets


def main() -> int:
    with tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        docs = root / "docs"
        docs.mkdir()
        target = docs / "target.md"
        source = docs / "source.md"
        target.write_text("# Target\n", encoding="utf-8")

        source.write_text("[valid](target.md)\n", encoding="utf-8")
        assert check_targets(root, [source]) == [], "existing local target should pass"

        source.write_text("[missing](missing.md)\n", encoding="utf-8")
        failures = check_targets(root, [source])
        assert len(failures) == 1 and "missing target" in failures[0], "missing local target should fail"

        source.write_text("[escape](../../outside.md)\n", encoding="utf-8")
        failures = check_targets(root, [source])
        assert len(failures) == 1 and "escapes repository" in failures[0], "escaping target should fail"

        source.write_text("[external](https://example.com)\n[anchor](#section)\n", encoding="utf-8")
        assert check_targets(root, [source]) == [], "external URLs and same-page anchors are outside this checker"

    print("Documentation local-target fixtures passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
