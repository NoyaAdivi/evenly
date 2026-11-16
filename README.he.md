<div dir="rtl">

<p align="center">
  <a href="https://evenly.onrender.com"><img src="docs/readme/banner-he.svg" width="100%" alt="Evenly: מחלקים כל חשבון, יוצאים שווים"></a>
</p>

<p align="center"><a href="README.md"><img src="docs/readme/lang-en.svg" height="44" alt="Read in English"></a></p>

<p align="center">
  <a href="https://evenly.onrender.com"><img src="https://img.shields.io/badge/%D7%9C%D7%93%D7%9E%D7%95_%D7%94%D7%97%D7%99-FFD5C9?style=for-the-badge&logo=googlechrome&logoColor=A8483A" alt="לדמו החי"></a>
  <a href="https://github.com/NoyaAdivi/evenly/actions"><img src="https://img.shields.io/badge/%D7%9C%D7%A4%D7%99%D7%99%D7%A4%D7%9C%D7%99%D7%99%D7%9F-D9F3E7?style=for-the-badge&logo=githubactions&logoColor=1F7350" alt="לפייפליין"></a>
  <a href="https://evenly.onrender.com/health"><img src="https://img.shields.io/badge/%D7%91%D7%93%D7%99%D7%A7%D7%AA_%D7%AA%D7%A7%D7%99%D7%A0%D7%95%D7%AA-DAD5FF?style=for-the-badge&logo=statuspage&logoColor=5548C8" alt="בדיקת תקינות"></a>
</p>

<p align="center">
  <a href="https://github.com/NoyaAdivi/evenly/actions/workflows/ci.yml"><img src="https://github.com/NoyaAdivi/evenly/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://github.com/NoyaAdivi/evenly/actions/workflows/deploy.yml"><img src="https://github.com/NoyaAdivi/evenly/actions/workflows/deploy.yml/badge.svg" alt="פריסה"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/NoyaAdivi/evenly?color=DAD5FF&labelColor=5548C8" alt="רישיון"></a>
  <a href="https://github.com/NoyaAdivi/evenly/commits/main"><img src="https://img.shields.io/github/last-commit/NoyaAdivi/evenly?color=FFD5C9&labelColor=A8483A" alt="עדכון אחרון"></a>
</p>

<h3 align="center">מחלקים כל חשבון. יוצאים שווים.</h3>

<p align="center">
  Evenly מחלק כל חשבון בין חברים, <b>מדויק עד האגורה האחרונה</b>: סורקים קבלה ממסעדה, מחלקים לפי מנה או רק את השתייה,<br>שולחים קישור שבו כל אחד מסמן את שלו, מחלקים לילות במלון או טיול שלם.<br>
  מאחורי הקלעים, כל push נבדק, נארז ב־Docker ועולה לענן לבד.
</p>

<table align="center">
  <tr>
    <td align="center" width="25%"><a href="Dockerfile"><b>🐳 Docker</b></a><br><sub>רב שלבי, בלי root</sub></td>
    <td align="center" width="25%"><a href="https://github.com/NoyaAdivi/evenly/actions/workflows/ci.yml"><b>✅ 2 × Node</b></a><br><sub>בדיקות על 20 ו־22</sub></td>
    <td align="center" width="25%"><a href="https://github.com/NoyaAdivi/evenly/pkgs/container/evenly"><b>📦 GHCR</b></a><br><sub>אימג׳ לכל קומיט</sub></td>
    <td align="center" width="25%"><a href="https://evenly.onrender.com"><b>☁️ פריסה אוטומטית</b></a><br><sub>ל־Render אחרי ה־CI</sub></td>
  </tr>
</table>

<p align="center">
  <a href="https://evenly.onrender.com"><img src="docs/social/evenly-github-he.png" width="100%" alt="Evenly: מחלקים כל חשבון, יוצאים שווים"></a>
</p>

<a name="what"></a>
<p align="center"><a href="#pipeline"><img src="docs/readme/what-he.svg" width="100%" alt="מה זה Evenly"></a></p>

<table dir="rtl">
  <tr valign="top">
    <td valign="top" width="33%" dir="rtl">
      <p><b>🐳 ארוז ב־Docker</b></p>
      <ul>
        <li><a href="Dockerfile"><b>בנייה רב שלבית</b></a> על Alpine, אימג׳ קטן</li>
        <li><b>רץ בלי הרשאות root</b></li>
        <li><b>HEALTHCHECK מובנה</b> על <code>/health</code></li>
        <li><a href="docker-compose.yml"><b>docker compose up</b></a> וזה רץ</li>
      </ul>
    </td>
    <td valign="top" width="33%" dir="rtl">
      <p><b>✅ נבדק בכל push</b></p>
      <ul>
        <li><a href="test"><b>בדיקות יחידה ו־API</b></a> עם ה־test runner המובנה של Node</li>
        <li><b>מטריצה</b> על Node 20 ו־22, עם כיסוי קוד</li>
        <li><b>בדיקת עשן</b> מול הקונטיינר האמיתי כשהוא רץ</li>
        <li>בדיקה שנכשלת <b>עוצרת את הפריסה</b></li>
      </ul>
    </td>
    <td valign="top" width="33%" dir="rtl">
      <p><b>☁️ עולה לענן לבד</b></p>
      <ul>
        <li><a href="https://github.com/NoyaAdivi/evenly/pkgs/container/evenly"><b>האימג׳ עולה ל־GHCR</b></a> עם התגיות <code>latest</code> וה־SHA</li>
        <li><b>פריסה ל־Render</b> רק אחרי שה־CI עובר</li>
        <li><b>מוודא שהגרסה עלתה:</b> מחכה ש־<code>/health</code> יציג את הקומיט החדש</li>
        <li><a href="https://evenly.onrender.com"><b>ממשק ווב בפסטל</b></a> לנסות בדפדפן</li>
      </ul>
    </td>
  </tr>
</table>

<a name="app"></a>
<h3 align="center">📲 אפליקציה ושאלות נפוצות <sub><sup>חדש</sup></sub></h3>
<p align="center">אפשר להתקין את Evenly כאפליקציה אמיתית עם אייקון משלה, והאתר עונה על השאלות הנפוצות לפי נושא.</p>

<table>
  <tr valign="top">
    <td width="50%">
      <ul>
        <li><b>📲 אפליקציה להתקנה (PWA):</b> אייקון וחלון משלה בטלפון ובמחשב, עם השם Evenly בלבד</li>
        <li><b>⚡ עובדת גם בלי אינטרנט</b> אחרי הביקור הראשון, בעזרת Service Worker</li>
      </ul>
    </td>
    <td width="50%">
      <ul>
        <li><b><a href="https://evenly.onrender.com/?lang=he#faq">❓ שאלות נפוצות לפי נושא</a>:</b> סינון בצ׳יפים, חיפוש עם הדגשה ואנימציות רכות</li>
        <li><b>🔗 נבנה על ידי נויה אדיבי</b> עם קישור ללינקדאין בתחתית כל עמוד</li>
      </ul>
    </td>
  </tr>
</table>


<a name="pipeline"></a>
<p align="center"><a href="#tech-stack"><img src="docs/readme/pipeline-he.svg" width="100%" alt="הפייפליין"></a></p>

</div>

```mermaid
flowchart LR
  A([💻 git push]) --> B{🧪 בדיקות<br/>Node 20 + 22}
  B -->|עברו| C([🐳 בניית Docker<br/>+ בדיקת עשן])
  B -->|נכשלו| X([❌ עוצרים, שום דבר לא עולה])
  C -->|רק main| D([📦 העלאת האימג׳ ל־GHCR])
  D --> E([☁️ פריסה ל־Render])
  E --> F([❤️ /health מציג<br/>את הקומיט החדש])
  style A fill:#FFE6DE,stroke:#E36E57,color:#2C2668
  style B fill:#E8E4FF,stroke:#6F60F0,color:#2C2668
  style C fill:#D9F3E7,stroke:#1F7350,color:#1F4D38
  style X fill:#FBD5E0,stroke:#A03A5C,color:#5C1F33
  style D fill:#DAD5FF,stroke:#5548C8,color:#2C2668
  style E fill:#FFF1C9,stroke:#B98A1E,color:#5C4410
  style F fill:#D9F3E7,stroke:#1F7350,color:#1F4D38
```

<div dir="rtl">

<p align="center"><sub>הוורקפלואים: <a href=".github/workflows/ci.yml">ci.yml</a> · <a href=".github/workflows/deploy.yml">deploy.yml</a></sub></p>

<a name="tech-stack"></a>
<p align="center"><a href="#api"><img src="docs/readme/stack-he.svg" width="100%" alt="טכנולוגיות"></a></p>

<p align="center"><b>אפליקציה</b><br>
<a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js_22-DAD5FF?style=for-the-badge&logo=nodedotjs&logoColor=5548C8" alt="Node.js 22"></a>
<a href="https://expressjs.com"><img src="https://img.shields.io/badge/Express-DAD5FF?style=for-the-badge&logo=express&logoColor=5548C8" alt="Express"></a>
</p>

<p align="center"><b>קונטיינר</b><br>
<a href="https://www.docker.com"><img src="https://img.shields.io/badge/Docker-FBD5E0?style=for-the-badge&logo=docker&logoColor=A03A5C" alt="Docker"></a>
<a href="https://alpinelinux.org"><img src="https://img.shields.io/badge/Alpine_Linux-FBD5E0?style=for-the-badge&logo=alpinelinux&logoColor=A03A5C" alt="Alpine Linux"></a>
<a href="https://github.com/NoyaAdivi/evenly/pkgs/container/evenly"><img src="https://img.shields.io/badge/GHCR-FBD5E0?style=for-the-badge&logo=github&logoColor=A03A5C" alt="GHCR"></a>
</p>

<p align="center"><b>CI / CD</b><br>
<a href="https://github.com/NoyaAdivi/evenly/actions"><img src="https://img.shields.io/badge/GitHub_Actions-D9F3E7?style=for-the-badge&logo=githubactions&logoColor=1F7350" alt="GitHub Actions"></a>
<a href="https://nodejs.org/api/test.html"><img src="https://img.shields.io/badge/node:test-D9F3E7?style=for-the-badge&logo=nodedotjs&logoColor=1F7350" alt="node:test"></a>
</p>

<p align="center"><b>ענן</b><br>
<a href="https://render.com"><img src="https://img.shields.io/badge/Render-FFD5C9?style=for-the-badge&logo=render&logoColor=A8483A" alt="Render"></a>
</p>

<a name="api"></a>
<p align="center"><a href="#run-locally"><img src="docs/readme/api-he.svg" width="100%" alt="ה־API"></a></p>

| שיטה | נתיב | מה זה עושה |
|---|---|---|
| `GET` | [`/`](https://evenly.onrender.com) | ממשק ווב פסטלי עם 10 דרכים לחלק: סריקת קבלה, לפי מנה, אוכל ושתייה, קישור קבוצתי, שווה, אחוזים, חלקים, סכומים מדויקים, לילות במלון והוצאות טיול |
| `GET` | [`/health`](https://evenly.onrender.com/health) | סטטוס, גרסה, SHA של הקומיט, זמן ריצה |
| `POST` | `/api/split` | חלוקת חשבון: שווה (`equal`), לילות (`nights`), לפי מנות (`items`), אחוזים (`percent`), חלקים (`shares`), סכומים מדויקים (`exact`) או קטגוריות (`pools`, למשל שתייה רק בין מי ששתה), עם טיפ (`tipPercent`), יום הולדת (`treat`, האחרים משלמים עליו) ועיגול (`roundTo`, בלי מטבעות) |
| `POST` | `/api/settle` | הוצאות טיול עם כמה משלמים, להכי מעט העברות (מי מעביר למי) |
| `POST` | `/api/receipt/parse` | הופך טקסט של קבלה סרוקה (עברית או אנגלית) למנות עם קטגוריה, סכום ודמי שירות |
| `POST` | `/api/rooms` | פתיחת קישור קבוצתי (נשמר 24 שעות בזיכרון) |
| `GET` | `/api/rooms/:id` | מצב חי: מנות, מי סימן מה, וסכומים |
| `POST` | `/api/rooms/:id/claim` | חבר מסמן מנה כשלו (`/join` מוסיף שם) |

</div>

```bash
curl -X POST https://evenly.onrender.com/api/split \
  -H "content-type: application/json" \
  -d '{"total":1200,"mode":"nights","guests":[{"name":"Noya","nights":3},{"name":"Dana","nights":1}]}'
```
```json
{ "currency": "ILS", "mode": "nights", "total": 1200,
  "shares": [ { "name": "Noya", "amount": 900 }, { "name": "Dana", "amount": 300 } ] }
```

<div dir="rtl">

<a name="run-locally"></a>
<p align="center"><a href="#deploy-setup"><img src="docs/readme/run-he.svg" width="100%" alt="הרצה מקומית"></a></p>

**עם Docker:**

</div>

```bash
docker compose up --build
# open http://localhost:3000
```

<div dir="rtl">

**עם Node 20 ומעלה:**

</div>

```bash
npm install
npm test
npm start
```

<div dir="rtl">

<a name="deploy-setup"></a>
<p align="center"><a href="#contact"><img src="docs/readme/deploy-he.svg" width="100%" alt="הגדרת פריסה"></a></p>

1. ב־[Render](https://dashboard.render.com) יוצרים **Web Service** מהריפו הזה, בשפה **Docker**, ומכבים את **Auto-Deploy**.
2. מעתיקים את כתובת ה־**Deploy Hook** מההגדרות של השירות.
3. מוסיפים אותה כ־Secret בשם `RENDER_DEPLOY_HOOK_URL` ב־[Settings → Secrets → Actions](https://github.com/NoyaAdivi/evenly/settings/secrets/actions).
4. מוסיפים את כתובת ה־Render כ־Variable בשם `APP_URL` ב־[Settings → Variables → Actions](https://github.com/NoyaAdivi/evenly/settings/variables/actions).

> [!IMPORTANT]
> כתובת ה־Deploy Hook היא סוד. שומרים אותה רק ב־GitHub Secrets, אף פעם לא בקוד.

<details>
<summary><b>📂 מבנה הפרויקט</b></summary>

</div>

```
├── .github/workflows/
│   ├── ci.yml          בדיקות על Node 20 ו־22, בניית Docker, בדיקת עשן
│   └── deploy.yml      העלאה ל־GHCR, פריסה ל־Render, המתנה ל־/health
├── src/
│   ├── split.js        לוגיקת החלוקה (מדויק עד האגורה)
│   ├── app.js          אפליקציית Express והנתיבים
│   └── server.js       נקודת הכניסה עם כיבוי מסודר
├── public/             ממשק ווב בפסטל
├── test/               בדיקות יחידה ו־API
├── docs/               עיצובי README ותמונות שיתוף
├── Dockerfile          רב שלבי, בלי root, עם HEALTHCHECK
├── docker-compose.yml
└── render.yaml         הגדרות Render
```

<div dir="rtl">
</details>

<a name="contact"></a>
<p align="center"><a href="https://www.linkedin.com/in/noya-adivi/"><img src="docs/readme/footer-he.svg" width="100%" alt="נבנה על ידי נויה עדיבי"></a></p>

<p align="center">
  <a href="https://evenly.onrender.com"><img src="https://img.shields.io/badge/%D7%9C%D7%A4%D7%AA%D7%95%D7%97_%D7%90%D7%AA_Evenly-FFD5C9?style=for-the-badge&logo=googlechrome&logoColor=A8483A" alt="demo"></a>
  <a href="https://www.linkedin.com/in/noya-adivi/"><img src="https://img.shields.io/badge/LinkedIn-DAD5FF?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzU1NDhDOCIgZD0iTTIwLjQ1IDIwLjQ1aC0zLjU2di01LjU3YzAtMS4zMy0uMDMtMy4wNC0xLjg1LTMuMDQtMS44NiAwLTIuMTQgMS40NS0yLjE0IDIuOTR2NS42N0g5LjM1VjloMy40MXYxLjU2aC4wNWMuNDgtLjkgMS42NC0xLjg1IDMuMzctMS44NSAzLjYgMCA0LjI3IDIuMzcgNC4yNyA1LjQ2djYuMjh6TTUuMzQgNy40M2EyLjA2IDIuMDYgMCAxIDEgMC00LjEzIDIuMDYgMi4wNiAwIDAgMSAwIDQuMTN6TTcuMTIgMjAuNDVIMy41NlY5aDMuNTZ2MTEuNDV6TTIyLjIyIDBIMS43N0MuNzkgMCAwIC43NyAwIDEuNzN2MjAuNTRDMCAyMy4yMy43OSAyNCAxLjc3IDI0aDIwLjQ1Yy45OCAwIDEuNzgtLjc3IDEuNzgtMS43M1YxLjczQzI0IC43NyAyMy4yIDAgMjIuMjIgMHoiLz48L3N2Zz4=" alt="LinkedIn"></a>
  <a href="https://noyaadivi.github.io/noya-website"><img src="https://img.shields.io/badge/%D7%AA%D7%99%D7%A7_%D7%A2%D7%91%D7%95%D7%93%D7%95%D7%AA-D9F3E7?style=for-the-badge&logo=githubpages&logoColor=1F7350" alt="Portfolio"></a>
  <a href="https://github.com/NoyaAdivi"><img src="https://img.shields.io/badge/%D7%A2%D7%95%D7%93_%D7%A4%D7%A8%D7%95%D7%99%D7%A7%D7%98%D7%99%D7%9D-FBD5E0?style=for-the-badge&logo=github&logoColor=A03A5C" alt="More projects"></a>
</p>

</div>
