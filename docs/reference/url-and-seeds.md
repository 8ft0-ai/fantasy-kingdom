# URL and seed reference

ANNALS reads the active kingdom seed from the URL hash using the `s` parameter.

## Runtime URL

```text
annals.html#s=1234567
```

## Root entrypoint

```text
#s=1234567
```

When served from the repository root, `index.html` redirects to `annals.html` while preserving the hash.

## Maintained regression seeds

```text
#s=1234567
#s=987654
#s=424242
```

## Determinism contract

For the same application version, the same seed produces the same initial kingdom. Generation, culture, visual placement and history use deterministic tagged streams so that unrelated changes can preserve as much sequence stability as possible.

Historical outcomes also depend on the sequence and timing of user actions. Sharing a URL guarantees the same initial realm, not that two independently controlled sessions will remain identical after different interventions.

## Export filename

Chronicle export uses the active seed:

```text
annals-1234567.txt
```
