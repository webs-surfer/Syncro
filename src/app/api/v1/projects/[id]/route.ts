import { AuthService } from "@/services/auth.service";
import { ProjectService } from "@/services/project.service";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await AuthService.getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const project = await ProjectService.getProjectById(id);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  const isMember = await ProjectService.isUserAlreadyMember(id, user.id);
  if (!isMember) {
    return NextResponse.json(
      { error: "Forbidden — you are not a member of this project" },
      { status: 403 },
    );
  }
  const isAdmin = await ProjectService.isUserAdmin(id, user.id);
  const isOwner = await ProjectService.isUserOwner(id, user.id);
  if (!isAdmin && !isOwner) {
    return NextResponse.json(
      { error: "Forbidden — you are not an Admin of this project" },
      { status: 403 },
    );
  }
  try {
    const body = await request.json();
    const { name, description } = body;
    const updatedProject = await ProjectService.update(id, {
      ...(name !== undefined && { name: String(name).trim() }),
      ...(description !== undefined && {
        description: description === null ? null : description.trim(),
      }),
    });
    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error) {
    console.error("PROJECT UPDATE ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await AuthService.getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } 
  const { id } = await params;
  const project = await ProjectService.getProjectById(id);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  const isMember = await ProjectService.isUserAlreadyMember(id, user.id);
  if (!isMember) {
    return NextResponse.json(
      { error: "Forbidden — you are not a member of this project" },
      { status: 403 },
    );
  }
  const isOwner = await ProjectService.isUserOwner(id, user.id);  
  if(!isOwner) {
    return NextResponse.json(
      { error: "Forbidden — you are not an Owner of this project" },
      { status: 403 },
    );
  }
  try {
    await ProjectService.delete(id);
    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (error) {
    console.error("PROJECT DELETE ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

