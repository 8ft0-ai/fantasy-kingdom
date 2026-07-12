# Why ANNALS has modular source and a single-file runtime

ANNALS deliberately separates the way the application is maintained from the way it is delivered.

The source tree is divided into world generation, simulation, rendering, camera, interface and debug subsystems because those concerns evolve at different rates and have different dependency boundaries. Keeping them as separate source files makes review, testing and navigation practical.

The deployed product is nevertheless one generated `annals.html` file. This preserves the original constraint that a kingdom can be copied, hosted or opened as a small static artefact without a framework, backend, runtime module loader or production build service.

`scripts/build.py` is the boundary between those two models. It validates `src/manifest.txt`, assembles styles and scripts in the required order, and emits diagnostic module banners into the runtime. The generated structure is not an attempt to imitate a modern bundle format; it is a traceability mechanism for a deliberately simple deployment artefact.

Committing `annals.html` makes deployment independent of Python or Node.js. It also creates an important repository invariant: a source change is incomplete until the generated runtime changes with it. The `--check` mode and CI enforce that invariant.

This trade-off accepts a large generated file and explicit ordering rules in exchange for a very small operational surface. The source remains maintainable while the product remains a self-contained static application.

See [Build and manifest reference](../reference/build-and-manifest.md) for the exact contract and [Change ANNALS source](../how-to/change-annals-source.md) for the contributor procedure.
