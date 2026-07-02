Collaborative Project Management System

A modern collaborative project management platform inspired by tools like Jira, built with a production-oriented architecture and modern full-stack technologies. The project focuses on scalable backend architecture, authentication, authorization, and collaborative workflows rather than being a simple CRUD application.

🚀 Current Progress
✅ Authentication
Clerk Authentication
JWT-based API authentication
User synchronization from Clerk to PostgreSQL
Centralized AuthService
Protected API routes
✅ Database
PostgreSQL (Neon)
Prisma ORM
Relational database design
Database transactions
Optimized entity relationships
✅ Project Management
Create Project
Update Project
Delete Project
Generate unique invite code
Join Project using invite code
Fetch authenticated user's projects
Fetch project details
Fetch project members
Role-based project membership
✅ Task Management
Create Task
Fetch Tasks
Update Task
Delete Task
Assign tasks to project members
Due date support
Task status management
Project-based authorization
🚧 Frontend
Authentication screens
Dashboard layout
Project pages
Task pages
Backend integration in progress
Replacing mock data with live APIs
🏗 Architecture
Client
   │
   ▼
API Routes
   │
   ▼
Authentication Layer
   │
   ▼
Business Services
   │
   ▼
Prisma ORM
   │
   ▼
PostgreSQL
📂 Project Structure
src/
├── app/
│   ├── api/
│   │   └── v1/
│   ├── dashboard/
│   ├── projects/
│   ├── tasks/
│   └── join/
│
├── services/
│   ├── auth.service.ts
│   ├── project.service.ts
│   └── task.service.ts
│
├── lib/
│   └── prisma.ts
│
├── types/
│
└── prisma/
🛠 Tech Stack
Frontend
Next.js 15
React 19
TypeScript
Tailwind CSS
shadcn/ui
Backend
Next.js Route Handlers
TypeScript
Prisma ORM
Database
PostgreSQL (Neon)
Authentication
Clerk
JWT Verification
Development
Postman
Prisma Studio
Git & GitHub
🗄 Database Design
User
User
├── id
├── clerkId
├── email
├── name
└── imageUrl
Project
Project
├── id
├── name
├── description
├── inviteCode
├── status
├── createdAt
└── updatedAt
ProjectMember
ProjectMember
├── id
├── projectId
├── userId
├── role
└── joinedAt
Task
Task
├── id
├── title
├── description
├── status
├── dueDate
├── projectId
├── createdById
├── assigneeId
├── order
├── createdAt
└── updatedAt
👥 Roles
OWNER
ADMIN
MEMBER
🔗 Relationships
User
 │
 │
 ▼
ProjectMember
 ▲
 │
Project
 │
 ▼
Task
A user can belong to multiple projects.
A project can have multiple members.
A project contains multiple tasks.
A task belongs to one project.
A task has one creator.
A task can have one assignee.
✅ Implemented APIs
Authentication
Clerk Authentication
JWT Verification
Get Current User
Projects
POST   /api/v1/projects
GET    /api/v1/projects
GET    /api/v1/projects/:id
PATCH  /api/v1/projects/:id
DELETE /api/v1/projects/:id
Project Membership
POST /api/v1/projects/join/:inviteCode
GET  /api/v1/projects/:id/members
Tasks
POST   /api/v1/tasks
GET    /api/v1/tasks
PATCH  /api/v1/tasks/:id
DELETE /api/v1/tasks/:id
🔐 Authentication Flow
User Login
      │
      ▼
Clerk Authentication
      │
      ▼
JWT Verification
      │
      ▼
Database User
      │
      ▼
Authorized API Request
📁 Project Creation Flow
Authenticate User
        │
        ▼
Verify JWT
        │
        ▼
Find Database User
        │
        ▼
Create Project
        │
        ▼
Generate Invite Code
        │
        ▼
Create OWNER Membership
        │
        ▼
Commit Transaction
🤝 Project Join Flow
User Opens Invite Link
        │
        ▼
Authenticate
        │
        ▼
Validate Invite Code
        │
        ▼
Check Existing Membership
        │
        ▼
Create MEMBER Record
        │
        ▼
Join Project
📋 Task Creation Flow
Authenticate User
        │
        ▼
Validate Request
        │
        ▼
Verify Project Membership
        │
        ▼
Create Task
        │
        ▼
Assign Member
        │
        ▼
Return Task
Current Features
Secure authentication
Role-based authorization
Invite-based collaboration
Project CRUD
Project membership management
Complete Task CRUD
Task assignment
Due date management
Transactional database operations
Layered architecture
Service-based business logic
RESTful APIs
Prisma ORM integration
PostgreSQL relational database
🚀 Upcoming Features
Dashboard
Project analytics
Task statistics
Productivity insights
Collaboration
Member role management
Activity logs
Tasks
Priority
Comments
Attachments
Real-time
Live collaboration
Notifications
Deadline reminders
🏛 Architecture Principles
Layered Architecture
Service-Oriented Design
Separation of Concerns
Centralized Authentication
Transaction-Based Database Operations
Role-Based Authorization
RESTful API Design
Modular Code Structure
📈 Current Development Status
Module	Status
Authentication	✅ Complete
Database Design	✅ Complete
User Synchronization	✅ Complete
Project CRUD	✅ Complete
Project Membership	✅ Complete
Invite System	✅ Complete
Task CRUD	✅ Complete
Authorization	✅ Complete
Frontend Integration	🚧 In Progress
Dashboard	⏳ Planned
Activity Logs	⏳ Planned
Notifications	⏳ Planned
Real-time Collaboration	⏳ Planned
🎯 Goal

Build a production-grade collaborative project management platform that demonstrates real-world software engineering practices, including secure authentication, role-based authorization, relational database design, scalable backend architecture, and collaborative task management using a modern TypeScript and Next.js stack. The project is being developed to showcase industry-relevant engineering skills and production-oriented software design for placement preparation.