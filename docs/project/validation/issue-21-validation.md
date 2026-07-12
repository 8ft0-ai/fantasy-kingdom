# Issue #21 validation — single-file maintainability and repository baseline

This PR completes the remaining runtime work for issue #21 and is intended to close it.

## Previously delivered

PR #26 already supplied:

- the repository README and local-running guidance;
- seed sharing and Chronicle export instructions;
- static GitHub Pages and deployment notes;
- the documented generation/history RNG boundary;
- the initial runtime-structure note.

## Delivered in this PR

- A generated runtime-contract header in `annals.html` documenting version, Three.js compatibility and hard constraints.
- A generated module index derived from `src/manifest.txt`.
- Searchable section banners before every source module in the single-file runtime.
- Manifest validation for duplicate, missing, empty, unsafe and incorrectly ordered modules.
- Build rejection when runtime source introduces `localStorage` or `sessionStorage`.
- `ANNALS_RUNTIME_INFO` metadata and `ANNALS_GUARDS.summary()` diagnostics.
- Three.js r128 compatibility assertion before scene setup.
- Fresh-stream RNG probes proving deterministic generation and separation from history without consuming live RNG state.
- Generated-world assertions for required collections, unique IDs, valid ownership, road references and finite coordinates.
- Boot assertions for the scene, camera, renderer, canvas, named cast and initial Chronicle.
- A runtime guard Playwright pass for seeds `1234567`, `987654` and `424242`.
- Updated README and runtime-structure documentation.

## Acceptance criteria mapping

- **The app still runs as one HTML file with no build step:** `annals.html` remains the committed deployable runtime; source assembly is a repository maintenance command, not a deployment/runtime build.
- **Code sections are easy to locate and modify:** the generated module index and `Source: src/...` banners map every inline section back to its maintainable source file.
- **README explains running, sharing, export and deployment:** retained and expanded, including Netlify static deployment.
- **Generation/history RNG streams are documented:** documented and now asserted with independent probe streams.
- **Future issues can avoid unrelated rewrites:** feature source remains modular and the manifest enforces only load-bearing order constraints.
- **No browser persistence is introduced:** source generation and generated-runtime smoke checks reject the two browser storage APIs.

## Automated validation

The pull request must pass:

1. **Verify generated runtime** — manifest validation, generated-file freshness and inline JavaScript syntax.
2. **Browser smoke** — existing entrypoint, overlay and performance checks plus runtime guard checks for all three required seeds.
3. **Chronicle regression** — deterministic history and export invariants.
4. **Long-run soak** — 20-, 50- and 200-year stability evidence.

## Expected guard summary

For each required seed, `ANNALS_GUARDS.summary()` must report:

- Three.js revision `128`;
- runtime version `v0.8`;
- persistence contract `none`;
- reproducible and separated RNG digests;
- valid world shape with settlements, roads and buildings;
- ready boot state with named characters and Chronicle entries.

## Non-goals preserved

No framework, TypeScript migration, backend, runtime module loader, browser persistence, external asset pipeline or multi-file deployment is introduced.
