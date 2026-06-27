Collaborative Project Management System

A modern, collaborative software management platform inspired by tools like Jira, built with a production-oriented architecture and modern full-stack technologies. The project focuses on scalable backend design, authentication, authorization, and collaborative project/task management rather than being a simple CRUD application.

🚀 Current Progress
✅ Authentication
Clerk Authentication
JWT-based API authentication for Postman
User synchronization from Clerk to PostgreSQL
Centralized AuthService for retrieving authenticated users
✅ Database
PostgreSQL (Neon)
Prisma ORM
Relational database design
Database transactions for atomic operations
✅ Project Management
Create Project
Generate unique invite code for every project
Automatically assign creator as OWNER
Fetch only projects the authenticated user is a member of
🏗 Current Architecture
Client
   │
   ▼
API Routes
   │
   ▼
Auth Service
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
│   └── api/
│       └── v1/
├── services/
│   ├── auth.service.ts
│   └── project.service.ts
├── lib/
│   └── prisma.ts
├── types/
└── prisma/
🛠 Tech Stack
Frontend
Next.js 15
React 19
TypeScript
Tailwind CSS
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
├── createdAt
└── updatedAt
ProjectMember
ProjectMember
├── id
├── projectId
├── userId
├── role
└── joinedAt

Role:

OWNER
ADMIN
MEMBER
Relationships
User
   │
   │
   ▼
ProjectMember
   ▲
   │
Project

A project can have multiple members.

A user can belong to multiple projects.

✅ Implemented APIs
Create Project
POST /api/v1/projects

Creates a new project and automatically assigns the creator as OWNER.

Get User Projects
GET /api/v1/projects

Returns only the projects where the authenticated user is a member.

Authentication Flow
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
Project Creation Flow
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
Create OWNER Membership
        │
        ▼
Commit Transaction
Current Features
Secure authentication
Role-based project ownership
Transactional project creation
Member-based project access
Layered backend architecture
Service-based business logic
Prisma ORM integration
PostgreSQL relational database
Upcoming Features
Project
Edit Project
Delete Project
Invite Members
Join via Invite Link
Task Management
Create Task
Update Task
Delete Task
Task Status
Due Dates
Task Assignment
Labels
Priority
Comments
Attachments
Dashboard
Project Overview
Task Analytics
Recent Activity
Productivity Charts
Collaboration
Multiple Admins
Member Permissions
Activity Logs
Real-time Updates
Notifications
Task Assignment Notifications
Deadline Reminders
Project Invitations
Architecture Principles
Layered Architecture
Service-Oriented Design
Separation of Concerns
Centralized Authentication
Transaction-Based Database Operations
Role-Based Authorization
Scalable Code Structure
Current Development Status
Module	Status
Authentication	✅ Complete
Database Setup	✅ Complete
User Sync	✅ Complete
Project Creation	✅ Complete
Project Membership	✅ Complete
Fetch User Projects	✅ Complete
Task Module	🚧 In Progress
Collaboration	⏳ Planned
Dashboard Analytics	⏳ Planned
Notifications	⏳ Planned
🎯 Goal

Build a production-grade collaborative project management platform that demonstrates real-world software engineering practices—including authentication, authorization, relational database design, scalable architecture, and collaborative workflows—using a modern TypeScript and Next.js stack. This project is being developed with a focus on placement readiness and showcasing industry-relevant engineering skills rather than replicating a basic tutorial application.