# MedGraph DDI — Drug Interaction Checker

**[Open Live Preview](https://ais-pre-lmjhx7cm33zrq6ryn6ljk3-1004213561045.asia-east1.run.app)**

An interactive polypharmacy and drug-drug interaction (DDI) checker combining curated clinical pharmacology lookups with Graph Neural Network (GNN) link prediction visualization.

## Features

- **Active Regimen Tray**: Autocomplete medication search, dosage selectors, risk indicators, and one-click interaction analysis.
- **Interactive Mechanism Network**: Visualizes medications, CYP450/transporter enzymes, and target proteins with color- and pattern-coded interaction edges (Major, Moderate, Safe, and AI-Predicted GNN links), focus-and-dimming, and a simplified Pathways toggle.
- **Dual-Audience Explanations**: Switch between **Patient Mode** (plain-language takeaways, symptoms to watch for, next steps) and **Student/Clinical Mode** (PK/PD mechanisms, confidence scores, and GNNExplainer attribution paths).

## Hosting the Preview Page Directly on GitHub

This repository is pre-configured with a GitHub Pages workflow (`.github/workflows/deploy.yml`) and a relative Vite `base: './'` path so it works on `https://<your-username>.github.io/<your-repo>/`.

1. Push this project to your GitHub repository's `main` branch.
2. In your GitHub repository, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Once the workflow finishes, add your live link to the repository's **About** panel (gear icon on the main repo page → **Website**) using either:
   - Your GitHub Pages URL: `https://<your-username>.github.io/<your-repo>/`, or
   - Your shared preview URL: `https://ais-pre-lmjhx7cm33zrq6ryn6ljk3-1004213561045.asia-east1.run.app`

## Local Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```
