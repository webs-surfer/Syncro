import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Implement task listing via TaskService
  return NextResponse.json({ data: [], message: 'Tasks endpoint - not implemented' }, { status: 501 });
}

export async function POST() {
  // TODO: Implement task creation via TaskService
  return NextResponse.json({ message: 'Create task - not implemented' }, { status: 501 });
}
