import { NextResponse } from 'next/server';

export async function POST() {
  // TODO: Implement auth endpoint (Clerk webhook handler)
  return NextResponse.json({ message: 'Auth endpoint - not implemented' }, { status: 501 });
}
