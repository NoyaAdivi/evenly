/* FAQ content for noya-app.js */
window.NOYA_FAQ = {
 "topics": [
  {
   "id": "split",
   "icon": "🧾",
   "he": "חלוקה",
   "en": "Splitting"
  },
  {
   "id": "group",
   "icon": "🔗",
   "he": "קישור קבוצתי",
   "en": "Group link"
  },
  {
   "id": "receipt",
   "icon": "📸",
   "he": "סריקת קבלה",
   "en": "Receipt scan"
  },
  {
   "id": "tech",
   "icon": "⚙️",
   "he": "טכנולוגיה",
   "en": "Tech"
  },
  {
   "id": "app",
   "icon": "📲",
   "he": "אפליקציה",
   "en": "App"
  }
 ],
 "items": [
  {
   "t": "split",
   "he": [
    "באילו דרכים אפשר לחלק?",
    "שווה בשווה, לפי מנה, אוכל ושתייה בנפרד, אחוזים, חלקים, סכומים מדויקים, לילות במלון, הוצאות טיול וקישור קבוצתי. בוחרים כרטיס והחלוקה מוכנה."
   ],
   "en": [
    "What ways can I split?",
    "Equally, per dish, food and drinks apart, percentages, shares, exact amounts, hotel nights, trip expenses and a group link. Pick a card and the split is ready."
   ]
  },
  {
   "t": "split",
   "he": [
    "החלוקה באמת מדויקת עד האגורה?",
    "כן. העיגול נעשה בשיטת השארית הגדולה, כך שהסכומים תמיד מסתכמים בדיוק לסך הכל, כולל טיפ."
   ],
   "en": [
    "Is it really exact to the agora?",
    "Yes. Rounding uses the largest remainder method, so the shares always add up exactly to the total, tip included."
   ]
  },
  {
   "t": "split",
   "he": [
    "מה עושים כשמישהו חוגג יום הולדת?",
    "מסמנים אותו כמוזמן והחלק שלו מתחלק בין כל השאר. אפשר גם לעגל למעלה בלי מטבעות, וההפרש נוסף לטיפ."
   ],
   "en": [
    "What if it is someone's birthday?",
    "Mark them as treated and their part is split among everyone else. You can also round up to skip coins, and the difference goes to the tip."
   ]
  },
  {
   "t": "split",
   "he": [
    "איך עובדות הוצאות טיול?",
    "כל אחד מוסיף מה שילם ובשביל מי, ו-Evenly מחשב מי מעביר למי במספר ההעברות הקטן ביותר."
   ],
   "en": [
    "How do trip expenses work?",
    "Everyone adds what they paid and for whom, and Evenly works out who pays whom in the fewest transfers."
   ]
  },
  {
   "t": "group",
   "he": [
    "איך עובד הקישור הקבוצתי?",
    "יוצרים קישור ושולחים לחברים. כל אחד פותח בטלפון, בוחר שם ומסמן מה לקח, והסכומים מתעדכנים אצלכם בזמן אמת. הקישור תקף ל-24 שעות."
   ],
   "en": [
    "How does the group link work?",
    "Create a link and send it to your friends. Each one opens it on their phone, picks a name and taps what they had, and the totals update live for you. Links last 24 hours."
   ]
  },
  {
   "t": "group",
   "he": [
    "החברים צריכים להתקין משהו?",
    "לא. הקישור נפתח בכל דפדפן, בלי הרשמה ובלי אפליקציה."
   ],
   "en": [
    "Do my friends need to install anything?",
    "No. The link opens in any browser, with no sign-up and no app."
   ]
  },
  {
   "t": "receipt",
   "he": [
    "איך עובדת סריקת הקבלה?",
    "מצלמים או גוררים תמונה של הקבלה, היא נקראת בדפדפן בעברית ובאנגלית, והמנות והסכום מתמלאים לבד. אם משהו לא מסתדר, Evenly מראה את ההפרש ומאפשר להוסיף אותו."
   ],
   "en": [
    "How does receipt scanning work?",
    "Snap or drop a photo of the receipt. It is read in your browser in Hebrew and English, and the dishes and total fill in by themselves. If something does not add up, Evenly shows the difference and lets you add it."
   ]
  },
  {
   "t": "receipt",
   "he": [
    "התמונה של הקבלה נשלחת לשרת?",
    "לא. התמונה נקראת בדפדפן ורק הטקסט שזוהה מגיע לשרת כדי לחלק."
   ],
   "en": [
    "Is the receipt photo sent to a server?",
    "No. The photo is read in your browser and only the recognized text reaches the server for splitting."
   ]
  },
  {
   "t": "tech",
   "he": [
    "על מה זה בנוי?",
    "שרת Node.js ו-Express עם API ב-JSON, בדיקות על Node 20 ו-22, אימג׳ Docker בלי root ופייפליין GitHub Actions שמעלה כל שינוי ל-Railway ובודק אותו דרך /health."
   ],
   "en": [
    "What is it built with?",
    "A Node.js and Express server with a JSON API, tests on Node 20 and 22, a non-root Docker image and a GitHub Actions pipeline that deploys every change to Railway and checks it via /health."
   ]
  },
  {
   "t": "app",
   "he": [
    "אפשר להתקין את Evenly כאפליקציה?",
    "כן. בכרום או באדג׳ לוחצים על כפתור ההתקנה שמופיע בתחתית המסך או בשורת הכתובת, ובאייפון בוחרים שיתוף ואז \"הוספה למסך הבית\". האפליקציה נפתחת בחלון משלה עם אייקון משלה."
   ],
   "en": [
    "Can I install Evenly as an app?",
    "Yes. In Chrome or Edge tap the install button at the bottom of the screen or in the address bar. On iPhone tap Share, then \"Add to Home Screen\". It opens in its own window with its own icon."
   ]
  },
  {
   "t": "app",
   "he": [
    "זה עובד גם בלי אינטרנט?",
    "אחרי הביקור הראשון הקבצים של האתר נשמרים במכשיר, כך שהוא נפתח מהר ועובד גם כשהחיבור נופל. פעולות שצריכות שרת חיצוני יחכו שהחיבור יחזור."
   ],
   "en": [
    "Does it work offline?",
    "After your first visit the site files are kept on your device, so it opens fast and keeps working when the connection drops. Anything that needs an outside server waits until you are back online."
   ]
  },
  {
   "t": "app",
   "he": [
    "זה עולה כסף?",
    "לא. הכל חינם, בלי פרסומות ובלי הרשמה, והקוד פתוח בגיטהאב."
   ],
   "en": [
    "Does it cost anything?",
    "No. It is free, with no ads and no sign-up, and the code is open on GitHub."
   ]
  }
 ]
};
