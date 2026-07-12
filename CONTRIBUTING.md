# Contributing to ANNALS

ANNALS uses GitHub issues and pull requests as its delivery record. Keep each change bounded, preserve the generated-runtime contract and include validation evidence appropriate to the affected subsystem.

## Documentation changes

Before adding or rewriting documentation, identify the reader's primary need:

- **Learn:** a guided tutorial that leads to a successful experience.
- **Do:** a how-to guide for a specific task.
- **Look up:** concise reference for exact commands, limits, interfaces or behaviour.
- **Understand:** explanation of concepts, rationale and trade-offs.

Give each page one dominant purpose. Link to another mode instead of duplicating its content. Do not place design rationale in reference pages or turn tutorials into exhaustive manuals.

When behaviour changes:

- update the canonical reference page for changed commands, controls, limits or interfaces;
- update or add a how-to guide when the change creates a new user or contributor task;
- update explanatory material when an architectural decision or trade-off changes;
- preserve issue validation documents as historical delivery evidence rather than current product guidance.

## Runtime changes

Edit maintainable source under `src/`, regenerate `annals.html`, and run:

```bash
python3 scripts/build.py --check
```

Commit source changes and generated output together. Use the maintained seeds and affected browser suites described in [Run the regression baseline](docs/how-to/run-the-regression-baseline.md).

## Pull-request checklist

- [ ] The issue scope and acceptance criteria are satisfied.
- [ ] User-visible behaviour changes are documented.
- [ ] Commands, paths, limits and debug interfaces are current.
- [ ] New documentation has one clear reader need.
- [ ] Historical validation evidence is not presented as current reference.
- [ ] Internal documentation links pass the repository link check.
- [ ] Generated-runtime and affected acceptance checks pass.
