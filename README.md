# Shubham Sawant — Portfolio

Zero-dependency static site (HTML + CSS + vanilla JS + WebGL). No build step.

## Run
- Just open `index.html`, or serve the folder: `python3 -m http.server 8000` → http://localhost:8000
- Deploy: drag the folder onto Netlify / Vercel / GitHub Pages — it is already a finished site.

## Edit your content
`js/data.js` holds every project, skill, timeline entry and certificate.
- Add real links per project: set `live: 'https://…'` and `code: 'https://github.com/…'`
  (empty `code` falls back to your GitHub profile; empty `live` hides the Live button).
- Contact email / phone / socials are in `index.html` (search `shubhamsawant2205`).
- Résumé download: replace `assets/Shubham_Sawant_Resume.pdf`.

## The cursor-following character
`assets/body.webp` + `assets/head.webp` + `assets/depth.png` are cut from your cartoon.
`js/character.js` draws the head in WebGL with a depth-map parallax shader plus a CSS 3D
rotation, driven by a spring so it eases and slightly overshoots like a real head.
`js/assets-inline.js` embeds the head + depth textures so the site also works from file://.
If you change the head/depth images run `python3 tools/build_inline.py` to refresh it.

## Palette (from the avatar)
sky `#1e94f6` · royal `#1f5bff` · ink `#0b0c16` · cream `#fbfaf3` · peach `#ffb79b`
Fonts: Archivo (expanded, display) · Inter · JetBrains Mono — loaded from Google Fonts.
