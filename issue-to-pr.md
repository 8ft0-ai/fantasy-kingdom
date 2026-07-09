You are working on ANNALS, a single-file procedural fantasy kingdom prototype.

Repository:
https://github.com/8ft0-ai/fantasy-kingdom

Target issue:
<PASTE ISSUE URL OR ISSUE NUMBER HERE>

Goal:
Take the nominated GitHub issue from open backlog to a working, tested pull request. Do not just analyse the issue. Implement the change.

Project constraints:
- The app is a single-file static web app.
- Main runtime file is `annals.html`.
- `index.html` is only the GitHub Pages root entrypoint and should stay lightweight unless the issue explicitly says otherwise.
- Use vanilla JavaScript and Three.js r128 from CDN.
- No build step.
- No framework.
- No backend.
- No localStorage or sessionStorage.
- No external textures, models, or assets.
- Preserve deterministic seed behaviour via URL hash, e.g. `#s=1234567`.
- Preserve separate RNG intent for world generation and history/simulation where applicable.
- Keep the app runnable from GitHub Pages.

Working approach:
1. Fetch and read the nominated issue.
2. Inspect the current repo files, especially `annals.html`, `index.html`, and any README or project notes.
3. Summarise the issue in your own words and identify the smallest coherent vertical slice that satisfies the issue acceptance criteria.
4. Create a new branch from `main` using a clear branch name.
5. Implement the change.
6. Keep the implementation focused. Do not rewrite unrelated systems unless necessary.
7. Preserve existing working behaviour: seed generation, Chronicle, Watch mode, camera, controls, export, and GitHub Pages entrypoint.
8. Add defensive guards where a change could introduce generation stalls, NaN values, runaway object growth, or broken UI state.
9. Test the result before opening the PR.

Testing requirements:
- At minimum, verify the HTML/JavaScript is syntactically valid.
- Check the app can load without getting stuck at “Forging the realm…”.
- Test at least these seeds unless the issue requires others:
  - `#s=1234567`
  - `#s=987654`
  - `#s=424242`
- Verify the feature-specific acceptance criteria from the issue.
- Verify that `index.html` still routes to `annals.html` and preserves hashes if touched.
- If browser execution is available, run the app and observe it for at least 60–120 seconds at default speed.
- If browser execution is not available, say so clearly in the PR and provide the strongest available substitute checks.

Pull request requirements:
- Open a PR back to `main`.
- Link the issue using `Closes #<issue-number>` if the PR fully addresses it.
- If it only partially addresses the issue, use `Refs #<issue-number>` and explain what remains.
- PR body must include:
  - Summary
  - What changed
  - Testing performed
  - Known limitations or follow-up work
- Include screenshots only if the tool environment supports them.
- Do not merge the PR yourself unless explicitly asked.

Quality bar:
- The PR should leave the prototype more stable than it found it.
- The app must still be watchable by default.
- The Chronicle/director experience should not regress.
- Avoid cosmetic-only work unless the issue is explicitly visual.
- Prefer clear, maintainable code inside the single-file constraint.
- If the issue is too large, deliver a coherent first slice and document the remaining work in the PR.

Start now by reading the issue and repository, then proceed to implementation.
