# Rishit Sitholey — Analytics Engineer Portfolio (v2)

Dark-luxury, cinematic single-page portfolio. Vanilla HTML/CSS/JS — no frameworks, no build step.

## Structure
```
.
├── index.html        # markup
├── styles.css        # design system, glassmorphism, both themes
├── script.js         # loader, cursor, parallax, particles, orbit, palette, terminal
├── assets/
│   ├── rishit.jpg
│   └── Rishit_Sitholey_Resume.pdf   # wired to the Download résumé button
└── vercel.json
```

## Features
Loading screen · custom cursor + magnetic buttons · mouse spotlight & hero parallax ·
particle field · rotating 3D SQL cube · floating glass cards · scroll progress bar ·
section dots · dark/light theme toggle · animated counters · expandable case studies ·
skills orbit constellation (hover for notes) · terminal-style contact (opens your mail app) ·
⌘K command palette that also runs SQL (`SELECT * FROM projects`).

## Deploy
**Vercel:** push to GitHub → vercel.com → Add New Project → import repo → framework "Other" → Deploy.
**GitHub Pages:** repo Settings → Pages → deploy from main branch, root.

## Notes
- Fonts load from Google Fonts CDN (internet needed for correct typefaces).
- `prefers-reduced-motion` respected throughout; cursor/parallax auto-disable on touch devices.
- Theme choice persists via localStorage where available, degrades gracefully where not.
