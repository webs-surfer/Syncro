System Flow
UI (Next.js)
 → Server Actions / API Routes
 → Service Layer (Business Logic)
 → Prisma ORM
 → PostgreSQL
Directory Structure
src/
 ├── app/
 ├── components/
 ├── hooks/
 ├── lib/
 ├── services/
 ├── modules/
 ├── types/
prisma/
public/
docs/
Architectural Rules
UI must not contain business logic
Services layer is single source of truth
Modules define feature boundaries
DB access only via services