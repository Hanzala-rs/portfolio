# Hanzala Rashid — Portfolio

Node.js (Express + EJS) portfolio. No build step.

```bash
npm install
npm start          # http://localhost:3000  (PORT env var to change)
npm run dev        # restarts on file changes
```

## What's where

| Path | What |
|---|---|
| `data/profile.js` | **All content** — summary, experience, the 5 featured GitHub repos, certifications, services, links. Edit this, not the HTML. |
| `services/github.js` | Fetches live stars / languages / last push for the featured repos (cached 1 h). Set `GITHUB_TOKEN` to raise the rate limit. |
| `views/index.ejs` | Page markup. |
| `public/css/style.css`, `public/js/main.js` | Styles and all animation (intro, particle portrait, swirl background, horizontal journey, 3D carousel, hex ring). |
| `public/assets/` | Resume PDF (served at `/resume`) and an optional `portrait.png`. |

## Your photo in the hero

Put a photo at `public/assets/portrait.png` and the hero particles will draw it.
Use a head-and-shoulders shot with the background removed (transparent PNG) — bright areas get more particles.
Without the file, a generated silhouette is used.

## Routes

- `/` — the portfolio
- `/api/projects` — featured projects with live GitHub stats (JSON)
- `/resume` — downloads the resume PDF
- `/healthz` — health check

Set `NODE_ENV=production` when deploying so static files are cached.
