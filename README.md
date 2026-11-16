<p align="center">
  <a href="https://evenly-app.onrender.com"><img src="docs/readme/banner-en.svg" width="100%" alt="Evenly: split any bill, end up even"></a>
</p>

<p align="center"><a href="README.he.md"><img src="docs/readme/lang-he.svg" height="44" alt="לגרסה בעברית"></a></p>

<p align="center">
  <a href="https://evenly-app.onrender.com"><img src="https://img.shields.io/badge/Open_live_demo-FFD5C9?style=for-the-badge&logo=googlechrome&logoColor=A8483A" alt="Open live demo"></a>
  <a href="https://github.com/NoyaAdivi/evenly/actions"><img src="https://img.shields.io/badge/See_the_pipeline-D9F3E7?style=for-the-badge&logo=githubactions&logoColor=1F7350" alt="See the pipeline"></a>
  <a href="https://evenly-app.onrender.com/health"><img src="https://img.shields.io/badge/Health_check-DAD5FF?style=for-the-badge&logo=statuspage&logoColor=5548C8" alt="Health check"></a>
</p>

<p align="center">
  <a href="https://github.com/NoyaAdivi/evenly/actions/workflows/ci.yml"><img src="https://github.com/NoyaAdivi/evenly/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://github.com/NoyaAdivi/evenly/actions/workflows/deploy.yml"><img src="https://github.com/NoyaAdivi/evenly/actions/workflows/deploy.yml/badge.svg" alt="Deploy"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/NoyaAdivi/evenly?color=DAD5FF&labelColor=5548C8" alt="License"></a>
  <a href="https://github.com/NoyaAdivi/evenly/commits/main"><img src="https://img.shields.io/github/last-commit/NoyaAdivi/evenly?color=FFD5C9&labelColor=A8483A" alt="Last commit"></a>
</p>

<h3 align="center">Split any bill. End up even.</h3>

<p align="center">
  Evenly splits any bill between friends, <b>exactly to the last agora</b>: scan a restaurant receipt, split per dish or just the drinks,<br>send a group link where everyone taps their own items, split hotel nights or a whole trip.<br>
  Under the hood, every push is tested, containerized and deployed to the cloud on its own.
</p>

<table align="center">
  <tr>
    <td align="center" width="25%"><a href="Dockerfile"><b>🐳 Docker</b></a><br><sub>multi-stage, non-root</sub></td>
    <td align="center" width="25%"><a href="https://github.com/NoyaAdivi/evenly/actions/workflows/ci.yml"><b>✅ 2 × Node</b></a><br><sub>tests on 20 and 22</sub></td>
    <td align="center" width="25%"><a href="https://github.com/NoyaAdivi/evenly/pkgs/container/evenly"><b>📦 GHCR</b></a><br><sub>image tagged per commit</sub></td>
    <td align="center" width="25%"><a href="https://evenly-app.onrender.com"><b>☁️ Auto deploy</b></a><br><sub>to Render after CI</sub></td>
  </tr>
</table>

<p align="center">
  <a href="https://evenly-app.onrender.com"><img src="docs/social/evenly-github-en.png" width="100%" alt="Evenly: split any bill, end up even"></a>
</p>

<a name="what"></a>
<p align="center"><a href="#pipeline"><img src="docs/readme/what-en.svg" width="100%" alt="What is Evenly"></a></p>

<table>
  <tr valign="top">
    <td valign="top" width="33%">
      <p><b>🐳 Containerized</b></p>
      <ul>
        <li><a href="Dockerfile"><b>Multi-stage build</b></a> on Alpine, small image</li>
        <li><b>Runs as non-root</b> user</li>
        <li><b>Built-in HEALTHCHECK</b> on <code>/health</code></li>
        <li><a href="docker-compose.yml"><b>docker compose up</b></a> and it runs</li>
      </ul>
    </td>
    <td valign="top" width="33%">
      <p><b>✅ Tested on every push</b></p>
      <ul>
        <li><a href="test"><b>Unit and API tests</b></a> with Node's built-in runner</li>
        <li><b>Matrix</b> on Node 20 and 22, with coverage</li>
        <li><b>Smoke test</b> against the real running container</li>
        <li>A failed test <b>stops the deploy</b></li>
      </ul>
    </td>
    <td valign="top" width="33%">
      <p><b>☁️ Deploys itself</b></p>
      <ul>
        <li><a href="https://github.com/NoyaAdivi/evenly/pkgs/container/evenly"><b>Image pushed to GHCR</b></a>, tagged <code>latest</code> and per commit</li>
        <li><b>Render deploy</b> triggered only after CI passes</li>
        <li><b>Verifies the release</b>: waits until <code>/health</code> shows the new commit</li>
        <li><a href="https://evenly-app.onrender.com"><b>Pastel web UI</b></a> to try it in the browser</li>
      </ul>
    </td>
  </tr>
</table>

<a name="pipeline"></a>
<p align="center"><a href="#tech-stack"><img src="docs/readme/pipeline-en.svg" width="100%" alt="The pipeline"></a></p>

```mermaid
flowchart LR
  A([💻 git push]) --> B{🧪 Tests<br/>Node 20 + 22}
  B -->|pass| C([🐳 Docker build<br/>+ smoke test])
  B -->|fail| X([❌ Stop, nothing deploys])
  C -->|main only| D([📦 Push image to GHCR])
  D --> E([☁️ Deploy to Render])
  E --> F([❤️ /health reports<br/>the new commit])
  style A fill:#FFE6DE,stroke:#E36E57,color:#2C2668
  style B fill:#E8E4FF,stroke:#6F60F0,color:#2C2668
  style C fill:#D9F3E7,stroke:#1F7350,color:#1F4D38
  style X fill:#FBD5E0,stroke:#A03A5C,color:#5C1F33
  style D fill:#DAD5FF,stroke:#5548C8,color:#2C2668
  style E fill:#FFF1C9,stroke:#B98A1E,color:#5C4410
  style F fill:#D9F3E7,stroke:#1F7350,color:#1F4D38
```

<p align="center"><sub>Workflows: <a href=".github/workflows/ci.yml">ci.yml</a> · <a href=".github/workflows/deploy.yml">deploy.yml</a></sub></p>

<a name="tech-stack"></a>
<p align="center"><a href="#api"><img src="docs/readme/stack-en.svg" width="100%" alt="Tech stack"></a></p>

<p align="center"><b>App</b><br>
<a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js_22-DAD5FF?style=for-the-badge&logo=nodedotjs&logoColor=5548C8" alt="Node.js 22"></a>
<a href="https://expressjs.com"><img src="https://img.shields.io/badge/Express-DAD5FF?style=for-the-badge&logo=express&logoColor=5548C8" alt="Express"></a>
</p>

<p align="center"><b>Container</b><br>
<a href="https://www.docker.com"><img src="https://img.shields.io/badge/Docker-FBD5E0?style=for-the-badge&logo=docker&logoColor=A03A5C" alt="Docker"></a>
<a href="https://alpinelinux.org"><img src="https://img.shields.io/badge/Alpine_Linux-FBD5E0?style=for-the-badge&logo=alpinelinux&logoColor=A03A5C" alt="Alpine Linux"></a>
<a href="https://github.com/NoyaAdivi/evenly/pkgs/container/evenly"><img src="https://img.shields.io/badge/GHCR-FBD5E0?style=for-the-badge&logo=github&logoColor=A03A5C" alt="GHCR"></a>
</p>

<p align="center"><b>CI / CD</b><br>
<a href="https://github.com/NoyaAdivi/evenly/actions"><img src="https://img.shields.io/badge/GitHub_Actions-D9F3E7?style=for-the-badge&logo=githubactions&logoColor=1F7350" alt="GitHub Actions"></a>
<a href="https://nodejs.org/api/test.html"><img src="https://img.shields.io/badge/node:test-D9F3E7?style=for-the-badge&logo=nodedotjs&logoColor=1F7350" alt="node:test"></a>
</p>

<p align="center"><b>Cloud</b><br>
<a href="https://render.com"><img src="https://img.shields.io/badge/Render-FFD5C9?style=for-the-badge&logo=render&logoColor=A8483A" alt="Render"></a>
</p>

<a name="api"></a>
<p align="center"><a href="#run-locally"><img src="docs/readme/api-en.svg" width="100%" alt="API"></a></p>

| Method | Path | What it does |
|---|---|---|
| `GET` | [`/`](https://evenly-app.onrender.com) | Pastel web UI with 10 ways to split: receipt scan, per dish, food & drinks, group link, equally, percent, shares, exact amounts, hotel nights, trip expenses |
| `GET` | [`/health`](https://evenly-app.onrender.com/health) | Status, version, commit SHA, uptime |
| `POST` | `/api/split` | Split a bill: `equal`, `nights` (hotel), `items` (per dish), `percent`, `shares`, `exact` or `pools` (food, drinks, taxi... each split only between its people), with optional `tipPercent`, `treat` (birthday: others pay for them) and `roundTo` (round shares up, no coins) |
| `POST` | `/api/settle` | Trip expenses with several payers to the fewest transfers (who pays whom) |
| `POST` | `/api/receipt/parse` | Turn scanned receipt text (Hebrew or English) into dishes with categories, total and service charge |
| `POST` | `/api/rooms` | Open a group link (lives 24h in memory) |
| `GET` | `/api/rooms/:id` | Live room: items, who claimed what, totals |
| `POST` | `/api/rooms/:id/claim` | A friend taps an item as theirs (`/join` adds a name) |

```bash
curl -X POST https://evenly-app.onrender.com/api/split \
  -H "content-type: application/json" \
  -d '{"total":1200,"mode":"nights","guests":[{"name":"Noya","nights":3},{"name":"Dana","nights":1}]}'
```
```json
{ "currency": "ILS", "mode": "nights", "total": 1200,
  "shares": [ { "name": "Noya", "amount": 900 }, { "name": "Dana", "amount": 300 } ] }
```

<a name="run-locally"></a>
<p align="center"><a href="#deploy-setup"><img src="docs/readme/run-en.svg" width="100%" alt="Run it locally"></a></p>

**With Docker:**
```bash
docker compose up --build
# open http://localhost:3000
```

**With Node 20+:**
```bash
npm install
npm test
npm start
```

<a name="deploy-setup"></a>
<p align="center"><a href="#contact"><img src="docs/readme/deploy-en.svg" width="100%" alt="Deploy setup"></a></p>

1. On [Render](https://dashboard.render.com) create a **Web Service** from this repo, language **Docker**, and turn **Auto-Deploy off**.
2. Copy the service's **Deploy Hook** URL from its settings.
3. Add it as the secret `RENDER_DEPLOY_HOOK_URL` in [Settings → Secrets → Actions](https://github.com/NoyaAdivi/evenly/settings/secrets/actions).
4. Add your Render address as the variable `APP_URL` in [Settings → Variables → Actions](https://github.com/NoyaAdivi/evenly/settings/variables/actions).

> [!IMPORTANT]
> The deploy hook URL is a secret. Keep it only in GitHub Secrets, never in the code.

<details>
<summary><b>📂 Project structure</b></summary>

```
├── .github/workflows/
│   ├── ci.yml          tests on Node 20 + 22, Docker build, smoke test
│   └── deploy.yml      push image to GHCR, deploy to Render, wait for /health
├── src/
│   ├── split.js        the splitting logic (exact to the agora)
│   ├── app.js          Express app and routes
│   └── server.js       entry point with graceful shutdown
├── public/             pastel web UI
├── test/               unit + API tests (node:test)
├── docs/               README art and social images
├── Dockerfile          multi-stage, non-root, HEALTHCHECK
├── docker-compose.yml
└── render.yaml         Render blueprint
```
</details>

<a name="contact"></a>
<p align="center"><a href="https://www.linkedin.com/in/noya-adivi/"><img src="docs/readme/footer-en.svg" width="100%" alt="Built by Noya Adivi"></a></p>

<p align="center">
  <a href="https://evenly-app.onrender.com"><img src="https://img.shields.io/badge/Open_Evenly-FFD5C9?style=for-the-badge&logo=googlechrome&logoColor=A8483A" alt="demo"></a>
  <a href="https://www.linkedin.com/in/noya-adivi/"><img src="https://img.shields.io/badge/LinkedIn-DAD5FF?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzU1NDhDOCIgZD0iTTIwLjQ1IDIwLjQ1aC0zLjU2di01LjU3YzAtMS4zMy0uMDMtMy4wNC0xLjg1LTMuMDQtMS44NiAwLTIuMTQgMS40NS0yLjE0IDIuOTR2NS42N0g5LjM1VjloMy40MXYxLjU2aC4wNWMuNDgtLjkgMS42NC0xLjg1IDMuMzctMS44NSAzLjYgMCA0LjI3IDIuMzcgNC4yNyA1LjQ2djYuMjh6TTUuMzQgNy40M2EyLjA2IDIuMDYgMCAxIDEgMC00LjEzIDIuMDYgMi4wNiAwIDAgMSAwIDQuMTN6TTcuMTIgMjAuNDVIMy41NlY5aDMuNTZ2MTEuNDV6TTIyLjIyIDBIMS43N0MuNzkgMCAwIC43NyAwIDEuNzN2MjAuNTRDMCAyMy4yMy43OSAyNCAxLjc3IDI0aDIwLjQ1Yy45OCAwIDEuNzgtLjc3IDEuNzgtMS43M1YxLjczQzI0IC43NyAyMy4yIDAgMjIuMjIgMHoiLz48L3N2Zz4=" alt="LinkedIn"></a>
  <a href="https://noyaadivi.github.io/noya-website"><img src="https://img.shields.io/badge/Portfolio-D9F3E7?style=for-the-badge&logo=githubpages&logoColor=1F7350" alt="Portfolio"></a>
  <a href="https://github.com/NoyaAdivi"><img src="https://img.shields.io/badge/More_projects-FBD5E0?style=for-the-badge&logo=github&logoColor=A03A5C" alt="More projects"></a>
</p>
