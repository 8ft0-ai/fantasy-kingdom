You are working on ANNALS, a single-file procedural fantasy kingdom prototype.

Repository:
https://github.com/8ft0-ai/fantasy-kingdom

Target issue:
<PASTE ISSUE URL OR ISSUE NUMBER HERE>

Your job:
Deliver a working, tested pull request that materially addresses the nominated issue. Do not stop at analysis. Do not create only a plan. Implement the change, test it, and open a PR.

Project context:
ANNALS is a seeded, procedural, single-file fantasy kingdom simulation. The product is not just the 3D world; the Chronicle is the soul of the app. The kingdom should be watchable by default, with visible cause-and-effect, cinematic director behaviour, and deterministic sharing by URL seed.

Current architecture constraints:
- Main runtime file: `annals.html`.
- GitHub Pages root entrypoint: `index.html`.
- `index.html` should remain lightweight unless the issue explicitly requires otherwise.
- Single static web app.
- Vanilla JavaScript.
- Three.js r128 from CDN.
- No build step.
- No framework.
- No backend.
- No localStorage or sessionStorage.
- No external textures, models, or assets.
- Procedural visuals only.
- Preserve URL hash seed behaviour, e.g. `#s=1234567`.
- Preserve deterministic world generation.
- Preserve the design intent of separate generation/history randomness where applicable.
- Keep the app runnable from GitHub Pages.

Before coding:
1. Fetch and read the nominated issue.
2. Inspect the current repository, especially `annals.html`, `index.html`, and any README or notes.
3. Identify the acceptance criteria in the issue.
4. Rewrite those criteria into a concrete implementation checklist.
5. Identify which existing behaviours must not regress:
   - app loads past “Forging the realm…”
   - seeded generation works
   - Chronicle still receives entries
   - director/watch mode still works
   - time controls still work
   - export/share still works
   - GitHub Pages entrypoint still works
6. State the smallest coherent vertical slice that will satisfy the issue.

Implementation rules:
- Create a new branch from `main`.
- Keep the change focused on the target issue.
- Do not rewrite unrelated systems unless needed to satisfy the issue safely.
- Prefer clear, maintainable code over clever compression.
- Keep the single-file constraint, but organise new code into clearly named sections/functions.
- Add defensive guards around generation, simulation, rendering, and UI state where relevant.
- Avoid introducing unbounded arrays, runaway object creation, NaN state, or generation paths that can hang.
- When adding simulation behaviour, make it visible, inspectable, and Chronicle-worthy where appropriate.
- When adding visual behaviour, ensure it has a clear LOD/performance story.
- When adding controls, every visible control must either work or be clearly hidden until implemented.
- When adding Chronicle entries, include cause/consequence language where relevant.
- Preserve watchability by default.

Testing requirements:
At minimum:
- Verify the modified HTML/JavaScript is syntactically valid.
- Verify the app can load without getting stuck at “Forging the realm…”.
- Test at least these seeds:
  - `#s=1234567`
  - `#s=987654`
  - `#s=424242`
- Verify the issue-specific acceptance criteria.
- Verify that `index.html` still routes to `annals.html` and preserves hashes if it is touched.
- Verify that the Chronicle receives entries after the app starts.
- Verify that no obvious console/runtime errors are introduced.

If browser execution is available:
- Run the app in a browser.
- Observe default-speed behaviour for at least 60–120 seconds.
- Test at least one manual interaction relevant to the issue.
- Test one seed link directly.
- Capture a screenshot if useful.

If browser execution is not available:
- Say so explicitly in the PR.
- Perform the strongest available substitute checks.
- Explain what still requires manual browser validation.

PR requirements:
- Open a PR back to `main`.
- Use a clear PR title.
- Link the issue:
  - Use `Closes #<issue-number>` only if the issue is fully addressed.
  - Use `Refs #<issue-number>` if this is a partial but useful slice.
- PR body must include:
  - Summary
  - Issue acceptance criteria addressed
  - What changed
  - Testing performed
  - Seeds tested
  - Known limitations
  - Follow-up work, if any
- Do not merge the PR unless explicitly asked.

Definition of done:
The PR is not done merely because code was changed. It is done only when:
- the app still loads;
- the target issue has been materially addressed;
- the relevant behaviour is visible, inspectable, or recorded in the Chronicle;
- seed links still work;
- existing core behaviours have not obviously regressed;
- testing evidence is documented in the PR.

Escalation rule:
If the issue is too large to complete safely in one PR, do not attempt a sprawling rewrite. Deliver a coherent first slice that improves the app, clearly mark the PR as partial with `Refs #<issue-number>`, and document the remaining work.

Start now by reading the issue and repository. Then implement, test, and open the PR.
