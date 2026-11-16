/* Evenly front end: every way to split a bill. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} } };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const api = async (url, body) => {
    const res = await fetch(url, body === undefined ? {} : { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({ error: 'bad response' }));
    if (!res.ok) throw new Error(data.error || res.statusText);
    return data;
  };

  /* ---------- text, English | Hebrew ---------- */
  const L = {
    nav1: ['Split a bill', 'חלוקת חשבון'], nav2: ['How it\'s built', 'איך זה עולה'], nav3: ['API', 'API'],
    pill: ['10 ways to split, one tap each', '10 דרכים לחלק, כל אחת בלחיצה'],
    h1a: ['Split any bill.', 'מחלקים כל חשבון.'], h1b: ['End up even.', 'יוצאים שווים.'],
    lead: ['Scan a restaurant receipt, split per dish or just the drinks, send a link where everyone taps what they had, split hotel nights or a whole trip. Exact to the last agora.', 'סורקים קבלה מהמסעדה, מחלקים לפי מנה או רק את השתייה, שולחים קישור שבו כל אחד מסמן מה הוא לקח, מחלקים לילות במלון או טיול שלם. מדויק עד האגורה.'],
    cta1: ['Start splitting', 'מתחילים לחלק'], cta2: ['View on GitHub', 'לקוד בגיטהאב'],
    chip1: ['📸 Receipt scan', '📸 סריקת קבלה'], chip2: ['🔗 Group link', '🔗 קישור קבוצתי'], chip3: ['🧳 Trips', '🧳 טיולים'], chip4: ['🐳 Docker · CI/CD', '🐳 Docker · CI/CD'],
    e1: ['Live demo', 'דמו חי'], t1: ['What are we splitting?', 'מה מחלקים היום?'], d1: ['Pick a way. Every number comes from the real API in the cloud.', 'בוחרים דרך. כל מספר מגיע מה־API האמיתי שרץ בענן.'],
    g_all: ['All', 'הכל'], g_rest: ['🍽️ Restaurant', '🍽️ מסעדה'], g_simple: ['⚖️ Simple', '⚖️ פשוט'], g_trip: ['🧳 Trips & home', '🧳 טיולים ובית'],
    m_scan: ['Scan a receipt', 'סריקת קבלה'], m_scan_d: ['Snap the bill, dishes fill in by themselves', 'מצלמים את החשבון והמנות מתמלאות לבד'],
    m_items: ['By dish', 'לפי מנה'], m_items_d: ['Tap who had what, shared plates split', 'מסמנים מי אכל מה, מנה משותפת מתחלקת'],
    m_pools: ['Food & drinks', 'אוכל ושתייה'], m_pools_d: ['Drinks only for the drinkers, food for all', 'שתייה רק למי ששתה, אוכל לכולם'],
    m_room: ['Group link', 'קישור קבוצתי'], m_room_d: ['Everyone taps their own items on their phone', 'כל אחד מסמן את שלו בטלפון'],
    m_equal: ['Equally', 'שווה בשווה'], m_equal_d: ['Same amount for everyone', 'אותו סכום לכולם'],
    m_percent: ['By percent', 'לפי אחוזים'], m_percent_d: ['Each pays their own %', 'כל אחד משלם אחוז משלו'],
    m_shares: ['By shares', 'לפי חלקים'], m_shares_d: ['A couple counts 2, a kid half', 'זוג נספר כ־2, ילד כחצי'],
    m_exact: ['Exact amounts', 'סכומים מדויקים'], m_exact_d: ['Some pay a set sum, the rest split', 'חלק משלמים סכום קבוע, השאר מתחלק'],
    m_hotel: ['Hotel nights', 'לילות במלון'], m_hotel_d: ['Pay by the nights you stayed', 'משלמים לפי מספר הלילות'],
    m_trip: ['Trip expenses', 'הוצאות טיול'], m_trip_d: ['Many payers, fewest transfers', 'כמה משלמים, הכי מעט העברות'],
    neu: ['NEW', 'חדש'], back: ['All ways', 'כל הדרכים'],
    s_people: ['Who\'s splitting?', 'מי מתחלק?'], s_total: ['Total bill', 'סכום החשבון'], s_items: ['Dishes · tap who had each one', 'מנות · מסמנים מי לקח כל מנה'],
    s_scan: ['Scan the receipt', 'סורקים את הקבלה'], s_pools: ['Categories · who\'s in each', 'קטגוריות · מי משתתף בכל אחת'],
    s_exp: ['Expenses · who paid, for whom', 'הוצאות · מי שילם ובשביל מי'], s_tip: ['Tip / service', 'טיפ / שירות'], s_room: ['Send the link', 'שולחים את הקישור'],
    s_people_opt: ['optional, friends can add themselves', 'לא חובה, חברים יכולים להוסיף את עצמם'],
    quick: ['Quick:', 'מהיר:'], ppl: ['people', 'אנשים'], addp: ['+ Add person', '+ הוספת אדם'], addi: ['+ Add dish', '+ הוספת מנה'], adde: ['+ Add expense', '+ הוספת הוצאה'],
    person: ['Person', 'אדם'], name: ['Name', 'שם'], dish: ['Dish', 'מנה'], nights: ['nights', 'לילות'], auto: ['auto', 'אוטו׳'], who: ['Who?', 'מי?'], all: ['Everyone', 'כולם'], forw: ['For:', 'בשביל:'], paidby: ['Paid by', 'שילם/ה'],
    even: ['Even it out', 'לאזן'], pctsum: ['{n}% of 100%', '{n}% מתוך 100%'], fill: ['Rest split equally between the empty ones', 'השאר מתחלק שווה בין מי שהשאיר ריק'],
    drop1: ['Drop a photo of the receipt', 'גוררים לכאן תמונה של הקבלה'], drop2: ['or click · Hebrew + English · read in your browser', 'או לוחצים · עברית ואנגלית · נקרא בדפדפן'],
    cam: ['📷 Photo', '📷 לצלם'], sample: ['✨ Sample', '✨ דוגמה'], shint: ['The photo never leaves your device.', 'התמונה לא יוצאת מהמכשיר.'],
    loading: ['Loading the reader…', 'טוען את מנוע הזיהוי…'], reading: ['Reading the receipt…', 'קורא את הקבלה…'], found: ['Found {n} dishes ✓', 'נמצאו {n} מנות ✓'], none: ['No dishes found, add them by hand', 'לא נמצאו מנות, אפשר להוסיף ידנית'],
    fromdish: ['↻ Fill from dishes', '↻ למלא מהמנות'],
    p_food: ['Food', 'אוכל'], p_drink: ['Drinks', 'שתייה'], p_dessert: ['Dessert', 'קינוח'], p_taxi: ['Taxi', 'מונית'], p_tix: ['Tickets', 'כרטיסים'], p_other: ['Other', 'אחר'],
    x_hotel: ['Hotel', 'מלון'], x_food: ['Groceries', 'סופר'], x_car: ['Car & fuel', 'רכב ודלק'], x_dinner: ['Dinner', 'ארוחה'], x_fun: ['Activities', 'אטרקציות'],
    res: ['Result', 'תוצאה'], sub: ['Before tip', 'לפני טיפ'], tip: ['Tip', 'טיפ'], chk: ['Shares add up exactly to the total', 'הסכומים מסתכמים בדיוק לסך הכל'],
    paid: ['Who paid?', 'מי שילם?'], nobody: ['Nobody yet, everyone pays their own', 'עוד לא, כל אחד משלם לבד'], owes: ['owes {n}', 'חייב/ת ל־{n}'],
    copy: ['Copy', 'העתקה'], wa: ['WhatsApp', 'וואטסאפ'], link: ['🔗 Link', '🔗 קישור'], share: ['Share', 'שיתוף'], copied: ['Copied ✓', 'הועתק ✓'], linked: ['Link copied ✓ it opens this exact split', 'הקישור הועתק ✓ הוא פותח בדיוק את החלוקה הזו'],
    empty: ['Add people to see the split', 'מוסיפים אנשים כדי לראות את החלוקה'], needi: ['Add at least one dish', 'מוסיפים לפחות מנה אחת'],
    match: ['Dishes match the receipt total ✓', 'המנות תואמות לסכום בקבלה ✓'], diff: ['Receipt says {a}, dishes add up to {b}.', 'בקבלה כתוב {a}, המנות מסתכמות ל־{b}.'], fixd: ['Add the difference', 'להוסיף את ההפרש'],
    tr_title: ['Who pays whom', 'מי מעביר למי'], tr_none: ['All square, nobody owes anything 🎉', 'הכל מאוזן, אף אחד לא חייב 🎉'], bal: ['Balances', 'מאזן'], spent: ['Total spent', 'סה״כ הוצאות'],
    paidx: ['paid {a}', 'שילם/ה {a}'],
    r_make: ['🔗 Create the group link', '🔗 ליצור קישור קבוצתי'], r_hint: ['Friends open it, pick their name and tap what they had. Totals update live here.', 'החברים פותחים, בוחרים שם ומסמנים מה לקחו. הסכומים מתעדכנים כאן בזמן אמת.'],
    r_live: ['Live', 'בשידור חי'], r_claimed: ['{a} of {b} claimed', '{a} מתוך {b} סומנו'], r_left: ['Not claimed yet', 'עוד לא סומנו'], r_new: ['New link', 'קישור חדש'], r_open: ['Open as a guest ↗', 'לפתוח כאורח ↗'],
    r_wait: ['Waiting for friends to tap their items…', 'מחכים שהחברים יסמנו…'], r_ttl: ['Links last 24 hours.', 'הקישור תקף ל־24 שעות.'],
    r_msg: ['Tap what you had at dinner 🍽️', 'מסמנים מה לקחתם בארוחה 🍽️'],
    g_who: ['Who are you?', 'מי את/ה?'], g_new: ['Or type your name', 'או כותבים שם'], g_go: ['Let\'s go', 'יאללה'], g_pick: ['Tap everything you had', 'מסמנים כל מה שלקחת'],
    g_you: ['You pay', 'את/ה משלם/ת'], g_inc: ['incl. {n}% tip', 'כולל {n}% טיפ'], g_me: ['Not {n}?', 'לא {n}?'], g_shared: ['split with {n}', 'מתחלק עם {n}'], g_gone: ['This link has expired. Ask for a new one 💜', 'הקישור הזה פג. מבקשים קישור חדש 💜'],
    g_everyone: ['Everyone so far', 'כולם עד עכשיו'],
    fabs: ['See the split ↓', 'לתוצאה ↓'],
    e2: ['DevOps pipeline', 'פייפליין DevOps'], t2: ['From git push to the cloud', 'מ־git push ועד הענן'], d2: ['No manual steps. If a test fails, nothing deploys.', 'בלי צעדים ידניים. אם בדיקה נכשלת, שום דבר לא עולה.'],
    p1: ['A change lands on main', 'שינוי נכנס ל־main'], p2h: ['Tests', 'בדיקות'], p2: ['Every split mode, receipts, rooms and API, on Node 20 and 22', 'כל אופני החלוקה, קבלות, קישורים ו־API על Node 20 ו־22'],
    p3: ['Build the image and smoke test it', 'בניית האימג׳ ובדיקת עשן'], p4: ['Image saved, tagged per commit', 'האימג׳ נשמר עם תגית לכל קומיט'], p5: ['Deployed, then verified via /health', 'עולה לאוויר ונבדק דרך /health'],
    f1h: ['Safe by default', 'בטוח כברירת מחדל'], f1: ['Non-root Alpine image with a health check. Photos are read in the browser, only text reaches the server.', 'אימג׳ Alpine בלי root עם בדיקת תקינות. תמונות נקראות בדפדפן, רק טקסט מגיע לשרת.'],
    f2h: ['Exact to the agora', 'מדויק עד האגורה'], f2: ['Largest remainder rounding, so shares always add up, tip included.', 'עיגול בשיטת השארית הגדולה, כך שהכל תמיד מסתכם, כולל טיפ.'],
    f3h: ['Every version kept', 'כל גרסה נשמרת'], f3: ['Each commit becomes its own image, so rolling back is one command.', 'כל קומיט הופך לאימג׳ משלו, אז חזרה אחורה היא פקודה אחת.'],
    t3: ['Use it from anywhere', 'אפשר להשתמש מכל מקום'], d3: ['JSON in, JSON out.', 'JSON נכנס ו־JSON יוצא.'],
    a2: ['Status, version, commit', 'סטטוס, גרסה, קומיט'], a3: ['equal · nights · items · percent · shares · exact · pools, with tip', 'שווה · לילות · מנות · אחוזים · חלקים · מדויק · קטגוריות, עם טיפ'],
    a4: ['Receipt text to dishes, categories and total', 'מטקסט של קבלה למנות, קטגוריות וסכום'], a5: ['Trip expenses to fewest transfers', 'הוצאות טיול להכי מעט העברות'],
    a6: ['Open a group link', 'פתיחת קישור קבוצתי'], a7: ['Live room state and totals', 'מצב הקישור והסכומים'], a8: ['Tap an item as yours', 'סימון מנה כשלך'],
    live: ['Live', 'פעיל'], down: ['Offline', 'לא זמין'],
    rot: [['🍕 Pizza night', '🏖️ Eilat weekend', '🧳 Trip to Rome', '🏠 Flatmates bills', '🎂 Birthday dinner', '🍻 Friday beers'], ['🍕 ערב פיצה', '🏖️ סופ״ש באילת', '🧳 טיול לרומא', '🏠 חשבונות שותפים', '🎂 ארוחת יום הולדת', '🍻 בירה של שישי']],
    s_extra: ['Extras', 'תוספות'], round: ['🪙 Round up, no coins', '🪙 לעגל למעלה, בלי מטבעות'], off: ['Off', 'בלי'],
    bday_t: ['Birthday / treated: others pay for them', 'יום הולדת / מוזמן: האחרים משלמים עליו'], bdayon: ['🎂 {n} is treated!', '🎂 {n} מוזמן/ת!'],
    treated: ['🎁 Treated', '🎁 מוזמן/ת'], covers: ['covers {a} of the treat', 'משתתף/ת ב־{a} מההזמנה'], rext: ['🪙 Rounding added {a} to the tip', '🪙 העיגול הוסיף {a} לטיפ'],
    img: ['🖼️ Image', '🖼️ תמונה'], wheel: ['🎡 Roulette', '🎡 רולטה'], msgto: ['Hi {n}! Your part is {a} 💜 (Evenly)', 'היי {n}! החלק שלך הוא {a} 💜 (Evenly)'],
    w_title: ['Who pays for everyone?', 'מי משלם על כולם?'], w_sub: ['Spin it. No take-backs 😈', 'מסובבים. אין חרטות 😈'], w_spin: ['Spin!', 'לסובב!'], w_win: ['🎉 {n} pays! {a}', '🎉 {n} משלם/ת! {a}'], w_set: ['Set as payer', 'לקבוע כמשלם/ת'],
    i_title: ['Your split as an image', 'החלוקה כתמונה'], i_sub: ['Perfect for the group chat or a story', 'מושלם לקבוצה או לסטורי'], i_dl: ['⬇️ Download', '⬇️ להורדה'], i_share: ['📤 Share', '📤 לשתף'],
    recent: ['🕘 Recent splits', '🕘 חלוקות אחרונות'],
    b_big: ['🍔 Big eater: {n}', '🍔 אכלן/ית: {n}'], b_drink: ['🍻 Drinks champion: {n}', '🍻 אלוף/ת השתייה: {n}'], b_light: ['🥗 Light eater: {n}', '🥗 אוכל/ת קליל: {n}'],
    b_bday: ['🎂 Birthday: {n}', '🎂 יום הולדת: {n}'], b_top: ['💸 Biggest share: {n}', '💸 החלק הגדול: {n}'], b_hero: ['🦸 Paid the most: {n}', '🦸 שילם/ה הכי הרבה: {n}'], b_even: ['🤝 Perfectly even', '🤝 מאוזן לגמרי'],
    snd: ['Sound', 'צלילים'], tot: ['Total', 'סה״כ']
  };
  let lang = store.get('lang') || 'en';
  const t = (k, v = {}) => { const a = L[k] || [k, k]; const x = a[lang === 'he' ? 1 : 0] ?? a[0]; return Array.isArray(x) ? x : x.replace(/\{(\w+)\}/g, (_, x) => v[x] ?? ''); };
  const fmt = (n) => (S.cur || '₪') + (+n).toLocaleString(lang === 'he' ? 'he-IL' : 'en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

  /* ---------- modes ---------- */
  const MODES = [
    { k: 'scan', e: '🧾', g: 'rest', c: '--peach', isNew: 1 }, { k: 'items', e: '🍽️', g: 'rest', c: '--butter' },
    { k: 'pools', e: '🍷', g: 'rest', c: '--lav', isNew: 1 }, { k: 'room', e: '🔗', g: 'rest', c: '--sage', isNew: 1 },
    { k: 'equal', e: '⚖️', g: 'simple', c: '--lav' }, { k: 'percent', e: '📊', g: 'simple', c: '--peach' },
    { k: 'shares', e: '🧮', g: 'simple', c: '--sage' }, { k: 'exact', e: '✍️', g: 'simple', c: '--butter' },
    { k: 'hotel', e: '🏨', g: 'trip', c: '--sage' }, { k: 'trip', e: '🧳', g: 'trip', c: '--peach', isNew: 1 }
  ];
  const F = {
    scan: { people: 1, scan: 1, items: 1, tip: 1 }, items: { people: 1, scan: 1, items: 1, tip: 1 },
    pools: { people: 1, pools: 1, tip: 1 }, room: { people: 1, scan: 1, items: 1, tip: 1, room: 1 },
    equal: { people: 1, total: 1, tip: 1 }, percent: { people: 1, total: 1, tip: 1, pf: 'percent' },
    shares: { people: 1, total: 1, tip: 1, pf: 'shares' }, exact: { people: 1, total: 1, tip: 1, pf: 'amount' },
    hotel: { people: 1, total: 1, pf: 'nights' }, trip: { people: 1, expenses: 1 }
  };
  const CATS = { food: '🍽️', drink: '🍷', dessert: '🍰' };
  const PAL = [['--peach', '--peach-ink'], ['--lav', '--lav-ink'], ['--sage', '--sage-ink'], ['--butter', '--butter-ink']];
  const col = (i, k) => `var(${PAL[i % 4][k]})`;
  const initial = (n) => (String(n).trim()[0] || '?').toUpperCase();

  /* ---------- state ---------- */
  let uid = 0;
  const S = { cur: store.get('cur') || '₪', treat: new Set(), roundTo: 0, mode: null, group: 'all', tip: 12, total: 450, payer: '', receiptTotal: null, guests: [], items: [], pools: [], expenses: [], room: null };
  const gi = (id) => S.guests.findIndex((g) => g.id === id);
  const addGuest = (name, o = {}) => S.guests.push({ id: ++uid, name, nights: 1, percent: '', shares: 1, amount: '', ...o });
  const addItem = (name = '', price = '', qty = 1, cat = 'food', people = []) => S.items.push({ id: ++uid, name, price, qty, cat, people: new Set(people) });
  const addPool = (key, amount = '', people = []) => S.pools.push({ id: ++uid, key, name: t('p_' + key), amount, people: new Set(people) });
  const addExp = (key, amount = '', payer = null, people = []) => S.expenses.push({ id: ++uid, key, title: t('x_' + key), amount, payer, people: new Set(people) });
  function demo() {
    S.guests = []; S.items = []; S.pools = []; S.expenses = [];
    [['Noya', 3, 40, 2], ['Dana', 2, 35, 1], ['Lior', 2, 25, 1]].forEach(([n, k, p, s]) => addGuest(n, { nights: k, percent: p, shares: s }));
    const [a, b, c] = S.guests.map((g) => g.id);
    addItem('Burger', 62, 1, 'food', [a]); addItem('Greek salad', 48, 1, 'food', [b]); addItem('Beer', 30, 2, 'drink', [a, c]); addItem('Fries', 25, 1, 'food');
    addPool('food', 280); addPool('drink', 120, [a, c]);
    addExp('hotel', 900, a); addExp('car', 240, b, [b, c]); addExp('dinner', 360, c);
  }

  /* ---------- theme, language, header ---------- */
  const root = document.documentElement;
  const setTheme = (th) => { root.dataset.theme = th; store.set('theme', th); $('meta[name=theme-color]').content = th === 'dark' ? '#18161D' : '#FBF7F1'; };
  setTheme(store.get('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  $('#theme').onclick = () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  function applyLang() {
    root.lang = lang; root.dir = lang === 'he' ? 'rtl' : 'ltr';
    $$('[data-i]').forEach((el) => { el.textContent = t(el.dataset.i); });
    $('#lang').textContent = lang === 'he' ? 'EN' : 'עב';
    S.pools.forEach((p) => { if (p.key !== 'custom') p.name = t('p_' + p.key); });
    S.expenses.forEach((x) => { if (x.key !== 'custom') x.title = t('x_' + x.key); });
    renderPicker(); if (S.mode) { renderStrip(); renderEditor(); calc(); }
    if (guest.id) renderGuest(); health(); setSnd(); rotate(true); renderRecent();
  }
  $('#lang').onclick = () => { lang = lang === 'he' ? 'en' : 'he'; store.set('lang', lang); applyLang(); };
  addEventListener('scroll', () => { $('#top').classList.toggle('scrolled', scrollY > 8); fabCheck(); }, { passive: true });
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
  $$('.rv').forEach((el, i) => { el.style.transitionDelay = (i % 5) * 70 + 'ms'; io.observe(el); });
  const fl = $('.floaties');
  ['🧾', '🍕', '🍺', '🏨', '💸', '🍣', '🧳', '☕', '🍷', '🚕'].forEach((e, i) => {
    const s = document.createElement('span'); s.textContent = e;
    s.style.cssText = `left:${(i * 10 + 3) % 96}%;animation-delay:${-i * 1.6}s;animation-duration:${12 + (i % 4) * 3}s;font-size:${1.4 + (i % 3) * 0.5}rem`;
    fl.appendChild(s);
  });
  let ri = 0;
  function rotate(now) {
    const list = t('rot'), el = $('#rot'); if (!el) return;
    if (!now) ri = (ri + 1) % list.length;
    el.innerHTML = `<span>${esc(list[ri % list.length])}</span>`;
  }
  setInterval(() => rotate(), 2600);
  async function health() {
    try {
      const h = await api('/health'); const v = `v${h.version} · ${String(h.commit).slice(0, 7)}`;
      $('#status').classList.add('ok'); $('#st-txt').textContent = `${t('live')} · ${v}`; $('#ver').textContent = v;
    } catch { $('#status').classList.remove('ok'); $('#st-txt').textContent = t('down'); }
  }
  $('#origin').textContent = /localhost|127\./.test(location.hostname) ? 'https://evenly-app.up.railway.app' : location.origin;

  /* ---------- soft sounds (off by default) ---------- */
  let snd = store.get('snd') === '1', ac;
  function beep(kind) {
    if (!snd) return;
    try {
      ac ??= new AudioContext();
      const notes = { tap: [660], ok: [523, 659, 784], tick: [880], win: [523, 659, 784, 1046] }[kind] || [600];
      notes.forEach((f, i) => {
        const o = ac.createOscillator(), g = ac.createGain(), at = ac.currentTime + i * 0.09;
        o.type = 'sine'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(kind === 'tick' ? 0.04 : 0.09, at + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, at + (kind === 'tick' ? 0.06 : 0.28));
        o.connect(g).connect(ac.destination); o.start(at); o.stop(at + 0.3);
      });
    } catch {}
  }
  const setSnd = () => { $('#snd').textContent = snd ? '🔊' : '🔈'; $('#snd').title = t('snd'); };
  $('#snd').onclick = () => { snd = !snd; store.set('snd', snd ? '1' : '0'); setSnd(); beep('ok'); };
  document.addEventListener('click', (e) => { if (e.target.closest('.pchip,.tipbar button,.mode,.strip button,.gitem,.presets button,.bday')) beep('tap'); });

  /* ---------- toast + confetti ---------- */
  const toast = (m) => { const el = $('#toast'); el.textContent = m; el.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), 1800); };
  const cv = $('#confetti'), cx = cv.getContext('2d');
  let bits = [];
  function confetti(x = innerWidth / 2, y = innerHeight / 3) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    cv.width = innerWidth; cv.height = innerHeight;
    const cs = ['#F3B7A6', '#C9BEF5', '#A9D9B9', '#F2DC9B', '#8C7BD6', '#D9917A'];
    for (let i = 0; i < 110; i++) bits.push({ x, y, vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 13 - 3, r: Math.random() * 6 + 4, c: cs[i % 6], a: Math.random() * 6, life: 90 + Math.random() * 40 });
    if (bits.length === 110) requestAnimationFrame(tick);
  }
  function tick() {
    cx.clearRect(0, 0, cv.width, cv.height);
    bits = bits.filter((b) => b.life-- > 0);
    bits.forEach((b) => { b.vy += 0.35; b.vx *= 0.99; b.x += b.vx; b.y += b.vy; b.a += 0.2; cx.save(); cx.translate(b.x, b.y); cx.rotate(b.a); cx.fillStyle = b.c; cx.globalAlpha = Math.min(1, b.life / 30); cx.fillRect(-b.r / 2, -b.r / 4, b.r, b.r / 2); cx.restore(); });
    if (bits.length) requestAnimationFrame(tick); else cx.clearRect(0, 0, cv.width, cv.height);
  }
  const burstAt = (el) => { const r = el.getBoundingClientRect(); confetti(r.left + r.width / 2, r.top + r.height / 2); };

  /* ---------- picker ---------- */
  function renderPicker() {
    $('#groups').innerHTML = ['all', 'rest', 'simple', 'trip'].map((g) => `<button data-g="${g}" class="${S.group === g ? 'on' : ''}">${esc(t('g_' + g))}</button>`).join('');
    $('#modes').innerHTML = MODES.map((m, i) => `<button class="mode ${S.group !== 'all' && S.group !== m.g ? 'dim' : ''}" data-m="${m.k}" style="--c:var(${m.c});animation-delay:${i * 45}ms">${m.isNew ? `<span class="new">${esc(t('neu'))}</span>` : ''}<span class="em">${m.e}</span><h4>${esc(t('m_' + m.k))}</h4><p>${esc(t('m_' + m.k + '_d'))}</p></button>`).join('');
  }
  $('#groups').onclick = (e) => { const b = e.target.closest('button'); if (b) { S.group = b.dataset.g; renderPicker(); } };
  $('#modes').onclick = (e) => { const b = e.target.closest('.mode'); if (b) openMode(b.dataset.m, true); };
  $('#modes').addEventListener('mousemove', (e) => {
    const b = e.target.closest('.mode'); if (!b) return;
    const r = b.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    b.style.transform = `rotateX(${-y * 10}deg) rotateY(${x * 12}deg) translateY(-4px)`;
  });
  $('#modes').addEventListener('mouseout', (e) => { const b = e.target.closest('.mode'); if (b && !b.contains(e.relatedTarget)) b.style.transform = ''; });

  function openMode(k, scroll) {
    S.mode = k; stopPoll();
    $('#picker').classList.add('hide'); $('#workspace').classList.remove('hide');
    $('#work').style.animation = 'none'; void $('#work').offsetWidth; $('#work').style.animation = '';
    renderStrip(); renderEditor(); calc();
    if (S.mode === 'room' && S.room) { renderRoom(S.room); startPoll(); }
    if (scroll) $('#app').scrollIntoView({ behavior: 'smooth' });
    if (k === 'scan') setTimeout(() => $('#drop')?.classList.add('glow2'), 400);
  }
  function renderStrip() {
    $('#strip').innerHTML = `<button class="home" data-m="">← ${esc(t('back'))}</button>` + MODES.map((m) => `<button data-m="${m.k}" class="${S.mode === m.k ? 'on' : ''}">${m.e} ${esc(t('m_' + m.k))}</button>`).join('');
    $('#strip .on')?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }
  $('#strip').onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (!b.dataset.m) { S.mode = null; stopPoll(); $('#workspace').classList.add('hide'); $('#picker').classList.remove('hide'); renderPicker(); fabCheck(); return; }
    openMode(b.dataset.m);
  };

  /* ---------- editor ---------- */
  const sec = (n, key, body, extra = '') => `<div class="sec" style="animation-delay:${n * 60}ms"><h5><i>${n}</i>${esc(t(key))}${extra}</h5>${body}</div>`;
  function renderEditor() {
    const f = F[S.mode], m = MODES.find((x) => x.k === S.mode);
    let n = 0, h = `<div class="ed-h"><span class="em">${m.e}</span><div><h3>${esc(t('m_' + m.k))}</h3><p>${esc(t('m_' + m.k + '_d'))}</p></div><select class="cur" id="cur" aria-label="currency">${['₪', '$', '€', '£'].map((c) => `<option ${c === S.cur ? 'selected' : ''}>${c}</option>`).join('')}</select></div>`;
    if (f.scan && S.mode === 'scan') h += sec(++n, 's_scan', scanHTML());
    if (f.people) h += sec(++n, 's_people', peopleHTML(f), f.room ? `<small>${esc(t('s_people_opt'))}</small>` : '');
    if (f.total) h += sec(++n, 's_total', `<div class="money"><span>₪</span><input id="total" type="number" min="0" step="0.01" inputmode="decimal" value="${esc(S.total)}"></div>`);
    if (f.scan && S.mode !== 'scan') h += sec(++n, 's_scan', scanHTML());
    if (f.items) h += sec(++n, 's_items', `<div id="items"></div><button class="add" id="addi">${esc(t('addi'))}</button>`);
    if (f.pools) h += sec(++n, 's_pools', `<div id="pools"></div><div class="presets" id="ppre">${['food', 'drink', 'dessert', 'taxi', 'tix', 'other'].map((k) => `<button data-k="${k}">${{ food: '🍽️', drink: '🍷', dessert: '🍰', taxi: '🚕', tix: '🎟️', other: '➕' }[k]} ${esc(t('p_' + k))}</button>`).join('')}${S.items.length ? `<button id="fromdish">${esc(t('fromdish'))}</button>` : ''}</div>`);
    if (f.expenses) h += sec(++n, 's_exp', `<div id="exps"></div><div class="presets" id="xpre">${['hotel', 'food', 'car', 'dinner', 'fun'].map((k) => `<button data-k="${k}">${{ hotel: '🏨', food: '🛒', car: '⛽', dinner: '🍽️', fun: '🎢' }[k]} ${esc(t('x_' + k))}</button>`).join('')}</div>`);
    if (f.tip) h += sec(++n, 's_tip', `<div class="tipbar" id="tipbar">${[0, 10, 12, 15].map((v) => `<button data-t="${v}" class="${S.tip === v ? 'on' : ''}">${v}%</button>`).join('')}<input id="tipc" type="number" min="0" max="100" step="0.5" placeholder="%" value="${[0, 10, 12, 15].includes(S.tip) ? '' : S.tip}" aria-label="custom tip"></div>`);
    if (!f.expenses && !f.room) h += sec(++n, 's_extra', `<p class="hint" style="margin:0 0 8px">${esc(t('round'))}</p><div class="tipbar" id="roundbar">${[0, 1, 5, 10].map((v) => `<button data-r="${v}" class="${S.roundTo === v ? 'on' : ''}">${v ? S.cur + v : esc(t('off'))}</button>`).join('')}</div>`);
    if (f.room) h += sec(++n, 's_room', `<button class="btn primary" id="mkroom" style="width:100%;justify-content:center">${esc(t('r_make'))}</button><p class="hint">${esc(t('r_hint'))} ${esc(t('r_ttl'))}</p>`);
    $('#editor').innerHTML = h;
    bindEditor(); renderPeople(); renderItems(); renderPools(); renderExps();
  }
  const scanHTML = () => `<label class="drop" id="drop"><input type="file" id="file" accept="image/*"><span class="big-ic">🧾</span><b>${esc(t('drop1'))}</b><small>${esc(t('drop2'))}</small></label>
    <div class="scan-row"><label class="btn ghost" for="cam">${esc(t('cam'))}</label><input type="file" id="cam" accept="image/*" capture="environment" hidden><button class="btn ghost" id="sample">${esc(t('sample'))}</button></div>
    <div class="preview" id="preview"><img id="pimg" alt=""><span class="beam"></span></div><div class="prog" id="prog"><i></i></div><p class="hint" id="shint">${esc(t('shint'))}</p>`;
  const peopleHTML = (f) => `<div class="quick"><span>${esc(t('quick'))}</span><div class="step"><button type="button" id="qm">−</button><b id="qn">${S.guests.length}</b><button type="button" id="qp">+</button><small>${esc(t('ppl'))}</small></div>${f.pf === 'percent' ? `<button class="mini" id="even">${esc(t('even'))}</button>` : ''}</div>
    <div id="people"></div><button class="add" id="addp">${esc(t('addp'))}</button>${f.pf === 'percent' ? '<div class="meter" id="meter"><i></i></div><p class="hint" id="pcth"></p>' : ''}${f.pf === 'amount' ? `<p class="hint">${esc(t('fill'))}</p>` : ''}`;

  function bindEditor() {
    const on = (id, ev, fn) => { const el = $('#' + id); if (el) el[ev] = fn; };
    on('total', 'oninput', (e) => { S.total = e.target.value; calc(); });
    on('addp', 'onclick', () => { addGuest(`${t('person')} ${S.guests.length + 1}`); peopleChanged(); $('#people').lastChild?.querySelector('.n').select(); });
    on('qp', 'onclick', () => { if (S.guests.length < 30) { addGuest(`${t('person')} ${S.guests.length + 1}`); peopleChanged(); } });
    on('qm', 'onclick', () => { if (S.guests.length > 1) { removeGuest(S.guests.at(-1).id); } });
    on('even', 'onclick', () => { const n = S.guests.length, base = Math.floor(10000 / n) / 100; S.guests.forEach((g, i) => { g.percent = i === 0 ? Math.round((100 - base * (n - 1)) * 100) / 100 : base; }); renderPeople(); calc(); });
    on('addi', 'onclick', () => { addItem(); renderItems(); $('#items').lastChild?.querySelector('.nm').focus(); calc(); });
    on('tipbar', 'onclick', (e) => { const b = e.target.closest('button'); if (b) { setTip(+b.dataset.t); calc(); } });
    on('tipc', 'oninput', (e) => { S.tip = Math.min(100, Math.max(0, +e.target.value || 0)); $$('#tipbar button').forEach((b) => b.classList.remove('on')); calc(); });
    on('ppre', 'onclick', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.id === 'fromdish') return fromDishes();
      addPool(b.dataset.k); renderPools(); $('#pools').lastChild?.querySelector('.pr').focus(); calc();
    });
    on('xpre', 'onclick', (e) => { const b = e.target.closest('button'); if (b) { addExp(b.dataset.k, '', S.guests[0]?.id ?? null); renderExps(); $('#exps').lastChild?.querySelector('.pr').focus(); calc(); } });
    on('mkroom', 'onclick', makeRoom);
    on('cur', 'onchange', (e) => { S.cur = e.target.value; store.set('cur', S.cur); renderEditor(); calc(); });
    on('roundbar', 'onclick', (e) => { const b = e.target.closest('button'); if (!b) return; S.roundTo = +b.dataset.r; $$('#roundbar button').forEach((x) => x.classList.toggle('on', x === b)); calc(); });
    on('sample', 'onclick', sample);
    on('file', 'onchange', (e) => scan(e.target.files[0]));
    on('cam', 'onchange', (e) => scan(e.target.files[0]));
    const drop = $('#drop');
    if (drop) {
      ['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('over'); }));
      ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('over'); }));
      drop.addEventListener('drop', (e) => scan(e.dataTransfer.files[0]));
    }
  }
  function setTip(v) {
    S.tip = v; let hit = false;
    $$('#tipbar button').forEach((b) => { const o = +b.dataset.t === v; b.classList.toggle('on', o); hit ||= o; });
    if ($('#tipc')) $('#tipc').value = hit ? '' : v;
  }
  function removeGuest(id) {
    S.guests.splice(gi(id), 1); S.treat.delete(id);
    [...S.items, ...S.pools, ...S.expenses].forEach((x) => x.people.delete(id));
    S.expenses.forEach((x) => { if (x.payer === id) x.payer = S.guests[0]?.id ?? null; });
    peopleChanged();
  }
  const peopleChanged = () => { renderPeople(); renderItems(); renderPools(); renderExps(); calc(); };

  function renderPeople() {
    const box = $('#people'); if (!box) return;
    const pf = F[S.mode].pf; box.innerHTML = '';
    S.guests.forEach((g, i) => {
      const el = document.createElement('div'); el.className = 'prow'; el.style.animationDelay = i * 40 + 'ms';
      let fld = '';
      if (pf === 'nights') fld = `<div class="step"><button type="button" data-d="-1">−</button><b>${g.nights}</b><button type="button" data-d="1">+</button><small>${esc(t('nights'))}</small></div>`;
      if (pf === 'shares') fld = `<div class="step"><button type="button" data-d="-0.5">−</button><b>×${g.shares}</b><button type="button" data-d="0.5">+</button></div>`;
      if (pf === 'percent') fld = `<div class="fld"><input class="pf" type="number" min="0" max="100" step="0.5" inputmode="decimal" value="${esc(g.percent)}"><em>%</em></div>`;
      if (pf === 'amount') fld = `<div class="fld"><input class="pf" type="number" min="0" step="0.01" inputmode="decimal" placeholder="${esc(t('auto'))}" value="${esc(g.amount)}"><em>₪</em></div>`;
      const canTreat = S.mode !== 'trip' && S.mode !== 'room', tr = S.treat.has(g.id);
      if (tr) el.classList.add('treat');
      el.innerHTML = `<span class="av" style="background:${col(i, 0)};color:${col(i, 1)}">${tr ? '🎂' : esc(initial(g.name))}</span><input class="n" maxlength="30">${fld}${canTreat ? `<button class="bday ${tr ? 'on' : ''}" type="button" title="${esc(t('bday_t'))}" aria-label="${esc(t('bday_t'))}">🎂</button>` : ''}<button class="rm" type="button" aria-label="remove">✕</button>`;
      const bd = el.querySelector('.bday');
      if (bd) bd.onclick = () => { const on = !S.treat.has(g.id); on ? S.treat.add(g.id) : S.treat.delete(g.id); if (on) { burstAt(bd); toast(t('bdayon', { n: g.name })); beep('win'); } renderPeople(); calc(); };
      const n = el.querySelector('.n'); n.value = g.name; n.placeholder = t('name');
      n.oninput = () => { g.name = n.value; el.querySelector('.av').textContent = initial(g.name); renderItems(); renderPools(); renderExps(); calc(); };
      el.querySelector('.rm').onclick = () => removeGuest(g.id);
      el.querySelectorAll('.step button').forEach((b) => b.onclick = () => {
        if (pf === 'nights') { g.nights = Math.min(60, Math.max(1, g.nights + +b.dataset.d)); el.querySelector('.step b').textContent = g.nights; }
        else { g.shares = Math.min(20, Math.max(0, g.shares + +b.dataset.d)); el.querySelector('.step b').textContent = '×' + g.shares; }
        calc();
      });
      const pi = el.querySelector('.pf');
      if (pi) pi.oninput = () => { g[pf] = pi.value; if (pf === 'percent') meter(); calc(); };
      box.appendChild(el);
    });
    if ($('#qn')) $('#qn').textContent = S.guests.length;
    if (pf === 'percent') meter();
  }
  let wasFull = false;
  function meter() {
    const sum = Math.round(S.guests.reduce((a, g) => a + (+g.percent || 0), 0) * 100) / 100, m = $('#meter');
    if (!m) return;
    m.querySelector('i').style.width = Math.min(100, sum) + '%';
    m.classList.toggle('full', Math.abs(sum - 100) < 0.01); m.classList.toggle('over', sum > 100.01);
    $('#pcth').textContent = t('pctsum', { n: sum });
    const full = Math.abs(sum - 100) < 0.01;
    if (full && !wasFull) burstAt(m);
    wasFull = full;
  }

  const chips = (set, after) => S.guests.map((g, i) => {
    const on = set.has(g.id);
    return `<button type="button" class="pchip ${on ? 'on' : ''}" data-g="${g.id}" style="${on ? `background:color-mix(in srgb, ${col(i, 0)} 55%, var(--surface))` : ''}"><i style="background:${col(i, 0)};color:${col(i, 1)}">${esc(initial(g.name))}</i>${esc(g.name || '?')}</button>`;
  }).join('') + (set.size ? '' : `<span class="lab">· ${esc(after)}</span>`);
  const bindChips = (el, set, rerender) => el.querySelectorAll('.pchip').forEach((c) => c.onclick = () => {
    const id = +c.dataset.g; set.has(id) ? set.delete(id) : set.add(id); rerender(); calc();
  });

  function renderItems() {
    const box = $('#items'); if (!box) return; box.innerHTML = '';
    S.items.forEach((it) => {
      const el = document.createElement('div'); el.className = 'box';
      el.innerHTML = `<div class="top"><button class="cat" type="button" title="food / drink / dessert">${CATS[it.cat]}</button><input class="nm" maxlength="60"><input class="q" type="number" min="1" step="1" aria-label="qty"><input class="pr" type="number" min="0" step="0.01" inputmode="decimal" placeholder="₪"><button class="rm" type="button" aria-label="remove">✕</button></div>${S.mode === 'room' ? '' : `<div class="who"><span class="lab">${esc(t('who'))}</span>${chips(it.people, t('all'))}</div>`}`;
      const [nm, q, pr] = el.querySelectorAll('input');
      nm.value = it.name; nm.placeholder = t('dish'); q.value = it.qty; pr.value = it.price;
      nm.oninput = () => { it.name = nm.value; calc(); };
      q.oninput = () => { it.qty = Math.max(1, parseInt(q.value, 10) || 1); calc(); };
      pr.oninput = () => { it.price = pr.value; calc(); };
      el.querySelector('.cat').onclick = (e) => { const ks = Object.keys(CATS); it.cat = ks[(ks.indexOf(it.cat) + 1) % ks.length]; e.target.textContent = CATS[it.cat]; };
      el.querySelector('.rm').onclick = () => { S.items.splice(S.items.indexOf(it), 1); renderItems(); calc(); };
      bindChips(el, it.people, renderItems);
      box.appendChild(el);
    });
  }
  function renderPools() {
    const box = $('#pools'); if (!box) return; box.innerHTML = '';
    S.pools.forEach((p) => {
      const el = document.createElement('div'); el.className = 'box';
      el.innerHTML = `<div class="top"><span class="cat" style="display:grid;place-items:center">${{ food: '🍽️', drink: '🍷', dessert: '🍰', taxi: '🚕', tix: '🎟️' }[p.key] || '➕'}</span><input class="nm" maxlength="40"><input class="pr" type="number" min="0" step="0.01" inputmode="decimal" placeholder="₪"><button class="rm" type="button" aria-label="remove">✕</button></div><div class="who"><span class="lab">${esc(t('who'))}</span>${chips(p.people, t('all'))}</div>`;
      const [nm, pr] = el.querySelectorAll('input'); nm.value = p.name; pr.value = p.amount;
      nm.oninput = () => { p.name = nm.value; p.key = 'custom'; calc(); };
      pr.oninput = () => { p.amount = pr.value; calc(); };
      el.querySelector('.rm').onclick = () => { S.pools.splice(S.pools.indexOf(p), 1); renderPools(); calc(); };
      bindChips(el, p.people, renderPools);
      box.appendChild(el);
    });
  }
  function fromDishes() {
    const sums = {};
    S.items.forEach((it) => { if (+it.price) sums[it.cat] = (sums[it.cat] || 0) + +it.price * it.qty; });
    S.pools = []; Object.entries(sums).forEach(([k, v]) => addPool(k, Math.round(v * 100) / 100));
    renderPools(); calc();
  }
  function renderExps() {
    const box = $('#exps'); if (!box) return; box.innerHTML = '';
    S.expenses.forEach((x) => {
      const el = document.createElement('div'); el.className = 'box';
      el.innerHTML = `<div class="top"><input class="nm" maxlength="40"><input class="pr" type="number" min="0" step="0.01" inputmode="decimal" placeholder="₪"><button class="rm" type="button" aria-label="remove">✕</button></div>
        <div class="who"><span class="lab">${esc(t('paidby'))}</span><select class="py">${S.guests.map((g) => `<option value="${g.id}" ${x.payer === g.id ? 'selected' : ''}>${esc(g.name || '?')}</option>`).join('')}</select></div>
        <div class="who"><span class="lab">${esc(t('forw'))}</span>${chips(x.people, t('all'))}</div>`;
      const [nm, pr] = el.querySelectorAll('input'); nm.value = x.title; pr.value = x.amount;
      nm.oninput = () => { x.title = nm.value; x.key = 'custom'; calc(); };
      pr.oninput = () => { x.amount = pr.value; calc(); };
      el.querySelector('.py').onchange = (e) => { x.payer = +e.target.value; calc(); };
      if (x.payer === null && S.guests[0]) x.payer = S.guests[0].id;
      el.querySelector('.rm').onclick = () => { S.expenses.splice(S.expenses.indexOf(x), 1); renderExps(); calc(); };
      bindChips(el, x.people, renderExps);
      box.appendChild(el);
    });
  }

  /* ---------- receipt scanning ---------- */
  let ocr;
  const loadOCR = () => ocr ??= new Promise((ok, no) => {
    const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    s.onload = ok; s.onerror = () => { ocr = null; no(new Error('Could not load the reader, check the connection')); }; document.head.appendChild(s);
  });
  const shrink = (file) => new Promise((ok) => {
    const img = new Image(); img.onload = () => {
      const k = Math.min(1, 1800 / Math.max(img.width, img.height)), c = document.createElement('canvas');
      c.width = img.width * k; c.height = img.height * k;
      const x = c.getContext('2d'); x.filter = 'grayscale(1) contrast(1.3)'; x.drawImage(img, 0, 0, c.width, c.height); ok(c);
    }; img.src = URL.createObjectURL(file);
  });
  const prog = (p) => { const el = $('#prog'); if (!el) return; el.classList.add('show'); el.querySelector('i').style.width = Math.round(p * 100) + '%'; };
  const hint = (k, v) => { if ($('#shint')) $('#shint').textContent = t(k, v); };
  async function scan(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const pv = $('#preview'); $('#pimg').src = URL.createObjectURL(file); pv.classList.add('show', 'busy');
    try {
      hint('loading'); prog(0.03); await loadOCR(); hint('reading');
      const { data } = await Tesseract.recognize(await shrink(file), 'heb+eng', { logger: (m) => m.status === 'recognizing text' && prog(0.1 + m.progress * 0.9) });
      await useText(data.text);
    } catch (e) { if ($('#shint')) $('#shint').textContent = e.message; }
    finally { pv.classList.remove('busy'); setTimeout(() => $('#prog')?.classList.remove('show'), 800); }
  }
  async function useText(text) {
    const r = await api('/api/receipt/parse', { text });
    if (r.items.length) { S.items = []; r.items.forEach((it) => addItem(it.name, it.price, it.qty, it.category)); }
    S.receiptTotal = r.detectedTotal;
    if (r.servicePercent != null) S.tip = r.servicePercent;
    if (S.mode === 'scan' || S.mode === 'items' || S.mode === 'room') { renderEditor(); hint(r.items.length ? 'found' : 'none', { n: r.items.length }); }
    calc();
    if (r.matchesTotal) setTimeout(() => burstAt($('#items') || $('#editor')), 300);
    $('#items')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  async function sample() {
    const txt = lang === 'he'
      ? 'מסעדת הים\nטל: 03-5551234\n15/11/2026 20:41\nהמבורגר 62.00\nסלט יווני 48.00\n2 x בירה 60.00\nצ׳יפס 25.00\nטירמיסו 38.00\nסה"כ 233.00\nשירות 12%'
      : 'THE HARBOR\nTel 03-5551234\n15/11/2026 20:41\nBurger 62.00\nGreek salad 48.00\n2 x Beer 60.00\nFries 25.00\nTiramisu 38.00\nTOTAL 233.00\nService 12%';
    try {
      await useText(txt);
      const ids = S.guests.map((g) => g.id);
      if (S.mode !== 'room') { [[0, 0], [1, 1], [2, 2], [4, 1]].forEach(([i, p]) => ids[p] && S.items[i]?.people.add(ids[p])); renderItems(); calc(); }
    } catch (e) { hint(e.message); }
  }

  /* ---------- calculation ---------- */
  let last = null, timer, t0;
  function payload() {
    const m = S.mode, guests = S.guests.map((g) => ({ name: g.name.trim() || '?', nights: g.nights, shares: g.shares, percent: g.percent === '' ? 0 : +g.percent, amount: g.amount === '' ? null : +g.amount }));
    const idx = (set) => [...set].map(gi).filter((i) => i >= 0);
    const ex = () => ({ treat: idx(S.treat), roundTo: S.roundTo, currency: { '₪': 'ILS', $: 'USD', '€': 'EUR', '£': 'GBP' }[S.cur] });
    if (m === 'trip') return ['/api/settle', { people: guests.map((g) => g.name), expenses: S.expenses.filter((x) => +x.amount > 0).map((x) => ({ title: x.title, amount: +x.amount, payer: Math.max(0, gi(x.payer)), people: idx(x.people) })) }];
    if (m === 'scan' || m === 'items') return ['/api/split', { mode: 'items', guests, tipPercent: S.tip, items: S.items.filter((it) => it.price !== '' && !isNaN(+it.price)).map((it) => ({ name: it.name || t('dish'), price: +it.price, qty: it.qty, people: idx(it.people) })), ...ex() }];
    if (m === 'pools') return ['/api/split', { mode: 'pools', guests, tipPercent: S.tip, pools: S.pools.filter((p) => p.amount !== '' && !isNaN(+p.amount)).map((p) => ({ name: p.name || '?', amount: +p.amount, people: idx(p.people) })), ...ex() }];
    if (m === 'hotel') return ['/api/split', { mode: 'nights', total: +S.total, guests, ...ex() }];
    return ['/api/split', { mode: m, total: +S.total, guests, tipPercent: S.tip, ...ex() }];
  }
  function calc() {
    clearTimeout(timer);
    if (S.mode === 'room') { if (!S.room) renderRoomIntro(); return; }
    timer = setTimeout(async () => {
      if (!S.guests.length) return render(null);
      const [url, body] = payload();
      if (url === '/api/split' && body.mode === 'items' && !body.items.length) return render({ error: t('needi') });
      t0 = performance.now();
      try { render(await api(url, body), url); } catch (e) { render({ error: e.message }); }
    }, 200);
  }
  let shown = 0, raf;
  function countTo(v) {
    cancelAnimationFrame(raf); const from = shown, st = performance.now(), big = $('#big'); if (!big) return;
    $('#fabt').textContent = fmt(v);
    if (from !== v) { big.classList.add('bump'); setTimeout(() => big.classList.remove('bump'), 250); }
    const step = (n) => { const k = Math.min(1, (n - st) / 500), e = 1 - (1 - k) ** 3; shown = from + (v - from) * e; big.textContent = fmt(k < 1 ? Math.round(shown * 100) / 100 : v); if (k < 1) raf = requestAnimationFrame(step); else shown = v; };
    raf = requestAnimationFrame(step);
  }
  const resHead = () => `<div class="out-h"><h3>${esc(t('res'))}</h3><span>${t0 ? Math.round(performance.now() - t0) + ' ms' : ''}</span></div><div class="big" id="big">${fmt(shown)}</div>`;
  const shareBar = (room) => `<div class="out-f"><button class="btn ghost" data-a="copy">${esc(t('copy'))}</button><button class="btn ghost" data-a="wa">${esc(t('wa'))}</button><button class="btn ghost" data-a="link">${esc(t('link'))}</button>${room ? '' : `<button class="btn ghost" data-a="img">${esc(t('img'))}</button><button class="btn ghost" data-a="wheel">${esc(t('wheel'))}</button>`}<button class="btn primary" data-a="share">${esc(t('share'))}</button></div>`;

  function render(d, url) {
    last = d; const box = $('#result');
    if (!d) { box.innerHTML = resHead() + `<p class="empty">${esc(t('empty'))}</p>`; countTo(0); return; }
    if (d.error) { box.innerHTML = resHead() + `<p class="err">${esc(d.error)}</p>`; return; }
    if (url === '/api/settle') return renderTrip(d);
    const payer = S.guests[gi(+S.payer)];
    let h = resHead();
    if (d.tip) h += `<div class="sumline"><span>${esc(t('sub'))}</span><span>${fmt(d.subtotal)}</span></div><div class="sumline"><span>${esc(t('tip'))} ${d.tipPercent}%</span><span>${fmt(d.tip)}</span></div>`;
    h += `<div class="bar">${d.shares.map((s, i) => `<i style="width:${d.total ? (s.amount / d.total) * 100 : 0}%;background:${col(i, 0)}"></i>`).join('')}</div>`;
    if (d.mode === 'items' && S.receiptTotal != null) {
      const gap = Math.round((S.receiptTotal - d.subtotal) * 100) / 100, same = Math.abs(gap) < 0.05;
      h += same ? `<p class="check">✓ ${esc(t('match'))}</p>` : `<p class="warn">${esc(t('diff', { a: fmt(S.receiptTotal), b: fmt(d.subtotal) }))}${gap > 0 ? `<button type="button" id="fixd">${esc(t('fixd'))}</button>` : ''}</p>`;
    }
    h += '<div id="rows">' + d.shares.map((s, i) => {
      const owe = payer && i !== gi(payer.id) ? `<span class="owe">${esc(t('owes', { n: payer.name }))}</span>` : '';
      const det = s.items?.length ? `<div class="det">${s.items.map((x) => `${esc(x.name)}${x.sharedWith > 1 ? ` (÷${x.sharedWith})` : ''} ${fmt(x.amount)}`).join(' · ')}${s.tip ? ` · ${esc(t('tip'))} ${fmt(s.tip)}` : ''}</div>` : '';
      const cov = s.covers ? `<span class="owe" style="color:var(--accent2)">${esc(t('covers', { a: fmt(s.covers) }))}</span>` : '';
      return `<div class="row ${det ? 'click' : ''} ${s.treated ? 'treated' : ''}" style="animation-delay:${i * 50}ms"><span class="av" style="background:${col(i, 0)};color:${col(i, 1)}">${s.treated ? '🎂' : esc(initial(s.name))}</span><span class="nm">${esc(s.name)}${s.treated ? '' : owe}${cov}</span><span class="pc">${s.treated ? '' : (d.total ? Math.round((s.amount / d.total) * 100) : 0) + '%'}</span><span class="am">${s.treated ? esc(t('treated')) : fmt(s.amount)}</span>${s.amount > 0 ? `<button class="msg" data-a="msg" data-x="${i}" title="WhatsApp" aria-label="WhatsApp">💬</button>` : ''}${det}</div>`;
    }).join('') + '</div>';
    const sum = Math.round(d.shares.reduce((a, s) => a + s.amount * 100, 0));
    if (d.roundingExtra) h += `<p class="check" style="color:var(--butter-ink)">${esc(t('rext', { a: fmt(d.roundingExtra) }))}</p>`;
    if (sum === Math.round(d.total * 100)) h += `<p class="check">✓ ${esc(t('chk'))}</p>`;
    h += badges(d);
    h += `<div class="payer"><span>${esc(t('paid'))}</span><select id="payer"><option value="">${esc(t('nobody'))}</option>${S.guests.map((g) => `<option value="${g.id}" ${String(g.id) === S.payer ? 'selected' : ''}>${esc(g.name || '?')}</option>`).join('')}</select></div>`;
    box.innerHTML = h + shareBar();
    countTo(d.total);
    $$('#rows .row.click').forEach((r) => r.onclick = (e) => { if (!e.target.closest('.msg')) r.classList.toggle('open'); });
    $('#payer').onchange = (e) => { S.payer = e.target.value; render(last, url); };
    $('#fixd')?.addEventListener('click', () => { addItem(t('p_other'), Math.round((S.receiptTotal - d.subtotal) * 100) / 100); renderItems(); calc(); });
  }
  function renderTrip(d) {
    let h = resHead().replace(esc(t('res')), esc(t('spent')));
    h += `<h5 style="margin:6px 0 10px;font-size:.85rem;color:var(--muted)">${esc(t('tr_title'))}</h5>`;
    h += d.transfers.length ? d.transfers.map((x, i) => {
      const a = gi(S.guests.find((g) => (g.name.trim() || '?') === x.from)?.id), b = gi(S.guests.find((g) => (g.name.trim() || '?') === x.to)?.id);
      return `<div class="xfer" style="animation-delay:${i * 80}ms"><span class="av" style="width:30px;height:30px;font-size:.8rem;background:${col(a, 0)};color:${col(a, 1)}">${esc(initial(x.from))}</span>${esc(x.from)}<span class="arrow"></span><b>${fmt(x.amount)}</b><span class="arrow"></span>${esc(x.to)}<span class="av" style="width:30px;height:30px;font-size:.8rem;background:${col(b, 0)};color:${col(b, 1)}">${esc(initial(x.to))}</span></div>`;
    }).join('') : `<p class="check">${esc(t('tr_none'))}</p>`;
    h += `<h5 style="margin:16px 0 4px;font-size:.85rem;color:var(--muted)">${esc(t('bal'))}</h5><div id="rows">` + d.balances.map((b, i) => `<div class="row" style="animation-delay:${i * 50}ms"><span class="av" style="background:${col(i, 0)};color:${col(i, 1)}">${esc(initial(b.name))}</span><span class="nm">${esc(b.name)}<span class="owe" style="color:var(--muted)">${esc(t('paidx', { a: fmt(b.paid) }))}</span></span><span class="am ${b.net > 0 ? 'pos' : b.net < 0 ? 'neg' : ''}">${b.net > 0 ? '+' : ''}${fmt(b.net)}</span></div>`).join('') + '</div>';
    $('#result').innerHTML = h + badges(d) + shareBar();
    countTo(d.total);
  }
  function badges(d) {
    const out = [], pal = ['c1', 'c2', 'c3', 'c4'];
    if (d.transfers) {
      const top = [...d.balances].sort((a, b) => b.paid - a.paid)[0];
      if (top?.paid) out.push(t('b_hero', { n: top.name }));
      if (!d.transfers.length) out.push(t('b_even'));
    } else {
      d.shares.filter((s) => s.treated).forEach((s) => out.push(t('b_bday', { n: s.name })));
      const pay = d.shares.filter((s) => !s.treated && s.amount > 0);
      if (d.mode === 'items' && pay.length > 1) {
        const cat = Object.fromEntries(S.items.map((it) => [it.name || t('dish'), it.cat]));
        const food = (s) => (s.items || []).filter((x) => cat[x.name] !== 'drink').reduce((a, x) => a + x.amount, 0);
        const drink = (s) => (s.items || []).filter((x) => cat[x.name] === 'drink').reduce((a, x) => a + x.amount, 0);
        const byF = [...pay].sort((a, b) => food(b) - food(a));
        out.push(t('b_big', { n: byF[0].name }));
        const dk = [...pay].sort((a, b) => drink(b) - drink(a))[0];
        if (drink(dk) > 0) out.push(t('b_drink', { n: dk.name }));
        if (food(byF.at(-1)) < food(byF[0])) out.push(t('b_light', { n: byF.at(-1).name }));
      } else if (pay.length > 1) {
        const top = [...pay].sort((a, b) => b.amount - a.amount);
        out.push(top[0].amount === top.at(-1).amount ? t('b_even') : t('b_top', { n: top[0].name }));
      }
    }
    return out.length ? `<div class="badges">${out.map((x, i) => `<span class="${pal[i % 4]}" style="animation-delay:${300 + i * 120}ms">${esc(x)}</span>`).join('')}</div>` : '';
  }

  /* ---------- share ---------- */
  function summary() {
    if (S.mode === 'room' && S.room) return `${t('r_msg')}\n${roomLink()}`;
    if (!last || last.error) return '';
    if (last.transfers) return (last.transfers.length ? last.transfers.map((x) => `${x.from} → ${x.to}: ${fmt(x.amount)}`).join('\n') : t('tr_none')) + `\n${t('spent')}: ${fmt(last.total)} · Evenly`;
    const payer = S.guests[gi(+S.payer)];
    return last.shares.map((s) => `${s.name}: ${fmt(s.amount)}${payer && s.name !== (payer.name.trim() || '?') ? ` → ${payer.name}` : ''}`).join('\n') + (last.tip ? `\n${t('tip')} ${last.tipPercent}%: ${fmt(last.tip)}` : '') + `\n= ${fmt(last.total)} · Evenly`;
  }
  const copy = async (s, msg = t('copied')) => { try { await navigator.clipboard.writeText(s); toast(msg); } catch { toast(s); } };
  $('#result').addEventListener('click', async (e) => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    const a = b.dataset.a, txt = summary(); if (!txt && a !== 'link') return;
    if (a === 'msg') { const s = last.shares[+b.dataset.x]; open('https://wa.me/?text=' + encodeURIComponent(t('msgto', { n: s.name, a: fmt(s.amount) })), '_blank', 'noopener'); return; }
    if (a === 'img') return imageModal();
    if (a === 'wheel') return wheelModal();
    if (S.mode !== 'room') saveRecent();
    beep('ok');
    if (a === 'copy') { await copy(txt); burstAt(b); }
    if (a === 'wa') { open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank', 'noopener'); burstAt(b); }
    if (a === 'link') { const u = S.mode === 'room' && S.room ? roomLink() : toLink(); if (S.mode !== 'room') history.replaceState(null, '', u); copy(u, t('linked')); }
    if (a === 'share') { if (navigator.share) { try { await navigator.share({ title: 'Evenly', text: txt }); burstAt(b); } catch {} } else copy(txt); }
  });
  function toLink() {
    const ix = (set) => [...set].map(gi);
    const st = { tr: [...S.treat].map(gi), rd: S.roundTo, m: S.mode, tp: S.tip, tt: S.total, rt: S.receiptTotal, py: S.payer ? gi(+S.payer) : -1,
      g: S.guests.map((g) => [g.name, g.nights, g.percent, g.shares, g.amount]),
      i: S.items.map((x) => [x.name, x.price, x.qty, x.cat, ix(x.people)]),
      p: S.pools.map((x) => [x.key, x.name, x.amount, ix(x.people)]),
      x: S.expenses.map((x) => [x.key, x.title, x.amount, gi(x.payer), ix(x.people)]) };
    return `${location.origin}/#s=${btoa(unescape(encodeURIComponent(JSON.stringify(st))))}`;
  }
  function fromLink() {
    const m = location.hash.match(/#s=([\w+/=]+)/); if (!m) return false;
    try {
      const st = JSON.parse(decodeURIComponent(escape(atob(m[1]))));
      if (!F[st.m]) return false;
      S.guests = []; S.items = []; S.pools = []; S.expenses = [];
      st.g.slice(0, 30).forEach(([n, k, p, s, a]) => addGuest(String(n).slice(0, 30), { nights: Math.max(1, k | 0), percent: p ?? '', shares: +s || 0, amount: a ?? '' }));
      const ids = (arr) => (arr || []).map((i) => S.guests[i]?.id).filter(Boolean);
      (st.i || []).slice(0, 300).forEach(([n, p, q, c, ps]) => addItem(String(n).slice(0, 60), p, Math.max(1, q | 0), CATS[c] ? c : 'food', ids(ps)));
      (st.p || []).slice(0, 50).forEach(([k, n, a, ps]) => { addPool(k, a, ids(ps)); S.pools.at(-1).name = String(n).slice(0, 40); });
      (st.x || []).slice(0, 300).forEach(([k, n, a, py, ps]) => { addExp(k, a, S.guests[py]?.id ?? null, ids(ps)); S.expenses.at(-1).title = String(n).slice(0, 40); });
      S.tip = +st.tp || 0; S.total = st.tt; S.receiptTotal = typeof st.rt === 'number' ? st.rt : null;
      S.payer = S.guests[st.py] ? String(S.guests[st.py].id) : '';
      S.treat = new Set(ids(st.tr)); S.roundTo = [0, 1, 5, 10].includes(st.rd) ? st.rd : 0;
      return st.m;
    } catch { return false; }
  }

  /* ---------- group room (host) ---------- */
  let poll;
  const roomLink = () => `${location.origin}/#room=${S.room.id}`;
  const stopPoll = () => { clearInterval(poll); poll = null; };
  const startPoll = () => { stopPoll(); poll = setInterval(async () => { if (!S.room || S.mode !== 'room' || document.hidden) return; try { const v = await api(`/api/rooms/${S.room.id}`); if (v.version !== S.room.version) renderRoom(v); } catch {} }, 3000); };
  function renderRoomIntro() {
    $('#result').innerHTML = `<div class="out-h"><h3>🔗 ${esc(t('m_room'))}</h3></div><p class="empty" style="font-size:3rem;padding:20px 0 0">📱📱📱</p><p class="empty" style="padding-top:8px">${esc(t('r_hint'))}</p>`;
    $('#fabt').textContent = '🔗';
  }
  async function makeRoom() {
    const items = S.items.filter((it) => it.price !== '' && !isNaN(+it.price)).map((it) => ({ name: it.name || t('dish'), price: +it.price, qty: it.qty }));
    if (!items.length) return toast(t('needi'));
    try {
      S.room = await api('/api/rooms', { items, tipPercent: S.tip, people: S.guests.map((g) => g.name.trim()).filter(Boolean), title: t('m_room') });
      renderRoom(S.room); startPoll(); burstAt($('#mkroom'));
      if (innerWidth < 900) $('#result').scrollIntoView({ behavior: 'smooth' });
    } catch (e) { toast(e.message); }
  }
  let wasDone = false;
  function renderRoom(v) {
    const prev = S.room; S.room = v;
    const claimedPct = v.claimed + v.unclaimed ? (v.claimed / (v.claimed + v.unclaimed)) * 100 : 0;
    let h = `<div class="out-h"><h3>🔗 ${esc(t('m_room'))}</h3><span class="live">${esc(t('r_live'))}</span></div><div class="big" id="big">${fmt(shown)}</div>
      <div class="linkbox"><span style="flex:1">${esc(roomLink())}</span></div>
      <div class="sumline"><span>${esc(t('r_claimed', { a: fmt(v.claimed), b: fmt(v.claimed + v.unclaimed) }))}</span><span>${Math.round(claimedPct)}%</span></div>
      <div class="claimbar"><i style="width:${claimedPct}%"></i></div>`;
    const tot = v.totals.filter((x) => x.amount > 0);
    h += '<div id="rows">' + (tot.length ? tot.map((x, i) => {
      const mine = v.items.filter((it) => it.claims.includes(x.name)).map((it) => it.name).join(' · ');
      return `<div class="row click" style="animation-delay:${i * 50}ms"><span class="av" style="background:${col(i, 0)};color:${col(i, 1)}">${esc(initial(x.name))}</span><span class="nm">${esc(x.name)}</span><span class="am">${fmt(x.amount)}</span><div class="det">${esc(mine)}</div></div>`;
    }).join('') : `<p class="empty">⏳ ${esc(t('r_wait'))}</p>`) + '</div>';
    const left = v.items.filter((it) => !it.claims.length);
    if (left.length && tot.length) h += `<p class="warn" style="margin-top:12px">${esc(t('r_left'))}: ${left.map((it) => esc(it.name)).join(' · ')}</p>`;
    h += shareBar(true) + `<div style="display:flex;justify-content:space-between;margin-top:12px;font-size:.84rem"><a href="${esc(roomLink())}" target="_blank" rel="noopener" style="color:var(--accent);font-weight:600">${esc(t('r_open'))}</a><button id="newroom" style="color:var(--muted);font-weight:600">↻ ${esc(t('r_new'))}</button></div>`;
    $('#result').innerHTML = h;
    countTo(v.total);
    $$('#rows .row.click').forEach((r) => r.onclick = () => r.classList.toggle('open'));
    $('#newroom').onclick = () => { S.room = null; stopPoll(); renderRoomIntro(); };
    const done = !left.length && tot.length > 0;
    if (done && !wasDone && prev) burstAt($('.claimbar'));
    wasDone = done;
  }

  /* ---------- group room (guest screen) ---------- */
  const guest = { id: null, room: null, name: null, timer: null };
  function openGuest(id) {
    guest.id = id; guest.name = store.get('room:' + id);
    document.body.classList.add('guest-mode'); $('#guest').classList.remove('hide');
    loadGuest(); guest.timer = setInterval(() => !document.hidden && loadGuest(), 3000);
  }
  async function loadGuest() {
    try { const v = await api(`/api/rooms/${guest.id}`); if (!guest.room || v.version !== guest.room.version) { guest.room = v; renderGuest(); } }
    catch { guest.room = null; clearInterval(guest.timer); $('#guest').innerHTML = `<div class="g-title"><span class="em">⌛</span><h2>${esc(t('g_gone'))}</h2><p><a class="btn primary" href="/" style="margin-top:18px">Evenly</a></p></div>`; }
  }
  function renderGuest() {
    const v = guest.room, box = $('#guest'); if (!v) return;
    if (!guest.name) {
      box.innerHTML = `<div class="g-title"><span class="em">👋</span><h2>${esc(t('g_who'))}</h2><p>${esc(t('r_msg'))}</p></div>
        <div class="names">${v.people.map((p) => `<button data-n="${esc(p)}">${esc(p)}</button>`).join('')}</div>
        <div style="display:flex;gap:8px;max-width:360px;margin:0 auto"><input id="gname" maxlength="30" placeholder="${esc(t('g_new'))}"><button class="btn primary" id="ggo">${esc(t('g_go'))}</button></div>`;
      const pick = async (n) => { n = n.trim(); if (!n) return; guest.name = n; store.set('room:' + guest.id, n); try { guest.room = await api(`/api/rooms/${guest.id}/join`, { name: n }); } catch {} renderGuest(); };
      $$('.names button', box).forEach((b) => b.onclick = () => pick(b.dataset.n));
      $('#ggo').onclick = () => pick($('#gname').value);
      $('#gname').onkeydown = (e) => e.key === 'Enter' && pick(e.target.value);
      return;
    }
    const me = v.totals.find((x) => x.name === guest.name)?.amount || 0;
    box.innerHTML = `<div class="g-title"><span class="em">🍽️</span><h2>${esc(t('g_pick'))}</h2><p>${esc(guest.name)} · <button id="gme" style="color:var(--accent);font-weight:600">${esc(t('g_me', { n: guest.name }))}</button></p></div>
      <div id="gitems">${v.items.map((it, i) => {
        const on = it.claims.includes(guest.name), others = it.claims.filter((c) => c !== guest.name);
        const n = it.claims.length + (on ? 0 : 1);
        return `<button class="gitem ${on ? 'on' : ''}" data-id="${it.id}" style="animation-delay:${i * 40}ms"><span class="ck">✓</span><span class="gn">${it.qty > 1 ? it.qty + '× ' : ''}${esc(it.name)}<small>${others.length ? esc(others.join(', ')) + ' · ' + esc(t('g_shared', { n: n })) : ''}</small></span><span class="gp">${fmt(it.price * it.qty)}</span></button>`;
      }).join('')}</div>
      <details style="margin-top:18px"><summary style="cursor:pointer;font-weight:600;color:var(--muted)">${esc(t('g_everyone'))}</summary>${v.totals.map((x, i) => `<div class="row"><span class="av" style="background:${col(i, 0)};color:${col(i, 1)}">${esc(initial(x.name))}</span><span class="nm">${esc(x.name)}</span><span class="am">${fmt(x.amount)}</span></div>`).join('')}</details>
      <div class="gbar"><div><small>${esc(t('g_you'))}</small><b>${fmt(me)}</b><small>${v.tipPercent ? esc(t('g_inc', { n: v.tipPercent })) : ''}</small></div><a class="btn" href="/">Evenly</a></div>`;
    $('#gme').onclick = () => { guest.name = null; store.set('room:' + guest.id, ''); renderGuest(); };
    $$('.gitem', box).forEach((b) => b.onclick = async () => {
      const on = !b.classList.contains('on'); b.classList.toggle('on', on);
      if (on) burstAt(b.querySelector('.ck'));
      try { guest.room = await api(`/api/rooms/${guest.id}/claim`, { name: guest.name, itemId: +b.dataset.id, on }); renderGuest(); } catch (e) { toast(e.message); }
    });
  }

  /* ---------- recent splits (this browser only) ---------- */
  const recentList = () => { try { return JSON.parse(store.get('recent') || '[]'); } catch { return []; } };
  function saveRecent() {
    if (!last || last.error) return;
    const list = recentList().filter((r) => r.m !== S.mode || Math.abs(r.tot - last.total) > 0.001);
    list.unshift({ m: S.mode, tot: last.total, cur: S.cur, at: Date.now(), u: toLink() });
    store.set('recent', JSON.stringify(list.slice(0, 6))); renderRecent();
  }
  function renderRecent() {
    const list = recentList(), box = $('#recent'); if (!box) return;
    box.innerHTML = list.length ? `<h5>${esc(t('recent'))}</h5>` + list.map((r) => `<a class="rc" href="${esc(r.u)}">${MODES.find((m) => m.k === r.m)?.e || '🧾'} ${esc(t('m_' + r.m))} · ${esc(r.cur)}${(+r.tot).toLocaleString()} <small>${new Date(r.at).toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-GB', { day: 'numeric', month: 'short' })}</small></a>`).join('') : '';
  }

  /* ---------- modals: roulette wheel + receipt image ---------- */
  const modal = (html) => { $('#mbox').innerHTML = `<button class="x" aria-label="close">✕</button>` + html; $('#modal').hidden = false; $('#mbox .x').onclick = closeModal; };
  const closeModal = () => { $('#modal').hidden = true; };
  $('#modal').onclick = (e) => { if (e.target.id === 'modal') closeModal(); };
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  const css = (v) => getComputedStyle(root).getPropertyValue(v).trim();

  function wheelModal() {
    const ppl = S.guests.filter((g) => g.name.trim()); if (ppl.length < 2) return;
    modal(`<h3>🎡 ${esc(t('w_title'))}</h3><p>${esc(t('w_sub'))}</p><div class="wheelw"><canvas id="wc" width="680" height="680"></canvas></div><div class="winner" id="win"></div><div class="acts"><button class="btn primary" id="spin">${esc(t('w_spin'))}</button></div>`);
    const c = $('#wc'), x = c.getContext('2d'), n = ppl.length, seg = (Math.PI * 2) / n;
    const draw = (rot) => {
      x.clearRect(0, 0, 680, 680);
      ppl.forEach((g, i) => {
        const a = rot + i * seg - Math.PI / 2;
        x.beginPath(); x.moveTo(340, 340); x.arc(340, 340, 330, a, a + seg); x.closePath();
        x.fillStyle = css(PAL[gi(g.id) % 4][0]); x.fill(); x.strokeStyle = css('--surface'); x.lineWidth = 6; x.stroke();
        x.save(); x.translate(340, 340); x.rotate(a + seg / 2); x.fillStyle = css(PAL[gi(g.id) % 4][1]);
        x.font = '700 34px Fredoka, Rubik, sans-serif'; x.textAlign = 'right'; x.fillText(g.name.slice(0, 12), 300, 12); x.restore();
      });
      x.beginPath(); x.arc(340, 340, 46, 0, Math.PI * 2); x.fillStyle = css('--surface'); x.fill(); x.font = '44px sans-serif'; x.textAlign = 'center'; x.fillText('💸', 340, 356);
    };
    let rot = 0; draw(0);
    $('#spin').onclick = () => {
      const pick = Math.floor(Math.random() * n), turns = 5 + Math.floor(Math.random() * 3), TAU = Math.PI * 2;
      const from = rot % TAU, jitter = (Math.random() - 0.5) * seg * 0.6, target = turns * TAU + ((TAU - (pick * seg + seg / 2) + jitter) % TAU + TAU) % TAU, st = performance.now(), dur = 4200;
      let lastSeg = -1; $('#spin').disabled = true; $('#win').textContent = '';
      const step = (now) => {
        const k = Math.min(1, (now - st) / dur), e = 1 - (1 - k) ** 4; rot = from + (target - from) * e; draw(rot);
        const sIdx = Math.floor(((rot % (Math.PI * 2)) / seg)); if (sIdx !== lastSeg) { lastSeg = sIdx; beep('tick'); }
        if (k < 1) return requestAnimationFrame(step);
        const g = ppl[pick], w = $('#win');
        w.textContent = t('w_win', { n: g.name, a: last && !last.error && last.total ? fmt(last.total) : '' }); w.classList.remove('show'); void w.offsetWidth; w.classList.add('show');
        beep('win'); burstAt(w); $('#spin').disabled = false;
        if (!last?.transfers && !$('#setp')) $('.acts', $('#mbox')).insertAdjacentHTML('beforeend', `<button class="btn ghost" id="setp">${esc(t('w_set'))}</button>`);
        if ($('#setp')) $('#setp').onclick = () => { S.payer = String(g.id); closeModal(); render(last, '/api/split'); };
      };
      requestAnimationFrame(step);
    };
  }

  async function imageModal() {
    if (!last || last.error) return;
    await document.fonts?.ready;
    const W = 1080, rows = last.transfers ? last.transfers.length || 1 : last.shares.length, H = 560 + rows * 120 + (last.tip && !last.transfers ? 90 : 0);
    const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
    const bg = x.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#FBE3DA'); bg.addColorStop(0.5, '#ECE6FA'); bg.addColorStop(1, '#DDF0E3');
    x.fillStyle = bg; x.fillRect(0, 0, W, H);
    [['#F3D3C6', 120, 140, 220], ['#E3DCF5', 960, 300, 260], ['#D6E9DC', 200, H - 120, 240]].forEach(([cl, cx2, cy, r]) => { x.globalAlpha = 0.7; x.fillStyle = cl; x.beginPath(); x.arc(cx2, cy, r, 0, 7); x.fill(); });
    x.globalAlpha = 1;
    const P = 90, top = 90, bot = H - 70; x.fillStyle = '#FFFDF9'; x.shadowColor = 'rgba(58,51,69,.18)'; x.shadowBlur = 40; x.shadowOffsetY = 14;
    x.beginPath(); x.roundRect(P, top, W - 2 * P, bot - top, 36); x.fill(); x.shadowColor = 'transparent';
    const rtl = lang === 'he', L0 = rtl ? W - P - 60 : P + 60, R0 = rtl ? P + 60 : W - P - 60;
    const txt = (s, X, Y, font, color, align) => { x.font = font; x.fillStyle = color; x.textAlign = align; x.direction = rtl ? 'rtl' : 'ltr'; x.fillText(s, X, Y); };
    const A = rtl ? 'right' : 'left', B = rtl ? 'left' : 'right';
    const m = MODES.find((q) => q.k === S.mode);
    txt('Evenly', L0, top + 90, '700 56px Fredoka, Rubik, sans-serif', '#3A3345', A);
    txt(`${m.e} ${t('m_' + m.k)}`, L0, top + 140, '600 32px Rubik, sans-serif', '#8C7BD6', A);
    txt(new Date().toLocaleDateString(rtl ? 'he-IL' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), R0, top + 90, '500 28px Rubik, sans-serif', '#8B8296', B);
    const dash = (y) => { x.setLineDash([14, 12]); x.strokeStyle = '#E2D8CB'; x.lineWidth = 3; x.beginPath(); x.moveTo(P + 50, y); x.lineTo(W - P - 50, y); x.stroke(); x.setLineDash([]); };
    dash(top + 180);
    let y = top + 270;
    const pal = [['#F3D3C6', '#B2644D'], ['#E3DCF5', '#6E5FC0'], ['#D6E9DC', '#3F7E5A'], ['#F6EBC8', '#9A7A22']];
    const avatar = (i, s, X, Y) => { const [b2, f] = pal[i % 4]; x.fillStyle = b2; x.beginPath(); x.roundRect(X - 36, Y - 52, 72, 72, 22); x.fill(); txt(s, X, Y - 2, '700 34px Fredoka, Rubik, sans-serif', f, 'center'); };
    if (last.transfers) {
      (last.transfers.length ? last.transfers : [{ from: t('b_even'), to: '', amount: 0 }]).forEach((tr, i) => {
        avatar(i, initial(tr.from), L0 + (rtl ? -36 : 36), y);
        txt(tr.to ? `${tr.from}  →  ${tr.to}` : tr.from, L0 + (rtl ? -100 : 100), y, '600 36px Rubik, sans-serif', '#3A3345', A);
        if (tr.amount) txt(fmt(tr.amount), R0, y, '800 40px Rubik, sans-serif', '#3A3345', B); y += 120;
      });
    } else {
      last.shares.forEach((s, i) => {
        avatar(i, s.treated ? '🎂' : initial(s.name), L0 + (rtl ? -36 : 36), y);
        txt(s.name, L0 + (rtl ? -100 : 100), y, '600 38px Rubik, sans-serif', '#3A3345', A);
        txt(s.treated ? t('treated') : fmt(s.amount), R0, y, '800 42px Rubik, sans-serif', s.treated ? '#D9917A' : '#3A3345', B); y += 120;
      });
      if (last.tip) { txt(`${t('tip')} ${last.tipPercent}%`, L0, y - 20, '500 30px Rubik, sans-serif', '#8B8296', A); txt(fmt(last.tip), R0, y - 20, '600 30px Rubik, sans-serif', '#8B8296', B); y += 90; }
    }
    dash(y - 60);
    txt(last.transfers ? t('spent') : t('tot'), L0, y + 20, '600 34px Rubik, sans-serif', '#8B8296', A);
    const g2 = x.createLinearGradient(R0 - 300, 0, R0 + 300, 0); g2.addColorStop(0, '#D9917A'); g2.addColorStop(1, '#8C7BD6');
    txt(fmt(last.total), R0, y + 30, '700 64px Fredoka, Rubik, sans-serif', g2, B);
    txt(location.host || 'evenly-app.up.railway.app', W / 2, H - 28, '500 24px Rubik, sans-serif', '#8B8296', 'center');
    const url = c.toDataURL('image/png');
    modal(`<h3>🖼️ ${esc(t('i_title'))}</h3><p>${esc(t('i_sub'))}</p><img src="${url}" alt="" style="width:100%;border-radius:18px;margin:14px 0;box-shadow:var(--shadow)"><div class="acts"><a class="btn ghost" id="idl" href="${url}" download="evenly.png">${esc(t('i_dl'))}</a><button class="btn primary" id="ish">${esc(t('i_share'))}</button></div>`);
    $('#ish').onclick = async () => {
      try { const blob = await (await fetch(url)).blob(), file = new File([blob], 'evenly.png', { type: 'image/png' }); if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], title: 'Evenly' }); else $('#idl').click(); } catch {}
    };
    saveRecent(); beep('ok');
  }

  /* ---------- misc ---------- */
  function fabCheck() {
    const fab = $('#fab');
    if (!S.mode || innerWidth >= 900) return fab.classList.remove('show');
    const w = $('#work').getBoundingClientRect(), r = $('#result').getBoundingClientRect();
    fab.classList.toggle('show', w.top < innerHeight * 0.6 && r.top > innerHeight);
  }
  addEventListener('hashchange', () => { if (/^#(room|s)=/.test(location.hash)) location.reload(); });
  $('#copycurl').onclick = () => copy($('#curl').innerText.split('\n\n')[0]);

  /* ---------- start ---------- */
  demo();
  const roomId = location.hash.match(/#room=([\w]+)/)?.[1];
  const linked = fromLink();
  renderPicker(); applyLang();
  if (roomId) openGuest(roomId);
  else if (linked) { openMode(linked); setTimeout(() => $('#app').scrollIntoView(), 200); }
})();
