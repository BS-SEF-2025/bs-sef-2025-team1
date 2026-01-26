# Quick Start Guide - AmiTeam Backend

מדריך מהיר להפעלת ה-Backend של AmiTeam

## התקנה מהירה (5 דקות)

### 1. התקן dependencies

```bash
cd backend
npm install
```

### 2. צור קובץ .env

```bash
cp .env.example .env
```

תוכן `.env` (ברירת מחדל):
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

### 3. הפעל את השרת

```bash
npm run dev
```

השרת רץ על: `http://localhost:5000`

---

## בדיקה מהירה

### 1. בדוק שהשרת עובד

```bash
curl http://localhost:5000/api/health
```

תשובה צפויה:
```json
{
  "success": true,
  "message": "AmiTeam API is running",
  "timestamp": "2024-01-24T10:00:00.000Z"
}
```

### 2. התחבר עם משתמש דמו

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "michal.cohen@university.ac.il",
    "password": "password123"
  }'
```

העתק את ה-`token` מהתשובה.

### 3. קבל רשימת קורסים

```bash
curl http://localhost:5000/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## משתמשי דמו

### סגל (Staff)
- **Email:** `michal.cohen@university.ac.il`
- **Password:** `password123`

### סטודנטים (Students)
- **Email:** `yossi.a@student.ac.il`
- **Password:** `password123`

כל המשתמשים הדמו משתמשים באותה סיסמה: `password123`

---

## Endpoints עיקריים

### Authentication
```bash
POST /api/auth/register    # הרשמה
POST /api/auth/login       # התחברות
GET  /api/auth/me          # קבל משתמש נוכחי
```

### Courses (סגל בלבד)
```bash
POST   /api/courses        # צור קורס
GET    /api/courses        # רשימת קורסים
GET    /api/courses/:id    # קורס ספציפי
PUT    /api/courses/:id    # עדכן קורס
DELETE /api/courses/:id    # מחק קורס
```

### Groups (סגל בלבד)
```bash
POST   /api/groups         # צור קבוצה
GET    /api/groups         # רשימת קבוצות
PUT    /api/groups/:id     # עדכן קבוצה
DELETE /api/groups/:id     # מחק קבוצה
```

### Assignments (סגל בלבד)
```bash
POST   /api/assignments        # צור משימה
GET    /api/assignments        # רשימת משימות
PUT    /api/assignments/:id    # עדכן משימה
DELETE /api/assignments/:id    # מחק משימה
```

### Submissions (סטודנטים)
```bash
POST   /api/submissions    # הגש ביקורת
GET    /api/submissions    # רשימת הגשות (עם פילטרים)
DELETE /api/submissions/:id # מחק הגשה
```

---

## דוגמאות שימוש

### יצירת משימה (Assignment)

```bash
curl -X POST http://localhost:5000/api/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_STAFF_TOKEN" \
  -d '{
    "title": "ביקורת פרויקט גמר",
    "description": "הערכה של פרויקטי גמר",
    "courseId": "c1",
    "deadline": "2024-12-31T23:59:59.000Z",
    "fields": [
      {
        "name": "איכות קוד",
        "type": "scale",
        "required": true,
        "weight": 50,
        "scaleMin": 1,
        "scaleMax": 10
      },
      {
        "name": "עיצוב",
        "type": "scale",
        "required": true,
        "weight": 50,
        "scaleMin": 1,
        "scaleMax": 10
      },
      {
        "name": "הערות",
        "type": "text",
        "required": false,
        "weight": 0
      }
    ]
  }'
```

**חוקים חשובים:**
- סכום משקלות הקריטריונים חייב להיות 100%
- לפחות קריטריון אחד חובה
- קריטריון תמיד: `type: "scale"`, `required: true`, `weight > 0`
- פידבק תמיד: `weight: 0`

---

### הגשת ביקורת (Submission)

```bash
curl -X POST http://localhost:5000/api/submissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" \
  -d '{
    "assignmentId": "a1",
    "reviewedGroupId": "g2",
    "answers": [
      { "fieldId": "f1", "value": 8 },
      { "fieldId": "f2", "value": 9 },
      { "fieldId": "f3", "value": "עבודה מעולה!" }
    ]
  }'
```

**חוקים:**
- לא ניתן להגיש אחרי deadline
- לא ניתן לבקר את הקבוצה של עצמך
- כל השדות החובה חייבים להיות מלאים

---

## קבלת סטטיסטיקות

```bash
curl http://localhost:5000/api/submissions/stats/a1 \
  -H "Authorization: Bearer YOUR_STAFF_TOKEN"
```

תשובה:
```json
{
  "success": true,
  "data": {
    "totalSubmissions": 10,
    "averageScore": 85.5,
    "groupStats": [
      {
        "groupId": "g1",
        "count": 3,
        "totalScore": 260,
        "average": 86.67
      }
    ]
  }
}
```

---

## Troubleshooting

### השרת לא עולה
1. בדוק ש-Port 5000 פנוי
2. בדוק ש-node_modules מותקן: `npm install`
3. בדוק את הלוגים ב-`logs/` directory

### שגיאת Authentication
1. ודא שה-Token נמצא ב-header: `Authorization: Bearer <token>`
2. בדוק שה-Token לא פג תוקף (ברירת מחדל 7 ימים)
3. התחבר מחדש לקבלת Token חדש

### שגיאת Validation
בדוק את ההודעה המפורטת בתשובת השגיאה:
```json
{
  "success": false,
  "error": "\"email\" must be a valid email"
}
```

---

## בדיקות (Tests)

### הרץ את כל הבדיקות
```bash
npm test
```

### הרץ בדיקות עם Coverage
```bash
npm test -- --coverage
```

### הרץ בדיקות ב-Watch Mode
```bash
npm run test:watch
```

---

## מעבר ל-Production

### 1. שנה את ה-Environment Variables

```env
NODE_ENV=production
JWT_SECRET=your-strong-random-secret-key-here
CORS_ORIGIN=https://your-production-domain.com
DATABASE_URL=your-production-database-url
```

### 2. בנה את הפרויקט

```bash
npm run build
```

### 3. הרץ בmode production

```bash
npm start
```

### 4. המלצות אבטחה

- [ ] שנה את `JWT_SECRET` למפתח אקראי חזק
- [ ] הגדר `CORS_ORIGIN` לדומיין הספציפי שלך
- [ ] שנה סיסמאות משתמשי דמו
- [ ] העבר מ-In-Memory DB למסד נתונים אמיתי
- [ ] הוסף HTTPS
- [ ] הגדר Firewall rules
- [ ] הגדר Rate Limiting מתאים לנפח
- [ ] הוסף Monitoring & Alerts

---

## נתונים ראשוניים (Seed Data)

המערכת מגיעה עם נתוני דמו:
- 2 סגל
- 8 סטודנטים
- 2 קורסים
- 4 קבוצות
- 1 משימה
- 4 הגשות

נתונים אלה מאותחלים אוטומטית ב-`src/config/database.ts`

---

## תמיכה

- **README מלא:** [README.md](./README.md)
- **API Documentation:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Epic & User Stories:** [/EPIC_USER_STORIES.md](../EPIC_USER_STORIES.md)

---

## Next Steps

1. ✅ הפעל את השרת
2. ✅ בדוק את ה-Health endpoint
3. ✅ התחבר עם משתמש דמו
4. ✅ נסה ליצור קורס/משימה
5. 📝 קרא את ה-API Documentation המלא
6. 🗄️ העבר ל-Real Database (PostgreSQL/MongoDB)
7. 🚀 Deploy to Production

בהצלחה! 🎉
