# ANNALS runtime structure

This page is retained as a compatibility index for links created before the documentation was separated by reader need.

## Exact technical reference

- [Repository layout](reference/repository-layout.md)
- [Build and manifest](reference/build-and-manifest.md)
- [Runtime guards and debug interfaces](reference/runtime-guards-and-debug.md)
- [URL and seeds](reference/url-and-seeds.md)
- [Controls](reference/controls.md)
- [Product interface](reference/product-interface.md)
- [Chronicle, events and diagnostics](reference/chronicle-events-and-diagnostics.md)
- [Platform and performance](reference/platform-and-performance.md)

## Architecture and design explanation

- [Why ANNALS has modular source and a single-file runtime](explanation/modular-source-single-file-runtime.md)
- [Deterministic generation and history](explanation/deterministic-streams.md)
- [Simulation, Chronicle and cinematic direction](explanation/simulation-chronicle-and-director.md)
- [Adaptive rendering and local detail](explanation/adaptive-rendering-and-detail.md)

## Contributor procedures

- [Change ANNALS source](how-to/change-annals-source.md)
- [Verify the generated runtime](how-to/verify-the-generated-runtime.md)
- [Run the regression baseline](how-to/run-the-regression-baseline.md)

The source tree remains modular for maintenance, while the delivered application remains the generated `annals.html` file.