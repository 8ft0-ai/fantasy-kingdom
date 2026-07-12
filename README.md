# ANNALS — a living kingdom in a single file

ANNALS is a seeded procedural fantasy kingdom that writes its own history. A realm is generated from the URL seed, time advances, people and houses pursue their interests, crises spread through the world, and significant events are recorded in the Chronicle while a cinematic director follows the story.

The deployed application remains intentionally small and static: `annals.html` is the generated single-file runtime, and `index.html` is a lightweight GitHub Pages entrypoint that preserves URL hash seeds.

## Start a kingdom locally

Serve the repository root:

```bash
python3 -m http.server 8000
```

Then open a maintained seed:

```text
http://localhost:8000/annals.html#s=1234567
```

The root URL also works and preserves the seed when it redirects:

```text
http://localhost:8000/#s=1234567
```

For a guided introduction, follow [Explore your first kingdom](docs/tutorials/explore-your-first-kingdom.md).

## Documentation

The [ANNALS documentation](docs/README.md) is organised around what the reader is trying to do:

- learn the product through a guided experience;
- complete a particular task;
- look up exact technical information;
- understand the design and its trade-offs;
- inspect delivery and validation evidence.

The documentation is being migrated incrementally so that every merged change leaves the repository usable and avoids placeholder pages.

## Development workflow

Maintainable source lives under `src/`. Regenerate the committed runtime after changing source:

```bash
python3 scripts/build.py
```

Verify that the generated runtime is current before committing:

```bash
python3 scripts/build.py --check
```

Commit source changes and the regenerated `annals.html` together. CI verifies the generated artefact, browser behaviour, Chronicle regressions and long-run simulation stability.

See [ANNALS runtime structure](docs/annals-runtime-structure.md) for the current source, manifest, runtime guard and simulation-order contracts.

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
| `docs/` | User, contributor, architecture and validation documentation. |

## Licence and contributions

Use the repository issue and pull-request workflow for changes. A dedicated documentation contribution guide will be added as the Diátaxis migration reaches its governance slice.
