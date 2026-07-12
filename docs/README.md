# ANNALS documentation

ANNALS documentation is organised by reader intent. Choose the path that matches what you are trying to achieve rather than reading the documentation from beginning to end.

## Learn ANNALS

- [Explore your first kingdom](tutorials/explore-your-first-kingdom.md) — run a maintained seed, observe the Chronicle, use Watch mode, inspect the realm, trigger an Act and export the result.

## Complete a task

- [Run ANNALS locally](how-to/run-annals-locally.md)
- [Change ANNALS source](how-to/change-annals-source.md)
- [Verify the generated runtime](how-to/verify-the-generated-runtime.md)
- [Share a deterministic kingdom](how-to/share-a-deterministic-kingdom.md)
- [Export the Chronicle](how-to/export-the-chronicle.md)
- [Deploy ANNALS](how-to/deploy-annals.md)
- [Troubleshoot start-up](how-to/troubleshoot-start-up.md)
- [Run the regression baseline](how-to/run-the-regression-baseline.md)

## Look up exact information

- [Controls](reference/controls.md)
- [URL and seeds](reference/url-and-seeds.md)
- [Repository layout](reference/repository-layout.md)
- [Build and manifest](reference/build-and-manifest.md)
- [Runtime guards and debug interfaces](reference/runtime-guards-and-debug.md)
- [Platform and performance](reference/platform-and-performance.md)

The former [ANNALS runtime structure](annals-runtime-structure.md) page remains as a compatibility index for older links.

## Understand the design

- [Why ANNALS has modular source and a single-file runtime](explanation/modular-source-single-file-runtime.md)
- [Deterministic generation and history](explanation/deterministic-streams.md)
- [Simulation, Chronicle and cinematic direction](explanation/simulation-chronicle-and-director.md)
- [Adaptive rendering and local detail](explanation/adaptive-rendering-and-detail.md)

## Inspect delivery evidence

- [Project records](project/README.md)
- [Issue validation archive](project/validation/README.md)

These records preserve delivery evidence and superseded limitations. They are not current product reference.

## Documentation model

Each maintained page should have one dominant purpose:

- **Learn:** guide a reader through a successful experience.
- **Do:** help a reader complete a specific task.
- **Look up:** state exact behaviour, commands, limits or interfaces.
- **Understand:** explain concepts, rationale and trade-offs.

Pages may link across these purposes, but they should not combine them into one long manual. This is the practical application of the [Diátaxis](https://diataxis.fr/) documentation philosophy used by this repository.

## Migration status

The initial Diátaxis migration is complete: the repository has a reader gateway, a tested tutorial, task guides, technical reference, architectural explanation, historical project records and automated internal-link validation.

See [CONTRIBUTING](../CONTRIBUTING.md) for the documentation maintenance contract.
