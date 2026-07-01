import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { TaskService } from "@/services/task.service";
import { ProjectService } from "@/services/project.service";

// ── GET /api/v1/tasks ─────────────────────────────────────────────────────────
//
// Returns all tasks assigned to or created by the authenticated user.
//
// Optional query param:
//   ?projectId=<id>   → filter tasks to a specific project (user must be a member)
//
// Response 200:
//   { success: true, tasks: Task[] }
//
// Response 401:
//   { error: "Unauthorized" }

export async function GET(request: Request) {
  try {
    // ── 1. Authenticate ───────────────────────────────────────────────────────
    const user = await AuthService.getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── 2. Optional project filter ────────────────────────────────────────────
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    let tasks;

    if (projectId) {
      // Confirm the user is actually a member of this project before returning
      const membership = await ProjectService.isUserAlreadyMember(
        projectId,
        user.id,
      );

      if (!membership) {
        return NextResponse.json(
          { error: "Forbidden — you are not a member of this project" },
          { status: 403 },
        );
      }

      tasks = await TaskService.getByProjectId(projectId);
    } else {
      // No filter — return all tasks for this user across all projects.
      tasks = await TaskService.getAllTasksByUserId(user.id);
    }

    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    console.error("TASK GET ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

// ── POST /api/v1/tasks ────────────────────────────────────────────────────────
//
// Create a new task.  The authenticated user becomes the task creator.
//
// Request body (JSON):
//   {
//     "title":       string   (required)
//     "description": string   (optional)
//     "projectId":   string   (required)
//     "status":      "todo" | "in_progress" | "done"  (optional, default: "todo")
//     "assigneeId":  string   (optional — must be a project member)
//     "dueDate":     ISO-8601 string  (optional)
//   }
//
// Response 201:
//   { success: true, task: Task }
//
// Response 400:
//   { error: "..." }    missing required fields
//
// Response 401:
//   { error: "Unauthorized" }
//
// Response 403:
//   { error: "Forbidden" }    user is not a project member

export async function POST(request: Request) {
  try {
    // ── 1. Authenticate ───────────────────────────────────────────────────────
    const user = await AuthService.getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── 2. Parse + validate body ──────────────────────────────────────────────
    const body = await request.json();
    const { title, description, projectId, status, assigneeId, dueDate } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "title is required and must be a non-empty string" },
        { status: 400 },
      );
    }

    if (!projectId || typeof projectId !== "string") {
      return NextResponse.json(
        { error: "projectId is required" },
        { status: 400 },
      );
    }

    // ── 3. Authorise — user must be a project member ──────────────────────────
    const membership = await ProjectService.isUserAlreadyMember(
      projectId,
      user.id,
    );


    if (!membership) {
      return NextResponse.json(
        { error: "Forbidden — you are not a member of this project" },
        { status: 403 },
      );
    }

    // if user is Admin/Owner of project 
    const isAdmin = await ProjectService.isUserAdmin(projectId, user.id);
    const isOwner = await ProjectService.isUserOwner(projectId, user.id);
    if(!isAdmin && !isOwner){
      return NextResponse.json(
        { error: "Forbidden — you are not an Admin of this project" },
        { status: 403 },
      );
    }

    //── 4. Authorise ─ AssigneeId must be a project member ──────────────────────
    const assigneeMembership = await ProjectService.isUserAlreadyMember(
      projectId,
      assigneeId,
    );
    if (assigneeId && !assigneeMembership) {
      return NextResponse.json(
        { error: "Assignee must be a member of the project" },
        { status: 400 },
      );
    }

    // parsed DueDate validation
    let parsedDueDate: Date | undefined;

    if (dueDate) {
      const date = new Date(dueDate);

      if (isNaN(date.getTime())) {
        return NextResponse.json(
          { error: "Invalid due date" },
          { status: 400 },
        );
      }

      // Set to end of the selected day
      date.setHours(23, 59, 59, 999);

      parsedDueDate = date;
    }

    // ── 5. Create task ────────────────────────────────────────────────────────
    const task = await TaskService.create({
      title: title.trim(),
      description: description?.trim() || undefined,
      status: (status?.toUpperCase() as any) || "TODO",
      projectId,
      createdById: user.id,
      assigneeId: assigneeId || undefined,
      dueDate: parsedDueDate || undefined,
    });

    return NextResponse.json({ success: true, task }, { status: 201 });
  } catch (error) {
    console.error("TASK CREATE ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
