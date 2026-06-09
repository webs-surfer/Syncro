import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // TODO: Implement tenant usage via TenantService
  return NextResponse.json(
    { data: null, message: `Usage for tenant ${id} - not implemented` },
    { status: 501 }
  );
}
