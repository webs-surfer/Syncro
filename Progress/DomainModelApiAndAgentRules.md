Domain Glossary
Tenant → Organization unit
Workspace → Team environment
Project → Container of tasks
Task → Unit of work
Workflow → Task lifecycle system
Core Data Models
interface User {
  id: string;
  email: string;
  role: 'admin' | 'member';
  tenantId: string;
}
API Structure

Base: /api/v1

Endpoint	Method	Purpose
/auth/login	POST	Login
/auth/register	POST	Register
/projects	CRUD	Project system
/tasks	CRUD	Task system
/tenants/:id/usage	GET	Analytics
AI Agent Behavior Rules
Role

Principal Software Architect

Operational Rules
Always check existing modules before creating new logic
Prefer reuse over duplication
Do not create new patterns if existing ones exist
Stop execution if more than 3 files are affected
Communication Rules
No fluff or filler text
No explanations unless requested
Provide production-ready outputs only
No pseudo-code in final responses
Architecture Discipline
UI layer must not contain business logic
Services layer is the only source of truth
Modules define feature boundaries
DB logic must be isolated in service layer