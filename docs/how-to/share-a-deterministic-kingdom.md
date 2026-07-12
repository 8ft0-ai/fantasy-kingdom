# Share a deterministic kingdom

Use this guide when you want another person to open the same initial ANNALS realm.

## Copy the active URL

Use **Copy link** in the ANNALS interface when the Clipboard API is available, or copy the browser URL directly.

The seed is stored in the URL hash as the `s` parameter:

```text
annals.html#s=1234567
```

The root entrypoint is also valid:

```text
#s=1234567
```

When served from the repository root, `index.html` redirects to `annals.html` while retaining the hash.

## Verify the shared realm

Open the copied link in a new browser session. Confirm that:

- the URL retains the same seed;
- the realm title and initial generated world match;
- the application clears **Forging the realm…**;
- the opening Chronicle is present.

The same seed reproduces the same initial kingdom. Subsequent historical outcomes remain deterministic only for the same application version when the sequence and timing of user actions also match.

## Create a different realm

Use **Reforge** to generate a new seed, then copy the resulting URL.

For the design behind deterministic generation and history, see [Deterministic generation and history](../explanation/deterministic-streams.md).