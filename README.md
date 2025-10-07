<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1ylFnSZqnFntYQScW-RRvfyohptfxWwAh

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Cloudflare Pages

- Framework: Vite (auto-detected by Cloudflare)
- Build command: `npm run build` (auto)
- Build output directory: `dist` (auto)
- Node version: `20` (pinned via `.nvmrc` and `package.json#engines`)

Steps (one-time in Cloudflare):
- Import this GitHub repo in Cloudflare Pages.
- Accept the detected defaults (framework: Vite, build: `npm run build`, output: `dist`).
- Optional: If you want real Gemini results, add an Environment Variable `GEMINI_API_KEY` in Project → Settings → Environment variables.

Included for Pages:
- `wrangler.toml` with `pages_build_output_dir = "dist"` for local `wrangler pages dev`.
- `public/_redirects` to ensure SPA-friendly routing to `index.html`.
- `public/_headers` for basic security and long-term asset caching.

Local preview of production build:
- `npm run build && npm run preview`
