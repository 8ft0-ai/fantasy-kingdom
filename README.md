# ANNALS — a living kingdom in a single file

ANNALS is a seeded procedural fantasy kingdom that writes its own history. A realm is generated from the URL seed, time advances, people and houses pursue their interests, crises spread through the world, and significant events are recorded in the Chronicle while a cinematic director follows the story.

The deployed application remains intentionally small and static: `annals.html` is the generated single-file runtime, and `index.html` is a lightweight GitHub Pages entrypoint that preserves URL hash seeds.

## Start a kingdom locally

Serve the repository root:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/annals.html#s=1234567
```

See [Run ANNALS locally](docs/how-to/run-annals-locally.md) for the complete procedure, or follow [Explore your first kingdom](docs/tutorials/explore-your-first-kingdom.md) for a guided introduction.

## Documentation

The [ANNALS documentation](docs/README.md) is organised around what the reader is trying to do:

- learn the product through a guided experience;
- complete a particular task;
- look up exact technical information;
- understand the design and its trade-offs;
- inspect historical delivery and validation evidence.

## Development workflow

Maintainable source lives under `src/`. Regenerate the committed runtime after changing source:

```bash
python3 scripts/build.py
```

Verify it before committing:

```bash
python3 scripts/build.py --check
```

Commit source changes and the regenerated `annals.html` together. CI verifies the generated artefact, browser behaviour, Chronicle regressions, long-run stability and internal documentation links.

Use these guides for the supported workflow:

- [Change ANNALS source](docs/how-to/change-annals-source.md)
- [Verify the generated runtime](docs/how-to/verify-the-generated-runtime.md)
- [Run the regression baseline](docs/how-to/run-the-regression-baseline.md)

## Product constraints

ANNALS deliberately remains:

- a single static web application;
- vanilla JavaScript with Three.js r128 loaded from a CDN;
- free of frameworks, backends and browser persistence APIs;
- free of external textures, models and media assets;
- procedurally rendered;
- deterministic and shareable by URL hash seed.

The generation and history random streams are separate so that changes to world construction do not unnecessarily rewrite the realm's historical sequence.

## Repository shape

| Path | Purpose |
| --- | --- |
| `src/` | Maintainable source split by runtime subsystem. |
| `src/manifest.txt` | Ordered JavaScript module list used to generate the runtime. |
| `scripts/build.py` | Validates the source contract and builds or checks `annals.html`. |
| `annals.html` | Generated, deployable single-file application. |
| `index.html` | Lightweight GitHub Pages entrypoint that preserves seed hashes. |
| `docs/` | Tutorials, how-to guides, reference, explanation and project records. |

## Contributions

See [CONTRIBUTING.md](CONTRIBUTING.md) for the runtime, validation and documentation contribution contract.
