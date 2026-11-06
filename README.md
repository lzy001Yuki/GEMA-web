# GEMA-web

Project website for **GEMA: Generative Memory for Robotic Manipulation**.

Static HTML, CSS, JavaScript, SVG animations, and interactive evaluation charts. All files needed to serve the website are included in `dist/`; no dependencies or build step are required.

## Local preview

```bash
python3 -m http.server 8073 --directory dist
```

Open http://localhost:8073.

## Deploy on Netlify

1. In Netlify, choose **Add new project → Import an existing project → GitHub**.
2. Select **lzy001Yuki/GEMA-web** and branch **main**.
3. Leave **Base directory** and **Build command** empty. Set **Publish directory** to **dist** (also configured in `netlify.toml`).
4. Deploy. Subsequent pushes to `main` trigger a new deployment.

## Contents and provenance

- `dist/index.html`, `style.css`, `app.js`: responsive website and animated method schematic.
- `dist/assets/`: paper, scientific figures, fonts, provider icons, and chart data.
- `QUERY_TYPES.md`: query-type audit and generator provenance.

Scientific content was prepared from the supplied camera-ready Overleaf project and poster. The website author list and affiliations follow the current poster. The supplied paper PDF still contains its original placeholder authors; replace `dist/assets/GEMA-paper.pdf` when the final document is ready.

Con-Q charts preserve every supplied point from the main Astra configuration. `dist/assets/conq-data.json` contains digitized visual readbacks rather than rollout-log estimates. All/Astra/Pi05/DreamZero filtering preserves the with/without-memory pairs; no smoothing or extrapolation is used.

Provider icons illustrate the modular model interface. They do not imply that all depicted providers were evaluated. Asset provenance is recorded in `dist/assets/brands/provenance.json`.
