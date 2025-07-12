<table>
<tr>
<td>

### English

# Goals Manager

Personal goals manager built with Node.js and Angular

## Features

- Homepage lists root public goals.
- Dashboard for goals CRUD operations.
- Reorder private goals.
- Nest goals.
- Login and register.
- Hash passwords.

## Constraints

- Prevent nesting deeper than 2 levels (at both client and server).
- Prevent cyclic nesting.
- Deleting a goal deletes its descendants.
- Setting a goal public sets its descendants.
- Goal can be reordered only under its parent.

## Getting Started

### Prerequisites

- Node.js >= 18.x  
- Angular  
- PostgreSQL

### Deployment

- Create a PostgreSQL database.
- Configure db connection in `Goals\goals.server\.env`.
- Go to `Goals\goals.client`.
- Run: `g build --output-path=../goals.server/public`
- Go to `Goals\goals.server`.
- Run: `npm run start` (server runs on `localhost:3000`)

### How to use the app

- Register and login.
- Add, edit, or delete goals.
- Reorder by drag-and-drop.
- Nest goals under others by drag-and-drop.
- Make a goal public.

## Known Bugs & Limitations

- No input validation in dashboard.
- No DB transactions implemented.
- Cannot nest & reorder simultaneously.
- Cannot un-nest sub-goals.

## Further Improvements

- Add DB transactions.

</td>
<td>

### العربية

<div dir="rtl">

# مدير الأهداف

تطبيق لإدارة الأهداف الشخصية مبني باستخدام Node.js و Angular

## الميزات

- الصفحة الرئيسية تعرض الأهداف العامة الجذرية.
- لوحة تحكم لإجراء عمليات CRUD على الأهداف.
- إعادة ترتيب الأهداف الخاصة.
- إمكانية توشيح الأهداف.
- تسجيل الدخول وإنشاء حساب.
- تشفير كلمات المرور.

## القيود

- منع التوشيح بأكثر من مستويين (في العميل والخادم).
- منع التوشيح الدائري.
- حذف هدف يؤدي لحذف الأهداف التابعة له.
- جعل هدف عامًا يجعل الأهداف التابعة له كذلك.
- يمكن إعادة الترتيب فقط تحت نفس الهدف الأب.

## البدء باستخدام التطبيق

### المتطلبات

- Node.js >= 18.x  
- Angular  
- PostgreSQL

### النشر

- أنشئ قاعدة بيانات PostgreSQL.
- اضبط الإعدادات في `Goals\goals.server\.env`.
- اذهب إلى `Goals\goals.client`.
- نفّذ: `g build --output-path=../goals.server/public`
- اذهب إلى `Goals\goals.server`.
- نفّذ: `npm run start` (الخادم على `localhost:3000`)

### كيفية الاستخدام

- سجل حسابًا جديدًا وسجّل الدخول.
- أضف أو عدّل أو احذف أهدافًا.
- أعد الترتيب بالسحب والإفلات.
- قم بتوشيح الأهداف داخل أهداف أخرى.
- اجعل الهدف عامًا.

## الأخطاء والمحددات

- لا تحقق من المدخلات في لوحة التحكم.
- لا توجد معاملات قاعدة بيانات.
- لا يمكن التوشيح وإعادة الترتيب معًا.
- لا يمكن إزالة التوشيح.

## تحسينات مستقبلية

- دعم المعاملات في قاعدة البيانات.

</div>

</td>
</tr>
</table>
