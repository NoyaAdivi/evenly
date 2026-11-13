<div align="center">

<a href="README.he.md"><img src="https://img.shields.io/badge/%F0%9F%87%AE%F0%9F%87%B1_%D7%A2%D7%91%D7%A8%D7%99%D7%AA-Switch_language-FFD6E8?style=for-the-badge&labelColor=E4D7FF" alt="Switch to Hebrew"></a>

<a href="https://splitship.onrender.com"><img src="https://capsule-render.vercel.app/api?type=waving&color=0:FFD6E8,50:E4D7FF,100:C9F0FF&height=220&section=header&text=SplitShip&fontColor=6B5B95&fontSize=70&animation=twinkling&fontAlignY=36&desc=Split%20the%20bill%20%C2%B7%20Ship%20the%20code&descAlignY=58&descSize=20" width="100%" alt="SplitShip header"></a>

<a href="https://splitship.onrender.com"><img src="assets/logo.svg" width="130" alt="SplitShip logo"></a>

<a href="https://github.com/NoyaAdivi/splitship/actions"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&pause=900&color=8B7BF0&center=true&vCenter=true&width=620&lines=Dockerized+Node.js+API+%F0%9F%90%B3;Tested+on+every+push+%E2%9C%85;Built+%26+shipped+by+GitHub+Actions+%E2%9A%99%EF%B8%8F;Deployed+to+the+cloud+automatically+%E2%98%81%EF%B8%8F" alt="Typing animation"></a>

<a href="https://github.com/NoyaAdivi/splitship/actions/workflows/ci.yml"><img src="https://github.com/NoyaAdivi/splitship/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
<a href="https://github.com/NoyaAdivi/splitship/actions/workflows/deploy.yml"><img src="https://github.com/NoyaAdivi/splitship/actions/workflows/deploy.yml/badge.svg" alt="Deploy"></a>
<a href="Dockerfile"><img src="https://img.shields.io/badge/Docker-multi--stage-C9F0FF?style=flat-square&logo=docker&logoColor=2496ED" alt="Docker"></a>
<a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-20%20%7C%2022-D4F7E0?style=flat-square&logo=node.js&logoColor=339933" alt="Node"></a>
<a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-FFD6E8?style=flat-square" alt="MIT"></a>

### [🚀 Live demo](https://splitship.onrender.com) · [❤️ Health check](https://splitship.onrender.com/health) · [📦 Docker image](https://github.com/NoyaAdivi/splitship/pkgs/container/splitship)

</div>

---

## 🌸 What is this?

**SplitShip** is a small REST API that splits a group hotel bill between guests, exactly to the last agora (inspired by my project [DiviStay](https://github.com/NoyaAdivi/DiviStay)).

The real star is the **DevOps pipeline** around it:

| | |
|---|---|
| 🐳 **Docker** | Multi-stage, Alpine based, runs as a non-root user, built-in `HEALTHCHECK` |
| ✅ **Tests** | Unit + API tests with Node's built-in test runner and coverage, on Node 20 and 22 |
| ⚙️ **CI** | Every push and PR: lint, test matrix, Docker build and a smoke test against the running container |
| 📦 **Registry** | Image is published to GitHub Container Registry, tagged `latest` and with the commit SHA |
| ☁️ **CD** | After CI passes on `main`, Render is triggered to deploy, then the workflow waits until `/health` reports the new commit |

## 🛤️ The pipeline

```mermaid
flowchart LR
    A([💻 git push]) --> B[🧪 Tests<br/>Node 20 + 22]
    B --> C[🐳 Docker build<br/>+ smoke test]
    C -->|main only| D[📦 Push to GHCR]
    D --> E[☁️ Deploy to Render]
    E --> F([❤️ /health shows<br/>new commit])
    style A fill:#FFD6E8,stroke:#B06AB3,color:#4B3F72
    style B fill:#E4D7FF,stroke:#8B7BF0,color:#4B3F72
    style C fill:#C9F0FF,stroke:#4FB3E8,color:#4B3F72
    style D fill:#D4F7E0,stroke:#4CAF7A,color:#4B3F72
    style E fill:#FFE9C9,stroke:#E8A34F,color:#4B3F72
    style F fill:#FFD6E8,stroke:#B06AB3,color:#4B3F72
```

## 🧰 Tech stack

<p align="center">
  <a href="https://nodejs.org"><img src="https://skillicons.dev/icons?i=nodejs" alt="Node.js"></a>
  <a href="https://expressjs.com"><img src="https://skillicons.dev/icons?i=express" alt="Express"></a>
  <a href="https://www.docker.com"><img src="https://skillicons.dev/icons?i=docker" alt="Docker"></a>
  <a href="https://github.com/features/actions"><img src="https://skillicons.dev/icons?i=githubactions" alt="GitHub Actions"></a>
  <a href="https://www.linux.org"><img src="https://skillicons.dev/icons?i=linux" alt="Linux"></a>
  <a href="https://render.com"><img src="https://img.shields.io/badge/Render-cloud-E4D7FF?style=for-the-badge&logo=render&logoColor=46E3B7" height="48" alt="Render"></a>
</p>

## 🚀 Run it

**With Docker** (the easy way):
```bash
docker compose up --build
# open http://localhost:3000
```

**With Node:**
```bash
npm install
npm test
npm start
```

## 🔌 API

| Method | Path | What it does |
|---|---|---|
| `GET` | `/` | Pastel web UI for the calculator |
| `GET` | `/health` | Status, version, commit SHA, uptime |
| `POST` | `/api/split` | Split a bill |

```bash
curl -X POST https://splitship.onrender.com/api/split \
  -H "content-type: application/json" \
  -d '{"total":1200,"mode":"nights","guests":[{"name":"Noya","nights":3},{"name":"Dana","nights":1}]}'
```
```json
{ "currency": "ILS", "mode": "nights", "total": 1200,
  "shares": [ { "name": "Noya", "amount": 900 }, { "name": "Dana", "amount": 300 } ] }
```

## 📁 Project structure

```
splitship/
├── .github/workflows/
│   ├── ci.yml          # tests + docker build + smoke test
│   └── deploy.yml      # GHCR push + Render deploy
├── src/                # Express app + split logic
├── public/             # web UI
├── test/               # unit + API tests
├── Dockerfile          # multi-stage, non-root
├── docker-compose.yml
└── render.yaml         # Render blueprint
```

## 🔐 Deploy setup (one time)

1. On [Render](https://dashboard.render.com) create a **Web Service** from this repo (runtime: Docker), turn **Auto-Deploy off**.
2. Copy its **Deploy Hook URL** (Settings).
3. In this repo go to [Settings → Secrets → Actions](https://github.com/NoyaAdivi/splitship/settings/secrets/actions) and add `RENDER_DEPLOY_HOOK_URL`.
4. In [Settings → Variables](https://github.com/NoyaAdivi/splitship/settings/variables/actions) add `APP_URL` = your Render URL.

---

<div align="center">

Made with 💜 by [Noya Adivi](https://github.com/NoyaAdivi)

<a href="https://github.com/NoyaAdivi"><img src="https://capsule-render.vercel.app/api?type=waving&color=0:C9F0FF,50:E4D7FF,100:FFD6E8&height=120&section=footer" width="100%" alt="footer"></a>

</div>
