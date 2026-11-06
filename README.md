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

## Cube Transform website case

The Method animation uses a fresh artist-oak simulator episode (seed 42). Four Stage1 observations are sampled from the recorded expert replay, the goal is independently generated with the built-in image-generation tool, and a fresh Astra session grounds pickup/place pixels in live RGB-D. The existing measured-pose controller executes the plan. The 12.27-second clip is actual simulator execution, not generated video. The selected run passed the unchanged evaluator with 0.01153 m final target error. Public asset metadata is in `dist/assets/cube-case/case.json`; complete local runs and generation prompts are retained under ignored `case_runs/`.

The website sequence reveals history frames every 360 ms, then advances through reference generation and control. The recorded clip is displayed at 2× only during the control phase while visible; it advances the sequence when it ends. No manual pause control is shown. The media asset retains its original timestamps.
