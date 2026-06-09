# Project Progress & Execution Memory

---

## 1. Purpose of This Page

This page is the single source of truth for execution state.

It is continuously updated by the AI agent after:
- completing tasks
- starting new tasks
- discovering blockers
- changing priorities

It behaves like a living project dashboard + task memory system.

---

## 2. Current System Status (Auto-Updated Snapshot)

| Field | Value |
|---|---|
| Current Phase | Build |
| Active Module | Infrastructure & Auth |
| System Health | On Track |
| Last Updated | Post architecture decisions session |

---

## 3. Locked Architecture Decisions (IMMUTABLE)

These decisions were confirmed by the user and must not be changed without explicit instruction.

| Decision | Chosen Option | Impact |
|---|---|---|
| Database provider | Supabase (PostgreSQL) | Supabase SDK + Prisma both used |
| Multi-tenancy model | Schema-per-tenant | Prisma requires dynamic schema switching via `prisma.$executeRaw` or tenant-aware client factory |
| RBAC model | Per-workspace roles (owner, editor, viewer) | `WorkspaceMember` join table with `role` enum — NOT global user role |
| Kanban drag-drop | dnd-kit | Install: `@dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities` |
| Task workflow states | Simple: Todo → In Progress → Done | `TaskStatus` enum with 3 values only |
| Billing | None at launch | No Stripe, no plan gating |
| Realtime | Supabase Realtime | Use Supabase client subscriptions for live board updates |
| File attachments | None at launch | No upload infra needed for tasks/comments |
| Notifications | None at launch | No email, no Slack, no in-app system |
| Avatar uploads | Custom upload + crop | Supabase Storage bucket for avatars; cropping UI required |

---

## 4. Task State Machine (STRICT FORMAT)

Every task MUST be in one of these states:

- ⬜ BACKLOG → Not started
- 🟡 IN PROGRESS → Currently being worked on
- 🟢 COMPLETED → Finished and verified
- 🔴 BLOCKED → Cannot proceed due to dependency

---

## 5. Active Task Board (AI-Maintained)

| Task | Module | Status | Notes |
|---|---|---|---|
| Initialize Next.js project skeleton & setup structure | Core | 🟢 COMPLETED | Project initialized at root with TS + Tailwind CSS v4 |
| Define initial Prisma database schema | Core | 🟢 COMPLETED | Wrote User, Tenant, Workspace, Project, Task models |
| Define TypeScript types & Service layer stubs | Core | 🟢 COMPLETED | Initial types and services skeleton generated |
| Establish API v1 endpoint stubs & layouts | Core | 🟢 COMPLETED | Auth, projects, tasks, tenants API and page routes setup |
| Revise Prisma schema for schema-per-tenant architecture | Core | ⬜ BACKLOG | Schema must support dynamic tenant schemas — existing schema needs revision |
| Configure Supabase project & connection strings | Infra | ⬜ BACKLOG | Needs Supabase project URL + anon key + service role key in `.env` |
| Build tenant-aware Prisma client factory | Infra | ⬜ BACKLOG | Dynamic schema switching: `prisma.$executeRaw('SET search_path TO tenant_xyz')` |
| Build auth system (Clerk integration) | Auth | ⬜ BACKLOG | Needs Clerk API key config; middleware + server actions |
| Clerk webhook → Supabase user sync | Auth | ⬜ BACKLOG | On user.created event, provision tenant schema + seed default workspace |
| WorkspaceMember model + per-workspace RBAC | Workspace | ⬜ BACKLOG | `WorkspaceMember` join table: userId, workspaceId, role (owner/editor/viewer) |
| Workspace creation & membership system | Workspace | ⬜ BACKLOG | Requires Clerk + DB connection live |
| Project creation & settings module | Project | ⬜ BACKLOG | Requires workspace module complete |
| Task CRUD operations (Todo / In Progress / Done) | Tasks | ⬜ BACKLOG | 3-state `TaskStatus` enum; server actions for create/update/delete/reorder |
| Kanban board UI with dnd-kit | Tasks | ⬜ BACKLOG | `@dnd-kit/core` + `@dnd-kit/sortable`; optimistic updates via TanStack Query |
| Supabase Realtime subscription for board updates | Tasks | ⬜ BACKLOG | Subscribe to task table changes per workspace; update Kanban state live |
| Avatar upload + crop UI | Profile | ⬜ BACKLOG | Supabase Storage bucket; crop library (e.g. `react-image-crop`) |

---

## 6. Completed Work Log (Immutable History)

Once marked COMPLETED, entries are NEVER edited — only appended.

- ✅ System architecture finalized
- ✅ Tech stack finalized
- ✅ Directory structure defined
- ✅ Next.js 15 app skeleton initialized with TypeScript & Tailwind CSS v4 at workspace root
- ✅ Prisma schema created with PostgreSQL connector and core entities defined
- ✅ Domain model TypeScript definitions & Service layer stubs created
- ✅ API v1 REST route stubs and dashboard layouts established
- ✅ All 10 architecture decisions locked and confirmed by user (DB, tenancy, RBAC, DnD, workflow, billing, realtime, files, notifications, avatars)

---

## 7. Blockers & Dependency Tracker

| Blocker | Owner | Impact | Status |
|---|---|---|---|
| Supabase project URL + keys not yet in `.env` | User | 🔴 HIGH — blocks all DB work | ❌ Open |
| Clerk API keys not yet configured | User | 🔴 HIGH — blocks all auth work | ❌ Open |
| ~~Avatar cropping UX approval pending~~ | ~~User~~ | ~~Low~~ | ✅ Resolved — custom upload + crop confirmed |
| ~~Task drag-drop library selection pending~~ | ~~User~~ | ~~Medium~~ | ✅ Resolved — dnd-kit confirmed |

---

## 8. Next Execution Queue (AI PRIORITY ORDER)

Ordered by: dependency readiness → impact on system completion → module dependencies.

1. **Revise Prisma schema** — update to support schema-per-tenant (add `WorkspaceMember` with role enum, revise `Task` status enum to 3 states)
2. **Configure Supabase + `.env` setup** — connection string, anon key, service role key, Storage bucket for avatars
3. **Build tenant-aware Prisma client factory** — dynamic `search_path` switching per tenant schema
4. **Clerk auth integration** — middleware, sign-in/sign-up pages, server actions
5. **Clerk webhook → tenant provisioning** — on `user.created`, create tenant schema + seed default workspace
6. **WorkspaceMember RBAC system** — join table + role-gated server action guards
7. **Workspace creation & membership UI**
8. **Project creation & settings module**
9. **Task CRUD + 3-state workflow engine**
10. **Kanban board UI** — dnd-kit columns (Todo / In Progress / Done) + optimistic updates
11. **Supabase Realtime** — live board subscriptions per workspace
12. **Avatar upload + crop** — Supabase Storage + `react-image-crop`

---

## 9. AI Update Rules (CRITICAL)

**Mandatory Actions:**
- Update task status immediately after completion
- Move tasks between sections (Backlog → In Progress → Completed)
- Never delete history from Completed Work Log
- Re-evaluate Next Execution Queue after each change

**Forbidden Actions:**
- No vague status updates (e.g. "almost done" ❌)
- No skipping task states
- No rewriting completed history
- No unordered task lists

---

## 10. AI Progress Reporting Format

```
📊 CURRENT PROGRESS UPDATE

Completed:
- Task X (Module Y)

In Progress:
- Task A (Status: 60%)

Blocked:
- Task B (Reason: dependency missing)

Next Step:
- Task C
```