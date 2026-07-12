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

## Historical project records

The canonical archive is under [`project-records/`](project-records/README.md). Preserve these records as delivery evidence. Do not rewrite them to describe current behaviour; update current documentation under `docs/` instead. Compatibility stubs under `docs/` must remain when they protect existing inbound links.

## Documentation local-target validation

Run:

```bash
python3 scripts/check_docs_targets.py
python3 scripts/test_docs_targets.py
```

This validates inline local Markdown path existence across the root guidance, `docs/`, `project-records/` and the pull-request template. It does **not** validate heading anchors, reference-style links, rendered Markdown or external URLs. Passing this check is not evidence that documentation is semantically accurate.

## Runtime changes

Edit maintainable source under `src/`, regenerate `annals.html`, and run:

```bash
python3 scripts/build.py --check
```

Commit source changes and generated output together. Use the maintained seeds and affected browser suites described in [Run the regression baseline](docs/how-to/run-the-regression-baseline.md).

## Pull-request validation classes

Ordinary documentation-only changes skip Browser smoke, Chronicle regression and Long-run soak on the pull request. They still run Documentation local targets and Verify generated runtime.

The complete heavyweight pull-request matrix runs when a change touches runtime source, `annals.html`, `index.html`, the build contract, workflow definitions or `.github/scripts/**` browser and acceptance tests. Pushes to `main` remain unfiltered, and the complete matrix also runs every Monday through scheduled workflows and remains manually dispatchable.

Run `python3 scripts/check_ci_classification.py` to verify the repository's representative path-classification contract.

## Pull-request checklist

- [ ] The issue scope and acceptance criteria are satisfied.
- [ ] User-visible behaviour changes are documented.
- [ ] Commands, paths, limits and debug interfaces are current.
- [ ] New documentation has one clear reader need.
- [ ] Historical validation evidence is not presented as current reference.
- [ ] Documentation local targets pass `python3 scripts/check_docs_targets.py`.
- [ ] Generated-runtime and affected acceptance checks pass.
