# AmiTeam - Academic Peer Review System
## מערכת ניהול משימות ומשוב לסביבה אקדמית

---

## 📋 תיאור הפרויקט

**AmiTeam** היא מערכת מקיפה המאפשרת לסגל אקדמי לנהל קורסים, קבוצות סטודנטים ומשימות ביקורת עמיתים עם קריטריונים דינמיים ופידבקים. הסטודנטים יכולים להגיש ביקורות על עבודות של קבוצות אחרות, והמערכת מחשבת ציונים אוטומטית לפי משקלות מוגדרות.

---

## 🎯 תכונות עיקריות

### עבור סגל אקדמי (Staff)
- ✅ **ניהול קורסים:** יצירה, עריכה ומחיקה של קורסים עם שיוך סטודנטים
- ✅ **ניהול קבוצות:** ארגון סטודנטים בקבוצות בתוך קורסים
- ✅ **ניהול משימות:** 
  - יצירת משימות עם שדות דינמיים (קריטריונים ופידבקים)
  - הגדרת דדליין
  - יצירת קישור שיתוף ישיר למשימה
  - עריכה ומחיקה של משימות
- ✅ **סיכום ביקורות:**
  - תצוגה מפורטת של כל ההגשות
  - סטטיסטיקות לפי משימה, קבוצה, וסטודנט
  - ציונים מחושבים אוטומטית
  - ייצוא לאקסל

### עבור סטודנטים (Students)
- ✅ **הגשת ביקורות:**
  - דרך קישור ישיר או רשימת משימות
  - בחירת קבוצה לביקורת
  - מילוי שדות דינמיים (קריטריונים ופידבקים)
  - אכיפת שדות חובה
- ✅ **צפייה בביקורות שהגשתי:**
  - תצוגה לפי משימה או קבוצה
  - כולל ציונים שנתתי
- ✅ **צפייה בביקורות על הקבוצה שלי:**
  - ראיית כל הפידבקים שהקבוצה קיבלה
  - ממוצע ציונים

---

## 🏗️ ארכיטקטורה

### Frontend
- **Framework:** React 18+ עם TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **State Management:** React Context API / Props
- **Location:** `/App.tsx` + `/components/`

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Joi
- **Security:** Helmet, CORS, Rate Limiting
- **Logging:** Winston + Morgan
- **Testing:** Jest + Supertest
- **Location:** `/backend/`

### Database
- **Current:** In-Memory (Demo purposes)
- **Production Ready:** PostgreSQL with Prisma / MongoDB with Mongoose
- **Location:** `/backend/src/config/database.ts`

---

## 📂 מבנה הפרויקט

```
amiteam/
├── frontend/                      # React Frontend
│   ├── App.tsx                    # Main app component
│   ├── components/                # React components
│   │   ├── StaffView.tsx         # Staff dashboard
│   │   ├── StudentView.tsx       # Student dashboard
│   │   ├── AssignmentForm.tsx    # Assignment creation/edit
│   │   ├── CourseManagement.tsx  # Course management
│   │   ├── GroupManagement.tsx   # Group management
│   │   ├── LoginView.tsx         # Authentication
│   │   └── ui/                   # UI components (shadcn)
│   └── styles/
│       └── globals.css           # Global styles
│
├── backend/                       # Express Backend API
│   ├── src/
│   │   ├── controllers/          # Route controllers
│   │   │   ├── authController.ts
│   │   │   ├── courseController.ts
│   │   │   ├── groupController.ts
│   │   │   ├── assignmentController.ts
│   │   │   └── submissionController.ts
│   │   │
│   │   ├── routes/               # API routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── course.routes.ts
│   │   │   ├── group.routes.ts
│   │   │   ├── assignment.routes.ts
│   │   │   ├── submission.routes.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── middleware/           # Express middleware
│   │   │   ├── auth.ts          # JWT authentication
│   │   │   └── errorHandler.ts  # Error handling
│   │   │
│   │   ├── config/               # Configuration
│   │   │   └── database.ts      # In-memory DB (demo)
│   │   │
│   │   ├── utils/                # Utilities
│   │   │   ├── logger.ts        # Winston logger
│   │   │   └── validators.ts    # Joi schemas & business rules
│   │   │
│   │   ├── types/                # TypeScript types
│   │   │   └── index.ts
│   │   │
│   │   ├── __tests__/            # Unit tests
│   │   │   └── validators.test.ts
│   │   │
│   │   └── server.ts             # Express app entry
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.js
│   ├── .env
│   ├── .env.example
│   ├── README.md
│   ├── API_DOCUMENTATION.md
│   └── QUICK_START.md
│
├── EPIC_USER_STORIES.md          # Epic, User Stories, Sub-Tasks
└── PROJECT_OVERVIEW.md           # This file
```

---

## 🔐 חוקים עסקיים (Business Rules)

### 1. סוגי שדות במשימה

#### קריטריון (Criterion)
- **סוג:** סקאלה מספרית (scale)
- **חובה:** תמיד חובה (`required: true`)
- **משקל:** חייב להיות > 0
- **תכונות:** `scaleMin`, `scaleMax`
- **השפעה על ציון:** כן - לפי המשקל

#### פידבק (Feedback)
- **סוגים:** טקסט (text) או סקאלה (scale)
- **חובה:** אופציונלי או חובה
- **משקל:** תמיד 0 (`weight: 0`)
- **השפעה על ציון:** לא

### 2. חוקי משקלות
- סכום משקלות כל הקריטריונים חייב להיות בדיוק 100%
- לפחות קריטריון אחד חובה במשימה
- פידבקים לא משפיעים על הציון

### 3. חוקי הגשה
- ❌ לא ניתן להגיש ביקורת אחרי שהדדליין עבר
- ❌ סטודנט לא יכול לבקר את הקבוצה של עצמו
- ✅ רק סטודנטים רשומים בקורס יכולים להגיש
- ✅ כל השדות החובה חייבים להיות מלאים
- ✅ ערכי סקאלה חייבים להיות בטווח המוגדר

### 4. חישוב ציון
```
ציון סופי = Σ (נורמליזציה של ערך * משקל) / 100

נורמליזציה = (ערך - min) / (max - min) * 100
```

**דוגמה:**
- קריטריון 1: ערך 8/10, משקל 60%
  - נורמליזציה: (8-1)/(10-1) * 100 = 77.78%
  - תרומה: 77.78 * 0.6 = 46.67
- קריטריון 2: ערך 9/10, משקל 40%
  - נורמליזציה: (9-1)/(10-1) * 100 = 88.89%
  - תרומה: 88.89 * 0.4 = 35.56
- **ציון סופי: 82.23**

---

## 🚀 התחלה מהירה

### דרישות מקדימות
- Node.js 18+
- npm או yarn

### הפעלת Backend

```bash
# 1. עבור לתיקיית backend
cd backend

# 2. התקן dependencies
npm install

# 3. הפעל את השרת
npm run dev

# השרת רץ על http://localhost:5000
```

### הפעלת Frontend

```bash
# בתיקייה הראשית
npm install
npm run dev

# הפרונטנד רץ על http://localhost:3000
```

### בדיקה מהירה

```bash
# בדוק שה-API עובד
curl http://localhost:5000/api/health

# התחבר כסגל
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "michal.cohen@university.ac.il",
    "password": "password123"
  }'
```

---

## 👥 משתמשי דמו

### סגל (Staff)
| שם | Email | סיסמה |
|---|---|---|
| ד"ר מיכל כהן | michal.cohen@university.ac.il | password123 |
| פרופ' דוד לוי | david.levi@university.ac.il | password123 |

### סטודנטים (Students)
| שם | Email | קבוצה |
|---|---|---|
| יוסי אברהם | yossi.a@student.ac.il | קבוצה 1 |
| שרה כהן | sara.c@student.ac.il | קבוצה 1 |
| דני לוי | dani.l@student.ac.il | קבוצה 2 |
| רונית מזרחי | ronit.m@student.ac.il | קבוצה 2 |
| עומר ישראלי | omer.i@student.ac.il | קבוצה 3 |
| נועה ברק | noa.b@student.ac.il | קבוצה 3 |
| אורי גולן | uri.g@student.ac.il | קבוצה 4 |
| תמר שפירא | tamar.s@student.ac.il | קבוצה 4 |

**כל המשתמשים:** `password123`

---

## 📖 תיעוד מפורט

1. **[EPIC_USER_STORIES.md](./EPIC_USER_STORIES.md)**
   - תכנון מפורט עם Epic, User Stories, Sub-Tasks
   - קשר בין Frontend, Backend, ובדיקות יחידה
   - Timeline משוער

2. **[backend/README.md](./backend/README.md)**
   - הסבר מפורט על ה-Backend
   - מבנה הפרויקט
   - הוראות התקנה והרצה

3. **[backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)**
   - תיעוד מלא של כל ה-API endpoints
   - דוגמאות cURL
   - סכמות Request/Response

4. **[backend/QUICK_START.md](./backend/QUICK_START.md)**
   - מדריך מהיר להתחלה
   - דוגמאות שימוש
   - Troubleshooting

---

## 🧪 בדיקות (Testing)

### Backend Tests

```bash
cd backend

# הרץ כל הבדיקות
npm test

# הרץ עם coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

**קבצי בדיקות:**
- `src/__tests__/validators.test.ts` - בדיקות ולידציה וחוקים עסקיים

**Coverage Target:** 70%+ (branches, functions, lines, statements)

---

## 🛡️ אבטחה

### Features
- ✅ JWT Authentication
- ✅ Password hashing (bcrypt)
- ✅ Role-based authorization (Staff/Student)
- ✅ Input validation (Joi)
- ✅ Rate limiting (100 req/15min)
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ Error handling without stack traces in production

### Recommendations for Production
- [ ] שנה `JWT_SECRET` למפתח אקראי חזק
- [ ] הגדר HTTPS
- [ ] הוסף Database עם backups
- [ ] הגדר monitoring & logging
- [ ] הוסף API Gateway
- [ ] הוסף WAF (Web Application Firewall)
- [ ] הגדר secrets management (AWS Secrets Manager, etc.)

---

## 📊 API Endpoints - סיכום

### Authentication
```
POST   /api/auth/register    # הרשמה
POST   /api/auth/login       # התחברות
GET    /api/auth/me          # משתמש נוכחי
```

### Courses
```
POST   /api/courses          # יצירת קורס (סגל)
GET    /api/courses          # רשימת קורסים
GET    /api/courses/:id      # קורס ספציפי
PUT    /api/courses/:id      # עדכון קורס (סגל)
DELETE /api/courses/:id      # מחיקת קורס (סגל)
```

### Groups
```
POST   /api/groups           # יצירת קבוצה (סגל)
GET    /api/groups           # רשימת קבוצות
GET    /api/groups/:id       # קבוצה ספציפית
PUT    /api/groups/:id       # עדכון קבוצה (סגל)
DELETE /api/groups/:id       # מחיקת קבוצה (סגל)
```

### Assignments
```
POST   /api/assignments      # יצירת משימה (סגל)
GET    /api/assignments      # רשימת משימות
GET    /api/assignments/:id  # משימה ספציפית
PUT    /api/assignments/:id  # עדכון משימה (סגל)
DELETE /api/assignments/:id  # מחיקת משימה (סגל)
```

### Submissions
```
POST   /api/submissions          # הגשת ביקורת (סטודנט)
GET    /api/submissions          # רשימת הגשות
GET    /api/submissions/:id      # הגשה ספציפית
GET    /api/submissions/stats/:assignmentId  # סטטיסטיקות (סגל)
DELETE /api/submissions/:id      # מחיקת הגשה
```

---

## 🗄️ Migration to Production Database

### Option 1: PostgreSQL + Prisma

```bash
cd backend
npm install @prisma/client
npm install -D prisma

npx prisma init
```

**schema.prisma:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      String
  groupId   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// ... Add other models
```

### Option 2: MongoDB + Mongoose

```bash
cd backend
npm install mongoose
npm install -D @types/mongoose
```

יצירת Models ב-`src/models/`

---

## 🔄 Workflow Development

### Git Workflow
```bash
# Feature branch
git checkout -b feature/user-story-1.1

# Make changes
git add .
git commit -m "feat: implement assignment creation"

# Push
git push origin feature/user-story-1.1

# Create PR
```

### Conventional Commits
```
feat: new feature
fix: bug fix
docs: documentation
test: tests
refactor: code refactoring
style: formatting
chore: maintenance
```

---

## 📈 Timeline פיתוח

| Phase | משך זמן | תיאור |
|---|---|---|
| Setup & Infrastructure | 3 ימים | Backend, Frontend, Database setup |
| User Story 1: ניהול משימות | 5 ימים | CRUD משימות + שדות דינמיים |
| User Story 2: ניהול קורסים | 3 ימים | CRUD קורסים |
| User Story 3: ניהול קבוצות | 3 ימים | CRUD קבוצות |
| User Story 4: סיכום ביקורות | 4 ימים | Dashboard + ייצוא לאקסל |
| User Story 5: הגשת ביקורת | 4 ימים | טופס הגשה + ולידציה |
| User Story 6-7: צפייה בביקורות | 4 ימים | תצוגות לסטודנטים |
| Testing & Bug Fixes | 4 ימים | בדיקות ותיקונים |
| **סה"כ** | **30 ימים** | **~6 שבועות** |

---

## 🤝 תרומה לפרויקט

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

**Guidelines:**
- פעל לפי TypeScript best practices
- כתוב בדיקות יחידה לפיצ'רים חדשים
- עדכן תיעוד
- השתמש ב-Conventional Commits

---

## 📞 תמיכה וקישורים

- **GitHub Issues:** [Report bugs or request features]
- **Documentation:** ראה קבצי `.md` בפרויקט
- **API Reference:** `backend/API_DOCUMENTATION.md`
- **Quick Start:** `backend/QUICK_START.md`

---

## 📝 License

ISC

---

## ✨ Features Roadmap

### Phase 1 (Current) ✅
- [x] Authentication & Authorization
- [x] Course Management
- [x] Group Management
- [x] Assignment Management
- [x] Submission Management
- [x] Statistics & Reporting

### Phase 2 (Future)
- [ ] Email notifications
- [ ] Real-time updates (WebSocket)
- [ ] File uploads (documents, images)
- [ ] Peer review templates
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

### Phase 3 (Future)
- [ ] Integration with LMS (Moodle, Canvas)
- [ ] AI-powered feedback suggestions
- [ ] Plagiarism detection
- [ ] Video feedback support
- [ ] Multi-language support

---

**Version:** 1.0.0  
**Last Updated:** January 24, 2026  
**Maintained by:** AmiTeam Development Team

🎉 **Happy Coding!**
