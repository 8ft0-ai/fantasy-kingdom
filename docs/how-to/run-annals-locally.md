# Run ANNALS locally

Use this guide when you want to open the current repository version in a browser without changing the source.

## Start a static server

From the repository root, run:

```bash
python3 -m http.server 8000
```

Leave the process running while you use ANNALS.

## Open a maintained seed

Open:

```text
http://localhost:8000/annals.html#s=1234567
```

Alternatively, open the root entrypoint:

```text
http://localhost:8000/#s=1234567
```

`index.html` redirects to `annals.html` and preserves the seed hash.

## Confirm a successful start

A successful start has all of these outcomes:

- **Forging the realm…** disappears;
- the URL still contains `#s=1234567`;
- the generated realm is visible;
- the Chronicle contains opening entries;
- simulation controls respond.

Stop the local server with `Ctrl+C` in the terminal where it is running.

For a guided product experience, continue with [Explore your first kingdom](../tutorials/explore-your-first-kingdom.md). If the forge screen does not clear, use [Troubleshoot start-up](troubleshoot-start-up.md).
