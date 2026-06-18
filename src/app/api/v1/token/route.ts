import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { getToken } = await auth();

  const token = await getToken({
    template: "postman",
  });

  return NextResponse.json({ token });
}