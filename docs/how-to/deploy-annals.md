# Deploy ANNALS

Use this guide when you want to publish the repository as a static site.

## GitHub Pages

Configure GitHub Pages to publish from the repository root on the intended deployment branch.

No deployment build command is required because the generated `annals.html` is committed to the repository.

After deployment, open the site root with a seed:

```text
https://<owner>.github.io/<repository>/#s=1234567
```

Confirm that `index.html` redirects to `annals.html` and preserves the hash.

## Other static hosts

Publish the repository root with:

- no build command;
- the repository root as the publish directory.

This model is suitable for static hosts such as Netlify.

## Pre-deployment check

Run:

```bash
python3 scripts/build.py --check
```

Then confirm the maintained seeds load successfully before publishing.
