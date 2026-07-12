# ANNALS documentation

ANNALS documentation is organised by reader intent. Choose the path that matches what you are trying to achieve rather than reading the documentation from beginning to end.

## Learn ANNALS

Guided learning material introduces the product through a complete experience.

- [Explore your first kingdom](tutorials/explore-your-first-kingdom.md) — run a maintained seed, observe the Chronicle, use Watch mode, inspect the realm, trigger an Act and export the result.

## Complete a task

Task-focused guides will cover local operation, source changes, deterministic sharing, Chronicle export, deployment and troubleshooting. Until those guides are extracted, the root [README](../README.md) contains the supported local start and build commands.

## Look up exact information

Reference material provides precise facts, contracts and limits. The current consolidated source is:

- [ANNALS runtime structure](annals-runtime-structure.md) — deployment model, generated sections, manifest rules, runtime guards, system order and maintained regression seeds.

This material will be split into smaller reference pages as the migration proceeds.

## Understand the design

Explanation material discusses why ANNALS uses a generated single-file runtime, separate deterministic random streams, bounded simulation collections and a Chronicle-led cinematic presentation. The current architectural discussion is included in [ANNALS runtime structure](annals-runtime-structure.md) and will be separated from exact reference material in a later slice.

## Inspect delivery evidence

The existing `issue-*-validation.md` documents record implementation and acceptance evidence for completed delivery issues. They remain historical project records rather than instructions for using the current product. A later migration slice will group them under a dedicated project-records area and mark superseded limitations explicitly.

## Documentation model

Each maintained page should have one dominant purpose:

- **Learn:** guide a reader through a successful experience.
- **Do:** help a reader complete a specific task.
- **Look up:** state exact behaviour, commands, limits or interfaces.
- **Understand:** explain concepts, rationale and trade-offs.

Pages may link across these purposes, but they should not combine them into one long manual. This is the practical application of the [Diátaxis](https://diataxis.fr/) documentation philosophy used by this repository.

## Current migration status

1. Documentation gateway and first tutorial — available in this documentation set.
2. Task-oriented how-to guides — planned next.
3. Reference and explanation separation — planned.
4. Historical validation archive and documentation governance — planned.

Every slice is intended to merge independently with working navigation and no empty placeholder pages.
