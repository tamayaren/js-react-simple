# Tiny Steps

A beginner-friendly JavaScript and React learning path. Each short lesson explains one idea with plain language, an everyday analogy, a small code sample, and a simple practice prompt.

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the local URL Vite prints. `npm run build` creates the production site; `npm run preview` serves it.

Edit lessons in `src/content.js`. Navigation uses bookmarkable URL hashes, search covers lesson titles and introductions, and each lesson links to authoritative documentation.

## GitHub Pages

Live URL: https://tamayaren.github.io/js-react-simple/

The Pages workflow builds and deploys on every push to `main`, or manually from the Actions tab. In repository **Settings → Pages**, set the publishing source to **GitHub Actions**. No `gh-pages` branch is needed.

Vite's base path is `/js-react-simple/`, so built assets load correctly under the repository URL. Change `base` in `vite.config.js` if you rename the repository or use a custom domain. The local development and preview URLs also include this path.

Article links use hashes (for example, `/js-react-simple/#state`), so direct links and refreshes work on GitHub Pages without server rewrites.

## Mobile support

Below 720px the sidebar becomes a collapsible lesson menu. Search expands when focused, code blocks scroll horizontally, and cards stack on narrow screens. Keyboard navigation and reduced-motion preferences are supported.
