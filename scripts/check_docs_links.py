#!/usr/bin/env python3
"""Compatibility entrypoint for the renamed local-target validator."""
from check_docs_targets import main

if __name__ == "__main__":
    raise SystemExit(main())
