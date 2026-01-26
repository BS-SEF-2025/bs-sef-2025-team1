# תכנון פרויקט AmiTeam - מערכת נושאים ומשוב אקדמית

## Epic: מערכת ניהול משימות ביקורת עמיתים לסביבה אקדמית

### תיאור:
בניית פלטפורמה מלאה המאפשרת לסגל אקדמי לנהל קורסים, קבוצות, ומשימות ביקורת עם קריטריונים דינמיים, ולסטודנטים להגיש ביקורות על קבוצות אחרות עם חישוב ציונים אוטומטי ומעקב מפורט.

---

## User Story 1: ניהול משימות (סגל)

**כ-** חבר סגל אקדמי  
**אני רוצה** ליצור, לערוך ולמחוק משימות ביקורת עם שדות דינמיים וקריטריונים  
**כדי ש-** אוכל להעריך קבוצות סטודנטים בצורה מובנית ושקופה

### Sub-Task 1.1: יצירת משימה חדשה
**תיאור:** מימוש יכולת יצירת משימה עם פרטים בסיסיים

**Frontend:**
- טופס יצירת משימה עם שדות: כותרת, תיאור, קורס, דדליין
- ולידציה: כל השדות חובה, דדליין חייב להיות בעתיד
- כפתור "צור משימה" ששולח POST request ל-backend
- הצגת הודעת הצלחה/כשלון

**Backend:**
- `POST /api/assignments` - endpoint ליצירת משימה
- קבלת: `{ title, description, courseId, deadline, staffId }`
- ולידציה: בדיקת קיום קורס, דדליין תקין, שדות חובה
- יצירת `shareableLink` ייחודי
- שמירה ב-DB והחזרת המשימה החדשה
- החזרת HTTP 201 במקרה הצלחה

**Unit Tests:**
- Backend: בדיקת יצירת משימה תקינה
- Backend: בדיקת כשלון כאשר courseId לא קיים
- Backend: בדיקת כשלון כאשר deadline בעבר
- Frontend: בדיקת ולידציה של שדות חובה
- Frontend: בדיקת שליחת נתונים נכונים ל-API

---

### Sub-Task 1.2: הוספת שדות למשימה
**תיאור:** הוספת שדות דינמיים (קריטריונים ופידבקים) למשימה

**Frontend:**
- UI להוספת שדה: בחירת סוג (קריטריון/פידבק טקסט/פידבק סקאלה)
- לקריטריון: שם, תיאור, משקל (%), min/max לסקאלה, checkbox חובה (תמיד מסומן ולא ניתן לשינוי)
- לפידבק: שם, תיאור, סוג (טקסט/סקאלה), חובה/אופציונלי, משקל אוטומטי 0%
- ולידציה: סכום משקלות קריטריונים = 100%, לפחות קריטריון אחד
- עדכון משימה עם `PUT /api/assignments/:id`

**Backend:**
- `PUT /api/assignments/:id` - endpoint לעדכון משימה
- קבלת: `{ title?, description?, deadline?, fields? }`
- ולידציה מתקדמת של שדות:
  - בדיקה שכל קריטריון: `required=true`, `weight>0`, `type=scale`
  - בדיקה שכל פידבק: `weight=0`
  - בדיקה שסכום משקלות = 100%
  - בדיקה שיש לפחות קריטריון אחד
- עדכון ב-DB והחזרת משימה מעודכנת

**Unit Tests:**
- Backend: בדיקת הוספת שדות תקינים
- Backend: בדיקת דחיית קריטריון עם משקל 0
- Backend: בדיקת דחייה כאשר סכום משקלות לא 100%
- Backend: בדיקת דחייה כאשר אין קריטריונים
- Frontend: בדיקת חישוב אוטומטי של סכום משקלות
- Frontend: בדיקת הצגת שגיאה כאשר משקלות לא מסתכמות ל-100%

---

### Sub-Task 1.3: עריכת משימה קיימת
**תיאור:** עריכת פרטי משימה - דדליין, שדות, קורס

**Frontend:**
- טופס עריכה עם נתונים קיימים
- אפשרות לשנות דדליין (רק לעתיד)
- עריכת/הוספת/מחיקת שדות
- שינוי קורס משויך (dropdown)
- שליחת `PUT /api/assignments/:id`

**Backend:**
- שימוש ב-endpoint קיים `PUT /api/assignments/:id`
- בדיקת הרשאות: רק מי שיצר את המשימה יכול לערוך
- ולידציה מלאה כמו ביצירה
- עדכון ב-DB

**Unit Tests:**
- Backend: בדיקת עריכה מוצלחת של דדליין
- Backend: בדיקת עריכה מוצלחת של שדות
- Backend: בדיקת דחייה כאשר המשתמש לא בעל המשימה
- Backend: בדיקת שינוי courseId לקורס קיים
- Frontend: בדיקת טעינת נתונים קיימים לטופס
- Frontend: בדיקת שמירת שינויים

---

### Sub-Task 1.4: יצירת קישור שיתוף
**תיאור:** יצירת קישור ייחודי למשימה לשיתוף עם סטודנטים

**Frontend:**
- הצגת קישור שיתוף לכל משימה
- כפתור "העתק קישור" עם אינדיקציה ויזואלית
- הקישור כולל: `domain.com/?assignment={assignmentId}`

**Backend:**
- בזמן יצירת משימה ב-`POST /api/assignments` יצירת `shareableLink`
- השדה `shareableLink` נשמר ב-DB
- `GET /api/assignments/:id` מחזיר גם את ה-`shareableLink`

**Unit Tests:**
- Backend: בדיקה שכל משימה חדשה מקבלת shareableLink ייחודי
- Backend: בדיקה ש-shareableLink מכיל את assignment ID
- Frontend: בדיקה שהעתקה לקליפבורד עובדת
- Frontend: בדיקה שהקישור מנווט נכון למשימה

---

### Sub-Task 1.5: מחיקת משימה
**תיאור:** מחיקת משימה מהמערכת

**Frontend:**
- כפתור מחיקה עם דיאלוג אישור
- הודעת אזהרה: "פעולה זו תמחק גם את כל ההגשות למשימה"
- שליחת `DELETE /api/assignments/:id`
- הסרה מהרשימה בממשק

**Backend:**
- `DELETE /api/assignments/:id` - endpoint למחיקת משימה
- בדיקת הרשאות: רק יוצר המשימה
- מחיקת כל ההגשות הקשורות (CASCADE)
- מחיקת המשימה מה-DB
- החזרת HTTP 204 (No Content)

**Unit Tests:**
- Backend: בדיקת מחיקה מוצלחת
- Backend: בדיקה שההגשות נמחקות גם כן
- Backend: בדיקת דחייה למשתמש לא מורשה
- Backend: בדיקת 404 למשימה לא קיימת
- Frontend: בדיקת הצגת דיאלוג אישור
- Frontend: בדיקה שהמשימה מוסרת מהרשימה

---

## User Story 2: ניהול קורסים (סגל)

**כ-** חבר סגל אקדמי  
**אני רוצה** ליצור, לערוך ולמחוק קורסים ולנהל את רשימת הסטודנטים המשויכים  
**כדי ש-** אוכל לארגן משימות ביקורת לפי קורסים ספציפיים

### Sub-Task 2.1: יצירת קורס חדש
**תיאור:** יצירת קורס עם שם ושיוך סטודנטים ראשוני

**Frontend:**
- טופס יצירה: שם קורס (חובה)
- multi-select לבחירת סטודנטים מרשימת כל הסטודנטים במערכת
- שליחת `POST /api/courses`

**Backend:**
- `POST /api/courses` - endpoint ליצירת קורס
- קבלת: `{ name, staffId, enrolledStudents: [userId1, userId2] }`
- ולידציה: שם לא ריק, סטודנטים קיימים במערכת
- שמירה ב-DB עם `createdAt`
- החזרת HTTP 201 והקורס החדש

**Unit Tests:**
- Backend: בדיקת יצירת קורס עם סטודנטים
- Backend: בדיקת יצירת קורס ללא סטודנטים
- Backend: בדיקת דחייה עבור studentId לא קיים
- Frontend: בדיקת שליחת נתונים נכונים
- Frontend: בדיקת ולידציית שם קורס

---

### Sub-Task 2.2: עריכת קורס
**תיאור:** שינוי שם הקורס והוספה/הסרה של סטודנטים

**Frontend:**
- טופס עריכה עם נתו��ים קיימים
- שינוי שם
- multi-select לעדכון רשימת סטודנטים
- שליחת `PUT /api/courses/:id`

**Backend:**
- `PUT /api/courses/:id` - endpoint לעדכון קורס
- קבלת: `{ name?, enrolledStudents? }`
- בדיקת הרשאות: רק מורה שיצר את הקורס
- ולידציה: סטודנטים קיימים
- עדכון ב-DB

**Unit Tests:**
- Backend: בדיקת עדכון שם קורס
- Backend: בדיקת הוספת סטודנטים
- Backend: בדיקת הסרת סטודנטים
- Backend: בדיקת דחייה למשתמש לא מורשה
- Frontend: בדיקת עדכון רשימת סטודנטים בממשק

---

### Sub-Task 2.3: מחיקת קורס
**תיאור:** מחיקת קורס מהמערכת

**Frontend:**
- כפתור מחיקה עם דיאלוג אישור
- אזהרה: "מחיקת קורס תמחק גם את הקבוצות והמשימות הקשורות"
- שליחת `DELETE /api/courses/:id`

**Backend:**
- `DELETE /api/courses/:id` - endpoint למחיקת קורס
- בדיקת הרשאות
- מחיקת כל הקבוצות, משימות והגשות הקשורות (CASCADE)
- מחיקה מה-DB
- החזרת HTTP 204

**Unit Tests:**
- Backend: בדיקת מחיקה מוצלחת
- Backend: בדיקת מחיקת קבוצות ומשימות הקשורות
- Backend: בדיקת דחייה למשתמש לא מורשה
- Frontend: בדיקת הצגת אזהרה מתאימה
- Frontend: בדיקת הסרה מהרשימה

---

## User Story 3: ניהול קבוצות (סגל)

**כ-** חבר סגל אקדמי  
**אני רוצה** ליצור ולנהל קבוצות סטודנטים בתוך קורסים  
**כדי ש-** סטודנטים יוכלו לבקר זה את זה בצורה מאורגנת

### Sub-Task 3.1: יצירת קבוצה
**תיאור:** יצירת קבוצה בתוך קורס ספציפי

**Frontend:**
- טופס: שם קבוצה, בחירת קורס
- multi-select לבחירת חברי הקבוצה (רק מסטודנטים הרשומים לקורס)
- שליחת `POST /api/groups`

**Backend:**
- `POST /api/groups` - endpoint ליצירת קבוצה
- קבלת: `{ name, courseId, members: [userId1, userId2] }`
- ולידציה:
  - הקורס קיים
  - כל החברים רשומים לקורס
  - שם לא ריק
- שמירה ב-DB
- החזרת HTTP 201 והקבוצה החדשה

**Unit Tests:**
- Backend: בדיקת יצירת קבוצה תקינה
- Backend: בדיקת דחייה כאשר סטודנט לא רשום לקורס
- Backend: בדיקת דחייה לקורס לא קיים
- Frontend: בדיקת סינון סטודנטים לפי קורס נבחר
- Frontend: בדיקת שליחת נתונים נכונים

---

### Sub-Task 3.2: עריכת קבוצה
**תיאור:** שינוי שם וחברי קבוצה

**Frontend:**
- טופס עריכה עם נתונים קיימים
- שינוי שם
- עדכון רשימת חברים
- שליחת `PUT /api/groups/:id`

**Backend:**
- `PUT /api/groups/:id` - endpoint לעדכון קבוצה
- קבלת: `{ name?, members? }`
- ולידציה: חברים חדשים רשומים לקורס
- עדכון ב-DB
- בדיקת השפעה על הגשות קיימות

**Unit Tests:**
- Backend: בדיקת עדכון שם קבוצה
- Backend: בדיקת הוספת/הסרת חברים
- Backend: בדיקת ולידציה של חברים חדשים
- Frontend: בדיקת עדכון חברים בממשק
- Integration: בדיקה שהגשות קיימות לא נפגעות

---

### Sub-Task 3.3: מחיקת קבוצה
**תיאור:** מחיקת קבוצה מהמערכת

**Frontend:**
- כפתור מחיקה עם דיאלוג אישור
- בדיקה: אם יש הגשות הקשורות לקבוצה, הצגת אזהרה
- שליחת `DELETE /api/groups/:id`

**Backend:**
- `DELETE /api/groups/:id` - endpoint למחיקת קבוצה
- בדיקת הרשאות
- בדיקה אם יש הגשות: אפשרות למחיקה בכל מקרה (מחיקת הגשות CASCADE) או דחייה
- מחיקה מה-DB
- החזרת HTTP 204

**Unit Tests:**
- Backend: בדיקת מחיקה ללא הגשות
- Backend: בדיקת מחיקה עם הגשות (CASCADE)
- Backend: בדיקת דחייה למשתמש לא מורשה
- Frontend: בדיקת הצגת אזהרה מתאימה
- Frontend: בדיקת הסרה מהרשימה

---

## User Story 4: סיכום ביקורות (סגל)

**כ-** חבר סגל אקדמי  
**אני רוצה** לצפות בסיכום מפורט של ביקורות עם ציונים וסטטיסטיקות  
**כדי ש-** אוכל להעריך את הביצועים ולייצא דוחות

### Sub-Task 4.1: תצוגת סיכום לפי משימה
**תיאור:** הצגת כל ההגשות למשימה ספציפית

**Frontend:**
- רשימת משימות עם כפתור "צפה בסיכום"
- טבלה: קבוצה שנבדקה, מספר ביקורות, ציון ממוצע, פילוח לפי קריטריונים
- סינון לפי קבוצה
- fetch מ-`GET /api/submissions?assignmentId=X`

**Backend:**
- `GET /api/submissions` - endpoint לקבלת הגשות
- query params: `assignmentId`, `groupId`, `studentId`
- החזרת רשימת הגשות עם populate של student, group, assignment
- חישובים: ממוצע ציונים לפי קבוצה

**Unit Tests:**
- Backend: בדיקת החזרת הגשות לפי assignmentId
- Backend: בדיקת סינון לפי groupId
- Backend: בדיקת ממוצעים נכונים
- Frontend: בדיקת הצגת נתונים בטבלה
- Frontend: בדיקת סינון

---

### Sub-Task 4.2: תצוגת סיכום לפי קבוצה
**תיאור:** הצגת כל הביקורות שקיבלה קבוצה ספציפית

**Frontend:**
- בחירת קבוצה
- טבלה: משימה, סטודנט מבקר, ציון, תאריך הגשה
- הצגת ממוצע ציונים כולל
- fetch מ-`GET /api/submissions?reviewedGroupId=X`

**Backend:**
- שימוש ב-endpoint קיים עם `reviewedGroupId` param
- החזרת הגשות מסוננות

**Unit Tests:**
- Backend: בדיקת החזרת הגשות לפי reviewedGroupId
- Frontend: בדיקת חישוב ממוצע נכון
- Frontend: בדיקת הצגת נתונים

---

### Sub-Task 4.3: תצוגת סיכום לפי סטודנט
**תיאור:** הצגת כל ההגשות של סטודנט ספציפי

**Frontend:**
- בחירת סטודנט
- טבלה: משימה, קבוצה שנבדקה, ציון, תאריך
- סטטיסטיקות: מספר ביקורות שהגיש, ציון ממוצע
- fetch מ-`GET /api/submissions?studentId=X`

**Backend:**
- שימוש ב-endpoint קיים עם `studentId` param
- החזרת הגשות מסוננות

**Unit Tests:**
- Backend: בדיקת החזרת הגשות לפי studentId
- Frontend: בדיקת חישוב סטטיסטיקות
- Frontend: בדיקת הצגת נתונים

---

### Sub-Task 4.4: ייצוא לאקסל
**תיאור:** ייצוא נתוני סיכום לקובץ Excel

**Frontend:**
- כפתור "ייצא לאקסל" בכל תצוגת סיכום
- שימוש בספריית `xlsx` או `exceljs`
- יצירת קובץ עם גליונות: סיכום כללי, פירוט לפי קבוצה, פידבקים
- הורדת הקובץ

**Backend (אופציונלי):**
- `GET /api/reports/excel?assignmentId=X` - יצירת קובץ בשרת
- החזרת file stream
- Headers: `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

**Unit Tests:**
- Frontend: בדיקת יצירת קובץ נכון
- Frontend: בדיקת תוכן הקובץ (שמות עמודות, נתונים)
- Backend (אם מיושם): בדיקת יצירת קובץ תקין
- Backend: בדיקת headers נכונים

---

## User Story 5: הגשת ביקורת (סטודנט)

**כ-** סטודנט  
**אני רוצה** להגיש ביקורת על קבוצה אחרת במשימה  
**כדי ש-** אוכל לספק פידבק והערכה לעמיתים שלי

### Sub-Task 5.1: הגשה דרך קישור ישיר
**תיאור:** סטודנט לוחץ על קישור שיתוף ומגיע ישירות לטופס ההגשה

**Frontend:**
- זיהוי query param `?assignment=X` ב-URL
- fetch של המשימה: `GET /api/assignments/:id`
- בדיקת deadline: אם עבר - הצגת הודעה והשבתת הגשה
- dropdown לבחירת קבוצה לביקורת (רק קבוצות מהקורס, לא הקבוצה של הסטודנט)
- טופס דינמי לפי השדות של המשימה
- כפתור "הגש"

**Backend:**
- `GET /api/assignments/:id` - החזרת פרטי משימה
- בדיקה שהמשימה קיימת
- החזרת: `{ id, title, description, deadline, fields, courseId }`

**Unit Tests:**
- Backend: בדיקת החזרת משימה קיימת
- Backend: בדיקת 404 למשימה לא קיימת
- Frontend: בדיקת זיהוי query param
- Frontend: בדיקת השבתת הגשה לאחר deadline
- Frontend: בדיקת סינון קבוצות (לא הקבוצה של הסטודנט)

---

### Sub-Task 5.2: הגשה דרך רשימת משימות
**תיאור:** סטודנט רואה רשימת משימות זמינות ובוחר אחת

**Frontend:**
- `GET /api/assignments?courseId=X` - רשימת משימות בקורסים של הסטודנט
- רשימה עם: כותרת, קורס, deadline, סטטוס (פתוחה/נסגרה)
- סינון לפי קורס
- לחיצה על משימה -> ניווט לטופס הגשה (אותו טופס מ-5.1)

**Backend:**
- `GET /api/assignments` - endpoint לקבלת רשימת משימות
- query param: `courseId`
- סינון משימות לפי קורסים שהסטודנט רשום אליהם
- החזרת array של משימות

**Unit Tests:**
- Backend: בדיקת החזרת משימות לפי courseId
- Backend: בדיקה שסטודנט רואה רק משימות מהקורסים שלו
- Frontend: בדיקת הצגת רשימה
- Frontend: בדיקת סינון לפי קורס
- Frontend: בדיקת אינדיקציה למשימות שנסגרו

---

### Sub-Task 5.3: מילוי שדות ואכיפת חובה
**תיאור:** סטודנט ממלא את הטופס עם ולידציה

**Frontend:**
- רינדור דינמי של שדות לפי `assignment.fields`
- לקריטריון (סקאלה): slider או input עם min/max
- לפידבק טקסט: textarea
- לפידבק סקאלה: slider או input
- סימון שדות חובה בקריטריונים בכוכבית
- ולידציה לפני הגשה: כל השדות החובה מלאים
- שליחת `POST /api/submissions`

**Backend:**
- `POST /api/submissions` - endpoint ליצירת הגשה
- קבלת: `{ assignmentId, studentId, reviewedGroupId, answers: [{fieldId, value}] }`
- ולידציה:
  - deadline לא עבר
  - הסטודנט רשום לקורס
  - הקבוצה הנבדקת שייכת לקורס
  - הסטודנט לא מבקר את הקבוצה שלו
  - כל השדות החובה מולאו
  - ערכי סקאלה בטווח הנכון
- חישוב `calculatedScore` על סמך הקריטריונים והמשקלות
- שמירה ב-DB
- החזרת HTTP 201 וההגשה החדשה

**Unit Tests:**
- Backend: בדיקת יצירת הגשה תקינה
- Backend: בדיקת דחייה אחרי deadline
- Backend: בדיקת דחייה לביקורת על הקבוצה של הסטודנט
- Backend: בדיקת חישוב ציון נכון
- Backend: בדיקת דחייה כאשר חסר שדה חובה
- Frontend: בדיקת ולידציית שדות חובה
- Frontend: בדיקת הצגת הודעת הצלחה
- Frontend: בדיקת ולידציית טווח לסקאלה

---

## User Story 6: צפייה בביקורות שהגשתי (סטודנט)

**כ-** סטודנט  
**אני רוצה** לראות את כל הביקורות שהגשתי  
**כדי ש-** אוכל לעקוב אחרי התרומה שלי להערכת עמיתים

### Sub-Task 6.1: תצוגה לפי משימה
**תיאור:** סטודנט רואה את ההגשות שלו למשימה ספציפית

**Frontend:**
- רשימת משימות שהסטודנט הגיש בהן
- לחיצה על משימה -> רשימת ההגשות שלו
- טבלה: קבוצה שנבדקה, ציון שנתן, תאריך הגשה
- כפתור "צפה בפירוט" -> הצגת כל התשובות
- fetch מ-`GET /api/submissions?studentId=X&assignmentId=Y`

**Backend:**
- שימוש ב-endpoint קיים עם שני params
- החזרת הגשות מסוננות

**Unit Tests:**
- Backend: בדיקת סינון לפי studentId ו-assignmentId
- Frontend: בדיקת הצגת נתונים
- Frontend: בדיקת הצגת פירוט הגשה

---

### Sub-Task 6.2: תצוגה לפי קבוצה
**תיאור:** סטודנט רואה את כל הביקורות שהגיש על קבוצה מסוימת

**Frontend:**
- רשימת קבוצות שהסטודנט ביקר
- לחיצה על קבוצה -> רשימת ההגשות שלו עליה
- טבלה: משימה, ציון, תאריך
- fetch מ-`GET /api/submissions?studentId=X&reviewedGroupId=Y`

**Backend:**
- שימוש ב-endpoint קיים
- החזרת הגשות מסוננות

**Unit Tests:**
- Backend: בדיקת סינון לפי studentId ו-reviewedGroupId
- Frontend: בדיקת הצגת נתונים

---

## User Story 7: צפייה בביקורות על הקבוצה שלי (סטודנט)

**כ-** סטודנט  
**אני רוצה** לראות את הביקורות שקבוצה שלי קיבלה  
**כדי ש-** אוכל ללמוד מהפידבק ולשפר

### Sub-Task 7.1: תצוגה לפי משימה
**תיאור:** סטודנט רואה ביקורות שקבוצה שלו קיבלה במשימה ספציפית

**Frontend:**
- רשימת משימות
- לחיצה -> טבלה: סטודנט מבקר, ציון, פידבקים, תאריך
- הצגת ציון ממוצע
- fetch מ-`GET /api/submissions?reviewedGroupId=X&assignmentId=Y`
  (X = groupId של הסטודנט)

**Backend:**
- שימוש ב-endpoint קיים
- החזרת הגשות מסוננות

**Unit Tests:**
- Backend: בדיקת סינון נכון
- Frontend: בדיקת חישוב ממוצע
- Frontend: בדיקת הצגת פידבקים

---

### Sub-Task 7.2: תצוגה לפי קבוצה מגישה
**תיאור:** סטודנט רואה כל הביקורות שקבוצה מסוימת נתנה לקבוצה שלו

**Frontend:**
- רשימת קבוצות שביקרו את הקבוצה של הסטודנט
- לחיצה על קבוצה -> טבלה: משימה, ציון, פידבקים
- fetch מ-`GET /api/submissions?reviewedGroupId=X`
  + סינון client-side לפי studentId של הקבוצה המבקרת

**Backend:**
- שימוש ב-endpoint קיים
- החזרת הגשות

**Unit Tests:**
- Backend: בדיקת החזרת נתונים נכונים
- Frontend: בדיקת סינון לפי קבוצה מגישה
- Frontend: בדיקת הצגת נתונים

---

## חוקים עסקיים (Business Rules) - יישום טכני

### BR-1: ניהול סוגי שדות
**Sub-Task: יישום לוגיקת שדות**

**Frontend:**
- קומפוננטה `FieldEditor` עם בחירת סוג
- Conditional rendering לפי סוג השדה
- קריטריון: `required` מושבת (תמיד true), `weight` חייב > 0
- פידבק: `weight` readonly (תמיד 0), `required` ניתן לשינוי

**Backend:**
- פונקציית ולידציה: `validateFields(fields: Field[])`
- בדיקות:
  - כל שדה עם `weight > 0` חייב להיות `type=scale` ו-`required=true`
  - כל שדה עם `weight = 0` הוא פידבק
  - סכום משקלות הקריטריונים = 100%
  - לפחות קריטריון אחד
- הפעלה ב-`POST /PUT /api/assignments`

**Unit Tests:**
- Backend: בדיקת כל כלל ולידציה בנפרד
- Backend: בדיקת דחיית משימה ללא קריטריונים
- Backend: בדיקת דחיית סכום משקלות שגוי
- Frontend: בדיקת UI - קריטריון תמיד חובה
- Frontend: בדיקת UI - פידבק תמיד משקל 0

---

### BR-2: אכיפת דדליין
**Sub-Task: יישום בדיקת דדליין**

**Frontend:**
- בעת טעינת משימה: `new Date(assignment.deadline) < new Date()`
- אם עבר deadline: הצגת הודעה, השבתת טופס
- UI: תצוגה ויזואלית של משימות שנסגרו

**Backend:**
- פונקציה: `isDeadlinePassed(deadline: Date): boolean`
- קריאה ב-`POST /api/submissions`:
  ```javascript
  if (isDeadlinePassed(assignment.deadline)) {
    return res.status(403).json({ error: 'Deadline has passed' });
  }
  ```

**Unit Tests:**
- Backend: בדיקת דחיית הגשה אחרי deadline
- Backend: בדיקת הגשה מוצלחת לפני deadline
- Frontend: בדיקת הצגת הודעה נכונה
- Frontend: בדיקת השבתת כפתור הגשה
- Integration: בדיקת תרחיש מלא עם deadline

---

## סיכום טכנולוגיות ואדריכלות

### Stack:
**Frontend:**
- React 18+ עם TypeScript
- State Management: Context API / Zustand
- UI: Tailwind CSS + shadcn/ui
- Forms: React Hook Form + Zod
- HTTP Client: Axios / Fetch API
- Excel Export: xlsx / exceljs

**Backend:**
- Node.js + Express.js
- TypeScript
- Database: PostgreSQL / MongoDB
- ORM: Prisma / Mongoose
- Authentication: JWT
- Validation: Joi / Zod
- Testing: Jest + Supertest

**Testing:**
- Unit Tests: Jest
- Integration Tests: Jest + Supertest
- E2E Tests: Playwright / Cypress (אופציונלי)

---

## הערות ליישום:

1. **Authentication:** כל endpoint דורש JWT token בheader
2. **Authorization:** בדיקת הרשאות לפי role (staff/student)
3. **Error Handling:** יישום middleware מרכזי לטיפול בשגיאות
4. **Validation:** שימוש בספרייה (Joi/Zod) בכל endpoint
5. **Logging:** רישום כל הפעולות (Winston/Pino)
6. **Rate Limiting:** הגבלת קריאות API (express-rate-limit)
7. **CORS:** הגדרת CORS נכונה לפיתוח וייצור
8. **Environment Variables:** שימוש ב-.env לקונפיגורציה

---

## Timeline משוער (בימי עבודה):

- **Epic Setup + Infrastructure:** 3 ימים
- **User Story 1 (ניהול משימות):** 5 ימים
- **User Story 2 (ניהול קורסים):** 3 ימים
- **User Story 3 (ניהול קבוצות):** 3 ימים
- **User Story 4 (סיכום ביקורות):** 4 ימים
- **User Story 5 (הגשת ביקורת):** 4 ימים
- **User Story 6 (צפייה בביקורות שהגשתי):** 2 ימים
- **User Story 7 (צפייה בביקורות עליי):** 2 ימים
- **Testing + Bug Fixes:** 4 ימים
- **סה"כ:** ~30 ימי עבודה (6 שבועות)
