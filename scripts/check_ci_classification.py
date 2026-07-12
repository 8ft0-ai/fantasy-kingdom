#!/usr/bin/env python3
"""Verify the documented heavyweight pull-request path classification."""
from __future__ import annotations

from fnmatch import fnmatch
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HEAVY_PATTERNS = (
    "src/**",
    "annals.html",
    "index.html",
    "scripts/build.py",
    ".github/scripts/**",
    ".github/workflows/**",
)
HEAVY_WORKFLOWS = (
    ROOT / ".github/workflows/browser-smoke.yml",
    ROOT / ".github/workflows/chronicle-regression.yml",
    ROOT / ".github/workflows/long-run-soak.yml",
)


def requires_heavy_validation(paths: list[str]) -> bool:
    return any(fnmatch(path, pattern) for path in paths for pattern in HEAVY_PATTERNS)


def assert_workflow_contract(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    for pattern in HEAVY_PATTERNS:
        quoted = f"- '{pattern}'"
        if quoted not in text:
            raise AssertionError(f"{path.relative_to(ROOT)} is missing pull-request path {pattern}")
    for required in ("push:", "branches: [main]", "workflow_dispatch:", "schedule:", "cron:"):
        if required not in text:
            raise AssertionError(f"{path.relative_to(ROOT)} is missing {required}")


def main() -> int:
    cases = {
        "ordinary docs": (["docs/reference/product-interface.md"], False),
        "project records": (["project-records/validation/issue-11-validation.md"], False),
        "contribution guidance": (["CONTRIBUTING.md", ".github/pull_request_template.md"], False),
        "runtime source": (["src/simulation/history.js"], True),
        "generated runtime": (["annals.html"], True),
        "entrypoint": (["index.html"], True),
        "build contract": (["scripts/build.py"], True),
        "acceptance test": ([".github/scripts/tutorial-smoke.mjs"], True),
        "workflow policy": ([".github/workflows/browser-smoke.yml"], True),
        "mixed change": (["docs/README.md", "src/ui/product-surface.js"], True),
    }
    for name, (paths, expected) in cases.items():
        actual = requires_heavy_validation(paths)
        if actual != expected:
            raise AssertionError(f"{name}: expected heavy={expected}, got {actual} for {paths}")
    for workflow in HEAVY_WORKFLOWS:
        assert_workflow_contract(workflow)
    print(f"CI path classification passed for {len(cases)} representative path sets and {len(HEAVY_WORKFLOWS)} workflows")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
