<div align="center">

<a href="README.md"><img src="https://img.shields.io/badge/%F0%9F%87%BA%F0%9F%87%B8_English-Switch_language-FFD6E8?style=for-the-badge&labelColor=E4D7FF" alt="Switch to English"></a>

<a href="https://splitship.onrender.com"><img src="https://capsule-render.vercel.app/api?type=waving&color=0:FFD6E8,50:E4D7FF,100:C9F0FF&height=220&section=header&text=SplitShip&fontColor=6B5B95&fontSize=70&animation=twinkling&fontAlignY=36&desc=Split%20the%20bill%20%C2%B7%20Ship%20the%20code&descAlignY=58&descSize=20" width="100%" alt="SplitShip header"></a>

<a href="https://splitship.onrender.com"><img src="assets/logo.svg" width="130" alt="הלוגו של SplitShip"></a>

<a href="https://github.com/NoyaAdivi/splitship/actions"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&pause=900&color=8B7BF0&center=true&vCenter=true&width=620&lines=Dockerized+Node.js+API+%F0%9F%90%B3;Tested+on+every+push+%E2%9C%85;Built+%26+shipped+by+GitHub+Actions+%E2%9A%99%EF%B8%8F;Deployed+to+the+cloud+automatically+%E2%98%81%EF%B8%8F" alt="אנימציית הקלדה"></a>

<a href="https://github.com/NoyaAdivi/splitship/actions/workflows/ci.yml"><img src="https://github.com/NoyaAdivi/splitship/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
<a href="https://github.com/NoyaAdivi/splitship/actions/workflows/deploy.yml"><img src="https://github.com/NoyaAdivi/splitship/actions/workflows/deploy.yml/badge.svg" alt="Deploy"></a>
<a href="Dockerfile"><img src="https://img.shields.io/badge/Docker-multi--stage-C9F0FF?style=flat-square&logo=docker&logoColor=2496ED" alt="Docker"></a>
<a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-20%20%7C%2022-D4F7E0?style=flat-square&logo=node.js&logoColor=339933" alt="Node"></a>
<a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-FFD6E8?style=flat-square" alt="MIT"></a>

### [🚀 דמו חי](https://splitship.onrender.com) · [❤️ בדיקת תקינות](https://splitship.onrender.com/health) · [📦 אימג' Docker](https://github.com/NoyaAdivi/splitship/pkgs/container/splitship)

</div>

---

<div dir="rtl">

## 🌸 מה זה?

**SplitShip** הוא REST API קטן שמחלק חשבון מלון קבוצתי בין האורחים, מדויק עד האגורה האחרונה (בהשראת הפרויקט שלי [DiviStay](https://github.com/NoyaAdivi/DiviStay)).

הכוכב האמיתי הוא **פייפליין ה-DevOps** שמסביבו:

| | |
|---|---|
| 🐳 **Docker** | בנייה רב שלבית, מבוסס Alpine, רץ כמשתמש לא root, עם `HEALTHCHECK` מובנה |
| ✅ **בדיקות** | בדיקות יחידה ובדיקות API עם ה-test runner המובנה של Node וכיסוי קוד, על Node 20 ו-22 |
| ⚙️ **CI** | בכל push ו-PR: בדיקת תחביר, מטריצת בדיקות, בניית Docker ובדיקת עשן מול הקונטיינר הרץ |
| 📦 **Registry** | האימג' מתפרסם ב-GitHub Container Registry עם התגיות `latest` וה-SHA של הקומיט |
| ☁️ **CD** | אחרי שה-CI עובר על `main`, נשלחת פריסה ל-Render, והוורקפלואו מחכה עד ש-`/health` מחזיר את הקומיט החדש |

## 🛤️ הפייפליין

</div>

```mermaid
flowchart LR
    A([💻 git push]) --> B[🧪 בדיקות<br/>Node 20 + 22]
    B --> C[🐳 בניית Docker<br/>+ בדיקת עשן]
    C -->|רק main| D[📦 העלאה ל-GHCR]
    D --> E[☁️ פריסה ל-Render]
    E --> F([❤️ /health מציג<br/>את הקומיט החדש])
    style A fill:#FFD6E8,stroke:#B06AB3,color:#4B3F72
    style B fill:#E4D7FF,stroke:#8B7BF0,color:#4B3F72
    style C fill:#C9F0FF,stroke:#4FB3E8,color:#4B3F72
    style D fill:#D4F7E0,stroke:#4CAF7A,color:#4B3F72
    style E fill:#FFE9C9,stroke:#E8A34F,color:#4B3F72
    style F fill:#FFD6E8,stroke:#B06AB3,color:#4B3F72
```

<div dir="rtl">

## 🧰 טכנולוגיות

</div>

<p align="center">
  <a href="https://nodejs.org"><img src="https://skillicons.dev/icons?i=nodejs" alt="Node.js"></a>
  <a href="https://expressjs.com"><img src="https://skillicons.dev/icons?i=express" alt="Express"></a>
  <a href="https://www.docker.com"><img src="https://skillicons.dev/icons?i=docker" alt="Docker"></a>
  <a href="https://github.com/features/actions"><img src="https://skillicons.dev/icons?i=githubactions" alt="GitHub Actions"></a>
  <a href="https://www.linux.org"><img src="https://skillicons.dev/icons?i=linux" alt="Linux"></a>
  <a href="https://render.com"><img src="https://img.shields.io/badge/Render-cloud-E4D7FF?style=for-the-badge&logo=render&logoColor=46E3B7" height="48" alt="Render"></a>
</p>

<div dir="rtl">

## 🚀 הרצה

**עם Docker** (הדרך הקלה):

</div>

```bash
docker compose up --build
# open http://localhost:3000
```

<div dir="rtl">

**עם Node:**

</div>

```bash
npm install
npm test
npm start
```

<div dir="rtl">

## 🔌 ה-API

| שיטה | נתיב | מה זה עושה |
|---|---|---|
| `GET` | `/` | ממשק ווב בצבעי פסטל למחשבון |
| `GET` | `/health` | סטטוס, גרסה, SHA של הקומיט, זמן ריצה |
| `POST` | `/api/split` | חלוקת חשבון |

</div>

```bash
curl -X POST https://splitship.onrender.com/api/split \
  -H "content-type: application/json" \
  -d '{"total":1200,"mode":"nights","guests":[{"name":"Noya","nights":3},{"name":"Dana","nights":1}]}'
```
```json
{ "currency": "ILS", "mode": "nights", "total": 1200,
  "shares": [ { "name": "Noya", "amount": 900 }, { "name": "Dana", "amount": 300 } ] }
```

<div dir="rtl">

## 📁 מבנה הפרויקט

</div>

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

<div dir="rtl">

## 🔐 הגדרת פריסה (פעם אחת)

1. ב-[Render](https://dashboard.render.com) יוצרים **Web Service** מהריפו הזה (runtime: Docker) ומכבים **Auto-Deploy**.
2. מעתיקים את ה-**Deploy Hook URL** (בהגדרות).
3. בריפו נכנסים ל-[Settings → Secrets → Actions](https://github.com/NoyaAdivi/splitship/settings/secrets/actions) ומוסיפים `RENDER_DEPLOY_HOOK_URL`.
4. ב-[Settings → Variables](https://github.com/NoyaAdivi/splitship/settings/variables/actions) מוסיפים `APP_URL` = כתובת ה-Render שלך.

</div>

---

<div align="center">

נבנה באהבה 💜 על ידי [נויה עדיבי](https://github.com/NoyaAdivi)

<a href="https://github.com/NoyaAdivi"><img src="https://capsule-render.vercel.app/api?type=waving&color=0:C9F0FF,50:E4D7FF,100:FFD6E8&height=120&section=footer" width="100%" alt="footer"></a>

</div>
