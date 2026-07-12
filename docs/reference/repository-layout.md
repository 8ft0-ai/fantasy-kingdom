# Repository layout reference

| Path | Responsibility |
| --- | --- |
| `src/shell.html` | HTML shell and build placeholders for runtime styles and scripts. |
| `src/styles.css` | Runtime styles. |
| `src/core/` | Constants, random helpers, runtime state, assertions and debug foundations. |
| `src/world/` | Terrain, hydrology, resources, settlements, roads, procedural layouts and generated-world guards. |
| `src/simulation/` | Time, characters, economy, politics, crises, wars, Chronicle events, memory and long-run stability. |
| `src/rendering/` | Three.js scene, world meshes, overlays, atmosphere and performance controls. |
| `src/director/` | Camera movement, picking, following and cinematic direction. |
| `src/ui/` | Chronicle rendering, controls, inspectors, export and sharing. |
| `src/boot.js` | Browser boot path, dependency checks and event wiring. |
| `src/manifest.txt` | Ordered JavaScript module list used to generate the runtime. |
| `scripts/build.py` | Validates the source contract and builds or checks `annals.html`. |
| `annals.html` | Generated, committed, single-file deployable runtime. |
| `index.html` | Lightweight GitHub Pages entrypoint that preserves URL seed hashes. |
| `.github/scripts/` | Browser, regression, acceptance and soak-test programs. |
| `.github/workflows/` | Pull-request and `main` validation workflows. |
| `docs/tutorials/` | Guided learning experiences. |
| `docs/how-to/` | Task-oriented procedures. |
| `docs/reference/` | Exact commands, interfaces, limits and contracts. |
| `docs/explanation/` | Design rationale, concepts and trade-offs. |
| `project-records/` | Historical delivery and validation evidence, separate from current user-facing documentation. |

The maintainable source tree is modular. The deployed application is still the generated `annals.html`; there is no runtime module loader or production bundler.
