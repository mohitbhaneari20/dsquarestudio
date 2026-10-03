# Design / Develop / Deploy motion clips

Source for the three looping videos in the home page's Design / Develop / Deploy cards
(`public/assets/home/design.mp4`, `develop.mp4`, `deploy.mp4`). Each is drawn on a canvas — no text, only objects.

- Preview: `node scripts/d-motion/server.mjs`, then open `http://localhost:5199/?scene=design` (or `develop`, `deploy`).
- Re-record one: open `http://localhost:5199/?scene=design&record=1` in Chrome and wait ~9 seconds. It records one 8-second loop at 1440 × 1080 and saves it into `public/assets/home/`.
