import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const token = process.env.LOG_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'Token is not available' }, { status: 400 });
  }
  return NextResponse.json({ token });
}
