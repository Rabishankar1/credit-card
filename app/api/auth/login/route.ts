import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // 🔐 Hardcoded credentials
  if (username === 'abc@bank.com' && password === 'approver@123') {
    return NextResponse.json({
      success: true,
      role: 'APPROVER',
    });
  }

  return NextResponse.json(
    {
      success: false,
      message: 'Invalid username or password',
    },
    { status: 401 }
  );
}