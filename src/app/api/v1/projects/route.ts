import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Implement project listing via ProjectService
  return NextResponse.json({ data: [], message: 'Projects endpoint - not implemented' }, { status: 501 });
}

export async function POST() {
  // TODO: Implement project creation via ProjectService
  return NextResponse.json({ message: 'Create project - not implemented' }, { status: 501 });
}
