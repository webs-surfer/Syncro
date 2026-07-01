import { AuthService } from "@/services/auth.service";
import { ProjectService } from "@/services/project.service";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
        return NextResponse.json({ error: "Forbidden — you are not a member of this project" }, { status: 403 });
    }
    const members = await ProjectService.getProjectMembers(id);
    return NextResponse.json({ success: true, project, members });
}
