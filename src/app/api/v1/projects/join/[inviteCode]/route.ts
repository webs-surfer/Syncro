import { AuthService } from "@/services/auth.service";
import { ProjectService } from "@/services/project.service";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ inviteCode: string }> }) {
  try {
    const user = await AuthService.getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { inviteCode } = await params;
    const project = await ProjectService.checkInviteCode(inviteCode);
    if(!project){
      return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
    }
    const existingMembership = await ProjectService.isUserAlreadyMember(project.id, user.id);
    if (existingMembership) {
      return NextResponse.json({ error: "User is already a member of this project" }, { status: 409 });
    }
    const newMember = await ProjectService.addMember(project.id, user.id, "MEMBER");
    return NextResponse.json({ success: true, project: project});
  } catch (error) {
    console.error("PROJECT JOIN ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
