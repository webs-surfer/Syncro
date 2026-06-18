import { NextResponse } from "next/server";

import { verifyToken } from "@clerk/backend";

import prisma from "@/lib/prisma";
import { ProjectService } from "@/services/project.service";

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json();
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    const clerkUserId = payload.sub;

    if (!clerkUserId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: {
        clerkId: clerkUserId,
      },
    });
    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 },
      );
    }
    const project = await ProjectService.create({
      name: name,
      description: description,
      ownerId: user.id,
    });
    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("PROJECT CREATE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
